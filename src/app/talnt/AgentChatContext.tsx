import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { TalntAgent } from './types';

interface AgentChatContextValue {
  isOpen: boolean;
  agent: TalntAgent | null;
  openChat: (agent: TalntAgent) => void;
  closeChat: () => void;
}

const AgentChatContext = createContext<AgentChatContextValue | null>(null);

export function AgentChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [agent, setAgent] = useState<TalntAgent | null>(null);

  const openChat = useCallback((a: TalntAgent) => {
    setAgent(a);
    setIsOpen(true);
  }, []);

  const closeChat = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => setAgent(null), 300);
  }, []);

  return (
    <AgentChatContext.Provider value={{ isOpen, agent, openChat, closeChat }}>
      {children}
    </AgentChatContext.Provider>
  );
}

export function useAgentChat() {
  const ctx = useContext(AgentChatContext);
  if (!ctx) throw new Error('useAgentChat must be used within AgentChatProvider');
  return ctx;
}
