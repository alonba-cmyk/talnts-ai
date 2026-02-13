import React from 'react';
import { HeroAlternative } from '@/app/components/HeroAlternative';
import { HeroOutcomeCards } from '@/app/components/HeroOutcomeCards';
import { WorkComparisonSection } from '@/app/components/WorkComparisonSection';
import { SidekickCapabilitiesSection } from '@/app/components/SidekickCapabilitiesSection';
import { ProjectManagementSection } from '@/app/components/ProjectManagementSection';
import { AgentsShowcaseSection } from '@/app/components/AgentsShowcaseSection';
import { TeamsAndAgentsSection } from '@/app/components/TeamsAndAgentsSection';
import { TeamsAndAgentsV2 } from '@/app/components/TeamsAndAgentsV2';
import { AIPlatformArchitectureSection } from '@/app/components/AIPlatformArchitectureSection';
import { TeamCommandsSection } from '@/app/components/TeamCommandsSection';
import { BeforeAfterBoardSection } from '@/app/components/BeforeAfterBoardSection';
import type { TeamsAgentsV2Layout, AIPlatformArchLayout } from '@/hooks/useSupabase';

/**
 * Builds a map of section_id → React.ReactNode for standalone sections.
 * These sections don't depend on App-level state (selected department, etc.)
 * and can be reused across the main landing page and dynamic pages.
 *
 * Sections NOT included here (they require App state):
 *   - hero: needs siteSettings.hero_settings, getHeroBackground, etc.
 *   - departments: needs selectedDepartment, handleDepartmentSelect, etc.
 *   - ai_platform: needs selectedDepartment, mappedProducts, etc.
 *
 * Those are built directly in App.tsx.
 */
export function buildStandaloneSections(
  visibility: Record<string, boolean>,
  options?: {
    teamsAgentsV2Layout?: TeamsAgentsV2Layout;
    aiPlatformArchLayout?: AIPlatformArchLayout;
  }
): Record<string, React.ReactNode> {
  const layout = options?.teamsAgentsV2Layout || 'mixed_circle';
  const archLayout = options?.aiPlatformArchLayout || 'app_frame_canvas';

  return {
    hero_alternative: visibility.hero_alternative ? (
      <HeroAlternative key="hero_alternative" />
    ) : null,

    hero_outcome_cards: visibility.hero_outcome_cards ? (
      <HeroOutcomeCards key="hero_outcome_cards" />
    ) : null,

    work_comparison: visibility.work_comparison ? (
      <WorkComparisonSection key="work_comparison" agents={[]} />
    ) : null,

    sidekick_capabilities: visibility.sidekick_capabilities ? (
      <SidekickCapabilitiesSection key="sidekick_capabilities" />
    ) : null,

    sidekick: visibility.sidekick ? (
      <BeforeAfterBoardSection key="sidekick" />
    ) : null,

    agents_showcase: visibility.agents_showcase ? (
      <AgentsShowcaseSection key="agents_showcase" />
    ) : null,

    project_management: visibility.project_management ? (
      <ProjectManagementSection key="project_management" />
    ) : null,

    teams_and_agents: visibility.teams_and_agents ? (
      <TeamsAndAgentsSection key="teams_and_agents" />
    ) : null,

    teams_and_agents_v2: visibility.teams_and_agents_v2 ? (
      <TeamsAndAgentsV2 key="teams_and_agents_v2" layoutVariant={layout} />
    ) : null,

    ai_platform_architecture: visibility.ai_platform_architecture ? (
      <AIPlatformArchitectureSection key="ai_platform_architecture" layoutVariant={archLayout} />
    ) : null,

    team_commands: visibility.team_commands ? (
      <TeamCommandsSection key="team_commands" />
    ) : null,
  };
}
