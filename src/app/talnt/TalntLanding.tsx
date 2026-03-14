import { useState } from 'react';
import TalntHero from '../components/talnt/TalntHero';
import LiveMatchHero from '../components/talnt/LiveMatchHero';
import TalntDualPath from '../components/talnt/TalntDualPath';
import TalntPopularRoles from '../components/talnt/TalntPopularRoles';
import TalntHowItWorks from '../components/talnt/TalntHowItWorks';
import TalntBrowseAgentsSection from '../components/talnt/TalntBrowseAgentsSection';
import TalntThreePartyTrust from '../components/talnt/TalntThreePartyTrust';
import TalntWhyWorkDraft from '../components/talnt/TalntWhyWorkDraft';
import TalntCTA from '../components/talnt/TalntCTA';

const LS = {
  HERO_VARIANT:        'talnt_hero_variant',
  SOCIAL_PROOF:        'talnt_hero_social_proof',
  MID_VARIANT:         'talnt_mid_section_variant',
  SECTIONS_ORDER:      'talnt_sections_order',
  SECTIONS_VISIBILITY: 'talnt_sections_visibility',
};

const DEFAULT_ORDER = ['hero', 'how_it_works', 'mid_section', 'why_workdraft', 'trust', 'browse_agents', 'cta'];

type HeroVariant = 'top_agents' | 'hire_cards' | 'inline_wizard' | 'live_match';
type MidVariant  = 'dual_path' | 'popular_roles';

function readLS<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export default function TalntLanding() {
  const [heroVariant]       = useState<HeroVariant>(() => (localStorage.getItem(LS.HERO_VARIANT) as HeroVariant) ?? 'top_agents');
  const [midVariant]        = useState<MidVariant>(() => (localStorage.getItem(LS.MID_VARIANT) as MidVariant) ?? 'dual_path');
  const [sectionsOrder]     = useState<string[]>(() => {
    const stored = readLS<string[]>(LS.SECTIONS_ORDER, DEFAULT_ORDER);
    // Merge any new sections from DEFAULT_ORDER that aren't in the stored order yet
    const missing = DEFAULT_ORDER.filter(id => !stored.includes(id));
    // Insert missing sections before 'cta' (second to last position)
    if (missing.length === 0) return stored;
    const ctaIdx = stored.indexOf('cta');
    const insertAt = ctaIdx >= 0 ? ctaIdx : stored.length;
    return [...stored.slice(0, insertAt), ...missing, ...stored.slice(insertAt)];
  });
  const [sectionsVisibility]= useState<Record<string, boolean>>(() => readLS<Record<string, boolean>>(LS.SECTIONS_VISIBILITY, {}));

  const isVisible = (id: string) => sectionsVisibility[id] !== false;

  const SECTION_MAP: Record<string, React.ReactNode> = {
    hero:         heroVariant === 'live_match' ? <LiveMatchHero /> : <TalntHero />,
    how_it_works: <TalntHowItWorks />,
    mid_section:  midVariant === 'popular_roles' ? <TalntPopularRoles /> : <TalntDualPath />,
    why_workdraft: <TalntWhyWorkDraft />,
    trust:         <TalntThreePartyTrust />,
    browse_agents: <TalntBrowseAgentsSection />,
    cta:          <TalntCTA />,
  };

  return (
    <div className="flex flex-col gap-2">
      {sectionsOrder
        .filter(id => isVisible(id) && id in SECTION_MAP)
        .map(id => <div key={id}>{SECTION_MAP[id]}</div>)
      }
    </div>
  );
}
