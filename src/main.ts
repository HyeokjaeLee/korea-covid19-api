import path from "path";
import express, { RequestHandler } from "express";
import cors from "cors";
import { Worker } from "worker_threads";
import {
  convertDateFormat,
  setTimer_loop,
  ms2hour,
} from "./function/FormatConversion";
//const User = require ("./Schema/test")
import type * as Covid19 from "./type/type.covid19";

const exp = express();
exp.use(cors());
const main = () => {
  hosting(8080);
  //Covid19API 부분
  {
    const covid19Worker = pathDir("./worker.covid19.ts");
    const updateCovid19API = async () => {
      const covid19 = new Router("covid19");
      const wokrer_data: Covid19.Final[] = await getData_from_Worker(
        covid19Worker
      );
      wokrer_data.map((covidData) => {
        covid19.createRouter(covidData.region, (req, res) => {
          let covidInfo = covidData.data;
          const from = req.query.from;
          const to = req.query.to;
          if (from != undefined) {
            covidInfo = covidInfo.filter(
              (data) => dateForm(data.date) >= Number(from)
            );
          }
          if (to != undefined) {
            covidInfo = covidInfo.filter(
              (data) => dateForm(data.date) <= Number(to)
            );
          }
          res.json(covidInfo);
        });
      });
      covid19.createIndexRouter();
    };
    setTimer_loop(ms2hour(1), updateCovid19API);
  }
};
//------------------------------------------------------------------------
class Router {
  public path: string;
  public routerList: string[] = [];
  constructor(title: string) {
    this.path = `/${title}`;
  }

  public createRouter = (name: string, handler: RequestHandler) => {
    const _path = `${this.path}/${name}`;
    this.routerList.push(_path);
    exp.get(_path, handler);
  };

  public createIndexRouter = () => {
    console.log("routerList");
    console.log(this.routerList);
    exp.get(this.path, (req, res) => {
      res.json(this.routerList);
    });
  };
}

const dateForm = (date: Date) => Number(convertDateFormat(date, "")); //queryString으로 받은 값과 비교하기 위한 형식으로변환 ex:20210326

const pathDir = (dir: string) =>
  path.join(__dirname, dir.replace(".ts", ".js"));

const hosting = (port: number): void => {
  exp.listen(process.env.PORT || port, function () {
    console.log(`API hosting started on port ${port}`);
  });
};

const getData_from_Worker = (dir: string): any => {
  return new Promise(function (resolve, reject) {
    const worker = new Worker(dir);
    worker.on("message", (data) => resolve(data));
  });
};

main();
