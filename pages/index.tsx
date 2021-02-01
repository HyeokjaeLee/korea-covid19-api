// pages/index.tsx
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import Test from "../component/navbar";
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
  const get_countries_list_data = await fetch(api_url("countries"));
  const countries_list_data = await get_countries_list_data.json();
  const get_total_info_data = await fetch(api_url("summary"));
  const total_info_data = await get_total_info_data.json();
  return { countries_list: countries_list_data, total_info: total_info_data };
};
