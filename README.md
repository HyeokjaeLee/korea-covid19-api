![header](https://capsule-render.vercel.app/api?type=rect&color=gradient&height=100&section=header&text=COVID-19%20API&fontSize=30&fontAlign=50&fontAlignY=50)

![VERSION](https://img.shields.io/badge/version-1.4.5-C76C30?style=flat-square)&nbsp;&nbsp;&nbsp;![GRAPHQL](https://img.shields.io/badge/GraphQL-E434AA?style=flat-square&logo=graphql&logoColor=white) ![TYPESCRIPT](https://img.shields.io/badge/Typescript-3178c6?style=flat-square&logo=typescript&logoColor=white) ![JAVASCRIPT](https://img.shields.io/badge/Javascript-F7DF1E?style=flat-square&logo=Javascript&logoColor=black) ![NODE](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=Node.js&logoColor=white) ![EXPRESS](https://img.shields.io/badge/Express-4C4C4C?style=flat-square&logo=Express&logoColor=white) ![HEROKU](https://img.shields.io/badge/Heroku-430098?style=flat-square&logo=Heroku&logoColor=white)

> This API is the cleansing and addition of some information from COVID-19 API in the Korea Public Data Portal. <br>

- ## :bookmark:URL

  **:warning:<U>This project uses heroku, It usually stays sleep and takes a few seconds for the server to turn on the first try</U>.**<br>

  - ### https://korea-covid19-api.herokuapp.com/
    - **RegionList**
      - Lazaretto
      - Jeju
      - Gyeongsangnamdo
      - Gyeongsangbukdo
      - Jeollanamdo
      - Jeollabukdo
      - Chungcheongnamdo
      - Chungcheongbukdo
      - Gangwondo
      - Gyeonggido
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

  - ### Preview

    ![screencapture](https://user-images.githubusercontent.com/71566740/124191843-573c0900-daff-11eb-8cc9-5f26471a0056.png)

      <br>

  - ### Request query

  ```query
  query{
    covid19Info(region:Seoul startDate:20210701 endDate:20210701){
      regionEng
      regionKor
      population
      covid19{
        date
        confirmed{
          total
          accumlated
        }
        quarantine{
          total
          new{
            total
            domestic
            overseas
          }
        }
        recovered{
          total
          new
          accumlated
        }
        dead{
          total
          new
          accumlated
        }
        vaccination{
          first{
            total
            new
            accumlated
          }
          second{
            total
            new
            accumlated
          }
        }
        per100kConfirmed
      }
    }
  }
  ```

  <br>

  - ### Response json

  ```json
  {
    "data": {
      "covid19Info": [
        {
          "regionEng": "Seoul",
          "regionKor": "서울특별시",
          "population": 9602000,
          "covid19": [
            {
              "date": "2021-07-01",
              "confirmed": {
                "total": 50320,
                "accumlated": 49986
              },
              "quarantine": {
                "total": 3214,
                "new": {
                  "total": 334,
                  "domestic": 332,
                  "overseas": 2
                }
              },
              "recovered": {
                "total": 46593,
                "new": 92,
                "accumlated": 46501
              },
              "dead": {
                "total": 514,
                "new": 1,
                "accumlated": 513
              },
              "vaccination": {
                "first": {
                  "total": 2837158,
                  "new": 3893,
                  "accumlated": 2833265
                },
                "second": {
                  "total": 941358,
                  "new": 22749,
                  "accumlated": 918609
                }
              },
              "per100kConfirmed": 516.99
            }
          ]
        }
      ]
    }
  }
  ```

- ## :books:Used Data

  - [Korea Public Data Portal (XML)](https://www.data.go.kr/data/15043378/openapi.do)<br>

- ## :memo:To-Do
  - [x] Convert xml data to json format and complete appropriate data form<br>
  - [x] Add Junk Value Filter<br>
  - [x] Fix Junk Value Filter Bug<br>
  * COVID19 관련 지역별 정보 Array
  * -
  *
  * COVID19Data Object Key
  * - date: 데이터 생성 일자
  * - confirmed: 확진
  * - quarantine: 격리
  * - recovered: 격리해제(회복)
  * - dead: 사망
  * - vaccinated: 백신 접종
  * - per100kConfirmed: 10만명 당 확진자 수
  * - immunityRatio: 면역자 비율(2차 백신 접종 + 회복)
  *
  * 공통 하위 Object Key
  * - total: 전체(신규+누적)
  * - new: 신규(당일)
  * - accumlated: 누적(전일)
  *
  * new quarantine(신규 격리자) 하위 Object Key
  * - domestic: 국내 감염
  * - overseas: 해외 감염
  *
  * vaccinated 하위 Object Key
  * - first: 1차 접종
  * - second: 2차 접종
