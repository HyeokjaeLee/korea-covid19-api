declare namespace Filtered {
  interface Infection {
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

  interface Vaccination {
    accumulatedFirstCnt: number | undefined;
    accumulatedSecondCnt: number | undefined;
    baseDate: string;
    firstCnt: number;
    secondCnt: number;
    sido: string;
    totalFirstCnt: number | undefined;
    totalSecondCnt: number | undefined;
  }
}

declare namespace Source {
  interface Infection extends Filtered.Infection {
    deathCnt: number;
    defCnt: number;
    incDec: number;
    isolClearCnt: number;
    isolIngCnt: number;
    localOccCnt: number;
    overFlowCnt: number;
  }
  interface Vaccination extends Filtered.Vaccination {
    accumulatedFirstCnt: number;
    accumulatedSecondCnt: number;
    totalFirstCnt: number;
    totalSecondCnt: number;
  }
  interface Distancing {
    region: string;
    distancingLevel: number;
  }
}

declare namespace Region {
  interface Default {
    nameEng: string;
    nameKor: string;
    nameKorFull?: string;
    population: number | undefined;
  }
  interface Final {
    distancingLevel: number | undefined;
    covid19: Covid19[];
    nameEng: string;
    nameKor: string;
    population: number | undefined;
  }
}

interface Args {
  name: string | undefined;
  startDate: number | undefined;
  endDate: number | undefined;
  onlyLastDate: boolean | undefined;
}

interface Covid19 {
  date: string;
  ratePer100k: number | undefined;
  immunityRatio: number | undefined;
  quarantine: number | undefined;
  confirmed: {
    total: number | undefined;
    new: {
      total: number | undefined;
      domestic: number | undefined;
      overseas: number | undefined;
    };
    accumlated: number | undefined;
  };
  recovered: Detail;
  dead: Detail;
  vaccinated: {
    first: Detail;
    second: Detail;
  };
}

interface Detail {
  total: number | undefined;
  new: number | undefined;
  accumlated: number | undefined;
}
