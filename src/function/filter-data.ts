import {
  InfectionData,
  VaccinationData,
  InfectionSourceData,
  VaccinationSourceData,
  DistancingSourceData,
  Covid19,
  RegionInfo,
  RegionData,
} from "../types/data-type";

export function infection(infectionArr: InfectionData[]) {
  return infectionArr.map((infection) => {
    infection.deathCnt === 0 && (infection.deathCnt = undefined);
    infection.isolClearCnt === 0 && (infection.isolClearCnt = undefined);
    infection.defCnt === 0 && (infection.defCnt = undefined);
    return infection;
  });
}
