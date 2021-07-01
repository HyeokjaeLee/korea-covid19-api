![header](https://capsule-render.vercel.app/api?type=rect&color=gradient&height=100&section=header&text=COVID-19%20API&fontSize=30&fontAlign=50&fontAlignY=50)

![VERSION](https://img.shields.io/badge/version-1.4.5-C76C30?style=flat-square)&nbsp;&nbsp;&nbsp;![GRAPHQL](https://img.shields.io/badge/GraphQL-E434AA?style=flat-square&logo=graphql&logoColor=white) ![TYPESCRIPT](https://img.shields.io/badge/Typescript-3178c6?style=flat-square&logo=typescript&logoColor=white) ![JAVASCRIPT](https://img.shields.io/badge/Javascript-F7DF1E?style=flat-square&logo=Javascript&logoColor=black) ![NODE](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=Node.js&logoColor=white) ![EXPRESS](https://img.shields.io/badge/Express-4C4C4C?style=flat-square&logo=Express&logoColor=white) ![HEROKU](https://img.shields.io/badge/Heroku-430098?style=flat-square&logo=Heroku&logoColor=white)

> This API is the cleansing and addition of some information from COVID-19 API in the Korea Public Data Portal. <br>

- ## :bookmark:URL

  **:warning:<U>This project uses heroku, It usually stays sleep and takes a few seconds for the server to turn on the first try</U>.**<br><br>

  - **https://korea-covid19-api.herokuapp.com/**
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

  - **Preview**
    ![screencapture](https://user-images.githubusercontent.com/71566740/124191843-573c0900-daff-11eb-8cc9-5f26471a0056.png)

    <br>

  - **Request query**

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

  - **Response json**

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
