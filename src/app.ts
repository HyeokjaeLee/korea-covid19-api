import express from "express";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
import create_data from "./components/create-data";
import { covid19Schema } from "./schema/covid19-schema";
import { date2query_form } from "./function/convert-format";
import type { RegionalData } from "./types/data-type";
import cors from "cors";
import { Region } from "./schema/region-enum";
const port = process.env.PORT || 8080,
  schema = buildSchema(`
    ${Region}
    type Query {
      regionalDataList(region: Region, startDate: Int, endDate: Int, onlyLastDate: Boolean): [RegionalData]
    }
    ${covid19Schema}
  `);
create_data().then((data) => {
  const update_data = (second: number) => {
      setInterval(() => {
        try {
          console.log(new Date());
          create_data().then((_data) => {
            data = _data;
          });
          console.log("Data Update Successful");
        } catch (e) {
          console.log(`Data update failed : ${e}`);
        }
      }, second * 1000);
    },
    root = {
      regionalDataList: (args: any, context: any, info: any) => {
        let { region, startDate, endDate, onlyLastDate } = args;
        startDate = startDate! ? startDate : 0;
        endDate = endDate! ? endDate : date2query_form(new Date());
        const regionalFilteredDataList = region!
            ? [<RegionalData>data.find((value) => value.regionEng === region)]
            : data,
          //forEach로 covid19Info 객체 수정 시 Deep Copy가 아니기 때문에 상위 Data가 수정됨
          dateFilteredDataList = regionalFilteredDataList.map(
            (regionalFilteredData) => {
              const dateFilteredCovid19DataList =
                regionalFilteredData.covid19DataList.filter((covid19Data) => {
                  const dateNum = date2query_form(covid19Data.date);
                  return dateNum >= startDate && dateNum <= endDate;
                });
              return {
                regionKor: regionalFilteredData.regionKor,
                regionEng: regionalFilteredData.regionEng,
                population: regionalFilteredData.population,
                covid19DataList: dateFilteredCovid19DataList,
              };
            }
          );
        return onlyLastDate === true
          ? dateFilteredDataList.map((dateFilteredData) => ({
              regionKor: dateFilteredData.regionKor,
              regionEng: dateFilteredData.regionEng,
              population: dateFilteredData.population,
              covid19DataList: [
                dateFilteredData.covid19DataList[
                  dateFilteredData.covid19DataList.length - 1
                ],
              ],
            }))
          : dateFilteredDataList;
      },
    },
    exp = express();
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
  update_data(600);
});
