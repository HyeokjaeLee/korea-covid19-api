"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_graphql_1 = require("express-graphql");
const graphql_1 = require("graphql");
const create_data_1 = __importDefault(require("./components/create-data"));
const covid19_schema_1 = require("./schema/covid19-schema");
const convert_format_1 = require("./function/convert-format");
const cors_1 = __importDefault(require("cors"));
const region_enum_1 = require("./schema/region-enum");
const port = process.env.PORT || 8080, schema = graphql_1.buildSchema(`
    ${region_enum_1.Region}
    type Query {
      covid19Info(region: Region, startDate: Int, endDate: Int): [DataSet]
    }
    ${covid19_schema_1.covid19Schema}
  `);
create_data_1.default().then((data) => {
    const update_data = (second) => {
        setInterval(() => {
            try {
                console.log(new Date());
                create_data_1.default().then((_data) => {
                    data = _data;
                });
                console.log("Data Update Successful");
            }
            catch (e) {
                console.log(`Data update failed : ${e}`);
            }
        }, second * 1000);
    }, root = {
        covid19Info: (args, context, info) => {
            let { region, startDate, endDate } = args;
            startDate = startDate ? startDate : 0;
            endDate = endDate ? endDate : convert_format_1.date2query_form(new Date());
            const covid19Info = region
                ? [data.find((value) => value.regionEng === region)]
                : data;
            //forEach로 covid19Info 객체 수정 시 Deep Copy가 아니기 때문에 상위 Data가 수정됨
            const result = covid19Info.map((_covid19Info) => {
                const _covid19 = _covid19Info?.covid19.filter((_covid19) => {
                    const dateNum = convert_format_1.date2query_form(_covid19.date);
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
    }, exp = express_1.default();
    exp.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
    exp.use(cors_1.default());
    exp.use("/", express_graphql_1.graphqlHTTP({
        schema: schema,
        rootValue: root,
        graphiql: true,
    }));
    update_data(600);
});
//# sourceMappingURL=app.js.map