declare namespace Infection {
  interface Filtered {
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
  interface Source extends Filtered {
    deathCnt: number;
    defCnt: number;
    incDec: number;
    isolClearCnt: number;
    isolIngCnt: number;
    localOccCnt: number;
    overFlowCnt: number;
  }
}
