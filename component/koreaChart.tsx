import React, { Fragment } from "react";
import Highcharts from "highcharts";
import HighchartsExporting from "highcharts/modules/exporting";
import HighchartsReact from "highcharts-react-official";

if (typeof Highcharts === "object") {
  HighchartsExporting(Highcharts);
}

const options = (props: any) => {
  const RegionData = props.total_info;
  const infected_data = [];
  const recovered_data = [];
  const death_data = [];
  RegionData.map((data: any) => {
    const date = new Date(data.date);
    const death = data.confirmed.death.total;
    const recovered = data.confirmed.recovered.total;
    const infected = data.confirmed.infected.total;
    recovered_data.push({
      x: date,
      y: recovered,
    });
    infected_data.push({
      x: date,
      y: infected,
    });
    death_data.push({
      x: date,
      y: death,
    });
  });
  return {
    chart: {
      type: "area", // bar차트. 아무 설정이 없으면 line chart가 된다.
      inverted: false,
      height: "50%",
    },
    title: {
      text: "title",
    },
    credits: {
      enabled: false,
    },
    xAxis: {
      margin: 15,
      type: "datetime",
      labels: {
        format: "{value:%Y-%m-%d}",
      },
      showFirstLabel: true,
      showLastLabel: true,
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
      { name: "퇴원", data: recovered_data, color: "#7FBA00" },
      { name: "격리", data: infected_data, color: "#F25022" },
      {
        name: "사망",
        data: death_data,
        color: "#424242",
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
