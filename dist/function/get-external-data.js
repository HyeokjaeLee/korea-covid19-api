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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vaccination = exports.infection = void 0;
const axios_1 = __importDefault(require("axios"));
const convert_date_1 = require("./convert-date");
/**
 * 공공 데이터 포털의 확진 소스 데이터를 불러와 반환
 * @returns 확진 정보 소스 데이터
 */
function infection() {
    return __awaiter(this, void 0, void 0, function* () {
        const service_key = "LqdHrACABsYGuZOSxYS0G0hMAhheDZCNIPVR1zWxT5SxXvh3XmI9hUUjuzCgmq13GYhdyYgebB94yUVCB59bAg%3D%3D", from = 20200409, to = (0, convert_date_1.date2num)(new Date()), url = `http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19SidoInfStateJson?serviceKey=${service_key}&startCreateDt=${from}&endCreateDt=${to}`;
        const sourceData = yield axios_1.default.get(url);
        const data = sourceData.data.response.body.items.item;
        data.reverse(); //데이터를 역순으로 받아옴
        return data;
    });
}
exports.infection = infection;
/**
 * 공공 데이터 포털의 예방접종 소스 데이터를 불러와 반환
 * @returns 예방접종 소스 데이터
 */
function vaccination() {
    return __awaiter(this, void 0, void 0, function* () {
        const APIcreatedDate = new Date("2021-3-11"), today = new Date(), regionCount = 18, dateDiff = Math.ceil((today.getTime() - APIcreatedDate.getTime()) / 86400000), approximateObjectCount = (dateDiff + 1) * regionCount, serviceKey = "LqdHrACABsYGuZOSxYS0G0hMAhheDZCNIPVR1zWxT5SxXvh3XmI9hUUjuzCgmq13GYhdyYgebB94yUVCB59bAg%3D%3D", url = `https://api.odcloud.kr/api/15077756/v1/vaccine-stat?perPage=${approximateObjectCount}&serviceKey=${serviceKey}`;
        const sourceData = yield axios_1.default.get(url);
        return sourceData.data.data;
    });
}
exports.vaccination = vaccination;
//# sourceMappingURL=get-external-data.js.map