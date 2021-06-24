interface Confirmed {
  infected: Detail;
  recovered: Detail;
  death: Detail;
  total: number;
}
interface Detail {
  new: number | Infected;
  existing: number;
  total: number;
}

interface Infected {
  local: number;
  overseas: number;
  total: number;
}
export interface TotalData {
  date: Date;
  confirmed: Confirmed;
}

export interface RegionList {
  kor: string;
  eng: string;
}

export interface Final {
  region: string;
  data: TotalData[];
}

export interface OriginalAPI {
  region: string;
  date: Date;
  infected: number;
  new_local_infection: number;
  new_overseas_infection: number;
  new_infected: number;
  death: number;
  recovered: number;
  confirmed: number;
}

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

interface COVID19DataSet {
  regionEng: string;
  regionKor: string;
  population: number | null;
  covid19: COVID19Data[];
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
  per100kConfirmed: number;
}
