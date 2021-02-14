import React, { Component, Fragment } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { object2array } from "../modules/base_modules";
const options = (props: any) => {
  const RegionData = props.total_info;
  const new_recovered = [];
  /*RegionData.map((data: any) => {
    new_recovered.push({
      x: data.date,
      y: data.confirmed.recovered.new,
    });
  });*/
  console.log(new_recovered);
  return {
    chart: {
      type: "area", // bar차트. 아무 설정이 없으면 line chart가 된다.
      inverted: false,
      height: "2000px",
    },
    title: {
      text: "title",
    },
    credits: {
      enabled: false,
    },
    xAxis: {
      type: "category",
    },
    legend: {
      reversed: true,
    },
    plotOptions: {
      area: {
        stacking: "normal",
      },
      series: {
        stacking: "normal",
        dataLabels: {
          enabled: false,
          format: "<b>{point.y}</b>",
        },
      },
    },
    series: [
      // { name: "Recovered", data: total_recovered_info, color: "green" },
      //{ name: "Infected", data: total_infected_info, color: "red" },
      {
        name: "Deaths",
        data: [
          { x: 1, y: 2 },
          { x: 3, y: 2 },
          { x: 4, y: 2 },
          { x: 5, y: 2 },
          { x: 6, y: 2 },
        ],
        color: "black",
      },
    ],
  };
};
const Total_chart = (props: any) => {
  return (
    <Fragment>
      <HighchartsReact highcharts={Highcharts} options={options(props)} />
    </Fragment>
  );
};
export default Total_chart;
