import axios from "axios";
import type { VaccinationSourceData } from "../types/data-type";

/**
 * 공공 데이터 포털의 예방접종 소스 데이터를 불러와 반환
 * @returns 예방접종 소스 데이터
 */
export const get_vaccination_data = async (): Promise<VaccinationSourceData[]> => {
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
};
