"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.infection = void 0;
function infection(infectionArr) {
  return infectionArr.map((infection) => {
    infection.deathCnt === 0 && (infection.deathCnt = null);
    infection.isolClearCnt === 0 && (infection.isolClearCnt = null);
    infection.defCnt === 0 && (infection.defCnt = null);
    return infection;
  });
}
exports.infection = infection;
//# sourceMappingURL=filter-data.js.map
