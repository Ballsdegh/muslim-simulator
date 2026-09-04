import { useState } from 'react';
import { useGame } from '../state/GameContext';
import type { DayEvent, EventOption } from '../types';
import type { FreeActionDef } from '../data/events';
import { Icon } from './icons';
import { ArabesqueDivider, StatBadge } from './decor';
import { Button, Sheet } from './ui';

export const KIND_LABELS: Record<string, string> = {
  wake: 'Утро',
  prayer: 'Молитва',
  meal: 'Приём пищи',
  work: 'Дела',
  sleep: 'Конец дня',
  random: 'Событие',
};

/** Список эффектов в виде чипов. */
export function EffectChips({ effects, compact }: { effects: Record<string, number | undefined>; compact?: boolean }) {
  const order = ['xp', 'iman', 'prayer', 'knowledge', 'deeds', 'health', 'energy', 'mood', 'reputation', 'money', 'pages', 'charity', 'time'];
  const items = order
    .filter((k) => typeof effects[k] === 'number' && effects[k] !== 0)
    .map((k) => ({ k, v: effects[k] as number }));
  if (!items.length) return null;
  return (
    <div className={`flex flex-wrap ${compact ? 'gap-1.5' : 'gap-2'}`}>
      {items.map(({ k, v }) => (
        <StatBadge key={k} stat={k} value={v} />
      ))}
    </div>
  );
}

interface SheetShellProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

/** Модалка события дня: описание → варианты → результат. */
export function EventSheet({ event, open, onClose }: { event: DayEvent | null; open: boolean; onClose: () => void }) {
  const { state, dispatch } = useGame();
  const [chosen, setChosen] = useState<{ id: string; idx: number } | null>(null);

  if (!event) return null;

  const option: EventOption | null =
    chosen && chosen.id === event.id ? event.options?.[chosen.idx] ?? null : null;

  const choose = (i: number) => {
    setChosen({ id: event.id, idx: i });
    dispatch({ type: 'CHOOSE', eventId: event.id, optionIndex: i });
  };

  const isPrayer = event.kind === 'prayer';

  return (
    <Sheet open={open} onClose={onClose}>
      <div className="px-5 pb-8 pt-5 sm:pt-7">
        {/* Шапка */}
        <div className="flex items-start gap-3.5">
          <span
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${
              isPrayer ? 'border-gold-400/35 bg-gold-400/12 text-gold-300' : 'border-white/10 bg-white/6 text-emeraldx-300'
            }`}
          >
            <Icon name={event.icon} size={24} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[10.5px] font-bold uppercase tracking-[0.22em] text-gold-300/75">{KIND_LABELS[event.kind]}</p>
            <h3 className="mt-0.5 text-[19px] font-extrabold leading-tight text-cream-50">{event.title}</h3>
          </div>
          {!option && (
            <button
              onClick={onClose}
              className="press rounded-xl p-2 text-cream-100/45 hover:bg-white/6 hover:text-cream-50"
              aria-label="Закрыть"
            >
              <Icon name="close" size={16} accent={false} />
            </button>
          )}
        </div>

        {!option ? (
          <>
            <p className="mt-4 text-[14px] leading-relaxed text-cream-100/70">{event.description}</p>
            <div className="mt-5 space-y-2.5">
              {event.options?.map((opt, i) => {
                const cantPay = opt.effects.money !== undefined && state.money + opt.effects.money < 0;
                const energyCost = Math.max(0, -(opt.effects.energy ?? 0));
                const noEnergy = energyCost > state.stats.energy + 5;
                const disabled = cantPay || noEnergy;
                return (
                  <button
                    key={i}
                    disabled={disabled}
                    onClick={() => choose(i)}
                    className={`press group flex w-full items-center gap-3.5 rounded-2xl border p-4 text-left transition-colors ${
                      disabled
                        ? 'cursor-not-allowed border-white/6 bg-white/2 opacity-50'
                        : opt.tone === 'negative'
                          ? 'border-white/10 bg-white/4 hover:border-red-300/30 hover:bg-red-400/8'
                          : opt.tone === 'positive'
                            ? 'border-white/10 bg-white/4 hover:border-emeraldx-500/40 hover:bg-emeraldx-500/8'
                            : 'border-white/10 bg-white/4 hover:border-gold-400/40 hover:bg-gold-400/8'
                    }`}
                  >
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                        opt.tone === 'negative'
                          ? 'bg-red-400/10 text-red-200/80'
                          : opt.tone === 'positive'
                            ? 'bg-emeraldx-500/12 text-emeraldx-300'
                            : 'bg-gold-400/12 text-gold-300'
                      }`}
                    >
                      <Icon name={opt.icon ?? 'sparkle'} size={19} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[14.5px] font-extrabold leading-snug text-cream-50">{opt.label}</span>
                      <span className="mt-0.5 block text-[12px] leading-snug text-cream-100/50">
                        {cantPay ? 'Не хватает денег' : noEnergy ? 'Слишком мало энергии' : opt.hint ?? ''}
                      </span>
                    </span>
                    <Icon name="chevron-right" size={16} className="shrink-0 text-cream-100/30 transition-colors group-hover:text-gold-300" />
                  </button>
                );
              })}
            </div>
            {isPrayer && (
              <p className="mt-4 text-center text-[10.5px] leading-relaxed text-cream-100/35">
                Показатели — игровая модель, а не оценка перед Богом
              </p>
            )}
          </>
        ) : (
          /* Результат */
          <div className="animate-slide-up">
            <div className="mt-5 flex flex-col items-center text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full border border-emeraldx-500/35 bg-emeraldx-500/12 text-emeraldx-300">
                <Icon name="check" size={28} strokeWidth={2.2} />
              </span>
              <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.2em] text-cream-100/45">{option.label}</p>
              <p className="mt-2 max-w-md text-[14.5px] font-semibold leading-relaxed text-cream-50">{option.result}</p>
            </div>
            <div className="my-5 flex justify-center">
              <ArabesqueDivider width={200} />
            </div>
            <div className="flex justify-center">
              <EffectChips effects={option.effects as Record<string, number | undefined>} />
            </div>
            <div className="mt-6 pb-safe">
              <Button full onClick={onClose}>
                Продолжить день
              </Button>
            </div>
          </div>
        )}
      </div>
    </Sheet>
  );
}

/** Подтверждение быстрого действия. */
export function FreeActionSheet({
  action,
  open,
  onClose,
}: {
  action: FreeActionDef | null;
  open: boolean;
  onClose: () => void;
}) {
  const { state, dispatch } = useGame();
  const [doneFor, setDoneFor] = useState<string | null>(null);

  if (!action) return null;
  const done = doneFor === action.id;

  const cantPay = action.effects.money !== undefined && state.money + action.effects.money < 0;

  return (
    <Sheet open={open} onClose={onClose} maxWidth="max-w-md">
      <div className="px-5 pb-8 pt-6 sm:pt-7">
        <div className="flex items-center gap-3.5">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gold-400/30 bg-gold-400/12 text-gold-300">
            <Icon name={action.icon} size={24} />
          </span>
          <div>
            <p className="text-[10.5px] font-bold uppercase tracking-[0.22em] text-gold-300/75">Свободное время</p>
            <h3 className="mt-0.5 text-[18px] font-extrabold text-cream-50">{action.title}</h3>
          </div>
        </div>

        {!done ? (
          <>
            <p className="mt-4 text-[13.5px] leading-relaxed text-cream-100/65">{action.hint}. Займёт около {action.effects.time ?? 15} мин игрового времени.</p>
            <div className="mt-4">
              <EffectChips effects={action.effects as Record<string, number | undefined>} compact />
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 pb-safe">
              <Button variant="outline" onClick={onClose}>
                Отмена
              </Button>
              <Button
                disabled={cantPay}
                onClick={() => {
                  dispatch({ type: 'FREE_ACTION', actionId: action.id });
                  setDoneFor(action.id);
                }}
              >
                Приступить
              </Button>
            </div>
          </>
        ) : (
          <div className="animate-slide-up py-2 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-emeraldx-500/35 bg-emeraldx-500/12 text-emeraldx-300">
              <Icon name="check" size={24} strokeWidth={2.2} />
            </span>
            <p className="mt-3 text-[14px] font-semibold leading-relaxed text-cream-50">{action.result}</p>
            <div className="mt-5 pb-safe">
              <Button full onClick={onClose}>
                Хорошо
              </Button>
            </div>
          </div>
        )}
      </div>
    </Sheet>
  );
}
