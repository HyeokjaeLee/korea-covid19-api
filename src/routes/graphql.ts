import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
import { Router } from "express";
import { combine_data } from "../components/combine_data";
const router = Router(),
  schema = buildSchema(`
  scalar Date
  type Query {
    hello: String
    persons(name: String, age: Int): [Person]
    covid19(region: String, date: Int): [Covid19]
  }
  type Covid19 {
    region_kor: String
    region_eng: String
    date: String
    confirmed_total: Int
    confirmed_accumlated: Int
    quarantine_total: Int
    quarantine_new: Int
    quarantine_new_overseas: Int
    quarantine_new_domestic: Int
    recovered_total: Int
    recovered_new: Int
    recovered_accumlated: Int
    dead_total: Int
    dead_new: Int
    dead_accumlated: Int
    inoculation_1st_total: Int
    inoculation_1st_new: Int
    inoculation_1st_accumulated: Int
    inoculation_2st_total: Int
    inoculation_2st_new: Int
    inoculation_2st_accumulated: Int
    per100000rate: Int
  }

  type Person {
    name: String
    age: Int
    test: Test
  }

    type Test{
    test3:Int
    test4:Int
  }
`),
  root = {
    hello: () => "Hello world!",
    covid19: async (args: any, context: any, info: any) => {
      const { region, date } = args;
      const test = await combine_data();
      return test;
    },
    persons: (args: any, context: any, info: any) => {
      const { name, age } = args;
      console.log(name);
      console.log(age);
      return [
        { name: "kim", age: 20, test: { test4: 3, test3: 2 } },
        { name: "lee", age: 30, test: { test4: 2, test3: 1 } },
        { name: "park", age: 40, test: { test4: 1, test3: 5 } },
      ];
    },
  };
router.use(
  "/",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

export = router;
