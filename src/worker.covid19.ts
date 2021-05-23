import { parentPort } from "worker_threads";
import { getCovid19Data } from "./components/get_covid19_data";

(async () => {
  const covid19_info = await getCovid19Data();
  parentPort!.postMessage(covid19_info); //결과가 null될수도 있는 값에는 !붙이기
  parentPort!.close();
})();
