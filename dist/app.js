"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const covid19_schema_1 = require("./schema/covid19-schema");
const convertDate = __importStar(require("./function/convert-date"));
const cors_1 = __importDefault(require("cors"));
const fast_copy_1 = __importDefault(require("fast-copy")); //Deep copy 성능이 좋다
const classify_data_1 = require("./function/classify-data");
function app() {
    return __awaiter(this, void 0, void 0, function* () {
        const exp = (0, express_1.default)(), port = process.env.PORT || 8080;
        let regionData = yield (0, classify_data_1.update)();
        const schema = (0, graphql_1.buildSchema)(covid19_schema_1.covid19Schema);
        /**10분마다 데이터 업데이트*/
        setInterval(() => __awaiter(this, void 0, void 0, function* () {
            regionData = yield (0, classify_data_1.update)();
        }), 600000);
        const root = {
            regionalDataList: (args) => {
                let { region, startDate, endDate, onlyLastDate } = args;
                /**요청 조건이 없는 경우를 제외하곤 Deep copy 후 연산*/
                let regionalDataList;
                /**args로 들어온 요청데이터에 따른 결과 반환*/
                {
                    if (!region && !startDate && !endDate && !onlyLastDate) {
                        regionalDataList = regionData;
                    }
                    else if (!!region) {
                        regionalDataList = [
                            //강제 타입 지정(enum에 지역 리스트 추가해둠)
                            (0, fast_copy_1.default)(regionData.find((data) => data.regionEng === region)),
                        ];
                    }
                    else {
                        regionalDataList = (0, fast_copy_1.default)(regionData);
                    }
                    if (!!startDate || !!endDate) {
                        startDate = startDate ? startDate : 0;
                        endDate = endDate ? endDate : convertDate.date2num(new Date());
                        regionalDataList.forEach((regionalData) => {
                            regionalData.covid19Data = regionalData.covid19Data.filter((data) => {
                                const numDate = convertDate.string2num(data.date);
                                return numDate >= startDate && numDate <= endDate;
                            });
                        });
                    }
                    if (onlyLastDate) {
                        regionalDataList.forEach((regionalData) => {
                            regionalData.covid19Data = regionalData.covid19Data.slice(-1);
                        });
                    }
                }
                return regionalDataList;
            },
        };
        exp.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });
        exp.use((0, cors_1.default)());
        exp.use("/", (0, express_graphql_1.graphqlHTTP)({
            schema: schema,
            rootValue: root,
            graphiql: true,
        }));
    });
}
app();
//# sourceMappingURL=app.js.map