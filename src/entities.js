import {
  BULLET_HEIGHT,
  BULLET_WIDTH,
  ENEMY_BASE_SPEED,
  ENEMY_COLS,
  ENEMY_HEIGHT,
  ENEMY_H_SPACING,
  ENEMY_MARGIN_X,
  ENEMY_ROWS,
  ENEMY_SPEED_PER_WAVE,
  ENEMY_START_Y,
  ENEMY_V_SPACING,
  ENEMY_WIDTH,
  GAME_WIDTH,
  PLAYER_HEIGHT,
  PLAYER_START_Y,
  PLAYER_WIDTH,
  PLAYER_BULLET_SPEED,
  ENEMY_BULLET_SPEED
} from "./config.js";

export function createPlayer() {
  return {
    x: GAME_WIDTH / 2 - PLAYER_WIDTH / 2,
    y: PLAYER_START_Y,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    cooldownMs: 0
  };
}

export function createEnemyFormation(wave) {
  const invaders = [];
  const pointsByRow = [50, 40, 30, 20, 10];

  for (let row = 0; row < ENEMY_ROWS; row += 1) {
    for (let col = 0; col < ENEMY_COLS; col += 1) {
      invaders.push({
        row,
        col,
        x: ENEMY_MARGIN_X + col * ENEMY_H_SPACING,
        y: ENEMY_START_Y + row * ENEMY_V_SPACING,
        width: ENEMY_WIDTH,
        height: ENEMY_HEIGHT,
        points: pointsByRow[row] || 10,
        alive: true
      });
    }
  }

  return {
    direction: 1,
    speed: ENEMY_BASE_SPEED + (wave - 1) * ENEMY_SPEED_PER_WAVE,
    invaders
  };
}

export function createPlayerBullet(player) {
  return {
    x: player.x + player.width / 2 - BULLET_WIDTH / 2,
    y: player.y - BULLET_HEIGHT,
    width: BULLET_WIDTH,
    height: BULLET_HEIGHT,
    vx: 0,
    vy: -PLAYER_BULLET_SPEED,
    active: true,
    owner: "player"
  };
}

export function createEnemyBullet(enemy) {
  return {
    x: enemy.x + enemy.width / 2 - BULLET_WIDTH / 2,
    y: enemy.y + enemy.height,
    width: BULLET_WIDTH,
    height: BULLET_HEIGHT,
    vx: 0,
    vy: ENEMY_BULLET_SPEED,
    active: true,
    owner: "enemy"
  };
}

export function overlaps(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
