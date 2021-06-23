"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const express_graphql_1 = require("express-graphql");
const graphql_1 = require("graphql");
const express_1 = require("express");
const combine_data_1 = require("../components/combine_data");
const router = express_1.Router(), schema = graphql_1.buildSchema(`
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
`), root = {
    hello: () => "Hello world!",
    covid19: (args, context, info) => __awaiter(void 0, void 0, void 0, function* () {
        const { region, date } = args;
        const test = yield combine_data_1.combine_data();
        return test;
    }),
    persons: (args, context, info) => {
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
router.use("/", express_graphql_1.graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));
module.exports = router;
//# sourceMappingURL=graphql.js.map