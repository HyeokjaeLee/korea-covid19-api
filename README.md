![header](https://capsule-render.vercel.app/api?type=rect&color=gradient&height=100&section=header&text=COVID-19%20API&fontSize=40&fontAlign=50&fontAlignY=55)

![NODE](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=Node.js&logoColor=white)&nbsp;&nbsp;&nbsp;![EXPRESS](https://img.shields.io/badge/Express-4C4C4C?style=flat-square&logo=Express&logoColor=white) ![GRAPHQL](https://img.shields.io/badge/GraphQL-E434AA?style=flat-square&logo=graphql&logoColor=white) ![TYPESCRIPT](https://img.shields.io/badge/Typescript-3178c6?style=flat-square&logo=typescript&logoColor=white)![HEROKU](https://img.shields.io/badge/Heroku-430098?style=flat-square&logo=Heroku&logoColor=white)


| ⚠️ Use Heroku to deploy |
| ----------------------- |
| 해당 API는 Toy Projects를 위한 API로 Heroku 서버가 Sleep 상태일 경우 첫 요청시 **1분** 가량 소요되며 외부 정보를 불러오기 전까지 **로컬 파일의 데이터**를 제공합니다. |

## 📝 About

아래 정보들을 기반으로 일부 이상치를 제거한 한국 COVID-19 정보를 제공합니다.
- [보건복지부 코로나19 시·도발생 현황](https://www.data.go.kr/index.do)
- [코로나19 예방접종 통계 데이터 조회 서비스](https://www.data.go.kr/index.do)
- [지역별 거리 두기 단계 현황](http://ncov.mohw.go.kr/regSocdisBoardView.do)

## ⬆️ API Request

### Endpoint

[`https://korea-covid19-api.herokuapp.com/`]

- ### **요청 형식:**
  ```query
  query{
    regionalDataList(region: {Region} startDate: {Date}: onlyLastDate: {boolean}){
      원하는 데이터 종류...
    }
  }
  ```
  - #### **Region:** 요청할 지역
    > 미입력시 모든 지역을 요청합니다.
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
    - Total
  - #### **Date:** 요청할 날짜의 시작일과 종료일
    > 미입력시 각각 startDate=2020-04-09, endDate=오늘 입니다.
    - 형식: {Year}{Month}{Day}
    - 예시: 20210209
  - #### **onlyLastDate :** 마지막 데이터만 요청
    > 미입력 default 값은 false 입니다.
    - 형식: true, false

## :memo: Data List

- ### 상위 Object Key
  - regionEng: 영문 지역명
  - regionKor: 한글 지역명
  - population: 대략적인 지역 인구
  - distancingLevel: 현재 사회적 거리두기 단계
  - covid19DataList: 날짜별 COVID19 데이터
- ### covid19DataList Object Key
  - date: 날짜
  - confirmed: 확진자
  - quarantine: 격리자
  - recovered: 회복자(격리해제)
  - dead: 사망자
  - vaccinated: 예방접종
  - per100kConfirmed: 10만명 당 확진자
- ### 공통 하위 Object Key
  - total: 전체(신규+누적)
  - new: 신규(당일)
  - accumlated: 누적(전일)
- ### new quarantine(신규 격리자) Object Key
  - domestic: 국내 감염
  - overseas: 해외 감염
- ### vaccinated Object Key
  - first: 1차 접종
  - second: 2차 접종

## :mag: Example

- ### Example used
  - [COVID-19 Dashboard](https://github.com/HyeokjaeLee/covid19-dashboard)
- ### Screenshot
  ![screencapture-localhost-8080-1626721706457](https://user-images.githubusercontent.com/71566740/126214047-90ee5473-294d-4766-9d92-bab8d2e2741c.png)
- ### Request query
  ```
  query{
    regionalDataList(region:Seoul startDate:20210719){
      regionEng
      regionKor
      population
      distancingLevel
      covid19DataList{
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
        per100kConfirmed
      }
    }
  }
  ```
- ### Response json
  ```
  {
    "data": {
      "regionalDataList": [
        {
          "regionEng": "Seoul",
          "regionKor": "서울",
          "population": 9602000,
          "distancingLevel": 4,
          "covid19DataList": [
            {
              "date": "2021-07-19",
              "confirmed": {
                "total": 58645,
                "accumlated": 58226
              },
              "quarantine": {
                "total": 7061,
                "new": {
                  "total": 419,
                  "domestic": 413,
                  "overseas": 6
                }
              },
              "recovered": {
                "total": 51058,
                "new": 187,
                "accumlated": 50871
              },
              "dead": {
                "total": 527,
                "new": 0,
                "accumlated": 527
              },
              "vaccinated": {
                "first": {
                  "total": 2974141,
                  "new": 46,
                  "accumlated": 2974095
                },
                "second": {
                  "total": 1216767,
                  "new": 151,
                  "accumlated": 1216616
                }
              },
              "per100kConfirmed": 606.57
            }
          ]
        }
      ]
    }
  }
  ```

### URL Params

| Name       | Required | Type | Description |
|:----------:|:--------:|:----:| ----------- |
| `platform` | Y | string | 요청할 웹툰의 플랫폼 입니다.<br/>요청 가능한 `platform`은 다음과 같습니다.<ul><li>`all` 모든 플랫폼</li><li>`naver` 네이버웹툰</li><li>`kakao` 카카오웹툰</li><li>`kakao-page` 카카오페이지</li></ul> |
| `type` | N | string | 요청할 웹툰의 타입입니다.<br/>미입력시 모든 타입의 웹툰 정보를 요청합니다.<br/>요청 가능한 `type`은 다음과 같습니다.<ul><li>`week` 연재중</li><li>`finished` 완결</li></ul> |


### Request variable
| Name | Required | Type | Description |
|:----:|:--------:|:----:| ----------- |
| `day` | N | string | 요청할 웹툰의 요일입니다.<br/>`type`이 `week`인 경우에만 가능합니다.<br/>미입력시 모든 요일의 웹툰 정보를 요청합니다.</br>요청 가능한 `day`는 다음과 같습니다.<ul><li>`mon` 월 week=0</li><li>`tue` 화 week=1</li><li>`wed` 수 week=2</li><li>`thu` 목 week=3</li><li>`fri` 금 week=4</li><li>`sat` 토 week=5</li><li>`sun` 일 week=6</li></ul> |

### Request sample (Javascript)
```javascript
(async () => {
  const res = await fetch("https://korea-webtoon-api.herokuapp.com/naver/week?day=mon", {
      method: "GET",
    }),
    json = await res.json();
  console.log(json);
  return json;
})();
```
## ⬇️ API Response

### Key

| name | type | Description |
|:----:|:----:| ----------- |
| title | string | 제목 |
| author | string | 작가 |
| img | string | Thumbnail img URL |
| service | string | 서비스 플랫폼 |
| week | integer  | 요일 번호 0 ~ 6 (월 ~ 일)<br/>완결 7 |
| additional | object | 추가적인 정보 |
| new | boolean | 신규 |
| rest | boolean | 휴재 |
| up | boolean | 새로운 회차가 업로드 |
| adult | boolean | 19세 이상  |

### Response sample
```JSON
 {
    "title": "참교육",
    "author": "채용택,한가람",
    "url": "https://m.comic.naver.com/webtoon/list?titleId=758037&week=mon",
    "img": "https://image-comic.pstatic.net/webtoon/758037/thumbnail/thumbnail_IMAG19_67290a02-fe7f-448d-aed9-6ec88e558088.jpg",
    "service": "naver",
    "week": 0,
    "additional": {
      "new": false,
      "adult": false,
      "rest": true,
      "up": false
    }
 }
```

### Error

| statusCode | message | error |
|:----------:|:-------:|:-----:|
| 400 | Invalid day value | Not Found |
| 404 | Cannot GET {path} | Not Found |
