import { createEnemyFormation, createPlayer } from "./entities.js";

export function createInitialState(highScore = 0) {
  return {
    mode: "title",
    player: createPlayer(),
    enemyFormation: createEnemyFormation(1),
    playerBullets: [],
    enemyBullets: [],
    score: 0,
    highScore: Math.max(0, Number(highScore) || 0),
    wave: 1,
    elapsedMs: 0,
    enemyShotTimerMs: 950
  };
}

export function resetForNewRun(state) {
  state.mode = "playing";
  state.player = createPlayer();
  state.enemyFormation = createEnemyFormation(1);
  state.playerBullets = [];
  state.enemyBullets = [];
  state.score = 0;
  state.wave = 1;
  state.elapsedMs = 0;
  state.enemyShotTimerMs = 950;
}
