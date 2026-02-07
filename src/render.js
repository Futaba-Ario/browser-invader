import { COLORS, GAME_HEIGHT, GAME_WIDTH } from "./config.js";

export function renderGame(ctx, state) {
  drawBackground(ctx, state.elapsedMs);
  drawHud(ctx, state);

  if (state.mode !== "title") {
    drawPlayer(ctx, state.player);
    drawEnemies(ctx, state.enemyFormation.invaders);
    drawBullets(ctx, state.playerBullets, state.enemyBullets);
  }

  if (state.mode === "title") {
    drawOverlay(
      ctx,
      "BROWSER INVADER",
      "Press Enter or tap START",
      "Move: Left/Right or touch buttons"
    );
  }

  if (state.mode === "gameover") {
    drawOverlay(
      ctx,
      "GAME OVER",
      "Press Enter or tap RETRY",
      `Final score: ${state.score}`
    );
  }
}

function drawBackground(ctx, elapsedMs) {
  ctx.fillStyle = COLORS.background;
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  for (let i = 0; i < 44; i += 1) {
    const lane = (i % 3) + 1;
    const speed = lane * 0.026;
    const x = (i * 71) % GAME_WIDTH;
    const y = ((i * 119) + elapsedMs * speed) % GAME_HEIGHT;
    const size = lane === 3 ? 2 : 1;

    ctx.fillStyle = lane === 3 ? "rgba(255,255,255,0.85)" : "rgba(143,179,200,0.55)";
    ctx.fillRect(x, y, size, size);
  }
}

function drawHud(ctx, state) {
  ctx.fillStyle = COLORS.hud;
  ctx.font = "13px 'Lucida Console', 'Courier New', monospace";
  ctx.fillText(`SCORE ${String(state.score).padStart(5, "0")}`, 12, 24);

  ctx.fillStyle = COLORS.hudMuted;
  ctx.fillText(`HIGH ${String(state.highScore).padStart(5, "0")}`, 12, 44);
  ctx.fillText(`WAVE ${state.wave}`, GAME_WIDTH - 108, 24);
}

function drawPlayer(ctx, player) {
  ctx.fillStyle = COLORS.player;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  const coreW = Math.round(player.width * 0.28);
  const coreX = player.x + Math.round((player.width - coreW) / 2);

  ctx.fillStyle = COLORS.playerAccent;
  ctx.fillRect(coreX, player.y - 6, coreW, 6);
}

function drawEnemies(ctx, enemies) {
  for (const enemy of enemies) {
    if (!enemy.alive) {
      continue;
    }

    ctx.fillStyle = COLORS.enemyRows[enemy.row % COLORS.enemyRows.length];
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

    ctx.fillStyle = "rgba(7, 16, 24, 0.6)";
    ctx.fillRect(enemy.x + 4, enemy.y + 6, enemy.width - 8, 4);
  }
}

function drawBullets(ctx, playerBullets, enemyBullets) {
  ctx.fillStyle = COLORS.playerBullet;
  for (const bullet of playerBullets) {
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  }

  ctx.fillStyle = COLORS.enemyBullet;
  for (const bullet of enemyBullets) {
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  }
}

function drawOverlay(ctx, title, line1, line2) {
  const panelW = 320;
  const panelH = 136;
  const x = (GAME_WIDTH - panelW) / 2;
  const y = (GAME_HEIGHT - panelH) / 2;

  ctx.fillStyle = COLORS.panel;
  ctx.fillRect(x, y, panelW, panelH);

  ctx.strokeStyle = "#2d556b";
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, panelW, panelH);

  ctx.fillStyle = COLORS.hud;
  ctx.font = "19px 'Lucida Console', 'Courier New', monospace";
  ctx.fillText(title, x + 24, y + 40);

  ctx.fillStyle = COLORS.hudMuted;
  ctx.font = "13px 'Lucida Console', 'Courier New', monospace";
  ctx.fillText(line1, x + 24, y + 76);
  ctx.fillText(line2, x + 24, y + 100);
}
