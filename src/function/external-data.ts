import * as convert from "xml-js";
import * as request from "request";

export const getXmlAPI2JSON = (url: string): any => {
  return new Promise((resolve, reject) => {
    request.get(url, (err: any, res: any, body: any) => {
      if (err) {
        console.log(`err => ${err}`);
      } else {
        if (res.statusCode == 200) {
          const JSON_Data: any = JSON.parse(
            convert.xml2json(body, { compact: true, spaces: 4 })
          );
          resolve(JSON_Data);
        }
      }
    });
  });
};
