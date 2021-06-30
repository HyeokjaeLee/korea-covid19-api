![header](https://capsule-render.vercel.app/api?type=rect&color=gradient&height=100&section=header&text=COVID-19%20API&fontSize=30&fontAlign=50&fontAlignY=50)

![VERSION](https://img.shields.io/badge/version-1.1.3-C76C30?style=flat-square)&nbsp;&nbsp;&nbsp;![TYPESCRIPT](https://img.shields.io/badge/Typescript-3178c6?style=flat-square&logo=typescript&logoColor=white) ![JAVASCRIPT](https://img.shields.io/badge/Javascript-F7DF1E?style=flat-square&logo=Javascript&logoColor=black) ![NODE](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=Node.js&logoColor=white) ![EXPRESS](https://img.shields.io/badge/Express-4C4C4C?style=flat-square&logo=Express&logoColor=white) ![HEROKU](https://img.shields.io/badge/Heroku-430098?style=flat-square&logo=Heroku&logoColor=white)

> This API is the cleansing and addition of some information from COVID-19 API in the Korea Public Data Portal. <br>

- ## :bookmark:URL

  **:warning:<U>This project uses heroku, It usually stays sleep and takes a few seconds for the server to turn on the first try</U>.**<br><br>

  - **RegionList**
    https://korea-covid19-api.herokuapp.com/
  - **Recent data for all regions**
    https://korea-covid19-api.herokuapp.com/recent
  - **Data by region**
    https://korea-covid19-api.herokuapp.com/total

    ```
    https://korea-covid19-api.herokuapp.com/{Region}?from={FromDate}&to={ToDate}

    ex) https://korea-covid19-api.herokuapp.com/total?from=20201220&to=20210209
        https://korea-covid19-api.herokuapp.com/total?to=20210209
        https://korea-covid19-api.herokuapp.com/total?from=20201220
    ```

    - If you do not give date value, load the entire.
    - **RegionList**
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
        <br><br>
    - **DateForm :** {Year}{Month}{Day}
      - ex) 20210209

- ## :lock:Data form

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
      }...
    ]
  }
  ```

- ## :books:Used Data

  - [Korea Public Data Portal (XML)](https://www.data.go.kr/data/15043378/openapi.do)<br>

- ## :memo:To-Do
  - [x] Convert xml data to json format and complete appropriate data form<br>
  - [x] Add Junk Value Filter<br>
  - [ ] Add AI Data (modification)<br>
  - [x] Fix Junk Value Filter Bug<br>
  - [ ] Add Monthly Information<br>
