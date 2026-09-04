import { useState } from 'react';
import { useGame } from '../state/GameContext';
import { levelFromXp } from '../data/levels';
import { ACHIEVEMENTS } from '../data/achievements';
import { AVATARS } from '../data/avatars';
import { Icon } from '../components/icons';
import { ArabesqueDivider, StarLatticePattern } from '../components/decor';
import { Avatar, Bar, Button, Card, ProgressRing, SectionTitle, Sheet } from '../components/ui';
import { fmtMoney } from '../utils';

export function ProfileScreen() {
  const { state, dispatch } = useGame();
  const lvl = levelFromXp(state.xp);
  const [editOpen, setEditOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [name, setName] = useState(state.playerName);
  const [avatar, setAvatar] = useState(state.avatar);
  const [confirmReset, setConfirmReset] = useState(false);

  const unlocked = ACHIEVEMENTS.filter((a) => state.achievements[a.id]?.unlocked);

  const statRows = [
    { label: 'Молитв совершено', value: state.totals.prayers, icon: 'prayer' },
    { label: 'Из них вовремя', value: state.totals.prayersOnTime, icon: 'clock' },
    { label: 'Уроков пройдено', value: state.totals.lessons, icon: 'education' },
    { label: 'Страниц Корана', value: state.totals.quranPages, icon: 'quran' },
    { label: 'Добрых дел', value: state.totals.goodDeeds, icon: 'heart' },
    { label: 'Садака всего', value: fmtMoney(state.totals.sadaqah), icon: 'charity' },
    { label: 'Дней завершено', value: state.totals.daysCompleted, icon: 'calendar' },
    { label: 'Решений принято', value: state.totals.choices, icon: 'sparkle' },
  ];

  const saveProfile = () => {
    dispatch({ type: 'SET_PROFILE', name: name.trim() || undefined, avatar });
    setEditOpen(false);
  };

  return (
    <div className="space-y-5 pb-6">
      {/* Шапка профиля */}
      <Card className="relative overflow-hidden p-5">
        <StarLatticePattern className="absolute inset-0" id="prof-pat" opacity={0.045} />
        <div className="relative flex flex-col items-center text-center">
          <div className="animate-scale-in">
            <Avatar avatarId={state.avatar} name={state.playerName} size={96} ring />
          </div>
          <h1 className="mt-3.5 text-[22px] font-extrabold text-cream-50">{state.playerName}</h1>
          <p className="mt-0.5 text-[12px] font-semibold text-gold-300/85">
            Уровень {lvl.level} · {state.streak > 0 ? `серия ${state.streak} дн.` : 'без серии'} · рекорд {state.bestStreak} дн.
          </p>

          <div className="mt-5 flex justify-center">
            <ProgressRing value={lvl.inLevel / lvl.needed} size={128} stroke={10} gold>
              <div className="text-center">
                <p className="text-[30px] font-extrabold leading-none text-cream-50 tabular">{lvl.level}</p>
                <p className="mt-0.5 text-[9.5px] font-bold uppercase tracking-[0.18em] text-cream-100/45">уровень</p>
              </div>
            </ProgressRing>
          </div>
          <p className="mt-3 text-[12px] font-semibold text-cream-100/55 tabular">
            {lvl.inLevel} / {lvl.needed} XP до уровня {lvl.level + 1} · всего {state.xp} XP
          </p>

          <div className="mt-4 flex gap-2.5">
            <Button
              variant="outline"
              icon="edit"
              onClick={() => {
                setName(state.playerName);
                setAvatar(state.avatar);
                setEditOpen(true);
              }}
            >
              Изменить
            </Button>
            <Button variant="ghost" icon="info" onClick={() => setAboutOpen(true)}>
              О модели
            </Button>
          </div>
        </div>
      </Card>

      {/* Показатели */}
      <section>
        <SectionTitle icon="balance" title="Всего по показателям" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {statRows.map((r) => (
            <Card key={r.label} className="p-3.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/6 text-gold-300/90">
                <Icon name={r.icon} size={16} />
              </span>
              <p className="mt-2 text-[18px] font-extrabold leading-none text-cream-50 tabular">{r.value}</p>
              <p className="mt-1 text-[10.5px] font-semibold leading-tight text-cream-100/45">{r.label}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Текущие характеристики */}
      <section>
        <SectionTitle icon="heart" title="Текущие характеристики" />
        <Card className="space-y-3.5 p-4">
          {(
            [
              ['Иман', 'star', state.stats.iman],
              ['Намаз', 'prayer', state.stats.prayer],
              ['Знания', 'education', state.stats.knowledge],
              ['Благие дела', 'charity', state.stats.deeds],
              ['Здоровье', 'health', state.stats.health],
              ['Энергия', 'energy', state.stats.energy],
              ['Настроение', 'heart', state.stats.mood],
              ['Репутация', 'users', state.stats.reputation],
            ] as Array<[string, string, number]>
          ).map(([label, icon, v]) => (
            <div key={label} className="flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/6 text-gold-300/90">
                <Icon name={icon} size={15} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex justify-between text-[12px]">
                  <p className="font-bold text-cream-100/70">{label}</p>
                  <p className="font-extrabold text-cream-50 tabular">{Math.round(v)}</p>
                </div>
                <Bar value={v} className="mt-1.5" gold={v >= 70} />
              </div>
            </div>
          ))}
        </Card>
      </section>

      {/* Достижения мини-сетка */}
      <section>
        <SectionTitle
          icon="achievement"
          title="Коллекция достижений"
          action={
            <p className="text-xs font-bold text-gold-300/90 tabular">
              {unlocked.length}/{ACHIEVEMENTS.length}
            </p>
          }
        />
        <Card className="p-4">
          <div className="grid grid-cols-6 gap-2.5 sm:grid-cols-8">
            {ACHIEVEMENTS.map((a) => {
              const isUnlocked = !!state.achievements[a.id]?.unlocked;
              return (
                <div
                  key={a.id}
                  title={isUnlocked ? a.title : `${a.title} — ${a.condition}`}
                  className={`flex aspect-square items-center justify-center rounded-2xl border ${
                    isUnlocked
                      ? 'border-gold-400/50 bg-gradient-to-b from-gold-400/20 to-gold-600/10 text-gold-300'
                      : 'border-white/6 bg-white/3 text-cream-100/25'
                  }`}
                >
                  <Icon name={isUnlocked ? a.icon : 'lock'} size={19} />
                </div>
              );
            })}
          </div>
        </Card>
      </section>

      {/* История дней */}
      {state.history.length > 0 && (
        <section>
          <SectionTitle icon="calendar" title="История дней" />
          <Card className="divide-y divide-white/6">
            {state.history.slice(0, 7).map((r) => (
              <div key={r.day} className="flex items-center gap-3 px-4 py-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/6 text-[12px] font-extrabold text-gold-300 tabular">
                  {r.day}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[12.5px] font-bold text-cream-50">
                    {r.completed} выполнено · {r.missed} пропущено
                  </p>
                  <p className="text-[10.5px] font-semibold text-cream-100/40">
                    целей: {r.goalsDone}/{r.goalsTotal} · молитв: {r.prayers}
                  </p>
                </div>
                <span className="flex items-center gap-1 rounded-lg bg-gold-400/10 px-2 py-1 text-[10.5px] font-extrabold text-gold-300 tabular">
                  <Icon name="sparkle" size={11} />+{r.xp}
                </span>
                <span className="flex items-center gap-1 rounded-lg bg-emeraldx-500/10 px-2 py-1 text-[10.5px] font-extrabold text-emeraldx-300 tabular">
                  <Icon name="flame" size={11} />
                  {r.streakAfter}
                </span>
              </div>
            ))}
          </Card>
        </section>
      )}

      {/* Настройки */}
      <section>
        <SectionTitle icon="settings" title="Настройки" />
        <Card className="divide-y divide-white/6 p-1.5">
          <button
            onClick={() => {
              setName(state.playerName);
              setAvatar(state.avatar);
              setEditOpen(true);
            }}
            className="press flex w-full items-center gap-3 px-3.5 py-3.5 text-left hover:bg-white/3"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/6 text-cream-100/70">
              <Icon name="edit" size={16} />
            </span>
            <span className="flex-1 text-[13.5px] font-bold text-cream-50">Имя и аватар</span>
            <Icon name="chevron-right" size={15} className="text-cream-100/30" />
          </button>
          <button onClick={() => setAboutOpen(true)} className="press flex w-full items-center gap-3 px-3.5 py-3.5 text-left hover:bg-white/3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/6 text-cream-100/70">
              <Icon name="info" size={16} />
            </span>
            <span className="flex-1 text-[13.5px] font-bold text-cream-50">О игровой модели</span>
            <Icon name="chevron-right" size={15} className="text-cream-100/30" />
          </button>
          <button onClick={() => setConfirmReset(true)} className="press flex w-full items-center gap-3 px-3.5 py-3.5 text-left hover:bg-red-400/5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-400/10 text-red-300/80">
              <Icon name="reset" size={16} />
            </span>
            <span className="flex-1 text-[13.5px] font-bold text-red-200/90">Сбросить прогресс</span>
            <Icon name="chevron-right" size={15} className="text-cream-100/30" />
          </button>
        </Card>
      </section>

      <p className="px-2 text-center text-[10.5px] leading-relaxed text-cream-100/30">
        Симулятор мусульманина — уважительная игра о распорядке дня и самодисциплине.
        <br />
        Показатели не отражают реальную религиозность и не являются оценкой перед Богом.
      </p>

      {/* Редактирование профиля */}
      <Sheet open={editOpen} onClose={() => setEditOpen(false)} maxWidth="max-w-md">
        <div className="px-5 pb-8 pt-6">
          <h3 className="text-[18px] font-extrabold text-cream-50">Имя и аватар</h3>
          <div className="mt-5 flex justify-center">
            <Avatar avatarId={avatar} name={name || state.playerName} size={84} ring />
          </div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
            placeholder="Имя"
            className="mt-5 w-full rounded-2xl border border-white/12 bg-white/5 px-5 py-3.5 text-center text-[15px] font-bold text-cream-50 placeholder:font-medium placeholder:text-cream-100/35 focus:border-gold-400/50 focus:outline-none"
          />
          <div className="mt-5 grid grid-cols-4 gap-3">
            {AVATARS.map((av) => (
              <button
                key={av.id}
                onClick={() => setAvatar(av.id)}
                className={`press flex items-center justify-center rounded-2xl border p-2 transition-colors ${
                  avatar === av.id ? 'border-gold-400/70 bg-gold-400/10' : 'border-white/8 bg-white/3 hover:border-white/20'
                }`}
                aria-label={av.name}
              >
                <Avatar avatarId={av.id} name={name || state.playerName} size={44} />
              </button>
            ))}
          </div>
          <div className="mt-6 pb-safe">
            <Button full onClick={saveProfile}>
              Сохранить
            </Button>
          </div>
        </div>
      </Sheet>

      {/* О модели */}
      <Sheet open={aboutOpen} onClose={() => setAboutOpen(false)} maxWidth="max-w-md">
        <div className="px-6 pb-9 pt-7 text-center">
          <div className="flex justify-center">
            <ArabesqueDivider width={200} />
          </div>
          <h3 className="mt-3 text-[18px] font-extrabold text-cream-50">Об игровой модели</h3>
          <div className="mt-4 space-y-3 text-left">
            <p className="text-[13.5px] leading-relaxed text-cream-100/65">
              Это игра о распорядке дня, привычках и балансе между делами, отдыхом и поклонением. Числовые показатели —
              условные игровые механики.
            </p>
            <p className="text-[13.5px] leading-relaxed text-cream-100/65">
              Никакие очки в игре не измеряют искренность, богобоязненность или положение человека перед Всевышним —
              это ведомо одному Аллаху. Модель создана для мягкой мотивации и самоорганизации.
            </p>
            <p className="text-[13.5px] leading-relaxed text-cream-100/65">
              В вопросах, где существуют разные мнения и школы фикха, даются нейтральные формулировки. Для религиозной
              практики опирайтесь на знания и советы компетентных людей.
            </p>
          </div>
          <div className="mt-5 flex justify-center">
            <ArabesqueDivider width={160} />
          </div>
          <div className="mt-5 pb-safe">
            <Button full onClick={() => setAboutOpen(false)}>
              Понятно
            </Button>
          </div>
        </div>
      </Sheet>

      {/* Подтверждение сброса */}
      <Sheet open={confirmReset} onClose={() => setConfirmReset(false)} maxWidth="max-w-sm">
        <div className="px-6 pb-8 pt-7 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-400/12 text-red-300">
            <Icon name="alert" size={26} />
          </span>
          <h3 className="mt-4 text-[17px] font-extrabold text-cream-50">Сбросить весь прогресс?</h3>
          <p className="mt-2 text-[13px] leading-relaxed text-cream-100/55">
            Уровни, достижения и история дней будут удалены безвозвратно. Придётся создать персонажа заново.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3 pb-safe">
            <Button variant="outline" onClick={() => setConfirmReset(false)}>
              Отмена
            </Button>
            <Button variant="danger" onClick={() => dispatch({ type: 'RESET' })}>
              Сбросить
            </Button>
          </div>
        </div>
      </Sheet>
    </div>
  );
}
