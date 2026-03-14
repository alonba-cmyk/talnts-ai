import type { AgentCategory } from './types';

export interface CategoryVisual {
  gradient: string;
  accentColor: string;
  accentColorRgb: string;
  glowColor: string;
  hoverBorder: string;
  pillBg: string;
  pillBorder: string;
  pillText: string;
}

export const CATEGORY_VISUALS: Record<AgentCategory, CategoryVisual> = {
  'Content Writer': {
    gradient: 'linear-gradient(135deg, #D4736E, #C47088)',
    accentColor: '#D4736E',
    accentColorRgb: '212, 115, 110',
    glowColor: 'rgba(212, 115, 110, 0.08)',
    hoverBorder: 'rgba(212, 115, 110, 0.25)',
    pillBg: 'rgba(212, 115, 110, 0.08)',
    pillBorder: 'rgba(212, 115, 110, 0.15)',
    pillText: '#E8A9A5',
  },
  'SDR / Sales': {
    gradient: 'linear-gradient(135deg, #D4A23A, #CC8832)',
    accentColor: '#D4A23A',
    accentColorRgb: '212, 162, 58',
    glowColor: 'rgba(212, 162, 58, 0.08)',
    hoverBorder: 'rgba(212, 162, 58, 0.25)',
    pillBg: 'rgba(212, 162, 58, 0.08)',
    pillBorder: 'rgba(212, 162, 58, 0.15)',
    pillText: '#E4C56E',
  },
  'Customer Support': {
    gradient: 'linear-gradient(135deg, #3DA69A, #3BA5B8)',
    accentColor: '#3DA69A',
    accentColorRgb: '61, 166, 154',
    glowColor: 'rgba(61, 166, 154, 0.08)',
    hoverBorder: 'rgba(61, 166, 154, 0.25)',
    pillBg: 'rgba(61, 166, 154, 0.08)',
    pillBorder: 'rgba(61, 166, 154, 0.15)',
    pillText: '#7EC8BE',
  },
  'Developer': {
    gradient: 'linear-gradient(135deg, #5B8FD4, #7074C4)',
    accentColor: '#5B8FD4',
    accentColorRgb: '91, 143, 212',
    glowColor: 'rgba(91, 143, 212, 0.08)',
    hoverBorder: 'rgba(91, 143, 212, 0.25)',
    pillBg: 'rgba(91, 143, 212, 0.08)',
    pillBorder: 'rgba(91, 143, 212, 0.15)',
    pillText: '#9BBDE4',
  },
  'Data Analyst': {
    gradient: 'linear-gradient(135deg, #7E6CC4, #9470CC)',
    accentColor: '#7E6CC4',
    accentColorRgb: '126, 108, 196',
    glowColor: 'rgba(126, 108, 196, 0.08)',
    hoverBorder: 'rgba(126, 108, 196, 0.25)',
    pillBg: 'rgba(126, 108, 196, 0.08)',
    pillBorder: 'rgba(126, 108, 196, 0.15)',
    pillText: '#B0A3DA',
  },
  'Marketing': {
    gradient: 'linear-gradient(135deg, #C4639A, #B85FB8)',
    accentColor: '#C4639A',
    accentColorRgb: '196, 99, 154',
    glowColor: 'rgba(196, 99, 154, 0.08)',
    hoverBorder: 'rgba(196, 99, 154, 0.25)',
    pillBg: 'rgba(196, 99, 154, 0.08)',
    pillBorder: 'rgba(196, 99, 154, 0.15)',
    pillText: '#DCA0C4',
  },
  'Research': {
    gradient: 'linear-gradient(135deg, #4A96C8, #5072B8)',
    accentColor: '#4A96C8',
    accentColorRgb: '74, 150, 200',
    glowColor: 'rgba(74, 150, 200, 0.08)',
    hoverBorder: 'rgba(74, 150, 200, 0.25)',
    pillBg: 'rgba(74, 150, 200, 0.08)',
    pillBorder: 'rgba(74, 150, 200, 0.15)',
    pillText: '#8CBFE0',
  },
  'Operations': {
    gradient: 'linear-gradient(135deg, #6E7A8A, #74747C)',
    accentColor: '#6E7A8A',
    accentColorRgb: '110, 122, 138',
    glowColor: 'rgba(110, 122, 138, 0.08)',
    hoverBorder: 'rgba(110, 122, 138, 0.25)',
    pillBg: 'rgba(110, 122, 138, 0.08)',
    pillBorder: 'rgba(110, 122, 138, 0.15)',
    pillText: '#9BA5B2',
  },
};

export const AGENT_AVATARS: Record<string, string> = {
  'a1': '/agents/contentcraft-pro.png',
  'a2': '/agents/outboundx.png',
  'a3': '/agents/supportbot-elite.png',
  'a4': '/agents/codepilot.png',
  'a5': '/agents/datalens.png',
  'a6': '/agents/growthengine.png',
  'a7': '/agents/researchmind.png',
  'a8': '/agents/opsflow.png',
  'a9': '/agents/quickwrite.png',
  'a10': '/agents/salesforge.png',
  'a11': '/agents/ticketzero.png',
  'a12': '/agents/devassist.png',
  'a13': '/agents/insightpro.png',
  'a14': '/agents/campaignbot.png',
  'a15': '/agents/flowops.png',
};

export function getCategoryVisual(categories: AgentCategory[]): CategoryVisual {
  return CATEGORY_VISUALS[categories[0]] ?? CATEGORY_VISUALS['Developer'];
}
