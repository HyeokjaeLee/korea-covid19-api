import type {
  COVID19DataSet,
  ConfirmedSourceData,
  COVID19Data,
} from "../types/data_type";
import { get_confirmed_data } from "./get_confirmed_data";
import { get_vaccine_data } from "./get_vaccine_data";
import { regionInfo } from "../data/region_info";
import { convertDateFormat } from "../function/format-conversion";

const main = async () => {
  const sourceData = await getSourcData();
  const FinalDataFrame: COVID19DataSet[] = regionInfo.map((regionInfo) => ({
    regionEng: regionInfo.regionEng,
    regionKor: regionInfo.regionKor,
    population: regionInfo.population,
    covid19: [],
  }));
  sourceData.confirmed.forEach((_confirmedSourceData: ConfirmedSourceData) => {
    const regionIndex = FinalDataFrame.findIndex(
      (_FinalDataFrame) =>
        _FinalDataFrame.regionEng == _confirmedSourceData.gubunEn._text
    );
    FinalDataFrame[regionIndex].covid19.push(
      createDataFrame(_confirmedSourceData)
    );
  });
  console.log(FinalDataFrame[1].regionKor);
  console.log(FinalDataFrame[1].covid19[1]);
  console.log(FinalDataFrame[1].covid19[20]);
  console.log(FinalDataFrame[1].covid19[21]);
  console.log(FinalDataFrame[1].covid19[22]);
  console.log(FinalDataFrame[1].covid19[23]);
};

//---------------------------------------------------------

const getSourcData = () =>
  Promise.all([get_confirmed_data(), get_vaccine_data()]).then(
    (sourceData) => ({
      confirmed: sourceData[0],
      vaccine: sourceData[1],
    })
  );

const createDataFrame = (confirmedSourceData: ConfirmedSourceData) => {
  let date = new Date(confirmedSourceData.createDt._text);
  date.setDate(date.getDate() - 1);
  return {
    date: convertDateFormat(date, "-"),
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
  };
};

main();
