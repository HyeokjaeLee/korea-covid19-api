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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_graphql_1 = require("express-graphql");
const graphql_1 = require("graphql");
const create_data_1 = __importDefault(require("./components/create_data"));
const port = process.env.PORT || 8080;
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    let covid19Data = yield create_data_1.default();
    const schema = graphql_1.buildSchema(`
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
        covid19Info: (args, context, info) => {
            const data = covid19Data;
            const { region, from, to } = args;
            return data;
        },
    };
    const exp = express_1.default();
    exp.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
    exp.use("/", express_graphql_1.graphqlHTTP({
        schema: schema,
        rootValue: root,
        graphiql: true,
    }));
});
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
//# sourceMappingURL=app.js.map