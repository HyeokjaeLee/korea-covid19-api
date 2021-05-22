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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCovid19Data = void 0;
var FormatConversion_1 = require("../function/FormatConversion");
var external_data_1 = require("../function/external-data");
var region_list_1 = require("../data/region_list");
var service_key = "LqdHrACABsYGuZOSxYS0G0hMAhheDZCNIPVR1zWxT5SxXvh3XmI9hUUjuzCgmq13GYhdyYgebB94yUVCB59bAg%3D%3D", covid19_api_url = function (service_key, from, to, middle_url) {
    return "http://openapi.data.go.kr/openapi/service/rest/Covid19/" + middle_url + "?serviceKey=" + service_key + "&pageNo=1&numOfRows=1&startCreateDt=" + from + "&endCreateDt=" + to;
}, today = Number(FormatConversion_1.convertDateFormat(new Date(), "")), url = covid19_api_url(service_key, 20200409, today, "getCovid19SidoInfStateJson"), regionArr = region_list_1.regionListData.map(function (data) { return data.eng; }), regionCount = regionArr.length;
var getCovid19Data = function () { return __awaiter(void 0, void 0, void 0, function () {
    var originalCovid19API, RequiredInfo, region_separated_Info, steady_covid19_data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, external_data_1.getXmlAPI2JSON(url)];
            case 1:
                originalCovid19API = _a.sent(), RequiredInfo = originalCovid19API.response.body.items.item, region_separated_Info = (function () {
                    var result = Array.from(Array(regionCount), function () { return new Array(); });
                    RequiredInfo.forEach(function (data) {
                        var regionIndex = regionArr.indexOf(data.gubunEn._text);
                        result[regionIndex].push({
                            date: new Date(data.createDt._text),
                            infected: Number(data.isolIngCnt._text),
                            new_local_infection: Number(data.localOccCnt._text),
                            new_overseas_infection: Number(data.overFlowCnt._text),
                            new_infected: Number(data.incDec._text),
                            death: Number(data.deathCnt._text),
                            recovered: Number(data.isolClearCnt._text),
                            confirmed: Number(data.defCnt._text), //전체 확진자
                        });
                    });
                    return result;
                })();
                steady_covid19_data = (function () {
                    var result = Array.from(Array(regionArr.length), function () { return new Array(); });
                    var _loop_1 = function (regionIndex) {
                        var daysCount = region_separated_Info[regionIndex].length;
                        var aRegionInfo = region_separated_Info[regionIndex].reverse();
                        aRegionInfo.forEach(function (data, index) {
                            var isValidData = index != 0
                                ? data.confirmed >= aRegionInfo[index - 1].confirmed &&
                                    data.recovered >= aRegionInfo[index - 1].recovered &&
                                    data.death >= aRegionInfo[index - 1].death
                                    ? index == daysCount - 1
                                        ? true
                                        : data.confirmed <= aRegionInfo[index + 1].confirmed &&
                                            data.recovered <= aRegionInfo[index + 1].recovered &&
                                            data.death <= aRegionInfo[index + 1].death
                                            ? true
                                            : false
                                    : false
                                : false;
                            if (isValidData)
                                result[regionIndex].push({
                                    date: data.date,
                                    confirmed: {
                                        infected: {
                                            new: {
                                                local: data.new_local_infection,
                                                overseas: data.new_overseas_infection,
                                                total: data.new_infected, //새로운 확진자_getAI,
                                            },
                                            existing: data.infected - data.new_infected,
                                            total: data.infected, //전체 확진자 수
                                        },
                                        recovered: {
                                            new: data.recovered - aRegionInfo[index - 1].recovered,
                                            existing: aRegionInfo[index - 1].recovered,
                                            total: data.recovered, //회복_getAI
                                        },
                                        death: {
                                            new: data.death - aRegionInfo[index - 1].death,
                                            existing: aRegionInfo[index - 1].death,
                                            total: data.death, //사망자_getAI,
                                        },
                                        total: data.confirmed,
                                    },
                                });
                        });
                    };
                    for (var regionIndex = 0; regionIndex < regionCount; regionIndex++) {
                        _loop_1(regionIndex);
                    }
                    console.log(result[1][1].confirmed);
                    return result;
                })();
                /*const detail_Info = ((): Covid19.Final[] => {
                  const result: Covid19.Final[] = [];
                  regionArr.forEach((region, index) => {
                    result.push({ region: region, data: [] });
                  });
                  for (let regionIndex = 0; regionIndex < regionCount; regionIndex++) {
                    result.push({ region: regionArr[regionIndex], data: [] });
                    const aRegionInfo = junckFilteredInfo[regionIndex];
                    const daysCount: number = aRegionInfo.length;
                    for (let dayIndex = 1; dayIndex < daysCount; dayIndex++) {
                      const date: Date = aRegionInfo[dayIndex].date; //날짜
                      const infected_cnt: number = aRegionInfo[dayIndex].infected; //전체 확진자 수
                      const new_infected_cnt: number = aRegionInfo[dayIndex].new_infected; //새로운 확진자_getAI
                      const new_local_infection_cnt: number =
                        aRegionInfo[dayIndex].new_local_infection; //새로운 지역감염으로 인한 확진자
                      const new_overseas_infection_cnt: number =
                        aRegionInfo[dayIndex].new_overseas_infection; //새로운 해외감염으로 인한 확진자
                      const existing_infected_cnt: number = infected_cnt - new_infected_cnt; //기존 확진자
                      const confirmed_cnt: number = aRegionInfo[dayIndex].confirmed; //전체 확진자 수
                      const recovered_cnt: number = aRegionInfo[dayIndex].recovered; //회복_getAI
                      const existing_recovered_cnt = aRegionInfo[dayIndex - 1].recovered;
                      const new_recovered_cnt = recovered_cnt - existing_recovered_cnt;
                      const death_cnt: number = aRegionInfo[dayIndex].death; //사망자_getAI
                      const existing_death_cnt = aRegionInfo[dayIndex - 1].death;
                      const new_death_cnt = death_cnt - existing_death_cnt;
                      result[regionIndex].data.push({
                        date: date,
                        confirmed: {
                          infected: {
                            new: {
                              local: new_local_infection_cnt,
                              overseas: new_overseas_infection_cnt,
                              total: new_infected_cnt,
                            },
                            existing: existing_infected_cnt,
                            total: infected_cnt,
                          },
                          recovered: {
                            new: new_recovered_cnt,
                            existing: existing_recovered_cnt,
                            total: recovered_cnt,
                          },
                          death: {
                            new: new_death_cnt,
                            existing: existing_death_cnt,
                            total: death_cnt,
                          },
                          total: confirmed_cnt,
                        },
                      });
                    }
                  }
                  return result;
                })();
              
                return detail_Info;*/
                return [2 /*return*/, steady_covid19_data];
        }
    });
}); };
exports.getCovid19Data = getCovid19Data;
exports.getCovid19Data();
