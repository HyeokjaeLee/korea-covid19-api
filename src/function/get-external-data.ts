import { Worker } from "worker_threads";
export const get_data_from_worker = (dir: string): any => {
  return new Promise(function (resolve, reject) {
    const worker = new Worker(dir);
    worker.on("message", (data) => {
      resolve(data);
      console.log(`Information has been updated : ( ${new Date()} )`);
    });
  });
};
