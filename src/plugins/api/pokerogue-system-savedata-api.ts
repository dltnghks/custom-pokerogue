import type {
  GetSystemSavedataRequest,
  UpdateSystemSavedataRequest,
  VerifySystemSavedataRequest,
  VerifySystemSavedataResponse,
} from "#app/@types/PokerogueSystemSavedataApi";
import { ApiBase } from "#app/plugins/api/api-base";

/**
 * A wrapper for PokéRogue system savedata API requests.
 */
export class PokerogueSystemSavedataApi extends ApiBase {
  //#region Public

  /**
   * Get a system savedata.
   * @param params The {@linkcode GetSystemSavedataRequest} to send
   * @returns The system savedata as `string` or `null` on error
   */
  public async get(params: GetSystemSavedataRequest) {
    console.log("start system get");
    try {
      console.log("go to toUrlSearchParams7");
      const urlSearchParams = this.toUrlSearchParams(params);
      const response = await this.doGet(`/savedata/system/get?${urlSearchParams}`);
      const rawSavedata = await response.text();

      console.log("system get 응답 : ", rawSavedata);

      return rawSavedata;
    } catch (err) {
      console.warn("Could not get system savedata!", err);
      return null;
    }
  }

  /**
   * Verify if the session is valid.
   * If not the {@linkcode SystemSaveData} is returned.
   * @param params The {@linkcode VerifySystemSavedataRequest} to send
   * @returns A {@linkcode SystemSaveData} if **NOT** valid, otherwise `null`.
   *
   * TODO: add handling for errors
   */
  public async verify(params: VerifySystemSavedataRequest) {
    console.log("start system verify");
    console.log("go to toUrlSearchParams8");
    const urlSearchParams = this.toUrlSearchParams(params);
    const response = await this.doGet(`/savedata/system/verify?${urlSearchParams}`);
    console.log("verify params : ", params);
    console.log("sytem verify 응답 : ", response);

    if (response.ok) {
      const verifySavedata = (await response.json()) as VerifySystemSavedataResponse;
      console.log("verifysavedata vaild : ", verifySavedata.valid);
      console.log("verifysavedata systemdata : ", verifySavedata.systemData);

      if (!verifySavedata.valid) {
        console.warn("Invalid system savedata!");
        return verifySavedata.systemData;
      }
    } else {
      console.warn("System savedata verification failed!", response.status, response.statusText);
    }

    return null;
  }

  /**
   * Update a system savedata.
   * @param params The {@linkcode UpdateSystemSavedataRequest} to send
   * @param rawSystemData The raw {@linkcode SystemSaveData}
   * @returns An error message if something went wrong
   */
  public async update(params: UpdateSystemSavedataRequest, rawSystemData: string) {
    console.log("start system update");
    try {
      console.log("go to toUrlSearchParams9");
      const urSearchParams = this.toUrlSearchParams(params);
      const response = await this.doPost(`/savedata/system/update?${urSearchParams}`, rawSystemData);

      console.log("system update 응답 : ", response);

      return await response.text();
    } catch (err) {
      console.warn("Could not update system savedata!", err);
    }

    return "Unknown Error";
  }
}
