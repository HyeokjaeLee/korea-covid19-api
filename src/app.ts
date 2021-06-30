import express from "express";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
import create_data from "./components/create-data";
import { covid19Schema } from "./schema/covid19-schema";
import { date2query_form } from "./function/convert-format";
const port = process.env.PORT || 8080,
  schema = buildSchema(`
    type Query {
      covid19Info(region: String, startDate: Int, endDate: Int): [DataSet]
      covid19(startDate: Int, endDate: Int): [Covid19]
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
        covid19Info.forEach((_covid19Info) => {
          if (_covid19Info != undefined) {
            _covid19Info.covid19 = _covid19Info.covid19.filter((_covid19) => {
              const dateNum = date2query_form(_covid19.date);
              return dateNum >= startDate && dateNum <= endDate;
            });
          }
        });
        return covid19Info;
      },
      covid19: (args: any, context: any, info: any) => {
        console.log(args);
      },
    },
    exp = express();
  exp.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });

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
