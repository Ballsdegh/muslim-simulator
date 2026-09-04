// ————————————————————————————————————————————————
// Доменные типы игровой модели.
// ВАЖНО: все числовые показатели — элементы игры (модель самодисциплины),
// а не утверждение о реальном духовном статусе человека.
// ————————————————————————————————————————————————

export type StatKey =
  | 'iman'
  | 'prayer'
  | 'knowledge'
  | 'deeds'
  | 'health'
  | 'energy'
  | 'mood'
  | 'reputation';

export type Stats = Record<StatKey, number>;

/** Эффект выбора/действия. time — игровое время в минутах. */
export type Effects = Partial<Record<StatKey | 'money' | 'xp', number>> & {
  time?: number;
  pages?: number;
  charity?: number;
};

export type EventKind = 'wake' | 'prayer' | 'meal' | 'work' | 'sleep' | 'random';

export type EventStatus = 'pending' | 'active' | 'done' | 'missed';

export interface EventOption {
  label: string;
  hint?: string;
  icon?: string;
  effects: Effects;
  result: string;
  /** Условие доступности (например, хватает ли денег). */
  requireMoney?: number;
  /** Опция доступна только при reputation >= значения. */
  requireReputation?: number;
  tone?: 'positive' | 'neutral' | 'negative';
}

export interface EventOptionDef {
  defId: string;
  kind: EventKind;
  title: string;
  description: string;
  icon: string;
  /** Отметки времени молитвы — для привязки к расписанию молитв. */
  prayerKey?: PrayerKey;
  options: EventOption[];
}

export interface PrayerTimeDef {
  key: PrayerKey;
  name: string;
  arabic: string;
  minutes: number;
}

export type PrayerKey = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

/** Событие конкретного игрового дня (с рантайм-состоянием). */
export interface DayEvent {
  id: string;
  defId: string;
  kind: EventKind;
  title: string;
  icon: string;
  time: number; // минуты от 00:00
  prayerKey?: PrayerKey;
  status: EventStatus;
  description?: string;
  options?: EventOption[];
  notified?: boolean;
  result?: {
    label: string;
    text: string;
    effects: Effects;
    onTime?: boolean;
  };
}

export interface Goal {
  id: string;
  title: string;
  icon: string;
  counter: CounterKey;
  target: number;
  xp: number;
  done: boolean;
  rewarded: boolean;
}

export type CounterKey =
  | 'prayers'
  | 'prayersOnTime'
  | 'pages'
  | 'goodDeeds'
  | 'lessons'
  | 'study'
  | 'family'
  | 'charity';

export type DayCounters = Record<CounterKey, number>;

export interface QuizQuestion {
  q: string;
  options: string[];
  answer: number;
  note?: string;
}

export interface Lesson {
  id: string;
  category: string;
  title: string;
  duration: string;
  intro: string[];
  facts: string[];
  quiz: QuizQuestion[];
  xp: number;
}

export interface LessonProgress {
  done: boolean;
  score: number; // правильных ответов
  total: number;
  completedAt?: number;
}

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  condition: string;
  icon: string;
  /** Возвращает прогресс 0..1 для отображения на карточке. */
  progress: (s: SaveState) => number;
}

export interface AchievementState {
  unlocked: boolean;
  unlockedAtDay?: number;
}

export interface Notif {
  id: string;
  type: 'info' | 'success' | 'achievement' | 'reminder' | 'level';
  title: string;
  text?: string;
  icon?: string;
  at: number;
}

export interface DayRecord {
  day: number;
  dateISO: string;
  completed: number;
  missed: number;
  xp: number;
  goalsDone: number;
  goalsTotal: number;
  prayers: number;
  streakAfter: number;
}

export interface Totals {
  prayers: number;
  prayersOnTime: number;
  lessons: number;
  quranPages: number;
  goodDeeds: number;
  sadaqah: number;
  daysCompleted: number;
  choices: number;
  helpEvents: number;
  fajrOnTime: number;
}

export interface OverlayItem {
  id: string;
  type: 'level' | 'achievement';
  title: string;
  subtitle: string;
  icon?: string;
}

export interface SaveState {
  version: number;
  playerName: string;
  avatar: string;
  onboarded: boolean;
  startedAtISO: string;
  day: number;
  clock: number; // минуты от 00:00 текущего игрового дня
  lastTickAt: number; // реальный ms
  stats: Stats;
  money: number;
  xp: number;
  streak: number;
  bestStreak: number;
  schedule: DayEvent[];
  goals: Goal[];
  counters: DayCounters;
  dayStartXp: number;
  dayCompletedCount: number;
  dayMissedCount: number;
  dayFinished: boolean;
  totals: Totals;
  achievements: Record<string, AchievementState>;
  lessonProgress: Record<string, LessonProgress>;
  history: DayRecord[];
  feed: Notif[];
  // — транзиент (не сохраняется) —
  overlays?: OverlayItem[];
  pendingToasts?: Notif[];
}

export type ScreenId = 'home' | 'day' | 'knowledge' | 'achievements' | 'profile';
