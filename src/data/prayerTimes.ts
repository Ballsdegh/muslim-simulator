import type { PrayerKey, PrayerTimeDef } from '../types';

/**
 * Сервис времён молитв.
 *
 * Демо-режим использует условные игровые времена. Архитектура подготовлена
 * к подключению реальных данных: достаточно реализовать функцию
 * fetchPrayerTimes (например, через aladhan.com API) и подменить
 * getPrayerTimes. Интерфейс рассчитан на возврат минут от 00:00.
 *
 * Пример будущего адаптера:
 *   const res = await fetch(
 *     `https://api.aladhan.com/v1/timingsByCity?city=Moscow&country=RU&method=2`
 *   );
 *   // res.data.timings.Fajr === "04:45"  →  parse "HH:MM" → минуты
 */
export interface PrayerTimesProvider {
  /** Возвращает времена молитв в минутах от 00:00 для указанной даты. */
  getPrayerTimes: (date: Date) => PrayerTimeDef[];
}

export const DEMO_PRAYER_TIMES: Record<PrayerKey, number> = {
  fajr: 4 * 60 + 45, // 04:45
  dhuhr: 12 * 60 + 30, // 12:30
  asr: 15 * 60 + 45, // 15:45
  maghrib: 18 * 60 + 30, // 18:30
  isha: 21 * 60 + 30, // 21:30
};

export const PRAYER_META: Record<PrayerKey, { name: string; arabic: string; note: string }> = {
  fajr: { name: 'Фаджр', arabic: 'الفجر', note: 'Утренняя молитва' },
  dhuhr: { name: 'Зухр', arabic: 'الظهر', note: 'Полуденная молитва' },
  asr: { name: 'Аср', arabic: 'العصر', note: 'Предвечерняя молитва' },
  maghrib: { name: 'Магриб', arabic: 'المغرب', note: 'Вечерняя молитва' },
  isha: { name: 'Иша', arabic: 'العشاء', note: 'Ночная молитва' },
};

export const PRAYER_ORDER: PrayerKey[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

/** Демо-провайдер: фиксированные игровые времена молитв. */
export const demoProvider: PrayerTimesProvider = {
  getPrayerTimes: (_date: Date) =>
    PRAYER_ORDER.map((key) => ({
      key,
      name: PRAYER_META[key].name,
      arabic: PRAYER_META[key].arabic,
      minutes: DEMO_PRAYER_TIMES[key],
    })),
};

/** Точка подключения реального API. Пока — демо-данные. */
export function getPrayerTimes(date: Date): PrayerTimeDef[] {
  return demoProvider.getPrayerTimes(date);
}
