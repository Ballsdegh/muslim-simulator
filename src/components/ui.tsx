import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { useEffect } from 'react';
import { Icon } from './icons';
import { avatarById } from '../data/avatars';

// ——— Карточка ———
export function Card({
  children,
  className,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`glass rounded-3xl shadow-card ${onClick ? 'cursor-pointer press hover:border-gold-400/30' : ''} ${className ?? ''}`}
    >
      {children}
    </div>
  );
}

// ——— Кнопки ———
type BtnVariant = 'gold' | 'ghost' | 'outline' | 'danger';

export function Button({
  children,
  variant = 'gold',
  icon,
  className,
  full,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: BtnVariant;
  icon?: string;
  full?: boolean;
}) {
  const base =
    'press inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold disabled:opacity-40 disabled:pointer-events-none select-none';
  const styles: Record<BtnVariant, string> = {
    gold: 'bg-gradient-to-br from-gold-300 via-gold-400 to-gold-600 text-ink-900 shadow-glow hover:brightness-105',
    ghost: 'text-cream-100/80 hover:text-cream-50 hover:bg-white/5',
    outline: 'border border-white/15 bg-white/5 text-cream-50 hover:border-gold-400/40 hover:bg-white/8',
    danger: 'border border-red-400/25 bg-red-400/10 text-red-200 hover:bg-red-400/20',
  };
  return (
    <button className={`${base} ${styles[variant]} ${full ? 'w-full' : ''} ${className ?? ''}`} {...rest}>
      {icon && <Icon name={icon} size={18} />}
      {children}
    </button>
  );
}

// ——— Линейный прогресс ———
export function Bar({
  value,
  max = 100,
  className,
  gold,
}: {
  value: number;
  max?: number;
  className?: string;
  gold?: boolean;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={`h-1.5 w-full overflow-hidden rounded-full bg-white/8 ${className ?? ''}`}>
      <div
        className={`h-full rounded-full transition-all duration-700 ease-out ${
          gold ? 'bg-gradient-to-r from-gold-300 to-gold-500' : 'bg-gradient-to-r from-emeraldx-400 to-emeraldx-500'
        }`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

// ——— Кольцевой прогресс ———
export function ProgressRing({
  value,
  size = 96,
  stroke = 8,
  children,
  gold,
}: {
  value: number;
  size?: number;
  stroke?: number;
  children?: ReactNode;
  gold?: boolean;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, value));
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={gold ? 'ring-gold' : 'ring-em'} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={gold ? '#F5EBCD' : '#63d9b3'} />
            <stop offset="100%" stopColor={gold ? '#B08A35' : '#22a37a'} />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.09)" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={`url(#${gold ? 'ring-gold' : 'ring-em'})`}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          style={{ transition: 'stroke-dashoffset 0.9s cubic-bezier(0.22,1,0.36,1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
}

// ——— Модальное окно / нижний лист ———
export function Sheet({
  open,
  onClose,
  children,
  maxWidth = 'max-w-lg',
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-night-950/70 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div
        className={`relative w-full ${maxWidth} animate-sheet-up sm:animate-scale-in max-h-[92vh] overflow-y-auto scrollbar-thin rounded-t-4xl sm:rounded-4xl border border-white/10 bg-gradient-to-b from-night-800 to-night-900 shadow-card`}
      >
        <div className="sticky top-0 z-10 flex justify-center bg-gradient-to-b from-night-800 to-night-800/0 pt-3 pb-1 sm:hidden">
          <span className="h-1.5 w-12 rounded-full bg-white/20" />
        </div>
        {children}
      </div>
    </div>
  );
}

// ——— Аватар-медальон ———
export function Avatar({
  avatarId,
  name,
  size = 48,
  ring,
}: {
  avatarId: string;
  name: string;
  size?: number;
  ring?: boolean;
}) {
  const def = avatarById(avatarId);
  const initial = (name || 'М').trim().charAt(0).toUpperCase();
  const uid = `av-${def.id}`;
  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-full ${ring ? 'ring-2 ring-gold-400/70 ring-offset-2 ring-offset-night-900' : ''}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true">
        <defs>
          <linearGradient id={uid} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={def.bgFrom} />
            <stop offset="100%" stopColor={def.bgTo} />
          </linearGradient>
        </defs>
        <rect width="64" height="64" fill={`url(#${uid})`} />
        {def.pattern === 'star' && (
          <g stroke={def.accent} strokeWidth="1.3" fill="none" opacity="0.65">
            <rect x="22" y="22" width="20" height="20" rx="2.5" />
            <rect x="22" y="22" width="20" height="20" rx="2.5" transform="rotate(45 32 32)" />
          </g>
        )}
        {def.pattern === 'arch' && (
          <g stroke={def.accent} strokeWidth="1.3" fill="none" opacity="0.65">
            <path d="M32 14c9 6 15 12 15 24v12H17V38c0-12 6-18 15-24z" />
            <path d="M22 50V40a10 10 0 0 1 20 0v10" opacity="0.6" />
          </g>
        )}
        {def.pattern === 'tiles' && (
          <g stroke={def.accent} strokeWidth="1.2" fill="none" opacity="0.6">
            <path d="M0 16h64M0 32h64M0 48h64M16 0v64M32 0v64M48 0v64" />
          </g>
        )}
        {def.pattern === 'rings' && (
          <g stroke={def.accent} strokeWidth="1.2" fill="none" opacity="0.6">
            <circle cx="32" cy="32" r="9" />
            <circle cx="32" cy="32" r="16" strokeDasharray="2 4" />
            <circle cx="32" cy="32" r="23" opacity="0.5" />
          </g>
        )}
        <text
          x="32"
          y="34"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="22"
          fontWeight="800"
          fill={def.accent}
          fontFamily="Manrope, sans-serif"
        >
          {initial}
        </text>
      </svg>
    </div>
  );
}

// ——— Заголовок секции ———
export function SectionTitle({
  icon,
  title,
  action,
}: {
  icon?: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        {icon && (
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gold-400/12 text-gold-300">
            <Icon name={icon} size={17} />
          </span>
        )}
        <h2 className="text-[15px] font-extrabold tracking-wide text-cream-50">{title}</h2>
      </div>
      {action}
    </div>
  );
}

// ——— Чип ———
export function Chip({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`press shrink-0 rounded-full px-4 py-2 text-[13px] font-bold transition-colors ${
        active
          ? 'bg-gradient-to-br from-gold-300 to-gold-500 text-ink-900 shadow-glow'
          : 'border border-white/12 bg-white/5 text-cream-100/75 hover:border-gold-400/30 hover:text-cream-50'
      }`}
    >
      {children}
    </button>
  );
}

// ——— Пустое состояние ———
export function EmptyState({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-10 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-gold-300/70">
        <Icon name={icon} size={26} />
      </span>
      <p className="text-sm font-bold text-cream-100">{title}</p>
      <p className="max-w-[260px] text-xs leading-relaxed text-cream-100/50">{text}</p>
    </div>
  );
}
