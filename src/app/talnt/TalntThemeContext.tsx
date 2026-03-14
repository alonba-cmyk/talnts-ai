import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

export type TalntTheme = 'dark' | 'light';

export interface ThemeTokens {
  theme: TalntTheme;
  bgPage: string;
  bgNavbar: string;
  bgNavbarSolid: string;
  bgNavbarMobile: string;
  bgCard: string;
  bgCardHover: string;
  bgInput: string;
  bgSurface: string;
  bgSurface2: string;
  bgPill: string;
  bgPillActive: string;
  bgFooter: string;
  bgSectionAlt: string;
  borderDefault: string;
  borderHover: string;
  borderNavbar: string;
  dividerColor: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textPlaceholder: string;
  textAccent: string;
  textAccentHover: string;
  shadowCard: string;
  shadowCardHover: string;
  shadowLg: string;
  networkColorR: number;
  networkColorG: number;
  networkColorB: number;
  networkOpacity: number;
  logoFilter: string;
  logoFilterHover: string;
  heroTitleGradient: string;
  heroAccentGradient: string;
  ctaBg: string;
  ctaPatternColor: string;
  ctaTextBody: string;
  btnPrimaryBg: string;
  btnPrimaryText: string;
  btnPrimaryHoverBg: string;
  btnSecondaryBorder: string;
  btnSecondaryText: string;
  btnSecondaryHoverBg: string;
  glassCard: string;
  glassBorder: string;
  glassInnerGlow: string;
}

const DARK_TOKENS: ThemeTokens = {
  theme: 'dark',
  bgPage: '#111318',
  bgNavbar: 'rgba(17, 19, 24, 0.88)',
  bgNavbarSolid: '#111318',
  bgNavbarMobile: 'rgba(17, 19, 24, 0.98)',
  bgCard: 'rgba(22, 24, 34, 0.85)',
  bgCardHover: 'rgba(24, 26, 38, 0.95)',
  bgInput: 'rgba(18, 20, 28, 0.90)',
  bgSurface: 'rgba(255,255,255,0.04)',
  bgSurface2: 'rgba(255,255,255,0.07)',
  bgPill: 'rgba(255,255,255,0.05)',
  bgPillActive: 'rgba(255,255,255,0.13)',
  bgFooter: '#0C0E14',
  bgSectionAlt: 'rgba(255,255,255,0.018)',
  borderDefault: 'rgba(255,255,255,0.07)',
  borderHover: 'rgba(255,255,255,0.14)',
  borderNavbar: 'rgba(255,255,255,0.07)',
  dividerColor: 'rgba(255,255,255,0.06)',
  textPrimary: '#F1F5FF',
  textSecondary: '#8B9EC0',
  textMuted: '#5A6A85',
  textPlaceholder: '#445069',
  textAccent: '#818CF8',
  textAccentHover: '#A5B4FC',
  shadowCard: '0 1px 3px rgba(0,0,0,0.3)',
  shadowCardHover: '0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.2)',
  shadowLg: '0 20px 60px rgba(0,0,0,0.5)',
  networkColorR: 140,
  networkColorG: 150,
  networkColorB: 190,
  networkOpacity: 0.18,
  logoFilter: 'brightness(0.5) grayscale(0.3)',
  logoFilterHover: 'brightness(1) grayscale(0)',
  heroTitleGradient: 'linear-gradient(135deg, #FFFFFF 0%, #C7D2FE 55%, #A5B4FC 100%)',
  heroAccentGradient: 'linear-gradient(135deg, #818CF8, #A78BFA)',
  ctaBg: 'linear-gradient(135deg, #1a1a2e 0%, #252545 50%, #343460 100%)',
  ctaPatternColor: 'rgba(255,255,255,0.5)',
  ctaTextBody: 'rgba(203,213,225,0.7)',
  btnPrimaryBg: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
  btnPrimaryText: '#fff',
  btnPrimaryHoverBg: 'linear-gradient(135deg, #7C7FF7, #9D6FFA)',
  btnSecondaryBorder: 'rgba(255,255,255,0.2)',
  btnSecondaryText: '#fff',
  btnSecondaryHoverBg: 'rgba(255,255,255,0.06)',
  glassCard: 'rgba(22, 24, 34, 0.6)',
  glassBorder: 'rgba(255,255,255,0.08)',
  glassInnerGlow: 'rgba(255,255,255,0.03)',
};

const LIGHT_TOKENS: ThemeTokens = {
  theme: 'light',
  bgPage: '#FAFBFD',
  bgNavbar: 'rgba(250, 251, 253, 0)',
  bgNavbarSolid: 'rgba(255, 255, 255, 0.92)',
  bgNavbarMobile: 'rgba(255, 255, 255, 0.99)',
  bgCard: '#FFFFFF',
  bgCardHover: '#FFFFFF',
  bgInput: '#FFFFFF',
  bgSurface: '#F4F5F7',
  bgSurface2: '#ECEEF2',
  bgPill: '#F4F5F7',
  bgPillActive: '#EEF2FF',
  bgFooter: '#F8F9FB',
  bgSectionAlt: '#F4F5F7',
  borderDefault: '#E2E4EA',
  borderHover: '#C7D2FE',
  borderNavbar: 'rgba(0,0,0,0.06)',
  dividerColor: '#E2E4EA',
  textPrimary: '#0F1115',
  textSecondary: '#5A5F6B',
  textMuted: '#9299A6',
  textPlaceholder: '#C5CAD3',
  textAccent: '#6366F1',
  textAccentHover: '#4F46E5',
  shadowCard: '0 1px 2px rgba(0,0,0,0.03), 0 4px 16px rgba(0,0,0,0.04), 0 12px 40px rgba(0,0,0,0.02)',
  shadowCardHover: '0 8px 30px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04), 0 0 0 1px rgba(99,102,241,0.08)',
  shadowLg: '0 24px 80px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.06)',
  networkColorR: 99,
  networkColorG: 102,
  networkColorB: 241,
  networkOpacity: 0.06,
  logoFilter: 'grayscale(1) opacity(0.35)',
  logoFilterHover: 'grayscale(0) opacity(1)',
  heroTitleGradient: 'linear-gradient(135deg, #0F1115 0%, #0F1115 100%)',
  heroAccentGradient: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
  ctaBg: 'linear-gradient(135deg, #1E1B4B 0%, #3730A3 50%, #6366F1 100%)',
  ctaPatternColor: 'rgba(255,255,255,0.06)',
  ctaTextBody: 'rgba(224,231,255,0.9)',
  btnPrimaryBg: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
  btnPrimaryText: '#fff',
  btnPrimaryHoverBg: 'linear-gradient(135deg, #7C7FF7, #9D6FFA)',
  btnSecondaryBorder: '#E2E4EA',
  btnSecondaryText: '#2D3039',
  btnSecondaryHoverBg: '#F4F5F7',
  glassCard: 'rgba(255, 255, 255, 0.55)',
  glassBorder: 'rgba(255, 255, 255, 0.7)',
  glassInnerGlow: 'rgba(255, 255, 255, 0.6)',
};

interface TalntThemeContextValue {
  tokens: ThemeTokens;
  toggleTheme: () => void;
}

const TalntThemeContext = createContext<TalntThemeContextValue | null>(null);

export function TalntThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<TalntTheme>(() => {
    try {
      return (localStorage.getItem('talnt_theme') as TalntTheme) ?? 'light';
    } catch {
      return 'light';
    }
  });

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('talnt_theme', next); } catch {}
      return next;
    });
  }, []);

  const tokens = theme === 'dark' ? DARK_TOKENS : LIGHT_TOKENS;

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-talnt-theme', theme);
    root.style.setProperty('--talnt-placeholder', tokens.textPlaceholder);
    root.style.setProperty('--talnt-input-bg', tokens.bgInput);
    root.style.setProperty('--talnt-input-border', tokens.borderDefault);
    root.style.setProperty('--talnt-text-primary', tokens.textPrimary);
    root.style.setProperty('--talnt-text-secondary', tokens.textSecondary);
    root.style.setProperty('--talnt-text-muted', tokens.textMuted);
    root.style.setProperty('--talnt-text-accent', tokens.textAccent);
    root.style.setProperty('--talnt-bg-card-hover', tokens.bgCardHover);
  }, [theme, tokens]);

  return (
    <TalntThemeContext.Provider value={{ tokens, toggleTheme }}>
      {children}
    </TalntThemeContext.Provider>
  );
}

export function useTalntTheme() {
  const ctx = useContext(TalntThemeContext);
  if (!ctx) throw new Error('useTalntTheme must be used within TalntThemeProvider');
  return ctx;
}
