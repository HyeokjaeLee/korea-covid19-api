// pages/index.tsx
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import { getJSON_Array } from "../modules/getAPI";
import Chart from "../component/korea_chart";
import type { covid19Info, regionList } from "../modules/types";
import { regionListData } from "../modules/RegionList";
const getCovid19KoreaAPI_url = (url: any) => `https://toy-projects-api.herokuapp.com/covid19/korea/${url}`;
export default function Index(props) {
  const regionData = props.RegionData;
  console.log(regionData);
  /*covid_data.map((data: any) => {
    console.log(data);
  });*/
  return (
    <div className="container">
      <div></div>
      <Chart total_info={regionData} />
    </div>
  );
}
Index.getInitialProps = async function () {
  regionListData.map(async (data: regionList) => {
    const regionName: string = data.kor;
    const regionData: covid19Info[] = await getJSON_Array(getCovid19KoreaAPI_url(data.eng));
  });
  const regionData = await getJSON_Array(getCovid19KoreaAPI_url(regionListData[1].eng));

  return { RegionData: regionData };
};
