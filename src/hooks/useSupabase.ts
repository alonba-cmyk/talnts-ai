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
        const { _order, _teams_agents_v2_layout, _team_flanked_featured_agents, _ai_platform_arch_layout, ...sectionsVisibilityWithoutOrder } = sectionsVisibilityData;
        
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
        });
      }
    } catch (err: any) {
      console.log('No site settings found, using defaults:', err.message);
      setError(err.message);
    } finally {
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
