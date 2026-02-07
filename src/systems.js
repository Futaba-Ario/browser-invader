import {
  ENEMY_BOTTOM_LIMIT,
  ENEMY_DESCEND_STEP,
  ENEMY_FIRE_ACCEL_PER_WAVE,
  ENEMY_FIRE_INTERVAL_MAX_MS,
  ENEMY_FIRE_INTERVAL_MIN_MS,
  GAME_HEIGHT,
  GAME_WIDTH,
  PLAYER_SHOT_COOLDOWN_MS,
  PLAYER_SPEED
} from "./config.js";
import { createEnemyBullet, createEnemyFormation, createPlayerBullet, overlaps } from "./entities.js";
import { isDown, wasPressed } from "./input.js";
import { resetForNewRun } from "./state.js";

export function updateGame(state, input, dtMs) {
  state.elapsedMs += dtMs;

  if (state.mode === "title") {
    if (wasPressed(input, "Enter")) {
      resetForNewRun(state);
    }
    return;
  }

  if (state.mode === "gameover") {
    if (wasPressed(input, "Enter")) {
      resetForNewRun(state);
    }
    return;
  }

  const dtSec = dtMs / 1000;

  updatePlayer(state, input, dtMs, dtSec);
  updateEnemyFormation(state, dtSec);
  if (state.mode !== "playing") {
    updateHighScore(state);
    return;
  }

  updateEnemyFire(state, dtMs);
  updateBullets(state, dtSec);
  resolveCollisions(state);
  pruneBullets(state);
  handleWaveClear(state);
  updateHighScore(state);
}

function updatePlayer(state, input, dtMs, dtSec) {
  const player = state.player;
  let direction = 0;

  if (isDown(input, "ArrowLeft")) {
    direction -= 1;
  }
  if (isDown(input, "ArrowRight")) {
    direction += 1;
  }

  player.x += direction * PLAYER_SPEED * dtSec;
  player.x = clamp(player.x, 0, GAME_WIDTH - player.width);
  player.cooldownMs = Math.max(0, player.cooldownMs - dtMs);

  if (isDown(input, "Space") && player.cooldownMs <= 0) {
    state.playerBullets.push(createPlayerBullet(player));
    player.cooldownMs = PLAYER_SHOT_COOLDOWN_MS;
  }
}

function updateEnemyFormation(state, dtSec) {
  const formation = state.enemyFormation;
  const alive = formation.invaders.filter((enemy) => enemy.alive);

  if (alive.length === 0) {
    return;
  }

  let hitEdge = false;
  for (const enemy of alive) {
    enemy.x += formation.direction * formation.speed * dtSec;
    if (enemy.x <= 14 || enemy.x + enemy.width >= GAME_WIDTH - 14) {
      hitEdge = true;
    }
  }

  if (hitEdge) {
    formation.direction *= -1;
    for (const enemy of alive) {
      enemy.y += ENEMY_DESCEND_STEP;
    }
  }

  for (const enemy of alive) {
    if (enemy.y + enemy.height >= ENEMY_BOTTOM_LIMIT) {
      state.mode = "gameover";
      return;
    }
  }
}

function updateEnemyFire(state, dtMs) {
  state.enemyShotTimerMs -= dtMs;
  if (state.enemyShotTimerMs > 0) {
    return;
  }

  const alive = state.enemyFormation.invaders.filter((enemy) => enemy.alive);
  if (alive.length === 0) {
    return;
  }

  const shooter = pickShooter(alive);
  if (shooter) {
    state.enemyBullets.push(createEnemyBullet(shooter));
  }

  const fireMin = Math.max(250, ENEMY_FIRE_INTERVAL_MIN_MS - (state.wave - 1) * ENEMY_FIRE_ACCEL_PER_WAVE);
  const fireMax = Math.max(fireMin + 150, ENEMY_FIRE_INTERVAL_MAX_MS - (state.wave - 1) * ENEMY_FIRE_ACCEL_PER_WAVE);
  state.enemyShotTimerMs = randomRange(fireMin, fireMax);
}

function pickShooter(aliveEnemies) {
  const byColumn = new Map();

  for (const enemy of aliveEnemies) {
    const current = byColumn.get(enemy.col);
    if (!current || enemy.y > current.y) {
      byColumn.set(enemy.col, enemy);
    }
  }

  const candidates = Array.from(byColumn.values());
  if (candidates.length === 0) {
    return null;
  }

  const index = Math.floor(Math.random() * candidates.length);
  return candidates[index];
}

function updateBullets(state, dtSec) {
  for (const bullet of state.playerBullets) {
    bullet.x += bullet.vx * dtSec;
    bullet.y += bullet.vy * dtSec;
  }

  for (const bullet of state.enemyBullets) {
    bullet.x += bullet.vx * dtSec;
    bullet.y += bullet.vy * dtSec;
  }
}

function resolveCollisions(state) {
  const enemies = state.enemyFormation.invaders;

  for (const bullet of state.playerBullets) {
    if (!bullet.active) {
      continue;
    }

    for (const enemy of enemies) {
      if (!enemy.alive) {
        continue;
      }

      if (overlaps(bullet, enemy)) {
        bullet.active = false;
        enemy.alive = false;
        state.score += enemy.points;
        break;
      }
    }
  }

  for (const bullet of state.enemyBullets) {
    if (!bullet.active) {
      continue;
    }

    if (overlaps(bullet, state.player)) {
      bullet.active = false;
      state.mode = "gameover";
      return;
    }
  }
}

function pruneBullets(state) {
  state.playerBullets = state.playerBullets.filter(
    (bullet) => bullet.active && bullet.y + bullet.height >= -8
  );

  state.enemyBullets = state.enemyBullets.filter(
    (bullet) => bullet.active && bullet.y <= GAME_HEIGHT + 8
  );
}

function handleWaveClear(state) {
  const remaining = state.enemyFormation.invaders.some((enemy) => enemy.alive);
  if (remaining) {
    return;
  }

  state.wave += 1;
  state.enemyFormation = createEnemyFormation(state.wave);
  state.playerBullets = [];
  state.enemyBullets = [];
  state.enemyShotTimerMs = 900;
}

function updateHighScore(state) {
  if (state.score > state.highScore) {
    state.highScore = state.score;
  }
}

function randomRange(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
