import { useEffect, useState } from 'react';
import { LogoEmblem, ArabesqueDivider, StarLatticePattern, FloatingParticles } from './decor';

export function SplashScreen({ onDone, resume }: { onDone: () => void; resume: boolean }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setLeaving(true), 2300);
    const t2 = setTimeout(onDone, 2900);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onDone]);

  return (
    <div
      className={`app-bg fixed inset-0 z-[90] flex flex-col items-center justify-center overflow-hidden transition-opacity duration-700 ${
        leaving ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <StarLatticePattern className="absolute inset-0" id="splash-pat" opacity={0.045} />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-forest-700/30 to-transparent" />
      <FloatingParticles count={14} />

      <div className={`relative flex flex-col items-center transition-transform duration-1000 ${leaving ? 'scale-105' : ''}`}>
        <div className="animate-pop-in">
          <LogoEmblem size={132} className="drop-shadow-[0_0_36px_rgba(221,188,107,0.35)]" />
        </div>

        <h1 className="mt-7 animate-slide-up px-6 text-center text-[26px] font-extrabold leading-tight tracking-tight text-cream-50 [animation-delay:250ms]">
          Симулятор <span className="gold-text">мусульманина</span>
        </h1>
        <p className="mt-2 animate-slide-up text-sm font-medium tracking-[0.22em] text-cream-100/55 uppercase [animation-delay:450ms]">
          Один день. Много решений.
        </p>

        <div className="mt-9 animate-fade-in [animation-delay:800ms]">
          <ArabesqueDivider width={230} />
        </div>

        <div className="mt-8 h-[3px] w-40 overflow-hidden rounded-full bg-white/8">
          <div className="shimmer-line h-full w-full" />
        </div>

        <p className="mt-4 animate-fade-in text-[11px] font-semibold tracking-widest text-cream-100/35 uppercase [animation-delay:1200ms]">
          {resume ? 'Продолжаем путь…' : 'Загружаем день…'}
        </p>
      </div>

      <p className="pb-safe absolute inset-x-0 bottom-6 text-center text-[10.5px] leading-relaxed text-cream-100/30">
        Игровая модель для самодисциплины. Не отражает духовный статус человека.
      </p>
    </div>
  );
}

/** Splash между днями: «День N». */
export function DaySplash({ day, dateText, onDone }: { day: number; dateText: string; onDone: () => void }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setLeaving(true), 2100);
    const t2 = setTimeout(onDone, 2700);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-[85] flex flex-col items-center justify-center overflow-hidden bg-night-950/92 backdrop-blur-xl transition-opacity duration-600 ${
        leaving ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <StarLatticePattern className="absolute inset-0" id="day-pat" opacity={0.05} />
      <div className="relative flex flex-col items-center">
        <span className="animate-fade-in text-[11px] font-bold uppercase tracking-[0.3em] text-gold-300/80">
          Новый день
        </span>
        <div className="animate-pop-in mt-4 flex h-32 w-32 items-center justify-center rounded-full border border-gold-400/30 bg-gradient-to-b from-forest-800/70 to-night-900/80 shadow-glow">
          <div className="text-center">
            <p className="text-[42px] font-extrabold leading-none gold-text tabular">{day}</p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-cream-100/50">день</p>
          </div>
        </div>
        <p className="mt-5 animate-slide-up text-sm font-semibold text-cream-100/70">{dateText}</p>
        <p className="mt-1.5 animate-slide-up text-xs text-cream-100/40 [animation-delay:200ms]">
          Фаджр уже близко — начнём с рассвета
        </p>
      </div>
    </div>
  );
}
