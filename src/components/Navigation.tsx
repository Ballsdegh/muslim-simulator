import { useGame } from '../state/GameContext';
import type { ScreenId } from '../types';
import { Icon } from './icons';
import { Avatar, ProgressRing } from './ui';
import { levelFromXp } from '../data/levels';
import { LogoEmblem, StarLatticePattern } from './decor';

export const NAV_ITEMS: Array<{ id: ScreenId; label: string; icon: string }> = [
  { id: 'home', label: 'Главная', icon: 'home' },
  { id: 'day', label: 'День', icon: 'calendar' },
  { id: 'knowledge', label: 'Знания', icon: 'knowledge' },
  { id: 'achievements', label: 'Достижения', icon: 'achievement' },
  { id: 'profile', label: 'Профиль', icon: 'profile' },
];

/** Нижняя навигация (мобильные). */
export function BottomNavigation({
  screen,
  onNavigate,
}: {
  screen: ScreenId;
  onNavigate: (s: ScreenId) => void;
}) {
  return (
    <nav className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-white/8 bg-night-900/92 backdrop-blur-xl lg:hidden">
      <div className="mx-auto flex max-w-lg items-stretch justify-around px-2 pt-1.5 pb-1.5">
        {NAV_ITEMS.map((item) => {
          const active = screen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="press relative flex min-w-[56px] flex-1 flex-col items-center gap-1 rounded-2xl px-1 py-1.5"
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
            >
              <span
                className={`absolute inset-x-3 top-0 h-[3px] rounded-b-full bg-gradient-to-r from-gold-300 to-gold-500 transition-all duration-300 ${
                  active ? 'opacity-100' : 'opacity-0'
                }`}
              />
              <span
                className={`transition-all duration-300 ${
                  active ? '-translate-y-0.5 scale-110 text-gold-300' : 'text-cream-100/55'
                }`}
              >
                <Icon name={item.icon} size={22} />
              </span>
              <span
                className={`text-[10px] font-bold tracking-wide transition-colors duration-300 ${
                  active ? 'text-gold-300' : 'text-cream-100/50'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

/** Sidebar (desktop). */
export function Sidebar({ screen, onNavigate }: { screen: ScreenId; onNavigate: (s: ScreenId) => void }) {
  const { state } = useGame();
  const lvl = levelFromXp(state.xp);

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[264px] flex-col overflow-hidden border-r border-white/8 bg-night-900/60 backdrop-blur-xl lg:flex">
      <StarLatticePattern className="absolute inset-0" id="side-pat" opacity={0.035} />
      <div className="relative flex items-center gap-3 px-6 pt-7">
        <LogoEmblem size={44} />
        <div>
          <p className="text-[15px] font-extrabold leading-tight text-cream-50">
            Симулятор <span className="gold-text">мусульманина</span>
          </p>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cream-100/40">
            один день · много решений
          </p>
        </div>
      </div>

      <nav className="relative mt-8 flex-1 space-y-1 px-4">
        {NAV_ITEMS.map((item) => {
          const active = screen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`press group relative flex w-full items-center gap-3.5 rounded-2xl px-4 py-3 text-[14px] font-bold transition-colors ${
                active
                  ? 'bg-gradient-to-r from-gold-400/15 to-transparent text-gold-200'
                  : 'text-cream-100/60 hover:bg-white/4 hover:text-cream-50'
              }`}
            >
              <span
                className={`absolute left-0 top-1/2 h-7 w-[3px] -translate-y-1/2 rounded-full bg-gradient-to-b from-gold-300 to-gold-500 transition-opacity ${
                  active ? 'opacity-100' : 'opacity-0'
                }`}
              />
              <Icon name={item.icon} size={20} />
              {item.label}
              {active && <Icon name="chevron-right" size={15} className="ml-auto opacity-60" />}
            </button>
          );
        })}
      </nav>

      <div className="relative m-4 mb-6">
        <div className="rounded-3xl border border-white/8 bg-white/4 p-4">
          <div className="flex items-center gap-3">
            <Avatar avatarId={state.avatar} name={state.playerName} size={42} ring />
            <div className="min-w-0">
              <p className="truncate text-[13.5px] font-extrabold text-cream-50">{state.playerName}</p>
              <p className="text-[11px] font-semibold text-gold-300/90">Уровень {lvl.level}</p>
            </div>
            <div className="ml-auto flex items-center gap-1.5 rounded-xl bg-gold-400/12 px-2.5 py-1.5">
              <Icon name="flame" size={14} />
              <span className="text-xs font-extrabold text-gold-300 tabular">{state.streak}</span>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <ProgressRing value={lvl.inLevel / lvl.needed} size={38} stroke={4.5} gold>
              <span className="text-[10px] font-extrabold text-gold-300 tabular">
                {Math.round((lvl.inLevel / lvl.needed) * 100)}%
              </span>
            </ProgressRing>
            <p className="text-[10.5px] leading-snug text-cream-100/45 tabular">
              {lvl.inLevel} / {lvl.needed} XP
              <br />
              до уровня {lvl.level + 1}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
