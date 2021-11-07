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
exports.update = void 0;
const get = __importStar(require("./get-external-data"));
const region_info_1 = require("../data/region-info");
const convert_date_1 = require("../function/convert-date");
function classify_tempArr(distancingArr, infectionArr, vaccinationArr) {
    let remainInfection = infectionArr;
    let remainVaccination = vaccinationArr;
    return region_info_1.regionInfo.map((region) => {
        var _a;
        const distancingLevel = (_a = distancingArr.find((distancing) => distancing.region === region.regionKor)) === null || _a === void 0 ? void 0 : _a.distancingLevel;
        //성능을 위해 이미 분류한 데이터들은 제거
        let _infection = [], _remainInfection = [];
        remainInfection.forEach((infection) => {
            if (infection.gubunEn.replace("-", "") === region.regionEng)
                _infection.push(infection);
            else
                _remainInfection.push(infection);
        });
        _infection.reverse(); //source data가 날짜를 역순으로 받아옴
        remainInfection = _remainInfection;
        let _vaccination = [], _remainvaccination = [];
        remainVaccination.forEach((vaccination) => {
            if (vaccination.sido === region.regionKorFull)
                _vaccination.push(vaccination);
            else
                _remainvaccination.push(vaccination);
        });
        remainVaccination = _remainvaccination;
        return Object.assign(Object.assign({}, region), { distancingLevel, tempData: {
                infectionArr: _infection,
                vaccinationArr: _vaccination,
            } });
    });
}
function create_covid19Data(tempData) {
    const { infectionArr, vaccinationArr } = tempData.tempData;
    const targetInfectionArr = infectionArr.slice(1);
    return targetInfectionArr.map((infection, index) => {
        const date = (0, convert_date_1.date2string)(new Date(infection.createDt));
        const vaccination = vaccinationArr.find((vaccination) => (0, convert_date_1.date2string)(new Date(vaccination.baseDate)) === date);
        const immunityRatio = !!(vaccination === null || vaccination === void 0 ? void 0 : vaccination.totalSecondCnt) && !!tempData.population && !!infection.isolClearCnt
            ? Math.round(((vaccination.totalSecondCnt + infection.isolClearCnt) / tempData.population) * 1000) / 1000
            : undefined;
        const minus = (num1, num2) => !!num1 && !!num2 ? num1 - num2 : undefined;
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
function update() {
    return __awaiter(this, void 0, void 0, function* () {
        const sourceData = yield Promise.all([get.distancing(), get.infection(), get.vaccination()]).then((sourceArr) => sourceArr);
        const distancing = sourceData[0];
        const infection = sourceData[1];
        const vaccination = sourceData[2];
        const tempArr = classify_tempArr(distancing, infection, vaccination);
        return tempArr.map((temp) => {
            const _temp = temp;
            const covid19Data = create_covid19Data(_temp);
            delete _temp.tempData;
            return Object.assign(Object.assign({}, _temp), { covid19Data });
        });
    });
}
exports.update = update;
//# sourceMappingURL=classify-data.js.map