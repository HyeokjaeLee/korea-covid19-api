import {
  InfectionData,
  InfectionSourceData,
  InfectionNumerical,
  VaccinationData,
  VaccinationSourceData,
  VaccinationNumerical,
} from "../types/data-type";

export function infection(infectionArr: InfectionData[]) {
  return infectionArr.map((infection) => {
    infection.deathCnt === 0 && (infection.deathCnt = undefined);
    infection.isolClearCnt === 0 && (infection.isolClearCnt = undefined);
    infection.defCnt === 0 && (infection.defCnt = undefined);
    return infection;
  });
}

function make_infectionNumArr(infectionSourceData: InfectionSourceData[]): InfectionNumerical {
  const infectionNumArr: any = {
    deathCnt: [],
    defCnt: [],
    incDec: [],
    isolClearCnt: [],
    isolIngCnt: [],
    localOccCnt: [],
    overFlowCnt: [],
    qurRate: [],
  };
  const keys = Object.keys(infectionNumArr);
  infectionSourceData.forEach((infection: any) => {
    keys.forEach((key) => {
      typeof infection[key] === "number" && infectionNumArr[key].push(infection[key]);
    });
  });
  keys.forEach((key) => {
    infectionNumArr[key].sort((a: number, b: number) => a - b);
  });
  return infectionNumArr;
}

function calcu_outlierRange(numArr: number[]) {
  const calc_quartile = (index: 1 | 2 | 3 | 4) => {
    const realNum = index * ((numArr.length + 1) / 4);
    return (
      (numArr[Math.floor(realNum)] / 4) * index + (numArr[Math.ceil(realNum)] / 4) * (4 - index)
    );
  };
  const quartile_1st = calc_quartile(1);
  const quartile_3rd = calc_quartile(3);
  const quartileRange = quartile_3rd - quartile_1st;
  return {
    min: quartile_1st - quartileRange * 1.5,
    max: quartile_3rd + quartileRange * 1.5,
  };
}

export function filter_infection(infectionSources: InfectionSourceData[]) {
  const infectionNumArr: any = make_infectionNumArr(infectionSources);
  const keys = Object.keys(infectionNumArr);
  const filteredData: InfectionData[] = infectionSources.map((infectionSource: any) => {
    keys.forEach((key) => {
      const outlierRange = calcu_outlierRange(infectionNumArr[key]);
      if (infectionSource[key] < outlierRange.min || infectionSource[key] > outlierRange.max)
        console.log(key, infectionSource[key], outlierRange.min, outlierRange.max);
      infectionSource[key] = undefined;
    });
    return infectionSource;
  });
  return filteredData;
}
