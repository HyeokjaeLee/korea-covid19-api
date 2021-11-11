![header](https://capsule-render.vercel.app/api?type=rect&color=gradient&height=100&section=header&text=COVID-19%20API&fontSize=40&fontAlign=50&fontAlignY=55)

![NODE](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=Node.js&logoColor=white)&nbsp;&nbsp;&nbsp;![EXPRESS](https://img.shields.io/badge/Express-4C4C4C?style=flat-square&logo=Express&logoColor=white) ![GRAPHQL](https://img.shields.io/badge/GraphQL-E434AA?style=flat-square&logo=graphql&logoColor=white) ![TYPESCRIPT](https://img.shields.io/badge/Typescript-3178c6?style=flat-square&logo=typescript&logoColor=white) ![HEROKU](https://img.shields.io/badge/Heroku-430098?style=flat-square&logo=Heroku&logoColor=white)

## About

아래 정보들을 기반으로 일부 이상치를 제거한 한국 COVID-19 정보를 제공합니다.
- [보건복지부 코로나19 시·도발생 현황](https://www.data.go.kr/index.do)
- [코로나19 예방접종 통계 데이터 조회 서비스](https://www.data.go.kr/index.do)
- [지역별 거리 두기 단계 현황](http://ncov.mohw.go.kr/regSocdisBoardView.do)

### ⚠️ Notice

해당 API는 Toy Projects를 위한 API입니다.

**Heroku 서버가 Sleep 상태일 경우 첫 요청시 1분 가량 소요됩니다.**

<br/>공공 데이터 포털에서 제공하는 값들 중 일부 이상치가 있습니다. 

해당 이상치 중 다른 값들로 계산이 가능한 값들은 해당 API 제공되지만 불가능한 값들은 제외되었습니다.

## API Request

### 📌 Endpoint

  `https://korea-covid19-api.herokuapp.com/`

### 🧪 [GraphiQL](https://korea-covid19-api.herokuapp.com/)

  GraphiQL이 제공하는 GUI로 Query 요청에 대한 응답을 미리 확인해 볼 수 있습니다.

  ![GraphiQL](https://user-images.githubusercontent.com/71566740/141089831-8eecd9da-7fca-4777-9802-0bc94b2a1774.png)

### 🧾 [Schema](https://github.com/HyeokjaeLee/korea-covid19-api/blob/main/src/schema/covid19-schema.ts)

  | Field | Type | Description |
  |:-----:|:----:| ----------- |
  | regionalDataList | array | 지역 데이터를 지역별 하위 Object를 가지는 Array<br/>**Arguments(optional)**<ul><li>Region: 지역명 `Seoul`</li><li>startDate: 요청 시작일 `20210719`</li><li>startDate: 요청 종료일 `20211011`</li><li>onlyLastDate: 마지막 날짜만 요청 `true`</li></ul> |
  | nameKor | string | 지역명(영어) |
  | nameEng | string | 지역명(한국어) |
  | population | int | 인구 |
  | distancingLevel | int | 거리두기 단계 |
  | covid19 | array | COVID-19 데이터를 날짜별 하위 Object로 가지는 Array |
  | date | string | 기준일 `yyyy-mm-dd` |
  | ratePer100k | float | 10만명당 발생률 |
  | immunityRatio | float | 면역 비율 |
  | quarantine | int | 격리 중 |
  | confirmed | object | 확진 |
  | recovered | object | 격리해제 |
  | dead | object | 사망 |
  | vaccinated | object | 백신 접종 |
  | first | object | 1차 접종 |
  | second | object | 2차 접종 |
  | total | int | 상위 필드의 전체|
  | new | int or object | 상위 필드의 신규 유입|
  | accumlated | int | 상위 필드 누적 (전일 total) |
  | domestic | int | 국내 확진 (confirmed.new 하위 필드) |
  | overseas | int | 해외 유입 확진 (confirmed.new 하위 필드) |

### 🔍 Query sample

  ```
  query{
    region(name:Seoul,startDate:20210110 endDate:20211011) {
      nameKor
      nameEng
      population
      distancingLevel
      covid19 {
        date
        quarantine
        ratePer100k
        immunityRatio
        confirmed{
          total
          new{
            total
            domestic
            overseas
          }
          accumlated
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
        vaccinated{
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
        
      }
    }
  }
  ```

### 🔍 Request sample (Javascript)
  ```javascript
  const query = `query{
    region(name:Seoul,startDate:20211010 endDate:20211011) {
      nameKor
      population
      distancingLevel
      covid19 {
        date
        quarantine
        confirmed{
          new{
            overseas
          }
          accumlated
        }
      }
    }
  }
  `;
  (async () => {
    const res = await fetch("https://korea-covid19-api.herokuapp.com/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      }),
      json = await res.json(),
      data = json.data;
    console.log(data);
    return data;
  })();
  ```

## API Response

### 🔍 Response sample

  ```json
  "region": [
    {
      "nameKor": "서울",
      "population": 9602000,
      "distancingLevel": 4,
      "covid19": [
        {
          "date": "2021-10-10",
          "quarantine": 12508,
          "confirmed": {
            "new": {
              "overseas": 4
            },
            "accumlated": 107036
          }
        },
        {
          "date": "2021-10-11",
          "quarantine": 12507,
          "confirmed": {
            "new": {
              "overseas": 2
            },
            "accumlated": 107619
          }
        }
      ]
    }
  ]
  ```

## Demo Projects

### 📊 [COVID-19 Dashboard](https://github.com/HyeokjaeLee/covid19-dashboard)