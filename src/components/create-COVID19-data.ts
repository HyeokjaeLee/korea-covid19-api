import type {
  RegionalData,
  InfectionSourceData,
  VaccinationSourceData,
  DistancingSourceData,
} from "../types/data-type";
import { get_infection_data } from "./get-infection-data";
import { get_vaccination_data } from "./get-vaccination-data";
import { regionInfo } from "../data/region-info";
import { convert_date_format } from "../function/convert-format";
import { get_distancing_data } from "./get-distancing-data";

/**소스 데이터의 날짜 형식을 변환
 * @param originalDate 소스 데이터 날짜
 * @returns 가공된 날짜 ex) 2019-01-01
 */
const date_formatter = (originalDate: string) =>
  convert_date_format(new Date(originalDate), "-");

/**
 * 공공데이터 포털의 소스 데이터를 불러옴
 * @returns 확진 정보와 예방접종 정보를 가진 Object
 * const getSourcData = () =>
  Promise.all([get_confirmed_data(), get_vaccine_data()]).then(
    (sourceData) => ({
      confirmed: sourceData[0],
      vaccine: sourceData[1],
    })
  );
 */

/**
 * 여러가지 COVID19 관련 소스 데이터들을 가공해 지역별 데이터를 만듦
 * @param distancingDataList 거리두기 소스 데이터
 * @param infectionDataList 감염 소스 데이터
 * @param vaccinationDataList 예방접종 소스 데이터
 */
class COVID19Data {
  /**
   * COVID19Data Object Key
   *  - date: 데이터 생성 일자
   * - confirmed: 확진
   * - quarantine: 격리
   * - recovered: 격리해제(회복)
   * - dead: 사망
   * - vaccinated: 백신 접종
   * - per100kConfirmed: 10만명 당 확진자 수
   * - immunityRatio: 면역자 비율(2차 백신 접종 + 회복)
   *
   * 공통 하위 Object Key
   * - total: 전체(신규+누적)
   * - new: 신규(당일)
   * - accumlated: 누적(전일)
   *
   * new quarantine(신규 격리자) 하위 Object Key
   * - domestic: 국내 감염
   * - overseas: 해외 감염
   *
   * vaccinated 하위 Object Key
   * - first: 1차 접종
   * - second: 2차 접종
   */
  public regionalDataList: RegionalData[];
  constructor(
    distancingDataList: DistancingSourceData[],
    infectionDataList: InfectionSourceData[],
    vaccinationDataList: VaccinationSourceData[]
  ) {
    //기본 데이터 구조를 담을 빈 배열과 거리두기 단계를 추가한 지역별 데이터를 저장
    this.regionalDataList = regionInfo.map((regionalData: any) => {
      const distancingData = distancingDataList.find(
        (distancingData) => distancingData.region === regionalData.regionKor
      );
      regionalData.distancingLevel =
        distancingData != undefined ? distancingData.distancingLevel : null;
      regionalData.covid19DataList = [];
      return regionalData;
    });
    this.classify_by_region(infectionDataList);
    this.combine_vaccinationData(vaccinationDataList);
    this.create_additionalData();
  }

  /**
   * 소스 데이터를 기반으로 지역별 기초 데이터 생성
   * @param infectionSourceDataList 공공데이터의 감염 소스 데이터
   * @param distancingSourceDataList 공공데이터의 거리두기 소스 데이터
   * @returns 지역별 기초 데이터
   */
  private classify_by_region(infectionSourceDataList: InfectionSourceData[]) {
    /**
     * 감염 정보 소스 데이터를 기반으로 기본적인 데이터 구조 생성
     * @param confirmedSourceData 확진 정보 소스 데이터
     * @returns 확진 정보 소스 데이터 기반 기초 데이터 구조
     */
    const create_basicStructure = (
      infectionSourceData: InfectionSourceData
    ) => ({
      date: date_formatter(infectionSourceData.createDt._text),
      confirmed: {
        total: Number(infectionSourceData.defCnt._text) - 1, //왜인지 모르겠으나 신규 확진자와 전일 확진자의 수를 합치면 항상 1명 많음
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
      per100kConfirmed:
        infectionSourceData.qurRate._text != "-"
          ? Number(infectionSourceData.qurRate._text)
          : null,
      immunityRatio: null,
    });
    /** 확진 정보 소스 데이터를 지정한 데이터 구조에 담아 지역별로 구분*/
    infectionSourceDataList.forEach((infectionSourceData) => {
      const regionIndex = this.regionalDataList.findIndex(
        (regionalData) =>
          regionalData.regionEng ==
          infectionSourceData.gubunEn._text.replace("-", "")
      );
      this.regionalDataList[regionIndex].covid19DataList.push(
        create_basicStructure(infectionSourceData)
      );
    });
    this.regionalDataList.forEach((regionalData) => {
      regionalData.covid19DataList = regionalData.covid19DataList.reverse();
    });
  }

  /**
   * 분류된 지역별 데이터에 백신 데이터를 추가
   * @param vaccinationSourceDataList 예방접종 소스 데이터
   * @param regionalDataList 소스 데이터를 기반으로 생성된 지역별 데이터
   * @returns 예방접종 데이터가 추가된 지역별 데이터
   */
  private combine_vaccinationData(
    vaccinationSourceDataList: VaccinationSourceData[]
  ) {
    vaccinationSourceDataList.forEach((vaccinationSourceData) => {
      try {
        const regionIndex = this.regionalDataList.findIndex(
          (regionalData) =>
            regionalData.regionKorFull === vaccinationSourceData.sido
        );
        //지역 구분 '기타'는 예방접종 소스 데이터에는 있지만 확진 정보 소스 데이터에는 없으므로 제외
        if (regionIndex != -1) {
          const DateIndex = this.regionalDataList[
            regionIndex
          ].covid19DataList.findIndex(
            (covid19Data) =>
              covid19Data.date == date_formatter(vaccinationSourceData.baseDate)
          );
          if (DateIndex != -1) {
            /** 전체 데이터 구조에서 추가할 값들에 쉽게 접근 하기위한 shallow copy*/
            const covid19Data =
                this.regionalDataList[regionIndex].covid19DataList[DateIndex],
              vaccinationData = covid19Data.vaccinated;
            //예방접종 데이터 추가
            {
              vaccinationData.first.total = vaccinationSourceData.totalFirstCnt;
              vaccinationData.first.new = vaccinationSourceData.firstCnt;
              vaccinationData.first.accumlated =
                vaccinationSourceData.accumulatedFirstCnt;
              vaccinationData.second.total =
                vaccinationSourceData.totalSecondCnt;
              vaccinationData.second.new = vaccinationSourceData.secondCnt;
              vaccinationData.second.accumlated =
                vaccinationSourceData.accumulatedSecondCnt;
            }
            //면역 비율 데이터 추가
            covid19Data.immunityRatio =
              Math.round(
                ((vaccinationData.second.total +
                  <number>covid19Data.recovered.total) /
                  <number>this.regionalDataList[regionIndex].population) *
                  1000
              ) / 1000;
          }
        }
      } catch (error) {
        console.log("combine_vaccine_data : " + error);
      }
    });
  }

  /**
   * 분류된 데이터들로 유추 가능한 추가적인 데이터들을 생성
   * @param combined_regionalDataList 예방접종 데이터가 추가된 지역별 데이터
   * @returns 최종 지역별 COVID19 정보 데이터
   */
  private create_additionalData() {
    this.regionalDataList.forEach((regionalData) => {
      regionalData.covid19DataList.forEach((covid19Data, index) => {
        if (index != 0) {
          const covid19Data_1dayAgo = regionalData.covid19DataList[index - 1];
          covid19Data.confirmed.accumlated =
            covid19Data_1dayAgo.confirmed.total;
          covid19Data.recovered.accumlated =
            covid19Data_1dayAgo.recovered.total;
          covid19Data.recovered.new =
            covid19Data.recovered.total! - covid19Data.recovered.accumlated!;
          covid19Data.dead.accumlated = covid19Data_1dayAgo.dead.total;
          covid19Data.dead.new =
            covid19Data.dead.total! - covid19Data.dead.accumlated!;
          //공공 백신 데이터가 업데이트가 늦거나 누락되는 경우가 있으면 해당 날짜 총 접종인원은 누락되지 않은 마지막 날짜 기록을 사용한다.
          if (
            covid19Data.immunityRatio === null &&
            covid19Data_1dayAgo.immunityRatio != null
          ) {
            covid19Data.vaccinated.first.total =
              covid19Data_1dayAgo.vaccinated.first.total;
            covid19Data.vaccinated.second.total =
              covid19Data_1dayAgo.vaccinated.second.total;
            covid19Data.immunityRatio =
              Math.round(
                ((<number>covid19Data.vaccinated.second.total +
                  <number>covid19Data.recovered.total) /
                  <number>regionalData.population) *
                  1000
              ) / 1000;
          }
        }
      });
    });
  }
}
