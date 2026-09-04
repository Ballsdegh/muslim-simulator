import type { AchievementDef, SaveState } from '../types';

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: 'first-day',
    title: 'Первый день',
    description: 'Завершите свой первый игровой день.',
    condition: 'Завершить 1 день',
    icon: 'sunrise',
    progress: (s) => Math.min(1, s.totals.daysCompleted / 1),
  },
  {
    id: 'streak-3',
    title: 'Три дня подряд',
    description: 'Держите серию дисциплины три дня.',
    condition: 'Серия 3 дня',
    icon: 'flame',
    progress: (s) => Math.min(1, s.streak / 3),
  },
  {
    id: 'streak-7',
    title: 'Неделя дисциплины',
    description: 'Семь дней подряд без срыва серии.',
    condition: 'Серия 7 дней',
    icon: 'trophy',
    progress: (s) => Math.min(1, s.streak / 7),
  },
  {
    id: 'days-7',
    title: 'Семь дней пути',
    description: 'Прожите и завершите семь игровых дней.',
    condition: 'Завершить 7 дней',
    icon: 'calendar',
    progress: (s) => Math.min(1, s.totals.daysCompleted / 7),
  },
  {
    id: 'scholar',
    title: 'Знаток',
    description: 'Пройдите десять уроков в разделе знаний.',
    condition: '10 уроков',
    icon: 'education',
    progress: (s) => Math.min(1, s.totals.lessons / 10),
  },
  {
    id: 'good-deed',
    title: 'Доброе дело',
    description: 'Совершите первое доброе дело: помогите, подарите, поддержите.',
    condition: '1 доброе дело',
    icon: 'heart',
    progress: (s) => Math.min(1, s.totals.goodDeeds / 1),
  },
  {
    id: 'early-bird',
    title: 'Ранний подъём',
    description: 'Трижды совершите Фаджр вовремя, не откладывая.',
    condition: 'Фаджр вовремя ×3',
    icon: 'star',
    progress: (s) => Math.min(1, s.totals.fajrOnTime / 3),
  },
  {
    id: 'marathon',
    title: 'Марафон знаний',
    description: 'Пройдите три урока знаний за один день.',
    condition: '3 урока за день',
    icon: 'quran',
    progress: (s) => Math.min(1, s.counters.lessons / 3),
  },
  {
    id: 'generous',
    title: 'Щедрое сердце',
    description: 'Сумма вашей садаки достигнет 1500.',
    condition: 'Садака от 1500',
    icon: 'charity',
    progress: (s) => Math.min(1, s.totals.sadaqah / 1500),
  },
  {
    id: 'five-prayers',
    title: 'Полный день',
    description: 'Совершите все пять молитв за один день.',
    condition: '5 молитв за день',
    icon: 'prayer',
    progress: (s) => Math.min(1, s.counters.prayers / 5),
  },
  {
    id: 'goals-master',
    title: 'Мастер дня',
    description: 'Выполните все ежедневные цели за один день.',
    condition: 'Все цели за день',
    icon: 'achievement',
    progress: (s) => {
      const done = s.goals.filter((g) => g.done).length;
      return s.goals.length ? Math.min(1, done / s.goals.length) : 0;
    },
  },
  {
    id: 'reader',
    title: 'Чтец',
    description: 'Прочитайте пятьдесят страниц Корана по всем дням.',
    condition: '50 страниц',
    icon: 'book',
    progress: (s) => Math.min(1, s.totals.quranPages / 50),
  },
  {
    id: 'helper',
    title: 'Опора для других',
    description: 'Пять раз помогите людям в случайных событиях.',
    condition: 'Помощь ×5',
    icon: 'help',
    progress: (s) => Math.min(1, s.totals.helpEvents / 5),
  },
  {
    id: 'balanced',
    title: 'Гармония',
    description: 'Поднимите все основные характеристики до 70 и выше.',
    condition: 'Все характеристики ≥ 70',
    icon: 'balance',
    progress: (s) => {
      const keys = ['iman', 'prayer', 'knowledge', 'deeds', 'health', 'energy', 'mood', 'reputation'] as const;
      const ok = keys.filter((k) => s.stats[k] >= 70).length;
      return ok / keys.length;
    },
  },
  {
    id: 'level-5',
    title: 'Восхождение',
    description: 'Достигните пятого уровня.',
    condition: 'Уровень 5',
    icon: 'levelup',
    progress: (s) => {
      const { level } = levelFromXpSafe(s.xp);
      return Math.min(1, level / 5);
    },
  },
  {
    id: 'rich-spirit',
    title: 'Богатство души',
    description: 'Накопите 2000 XP за всё время игры.',
    condition: '2000 XP',
    icon: 'sparkle',
    progress: (s) => Math.min(1, s.xp / 2000),
  },
];

function levelFromXpSafe(xp: number): { level: number } {
  let level = 1;
  let rest = xp;
  while (rest >= 100 + (level - 1) * 60) {
    rest -= 100 + (level - 1) * 60;
    level += 1;
    if (level > 200) break;
  }
  return { level };
}
