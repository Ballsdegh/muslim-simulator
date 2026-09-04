import type {
  DayCounters,
  DayEvent,
  DayRecord,
  Effects,
  Goal,
  Notif,
  SaveState,
  StatKey,
} from '../types';
import { GRACE_MINUTES, DAY_START, streakMultiplier } from '../data/levels';
import { getPrayerTimes } from '../data/prayerTimes';
import { PRAYER_EVENT_BY_KEY } from '../data/events';
import { RANDOM_EVENTS, SCHEDULED_EVENTS, FREE_ACTIONS } from '../data/events';
import { ACHIEVEMENTS } from '../data/achievements';
import { makeGoals, mulberry32 } from '../data/goals';
import { LESSONS } from '../data/knowledge';
import { clamp, fmtTime } from '../utils';
import { levelFromXp, xpForNextLevel } from '../data/levels';

export const SAVE_KEY = 'muslim-sim-save-v3';
export const SAVE_VERSION = 3;
/** Игровых минут за одну реальную секунду. */
export const GAME_MIN_PER_SEC = 0.75;

const STAT_KEYS: StatKey[] = [
  'iman',
  'prayer',
  'knowledge',
  'deeds',
  'health',
  'energy',
  'mood',
  'reputation',
];

const HELP_DEFS = new Set(['r.neighbor', 'r.direction', 'r.colleague', 'r.kitchen', 'r.queue', 'r.wallet']);
const FAMILY_OPTIONS = new Set(['dinner#0', 'r.callmom#0', 'r.invite#0', 'r.invite#1', 'f.family']);

function emptyCounters(): DayCounters {
  return {
    prayers: 0,
    prayersOnTime: 0,
    pages: 0,
    goodDeeds: 0,
    lessons: 0,
    study: 0,
    family: 0,
    charity: 0,
  };
}

export function createInitialState(): SaveState {
  return {
    version: SAVE_VERSION,
    playerName: '',
    avatar: 'a1',
    onboarded: false,
    startedAtISO: new Date().toISOString(),
    day: 1,
    clock: DAY_START,
    lastTickAt: Date.now(),
    stats: {
      iman: 55,
      prayer: 50,
      knowledge: 20,
      deeds: 30,
      health: 65,
      energy: 70,
      mood: 60,
      reputation: 40,
    },
    money: 4500,
    xp: 0,
    streak: 0,
    bestStreak: 0,
    schedule: buildDaySchedule(1),
    goals: makeGoals(1),
    counters: emptyCounters(),
    dayStartXp: 0,
    dayCompletedCount: 0,
    dayMissedCount: 0,
    dayFinished: false,
    totals: {
      prayers: 0,
      prayersOnTime: 0,
      lessons: 0,
      quranPages: 0,
      goodDeeds: 0,
      sadaqah: 0,
      daysCompleted: 0,
      choices: 0,
      helpEvents: 0,
      fajrOnTime: 0,
    },
    achievements: {},
    lessonProgress: {},
    history: [],
    feed: [],
    overlays: [],
    pendingToasts: [],
  };
}

/** ——— Генерация расписания дня ——— */
export function buildDaySchedule(day: number): DayEvent[] {
  const prayers = getPrayerTimes(new Date());
  const fajrTime = prayers[0].minutes;

  const fixed: Array<{ defId: string; time: number }> = [
    { defId: 'wake', time: Math.max(DAY_START + 15, fajrTime - 25) },
    { defId: 'breakfast', time: 7 * 60 + 30 },
    { defId: 'workstudy', time: 8 * 60 },
    { defId: 'lunch', time: 13 * 60 },
    { defId: 'dinner', time: 20 * 60 },
    { defId: 'sleep', time: 22 * 60 + 30 },
  ];
  for (const p of prayers) {
    fixed.push({ defId: PRAYER_EVENT_BY_KEY[p.key], time: p.minutes });
  }

  const rnd = mulberry32(day * 104729 + 7);

  // Случайные события: до 6 штук, распределённые по окнам.
  const pool = [...RANDOM_EVENTS];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const taken: number[] = fixed.map((f) => f.time);
  let count = 0;
  for (const def of pool) {
    if (count >= 6) break;
    for (let attempt = 0; attempt < 24; attempt++) {
      const win = def.windows[Math.floor(rnd() * def.windows.length)];
      const t = Math.round(win[0] + rnd() * (win[1] - win[0]));
      if (taken.every((x) => Math.abs(x - t) >= 22)) {
        taken.push(t);
        fixed.push({ defId: def.defId, time: t });
        count++;
        break;
      }
    }
  }

  const defs = new Map<string, (typeof SCHEDULED_EVENTS)[number] | (typeof RANDOM_EVENTS)[number]>();
  for (const d of SCHEDULED_EVENTS) defs.set(d.defId, d);
  for (const d of RANDOM_EVENTS) defs.set(d.defId, d);

  return fixed
    .sort((a, b) => a.time - b.time)
    .map((slot) => {
      const def = defs.get(slot.defId)!;
      return {
        id: `${def.defId}.${day}`,
        defId: def.defId,
        kind: def.kind,
        title: def.title,
        icon: def.icon,
        time: slot.time,
        prayerKey: 'prayerKey' in def ? def.prayerKey : undefined,
        status: 'pending' as const,
        description: def.description,
        options: def.options,
        notified: false,
      };
    });
}

/** ——— Уведомления ——— */
function makeNotif(s: SaveState, type: Notif['type'], title: string, text?: string, icon?: string): Notif {
  void s;
  return { id: `n${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, type, title, text, icon, at: Date.now() };
}

function pushNotif(s: SaveState, n: Notif): void {
  s.feed = [n, ...s.feed].slice(0, 40);
  s.pendingToasts = [...(s.pendingToasts ?? []), n];
}

/** ——— Применение эффектов ——— */
function applyEffects(s: SaveState, e: Effects): SaveState {
  const stats = { ...s.stats };
  for (const k of STAT_KEYS) {
    const d = (e as Record<string, number | undefined>)[k];
    if (typeof d === 'number') stats[k] = clamp(stats[k] + d, 0, 100);
  }
  s.stats = stats;
  s.money = Math.max(0, s.money + (e.money ?? 0));
  const pages = e.pages ?? 0;
  if (pages !== 0) {
    s.counters = { ...s.counters, pages: s.counters.pages + pages };
    s.totals = { ...s.totals, quranPages: s.totals.quranPages + pages };
  }
  return s;
}

function addXp(s: SaveState, raw: number): number {
  const gain = Math.round(raw * streakMultiplier(s.streak));
  s.xp = s.xp + gain;
  return gain;
}

/** Пайплайн после изменения счётчиков: цели → уровень → достижения. */
function afterOutcome(s0: SaveState, prevLevel: number): SaveState {
  let s = s0;

  // Ежедневные цели
  const goals = s.goals.map((g) => ({ ...g }));
  for (const g of goals) {
    if (!g.done && s.counters[g.counter] >= g.target) {
      g.done = true;
      if (!g.rewarded) {
        g.rewarded = true;
        s.xp += g.xp;
        pushNotif(s, makeNotif(s, 'success', 'Цель выполнена', `${g.title} · +${g.xp} XP`, 'achievement'));
      }
    }
  }
  s.goals = goals;

  // Уровень
  const lvl = levelFromXp(s.xp);
  if (lvl.level > prevLevel) {
    (s.overlays ??= []).push({
      id: `lvl-${Date.now()}`,
      type: 'level',
      title: `Уровень ${lvl.level}`,
      subtitle: 'Новый уровень достигнут',
      icon: 'levelup',
    });
    pushNotif(s, makeNotif(s, 'level', `Новый уровень: ${lvl.level}`, 'Так держать — путь продолжается', 'levelup'));
  }

  // Достижения
  for (const a of ACHIEVEMENTS) {
    if (s.achievements[a.id]?.unlocked) continue;
    if (a.progress(s) >= 1) {
      s.achievements = { ...s.achievements, [a.id]: { unlocked: true, unlockedAtDay: s.day } };
      (s.overlays ??= []).push({
        id: `ach-${a.id}-${Date.now()}`,
        type: 'achievement',
        title: a.title,
        subtitle: a.description,
        icon: a.icon,
      });
      pushNotif(s, makeNotif(s, 'achievement', `Достижение: ${a.title}`, a.condition, a.icon));
    }
  }
  return s;
}

/** Пометить просроченные события. Возвращает изменённое состояние. */
function processMissed(s0: SaveState): SaveState {
  let s = s0;
  let missedCount = 0;
  let sleepMissed = false;
  const schedule = s.schedule.map((ev) => {
    if (ev.status === 'pending' && s.clock > ev.time + GRACE_MINUTES) {
      missedCount++;
      if (ev.defId === 'sleep') sleepMissed = true;
      if (ev.kind === 'prayer') {
        s.stats = { ...s.stats, prayer: clamp(s.stats.prayer - 3, 0, 100), mood: clamp(s.stats.mood - 2, 0, 100) };
      } else if (ev.kind === 'meal') {
        s.stats = { ...s.stats, health: clamp(s.stats.health - 2, 0, 100) };
      } else if (ev.kind === 'work') {
        s.stats = { ...s.stats, reputation: clamp(s.stats.reputation - 1, 0, 100) };
      }
      return { ...ev, status: 'missed' as const };
    }
    return ev;
  });
  if (missedCount > 0) {
    s.schedule = schedule;
    s.dayMissedCount += missedCount;
  }
  if (sleepMissed) {
    s = finalizeDay({ ...s }, true);
  }
  return s;
}

/** Первое незакрытое событие, время которого уже наступило. */
export function currentEvent(s: SaveState): DayEvent | undefined {
  return s.schedule.find((e) => e.status === 'pending' && e.time <= s.clock);
}

/** Следующее ближайшее незакрытое событие (в т.ч. текущее). */
export function nextEvent(s: SaveState): DayEvent | undefined {
  return s.schedule.find((e) => e.status === 'pending');
}

/** ——— Завершение дня ——— */
export function finalizeDay(s0: SaveState, auto: boolean): SaveState {
  const s = { ...s0 };
  if (s.dayFinished) return s;

  let extraMissed = 0;
  s.schedule = s.schedule.map((ev) => {
    if (ev.status === 'pending') {
      extraMissed++;
      return { ...ev, status: 'missed' as const };
    }
    return ev;
  });
  s.dayMissedCount += extraMissed;

  const goalsDone = s.goals.filter((g) => s.counters[g.counter] >= g.target).length;
  const prayers = s.counters.prayers;
  const keepStreak = prayers >= 4 || goalsDone >= 2;
  s.streak = keepStreak ? s.streak + 1 : 0;
  s.bestStreak = Math.max(s.bestStreak, s.streak);
  s.totals = { ...s.totals, daysCompleted: s.totals.daysCompleted + 1 };
  s.dayFinished = true;
  s.clock = Math.min(s.clock, 23 * 60 + 59);

  const record: DayRecord = {
    day: s.day,
    dateISO: new Date().toISOString(),
    completed: s.dayCompletedCount,
    missed: s.dayMissedCount,
    xp: s.xp - s.dayStartXp,
    goalsDone,
    goalsTotal: s.goals.length,
    prayers,
    streakAfter: s.streak,
  };
  s.history = [record, ...s.history].slice(0, 14);

  pushNotif(
    s,
    makeNotif(
      s,
      'info',
      auto ? 'День завершён автоматически' : 'День завершён',
      keepStreak ? `Серия: ${s.streak} дн. · +50 XP за день` : `Серия сброшена · ${record.xp} XP за день`,
      'calendar',
    ),
  );
  s.xp += 50; // за прохождение дня
  return afterOutcome(s, levelFromXp(s.xp - 50).level);
}

/** ——— Действия ——— */
export type Action =
  | { type: 'TICK'; now: number }
  | { type: 'ONBOARD_DONE'; name: string; avatar: string }
  | { type: 'SET_PROFILE'; name?: string; avatar?: string }
  | { type: 'CHOOSE'; eventId: string; optionIndex: number }
  | { type: 'FREE_ACTION'; actionId: string }
  | { type: 'COMPLETE_LESSON'; lessonId: string; score: number }
  | { type: 'SKIP_TO_EVENT' }
  | { type: 'FINISH_DAY' }
  | { type: 'START_NEW_DAY' }
  | { type: 'RESET' }
  | { type: 'CONSUME_TOASTS' }
  | { type: 'DISMISS_OVERLAY'; id: string };

export function reducer(state: SaveState, action: Action): SaveState {
  switch (action.type) {
    case 'TICK': {
      const now = action.now;
      const elapsed = clamp(now - state.lastTickAt, 0, 12000);
      if (elapsed < 200) return { ...state, lastTickAt: now };
      const s: SaveState = JSON.parse(JSON.stringify(state));
      s.lastTickAt = now;
      s.clock = Math.min(s.clock + (elapsed / 1000) * GAME_MIN_PER_SEC, 23 * 60 + 59);

      // Предупреждение «скоро событие»
      for (const ev of s.schedule) {
        if (ev.status === 'pending' && !ev.notified && ev.time - s.clock <= 20 && ev.time - s.clock > 0) {
          ev.notified = true;
          pushNotif(s, makeNotif(s, 'reminder', `Через 20 минут: ${ev.title}`, `Начало в ${fmtTime(ev.time)}`, ev.icon));
        }
      }
      return processMissed(s);
    }

    case 'ONBOARD_DONE': {
      return { ...state, onboarded: true, playerName: action.name.trim() || 'Путник', avatar: action.avatar };
    }

    case 'SET_PROFILE': {
      return {
        ...state,
        playerName: action.name !== undefined ? action.name.trim() || state.playerName : state.playerName,
        avatar: action.avatar ?? state.avatar,
      };
    }

    case 'CHOOSE': {
      const ev = state.schedule.find((e) => e.id === action.eventId);
      if (!ev || ev.status !== 'pending' || !ev.options) return state;
      const opt = ev.options[action.optionIndex];
      if (!opt) return state;

      const s: SaveState = JSON.parse(JSON.stringify(state));
      const prevLevel = levelFromXp(s.xp).level;

      // Эффекты выбора (без XP и времени — они ниже с множителем серии)
      applyEffects(s, { ...opt.effects, xp: 0, time: 0 });

      // XP
      if (opt.effects.xp) addXp(s, opt.effects.xp);

      // Время
      s.clock = Math.min(s.clock + (opt.effects.time ?? 15), 23 * 60 + 59);

      // Счётчики
      const counters = { ...s.counters };
      const totals = { ...s.totals };
      const key = `${ev.defId}#${action.optionIndex}`;
      if (ev.kind === 'prayer') {
        if (action.optionIndex <= 1) {
          counters.prayers++;
          counters.prayersOnTime++;
          totals.prayers++;
          totals.prayersOnTime++;
          if (ev.prayerKey === 'fajr') totals.fajrOnTime++;
        } else if (action.optionIndex === 2) {
          counters.prayers++;
          totals.prayers++;
        }
      }
      if ((opt.effects.deeds ?? 0) > 0 || (opt.effects.charity ?? 0) > 0) {
        counters.goodDeeds++;
        totals.goodDeeds++;
        if (HELP_DEFS.has(ev.defId)) totals.helpEvents++;
      }
      const sadaqah = opt.effects.money;
      if (sadaqah !== undefined && sadaqah < 0 && opt.icon === 'charity') {
        totals.sadaqah += -sadaqah;
        counters.charity++;
      }
      if (FAMILY_OPTIONS.has(key)) counters.family++;
      if ((ev.defId === 'workstudy' && (opt.effects.knowledge ?? 0) > 0) || key === 'f.work') counters.study++;

      s.counters = counters;
      s.totals = totals;
      s.totals.choices++;

      // Резолв события
      s.schedule = s.schedule.map((e) =>
        e.id === ev.id
          ? {
              ...e,
              status: 'done' as const,
              result: { label: opt.label, text: opt.result, effects: opt.effects },
            }
          : e,
      );
      s.dayCompletedCount++;

      let out = afterOutcome(s, prevLevel);

      if (ev.defId === 'sleep') {
        out = finalizeDay(out, false);
      } else {
        out = processMissed(out);
      }
      return out;
    }

    case 'FREE_ACTION': {
      const fa = FREE_ACTIONS.find((f) => f.id === action.actionId);
      if (!fa) return state;
      const s: SaveState = JSON.parse(JSON.stringify(state));
      const prevLevel = levelFromXp(s.xp).level;

      applyEffects(s, { ...fa.effects, xp: 0, time: 0 });
      if (fa.effects.xp) addXp(s, fa.effects.xp);
      s.clock = Math.min(s.clock + (fa.effects.time ?? 15), 23 * 60 + 59);

      const counters = { ...s.counters };
      const totals = { ...s.totals };
      if ((fa.effects.deeds ?? 0) > 0) {
        counters.goodDeeds++;
        totals.goodDeeds++;
      }
      if (fa.id === 'f.sadaqah') {
        totals.sadaqah += 200;
        counters.charity++;
      }
      if (fa.id === 'f.family') counters.family++;
      if (fa.id === 'f.work') counters.study++;
      s.counters = counters;
      s.totals = totals;
      s.totals.choices++;

      const out = afterOutcome(s, prevLevel);
      return processMissed(out);
    }

    case 'COMPLETE_LESSON': {
      const lesson = LESSONS.find((l) => l.id === action.lessonId);
      if (!lesson) return state;
      const s: SaveState = JSON.parse(JSON.stringify(state));
      const prev = s.lessonProgress[lesson.id];
      if (prev?.done) return state;
      const prevLevel = levelFromXp(s.xp).level;

      const perfect = action.score === lesson.quiz.length;
      const gain = lesson.xp + (perfect ? 10 : 0);
      addXp(s, gain);
      s.stats = { ...s.stats, knowledge: clamp(s.stats.knowledge + 6, 0, 100), iman: clamp(s.stats.iman + 1, 0, 100) };
      s.lessonProgress = {
        ...s.lessonProgress,
        [lesson.id]: { done: true, score: action.score, total: lesson.quiz.length, completedAt: Date.now() },
      };
      s.counters = { ...s.counters, lessons: s.counters.lessons + 1 };
      s.totals = { ...s.totals, lessons: s.totals.lessons + 1 };
      pushNotif(s, makeNotif(s, 'success', 'Урок пройден', `${lesson.title} · +${gain} XP`, 'education'));
      return afterOutcome(s, prevLevel);
    }

    case 'SKIP_TO_EVENT': {
      const next = state.schedule.find((e) => e.status === 'pending');
      if (!next) return state;
      const s: SaveState = { ...state, clock: Math.min(next.time, 23 * 60 + 59), lastTickAt: Date.now() };
      return processMissed(s);
    }

    case 'FINISH_DAY': {
      if (state.dayFinished) return state;
      return finalizeDay({ ...state }, false);
    }

    case 'START_NEW_DAY': {
      if (!state.dayFinished) return state;
      const day = state.day + 1;
      const s: SaveState = JSON.parse(JSON.stringify(state));
      s.day = day;
      s.clock = DAY_START;
      s.lastTickAt = Date.now();
      s.schedule = buildDaySchedule(day);
      s.goals = makeGoals(day);
      s.counters = emptyCounters();
      s.dayStartXp = s.xp;
      s.dayCompletedCount = 0;
      s.dayMissedCount = 0;
      s.dayFinished = false;
      s.stats = {
        ...s.stats,
        energy: clamp(Math.max(s.stats.energy, 55), 0, 100),
        mood: clamp(s.stats.mood + 6, 0, 100),
        health: clamp(s.stats.health + 3, 0, 100),
      };
      return s;
    }

    case 'RESET': {
      localStorage.removeItem(SAVE_KEY);
      return createInitialState();
    }

    case 'CONSUME_TOASTS': {
      if (!state.pendingToasts?.length) return state;
      return { ...state, pendingToasts: [] };
    }

    case 'DISMISS_OVERLAY': {
      return { ...state, overlays: (state.overlays ?? []).filter((o) => o.id !== action.id) };
    }

    default:
      return state;
  }
}

/** Загрузка сохранения с валидацией версии. */
export function loadState(): SaveState | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SaveState;
    if (parsed.version !== SAVE_VERSION || !Array.isArray(parsed.schedule)) return null;
    parsed.overlays = [];
    parsed.pendingToasts = [];
    parsed.lastTickAt = Date.now();
    return parsed;
  } catch {
    return null;
  }
}

export function saveState(s: SaveState): void {
  try {
    const { overlays, pendingToasts, ...rest } = s;
    void overlays;
    void pendingToasts;
    localStorage.setItem(SAVE_KEY, JSON.stringify(rest));
  } catch {
    /* переполнение хранилища игнорируем */
  }
}

export function xpToNextText(xp: number): string {
  const { inLevel, needed, level } = levelFromXp(xp);
  return `${inLevel} / ${needed} XP до уровня ${level + 1}`;
}

export { xpForNextLevel, levelFromXp };
