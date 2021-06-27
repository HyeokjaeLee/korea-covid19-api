"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_data_from_worker = exports.get_XML2JSON = void 0;
const convert = __importStar(require("xml-js"));
const request = __importStar(require("request"));
const worker_threads_1 = require("worker_threads");
const get_XML2JSON = (url) => {
    return new Promise((resolve, reject) => {
        request.get(url, (err, res, body) => {
            if (err) {
                console.log(`err => ${err}`);
            }
            else {
                if (res.statusCode == 200) {
                    const JSON_Data = JSON.parse(convert.xml2json(body, { compact: true, spaces: 4 }));
                    resolve(JSON_Data);
                }
            }
        });
    });
}, get_data_from_worker = (dir) => {
    return new Promise(function (resolve, reject) {
        const worker = new worker_threads_1.Worker(dir);
        worker.on("message", (data) => {
            resolve(data);
            console.log(`Information has been updated : ( ${new Date()} )`);
        });
    });
};
exports.get_XML2JSON = get_XML2JSON, exports.get_data_from_worker = get_data_from_worker;
//# sourceMappingURL=receive-data.js.map