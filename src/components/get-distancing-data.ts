import request from "request";
//cheerio로 크롤링 해서 사용하려 했으나 해당 사이트의 작동방식 때문에 사용이 불가능해서 string 형식으로 파싱하여 사용함
export const get_distancing_level_data = () =>
  new Promise((resolve, reject) => {
    request(
      "http://ncov.mohw.go.kr/regSocdisBoardView.do",
      (error, response, body) => {
        let sourceData: string = response.body; //거리두기 현황 사이트의 원본 소스를 string값으로 변수에 저장
        const startBaseStringValue = "RSS_DATA = [", //script태그의 거리두기 데이터가 있는 곳의 시작 문자열
          dataStartIndex = // 거리두기 현황 사이트의 원본 소스에서 거리두기 데이터가 있는 시작 위치
            sourceData.indexOf(startBaseStringValue) +
            startBaseStringValue.length,
          dataEndIndex = sourceData.indexOf("]", dataStartIndex); // 거리두기 현황 사이트의 원본 소스에서 거리두기 데이터가 있는 끝 위치
        sourceData = sourceData //거리두기 데이터가 있는 문자열 저장 & 공백 제거
          .substring(dataStartIndex, dataEndIndex)
          .replace(/\s/g, "");
        const splitSourceDataList = sourceData.split("{caution").splice(1), //{caution으로 문자열이 시작하기 때문에 첫 값을 제외하고 리스트로 만듬
          resultDataList = splitSourceDataList.map((splitSourceData) => {
            const distancingLevelIndex = splitSourceData.indexOf("value") + 7, //거리두기 데이터가 있는 곳의 시작 위치
              regionIndex = splitSourceData.indexOf("//") + 2; //주석처리 되어있던 지역 정보의 시작 위치
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
