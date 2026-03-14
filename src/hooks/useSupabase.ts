import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { DepartmentRow, ProductRow, AgentRow, VibeAppRow, SidekickActionRow } from '@/types/database';

// Hook for fetching all departments
export function useDepartments() {
  const [departments, setDepartments] = useState<DepartmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDepartments = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .eq('is_active', true)  // Only show active departments on main site
        .order('order_index');
      
      if (error) throw error;
      setDepartments(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const updateDepartment = async (id: string, updates: Partial<DepartmentRow>) => {
    const { error } = await supabase
      .from('departments')
      .update(updates)
      .eq('id', id);
    
    if (error) throw error;
    await fetchDepartments();
  };

  return { departments, loading, error, refetch: fetchDepartments, updateDepartment };
}

// Hook for fetching department data (products, agents, etc.)
export function useDepartmentData(departmentId: string | null) {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [agents, setAgents] = useState<AgentRow[]>([]);
  const [vibeApps, setVibeApps] = useState<VibeAppRow[]>([]);
  const [sidekickActions, setSidekickActions] = useState<SidekickActionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!departmentId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Use junction tables to get items linked to this department
      const [productsRes, agentsRes, vibeAppsRes, sidekickRes] = await Promise.all([
        // Get products via department_products junction table
        supabase
          .from('department_products')
          .select('products(*)')
          .eq('department_id', departmentId),
        // Get agents via department_agents junction table  
        supabase
          .from('department_agents')
          .select('agents(*)')
          .eq('department_id', departmentId),
        // Get vibe apps via department_vibe_apps junction table
        supabase
          .from('department_vibe_apps')
          .select('vibe_apps(*)')
          .eq('department_id', departmentId),
        // Get sidekick actions via department_sidekick_actions junction table
        supabase
          .from('department_sidekick_actions')
          .select('sidekick_actions(*)')
          .eq('department_id', departmentId),
      ]);

      if (productsRes.error) throw productsRes.error;
      if (agentsRes.error) throw agentsRes.error;
      if (vibeAppsRes.error) throw vibeAppsRes.error;
      if (sidekickRes.error) throw sidekickRes.error;

      // Extract the actual items from the junction table response and filter by is_active
      const productsData = (productsRes.data || [])
        .map((row: any) => row.products)
        .filter((p: any) => p && p.is_active)
        .sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0));
      
      const agentsData = (agentsRes.data || [])
        .map((row: any) => row.agents)
        .filter((a: any) => a && a.is_active)
        .sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0));
      
      const vibeAppsData = (vibeAppsRes.data || [])
        .map((row: any) => row.vibe_apps)
        .filter((v: any) => v && v.is_active)
        .sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0));
      
      const sidekickData = (sidekickRes.data || [])
        .map((row: any) => row.sidekick_actions)
        .filter((s: any) => s && s.is_active)
        .sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0));

      setProducts(productsData);
      setAgents(agentsData);
      setVibeApps(vibeAppsData);
      setSidekickActions(sidekickData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [departmentId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // CRUD operations for products
  const addProduct = async (product: Omit<ProductRow, 'id' | 'created_at' | 'updated_at'>) => {
    const { error } = await supabase.from('products').insert(product);
    if (error) throw error;
    await fetchData();
  };

  const updateProduct = async (id: string, updates: Partial<ProductRow>) => {
    const { error } = await supabase.from('products').update(updates).eq('id', id);
    if (error) throw error;
    await fetchData();
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    await fetchData();
  };

  // CRUD operations for agents
  const addAgent = async (agent: Omit<AgentRow, 'id' | 'created_at' | 'updated_at'>) => {
    const { error } = await supabase.from('agents').insert(agent);
    if (error) throw error;
    await fetchData();
  };

  const updateAgent = async (id: string, updates: Partial<AgentRow>) => {
    const { error } = await supabase.from('agents').update(updates).eq('id', id);
    if (error) throw error;
    await fetchData();
  };

  const deleteAgent = async (id: string) => {
    const { error } = await supabase.from('agents').delete().eq('id', id);
    if (error) throw error;
    await fetchData();
  };

  // CRUD operations for vibe apps
  const addVibeApp = async (app: Omit<VibeAppRow, 'id' | 'created_at' | 'updated_at'>) => {
    const { error } = await supabase.from('vibe_apps').insert(app);
    if (error) throw error;
    await fetchData();
  };

  const updateVibeApp = async (id: string, updates: Partial<VibeAppRow>) => {
    const { error } = await supabase.from('vibe_apps').update(updates).eq('id', id);
    if (error) throw error;
    await fetchData();
  };

  const deleteVibeApp = async (id: string) => {
    const { error } = await supabase.from('vibe_apps').delete().eq('id', id);
    if (error) throw error;
    await fetchData();
  };

  // CRUD operations for sidekick actions
  const addSidekickAction = async (action: Omit<SidekickActionRow, 'id' | 'created_at' | 'updated_at'>) => {
    const { error } = await supabase.from('sidekick_actions').insert(action);
    if (error) throw error;
    await fetchData();
  };

  const updateSidekickAction = async (id: string, updates: Partial<SidekickActionRow>) => {
    const { error } = await supabase.from('sidekick_actions').update(updates).eq('id', id);
    if (error) throw error;
    await fetchData();
  };

  const deleteSidekickAction = async (id: string) => {
    const { error } = await supabase.from('sidekick_actions').delete().eq('id', id);
    if (error) throw error;
    await fetchData();
  };

  return {
    products,
    agents,
    vibeApps,
    sidekickActions,
    loading,
    error,
    refetch: fetchData,
    // Product operations
    addProduct,
    updateProduct,
    deleteProduct,
    // Agent operations
    addAgent,
    updateAgent,
    deleteAgent,
    // Vibe App operations
    addVibeApp,
    updateVibeApp,
    deleteVibeApp,
    // Sidekick Action operations
    addSidekickAction,
    updateSidekickAction,
    deleteSidekickAction,
  };
}

// Types for site settings
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

export type TeamsAgentsV2Layout = 'mixed_circle' | 'team_with_agents' | 'side_by_side_unified' | 'cards_layout' | 'team_flanked';
export type AIPlatformArchLayout = 'app_frame_list' | 'app_frame_canvas' | 'app_frame_board';

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

export interface SolutionTabsVisibility {
  overview: boolean;
  inAction: boolean;
  businessValue: boolean;
  test: boolean;
  products: boolean;
  capabilities: boolean;
}

// Sidekick theme interface (matches SidekickPanelTheme from context)
export interface SidekickTheme {
  panelBackground: string;
  panelBackdropBlur: string;
  panelBorderColor: string;
  panelShadow: string;
  headerBorderColor: string;
  headerPrimaryText: string;
  headerSecondaryText: string;
  headerLogo: string;
  headerPrimaryLabel: string;
  headerSecondaryLabel: string;
  cardBackground: string;
  cardBorder: string;
  cardBackdropBlur: string;
  primaryText: string;
  secondaryText: string;
  mutedText: string;
  greenAccent: string;
  amberAccent: string;
  indigoAccent: string;
  purpleAccent: string;
  progressBarBg: string;
  userMessageBg: string;
  userMessageText: string;
  introMessage: string;
  introBackground: string;
  introBubbleGradientFrom: string;
  introBubbleGradientTo: string;
  introBubbleShadow: string;
  panelOuterBackground: string;
}

export interface SiteSettings {
  hero_title: string;
  hero_subtitle: string;
  sections_visibility: SectionsVisibility;
  sections_order: string[];
  hero_settings: HeroSettings;
  solution_tabs_visibility: SolutionTabsVisibility;
  sidekick_hero_theme: SidekickTheme | null;
  sidekick_inaction_theme: SidekickTheme | null;
  teams_agents_v2_layout: TeamsAgentsV2Layout;
  team_flanked_featured_agents: Record<string, string[]>;
  ai_platform_arch_layout: AIPlatformArchLayout;
  platform_architecture_variant: 'classic' | 'restructured';
  platform_page_version: 'v1' | 'v2' | 'v3' | 'v4';
  platform_context_toggle: boolean;
  platform_sidekick_panel_style: 'right_overlay' | 'center_modal' | 'left_overlay';
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
  agents_hero_variant: 'matrix' | 'matrix_v2' | 'radar' | 'mcp_connect' | 'branded';
  agents_messaging_tone: 'belong_here' | 'pure_machine' | 'machine_personality' | 'agent_pov' | 'system_native';
  agents_page_layout: 'visual' | 'plain_text';
  agents_content_style: 'v1' | 'v2';
  agents_show_frameworks: boolean;
  agents_branded_title_style: 'svg' | 'ascii';
  agents_branded_glow_style: 'wide' | 'logo';
  agents_hero_demo: 'none' | 'floating_terminal' | 'toasts' | 'typing_agent' | 'bg_stream' | 'agent_cursor';
  wm_platform_layers_variant: 'grid' | 'masonry_expand';
  wm_bento_style: 'dark_gradient' | 'glass_blur';
  wm_dark_mode: boolean;
  wm_dept_avatar_overrides: Record<string, string>;
  wm_dept_color_overrides: Record<string, string>;
  wm_dept_order: string[];
  wm_first_fold_variant: 'default' | 'live_delegation' | 'cinematic_assembly' | 'split_reveal' | 'roster_board';
  wm_squad_split_chat: boolean;
  wm_roster_layout: 'mirrored' | 'vertical';
  wm_member_avatar_overrides: Record<string, string>;
  wm_board_style: 'default' | 'kanban' | 'workflow' | 'focused' | 'minimal';
  wm_card_layout: 'default' | 'board_only' | 'compact_squad' | 'squad_header';
  wm_use_cases_variant: 'tabbed_cards' | 'tabbed_cards_c' | 'tabbed_cards_d' | 'tabbed_cards_e' | 'tabbed_cards_f' | 'accordion' | 'marquee' | 'matrix' | 'agentic_flow' | 'none';
  wm_jtbd_bg_overrides: Record<string, string>;
  wm_jtbd_position_overrides: Record<string, string>;
  wm_jtbd_zoom_overrides: Record<string, number>;
  wm_jtbd_global_poster_pos: string;
  wm_jtbd_global_poster_zoom: number;
  wm_jtbd_global_expanded_pos: string;
  wm_jtbd_global_expanded_zoom: number;
  wm_jtbd_expanded_overlay_opacity: number;
  wm_agent_catalog_variant: 'compact_grid' | 'showcase_carousel' | 'masonry_cards' | 'none';
  wm_agent_image_overrides: Record<string, string>;
  wm_show_agent_carousel: boolean;
  wm_vibe_collage_images: Record<string, string>;
  wm_ai_transformation_variant: 'proof_cards' | 'hero_journey';
  wm_consolidation_variant: 'tab_based' | 'connector_grid';
  wm_sections_order: string[];
  wm_sections_visibility: Record<string, boolean>;
  wm_sections_gap: number;
  wm_show_sidekick_bubble: boolean;
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

// Hook for fetching site settings
export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>({
    hero_title: 'What would you like to achieve?',
    hero_subtitle: 'with AI-powered products, AI work capabilities, and a unified context-aware layer',
    sections_visibility: defaultSectionsVisibility,
    sections_order: defaultSectionsOrder,
    hero_settings: defaultHeroSettings,
    solution_tabs_visibility: defaultSolutionTabsVisibility,
    sidekick_hero_theme: null,
    sidekick_inaction_theme: null,
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
    agents_hero_variant: 'matrix',
    agents_messaging_tone: 'belong_here',
    agents_page_layout: 'visual',
    agents_content_style: 'v1',
    agents_show_frameworks: false,
    agents_branded_title_style: 'ascii',
    agents_branded_glow_style: 'wide',
    agents_hero_demo: 'none',
    wm_platform_layers_variant: 'grid',
    wm_bento_style: 'dark_gradient',
    wm_dark_mode: false,
    wm_dept_avatar_overrides: {},
    wm_dept_color_overrides: {},
    wm_dept_order: [],
    wm_first_fold_variant: 'default',
    wm_squad_split_chat: false,
    wm_roster_layout: 'mirrored',
    wm_member_avatar_overrides: {},
    wm_board_style: 'default',
    wm_card_layout: 'default',
    wm_use_cases_variant: 'none',
    wm_jtbd_bg_overrides: {},
    wm_jtbd_position_overrides: {},
    wm_jtbd_zoom_overrides: {},
    wm_jtbd_global_poster_pos: '50% 3%',
    wm_jtbd_global_poster_zoom: 130,
    wm_jtbd_global_expanded_pos: '25,0',
    wm_jtbd_global_expanded_zoom: 120,
    wm_jtbd_expanded_overlay_opacity: 45,
    wm_agent_catalog_variant: 'compact_grid',
    wm_agent_image_overrides: {},
    wm_show_agent_carousel: false,
    wm_vibe_collage_images: {},
    wm_ai_transformation_variant: 'proof_cards',
    wm_consolidation_variant: 'tab_based',
    wm_sections_order: ['first_fold', 'demo', 'platform_layers', 'solutions', 'use_cases', 'agent_catalog', 'vibe', 'consolidation', 'ai_transformation', 'enterprise', 'what_sets_us_apart', 'open_platform', 'cta'],
    wm_sections_visibility: {},
    wm_sections_gap: 0,
    wm_show_sidekick_bubble: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('site_settings')
        .select('*')
        .single();

      if (fetchError) {
        // If no row exists or other error, just use defaults
        console.log('Site settings fetch error (using defaults):', fetchError.message);
        setError(fetchError.message);
        setLoading(false);
        return;
      }

      if (data) {
        // Extract _order and _teams_agents_v2_layout from sections_visibility if they exist
        const sectionsVisibilityData = data.sections_visibility || {};
        const { _order, _teams_agents_v2_layout, _team_flanked_featured_agents, _ai_platform_arch_layout, _platform_architecture_variant, _platform_page_version, _platform_context_toggle, _platform_sidekick_panel_style, _platform_v3_team_avatars, _platform_v3_minimal_chat, _platform_sidebar_left, _platform_v4_left_panel, _platform_showcase_section, _platform_show_jtbd_sidebar, _platform_show_inline_sidekick, _platform_show_department_bar, _platform_showcase_show_jtbd_sidebar, _platform_showcase_show_inline_sidekick, _platform_showcase_show_department_bar, _platform_showcase_variant, _platform_show_intro, _platform_intro_style, _platform_hero_variant, _platform_use_cases_variant, _agents_hero_variant, _agents_messaging_tone, _agents_page_layout, _agents_content_style, _agents_show_frameworks, _agents_branded_title_style, _agents_branded_glow_style, _agents_hero_demo, _wm_platform_layers_variant, _wm_bento_style, _wm_dark_mode, _wm_dept_avatar_overrides, _wm_dept_color_overrides, _wm_dept_order, _wm_first_fold_variant, _wm_squad_split_chat, _wm_roster_layout, _wm_member_avatar_overrides, _wm_board_style, _wm_card_layout, _wm_use_cases_variant, _wm_jtbd_bg_overrides, _wm_jtbd_position_overrides, _wm_jtbd_zoom_overrides, _wm_jtbd_global_poster_pos, _wm_jtbd_global_poster_zoom, _wm_jtbd_global_expanded_pos, _wm_jtbd_global_expanded_zoom, _wm_jtbd_expanded_overlay_opacity, _wm_agent_catalog_variant, _wm_agent_image_overrides, _wm_show_agent_carousel, _wm_vibe_collage_images, _wm_ai_transformation_variant, _wm_consolidation_variant, _wm_sections_order, _wm_sections_visibility, _wm_sections_gap, _wm_show_sidekick_bubble, ...sectionsVisibilityWithoutOrder } = sectionsVisibilityData;
        
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/bb0db356-d413-4fb9-a0cd-afac4bde56c0',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'0ca9a5'},body:JSON.stringify({sessionId:'0ca9a5',location:'useSupabase.ts:fetchSettings',message:'settings fetched',data:{hasData:!!data,_agents_hero_variant:(data?.sections_visibility as any)?._agents_hero_variant,_agents_content_style:(data?.sections_visibility as any)?._agents_content_style,_agents_page_layout:(data?.sections_visibility as any)?._agents_page_layout},timestamp:Date.now(),hypothesisId:'H2'})}).catch(()=>{});
        // #endregion
        setSettings({
          hero_title: data.hero_title || 'What would you like to achieve?',
          hero_subtitle: data.hero_subtitle || 'with AI-powered products, AI work capabilities, and a unified context-aware layer',
          sections_visibility: { ...defaultSectionsVisibility, ...sectionsVisibilityWithoutOrder },
          sections_order: (() => {
            const savedOrder = _order || data.sections_order || defaultSectionsOrder;
            // Append any new sections from defaults that aren't in the saved order
            const missingSections = defaultSectionsOrder.filter((s: string) => !savedOrder.includes(s));
            return [...savedOrder, ...missingSections];
          })(),
          hero_settings: { ...defaultHeroSettings, ...data.hero_settings },
          solution_tabs_visibility: data.solution_tabs_visibility || defaultSolutionTabsVisibility,
          sidekick_hero_theme: data.sidekick_hero_theme || null,
          sidekick_inaction_theme: data.sidekick_inaction_theme || null,
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
          agents_hero_variant: (() => {
            const v = _agents_hero_variant || 'matrix';
            const deprecated = ['boot', 'neural', 'glitch', 'cli', 'agents_grid', 'agents_marquee', 'hatcha_gate', 'api_blueprint', 'signup_60s'];
            return deprecated.includes(v) ? 'matrix' : v;
          })(),
          agents_messaging_tone: _agents_messaging_tone || 'belong_here',
          agents_page_layout: _agents_page_layout || 'visual',
          agents_content_style: _agents_content_style || 'v1',
          agents_show_frameworks: _agents_show_frameworks ?? false,
          agents_branded_title_style: _agents_branded_title_style || 'ascii',
          agents_branded_glow_style: _agents_branded_glow_style || 'wide',
          agents_hero_demo: (() => {
            const d = _agents_hero_demo || 'none';
            return d === 'scroll_reveal' ? 'none' : d;
          })(),
          wm_platform_layers_variant: _wm_platform_layers_variant || 'grid',
          wm_bento_style: _wm_bento_style || 'dark_gradient',
          wm_dark_mode: _wm_dark_mode ?? false,
          wm_dept_avatar_overrides: _wm_dept_avatar_overrides || {},
          wm_dept_color_overrides: _wm_dept_color_overrides || {},
          wm_dept_order: _wm_dept_order || [],
          wm_first_fold_variant: _wm_first_fold_variant || 'default',
          wm_squad_split_chat: _wm_squad_split_chat ?? false,
          wm_roster_layout: _wm_roster_layout || 'mirrored',
          wm_member_avatar_overrides: _wm_member_avatar_overrides || {},
          wm_board_style: _wm_board_style || 'default',
          wm_card_layout: _wm_card_layout || 'default',
          wm_use_cases_variant: _wm_use_cases_variant || 'none',
          wm_jtbd_bg_overrides: _wm_jtbd_bg_overrides || {},
          wm_jtbd_position_overrides: _wm_jtbd_position_overrides || {},
          wm_jtbd_zoom_overrides: _wm_jtbd_zoom_overrides || {},
          wm_jtbd_global_poster_pos: typeof _wm_jtbd_global_poster_pos === 'string' ? _wm_jtbd_global_poster_pos : '50% 3%',
          wm_jtbd_global_poster_zoom: typeof _wm_jtbd_global_poster_zoom === 'number' ? _wm_jtbd_global_poster_zoom : 130,
          wm_jtbd_global_expanded_pos: typeof _wm_jtbd_global_expanded_pos === 'string' ? _wm_jtbd_global_expanded_pos : '25,0',
          wm_jtbd_global_expanded_zoom: typeof _wm_jtbd_global_expanded_zoom === 'number' ? _wm_jtbd_global_expanded_zoom : 120,
          wm_jtbd_expanded_overlay_opacity: typeof _wm_jtbd_expanded_overlay_opacity === 'number' ? _wm_jtbd_expanded_overlay_opacity : 45,
          wm_agent_catalog_variant: _wm_agent_catalog_variant || 'compact_grid',
          wm_agent_image_overrides: (_wm_agent_image_overrides && typeof _wm_agent_image_overrides === 'object') ? _wm_agent_image_overrides as Record<string, string> : {},
          wm_show_agent_carousel: !!_wm_show_agent_carousel,
          wm_vibe_collage_images: (_wm_vibe_collage_images && typeof _wm_vibe_collage_images === 'object') ? _wm_vibe_collage_images as Record<string, string> : {},
          wm_ai_transformation_variant: (_wm_ai_transformation_variant as 'proof_cards' | 'hero_journey') || 'proof_cards',
          wm_consolidation_variant: (_wm_consolidation_variant as 'tab_based' | 'connector_grid') || 'tab_based',
          wm_sections_order: Array.isArray(_wm_sections_order) && _wm_sections_order.length > 0 ? _wm_sections_order : ['first_fold', 'demo', 'platform_layers', 'solutions', 'use_cases', 'agent_catalog', 'vibe', 'consolidation', 'ai_transformation', 'enterprise', 'what_sets_us_apart', 'open_platform', 'cta'],
          wm_sections_visibility: _wm_sections_visibility || {},
          wm_sections_gap: typeof _wm_sections_gap === 'number' ? _wm_sections_gap : 0,
          wm_show_sidekick_bubble: !!_wm_show_sidekick_bubble,
        });
      }
    } catch (err: any) {
      console.log('No site settings found, using defaults:', err.message);
      setError(err.message);
    } finally {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/bb0db356-d413-4fb9-a0cd-afac4bde56c0',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'0ca9a5'},body:JSON.stringify({sessionId:'0ca9a5',location:'useSupabase.ts:useSiteSettings:finally',message:'settings fetch done',data:{},timestamp:Date.now(),hypothesisId:'H2'})}).catch(()=>{});
      // #endregion
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return { settings, loading, error, refetch: fetchSettings };
}

// ─── Pages Hooks ────────────────────────────────────────────────────────────

export interface PageRow {
  id: string;
  slug: string;
  title: string;
  meta_description: string;
  og_image: string;
  department_id: string | null;
  outcome_id: string | null;
  sections_visibility: Record<string, boolean>;
  sections_order: string[];
  hero_settings: Record<string, any> | null;
  is_homepage: boolean;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

// Hook for admin — fetches all pages (draft + published)
export function usePages() {
  const [pages, setPages] = useState<PageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPages = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('pages')
        .select('*')
        .order('updated_at', { ascending: false });

      if (fetchError) throw fetchError;
      setPages((data as PageRow[]) || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  const addPage = async (page: Partial<PageRow>) => {
    const { error } = await supabase.from('pages').insert({
      slug: page.slug || `page-${Date.now()}`,
      title: page.title || 'New Page',
      meta_description: page.meta_description || '',
      sections_visibility: page.sections_visibility || defaultSectionsVisibility,
      sections_order: page.sections_order || defaultSectionsOrder,
      status: page.status || 'draft',
    });
    if (error) throw error;
    await fetchPages();
  };

  const updatePage = async (id: string, updates: Partial<PageRow>) => {
    const { error } = await supabase.from('pages').update(updates).eq('id', id);
    if (error) throw error;
    await fetchPages();
  };

  const deletePage = async (id: string) => {
    const { error } = await supabase.from('pages').delete().eq('id', id);
    if (error) throw error;
    await fetchPages();
  };

  return { pages, loading, error, refetch: fetchPages, addPage, updatePage, deletePage };
}

// Hook for frontend — fetches a single published page by slug
export function usePage(slug: string | undefined) {
  const [page, setPage] = useState<PageRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = useCallback(async () => {
    if (!slug) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (fetchError) throw fetchError;
      setPage(data as PageRow);
    } catch (err: any) {
      setError(err.message);
      setPage(null);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchPage();
  }, [fetchPage]);

  return { page, loading, error, refetch: fetchPage };
}

// Hook for fetching the homepage page (is_homepage = true)
export function useHomePage() {
  const [page, setPage] = useState<PageRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHomePage = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('pages')
        .select('*')
        .eq('is_homepage', true)
        .eq('status', 'published')
        .limit(1)
        .maybeSingle();

      if (fetchError) throw fetchError;
      setPage(data as PageRow | null);
    } catch (err: any) {
      // If table doesn't exist or other error, silently fall back
      console.log('Homepage fetch info:', err.message);
      setError(err.message);
      setPage(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHomePage();
  }, [fetchHomePage]);

  return { page, loading, error, refetch: fetchHomePage };
}

// Hook for image upload
export function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File, folder: string = 'general'): Promise<string | null> => {
    try {
      setUploading(true);
      setError(null);

      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('Vibe')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('Vibe').getPublicUrl(fileName);
      return data.publicUrl;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploadImage, uploading, error };
}

// ─── Case Study Types ───────────────────────────────────────────────────────

export interface CaseStudySource {
  id: string;
  filename: string;
  file_url: string;
  file_type: 'pdf' | 'pptx' | 'docx' | 'other';
  status: 'pending' | 'syncing' | 'synced' | 'error';
  region: string;
  extracted_count: number;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface CaseStudyImpactMetric {
  value: string;
  label: string;
}

export interface CaseStudy {
  id: string;
  source_id: string | null;
  company_name: string;
  company_logo: string;
  industry: string;
  location: string;
  region: string;
  products_used: string[];
  challenge: string;
  solution: string;
  quote_text: string;
  quote_author: string;
  quote_title: string;
  impact_metrics: CaseStudyImpactMetric[];
  partner: string;
  is_public_approved: boolean;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Case Study Sources Hook (Admin) ────────────────────────────────────────

export function useCaseStudySources() {
  const [sources, setSources] = useState<CaseStudySource[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSources = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('case_study_sources')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setSources((data as CaseStudySource[]) || []);
    } catch (err: any) {
      console.error('Failed to fetch case study sources:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSources(); }, [fetchSources]);

  const addSource = async (source: Partial<CaseStudySource>) => {
    const { error } = await supabase.from('case_study_sources').insert({
      filename: source.filename || '',
      file_url: source.file_url || '',
      file_type: source.file_type || 'pdf',
      status: 'pending',
      region: source.region || '',
    });
    if (error) throw error;
    await fetchSources();
  };

  const updateSource = async (id: string, updates: Partial<CaseStudySource>) => {
    const { error } = await supabase.from('case_study_sources').update(updates).eq('id', id);
    if (error) throw error;
    await fetchSources();
  };

  const deleteSource = async (id: string) => {
    const { error } = await supabase.from('case_study_sources').delete().eq('id', id);
    if (error) throw error;
    await fetchSources();
  };

  return { sources, loading, refetch: fetchSources, addSource, updateSource, deleteSource };
}

// ─── Case Studies Hook ──────────────────────────────────────────────────────

export function useCaseStudies(sourceId?: string) {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCaseStudies = useCallback(async () => {
    try {
      let query = supabase
        .from('case_studies')
        .select('*')
        .order('order_index', { ascending: true });
      if (sourceId) query = query.eq('source_id', sourceId);
      const { data, error } = await query;
      if (error) throw error;
      setCaseStudies((data as CaseStudy[]) || []);
    } catch (err: any) {
      console.error('Failed to fetch case studies:', err.message);
    } finally {
      setLoading(false);
    }
  }, [sourceId]);

  useEffect(() => { fetchCaseStudies(); }, [fetchCaseStudies]);

  const addCaseStudy = async (cs: Partial<CaseStudy>) => {
    const { error } = await supabase.from('case_studies').insert({
      source_id: cs.source_id || null,
      company_name: cs.company_name || '',
      company_logo: cs.company_logo || '',
      industry: cs.industry || '',
      location: cs.location || '',
      region: cs.region || '',
      products_used: cs.products_used || [],
      challenge: cs.challenge || '',
      solution: cs.solution || '',
      quote_text: cs.quote_text || '',
      quote_author: cs.quote_author || '',
      quote_title: cs.quote_title || '',
      impact_metrics: cs.impact_metrics || [],
      partner: cs.partner || '',
      is_public_approved: cs.is_public_approved ?? false,
      order_index: cs.order_index ?? 0,
      is_active: cs.is_active ?? true,
    });
    if (error) throw error;
    await fetchCaseStudies();
  };

  const updateCaseStudy = async (id: string, updates: Partial<CaseStudy>) => {
    const { error } = await supabase.from('case_studies').update(updates).eq('id', id);
    if (error) throw error;
    await fetchCaseStudies();
  };

  const deleteCaseStudy = async (id: string) => {
    const { error } = await supabase.from('case_studies').delete().eq('id', id);
    if (error) throw error;
    await fetchCaseStudies();
  };

  const bulkAddCaseStudies = async (studies: Partial<CaseStudy>[]) => {
    const rows = studies.map((cs, i) => ({
      source_id: cs.source_id || null,
      company_name: cs.company_name || '',
      company_logo: cs.company_logo || '',
      industry: cs.industry || '',
      location: cs.location || '',
      region: cs.region || '',
      products_used: cs.products_used || [],
      challenge: cs.challenge || '',
      solution: cs.solution || '',
      quote_text: cs.quote_text || '',
      quote_author: cs.quote_author || '',
      quote_title: cs.quote_title || '',
      impact_metrics: cs.impact_metrics || [],
      partner: cs.partner || '',
      is_public_approved: cs.is_public_approved ?? false,
      order_index: cs.order_index ?? i,
      is_active: cs.is_active ?? true,
    }));
    const { error } = await supabase.from('case_studies').insert(rows);
    if (error) throw error;
    await fetchCaseStudies();
  };

  return { caseStudies, loading, refetch: fetchCaseStudies, addCaseStudy, updateCaseStudy, deleteCaseStudy, bulkAddCaseStudies };
}

// ─── Design Assets Types ────────────────────────────────────────────────────

export type DesignAssetCategory = 'product_logo' | 'agent_image' | 'department_avatar' | 'vibe' | 'sidekick' | 'icon' | 'background' | 'other';

export interface DesignAsset {
  id: string;
  name: string;
  description: string;
  category: DesignAssetCategory;
  subcategory: string;
  file_url: string;
  thumbnail_url: string;
  file_type: string;
  tags: string[];
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Design Assets Hook ─────────────────────────────────────────────────────

export function useDesignAssets(category?: DesignAssetCategory) {
  const [assets, setAssets] = useState<DesignAsset[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAssets = useCallback(async () => {
    try {
      let query = supabase
        .from('design_assets')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true })
        .order('order_index', { ascending: true });
      if (category) query = query.eq('category', category);
      const { data, error } = await query;
      if (error) throw error;
      setAssets((data as DesignAsset[]) || []);
    } catch (err: any) {
      console.error('Failed to fetch design assets:', err.message);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => { fetchAssets(); }, [fetchAssets]);

  const addAsset = async (asset: Partial<DesignAsset>) => {
    const { error } = await supabase.from('design_assets').insert({
      name: asset.name || '',
      description: asset.description || '',
      category: asset.category || 'other',
      subcategory: asset.subcategory || '',
      file_url: asset.file_url || '',
      thumbnail_url: asset.thumbnail_url || '',
      file_type: asset.file_type || 'png',
      tags: asset.tags || [],
      order_index: asset.order_index ?? 0,
    });
    if (error) throw error;
    await fetchAssets();
  };

  const updateAsset = async (id: string, updates: Partial<DesignAsset>) => {
    const { error } = await supabase.from('design_assets').update(updates).eq('id', id);
    if (error) throw error;
    await fetchAssets();
  };

  const deleteAsset = async (id: string) => {
    const { error } = await supabase.from('design_assets').update({ is_active: false }).eq('id', id);
    if (error) throw error;
    await fetchAssets();
  };

  const bulkAddAssets = async (assetList: Partial<DesignAsset>[]) => {
    const rows = assetList.map((a, i) => ({
      name: a.name || '',
      description: a.description || '',
      category: a.category || 'other',
      subcategory: a.subcategory || '',
      file_url: a.file_url || '',
      thumbnail_url: a.thumbnail_url || '',
      file_type: a.file_type || 'png',
      tags: a.tags || [],
      order_index: a.order_index ?? i,
    }));
    const { error } = await supabase.from('design_assets').insert(rows);
    if (error) throw error;
    await fetchAssets();
  };

  return { assets, loading, refetch: fetchAssets, addAsset, updateAsset, deleteAsset, bulkAddAssets };
}

// ─── Page Components ─────────────────────────────────────────────────────────

export interface PageComponentRow {
  id: string;
  page_id: string;           // 'homepage', 'platform', or uuid
  component_type: string;
  display_name: string;
  settings: Record<string, any>;
  order_index: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export function usePageComponents(pageId: string) {
  const [components, setComponents] = useState<PageComponentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComponents = useCallback(async () => {
    if (!pageId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('page_components')
        .select('*')
        .eq('page_id', pageId)
        .order('order_index', { ascending: true });

      if (fetchError) throw fetchError;
      setComponents((data as PageComponentRow[]) || []);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setComponents([]);
    } finally {
      setLoading(false);
    }
  }, [pageId]);

  useEffect(() => {
    fetchComponents();
  }, [fetchComponents]);

  const addComponent = async (component: Omit<PageComponentRow, 'id' | 'created_at' | 'updated_at'>) => {
    const { error: insertError } = await supabase
      .from('page_components')
      .insert({
        page_id: component.page_id,
        component_type: component.component_type,
        display_name: component.display_name,
        settings: component.settings || {},
        order_index: component.order_index,
        is_visible: component.is_visible ?? true,
      });
    if (insertError) throw insertError;
    await fetchComponents();
  };

  const updateComponent = async (id: string, updates: Partial<PageComponentRow>) => {
    const { error: updateErr } = await supabase
      .from('page_components')
      .update(updates)
      .eq('id', id);
    if (updateErr) throw updateErr;
    await fetchComponents();
  };

  const deleteComponent = async (id: string) => {
    const { error: deleteErr } = await supabase
      .from('page_components')
      .delete()
      .eq('id', id);
    if (deleteErr) throw deleteErr;
    await fetchComponents();
  };

  const reorderComponents = async (orderedIds: string[]) => {
    try {
      const updates = orderedIds.map((id, index) =>
        supabase.from('page_components').update({ order_index: index }).eq('id', id)
      );
      await Promise.all(updates);
      await fetchComponents();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return {
    components,
    loading,
    error,
    refetch: fetchComponents,
    addComponent,
    updateComponent,
    deleteComponent,
    reorderComponents,
  };
}

/** Migrates site_settings (sections_visibility, sections_order, hero_settings, etc.) to page_components for homepage. Only runs if no page_components exist for 'homepage' yet. Returns number of components created. */
export async function migrateHomepageToPageComponents(): Promise<number> {
  try {
    const { data: existing } = await supabase
      .from('page_components')
      .select('id')
      .eq('page_id', 'homepage')
      .limit(1);
    if (existing && existing.length > 0) return 0;

    const { data: settingsRow, error: settingsErr } = await supabase
      .from('site_settings')
      .select('*')
      .single();
    if (settingsErr || !settingsRow) return 0;

    const sectionsVisibility = settingsRow.sections_visibility || defaultSectionsVisibility;
    const sectionsOrder = (settingsRow.sections_visibility as any)?._order || settingsRow.sections_order || defaultSectionsOrder;
    const heroSettings = settingsRow.hero_settings || defaultHeroSettings;
    const solutionTabsVisibility = settingsRow.solution_tabs_visibility || defaultSolutionTabsVisibility;
    const teamsAgentsV2Layout = (settingsRow.sections_visibility as any)?._teams_agents_v2_layout || 'mixed_circle';
    const teamFlankedFeaturedAgents = (settingsRow.sections_visibility as any)?._team_flanked_featured_agents || {};
    const aiPlatformArchLayout = (settingsRow.sections_visibility as any)?._ai_platform_arch_layout || 'app_frame_canvas';

    const sectionToSettings: Record<string, Record<string, any>> = {
      hero: { ...heroSettings },
      hero_alternative: {},
      hero_outcome_cards: {},
      work_comparison: {},
      sidekick_capabilities: {},
      sidekick: {
        hero_theme: settingsRow.sidekick_hero_theme || null,
        inaction_theme: settingsRow.sidekick_inaction_theme || null,
      },
      departments: { hero_title: settingsRow.hero_title || 'What would you like to achieve?' },
      ai_platform: { solution_tabs_visibility: solutionTabsVisibility },
      project_management: {},
      agents_showcase: {},
      teams_and_agents: {},
      teams_and_agents_v2: { layout: teamsAgentsV2Layout, team_flanked_featured_agents: teamFlankedFeaturedAgents },
      ai_platform_architecture: { layout: aiPlatformArchLayout },
      team_commands: {},
    };

    const displayNames: Record<string, string> = {
      hero: 'Hero Section',
      hero_alternative: 'Hero Alternative',
      hero_outcome_cards: 'Hero Outcome Cards',
      work_comparison: 'Work Comparison',
      sidekick_capabilities: 'Sidekick (Half Story)',
      sidekick: 'Sidekick',
      departments: 'Departments',
      ai_platform: 'AI Platform',
      project_management: 'Project Management',
      agents_showcase: 'Agents Showcase',
      teams_and_agents: 'Teams and Agents',
      teams_and_agents_v2: 'Teams and Agents V2',
      ai_platform_architecture: 'AI Platform Architecture',
      team_commands: 'Team Commands',
    };

    const rows: Omit<PageComponentRow, 'id' | 'created_at' | 'updated_at'>[] = [];
    sectionsOrder.forEach((sectionKey: string, idx: number) => {
      const isVisible = sectionsVisibility[sectionKey] ?? true;
      const settings = sectionToSettings[sectionKey] ?? {};
      const displayName = displayNames[sectionKey] ?? sectionKey;
      rows.push({
        page_id: 'homepage',
        component_type: sectionKey,
        display_name: displayName,
        settings,
        order_index: idx,
        is_visible: isVisible,
      });
    });

    if (rows.length === 0) return 0;
    const { error: insertErr } = await supabase.from('page_components').insert(rows);
    if (insertErr) throw insertErr;
    return rows.length;
  } catch (err: any) {
    console.error('migrateHomepageToPageComponents:', err.message);
    return 0;
  }
}

/** Migrates site_settings platform options to page_components for page_id='platform'. Only runs if no page_components exist for 'platform' yet. */
export async function migratePlatformToPageComponents(): Promise<number> {
  try {
    const { data: existing } = await supabase
      .from('page_components')
      .select('id')
      .eq('page_id', 'platform')
      .limit(1);
    if (existing && existing.length > 0) return 0;

    const { data: settingsRow, error: settingsErr } = await supabase
      .from('site_settings')
      .select('*')
      .single();
    if (settingsErr || !settingsRow) return 0;

    const sectionsVisibility = settingsRow.sections_visibility || ({} as Record<string, any>);
    const platformPageVersion = sectionsVisibility._platform_page_version || 'v1';
    const platformContextToggle = sectionsVisibility._platform_context_toggle ?? false;
    const platformSidekickPanelStyle = sectionsVisibility._platform_sidekick_panel_style || 'right_overlay';
    const platformV3TeamAvatars = sectionsVisibility._platform_v3_team_avatars || 'header_row';
    const platformV3MinimalChat = sectionsVisibility._platform_v3_minimal_chat ?? false;
    const platformSidebarLeft = sectionsVisibility._platform_sidebar_left ?? false;
    const platformV4LeftPanel = sectionsVisibility._platform_v4_left_panel || 'sidekick_chat';
    const platformShowcaseSection = sectionsVisibility._platform_showcase_section ?? false;

    const rows: Omit<PageComponentRow, 'id' | 'created_at' | 'updated_at'>[] = [];
    let orderIndex = 0;

    rows.push({
      page_id: 'platform',
      component_type: 'platform_hero',
      display_name: 'Platform Hero',
      settings: {},
      order_index: orderIndex++,
      is_visible: true,
    });

    rows.push({
      page_id: 'platform',
      component_type: 'department_bar',
      display_name: 'Department Bar',
      settings: {},
      order_index: orderIndex++,
      is_visible: true,
    });

    rows.push({
      page_id: 'platform',
      component_type: 'jtbd_workspace',
      display_name: 'JTBD Workspace',
      settings: {
        platform_page_version: platformPageVersion,
        context_toggle: platformContextToggle,
        sidekick_panel_style: platformSidekickPanelStyle,
        v3_team_avatars: platformV3TeamAvatars,
        v3_minimal_chat: platformV3MinimalChat,
        sidebar_left: platformSidebarLeft,
        v4_left_panel: platformV4LeftPanel,
      },
      order_index: orderIndex++,
      is_visible: true,
    });

    if (platformShowcaseSection) {
      rows.push({
        page_id: 'platform',
        component_type: 'platform_showcase',
        display_name: 'Platform Showcase',
        settings: {},
        order_index: orderIndex++,
        is_visible: true,
      });
    }

    if (rows.length === 0) return 0;
    const { error: insertErr } = await supabase.from('page_components').insert(rows);
    if (insertErr) throw insertErr;
    return rows.length;
  } catch (err: any) {
    console.error('migratePlatformToPageComponents:', err.message);
    return 0;
  }
}

/** Ensures newly-registered platform components exist in page_components. Adds any missing ones at the end. */
export async function ensurePlatformComponents(): Promise<number> {
  const requiredComponents: { type: string; name: string; settings: Record<string, any> }[] = [
    { type: 'use_cases_showcase', name: 'Use Cases Showcase', settings: { use_cases_variant: 'cards_grid' } },
    { type: 'department_agents_showcase', name: 'Department Agents Showcase', settings: {} },
  ];

  try {
    const { data: existing } = await supabase
      .from('page_components')
      .select('component_type, order_index')
      .eq('page_id', 'platform');

    if (!existing || existing.length === 0) return 0;

    const existingTypes = new Set(existing.map(c => c.component_type));
    const maxOrder = Math.max(...existing.map(c => c.order_index), 0);
    const missing = requiredComponents.filter(r => !existingTypes.has(r.type));
    if (missing.length === 0) return 0;

    const rows: Omit<PageComponentRow, 'id' | 'created_at' | 'updated_at'>[] = missing.map((m, i) => ({
      page_id: 'platform',
      component_type: m.type,
      display_name: m.name,
      settings: m.settings,
      order_index: maxOrder + 1 + i,
      is_visible: true,
    }));

    const { error } = await supabase.from('page_components').insert(rows);
    if (error) throw error;
    return rows.length;
  } catch (err: any) {
    console.error('ensurePlatformComponents:', err.message);
    return 0;
  }
}

// ─── Backward Compatibility: Sync page_components → site_settings ────────────

/**
 * Reads page_components for 'homepage' and syncs the corresponding fields
 * back to site_settings so that the existing frontend rendering
 * continues to work without any changes.
 */
export async function syncHomepageToSiteSettings(): Promise<void> {
  try {
    const { data: comps, error: compErr } = await supabase
      .from('page_components')
      .select('*')
      .eq('page_id', 'homepage')
      .order('order_index', { ascending: true });

    if (compErr || !comps || comps.length === 0) return;

    // Build sections_visibility
    const sectionsVisibility: Record<string, any> = {};
    const sectionsOrder: string[] = [];

    for (const comp of comps) {
      const key = comp.component_type;
      sectionsVisibility[key] = comp.is_visible;
      sectionsOrder.push(key);
    }

    // Extract specific settings from component instances
    const heroComp = comps.find(c => c.component_type === 'hero');
    const sidekickComp = comps.find(c => c.component_type === 'sidekick');
    const departmentsComp = comps.find(c => c.component_type === 'departments');
    const aiPlatformComp = comps.find(c => c.component_type === 'ai_platform');
    const teamsV2Comp = comps.find(c => c.component_type === 'teams_and_agents_v2');
    const archComp = comps.find(c => c.component_type === 'ai_platform_architecture');

    // Build hero_settings from hero component settings
    const heroSettings = heroComp?.settings || {};

    // Build solution_tabs_visibility
    const solutionTabsVis = aiPlatformComp?.settings?.solution_tabs_visibility || null;

    // Build sections_visibility with extra underscore-prefixed fields
    const sectionsVisibilityWithExtras = {
      ...sectionsVisibility,
      _order: sectionsOrder,
      _teams_agents_v2_layout: teamsV2Comp?.settings?.layout || 'mixed_circle',
      _team_flanked_featured_agents: teamsV2Comp?.settings?.team_flanked_featured_agents || {},
      _ai_platform_arch_layout: archComp?.settings?.layout || 'app_frame_canvas',
      _platform_architecture_variant: archComp?.settings?.architecture_variant || 'classic',
    };

    // Build update payload
    const updateData: Record<string, any> = {
      sections_visibility: sectionsVisibilityWithExtras,
      updated_at: new Date().toISOString(),
    };

    if (Object.keys(heroSettings).length > 0) {
      updateData.hero_settings = heroSettings;
    }
    if (solutionTabsVis) {
      updateData.solution_tabs_visibility = solutionTabsVis;
    }
    if (departmentsComp?.settings?.hero_title) {
      updateData.hero_title = departmentsComp.settings.hero_title;
    }
    if (sidekickComp?.settings) {
      if (sidekickComp.settings.hero_theme !== undefined) {
        updateData.sidekick_hero_theme = sidekickComp.settings.hero_theme;
      }
      if (sidekickComp.settings.inaction_theme !== undefined) {
        updateData.sidekick_inaction_theme = sidekickComp.settings.inaction_theme;
      }
    }

    await supabase
      .from('site_settings')
      .update(updateData)
      .eq('id', 'main');
  } catch (err: any) {
    console.error('syncHomepageToSiteSettings:', err.message);
  }
}

/**
 * Reads page_components for 'platform' and syncs the relevant platform
 * options back to site_settings.sections_visibility underscore fields.
 */
export async function syncPlatformToSiteSettings(): Promise<void> {
  try {
    const { data: comps, error: compErr } = await supabase
      .from('page_components')
      .select('*')
      .eq('page_id', 'platform')
      .order('order_index', { ascending: true });

    if (compErr || !comps || comps.length === 0) return;

    // Get existing sections_visibility to merge into
    const { data: settingsRow } = await supabase
      .from('site_settings')
      .select('sections_visibility')
      .single();

    const existingVis = (settingsRow?.sections_visibility || {}) as Record<string, any>;

    const jtbdComp = comps.find(c => c.component_type === 'jtbd_workspace');
    const showcaseComp = comps.find(c => c.component_type === 'platform_showcase');
    const heroComp = comps.find(c => c.component_type === 'platform_hero');
    const archLayerComp = comps.find(c => c.component_type === 'platform_architecture_layer');
    const useCasesComp = comps.find(c => c.component_type === 'use_cases_showcase');

    const updatedVis = {
      ...existingVis,
      _platform_page_version: jtbdComp?.settings?.platform_page_version || existingVis._platform_page_version || 'v1',
      _platform_context_toggle: jtbdComp?.settings?.context_toggle ?? existingVis._platform_context_toggle ?? false,
      _platform_sidekick_panel_style: jtbdComp?.settings?.sidekick_panel_style || existingVis._platform_sidekick_panel_style || 'right_overlay',
      _platform_v3_team_avatars: jtbdComp?.settings?.v3_team_avatars || existingVis._platform_v3_team_avatars || 'header_row',
      _platform_v3_minimal_chat: jtbdComp?.settings?.v3_minimal_chat ?? existingVis._platform_v3_minimal_chat ?? false,
      _platform_sidebar_left: jtbdComp?.settings?.sidebar_left ?? existingVis._platform_sidebar_left ?? false,
      _platform_v4_left_panel: jtbdComp?.settings?.v4_left_panel || existingVis._platform_v4_left_panel || 'sidekick_chat',
      _platform_showcase_section: showcaseComp ? showcaseComp.is_visible : (existingVis._platform_showcase_section ?? false),
      _platform_show_jtbd_sidebar: jtbdComp?.settings?.show_jtbd_sidebar ?? existingVis._platform_show_jtbd_sidebar ?? true,
      _platform_show_inline_sidekick: jtbdComp?.settings?.show_inline_sidekick ?? existingVis._platform_show_inline_sidekick ?? false,
      _platform_show_department_bar: jtbdComp?.settings?.show_department_bar ?? existingVis._platform_show_department_bar ?? true,
      _platform_showcase_show_jtbd_sidebar: showcaseComp?.settings?.show_jtbd_sidebar ?? existingVis._platform_showcase_show_jtbd_sidebar ?? true,
      _platform_showcase_show_inline_sidekick: showcaseComp?.settings?.show_inline_sidekick ?? existingVis._platform_showcase_show_inline_sidekick ?? false,
      _platform_showcase_show_department_bar: showcaseComp?.settings?.show_department_bar || existingVis._platform_showcase_show_department_bar || 'horizontal',
      _platform_showcase_variant: showcaseComp?.settings?.showcase_variant || existingVis._platform_showcase_variant || 'classic',
      _platform_show_intro: jtbdComp?.settings?.show_intro ?? existingVis._platform_show_intro ?? false,
      _platform_intro_style: jtbdComp?.settings?.intro_style || existingVis._platform_intro_style || 'unified',
      _platform_hero_variant: heroComp?.settings?.hero_variant || existingVis._platform_hero_variant || 'typewriter',
      _platform_architecture_variant: archLayerComp?.settings?.architecture_variant || existingVis._platform_architecture_variant || 'classic',
      _platform_use_cases_variant: useCasesComp?.settings?.use_cases_variant || existingVis._platform_use_cases_variant || 'cards_grid',
    };

    await supabase
      .from('site_settings')
      .update({
        sections_visibility: updatedVis,
        updated_at: new Date().toISOString(),
      })
      .eq('id', 'main');
  } catch (err: any) {
    console.error('syncPlatformToSiteSettings:', err.message);
  }
}
