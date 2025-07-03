import type {
  ClearSessionSavedataRequest,
  ClearSessionSavedataResponse,
  DeleteSessionSavedataRequest,
  GetSessionSavedataRequest,
  NewClearSessionSavedataRequest,
  UpdateSessionSavedataRequest,
} from "#app/@types/PokerogueSessionSavedataApi";
import { ApiBase } from "#app/plugins/api/api-base";
import type { SessionSaveData } from "#app/system/game-data";

/**
 * A wrapper for PokéRogue session savedata API requests.
 */
export class PokerogueSessionSavedataApi extends ApiBase {
  //#region Public

  /**
   * Mark a session as cleared aka "newclear".\
   * *This is **NOT** the same as {@linkcode clear | clear()}.*
   * @param params The {@linkcode NewClearSessionSavedataRequest} to send
   * @returns The raw savedata as `string`.
   */
  public async newclear(params: NewClearSessionSavedataRequest) {
    console.log("start session newclear");
    try {
      console.log("go to toUrlSearchParams2");
      const urlSearchParams = this.toUrlSearchParams(params);
      const response = await this.doGet(`/savedata/session/newclear?${urlSearchParams}`);
      const json = await response.json();

      console.log("session newclear 응답 : ", response);

      return Boolean(json);
    } catch (err) {
      console.warn("Could not newclear session!", err);
      return false;
    }
  }

  /**
   * Get a session savedata.
   * @param params The {@linkcode GetSessionSavedataRequest} to send
   * @returns The session as `string`
   */
  public async get(params: GetSessionSavedataRequest) {
    console.log("start session get");
    try {
      console.log("go to toUrlSearchParams3");
      const urlSearchParams = this.toUrlSearchParams(params);
      const response = await this.doGet(`/savedata/session/get?${urlSearchParams}`);

      console.log("session get 응답 : ", response);

      return await response.text();
    } catch (err) {
      console.warn("Could not get session savedata!", err);
      return null;
    }
  }

  /**
   * Update a session savedata.
   * @param params The {@linkcode UpdateSessionSavedataRequest} to send
   * @param rawSavedata The raw savedata (as `string`)
   * @returns An error message if something went wrong
   */
  public async update(params: UpdateSessionSavedataRequest, rawSavedata: string) {
    console.log("start session update");
    try {
      console.log("go to toUrlSearchParams4");
      const urlSearchParams = this.toUrlSearchParams(params);
      const response = await this.doPost(`/savedata/session/update?${urlSearchParams}`, rawSavedata);

      console.log("session update 응답 : ", response);

      return await response.text();
    } catch (err) {
      console.warn("Could not update session savedata!", err);
    }

    return "Unknown Error!";
  }

  /**
   * Delete a session savedata slot.
   * @param params The {@linkcode DeleteSessionSavedataRequest} to send
   * @returns An error message if something went wrong
   */
  public async delete(params: DeleteSessionSavedataRequest) {
    console.log("start session delete");
    try {
      console.log("go to toUrlSearchParams5");
      const urlSearchParams = this.toUrlSearchParams(params);
      const response = await this.doGet(`/savedata/session/delete?${urlSearchParams}`);

      console.log("session delete 응답 : ", response);

      if (response.ok) {
        return null;
      } else {
        return await response.text();
      }
    } catch (err) {
      console.warn("Could not delete session savedata!", err);
      return "Unknown error";
    }
  }

  /**
   * Clears the session savedata of the given slot.\
   * *This is **NOT** the same as {@linkcode newclear | newclear()}.*
   * @param params The {@linkcode ClearSessionSavedataRequest} to send
   * @param sessionData The {@linkcode SessionSaveData} object
   */
  public async clear(params: ClearSessionSavedataRequest, sessionData: SessionSaveData) {
    console.log("start session clear");
    try {
      console.log("go to toUrlSearchParams6");
      const urlSearchParams = this.toUrlSearchParams(params);
      const response = await this.doPost(`/savedata/session/clear?${urlSearchParams}`, sessionData);

      console.log("session clear 응답 : ", response);

      return (await response.json()) as ClearSessionSavedataResponse;
    } catch (err) {
      console.warn("Could not clear session savedata!", err);
    }

    return {
      error: "Unknown error",
      success: false,
    } as ClearSessionSavedataResponse;
  }
}
