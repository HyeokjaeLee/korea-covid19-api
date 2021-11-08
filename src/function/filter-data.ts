export function filter_infection(sources: Infection.Source[]) {
  const numCollection = {
    incDec: new Array<number>(),
    isolIngCnt: new Array<number>(),
    localOccCnt: new Array<number>(),
    overFlowCnt: new Array<number>(),
  };
  type Key = keyof typeof numCollection;
  const keys = Object.keys(numCollection) as Key[];
  {
    sources.forEach((source) => {
      keys.forEach((key) => {
        numCollection[key].push(source[key]);
      });
    });
    keys.forEach((key) => {
      numCollection[key].sort((a: number, b: number) => a - b);
    });
  }
  const filteredSources = sources.map((source) => {
    const filteredSource = source as Infection.Filtered;
    keys.forEach((key) => {
      const numArr: number[] = numCollection[key];
      const max = 5 * numArr[Math.ceil(numArr.length * 0.99) - 1];
      if ((max !== 0 && source[key] > max) || source[key] < 0) filteredSource[key] = undefined;
    });
    if (filteredSource.deathCnt === 0) filteredSource.deathCnt = undefined;
    if (filteredSource.defCnt === 0) filteredSource.defCnt = undefined;
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
