export const covid19Schema = `
  type Query {
    region(name: Name, startDate: Int, endDate: Int, onlyLastDate: Boolean): [Region]
  }

  enum Name {
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

  type Region {
    nameEng: String
    nameKor: String
    population: Int
    covid19: [Covid19]
  }

  type Covid19 {
    date: String
    ratePer100k: Float
    immunityRatio: Float
    confirmed: Confirmed
    recovered: Detail
    dead: Detail
    vaccinated: Vaccinated
  }

  type Detail {
    total: Int
    new: Int
    accumlated: Int
  }

  type Confirmed {
    total: Int
    new: NewConfirmed
    accumlated: Int
  }

  type NewConfirmed {
    total: Int
    domestic: Int
    overseas: Int
  }
  
  type Vaccinated   {
    first: Detail
    second: Detail
  }
`;
