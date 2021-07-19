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
exports.COVID19 = void 0;
const get_infection_data_1 = require("./get-infection-data");
const get_vaccination_data_1 = require("./get-vaccination-data");
const region_info_1 = require("../data/region-info");
const convert_format_1 = require("../function/convert-format");
const get_distancing_data_1 = require("./get-distancing-data");
/**소스 데이터의 날짜 형식을 변환
 * @param originalDate 소스 데이터 날짜
 * @returns 가공된 날짜 ex) 2019-01-01
 */
const date_formatter = (originalDate) => convert_format_1.convert_date_format(new Date(originalDate), "-");
/**COVID19 정보 생성을 위한 클래스*/
class COVID19 {
    constructor() {
        /**
         * COVID19 관련 지역별 정보 Array
         * - 연산중 값 조회를 방지하기 위해 temp에서 연산이 모두 종료된 후 값이 변경됨
         */
        this.data = [];
        /**실제 연산이 이루어지는 임시 변수*/
        this.temp = [];
        /**동적 영역 초기화*/
        this.init = () => {
            this.temp = region_info_1.regionInfo.map((regionalData) => {
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
        this.update = () => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("\n" + new Date());
                const sourceData = yield COVID19.get_source_data();
                this.init();
                this.classify_by_region(sourceData.infection, sourceData.distancing);
                this.combine_vaccinationData(sourceData.vaccination);
                this.create_additionalData();
                this.data = this.temp;
                console.log("Data Update Successful");
            }
            catch (err) {
                console.log(`Data update failed: ${err}`);
            }
        });
    }
    /**
     * 소스 데이터를 가공하여 지역별로 분류하여 temp에 저장
     * @param infectionDataList 감염 소스 데이터
     * @param distancingDataList 사회적 거리두기 소스 데이터
     */
    classify_by_region(infectionSourceDataList, distancingDataList) {
        /**
         * 감염과 거리두기 소스 데이터를 기반으로 소단위 기본적 데이터 구조 생성
         * @param infectionSourceData 감염 소스 데이터
         * @returns 감염 소스 데이터 기반 기초 데이터 구조
         */
        const create_basicStructure = (infectionSourceData) => ({
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
        });
        /** 확진 정보 소스 데이터를 지정한 데이터 구조에 담아 지역별로 구분*/
        infectionSourceDataList.forEach((infectionSourceData) => {
            const regionIndex = this.temp.findIndex((regionalData) => regionalData.regionEng ==
                infectionSourceData.gubunEn._text.replace("-", ""));
            this.temp[regionIndex].covid19DataList.push(create_basicStructure(infectionSourceData));
        });
        //루프 최소화를 위해 같이 진행
        this.temp.forEach((regionalData) => {
            const distancingData = distancingDataList.find((distancingData) => distancingData.region === regionalData.regionKor);
            //거리두기 정보 추가
            regionalData.distancingLevel =
                distancingData != undefined ? distancingData.distancingLevel : null;
            regionalData.covid19DataList = regionalData.covid19DataList.reverse(); //배열에 넣어둔 날짜가 역순이므로 재배치
        });
    }
    /**
     * 기존 temp에 백신 데이터를 추가하여 저장
     * @param vaccinationSourceDataList 예방접종 소스 데이터
     */
    combine_vaccinationData(vaccinationSourceDataList) {
        vaccinationSourceDataList.forEach((vaccinationSourceData) => {
            const regionIndex = this.temp.findIndex((regionalData) => regionalData.regionKorFull === vaccinationSourceData.sido);
            //지역 구분 '기타'는 예방접종 소스 데이터에는 있지만 확진 정보 소스 데이터에는 없으므로 제외
            if (regionIndex != -1) {
                const DateIndex = this.temp[regionIndex].covid19DataList.findIndex((covid19Data) => covid19Data.date == date_formatter(vaccinationSourceData.baseDate));
                if (DateIndex != -1) {
                    /** 전체 데이터 구조에서 추가할 값들에 쉽게 접근 하기위한 shallow copy*/
                    const covid19Data = this.temp[regionIndex].covid19DataList[DateIndex], vaccinationData = covid19Data.vaccinated;
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
                            this.temp[regionIndex].population) *
                            1000) / 1000;
                }
            }
        });
    }
    /**
     * temp의 여러 값들을 기반으로 유추가능한 추가적인 데이터 생성 및 추가 저장
     */
    create_additionalData() {
        this.temp.forEach((regionalData) => {
            regionalData.covid19DataList.forEach((covid19Data, index) => {
                if (index != 0) {
                    const covid19Data_1dayAgo = regionalData.covid19DataList[index - 1];
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
    }
}
exports.COVID19 = COVID19;
/**여러가지 소스데이터를 가져오기
 * - 비동기 함수
 * @returns 감염, 거리두기, 예방접종 데이터를 가지고 있는 Object
 */
COVID19.get_source_data = () => Promise.all([
    get_infection_data_1.get_infection_data(),
    get_distancing_data_1.get_distancing_data(),
    get_vaccination_data_1.get_vaccination_data(),
]).then((sourceData) => ({
    infection: sourceData[0],
    distancing: sourceData[1],
    vaccination: sourceData[2],
}));
//# sourceMappingURL=create-COVID19-data.js.map