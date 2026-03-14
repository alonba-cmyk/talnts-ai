import TalntHero from '../components/talnt/TalntHero';
import LiveMatchHero from '../components/talnt/LiveMatchHero';
import TalntDualPath from '../components/talnt/TalntDualPath';
import TalntPopularRoles from '../components/talnt/TalntPopularRoles';
import TalntHowItWorks from '../components/talnt/TalntHowItWorks';
import TalntBrowseAgentsSection from '../components/talnt/TalntBrowseAgentsSection';
import TalntThreePartyTrust from '../components/talnt/TalntThreePartyTrust';
import TalntWhyWorkDraft from '../components/talnt/TalntWhyWorkDraft';
import TalntCTA from '../components/talnt/TalntCTA';
import { useSiteSettings } from '@/hooks/useSupabase';

const DEFAULT_ORDER = ['hero', 'how_it_works', 'mid_section', 'why_workdraft', 'trust', 'browse_agents', 'cta'];

export default function TalntLanding() {
  const { settings, loading } = useSiteSettings();

  const heroVariant = settings.talnt_hero_variant;
  const midVariant = settings.talnt_mid_variant;
  const sectionsVisibility = settings.talnt_sections_visibility;

  const sectionsOrder = (() => {
    const stored = settings.talnt_sections_order;
    const missing = DEFAULT_ORDER.filter(id => !stored.includes(id));
    if (missing.length === 0) return stored;
    const ctaIdx = stored.indexOf('cta');
    const insertAt = ctaIdx >= 0 ? ctaIdx : stored.length;
    return [...stored.slice(0, insertAt), ...missing, ...stored.slice(insertAt)];
  })();

  const isVisible = (id: string) => sectionsVisibility[id] !== false;

  if (loading) {
    return <div className="min-h-screen" />;
  }

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
