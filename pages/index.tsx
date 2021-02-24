// pages/index.tsx
import "bootstrap/dist/css/bootstrap.min.css";
import React, { Fragment, useState } from "react";
import { getJSON_Array } from "../modules/getAPI";
import Chart from "../component/koreaChart";
import type { covid19Info, regionList } from "../modules/types";
import { regionListData } from "../modules/RegionList";
const getCovid19KoreaAPI_url = (url: any) => `https://toy-projects-api.herokuapp.com/covid19/korea/${url}`;
export default function Index(props) {
  const test: any = getJSON_Array(getCovid19KoreaAPI_url(regionListData[18].eng));
  console.log(test);
  const regionData = props.RegionData.data;
  return (
    <div className="container">
      <div style={{ height: "20vh" }}>
        <Fragment>
          <Chart total_info={regionData} />
        </Fragment>
      </div>
    </div>
  );
}
Index.getInitialProps = async function () {
  /*regionListData.map(async (data: regionList) => {
    const regionName: string = data.kor;
    const regionData: covid19Info[] = await getJSON_Array(getCovid19KoreaAPI_url(data.eng));
  });*/
  const regionData = await getJSON_Array(getCovid19KoreaAPI_url(regionListData[18].eng));

  return { RegionData: regionData };
};
