import express from "express";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
import { COVID19 } from "./components/create-COVID19-data";
import { covid19Schema } from "./schema/covid19-schema";
import { date2query_form } from "./function/convert-format";
import type { RegionalData } from "./types/data-type";
import cors from "cors";
import clone from "fast-copy";
import { Region } from "./schema/region-enum";

async function app() {
  const covid19 = new COVID19(),
    exp = express(),
    port = process.env.PORT || 8080;
  await covid19.update();
  const schema = buildSchema(`
    ${Region}
    type Query {
      regionalDataList(region: Region, startDate: Int, endDate: Int, onlyLastDate: Boolean): [RegionalData]
    }
    ${covid19Schema}
  `);
  setInterval(() => {
    covid19.update();
  }, 600000);
  const root = {
    regionalDataList: (args: any, context: any, info: any) => {
      let { region, startDate, endDate, onlyLastDate } = args;
      let regionalDataList: RegionalData[];
      {
        if (!region && !startDate && !endDate && !onlyLastDate) {
          regionalDataList = covid19.data;
        } else if (!!region) {
          regionalDataList = [
            <RegionalData>(
              clone(
                covid19.data.find(
                  (covid19Data) => covid19Data.regionEng === region
                )
              )
            ),
          ];
        } else {
          regionalDataList = clone(covid19.data);
        }

        if (!!startDate || !!endDate) {
          startDate = startDate! ? startDate : 0;
          endDate = endDate! ? endDate : date2query_form(new Date());
          regionalDataList.forEach((regionalData) => {
            regionalData.covid19DataList = regionalData.covid19DataList.filter(
              (covid19Data) => {
                const numDate = date2query_form(covid19Data.date);
                return numDate >= startDate && numDate <= endDate;
              }
            );
          });
        }

        if (onlyLastDate) {
          regionalDataList.forEach((regionalData) => {
            regionalData.covid19DataList =
              regionalData.covid19DataList.slice(-1);
          });
        }
      }
      return regionalDataList;
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
