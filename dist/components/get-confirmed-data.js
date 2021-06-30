"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_confirmed_data = void 0;
const convert_format_1 = require("../function/convert-format");
const get_external_data_1 = require("../function/get-external-data");
const get_confirmed_data = async () => {
    const service_key = "LqdHrACABsYGuZOSxYS0G0hMAhheDZCNIPVR1zWxT5SxXvh3XmI9hUUjuzCgmq13GYhdyYgebB94yUVCB59bAg%3D%3D", from = 20200409, to = Number(convert_format_1.convert_date_format(new Date(), "")), url = `http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19SidoInfStateJson?serviceKey=${service_key}&startCreateDt=${from}&endCreateDt=${to}`, sourceData = await get_external_data_1.get_XML2JSON(url);
    const result = sourceData.response.body.items.item;
    return result;
};
exports.get_confirmed_data = get_confirmed_data;
//# sourceMappingURL=get-confirmed-data.js.map