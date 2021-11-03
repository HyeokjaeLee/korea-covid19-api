import express from "express";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
import { COVID19 } from "./function/create-covid19-data";
import { covid19Schema } from "./schema/covid19-schema";
import * as convertDate from "./function/convert-date";
import type { RegionalData } from "./types/data-type";
import cors from "cors";
import clone from "fast-copy"; //Deep copy 성능이 좋다

async function app() {
  const covid19 = new COVID19(),
    exp = express(),
    port = process.env.PORT || 8080;
  await covid19.update();
  const schema = buildSchema(covid19Schema);

  /**10분마다 데이터 업데이트*/
  setInterval(() => {
    covid19.update();
  }, 600000);

  const root = {
    regionalDataList: (args: any) => {
      let { region, startDate, endDate, onlyLastDate } = args;
      /**요청 조건이 없는 경우를 제외하곤 Deep copy 후 연산*/
      let regionalDataList: RegionalData[];

      /**args로 들어온 요청데이터에 따른 결과 반환*/
      {
        if (!region && !startDate && !endDate && !onlyLastDate) {
          regionalDataList = covid19.data;
        } else if (!!region) {
          regionalDataList = [
            //강제 타입 지정(enum에 지역 리스트 추가해둠)
            <RegionalData>(
              clone(covid19.data.find((covid19Data) => covid19Data.regionEng === region))
            ),
          ];
        } else {
          regionalDataList = clone(covid19.data);
        }

        if (!!startDate || !!endDate) {
          startDate = startDate! ? startDate : 0;
          endDate = endDate! ? endDate : convertDate.date2num(new Date());
          regionalDataList.forEach((regionalData) => {
            regionalData.covid19DataList = regionalData.covid19DataList.filter((covid19Data) => {
              const numDate = convertDate.string2num(covid19Data.date);
              return numDate >= startDate && numDate <= endDate;
            });
          });
        }

        if (onlyLastDate) {
          regionalDataList.forEach((regionalData) => {
            regionalData.covid19DataList = regionalData.covid19DataList.slice(-1);
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
