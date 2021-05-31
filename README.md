![header](https://capsule-render.vercel.app/api?type=rect&color=gradient&height=100&section=header&text=COVID-19%20API&fontSize=30&fontAlign=50&fontAlignY=50)

![VERSION](https://img.shields.io/badge/version-1.1.3-blue.svg?cacheSeconds=2592000)

> This API is the cleansing and addition of some information from COVID-19 API in the Korea Public Data Portal. <br>

![TYPESCRIPT](https://img.shields.io/badge/Typescript-3178c6?style=flat-square&logo=typescript&logoColor=white) ![JAVASCRIPT](https://img.shields.io/badge/Javascript-F7DF1E?style=flat-square&logo=Javascript&logoColor=black) ![NODE](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=Node-dot-js&logoColor=white) ![EXPRESS](https://img.shields.io/badge/Express-4C4C4C?style=flat-square&logo=Express&logoColor=white) ![HEROKU](https://img.shields.io/badge/Heroku-430098?style=flat-square&logo=Heroku&logoColor=white)

#### :books: Used Information

- [Korea Public Data Portal (XML)](https://www.data.go.kr/data/15043378/openapi.do)<br>

#### :syringe: Korea-Covid19-API

If you do not give the query string value, load the entire.

##### URL

https://korea-covid19-api.herokuapp.com/total

```
https://korea-covid19-api.herokuapp.com/{Region}?from={FromDate}&to={ToDate}
```

##### RegionList

- Lazaretto
- Jeju
- Gyeongsangnam-do
- Gyeongsangbuk-do
- Jeollanam-do
- Jeollabuk-do
- Chungcheongnam-do
- Chungcheongbuk-do
- Gangwon-do
- Gyeonggi-do
- Sejong
- Gwangju
- Busan
- Ulsan
- Incheon
- Daejeon
- Daegu
- Seoul
- **Total**

##### DateForm : 20210325

#### :lock: form

```json
{
  "region": "Seoul",
  "data": [
    {
      "date": "2020-04-10T01:52:03.030Z",
      "confirmed": {
        "infected": {
          "new": {
            "local": 5,
            "overseas": 7,
            "total": 12
          },
          "existing": 402,
          "total": 414
        },
        "recovered": {
          "new": 0,
          "existing": 174,
          "total": 174
        },
        "death": {
          "new": 0,
          "existing": 2,
          "total": 2
        },
        "total": 590
      }
    }
  ]
}
```

#### :bookmark: To-Do

- [x] Convert xml data to json format and complete appropriate data form<br>
- [x] Add Junk Value Filter<br>
- [ ] Add AI Data (modification)<br>
- [x] Fix Junk Value Filter Bug<br>
- [ ] Add Monthly Information<br>
