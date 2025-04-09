import { describe, it } from "vitest";
import { pokerogueApi } from "#app/plugins/api/pokerogue-api";

describe("Pokerogue Server API Test", () => {
  describe("Login Test", () => {
    it("Login", async () => {
      console.log("등록 시작");

      const promises: Promise<any>[] = [];  // Promise<any>[]로 타입을 명시

      // 병렬로 처리할 요청들을 모은다.
      for (let i = 0; i < 30; i++) {
        const usernameInput = `test00100${i}`;
        const passwordInput = "test123";

        // 회원가입 후 로그인 요청을 병렬로 처리하기 위해 Promise 배열에 추가
        const registerPromise = pokerogueApi.account.register({ username: usernameInput, password: passwordInput });
        const loginPromise = registerPromise.then(() => pokerogueApi.account.login({ username: usernameInput, password: passwordInput }));

        // 회원가입과 로그인 요청을 병렬로 추가
        promises.push(registerPromise, loginPromise);
      }

      // 모든 요청을 병렬로 처리
      try {
        const results = await Promise.all(promises);

        // 결과 처리 (register와 login의 결과는 병렬로 처리되므로 한 쌍씩 출력)
        results.forEach((result, index) => {
          if (index % 2 === 0) {
            // register 결과
            const registerError = result;
            if (registerError) {
              console.log(`등록 ${index / 2 + 1} 실패:`, registerError);
            } else {
              console.log(`등록 ${index / 2 + 1} 성공`);
            }
          } else {
            // login 결과
            const loginError = result;
            if (loginError) {
              console.log(`로그인 ${(index + 1) / 2} 실패:`, loginError);
            } else {
              console.log(`로그인 ${(index + 1) / 2} 성공`);
            }
          }
        });
      } catch (error) {
        console.log("오류 발생:", error);
      }
    });
  });

  // describe("Session Update Test", () => {
  //   const params: UpdateSessionSavedataRequest = {
  //     clientSessionId: "test-session-id",
  //     slot: 3,
  //     secretId: 9876543321,
  //     trainerId: 123456789,
  //   };

  //   it("should continuously send update requests for a period of time", async () => {
  //     console.log("세션 업데이트 시작");

  //     const updatePromises: Promise<any>[] = [];  // 세션 업데이트 요청을 병렬로 처리할 Promise 배열

  //     // 세션 업데이트 요청을 Promise 배열에 추가
  //     for(let i = 0; i < 10; i++){
  //       const updatePromise = pokerogueApi.savedata.session.update(params, `UPDATED SESSION SAVEDATA`);
  //       updatePromises.push(updatePromise);
  //     }

  //     // const duration = 3000;  // 10초 동안 지속적으로 업데이트 요청 보내기 (10000ms = 10초)
  //     // const interval = 1000;   // 1초 간격으로 요청 보내기 (1000ms = 1초)

  //     // let startTime = Date.now();

  //     // const intervalId = setInterval(() => {
  //     //   const elapsedTime = Date.now() - startTime;

  //     //   // 10초가 경과하면 종료
  //     //   if (elapsedTime >= duration) {
  //     //     clearInterval(intervalId);  // 요청을 중지
  //     //     console.log("세션 업데이트 종료");
  //     //   }

  //     //   // 유니크한 세션 ID와 trainerId를 사용하여 요청 보내기
  //     //   // const currentParams: UpdateSessionSavedataRequest = {
  //     //   //   ...params,
  //     //   //   clientSessionId: `test-session-id-${elapsedTime}`,  // 세션 ID는 요청마다 다르게 설정
  //     //   //   trainerId: 123456789 + elapsedTime / 1000,  // trainerId도 변경
  //     //   // };

  //     //   // 세션 업데이트 요청을 Promise 배열에 추가
  //     //   const updatePromise = pokerogueApi.savedata.session.update(params, `UPDATED SESSION SAVEDATA`);
  //     //   updatePromises.push(updatePromise);

  //     //   console.log(`업데이트 요청 ${elapsedTime / 1000}초 후`);

  //     // }, interval);  // 1초마다 요청을 보냄

  //     // 모든 세션 업데이트 요청을 병렬로 처리
  //     try {
  //       const results = await Promise.all(updatePromises);  // 병렬로 처리된 모든 요청 완료 대기

  //       // 각 요청 결과 확인
  //       results.forEach((result, index) => {
  //         if (result instanceof Error) {
  //           console.log(`요청 ${index + 1} 실패:`, result);
  //         } else {
  //           console.log(`요청 ${index + 1} 성공:`, result);
  //         }
  //       });
  //     } catch (error) {
  //       console.log("세션 업데이트 중 오류 발생:", error);
  //     }
  //   });
  // });
});
