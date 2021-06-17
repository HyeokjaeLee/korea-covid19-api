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
var path_1 = __importDefault(require("path"));
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var format_conversion_1 = require("./function/format-conversion");
var region_list_1 = require("./data/region_list");
var receive_data_1 = require("./function/receive-data");
var exp = express_1.default(), covid19Worker = path_1.default.join(__dirname, "./worker.covid19.js"), port = 8080;
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var covid19Data, recentData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, receive_data_1.get_data_from_worker(covid19Worker)];
            case 1:
                covid19Data = _a.sent();
                //서버 시작
                exp.use(cors_1.default());
                exp.listen(process.env.PORT || port, function () {
                    console.log("API hosting started on port " + port);
                });
                //Regions List 라우팅
                exp.get("/", function (req, res) {
                    res.json(region_list_1.regionListData);
                });
                recentData = covid19Data.map(function (aRegionData, index) {
                    var confirmedData = aRegionData.data, regionName = aRegionData.region, recentDataIndex = aRegionData.data.length - 1, path = "/" + regionName;
                    exp.get(path, function (req, res) {
                        var result = confirmedData;
                        var from = req.query.from, to = req.query.to;
                        if (from != undefined) {
                            result = confirmedData.filter(function (data) { return format_conversion_1.date2query_form(data.date) >= Number(from); });
                        }
                        if (to != undefined) {
                            result = confirmedData.filter(function (data) { return format_conversion_1.date2query_form(data.date) <= Number(to); });
                        }
                        res.json(result);
                    });
                    return {
                        region_eng: regionName,
                        region_kor: region_list_1.regionListData[index].kor,
                        data: confirmedData[recentDataIndex],
                    };
                });
                //전 지역 가장 최근 API 제공
                exp.get("/recent", function (req, res) {
                    res.json(recentData);
                });
                //10분 마다 COVID19 정보 갱신
                setInterval(function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, receive_data_1.get_data_from_worker(covid19Worker)];
                            case 1:
                                covid19Data = _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); }, 600000);
                return [2 /*return*/];
        }
    });
}); })();
