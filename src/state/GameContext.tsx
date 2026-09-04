import { createContext, useContext, useEffect, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { Action } from './game';
import { createInitialState, loadState, reducer, saveState } from './game';
import type { SaveState } from '../types';

interface GameCtx {
  state: SaveState;
  dispatch: (a: Action) => void;
}

const Ctx = createContext<GameCtx | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => loadState() ?? createInitialState());

  useEffect(() => {
    saveState(state);
  }, [state]);

  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>;
}

export function useGame(): GameCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useGame должен использоваться внутри GameProvider');
  return ctx;
}
