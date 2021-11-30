"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Filter = void 0;
var Filter;
(function (Filter) {
    function infection(sourceArr) {
        const { numCollection, keys } = create_numCollection(sourceArr);
        return sourceArr.map((source) => {
            const filteredSource = source, clean_if_0 = (key) => filteredSource[key] === 0 && (filteredSource[key] = undefined), deduce_inc = () => {
                !!filteredSource.incDec
                    ? !!filteredSource.overFlowCnt
                        ? (filteredSource.localOccCnt = filteredSource.incDec - filteredSource.overFlowCnt)
                        : !!filteredSource.localOccCnt &&
                            (filteredSource.overFlowCnt = filteredSource.incDec - filteredSource.localOccCnt)
                    : filteredSource.localOccCnt != undefined &&
                        filteredSource.overFlowCnt != undefined &&
                        (filteredSource.incDec = filteredSource.localOccCnt + filteredSource.overFlowCnt);
            }, clean_out_of_range = () => {
                keys.forEach((key) => {
                    const nums = numCollection[key];
                    const PERCENTILE = 0.99;
                    const ALLOW_MULTIPLE = 5;
                    const max = ALLOW_MULTIPLE * nums[Math.ceil(nums.length * PERCENTILE) - 1];
                    const isBiggerThanMax = max !== 0 && source[key] > max;
                    const isNegative = source[key] < 0;
                    (isBiggerThanMax || isNegative) && (filteredSource[key] = undefined);
                });
            };
            clean_out_of_range();
            clean_if_0("deathCnt");
            clean_if_0("defCnt");
            clean_if_0("isolClearCnt");
            deduce_inc();
            return filteredSource;
        });
    }
    Filter.infection = infection;
})(Filter = exports.Filter || (exports.Filter = {}));
/**
 * 특정 키의 값들을 한배열에 모아서 각각의 키에 대한 값들을 오름차순으로 가지는 객체를 생성
 * @param sourceArr
 * @returns 각각의 키에 대한 값들을 오름차순으로 가지고 있는 객체
 */
function create_numCollection(sourceArr) {
    const numCollection = {
        incDec: new Array(),
        localOccCnt: new Array(),
        overFlowCnt: new Array(),
    };
    const keys = Object.keys(numCollection);
    {
        sourceArr.forEach((source) => {
            keys.forEach((key) => {
                numCollection[key].push(source[key]);
            });
        });
        keys.forEach((key) => {
            numCollection[key].sort((a, b) => a - b);
        });
    }
    return { numCollection, keys };
}
//# sourceMappingURL=source-filter.js.map