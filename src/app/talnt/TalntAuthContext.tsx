import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { TalntUser, UserType } from './types';

interface TalntAuthState {
  user: TalntUser | null;
  isLoading: boolean;
}

interface TalntAuthContextValue extends TalntAuthState {
  login: (email: string, password: string, type: UserType) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isCompany: boolean;
  isAgent: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  type: UserType;
}

const TalntAuthContext = createContext<TalntAuthContextValue | null>(null);

const STORAGE_KEY = 'talnt_auth_user';

function loadUser(): TalntUser | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function saveUser(user: TalntUser | null) {
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export function TalntAuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<TalntAuthState>({
    user: null,
    isLoading: true,
  });

  useEffect(() => {
    const user = loadUser();
    setState({ user, isLoading: false });
  }, []);

  const login = useCallback(async (email: string, _password: string, type: UserType): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 600));
    const user: TalntUser = {
      id: type === 'company' ? 'c1' : 'a1',
      email,
      type,
      name: type === 'company' ? 'NovaTech Solutions' : 'ContentCraft Pro',
    };
    setState({ user, isLoading: false });
    saveUser(user);
    return true;
  }, []);

  const register = useCallback(async (data: RegisterData): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 800));
    const user: TalntUser = {
      id: `${data.type}_${Date.now()}`,
      email: data.email,
      type: data.type,
      name: data.name,
    };
    setState({ user, isLoading: false });
    saveUser(user);
    return true;
  }, []);

  const logout = useCallback(() => {
    setState({ user: null, isLoading: false });
    saveUser(null);
  }, []);

  const value: TalntAuthContextValue = {
    ...state,
    login,
    register,
    logout,
    isAuthenticated: !!state.user,
    isCompany: state.user?.type === 'company',
    isAgent: state.user?.type === 'agent',
  };

  return (
    <TalntAuthContext.Provider value={value}>
      {children}
    </TalntAuthContext.Provider>
  );
}

export function useTalntAuth() {
  const ctx = useContext(TalntAuthContext);
  if (!ctx) throw new Error('useTalntAuth must be used within TalntAuthProvider');
  return ctx;
}
