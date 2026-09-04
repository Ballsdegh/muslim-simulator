import { useEffect, useMemo, useRef, useState } from 'react';
import { useGame } from './state/GameContext';
import { SAVE_KEY, currentEvent } from './state/game';
import type { Notif, ScreenId } from './types';
import { SplashScreen, DaySplash } from './components/SplashScreen';
import { Onboarding } from './components/Onboarding';
import { OverlayStage } from './components/Overlays';
import { DaySummary } from './components/DaySummary';
import { BottomNavigation, Sidebar } from './components/Navigation';
import { ToastStack } from './components/Notifications';
import { EventSheet } from './components/EventModal';
import { StarLatticePattern } from './components/decor';
import { Dashboard } from './screens/Dashboard';
import { DayScreen } from './screens/DayScreen';
import { KnowledgeScreen } from './screens/Knowledge';
import { AchievementsScreen } from './screens/Achievements';
import { ProfileScreen } from './screens/Profile';
import { fmtDateRu, dateFromDay } from './utils';

function AppInner() {
  const { state, dispatch } = useGame();
  const resume = useMemo(() => (typeof localStorage !== 'undefined' ? localStorage.getItem(SAVE_KEY) !== null : false), []);
  const [booted, setBooted] = useState(false);
  const [screen, setScreen] = useState<ScreenId>('home');
  const [toasts, setToasts] = useState<Notif[]>([]);
  const [eventSheetId, setEventSheetId] = useState<string | null>(null);
  const [daySplash, setDaySplash] = useState(false);
  const seenEventRef = useRef<string | null>(null);

  // Переносим pending-тосты в локальный стейт
  const pending = state.pendingToasts;
  useEffect(() => {
    if (pending?.length) {
      setToasts((ts) => [...ts, ...pending].slice(-4));
      dispatch({ type: 'CONSUME_TOASTS' });
    }
  }, [pending]);

  const overlayOpen = (state.overlays?.length ?? 0) > 0;
  const modalOpen = eventSheetId !== null;
  const running = booted && state.onboarded && !state.dayFinished && !modalOpen && !overlayOpen && !daySplash;

  // Игровой такт: 1 секунда реального времени
  useEffect(() => {
    if (!running) return;
    const iv = setInterval(() => dispatch({ type: 'TICK', now: Date.now() }), 1000);
    return () => clearInterval(iv);
  }, [running, dispatch]);

  // Автооткрытие текущего события на экране «День»
  const cur = currentEvent(state);
  useEffect(() => {
    if (screen === 'day' && cur && !modalOpen && seenEventRef.current !== cur.id) {
      seenEventRef.current = cur.id;
      setEventSheetId(cur.id);
    }
  }, [screen, cur?.id, modalOpen]);

  // Скролл вверх при смене экрана
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [screen]);

  const sheetEvent = eventSheetId ? state.schedule.find((e) => e.id === eventSheetId) ?? null : null;

  // Пока не пройдено онбординг-введение
  if (!state.onboarded) {
    return (
      <div className="app-bg min-h-full">
        <Onboarding onDone={(name, avatar) => dispatch({ type: 'ONBOARD_DONE', name, avatar })} />
      </div>
    );
  }

  // Первый splash
  if (!booted) {
    return <SplashScreen resume={resume} onDone={() => setBooted(true)} />;
  }

  return (
    <div className="app-bg relative min-h-full">
      <StarLatticePattern className="pointer-events-none fixed inset-0 z-0" id="app-pat" opacity={0.028} />

      <Sidebar screen={screen} onNavigate={setScreen} />

      <main className="relative z-10 lg:pl-[264px]">
        <div className="mx-auto w-full max-w-3xl px-4 pb-32 pt-5 lg:px-10 lg:pt-8 xl:max-w-5xl">
          <div key={screen} className="animate-fade-in">
            {screen === 'home' && (
              <Dashboard
                onNavigate={setScreen}
                onOpenEvent={(id) => {
                  seenEventRef.current = id;
                  setEventSheetId(id);
                }}
              />
            )}
            {screen === 'day' && (
              <DayScreen
                onOpenEvent={(id) => {
                  seenEventRef.current = id;
                  setEventSheetId(id);
                }}
              />
            )}
            {screen === 'knowledge' && <KnowledgeScreen />}
            {screen === 'achievements' && <AchievementsScreen />}
            {screen === 'profile' && <ProfileScreen />}
          </div>
        </div>
      </main>

      <BottomNavigation screen={screen} onNavigate={setScreen} />

      {/* Событие дня */}
      <EventSheet event={sheetEvent} open={!!sheetEvent} onClose={() => setEventSheetId(null)} />

      {/* Завершение дня — после закрытия модалки события */}
      {state.dayFinished && !sheetEvent && (
        <DaySummary
          onStartNewDay={() => {
            dispatch({ type: 'START_NEW_DAY' });
            setDaySplash(true);
          }}
        />
      )}

      {/* Splash нового дня */}
      {daySplash && !state.dayFinished && (
        <DaySplash
          day={state.day}
          dateText={fmtDateRu(dateFromDay(state.startedAtISO, state.day))}
          onDone={() => setDaySplash(false)}
        />
      )}

      {/* Оверлеи уровня/достижений и тосты */}
      <OverlayStage />
      <ToastStack toasts={toasts} onDismiss={(id) => setToasts((ts) => ts.filter((t) => t.id !== id))} />
    </div>
  );
}

export default function App() {
  return <AppInner />;
}
