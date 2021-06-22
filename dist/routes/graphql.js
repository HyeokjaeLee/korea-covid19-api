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
const get_covid19_data_1 = require("../components/get_covid19_data");
const router = express_1.Router(), schema = graphql_1.buildSchema(`
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
    test: Int
  }
`), root = {
    hello: () => "Hello world!",
    confirmed: (args, context, info) => __awaiter(void 0, void 0, void 0, function* () {
        const { region, date } = args;
        return yield get_covid19_data_1.getCovid19Data();
    }),
    persons: (args, context, info) => {
        const { name, age } = args;
        console.log(name);
        console.log(age);
        return [
            { name: "kim", age: 20, test: 32 },
            { name: "lee", age: 30, test: 42 },
            { name: "park", age: 40, test: 55 },
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