"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.covid19Schema = void 0;
exports.covid19Schema = `
    type DataSet {
      regionEng: String
      regionKor: String
      population: Int
      covid19: [Covid19]
    }

    type Covid19 {
      date: String
      confirmed: Confirmed
      quarantine: Quarantine
      recovered: BasicStructure
      dead: BasicStructure
      vaccination: Vaccination
      per100kConfirmed: Int
    }

    type BasicStructure {
      total: Int
      new: Int
      accumlated: Int
    }

    type Confirmed {
      total: Int
      accumlated: Int
    }

    type Quarantine {
      total: Int
      new: QuarantineNew
    }

    type QuarantineNew {
      total: Int
      domestic: Int
      overseas: Int
    }

    type Vaccination   {
      first: BasicStructure
      second: BasicStructure
    }
`;
//# sourceMappingURL=covid19-schema.js.map