interface Structure {
  new?: number | undefined | object;
  accumlated?: number | undefined;
  total: number | undefined;
}

interface QuarantineStructure extends Structure {
  new: {
    overseas: number | undefined;
    domestic: number | undefined;
    total: number | undefined;
  };
}

export interface RegionInfo {
  regionEng: string;
  regionKor: string;
  regionKorFull?: string;
  population: number | undefined;
}

export interface RegionalData extends RegionInfo {
  distancingLevel: number | null | undefined;
  covid19DataList: COVID19Data[];
}

export interface COVID19Data {
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

interface PartData {
  new?: number | undefined | object;
  accumlated?: number | undefined;
  total: number | undefined;
}

interface QuarantinePartData extends PartData {
  new: {
    overseas: number;
    domestic: number;
    total: number;
  };
}

export interface Covid19 {
  date: string;
  confirmed: PartData;
  quarantine: QuarantinePartData;
  recovered: PartData;
  dead: PartData;
  vaccinated: {
    first: PartData;
    second: PartData;
  };
  per100kConfirmed: number | undefined;
  immunityRatio: number | undefined;
}

export interface RegionData extends RegionInfo {
  distancingLevel: number | undefined;
  covid19Data: Covid19[];
}

export interface InfectionData {
  /**등록일시분초 */
  createDt: string;
  /**사망자 수*/
  deathCnt: number | undefined;
  /**확진자 수*/
  defCnt: number | undefined;
  /**시도명(한글)*/
  gubun: string;
  /**시도명(중국어)*/
  gubunCn: string;
  /**시도명(영어)*/
  gubunEn: string;
  /**전일대비 증감 수*/
  incDec: number;
  /**격리 해제 수*/
  isolClearCnt: number | undefined;
  /**격리중 환자수*/
  isolIngCnt: number;
  /**지역발생 수 */
  localOccCnt: number;
  /**해왜유입 수 */
  overFlowCnt: number;
  /**10만명당 발생률*/
  qurRate: number | "-";
  /**게시물 번호*/
  seq: number;
  /**기준일시*/
  stdDay: string;
  /**수정일시분초*/
  updateDt: string;
}

export interface InfectionSourceData extends InfectionData {
  deathCnt: number;
  defCnt: number;
  isolClearCnt: number;
}

export interface VaccinationData {
  accumulatedFirstCnt: number | undefined;
  accumulatedSecondCnt: number | undefined;
  baseDate: string;
  firstCnt: number;
  secondCnt: number;
  sido: string;
  totalFirstCnt: number | undefined;
  totalSecondCnt: number | undefined;
}

export interface VaccinationSourceData extends VaccinationData {
  accumulatedFirstCnt: number;
  accumulatedSecondCnt: number;
  totalFirstCnt: number;
  totalSecondCnt: number;
}

export interface DistancingSourceData {
  region: string;
  distancingLevel: number;
}

//여기서부터 다시

export interface Infection {
  /**등록일시분초 */
  createDt: string;
  /**사망자 수*/
  deathCnt: number | undefined;
  /**확진자 수*/
  defCnt: number | undefined;
  /**시도명(한글)*/
  gubun: string;
  /**시도명(중국어)*/
  gubunCn: string;
  /**시도명(영어)*/
  gubunEn: string;
  /**전일대비 증감 수*/
  incDec: number | undefined;
  /**격리 해제 수*/
  isolClearCnt: number | undefined;
  /**격리중 환자수*/
  isolIngCnt: number | undefined;
  /**지역발생 수 */
  localOccCnt: number | undefined;
  /**해왜유입 수 */
  overFlowCnt: number | undefined;
  /**10만명당 발생률*/
  qurRate: number | "-";
  /**게시물 번호*/
  seq: number;
  /**기준일시*/
  stdDay: string;
  /**수정일시분초*/
  updateDt: string;
}

export interface InfectionSource extends Infection {
  deathCnt: number;
  defCnt: number;
  incDec: number;
  isolClearCnt: number;
  isolIngCnt: number;
  localOccCnt: number;
  overFlowCnt: number;
}

export interface Vaccination {
  accumulatedFirstCnt: number | undefined;
  accumulatedSecondCnt: number | undefined;
  baseDate: string;
  firstCnt: number | undefined;
  secondCnt: number | undefined;
  sido: string;
  totalFirstCnt: number | undefined;
  totalSecondCnt: number | undefined;
}

export interface VaccinationSource extends Vaccination {
  firstCnt: number;
  secondCnt: number;
  accumulatedFirstCnt: number;
  accumulatedSecondCnt: number;
  totalFirstCnt: number;
  totalSecondCnt: number;
}
