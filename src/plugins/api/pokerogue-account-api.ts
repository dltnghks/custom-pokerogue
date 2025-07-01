import type {
  AccountInfoResponse,
  AccountLoginRequest,
  AccountLoginResponse,
  AccountRegisterRequest,
} from "#app/@types/PokerogueAccountApi";
import { SESSION_ID_COOKIE_NAME } from "#app/constants";
import { ApiBase } from "#app/plugins/api/api-base";
import { removeCookie, setCookie } from "#app/utils";

/**
 * A wrapper for PokéRogue account API requests.
 */
export class PokerogueAccountApi extends ApiBase {
  //#region Public

  /**
   * Request the {@linkcode AccountInfoResponse | UserInfo} of the logged in user.
   * The user is identified by the {@linkcode SESSION_ID_COOKIE_NAME | session cookie}.
   */
  public async getInfo(): Promise<[data: AccountInfoResponse | null, status: number]> {//계정 정보 가져오기.
    console.log("start getInfo");
    try {
      const response = await this.doGet("/account/info");//GET으로 보내기.

      if (response.ok) {
        const resData = (await response.json()) as AccountInfoResponse;
        console.log("getinfo resData : ", resData);
        return [ resData, response.status ];
      } else {
        console.warn("Could not get account info!", response.status, response.statusText);
        return [ null, response.status ];
      }
    } catch (err) {
      console.warn("Could not get account info!", err);
      return [ null, 500 ];
    }
  }

  /**
   * Register a new account.
   * @param registerData The {@linkcode AccountRegisterRequest} to send
   * @returns An error message if something went wrong
   */
  public async register(registerData: AccountRegisterRequest) {//계정 등록하기.
    try {
      const response = await this.doPost("/account/register", registerData, "form-urlencoded");//POST로 보내기.

      if (response.ok) {
        return null;
      } else {
        return response.text();
      }
    } catch (err) {
      console.warn("Register failed!", err);
    }

    return "Unknown error!";
  }

  /**
   * Send a login request.
   * Sets the session cookie on success.
   * @param loginData The {@linkcode AccountLoginRequest} to send
   * @returns An error message if something went wrong
   */
  public async login(loginData: AccountLoginRequest) {//계정 로그인하기.
    console.log("login start");
    try {
      const response = await this.doPost("/account/login", loginData, "form-urlencoded"); //POST로 보내기. 근데 왜 POST인거지? GET을 해야하는거 아닌가?
      //보안 때문

      if (response.ok) {//POST에 정상적으로 수신에 성공하는 경우.
        const loginResponse = (await response.json()) as AccountLoginResponse;
        console.log("loginResponse.token", loginResponse.token, " and cookie", SESSION_ID_COOKIE_NAME);
        setCookie(SESSION_ID_COOKIE_NAME, loginResponse.token);
        return null;
      } else {//비정상적인 경우.
        console.warn("Login failed!", response.status, response.statusText);
        return response.text();
      }//해당 과정에서 에러가 발생하는 경우.
    } catch (err) {
      console.warn("Login failed!", err);
    }

    return "Unknown error!";
  }

  /**
   * Send a logout request.
   * **Always** (no matter if failed or not) removes the session cookie.
   */
  public async logout() {//계정 로그아웃하기.
    console.log("start logout");
    try {
      const response = await this.doGet("/account/logout");

      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }
    } catch (err) {
      console.warn("Log out failed!", err);
    }
    console.log("remove cookie", SESSION_ID_COOKIE_NAME);
    removeCookie(SESSION_ID_COOKIE_NAME); // we are always clearing the cookie.
  }
}
