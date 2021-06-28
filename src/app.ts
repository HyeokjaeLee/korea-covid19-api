import express from "express";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
import create_data from "./components/create_data";
const port = process.env.PORT || 8080;
const main = async () => {
  let covid19Data = await create_data();
  const schema = buildSchema(`
    type Query {
      covid19Info(region: String, from: Int, to: Int): [DataSet]
    }

    type DataSet {
      regionEng: String
      regionKor: String
      population: Int
      covid19: [Covid19]
    }

    type Covid19 {
      date: String
      confirmed: Confirmed
      quarantine: Quarantine
      recovered: BasicStructure
      dead: BasicStructure
      vaccination: Vaccination
      per100kConfirmed: Int
    }

    type BasicStructure {
      total: Int
      new: Int
      accumlated: Int
    }

    type Confirmed {
      total: Int
      accumlated: Int
    }

    type Quarantine {
      total: Int
      new: QuarantineNew
    }

    type QuarantineNew {
      total: Int
      domestic: Int
      overseas: Int
    }

    type Vaccination   {
      first: BasicStructure
      second: BasicStructure
    }
  `);

  const root = {
    covid19Info: (args: any, context: any, info: any) => {
      const data = covid19Data;
      const { region, from, to } = args;
      return data;
    },
  };

  const exp = express();
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
};

/*function update_data(second: number): void {
  setInterval(() => {
    try {
      console.log(new Date());
      covid19Data = create_data();
      console.log("Data Update Successful");
    } catch (e) {
      console.log(`Data update failed : ${e}`);
    }
  }, second * 1000);
}*/
main();
