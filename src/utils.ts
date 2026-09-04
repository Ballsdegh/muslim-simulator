export function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

/** Минуты от 00:00 → «04:45». */
export function fmtTime(minutes: number): string {
  const m = Math.floor(((minutes % 1440) + 1440) % 1440);
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
}

/** Разница в минутах → «01:42:18» (часы:минуты:секунды игровой модели). */
export function fmtCountdown(minutes: number): string {
  const total = Math.max(0, Math.round(minutes * 60));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function greetingByClock(clock: number): string {
  if (clock < 5 * 60) return 'Доброй ночи';
  if (clock < 12 * 60) return 'Доброе утро';
  if (clock < 17 * 60) return 'Добрый день';
  if (clock < 22 * 60) return 'Добрый вечер';
  return 'Доброй ночи';
}

export function dateFromDay(startedAtISO: string, day: number): Date {
  const d = new Date(startedAtISO);
  d.setDate(d.getDate() + (day - 1));
  return d;
}

export function fmtDateRu(d: Date): string {
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', weekday: 'long' });
}

export function fmtDateShort(d: Date): string {
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
}

/** Приблизительная дата по хиджре через Intl (с запасным вариантом). */
export function hijriDate(d: Date): string {
  try {
    const fmt = new Intl.DateTimeFormat('ru-RU-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    const parts = fmt.formatToParts(d);
    const map: Record<string, string> = {};
    for (const p of parts) map[p.type] = p.value;
    const month = map.month?.replace(/\s*г\.?$/, '') ?? '';
    return `${map.day ?? ''} ${month} ${map.year ?? ''} г. х.`;
  } catch {
    return '';
  }
}

export function fmtMoney(n: number): string {
  return `${Math.round(n).toLocaleString('ru-RU')} ₽`;
}

export function plural(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}
