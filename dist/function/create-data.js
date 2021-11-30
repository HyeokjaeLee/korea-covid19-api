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
const get = __importStar(require("./get-external-data"));
const convert_date_1 = require("./convert-date");
const source_filter_1 = require("./source-filter");
const fs_1 = __importDefault(require("fs"));
/**
 * 전 지역의 COVID19 정보를 포함한 지역 데이터 생성
 * @returns COVID19데이터를 포함한 지역 데이터
 */
function create_regionData() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`update-start (${new Date()})`);
        const sourceData = yield Promise.all([get.infection(), get.vaccination()]), infectionArr = sourceData[0], vaccinationArr = sourceData[1];
        const regionInfos = JSON.parse(fs_1.default.readFileSync("./data/region-info.json", "utf8"));
        const RegionArr = regionInfos.map((regionInfo) => {
            const _infectionArr = source_filter_1.Filter.infection(find_infection(regionInfo.nameEng, infectionArr));
            const _vaccinationArr = find_vaccination(regionInfo.nameKorFull, vaccinationArr);
            const requiredData = {
                infectionArr: _infectionArr,
                vaccinationArr: _vaccinationArr,
                population: regionInfo.population,
            };
            const covid19Data = create_covid19Data(requiredData);
            const result = Object.assign(Object.assign({}, regionInfo), { covid19: covid19Data });
            delete result.nameKorFull;
            return result;
        });
        console.log(`update-end (${new Date()})`);
        return RegionArr;
    });
}
exports.default = create_regionData;
/**
 * 지역에 맞는 거리두기 단계 찾기
 * @param nameKor
 * @param distancingArr 전체 거리두기 데이터
 * @returns 해당 지역의 거리두기 단계
 */
function find_distancingLevel(nameKor, distancingArr) {
    var _a;
    return (_a = distancingArr.find((distancing) => distancing.region === nameKor)) === null || _a === void 0 ? void 0 : _a.distancingLevel;
}
/**
 * 지역에 맞는 감염 데이터 찾기
 * @param nameEng
 * @param infectionArr 전체 감염 데이터
 * @returns 해당 지역의 감염 데이터
 */
function find_infection(nameEng, infectionArr) {
    return infectionArr.filter((infection) => infection.gubunEn.replace("-", "") === nameEng);
}
/**
 * 지역에 맞는 예방접종 데이터 찾기
 * @param nameKorFull
 * @param vaccinationArr 전체 예방접종 데이터
 * @returns 해당 지역의 예방접종 데이터
 */
function find_vaccination(nameKorFull, vaccinationArr) {
    return vaccinationArr.filter((vaccination) => vaccination.sido === nameKorFull);
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
        const immunityRatio = (vaccination === null || vaccination === void 0 ? void 0 : vaccination.totalSecondCnt) === undefined || !population || !infection.isolClearCnt
            ? undefined
            : Math.round(((vaccination.totalSecondCnt + infection.isolClearCnt) / population) * 1000) /
                1000;
        const aDayAgoInfectionArr = infectionArr[index];
        return {
            date: date,
            ratePer100k: typeof infection.qurRate === "number" ? infection.qurRate : undefined,
            immunityRatio: immunityRatio,
            quarantine: minus(minus(infection.defCnt, infection.isolClearCnt), infection.deathCnt),
            confirmed: {
                total: infection.defCnt,
                new: {
                    total: infection.incDec,
                    domestic: infection.localOccCnt,
                    overseas: infection.overFlowCnt,
                },
                accumlated: aDayAgoInfectionArr.defCnt,
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
        };
    });
}
//# sourceMappingURL=create-data.js.map