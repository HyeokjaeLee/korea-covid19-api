"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_vaccine_data = void 0;
const get_external_data_1 = require("../function/get_external_data");
const get_vaccine_data = async () => {
    const APIcreatedDate = new Date("2021-3-11"), today = new Date(), regionCount = 18, dateDiff = Math.ceil((today.getTime() - APIcreatedDate.getTime()) / 86400000), approximateObjectCount = (dateDiff + 1) * regionCount, serviceKey = "LqdHrACABsYGuZOSxYS0G0hMAhheDZCNIPVR1zWxT5SxXvh3XmI9hUUjuzCgmq13GYhdyYgebB94yUVCB59bAg%3D%3D", url = `https://api.odcloud.kr/api/15077756/v1/vaccine-stat?perPage=${approximateObjectCount}&serviceKey=${serviceKey}`, sourceData = await get_external_data_1.get_JSON(url), result = sourceData.data;
    return result;
};
exports.get_vaccine_data = get_vaccine_data;
//# sourceMappingURL=get_vaccine_data.js.map