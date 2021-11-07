"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filter_infection = exports.infection = void 0;
function infection(infectionArr) {
    return infectionArr.map((infection) => {
        infection.deathCnt === 0 && (infection.deathCnt = undefined);
        infection.isolClearCnt === 0 && (infection.isolClearCnt = undefined);
        infection.defCnt === 0 && (infection.defCnt = undefined);
        return infection;
    });
}
exports.infection = infection;
function make_infectionNumArr(infectionSourceData) {
    const infectionNumArr = {
        deathCnt: [],
        defCnt: [],
        incDec: [],
        isolClearCnt: [],
        isolIngCnt: [],
        localOccCnt: [],
        overFlowCnt: [],
        qurRate: [],
    };
    const keys = Object.keys(infectionNumArr);
    infectionSourceData.forEach((infection) => {
        keys.forEach((key) => {
            typeof infection[key] === "number" && infectionNumArr[key].push(infection[key]);
        });
    });
    keys.forEach((key) => {
        infectionNumArr[key].sort();
    });
    return infectionNumArr;
}
function calcu_outlierRange(numArr) {
    const calc_quartile = (index) => {
        const realNum = index * ((numArr.length + 1) / 4);
        return ((numArr[Math.floor(realNum)] / 4) * index + (numArr[Math.ceil(realNum)] / 4) * (4 - index));
    };
    const quartile_1st = calc_quartile(1);
    const quartile_3rd = calc_quartile(3);
    const quartileRange = quartile_3rd - quartile_1st;
    return {
        min: quartile_1st - quartileRange * 1.5,
        max: quartile_3rd + quartileRange * 1.5,
    };
}
function filter_infection(infectionSources) {
    const infectionNumArr = make_infectionNumArr(infectionSources);
    const filteredData = infectionSources.map((infectionSource) => {
        const keys = Object.keys(infectionNumArr);
        keys.forEach((key) => {
            const outlierRange = calcu_outlierRange(infectionNumArr[key]);
            if (infectionSource[key] < outlierRange.min || infectionSource[key] > outlierRange.max)
                infectionSource[key] = undefined;
        });
        return infectionSource;
    });
    return filteredData;
}
exports.filter_infection = filter_infection;
//# sourceMappingURL=filter-data.js.map