import { FIXED_TIMESTEP_MS, GAME_HEIGHT, GAME_WIDTH } from "./config.js";
import { clearPressed, createInput, attachInputListeners } from "./input.js";
import { renderGame } from "./render.js";
import { createInitialState } from "./state.js";
import { loadHighScore, saveHighScore } from "./storage.js";
import { updateGame } from "./systems.js";

const canvas = document.getElementById("game");
if (!(canvas instanceof HTMLCanvasElement)) {
  throw new Error("Missing canvas element: #game");
}

canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

const ctx = canvas.getContext("2d");
if (!ctx) {
  throw new Error("Failed to create 2D context");
}
ctx.imageSmoothingEnabled = false;

const input = createInput();
const detachInput = attachInputListeners(input, window);
const state = createInitialState(loadHighScore());

let accumulatorMs = 0;
let lastTimestamp = performance.now();

function frame(now) {
  const delta = Math.min(100, now - lastTimestamp);
  lastTimestamp = now;
  accumulatorMs += delta;

  while (accumulatorMs >= FIXED_TIMESTEP_MS) {
    const previousMode = state.mode;
    updateGame(state, input, FIXED_TIMESTEP_MS);

    if (previousMode !== "gameover" && state.mode === "gameover") {
      saveHighScore(state.highScore);
    }

    clearPressed(input);
    accumulatorMs -= FIXED_TIMESTEP_MS;
  }

  renderGame(ctx, state);
  requestAnimationFrame(frame);
}

renderGame(ctx, state);
requestAnimationFrame(frame);

window.addEventListener("beforeunload", () => {
  detachInput();
  saveHighScore(state.highScore);
});
