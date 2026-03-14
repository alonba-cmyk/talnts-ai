import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { AgentCategory, AgentFramework } from './types';

interface AgentSearchState {
  isOpen: boolean;
  initialCategory?: AgentCategory;
  initialFramework?: AgentFramework;
}

interface AgentSearchContextValue extends AgentSearchState {
  openSearch: (opts?: { category?: AgentCategory; framework?: AgentFramework }) => void;
  closeSearch: () => void;
}

const AgentSearchContext = createContext<AgentSearchContextValue | null>(null);

export function AgentSearchProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AgentSearchState>({ isOpen: false });

  const openSearch = useCallback((opts?: { category?: AgentCategory; framework?: AgentFramework }) => {
    setState({
      isOpen: true,
      initialCategory: opts?.category,
      initialFramework: opts?.framework,
    });
  }, []);

  const closeSearch = useCallback(() => {
    setState({ isOpen: false });
  }, []);

  return (
    <AgentSearchContext.Provider value={{ ...state, openSearch, closeSearch }}>
      {children}
    </AgentSearchContext.Provider>
  );
}

export function useAgentSearch() {
  const ctx = useContext(AgentSearchContext);
  if (!ctx) throw new Error('useAgentSearch must be used within AgentSearchProvider');
  return ctx;
}
