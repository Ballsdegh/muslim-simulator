import { useGame } from '../state/GameContext';
import { levelFromXp } from '../data/levels';
import { Icon } from './icons';
import { ArabesqueDivider, StarLatticePattern } from './decor';
import { ACHIEVEMENTS } from '../data/achievements';
import { fmtDateShort, dateFromDay } from '../utils';
import { Button, ProgressRing } from './ui';

/** Экран «День завершён» со статистикой. */
export function DaySummary({ onStartNewDay }: { onStartNewDay: () => void }) {
  const { state } = useGame();
  const record = state.history.find((r) => r.day === state.day);
  const xpToday = state.xp - state.dayStartXp;
  const goalsDone = state.goals.filter((g) => state.counters[g.counter] >= g.target).length;
  const newAchievements = ACHIEVEMENTS.filter((a) => state.achievements[a.id]?.unlockedAtDay === state.day);
  const lvl = levelFromXp(state.xp);
  const dateText = fmtDateShort(dateFromDay(state.startedAtISO, state.day));

  const stats = [
    { label: 'Выполнено', value: record?.completed ?? state.dayCompletedCount, icon: 'check', color: 'text-emeraldx-300' },
    { label: 'Пропущено', value: record?.missed ?? state.dayMissedCount, icon: 'close', color: 'text-red-300/80' },
    { label: 'Опыт', value: `+${xpToday}`, icon: 'sparkle', color: 'text-gold-300' },
    { label: 'Молитв', value: state.counters.prayers, icon: 'prayer', color: 'text-emeraldx-300' },
  ];

  return (
    <div className="app-bg fixed inset-0 z-[60] overflow-y-auto scrollbar-thin">
      <StarLatticePattern className="pointer-events-none fixed inset-0" id="sum-pat" opacity={0.045} />
      <div className="relative mx-auto flex min-h-full w-full max-w-lg flex-col items-center px-5 pb-10 pt-12">
        {/* Иконка завершения */}
        <div className="animate-pop-in relative">
          <div className="absolute -inset-7 rounded-full bg-emeraldx-500/10 blur-2xl" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-emeraldx-500/40 bg-gradient-to-b from-forest-700/70 to-night-900 shadow-card">
            <Icon name="check" size={40} />
          </div>
        </div>

        <h1 className="mt-6 animate-slide-up text-[26px] font-extrabold text-cream-50">День завершён</h1>
        <p className="mt-1 animate-slide-up text-[13px] text-cream-100/55 [animation-delay:120ms]">
          День {state.day} · {dateText}
        </p>

        <div className="mt-5 animate-fade-in [animation-delay:300ms]">
          <ArabesqueDivider width={210} />
        </div>

        {/* Серия */}
        <div className="mt-5 flex w-full max-w-sm animate-scale-in items-center gap-4 rounded-3xl border border-gold-400/25 bg-gradient-to-br from-gold-500/12 to-white/3 p-4 [animation-delay:350ms]">
          <ProgressRing value={1} size={64} stroke={6} gold>
            <span className="flex flex-col items-center">
              <Icon name="flame" size={22} />
              <span className="text-[13px] font-extrabold text-gold-300 tabular">{state.streak}</span>
            </span>
          </ProgressRing>
          <div>
            <p className="text-sm font-extrabold text-cream-50">
              {state.streak > 0 ? `Серия: ${state.streak} дн.` : 'Серия сброшена'}
            </p>
            <p className="mt-0.5 text-xs leading-snug text-cream-100/55">
              {state.streak > 0
                ? 'Дисциплина держится. Лучший результат: ' + state.bestStreak + ' дн.'
                : 'Новый день — новый шанс. Серия продолжится с 4+ молитв или 2 целей.'}
            </p>
          </div>
        </div>

        {/* Статистика */}
        <div className="mt-4 grid w-full max-w-sm grid-cols-2 gap-3">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="glass animate-slide-up rounded-2xl p-4"
              style={{ animationDelay: `${400 + i * 90}ms` }}
            >
              <span className={`flex h-8 w-8 items-center justify-center rounded-xl bg-white/7 ${s.color}`}>
                <Icon name={s.icon} size={16} />
              </span>
              <p className="mt-2.5 text-[22px] font-extrabold leading-none text-cream-50 tabular">{s.value}</p>
              <p className="mt-1 text-[11.5px] font-semibold text-cream-100/50">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Цели */}
        <div className="mt-4 w-full max-w-sm animate-slide-up rounded-3xl border border-white/8 bg-white/4 p-4 [animation-delay:700ms]">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-extrabold text-cream-50">Цели дня</p>
            <p className="text-xs font-bold text-gold-300 tabular">
              {goalsDone} / {state.goals.length}
            </p>
          </div>
          <div className="mt-3 space-y-2">
            {state.goals.map((g) => {
              const done = state.counters[g.counter] >= g.target;
              return (
                <div key={g.id} className="flex items-center gap-2.5">
                  <span
                    className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full ${
                      done ? 'bg-emeraldx-500/25 text-emeraldx-300' : 'bg-white/6 text-cream-100/30'
                    }`}
                  >
                    <Icon name={done ? 'check' : g.icon} size={12} strokeWidth={2.2} />
                  </span>
                  <p className={`text-[12.5px] font-semibold ${done ? 'text-cream-100/80 line-through opacity-70' : 'text-cream-100/45'}`}>
                    {g.title}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Достижения дня */}
        {newAchievements.length > 0 && (
          <div className="mt-4 w-full max-w-sm animate-slide-up rounded-3xl border border-gold-400/25 bg-gradient-to-br from-gold-500/10 to-white/3 p-4 [animation-delay:800ms]">
            <p className="text-[13px] font-extrabold text-cream-50">Новые достижения</p>
            <div className="mt-3 space-y-2.5">
              {newAchievements.map((a) => (
                <div key={a.id} className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-400/15 text-gold-300">
                    <Icon name={a.icon} size={18} />
                  </span>
                  <div>
                    <p className="text-[13px] font-bold text-cream-50">{a.title}</p>
                    <p className="text-[11px] text-cream-100/50">{a.condition}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Уровень */}
        <div className="mt-4 flex w-full max-w-sm animate-slide-up items-center gap-4 rounded-3xl border border-white/8 bg-white/4 p-4 [animation-delay:900ms]">
          <ProgressRing value={lvl.inLevel / lvl.needed} size={60} stroke={6}>
            <span className="text-[15px] font-extrabold text-cream-50 tabular">{lvl.level}</span>
          </ProgressRing>
          <div>
            <p className="text-sm font-extrabold text-cream-50">Уровень {lvl.level}</p>
            <p className="mt-0.5 text-xs text-cream-100/55 tabular">
              {lvl.inLevel} / {lvl.needed} XP до следующего
            </p>
          </div>
        </div>

        <div className="mt-7 w-full max-w-sm animate-slide-up pb-safe [animation-delay:1000ms]">
          <Button full icon="sunrise" onClick={onStartNewDay}>
            Начать новый день
          </Button>
        </div>
      </div>
    </div>
  );
}
