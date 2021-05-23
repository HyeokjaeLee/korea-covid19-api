import path from "path";
import express from "express";
import cors from "cors";
import { Worker } from "worker_threads";
import {
  convertDateFormat,
  setTimer_loop,
  ms2hour,
} from "./function/FormatConversion";
import type * as Covid19 from "./type/type.covid19";
import { regionListData } from "./data/region_list";

const exp = express(),
  dateForm = (date: Date) => Number(convertDateFormat(date, "")), //queryString으로 받은 값과 비교하기 위한 형식으로변환 ex:20210326
  getData_from_Worker = (dir: string): any => {
    return new Promise(function (resolve, reject) {
      const worker = new Worker(dir);
      worker.on("message", (data) => resolve(data));
    });
  };
exp.use(cors());
const port = 8080;
exp.listen(process.env.PORT || port, function () {
  console.log(`API hosting started on port ${port}`);
});
exp.get("/", (req, res) => {
  res.json(regionListData);
});
{
  const covid19Worker = path.join(__dirname, "./worker.covid19.js"),
    updateCovid19API = async () => {
      const wokrer_data: Covid19.Final[] = await getData_from_Worker(
          covid19Worker
        ),
        path_list: string[] = [];
      wokrer_data.forEach((aRegionData) => {
        const path = "/" + aRegionData.region;
        path_list.push(path);
        exp.get(path, (req, res) => {
          let covidInfo = aRegionData.data;
          const from = req.query.from,
            to = req.query.to;
          if (from != undefined) {
            covidInfo = covidInfo.filter(
              (data) => dateForm(data.date) >= Number(from)
            );
          }
          if (to != undefined) {
            covidInfo = covidInfo.filter(
              (data) => dateForm(data.date) <= Number(to)
            );
          }
          res.json(covidInfo);
        });
      });
      //Region path list
      console.log(`Information has been updated : ( ${new Date()} )`);
    };
  setTimer_loop(ms2hour(1), updateCovid19API);
}
