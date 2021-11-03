import axios from "axios";
import { date2num } from "./convert-date";
import {
  InfectionSourceData,
  VaccinationSourceData,
  DistancingSourceData,
} from "../types/data-type";

/**
 * 사회적 거리두기 현황 사이트 소스코드를 가져와 파싱후 반환
 * * 주석에 지역명이 있기 때문에 string 형식으로 파싱하여 사용함
 */
export async function distancing(): Promise<DistancingSourceData[]> {
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

/**
 * 공공 데이터 포털의 확진 소스 데이터를 불러와 반환
 * @returns 확진 정보 소스 데이터
 */
export async function infection(): Promise<InfectionSourceData[]> {
  const service_key: string =
      "LqdHrACABsYGuZOSxYS0G0hMAhheDZCNIPVR1zWxT5SxXvh3XmI9hUUjuzCgmq13GYhdyYgebB94yUVCB59bAg%3D%3D",
    from = 20200409,
    to = date2num(new Date()),
    url = `http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19SidoInfStateJson?serviceKey=${service_key}&startCreateDt=${from}&endCreateDt=${to}`;
  const sourceData: any = await axios.get(url);
  return sourceData.data.response.body.items.item;
}

/**
 * 공공 데이터 포털의 예방접종 소스 데이터를 불러와 반환
 * @returns 예방접종 소스 데이터
 */
export async function vaccination(): Promise<VaccinationSourceData[]> {
  const APIcreatedDate = new Date("2021-3-11"),
    today = new Date(),
    regionCount = 18,
    dateDiff = Math.ceil((today.getTime() - APIcreatedDate.getTime()) / 86400000),
    approximateObjectCount = (dateDiff + 1) * regionCount,
    serviceKey =
      "LqdHrACABsYGuZOSxYS0G0hMAhheDZCNIPVR1zWxT5SxXvh3XmI9hUUjuzCgmq13GYhdyYgebB94yUVCB59bAg%3D%3D",
    url = `https://api.odcloud.kr/api/15077756/v1/vaccine-stat?perPage=${approximateObjectCount}&serviceKey=${serviceKey}`;
  const sourceData = await axios.get(url);
  return sourceData.data.data;
}
