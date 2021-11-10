"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kor2Date = exports.date2num = exports.string2num = exports.date2string = void 0;
/**
 * Date를 정해진 형식의 문자열 Date로 변환
 * @param date
 * @returns yyyy-mm-dd
 */
function date2string(date) {
    const add0 = (num) => (num < 10 ? `0${num}` : `${num}`), year = date.getFullYear(), month = date.getMonth() + 1, day = date.getDate();
    return `${year}-${add0(month)}-${add0(day)}`;
}
exports.date2string = date2string;
/**
 * 날짜비교를 string Date를 number로 변환
 * @param stringDate 2021-01-01
 * @returns yyyymmdd
 */
const string2num = (stringDate) => Number(stringDate.replace(/-/g, ""));
exports.string2num = string2num;
/**
 * Date타입을 6자리 숫자로 변환
 * @param date
 * @returns yyyymmdd
 */
const date2num = (date) => (0, exports.string2num)(date2string(date));
exports.date2num = date2num;
/**
 * 한글 날짜 형식을 Date 타입으로 변환
 * @param korDate 2021년 01월 01일 00시
 * @returns date
 */
function kor2Date(korDate) {
    const replacedKorDate = korDate.replace(/(:?년 |월 |일 .*)/g, "-");
    const date = replacedKorDate.substring(0, replacedKorDate.length - 1);
    return new Date(date);
}
exports.kor2Date = kor2Date;
//# sourceMappingURL=convert-date.js.map