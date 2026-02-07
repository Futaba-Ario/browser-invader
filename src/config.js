export const GAME_WIDTH = 480;
export const GAME_HEIGHT = 640;

export const PLAYER_WIDTH = 32;
export const PLAYER_HEIGHT = 18;
export const PLAYER_START_Y = GAME_HEIGHT - 64;
export const PLAYER_SPEED = 320;
export const PLAYER_SHOT_COOLDOWN_MS = 210;

export const ENEMY_ROWS = 5;
export const ENEMY_COLS = 9;
export const ENEMY_WIDTH = 26;
export const ENEMY_HEIGHT = 18;
export const ENEMY_MARGIN_X = 60;
export const ENEMY_START_Y = 92;
export const ENEMY_H_SPACING = 38;
export const ENEMY_V_SPACING = 34;
export const ENEMY_BASE_SPEED = 52;
export const ENEMY_SPEED_PER_WAVE = 10;
export const ENEMY_DESCEND_STEP = 20;
export const ENEMY_BOTTOM_LIMIT = GAME_HEIGHT - 120;
export const ENEMY_FIRE_INTERVAL_MIN_MS = 820;
export const ENEMY_FIRE_INTERVAL_MAX_MS = 1500;
export const ENEMY_FIRE_ACCEL_PER_WAVE = 60;

export const PLAYER_BULLET_SPEED = 470;
export const ENEMY_BULLET_SPEED = 250;
export const BULLET_WIDTH = 4;
export const BULLET_HEIGHT = 12;

export const FIXED_TIMESTEP_MS = 1000 / 60;

export const COLORS = {
  background: "#060e14",
  player: "#33c3a9",
  playerAccent: "#c6fff1",
  enemyRows: ["#ff9466", "#ff7f50", "#ff6f3c", "#f55d3b", "#d84b36"],
  playerBullet: "#f3ffe6",
  enemyBullet: "#ff8c65",
  hud: "#dff4ff",
  hudMuted: "#8fb3c8",
  panel: "rgba(8, 20, 28, 0.82)"
};
