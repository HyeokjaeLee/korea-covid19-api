import type {
  RegionalData,
  ConfirmedSourceData,
  VaccineSourceData,
} from "../types/data-type";
import { get_confirmed_data } from "./get-confirmed-data";
import { get_vaccine_data } from "./get-vaccine-data";
import { regionInfo } from "../data/region-info";
import { convert_date_format } from "../function/convert-format";
import { get_distancing_level_data } from "../components/get-distancing-data";

/**
 * 지역별로 COVID19 데이터를 생성
 * @returns 지역별 COVID19 데이터
 */
export default async function create_data() {
  const sourceData = await getSourcData();
  return create_additional_data(
    combine_vaccine_data(
      sourceData.vaccine,
      await create_regionalDataList(sourceData.confirmed)
    )
  );
}

/**
 * 공공데이터 포털의 소스 데이터를 불러옴
 * @returns 확진 정보와 예방접종 정보를 가진 Object
 */
const getSourcData = () =>
  Promise.all([get_confirmed_data(), get_vaccine_data()]).then(
    (sourceData) => ({
      confirmed: sourceData[0],
      vaccine: sourceData[1],
    })
  );

/**
 * 확진 정보 소스 데이터를 기반으로 기본적인 데이터 구조 생성
 * @param confirmedSourceData 확진 정보 소스 데이터
 * @returns 확진 정보 소스 데이터 기반 기초 데이터 구조
 *
 * 상위 Object Key
 * - date: 데이터 생성 일자
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
const createcovid19DataData = (confirmedSourceData: ConfirmedSourceData) => ({
  date: date_formatter(confirmedSourceData.createDt._text),
  confirmed: {
    total: Number(confirmedSourceData.defCnt._text) - 1, //왜인지 모르겠으나 신규 확진자와 전일 확진자의 수를 합치면 항상 1명 많음
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
    confirmedSourceData.qurRate._text != "-"
      ? Number(confirmedSourceData.qurRate._text)
      : null,
  immunityRatio: null,
});

/**
 * 소스 데이터를 기반으로 지역별 데이터 생성
 * @param confirmedSourceDataList 공공데이터의 원본 확진 정보 데이터 확진
 * @returns 지역별 데이터
 */
const create_regionalDataList = async (
  confirmedSourceDataList: ConfirmedSourceData[]
) => {
  const distancingDataList = await get_distancing_level_data();
  /** 기본 데이터 구조를 담을 빈 배열과 거리두기 단계를 추가한 지역별 데이터 */
  const regionalDataList: RegionalData[] = regionInfo.map(
    (regionalData: any) => {
      const distancingData = distancingDataList.find(
        (distancingData) => distancingData.region === regionalData.regionKor
      );
      regionalData.distancingLevel =
        distancingData != undefined ? distancingData.distancingLevel : null;
      regionalData.covid19DataList = [];
      return regionalData;
    }
  );
  // 확진 정보 소스 데이터를 지정한 데이터 구조에 담아 지역별로 구분
  confirmedSourceDataList.forEach((confirmedSourceData) => {
    const regionIndex = regionalDataList.findIndex(
      (regionalData) =>
        regionalData.regionEng ==
        confirmedSourceData.gubunEn._text.replace("-", "")
    );
    regionalDataList[regionIndex].covid19DataList.push(
      createcovid19DataData(confirmedSourceData)
    );
  });
  regionalDataList.forEach((regionalData) => {
    regionalData.covid19DataList = regionalData.covid19DataList.reverse();
  });
  return regionalDataList;
};

/**
 * 분류된 지역별 데이터에 백신 데이터를 추가
 * @param vaccineSourceDataList 예방접종 소스 데이터
 * @param regionalDataList 소스 데이터를 기반으로 생성된 지역별 데이터
 * @returns 예방접종 데이터가 추가된 지역별 데이터
 */
const combine_vaccine_data = (
  vaccineSourceDataList: VaccineSourceData[],
  regionalDataList: RegionalData[]
) => {
  vaccineSourceDataList.forEach((vaccineSourceData) => {
    try {
      const regionIndex = regionalDataList.findIndex(
        (regionalData) => regionalData.regionKorFull === vaccineSourceData.sido
      );
      //지역 구분 '기타'는 예방접종 소스 데이터에는 있지만 확진 정보 소스 데이터에는 없으므로 제외
      if (regionIndex != -1) {
        const DateIndex = regionalDataList[
          regionIndex
        ].covid19DataList.findIndex(
          (covid19Data) =>
            covid19Data.date == date_formatter(vaccineSourceData.baseDate)
        );
        if (DateIndex != -1) {
          /** 전체 데이터 구조에서 추가할 값들에 쉽게 접근 하기위한 shallow copy*/
          const covid19Data =
              regionalDataList[regionIndex].covid19DataList[DateIndex],
            vaccineData = covid19Data.vaccinated;
          //예방접종 데이터 추가
          {
            vaccineData.first.total = vaccineSourceData.totalFirstCnt;
            vaccineData.first.new = vaccineSourceData.firstCnt;
            vaccineData.first.accumlated =
              vaccineSourceData.accumulatedFirstCnt;
            vaccineData.second.total = vaccineSourceData.totalSecondCnt;
            vaccineData.second.new = vaccineSourceData.secondCnt;
            vaccineData.second.accumlated =
              vaccineSourceData.accumulatedSecondCnt;
          }
          //면역 비율 데이터 추가
          covid19Data.immunityRatio =
            Math.round(
              ((vaccineData.second.total +
                <number>covid19Data.recovered.total) /
                <number>regionalDataList[regionIndex].population) *
                1000
            ) / 1000;
        }
      }
    } catch (error) {
      console.log("combine_vaccine_data : " + error);
    }
  });
  return regionalDataList;
};

/**
 * 분류된 데이터들로 유추 가능한 추가적인 데이터들을 생성
 * @param combined_regionalDataList 예방접종 데이터가 추가된 지역별 데이터
 * @returns 최종 지역별 COVID19 정보 데이터
 */
const create_additional_data = (combined_regionalDataList: RegionalData[]) => {
  combined_regionalDataList.forEach((combined_regionalData) => {
    combined_regionalData.covid19DataList.forEach((covid19Data, index) => {
      if (index != 0) {
        const covid19Data_1dayAgo =
          combined_regionalData.covid19DataList[index - 1];
        covid19Data.confirmed.accumlated = covid19Data_1dayAgo.confirmed.total;
        covid19Data.recovered.accumlated = covid19Data_1dayAgo.recovered.total;
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
                <number>combined_regionalData.population) *
                1000
            ) / 1000;
        }
      }
    });
  });
  return combined_regionalDataList;
};

/**소스 데이터의 날짜 형식을 변환
 * @param originalDate 소스 데이터 날짜
 * @returns 가공된 날짜 ex) 2019-01-01
 */
const date_formatter = (originalDate: string) =>
  convert_date_format(new Date(originalDate), "-");
