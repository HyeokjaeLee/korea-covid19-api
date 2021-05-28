import { convertDateFormat } from "../function/format-conversion";
import { get_XML2JSON } from "../function/receive-data";
import { regionListData } from "../data/region_list";
import * as Covid19 from "../type/type.covid19";

const regionArr: string[] = regionListData.map((data) => data.eng),
  regionCount: number = regionArr.length,
  service_key: string =
    "LqdHrACABsYGuZOSxYS0G0hMAhheDZCNIPVR1zWxT5SxXvh3XmI9hUUjuzCgmq13GYhdyYgebB94yUVCB59bAg%3D%3D",
  from = 20200409,
  to = Number(convertDateFormat(new Date(), "")),
  url = `http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19SidoInfStateJson?serviceKey=${service_key}&pageNo=1&numOfRows=1&startCreateDt=${from}&endCreateDt=${to}`;

export const getCovid19Data = async () => {
  const originalCovid19API: any = await get_XML2JSON(url),
    RequiredInfo = originalCovid19API.response.body.items.item,
    region_separated_Info = ((): Covid19.OriginalAPI[][] => {
      const result: Covid19.OriginalAPI[][] = Array.from(
        Array(regionCount),
        () => new Array()
      );
      RequiredInfo.forEach((data: any) => {
        const regionIndex = regionArr.indexOf(data.gubunEn._text);
        result[regionIndex].push({
          date: new Date(data.createDt._text), //날짜
          infected: Number(data.isolIngCnt._text), //치료 안된 감염자
          new_local_infection: Number(data.localOccCnt._text), //새로운 지역감염으로 인한 확진자
          new_overseas_infection: Number(data.overFlowCnt._text), //새로운 해외감염으로 인한 확진자
          new_infected: Number(data.incDec._text), //새로운 확진자_getAI
          death: Number(data.deathCnt._text), //사망자_getAI
          recovered: Number(data.isolClearCnt._text), //회복_getAI
          confirmed: Number(data.defCnt._text), //전체 확진자
        });
      });
      return result;
    })();

  const steady_covid19_data = (() => {
    const result: Covid19.Final[] = regionArr.map((region) => ({
      region: region,
      data: [],
    }));
    region_separated_Info.forEach((aRegionInfo, regionIndex) => {
      aRegionInfo = aRegionInfo.reverse();
      aRegionInfo.forEach((data, index) => {
        const isValidData =
          index != 0
            ? data.confirmed >= aRegionInfo[index - 1].confirmed &&
              data.recovered >= aRegionInfo[index - 1].recovered &&
              data.death >= aRegionInfo[index - 1].death
              ? index == aRegionInfo.length - 1
                ? true
                : data.confirmed <= aRegionInfo[index + 1].confirmed &&
                  data.recovered <= aRegionInfo[index + 1].recovered &&
                  data.death <= aRegionInfo[index + 1].death
                ? true
                : false
              : false
            : false;
        if (isValidData)
          result[regionIndex].data.push({
            date: data.date,
            confirmed: {
              infected: {
                new: {
                  local: data.new_local_infection, //새로운 지역감염으로 인한 감염(격리)
                  overseas: data.new_overseas_infection, //새로운 해외감염으로 인한 감염(격리)
                  total: data.new_infected, //전체 감염(격리)
                },
                existing: data.infected - data.new_infected, //기존 감염(격리)
                total: data.infected, //전체 감염(격리)
              },
              recovered: {
                new: data.recovered - aRegionInfo[index - 1].recovered, //신규 격리해제
                existing: aRegionInfo[index - 1].recovered, //기존 격리해제
                total: data.recovered, //전체 격리해제
              },
              death: {
                new: data.death - aRegionInfo[index - 1].death, //신규 사망
                existing: aRegionInfo[index - 1].death, //기존 사망
                total: data.death, //사망
              },
              total: data.confirmed, // 전체 확진
            },
          });
      });
    });
    return result;
  })();
  return steady_covid19_data;
};
