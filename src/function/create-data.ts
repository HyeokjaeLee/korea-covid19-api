import * as get from "./get-external-data";
import { date2string, kor2Date } from "./convert-date";
import { Filter } from "./source-filter";
import fs from "fs";
/**
 * 전 지역의 COVID19 정보를 포함한 지역 데이터 생성
 * @returns COVID19데이터를 포함한 지역 데이터
 */
export default async function create_regionData(): Promise<Region.Final[]> {
  console.log(`update-start (${new Date()})`);
  const sourceData = await Promise.all([get.infection(), get.vaccination()]),
    infectionArr = sourceData[0],
    vaccinationArr = sourceData[1];
  const regionInfos: Region.Default[] = JSON.parse(
    fs.readFileSync("./data/region-info.json", "utf8")
  );
  const RegionArr = regionInfos.map((regionInfo: Region.Default) => {
    const _infectionArr = Filter.infection(find_infection(regionInfo.nameEng, infectionArr));
    const _vaccinationArr = find_vaccination(regionInfo.nameKorFull!, vaccinationArr);
    const requiredData = {
      infectionArr: _infectionArr,
      vaccinationArr: _vaccinationArr,
      population: regionInfo.population,
    };
    const covid19Data = create_covid19Data(requiredData);
    const result = {
      ...regionInfo,
      covid19: covid19Data,
    };
    delete result.nameKorFull;
    return result;
  });
  console.log(`update-end (${new Date()})`);
  return RegionArr;
}

/**
 * 지역에 맞는 감염 데이터 찾기
 * @param nameEng
 * @param infectionArr 전체 감염 데이터
 * @returns 해당 지역의 감염 데이터
 */
function find_infection(nameEng: string, infectionArr: Source.Infection[]) {
  return infectionArr.filter((infection) => infection.gubunEn.replace("-", "") === nameEng);
}
/**
 * 지역에 맞는 예방접종 데이터 찾기
 * @param nameKorFull
 * @param vaccinationArr 전체 예방접종 데이터
 * @returns 해당 지역의 예방접종 데이터
 */
function find_vaccination(nameKorFull: string, vaccinationArr: Source.Vaccination[]) {
  return vaccinationArr.filter((vaccination) => vaccination.sido === nameKorFull);
}
/**
 * 한 지역의 COVID19 정보를 생성
 * @param requiredData 한 지역의 감염 데이터, 예방접종 데이터, 인구수
 * @returns Covid19 정보
 */
function create_covid19Data(requiredData: {
  infectionArr: Filtered.Infection[];
  vaccinationArr: Filtered.Vaccination[];
  population: number | undefined;
}): Covid19[] {
  const { infectionArr, vaccinationArr, population } = requiredData;
  const minus = (num1: number | undefined, num2: number | undefined) =>
    !!num1 && !!num2 ? num1 - num2 : undefined;
  return infectionArr.slice(1).map((infection, index) => {
    const date = date2string(kor2Date(infection.stdDay));
    const vaccination = vaccinationArr.find(
      (vaccination) => date2string(new Date(vaccination.baseDate)) === date
    );
    const immunityRatio =
      vaccination?.totalSecondCnt === undefined || !population || !infection.isolClearCnt
        ? undefined
        : Math.round(((vaccination!.totalSecondCnt + infection.isolClearCnt) / population) * 1000) /
          1000;
    const aDayAgoInfectionArr = infectionArr[index];
    return {
      date: date,
      ratePer100k: typeof infection.qurRate === "number" ? infection.qurRate : undefined,
      immunityRatio: immunityRatio,
      confirmed: {
        total: infection.defCnt,
        new: {
          total: infection.incDec,
          domestic: infection.localOccCnt,
          overseas: infection.overFlowCnt,
        },
        accumlated: aDayAgoInfectionArr.defCnt,
      },
      recovered: {
        total: infection.isolClearCnt,
        new: minus(infection.isolClearCnt, aDayAgoInfectionArr.isolClearCnt),
        accumlated: aDayAgoInfectionArr.isolClearCnt,
      },
      dead: {
        total: infection.deathCnt,
        new: minus(infection.deathCnt, aDayAgoInfectionArr.deathCnt),
        accumlated: aDayAgoInfectionArr.deathCnt,
      },
      vaccinated: {
        first: {
          total: vaccination?.totalFirstCnt,
          new: vaccination?.firstCnt,
          accumlated: vaccination?.accumulatedFirstCnt,
        },
        second: {
          total: vaccination?.totalSecondCnt,
          new: vaccination?.secondCnt,
          accumlated: vaccination?.accumulatedSecondCnt,
        },
      },
    };
  });
}
