import { useState } from 'react';
import { Icon } from './icons';
import { ArabesqueDivider, FloatingParticles, StarLatticePattern } from './decor';
import { Avatar } from './ui';
import { AVATARS } from '../data/avatars';
import { Button } from './ui';

const SLIDES = [
  {
    icon: 'sunrise',
    title: 'Создай свой день',
    text: 'Утро начинается с рассвета. Молитвы, учёба, работа, семья — день движется, пока ты принимаешь решения.',
    accent: 'text-gold-300',
  },
  {
    icon: 'help',
    title: 'Принимай решения',
    text: 'Каждое событие дня — выбор. Помочь другу, взяться за задачу, отдохнуть или прочитать пару страниц. Последствия затрагивают сразу несколько сторон жизни.',
    accent: 'text-emeraldx-300',
  },
  {
    icon: 'levelup',
    title: 'Следи за прогрессом',
    text: 'Опыт, уровни, серии дисциплины и достижения. А ещё — раздел знаний с уроками и короткими тестами.',
    accent: 'text-gold-300',
  },
];

export function Onboarding({ onDone }: { onDone: (name: string, avatar: string) => void }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('a1');
  const [error, setError] = useState('');

  const isProfileStep = step === SLIDES.length;

  const next = () => {
    if (isProfileStep) {
      if (name.trim().length < 2) {
        setError('Имя должно быть не короче двух букв');
        return;
      }
      onDone(name, avatar);
      return;
    }
    setStep((s) => s + 1);
    setError('');
  };

  return (
    <div className="app-bg fixed inset-0 z-[80] flex flex-col overflow-hidden">
      <StarLatticePattern className="absolute inset-0" id="ob-pat" opacity={0.04} />
      <FloatingParticles count={8} />

      <div className="relative flex min-h-0 flex-1 flex-col">
        {/* Прогресс-точки */}
        <div className="flex items-center justify-center gap-2 pt-8">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-400 ${
                i === step ? 'w-7 bg-gold-400' : 'w-1.5 bg-white/15'
              }`}
            />
          ))}
        </div>

        {!isProfileStep ? (
          <div key={step} className="flex min-h-0 flex-1 flex-col items-center justify-center px-8 text-center">
            <div className="animate-pop-in flex h-24 w-24 items-center justify-center rounded-3xl border border-gold-400/25 bg-gradient-to-b from-white/8 to-white/2 shadow-glow">
              <Icon name={SLIDES[step].icon} size={44} />
            </div>
            <h2 className="mt-8 animate-slide-up text-[24px] font-extrabold text-cream-50">{SLIDES[step].title}</h2>
            <p className="mt-4 max-w-sm animate-slide-up text-[14.5px] leading-relaxed text-cream-100/65 [animation-delay:150ms]">
              {SLIDES[step].text}
            </p>
            <div className="mt-8 animate-fade-in [animation-delay:400ms]">
              <ArabesqueDivider width={190} />
            </div>
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto px-6 py-6 scrollbar-thin">
            <div className="w-full max-w-sm animate-slide-up">
              <h2 className="text-center text-[22px] font-extrabold text-cream-50">Как вас представить?</h2>
              <p className="mt-2 text-center text-[13px] leading-relaxed text-cream-100/55">
                Имя и аватар появятся в профиле. Всё сохраняется на устройстве.
              </p>

              <div className="mt-6 flex justify-center">
                <Avatar avatarId={avatar} name={name || 'М'} size={92} ring />
              </div>

              <input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                }}
                maxLength={20}
                placeholder="Ваше имя"
                className="mt-6 w-full rounded-2xl border border-white/12 bg-white/5 px-5 py-3.5 text-center text-[15px] font-bold text-cream-50 placeholder:font-medium placeholder:text-cream-100/35 focus:border-gold-400/50 focus:outline-none"
              />
              {error && <p className="mt-2 text-center text-xs font-semibold text-red-300">{error}</p>}

              <p className="mt-6 text-center text-[11px] font-bold uppercase tracking-[0.18em] text-cream-100/40">
                Выберите медальон
              </p>
              <div className="mt-3 grid grid-cols-4 gap-3">
                {AVATARS.map((av) => (
                  <button
                    key={av.id}
                    onClick={() => setAvatar(av.id)}
                    className={`press flex flex-col items-center gap-1.5 rounded-2xl border p-2 transition-colors ${
                      avatar === av.id
                        ? 'border-gold-400/70 bg-gold-400/10'
                        : 'border-white/8 bg-white/3 hover:border-white/20'
                    }`}
                    aria-label={av.name}
                  >
                    <Avatar avatarId={av.id} name={name || 'М'} size={44} />
                  </button>
                ))}
              </div>

              <p className="mt-6 rounded-2xl border border-white/6 bg-white/3 px-4 py-3 text-center text-[11px] leading-relaxed text-cream-100/45">
                Все показатели — игровая модель самодисциплины, а не оценка духовного состояния человека.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="pb-safe relative px-6 pb-7 pt-2">
        <div className="mx-auto flex max-w-sm items-center gap-3">
          {step > 0 && (
            <Button variant="ghost" onClick={() => setStep((s) => s - 1)}>
              Назад
            </Button>
          )}
          <Button full onClick={next} icon={isProfileStep ? 'check' : undefined}>
            {isProfileStep ? 'Начать день' : step === SLIDES.length - 1 ? 'Создать персонажа' : 'Далее'}
            {!isProfileStep && step < SLIDES.length - 1 && <Icon name="arrow-right" size={16} accent={false} />}
          </Button>
        </div>
      </div>
    </div>
  );
}
