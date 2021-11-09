export const covid19Schema = `
  enum Region {
    Seoul
    Total
    Gyeonggido
    Daegu
    Incheon
    Busan
    Ulsan
    Daejeon
    Gwangju
    Sejong
    Chungcheongnamdo
    Chungcheongbukdo
    Gyeongsangnamdo
    Gyeongsangbukdo
    Jeollanamdo
    Jeollabukdo
    Gangwondo
    Jeju
    Lazaretto
  }

  type Query {
    regionalDataList(region: Region, startDate: Int, endDate: Int, onlyLastDate: Boolean): [RegionalData]
  }

  type RegionalData {
    regionEng: String
    regionKor: String
    population: Int
    distancingLevel: Float
    covid19Data: [covid19Data]
  }

  type covid19Data {
    date: String
    confirmed: Confirmed
    quarantine: Quarantine
    recovered: Detail
    dead: Detail
    vaccinated: Vaccinated
    per100kConfirmed: Float
    immunityRatio: Float
  }

  type Detail {
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
  
  type Vaccinated   {
    first: Detail
    second: Detail
  }
`;
