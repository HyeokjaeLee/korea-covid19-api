"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.date2query_form = exports.string2date = exports.convert_date_format = void 0;
const convert_date_format = (input_date, form) => {
    const num2str = (num) => (num < 10 ? "0" + num : String(num)), date = new Date(input_date), year = date.getFullYear(), //yyyy
    month = num2str(1 + date.getMonth()), //M
    day = num2str(date.getDate());
    return year + form + month + form + day;
}, string2date = (string_date) => {
    const strArr = string_date.split("-");
    const numArr = [];
    for (let i = 0; i < 3; i++) {
        numArr[i] = Number(strArr[i]);
    }
    const date = new Date(numArr[0], numArr[1] - 1, numArr[2]);
    return date;
}, 
//queryString으로 받은 값과 비교하기 위한 형식으로변환 ex:20210326
date2query_form = (date) => Number(exports.convert_date_format(date, ""));
exports.convert_date_format = convert_date_format, exports.string2date = string2date, 
//queryString으로 받은 값과 비교하기 위한 형식으로변환 ex:20210326
exports.date2query_form = date2query_form;
//# sourceMappingURL=convert-format.js.map