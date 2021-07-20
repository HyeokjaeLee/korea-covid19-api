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
exports.COVID19 = void 0;
var get_infection_data_1 = require("./get-infection-data");
var get_vaccination_data_1 = require("./get-vaccination-data");
var region_info_1 = require("../data/region-info");
var convert_format_1 = require("../function/convert-format");
var get_distancing_data_1 = require("./get-distancing-data");
/**소스 데이터의 날짜 형식을 변환
 * @param originalDate 소스 데이터 날짜
 * @returns 가공된 날짜 ex) 2019-01-01
 */
var date_formatter = function (originalDate) {
    return convert_format_1.convert_date_format(new Date(originalDate), "-");
};
/**COVID19 정보 생성을 위한 클래스*/
var COVID19 = /** @class */ (function () {
    function COVID19() {
        var _this = this;
        /**
         * COVID19 관련 지역별 정보 Array
         * - 연산중 값 조회를 방지하기 위해 temp에서 연산이 모두 종료된 후 값이 변경됨
         */
        this.data = [];
        /**실제 연산이 이루어지는 임시 변수*/
        this.temp = [];
        /**동적 영역 초기화*/
        this.init = function () {
            _this.temp = region_info_1.regionInfo.map(function (regionalData) {
                regionalData.distancingLevel = null;
                regionalData.covid19DataList = [];
                return regionalData;
            });
        };
        /**
         * temp 초기화 후 소스 데이터들을 가공해 지역별 COVID19 데이터 생성
         * @param distancingDataList 사회적 거리두기 소스 데이터
         * @param infectionDataList 감염 소스 데이터
         * @param vaccinationDataList 예방접종 소스 데이터
         */
        this.update = function () { return __awaiter(_this, void 0, void 0, function () {
            var sourceData, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        console.log("\n" + new Date());
                        return [4 /*yield*/, COVID19.get_source_data()];
                    case 1:
                        sourceData = _a.sent();
                        this.init();
                        this.classify_by_region(sourceData.infection, sourceData.distancing);
                        this.combine_vaccinationData(sourceData.vaccination);
                        this.create_additionalData();
                        this.data = this.temp;
                        console.log("Data Update Successful");
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _a.sent();
                        console.log("Data update failed: " + err_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
    }
    /**
     * 소스 데이터를 가공하여 지역별로 분류하여 temp에 저장
     * @param infectionDataList 감염 소스 데이터
     * @param distancingDataList 사회적 거리두기 소스 데이터
     */
    COVID19.prototype.classify_by_region = function (infectionSourceDataList, distancingDataList) {
        var _this = this;
        /**
         * 감염과 거리두기 소스 데이터를 기반으로 소단위 기본적 데이터 구조 생성
         * @param infectionSourceData 감염 소스 데이터
         * @returns 감염 소스 데이터 기반 기초 데이터 구조
         */
        var create_basicStructure = function (infectionSourceData) { return ({
            date: date_formatter(infectionSourceData.createDt._text),
            confirmed: {
                total: Number(infectionSourceData.defCnt._text) - 1,
                accumlated: null,
            },
            quarantine: {
                total: Number(infectionSourceData.isolIngCnt._text),
                new: {
                    total: Number(infectionSourceData.incDec._text),
                    domestic: Number(infectionSourceData.localOccCnt._text),
                    overseas: Number(infectionSourceData.overFlowCnt._text),
                },
            },
            recovered: {
                total: Number(infectionSourceData.isolClearCnt._text),
                new: null,
                accumlated: null,
            },
            dead: {
                total: Number(infectionSourceData.deathCnt._text),
                new: null,
                accumlated: null,
            },
            vaccinated: {
                first: {
                    total: null,
                    new: null,
                    accumlated: null,
                },
                second: {
                    total: null,
                    new: null,
                    accumlated: null,
                },
            },
            per100kConfirmed: infectionSourceData.qurRate._text != "-"
                ? Number(infectionSourceData.qurRate._text)
                : null,
            immunityRatio: null,
        }); };
        /** 확진 정보 소스 데이터를 지정한 데이터 구조에 담아 지역별로 구분*/
        infectionSourceDataList.forEach(function (infectionSourceData) {
            var regionIndex = _this.temp.findIndex(function (regionalData) {
                return regionalData.regionEng ==
                    infectionSourceData.gubunEn._text.replace("-", "");
            });
            _this.temp[regionIndex].covid19DataList.push(create_basicStructure(infectionSourceData));
        });
        //루프 최소화를 위해 같이 진행
        this.temp.forEach(function (regionalData) {
            var distancingData = distancingDataList.find(function (distancingData) { return distancingData.region === regionalData.regionKor; });
            //거리두기 정보 추가
            regionalData.distancingLevel =
                distancingData != undefined ? distancingData.distancingLevel : null;
            regionalData.covid19DataList = regionalData.covid19DataList.reverse(); //배열에 넣어둔 날짜가 역순이므로 재배치
        });
    };
    /**
     * 기존 temp에 백신 데이터를 추가하여 저장
     * @param vaccinationSourceDataList 예방접종 소스 데이터
     */
    COVID19.prototype.combine_vaccinationData = function (vaccinationSourceDataList) {
        var _this = this;
        vaccinationSourceDataList.forEach(function (vaccinationSourceData) {
            var regionIndex = _this.temp.findIndex(function (regionalData) {
                return regionalData.regionKorFull === vaccinationSourceData.sido;
            });
            //지역 구분 '기타'는 예방접종 소스 데이터에는 있지만 확진 정보 소스 데이터에는 없으므로 제외
            if (regionIndex != -1) {
                var DateIndex = _this.temp[regionIndex].covid19DataList.findIndex(function (covid19Data) {
                    return covid19Data.date == date_formatter(vaccinationSourceData.baseDate);
                });
                if (DateIndex != -1) {
                    /** 전체 데이터 구조에서 추가할 값들에 쉽게 접근 하기위한 shallow copy*/
                    var covid19Data = _this.temp[regionIndex].covid19DataList[DateIndex], vaccinationData = covid19Data.vaccinated;
                    //예방접종 데이터 추가
                    {
                        vaccinationData.first.total = vaccinationSourceData.totalFirstCnt;
                        vaccinationData.first.new = vaccinationSourceData.firstCnt;
                        vaccinationData.first.accumlated =
                            vaccinationSourceData.accumulatedFirstCnt;
                        vaccinationData.second.total = vaccinationSourceData.totalSecondCnt;
                        vaccinationData.second.new = vaccinationSourceData.secondCnt;
                        vaccinationData.second.accumlated =
                            vaccinationSourceData.accumulatedSecondCnt;
                    }
                    //면역 비율 데이터 추가
                    covid19Data.immunityRatio =
                        Math.round(((vaccinationData.second.total +
                            covid19Data.recovered.total) /
                            _this.temp[regionIndex].population) *
                            1000) / 1000;
                }
            }
        });
    };
    /**
     * temp의 여러 값들을 기반으로 유추가능한 추가적인 데이터 생성 및 추가 저장
     */
    COVID19.prototype.create_additionalData = function () {
        this.temp.forEach(function (regionalData) {
            regionalData.covid19DataList.forEach(function (covid19Data, index) {
                if (index != 0) {
                    var covid19Data_1dayAgo = regionalData.covid19DataList[index - 1];
                    covid19Data.confirmed.accumlated =
                        covid19Data_1dayAgo.confirmed.total;
                    covid19Data.recovered.accumlated =
                        covid19Data_1dayAgo.recovered.total;
                    covid19Data.recovered.new =
                        covid19Data.recovered.total - covid19Data.recovered.accumlated;
                    covid19Data.dead.accumlated = covid19Data_1dayAgo.dead.total;
                    covid19Data.dead.new =
                        covid19Data.dead.total - covid19Data.dead.accumlated;
                    //공공 백신 데이터가 업데이트가 늦거나 누락되는 경우가 있으면 해당 날짜 총 접종인원은 누락되지 않은 마지막 날짜 기록을 사용한다.
                    if (covid19Data.immunityRatio === null &&
                        covid19Data_1dayAgo.immunityRatio != null) {
                        covid19Data.vaccinated.first.total =
                            covid19Data_1dayAgo.vaccinated.first.total;
                        covid19Data.vaccinated.second.total =
                            covid19Data_1dayAgo.vaccinated.second.total;
                        covid19Data.immunityRatio =
                            Math.round(((covid19Data.vaccinated.second.total +
                                covid19Data.recovered.total) /
                                regionalData.population) *
                                1000) / 1000;
                    }
                }
            });
        });
    };
    /**여러가지 소스데이터를 가져오기
     * - 비동기 함수
     * @returns 감염, 거리두기, 예방접종 데이터를 가지고 있는 Object
     */
    COVID19.get_source_data = function () {
        return Promise.all([
            get_infection_data_1.get_infection_data(),
            get_distancing_data_1.get_distancing_data(),
            get_vaccination_data_1.get_vaccination_data(),
        ]).then(function (sourceData) { return ({
            infection: sourceData[0],
            distancing: sourceData[1],
            vaccination: sourceData[2],
        }); });
    };
    return COVID19;
}());
exports.COVID19 = COVID19;
//# sourceMappingURL=create-COVID19-data.js.map