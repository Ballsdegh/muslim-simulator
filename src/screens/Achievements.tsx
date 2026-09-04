import { useGame } from '../state/GameContext';
import { ACHIEVEMENTS } from '../data/achievements';
import { Icon } from '../components/icons';
import { Bar, Card } from '../components/ui';

export function AchievementsScreen() {
  const { state } = useGame();
  const unlockedCount = ACHIEVEMENTS.filter((a) => state.achievements[a.id]?.unlocked).length;

  return (
    <div className="space-y-5 pb-6">
      <Card className="p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10.5px] font-extrabold uppercase tracking-[0.24em] text-gold-300/75">Ваши награды</p>
            <h1 className="mt-0.5 text-[21px] font-extrabold text-cream-50">Достижения</h1>
          </div>
          <div className="text-right">
            <p className="text-[22px] font-extrabold leading-none gold-text tabular">
              {unlockedCount}
              <span className="text-[14px] text-cream-100/40">/{ACHIEVEMENTS.length}</span>
            </p>
            <p className="mt-1 text-[11px] font-semibold text-cream-100/45">открыто</p>
          </div>
        </div>
        <Bar value={unlockedCount} max={ACHIEVEMENTS.length} className="mt-4" gold />
      </Card>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {ACHIEVEMENTS.map((a) => {
          const st = state.achievements[a.id];
          const unlocked = !!st?.unlocked;
          const prog = Math.min(1, a.progress(state));
          return (
            <div
              key={a.id}
              className={`relative overflow-hidden rounded-3xl border p-4 transition-all ${
                unlocked
                  ? 'border-gold-400/35 bg-gradient-to-br from-gold-500/12 via-white/4 to-transparent shadow-card'
                  : 'glass-locked'
              }`}
            >
              {unlocked && (
                <svg viewBox="0 0 72 72" className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 opacity-[0.09]" aria-hidden="true">
                  <g fill="none" stroke="#DDBC6B" strokeWidth="1.5">
                    <rect x="16" y="16" width="40" height="40" rx="4" />
                    <rect x="16" y="16" width="40" height="40" rx="4" transform="rotate(45 36 36)" />
                  </g>
                </svg>
              )}
              <div className="relative flex items-start gap-3.5">
                <span
                  className={`relative flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl border ${
                    unlocked
                      ? 'border-gold-400/60 bg-gradient-to-b from-gold-400/25 to-gold-600/15 text-gold-300 shadow-glow'
                      : 'border-white/8 bg-white/4 text-cream-100/30'
                  }`}
                >
                  <Icon name={unlocked ? a.icon : 'lock'} size={24} />
                  {unlocked && (
                    <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-gold-300 to-gold-600 text-ink-900">
                      <Icon name="check" size={10} accent={false} strokeWidth={3} />
                    </span>
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-[14.5px] font-extrabold leading-snug ${unlocked ? 'text-cream-50' : 'text-cream-100/55'}`}>
                      {a.title}
                    </p>
                    {st?.unlockedAtDay && (
                      <span className="shrink-0 rounded-lg bg-gold-400/12 px-1.5 py-0.5 text-[9.5px] font-extrabold text-gold-300/90">
                        день {st.unlockedAtDay}
                      </span>
                    )}
                  </div>
                  <p className={`mt-1 text-[12px] leading-snug ${unlocked ? 'text-cream-100/60' : 'text-cream-100/40'}`}>
                    {a.description}
                  </p>
                  {!unlocked && (
                    <>
                      <div className="mt-2.5">
                        <Bar value={prog * 100} gold={false} />
                      </div>
                      <p className="mt-1.5 text-[10.5px] font-bold text-cream-100/35 tabular">
                        {a.condition} · {Math.round(prog * 100)}%
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
