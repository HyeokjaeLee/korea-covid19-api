export const covid19Schema = `
    type RegionalData {
      regionEng: String
      regionKor: String
      population: Int
      covid19DataList: [Covid19DataList]
    }

    type Covid19DataList {
      date: String
      confirmed: Confirmed
      quarantine: Quarantine
      recovered: BasicStructure
      dead: BasicStructure
      vaccination: Vaccination
      per100kConfirmed: Float
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
