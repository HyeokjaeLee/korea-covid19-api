import * as convert from "xml-js";
import request from "request";
import { Worker } from "worker_threads";
export const get_XML2JSON = (url: string): any => {
    return new Promise((resolve, reject) => {
      request.get(url, (err: any, res: any, body: any) => {
        if (err) {
          console.log(`err => ${err}`);
        } else {
          if (res.statusCode == 200) {
            const JSON_Data: any = JSON.parse(
              convert.xml2json(body, { compact: true, spaces: 4 })
            );
            resolve(JSON_Data);
          }
        }
      });
    });
  },
  get_data_from_worker = (dir: string): any => {
    return new Promise(function (resolve, reject) {
      const worker = new Worker(dir);
      worker.on("message", (data) => {
        resolve(data);
        console.log(`Information has been updated : ( ${new Date()} )`);
      });
    });
  },
  get_JSON = (URL: string): any => {
    return new Promise((resolve, reject) => {
      request(URL, function (err: any, res: any, body: any) {
        const result = !err && res.statusCode == 200 ? JSON.parse(body) : err;
        resolve(result);
      });
    });
  };
