import * as get from "./get-external-data";
import { regionInfos } from "../data/region-info";
import { date2string } from "./convert-date";
import { Filter } from "./source-filter";
export async function update() {
  const sourceData = await Promise.all([get.distancing(), get.infection(), get.vaccination()]),
    distancingArr = sourceData[0],
    infectionArr = sourceData[1],
    vaccinationArr = sourceData[2];

  const RegionArr = regionInfos.map((regionInfo: Region.Default) => {
    const distancingLevel = find_distancingLevel(regionInfo.regionKor, distancingArr);
    const _infectionArr = Filter.infection(find_infection(regionInfo.regionEng, infectionArr));
    const _vaccinationArr = find_vaccination(regionInfo.regionKorFull!, vaccinationArr);
    const requiredData = {
      infectionArr: _infectionArr,
      vaccinationArr: _vaccinationArr,
      population: regionInfo.population,
    };
    const covid19Data = create_covid19Data(requiredData);
    const result = {
      ...regionInfo,
      distancingLevel: distancingLevel,
      covid19Data: covid19Data,
    };
    delete result.regionKorFull;
    return result;
  });

  return RegionArr;
}

function find_distancingLevel(region: string, distancingArr: Source.Distancing[]) {
  return distancingArr.find((distancing) => distancing.region === region)?.distancingLevel;
}

function find_infection(regionEng: string, infectionArr: Source.Infection[]) {
  return infectionArr.filter((infection) => infection.gubunEn.replace("-", "") === regionEng);
}

function find_vaccination(regionKorFull: string, vaccinationArr: Source.Vaccination[]) {
  return vaccinationArr.filter((vaccination) => vaccination.sido === regionKorFull);
}

function create_covid19Data(requiredData: {
  infectionArr: Filtered.Infection[];
  vaccinationArr: Filtered.Vaccination[];
  population: number | undefined;
}) {
  const { infectionArr, vaccinationArr, population } = requiredData;
  const minus = (num1: number | undefined, num2: number | undefined) =>
    !!num1 && !!num2 ? num1 - num2 : undefined;
  return infectionArr.slice(1).map((infection, index) => {
    const date = date2string(new Date(infection.createDt));
    const vaccination = vaccinationArr.find(
      (vaccination) => date2string(new Date(vaccination.baseDate)) === date
    );
    const immunityRatio =
      !vaccination?.totalSecondCnt || !population || !infection.isolClearCnt
        ? undefined
        : Math.round(((vaccination!.totalSecondCnt + infection.isolClearCnt) / population) * 1000) /
          1000;

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
