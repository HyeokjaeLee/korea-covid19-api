import express from "express";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
import { covid19Schema } from "./schema/covid19-schema";
import * as convertDate from "./function/convert-date";
import cors from "cors";
import clone from "fast-copy"; //Deep copy 성능이 좋다
import { create_regionData } from "./function/classify-data";

async function app() {
  let regionData = await create_regionData();
  const LOCAL_PORT = 8000;
  const exp = express(),
    port = process.env.PORT || LOCAL_PORT,
    schema = buildSchema(covid19Schema);

  const ONE_HOURE = 1000 * 60 * 60;
  setInterval(async () => {
    regionData = await create_regionData();
  }, ONE_HOURE);

  const root = {
    regionalDataList: (args: Args) => {
      const { region, startDate, endDate, onlyLastDate } = args;
      const isEmptyArgs = !startDate && !endDate && !region && !onlyLastDate;
      if (isEmptyArgs) return regionData;
      else {
        const _regionData = !region
          ? clone(regionData)
          : ([clone(regionData.find((data) => data.regionEng === region))] as typeof regionData);
        const _startDate = !startDate ? 0 : startDate;
        const _endDate = !endDate ? convertDate.date2num(new Date()) : endDate;
        _regionData.forEach((region) => {
          let filteredData = region.covid19Data.filter((_covid19) => {
            const date = convertDate.string2num(_covid19.date);
            return _startDate <= date && date <= _endDate;
          });
          onlyLastDate && (filteredData = filteredData.slice(-1));
          region.covid19Data = filteredData;
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
