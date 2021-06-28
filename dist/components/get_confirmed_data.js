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
exports.get_confirmed_data = void 0;
const format_conversion_1 = require("../function/format-conversion");
const get_external_data_1 = require("../function/get_external_data");
const get_confirmed_data = () => __awaiter(void 0, void 0, void 0, function* () {
    const service_key = "LqdHrACABsYGuZOSxYS0G0hMAhheDZCNIPVR1zWxT5SxXvh3XmI9hUUjuzCgmq13GYhdyYgebB94yUVCB59bAg%3D%3D", from = 20200409, to = Number(format_conversion_1.convertDateFormat(new Date(), "")), url = `http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19SidoInfStateJson?serviceKey=${service_key}&startCreateDt=${from}&endCreateDt=${to}`, sourceData = yield get_external_data_1.get_XML2JSON(url);
    const result = sourceData.response.body.items.item;
    return result;
});
exports.get_confirmed_data = get_confirmed_data;
//# sourceMappingURL=get_confirmed_data.js.map