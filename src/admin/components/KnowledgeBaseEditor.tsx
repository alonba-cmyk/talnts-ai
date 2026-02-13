import { useState, useEffect, useMemo } from 'react';
import { Plus, Trash2, Save, X, Edit2, Package, Users, Sparkles, Zap, Database, ChevronRight, ChevronUp, Building2, Target, AlertCircle, Wand2, ArrowLeft, Search, ChevronDown, ArrowUpDown, Undo2, Palette, Eye, MessageSquare, GripVertical, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { ImageUploader } from './ImageUploader';
import { useVibeTheme, vibePresets, type VibeCardTheme } from '@/contexts/VibeThemeContext';

// Import product icons
import imgWM from "@/assets/5d4f550f18adfa644c6653f867bc960bdc8a53dc.png";
import imgCRM from "@/assets/6cf10de3ca3f528bc9d9457024ed87915acf1b6f.png";
import imgCampaigns from "@/assets/41abe475f056daef6e610ed3282d554ea3b88606.png";
import imgService from "@/assets/9fae7b5cd33e1ccaf1f329bad81508b9daae5210.png";
import imgDev from "@/assets/f416d94ad48b77a56df38e1f5ca7412f0e86202f.png";
import imgVibe from "@/assets/069a22575b2de9057cfc00d9b4538d072f7fe115.png";
import imgSidekick from "@/assets/sidekick-icon.png";
import imgAgents from "@/assets/agents-icon.png";
import imgWorkflows from "@/assets/workflows-icon.png";

// Get the correct icon based on item name
function getProductIcon(name: string): string | null {
  const nameLower = name.toLowerCase();
  if (nameLower.includes('work management')) return imgWM;
  if (nameLower.includes('crm')) return imgCRM;
  if (nameLower.includes('campaign')) return imgCampaigns;
  if (nameLower.includes('service')) return imgService;
  if (nameLower.includes('dev')) return imgDev;
  if (nameLower.includes('vibe')) return imgVibe;
  if (nameLower.includes('sidekick')) return imgSidekick;
  if (nameLower.includes('workflow')) return imgWorkflows;
  if (nameLower.includes('agent')) return imgAgents;
  return null;
}

// Get tab-specific default icon
function getTabDefaultIcon(tabId: TabType): string | null {
  switch (tabId) {
    case 'agents': return imgAgents;
    case 'vibeapps': return imgVibe;
    case 'sidekick': return imgSidekick;
    default: return null;
  }
}

// Default placeholder images for Vibe apps (from monday.com/vibe)
const defaultVibeImages = [
  'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Campaign_health_tracker.svg',
  'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Social_media_content_calendar.svg',
  'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Customer_segmentation_app.svg',
  'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Deal_flow_analyzer.svg',
  'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Sales_forecasting_app.svg',
  'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Account_portfolio_tracker.svg',
  'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Supply_chain_tracker.svg',
  'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/OKR_monitoring_app.svg',
];

// Get a placeholder image for Vibe apps based on index
function getDefaultVibeImage(index: number): string {
  return defaultVibeImages[index % defaultVibeImages.length];
}

type TabType = 'products' | 'agents' | 'vibeapps' | 'sidekick';

interface ContentItem {
  id: string;
  name: string;
  description: string | null;
  value: string | null;
  image: string | null;
  department_id: string | null;
  order_index: number;
  is_active: boolean;
}

interface Department {
  id: string;
  name: string;
  title: string;
}

// Generic Intent Type (Departments, Outcomes, Pain Points, AI Transformations)
interface IntentType {
  id: string;
  title: string;
  avatar_color?: string;
}

// Tracks where each item is linked (counts)
interface ItemLinks {
  departments: number;
  outcomes: number;
  painPoints: number;
  aiTransformations: number;
}

// Tracks actual linked names for display
interface ItemLinkDetails {
  departmentNames: string[];
  outcomeNames: string[];
  painPointNames: string[];
  aiTransformationNames: string[];
}

// ─── Capability Messaging Types ─────────────────────────────────────────────

interface ValuePoint {
  title: string;
  description: string;
}

interface CapabilityMessaging {
  id?: string;
  capability_type: string;
  headline: string;
  value_points: ValuePoint[];
  hero_image: string;
}

// Map tab IDs to capability_type values
const tabToCapabilityType: Record<string, string> = {
  agents: 'agents',
  vibeapps: 'vibe',
  sidekick: 'sidekick',
};

// Default messaging from product slides (used as fallback if DB is empty)
const defaultCapabilityMessaging: Record<string, CapabilityMessaging> = {
  agents: {
    capability_type: 'agents',
    headline: 'Unlimited resources of expert agents doing the work for you',
    hero_image: '',
    value_points: [
      { title: 'Start with expert agents', description: 'or build your own with the Agent Builder for any end-to-end workflow' },
      { title: 'Scale execution', description: 'with autonomous, always-on action across all your workflows' },
      { title: 'Plan, assign, and route', description: 'requests automatically while identifying and flagging potential bottlenecks' },
      { title: 'Customize skills', description: 'and terminology to match your specific workflows, native to your boards and context' },
      { title: 'Acts where you work', description: 'stepping in only when and where you decide' },
      { title: 'Stay in full control', description: 'with guardrails and enterprise-ready security and permissions' },
    ],
  },
  vibe: {
    capability_type: 'vibe',
    headline: 'Turn any business need into a complete solution — consolidate your stack with just a prompt',
    hero_image: '',
    value_points: [
      { title: 'Build any work app', description: 'you can imagine tailored to your team needs' },
      { title: 'Consolidate your stack', description: 'by replacing tools with tailored apps' },
      { title: 'Natively connect', description: 'to your data, workflows and integrations ecosystem' },
      { title: 'Customize to perfection', description: '' },
      { title: 'Secure and enterprise-ready', description: '' },
      { title: "Every app runs on monday.com's trusted infrastructure", description: '' },
    ],
  },
  sidekick: {
    capability_type: 'sidekick',
    headline: 'Your intelligent AI assistant that understands your work, thinks and executes with you',
    hero_image: '',
    value_points: [
      { title: 'Knows you and your business', description: 'understands your role, goals, and active work across monday.com and connected apps for precise responses' },
      { title: 'Accelerates work at every level', description: 'from planning and research to execution — handling your tasks from start to finish' },
      { title: 'Works the way you do', description: 'Sidekick learns your workflows, preferences, and style with every interaction to help you perform at your best' },
      { title: 'Keeps you in total control', description: 'every action is transparent and adjustable. You orchestrate and Sidekick executes' },
      { title: 'Delivers answers you can trust', description: 'Securely connected to the web and powered by advanced LLMs for accurate, real-world moves' },
    ],
  },
};

const tabs = [
  { 
    id: 'agents' as TabType, 
    label: 'Agents', 
    icon: Users, 
    iconImage: imgAgents,
    table: 'agents',
    description: 'AI agents that perform specialized tasks',
    color: '#8b5cf6'
  },
  { 
    id: 'vibeapps' as TabType, 
    label: 'Vibe Apps', 
    icon: Sparkles, 
    iconImage: imgVibe,
    table: 'vibe_apps',
    description: 'Custom apps built with Vibe AI app builder',
    color: '#ec4899'
  },
  { 
    id: 'sidekick' as TabType, 
    label: 'Sidekick', 
    icon: Zap, 
    iconImage: imgSidekick,
    table: 'sidekick_actions',
    description: 'Quick AI actions available everywhere',
    color: '#f59e0b'
  },
];

interface KnowledgeBaseEditorProps {
  defaultTab?: TabType | null;
  onTabChange?: () => void;
  onBack?: () => void;
}

export function KnowledgeBaseEditor({ defaultTab, onTabChange, onBack }: KnowledgeBaseEditorProps) {
  const [activeTab, setActiveTab] = useState<TabType>(defaultTab || 'agents');
  const [items, setItems] = useState<ContentItem[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Link counts per item (shows where each item is used)
  const [itemLinks, setItemLinks] = useState<Record<string, ItemLinks>>({});
  
  // Actual linked names for display
  const [itemLinkDetails, setItemLinkDetails] = useState<Record<string, ItemLinkDetails>>({});
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'name-desc' | 'links'>('name');
  
  // Accordion state for grouped items
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // Capability messaging state
  const [messaging, setMessaging] = useState<CapabilityMessaging | null>(null);
  const [messagingExpanded, setMessagingExpanded] = useState(false);
  const [editingMessaging, setEditingMessaging] = useState(false);
  const [messagingForm, setMessagingForm] = useState<CapabilityMessaging>({
    capability_type: '', headline: '', value_points: [], hero_image: ''
  });
  const [savingMessaging, setSavingMessaging] = useState(false);
  const [messagingMessage, setMessagingMessage] = useState<string | null>(null);

  // All Intent Types for assignment in edit form
  const [allDepartments, setAllDepartments] = useState<IntentType[]>([]);
  const [allOutcomes, setAllOutcomes] = useState<IntentType[]>([]);
  const [allPainPoints, setAllPainPoints] = useState<IntentType[]>([]);
  const [allAITransformations, setAllAITransformations] = useState<IntentType[]>([]);

  // Linked Intent Type IDs for currently edited item
  const [linkedDepts, setLinkedDepts] = useState<string[]>([]);
  const [linkedOutcomes, setLinkedOutcomes] = useState<string[]>([]);
  const [linkedPainPoints, setLinkedPainPoints] = useState<string[]>([]);
  const [linkedAITrans, setLinkedAITrans] = useState<string[]>([]);

  // Pending changes for Intent Type assignments (for Save button functionality)
  const [pendingIntentAdditions, setPendingIntentAdditions] = useState<{
    departments: Set<string>;
    outcomes: Set<string>;
    pain_points: Set<string>;
    ai_transformations: Set<string>;
  }>({ departments: new Set(), outcomes: new Set(), pain_points: new Set(), ai_transformations: new Set() });
  
  const [pendingIntentRemovals, setPendingIntentRemovals] = useState<{
    departments: Set<string>;
    outcomes: Set<string>;
    pain_points: Set<string>;
    ai_transformations: Set<string>;
  }>({ departments: new Set(), outcomes: new Set(), pain_points: new Set(), ai_transformations: new Set() });
  
  const [isSavingIntents, setIsSavingIntents] = useState(false);

  // Calculate if there are unsaved intent changes
  const hasUnsavedIntentChanges = 
    pendingIntentAdditions.departments.size > 0 || pendingIntentAdditions.outcomes.size > 0 || 
    pendingIntentAdditions.pain_points.size > 0 || pendingIntentAdditions.ai_transformations.size > 0 ||
    pendingIntentRemovals.departments.size > 0 || pendingIntentRemovals.outcomes.size > 0 || 
    pendingIntentRemovals.pain_points.size > 0 || pendingIntentRemovals.ai_transformations.size > 0;

  const pendingIntentChangesCount = 
    pendingIntentAdditions.departments.size + pendingIntentAdditions.outcomes.size + 
    pendingIntentAdditions.pain_points.size + pendingIntentAdditions.ai_transformations.size +
    pendingIntentRemovals.departments.size + pendingIntentRemovals.outcomes.size + 
    pendingIntentRemovals.pain_points.size + pendingIntentRemovals.ai_transformations.size;

  // Undo functionality - stores previous state before save
  const [previousState, setPreviousState] = useState<{
    item: ContentItem | null;
    intents: {
      departments: string[];
      outcomes: string[];
      painPoints: string[];
      aiTransformations: string[];
    };
  } | null>(null);
  const [canUndo, setCanUndo] = useState(false);
  const [lastSavedItemId, setLastSavedItemId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    value: '',
    image: '',
    images: [] as string[],  // Additional gallery images
    department_id: '',
    background_color: '',  // For Vibe apps custom background
  });
  
  // Vibe theme context for preview
  const { theme: vibeTheme } = useVibeTheme();

  const currentTab = tabs.find(t => t.id === activeTab)!;

  // Switch to default tab when it's provided (from navigation)
  useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
      onTabChange?.();
    }
  }, [defaultTab]);

  useEffect(() => {
    fetchDepartments();
    fetchAllIntentTypes();
  }, []);

  useEffect(() => {
    fetchItems();
    fetchMessaging();
    setMessagingExpanded(false);
    setEditingMessaging(false);
  }, [activeTab]);

  // ─── Capability Messaging fetch/save ──────────────────────────────────────

  const fetchMessaging = async () => {
    const capType = tabToCapabilityType[activeTab];
    if (!capType) { setMessaging(null); return; }
    try {
      const { data } = await supabase
        .from('capability_messaging')
        .select('*')
        .eq('capability_type', capType)
        .single();
      // Use DB data if available, otherwise fall back to slide defaults
      setMessaging(data || defaultCapabilityMessaging[capType] || null);
    } catch {
      // Table might not exist yet — use defaults from slides
      setMessaging(defaultCapabilityMessaging[capType] || null);
    }
  };

  const saveMessaging = async () => {
    setSavingMessaging(true);
    const capType = tabToCapabilityType[activeTab];
    if (!capType) return;

    const payload = {
      capability_type: capType,
      headline: messagingForm.headline,
      value_points: messagingForm.value_points,
      hero_image: messagingForm.hero_image,
    };

    if (messaging?.id) {
      await supabase.from('capability_messaging').update(payload).eq('id', messaging.id);
    } else {
      await supabase.from('capability_messaging').insert(payload);
    }

    await fetchMessaging();
    setEditingMessaging(false);
    setSavingMessaging(false);
    setMessagingMessage('Saved!');
    setTimeout(() => setMessagingMessage(null), 2000);
  };

  const startEditMessaging = () => {
    setMessagingForm(messaging ? { ...messaging } : {
      capability_type: tabToCapabilityType[activeTab] || '',
      headline: '',
      value_points: [],
      hero_image: '',
    });
    setEditingMessaging(true);
  };

  const addValuePoint = () => {
    setMessagingForm(f => ({
      ...f,
      value_points: [...f.value_points, { title: '', description: '' }],
    }));
  };

  const removeValuePoint = (idx: number) => {
    setMessagingForm(f => ({
      ...f,
      value_points: f.value_points.filter((_, i) => i !== idx),
    }));
  };

  const updateValuePoint = (idx: number, field: 'title' | 'description', val: string) => {
    setMessagingForm(f => ({
      ...f,
      value_points: f.value_points.map((vp, i) => i === idx ? { ...vp, [field]: val } : vp),
    }));
  };

  // ─── End Capability Messaging ─────────────────────────────────────────────

  const fetchDepartments = async () => {
    const { data } = await supabase.from('departments').select('id, name, title').order('order_index');
    if (data) setDepartments(data);
  };

  // Fetch all Intent Types for assignment UI
  const fetchAllIntentTypes = async () => {
    const [depts, outcomes, painPoints, aiTrans] = await Promise.all([
      supabase.from('departments').select('id, title, avatar_color').order('order_index'),
      supabase.from('outcomes').select('id, title, avatar_color').order('order_index'),
      supabase.from('pain_points').select('id, title, avatar_color').order('order_index'),
      supabase.from('ai_transformations').select('id, title, avatar_color').order('order_index'),
    ]);

    if (depts.data) setAllDepartments(depts.data);
    if (outcomes.data) setAllOutcomes(outcomes.data);
    if (painPoints.data) setAllPainPoints(painPoints.data);
    if (aiTrans.data) setAllAITransformations(aiTrans.data);
  };

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from(currentTab.table)
      .select('*')
      .order('order_index');
    
    if (!error && data) {
      setItems(data);
      // Fetch link counts for these items
      await fetchItemLinks(data.map(item => item.id));
    }
    setLoading(false);
  };

  // Fetch where each item is linked (departments, outcomes, pain_points, ai_transformations)
  const fetchItemLinks = async (itemIds: string[]) => {
    if (itemIds.length === 0) {
      setItemLinks({});
      setItemLinkDetails({});
      return;
    }

    const idFieldName = activeTab === 'products' ? 'product_id' :
                        activeTab === 'agents' ? 'agent_id' :
                        activeTab === 'vibeapps' ? 'vibe_app_id' : 'sidekick_action_id';

    const contentType = activeTab === 'vibeapps' ? 'vibe_apps' : 
                        activeTab === 'sidekick' ? 'sidekick_actions' : activeTab;

    // Fetch from all junction tables with names in parallel
    const [deptLinks, outcomeLinks, painPointLinks, aiTransLinks] = await Promise.all([
      supabase.from(`department_${contentType}`).select(`${idFieldName}, department_id, departments(title)`),
      supabase.from(`outcome_${contentType}`).select(`${idFieldName}, outcome_id, outcomes(title)`),
      supabase.from(`pain_point_${contentType}`).select(`${idFieldName}, pain_point_id, pain_points(title)`),
      supabase.from(`ai_transformation_${contentType}`).select(`${idFieldName}, ai_transformation_id, ai_transformations(title)`),
    ]);

    // Count links per item and collect names
    const links: Record<string, ItemLinks> = {};
    const details: Record<string, ItemLinkDetails> = {};
    
    itemIds.forEach(id => {
      links[id] = { departments: 0, outcomes: 0, painPoints: 0, aiTransformations: 0 };
      details[id] = { departmentNames: [], outcomeNames: [], painPointNames: [], aiTransformationNames: [] };
    });

    // Process department links
    (deptLinks.data || []).forEach((link: any) => {
      const itemId = link[idFieldName];
      if (links[itemId]) {
        links[itemId].departments++;
        const name = link.departments?.title;
        if (name && !details[itemId].departmentNames.includes(name)) {
          details[itemId].departmentNames.push(name);
        }
      }
    });

    // Process outcome links
    (outcomeLinks.data || []).forEach((link: any) => {
      const itemId = link[idFieldName];
      if (links[itemId]) {
        links[itemId].outcomes++;
        const name = link.outcomes?.title;
        if (name && !details[itemId].outcomeNames.includes(name)) {
          details[itemId].outcomeNames.push(name);
        }
      }
    });

    // Process pain point links
    (painPointLinks.data || []).forEach((link: any) => {
      const itemId = link[idFieldName];
      if (links[itemId]) {
        links[itemId].painPoints++;
        const name = link.pain_points?.title;
        if (name && !details[itemId].painPointNames.includes(name)) {
          details[itemId].painPointNames.push(name);
        }
      }
    });

    // Process AI transformation links
    (aiTransLinks.data || []).forEach((link: any) => {
      const itemId = link[idFieldName];
      if (links[itemId]) {
        links[itemId].aiTransformations++;
        const name = link.ai_transformations?.title;
        if (name && !details[itemId].aiTransformationNames.includes(name)) {
          details[itemId].aiTransformationNames.push(name);
        }
      }
    });

    setItemLinks(links);
    setItemLinkDetails(details);
  };

  const resetForm = (skipWarning = false) => {
    // Check for unsaved changes before resetting
    if (!skipWarning && hasUnsavedIntentChanges && !confirm('You have unsaved assignment changes. Discard them?')) {
      return;
    }
    
    setFormData({
      name: '',
      description: '',
      value: '',
      image: '',
      images: [],
      department_id: '',
      background_color: '',
    });
    setShowAddForm(false);
    setEditingId(null);
    clearLinkedIntentTypes();
    resetPendingIntentChanges();
  };

  // Handle modal close with unsaved changes check
  const handleCloseModal = () => {
    if (hasUnsavedIntentChanges) {
      if (!confirm('יש לך שינויים שלא נשמרו. לסגור בלי לשמור?')) {
        return;
      }
    }
    resetForm(true);
  };

  // ESC key handler for modal
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && (showAddForm || editingId)) {
        handleCloseModal();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showAddForm, editingId, hasUnsavedIntentChanges]);

  const handleAdd = async () => {
    if (!formData.name.trim()) return;

    // For Vibe apps, use a default placeholder image if none provided
    let imageToUse = formData.image || null;
    if (activeTab === 'vibeapps' && !imageToUse) {
      imageToUse = getDefaultVibeImage(items.length);
    }

    const insertData: Record<string, unknown> = {
      name: formData.name,
      description: formData.description || null,
      value: formData.value || null,
      image: imageToUse,
      order_index: items.length,
      is_active: true,
    };

    // Add images array for products only
    if (activeTab === 'products') {
      insertData.images = formData.images || [];
    }

    // Add background_color for Vibe apps
    if (activeTab === 'vibeapps' && formData.background_color) {
      insertData.background_color = formData.background_color;
    }

    // Only add department_id if selected
    if (formData.department_id) {
      insertData.department_id = formData.department_id;
    }

    const { data: insertedData, error } = await supabase
      .from(currentTab.table)
      .insert(insertData)
      .select('id')
      .single();

    if (!error && insertedData) {
      const newItemId = insertedData.id;
      
      // Get the correct ID field name for junction tables
      const contentType = currentTab.table === 'vibe_apps' ? 'vibe_apps' : currentTab.table;
      const idFieldName = contentType === 'vibe_apps' ? 'vibe_app_id' : 
                          contentType === 'sidekick_actions' ? 'sidekick_action_id' :
                          contentType === 'products' ? 'product_id' : 'agent_id';
      
      // Save pending intent type additions
      const junctionPromises: Promise<any>[] = [];
      
      // Add departments
      pendingIntentAdditions.departments.forEach(deptId => {
        junctionPromises.push(
          supabase.from(`department_${contentType}`).insert({ 
            department_id: deptId, 
            [idFieldName]: newItemId 
          })
        );
      });
      
      // Add outcomes
      pendingIntentAdditions.outcomes.forEach(outcomeId => {
        junctionPromises.push(
          supabase.from(`outcome_${contentType}`).insert({ 
            outcome_id: outcomeId, 
            [idFieldName]: newItemId 
          })
        );
      });
      
      // Add pain points
      pendingIntentAdditions.painPoints.forEach(ppId => {
        junctionPromises.push(
          supabase.from(`pain_point_${contentType}`).insert({ 
            pain_point_id: ppId, 
            [idFieldName]: newItemId 
          })
        );
      });
      
      // Add AI transformations
      pendingIntentAdditions.aiTransformations.forEach(atId => {
        junctionPromises.push(
          supabase.from(`ai_transformation_${contentType}`).insert({ 
            ai_transformation_id: atId, 
            [idFieldName]: newItemId 
          })
        );
      });
      
      // Execute all junction table insertions
      await Promise.all(junctionPromises);
      
      await fetchItems();
      resetForm();
    }
  };

  const handleUpdate = async (id: string) => {
    // Store current state before updating (for Undo functionality)
    const currentItem = items.find(item => item.id === id);
    if (currentItem) {
      setPreviousState({
        item: { ...currentItem },
        intents: {
          departments: [...linkedDepts],
          outcomes: [...linkedOutcomes],
          painPoints: [...linkedPainPoints],
          aiTransformations: [...linkedAITrans],
        }
      });
      setLastSavedItemId(id);
    }

    // For Vibe apps, use a default placeholder image if none provided
    let imageToUse = formData.image || null;
    if (activeTab === 'vibeapps' && !imageToUse) {
      const itemIndex = items.findIndex(item => item.id === id);
      imageToUse = getDefaultVibeImage(itemIndex >= 0 ? itemIndex : 0);
    }

    const updateData: Record<string, unknown> = {
      name: formData.name,
      description: formData.description || null,
      value: formData.value || null,
      image: imageToUse,
    };

    // Add images array for products only
    if (activeTab === 'products') {
      updateData.images = formData.images || [];
    }

    // Add background_color for Vibe apps
    if (activeTab === 'vibeapps') {
      updateData.background_color = formData.background_color || null;
    }

    if (formData.department_id) {
      updateData.department_id = formData.department_id;
    }

    const { error } = await supabase
      .from(currentTab.table)
      .update(updateData)
      .eq('id', id);

    if (!error) {
      // Also save any pending intent type assignments
      if (hasUnsavedIntentChanges) {
        await saveIntentLinksInternal(id);
      }
      await fetchItems();
      resetForm(true); // Skip warning since we just saved
      setCanUndo(true); // Enable undo after successful save
    }
  };

  // Undo last save - restore previous state
  const handleUndo = async () => {
    if (!previousState || !lastSavedItemId) return;

    const { item, intents } = previousState;
    if (!item) return;

    // Restore item data
    const updateData: Record<string, unknown> = {
      name: item.name,
      description: item.description,
      value: item.value,
      image: item.image,
    };

    // Add images array for products only
    if (activeTab === 'products' && (item as any).images) {
      updateData.images = (item as any).images;
    }

    if (item.department_id) {
      updateData.department_id = item.department_id;
    }

    const { error } = await supabase
      .from(currentTab.table)
      .update(updateData)
      .eq('id', lastSavedItemId);

    if (!error) {
      // Restore intent links
      const contentType = activeTab === 'vibeapps' ? 'vibe_apps' : 
                          activeTab === 'sidekick' ? 'sidekick_actions' : activeTab;

      const idFieldName = activeTab === 'products' ? 'product_id' :
                          activeTab === 'agents' ? 'agent_id' :
                          activeTab === 'vibeapps' ? 'vibe_app_id' : 'sidekick_action_id';

      // Delete all current links and restore previous ones
      const linkConfigs = [
        { table: `department_${contentType}`, field: 'department_id', values: intents.departments },
        { table: `outcome_${contentType}`, field: 'outcome_id', values: intents.outcomes },
        { table: `pain_point_${contentType}`, field: 'pain_point_id', values: intents.painPoints },
        { table: `ai_transformation_${contentType}`, field: 'ai_transformation_id', values: intents.aiTransformations },
      ];

      for (const config of linkConfigs) {
        // Delete current links
        await supabase
          .from(config.table)
          .delete()
          .eq(idFieldName, lastSavedItemId);

        // Insert previous links
        for (const intentId of config.values) {
          await supabase
            .from(config.table)
            .insert({ [idFieldName]: lastSavedItemId, [config.field]: intentId });
        }
      }

      await fetchItems();
      setCanUndo(false);
      setPreviousState(null);
      setLastSavedItemId(null);
    }
  };

  // Internal function to save intent links (used by both handleUpdate and handleSaveIntentLinks)
  const saveIntentLinksInternal = async (itemId: string) => {
    const contentType = activeTab === 'vibeapps' ? 'vibe_apps' : 
                        activeTab === 'sidekick' ? 'sidekick_actions' : activeTab;

    const idFieldName = activeTab === 'products' ? 'product_id' :
                        activeTab === 'agents' ? 'agent_id' :
                        activeTab === 'vibeapps' ? 'vibe_app_id' : 'sidekick_action_id';

    const intentTypes = ['departments', 'outcomes', 'pain_points', 'ai_transformations'] as const;

    for (const intentType of intentTypes) {
      const tableName = `${intentType.replace('_', '_').replace('departments', 'department').replace('outcomes', 'outcome').replace('pain_points', 'pain_point').replace('ai_transformations', 'ai_transformation')}_${contentType}`;
      const intentIdField = intentType === 'departments' ? 'department_id' :
                            intentType === 'outcomes' ? 'outcome_id' :
                            intentType === 'pain_points' ? 'pain_point_id' : 'ai_transformation_id';

      // Handle additions
      for (const intentId of pendingIntentAdditions[intentType]) {
        await supabase.from(tableName).upsert({
          [idFieldName]: itemId,
          [intentIdField]: intentId
        });
      }

      // Handle removals
      for (const intentId of pendingIntentRemovals[intentType]) {
        await supabase.from(tableName)
          .delete()
          .eq(idFieldName, itemId)
          .eq(intentIdField, intentId);
      }
    }

    resetPendingIntentChanges();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    const { error } = await supabase.from(currentTab.table).delete().eq('id', id);
    if (!error) {
      await fetchItems();
    }
  };

  // Expand a single item into separate variations per department
  const handleExpandToVariations = async () => {
    if (!editingId) return;
    
    // Get current linked departments (including pending additions, excluding pending removals)
    const currentDepts = [...linkedDepts];
    pendingIntentAdditions.departments.forEach(d => {
      if (!currentDepts.includes(d)) currentDepts.push(d);
    });
    const finalDepts = currentDepts.filter(d => !pendingIntentRemovals.departments.has(d));
    
    if (finalDepts.length < 2) {
      alert('צריך לפחות 2 מחלקות כדי ליצור וריאציות');
      return;
    }

    if (!confirm(`פעולה זו תיצור ${finalDepts.length} רשומות נפרדות - אחת לכל מחלקה.\nכל אחת תקבל עותק של התיאור הנוכחי ותוכל להיערך בנפרד.\n\nלהמשיך?`)) {
      return;
    }

    const contentType = activeTab === 'vibeapps' ? 'vibe_apps' : 
                        activeTab === 'sidekick' ? 'sidekick_actions' : activeTab;
    const idFieldName = activeTab === 'products' ? 'product_id' :
                        activeTab === 'agents' ? 'agent_id' :
                        activeTab === 'vibeapps' ? 'vibe_app_id' : 'sidekick_action_id';

    try {
      // Get current item data
      const { data: currentItem } = await supabase
        .from(currentTab.table)
        .select('*')
        .eq('id', editingId)
        .single();

      if (!currentItem) {
        alert('שגיאה: לא נמצא הפריט');
        return;
      }

      // Get current links (outcomes, pain points, AI transformations)
      const [outcomeLinks, painPointLinks, aiTransLinks] = await Promise.all([
        supabase.from(`outcome_${contentType}`).select('outcome_id').eq(idFieldName, editingId),
        supabase.from(`pain_point_${contentType}`).select('pain_point_id').eq(idFieldName, editingId),
        supabase.from(`ai_transformation_${contentType}`).select('ai_transformation_id').eq(idFieldName, editingId),
      ]);

      const outcomeIds = (outcomeLinks.data || []).map((l: any) => l.outcome_id);
      const painPointIds = (painPointLinks.data || []).map((l: any) => l.pain_point_id);
      const aiTransIds = (aiTransLinks.data || []).map((l: any) => l.ai_transformation_id);

      // Keep first department on original item, create new items for the rest
      const [firstDept, ...otherDepts] = finalDepts;

      // Update original item to only link to first department
      await supabase.from(`department_${contentType}`).delete().eq(idFieldName, editingId);
      await supabase.from(`department_${contentType}`).insert({
        [idFieldName]: editingId,
        department_id: firstDept
      });

      // Create new items for other departments
      for (const deptId of otherDepts) {
        // Create new item with same data
        const newItemData = {
          name: currentItem.name,
          description: currentItem.description || formData.description,
          value: currentItem.value || formData.value,
          image: currentItem.image || formData.image,
        };

        const { data: newItem, error: insertError } = await supabase
          .from(currentTab.table)
          .insert(newItemData)
          .select()
          .single();

        if (insertError || !newItem) {
          console.error('Error creating variation:', insertError);
          continue;
        }

        // Link to this department
        await supabase.from(`department_${contentType}`).insert({
          [idFieldName]: newItem.id,
          department_id: deptId
        });

        // Copy other links
        for (const outcomeId of outcomeIds) {
          await supabase.from(`outcome_${contentType}`).insert({
            [idFieldName]: newItem.id,
            outcome_id: outcomeId
          });
        }
        for (const painPointId of painPointIds) {
          await supabase.from(`pain_point_${contentType}`).insert({
            [idFieldName]: newItem.id,
            pain_point_id: painPointId
          });
        }
        for (const aiTransId of aiTransIds) {
          await supabase.from(`ai_transformation_${contentType}`).insert({
            [idFieldName]: newItem.id,
            ai_transformation_id: aiTransId
          });
        }
      }

      // Refresh and close modal
      await fetchItems();
      resetForm(true);
      alert(`נוצרו ${finalDepts.length} וריאציות בהצלחה!`);
    } catch (error) {
      console.error('Error expanding to variations:', error);
      alert('שגיאה ביצירת הווריאציות');
    }
  };

  const startEdit = async (item: ContentItem) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      description: item.description || '',
      value: item.value || '',
      image: item.image || '',
      images: (item as any).images || [],
      department_id: item.department_id || '',
      background_color: (item as any).background_color || '',
    });
    // Fetch linked Intent Types for this item
    await fetchLinkedIntentTypes(item.id);
  };

  // Fetch which Intent Types this item is linked to
  const fetchLinkedIntentTypes = async (itemId: string) => {
    const idFieldName = activeTab === 'products' ? 'product_id' :
                        activeTab === 'agents' ? 'agent_id' :
                        activeTab === 'vibeapps' ? 'vibe_app_id' : 'sidekick_action_id';

    const contentType = activeTab === 'vibeapps' ? 'vibe_apps' : 
                        activeTab === 'sidekick' ? 'sidekick_actions' : activeTab;

    try {
      const [deptLinks, outcomeLinks, painPointLinks, aiTransLinks] = await Promise.all([
        supabase.from(`department_${contentType}`).select('department_id').eq(idFieldName, itemId),
        supabase.from(`outcome_${contentType}`).select('outcome_id').eq(idFieldName, itemId),
        supabase.from(`pain_point_${contentType}`).select('pain_point_id').eq(idFieldName, itemId),
        supabase.from(`ai_transformation_${contentType}`).select('ai_transformation_id').eq(idFieldName, itemId),
      ]);

      setLinkedDepts((deptLinks.data || []).map((l: any) => l.department_id));
      setLinkedOutcomes((outcomeLinks.data || []).map((l: any) => l.outcome_id));
      setLinkedPainPoints((painPointLinks.data || []).map((l: any) => l.pain_point_id));
      setLinkedAITrans((aiTransLinks.data || []).map((l: any) => l.ai_transformation_id));
    } catch (error) {
      console.error('Error fetching linked Intent Types:', error);
      setLinkedDepts([]);
      setLinkedOutcomes([]);
      setLinkedPainPoints([]);
      setLinkedAITrans([]);
    }
  };

  // Clear linked Intent Types when form is reset
  const clearLinkedIntentTypes = () => {
    setLinkedDepts([]);
    setLinkedOutcomes([]);
    setLinkedPainPoints([]);
    setLinkedAITrans([]);
  };

  // Reset pending intent changes
  const resetPendingIntentChanges = () => {
    setPendingIntentAdditions({ departments: new Set(), outcomes: new Set(), pain_points: new Set(), ai_transformations: new Set() });
    setPendingIntentRemovals({ departments: new Set(), outcomes: new Set(), pain_points: new Set(), ai_transformations: new Set() });
  };

  // Toggle Intent Type link for the currently edited item (updates local state only)
  const toggleIntentLink = (
    intentType: 'departments' | 'outcomes' | 'pain_points' | 'ai_transformations',
    intentId: string,
    isCurrentlyLinked: boolean
  ) => {
    if (!editingId) return;

    // Get the original linked state (from DB)
    const originalLinked = intentType === 'departments' ? linkedDepts :
                           intentType === 'outcomes' ? linkedOutcomes :
                           intentType === 'pain_points' ? linkedPainPoints : linkedAITrans;
    const wasOriginallyLinked = originalLinked.includes(intentId);

    setPendingIntentAdditions(prev => {
      const newSet = new Set(prev[intentType]);
      if (!isCurrentlyLinked && !wasOriginallyLinked) {
        // Adding a new link that wasn't in DB
        newSet.add(intentId);
      } else {
        // Remove from additions if we're unlinking
        newSet.delete(intentId);
      }
      return { ...prev, [intentType]: newSet };
    });

    setPendingIntentRemovals(prev => {
      const newSet = new Set(prev[intentType]);
      if (isCurrentlyLinked && wasOriginallyLinked) {
        // Removing a link that was in DB
        newSet.add(intentId);
      } else {
        // Remove from removals if we're re-linking
        newSet.delete(intentId);
      }
      return { ...prev, [intentType]: newSet };
    });
  };

  // Check if an intent is currently linked (considering pending changes)
  const isIntentLinked = (intentType: 'departments' | 'outcomes' | 'pain_points' | 'ai_transformations', intentId: string): boolean => {
    const originalLinked = intentType === 'departments' ? linkedDepts :
                           intentType === 'outcomes' ? linkedOutcomes :
                           intentType === 'pain_points' ? linkedPainPoints : linkedAITrans;
    const wasOriginallyLinked = originalLinked.includes(intentId);
    const isPendingAddition = pendingIntentAdditions[intentType].has(intentId);
    const isPendingRemoval = pendingIntentRemovals[intentType].has(intentId);

    if (isPendingAddition) return true;
    if (isPendingRemoval) return false;
    return wasOriginallyLinked;
  };

  // Save all pending intent changes to Supabase
  const handleSaveIntentLinks = async () => {
    if (!editingId || !hasUnsavedIntentChanges) return;

    setIsSavingIntents(true);

    const contentType = activeTab === 'vibeapps' ? 'vibe_apps' : 
                        activeTab === 'sidekick' ? 'sidekick_actions' : activeTab;

    const idFieldName = activeTab === 'products' ? 'product_id' :
                        activeTab === 'agents' ? 'agent_id' :
                        activeTab === 'vibeapps' ? 'vibe_app_id' : 'sidekick_action_id';

    try {
      const promises: Promise<any>[] = [];

      // Process each intent type
      const intentTypes: Array<'departments' | 'outcomes' | 'pain_points' | 'ai_transformations'> = 
        ['departments', 'outcomes', 'pain_points', 'ai_transformations'];
      
      for (const intentType of intentTypes) {
        let junctionTable: string;
        let intentIdField: string;

        switch (intentType) {
          case 'departments':
            junctionTable = `department_${contentType}`;
            intentIdField = 'department_id';
            break;
          case 'outcomes':
            junctionTable = `outcome_${contentType}`;
            intentIdField = 'outcome_id';
            break;
          case 'pain_points':
            junctionTable = `pain_point_${contentType}`;
            intentIdField = 'pain_point_id';
            break;
          case 'ai_transformations':
            junctionTable = `ai_transformation_${contentType}`;
            intentIdField = 'ai_transformation_id';
            break;
        }

        // Handle removals
        for (const intentId of pendingIntentRemovals[intentType]) {
          promises.push(
            supabase.from(junctionTable).delete().eq(intentIdField, intentId).eq(idFieldName, editingId)
          );
        }

        // Handle additions
        for (const intentId of pendingIntentAdditions[intentType]) {
          promises.push(
            supabase.from(junctionTable).insert({ [intentIdField]: intentId, [idFieldName]: editingId })
          );
        }
      }

      await Promise.all(promises);

      // Refresh linked intents and reset pending changes
      await fetchItemIntentLinks(editingId);
      await fetchItemLinks(items.map(i => i.id));
      resetPendingIntentChanges();
    } catch (error) {
      console.error('Error saving intent links:', error);
      alert('Error saving changes. Please try again.');
    } finally {
      setIsSavingIntents(false);
    }
  };

  // Discard pending intent changes
  const handleDiscardIntentChanges = () => {
    if (hasUnsavedIntentChanges && !confirm('Are you sure you want to discard unsaved changes?')) {
      return false;
    }
    resetPendingIntentChanges();
    return true;
  };

  // Filter and sort items
  const filteredItems = items
    .filter(item => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description?.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc) return false;
      }
      // Department filter
      if (filterDepartment) {
        const deptNames = itemLinkDetails[item.id]?.departmentNames || [];
        if (!deptNames.includes(filterDepartment)) return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'links':
          const aLinks = (itemLinks[a.id]?.departments || 0) + (itemLinks[a.id]?.outcomes || 0) + 
                         (itemLinks[a.id]?.painPoints || 0) + (itemLinks[a.id]?.aiTransformations || 0);
          const bLinks = (itemLinks[b.id]?.departments || 0) + (itemLinks[b.id]?.outcomes || 0) + 
                         (itemLinks[b.id]?.painPoints || 0) + (itemLinks[b.id]?.aiTransformations || 0);
          return bLinks - aLinks;
        default:
          return 0;
      }
    });

  // Group items by name for accordion view (skip grouping for Vibe apps - each is unique)
  const groupedItems = useMemo(() => {
    // For Vibe apps, treat each item as unique (no grouping by name)
    if (activeTab === 'vibeapps') {
      return filteredItems.map(item => ({
        name: item.name,
        items: [item],
        hasVariations: false,
        firstItem: item
      }));
    }
    
    // For other tabs, group by name
    const groups: Record<string, ContentItem[]> = {};
    filteredItems.forEach(item => {
      if (!groups[item.name]) groups[item.name] = [];
      groups[item.name].push(item);
    });
    return Object.entries(groups).map(([name, groupItems]) => ({
      name,
      items: groupItems,
      hasVariations: groupItems.length > 1,
      // Get first item's icon for the group header
      firstItem: groupItems[0]
    }));
  }, [filteredItems, activeTab]);

  // Toggle accordion group expansion
  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupName)) {
        newSet.delete(groupName);
      } else {
        newSet.add(groupName);
      }
      return newSet;
    });
  };

  return (
    <div>
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

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
          <Sparkles className="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">AI Capabilities</h2>
          <p className="text-gray-400">Manage AI agents, Vibe apps, and Sidekick actions — the building blocks of the platform</p>
        </div>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`p-4 rounded-xl border-2 transition-all text-left ${
              activeTab === tab.id
                ? 'border-indigo-500 bg-indigo-500/10'
                : 'border-gray-700 bg-gray-900 hover:border-gray-600'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden"
                style={{ backgroundColor: `${tab.color}20` }}
              >
                {tab.iconImage ? (
                  <img src={tab.iconImage} alt={tab.label} className="w-7 h-7 object-contain" />
                ) : (
                  <tab.icon className="w-5 h-5" style={{ color: tab.color }} />
                )}
              </div>
              <span className="text-white font-semibold">{tab.label}</span>
            </div>
            <p className="text-gray-400 text-sm line-clamp-2">{tab.description}</p>
          </button>
        ))}
      </div>

      {/* Value Messaging Panel */}
      {tabToCapabilityType[activeTab] && (
        <div className="mb-6 bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <button
            onClick={() => setMessagingExpanded(!messagingExpanded)}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-800/40 transition-colors"
          >
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-indigo-400" />
              <span className="text-white font-semibold">Value Messaging</span>
              {messaging?.headline && (
                <span className="text-gray-500 text-sm ml-2 max-w-md truncate">— {messaging.headline}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {messagingMessage && (
                <span className="text-emerald-400 text-sm flex items-center gap-1"><Check className="w-3.5 h-3.5" />{messagingMessage}</span>
              )}
              {messaging?.value_points && messaging.value_points.length > 0 && (
                <span className="text-gray-500 text-xs bg-gray-800 px-2 py-0.5 rounded-full">
                  {messaging.value_points.length} points
                </span>
              )}
              <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${messagingExpanded ? 'rotate-180' : ''}`} />
            </div>
          </button>

          {messagingExpanded && (
            <div className="px-6 pb-6 border-t border-gray-800 pt-4">
              {editingMessaging ? (
                /* Edit Mode */
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Headline / Tagline</label>
                    <input
                      type="text"
                      value={messagingForm.headline}
                      onChange={e => setMessagingForm(f => ({ ...f, headline: e.target.value }))}
                      placeholder="e.g., Unlimited resources of expert agents doing the work for you"
                      className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:border-indigo-500 outline-none"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-400">Value Points</label>
                      <button onClick={addValuePoint}
                        className="flex items-center gap-1 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white text-xs transition-colors">
                        <Plus className="w-3 h-3" /> Add Point
                      </button>
                    </div>
                    <div className="space-y-3">
                      {messagingForm.value_points.map((vp, idx) => (
                        <div key={idx} className="flex gap-3 items-start bg-gray-800/50 rounded-lg p-3 border border-gray-700/50 group">
                          <div className="w-7 h-7 rounded-lg bg-indigo-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-indigo-400">{idx + 1}</span>
                          </div>
                          <div className="flex-1 space-y-2">
                            <input
                              type="text"
                              value={vp.title}
                              onChange={e => updateValuePoint(idx, 'title', e.target.value)}
                              placeholder="Bold title (e.g., Scale execution)"
                              className="w-full px-3 py-1.5 bg-gray-900 border border-gray-700 rounded-md text-white text-sm focus:border-indigo-500 outline-none font-medium"
                            />
                            <input
                              type="text"
                              value={vp.description}
                              onChange={e => updateValuePoint(idx, 'description', e.target.value)}
                              placeholder="Description (e.g., with autonomous, always-on action across all your workflows)"
                              className="w-full px-3 py-1.5 bg-gray-900 border border-gray-700 rounded-md text-gray-300 text-sm focus:border-indigo-500 outline-none"
                            />
                          </div>
                          <button onClick={() => removeValuePoint(idx)}
                            className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 rounded-lg text-gray-500 hover:text-red-400 transition-all mt-0.5">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                      {messagingForm.value_points.length === 0 && (
                        <p className="text-gray-600 text-sm text-center py-4">No value points yet. Click "Add Point" to start.</p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button onClick={saveMessaging} disabled={savingMessaging}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white font-medium text-sm transition-colors disabled:opacity-50">
                      <Save className="w-4 h-4" /> {savingMessaging ? 'Saving...' : 'Save Messaging'}
                    </button>
                    <button onClick={() => setEditingMessaging(false)}
                      className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 text-sm transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* View Mode */
                <div>
                  {messaging ? (
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <p className="text-white text-lg font-medium italic leading-relaxed">"{messaging.headline}"</p>
                        </div>
                        <button onClick={startEditMessaging}
                          className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 text-sm transition-colors ml-4 flex-shrink-0">
                          <Edit2 className="w-3.5 h-3.5" /> Edit
                        </button>
                      </div>
                      {messaging.value_points && messaging.value_points.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {messaging.value_points.map((vp: ValuePoint, idx: number) => (
                            <div key={idx} className="flex items-start gap-3 p-3 bg-gray-800/30 rounded-lg">
                              <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: currentTab.color }} />
                              <div>
                                <span className="text-white font-semibold text-sm">{vp.title}</span>
                                {vp.description && (
                                  <span className="text-gray-400 text-sm"> — {vp.description}</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <MessageSquare className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">No messaging defined yet for {currentTab.label}</p>
                      <button onClick={startEditMessaging}
                        className="mt-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white text-sm transition-colors">
                        Add Value Messaging
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Active Tab Content */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <currentTab.icon className="w-6 h-6" style={{ color: currentTab.color }} />
            <h3 className="text-xl font-semibold text-white">
              {currentTab.label} ({items.length})
            </h3>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add {currentTab.label.slice(0, -1)}
          </button>
        </div>

        {/* Undo Bar - appears after save */}
        {canUndo && previousState && (
          <div className="mb-4 p-3 bg-amber-900/30 border border-amber-600/50 rounded-lg flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-2 text-amber-200">
              <Undo2 className="w-4 h-4" />
              <span className="text-sm">
                Changes saved to "{previousState.item?.name}". Want to undo?
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleUndo}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Undo2 className="w-3.5 h-3.5" />
                Undo
              </button>
              <button
                onClick={() => { setCanUndo(false); setPreviousState(null); }}
                className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm rounded-lg transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Search and Filter Bar */}
        <div className="flex items-center gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${currentTab.label.toLowerCase()}...`}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Department Filter */}
          <div className="relative">
            <select
              value={filterDepartment || ''}
              onChange={(e) => setFilterDepartment(e.target.value || null)}
              className="appearance-none pl-4 pr-10 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all cursor-pointer"
            >
              <option value="">All Departments</option>
              {allDepartments.map(dept => (
                <option key={dept.id} value={dept.title}>{dept.title}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'name-desc' | 'links')}
              className="appearance-none pl-4 pr-10 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all cursor-pointer"
            >
              <option value="name">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="links">Most Links</option>
            </select>
            <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
        </div>

        {/* Modal Add/Edit Form */}
        {(showAddForm || editingId) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
              onClick={handleCloseModal}
            />
            
            {/* Modal Content */}
            <div className="relative bg-gray-900 rounded-2xl border border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              {/* Modal Header */}
              <div className="flex items-center justify-between px-8 py-5 border-b border-gray-700 bg-gray-800/50">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${currentTab.color}20` }}
                  >
                    {currentTab.iconImage ? (
                      <img src={currentTab.iconImage} alt="" className="w-6 h-6 object-contain" />
                    ) : (
                      <currentTab.icon className="w-5 h-5" style={{ color: currentTab.color }} />
                    )}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">
                      {editingId ? `Edit ${currentTab.label.slice(0, -1)}` : `Add New ${currentTab.label.slice(0, -1)}`}
                    </h4>
                    <p className="text-sm text-gray-400">
                      {editingId ? 'Update the details below' : 'Fill in the details to create a new item'}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400 hover:text-white" />
                </button>
              </div>

              {/* Modal Body - Scrollable with hidden scrollbar */}
              <div className="px-8 py-6 overflow-y-auto max-h-[calc(90vh-180px)] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent hover:scrollbar-thumb-gray-600">
                {/* Top Section: Image + Basic Info */}
                <div className="flex gap-6 mb-8">
                  {/* Main Image Section - Cleaner Design */}
                  <div className="flex-shrink-0">
                    <label className="block text-sm font-medium text-gray-400 mb-2">Main Image</label>
                    <ImageUploader
                      currentImage={formData.image}
                      onUpload={(url) => setFormData({ ...formData, image: url })}
                      folder="knowledge"
                      label="Upload Main Image"
                    />
                  </div>

                  {/* Basic Info */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1.5">Name *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white text-lg font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-gray-500"
                        placeholder={activeTab === 'products' ? 'e.g. Work Management' : 'e.g. Content Writer'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1.5">Value Proposition</label>
                      <input
                        type="text"
                        value={formData.value}
                        onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-gray-500"
                        placeholder="Short value statement"
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 resize-none transition-all placeholder:text-gray-500"
                    placeholder="Describe what this does..."
                  />
                </div>

                {/* Vibe App Design Section - Only for Vibe apps */}
                {activeTab === 'vibeapps' && (
                  <div className="mb-6 pt-6 border-t border-gray-700/50">
                    <div className="flex items-center gap-2 mb-4">
                      <Palette className="w-4 h-4 text-pink-400" />
                      <h5 className="text-sm font-semibold text-white uppercase tracking-wide">Card Design</h5>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                      {/* Left: Settings */}
                      <div className="space-y-4">
                        {/* Background Color Picker */}
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">Background Color</label>
                          <div className="flex items-center gap-3">
                            <input
                              type="color"
                              value={formData.background_color || '#1a1a2e'}
                              onChange={(e) => setFormData({ ...formData, background_color: e.target.value })}
                              className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-700 hover:border-pink-500 transition-colors"
                            />
                            <div className="flex-1">
                              <input
                                type="text"
                                value={formData.background_color || ''}
                                onChange={(e) => setFormData({ ...formData, background_color: e.target.value })}
                                placeholder="#1a1a2e"
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                              />
                              <p className="text-xs text-gray-500 mt-1">Leave empty for default gradient</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Quick Color Presets */}
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-2">Quick Presets</label>
                          <div className="flex flex-wrap gap-2">
                            {[
                              { color: '', label: 'Default' },
                              { color: '#1a1a2e', label: 'Dark Blue' },
                              { color: '#2d1f3d', label: 'Purple' },
                              { color: '#1f2d3d', label: 'Teal' },
                              { color: '#3d2d1f', label: 'Warm' },
                            ].map(preset => (
                              <button
                                key={preset.label}
                                type="button"
                                onClick={() => setFormData({ ...formData, background_color: preset.color })}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                  formData.background_color === preset.color
                                    ? 'bg-pink-600 text-white'
                                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                }`}
                              >
                                {preset.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {/* Right: Live Preview */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Eye className="w-4 h-4 text-gray-400" />
                          <label className="text-sm font-medium text-gray-400">Live Preview</label>
                        </div>
                        <div 
                          className="relative h-40 rounded-xl overflow-hidden border border-gray-700"
                          style={{ 
                            background: formData.background_color || 'linear-gradient(135deg, rgba(255, 165, 0, 0.15), rgba(233, 30, 99, 0.1))'
                          }}
                        >
                          {/* Preview Card Content */}
                          <div className="absolute inset-0 p-4 flex flex-col justify-end">
                            {formData.image && (
                              <img 
                                src={formData.image} 
                                alt="Preview" 
                                className="absolute inset-0 w-full h-full object-cover opacity-80"
                              />
                            )}
                            <div 
                              className="relative z-10 bg-black/70 backdrop-blur-sm rounded-lg p-3"
                            >
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                                  style={{ background: `linear-gradient(135deg, ${vibeTheme.iconGradientFrom}, ${vibeTheme.iconGradientTo})` }}
                                >
                                  <Zap className="w-4 h-4" style={{ color: vibeTheme.iconColor }} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-bold text-white truncate">{formData.name || 'App Name'}</h4>
                                  <p className="text-xs text-white/60 truncate">{formData.value || 'Value proposition'}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 text-center">This is how your app will look</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Gallery Section - Only for products */}
                {activeTab === 'products' && (
                  <div className="mb-6 pt-6 border-t border-gray-700/50">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium text-gray-400">Additional Images (Gallery)</label>
                      <span className="text-xs text-gray-500">{formData.images.length} image{formData.images.length !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex flex-wrap gap-3 items-center">
                      {/* Existing gallery images */}
                      {formData.images.map((img, index) => (
                        <div key={index} className="relative group">
                          <img 
                            src={img} 
                            alt={`Gallery ${index + 1}`} 
                            className="w-16 h-16 object-cover rounded-lg border border-gray-700 hover:border-indigo-500 transition-colors"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newImages = [...formData.images];
                              newImages.splice(index, 1);
                              setFormData({ ...formData, images: newImages });
                            }}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100 shadow-lg"
                          >
                            <X className="w-3 h-3 text-white" />
                          </button>
                        </div>
                      ))}
                      
                      {/* Add new image button - compact design */}
                      <label className="w-16 h-16 border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-500/5 transition-all group">
                        <Plus className="w-5 h-5 text-gray-500 group-hover:text-indigo-400" />
                        <span className="text-[10px] text-gray-500 group-hover:text-indigo-400 mt-0.5">Add</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              // Use the upload hook manually
                              const formDataUpload = new FormData();
                              formDataUpload.append('file', file);
                              
                              const fileExt = file.name.split('.').pop();
                              const fileName = `knowledge/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
                              
                              const { error } = await supabase.storage
                                .from('Vibe')
                                .upload(fileName, file);
                              
                              if (!error) {
                                const { data } = supabase.storage.from('Vibe').getPublicUrl(fileName);
                                if (data.publicUrl) {
                                  setFormData({ ...formData, images: [...formData.images, data.publicUrl] });
                                }
                              }
                            }
                            e.target.value = ''; // Reset input
                          }}
                        />
                      </label>
                    </div>
                    {formData.images.length === 0 && (
                      <p className="text-xs text-gray-500 mt-2">Click + to add images for different views of this product</p>
                    )}
                  </div>
                )}

            {/* Intent Type Assignment Section - Show when editing or adding new */}
            {(editingId || showAddForm) && (
              <div className="pt-6 border-t border-gray-700/50">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="text-sm font-semibold text-white uppercase tracking-wide flex items-center gap-2">
                    <Database className="w-4 h-4 text-indigo-400" />
                    Link to Intent Types
                  </h5>
                  <span className="text-xs text-gray-500">
                    {linkedDepts.length + linkedOutcomes.length + linkedPainPoints.length + linkedAITrans.length} total links
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Departments */}
                  <div className="group bg-gradient-to-br from-indigo-500/5 to-indigo-600/10 rounded-xl p-4 border border-indigo-500/20 hover:border-indigo-500/40 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                          <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                        </div>
                        <span className="text-sm font-medium text-white">Departments</span>
                      </div>
                      {linkedDepts.length > 0 && (
                        <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full">{linkedDepts.length}</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {allDepartments.map(dept => {
                        const isLinked = isIntentLinked('departments', dept.id);
                        return (
                          <button
                            key={dept.id}
                            type="button"
                            onClick={() => toggleIntentLink('departments', dept.id, isLinked)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                              isLinked
                                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                                : 'bg-gray-800/80 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                            }`}
                          >
                            {dept.title}
                          </button>
                        );
                      })}
                      {allDepartments.length === 0 && (
                        <span className="text-gray-500 text-xs">No departments available</span>
                      )}
                    </div>
                    
                    {/* Expand to Variations button - show when editing and 2+ departments linked (not for Vibe apps) */}
                    {editingId && activeTab !== 'vibeapps' && (() => {
                      // Calculate effective linked departments count
                      const currentDepts = [...linkedDepts];
                      pendingIntentAdditions.departments.forEach(d => {
                        if (!currentDepts.includes(d)) currentDepts.push(d);
                      });
                      const effectiveCount = currentDepts.filter(d => !pendingIntentRemovals.departments.has(d)).length;
                      
                      if (effectiveCount >= 2) {
                        return (
                          <div className="mt-3 p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <p className="text-xs text-indigo-300">
                                  פריט זה משויך ל-{effectiveCount} מחלקות. 
                                  ניתן ליצור וריאציה נפרדת לכל מחלקה עם תיאור ייחודי.
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={handleExpandToVariations}
                                className="ml-3 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs rounded-lg transition-colors whitespace-nowrap"
                              >
                                הרחב לווריאציות
                              </button>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </div>

                  {/* Outcomes */}
                  <div className="group bg-gradient-to-br from-green-500/5 to-green-600/10 rounded-xl p-4 border border-green-500/20 hover:border-green-500/40 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-green-500/20 flex items-center justify-center">
                          <Target className="w-3.5 h-3.5 text-green-400" />
                        </div>
                        <span className="text-sm font-medium text-white">Outcomes</span>
                      </div>
                      {linkedOutcomes.length > 0 && (
                        <span className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full">{linkedOutcomes.length}</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {allOutcomes.map(outcome => {
                        const isLinked = isIntentLinked('outcomes', outcome.id);
                        return (
                          <button
                            key={outcome.id}
                            type="button"
                            onClick={() => toggleIntentLink('outcomes', outcome.id, isLinked)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                              isLinked
                                ? 'bg-green-500 text-white shadow-lg shadow-green-500/25'
                                : 'bg-gray-800/80 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                            }`}
                          >
                            {outcome.title}
                          </button>
                        );
                      })}
                      {allOutcomes.length === 0 && (
                        <span className="text-gray-500 text-xs">No outcomes available</span>
                      )}
                    </div>
                  </div>

                  {/* Pain Points */}
                  <div className="group bg-gradient-to-br from-amber-500/5 to-amber-600/10 rounded-xl p-4 border border-amber-500/20 hover:border-amber-500/40 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-amber-500/20 flex items-center justify-center">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                        </div>
                        <span className="text-sm font-medium text-white">Pain Points</span>
                      </div>
                      {linkedPainPoints.length > 0 && (
                        <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full">{linkedPainPoints.length}</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {allPainPoints.map(painPoint => {
                        const isLinked = isIntentLinked('pain_points', painPoint.id);
                        return (
                          <button
                            key={painPoint.id}
                            type="button"
                            onClick={() => toggleIntentLink('pain_points', painPoint.id, isLinked)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                              isLinked
                                ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/25'
                                : 'bg-gray-800/80 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                            }`}
                          >
                            {painPoint.title}
                          </button>
                        );
                      })}
                      {allPainPoints.length === 0 && (
                        <span className="text-gray-500 text-xs">No pain points available</span>
                      )}
                    </div>
                  </div>

                  {/* AI Transformations */}
                  <div className="group bg-gradient-to-br from-purple-500/5 to-purple-600/10 rounded-xl p-4 border border-purple-500/20 hover:border-purple-500/40 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-purple-500/20 flex items-center justify-center">
                          <Wand2 className="w-3.5 h-3.5 text-purple-400" />
                        </div>
                        <span className="text-sm font-medium text-white">AI Transformations</span>
                      </div>
                      {linkedAITrans.length > 0 && (
                        <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">{linkedAITrans.length}</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {allAITransformations.map(aiTrans => {
                        const isLinked = isIntentLinked('ai_transformations', aiTrans.id);
                        return (
                          <button
                            key={aiTrans.id}
                            type="button"
                            onClick={() => toggleIntentLink('ai_transformations', aiTrans.id, isLinked)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                              isLinked
                                ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25'
                                : 'bg-gray-800/80 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                            }`}
                          >
                            {aiTrans.title}
                          </button>
                        );
                      })}
                      {allAITransformations.length === 0 && (
                        <span className="text-gray-500 text-xs">No AI transformations available</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Pending changes indicator - will be saved with main Save button */}
                {hasUnsavedIntentChanges && (
                  <div className="mt-4 p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
                      <p className="text-sm text-indigo-300">
                        {pendingIntentChangesCount} assignment change{pendingIntentChangesCount !== 1 ? 's' : ''} pending - click "Save Changes" below to save
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            </div>

              {/* Modal Footer - Sticky */}
              <div className="flex items-center justify-between px-8 py-5 border-t border-gray-700 bg-gray-800/50">
                <div className="text-sm text-gray-400">
                  {editingId ? 'Press ESC to cancel' : 'Fill in all required fields'}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleCloseModal}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gray-700 hover:bg-gray-600 rounded-xl text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={editingId ? () => handleUpdate(editingId) : handleAdd}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white font-medium transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    {editingId ? 'Save Changes' : 'Add Item'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Items List */}
        {/* Results count when filtering */}
        {(searchQuery || filterDepartment) && !loading && (
          <div className="text-sm text-gray-400 mb-4">
            Showing {filteredItems.length} of {items.length} {currentTab.label.toLowerCase()}
            {filterDepartment && <span className="text-indigo-400"> in {filterDepartment}</span>}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <currentTab.icon className="w-12 h-12 mx-auto mb-3 opacity-30" style={{ color: currentTab.color }} />
            <p className="text-gray-400">No {currentTab.label.toLowerCase()} yet.</p>
            <p className="text-gray-500 text-sm">Add your first one to get started!</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-12 h-12 mx-auto mb-3 opacity-30 text-gray-600" />
            <p className="text-gray-400">No matching {currentTab.label.toLowerCase()} found.</p>
            <button
              onClick={() => { setSearchQuery(''); setFilterDepartment(null); }}
              className="mt-2 text-indigo-400 hover:text-indigo-300 text-sm"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {groupedItems.map((group) => {
              const isExpanded = expandedGroups.has(group.name);
              const firstItem = group.firstItem;
              
              // For single items, render normally
              if (!group.hasVariations) {
                const item = firstItem;
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-colors"
                  >
                    {/* Icon */}
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
                      style={{ backgroundColor: `${currentTab.color}20` }}
                    >
                      {(() => {
                        const productIcon = getProductIcon(item.name);
                        const tabDefaultIcon = getTabDefaultIcon(activeTab);
                        if (activeTab === 'products' && productIcon) {
                          return <img src={productIcon} alt="" className="w-10 h-10 object-contain" />;
                        } else if (tabDefaultIcon) {
                          return <img src={tabDefaultIcon} alt="" className="w-10 h-10 object-contain" />;
                        } else if (item.image) {
                          return <img src={item.image} alt="" className="w-10 h-10 object-contain" />;
                        } else {
                          return <currentTab.icon className="w-6 h-6" style={{ color: currentTab.color }} />;
                        }
                      })()}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium truncate">{item.name}</h4>
                      <p className="text-gray-400 text-sm truncate">{item.description}</p>
                      
                      {/* Link badges */}
                      {itemLinkDetails[item.id] && (
                        <div className="flex flex-wrap items-center gap-1.5 mt-2">
                          {itemLinkDetails[item.id].departmentNames.length > 0 && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded-md text-xs">
                              <Building2 className="w-3 h-3 flex-shrink-0" />
                              {itemLinkDetails[item.id].departmentNames.slice(0, 2).join(', ')}
                              {itemLinkDetails[item.id].departmentNames.length > 2 && (
                                <span className="text-indigo-400">+{itemLinkDetails[item.id].departmentNames.length - 2}</span>
                              )}
                            </span>
                          )}
                          {itemLinkDetails[item.id].outcomeNames.length > 0 && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-500/20 text-green-300 rounded-md text-xs">
                              <Target className="w-3 h-3 flex-shrink-0" />
                              {itemLinkDetails[item.id].outcomeNames.slice(0, 2).join(', ')}
                              {itemLinkDetails[item.id].outcomeNames.length > 2 && (
                                <span className="text-green-400">+{itemLinkDetails[item.id].outcomeNames.length - 2}</span>
                              )}
                            </span>
                          )}
                          {itemLinkDetails[item.id].painPointNames.length > 0 && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded-md text-xs">
                              <AlertCircle className="w-3 h-3 flex-shrink-0" />
                              {itemLinkDetails[item.id].painPointNames.slice(0, 2).join(', ')}
                              {itemLinkDetails[item.id].painPointNames.length > 2 && (
                                <span className="text-amber-400">+{itemLinkDetails[item.id].painPointNames.length - 2}</span>
                              )}
                            </span>
                          )}
                          {itemLinkDetails[item.id].aiTransformationNames.length > 0 && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-md text-xs">
                              <Wand2 className="w-3 h-3 flex-shrink-0" />
                              {itemLinkDetails[item.id].aiTransformationNames.slice(0, 2).join(', ')}
                              {itemLinkDetails[item.id].aiTransformationNames.length > 2 && (
                                <span className="text-purple-400">+{itemLinkDetails[item.id].aiTransformationNames.length - 2}</span>
                              )}
                            </span>
                          )}
                          {itemLinkDetails[item.id].departmentNames.length === 0 && 
                           itemLinkDetails[item.id].outcomeNames.length === 0 && 
                           itemLinkDetails[item.id].painPointNames.length === 0 && 
                           itemLinkDetails[item.id].aiTransformationNames.length === 0 && (
                            <span className="text-xs text-gray-500 italic">Not linked anywhere</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => startEdit(item)}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              }
              
              // For groups with variations, render accordion
              return (
                <div key={group.name} className="rounded-xl border border-gray-700 overflow-hidden">
                  {/* Accordion Header */}
                  <button
                    onClick={() => toggleGroup(group.name)}
                    className="w-full flex items-center gap-4 bg-gray-800 p-4 hover:bg-gray-700/50 transition-colors"
                  >
                    {/* Icon */}
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
                      style={{ backgroundColor: `${currentTab.color}20` }}
                    >
                      {(() => {
                        const productIcon = getProductIcon(group.name);
                        const tabDefaultIcon = getTabDefaultIcon(activeTab);
                        if (activeTab === 'products' && productIcon) {
                          return <img src={productIcon} alt="" className="w-10 h-10 object-contain" />;
                        } else if (tabDefaultIcon) {
                          return <img src={tabDefaultIcon} alt="" className="w-10 h-10 object-contain" />;
                        } else if (firstItem.image) {
                          return <img src={firstItem.image} alt="" className="w-10 h-10 object-contain" />;
                        } else {
                          return <currentTab.icon className="w-6 h-6" style={{ color: currentTab.color }} />;
                        }
                      })()}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center gap-2">
                        <h4 className="text-white font-medium">{group.name}</h4>
                        <span className="px-2 py-0.5 bg-gray-700 text-gray-300 rounded-full text-xs">
                          {group.items.length} variations
                        </span>
                      </div>
                      {/* Show all unique departments across variations */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-1">
                        {(() => {
                          const allDepts = new Set<string>();
                          group.items.forEach(item => {
                            itemLinkDetails[item.id]?.departmentNames.forEach(d => allDepts.add(d));
                          });
                          const deptArray = Array.from(allDepts);
                          if (deptArray.length > 0) {
                            return (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded-md text-xs">
                                <Building2 className="w-3 h-3 flex-shrink-0" />
                                {deptArray.slice(0, 3).join(', ')}
                                {deptArray.length > 3 && (
                                  <span className="text-indigo-400">+{deptArray.length - 3}</span>
                                )}
                              </span>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    </div>

                    {/* Expand/Collapse Icon */}
                    <div className="p-2">
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </button>

                  {/* Accordion Content - Variations */}
                  {isExpanded && (
                    <div className="border-t border-gray-700 bg-gray-900/50">
                      {group.items.map((item, idx) => (
                        <div
                          key={item.id}
                          className={`flex items-center gap-4 p-4 pl-8 hover:bg-gray-800/50 transition-colors ${
                            idx !== group.items.length - 1 ? 'border-b border-gray-700/50' : ''
                          }`}
                        >
                          {/* Department Badge as Primary Identifier */}
                          <div className="w-28 flex-shrink-0">
                            {itemLinkDetails[item.id]?.departmentNames[0] ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-500/30 text-indigo-200 rounded-lg text-xs font-medium">
                                <Building2 className="w-3 h-3" />
                                {itemLinkDetails[item.id].departmentNames[0]}
                              </span>
                            ) : (
                              <span className="text-xs text-gray-500 italic">No dept</span>
                            )}
                          </div>

                          {/* Description */}
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-300 text-sm truncate">{item.description || 'No description'}</p>
                            
                            {/* Other badges */}
                            <div className="flex flex-wrap items-center gap-1.5 mt-1">
                              {itemLinkDetails[item.id]?.outcomeNames.length > 0 && (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-green-500/20 text-green-300 rounded text-xs">
                                  <Target className="w-2.5 h-2.5" />
                                  {itemLinkDetails[item.id].outcomeNames.slice(0, 1).join(', ')}
                                  {itemLinkDetails[item.id].outcomeNames.length > 1 && ` +${itemLinkDetails[item.id].outcomeNames.length - 1}`}
                                </span>
                              )}
                              {itemLinkDetails[item.id]?.painPointNames.length > 0 && (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-amber-500/20 text-amber-300 rounded text-xs">
                                  <AlertCircle className="w-2.5 h-2.5" />
                                  {itemLinkDetails[item.id].painPointNames.slice(0, 1).join(', ')}
                                  {itemLinkDetails[item.id].painPointNames.length > 1 && ` +${itemLinkDetails[item.id].painPointNames.length - 1}`}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => startEdit(item)}
                              className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <ChevronRight className="w-5 h-5 text-indigo-400 mt-0.5" />
          <div>
            <h4 className="text-indigo-300 font-medium">How it works</h4>
            <p className="text-indigo-200/70 text-sm mt-1">
              Items you add here become available to link in <strong>multiple</strong> Departments, Outcomes, Pain Points, and AI Transformations.
              Each item can be assigned to as many places as needed. The badges above show where each item is currently linked.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
