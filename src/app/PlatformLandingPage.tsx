import { useState, useEffect } from 'react';
import { PlatformHero } from '@/app/components/platform/PlatformHero';
import { DepartmentBar } from '@/app/components/platform/DepartmentBar';
import { JTBDWorkspaceSection, JTBDWorkspaceSectionV2, JTBDWorkspaceSectionV3, JTBDWorkspaceSectionV4, PlatformShowcaseSection } from '@/app/components/platform/DepartmentJTBDSection';
import { PlatformArchitectureLayer } from '@/app/components/platform/PlatformArchitectureLayer';
import { DepartmentAgentsShowcase } from '@/app/components/platform/DepartmentAgentsShowcase';
import { UseCasesShowcase } from '@/app/components/platform/UseCasesShowcase';
import { useDepartments, useSiteSettings } from '@/hooks/useSupabase';

// V1 - current version
function PlatformLandingPageV1({ contextToggle, sidekickPanelStyle, sidebarLeft, showcaseSection, showJtbdSidebar, showInlineSidekick, showDepartmentBar, showcaseShowJtbdSidebar, showcaseShowInlineSidekick, showcaseShowDepartmentBar, showIntro, introStyle, heroVariant, architectureVariant, showcaseVariant }: { contextToggle?: boolean; sidekickPanelStyle?: string; sidebarLeft?: boolean; showcaseSection?: boolean; showJtbdSidebar?: boolean; showInlineSidekick?: boolean; showDepartmentBar?: boolean; showcaseShowJtbdSidebar?: boolean; showcaseShowInlineSidekick?: boolean; showcaseShowDepartmentBar?: string; showIntro?: boolean; introStyle?: string; heroVariant?: string; architectureVariant?: string; showcaseVariant?: string }) {
  const { departments, loading } = useDepartments();
  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null);

  // Auto-select marketing (or first) department
  useEffect(() => {
    if (departments.length > 0 && !selectedDeptId) {
      const marketing = departments.find((d) => d.name === 'marketing');
      setSelectedDeptId(marketing?.id || departments[0].id);
    }
  }, [departments, selectedDeptId]);

  const selectedDept = departments.find((d) => d.id === selectedDeptId) || null;

  return (
    <div className="min-h-screen bg-white text-gray-900 scroll-smooth">
      <PlatformHero variant={heroVariant as any} />

      {showDepartmentBar !== false && (
        <DepartmentBar
          departments={departments}
          loading={loading}
          selectedDeptId={selectedDeptId}
          onSelectDepartment={setSelectedDeptId}
        />
      )}

      <JTBDWorkspaceSection
        department={selectedDept}
        allDepartments={departments}
        contextToggle={contextToggle}
        sidekickPanelStyle={sidekickPanelStyle}
        sidebarLeft={sidebarLeft}
        showJtbdSidebar={showJtbdSidebar}
        showInlineSidekick={showInlineSidekick}
        showIntro={showIntro}
        introStyle={introStyle}
      />

      {showcaseSection && (
        <PlatformShowcaseSection
          departments={departments}
          loading={loading}
          selectedDeptId={selectedDeptId}
          onSelectDepartment={setSelectedDeptId}
          contextToggle={contextToggle}
          sidekickPanelStyle={sidekickPanelStyle}
          sidebarLeft={sidebarLeft}
          showJtbdSidebar={showcaseShowJtbdSidebar}
          showInlineSidekick={showcaseShowInlineSidekick}
          showDepartmentBar={showcaseShowDepartmentBar}
          variant={(showcaseVariant as 'classic' | 'sandbox') || 'classic'}
        />
      )}

      <PlatformArchitectureLayer variant={(architectureVariant as 'classic' | 'restructured') || 'classic'} />

      {/* Footer */}
      <footer className="py-10 bg-white border-t border-gray-100">
        <p className="text-center text-sm text-gray-400">
          monday.com &middot; AI Work Platform
        </p>
      </footer>
    </div>
  );
}

// V2 - unified board layout (dept pills + team strip + JTBD tabs inside one card)
function PlatformLandingPageV2({ contextToggle, sidekickPanelStyle, sidebarLeft, showcaseSection, showDepartmentBar, showcaseShowJtbdSidebar, showcaseShowInlineSidekick, showcaseShowDepartmentBar, heroVariant, architectureVariant, showcaseVariant }: { contextToggle?: boolean; sidekickPanelStyle?: string; sidebarLeft?: boolean; showcaseSection?: boolean; showDepartmentBar?: boolean; showcaseShowJtbdSidebar?: boolean; showcaseShowInlineSidekick?: boolean; showcaseShowDepartmentBar?: string; heroVariant?: string; architectureVariant?: string; showcaseVariant?: string }) {
  const { departments, loading } = useDepartments();
  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null);

  useEffect(() => {
    if (departments.length > 0 && !selectedDeptId) {
      const marketing = departments.find((d) => d.name === 'marketing');
      setSelectedDeptId(marketing?.id || departments[0].id);
    }
  }, [departments, selectedDeptId]);

  const selectedDept = departments.find((d) => d.id === selectedDeptId) || null;

  return (
    <div className="min-h-screen bg-white text-gray-900 scroll-smooth">
      <PlatformHero variant={heroVariant as any} />

      <JTBDWorkspaceSectionV2
        departments={departments}
        selectedDeptId={selectedDeptId}
        onSelectDepartment={setSelectedDeptId}
        department={selectedDept}
        contextToggle={contextToggle}
        sidekickPanelStyle={sidekickPanelStyle}
        sidebarLeft={sidebarLeft}
      />

      {showcaseSection && (
        <PlatformShowcaseSection
          departments={departments}
          loading={loading}
          selectedDeptId={selectedDeptId}
          onSelectDepartment={setSelectedDeptId}
          contextToggle={contextToggle}
          sidekickPanelStyle={sidekickPanelStyle}
          sidebarLeft={sidebarLeft}
          showJtbdSidebar={showcaseShowJtbdSidebar}
          showInlineSidekick={showcaseShowInlineSidekick}
          showDepartmentBar={showcaseShowDepartmentBar}
          variant={(showcaseVariant as 'classic' | 'sandbox') || 'classic'}
        />
      )}

      <PlatformArchitectureLayer variant={(architectureVariant as 'classic' | 'restructured') || 'classic'} />

      {/* Footer */}
      <footer className="py-10 bg-white border-t border-gray-100">
        <p className="text-center text-sm text-gray-400">
          monday.com &middot; AI Work Platform
        </p>
      </footer>
    </div>
  );
}

// V3 - Sidekick chat sidebar + board
function PlatformLandingPageV3({ contextToggle, sidekickPanelStyle, teamAvatarsPlacement, minimalChat, sidebarLeft, showcaseSection, showJtbdSidebar, showInlineSidekick, showDepartmentBar, showcaseShowJtbdSidebar, showcaseShowInlineSidekick, showcaseShowDepartmentBar, showIntro, introStyle, heroVariant, architectureVariant, showcaseVariant }: { contextToggle?: boolean; sidekickPanelStyle?: string; teamAvatarsPlacement?: 'in_chat' | 'header_row' | 'header_merged'; minimalChat?: boolean; sidebarLeft?: boolean; showcaseSection?: boolean; showJtbdSidebar?: boolean; showInlineSidekick?: boolean; showDepartmentBar?: boolean; showcaseShowJtbdSidebar?: boolean; showcaseShowInlineSidekick?: boolean; showcaseShowDepartmentBar?: string; showIntro?: boolean; introStyle?: string; heroVariant?: string; architectureVariant?: string; showcaseVariant?: string }) {
  const { departments, loading } = useDepartments();
  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null);

  useEffect(() => {
    if (departments.length > 0 && !selectedDeptId) {
      const marketing = departments.find((d) => d.name === 'marketing');
      setSelectedDeptId(marketing?.id || departments[0].id);
    }
  }, [departments, selectedDeptId]);

  const selectedDept = departments.find((d) => d.id === selectedDeptId) || null;

  return (
    <div className="min-h-screen bg-white text-gray-900 scroll-smooth">
      <PlatformHero variant={heroVariant as any} />

      {showDepartmentBar !== false && (
        <DepartmentBar
          departments={departments}
          loading={loading}
          selectedDeptId={selectedDeptId}
          onSelectDepartment={setSelectedDeptId}
        />
      )}

      <JTBDWorkspaceSectionV3
        department={selectedDept}
        allDepartments={departments}
        contextToggle={contextToggle}
        sidekickPanelStyle={sidekickPanelStyle}
        teamAvatarsPlacement={teamAvatarsPlacement}
        minimalChat={minimalChat}
        sidebarLeft={sidebarLeft}
        showJtbdSidebar={showJtbdSidebar}
        showInlineSidekick={showInlineSidekick}
        showIntro={showIntro}
        introStyle={introStyle}
      />

      {showcaseSection && (
        <PlatformShowcaseSection
          departments={departments}
          loading={loading}
          selectedDeptId={selectedDeptId}
          onSelectDepartment={setSelectedDeptId}
          contextToggle={contextToggle}
          sidekickPanelStyle={sidekickPanelStyle}
          sidebarLeft={sidebarLeft}
          showJtbdSidebar={showcaseShowJtbdSidebar}
          showInlineSidekick={showcaseShowInlineSidekick}
          showDepartmentBar={showcaseShowDepartmentBar}
          variant={(showcaseVariant as 'classic' | 'sandbox') || 'classic'}
        />
      )}

      <PlatformArchitectureLayer variant={(architectureVariant as 'classic' | 'restructured') || 'classic'} />

      {/* Footer */}
      <footer className="py-10 bg-white border-t border-gray-100">
        <p className="text-center text-sm text-gray-400">
          monday.com &middot; AI Work Platform
        </p>
      </footer>
    </div>
  );
}

// V4 - Platform card frame + board with avatar header
function PlatformLandingPageV4({ contextToggle, sidekickPanelStyle, teamAvatarsPlacement, minimalChat, sidebarLeft, leftPanelStyle, showcaseSection, showJtbdSidebar, showInlineSidekick, showDepartmentBar, showcaseShowJtbdSidebar, showcaseShowInlineSidekick, showcaseShowDepartmentBar, showIntro, introStyle, heroVariant, architectureVariant, showcaseVariant, useCasesVariant }: { contextToggle?: boolean; sidekickPanelStyle?: string; teamAvatarsPlacement?: 'in_chat' | 'header_row' | 'header_merged'; minimalChat?: boolean; sidebarLeft?: boolean; leftPanelStyle?: 'sidekick_chat' | 'v1_sidebar'; showcaseSection?: boolean; showJtbdSidebar?: boolean; showInlineSidekick?: boolean; showDepartmentBar?: boolean; showcaseShowJtbdSidebar?: boolean; showcaseShowInlineSidekick?: boolean; showcaseShowDepartmentBar?: string; showIntro?: boolean; introStyle?: string; heroVariant?: string; architectureVariant?: string; showcaseVariant?: string; useCasesVariant?: string }) {
  const { departments, loading } = useDepartments();
  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null);

  useEffect(() => {
    if (departments.length > 0 && !selectedDeptId) {
      const marketing = departments.find((d) => d.name === 'marketing');
      setSelectedDeptId(marketing?.id || departments[0].id);
    }
  }, [departments, selectedDeptId]);

  const selectedDept = departments.find((d) => d.id === selectedDeptId) || null;

  return (
    <div className="min-h-screen bg-white text-gray-900 scroll-smooth">
      <PlatformHero variant={heroVariant as any} />

      {showDepartmentBar !== false && (
        <DepartmentBar
          departments={departments}
          loading={loading}
          selectedDeptId={selectedDeptId}
          onSelectDepartment={setSelectedDeptId}
        />
      )}

      <UseCasesShowcase departments={departments} variant={useCasesVariant as any} />

      <JTBDWorkspaceSectionV4
        department={selectedDept}
        allDepartments={departments}
        contextToggle={contextToggle}
        sidekickPanelStyle={sidekickPanelStyle}
        teamAvatarsPlacement={teamAvatarsPlacement}
        minimalChat={minimalChat}
        sidebarLeft={sidebarLeft}
        leftPanelStyle={leftPanelStyle}
        showJtbdSidebar={showJtbdSidebar}
        showInlineSidekick={showInlineSidekick}
        showIntro={showIntro}
        introStyle={introStyle}
      />

      {showcaseSection && (
        <PlatformShowcaseSection
          departments={departments}
          loading={loading}
          selectedDeptId={selectedDeptId}
          onSelectDepartment={setSelectedDeptId}
          contextToggle={contextToggle}
          sidekickPanelStyle={sidekickPanelStyle}
          sidebarLeft={sidebarLeft}
          showJtbdSidebar={showcaseShowJtbdSidebar}
          showInlineSidekick={showcaseShowInlineSidekick}
          showDepartmentBar={showcaseShowDepartmentBar}
          variant={(showcaseVariant as 'classic' | 'sandbox') || 'classic'}
        />
      )}

      <DepartmentAgentsShowcase departments={departments} />

      <PlatformArchitectureLayer variant={(architectureVariant as 'classic' | 'restructured') || 'classic'} />

      {/* Footer */}
      <footer className="py-10 bg-white border-t border-gray-100">
        <p className="text-center text-sm text-gray-400">
          monday.com &middot; AI Work Platform
        </p>
      </footer>
    </div>
  );
}

// Router - picks the right version based on admin settings
export default function PlatformLandingPage() {
  const { settings, loading } = useSiteSettings();

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#6161ff] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const contextToggle = settings.platform_context_toggle;
  const sidekickPanelStyle = settings.platform_sidekick_panel_style || 'right_overlay';
  const teamAvatarsPlacement = settings.platform_v3_team_avatars || 'header_row';
  const minimalChat = settings.platform_v3_minimal_chat ?? false;
  const sidebarLeft = settings.platform_sidebar_left ?? false;
  const leftPanelStyle = settings.platform_v4_left_panel || 'sidekick_chat';
  const showcaseSection = settings.platform_showcase_section ?? false;
  const showJtbdSidebar = settings.platform_show_jtbd_sidebar ?? true;
  const showInlineSidekick = settings.platform_show_inline_sidekick ?? false;
  const showDepartmentBar = settings.platform_show_department_bar ?? true;
  const showcaseShowJtbdSidebar = settings.platform_showcase_show_jtbd_sidebar ?? true;
  const showcaseShowInlineSidekick = settings.platform_showcase_show_inline_sidekick ?? false;
  // Backward compatibility: legacy boolean true -> 'horizontal', false -> 'none'
  const rawShowcaseDeptBar = settings.platform_showcase_show_department_bar;
  const showcaseShowDepartmentBar: string = typeof rawShowcaseDeptBar === 'boolean'
    ? (rawShowcaseDeptBar ? 'horizontal' : 'none')
    : (rawShowcaseDeptBar || 'horizontal');
  const showIntro = settings.platform_show_intro ?? false;
  const introStyle = settings.platform_intro_style || 'unified';
  const heroVariant = settings.platform_hero_variant || 'typewriter';
  const architectureVariant = settings.platform_architecture_variant || 'classic';
  const showcaseVariant = settings.platform_showcase_variant || 'classic';
  const useCasesVariant = settings.platform_use_cases_variant || 'cards_grid';

  if (settings.platform_page_version === 'v4') {
    return <PlatformLandingPageV4 contextToggle={contextToggle} sidekickPanelStyle={sidekickPanelStyle} teamAvatarsPlacement={teamAvatarsPlacement} minimalChat={minimalChat} sidebarLeft={sidebarLeft} leftPanelStyle={leftPanelStyle} showcaseSection={showcaseSection} showJtbdSidebar={showJtbdSidebar} showInlineSidekick={showInlineSidekick} showDepartmentBar={showDepartmentBar} showcaseShowJtbdSidebar={showcaseShowJtbdSidebar} showcaseShowInlineSidekick={showcaseShowInlineSidekick} showcaseShowDepartmentBar={showcaseShowDepartmentBar} showIntro={showIntro} introStyle={introStyle} heroVariant={heroVariant} architectureVariant={architectureVariant} showcaseVariant={showcaseVariant} useCasesVariant={useCasesVariant} />;
  }

  if (settings.platform_page_version === 'v3') {
    return <PlatformLandingPageV3 contextToggle={contextToggle} sidekickPanelStyle={sidekickPanelStyle} teamAvatarsPlacement={teamAvatarsPlacement} minimalChat={minimalChat} sidebarLeft={sidebarLeft} showcaseSection={showcaseSection} showJtbdSidebar={showJtbdSidebar} showInlineSidekick={showInlineSidekick} showDepartmentBar={showDepartmentBar} showcaseShowJtbdSidebar={showcaseShowJtbdSidebar} showcaseShowInlineSidekick={showcaseShowInlineSidekick} showcaseShowDepartmentBar={showcaseShowDepartmentBar} showIntro={showIntro} introStyle={introStyle} heroVariant={heroVariant} architectureVariant={architectureVariant} showcaseVariant={showcaseVariant} />;
  }

  if (settings.platform_page_version === 'v2') {
    return <PlatformLandingPageV2 contextToggle={contextToggle} sidekickPanelStyle={sidekickPanelStyle} sidebarLeft={sidebarLeft} showcaseSection={showcaseSection} showDepartmentBar={showDepartmentBar} showcaseShowJtbdSidebar={showcaseShowJtbdSidebar} showcaseShowInlineSidekick={showcaseShowInlineSidekick} showcaseShowDepartmentBar={showcaseShowDepartmentBar} heroVariant={heroVariant} architectureVariant={architectureVariant} showcaseVariant={showcaseVariant} />;
  }

  return <PlatformLandingPageV1 contextToggle={contextToggle} sidekickPanelStyle={sidekickPanelStyle} sidebarLeft={sidebarLeft} showcaseSection={showcaseSection} showJtbdSidebar={showJtbdSidebar} showInlineSidekick={showInlineSidekick} showDepartmentBar={showDepartmentBar} showcaseShowJtbdSidebar={showcaseShowJtbdSidebar} showcaseShowInlineSidekick={showcaseShowInlineSidekick} showcaseShowDepartmentBar={showcaseShowDepartmentBar} showIntro={showIntro} introStyle={introStyle} heroVariant={heroVariant} architectureVariant={architectureVariant} showcaseVariant={showcaseVariant} />;
}
