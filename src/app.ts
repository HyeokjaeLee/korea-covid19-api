import express from "express";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
import create_data from "./components/create-data";
import { covid19Schema } from "./schema/covid19-schema";
import { date2query_form } from "./function/convert-format";
import cors from "cors";
import { Region } from "./schema/region-enum";
const port = process.env.PORT || 8080,
  schema = buildSchema(`
    ${Region}
    type Query {
      covid19Info(region: Region, startDate: Int, endDate: Int): [DataSet]
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
      covid19Info: (args: any, context: any, info: any) => {
        let { region, startDate, endDate } = args;
        startDate = startDate! ? startDate : 0;
        endDate = endDate! ? endDate : date2query_form(new Date());
        const covid19Info = region!
          ? [data.find((value) => value.regionEng === region)]
          : data;
        //forEach로 covid19Info 객체 수정 시 Deep Copy가 아니기 때문에 상위 Data가 수정됨
        const result = covid19Info.map((_covid19Info) => {
          const _covid19 = _covid19Info?.covid19.filter((_covid19) => {
            const dateNum = date2query_form(_covid19.date);
            return dateNum >= startDate && dateNum <= endDate;
          });
          return {
            regionKor: _covid19Info?.regionKor,
            regionEng: _covid19Info?.regionEng,
            population: _covid19Info?.population,
            covid19: _covid19,
          };
        });
        return result;
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
