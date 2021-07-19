![header](https://capsule-render.vercel.app/api?type=rect&color=gradient&height=100&section=header&text=COVID-19%20API&fontSize=30&fontAlign=50&fontAlignY=50)

![VERSION](https://img.shields.io/badge/version-1.4.5-C76C30?style=flat-square)&nbsp;&nbsp;&nbsp;![GRAPHQL](https://img.shields.io/badge/GraphQL-E434AA?style=flat-square&logo=graphql&logoColor=white) ![TYPESCRIPT](https://img.shields.io/badge/Typescript-3178c6?style=flat-square&logo=typescript&logoColor=white) ![JAVASCRIPT](https://img.shields.io/badge/Javascript-F7DF1E?style=flat-square&logo=Javascript&logoColor=black) ![NODE](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=Node.js&logoColor=white) ![EXPRESS](https://img.shields.io/badge/Express-4C4C4C?style=flat-square&logo=Express&logoColor=white) ![HEROKU](https://img.shields.io/badge/Heroku-430098?style=flat-square&logo=Heroku&logoColor=white)

대한민국 코로나 감염, 예방접종, 사회적 거리두기 현황등 종합적인 정보 제공

---

**:warning:<U>Heroku 서버를 사용하고 있기 때문에 서버가 Sleep 상태일 경우 첫 요청시 1분 가량 소요됩니다.</U>.**<br>

## :bookmark:Request

## :memo: Data List

- ### **상위** Object Key
  - regionEng: 영문 지역명
  - regionKor: 한글 지역명
  - population: 대략적인 지역 인구
  - distancingLevel: 현재 사회적 거리두기 단계
  - covid19DataList: 날짜별 COVID19 데이터
- ### **covid19DataList** Object Key
  - date: 날짜
  - confirmed: 확진자
  - quarantine: 격리자
  - recovered: 회복자(격리해제)
  - dead: 사망자
  - vaccinated: 예방접종
  - per100kConfirmed: 10만명 당 확진자
- ### **공통 하위** Object Key
  - total: 전체(신규+누적)
  - new: 신규(당일)
  - accumlated: 누적(전일)
- ### **new quarantine(신규 격리자)** Object Key
  - domestic: 국내 감염
  - overseas: 해외 감염
- ### **vaccinated** Object Key
  - first: 1차 접종
  - second: 2차 접종
