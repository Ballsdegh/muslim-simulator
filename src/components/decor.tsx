/**
 * Декоративные SVG: исламская геометрия, эмблема, орнаментальные
 * разделители и частицы. Всё фоновое и ненавязчивое.
 */

export function LogoEmblem({ size = 96, className }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} className={className} aria-hidden="true">
      <defs>
        <linearGradient id="emblem-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F5EBCD" />
          <stop offset="45%" stopColor="#DDBC6B" />
          <stop offset="100%" stopColor="#B08A35" />
        </linearGradient>
        <radialGradient id="emblem-glow" cx="50%" cy="42%" r="60%">
          <stop offset="0%" stopColor="rgba(221,188,107,0.28)" />
          <stop offset="100%" stopColor="rgba(221,188,107,0)" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="56" r="52" fill="url(#emblem-glow)" />
      {/* внешнее кольцо из точек */}
      <g stroke="url(#emblem-gold)" strokeWidth="1.1" opacity="0.55">
        <circle cx="60" cy="58" r="50" fill="none" strokeDasharray="1.5 6.2" strokeLinecap="round" />
      </g>
      {/* восьмиконечная звезда */}
      <g stroke="url(#emblem-gold)" strokeWidth="2" fill="none" strokeLinejoin="round">
        <rect x="31" y="29" width="58" height="58" rx="7" transform="rotate(45 60 58)" />
        <rect x="31" y="29" width="58" height="58" rx="7" />
      </g>
      {/* полумесяц */}
      <path
        d="M66.8 40.4a19.6 19.6 0 1 0 0 35.2 21.8 21.8 0 1 1 0-35.2z"
        fill="url(#emblem-gold)"
        opacity="0.92"
      />
      {/* звезда внутри */}
      <path
        d="m70 52.2 2.3 6.1 6.1 2.3-6.1 2.3-2.3 6.1-2.3-6.1-6.1-2.3 6.1-2.3z"
        fill="#F5EBCD"
      />
      <path d="M38 92h44" stroke="url(#emblem-gold)" strokeWidth="1.6" strokeLinecap="round" opacity="0.8" />
      <path d="M48 96.6h24" stroke="url(#emblem-gold)" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

/** Тонкий повторяющийся узор: восьмиконечные звёзды + перекрестия. */
export function StarLatticePattern({ className, id = 'p1', opacity = 0.05 }: { className?: string; id?: string; opacity?: number }) {
  return (
    <svg className={className} width="100%" height="100%" aria-hidden="true" style={{ opacity }}>
      <defs>
        <pattern id={id} width="72" height="72" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="#EFE4C3" strokeWidth="1">
            <rect x="24" y="24" width="24" height="24" rx="2" />
            <rect x="24" y="24" width="24" height="24" rx="2" transform="rotate(45 36 36)" />
            <path d="M0 36h10M62 36h10M36 0v10M36 62v10" />
            <circle cx="36" cy="36" r="3.2" />
            <circle cx="0" cy="0" r="2.6" />
            <circle cx="72" cy="0" r="2.6" />
            <circle cx="0" cy="72" r="2.6" />
            <circle cx="72" cy="72" r="2.6" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/** Михрабная арка — для заголовков и splash. */
export function ArchFrame({ className, stroke = '#DDBC6B', opacity = 0.3 }: { className?: string; stroke?: string; opacity?: number }) {
  return (
    <svg viewBox="0 0 200 260" className={className} fill="none" aria-hidden="true" style={{ opacity }}>
      <path
        d="M100 12c34 22 62 44 62 92v144H38V104c0-48 28-70 62-92z"
        stroke={stroke}
        strokeWidth="1.6"
      />
      <path
        d="M100 34c24 16 44 34 44 70v132H56V104c0-36 20-54 44-70z"
        stroke={stroke}
        strokeWidth="1"
        strokeDasharray="1 5"
        strokeLinecap="round"
      />
      <circle cx="100" cy="104" r="4" fill={stroke} opacity="0.9" />
    </svg>
  );
}

/** Орнаментальный разделитель. */
export function ArabesqueDivider({ className, width = 220 }: { className?: string; width?: number }) {
  return (
    <svg viewBox="0 0 220 16" width={width} height={16} className={className} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="div-g" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#DDBC6B" stopOpacity="0" />
          <stop offset="50%" stopColor="#DDBC6B" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#DDBC6B" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M4 8h80M136 8h80" stroke="url(#div-g)" strokeWidth="1.2" strokeLinecap="round" />
      <g stroke="#DDBC6B" strokeWidth="1.2">
        <rect x="104" y="2" width="12" height="12" transform="rotate(45 110 8)" />
        <rect x="104" y="2" width="12" height="12" transform="rotate(45 110 8)" opacity="0.5" />
      </g>
      <circle cx="110" cy="8" r="1.6" fill="#DDBC6B" />
      <path d="M92 8l4-4 4 4-4 4zM120 8l4-4 4 4-4 4z" fill="#DDBC6B" opacity="0.55" />
    </svg>
  );
}

/** Плавающие светящиеся частицы (немного, только для акцента). */
export function FloatingParticles({ count = 10, className }: { count?: number; className?: string }) {
  const items = Array.from({ length: count }, (_, i) => {
    const left = (i * 97 + 13) % 100;
    const top = (i * 53 + 29) % 100;
    const delay = (i % 7) * 1.1;
    const dur = 6 + (i % 5) * 1.7;
    const size = 2.5 + ((i * 7) % 4);
    return { left, top, delay, dur, size, key: i };
  });
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ''}`} aria-hidden="true">
      {items.map((p) => (
        <span
          key={p.key}
          className="absolute rounded-full animate-float"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            background: 'radial-gradient(circle, rgba(245,235,205,0.75), rgba(221,188,107,0))',
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
            opacity: 0.55,
          }}
        />
      ))}
    </div>
  );
}

/** Статистика-эффект выбора: чипы «+Иман −Энергия» и т.п. */
export function StatBadge({ stat, value }: { stat: string; value: number }) {
  const labels: Record<string, string> = {
    iman: 'Иман',
    prayer: 'Намаз',
    knowledge: 'Знания',
    deeds: 'Благие дела',
    health: 'Здоровье',
    energy: 'Энергия',
    mood: 'Настроение',
    reputation: 'Репутация',
    money: 'Деньги',
    xp: 'XP',
    time: 'Время',
    pages: 'Страницы',
    charity: 'Садака',
  };
  const positive = value > 0;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold tabular ${
        positive
          ? 'bg-emeraldx-500/15 text-emeraldx-300 border border-emeraldx-500/25'
          : 'bg-red-400/10 text-red-300/90 border border-red-400/20'
      }`}
    >
      {labels[stat] ?? stat} {positive ? '+' : ''}
      {stat === 'money' ? Math.round(value).toLocaleString('ru-RU') : value}
    </span>
  );
}
