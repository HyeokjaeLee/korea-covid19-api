// pages/index.tsx
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import { getJSON_Array } from "../modules/getAPI";
const api_url = (url: string) => "https://toy-projects-api.herokuapp.com" + url;
import Chart from "../component/korea_chart";
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
  const region_list_data = await getJSON_Array(api_url("/covid19"));
  console.log(region_list_data);
  const [regionData, set_regionData] = await getJSON_Array(api_url("/covid19/korea/total"));
  return { RegionData: regionData };
};
