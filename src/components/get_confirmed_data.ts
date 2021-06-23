import { convertDateFormat } from "../function/format-conversion";
import { get_XML2JSON } from "../function/get_external_data";

export const get_confirmed_data = async () => {
  const service_key: string =
      "LqdHrACABsYGuZOSxYS0G0hMAhheDZCNIPVR1zWxT5SxXvh3XmI9hUUjuzCgmq13GYhdyYgebB94yUVCB59bAg%3D%3D",
    from = 20200409,
    to = Number(convertDateFormat(new Date(), "")),
    url = `http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19SidoInfStateJson?serviceKey=${service_key}&startCreateDt=${from}&endCreateDt=${to}`,
    sourceData: any = await get_XML2JSON(url);
  return sourceData.response.body.items.item;
};
