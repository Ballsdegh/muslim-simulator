import type { CounterKey, Goal } from '../types';

export interface GoalTemplate {
  id: string;
  title: string;
  icon: string;
  counter: CounterKey;
  target: number;
  xp: number;
}

export const GOAL_TEMPLATES: GoalTemplate[] = [
  { id: 'g.prayers', title: 'Совершить все 5 молитв', icon: 'prayer', counter: 'prayers', target: 5, xp: 60 },
  { id: 'g.ontime', title: '4 молитвы вовремя', icon: 'clock', counter: 'prayersOnTime', target: 4, xp: 40 },
  { id: 'g.pages', title: 'Прочитать 10 страниц Корана', icon: 'quran', counter: 'pages', target: 10, xp: 40 },
  { id: 'g.deeds', title: 'Сделать 2 добрых дела', icon: 'heart', counter: 'goodDeeds', target: 2, xp: 45 },
  { id: 'g.lesson', title: 'Завершить урок знаний', icon: 'education', counter: 'lessons', target: 1, xp: 35 },
  { id: 'g.study', title: 'Позаниматься учёбой или работой', icon: 'work', counter: 'study', target: 1, xp: 30 },
  { id: 'g.family', title: 'Уделить время близким', icon: 'users', counter: 'family', target: 1, xp: 30 },
  { id: 'g.charity', title: 'Дать садака', icon: 'charity', counter: 'charity', target: 1, xp: 35 },
];

/** Детерминированный ГПСЧ, чтобы цели зависели от номера дня (одинаковы при перезагрузке). */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function makeGoals(day: number): Goal[] {
  const rnd = mulberry32(day * 7919 + 13);
  const pool = [...GOAL_TEMPLATES];
  // «Все 5 молитв» всегда в списке — это ядро дня.
  const coreIdx = pool.findIndex((t) => t.id === 'g.prayers');
  const core = pool.splice(coreIdx, 1)[0];
  const picked: GoalTemplate[] = [core];
  while (picked.length < 3 && pool.length) {
    const i = Math.floor(rnd() * pool.length);
    picked.push(pool.splice(i, 1)[0]);
  }
  return picked.map((t) => ({
    id: `${t.id}.${day}`,
    title: t.title,
    icon: t.icon,
    counter: t.counter,
    target: t.target,
    xp: t.xp,
    done: false,
    rewarded: false,
  }));
}
