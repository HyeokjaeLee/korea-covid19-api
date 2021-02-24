// pages/index.tsx
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import Test from "../component/navbar";
import { getJSON_Array } from "../modules/getAPI";
const api_url = (url: string) => "https://api.covid19api.com/" + url;
import Chart from "../component/chart";
export default function Index(props) {
  const countries_list = props.countries_list;
  const total_info = props.total_info;
  return (
    <div className="container">
      <div>
        <Test countries_list={countries_list} />
      </div>
      <Chart total_info={total_info} />
    </div>
  );
}

Index.getInitialProps = async function () {
  const countries_list_data = await getJSON_Array(api_url("countries"));
  const total_info_data = await getJSON_Array(api_url("summary"));
  return { countries_list: countries_list_data, total_info: total_info_data };
};
