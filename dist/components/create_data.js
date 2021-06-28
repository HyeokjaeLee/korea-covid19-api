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
const get_confirmed_data_1 = require("./get_confirmed_data");
const get_vaccine_data_1 = require("./get_vaccine_data");
const region_info_1 = require("../data/region_info");
const format_conversion_1 = require("../function/format-conversion");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const sourceData = yield getSourcData();
    return create_additional_data(combine_vaccine_data(sourceData.vaccine, create_basic_data_set(sourceData.confirmed, create_data_frame(region_info_1.regionInfo))));
});
//---------------------------------------------------------
const getSourcData = () => Promise.all([get_confirmed_data_1.get_confirmed_data(), get_vaccine_data_1.get_vaccine_data()]).then((sourceData) => ({
    confirmed: sourceData[0],
    vaccine: sourceData[1],
}));
const createBasicData = (confirmedSourceData) => ({
    date: date_formatter(confirmedSourceData.createDt._text),
    confirmed: {
        total: Number(confirmedSourceData.defCnt._text) - 1,
        accumlated: null,
    },
    quarantine: {
        total: Number(confirmedSourceData.isolIngCnt._text),
        new: {
            total: Number(confirmedSourceData.incDec._text),
            domestic: Number(confirmedSourceData.localOccCnt._text),
            overseas: Number(confirmedSourceData.overFlowCnt._text),
        },
    },
    recovered: {
        total: Number(confirmedSourceData.isolClearCnt._text),
        new: null,
        accumlated: null,
    },
    dead: {
        total: Number(confirmedSourceData.deathCnt._text),
        new: null,
        accumlated: null,
    },
    vaccination: {
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
    per100kConfirmed: confirmedSourceData.qurRate._text != "-"
        ? Number(confirmedSourceData.qurRate._text)
        : null,
});
const create_basic_data_set = (confirmedSourceData, dataFrame) => {
    confirmedSourceData.forEach((_confirmedSourceData) => {
        const regionIndex = dataFrame.findIndex((_dataFrame) => _dataFrame.regionEng == _confirmedSourceData.gubunEn._text);
        dataFrame[regionIndex].covid19.push(createBasicData(_confirmedSourceData));
    });
    dataFrame.forEach((_dataFrame) => {
        _dataFrame.covid19 = _dataFrame.covid19.reverse();
    });
    return dataFrame;
};
const combine_vaccine_data = (vaccineSourceData, basicData) => {
    vaccineSourceData.forEach((_vaccineSourceData) => {
        try {
            const regionIndex = basicData.findIndex((_basicData) => _basicData.regionKor == _vaccineSourceData.sido);
            if (regionIndex != -1) {
                //백신 데이터데이는 '기타' 지역구분이 들어가있음
                const DateIndex = basicData[regionIndex].covid19.findIndex((_covid19) => _covid19.date == date_formatter(_vaccineSourceData.baseDate)), targetData = basicData[regionIndex].covid19[DateIndex].vaccination;
                targetData.first.total = _vaccineSourceData.totalFirstCnt;
                targetData.first.new = _vaccineSourceData.firstCnt;
                targetData.first.accumlated = _vaccineSourceData.accumulatedFirstCnt;
                targetData.second.total = _vaccineSourceData.totalSecondCnt;
                targetData.second.new = _vaccineSourceData.secondCnt;
                targetData.second.accumlated = _vaccineSourceData.accumulatedSecondCnt;
                basicData[regionIndex].covid19[DateIndex].vaccination = targetData;
            }
        }
        catch (error) {
            console.log("combine_vaccine_data : " + error);
        }
    });
    return basicData;
};
const create_data_frame = (regionInfo) => {
    regionInfo.forEach((_regionInfo) => {
        _regionInfo.covid19 = [];
    });
    return regionInfo;
};
const date_formatter = (originalDate) => {
    let date = new Date(originalDate);
    date.setDate(date.getDate() - 1);
    return format_conversion_1.convertDateFormat(date, "-");
};
const create_additional_data = (combinedData) => {
    combinedData.forEach((_combinedData) => {
        _combinedData.covid19.forEach((_covid19, index) => {
            if (index != 0) {
                const _covid19_1dayAgo = _combinedData.covid19[index - 1];
                _covid19.confirmed.accumlated = _covid19_1dayAgo.confirmed.total;
                _covid19.recovered.accumlated = _covid19_1dayAgo.recovered.total;
                _covid19.recovered.new =
                    _covid19.recovered.total - _covid19.recovered.accumlated;
                _covid19.dead.accumlated = _covid19_1dayAgo.dead.total;
                _covid19.dead.new = _covid19.dead.total - _covid19.dead.accumlated;
            }
        });
    });
    return combinedData;
};
exports.default = main;
//# sourceMappingURL=create_data.js.map