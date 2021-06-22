"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.date2query_form = exports.string2date = exports.convertDateFormat = void 0;
const convertDateFormat = (input_date, form) => {
    const date = new Date(input_date);
    const num2str = (num) => {
        let result;
        if (num < 10) {
            result = "0" + num;
        }
        else {
            result = String(num);
        }
        return result;
    };
    let year = date.getFullYear(); //yyyy
    let month = num2str(1 + date.getMonth()); //M
    let day = num2str(date.getDate());
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
date2query_form = (date) => Number(exports.convertDateFormat(date, ""));
exports.convertDateFormat = convertDateFormat, exports.string2date = string2date, 
//queryString으로 받은 값과 비교하기 위한 형식으로변환 ex:20210326
exports.date2query_form = date2query_form;
//# sourceMappingURL=format-conversion.js.map