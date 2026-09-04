import { useEffect, useState } from 'react';
import { useGame } from '../state/GameContext';
import { Icon } from './icons';
import { StarLatticePattern } from './decor';

/**
 * Полноэкранные анимации-состояния: повышение уровня и получение
 * достижения. Показываются по очереди из очереди оверлеев.
 */
export function OverlayStage() {
  const { state, dispatch } = useGame();
  const current = state.overlays?.[0];
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    setLeaving(false);
    if (!current) return;
    const t1 = setTimeout(() => setLeaving(true), 2000);
    const t2 = setTimeout(() => dispatch({ type: 'DISMISS_OVERLAY', id: current.id }), 2550);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [current?.id]);

  if (!current) return null;
  void leaving;

  if (current.type === 'level') {
    return (
      <div className="fixed inset-0 z-[75] flex items-center justify-center overflow-hidden bg-night-950/80 backdrop-blur-md">
        <StarLatticePattern className="absolute inset-0" id="ov-pat" opacity={0.06} />
        {/* вращающиеся лучи */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <svg viewBox="0 0 200 200" className="h-72 w-72 animate-rays-rotate opacity-40" aria-hidden="true">
            {Array.from({ length: 12 }, (_, i) => (
              <path
                key={i}
                d="M100 100 L96 18 L100 8 L104 18 Z"
                fill="#DDBC6B"
                opacity={i % 2 ? 0.25 : 0.5}
                transform={`rotate(${i * 30} 100 100)`}
              />
            ))}
          </svg>
        </div>
        <div className="relative flex flex-col items-center">
          <div className="animate-pop-in flex h-32 w-32 items-center justify-center rounded-full border-2 border-gold-400/60 bg-gradient-to-b from-forest-700/80 to-night-900 shadow-glow">
            <Icon name="levelup" size={54} />
          </div>
          <p className="mt-3 animate-slide-up text-[11px] font-bold uppercase tracking-[0.3em] text-gold-300/80">
            {current.subtitle}
          </p>
          <p className="gold-text animate-pop-in mt-1 text-[34px] font-extrabold [animation-delay:120ms]">{current.title}</p>
        </div>
      </div>
    );
  }

  // achievement
  return (
    <div className="fixed inset-0 z-[75] flex items-center justify-center overflow-hidden bg-night-950/80 backdrop-blur-md">
      <StarLatticePattern className="absolute inset-0" id="ov-ach" opacity={0.05} />
      <div className="relative flex flex-col items-center px-8">
        <div className="animate-pop-in relative">
          <div className="absolute -inset-6 rounded-full bg-gold-400/12 blur-2xl" />
          <div className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-2 border-gold-400/70 bg-gradient-to-b from-forest-700/80 to-night-900 shadow-glow">
            <Icon name={current.icon ?? 'achievement'} size={52} />
            {/* блик */}
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_ease-in-out_0.3s_infinite] bg-gradient-to-r from-transparent via-white/25 to-transparent" style={{ backgroundSize: '200% 100%' }} />
          </div>
          <span className="absolute -right-1 -top-1 flex h-8 w-8 animate-pop-in items-center justify-center rounded-full bg-gradient-to-br from-gold-300 to-gold-600 text-ink-900 shadow-glow [animation-delay:300ms]">
            <Icon name="check" size={15} accent={false} strokeWidth={2.6} />
          </span>
        </div>
        <p className="mt-4 animate-slide-up text-[11px] font-bold uppercase tracking-[0.3em] text-gold-300/85">
          Достижение открыто
        </p>
        <p className="mt-1.5 animate-slide-up text-center text-[24px] font-extrabold text-cream-50 [animation-delay:120ms]">
          {current.title}
        </p>
        <p className="mt-1.5 max-w-xs animate-slide-up text-center text-[13px] leading-relaxed text-cream-100/60 [animation-delay:240ms]">
          {current.subtitle}
        </p>
      </div>
    </div>
  );
}
