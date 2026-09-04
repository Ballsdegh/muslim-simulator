/** XP, необходимый для перехода с уровня L на L+1. */
export function xpForNextLevel(level: number): number {
  return 100 + (level - 1) * 60;
}

/** Вычислить уровень и остаток XP по общему количеству XP. */
export function levelFromXp(xp: number): { level: number; inLevel: number; needed: number } {
  let level = 1;
  let rest = xp;
  while (rest >= xpForNextLevel(level)) {
    rest -= xpForNextLevel(level);
    level += 1;
    if (level > 200) break;
  }
  return { level, inLevel: rest, needed: xpForNextLevel(level) };
}

/** Множитель XP от серии дисциплины (мягкий, с потолком). */
export function streakMultiplier(streak: number): number {
  return 1 + Math.min(streak, 25) * 0.02;
}

export const DAY_START = 4 * 60; // игровой день начинается в 04:00
export const DAY_END = 23 * 60 + 30; // и заканчивается в 23:30
export const GRACE_MINUTES = 50; // столько минут событие остаётся доступным после начала
