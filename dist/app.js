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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var express_graphql_1 = require("express-graphql");
var graphql_1 = require("graphql");
var create_COVID19_data_1 = require("./components/create-COVID19-data");
var covid19_schema_1 = require("./schema/covid19-schema");
var convert_format_1 = require("./function/convert-format");
var cors_1 = __importDefault(require("cors"));
var fast_copy_1 = __importDefault(require("fast-copy")); //Deep copy 성능이 좋다
function app() {
    return __awaiter(this, void 0, void 0, function () {
        var covid19, exp, port, schema, root;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    covid19 = new create_COVID19_data_1.COVID19(), exp = express_1.default(), port = process.env.PORT || 8080;
                    return [4 /*yield*/, covid19.update()];
                case 1:
                    _a.sent();
                    schema = graphql_1.buildSchema(covid19_schema_1.covid19Schema);
                    /**10분마다 데이터 업데이트*/
                    setInterval(function () {
                        covid19.update();
                    }, 600000);
                    root = {
                        regionalDataList: function (args) {
                            var region = args.region, startDate = args.startDate, endDate = args.endDate, onlyLastDate = args.onlyLastDate;
                            /**요청 조건이 없는 경우를 제외하곤 Deep copy 후 연산*/
                            var regionalDataList;
                            /**args로 들어온 요청데이터에 따른 결과 반환*/
                            {
                                if (!region && !startDate && !endDate && !onlyLastDate) {
                                    regionalDataList = covid19.data;
                                }
                                else if (!!region) {
                                    regionalDataList = [
                                        //강제 타입 지정(enum에 지역 리스트 추가해둠)
                                        (fast_copy_1.default(covid19.data.find(function (covid19Data) { return covid19Data.regionEng === region; }))),
                                    ];
                                }
                                else {
                                    regionalDataList = fast_copy_1.default(covid19.data);
                                }
                                if (!!startDate || !!endDate) {
                                    startDate = startDate ? startDate : 0;
                                    endDate = endDate ? endDate : convert_format_1.date2query_form(new Date());
                                    regionalDataList.forEach(function (regionalData) {
                                        regionalData.covid19DataList = regionalData.covid19DataList.filter(function (covid19Data) {
                                            var numDate = convert_format_1.date2query_form(covid19Data.date);
                                            return numDate >= startDate && numDate <= endDate;
                                        });
                                    });
                                }
                                if (onlyLastDate) {
                                    regionalDataList.forEach(function (regionalData) {
                                        regionalData.covid19DataList =
                                            regionalData.covid19DataList.slice(-1);
                                    });
                                }
                            }
                            return regionalDataList;
                        },
                    };
                    exp.listen(port, function () {
                        console.log("Server listening on port " + port);
                    });
                    exp.use(cors_1.default());
                    exp.use("/", express_graphql_1.graphqlHTTP({
                        schema: schema,
                        rootValue: root,
                        graphiql: true,
                    }));
                    return [2 /*return*/];
            }
        });
    });
}
app();
//# sourceMappingURL=app.js.map