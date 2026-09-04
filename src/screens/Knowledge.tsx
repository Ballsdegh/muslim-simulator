import { useState } from 'react';
import { useGame } from '../state/GameContext';
import { CATEGORIES, LESSONS } from '../data/knowledge';
import type { Lesson } from '../types';
import { Icon } from '../components/icons';
import { ArabesqueDivider } from '../components/decor';
import { Bar, Button, Card, Chip, SectionTitle, Sheet } from '../components/ui';

function LessonCard({ lesson, done, score, onClick }: { lesson: Lesson; done: boolean; score?: number; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`press flex w-full items-start gap-3.5 rounded-3xl border p-4 text-left transition-colors ${
        done ? 'border-emeraldx-500/25 bg-emeraldx-500/6' : 'border-white/8 bg-white/4 hover:border-gold-400/35'
      }`}
    >
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
          done ? 'bg-emeraldx-500/18 text-emeraldx-300' : 'bg-gold-400/12 text-gold-300'
        }`}
      >
        <Icon name={done ? 'check' : 'quran'} size={20} strokeWidth={done ? 2.4 : 1.7} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[14.5px] font-extrabold leading-snug text-cream-50">{lesson.title}</p>
        <p className="mt-1 line-clamp-2 text-[12px] leading-snug text-cream-100/50">{lesson.intro[0]}</p>
        <div className="mt-2 flex items-center gap-2">
          <span className="rounded-lg bg-white/6 px-2 py-0.5 text-[10px] font-bold text-cream-100/50">{lesson.duration}</span>
          <span className="rounded-lg bg-gold-400/12 px-2 py-0.5 text-[10px] font-extrabold text-gold-300">+{lesson.xp} XP</span>
          {done && score !== undefined && (
            <span className="rounded-lg bg-emeraldx-500/15 px-2 py-0.5 text-[10px] font-extrabold text-emeraldx-300">
              тест {score}/{lesson.quiz.length}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

function LessonSheet({ lesson, open, onClose }: { lesson: Lesson | null; open: boolean; onClose: () => void }) {
  const { state, dispatch } = useGame();
  type Session = { id: string; stage: 'read' | 'quiz' | 'result'; qIndex: number; answers: number[]; picked: number | null };
  const [session, setSession] = useState<Session | null>(null);

  if (!lesson) return null;

  const active: Session =
    session && session.id === lesson.id
      ? session
      : { id: lesson.id, stage: 'read', qIndex: 0, answers: [], picked: null };

  const progress = state.lessonProgress[lesson.id];
  const alreadyDone = !!progress?.done;

  const close = () => {
    onClose();
    setTimeout(() => setSession(null), 300);
  };

  const q = lesson.quiz[active.qIndex];

  const pick = (i: number) => {
    if (active.picked !== null) return;
    setSession({ ...active, picked: i });
    setTimeout(() => {
      const nextAnswers = [...active.answers, i];
      if (active.qIndex + 1 < lesson.quiz.length) {
        setSession({ ...active, picked: null, answers: nextAnswers, qIndex: active.qIndex + 1 });
      } else {
        setSession({ ...active, picked: i, answers: nextAnswers, stage: 'result' });
        if (!alreadyDone) {
          dispatch({
            type: 'COMPLETE_LESSON',
            lessonId: lesson.id,
            score: nextAnswers.filter((a, idx) => a === lesson.quiz[idx].answer).length,
          });
        }
      }
    }, 550);
  };

  const { stage, qIndex, answers, picked } = active;
  const correctCount = answers.filter((a, idx) => a === lesson.quiz[idx].answer).length;

  return (
    <Sheet open={open} onClose={close} maxWidth="max-w-xl">
      <div className="px-5 pb-9 pt-5 sm:pt-7">
        {/* Шапка урока */}
        <div className="flex items-start gap-3.5">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-gold-400/30 bg-gold-400/12 text-gold-300">
            <Icon name="quran" size={24} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[10.5px] font-bold uppercase tracking-[0.22em] text-gold-300/75">
              {CATEGORIES.find((c) => c.id === lesson.category)?.title} · {lesson.duration}
            </p>
            <h3 className="mt-0.5 text-[19px] font-extrabold leading-tight text-cream-50">{lesson.title}</h3>
          </div>
          <button onClick={close} className="press rounded-xl p-2 text-cream-100/45 hover:bg-white/6 hover:text-cream-50" aria-label="Закрыть">
            <Icon name="close" size={16} accent={false} />
          </button>
        </div>

        {stage === 'read' && (
          <div className="animate-slide-up">
            <div className="mt-4 space-y-3">
              {lesson.intro.map((p, i) => (
                <p key={i} className="text-[14px] leading-relaxed text-cream-100/75">
                  {p}
                </p>
              ))}
            </div>

            <div className="mt-5">
              <p className="text-[10.5px] font-extrabold uppercase tracking-[0.22em] text-gold-300/70">Стоит запомнить</p>
              <ul className="mt-2.5 space-y-2">
                {lesson.facts.map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 rounded-2xl border border-white/7 bg-white/3 p-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-400/15 text-[10px] font-extrabold text-gold-300">
                      {i + 1}
                    </span>
                    <span className="text-[13px] leading-relaxed text-cream-100/70">{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="my-5 flex justify-center">
              <ArabesqueDivider width={190} />
            </div>

            {alreadyDone ? (
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-emeraldx-500/25 bg-emeraldx-500/8 p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emeraldx-500/18 text-emeraldx-300">
                    <Icon name="check" size={17} strokeWidth={2.4} />
                  </span>
                  <div>
                    <p className="text-[13px] font-extrabold text-cream-50">Урок пройден</p>
                    <p className="text-[11px] text-cream-100/50">
                      Тест: {progress?.score}/{progress?.total} · +{lesson.xp} XP получено
                    </p>
                  </div>
                </div>
                <Button variant="outline" onClick={close}>
                  Готово
                </Button>
              </div>
            ) : (
              <Button full icon="education" onClick={() => setSession({ ...active, stage: 'quiz' })}>
                Пройти мини-тест · +{lesson.xp} XP
              </Button>
            )}
          </div>
        )}

        {stage === 'quiz' && q && (
          <div className="animate-slide-up">
            <div className="mt-5 flex items-center gap-2">
              {lesson.quiz.map((_, i) => (
                <span key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i <= qIndex ? 'w-7 bg-gold-400' : 'w-3 bg-white/12'}`} />
              ))}
              <span className="ml-auto text-[11px] font-bold text-cream-100/45 tabular">
                {qIndex + 1} / {lesson.quiz.length}
              </span>
            </div>
            <h4 className="mt-4 text-[17px] font-extrabold leading-snug text-cream-50">{q.q}</h4>
            <div className="mt-4 space-y-2.5">
              {q.options.map((opt, i) => {
                const isPicked = picked === i;
                const isRight = i === q.answer;
                const showState = picked !== null;
                return (
                  <button
                    key={i}
                    onClick={() => pick(i)}
                    className={`press flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left text-[14px] font-bold transition-colors ${
                      showState && isRight
                        ? 'border-emeraldx-500/50 bg-emeraldx-500/12 text-emeraldx-200'
                        : showState && isPicked
                          ? 'border-red-400/40 bg-red-400/10 text-red-200'
                          : 'border-white/10 bg-white/4 text-cream-100/80 hover:border-gold-400/40'
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[12px] font-extrabold ${
                        showState && isRight ? 'bg-emeraldx-500/25 text-emeraldx-200' : 'bg-white/8 text-cream-100/50'
                      }`}
                    >
                      {showState && isRight ? <Icon name="check" size={13} strokeWidth={2.8} /> : String.fromCharCode(1040 + i)}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {stage === 'result' && (
          <div className="animate-slide-up py-3 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-gold-400/50 bg-gradient-to-b from-forest-700/70 to-night-900 shadow-glow">
              <div className="text-center">
                <p className="text-[22px] font-extrabold leading-none gold-text tabular">
                  {correctCount}/{lesson.quiz.length}
                </p>
              </div>
            </div>
            <p className="mt-4 text-[18px] font-extrabold text-cream-50">
              {correctCount === lesson.quiz.length ? 'Безупречно!' : correctCount > 0 ? 'Хороший результат' : 'Попробуйте перечитать'}
            </p>
            <p className="mx-auto mt-1.5 max-w-xs text-[13px] leading-relaxed text-cream-100/55">
              {alreadyDone
                ? 'Этот урок уже был пройден — XP начисляется один раз.'
                : `Урок записан в ваш прогресс. Начислено +${lesson.xp + (correctCount === lesson.quiz.length ? 10 : 0)} XP.`}
            </p>
            {correctCount < lesson.quiz.length && (
              <p className="mx-auto mt-2 max-w-xs text-[12px] leading-relaxed text-cream-100/40">
                {lesson.quiz.map((qq, i) => (answers[i] !== qq.answer ? `Верно: «${qq.options[qq.answer]}»` : '')).filter(Boolean)[0]}
              </p>
            )}
            <div className="mt-6 pb-safe">
              <Button full onClick={close}>
                Завершить урок
              </Button>
            </div>
          </div>
        )}
      </div>
    </Sheet>
  );
}

export function KnowledgeScreen() {
  const { state } = useGame();
  const [cat, setCat] = useState<string>('all');
  const [lesson, setLesson] = useState<Lesson | null>(null);

  const doneTotal = Object.values(state.lessonProgress).filter((p) => p.done).length;
  const filtered = cat === 'all' ? LESSONS : LESSONS.filter((l) => l.category === cat);

  return (
    <div className="space-y-5 pb-6">
      <Card className="p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10.5px] font-extrabold uppercase tracking-[0.24em] text-gold-300/75">Ильм — знание</p>
            <h1 className="mt-0.5 text-[21px] font-extrabold text-cream-50">Раздел знаний</h1>
          </div>
          <div className="text-right">
            <p className="text-[22px] font-extrabold leading-none gold-text tabular">
              {doneTotal}
              <span className="text-[14px] text-cream-100/40">/{LESSONS.length}</span>
            </p>
            <p className="mt-1 text-[11px] font-semibold text-cream-100/45">уроков пройдено</p>
          </div>
        </div>
        <Bar value={doneTotal} max={LESSONS.length} className="mt-4" gold />
      </Card>

      <div className="scrollbar-thin -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        <Chip active={cat === 'all'} onClick={() => setCat('all')}>
          Все темы
        </Chip>
        {CATEGORIES.map((c) => (
          <Chip key={c.id} active={cat === c.id} onClick={() => setCat(c.id)}>
            {c.title}
          </Chip>
        ))}
      </div>

      {cat !== 'all' && (
        <Card className="flex items-center gap-3.5 p-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-400/12 text-gold-300">
            <Icon name={CATEGORIES.find((c) => c.id === cat)!.icon} size={19} />
          </span>
          <div>
            <p className="text-[14px] font-extrabold text-cream-50">{CATEGORIES.find((c) => c.id === cat)!.title}</p>
            <p className="text-[11.5px] text-cream-100/50">{CATEGORIES.find((c) => c.id === cat)!.subtitle}</p>
          </div>
          <span className="ml-auto rounded-xl bg-white/6 px-2.5 py-1.5 text-[11px] font-extrabold text-cream-100/60 tabular">
            {LESSONS.filter((l) => l.category === cat && state.lessonProgress[l.id]?.done).length}/
            {LESSONS.filter((l) => l.category === cat).length}
          </span>
        </Card>
      )}

      <section>
        <SectionTitle icon="education" title={cat === 'all' ? 'Все уроки' : 'Уроки темы'} />
        <div className="space-y-3">
          {filtered.map((l) => (
            <LessonCard
              key={l.id}
              lesson={l}
              done={!!state.lessonProgress[l.id]?.done}
              score={state.lessonProgress[l.id]?.score}
              onClick={() => setLesson(l)}
            />
          ))}
        </div>
      </section>

      <LessonSheet lesson={lesson} open={!!lesson} onClose={() => setLesson(null)} />
    </div>
  );
}
