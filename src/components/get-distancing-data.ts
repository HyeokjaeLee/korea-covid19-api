import request from "request";
//cheerio로 크롤링 해서 사용하려 했으나 해당 사이트의 작동방식 때문에 사용이 불가능해서 string 형식으로 파싱하여 사용함
export const get_distancing_level_data = () =>
  new Promise((resolve, reject) => {
    request(
      "http://ncov.mohw.go.kr/regSocdisBoardView.do",
      (error, response, body) => {
        let sourceData: string = response.body;
        const startBaseStringValue = "RSS_DATA = [",
          dataStartIndex =
            sourceData.indexOf(startBaseStringValue) +
            startBaseStringValue.length,
          dataEndIndex = sourceData.indexOf("]", dataStartIndex);
        sourceData = sourceData
          .substring(dataStartIndex, dataEndIndex)
          .replace(/\s/g, "");
        const splitSourceDataList = sourceData.split("{caution").splice(1),
          resultDataList = splitSourceDataList.map((splitSourceData) => {
            const distancingLevelIndex = splitSourceData.indexOf("value") + 7,
              regionIndex = splitSourceData.indexOf("//") + 2;
            return {
              region: splitSourceData.substr(regionIndex, 2),
              distancingLevel: Number(
                splitSourceData.substr(distancingLevelIndex, 1)
              ),
            };
          });
        resolve(resultDataList);
      }
    );
  });
