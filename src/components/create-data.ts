import type {
  COVID19DataSet,
  ConfirmedSourceData,
  VaccineSourceData,
} from "../types/data-type";
import { get_confirmed_data } from "./get-confirmed-data";
import { get_vaccine_data } from "./get-vaccine-data";
import { regionInfo } from "../data/region-info";
import { convert_date_format } from "../function/convert-format";

export default async function main() {
  const sourceData = await getSourcData();
  return create_additional_data(
    combine_vaccine_data(
      sourceData.vaccine,
      create_basic_data_set(sourceData.confirmed, create_data_frame(regionInfo))
    )
  );
}

//---------------------------------------------------------

const getSourcData = () =>
    Promise.all([get_confirmed_data(), get_vaccine_data()]).then(
      (sourceData) => ({
        confirmed: sourceData[0],
        vaccine: sourceData[1],
      })
    ),
  createBasicData = (confirmedSourceData: ConfirmedSourceData) => ({
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
    per100kConfirmed:
      confirmedSourceData.qurRate._text != "-"
        ? Number(confirmedSourceData.qurRate._text)
        : null,
    immunityRatio: null,
  }),
  create_basic_data_set = (
    confirmedSourceData: ConfirmedSourceData[],
    dataFrame: COVID19DataSet[]
  ) => {
    confirmedSourceData.forEach((_confirmedSourceData) => {
      const regionIndex = dataFrame.findIndex(
        (_dataFrame) =>
          _dataFrame.regionEng ==
          _confirmedSourceData.gubunEn._text.replace("-", "")
      );
      dataFrame[regionIndex].covid19DataList.push(
        createBasicData(_confirmedSourceData)
      );
    });
    dataFrame.forEach((_dataFrame) => {
      _dataFrame.covid19DataList = _dataFrame.covid19DataList.reverse();
    });
    return dataFrame;
  },
  combine_vaccine_data = (
    vaccineSourceData: VaccineSourceData[],
    basicData: COVID19DataSet[]
  ) => {
    vaccineSourceData.forEach((_vaccineSourceData) => {
      try {
        const regionIndex = basicData.findIndex(
          (_basicData) => _basicData.regionKorFull === _vaccineSourceData.sido
        );
        if (regionIndex != -1) {
          //백신 데이터데이는 '기타' 지역구분이 들어가있음
          const DateIndex = basicData[regionIndex].covid19DataList.findIndex(
            (_covid19) =>
              _covid19.date == date_formatter(_vaccineSourceData.baseDate)
          );
          if (DateIndex != -1) {
            //shallow copy
            const targetCovid19DataList =
                basicData[regionIndex].covid19DataList[DateIndex],
              targetVaccination = targetCovid19DataList.vaccination;
            //백신 데이터 추가
            {
              targetVaccination.first.total = _vaccineSourceData.totalFirstCnt; //총 1차 백신 접종
              targetVaccination.first.new = _vaccineSourceData.firstCnt; //신규 1차 백신 접종
              targetVaccination.first.accumlated =
                _vaccineSourceData.accumulatedFirstCnt; //누적 1차 백신 접종
              targetVaccination.second.total =
                _vaccineSourceData.totalSecondCnt; //총 2차 백신 접종
              targetVaccination.second.new = _vaccineSourceData.secondCnt; //신규 2차 백신 접종
              targetVaccination.second.accumlated =
                _vaccineSourceData.accumulatedSecondCnt; //누적 2차 백신 접종
            }
            //면역 비율 데이터 추가
            targetCovid19DataList.immunityRatio =
              Math.round(
                ((targetVaccination.second.total +
                  <number>targetCovid19DataList.recovered.total) /
                  <number>basicData[regionIndex].population) *
                  1000
              ) / 1000;
          }
        }
      } catch (error) {
        console.log("combine_vaccine_data : " + error);
      }
    });
    return basicData;
  },
  create_data_frame = (regionInfo: any[]): COVID19DataSet[] => {
    regionInfo.forEach((_regionInfo: any) => {
      _regionInfo.covid19DataList = [];
    });
    return regionInfo;
  },
  date_formatter = (originalDate: string) =>
    convert_date_format(new Date(originalDate), "-"),
  create_additional_data = (combinedData: COVID19DataSet[]) => {
    combinedData.forEach((_combinedData) => {
      _combinedData.covid19DataList.forEach((_covid19, index) => {
        if (index != 0) {
          const _covid19_1dayAgo = _combinedData.covid19DataList[index - 1];
          _covid19.confirmed.accumlated = _covid19_1dayAgo.confirmed.total;
          _covid19.recovered.accumlated = _covid19_1dayAgo.recovered.total;
          _covid19.recovered.new =
            _covid19.recovered.total! - _covid19.recovered.accumlated!;
          _covid19.dead.accumlated = _covid19_1dayAgo.dead.total;
          _covid19.dead.new = _covid19.dead.total! - _covid19.dead.accumlated!;
        }
      });
    });
    return combinedData;
  };
