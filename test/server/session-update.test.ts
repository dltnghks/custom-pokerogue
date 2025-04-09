import { describe, it } from "vitest";
import { pokerogueApi } from "#app/plugins/api/pokerogue-api";
import type { UpdateAllSavedataRequest } from "#app/@types/PokerogueSavedataApi";

describe("Pokerogue Server API Test", () => {
  describe("Session Update Test", () => {
    it("should continuously send update requests for a period of time", async () => {
      console.log("세션 업데이트 시작");

      const updatePromises: Promise<any>[] = [];  // 세션 업데이트 요청을 병렬로 처리할 Promise 배열

      const duration = 10000;  // 10초 동안 지속적으로 업데이트 요청 보내기 (10000ms = 10초)
      const interval = 1000;   // 1초 간격으로 요청 보내기 (1000ms = 1초)

      const startTime = Date.now();

      // 10초 동안 지속적으로 요청을 보내기 위한 비동기 함수
      const sendUpdates = async () => {
        const elapsedTime = Date.now() - startTime;

        // 10초가 경과하면 종료
        if (elapsedTime >= duration) {
          console.log("세션 업데이트 종료");
          return; // 종료
        }

        // 세션 업데이트 요청을 Promise 배열에 추가
        const updatePromise = pokerogueApi.savedata.updateAll({} as UpdateAllSavedataRequest);
        updatePromises.push(updatePromise);

        // Promise를 처리 (await 또는 then/catch 사용)
        updatePromise.catch((error) => console.error("업데이트 요청 실패:", error));

        console.log(`업데이트 요청 ${elapsedTime / 1000}초 후`);

        // 1초 간격으로 계속해서 요청을 보냄
        await new Promise(resolve => setTimeout(resolve, interval));
        await sendUpdates();  // 재귀 호출 시 await 사용
      };


      // 처음 요청을 보냄
      await sendUpdates();

      try {
        const results = await Promise.all(updatePromises);  // 병렬로 처리된 모든 요청 완료 대기

        // 각 요청 결과 확인
        results.forEach((result, index) => {
          if (result instanceof Error) {
            console.log(`요청 ${index + 1} 실패:`, result);
          } else {
            console.log(`요청 ${index + 1} 성공:`, result);
          }
        });

        console.log("모든 세션 업데이트 완료");
      } catch (error) {
        console.log("세션 업데이트 중 오류 발생:", error);
      }
    });
  });
});
