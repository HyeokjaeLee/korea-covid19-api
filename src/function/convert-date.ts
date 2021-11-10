/**
 * Date를 정해진 형식의 문자열 Date로 변환
 * @param date
 * @returns yyyy-mm-dd
 */
export function date2string(date: Date) {
  const add0 = (num: number) => (num < 10 ? `0${num}` : `${num}`),
    year = date.getFullYear(),
    month = date.getMonth() + 1,
    day = date.getDate();
  return `${year}-${add0(month)}-${add0(day)}`;
}

/**
 * 날짜비교를 string Date를 number로 변환
 * @param stringDate 2021-01-01
 * @returns yyyymmdd
 */
export const string2num = (stringDate: string) => Number(stringDate.replace(/-/g, ""));

/**
 * Date타입을 6자리 숫자로 변환
 * @param date
 * @returns yyyymmdd
 */
export const date2num = (date: Date) => string2num(date2string(date));

/**
 * 한글 날짜 형식을 Date 타입으로 변환
 * @param korDate 2021년 01월 01일 00시
 * @returns date
 */
export function kor2Date(korDate: string) {
  const replacedKorDate = korDate.replace(/(:?년 |월 |일 .*)/g, "-");
  const date = replacedKorDate.substring(0, replacedKorDate.length - 1);
  return new Date(date);
}
