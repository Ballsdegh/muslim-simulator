import { useEffect, useState } from 'react';
import { useGame } from '../state/GameContext';
import { Icon } from './icons';
import type { Notif } from '../types';

const TYPE_STYLE: Record<Notif['type'], { bg: string; iconColor: string; ring: string }> = {
  info: { bg: 'from-night-700/95 to-night-800/95', iconColor: 'text-emeraldx-300', ring: 'border-emeraldx-500/25' },
  success: { bg: 'from-emeraldx-500/25 to-night-800/95', iconColor: 'text-emeraldx-300', ring: 'border-emeraldx-500/30' },
  achievement: { bg: 'from-gold-500/25 to-night-800/95', iconColor: 'text-gold-300', ring: 'border-gold-400/40' },
  reminder: { bg: 'from-night-700/95 to-night-800/95', iconColor: 'text-gold-300', ring: 'border-white/12' },
  level: { bg: 'from-gold-500/30 to-night-800/95', iconColor: 'text-gold-200', ring: 'border-gold-400/50' },
};

function ToastCard({ n, onDone }: { n: Notif; onDone: () => void }) {
  const [leaving, setLeaving] = useState(false);
  const style = TYPE_STYLE[n.type];

  useEffect(() => {
    const t1 = setTimeout(() => setLeaving(true), 3600);
    const t2 = setTimeout(onDone, 4000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onDone]);

  return (
    <div
      className={`pointer-events-auto flex w-[calc(100vw-2rem)] max-w-sm items-start gap-3 rounded-2xl border bg-gradient-to-br p-3.5 shadow-card backdrop-blur-md transition-all duration-300 ${
        style.ring
      } ${style.bg} ${leaving ? 'translate-x-6 opacity-0' : 'animate-slide-down'}`}
    >
      <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/8 ${style.iconColor}`}>
        <Icon name={n.icon ?? 'notification'} size={18} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-extrabold leading-tight text-cream-50">{n.title}</p>
        {n.text && <p className="mt-0.5 text-xs leading-snug text-cream-100/65">{n.text}</p>}
      </div>
      <button onClick={onDone} className="press -m-1 rounded-lg p-1 text-cream-100/40 hover:text-cream-100">
        <Icon name="close" size={14} accent={false} />
      </button>
    </div>
  );
}

export function ToastStack({ toasts, onDismiss }: { toasts: Notif[]; onDismiss: (id: string) => void }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-[70] flex flex-col items-center gap-2 px-4 sm:items-end sm:pr-5">
      {toasts.map((t) => (
        <ToastCard key={t.id} n={t} onDone={() => onDismiss(t.id)} />
      ))}
    </div>
  );
}

export function BellMenu() {
  const { state } = useGame();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="press relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-cream-100/85 hover:border-gold-400/35 hover:text-gold-300"
        aria-label="Уведомления"
      >
        <Icon name="notification" size={19} />
        {state.feed.length > 0 && (
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-gold-400 ring-2 ring-night-900" />
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-2 w-80 max-w-[calc(100vw-1.5rem)] animate-scale-in overflow-hidden rounded-2xl border border-white/12 bg-night-800/97 shadow-card backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
              <p className="text-sm font-extrabold text-cream-50">Уведомления</p>
              <button onClick={() => setOpen(false)} className="press text-cream-100/50 hover:text-cream-50">
                <Icon name="close" size={15} accent={false} />
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto scrollbar-thin">
              {state.feed.length === 0 && (
                <p className="px-4 py-6 text-center text-xs text-cream-100/45">Пока тихо. Всё случится — не торопите день.</p>
              )}
              {state.feed.map((n) => (
                <div key={n.id} className="flex items-start gap-3 border-b border-white/5 px-4 py-3 last:border-0">
                  <span className="mt-0.5 text-gold-300/90">
                    <Icon name={n.icon ?? 'notification'} size={16} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[12.5px] font-bold leading-snug text-cream-50">{n.title}</p>
                    {n.text && <p className="mt-0.5 text-[11.5px] leading-snug text-cream-100/55">{n.text}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
