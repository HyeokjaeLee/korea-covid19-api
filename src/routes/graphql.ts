import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
import { Router } from "express";
import { getCovid19Data } from "../components/get_covid19_data";
const router = Router(),
  schema = buildSchema(`
  scalar Date
  type Query {
    hello: String
    persons(name: String, age: Int): [Person]
    confirmed(region: String, date: Int): [Confirmed]
  }
  type Confirmed {
    region: String
    date: Date
    confirmed: Int
    new_quaranti: Int
    new_local_quarantined: Int
    new_overseas_quaratined: Int
    existing_quarantined: Int
    recovered: Int
    new_recovered: Int
    existing_recovered: Int
    death: Int
    new_death: Int
    existing_death: Int
    
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
    confirmed: async (args: any, context: any, info: any) => {
      const { region, date } = args;
      return await getCovid19Data();
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
