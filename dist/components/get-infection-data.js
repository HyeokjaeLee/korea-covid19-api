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
exports.get_infection_data = void 0;
const convert_format_1 = require("../function/convert-format");
const get_external_data_1 = require("../function/get-external-data");
/**
 * 공공 데이터 포털의 확진 소스 데이터를 불러와 반환
 * @returns 확진 정보 소스 데이터
 */
const get_infection_data = () => __awaiter(void 0, void 0, void 0, function* () {
    const service_key = "LqdHrACABsYGuZOSxYS0G0hMAhheDZCNIPVR1zWxT5SxXvh3XmI9hUUjuzCgmq13GYhdyYgebB94yUVCB59bAg%3D%3D", from = 20200409, to = Number(convert_format_1.convert_date_format(new Date(), "")), url = `http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19SidoInfStateJson?serviceKey=${service_key}&startCreateDt=${from}&endCreateDt=${to}`, sourceData = yield get_external_data_1.get_XML2JSON(url);
    const result = sourceData.response.body.items.item;
    return result;
});
exports.get_infection_data = get_infection_data;
//# sourceMappingURL=get-infection-data.js.map