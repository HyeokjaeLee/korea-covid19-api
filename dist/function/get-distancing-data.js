"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_distancing_data = void 0;
var request_1 = __importDefault(require("request"));
/**
 * 한국 사회적 거리두기 현황 사이트 원본 소스를 가져와 파싱후 반환
 * @returns 지역명과 거리두기 단계를 가진 Object Array
 * * cheerio로 크롤링 해서 사용하려 했으나 해당 사이트의 작동방식 때문에 사용이 불가능해서 string 형식으로 파싱하여 사용함
 */
var get_distancing_data = function () {
    return new Promise(function (resolve, reject) {
        (0, request_1.default)("http://ncov.mohw.go.kr/regSocdisBoardView.do", function (error, response, body) {
            /**지역 구분 '전국'의 거리두기 단계를 전지역 평균으로 지정하기 위한 계산을 위해 모든 지역의 거리두기 단계를 더한 값*/
            var distancingLevelSum = 0;
            var sourceData = response.body;
            /**원본 소스 script태그의 거리두기 데이터가 있는 위치의 시작 문자열*/
            var startBaseStringValue = "RSS_DATA = [";
            var dataStartIndex = sourceData.indexOf(startBaseStringValue) +
                startBaseStringValue.length;
            var dataEndIndex = sourceData.indexOf("]", dataStartIndex);
            //거리두기 데이터가 있는 문자열 저장 & 공백 제거
            sourceData = sourceData
                .substring(dataStartIndex, dataEndIndex)
                .replace(/\s/g, "");
            /**
             * 단순 string 값을 지역 단위로 나누어 놓은 배열
             ** '{caution'으로 문자열이 시작하기 때문에 첫 값 제외*/
            var splitSourceDataList = sourceData.split("{caution").splice(1);
            /**지역과 거리두기 단계를 가지는 Object Array*/
            var distancingDataList = splitSourceDataList.map(function (splitSourceData) {
                /**거리두기 단계를 가지는 문자열의 시작 위치*/
                var distancingLevelIndex = splitSourceData.indexOf("value") + 7;
                /**지역 이름을 가지는 문자열의 시작 위치*/
                var regionIndex = splitSourceData.indexOf("//") + 2;
                /**거리두기 단계*/
                var distancingLevel = Number(splitSourceData.substr(distancingLevelIndex, 1));
                distancingLevelSum += distancingLevel;
                return {
                    region: splitSourceData.substr(regionIndex, 2),
                    distancingLevel: distancingLevel,
                };
            });
            // 지역 구분 '전국' Object를 추가
            distancingDataList.push({
                region: "전국",
                //전지역의 평균을 소숫점 첫째 자리에서 반올림 한 값을 거리두기 단계로 지정
                distancingLevel: Math.round((distancingLevelSum / distancingDataList.length) * 10) /
                    10,
            });
            resolve(distancingDataList);
        });
    });
};
exports.get_distancing_data = get_distancing_data;
//# sourceMappingURL=get-distancing-data.js.map