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
  let covid19Data: Covid19.Final[] = await get_data_from_worker(covid19Worker);
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
  const recentData = covid19Data.map((aRegionData, index) => {
    let confirmedData = aRegionData.data;
    const regionName = aRegionData.region,
      recentDataIndex = aRegionData.data.length - 1,
      path = "/" + regionName;
    exp.get(path, (req, res) => {
      const from = req.query.from,
        to = req.query.to;
      if (from != undefined) {
        confirmedData = confirmedData.filter(
          (data) => date2query_form(data.date) >= Number(from)
        );
      }
      if (to != undefined) {
        confirmedData = confirmedData.filter(
          (data) => date2query_form(data.date) <= Number(to)
        );
      }
      res.json(confirmedData);
    });
    return {
      region_eng: regionName,
      region_kor: regionListData[index].kor,
      data: confirmedData[recentDataIndex],
    };
  });
  //전 지역 가장 최근 API 제공
  exp.get("/recent", (req, res) => {
    res.json(recentData);
  });
  //10분 마다 COVID19 정보 갱신
  setInterval(async () => {
    covid19Data = await get_data_from_worker(covid19Worker);
  }, 600000);
})();
