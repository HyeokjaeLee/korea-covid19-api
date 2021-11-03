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
 *
 * @param date
 * @returns yyyymmdd
 */
export const date2num = (date: Date) => string2num(date2string(date));
