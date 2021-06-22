import request from "request";
const apiCreatedDate = new Date("2021-3-11"),
  today = new Date(),
  regionCount = 18,
  dateDiff = Math.ceil((today.getTime() - apiCreatedDate.getTime()) / 86400000),
  approximateObjectCount = (dateDiff + 1) * regionCount,
  serviceKey =
    "LqdHrACABsYGuZOSxYS0G0hMAhheDZCNIPVR1zWxT5SxXvh3XmI9hUUjuzCgmq13GYhdyYgebB94yUVCB59bAg%3D%3D",
  url = `https://api.odcloud.kr/api/15077756/v1/vaccine-stat?perPage=${approximateObjectCount}&serviceKey=${serviceKey}`;

function getJSON(url: string): any {
  return new Promise((resolve, reject) => {
    request(url, function (err: any, res: any, body: any) {
      const result = !err && res.statusCode == 200 ? JSON.parse(body) : err;
      resolve(result);
    });
  });
}
async function test() {
  const test = await getJSON(url);
  console.log(test);
}
test();
