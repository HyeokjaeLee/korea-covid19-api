"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.date2query_form = exports.string2date = exports.convert_date_format = void 0;
var convert_date_format = function (input_date, form) {
    var num2str = function (num) { return (num < 10 ? "0" + num : String(num)); }, date = new Date(input_date), year = date.getFullYear(), //yyyy
    month = num2str(1 + date.getMonth()), //M
    day = num2str(date.getDate());
    return year + form + month + form + day;
}, string2date = function (string_date) {
    var strArr = string_date.split("-");
    var numArr = [];
    for (var i = 0; i < 3; i++) {
        numArr[i] = Number(strArr[i]);
    }
    var date = new Date(numArr[0], numArr[1] - 1, numArr[2]);
    return date;
}, 
//queryString으로 받은 값과 비교하기 위한 형식으로변환 ex:20210326
date2query_form = function (date) {
    return Number((0, exports.convert_date_format)(date, ""));
};
exports.convert_date_format = convert_date_format, exports.string2date = string2date, 
//queryString으로 받은 값과 비교하기 위한 형식으로변환 ex:20210326
exports.date2query_form = date2query_form;
//# sourceMappingURL=convert-format.js.map