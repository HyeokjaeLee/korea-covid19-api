import axios from "axios";
import { date2num } from "./convert-date";

/**
 * 공공 데이터 포털의 확진 소스 데이터를 불러와 반환
 * @returns 확진 정보 소스 데이터
 */
export async function infection(): Promise<Source.Infection[]> {
  const service_key: string =
      "LqdHrACABsYGuZOSxYS0G0hMAhheDZCNIPVR1zWxT5SxXvh3XmI9hUUjuzCgmq13GYhdyYgebB94yUVCB59bAg%3D%3D",
    from = 20200409,
    to = date2num(new Date()),
    url = `http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19SidoInfStateJson?serviceKey=${service_key}&startCreateDt=${from}&endCreateDt=${to}`;
  const sourceData: any = await axios.get(url);
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
    regionCount = 18,
    dateDiff = Math.ceil((today.getTime() - APIcreatedDate.getTime()) / 86400000),
    approximateObjectCount = (dateDiff + 1) * regionCount,
    serviceKey =
      "LqdHrACABsYGuZOSxYS0G0hMAhheDZCNIPVR1zWxT5SxXvh3XmI9hUUjuzCgmq13GYhdyYgebB94yUVCB59bAg%3D%3D",
    url = `https://api.odcloud.kr/api/15077756/v1/vaccine-stat?perPage=${approximateObjectCount}&serviceKey=${serviceKey}`;
  const sourceData = await axios.get(url);
  return sourceData.data.data;
}
