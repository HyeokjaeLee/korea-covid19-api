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
Object.defineProperty(exports, "__esModule", { value: true });
exports.combine_data = void 0;
const get_confirmed_data_1 = require("./get_confirmed_data");
const get_vaccine_data_1 = require("./get_vaccine_data");
const format_conversion_1 = require("../function/format-conversion");
const region_info_1 = require("../data/region_info");
const combine_data = () => __awaiter(void 0, void 0, void 0, function* () {
    const combineData = yield Promise.all([
        get_confirmed_data_1.get_confirmed_data(),
        get_vaccine_data_1.get_vaccine_data(),
    ]).then((sourceData) => sourceData[0].map((confirmedData, index) => {
        var _a;
        const regionEng = confirmedData.gubunEn._text;
        const combinedData = {
            region_kor: (_a = region_info_1.regionInfo.find((element) => element.region_eng == regionEng)) === null || _a === void 0 ? void 0 : _a.region_kor,
            region_eng: regionEng,
            date: format_conversion_1.convertDateFormat(confirmedData.createDt._text, "-"),
            confirmed_total: Number(confirmedData.defCnt._text),
            confirmed_accumlated: null,
            quarantine_total: Number(confirmedData.isolIngCnt._text),
            quarantine_new: Number(confirmedData.incDec._text),
            quarantine_new_overseas: Number(confirmedData.overFlowCnt._text),
            quarantine_new_domestic: Number(confirmedData.localOccCnt._text),
            recovered_total: Number(confirmedData.isolClearCnt._text),
            recovered_new: null,
            recovered_accumlated: null,
            dead_total: Number(confirmedData.deathCnt._text),
            dead_new: null,
            dead_accumlated: null,
            inoculation_1st_total: null,
            inoculation_1st_new: null,
            inoculation_1st_accumulated: null,
            inoculation_2st_total: null,
            inoculation_2st_new: null,
            inoculation_2st_accumulated: null,
            per100000rate: confirmedData.qurRate._text != "-"
                ? Number(confirmedData.qurRate._text)
                : null,
        };
        const vaccineData = sourceData[1].find((element) => element.sido == combinedData.region_kor &&
            format_conversion_1.convertDateFormat(element.baseDate, "-") == combinedData.date);
        if (vaccineData != undefined) {
            combinedData.inoculation_1st_total = vaccineData.totalFirstCnt;
            combinedData.inoculation_1st_new = vaccineData.firstCnt;
            combinedData.inoculation_1st_accumulated =
                vaccineData.accumulatedFirstCnt;
            combinedData.inoculation_2st_total = vaccineData.totalSecondCnt;
            combinedData.inoculation_2st_new = vaccineData.secondCnt;
            combinedData.inoculation_2st_accumulated =
                vaccineData.accumulatedSecondCnt;
        }
        return combinedData;
    }));
    return combineData;
});
exports.combine_data = combine_data;
exports.combine_data();
//# sourceMappingURL=combine_data.js.map