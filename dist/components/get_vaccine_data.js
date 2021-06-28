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
exports.get_vaccine_data = void 0;
const get_external_data_1 = require("../function/get_external_data");
const get_vaccine_data = () => __awaiter(void 0, void 0, void 0, function* () {
    const APIcreatedDate = new Date("2021-3-11"), today = new Date(), regionCount = 18, dateDiff = Math.ceil((today.getTime() - APIcreatedDate.getTime()) / 86400000), approximateObjectCount = (dateDiff + 1) * regionCount, serviceKey = "LqdHrACABsYGuZOSxYS0G0hMAhheDZCNIPVR1zWxT5SxXvh3XmI9hUUjuzCgmq13GYhdyYgebB94yUVCB59bAg%3D%3D", url = `https://api.odcloud.kr/api/15077756/v1/vaccine-stat?perPage=${approximateObjectCount}&serviceKey=${serviceKey}`, sourceData = yield get_external_data_1.get_JSON(url), result = sourceData.data;
    return result;
});
exports.get_vaccine_data = get_vaccine_data;
//# sourceMappingURL=get_vaccine_data.js.map