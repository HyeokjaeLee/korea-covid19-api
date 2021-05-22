import { parentPort } from "worker_threads";
import { getCovid19Data } from "./components/korea-covid19";
import { checkUpdates } from "./function/checking";

(async () => {
  const covid19_info = await getCovid19Data();
  checkUpdates("Covid19", covid19_info);
  parentPort!.postMessage(covid19_info); //결과가 null될수도 있는 값에는 !붙이기
  parentPort!.close();
})();
