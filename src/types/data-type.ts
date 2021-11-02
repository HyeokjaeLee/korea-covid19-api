interface Structure {
  new?: number | null | object;
  accumlated?: number | null;
  total: number | null;
}

interface QuarantineStructure extends Structure {
  new: {
    overseas: number;
    domestic: number;
    total: number;
  };
}

export interface RegionInfo {
  regionEng: string;
  regionKor: string;
  regionKorFull?: string;
  population: number | null;
}

export interface RegionalData extends RegionInfo {
  distancingLevel: number | null;
  covid19DataList: COVID19Data[];
}

interface COVID19Data {
  date: string;
  confirmed: Structure;
  quarantine: QuarantineStructure;
  recovered: Structure;
  dead: Structure;
  vaccinated: {
    first: Structure;
    second: Structure;
  };
  per100kConfirmed: number | null;
  immunityRatio: number | null;
}

export interface InfectionSourceData {
  createDt: string;
  deathCnt: number;
  defCnt: number;
  gubun: string;
  gubunCn: string;
  gubunEn: string;
  incDec: number;
  isolClearCnt: number;
  isolIngCnt: number;
  localOccCnt: number;
  overFlowCnt: number;
  qurRate: number | "-";
  seq: number;
  stdDay: string;
  updateDt: string;
}

export interface VaccinationSourceData {
  accumulatedFirstCnt: number;
  accumulatedSecondCnt: number;
  baseDate: string;
  firstCnt: number;
  secondCnt: number;
  sido: string;
  totalFirstCnt: number;
  totalSecondCnt: number;
}

export interface DistancingSourceData {
  region: string;
  distancingLevel: number;
}
