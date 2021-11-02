import * as convert from "xml-js";
import request from "request";
import { Worker } from "worker_threads";
import axios from "axios";
export const get_data_from_worker = (dir: string): any => {
  return new Promise(function (resolve, reject) {
    const worker = new Worker(dir);
    worker.on("message", (data) => {
      resolve(data);
      console.log(`Information has been updated : ( ${new Date()} )`);
    });
  });
};
