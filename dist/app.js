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
const create_data_1 = require("./function/create-data");
function app() {
    return __awaiter(this, void 0, void 0, function* () {
        let regionData = yield (0, create_data_1.create_regionData)();
        const LOCAL_PORT = 8000;
        const exp = (0, express_1.default)(), port = process.env.PORT || LOCAL_PORT, schema = (0, graphql_1.buildSchema)(covid19_schema_1.covid19Schema);
        const ONE_HOURE = 1000 * 60 * 60;
        setInterval(() => __awaiter(this, void 0, void 0, function* () {
            regionData = yield (0, create_data_1.create_regionData)();
        }), ONE_HOURE);
        const root = {
            regionalDataList: (args) => {
                const { region, startDate, endDate, onlyLastDate } = args;
                const isEmptyArgs = !startDate && !endDate && !region && !onlyLastDate;
                if (isEmptyArgs)
                    return regionData;
                else {
                    const _regionData = !region
                        ? (0, fast_copy_1.default)(regionData)
                        : [(0, fast_copy_1.default)(regionData.find((data) => data.regionEng === region))];
                    const _startDate = !startDate ? 0 : startDate;
                    const _endDate = !endDate ? convertDate.date2num(new Date()) : endDate;
                    _regionData.forEach((region) => {
                        let filteredData = region.covid19Data.filter((_covid19) => {
                            const date = convertDate.string2num(_covid19.date);
                            return _startDate <= date && date <= _endDate;
                        });
                        onlyLastDate && (filteredData = filteredData.slice(-1));
                        region.covid19Data = filteredData;
                    });
                    return _regionData;
                }
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