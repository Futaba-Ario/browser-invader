const STORAGE_KEY = "browser_invader_high_score";

export function loadHighScore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = Number.parseInt(raw || "0", 10);
    if (Number.isNaN(parsed) || parsed < 0) {
      return 0;
    }
    return parsed;
  } catch {
    return 0;
  }
}

export function saveHighScore(score) {
  try {
    const safeScore = Math.max(0, Number(score) || 0);
    localStorage.setItem(STORAGE_KEY, String(safeScore));
  } catch {
    // Ignore storage failures in privacy-restricted contexts.
  }
}
