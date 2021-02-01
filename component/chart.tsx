import React, { Component, Fragment } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const Total_chart = (props) => {
  const total_info = props.total_info.Countries;
  total_info.sort(function (a, b) {
    // 오름차순
    return b["TotalConfirmed"] - a["TotalConfirmed"];
  });

  const total_deaths_info = total_info.map((data: any) => [data.Country, data.TotalDeaths]);
  const total_recovered_info = total_info.map((data: any) => [data.Country, data.TotalRecovered]);
  const total_infected_info = total_info.map((data: any) => {
    if (data.TotalConfirmed == 0) {
      return [data.Country, 0];
    } else {
      return [data.Country, data.TotalConfirmed - data.TotalRecovered - data.TotalDeaths];
    }
  });
  const options = (title: string) => {
    return {
      chart: {
        type: "bar", // bar차트. 아무 설정이 없으면 line chart가 된다.
        inverted: false,
        height: "2000px",
      },
      title: {
        text: title,
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
        { name: "Deaths", data: total_deaths_info, color: "black" },
      ],
    };
  };
  return (
    <Fragment>
      <div style={{ width: "30%", float: "left" }}>
        <HighchartsReact highcharts={Highcharts} options={options("Death")} />
      </div>
      <div style={{ width: "30%", float: "left" }}>
        <HighchartsReact highcharts={Highcharts} options={options("Death")} />
      </div>
      <div style={{ width: "30%", float: "left" }}>
        <HighchartsReact highcharts={Highcharts} options={options("Death")} />
      </div>
    </Fragment>
  );
};
export default Total_chart;
