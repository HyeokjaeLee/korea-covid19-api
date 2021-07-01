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
const port = process.env.PORT || 8080, schema = graphql_1.buildSchema(`
    type Query {
      covid19Info(region: String, startDate: Int, endDate: Int): [DataSet]
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
            covid19Info.forEach((_covid19Info) => {
                if (_covid19Info != undefined) {
                    _covid19Info.covid19 = _covid19Info.covid19.filter((_covid19) => {
                        const dateNum = convert_format_1.date2query_form(_covid19.date);
                        return dateNum >= startDate && dateNum <= endDate;
                    });
                }
            });
            return covid19Info;
        },
        covid19: (args, context, info) => {
            console.log(args);
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