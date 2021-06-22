"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCovid19Data = void 0;
const format_conversion_1 = require("../function/format-conversion");
const receive_data_1 = require("../function/receive-data");
const region_list_1 = require("../data/region_list");
const regionArr = region_list_1.regionListData.map((data) => data.eng), regionCount = regionArr.length, service_key = "LqdHrACABsYGuZOSxYS0G0hMAhheDZCNIPVR1zWxT5SxXvh3XmI9hUUjuzCgmq13GYhdyYgebB94yUVCB59bAg%3D%3D", from = 20200409, to = Number(format_conversion_1.convertDateFormat(new Date(), "")), url = `http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19SidoInfStateJson?serviceKey=${service_key}&pageNo=1&numOfRows=1&startCreateDt=${from}&endCreateDt=${to}`;
const getCovid19Data = () => __awaiter(void 0, void 0, void 0, function* () {
    const originalCovid19API = yield receive_data_1.get_XML2JSON(url), RequiredInfo = originalCovid19API.response.body.items.item, region_separated_Info = (() => {
        const result = Array.from(Array(regionCount), () => new Array());
        RequiredInfo.forEach((data) => {
            const regionIndex = regionArr.indexOf(data.gubunEn._text);
            result[regionIndex].push({
                region: data.gubunEn._text,
                date: new Date(data.createDt._text),
                infected: Number(data.isolIngCnt._text),
                new_local_infection: Number(data.localOccCnt._text),
                new_overseas_infection: Number(data.overFlowCnt._text),
                new_infected: Number(data.incDec._text),
                death: Number(data.deathCnt._text),
                recovered: Number(data.isolClearCnt._text),
                confirmed: Number(data.defCnt._text), //전체 확진자
            });
        });
        return result;
    })();
    const steady_covid19_data = (() => {
        const result = [];
        region_separated_Info.forEach((aRegionInfo, regionIndex) => {
            aRegionInfo = aRegionInfo.reverse();
            aRegionInfo.forEach((data, index) => {
                const isValidData = index != 0
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
                    result.push({
                        region: data.region,
                        date: data.date,
                        confirmed: data.confirmed,
                        new_quarantined: data.new_infected,
                        new_local_quarantined: data.new_local_infection,
                        new_overseas_quaratined: data.new_overseas_infection,
                        existing_quarantined: data.infected - data.new_infected,
                        recovered: data.recovered,
                        new_recovered: data.recovered - aRegionInfo[index - 1].recovered,
                        existing_recovered: aRegionInfo[index - 1].recovered,
                        death: data.death,
                        new_death: data.death - aRegionInfo[index - 1].death,
                        existing_death: aRegionInfo[index - 1].death,
                    });
            });
        });
        return result;
    })();
    return steady_covid19_data;
});
exports.getCovid19Data = getCovid19Data;
//# sourceMappingURL=get_covid19_data.js.map