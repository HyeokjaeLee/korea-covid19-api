import axios from "axios";
import { date2num } from "./convert-date";

/**
 * 공공 데이터 포털의 확진 소스 데이터를 불러와 반환
 * @returns 확진 정보 소스 데이터
 */
export async function infection(): Promise<Source.Infection[]> {
  const SERVICE_KEY: string =
      "LqdHrACABsYGuZOSxYS0G0hMAhheDZCNIPVR1zWxT5SxXvh3XmI9hUUjuzCgmq13GYhdyYgebB94yUVCB59bAg%3D%3D",
    FROM = 20200409,
    TO = date2num(new Date()),
    URL = `http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19SidoInfStateJson?serviceKey=${SERVICE_KEY}&startCreateDt=${FROM}&endCreateDt=${TO}`;
  const sourceData: any = await axios.get(URL);
  const data: Source.Infection[] = sourceData.data.response.body.items.item;
  data.reverse(); //데이터를 역순으로 받아옴
  return data;
}

/**
 * 공공 데이터 포털의 예방접종 소스 데이터를 불러와 반환
 * @returns 예방접종 소스 데이터
 */
export async function vaccination(): Promise<Source.Vaccination[]> {
  const APIcreatedDate = new Date("2021-3-11"),
    today = new Date(),
    REGION_COUNT = 18,
    dateDiff = Math.ceil((today.getTime() - APIcreatedDate.getTime()) / 86400000),
    approximateObjectCount = (dateDiff + 1) * REGION_COUNT,
    SERVICE_KEY =
      "LqdHrACABsYGuZOSxYS0G0hMAhheDZCNIPVR1zWxT5SxXvh3XmI9hUUjuzCgmq13GYhdyYgebB94yUVCB59bAg%3D%3D",
    url = `https://api.odcloud.kr/api/15077756/v1/vaccine-stat?perPage=${approximateObjectCount}&serviceKey=${SERVICE_KEY}`;
  const sourceData = await axios.get(url);
  return sourceData.data.data;
}
