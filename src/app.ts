import express from "express";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
import { covid19Schema } from "./schema/covid19-schema";
import * as convertDate from "./function/convert-date";
import cors from "cors";
import clone from "fast-copy"; //Deep copy 성능이 좋다
import create_regionData from "./function/create-data";
import fs from "fs";
async function app() {
  let regionData: Region.Final[] = JSON.parse(fs.readFileSync("./data/20211125.json", "utf8"));

  const LOCAL_PORT = 8000;
  const exp = express(),
    port = process.env.PORT || LOCAL_PORT,
    schema = buildSchema(covid19Schema);
  (async () => {
    const ONE_HOURE = 1000 * 60 * 60;
    regionData = await create_regionData();
    setInterval(async () => {
      regionData = await create_regionData();
    }, ONE_HOURE);
  })();

  const root = {
    region: (args: Args) => {
      const { name, startDate, endDate, onlyLastDate } = args;
      const isEmptyArgs = !startDate && !endDate && !name && !onlyLastDate;
      if (isEmptyArgs) return regionData;
      else {
        const _regionData = !name
          ? clone(regionData)
          : ([clone(regionData.find((data) => data.nameEng === name))] as typeof regionData);
        const _startDate = !startDate ? 0 : startDate;
        const _endDate = !endDate ? convertDate.date2num(new Date()) : endDate;
        _regionData.forEach((region) => {
          let filteredData = region.covid19.filter((_covid19) => {
            const date = convertDate.string2num(_covid19.date);
            return _startDate <= date && date <= _endDate;
          });
          onlyLastDate && (filteredData = filteredData.slice(-1));
          region.covid19 = filteredData;
        });
        return _regionData;
      }
    },
  };
  exp.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
  exp.use(cors());
  exp.use(
    "/",
    graphqlHTTP({
      schema: schema,
      rootValue: root,
      graphiql: true,
    })
  );
}

app();
