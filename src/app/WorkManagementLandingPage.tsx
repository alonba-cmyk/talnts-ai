import { useEffect, useMemo, lazy, Suspense } from 'react';
import { useSiteSettings, type SiteSettings } from '@/hooks/useSupabase';
import { WorkManagementNav } from '@/app/components/workManagement/WorkManagementNav';
import { WorkManagementFirstFold } from '@/app/components/workManagement/WorkManagementFirstFold';
import { WorkManagementFooter } from '@/app/components/workManagement/WorkManagementFooter';
import { SidekickFloatingWidget } from '@/app/components/workManagement/SidekickFloatingWidget';

const WorkManagementPlatformLayers = lazy(() => import('@/app/components/workManagement/WorkManagementPlatformLayers').then(m => ({ default: m.WorkManagementPlatformLayers })));
const WorkManagementSolutionsSection = lazy(() => import('@/app/components/workManagement/WorkManagementSolutionsSection').then(m => ({ default: m.WorkManagementSolutionsSection })));
const WorkManagementUseCasesSection = lazy(() => import('@/app/components/workManagement/WorkManagementUseCasesSection').then(m => ({ default: m.WorkManagementUseCasesSection })));
const WorkManagementEnterpriseSection = lazy(() => import('@/app/components/workManagement/WorkManagementEnterpriseSection').then(m => ({ default: m.WorkManagementEnterpriseSection })));
const WorkManagementWhatSetsUsApart = lazy(() => import('@/app/components/workManagement/WorkManagementWhatSetsUsApart').then(m => ({ default: m.WorkManagementWhatSetsUsApart })));
const WorkManagementCTASection = lazy(() => import('@/app/components/workManagement/WorkManagementCTASection').then(m => ({ default: m.WorkManagementCTASection })));
const WorkManagementAgentCatalog = lazy(() => import('@/app/components/workManagement/WorkManagementAgentCatalog').then(m => ({ default: m.WorkManagementAgentCatalog })));
const WorkManagementVibeSection = lazy(() => import('@/app/components/workManagement/WorkManagementVibeSection').then(m => ({ default: m.WorkManagementVibeSection })));
const WorkManagementAITransformationSection = lazy(() => import('@/app/components/workManagement/WorkManagementAITransformationSection').then(m => ({ default: m.WorkManagementAITransformationSection })));
const OpenPlatformSection = lazy(() => import('@/app/components/workManagement/OpenPlatformSection').then(m => ({ default: m.OpenPlatformSection })));
const ConsolidationSection = lazy(() => import('@/app/components/workManagement/ConsolidationSection').then(m => ({ default: m.ConsolidationSection })));

const DEFAULT_SECTIONS_ORDER = ['first_fold', 'demo', 'platform_layers', 'solutions', 'use_cases', 'agent_catalog', 'vibe', 'consolidation', 'ai_transformation', 'enterprise', 'what_sets_us_apart', 'open_platform', 'cta'];

export default function WorkManagementLandingPage() {
  const { settings, loading } = useSiteSettings();
  const isDark = settings?.wm_dark_mode ?? false;

  useEffect(() => {
    document.title = 'monday.com';
  }, []);

  const sectionsOrder = useMemo(() => {
    const saved = settings?.wm_sections_order;
    if (!saved?.length) return DEFAULT_SECTIONS_ORDER;
    const missing = DEFAULT_SECTIONS_ORDER.filter(id => !saved.includes(id));
    if (missing.length === 0) return saved;
    const merged = [...saved];
    missing.forEach(id => {
      const defaultIdx = DEFAULT_SECTIONS_ORDER.indexOf(id);
      const predecessor = DEFAULT_SECTIONS_ORDER.slice(0, defaultIdx).reverse().find(p => merged.includes(p));
      const insertAt = predecessor ? merged.indexOf(predecessor) + 1 : merged.length;
      merged.splice(insertAt, 0, id);
    });
    return merged;
  }, [settings?.wm_sections_order]);
  const sectionsVis = settings?.wm_sections_visibility ?? {};
  const sectionsGap = settings?.wm_sections_gap ?? 0;
  const isSectionVisible = (id: string) => sectionsVis[id] !== false;

  const sectionElements = useMemo(() => {
    if (!settings) return null;
    const s = settings as SiteSettings;

    const sectionMap: Record<string, React.ReactNode> = {
      first_fold: <WorkManagementFirstFold key="first_fold" settings={s} hideDemo />,
      demo: <WorkManagementFirstFold key="demo" settings={s} hideHero />,
      platform_layers: (
        <WorkManagementPlatformLayers
          key="platform_layers"
          variant={s.wm_platform_layers_variant}
          bentoStyle={s.wm_bento_style as 'dark_gradient' | 'glass_blur'}
          isDark={isDark}
        />
      ),
      solutions: <WorkManagementSolutionsSection key="solutions" />,
      use_cases:
        s.wm_use_cases_variant && s.wm_use_cases_variant !== 'none' ? (
          <WorkManagementUseCasesSection
            key="use_cases"
            variant={s.wm_use_cases_variant}
            isDark={isDark}
            jtbdBgOverrides={s.wm_jtbd_bg_overrides}
            jtbdPositionOverrides={s.wm_jtbd_position_overrides}
            jtbdZoomOverrides={s.wm_jtbd_zoom_overrides}
            jtbdGlobalPosterPos={s.wm_jtbd_global_poster_pos}
            jtbdGlobalPosterZoom={s.wm_jtbd_global_poster_zoom}
            jtbdGlobalExpandedPos={s.wm_jtbd_global_expanded_pos}
            jtbdGlobalExpandedZoom={s.wm_jtbd_global_expanded_zoom}
            jtbdExpandedOverlayOpacity={s.wm_jtbd_expanded_overlay_opacity}
          />
        ) : null,
      agent_catalog:
        (s.wm_agent_catalog_variant ?? 'compact_grid') !== 'none' ? (
          <WorkManagementAgentCatalog
            key="agent_catalog"
            variant={s.wm_agent_catalog_variant ?? 'compact_grid'}
            showCarousel={s.wm_show_agent_carousel ?? false}
          />
        ) : null,
      vibe: <WorkManagementVibeSection key="vibe" collageImageOverrides={s.wm_vibe_collage_images} />,
      consolidation: <ConsolidationSection key="consolidation" variant={s.wm_consolidation_variant ?? 'tab_based'} />,
      ai_transformation: <WorkManagementAITransformationSection key="ai_transformation" variant={s.wm_ai_transformation_variant ?? 'proof_cards'} />,
      enterprise: <WorkManagementEnterpriseSection key="enterprise" />,
      what_sets_us_apart: <WorkManagementWhatSetsUsApart key="what_sets_us_apart" />,
      open_platform: <OpenPlatformSection key="open_platform" />,
      cta: <WorkManagementCTASection key="cta" />,
    };

    return sectionsOrder
      .filter(id => isSectionVisible(id) && sectionMap[id] !== undefined)
      .map(id => sectionMap[id]);
  }, [settings, sectionsOrder, sectionsVis, isDark]);

  if (loading) {
    return <div className="min-h-screen bg-[#0a0a0a]" />;
  }

  return (
    <div className={`min-h-screen scroll-smooth overflow-x-hidden ${isDark ? 'dark bg-[#0a0a0a] text-white' : 'bg-white text-gray-900'}`}>
      <WorkManagementNav isDark={isDark} />
      {settings?.wm_show_sidekick_bubble && <SidekickFloatingWidget />}
      <Suspense fallback={null}>
        {sectionsGap !== 0
          ? (sectionElements as React.ReactNode[])?.map((el, i) => (
              <div key={i} style={i > 0 ? { marginTop: sectionsGap } : undefined}>{el}</div>
            ))
          : sectionElements}
      </Suspense>
      <WorkManagementFooter />
    </div>
  );
}
