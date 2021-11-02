import axios from "axios";
import { convert_date_format } from "../function/convert-format";
import { InfectionSourceData } from "../types/data-type";

/**
 * 공공 데이터 포털의 확진 소스 데이터를 불러와 반환
 * @returns 확진 정보 소스 데이터
 */
export const get_infection_data = async (): Promise<InfectionSourceData[]> => {
  const service_key: string =
      "LqdHrACABsYGuZOSxYS0G0hMAhheDZCNIPVR1zWxT5SxXvh3XmI9hUUjuzCgmq13GYhdyYgebB94yUVCB59bAg%3D%3D",
    from = 20200409,
    to = Number(convert_date_format(new Date(), "")),
    url = `http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19SidoInfStateJson?serviceKey=${service_key}&startCreateDt=${from}&endCreateDt=${to}`;
  const sourceData: any = await axios.get(url);
  return sourceData.data.response.body.items.item;
};
