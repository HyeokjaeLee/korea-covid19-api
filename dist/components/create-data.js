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
const get_confirmed_data_1 = require("./get-confirmed-data");
const get_vaccine_data_1 = require("./get-vaccine-data");
const region_info_1 = require("../data/region-info");
const convert_format_1 = require("../function/convert-format");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const sourceData = yield getSourcData();
        return create_additional_data(combine_vaccine_data(sourceData.vaccine, create_regionalDataList(sourceData.confirmed)));
    });
}
exports.default = main;
//---------------------------------------------------------
//각 공공데이터의 소스데이터 get
const getSourcData = () => Promise.all([get_confirmed_data_1.get_confirmed_data(), get_vaccine_data_1.get_vaccine_data()]).then((sourceData) => ({
    confirmed: sourceData[0],
    vaccine: sourceData[1],
})), 
//확진자 소스 데이터를 기반으로 기본적인 데이터 구조 생성
createcovid19DataData = (confirmedSourceData) => ({
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
            overseas: Number(confirmedSourceData.overFlowCnt._text), // 신규 해외 감염 확진자
        },
    },
    recovered: {
        total: Number(confirmedSourceData.isolClearCnt._text),
        new: null,
        accumlated: null, // 누적 회복자
    },
    dead: {
        total: Number(confirmedSourceData.deathCnt._text),
        new: null,
        accumlated: null, // 누적 사망자
    },
    vaccinated: {
        first: {
            total: null,
            new: null,
            accumlated: null, // 누적 1차 백신 접종자
        },
        second: {
            total: null,
            new: null,
            accumlated: null, // 누적 2차 백신 접종자
        },
    },
    per100kConfirmed: //10만명 당 감염자
    confirmedSourceData.qurRate._text != "-"
        ? Number(confirmedSourceData.qurRate._text)
        : null,
    immunityRatio: null, // 면역 비율
}), 
//기본 데이터 구조들을 지역별로 구분
create_regionalDataList = (confirmedSourceDataList) => {
    const regionalDataList = region_info_1.regionInfo.map((regionalData) => {
        regionalData.covid19DataList = [];
        return regionalData;
    });
    confirmedSourceDataList.forEach((confirmedSourceData) => {
        const regionIndex = regionalDataList.findIndex((regionalData) => regionalData.regionEng ==
            confirmedSourceData.gubunEn._text.replace("-", ""));
        regionalDataList[regionIndex].covid19DataList.push(createcovid19DataData(confirmedSourceData));
    });
    regionalDataList.forEach((regionalData) => {
        regionalData.covid19DataList = regionalData.covid19DataList.reverse();
    });
    return regionalDataList;
}, 
//지역별로 구분된 데이터에 백신 데이터를 결합
combine_vaccine_data = (vaccineSourceDataList, basicData) => {
    vaccineSourceDataList.forEach((vaccineSourceData) => {
        try {
            const regionIndex = basicData.findIndex((_basicData) => _basicData.regionKorFull === vaccineSourceData.sido);
            if (regionIndex != -1) {
                //백신 데이터데이는 '기타' 지역구분이 들어가있음
                const DateIndex = basicData[regionIndex].covid19DataList.findIndex((covid19Data) => covid19Data.date == date_formatter(vaccineSourceData.baseDate));
                if (DateIndex != -1) {
                    //shallow copy
                    const covid19Data = basicData[regionIndex].covid19DataList[DateIndex], vaccineData = covid19Data.vaccinated;
                    //백신 데이터 추가
                    {
                        vaccineData.first.total = vaccineSourceData.totalFirstCnt; //총 1차 백신 접종
                        vaccineData.first.new = vaccineSourceData.firstCnt; //신규 1차 백신 접종
                        vaccineData.first.accumlated =
                            vaccineSourceData.accumulatedFirstCnt; //누적 1차 백신 접종
                        vaccineData.second.total =
                            vaccineSourceData.totalSecondCnt; //총 2차 백신 접종
                        vaccineData.second.new = vaccineSourceData.secondCnt; //신규 2차 백신 접종
                        vaccineData.second.accumlated =
                            vaccineSourceData.accumulatedSecondCnt; //누적 2차 백신 접종
                    }
                    //면역 비율 데이터 추가
                    covid19Data.immunityRatio =
                        Math.round(((vaccineData.second.total +
                            covid19Data.recovered.total) /
                            basicData[regionIndex].population) *
                            1000) / 1000;
                }
            }
        }
        catch (error) {
            console.log("combine_vaccine_data : " + error);
        }
    });
    return basicData;
}, 
//기존 데이터들을 이용해 유추할수 있는 추가 데이터들 생성
create_additional_data = (combined_regionalDataList) => {
    combined_regionalDataList.forEach((combined_regionalData) => {
        combined_regionalData.covid19DataList.forEach((covid19Data, index) => {
            if (index != 0) {
                const covid19Data_1dayAgo = combined_regionalData.covid19DataList[index - 1];
                covid19Data.confirmed.accumlated = covid19Data_1dayAgo.confirmed.total;
                covid19Data.recovered.accumlated = covid19Data_1dayAgo.recovered.total;
                covid19Data.recovered.new =
                    covid19Data.recovered.total - covid19Data.recovered.accumlated;
                covid19Data.dead.accumlated = covid19Data_1dayAgo.dead.total;
                covid19Data.dead.new = covid19Data.dead.total - covid19Data.dead.accumlated;
                //공공 백신 데이터가 업데이트가 늦거나 누락되는 경우가 있으면 해당 날짜 총 접종인원은 누락되지 않은 마지막 날짜 기록을 사용한다.
                if (covid19Data.immunityRatio === null && covid19Data_1dayAgo.immunityRatio != null) {
                    covid19Data.vaccinated.first.total = covid19Data_1dayAgo.vaccinated.first.total;
                    covid19Data.vaccinated.second.total = covid19Data_1dayAgo.vaccinated.second.total;
                    covid19Data.immunityRatio = Math.round(((covid19Data.vaccinated.second.total + covid19Data.recovered.total) / combined_regionalData.population) * 1000) / 1000;
                }
            }
        });
    });
    return combined_regionalDataList;
}, date_formatter = (originalDate) => convert_format_1.convert_date_format(new Date(originalDate), "-");
//# sourceMappingURL=create-data.js.map