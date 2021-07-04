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
      regionalDataList(region: Region, startDate: Int, endDate: Int, onlyLastDate: Boolean): [RegionalData]
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
        regionalDataList: (args, context, info) => {
            let { region, startDate, endDate, onlyLastDate } = args;
            startDate = startDate ? startDate : 0;
            endDate = endDate ? endDate : convert_format_1.date2query_form(new Date());
            const regionalFilteredDataList = region
                ? [data.find((value) => value.regionEng === region)]
                : data, 
            //forEach로 covid19Info 객체 수정 시 Deep Copy가 아니기 때문에 상위 Data가 수정됨
            dateFilteredDataList = regionalFilteredDataList.map((regionalFilteredData) => {
                const dateFilteredCovid19DataList = regionalFilteredData.covid19DataList.filter((covid19Data) => {
                    const dateNum = convert_format_1.date2query_form(covid19Data.date);
                    return dateNum >= startDate && dateNum <= endDate;
                });
                return {
                    regionKor: regionalFilteredData.regionKor,
                    regionEng: regionalFilteredData.regionEng,
                    population: regionalFilteredData.population,
                    covid19DataList: dateFilteredCovid19DataList,
                };
            });
            return onlyLastDate === true
                ? dateFilteredDataList.map((dateFilteredData) => ({
                    regionKor: dateFilteredData.regionKor,
                    regionEng: dateFilteredData.regionEng,
                    population: dateFilteredData.population,
                    covid19DataList: [
                        dateFilteredData.covid19DataList[dateFilteredData.covid19DataList.length - 1],
                    ],
                }))
                : dateFilteredDataList;
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