import { useState } from 'react';
import { useGame } from '../state/GameContext';
import { currentEvent, nextEvent } from '../state/game';
import { getPrayerTimes, PRAYER_META } from '../data/prayerTimes';
import { PRAYER_EVENT_BY_KEY } from '../data/events';
import { FREE_ACTIONS } from '../data/events';
import { levelFromXp } from '../data/levels';
import { Icon } from '../components/icons';
import { FloatingParticles, StarLatticePattern } from '../components/decor';
import { Avatar, Bar, Button, Card, SectionTitle } from '../components/ui';
import { BellMenu } from '../components/Notifications';
import { FreeActionSheet } from '../components/EventModal';
import {
  dateFromDay,
  fmtCountdown,
  fmtDateRu,
  fmtMoney,
  fmtTime,
  greetingByClock,
  hijriDate,
} from '../utils';
import type { ScreenId } from '../types';
import type { FreeActionDef } from '../data/events';

const STAT_CARDS: Array<{ key: string; label: string; icon: string }> = [
  { key: 'iman', label: 'Иман', icon: 'star' },
  { key: 'prayer', label: 'Намаз', icon: 'prayer' },
  { key: 'knowledge', label: 'Знания', icon: 'education' },
  { key: 'deeds', label: 'Благие дела', icon: 'charity' },
  { key: 'health', label: 'Здоровье', icon: 'health' },
  { key: 'energy', label: 'Энергия', icon: 'energy' },
  { key: 'mood', label: 'Настроение', icon: 'heart' },
  { key: 'reputation', label: 'Репутация', icon: 'users' },
];

export function Dashboard({
  onNavigate,
  onOpenEvent,
}: {
  onNavigate: (s: ScreenId) => void;
  onOpenEvent: (id: string) => void;
}) {
  const { state, dispatch } = useGame();
  const lvl = levelFromXp(state.xp);
  const date = dateFromDay(state.startedAtISO, state.day);

  const current = currentEvent(state);
  const upcoming = nextEvent(state);
  const heroEvent = current ?? upcoming;

  const prayers = getPrayerTimes(date);
  const donePrayers = new Set(
    state.schedule.filter((e) => e.kind === 'prayer' && e.status === 'done' && (e.result?.effects.prayer ?? 0) > 0).map((e) => e.prayerKey),
  );
  const missedPrayers = new Set(state.schedule.filter((e) => e.kind === 'prayer' && e.status === 'missed').map((e) => e.prayerKey));

  const [freeAction, setFreeAction] = useState<FreeActionDef | null>(null);
  const quickIds = ['f.quran', 'f.sadaqah', 'f.walk', 'f.rest', 'f.work'];
  const quickActions = quickIds.map((id) => FREE_ACTIONS.find((f) => f.id === id)!).filter(Boolean);

  const dayProgress = Math.max(0, Math.min(1, (state.clock - 4 * 60) / (23.5 * 60 - 4 * 60)));

  return (
    <div className="space-y-5 pb-6">
      {/* ——— Шапка ——— */}
      <header className="relative overflow-hidden rounded-4xl border border-white/8 bg-gradient-to-br from-forest-800/60 via-night-800/70 to-night-900/80 p-5">
        <StarLatticePattern className="absolute inset-0" id="dash-pat" opacity={0.05} />
        <FloatingParticles count={6} />
        <div className="relative flex items-center gap-3.5">
          <button onClick={() => onNavigate('profile')} className="press">
            <Avatar avatarId={state.avatar} name={state.playerName} size={52} ring />
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-semibold text-gold-300/85">{greetingByClock(state.clock)}!</p>
            <h1 className="truncate text-[19px] font-extrabold leading-tight text-cream-50">{state.playerName}</h1>
            <p className="mt-0.5 text-[11px] text-cream-100/50">
              {fmtDateRu(date)} · <span className="tabular">{fmtTime(state.clock)}</span>
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <BellMenu />
            <div className="flex items-center gap-1.5">
              <span className="flex items-center gap-1 rounded-lg bg-gold-400/12 px-2 py-1 text-[11px] font-extrabold text-gold-300 tabular">
                <Icon name="levelup" size={13} /> ур. {lvl.level}
              </span>
              <span className="flex items-center gap-1 rounded-lg bg-emeraldx-500/12 px-2 py-1 text-[11px] font-extrabold text-emeraldx-300 tabular">
                <Icon name="flame" size={13} /> {state.streak}
              </span>
            </div>
          </div>
        </div>
        <p className="relative mt-3 text-[10.5px] text-cream-100/35">
          {hijriDate(date)} <span className="mx-1">·</span> день {state.day}
        </p>
      </header>

      {/* ——— Сегодня: ближайшее событие ——— */}
      {heroEvent && (
        <section className="cream-card relative overflow-hidden rounded-4xl p-5 shadow-card animate-slide-up">
          <svg viewBox="0 0 72 72" className="pointer-events-none absolute -right-8 -top-8 h-44 w-44 opacity-[0.07]" aria-hidden="true">
            <g fill="none" stroke="#0b251c" strokeWidth="1.4">
              <rect x="16" y="16" width="40" height="40" rx="4" />
              <rect x="16" y="16" width="40" height="40" rx="4" transform="rotate(45 36 36)" />
              <circle cx="36" cy="36" r="6" />
            </g>
          </svg>
          <div className="relative">
            <div className="flex items-center justify-between">
              <p className="text-[10.5px] font-extrabold uppercase tracking-[0.24em] text-emerald-900/60">
                {current
                  ? 'Сейчас'
                  : heroEvent.kind === 'prayer'
                    ? 'Следующая молитва'
                    : 'Следующее событие'}
              </p>
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-900/8 px-2.5 py-1 text-[10.5px] font-bold text-emerald-900/70">
                <Icon name="calendar" size={12} accent={false} /> {heroEvent.kind === 'prayer' ? 'молитва' : 'событие'}
              </span>
            </div>

            <div className="mt-3 flex items-end justify-between gap-3">
              <div>
                <h2 className="text-[30px] font-extrabold leading-none text-ink-900">{heroEvent.title}</h2>
                {heroEvent.kind === 'prayer' && heroEvent.prayerKey && (
                  <p className="arabic mt-1 text-[15px] leading-snug text-emerald-900/50" dir="rtl">
                    {PRAYER_META[heroEvent.prayerKey].arabic}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-[26px] font-extrabold leading-none text-ink-900 tabular">{fmtTime(heroEvent.time)}</p>
                {!current && (
                  <p className="mt-1 text-[12px] font-bold text-emerald-900/60 tabular">
                    осталось {fmtCountdown(heroEvent.time - state.clock)}
                  </p>
                )}
                {current && (
                  <p className="mt-1 text-[12px] font-bold text-emerald-900/60">пора действовать</p>
                )}
              </div>
            </div>

            {/* Прогресс дня */}
            <div className="mt-4">
              <div className="h-2 w-full overflow-hidden rounded-full bg-emerald-900/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-700 via-emerald-600 to-gold-500 transition-all duration-1000"
                  style={{ width: `${dayProgress * 100}%` }}
                />
              </div>
              <div className="mt-1.5 flex justify-between text-[10px] font-bold text-emerald-900/45">
                <span className="tabular">04:00</span>
                <span>день пройден на {Math.round(dayProgress * 100)}%</span>
                <span className="tabular">23:30</span>
              </div>
            </div>

            <div className="mt-4 flex gap-2.5">
              {current && (
                <Button full onClick={() => onOpenEvent(current.id)}>
                  Перейти к событию
                  <Icon name="arrow-right" size={16} accent={false} />
                </Button>
              )}
              {!current && upcoming && (
                <Button
                  full
                  variant="outline"
                  className="!border-emerald-900/15 !bg-emerald-900/5 !text-emerald-900/80 hover:!bg-emerald-900/10"
                  onClick={() => dispatch({ type: 'SKIP_TO_EVENT' })}
                >
                  <Icon name="clock" size={16} accent={false} />
                  Дождаться «{upcoming.title}»
                </Button>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ——— Молитвы дня ——— */}
      <section>
        <SectionTitle icon="prayer" title="Молитвы дня" />
        <div className="grid grid-cols-5 gap-2">
          {prayers.map((p) => {
            const done = donePrayers.has(p.key);
            const missed = missedPrayers.has(p.key);
            const evId = PRAYER_EVENT_BY_KEY[p.key];
            const ev = state.schedule.find((e) => e.defId === evId);
            return (
              <button
                key={p.key}
                onClick={() => {
                  if (ev && ev.status === 'pending' && ev.time <= state.clock) onOpenEvent(ev.id);
                  else onNavigate('day');
                }}
                className={`press flex flex-col items-center gap-1.5 rounded-2xl border p-2.5 transition-colors ${
                  done
                    ? 'border-emeraldx-500/35 bg-emeraldx-500/10'
                    : missed
                      ? 'border-red-400/20 bg-red-400/5 opacity-60'
                      : 'border-white/8 bg-white/4 hover:border-gold-400/30'
                }`}
              >
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full ${
                    done ? 'bg-emeraldx-500/25 text-emeraldx-300' : missed ? 'text-red-300/70' : 'bg-white/6 text-cream-100/50'
                  }`}
                >
                  <Icon name={done ? 'check' : missed ? 'close' : 'clock'} size={12} strokeWidth={2.4} />
                </span>
                <span className={`text-[11px] font-extrabold ${done ? 'text-emeraldx-300' : 'text-cream-100/70'}`}>{p.name}</span>
                <span className="text-[9.5px] font-bold text-cream-100/40 tabular">{fmtTime(p.minutes)}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ——— Цели дня ——— */}
      <section>
        <SectionTitle
          icon="target"
          title="Цели дня"
          action={
            <button onClick={() => onNavigate('day')} className="press text-xs font-bold text-gold-300/90 hover:text-gold-300">
              Все события
            </button>
          }
        />
        <Card className="divide-y divide-white/6 p-1.5">
          {state.goals.map((g) => {
            const val = Math.min(state.counters[g.counter], g.target);
            const done = val >= g.target;
            return (
              <div key={g.id} className="flex items-center gap-3 px-3 py-3">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                    done ? 'bg-emeraldx-500/18 text-emeraldx-300' : 'bg-white/6 text-cream-100/55'
                  }`}
                >
                  <Icon name={done ? 'check' : g.icon} size={17} strokeWidth={done ? 2.4 : 1.7} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className={`truncate text-[13px] font-bold ${done ? 'text-cream-100/55 line-through' : 'text-cream-50'}`}>
                      {g.title}
                    </p>
                    <p className="shrink-0 text-[11px] font-bold text-cream-100/45 tabular">
                      {val}/{g.target}
                    </p>
                  </div>
                  <Bar value={val} max={g.target} gold={done} className="mt-1.5" />
                </div>
                <span className={`shrink-0 rounded-lg px-2 py-1 text-[10px] font-extrabold ${done ? 'bg-gold-400/15 text-gold-300' : 'bg-white/6 text-cream-100/45'}`}>
                  +{g.xp}
                </span>
              </div>
            );
          })}
        </Card>
      </section>

      {/* ——— Быстрые действия ——— */}
      <section>
        <SectionTitle icon="sparkle" title="Быстрые действия" />
        <div className="scrollbar-thin -mx-1 flex gap-2.5 overflow-x-auto px-1 pb-1">
          {quickActions.map((fa) => (
            <button
              key={fa.id}
              onClick={() => setFreeAction(fa)}
              className="press flex w-[104px] shrink-0 flex-col items-center gap-2 rounded-2xl border border-white/8 bg-white/4 p-3 hover:border-gold-400/35"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-400/12 text-gold-300">
                <Icon name={fa.icon} size={20} />
              </span>
              <span className="text-center text-[11px] font-extrabold leading-tight text-cream-100/80">{fa.title}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ——— Характеристики ——— */}
      <section>
        <SectionTitle
          icon="balance"
          title="Характеристики"
          action={
            <button onClick={() => onNavigate('profile')} className="press text-xs font-bold text-gold-300/90 hover:text-gold-300">
              Профиль
            </button>
          }
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
          <Card className="col-span-2 flex items-center gap-3.5 p-4 sm:col-span-3 xl:col-span-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gold-400/12 text-gold-300">
              <Icon name="money" size={22} />
            </span>
            <div className="flex-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-cream-100/45">Финансы</p>
              <p className="text-[20px] font-extrabold text-cream-50 tabular">{fmtMoney(state.money)}</p>
            </div>
            <div className="hidden gap-2 sm:flex">
              <span className="rounded-xl bg-white/5 px-3 py-2 text-center">
                <span className="block text-[15px] font-extrabold text-cream-50 tabular">{state.counters.goodDeeds}</span>
                <span className="text-[9.5px] font-bold text-cream-100/40">добрых дел</span>
              </span>
              <span className="rounded-xl bg-white/5 px-3 py-2 text-center">
                <span className="block text-[15px] font-extrabold text-cream-50 tabular">{state.totals.quranPages}</span>
                <span className="text-[9.5px] font-bold text-cream-100/40">страниц</span>
              </span>
            </div>
          </Card>
          {STAT_CARDS.map((sc) => {
            const v = state.stats[sc.key as keyof typeof state.stats];
            return (
              <Card key={sc.key} className="p-4">
                <div className="flex items-center justify-between">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/6 text-gold-300/90">
                    <Icon name={sc.icon} size={18} />
                  </span>
                  <span className="text-[17px] font-extrabold text-cream-50 tabular">{Math.round(v)}</span>
                </div>
                <p className="mt-2.5 text-[11.5px] font-bold text-cream-100/55">{sc.label}</p>
                <Bar value={v} className="mt-2" gold={v >= 70} />
              </Card>
            );
          })}
        </div>
      </section>

      {/* ——— Текущее событие, если не открыто ——— */}
      {current && (
        <Card className="animate-slide-up border-gold-400/25 p-4">
          <div className="flex items-center gap-3.5">
            <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gold-400/15 text-gold-300 animate-pulse-ring">
              <Icon name={current.icon} size={21} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-300/70">Событие ждёт решения</p>
              <p className="truncate text-[14px] font-extrabold text-cream-50">{current.title}</p>
            </div>
            <Button variant="outline" onClick={() => onOpenEvent(current.id)}>
              Открыть
            </Button>
          </div>
        </Card>
      )}

      <FreeActionSheet action={freeAction} open={!!freeAction} onClose={() => setFreeAction(null)} />
    </div>
  );
}
