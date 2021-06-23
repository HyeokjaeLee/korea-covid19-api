import { get_confirmed_data } from "./get_confirmed_data";
import { get_vaccine_data } from "./get_vaccine_data";
import { convertDateFormat } from "../function/format-conversion";
import { regionInfo } from "../data/region_info";
export const combine_data = async () => {
  const combineData = await Promise.all([
    get_confirmed_data(),
    get_vaccine_data(),
  ]).then((sourceData: any) =>
    sourceData[0].map((confirmedData: any, index: number) => {
      const regionEng = confirmedData.gubunEn._text;
      const combinedData: any = {
        region_kor: regionInfo.find(
          (element) => element.region_eng == regionEng
        )?.region_kor,
        region_eng: regionEng,
        date: convertDateFormat(confirmedData.createDt._text, "-"),
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
        per100000rate:
          confirmedData.qurRate._text != "-"
            ? Number(confirmedData.qurRate._text)
            : null,
      };
      const vaccineData = sourceData[1].find(
        (element: any) =>
          element.sido == combinedData.region_kor &&
          convertDateFormat(element.baseDate, "-") == combinedData.date
      );
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
    })
  );
  return combineData;
};
combine_data();
