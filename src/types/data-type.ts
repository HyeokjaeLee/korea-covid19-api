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

export interface COVID19DataSet extends RegionInfo {
  covid19DataList: COVID19Data[];
}

interface COVID19Data {
  date: string;
  confirmed: Structure;
  quarantine: QuarantineStructure;
  recovered: Structure;
  dead: Structure;
  vaccination: {
    first: Structure;
    second: Structure;
  };
  per100kConfirmed: number | null;
}

interface SourceText {
  _text: string;
}
export interface ConfirmedSourceData {
  createDt: SourceText;
  deathCnt: SourceText;
  defCnt: SourceText;
  gubun: SourceText;
  gubunCn: SourceText;
  gubunEn: SourceText;
  incDec: SourceText;
  isolClearCnt: SourceText;
  isolIngCnt: SourceText;
  localOccCnt: SourceText;
  overFlowCnt: SourceText;
  qurRate: SourceText;
  seq: SourceText;
  stdDay: SourceText;
  updateDt: SourceText;
}

export interface VaccineSourceData {
  accumulatedFirstCnt: number;
  accumulatedSecondCnt: number;
  baseDate: string;
  firstCnt: number;
  secondCnt: number;
  sido: string;
  totalFirstCnt: number;
  totalSecondCnt: number;
}
