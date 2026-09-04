import type { JSX } from 'react';

/**
 * Собственный набор inline-SVG-иконок.
 * Единый визуальный язык: сетка 24×24, обводка 1.7, скруглённые
 * окончания линий, деликатные золотые акценты.
 */

export const GOLD = '#D9B96A';

const a = (accent: boolean) => (accent ? GOLD : 'currentColor');

type P = (accent: boolean) => JSX.Element;

const ICONS: Record<string, P> = {
  home: (ac) => (
    <>
      <path d="M4 11.1 12 4.4l8 6.7" />
      <path d="M6.2 9.6V19a1.4 1.4 0 0 0 1.4 1.4h8.8A1.4 1.4 0 0 0 17.8 19V9.6" />
      <path d="M10 20.3v-4.1a2 2 0 0 1 4 0v4.1" />
      {ac && <circle cx="12" cy="10.6" r="1.15" fill={GOLD} stroke="none" />}
    </>
  ),
  calendar: (ac) => (
    <>
      <rect x="3.6" y="5.1" width="16.8" height="15.3" rx="2.6" />
      <path d="M3.6 9.8h16.8M8.2 3.2v3.8M15.8 3.2v3.8" />
      {ac && <circle cx="12" cy="15" r="1.5" fill={GOLD} stroke="none" />}
    </>
  ),
  prayer: (ac) => (
    <>
      <path d="M4.8 20.2v-4.4c0-3.5 3-5.6 7.2-7.2 4.2 1.6 7.2 3.7 7.2 7.2v4.4" />
      <path d="M3.6 20.2h16.8" />
      <path d="M10.1 20.2v-2.9a1.9 1.9 0 0 1 3.8 0v2.9" />
      {ac && (
        <path
          d="M12 2.6a2.1 2.1 0 1 0 1.9 3 2.5 2.5 0 1 1-1.9-3z"
          fill={GOLD}
          stroke="none"
        />
      )}
    </>
  ),
  knowledge: (ac) => (
    <>
      <path d="M12 6.7C10.2 5.1 7.9 4.4 4.6 4.6v13.2c3.3-.2 5.6.5 7.4 2 1.8-1.5 4.1-2.2 7.4-2V4.6c-3.3-.2-5.6.5-7.4 2.1z" />
      <path d="M12 6.7v13.1" />
      {ac && <path d="m18.7 2.4.55 1.75L21 4.7l-1.75.55L18.7 7l-.55-1.75L16.4 4.7l1.75-.55z" fill={GOLD} stroke="none" />}
    </>
  ),
  quran: (ac) => (
    <>
      <path d="M5.8 19.2V6.3a2.3 2.3 0 0 1 2.3-2.3h10.1v13.5H8.1a2.35 2.35 0 0 0 0 4.7h10.1" />
      {ac && (
        <path
          d="M12.9 11.1a2.6 2.6 0 1 1 1.7-4.6 3.1 3.1 0 1 0-1.7 4.6z"
          fill={GOLD}
          stroke="none"
          transform="translate(1 -1.4) scale(.96)"
        />
      )}
    </>
  ),
  heart: () => (
    <path d="M12 19.8C9.2 18 4.2 14.6 4.2 10.1a4.3 4.3 0 0 1 7.8-2.5A4.3 4.3 0 0 1 19.8 10c0 4.6-5 8-7.8 9.8z" />
  ),
  charity: (ac) => (
    <>
      <circle cx="12" cy="12.8" r="6.6" />
      {ac && (
        <path
          d="M12 15.9c-1.2-.8-2.6-1.9-2.6-3.2a1.45 1.45 0 0 1 2.6-.9 1.45 1.45 0 0 1 2.6.9c0 1.3-1.4 2.4-2.6 3.2z"
          fill={GOLD}
          stroke="none"
        />
      )}
      <path d="M12 6.2V3.9M15.8 7.4l1.3-1.9M8.2 7.4 6.9 5.5" />
    </>
  ),
  health: (ac) => (
    <>
      <path d="M12 19.6C9.4 17.9 4.3 14.5 4.3 10.2A4.15 4.15 0 0 1 12 7.3a4.15 4.15 0 0 1 7.7 2.9c0 4.3-5.1 7.7-7.7 9.4z" />
      {ac && <path d="M7.6 11.6h2l1.3-2.4 1.7 4 1.2-1.6h2.6" stroke={GOLD} />}
    </>
  ),
  energy: (ac) => (
    <>
      <path d="M13.4 3.2 6.2 13.1h4.5l-.9 7.7 7.9-10.2h-4.7l.4-7.4z" />
      {ac && <circle cx="18.9" cy="4.9" r="1" fill={GOLD} stroke="none" />}
    </>
  ),
  money: (ac) => (
    <>
      <ellipse cx="12" cy="6.6" rx="6.1" ry="2.7" />
      <path d="M5.9 6.6v5.1c0 1.5 2.7 2.7 6.1 2.7s6.1-1.2 6.1-2.7V6.6" />
      <path d="M5.9 11.7v5.1c0 1.5 2.7 2.7 6.1 2.7s6.1-1.2 6.1-2.7v-5.1" />
      {ac && <circle cx="17.4" cy="17.4" r="1.05" fill={GOLD} stroke="none" />}
    </>
  ),
  achievement: (ac) => (
    <>
      <path d="m8.3 3.4 2 5.6M15.7 3.4l-2 5.6" />
      <circle cx="12" cy="14.6" r="5" />
      {ac && <path d="m12 12.2.8 1.7 1.9.2-1.4 1.3.4 1.8-1.7-1-1.7 1 .4-1.8-1.4-1.3 1.9-.2z" fill={GOLD} stroke="none" />}
    </>
  ),
  profile: (ac) => (
    <>
      <circle cx="12" cy="8.1" r="3.6" />
      <path d="M5.2 20.2a6.8 6.8 0 0 1 13.6 0" />
      {ac && <circle cx="17.9" cy="6.3" r="1" fill={GOLD} stroke="none" />}
    </>
  ),
  settings: (ac) => (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 2.9v2.3M12 18.8v2.3M21.1 12h-2.3M5.2 12H2.9M18.4 5.6l-1.6 1.6M7.2 16.8l-1.6 1.6M18.4 18.4l-1.6-1.6M7.2 7.2 5.6 5.6" />
      {ac && <circle cx="12" cy="12" r="1" fill={GOLD} stroke="none" />}
    </>
  ),
  notification: (ac) => (
    <>
      <path d="M18.2 8.4a6.2 6.2 0 0 0-12.4 0c0 6.4-2.6 8.2-2.6 8.2h17.6s-2.6-1.8-2.6-8.2" />
      <path d="M13.6 20.2a1.85 1.85 0 0 1-3.2 0" />
      {ac && <circle cx="12" cy="8.4" r="1" fill={GOLD} stroke="none" />}
    </>
  ),
  clock: (ac) => (
    <>
      <circle cx="12" cy="12" r="8.2" />
      <path d="M12 7.4V12l3 2.1" />
      {ac && <circle cx="12" cy="12" r="1" fill={GOLD} stroke="none" />}
    </>
  ),
  sunrise: (ac) => (
    <>
      <path d="M7.2 18.2a4.8 4.8 0 0 1 9.6 0" />
      <path d="M2.8 18.2h18.4" />
      <path d="M12 10V7.4M6.4 12.3 4.6 10.5M17.6 12.3l1.8-1.8M4.4 15H2.6M21.4 15h-1.8" />
      {ac && <circle cx="12" cy="6.2" r="1" fill={GOLD} stroke="none" />}
    </>
  ),
  moon: (ac) => (
    <>
      <path d="M20.2 14.3A8.6 8.6 0 1 1 9.7 3.8a6.9 6.9 0 0 0 10.5 10.5z" />
      {ac && <path d="m17.2 5 .5 1.6 1.6.5-1.6.5-.5 1.6-.5-1.6-1.6-.5 1.6-.5z" fill={GOLD} stroke="none" />}
    </>
  ),
  education: (ac) => (
    <>
      <path d="M2.6 9.4 12 4.9l9.4 4.5L12 13.9z" />
      <path d="M6.6 11.6v4c0 1.3 2.4 2.7 5.4 2.7s5.4-1.4 5.4-2.7v-4" />
      {ac && <path d="M21.4 9.4v3.8" stroke={GOLD} />}
      <circle cx="21.4" cy="14.6" r="1" fill={GOLD} stroke="none" />
    </>
  ),
  food: (ac) => (
    <>
      <path d="M4.4 13.4h15.2a7.6 7.6 0 0 1-15.2 0z" />
      <path d="M3 13.4h18" />
      {ac && <path d="M9.6 9.8c-.8-1 .8-2 0-3.2M13.6 9.8c-.8-1 .8-2 0-3.2" stroke={GOLD} />}
    </>
  ),
  sleep: (ac) => (
    <>
      <path d="M3 18.6V6.4" />
      <path d="M3 14.6h18v4" />
      <path d="M21 18.6v-3.4a2.6 2.6 0 0 0-2.6-2.6H11v6" />
      <path d="M11 12.6H6.4a2 2 0 0 0-2 2" />
      {ac && <circle cx="7" cy="10.4" r="1.15" fill={GOLD} stroke="none" />}
    </>
  ),
  water: (ac) => (
    <>
      <path d="M12 3.6c3.1 3.9 5.8 7 5.8 10.1a5.8 5.8 0 0 1-11.6 0c0-3.1 2.7-6.2 5.8-10.1z" />
      {ac && <path d="M9.3 13.6c.2 1.4 1.1 2.3 2.4 2.6" stroke={GOLD} />}
    </>
  ),
  hands: (ac) => (
    <>
      <path d="M5.4 10.6v3.1a6.6 6.6 0 0 0 13.2 0v-3.1" />
      <path d="M5.4 10.6c0 1.5 1.3 2.4 3.2 2.4M18.6 10.6c0 1.5-1.3 2.4-3.2 2.4" />
      {ac && <path d="M12 7V4.7M8.4 7.8 7 5.7M15.6 7.8 17 5.7" stroke={GOLD} />}
    </>
  ),
  flame: (ac) => (
    <>
      <path d="M12 20.6c-3.4 0-5.8-2.3-5.8-5.4 0-2.5 1.7-4.3 3.1-5.8.3 1 .9 1.7 1.7 2.1-.1-2.5.3-4.9 2.5-7.4.2 2.3 1.2 3.5 2.5 5 1.1 1.2 1.8 2.6 1.8 4.1 0 4.1-2.4 7.4-5.8 7.4z" />
      {ac && <path d="M12 18c-1.2 0-2-.8-2-2 0-.9.6-1.6 1.2-2.3.5.6 2.8 1.2 2.8 2.3 0 1.2-.8 2-2 2z" fill={GOLD} stroke="none" />}
    </>
  ),
  walk: (ac) => (
    <>
      <circle cx="6.4" cy="6.4" r="2.3" />
      <circle cx="17.6" cy="17.6" r="2.3" />
      <path d="M8.7 7c4.8.6 1.6 8 6.5 9.5" strokeDasharray="2.6 2.4" />
      {ac && <circle cx="12" cy="11.6" r="1.05" fill={GOLD} stroke="none" />}
    </>
  ),
  work: (ac) => (
    <>
      <rect x="3.6" y="7.4" width="16.8" height="12.2" rx="2.2" />
      <path d="M9.2 7.4V6a2 2 0 0 1 2-2h1.6a2 2 0 0 1 2 2v1.4M3.6 12.4h16.8" />
      {ac && <path d="M10.9 12.4h2.2v2.2h-2.2z" fill={GOLD} stroke="none" />}
    </>
  ),
  help: (ac) => (
    <>
      <path d="M4.6 13.6a7.4 4.6 0 0 0 14.8 0" />
      <path d="M4.6 13.6v-2.2M19.4 13.6v-2.2" />
      {ac && (
        <path
          d="M12 10.6c-1.5-1-3.1-2.2-3.1-3.8a1.75 1.75 0 0 1 3.1-1.1 1.75 1.75 0 0 1 3.1 1.1c0 1.6-1.6 2.8-3.1 3.8z"
          fill={GOLD}
          stroke="none"
        />
      )}
    </>
  ),
  users: (ac) => (
    <>
      <circle cx="9" cy="8.4" r="3.2" />
      <path d="M3.4 19.6a5.6 5.6 0 0 1 11.2 0" />
      <path d="M15.4 5.6a3.2 3.2 0 0 1 .2 5.8M17.2 14.5a5.6 5.6 0 0 1 3.4 5.1" />
      {ac && <circle cx="9" cy="8.4" r="1" fill={GOLD} stroke="none" />}
    </>
  ),
  phone: (ac) => (
    <>
      <rect x="7.2" y="2.9" width="9.6" height="18.2" rx="2.4" />
      <path d="M10.8 18.4h2.4" />
      {ac && <circle cx="12" cy="6" r="1" fill={GOLD} stroke="none" />}
    </>
  ),
  gift: (ac) => (
    <>
      <rect x="3.9" y="10.7" width="16.2" height="3.3" rx="1.2" />
      <path d="M5.2 14v5.7a1.6 1.6 0 0 0 1.6 1.6h10.4a1.6 1.6 0 0 0 1.6-1.6V14" />
      <path d="M12 10.7v11.3" />
      <path d="M12 10.7C8.1 10.7 6.9 9 7.1 7.5a2 2 0 0 1 2.2-1.6c1.7.2 2.7 2.3 2.7 4.8 0-2.5 1-4.6 2.7-4.8a2 2 0 0 1 2.2 1.6c.2 1.5-1 3.2-4.9 3.2z" />
      {ac && <circle cx="12" cy="9" r="1" fill={GOLD} stroke="none" />}
    </>
  ),
  book: (ac) => (
    <>
      <path d="M4.4 19.3a2.4 2.4 0 0 1 2.4-2.4h12.8" />
      <path d="M6.8 2.9h12.8v18.2H6.8a2.4 2.4 0 0 1-2.4-2.4V5.3a2.4 2.4 0 0 1 2.4-2.4z" />
      {ac && <path d="M9.4 7h6" stroke={GOLD} />}
    </>
  ),
  star: (ac) => (
    <>
      <rect x="7.4" y="7.4" width="9.2" height="9.2" rx="1.4" />
      <rect x="7.4" y="7.4" width="9.2" height="9.2" rx="1.4" transform="rotate(45 12 12)" />
      {ac && <circle cx="12" cy="12" r="1.3" fill={GOLD} stroke="none" />}
    </>
  ),
  sparkle: (ac) => (
    <>
      <path d="m12 3.8 1.7 6.5 6.5 1.7-6.5 1.7L12 20.2l-1.7-6.5-6.5-1.7 6.5-1.7z" />
      {ac && <circle cx="18.9" cy="18.9" r="1.15" fill={GOLD} stroke="none" />}
    </>
  ),
  check: () => <path d="m5.4 12.6 4.2 4.2 9-9.6" />,
  close: () => <path d="m6.4 6.4 11.2 11.2M17.6 6.4 6.4 17.6" />,
  'chevron-right': () => <path d="m9.4 6.4 5.8 5.6-5.8 5.6" />,
  'chevron-down': () => <path d="m6.4 9.4 5.6 5.8 5.6-5.8" />,
  'arrow-right': () => (
    <>
      <path d="M4.4 12h15" />
      <path d="m14 6.4 5.6 5.6-5.6 5.6" />
    </>
  ),
  lock: (ac) => (
    <>
      <rect x="5.4" y="10.6" width="13.2" height="9.6" rx="2.4" />
      <path d="M8.4 10.6V8.1a3.6 3.6 0 0 1 7.2 0v2.5" />
      {ac && <circle cx="12" cy="15.2" r="1.25" fill={GOLD} stroke="none" />}
    </>
  ),
  levelup: (ac) => (
    <>
      <rect x="4.2" y="14.4" width="4" height="5.8" rx="1" />
      <rect x="10" y="10.4" width="4" height="9.8" rx="1" />
      <rect x="15.8" y="6.4" width="4" height="13.8" rx="1" />
      {ac && <path d="m17.8 2.2.7 2.1 2.1.7-2.1.7-.7 2.1-.7-2.1-2.1-.7 2.1-.7z" fill={GOLD} stroke="none" />}
    </>
  ),
  balance: (ac) => (
    <>
      <path d="M12 4.4v15.2M8.4 19.6h7.2M5.2 7.4h13.6" />
      <path d="M5.2 7.4 3 12.3h4.4zM18.8 7.4l-2.2 4.9h4.4z" />
      <path d="M3 12.3a2.2 2.2 0 0 0 4.4 0M16.6 12.3a2.2 2.2 0 0 0 4.4 0" />
      {ac && <circle cx="12" cy="4.4" r="1.05" fill={GOLD} stroke="none" />}
    </>
  ),
  trophy: (ac) => (
    <>
      <path d="M8.2 20.4h7.6" />
      <path d="M12 16.6v3.8" />
      <path d="M7.2 3.8h9.6v5.4a4.8 4.8 0 0 1-9.6 0z" />
      <path d="M7.2 5.4H4.9a1.4 1.4 0 0 0-1.4 1.4c0 2.1 1.6 3.2 3.7 3.3M16.8 5.4h2.3a1.4 1.4 0 0 1 1.4 1.4c0 2.1-1.6 3.2-3.7 3.3" />
      {ac && <path d="M12 6.4l.6 1.3 1.4.2-1 .95.2 1.4-1.2-.65-1.2.65.2-1.4-1-.95 1.4-.2z" fill={GOLD} stroke="none" />}
    </>
  ),
  share: () => (
    <>
      <circle cx="6.2" cy="12" r="2.4" />
      <circle cx="17.6" cy="5.6" r="2.4" />
      <circle cx="17.6" cy="18.4" r="2.4" />
      <path d="m8.4 10.8 7-4M8.4 13.2l7 4" />
    </>
  ),
  edit: () => (
    <>
      <path d="m4.2 19.8 1-4L16.4 4.6a2.05 2.05 0 0 1 2.9 2.9L8.1 18.7l-3.9 1.1z" />
      <path d="m14.4 6.6 2.9 2.9" />
    </>
  ),
  reset: () => (
    <>
      <path d="M4.2 4.6v4.6h4.6" />
      <path d="M4.6 9.2A8.3 8.3 0 1 1 3.7 13" />
    </>
  ),
  info: (ac) => (
    <>
      <circle cx="12" cy="12" r="8.4" />
      <path d="M12 11v5.4" />
      {ac && <circle cx="12" cy="7.9" r="1.05" fill={GOLD} stroke="none" />}
    </>
  ),
  alert: (ac) => (
    <>
      <path d="M12 4.2 21 19.4H3z" />
      <path d="M12 10v4.2" />
      {ac && <circle cx="12" cy="16.8" r="1" fill={GOLD} stroke="none" />}
    </>
  ),
  target: (ac) => (
    <>
      <circle cx="12" cy="12" r="7.8" />
      <circle cx="12" cy="12" r="3.6" />
      {ac && <circle cx="12" cy="12" r="1.1" fill={GOLD} stroke="none" />}
    </>
  ),
  sun: (ac) => (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3.2v2.2M12 18.6v2.2M20.8 12h-2.2M5.4 12H3.2M18.1 5.9l-1.6 1.6M7.5 16.5l-1.6 1.6M18.1 18.1l-1.6-1.6M7.5 7.5 5.9 5.9" />
      {ac && <circle cx="12" cy="12" r="1.1" fill={GOLD} stroke="none" />}
    </>
  ),
  bell: (ac) => ICONS.notification(ac),
};

export type IconName = keyof typeof ICONS;

interface IconProps {
  name: string;
  size?: number;
  className?: string;
  strokeWidth?: number;
  /** Отрисовывать ли золотые акценты. */
  accent?: boolean;
}

export function Icon({ name, size = 24, className, strokeWidth = 1.7, accent = true }: IconProps) {
  const draw = ICONS[name] ?? ICONS.star;
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {draw(accent)}
    </svg>
  );
}
