import { useState, useEffect, useRef } from 'react';
import { Save, Plus, Trash2, GripVertical, ArrowLeft, Upload, X, Rocket, Type, LayoutGrid, Scale, MessageSquare, Bot, Building2, Package, FolderKanban, Users, UsersRound, Workflow, Terminal, Eye, EyeOff, ChevronDown } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { DndContext, closestCenter, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TabItem {
  id: string;
  label: string;
  icon: string;
  order_index: number;
  enabled: boolean;
}

interface SectionsVisibility {
  hero: boolean;
  hero_alternative: boolean;
  hero_outcome_cards: boolean;
  work_comparison: boolean;
  sidekick_capabilities: boolean;
  sidekick: boolean;
  departments: boolean;
  ai_platform: boolean;
  project_management: boolean;
  agents_showcase: boolean;
  teams_and_agents: boolean;
  teams_and_agents_v2: boolean;
  ai_platform_architecture: boolean;
  team_commands: boolean;
}

type TeamsAgentsV2Layout = 'mixed_circle' | 'team_with_agents' | 'side_by_side_unified' | 'cards_layout';
type AIPlatformArchLayout = 'app_frame_list' | 'app_frame_canvas' | 'app_frame_board';

interface HeroSettings {
  logo_url: string;
  platform_label: string;
  headline_text: string;
  headline_gradient_text: string;
  font_size: 'small' | 'medium' | 'large' | 'xlarge';
  background_type: 'solid' | 'gradient' | 'image';
  background_color: string;
  background_gradient_from: string;
  background_gradient_to: string;
  background_image_url: string;
}

interface SolutionTabsVisibility {
  overview: boolean;
  inAction: boolean;
  businessValue: boolean;
  test: boolean;
  products: boolean;
  capabilities: boolean;
}

interface SiteSettings {
  hero_title: string;
  hero_subtitle: string;
  tabs: TabItem[];
  sections_visibility: SectionsVisibility;
  sections_order: string[];
  hero_settings: HeroSettings;
  solution_tabs_visibility: SolutionTabsVisibility;
  teams_agents_v2_layout: TeamsAgentsV2Layout;
  team_flanked_featured_agents: Record<string, string[]>;
  ai_platform_arch_layout: AIPlatformArchLayout;
  platform_architecture_variant: 'classic' | 'restructured';
  platform_page_version: 'v1' | 'v2' | 'v3' | 'v4';
  platform_context_toggle: boolean;
  platform_sidekick_panel_style: 'right_overlay' | 'center_modal';
  platform_v3_team_avatars: 'in_chat' | 'header_row' | 'header_merged';
  platform_v3_minimal_chat: boolean;
  platform_sidebar_left: boolean;
  platform_v4_left_panel: 'sidekick_chat' | 'v1_sidebar';
  platform_showcase_section: boolean;
  platform_show_jtbd_sidebar: boolean;
  platform_show_inline_sidekick: boolean;
  platform_show_department_bar: boolean;
  platform_showcase_show_jtbd_sidebar: boolean;
  platform_showcase_show_inline_sidekick: boolean;
  platform_showcase_show_department_bar: 'none' | 'horizontal' | 'vertical_sidebar' | 'both';
  platform_showcase_variant: 'classic' | 'sandbox';
  platform_show_intro: boolean;
  platform_intro_style: 'unified' | 'with_plus';
  platform_hero_variant: 'typewriter' | 'gradient_wave' | 'bold_statement' | 'glassmorphism' | 'spotlight' | 'orbit' | 'split' | 'reveal' | 'spotlight_v2' | 'spotlight_v3' | 'spotlight_v4';
  platform_use_cases_variant: 'cards_grid' | 'hero_featured' | 'department_tabs' | 'bento_mosaic';
}

const defaultSectionsVisibility: SectionsVisibility = {
  hero: true,
  hero_alternative: false,
  hero_outcome_cards: false,
  work_comparison: false,
  sidekick_capabilities: false,
  sidekick: true,
  departments: true,
  ai_platform: true,
  project_management: false,
  agents_showcase: false,
  teams_and_agents: false,
  teams_and_agents_v2: false,
  ai_platform_architecture: false,
  team_commands: false,
};

const defaultHeroSettings: HeroSettings = {
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
};

const defaultSolutionTabsVisibility: SolutionTabsVisibility = {
  overview: true,
  inAction: true,
  businessValue: true,
  test: true,
  products: true,
  capabilities: true,
};

const defaultSectionsOrder: string[] = [
  'hero',
  'hero_alternative',
  'hero_outcome_cards',
  'work_comparison',
  'sidekick_capabilities',
  'sidekick',
  'agents_showcase',
  'project_management',
  'teams_and_agents',
  'teams_and_agents_v2',
  'ai_platform_architecture',
  'team_commands',
  'departments',
  'ai_platform',
];

// ─── Section Metadata ───────────────────────────────────────────────────────

interface SectionMeta {
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: 'hero' | 'content' | 'interactive' | 'showcase';
  color: string;
}

const sectionMeta: Record<string, SectionMeta> = {
  hero: {
    label: 'Hero Section',
    description: 'Main hero with gradient headline, logo, and animated scroll',
    icon: Rocket,
    category: 'hero',
    color: '#6366f1',
  },
  hero_alternative: {
    label: 'Hero Alternative (White)',
    description: 'Light hero with typing animation and agent images',
    icon: Type,
    category: 'hero',
    color: '#8b5cf6',
  },
  hero_outcome_cards: {
    label: 'Hero Outcome Cards',
    description: 'White hero with gradient and 6 selectable outcome cards',
    icon: LayoutGrid,
    category: 'hero',
    color: '#a855f7',
  },
  work_comparison: {
    label: 'Work Comparison',
    description: 'Split layout: manual work vs. AI agents side by side',
    icon: Scale,
    category: 'content',
    color: '#ec4899',
  },
  sidekick_capabilities: {
    label: 'Sidekick (Half Story)',
    description: 'Sidekick onboarding flow with options and board mockups',
    icon: MessageSquare,
    category: 'interactive',
    color: '#f59e0b',
  },
  sidekick: {
    label: 'Sidekick (Full Story)',
    description: 'Full AI chat demo with multi-stage flow and board views',
    icon: Bot,
    category: 'interactive',
    color: '#f97316',
  },
  departments: {
    label: 'Departments Selector',
    description: 'Tabbed navigation with department/outcome/pain point cards',
    icon: Building2,
    category: 'content',
    color: '#3b82f6',
  },
  ai_platform: {
    label: 'AI Work Platform',
    description: 'Department sidebar with isometric platform and product tabs',
    icon: Package,
    category: 'content',
    color: '#6366f1',
  },
  project_management: {
    label: 'Project Management',
    description: 'Board layers with database, context, workflow, and Vibe',
    icon: FolderKanban,
    category: 'content',
    color: '#10b981',
  },
  agents_showcase: {
    label: 'Agents Showcase',
    description: 'Cyan gradient background with grid of agent cards',
    icon: Users,
    category: 'showcase',
    color: '#06b6d4',
  },
  teams_and_agents: {
    label: 'Teams and Agents',
    description: 'Dark gradient with team members and agent avatars',
    icon: UsersRound,
    category: 'showcase',
    color: '#8b5cf6',
  },
  teams_and_agents_v2: {
    label: 'Teams and Agents V2',
    description: 'Multi-layout variant with department selector and team visuals',
    icon: UsersRound,
    category: 'showcase',
    color: '#a855f7',
  },
  ai_platform_architecture: {
    label: 'AI Platform Architecture',
    description: 'App-frame layouts with agent cycles and workflow visualization',
    icon: Workflow,
    category: 'content',
    color: '#14b8a6',
  },
  team_commands: {
    label: 'Team Commands',
    description: 'Interactive chat demo with board items and overlay modes',
    icon: Terminal,
    category: 'interactive',
    color: '#ef4444',
  },
};

const categoryLabels: Record<string, { label: string; color: string }> = {
  hero: { label: 'Hero', color: '#8b5cf6' },
  content: { label: 'Content', color: '#3b82f6' },
  interactive: { label: 'Interactive', color: '#f59e0b' },
  showcase: { label: 'Showcase', color: '#06b6d4' },
};

// ─── Mini Wireframe Previews ────────────────────────────────────────────────

function SectionPreview({ sectionId }: { sectionId: string }) {
  const base = "w-full h-full rounded overflow-hidden relative";

  switch (sectionId) {
    case 'hero':
      return (
        <div className={`${base} bg-gradient-to-b from-gray-900 to-indigo-950`}>
          <div className="absolute inset-0 flex flex-col items-center justify-center p-3">
            <div className="w-6 h-1.5 bg-indigo-500/40 rounded mb-1.5" />
            <div className="w-16 h-1 bg-white/30 rounded mb-0.5" />
            <div className="w-12 h-1 bg-indigo-400/50 rounded mb-2" />
            <div className="w-8 h-2 bg-indigo-600/60 rounded-sm" />
          </div>
        </div>
      );
    case 'hero_alternative':
      return (
        <div className={`${base} bg-white`}>
          <div className="absolute inset-0 flex items-center p-3 gap-2">
            <div className="flex-1 space-y-1">
              <div className="w-12 h-1 bg-gray-300 rounded" />
              <div className="w-10 h-1 bg-purple-300 rounded" />
              <div className="w-6 h-1.5 bg-purple-400 rounded-sm mt-1.5" />
            </div>
            <div className="flex gap-0.5">
              <div className="w-4 h-5 bg-gray-200 rounded-sm" />
              <div className="w-4 h-5 bg-purple-100 rounded-sm" />
            </div>
          </div>
        </div>
      );
    case 'hero_outcome_cards':
      return (
        <div className={`${base} bg-white`}>
          <div className="absolute inset-0 p-2">
            <div className="w-12 h-1 bg-purple-300 rounded mx-auto mb-1.5" />
            <div className="grid grid-cols-3 gap-1">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-3 bg-purple-100 rounded-sm" />
              ))}
            </div>
          </div>
        </div>
      );
    case 'work_comparison':
      return (
        <div className={`${base} flex`}>
          <div className="flex-1 bg-gray-100 p-1.5">
            <div className="w-8 h-0.5 bg-gray-300 rounded mb-1" />
            <div className="space-y-0.5">
              <div className="h-1.5 bg-gray-200 rounded-sm" />
              <div className="h-1.5 bg-gray-200 rounded-sm" />
            </div>
          </div>
          <div className="flex-1 bg-gray-900 p-1.5">
            <div className="w-8 h-0.5 bg-gray-600 rounded mb-1" />
            <div className="space-y-0.5">
              <div className="h-1.5 bg-indigo-800 rounded-sm" />
              <div className="h-1.5 bg-indigo-800 rounded-sm" />
            </div>
          </div>
        </div>
      );
    case 'sidekick_capabilities':
      return (
        <div className={`${base} bg-gradient-to-br from-gray-900 to-gray-800`}>
          <div className="absolute inset-0 flex items-center p-2 gap-2">
            <div className="flex-1 space-y-1">
              <div className="w-10 h-0.5 bg-amber-400/50 rounded" />
              <div className="flex gap-0.5">
                <div className="w-5 h-2 bg-gray-700 rounded-sm" />
                <div className="w-5 h-2 bg-gray-700 rounded-sm" />
              </div>
            </div>
            <div className="w-10 h-8 bg-gray-700 rounded border border-gray-600" />
          </div>
        </div>
      );
    case 'sidekick':
      return (
        <div className={`${base} bg-gradient-to-br from-gray-900 to-orange-950`}>
          <div className="absolute inset-0 flex items-center p-2 gap-2">
            <div className="flex-1 space-y-1">
              <div className="w-10 h-0.5 bg-orange-400/50 rounded" />
              <div className="h-3 bg-gray-800 rounded border border-gray-700 p-0.5">
                <div className="w-6 h-0.5 bg-orange-500/30 rounded" />
              </div>
            </div>
            <div className="w-12 h-9 bg-gray-800 rounded border border-gray-700 p-1 space-y-0.5">
              <div className="h-1 bg-gray-700 rounded-sm" />
              <div className="h-1 bg-gray-700 rounded-sm" />
              <div className="h-1 bg-orange-800/50 rounded-sm" />
            </div>
          </div>
        </div>
      );
    case 'departments':
      return (
        <div className={`${base} bg-gray-950`}>
          <div className="absolute inset-0 p-2">
            <div className="flex gap-1 mb-1.5">
              <div className="w-5 h-1.5 bg-blue-600 rounded-sm" />
              <div className="w-5 h-1.5 bg-gray-700 rounded-sm" />
              <div className="w-5 h-1.5 bg-gray-700 rounded-sm" />
            </div>
            <div className="flex gap-1">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex-1 h-5 bg-gray-800 rounded-sm p-0.5">
                  <div className="w-2 h-2 bg-blue-500/30 rounded-full mx-auto" />
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    case 'ai_platform':
      return (
        <div className={`${base} bg-gray-950 flex`}>
          <div className="w-5 bg-gray-900 border-r border-gray-800 p-0.5 space-y-0.5">
            <div className="w-full h-1.5 bg-indigo-800 rounded-sm" />
            <div className="w-full h-1.5 bg-gray-800 rounded-sm" />
            <div className="w-full h-1.5 bg-gray-800 rounded-sm" />
          </div>
          <div className="flex-1 p-1.5 space-y-1">
            <div className="flex gap-0.5">
              <div className="w-4 h-1 bg-indigo-700 rounded-sm" />
              <div className="w-4 h-1 bg-gray-700 rounded-sm" />
            </div>
            <div className="h-5 bg-gray-800 rounded border border-gray-700" />
          </div>
        </div>
      );
    case 'project_management':
      return (
        <div className={`${base} bg-gray-950`}>
          <div className="absolute inset-0 p-2 space-y-0.5">
            <div className="h-2 bg-emerald-900/40 rounded-sm border border-emerald-800/30 flex items-center px-0.5">
              <div className="w-3 h-0.5 bg-emerald-500/40 rounded" />
            </div>
            <div className="h-2 bg-blue-900/30 rounded-sm border border-blue-800/30" />
            <div className="h-2 bg-purple-900/30 rounded-sm border border-purple-800/30" />
            <div className="h-2 bg-pink-900/30 rounded-sm border border-pink-800/30" />
          </div>
        </div>
      );
    case 'agents_showcase':
      return (
        <div className={`${base} bg-gradient-to-br from-cyan-950 to-gray-900`}>
          <div className="absolute inset-0 p-2">
            <div className="w-10 h-0.5 bg-cyan-400/50 rounded mb-1.5 mx-auto" />
            <div className="grid grid-cols-3 gap-1">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-3 bg-cyan-900/40 rounded-sm border border-cyan-800/30 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-cyan-500/30 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    case 'teams_and_agents':
      return (
        <div className={`${base} bg-gradient-to-b from-gray-900 to-purple-950`}>
          <div className="absolute inset-0 p-2 flex flex-col items-center">
            <div className="w-10 h-0.5 bg-purple-400/50 rounded mb-2" />
            <div className="flex gap-1 items-end">
              <div className="w-3 h-4 bg-purple-800/50 rounded-sm" />
              <div className="w-4 h-5 bg-purple-700/50 rounded-sm" />
              <div className="w-3 h-4 bg-purple-800/50 rounded-sm" />
            </div>
          </div>
        </div>
      );
    case 'teams_and_agents_v2':
      return (
        <div className={`${base} bg-gradient-to-b from-gray-900 to-violet-950`}>
          <div className="absolute inset-0 p-2">
            <div className="flex gap-1 mb-1.5">
              <div className="w-5 h-1 bg-violet-600 rounded-sm" />
              <div className="w-5 h-1 bg-gray-700 rounded-sm" />
            </div>
            <div className="flex gap-1">
              <div className="flex-1 flex flex-col items-center gap-0.5">
                <div className="w-4 h-4 bg-violet-800/50 rounded-full" />
                <div className="w-3 h-0.5 bg-violet-500/30 rounded" />
              </div>
              <div className="flex-1 flex flex-col items-center gap-0.5">
                <div className="w-4 h-4 bg-violet-800/50 rounded-full" />
                <div className="w-3 h-0.5 bg-violet-500/30 rounded" />
              </div>
            </div>
          </div>
        </div>
      );
    case 'ai_platform_architecture':
      return (
        <div className={`${base} bg-gray-950`}>
          <div className="absolute inset-0 p-1.5">
            <div className="h-full bg-gray-900 rounded border border-gray-700 p-1 flex flex-col">
              <div className="flex gap-0.5 mb-1">
                <div className="w-1 h-1 bg-red-500/60 rounded-full" />
                <div className="w-1 h-1 bg-yellow-500/60 rounded-full" />
                <div className="w-1 h-1 bg-green-500/60 rounded-full" />
              </div>
              <div className="flex-1 flex gap-1">
                <div className="w-4 bg-gray-800 rounded-sm" />
                <div className="flex-1 bg-gray-800 rounded-sm p-0.5">
                  <div className="w-full h-0.5 bg-teal-500/30 rounded mb-0.5" />
                  <div className="w-3/4 h-0.5 bg-gray-700 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    case 'team_commands':
      return (
        <div className={`${base} bg-gradient-to-br from-gray-900 to-red-950`}>
          <div className="absolute inset-0 flex items-center p-2 gap-2">
            <div className="flex-1 space-y-0.5">
              <div className="flex items-center gap-0.5">
                <div className="w-2 h-2 bg-red-500/30 rounded-full" />
                <div className="w-8 h-1.5 bg-gray-800 rounded border border-gray-700" />
              </div>
              <div className="flex items-center gap-0.5 justify-end">
                <div className="w-6 h-1.5 bg-red-900/40 rounded border border-red-800/30" />
                <div className="w-2 h-2 bg-blue-500/30 rounded-full" />
              </div>
            </div>
            <div className="w-10 h-8 bg-gray-800 rounded border border-gray-700 p-0.5 space-y-0.5">
              <div className="h-1 bg-gray-700 rounded-sm" />
              <div className="h-1 bg-gray-700 rounded-sm" />
              <div className="h-1 bg-red-800/40 rounded-sm" />
            </div>
          </div>
        </div>
      );
    default:
      return <div className={`${base} bg-gray-800`} />;
  }
}

// Sortable Section Card Component
interface SortableSectionCardProps {
  id: string;
  isVisible: boolean;
  onToggle: () => void;
  index: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

function SortableSectionCard({ id, isVisible, onToggle, index, isExpanded, onToggleExpand }: SortableSectionCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  const meta = sectionMeta[id];
  if (!meta) return null;

  const cat = categoryLabels[meta.category];
  const IconComp = meta.icon;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-xl border transition-all ${
        isDragging
          ? 'shadow-2xl ring-2 ring-indigo-500 bg-gray-800'
          : isVisible
            ? 'bg-gray-800/80 border-gray-700/60 hover:border-gray-600'
            : 'bg-gray-900/60 border-gray-800/40 opacity-55 hover:opacity-75'
      }`}
    >
      <div className="flex items-center gap-3 p-3.5">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1.5 hover:bg-gray-700 rounded-lg flex-shrink-0"
        >
          <GripVertical className="w-4 h-4 text-gray-600" />
        </div>

        {/* Order Number */}
        <div className="w-6 h-6 rounded-md bg-gray-700/50 flex items-center justify-center flex-shrink-0">
          <span className="text-[10px] font-bold text-gray-400">{index + 1}</span>
        </div>

        {/* Mini Preview Thumbnail */}
        <button
          onClick={onToggleExpand}
          className="w-14 h-10 rounded-lg overflow-hidden border border-gray-700/60 flex-shrink-0 hover:border-gray-600 transition-colors cursor-pointer"
        >
          <SectionPreview sectionId={id} />
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-white font-medium text-sm">{meta.label}</span>
            <span
              className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
              style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
            >
              {cat.label}
            </span>
          </div>
          <p className="text-gray-500 text-xs truncate">{meta.description}</p>
        </div>

        {/* Preview expand button */}
        <button
          onClick={onToggleExpand}
          className={`p-1.5 rounded-lg transition-all flex-shrink-0 ${
            isExpanded ? 'bg-indigo-600/20 text-indigo-400' : 'text-gray-600 hover:bg-gray-700 hover:text-gray-400'
          }`}
          title="Toggle preview"
        >
          <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>

        {/* Visibility Toggle */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          {isVisible ? (
            <Eye className="w-4 h-4 text-emerald-400" />
          ) : (
            <EyeOff className="w-4 h-4 text-gray-600" />
          )}
          <button
            onClick={onToggle}
            className={`relative w-11 h-6 rounded-full transition-colors ${
              isVisible ? 'bg-emerald-500' : 'bg-gray-700'
            }`}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all shadow-sm ${
                isVisible ? 'left-5' : 'left-0.5'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Expanded Live Preview */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-0">
          <div className="bg-gray-950 rounded-xl border border-gray-700/40 overflow-hidden">
            {/* Live iframe preview */}
            <div className="relative w-full" style={{ height: '280px' }}>
              <div className="absolute inset-0 overflow-hidden rounded-t-xl">
                <iframe
                  src={`/preview/${id}`}
                  title={`Preview: ${meta.label}`}
                  className="border-0 origin-top-left"
                  style={{
                    width: '1440px',
                    height: '900px',
                    transform: 'scale(0.65)',
                    transformOrigin: 'top left',
                    pointerEvents: 'none',
                  }}
                />
              </div>
              {/* Gradient fade at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-950 to-transparent" />
              {/* Live badge */}
              <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-[10px] text-emerald-400 font-medium">LIVE</span>
              </div>
            </div>
            <div className="p-3 border-t border-gray-700/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconComp className="w-4 h-4" style={{ color: meta.color }} />
                <span className="text-white text-sm font-medium">{meta.label}</span>
                <span className="text-gray-600 text-xs">— {meta.description}</span>
              </div>
              <a
                href={`/preview/${id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Open full preview
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface SiteSettingsEditorProps {
  onBack?: () => void;
}

export function SiteSettingsEditor({ onBack }: SiteSettingsEditorProps) {
  const [settings, setSettings] = useState<SiteSettings>({
    hero_title: 'What would you like to achieve?',
    hero_subtitle: 'Choose your department to see your tailored AI solution',
    tabs: [
      { id: '1', label: 'Department', icon: 'Building', order_index: 0, enabled: true },
      { id: '2', label: 'Outcome', icon: 'Target', order_index: 1, enabled: true },
      { id: '3', label: 'Pain Point', icon: 'AlertCircle', order_index: 2, enabled: true },
      { id: '4', label: 'AI Transformation', icon: 'Sparkles', order_index: 3, enabled: true },
      { id: '5', label: 'Custom Solution', icon: 'Wand', order_index: 4, enabled: true },
    ],
    sections_visibility: defaultSectionsVisibility,
    sections_order: defaultSectionsOrder,
    hero_settings: defaultHeroSettings,
    solution_tabs_visibility: defaultSolutionTabsVisibility,
    teams_agents_v2_layout: 'mixed_circle',
    team_flanked_featured_agents: {},
    ai_platform_arch_layout: 'app_frame_canvas',
    platform_architecture_variant: 'classic',
    platform_page_version: 'v1',
    platform_context_toggle: false,
    platform_sidekick_panel_style: 'right_overlay',
    platform_v3_team_avatars: 'header_row',
    platform_v3_minimal_chat: false,
    platform_sidebar_left: false,
    platform_v4_left_panel: 'sidekick_chat',
    platform_showcase_section: false,
    platform_show_jtbd_sidebar: true,
    platform_show_inline_sidekick: false,
    platform_show_department_bar: true,
    platform_showcase_show_jtbd_sidebar: true,
    platform_showcase_show_inline_sidekick: false,
    platform_showcase_show_department_bar: 'horizontal',
    platform_showcase_variant: 'classic',
    platform_show_intro: false,
    platform_intro_style: 'unified',
    platform_hero_variant: 'typewriter',
    platform_use_cases_variant: 'cards_grid',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activePanel, setActivePanel] = useState<'sections' | 'hero' | 'tabs'>('sections');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bgImageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single();

      if (data && !error) {
        // Ensure all tabs have the enabled property (for backward compatibility)
        const tabsWithEnabled = (data.tabs || settings.tabs).map((tab: TabItem) => ({
          ...tab,
          enabled: tab.enabled !== undefined ? tab.enabled : true,
        }));
        
        // Extract _order and _teams_agents_v2_layout from sections_visibility if they exist
        const sectionsVisibilityData = data.sections_visibility || {};
        const { _order, _teams_agents_v2_layout, _team_flanked_featured_agents, _ai_platform_arch_layout, _platform_architecture_variant, _platform_page_version, _platform_context_toggle, _platform_sidekick_panel_style, _platform_v3_team_avatars, _platform_v3_minimal_chat, _platform_sidebar_left, _platform_v4_left_panel, _platform_showcase_section, _platform_show_jtbd_sidebar, _platform_show_inline_sidekick, _platform_show_department_bar, _platform_showcase_show_jtbd_sidebar, _platform_showcase_show_inline_sidekick, _platform_showcase_show_department_bar, _platform_showcase_variant, _platform_show_intro, _platform_intro_style, _platform_hero_variant, _platform_use_cases_variant, ...sectionsVisibilityWithoutOrder } = sectionsVisibilityData;
        
        setSettings({
          hero_title: data.hero_title || settings.hero_title,
          hero_subtitle: data.hero_subtitle || settings.hero_subtitle,
          tabs: tabsWithEnabled,
          sections_visibility: (() => {
            const merged = { ...defaultSectionsVisibility, ...sectionsVisibilityWithoutOrder };
            console.log('Loaded sections_visibility from DB:', data.sections_visibility);
            console.log('Merged with defaults:', merged);
            return merged;
          })(),
          sections_order: (() => {
            const savedOrder = _order || data.sections_order || defaultSectionsOrder;
            // Append any new sections from defaults that aren't in the saved order
            const missingSections = defaultSectionsOrder.filter(s => !savedOrder.includes(s));
            return [...savedOrder, ...missingSections];
          })(),
          hero_settings: { ...defaultHeroSettings, ...data.hero_settings },
          solution_tabs_visibility: data.solution_tabs_visibility || defaultSolutionTabsVisibility,
          teams_agents_v2_layout: _teams_agents_v2_layout || 'mixed_circle',
          team_flanked_featured_agents: _team_flanked_featured_agents || {},
          ai_platform_arch_layout: _ai_platform_arch_layout || 'app_frame_canvas',
          platform_architecture_variant: _platform_architecture_variant || 'classic',
          platform_page_version: _platform_page_version || 'v1',
          platform_context_toggle: _platform_context_toggle ?? false,
          platform_sidekick_panel_style: _platform_sidekick_panel_style || 'right_overlay',
          platform_v3_team_avatars: _platform_v3_team_avatars || 'header_row',
          platform_v3_minimal_chat: _platform_v3_minimal_chat ?? false,
          platform_sidebar_left: _platform_sidebar_left ?? false,
          platform_v4_left_panel: _platform_v4_left_panel || 'sidekick_chat',
          platform_showcase_section: _platform_showcase_section ?? false,
          platform_show_jtbd_sidebar: _platform_show_jtbd_sidebar ?? true,
          platform_show_inline_sidekick: _platform_show_inline_sidekick ?? false,
          platform_show_department_bar: _platform_show_department_bar ?? true,
          platform_showcase_show_jtbd_sidebar: _platform_showcase_show_jtbd_sidebar ?? true,
          platform_showcase_show_inline_sidekick: _platform_showcase_show_inline_sidekick ?? false,
          platform_showcase_show_department_bar: typeof _platform_showcase_show_department_bar === 'boolean'
            ? (_platform_showcase_show_department_bar ? 'horizontal' : 'none')
            : (_platform_showcase_show_department_bar || 'horizontal'),
          platform_showcase_variant: _platform_showcase_variant || 'classic',
          platform_show_intro: _platform_show_intro ?? false,
          platform_intro_style: _platform_intro_style || 'unified',
          platform_hero_variant: _platform_hero_variant || 'typewriter',
          platform_use_cases_variant: _platform_use_cases_variant || 'cards_grid',
        });
      }
    } catch (err) {
      console.log('No settings found, using defaults');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      console.log('Saving sections_visibility:', settings.sections_visibility);
      
      // Store sections_order and teams_agents_v2_layout inside sections_visibility JSONB
      const sectionsVisibilityWithExtras = {
        ...settings.sections_visibility,
        _order: settings.sections_order,
        _teams_agents_v2_layout: settings.teams_agents_v2_layout,
        _team_flanked_featured_agents: settings.team_flanked_featured_agents,
        _ai_platform_arch_layout: settings.ai_platform_arch_layout,
        _platform_architecture_variant: settings.platform_architecture_variant,
        _platform_page_version: settings.platform_page_version,
        _platform_context_toggle: settings.platform_context_toggle,
        _platform_sidekick_panel_style: settings.platform_sidekick_panel_style,
        _platform_v3_team_avatars: settings.platform_v3_team_avatars,
        _platform_v3_minimal_chat: settings.platform_v3_minimal_chat,
        _platform_sidebar_left: settings.platform_sidebar_left,
        _platform_v4_left_panel: settings.platform_v4_left_panel,
        _platform_showcase_section: settings.platform_showcase_section,
        _platform_show_jtbd_sidebar: settings.platform_show_jtbd_sidebar,
        _platform_show_inline_sidekick: settings.platform_show_inline_sidekick,
        _platform_show_department_bar: settings.platform_show_department_bar,
        _platform_showcase_show_jtbd_sidebar: settings.platform_showcase_show_jtbd_sidebar,
        _platform_showcase_show_inline_sidekick: settings.platform_showcase_show_inline_sidekick,
        _platform_showcase_show_department_bar: settings.platform_showcase_show_department_bar,
        _platform_showcase_variant: settings.platform_showcase_variant,
        _platform_show_intro: settings.platform_show_intro,
        _platform_intro_style: settings.platform_intro_style,
        _platform_hero_variant: settings.platform_hero_variant,
        _platform_use_cases_variant: settings.platform_use_cases_variant,
      };
      
      const { error: updateError } = await supabase
        .from('site_settings')
        .upsert({
          id: 'main',
          hero_title: settings.hero_title,
          hero_subtitle: settings.hero_subtitle,
          tabs: settings.tabs,
          sections_visibility: sectionsVisibilityWithExtras,
          hero_settings: settings.hero_settings,
          solution_tabs_visibility: settings.solution_tabs_visibility,
          updated_at: new Date().toISOString(),
        });

      if (updateError) {
        console.error('Save error:', updateError);
        alert('Save failed: ' + updateError.message);
      } else {
        console.log('Save successful!');
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setSaving(false);
    }
  };

  const toggleSection = (section: keyof SectionsVisibility) => {
    setSettings({
      ...settings,
      sections_visibility: {
        ...settings.sections_visibility,
        [section]: !settings.sections_visibility[section],
      },
    });
  };

  const toggleSolutionTab = (tab: keyof SolutionTabsVisibility) => {
    setSettings({
      ...settings,
      solution_tabs_visibility: {
        ...settings.solution_tabs_visibility,
        [tab]: !settings.solution_tabs_visibility[tab],
      },
    });
  };

  // Drag and drop sensors and handlers
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = settings.sections_order.indexOf(active.id as string);
      const newIndex = settings.sections_order.indexOf(over.id as string);
      
      const newOrder = arrayMove(settings.sections_order, oldIndex, newIndex);
      
      setSettings({
        ...settings,
        sections_order: newOrder,
      });
    }
  };

  const updateHeroSettings = (field: keyof HeroSettings, value: string) => {
    setSettings({
      ...settings,
      hero_settings: {
        ...settings.hero_settings,
        [field]: value,
      },
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateHeroSettings('logo_url', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBgImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateHeroSettings('background_image_url', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateTab = (id: string, field: string, value: string) => {
    setSettings({
      ...settings,
      tabs: settings.tabs.map(tab => 
        tab.id === id ? { ...tab, [field]: value } : tab
      )
    });
  };

  const addTab = () => {
    const newTab: TabItem = {
      id: Date.now().toString(),
      label: 'New Tab',
      icon: 'Star',
      order_index: settings.tabs.length,
      enabled: true,
    };
    setSettings({
      ...settings,
      tabs: [...settings.tabs, newTab]
    });
  };

  const removeTab = (id: string) => {
    setSettings({
      ...settings,
      tabs: settings.tabs.filter(tab => tab.id !== id)
    });
  };

  const iconOptions = [
    'Building', 'Target', 'AlertCircle', 'Sparkles', 'Wand', 'Star', 
    'Zap', 'Users', 'TrendingUp', 'Shield', 'Code', 'Heart',
    'Lightbulb', 'Rocket', 'Globe', 'Settings'
  ];

  if (loading) {
    return <div className="text-gray-400">Loading settings...</div>;
  }

  // Section labels are now managed via sectionMeta above

  const solutionTabLabels: Record<keyof SolutionTabsVisibility, string> = {
    overview: 'Overview',
    inAction: 'In Action',
    businessValue: 'Business Value',
    test: 'Test',
    products: 'AI-powered Products',
    capabilities: 'AI Work Capabilities',
  };

  const fontSizeOptions = [
    { value: 'small', label: 'Small', size: '1.5rem' },
    { value: 'medium', label: 'Medium', size: '2.25rem' },
    { value: 'large', label: 'Large', size: '3rem' },
    { value: 'xlarge', label: 'Extra Large', size: '3.75rem' },
  ];

  return (
    <div className="max-w-4xl">
      {/* Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>
      )}

      {/* Panel Tabs */}
      <div className="flex gap-2 mb-6">
        {(['sections', 'hero', 'tabs'] as const).map((panel) => (
          <button
            key={panel}
            onClick={() => setActivePanel(panel)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activePanel === panel
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            {panel === 'sections' ? 'Sections' : panel === 'hero' ? 'Hero Editor' : 'Navigation Tabs'}
          </button>
        ))}
      </div>

      {/* Sections Visibility Panel */}
      {activePanel === 'sections' && (
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white">Section Visibility & Order</h2>
              <p className="text-gray-400 text-sm mt-1">
                Drag to reorder, toggle visibility. Each section represents a distinct visual block on the page.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              {Object.entries(categoryLabels).map(([key, cat]) => (
                <span key={key} className="flex items-center gap-1.5 px-2 py-1 rounded-full" style={{ backgroundColor: `${cat.color}15`, color: cat.color }}>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                  {cat.label}
                </span>
              ))}
            </div>
          </div>

          {/* Summary bar */}
          <div className="flex gap-3 mb-5">
            <div className="flex-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-4 py-2.5 flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400 text-sm font-medium">
                {Object.values(settings.sections_visibility).filter(Boolean).length} visible
              </span>
            </div>
            <div className="flex-1 bg-gray-800/60 border border-gray-700/40 rounded-lg px-4 py-2.5 flex items-center gap-2">
              <EyeOff className="w-4 h-4 text-gray-500" />
              <span className="text-gray-500 text-sm font-medium">
                {Object.values(settings.sections_visibility).filter(v => !v).length} hidden
              </span>
            </div>
          </div>
          
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={settings.sections_order}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {settings.sections_order.map((sectionId, idx) => {
                  const section = sectionId as keyof SectionsVisibility;
                  // Skip if section doesn't exist in visibility settings
                  if (!(section in settings.sections_visibility)) return null;
                  
                  return (
                    <SortableSectionCard
                      key={section}
                      id={section}
                      isVisible={settings.sections_visibility[section]}
                      onToggle={() => toggleSection(section)}
                      index={idx}
                      isExpanded={expandedSection === section}
                      onToggleExpand={() => setExpandedSection(expandedSection === section ? null : section)}
                    />
                  );
                })}
              </div>
            </SortableContext>
          </DndContext>

          {/* Teams & Agents V2 Layout Variant Selector */}
          {settings.sections_visibility.teams_and_agents_v2 && (
            <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-indigo-500/30">
              <h3 className="text-md font-semibold text-white mb-3">Teams & Agents V2 - Layout Variant</h3>
              <p className="text-gray-400 text-xs mb-4">Choose the visual layout for the Teams & Agents V2 section.</p>
              <div className="grid grid-cols-2 gap-3">
                {([
                  { value: 'mixed_circle' as TeamsAgentsV2Layout, label: 'Mixed Circle', desc: 'Team and agents in a unified circular arrangement' },
                  { value: 'team_with_agents' as TeamsAgentsV2Layout, label: 'Team + Agents Below', desc: 'Team on top, complementary agents below' },
                  { value: 'side_by_side_unified' as TeamsAgentsV2Layout, label: 'Side by Side (Unified)', desc: 'Left/right with flowing gradient connection' },
                  { value: 'cards_layout' as TeamsAgentsV2Layout, label: 'Cards', desc: 'Cards pairing each team member with an AI agent' },
                  { value: 'team_flanked' as TeamsAgentsV2Layout, label: 'Team Flanked', desc: 'Team in center, agents flanking from both sides' },
                ]).map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSettings({
                      ...settings,
                      teams_agents_v2_layout: option.value,
                    })}
                    className={`p-3 rounded-lg text-left transition-all ${
                      settings.teams_agents_v2_layout === option.value
                        ? 'bg-indigo-600/30 border-2 border-indigo-500 ring-1 ring-indigo-400/30'
                        : 'bg-gray-700/50 border-2 border-transparent hover:bg-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <span className={`block text-sm font-medium ${
                      settings.teams_agents_v2_layout === option.value ? 'text-indigo-300' : 'text-white'
                    }`}>
                      {option.label}
                    </span>
                    <span className="block text-xs text-gray-400 mt-1">{option.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* AI Platform Architecture Layout Variant Selector */}
          {settings.sections_visibility.ai_platform_architecture && (
            <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-cyan-500/30">
              <h3 className="text-md font-semibold text-white mb-3">AI Platform Architecture - Layout Variant</h3>
              <p className="text-gray-400 text-xs mb-4">Choose the visual style. Both show a unified system with agents working in parallel.</p>
              <div className="grid grid-cols-2 gap-3">
                {([
                  { value: 'app_frame_board' as AIPlatformArchLayout, label: 'App Frame - Board', desc: 'monday-board-style view with large agent rows, clear AI identity, use-case header, and instruction flow' },
                  { value: 'app_frame_canvas' as AIPlatformArchLayout, label: 'App Frame - Canvas', desc: 'Agent workstations on a visual canvas: each agent has a positioned desk showing task, activity detail, and progress' },
                  { value: 'app_frame_list' as AIPlatformArchLayout, label: 'App Frame - List', desc: 'Structured board with rows: each agent on a line with task detail, progress bar, and status' },
                ]).map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSettings({
                      ...settings,
                      ai_platform_arch_layout: option.value,
                    })}
                    className={`p-3 rounded-lg text-left transition-all ${
                      settings.ai_platform_arch_layout === option.value
                        ? 'bg-cyan-600/30 border-2 border-cyan-500 ring-1 ring-cyan-400/30'
                        : 'bg-gray-700/50 border-2 border-transparent hover:bg-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <span className={`block text-sm font-medium ${
                      settings.ai_platform_arch_layout === option.value ? 'text-cyan-300' : 'text-white'
                    }`}>
                      {option.label}
                    </span>
                    <span className="block text-xs text-gray-400 mt-1">{option.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Architecture Variant (Classic vs Restructured) */}
          {settings.sections_visibility.ai_platform_architecture && (
            <div className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-purple-500/30">
              <h3 className="text-md font-semibold text-white mb-2">Architecture Layout</h3>
              <p className="text-gray-400 text-xs mb-3">Choose between the original concentric layout or the new restructured top-down flow.</p>
              <select
                value={settings.platform_architecture_variant}
                onChange={(e) => setSettings({ ...settings, platform_architecture_variant: e.target.value as 'classic' | 'restructured' })}
                className="w-full bg-gray-700 text-white text-sm rounded-lg px-3 py-2 border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              >
                <option value="classic">Classic (concentric rings)</option>
                <option value="restructured">Restructured (top-down flow)</option>
              </select>
            </div>
          )}

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          {/* GROUP 1 — Page Version                                       */}
          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <div className="mt-6 rounded-xl border-l-4 border-purple-500 bg-gray-800/50 border border-gray-700/60 overflow-hidden">
            <div className="px-5 py-4">
              <h3 className="text-md font-semibold text-white mb-1">Page Version</h3>
              <p className="text-gray-400 text-xs mb-4">Choose which layout version of the platform page to display.</p>
              <div className="grid grid-cols-4 gap-3">
                {([
                  { value: 'v1' as const, label: 'V1 — Sidebar', desc: 'Dept bar + JTBD sidebar + board' },
                  { value: 'v2' as const, label: 'V2 — Unified', desc: 'Dept pills, team, JTBD tabs in one card' },
                  { value: 'v3' as const, label: 'V3 — Sidekick', desc: 'Sidekick chat sidebar + board' },
                  { value: 'v4' as const, label: 'V4 — Platform Card', desc: 'Card frame + board with avatar header' },
                ]).map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSettings({ ...settings, platform_page_version: option.value })}
                    className={`p-3 rounded-lg text-left transition-all ${
                      settings.platform_page_version === option.value
                        ? 'bg-purple-600/30 border-2 border-purple-500 ring-1 ring-purple-400/30'
                        : 'bg-gray-700/50 border-2 border-transparent hover:bg-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <span className={`block text-sm font-medium ${
                      settings.platform_page_version === option.value ? 'text-purple-300' : 'text-white'
                    }`}>{option.label}</span>
                    <span className="block text-xs text-gray-400 mt-1">{option.desc}</span>
                  </button>
                ))}
              </div>

              {/* V4 sub-option */}
              {settings.platform_page_version === 'v4' && (
                <div className="mt-4 pt-4 border-t border-gray-700/50">
                  <p className="text-sm text-gray-300 mb-2">V4 Left Panel Style</p>
                  <div className="flex gap-2">
                    {[
                      { value: 'sidekick_chat' as const, label: 'Sidekick Chat', desc: 'Chat sidebar with JTBD options' },
                      { value: 'v1_sidebar' as const, label: 'V1 Sidebar', desc: 'Department list + JTBD buttons' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setSettings({ ...settings, platform_v4_left_panel: opt.value })}
                        className={`flex-1 p-3 rounded-lg border text-left transition-all ${
                          settings.platform_v4_left_panel === opt.value
                            ? 'border-purple-500 bg-purple-500/10'
                            : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
                        }`}
                      >
                        <p className={`text-sm font-medium ${settings.platform_v4_left_panel === opt.value ? 'text-purple-300' : 'text-gray-300'}`}>{opt.label}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          {/* GROUP 1.25 — Hero Variant                                     */}
          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <div className="mt-5 rounded-xl border-l-4 border-cyan-500 bg-gray-800/50 border border-gray-700/60 overflow-hidden">
            <div className="px-5 py-4">
              <h3 className="text-md font-semibold text-white mb-1">Hero Style</h3>
              <p className="text-gray-400 text-xs mb-4">Choose the visual style for the platform hero section at the top of the page.</p>
              <div className="grid grid-cols-2 gap-3">
                {([
                  { value: 'typewriter' as const, label: 'Typewriter', desc: 'Clean white background with animated typewriter text effect', icon: '⌨️' },
                  { value: 'gradient_wave' as const, label: 'Gradient Wave', desc: 'Dark gradient background with animated flowing wave and glowing text', icon: '🌊' },
                  { value: 'bold_statement' as const, label: 'Bold Statement', desc: 'Full-screen dark hero with large gradient headline and floating particles', icon: '✨' },
                  { value: 'glassmorphism' as const, label: 'Glassmorphism', desc: 'Modern frosted glass cards floating over an animated gradient mesh', icon: '🪟' },
                  { value: 'spotlight' as const, label: 'Spotlight', desc: 'Minimal white hero with radial spotlight and refined typography contrast', icon: '💡' },
                  { value: 'orbit' as const, label: 'Orbit', desc: 'Animated concentric rings with orbiting icons around the Sidekick logo', icon: '🪐' },
                  { value: 'split' as const, label: 'Split', desc: 'Two-column layout with animated platform layer cards on the right', icon: '📐' },
                  { value: 'reveal' as const, label: 'Reveal', desc: 'Staggered letter reveal animation with animated stat counters', icon: '🎬' },
                  { value: 'spotlight_v2' as const, label: 'Spotlight V2', desc: 'Stacked title lines with breathing glow and "Powered by" badge', icon: '💡' },
                  { value: 'spotlight_v3' as const, label: 'Spotlight V3', desc: 'Horizontal rules framing the title with mono-spaced label', icon: '✦' },
                  { value: 'spotlight_v4' as const, label: 'Spotlight V4', desc: 'Floating dots, gradient underline and capability badges', icon: '◆' },
                ]).map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSettings({ ...settings, platform_hero_variant: option.value })}
                    className={`p-3 rounded-lg text-left transition-all ${
                      settings.platform_hero_variant === option.value
                        ? 'bg-cyan-600/30 border-2 border-cyan-500 ring-1 ring-cyan-400/30'
                        : 'bg-gray-700/50 border-2 border-transparent hover:bg-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <span className="text-lg mb-1 block">{option.icon}</span>
                    <span className={`block text-sm font-medium ${
                      settings.platform_hero_variant === option.value ? 'text-cyan-300' : 'text-white'
                    }`}>{option.label}</span>
                    <span className="block text-xs text-gray-400 mt-1">{option.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          {/* GROUP 1.5 — Workspace Intro                                  */}
          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <div className="mt-5 rounded-xl border-l-4 border-amber-500 bg-gray-800/50 border border-gray-700/60 overflow-hidden">
            <div className="px-5 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-md font-semibold text-white">Workspace Intro</h3>
                  <p className="text-gray-400 text-xs mt-0.5">Show an animated team intro when the workspace loads. Displays the department avatar and AI agents with a &quot;Start working together&quot; CTA.</p>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, platform_show_intro: !settings.platform_show_intro })}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${
                    settings.platform_show_intro ? 'bg-amber-600' : 'bg-gray-600'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.platform_show_intro ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {/* Intro style selector — only when intro is ON */}
              {settings.platform_show_intro && (
                <div className="mt-4 pt-3 border-t border-gray-700/40">
                  <p className="text-sm text-gray-300 mb-2">Intro Layout</p>
                  <p className="text-gray-500 text-xs mb-3">How the department avatar and agents appear in the intro screen.</p>
                  <div className="flex gap-2">
                    {[
                      { value: 'unified' as const, label: 'Unified Squad', desc: 'Overlapping avatars as one team' },
                      { value: 'with_plus' as const, label: 'Dept + Agents', desc: 'Department avatar, then "+" separator, then agents' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setSettings({ ...settings, platform_intro_style: opt.value })}
                        className={`flex-1 p-3 rounded-lg border text-left transition-all ${
                          settings.platform_intro_style === opt.value
                            ? 'border-amber-500 bg-amber-500/10'
                            : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
                        }`}
                      >
                        <p className={`text-sm font-medium ${settings.platform_intro_style === opt.value ? 'text-amber-300' : 'text-gray-300'}`}>{opt.label}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          {/* GROUP 2 — Header                                             */}
          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <div className="mt-5 rounded-xl border-l-4 border-blue-500 bg-gray-800/50 border border-gray-700/60 overflow-hidden">
            <div className="px-5 py-4">
              <h3 className="text-md font-semibold text-white mb-1">Header</h3>
              <p className="text-gray-400 text-xs mb-4">The area between the hero and the workspace.</p>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm text-gray-200 font-medium">Department Bar</p>
                  <p className="text-gray-500 text-xs mt-0.5">Show the department selection strip between the hero and the workspace.</p>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, platform_show_department_bar: !settings.platform_show_department_bar })}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${
                    settings.platform_show_department_bar ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.platform_show_department_bar ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          {/* GROUP 3 — Side Panel                                         */}
          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <div className="mt-5 rounded-xl border-l-4 border-sky-500 bg-gray-800/50 border border-gray-700/60 overflow-hidden">
            <div className="px-5 py-4 space-y-0">
              <h3 className="text-md font-semibold text-white mb-1">Side Panel (beside the board)</h3>
              <p className="text-gray-400 text-xs mb-4">The panel that sits next to the workspace board. In V1 it shows the task list, in V3 the Sidekick chat, in V4 it&apos;s configurable.</p>

              {/* Show Side Panel */}
              <div className="flex items-center justify-between py-3 border-b border-gray-700/40">
                <div>
                  <p className="text-sm text-gray-200 font-medium">Show Side Panel</p>
                  <p className="text-gray-500 text-xs mt-0.5">Show the panel beside the workspace board.</p>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, platform_show_jtbd_sidebar: !settings.platform_show_jtbd_sidebar })}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${
                    settings.platform_show_jtbd_sidebar ? 'bg-sky-600' : 'bg-gray-600'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.platform_show_jtbd_sidebar ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {/* Side Panel Content — only meaningful when V4 */}
              <div className={`flex items-center justify-between py-3 ${settings.platform_page_version !== 'v4' ? 'opacity-40' : ''}`}>
                <div>
                  <p className="text-sm text-gray-200 font-medium">Side Panel Content</p>
                  <p className="text-gray-500 text-xs mt-0.5">What to show in the side panel: Sidekick Chat or Task List. (Applies to Platform Card / V4 layout.)</p>
                </div>
                <div className="flex rounded-lg overflow-hidden border border-gray-600 flex-shrink-0">
                  <button
                    onClick={() => setSettings({ ...settings, platform_v4_left_panel: 'sidekick_chat' })}
                    className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                      (settings.platform_v4_left_panel || 'sidekick_chat') === 'sidekick_chat'
                        ? 'bg-sky-600 text-white'
                        : 'bg-gray-700 text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    Sidekick Chat
                  </button>
                  <button
                    onClick={() => setSettings({ ...settings, platform_v4_left_panel: 'v1_sidebar' })}
                    className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                      settings.platform_v4_left_panel === 'v1_sidebar'
                        ? 'bg-sky-600 text-white'
                        : 'bg-gray-700 text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    Task List
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          {/* GROUP 4 — Inside the Board                                   */}
          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <div className="mt-5 rounded-xl border-l-4 border-indigo-500 bg-gray-800/50 border border-gray-700/60 overflow-hidden">
            <div className="px-5 py-4 space-y-0">
              <h3 className="text-md font-semibold text-white mb-1">Inside the Board</h3>
              <p className="text-gray-400 text-xs mb-4">Elements that appear inside the workspace board itself.</p>

              {/* Inline Sidekick Chat */}
              <div className="flex items-center justify-between py-3 border-b border-gray-700/40">
                <div>
                  <p className="text-sm text-gray-200 font-medium">Inline Sidekick Chat</p>
                  <p className="text-gray-500 text-xs mt-0.5">Show a persistent Sidekick chat column on the left side inside the board.</p>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, platform_show_inline_sidekick: !settings.platform_show_inline_sidekick })}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${
                    settings.platform_show_inline_sidekick ? 'bg-indigo-600' : 'bg-gray-600'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.platform_show_inline_sidekick ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {/* Agents & Apps Position */}
              <div className="flex items-center justify-between py-3 border-b border-gray-700/40">
                <div>
                  <p className="text-sm text-gray-200 font-medium">Agents & Apps Position</p>
                  <p className="text-gray-500 text-xs mt-0.5">Which side the Agents & Apps panel sits on inside the board.</p>
                </div>
                <div className="flex rounded-lg overflow-hidden border border-gray-600 flex-shrink-0">
                  <button
                    onClick={() => setSettings({ ...settings, platform_sidebar_left: false })}
                    className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                      !settings.platform_sidebar_left
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-700 text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    Right
                  </button>
                  <button
                    onClick={() => setSettings({ ...settings, platform_sidebar_left: true })}
                    className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                      settings.platform_sidebar_left
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-700 text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    Left
                  </button>
                </div>
              </div>

              {/* Work / Context Switch */}
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm text-gray-200 font-medium">Work / Context Switch</p>
                  <p className="text-gray-500 text-xs mt-0.5">Show a toggle in the board header to switch between Work and Context views.</p>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, platform_context_toggle: !settings.platform_context_toggle })}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${
                    settings.platform_context_toggle ? 'bg-indigo-600' : 'bg-gray-600'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.platform_context_toggle ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          {/* GROUP 5 — Chat Behavior                                      */}
          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <div className="mt-5 rounded-xl border-l-4 border-violet-500 bg-gray-800/50 border border-gray-700/60 overflow-hidden">
            <div className="px-5 py-4 space-y-0">
              <h3 className="text-md font-semibold text-white mb-1">Chat Behavior</h3>
              <p className="text-gray-400 text-xs mb-4">How the Sidekick chat overlay behaves and appears.</p>

              {/* Chat Overlay Position */}
              <div className="py-3 border-b border-gray-700/40">
                <p className="text-sm text-gray-200 font-medium mb-1">Chat Overlay Position</p>
                <p className="text-gray-500 text-xs mb-3">Where the Sidekick chat overlay appears when a task starts.</p>
                <div className="flex gap-2">
                  {[
                    { value: 'right_overlay' as const, label: 'Right', desc: 'Slides from right' },
                    { value: 'left_overlay' as const, label: 'Left', desc: 'Slides from left' },
                    { value: 'center_modal' as const, label: 'Center', desc: 'Centered card' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setSettings({ ...settings, platform_sidekick_panel_style: opt.value })}
                      className={`flex-1 p-2.5 rounded-lg border text-left transition-all ${
                        settings.platform_sidekick_panel_style === opt.value
                          ? 'border-violet-500 bg-violet-500/10'
                          : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
                      }`}
                    >
                      <p className={`text-sm font-medium ${settings.platform_sidekick_panel_style === opt.value ? 'text-violet-300' : 'text-gray-300'}`}>{opt.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* V3-only settings */}
              {settings.platform_page_version === 'v3' && (
                <>
                  {/* Team Avatars Position */}
                  <div className="py-3 border-b border-gray-700/40">
                    <p className="text-sm text-gray-200 font-medium mb-1">Team Avatars Position</p>
                    <p className="text-gray-500 text-xs mb-3">Where team member avatars appear inside the Sidekick chat sidebar.</p>
                    <div className="flex gap-2">
                      {[
                        { value: 'in_chat' as const, label: 'In Chat', desc: 'Inside the chat, before JTBD options' },
                        { value: 'header_row' as const, label: 'Header Row', desc: 'Separate row below the header' },
                        { value: 'header_merged' as const, label: 'Header Merged', desc: 'Merged with header avatar' },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => setSettings({ ...settings, platform_v3_team_avatars: opt.value })}
                          className={`flex-1 p-2.5 rounded-lg border text-left transition-all ${
                            settings.platform_v3_team_avatars === opt.value
                              ? 'border-violet-500 bg-violet-500/10'
                              : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
                          }`}
                        >
                          <p className={`text-sm font-medium ${settings.platform_v3_team_avatars === opt.value ? 'text-violet-300' : 'text-gray-300'}`}>{opt.label}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Minimal Chat Mode */}
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm text-gray-200 font-medium">Minimal Chat Mode</p>
                      <p className="text-gray-500 text-xs mt-0.5">After a task is selected, hide messages and only show the opening prompt and options.</p>
                    </div>
                    <button
                      onClick={() => setSettings({ ...settings, platform_v3_minimal_chat: !settings.platform_v3_minimal_chat })}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${
                        settings.platform_v3_minimal_chat ? 'bg-violet-600' : 'bg-gray-600'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.platform_v3_minimal_chat ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          {/* GROUP 6 — Showcase Section                                   */}
          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <div className="mt-5 rounded-xl border-l-4 border-teal-500 bg-gray-800/50 border border-gray-700/60 overflow-hidden">
            <div className="px-5 py-4 space-y-0">
              {/* Master toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-md font-semibold text-white">Showcase Section</h3>
                  <p className="text-gray-400 text-xs mt-0.5">Show an additional AI Work Platform showcase section with its own department header.</p>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, platform_showcase_section: !settings.platform_showcase_section })}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${
                    settings.platform_showcase_section ? 'bg-teal-600' : 'bg-gray-600'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.platform_showcase_section ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {/* Sub-settings when ON */}
              {settings.platform_showcase_section && (
                <div className="mt-4 pt-3 border-t border-gray-700/40 space-y-0">
                  <p className="text-xs text-teal-400 font-medium uppercase tracking-wider mb-3">Showcase Layout</p>

                  {/* Department Navigation */}
                  <div className="flex items-center justify-between py-2.5 border-b border-gray-700/30">
                    <div>
                      <p className="text-sm text-gray-300">Department Navigation</p>
                      <p className="text-gray-500 text-xs mt-0.5">How departments are displayed in the showcase section.</p>
                    </div>
                    <select
                      value={settings.platform_showcase_show_department_bar}
                      onChange={(e) => setSettings({ ...settings, platform_showcase_show_department_bar: e.target.value as 'none' | 'horizontal' | 'vertical_sidebar' | 'both' })}
                      className="bg-gray-700 text-gray-200 text-xs rounded-lg px-3 py-1.5 border border-gray-600 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    >
                      <option value="none">Hidden</option>
                      <option value="horizontal">Horizontal Bar (top)</option>
                      <option value="vertical_sidebar">Vertical Sidebar (left)</option>
                      <option value="both">Both</option>
                    </select>
                  </div>

                  {/* Showcase Variant */}
                  <div className="flex items-center justify-between py-2.5 border-b border-gray-700/30">
                    <div>
                      <p className="text-sm text-gray-300">Showcase Variant</p>
                      <p className="text-gray-500 text-xs mt-0.5">Choose between the classic cards layout or the architecture-integrated sandbox.</p>
                    </div>
                    <select
                      value={settings.platform_showcase_variant}
                      onChange={(e) => setSettings({ ...settings, platform_showcase_variant: e.target.value as 'classic' | 'sandbox' })}
                      className="bg-gray-700 text-gray-200 text-xs rounded-lg px-3 py-1.5 border border-gray-600 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    >
                      <option value="classic">Classic (Cards)</option>
                      <option value="sandbox">Sandbox (Architecture)</option>
                    </select>
                  </div>

                  {/* Use Cases Showcase Variant (V4 only) */}
                  <div className="flex items-center justify-between py-2.5 border-b border-gray-700/30">
                    <div>
                      <p className="text-sm text-gray-300">Use Cases Showcase</p>
                      <p className="text-gray-500 text-xs mt-0.5">Layout variant for the use-cases section (V4 only).</p>
                    </div>
                    <select
                      value={settings.platform_use_cases_variant}
                      onChange={(e) => setSettings({ ...settings, platform_use_cases_variant: e.target.value as any })}
                      className="bg-gray-700 text-gray-200 text-xs rounded-lg px-3 py-1.5 border border-gray-600 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    >
                      <option value="cards_grid">Cards Grid</option>
                      <option value="hero_featured">Hero Featured</option>
                      <option value="department_tabs">Department Tabs</option>
                      <option value="bento_mosaic">Bento Mosaic</option>
                    </select>
                  </div>

                  {/* Side Panel */}
                  <div className="flex items-center justify-between py-2.5 border-b border-gray-700/30">
                    <div>
                      <p className="text-sm text-gray-300">Side Panel</p>
                      <p className="text-gray-500 text-xs mt-0.5">Show the side panel beside the showcase board.</p>
                    </div>
                    <button
                      onClick={() => setSettings({ ...settings, platform_showcase_show_jtbd_sidebar: !settings.platform_showcase_show_jtbd_sidebar })}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${
                        settings.platform_showcase_show_jtbd_sidebar ? 'bg-teal-600' : 'bg-gray-600'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.platform_showcase_show_jtbd_sidebar ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  {/* Inline Sidekick Chat */}
                  <div className="flex items-center justify-between py-2.5">
                    <div>
                      <p className="text-sm text-gray-300">Inline Sidekick Chat</p>
                      <p className="text-gray-500 text-xs mt-0.5">Show a persistent Sidekick chat column inside the showcase board.</p>
                    </div>
                    <button
                      onClick={() => setSettings({ ...settings, platform_showcase_show_inline_sidekick: !settings.platform_showcase_show_inline_sidekick })}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${
                        settings.platform_showcase_show_inline_sidekick ? 'bg-teal-600' : 'bg-gray-600'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.platform_showcase_show_inline_sidekick ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Solution Tabs Visibility */}
          <div className="mt-8 pt-6 border-t border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Solution Tabs Visibility</h3>
            <p className="text-gray-400 text-sm mb-4">Control which tabs are visible in the AI Work Platform section.</p>
            
            <div className="space-y-3">
              {(Object.keys(settings.solution_tabs_visibility) as Array<keyof SolutionTabsVisibility>).map((tab) => (
                <div
                  key={tab}
                  className={`flex items-center justify-between p-3 bg-gray-800/50 rounded-lg transition-opacity ${
                    settings.solution_tabs_visibility[tab] ? '' : 'opacity-60'
                  }`}
                >
                  <div>
                    <span className="text-white font-medium">{solutionTabLabels[tab]}</span>
                    <span className={`ml-3 text-xs px-2 py-1 rounded ${
                      settings.solution_tabs_visibility[tab]
                        ? 'bg-purple-500/20 text-purple-400'
                        : 'bg-gray-600/20 text-gray-500'
                    }`}>
                      {settings.solution_tabs_visibility[tab] ? 'Visible' : 'Hidden'}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleSolutionTab(tab)}
                    className={`relative w-14 h-7 rounded-full transition-colors ${
                      settings.solution_tabs_visibility[tab] ? 'bg-purple-600' : 'bg-gray-600'
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                        settings.solution_tabs_visibility[tab] ? 'left-8' : 'left-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hero Editor Panel */}
      {activePanel === 'hero' && (
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-6">
          <h2 className="text-xl font-semibold text-white mb-6">Hero Section Editor</h2>
          
          {/* Logo Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Custom Logo
            </label>
            <div className="flex items-center gap-4">
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <button
                onClick={() => logoInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
              >
                <Upload className="w-4 h-4" />
                Upload Logo
              </button>
              {settings.hero_settings.logo_url && (
                <div className="relative">
                  <img
                    src={settings.hero_settings.logo_url}
                    alt="Logo preview"
                    className="h-12 w-auto object-contain bg-gray-800 rounded p-2"
                  />
                  <button
                    onClick={() => updateHeroSettings('logo_url', '')}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {!settings.hero_settings.logo_url && (
                <span className="text-gray-500 text-sm">Using default monday.com logo</span>
              )}
            </div>
          </div>

          {/* Platform Label */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Platform Label
            </label>
            <input
              type="text"
              value={settings.hero_settings.platform_label}
              onChange={(e) => updateHeroSettings('platform_label', e.target.value)}
              placeholder="AI Work Platform"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Headline Text */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Main Headline (Regular Text)
            </label>
            <input
              type="text"
              value={settings.hero_settings.headline_text}
              onChange={(e) => updateHeroSettings('headline_text', e.target.value)}
              placeholder="Empowering every team "
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Headline Gradient Text */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Headline (Gradient Text)
            </label>
            <input
              type="text"
              value={settings.hero_settings.headline_gradient_text}
              onChange={(e) => updateHeroSettings('headline_gradient_text', e.target.value)}
              placeholder="to accelerate business impact"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-gray-500 text-xs mt-1">This text will have a gradient color effect</p>
          </div>

          {/* Subtitle (legacy field) */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Subtitle
            </label>
            <input
              type="text"
              value={settings.hero_subtitle}
              onChange={(e) => setSettings({ ...settings, hero_subtitle: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Font Size */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Headline Font Size
            </label>
            <div className="flex gap-2">
              {fontSizeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateHeroSettings('font_size', option.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    settings.hero_settings.font_size === option.value
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Background Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Background Type
            </label>
            <div className="flex gap-2 mb-4">
              {(['solid', 'gradient', 'image'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => updateHeroSettings('background_type', type)}
                  className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                    settings.hero_settings.background_type === type
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Solid Color Picker */}
            {settings.hero_settings.background_type === 'solid' && (
              <div className="flex items-center gap-4">
                <label className="text-sm text-gray-400">Color:</label>
                <input
                  type="color"
                  value={settings.hero_settings.background_color}
                  onChange={(e) => updateHeroSettings('background_color', e.target.value)}
                  className="w-12 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.hero_settings.background_color}
                  onChange={(e) => updateHeroSettings('background_color', e.target.value)}
                  className="w-28 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
                />
              </div>
            )}

            {/* Gradient Picker */}
            {settings.hero_settings.background_type === 'gradient' && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="text-sm text-gray-400 w-16">From:</label>
                  <input
                    type="color"
                    value={settings.hero_settings.background_gradient_from}
                    onChange={(e) => updateHeroSettings('background_gradient_from', e.target.value)}
                    className="w-12 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.hero_settings.background_gradient_from}
                    onChange={(e) => updateHeroSettings('background_gradient_from', e.target.value)}
                    className="w-28 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <label className="text-sm text-gray-400 w-16">To:</label>
                  <input
                    type="color"
                    value={settings.hero_settings.background_gradient_to}
                    onChange={(e) => updateHeroSettings('background_gradient_to', e.target.value)}
                    className="w-12 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.hero_settings.background_gradient_to}
                    onChange={(e) => updateHeroSettings('background_gradient_to', e.target.value)}
                    className="w-28 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
                  />
                </div>
                {/* Gradient Preview */}
                <div
                  className="h-12 rounded-lg"
                  style={{
                    background: `linear-gradient(to bottom, ${settings.hero_settings.background_gradient_from}, ${settings.hero_settings.background_gradient_to})`,
                  }}
                />
              </div>
            )}

            {/* Image Upload */}
            {settings.hero_settings.background_type === 'image' && (
              <div className="space-y-4">
                <input
                  ref={bgImageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleBgImageUpload}
                  className="hidden"
                />
                <button
                  onClick={() => bgImageInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Upload Background Image
                </button>
                {settings.hero_settings.background_image_url && (
                  <div className="relative">
                    <img
                      src={settings.hero_settings.background_image_url}
                      alt="Background preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => updateHeroSettings('background_image_url', '')}
                      className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Hero Preview */}
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-gray-400 mb-4">Preview</h3>
            <div
              className="rounded-lg p-8 text-center min-h-[200px] flex flex-col items-center justify-center"
              style={{
                background:
                  settings.hero_settings.background_type === 'solid'
                    ? settings.hero_settings.background_color
                    : settings.hero_settings.background_type === 'gradient'
                    ? `linear-gradient(to bottom, ${settings.hero_settings.background_gradient_from}, ${settings.hero_settings.background_gradient_to})`
                    : settings.hero_settings.background_image_url
                    ? `url(${settings.hero_settings.background_image_url}) center/cover`
                    : '#000',
              }}
            >
              {settings.hero_settings.logo_url ? (
                <img src={settings.hero_settings.logo_url} alt="Logo" className="h-16 mb-4" />
              ) : (
                <div className="w-24 h-16 bg-gradient-to-r from-purple-500 via-cyan-400 to-yellow-400 rounded mb-4 flex items-center justify-center text-white text-xs">
                  monday.com
                </div>
              )}
              <p className="text-xs tracking-widest uppercase text-gray-400 mb-4">
                {settings.hero_settings.platform_label}
              </p>
              <p
                style={{
                  fontSize: fontSizeOptions.find(f => f.value === settings.hero_settings.font_size)?.size || '2.25rem',
                }}
              >
                <span className="text-white/80">{settings.hero_settings.headline_text}</span>
                <span className="bg-gradient-to-r from-[#eaecd8] via-[#c7ede0] to-[#6161ff] bg-clip-text text-transparent">
                  {settings.hero_settings.headline_gradient_text}
                </span>
              </p>
              <p className="text-gray-400 text-sm mt-4">{settings.hero_subtitle}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs Editor Panel */}
      {activePanel === 'tabs' && (
        <>
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-6">
            <h2 className="text-xl font-semibold text-white mb-6">Legacy Hero Settings</h2>
            
            {/* Hero Title */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Main Title (Selector Section)
              </label>
              <input
                type="text"
                value={settings.hero_title}
                onChange={(e) => setSettings({ ...settings, hero_title: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

      {/* Tabs Editor */}
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Navigation Tabs</h2>
          <button
            onClick={addTab}
            className="flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white text-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Tab
          </button>
        </div>

        <div className="space-y-3">
          {settings.tabs.map((tab, index) => (
            <div
              key={tab.id}
              className={`flex items-center gap-4 bg-gray-800 rounded-lg p-4 transition-opacity ${
                tab.enabled === false ? 'opacity-50' : ''
              }`}
            >
              <GripVertical className="w-5 h-5 text-gray-600 cursor-grab" />
              
              <span className="text-gray-500 text-sm w-6">{index + 1}</span>
              
              <input
                type="text"
                value={tab.label}
                onChange={(e) => updateTab(tab.id, 'label', e.target.value)}
                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Tab label"
              />
              
              <select
                value={tab.icon}
                onChange={(e) => updateTab(tab.id, 'icon', e.target.value)}
                className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {iconOptions.map(icon => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>

              {/* Toggle switch */}
              <button
                onClick={() => updateTab(tab.id, 'enabled', !tab.enabled)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  tab.enabled !== false ? 'bg-indigo-600' : 'bg-gray-600'
                }`}
                title={tab.enabled !== false ? 'Enabled' : 'Disabled'}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    tab.enabled !== false ? 'left-7' : 'left-1'
                  }`}
                />
              </button>

              <button
                onClick={() => removeTab(tab.id)}
                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

          {/* Preview */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-6">
            <h3 className="text-sm font-semibold text-gray-400 mb-4">Preview (showing only enabled tabs)</h3>
            <div className="bg-gray-950 rounded-lg p-8 text-center">
              <div className="flex justify-center gap-2 mb-8">
                {settings.tabs.filter(tab => tab.enabled !== false).map((tab, i) => (
                  <div
                    key={tab.id}
                    className={`px-4 py-2 rounded-lg text-sm ${
                      i === 0 ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400'
                    }`}
                  >
                    {tab.label}
                  </div>
                ))}
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">{settings.hero_title}</h1>
              <p className="text-gray-400">{settings.hero_subtitle}</p>
            </div>
          </div>
        </>
      )}

      {/* Save Button - Always visible */}
      <button
        onClick={handleSave}
        disabled={saving}
        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
          saved
            ? 'bg-green-600 text-white'
            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
        } disabled:opacity-50`}
      >
        <Save className="w-5 h-5" />
        {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
      </button>
    </div>
  );
}
