import * as get from "./get-external-data";
import { regionInfo } from "../data/region-info";
import {
  InfectionSourceData,
  VaccinationSourceData,
  DistancingSourceData,
  Covid19,
  RegionInfo,
  RegionData,
} from "../types/data-type";
import { date2string } from "../function/convert-date";

interface TempData extends RegionInfo {
  distancingLevel: number | undefined;
  tempData: {
    infectionArr: InfectionSourceData[];
    vaccinationArr: VaccinationSourceData[];
  };
}
function classify_tempArr(
  distancingArr: DistancingSourceData[],
  infectionArr: InfectionSourceData[],
  vaccinationArr: VaccinationSourceData[]
): TempData[] {
  let remainInfection = infectionArr;
  let remainVaccination = vaccinationArr;
  return regionInfo.map((region) => {
    const distancingLevel = distancingArr.find(
      (distancing) => distancing.region === region.regionKor
    )?.distancingLevel;
    //성능을 위해 이미 분류한 데이터들은 제거
    const _infection: InfectionSourceData[] = [],
      _remainInfection: InfectionSourceData[] = [];
    remainInfection.forEach((infection) => {
      if (infection.gubunEn.replace("-", "") === region.regionEng) _infection.push(infection);
      else _remainInfection.push(infection);
    });
    remainInfection = _remainInfection;

    const _vaccination: VaccinationSourceData[] = [],
      _remainvaccination: VaccinationSourceData[] = [];
    remainVaccination.forEach((vaccination) => {
      if (vaccination.sido === region.regionKorFull) _vaccination.push(vaccination);
      else _remainvaccination.push(vaccination);
    });
    remainVaccination = _remainvaccination;
    return {
      ...region,
      distancingLevel,
      tempData: {
        infectionArr: _infection.reverse(), //source data가 날짜를 역순으로 받아옴
        vaccinationArr: _vaccination,
      },
    };
  });
}

function create_covid19Data(tempData: TempData): Covid19[] {
  const { infectionArr, vaccinationArr } = tempData.tempData;
  const targetInfectionArr = infectionArr.slice(1);
  return targetInfectionArr.map((infection, index) => {
    const date = date2string(new Date(infection.createDt));
    const vaccination = vaccinationArr.find(
      (vaccination) => date2string(new Date(vaccination.baseDate)) === date
    );
    const immunityRatio =
      !!vaccination && !!tempData.population
        ? Math.round(
            ((vaccination?.totalSecondCnt + infection.isolClearCnt) / tempData.population) * 1000
          ) / 1000
        : undefined;

    const aDayAgoInfectionArr = infectionArr[index];
    return {
      date: date,
      confirmed: {
        total: infection.incDec - 1,
        accumlated: aDayAgoInfectionArr.incDec - 1,
      },
      quarantine: {
        total: infection.isolIngCnt,
        new: {
          total: infection.isolIngCnt,
          domestic: infection.localOccCnt,
          overseas: infection.overFlowCnt,
        },
      },
      recovered: {
        total: infection.isolClearCnt,
        new: infection.isolClearCnt - aDayAgoInfectionArr.isolClearCnt,
        accumlated: aDayAgoInfectionArr.isolClearCnt,
      },
      dead: {
        total: infection.defCnt,
        new: infection.defCnt - aDayAgoInfectionArr.defCnt,
        accumlated: aDayAgoInfectionArr.defCnt,
      },
      vaccinated: {
        first: {
          total: vaccination?.totalFirstCnt,
          new: vaccination?.firstCnt,
          accumlated: vaccination?.accumulatedFirstCnt,
        },
        second: {
          total: vaccination?.totalSecondCnt,
          new: vaccination?.secondCnt,
          accumlated: vaccination?.accumulatedSecondCnt,
        },
      },
      per100kConfirmed: infection.qurRate != "-" ? infection.qurRate : undefined,
      immunityRatio: immunityRatio,
    };
  });
}

export async function update(): Promise<RegionData[]> {
  const sourceData = await Promise.all([get.distancing(), get.infection(), get.vaccination()]).then(
    (sourceArr) => sourceArr
  );
  const distancing = sourceData[0];
  const infection = sourceData[1];
  const vaccination = sourceData[2];

  const tempArr = classify_tempArr(distancing, infection, vaccination);
  return tempArr.map((temp) => {
    const _temp: any = temp;
    const covid19Data = create_covid19Data(_temp);
    delete _temp.tempData;
    return {
      ..._temp,
      covid19Data,
    };
  });
}
