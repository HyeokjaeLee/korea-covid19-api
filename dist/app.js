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
const create_COVID19_data_1 = require("./components/create-COVID19-data");
const covid19_schema_1 = require("./schema/covid19-schema");
const convert_format_1 = require("./function/convert-format");
const cors_1 = __importDefault(require("cors"));
const fast_copy_1 = __importDefault(require("fast-copy")); //Deep copy 성능이 좋다
function app() {
    return __awaiter(this, void 0, void 0, function* () {
        const covid19 = new create_COVID19_data_1.COVID19(), exp = express_1.default(), port = process.env.PORT || 8080;
        yield covid19.update();
        const schema = graphql_1.buildSchema(covid19_schema_1.covid19Schema);
        /**10분마다 데이터 업데이트*/
        setInterval(() => {
            covid19.update();
        }, 600000);
        const root = {
            regionalDataList: (args) => {
                let { region, startDate, endDate, onlyLastDate } = args;
                /**요청 조건이 없는 경우를 제외하곤 Deep copy 후 연산*/
                let regionalDataList;
                /**args로 들어온 요청데이터에 따른 결과 반환*/
                {
                    if (!region && !startDate && !endDate && !onlyLastDate) {
                        regionalDataList = covid19.data;
                    }
                    else if (!!region) {
                        regionalDataList = [
                            //강제 타입 지정(enum에 지역 리스트 추가해둠)
                            (fast_copy_1.default(covid19.data.find((covid19Data) => covid19Data.regionEng === region))),
                        ];
                    }
                    else {
                        regionalDataList = fast_copy_1.default(covid19.data);
                    }
                    if (!!startDate || !!endDate) {
                        startDate = startDate ? startDate : 0;
                        endDate = endDate ? endDate : convert_format_1.date2query_form(new Date());
                        regionalDataList.forEach((regionalData) => {
                            regionalData.covid19DataList = regionalData.covid19DataList.filter((covid19Data) => {
                                const numDate = convert_format_1.date2query_form(covid19Data.date);
                                return numDate >= startDate && numDate <= endDate;
                            });
                        });
                    }
                    if (onlyLastDate) {
                        regionalDataList.forEach((regionalData) => {
                            regionalData.covid19DataList =
                                regionalData.covid19DataList.slice(-1);
                        });
                    }
                }
                return regionalDataList;
            },
        };
        exp.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });
        exp.use(cors_1.default());
        exp.use("/", express_graphql_1.graphqlHTTP({
            schema: schema,
            rootValue: root,
            graphiql: true,
        }));
    });
}
app();
//# sourceMappingURL=app.js.map