import path from "path";
import express from "express";
import cors from "cors";
import { date2query_form } from "./function/format-conversion";
import type * as Covid19 from "./type/type.covid19";
import { regionListData } from "./data/region_list";
import { get_data_from_worker } from "./function/receive-data";
const exp = express(),
  covid19Worker = path.join(__dirname, "./worker.covid19.js"),
  port = 8080;

(async () => {
  let worker_data: Covid19.Final[] = await get_data_from_worker(covid19Worker);
  //서버 시작
  exp.use(cors());
  exp.listen(process.env.PORT || port, function () {
    console.log(`API hosting started on port ${port}`);
  });
  //Regions List 라우팅
  exp.get("/", (req, res) => {
    res.json(regionListData);
  });
  //COVID19 API 라우팅
  worker_data.forEach((aRegionData) => {
    const path = "/" + aRegionData.region;
    exp.get(path, (req, res) => {
      let covidInfo = aRegionData.data;
      const from = req.query.from,
        to = req.query.to;
      if (from != undefined) {
        covidInfo = covidInfo.filter(
          (data) => date2query_form(data.date) >= Number(from)
        );
      }
      if (to != undefined) {
        covidInfo = covidInfo.filter(
          (data) => date2query_form(data.date) <= Number(to)
        );
      }
      res.json(covidInfo);
    });
  });
  //10분 마다 COVID19 정보 갱신
  setInterval(async () => {
    worker_data = await get_data_from_worker(covid19Worker);
  }, 600000);
})();
