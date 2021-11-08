import * as get from "./get-external-data";
import { regionInfo } from "../data/region-info";
import { date2string } from "../function/convert-date";
import { filter_infection } from "./infection-source-filter";

export async function update() {
  const sourceData = await Promise.all([get.distancing(), get.infection(), get.vaccination()]);
  const source = {
    distancingArr: sourceData[0],
    infectionArr: sourceData[1],
    vaccinationArr: sourceData[2],
  };
  const tempArr = classify_tempArr(source);
  return tempArr.map((temp) => {
    const covid19Data = create_covid19Data(temp);
    delete temp.tempData;
    delete temp.regionKorFull;
    return {
      ...temp,
      covid19Data,
    };
  });
}

function classify_tempArr(source: {
  distancingArr: Source.Distancing[];
  infectionArr: Source.Infection[];
  vaccinationArr: Source.Vaccination[];
}): Region.Temp[] {
  const { distancingArr, infectionArr, vaccinationArr } = source;
  let remainInfection = infectionArr;
  let remainVaccination = vaccinationArr;
  return regionInfo.map((region) => {
    const distancingLevel = distancingArr.find(
      (distancing) => distancing.region === region.regionKor
    )?.distancingLevel;
    //성능을 위해 이미 분류한 데이터들은 제거
    let _infection: Source.Infection[] = [],
      _remainInfection: Source.Infection[] = [];
    remainInfection.forEach((infection) => {
      if (infection.gubunEn.replace("-", "") === region.regionEng) _infection.push(infection);
      else _remainInfection.push(infection);
    });
    _infection.reverse(); //source data가 날짜를 역순으로 받아옴
    remainInfection = _remainInfection;
    let _vaccination: Source.Vaccination[] = [],
      _remainvaccination: Source.Vaccination[] = [];
    remainVaccination.forEach((vaccination) => {
      if (vaccination.sido === region.regionKorFull) _vaccination.push(vaccination);
      else _remainvaccination.push(vaccination);
    });
    remainVaccination = _remainvaccination;
    return {
      ...region,
      distancingLevel,
      tempData: {
        infectionArr: filter_infection(_infection),
        vaccinationArr: _vaccination,
      },
    };
  });
}

function create_covid19Data(tempData: Region.Temp) {
  const { infectionArr, vaccinationArr } = tempData.tempData!;
  const targetInfectionArr = infectionArr.slice(1);
  return targetInfectionArr.map((infection, index) => {
    const date = date2string(new Date(infection.createDt));
    const vaccination = vaccinationArr.find(
      (vaccination) => date2string(new Date(vaccination.baseDate)) === date
    );
    const immunityRatio =
      !!vaccination?.totalSecondCnt && !!tempData.population && !!infection.isolClearCnt
        ? Math.round(
            ((vaccination!.totalSecondCnt + infection.isolClearCnt) / tempData.population) * 1000
          ) / 1000
        : undefined;

    const minus = (num1: number | undefined, num2: number | undefined) =>
      !!num1 && !!num2 ? num1 - num2 : undefined;

    const aDayAgoInfectionArr = infectionArr[index];
    return {
      date: date,
      confirmed: {
        total: infection.defCnt,
        accumlated: aDayAgoInfectionArr.defCnt,
      },
      quarantine: {
        total: infection.isolIngCnt,
        new: {
          total: infection.incDec,
          domestic: infection.localOccCnt,
          overseas: infection.overFlowCnt,
        },
      },
      recovered: {
        total: infection.isolClearCnt,
        new: minus(infection.isolClearCnt, aDayAgoInfectionArr.isolClearCnt),
        accumlated: aDayAgoInfectionArr.isolClearCnt,
      },
      dead: {
        total: infection.deathCnt,
        new: minus(infection.deathCnt, aDayAgoInfectionArr.deathCnt),
        accumlated: aDayAgoInfectionArr.deathCnt,
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
