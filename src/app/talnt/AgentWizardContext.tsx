import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { AgentCategory } from './types';

interface AgentWizardContextValue {
  isOpen: boolean;
  initialCategory: AgentCategory | null;
  openWizard: (category?: AgentCategory) => void;
  closeWizard: () => void;
}

const AgentWizardContext = createContext<AgentWizardContextValue | null>(null);

export function AgentWizardProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [initialCategory, setInitialCategory] = useState<AgentCategory | null>(null);

  const openWizard = useCallback((category?: AgentCategory) => {
    setInitialCategory(category ?? null);
    setIsOpen(true);
  }, []);

  const closeWizard = useCallback(() => {
    setIsOpen(false);
    setInitialCategory(null);
  }, []);

  return (
    <AgentWizardContext.Provider value={{ isOpen, initialCategory, openWizard, closeWizard }}>
      {children}
    </AgentWizardContext.Provider>
  );
}

export function useAgentWizard() {
  const ctx = useContext(AgentWizardContext);
  if (!ctx) throw new Error('useAgentWizard must be used within AgentWizardProvider');
  return ctx;
}
