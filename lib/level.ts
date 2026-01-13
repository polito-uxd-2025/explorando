// XP leveling utilities with exponential progression

export const DEFAULT_BASE_XP = 20; // XP from level 1 -> 2
export const DEFAULT_GROWTH = 1.3; // Per-level growth factor (tune between 1.2–1.5)

/**
 * XP needed to go from a given level L to L+1 (per-level cost).
 * L=1 returns baseXP (default 20).
 */
export function xpBetweenLevels(
  level: number,
  baseXP: number = DEFAULT_BASE_XP,
  growth: number = DEFAULT_GROWTH
): number {
  if (level < 1) return 0;
  const cost = baseXP * Math.pow(growth, level - 1);
  return Math.round(cost);
}

/**
 * Total XP required to reach a target level (cumulative). Level 1 -> 0 XP.
 * Uses closed-form geometric series: base * (g^(L-1) - 1) / (g - 1).
 */
export function xpToReachLevel(
  level: number,
  baseXP: number = DEFAULT_BASE_XP,
  growth: number = DEFAULT_GROWTH
): number {
  if (level <= 1) return 0;
  const total = (baseXP * (Math.pow(growth, level - 1) - 1)) / (growth - 1);
  return Math.round(total);
}

/**
 * Minimum total XP required to reach (i.e., be considered at) a given level L.
 * Alias of xpToReachLevel for clarity when used by callers.
 * Level 1 -> 0 XP.
 */
export function minXpForLevel(
  level: number,
  baseXP: number = DEFAULT_BASE_XP,
  growth: number = DEFAULT_GROWTH
): number {
  return xpToReachLevel(level, baseXP, growth);
}

/**
 * Computes the level for a given total XP using the inverse of the series.
 * Level 1 for XP <= 0.
 */
export function levelFromXp(
  xp: number,
  baseXP: number = DEFAULT_BASE_XP,
  growth: number = DEFAULT_GROWTH
): number {
  if (!isFinite(xp) || xp <= 0) return 1;
  const levelReal =
    1 + Math.log(((xp * (growth - 1)) / baseXP) + 1) / Math.log(growth);
  return Math.max(1, Math.floor(levelReal));
}

export type LevelInfo = {
  level: number; // current level (1-based)
  currentXp: number; // XP into the current level
  currentLevelXp: number; // XP needed to reach next level from current
  progress: number; // 0..1 progress within current level
  nextLevelAt: number; // total XP required to reach level+1
};

/**
 * High-level helper summarizing the player's current progression.
 */
export function getLevelInfo(
  xp: number,
  baseXP: number = DEFAULT_BASE_XP,
  growth: number = DEFAULT_GROWTH
): LevelInfo {
  const level = levelFromXp(xp, baseXP, growth);
  const totalForLevel = xpToReachLevel(level, baseXP, growth);
  const currentLevelXp = xpBetweenLevels(level, baseXP, growth);
  const currentXp = Math.max(0, Math.round(xp - totalForLevel));
  const progress = currentLevelXp > 0 ? Math.min(1, currentXp / currentLevelXp) : 0;
  const nextLevelAt = xpToReachLevel(level + 1, baseXP, growth);

  return { level, currentXp, currentLevelXp, progress, nextLevelAt };
}

/**
 * Example defaults:
 * - Level 1 -> 2 costs 20 XP
 * - Growth 1.3 gives a steady but exponential increase. Adjust to taste.
 */
