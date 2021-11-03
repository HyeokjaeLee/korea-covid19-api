import axios from "axios";
import type { DistancingSourceData } from "../types/data-type";

/**
 * 한국 사회적 거리두기 현황 사이트 원본 소스를 가져와 파싱후 반환
 * @returns 지역명과 거리두기 단계를 가진 Object Array
 * * 주석에 지역명이 있기 때문에 string 형식으로 파싱하여 사용함
 */
export async function get_distancing_data(): Promise<DistancingSourceData[]> {
  const sourceData = await axios.get("http://ncov.mohw.go.kr/regSocdisBoardView.do").then((res) => {
    const data: string = res.data;
    const startString = "RSS_DATA = [";
    const startIndex = data.indexOf(startString) + startString.length;
    const endIndex = data.indexOf("]", startIndex);
    return data.substring(startIndex, endIndex).replace(/\s/g, "");
  });

  let distancingLevelSum = 0;
  const splitSourceDataList = sourceData.split("{caution").splice(1);
  /**지역과 거리두기 단계를 가지는 Object Array*/
  const distancingDataList = splitSourceDataList.map((splitSourceData) => {
    const region = splitSourceData.match(/(?<=\/\/)[^0-9]+/)![0];
    const distancingLevel = Number(splitSourceData.match(/(?<=value:')[0-9]/)![0]);
    distancingLevelSum += distancingLevel;
    return {
      region: region,
      distancingLevel: distancingLevel,
    };
  });
  // 지역 구분 '전국'은 모든 지역의 평균 거리두기 값
  distancingDataList.push({
    region: "전국",
    distancingLevel: Math.round((distancingLevelSum / distancingDataList.length) * 10) / 10,
  });
  return distancingDataList;
}
