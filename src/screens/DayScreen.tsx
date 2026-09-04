import { useState } from 'react';
import { useGame } from '../state/GameContext';
import { currentEvent, nextEvent } from '../state/game';
import { FREE_ACTIONS } from '../data/events';
import { Icon } from '../components/icons';
import { StatBadge } from '../components/decor';
import { Bar, Button, Card, SectionTitle } from '../components/ui';
import { EventSheet, FreeActionSheet } from '../components/EventModal';
import { fmtTime } from '../utils';
import type { DayEvent } from '../types';
import type { FreeActionDef } from '../data/events';

const STATUS_STYLE: Record<string, { dot: string; text: string }> = {
  pending: { dot: 'bg-white/15 text-cream-100/60', text: 'text-cream-100/75' },
  done: { dot: 'bg-emeraldx-500/25 text-emeraldx-300', text: 'text-cream-100/55' },
  missed: { dot: 'bg-red-400/15 text-red-300/70', text: 'text-cream-100/35' },
};

function TimelineItem({
  ev,
  isCurrent,
  clock,
  onOpen,
}: {
  ev: DayEvent;
  isCurrent: boolean;
  clock: number;
  onOpen: (id: string) => void;
}) {
  const st = STATUS_STYLE[isCurrent ? 'pending' : ev.status];
  const isNow = isCurrent;
  return (
    <div className="relative flex gap-3.5 pb-3">
      {/* Время */}
      <div className="w-[46px] shrink-0 pt-3 text-right">
        <p className={`text-[12px] font-extrabold tabular ${isNow ? 'text-gold-300' : 'text-cream-100/45'}`}>
          {fmtTime(ev.time)}
        </p>
      </div>

      {/* Линия и точка */}
      <div className="relative flex w-4 shrink-0 justify-center">
        <span className="absolute top-0 h-full w-px bg-white/8" />
        <span
          className={`relative z-10 mt-3 flex h-6 w-6 items-center justify-center rounded-full border ${
            isNow
              ? 'animate-pulse-ring border-gold-400/70 bg-gold-400/25 text-gold-300'
              : ev.status === 'done'
                ? 'border-emeraldx-500/50 bg-emeraldx-500/20 text-emeraldx-300'
                : ev.status === 'missed'
                  ? 'border-red-400/30 bg-red-400/10 text-red-300/60'
                  : st.dot + ' border-white/10'
          }`}
        >
          <Icon
            name={ev.status === 'done' ? 'check' : ev.status === 'missed' ? 'close' : ev.icon}
            size={11}
            strokeWidth={2.4}
          />
        </span>
      </div>

      {/* Карточка */}
      <button
        onClick={() => {
          if (ev.status === 'pending' && ev.time <= clock) onOpen(ev.id);
        }}
        disabled={!(ev.status === 'pending' && ev.time <= clock)}
        className={`press min-w-0 flex-1 rounded-2xl border p-3.5 text-left transition-all ${
          isNow
            ? 'border-gold-400/40 bg-gradient-to-br from-gold-400/12 to-white/3 shadow-glow'
            : ev.status === 'done'
              ? 'border-white/6 bg-white/3'
              : ev.status === 'missed'
                ? 'border-white/5 bg-white/2 opacity-55'
                : 'border-white/8 bg-white/3 hover:border-white/16'
        } ${ev.status === 'pending' && ev.time > clock ? 'cursor-default' : ''} ${ev.status === 'missed' ? 'cursor-default' : ''}`}
      >
        <div className="flex items-center gap-2">
          {ev.kind === 'random' && (
            <span className="flex items-center gap-1 rounded-full bg-gold-400/12 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-gold-300">
              <Icon name="sparkle" size={10} /> событие
            </span>
          )}
          {ev.kind === 'prayer' && (
            <span className="rounded-full bg-emerald-900/25 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-emeraldx-300/90">
              молитва
            </span>
          )}
          {isNow && (
            <span className="rounded-full bg-gold-400 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-ink-900">
              сейчас
            </span>
          )}
          {ev.status === 'missed' && (
            <span className="rounded-full bg-red-400/12 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-red-300/80">
              пропущено
            </span>
          )}
        </div>
        <p className={`mt-1.5 text-[14.5px] font-extrabold leading-snug ${isNow ? 'text-gold-200' : st.text}`}>
          {ev.title}
        </p>
        {ev.status === 'done' && ev.result && (
          <p className="mt-1 line-clamp-2 text-[12px] leading-snug text-cream-100/45">{ev.result.text}</p>
        )}
        {ev.status === 'pending' && ev.time > clock && (
          <p className="mt-1 text-[11.5px] font-semibold text-cream-100/35">
            через {Math.max(1, Math.round(ev.time - clock))} мин · придёт время — откроется
          </p>
        )}
        {isNow && (
          <p className="mt-1.5 flex items-center gap-1 text-[12px] font-bold text-gold-300">
            Нажмите, чтобы решить <Icon name="arrow-right" size={13} />
          </p>
        )}
      </button>
    </div>
  );
}

export function DayScreen({ onOpenEvent }: { onOpenEvent: (id: string) => void }) {
  const { state, dispatch } = useGame();
  const [freeAction, setFreeAction] = useState<FreeActionDef | null>(null);

  const current = currentEvent(state);
  const upcoming = nextEvent(state);
  const doneCount = state.schedule.filter((e) => e.status === 'done').length;
  const missedCount = state.schedule.filter((e) => e.status === 'missed').length;
  const total = state.schedule.length;

  // Группируем по половинам дня
  const morning = state.schedule.filter((e) => e.time < 12 * 60);
  const afternoon = state.schedule.filter((e) => e.time >= 12 * 60);

  const mood = state.stats.mood;

  return (
    <div className="space-y-5 pb-6">
      {/* Заголовок дня */}
      <Card className="p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10.5px] font-extrabold uppercase tracking-[0.24em] text-gold-300/75">Распорядок</p>
            <h1 className="mt-0.5 text-[21px] font-extrabold text-cream-50">День {state.day}</h1>
          </div>
          <div className="text-right">
            <p className="text-[22px] font-extrabold leading-none text-cream-50 tabular">{fmtTime(state.clock)}</p>
            <p className="mt-1 text-[11px] font-semibold text-cream-100/45">
              {doneCount} выполнено · {missedCount} пропущено
            </p>
          </div>
        </div>
        <Bar value={doneCount} max={total} className="mt-4" gold />
        <div className="mt-3 flex items-center gap-2">
          <Button
            variant="outline"
            className="flex-1"
            disabled={!upcoming || !!current}
            onClick={() => dispatch({ type: 'SKIP_TO_EVENT' })}
          >
            <Icon name="clock" size={16} accent={false} />
            {upcoming && !current ? `Дождаться «${upcoming.title}»` : 'Всё по времени'}
          </Button>
        </div>
        {mood < 30 && (
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-amber-400/20 bg-amber-400/8 px-3.5 py-2.5">
            <Icon name="heart" size={15} />
            <p className="text-[11.5px] font-semibold leading-snug text-amber-200/85">
              Настроение на низком уровне. Позвоните близким, отдохните или встретьтесь с друзьями.
            </p>
          </div>
        )}
      </Card>

      {/* Свободное время */}
      {!current && (
        <section>
          <SectionTitle icon="sparkle" title="Свободное время" />
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {FREE_ACTIONS.map((fa) => {
              const cantPay = fa.effects.money !== undefined && state.money + fa.effects.money < 0;
              return (
                <button
                  key={fa.id}
                  disabled={cantPay}
                  onClick={() => setFreeAction(fa)}
                  className={`press rounded-2xl border p-3 text-left transition-colors ${
                    cantPay
                      ? 'cursor-not-allowed border-white/5 bg-white/2 opacity-45'
                      : 'border-white/8 bg-white/4 hover:border-gold-400/35'
                  }`}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-400/12 text-gold-300">
                    <Icon name={fa.icon} size={18} />
                  </span>
                  <p className="mt-2 text-[12.5px] font-extrabold leading-tight text-cream-50">{fa.title}</p>
                  <p className="mt-0.5 text-[10.5px] font-semibold text-cream-100/40">
                    {cantPay ? 'Не хватает денег' : fa.hint}
                  </p>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Таймлайн */}
      <section>
        <SectionTitle icon="calendar" title="Утро и день" />
        <Card className="p-4">
          {morning.map((ev) => (
            <TimelineItem key={ev.id} ev={ev} isCurrent={current?.id === ev.id} clock={state.clock} onOpen={onOpenEvent} />
          ))}
        </Card>
      </section>

      <section>
        <SectionTitle icon="moon" title="Вечер и ночь" />
        <Card className="p-4">
          {afternoon.map((ev) => (
            <TimelineItem key={ev.id} ev={ev} isCurrent={current?.id === ev.id} clock={state.clock} onOpen={onOpenEvent} />
          ))}
        </Card>
      </section>

      {/* Итоги выбора */}
      {state.schedule.some((e) => e.status === 'done' && e.result) && (
        <section>
          <SectionTitle icon="book" title="Хроника решений" />
          <div className="space-y-2.5">
            {state.schedule
              .filter((e) => e.status === 'done' && e.result)
              .slice(-4)
              .reverse()
              .map((ev) => (
                <Card key={ev.id} className="animate-slide-up p-4">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emeraldx-500/12 text-emeraldx-300">
                      <Icon name="check" size={14} strokeWidth={2.4} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-extrabold text-cream-50">
                        {ev.title} — {ev.result!.label}
                      </p>
                      <p className="text-[10.5px] font-bold text-cream-100/35 tabular">{fmtTime(ev.time)}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-cream-100/60">{ev.result!.text}</p>
                  <div className="mt-2.5">
                    <div className="flex flex-wrap gap-1.5">
                      {(Object.entries(ev.result!.effects) as Array<[string, number]>)
                        .filter(([k, v]) => ['iman', 'prayer', 'knowledge', 'deeds', 'health', 'energy', 'mood', 'reputation', 'money', 'xp'].includes(k) && v !== 0)
                        .slice(0, 4)
                        .map(([k, v]) => (
                          <StatBadge key={k} stat={k} value={v} />
                        ))}
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </section>
      )}

      <FreeActionSheet action={freeAction} open={!!freeAction} onClose={() => setFreeAction(null)} />
    </div>
  );
}
