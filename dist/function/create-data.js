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
Object.defineProperty(exports, "__esModule", { value: true });
exports.create_regionData = void 0;
const get = __importStar(require("./get-external-data"));
const region_info_1 = require("../data/region-info");
const convert_date_1 = require("./convert-date");
const source_filter_1 = require("./source-filter");
/**
 * 전 지역의 COVID19 정보를 포함한 지역 데이터 생성
 * @returns COVID19데이터를 포함한 지역 데이터
 */
function create_regionData() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`update-start (${new Date()})`);
        const sourceData = yield Promise.all([get.distancing(), get.infection(), get.vaccination()]), distancingArr = sourceData[0], infectionArr = sourceData[1], vaccinationArr = sourceData[2];
        const RegionArr = region_info_1.regionInfos.map((regionInfo) => {
            const distancingLevel = find_distancingLevel(regionInfo.regionKor, distancingArr);
            const _infectionArr = source_filter_1.Filter.infection(find_infection(regionInfo.regionEng, infectionArr));
            const _vaccinationArr = find_vaccination(regionInfo.regionKorFull, vaccinationArr);
            const requiredData = {
                infectionArr: _infectionArr,
                vaccinationArr: _vaccinationArr,
                population: regionInfo.population,
            };
            const covid19Data = create_covid19Data(requiredData);
            const result = Object.assign(Object.assign({}, regionInfo), { distancingLevel: distancingLevel, covid19Data: covid19Data });
            delete result.regionKorFull;
            return result;
        });
        console.log(`update-end (${new Date()})`);
        return RegionArr;
    });
}
exports.create_regionData = create_regionData;
/**
 * 지역에 맞는 거리두기 단계 찾기
 * @param regionKor
 * @param distancingArr 전체 거리두기 데이터
 * @returns 해당 지역의 거리두기 단계
 */
function find_distancingLevel(regionKor, distancingArr) {
    var _a;
    return (_a = distancingArr.find((distancing) => distancing.region === regionKor)) === null || _a === void 0 ? void 0 : _a.distancingLevel;
}
/**
 * 지역에 맞는 감염 데이터 찾기
 * @param regionEng
 * @param infectionArr 전체 감염 데이터
 * @returns 해당 지역의 감염 데이터
 */
function find_infection(regionEng, infectionArr) {
    return infectionArr.filter((infection) => infection.gubunEn.replace("-", "") === regionEng);
}
/**
 * 지역에 맞는 예방접종 데이터 찾기
 * @param regionKorFull
 * @param vaccinationArr 전체 예방접종 데이터
 * @returns 해당 지역의 예방접종 데이터
 */
function find_vaccination(regionKorFull, vaccinationArr) {
    return vaccinationArr.filter((vaccination) => vaccination.sido === regionKorFull);
}
/**
 * 한 지역의 COVID19 정보를 생성
 * @param requiredData 한 지역의 감염 데이터, 예방접종 데이터, 인구수
 * @returns Covid19 정보
 */
function create_covid19Data(requiredData) {
    const { infectionArr, vaccinationArr, population } = requiredData;
    const minus = (num1, num2) => !!num1 && !!num2 ? num1 - num2 : undefined;
    return infectionArr.slice(1).map((infection, index) => {
        const date = (0, convert_date_1.date2string)((0, convert_date_1.kor2Date)(infection.stdDay));
        const vaccination = vaccinationArr.find((vaccination) => (0, convert_date_1.date2string)(new Date(vaccination.baseDate)) === date);
        const immunityRatio = !(vaccination === null || vaccination === void 0 ? void 0 : vaccination.totalSecondCnt) || !population || !infection.isolClearCnt
            ? undefined
            : Math.round(((vaccination.totalSecondCnt + infection.isolClearCnt) / population) * 1000) /
                1000;
        const aDayAgoInfectionArr = infectionArr[index];
        return {
            date: date,
            confirmed: {
                total: infection.defCnt,
                accumlated: aDayAgoInfectionArr.defCnt,
            },
            quarantine: {
                total: infection.isolIngCnt,
                new: {
                    total: infection.incDec,
                    domestic: infection.localOccCnt,
                    overseas: infection.overFlowCnt,
                },
            },
            recovered: {
                total: infection.isolClearCnt,
                new: minus(infection.isolClearCnt, aDayAgoInfectionArr.isolClearCnt),
                accumlated: aDayAgoInfectionArr.isolClearCnt,
            },
            dead: {
                total: infection.deathCnt,
                new: minus(infection.deathCnt, aDayAgoInfectionArr.deathCnt),
                accumlated: aDayAgoInfectionArr.deathCnt,
            },
            vaccinated: {
                first: {
                    total: vaccination === null || vaccination === void 0 ? void 0 : vaccination.totalFirstCnt,
                    new: vaccination === null || vaccination === void 0 ? void 0 : vaccination.firstCnt,
                    accumlated: vaccination === null || vaccination === void 0 ? void 0 : vaccination.accumulatedFirstCnt,
                },
                second: {
                    total: vaccination === null || vaccination === void 0 ? void 0 : vaccination.totalSecondCnt,
                    new: vaccination === null || vaccination === void 0 ? void 0 : vaccination.secondCnt,
                    accumlated: vaccination === null || vaccination === void 0 ? void 0 : vaccination.accumulatedSecondCnt,
                },
            },
            per100kConfirmed: infection.qurRate != "-" ? infection.qurRate : undefined,
            immunityRatio: immunityRatio,
        };
    });
}
//# sourceMappingURL=create-data.js.map