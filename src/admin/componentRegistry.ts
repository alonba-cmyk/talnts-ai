/**
 * Central Component Registry
 * Defines all available component types with metadata for the Site Builder.
 * Used by: Component Bank, Page Builder Editor, Component Settings Panel.
 */

import {
  Rocket, Type, LayoutGrid, Scale, MessageSquare, Bot,
  Building2, Package, FolderKanban, Users, UsersRound,
  Workflow, Terminal, Navigation, Layers, Presentation,
  Monitor, AppWindow, PanelTop, UserCheck, Lightbulb,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

export type ComponentCategory = 'hero' | 'sidekick' | 'navigation' | 'platform' | 'agents' | 'content';

export interface ComponentCategoryMeta {
  label: string;
  color: string;
  description: string;
}

export interface ComponentTypeMeta {
  /** Unique type key */
  type: string;
  /** Display name */
  name: string;
  /** Short description */
  description: string;
  /** Lucide icon component */
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  /** Category for grouping */
  category: ComponentCategory;
  /** Brand color for the component */
  color: string;
  /** Which pages this component is available for */
  availableFor: ('homepage' | 'platform' | 'dynamic')[];
  /** Default settings for new instances */
  defaultSettings: Record<string, any>;
  /** Whether this component has configurable settings */
  hasSettings: boolean;
  /** Preview route path (for live iframe preview) */
  previewRoute?: string;
}

// ─── Category Metadata ──────────────────────────────────────────────────────

export const componentCategories: Record<ComponentCategory, ComponentCategoryMeta> = {
  hero: {
    label: 'Hero',
    color: '#8b5cf6',
    description: 'Hero sections that appear at the top of a page',
  },
  sidekick: {
    label: 'Sidekick',
    color: '#f97316',
    description: 'AI Sidekick interactive demos and chat experiences',
  },
  navigation: {
    label: 'Navigation',
    color: '#3b82f6',
    description: 'Navigation bars and department selectors',
  },
  platform: {
    label: 'Platform / Solution',
    color: '#14b8a6',
    description: 'Platform views, workspaces, and architecture displays',
  },
  agents: {
    label: 'Agents / Teams',
    color: '#06b6d4',
    description: 'Agent showcases, team displays, and collaborative views',
  },
  content: {
    label: 'Content',
    color: '#ec4899',
    description: 'Content sections and comparison views',
  },
};

// ─── Component Type Registry ─────────────────────────────────────────────────

export const componentRegistry: ComponentTypeMeta[] = [
  // ── Hero Components ──────────────────────────────────────────────────────
  {
    type: 'hero',
    name: 'Hero Section',
    description: 'Main hero with gradient headline, logo, and animated scroll indicator',
    icon: Rocket,
    category: 'hero',
    color: '#6366f1',
    availableFor: ['homepage', 'dynamic'],
    defaultSettings: {
      logo_url: '',
      platform_label: 'AI Work Platform',
      headline_text: 'Empowering every team ',
      headline_gradient_text: 'to accelerate business impact',
      font_size: 'large',
      background_type: 'gradient',
      background_color: '#000000',
      background_gradient_from: '#000000',
      background_gradient_to: '#1a1a2e',
      background_image_url: '',
    },
    hasSettings: true,
    previewRoute: '/preview/hero',
  },
  {
    type: 'hero_alternative',
    name: 'Hero Alternative (White)',
    description: 'Light hero with typing animation and agent images',
    icon: Type,
    category: 'hero',
    color: '#8b5cf6',
    availableFor: ['homepage', 'dynamic'],
    defaultSettings: {},
    hasSettings: false,
    previewRoute: '/preview/hero_alternative',
  },
  {
    type: 'hero_outcome_cards',
    name: 'Hero Outcome Cards',
    description: 'White hero with gradient and 6 selectable outcome cards',
    icon: LayoutGrid,
    category: 'hero',
    color: '#a855f7',
    availableFor: ['homepage', 'dynamic'],
    defaultSettings: {},
    hasSettings: false,
    previewRoute: '/preview/hero_outcome_cards',
  },
  {
    type: 'platform_hero',
    name: 'Platform Hero',
    description: 'Platform page hero with product branding and subtitle',
    icon: PanelTop,
    category: 'hero',
    color: '#7c3aed',
    availableFor: ['platform'],
    defaultSettings: {
      hero_variant: 'typewriter',
    },
    hasSettings: true,
  },

  // ── Sidekick Components ──────────────────────────────────────────────────
  {
    type: 'sidekick',
    name: 'Sidekick (Full Story)',
    description: 'Full AI chat demo with multi-stage flow and board views',
    icon: Bot,
    category: 'sidekick',
    color: '#f97316',
    availableFor: ['homepage', 'dynamic'],
    defaultSettings: {
      // Sidekick theme settings will be stored here
      hero_theme: null,
      inaction_theme: null,
    },
    hasSettings: true,
    previewRoute: '/preview/sidekick',
  },
  {
    type: 'sidekick_capabilities',
    name: 'Sidekick (Half Story)',
    description: 'Sidekick onboarding flow with options and board mockups',
    icon: MessageSquare,
    category: 'sidekick',
    color: '#f59e0b',
    availableFor: ['homepage', 'dynamic'],
    defaultSettings: {},
    hasSettings: false,
    previewRoute: '/preview/sidekick_capabilities',
  },

  // ── Navigation Components ────────────────────────────────────────────────
  {
    type: 'departments',
    name: 'Departments Selector',
    description: 'Tabbed navigation with department / outcome / pain point cards',
    icon: Building2,
    category: 'navigation',
    color: '#3b82f6',
    availableFor: ['homepage'],
    defaultSettings: {
      hero_title: 'What would you like to achieve?',
      tabs: [],
    },
    hasSettings: true,
    previewRoute: '/preview/departments',
  },
  {
    type: 'department_bar',
    name: 'Department Bar',
    description: 'Horizontal department pill selector for the platform page',
    icon: Navigation,
    category: 'navigation',
    color: '#2563eb',
    availableFor: ['platform'],
    defaultSettings: {},
    hasSettings: false,
  },

  // ── Platform / Solution Components ───────────────────────────────────────
  {
    type: 'ai_platform',
    name: 'AI Work Platform',
    description: 'Department sidebar with isometric platform and product tabs',
    icon: Package,
    category: 'platform',
    color: '#6366f1',
    availableFor: ['homepage'],
    defaultSettings: {
      solution_tabs_visibility: {
        overview: true,
        inAction: true,
        businessValue: true,
        test: true,
        products: true,
        capabilities: true,
      },
    },
    hasSettings: true,
    previewRoute: '/preview/ai_platform',
  },
  {
    type: 'jtbd_workspace',
    name: 'JTBD Workspace',
    description: 'Platform workspace section (version controlled by page-level V1-V4 setting)',
    icon: AppWindow,
    category: 'platform',
    color: '#0d9488',
    availableFor: ['platform'],
    defaultSettings: {
      context_toggle: false,
      sidekick_panel_style: 'right_overlay',
      v3_team_avatars: 'header_row',
      v3_minimal_chat: false,
      sidebar_left: false,
      v4_left_panel: 'sidekick_chat',
      show_jtbd_sidebar: true,
      show_inline_sidekick: false,
      show_department_bar: true,
      show_intro: false,
      intro_style: 'unified',
    },
    hasSettings: true,
  },
  {
    type: 'platform_showcase',
    name: 'Platform Showcase',
    description: 'AI Work Platform showcase section with homepage-style department header',
    icon: Presentation,
    category: 'platform',
    color: '#0f766e',
    availableFor: ['platform'],
    defaultSettings: {
      show_jtbd_sidebar: true,
      show_inline_sidekick: false,
      show_department_bar: 'horizontal',
      showcase_variant: 'classic',
    },
    hasSettings: true,
  },
  {
    type: 'use_cases_showcase',
    name: 'Use Cases Showcase',
    description: 'Key use cases with value messaging, 4 layout variants',
    icon: Lightbulb,
    category: 'platform',
    color: '#8b5cf6',
    availableFor: ['platform'],
    defaultSettings: {
      use_cases_variant: 'cards_grid',
    },
    hasSettings: true,
  },
  {
    type: 'platform_architecture_layer',
    name: 'Platform Architecture Layer',
    description: 'Layered architecture visualization with products and capabilities',
    icon: Layers,
    category: 'platform',
    color: '#115e59',
    availableFor: ['platform'],
    defaultSettings: {
      architecture_variant: 'classic',
    },
    hasSettings: true,
  },
  {
    type: 'ai_platform_architecture',
    name: 'AI Platform Architecture',
    description: 'App-frame layouts with agent cycles and workflow visualization',
    icon: Workflow,
    category: 'platform',
    color: '#14b8a6',
    availableFor: ['homepage', 'dynamic'],
    defaultSettings: {
      layout: 'app_frame_canvas',
    },
    hasSettings: true,
    previewRoute: '/preview/ai_platform_architecture',
  },
  {
    type: 'project_management',
    name: 'Project Management',
    description: 'Board layers with database, context, workflow, and Vibe',
    icon: FolderKanban,
    category: 'platform',
    color: '#10b981',
    availableFor: ['homepage', 'dynamic'],
    defaultSettings: {},
    hasSettings: false,
    previewRoute: '/preview/project_management',
  },

  // ── Agents / Teams Components ────────────────────────────────────────────
  {
    type: 'agents_showcase',
    name: 'Agents Showcase',
    description: 'Cyan gradient background with grid of agent cards',
    icon: Users,
    category: 'agents',
    color: '#06b6d4',
    availableFor: ['homepage', 'dynamic'],
    defaultSettings: {},
    hasSettings: false,
    previewRoute: '/preview/agents_showcase',
  },
  {
    type: 'teams_and_agents',
    name: 'Teams and Agents V1',
    description: 'Dark gradient with team members and agent avatars',
    icon: UsersRound,
    category: 'agents',
    color: '#8b5cf6',
    availableFor: ['homepage', 'dynamic'],
    defaultSettings: {},
    hasSettings: false,
    previewRoute: '/preview/teams_and_agents',
  },
  {
    type: 'teams_and_agents_v2',
    name: 'Teams and Agents V2',
    description: 'Multi-layout variant with department selector and team visuals',
    icon: UsersRound,
    category: 'agents',
    color: '#a855f7',
    availableFor: ['homepage', 'dynamic'],
    defaultSettings: {
      layout: 'mixed_circle',
    },
    hasSettings: true,
    previewRoute: '/preview/teams_and_agents_v2',
  },
  {
    type: 'team_commands',
    name: 'Team Commands',
    description: 'Interactive chat demo with board items and overlay modes',
    icon: Terminal,
    category: 'agents',
    color: '#ef4444',
    availableFor: ['homepage', 'dynamic'],
    defaultSettings: {},
    hasSettings: false,
    previewRoute: '/preview/team_commands',
  },

  {
    type: 'department_agents_showcase',
    name: 'Department Agents Showcase',
    description: 'Cards grid showing agents per department with impact metrics',
    icon: UserCheck,
    category: 'agents',
    color: '#0891b2',
    availableFor: ['platform'],
    defaultSettings: {},
    hasSettings: false,
  },

  // ── Content Components ───────────────────────────────────────────────────
  {
    type: 'work_comparison',
    name: 'Work Comparison',
    description: 'Split layout showing manual work vs. AI agents side by side',
    icon: Scale,
    category: 'content',
    color: '#ec4899',
    availableFor: ['homepage', 'dynamic'],
    defaultSettings: {},
    hasSettings: false,
    previewRoute: '/preview/work_comparison',
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Get a component type definition by its key */
export function getComponentMeta(type: string): ComponentTypeMeta | undefined {
  return componentRegistry.find(c => c.type === type);
}

/** Get all components for a given page type */
export function getComponentsForPage(pageType: 'homepage' | 'platform' | 'dynamic'): ComponentTypeMeta[] {
  return componentRegistry.filter(c => c.availableFor.includes(pageType));
}

/** Get all components in a given category */
export function getComponentsByCategory(category: ComponentCategory): ComponentTypeMeta[] {
  return componentRegistry.filter(c => c.category === category);
}

/** Get the category order for display */
export const categoryOrder: ComponentCategory[] = ['hero', 'sidekick', 'navigation', 'platform', 'agents', 'content'];

/** Group components by category */
export function getComponentsGroupedByCategory(): { category: ComponentCategory; meta: ComponentCategoryMeta; components: ComponentTypeMeta[] }[] {
  return categoryOrder.map(cat => ({
    category: cat,
    meta: componentCategories[cat],
    components: getComponentsByCategory(cat),
  }));
}
