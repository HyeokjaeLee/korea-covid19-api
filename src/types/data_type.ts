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

export interface COVID19DataSet {
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
