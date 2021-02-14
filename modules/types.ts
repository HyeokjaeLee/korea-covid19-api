interface confirmed {
  infected: detail;
  recovered: detail;
  death: detail;
}
interface detail {
  new: number | infected;
  existing: number;
  total: number;
}

interface infected {
  local: number;
  overseas: number;
}
export interface covid19Info {
  date: string | Date;
  confirmed: confirmed;
}

export interface regionList {
  kor: string;
  eng: string;
}
