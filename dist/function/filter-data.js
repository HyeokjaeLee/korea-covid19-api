"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filter_infection = void 0;
function filter_infection(sources) {
    const numCollection = {
        incDec: new Array(),
        isolIngCnt: new Array(),
        localOccCnt: new Array(),
        overFlowCnt: new Array(),
    };
    const keys = Object.keys(numCollection);
    {
        sources.forEach((source) => {
            keys.forEach((key) => {
                numCollection[key].push(source[key]);
            });
        });
        keys.forEach((key) => {
            numCollection[key].sort((a, b) => a - b);
        });
    }
    const filteredSources = sources.map((source) => {
        const filteredSource = source;
        keys.forEach((key) => {
            const numArr = numCollection[key];
            const max = 5 * numArr[Math.ceil(numArr.length * 0.99) - 1];
            if ((max !== 0 && source[key] > max) || source[key] < 0)
                filteredSource[key] = undefined;
        });
        if (filteredSource.deathCnt === 0)
            filteredSource.deathCnt = undefined;
        if (filteredSource.defCnt === 0)
            filteredSource.defCnt = undefined;
        if (filteredSource.localOccCnt != undefined && filteredSource.overFlowCnt != undefined)
            filteredSource.incDec = filteredSource.localOccCnt + filteredSource.overFlowCnt;
        if (!!filteredSource.incDec) {
            if (filteredSource.overFlowCnt === undefined && !!filteredSource.localOccCnt)
                filteredSource.overFlowCnt = filteredSource.incDec - filteredSource.localOccCnt;
            else if (filteredSource.localOccCnt === undefined && !!filteredSource.overFlowCnt)
                filteredSource.localOccCnt = filteredSource.incDec - filteredSource.overFlowCnt;
        }
        return filteredSource;
    });
    return filteredSources;
}
exports.filter_infection = filter_infection;
//# sourceMappingURL=filter-data.js.map