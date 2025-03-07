import { globalScene } from "#app/global-scene";

export class Phase {
  start() {
    if (globalScene.abilityBar.shown) {
      globalScene.abilityBar.resetAutoHideTimer();
    }
    globalScene.gameData.saveAll(true, true, true);
  }

  end() {
    globalScene.shiftPhase();
  }
}
