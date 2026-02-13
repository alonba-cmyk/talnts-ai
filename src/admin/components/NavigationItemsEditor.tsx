import { useState, useEffect } from 'react';
import { Plus, Trash2, GripVertical, Save, X, Edit2, Target, AlertCircle, Sparkles, Package, Users, Zap, ArrowLeft, Check, ExternalLink, Building2, TrendingUp } from 'lucide-react';
import { BusinessValuesPanel } from './BusinessValuesEditor';
import { supabase } from '@/lib/supabase';
import { ImageUploader } from './ImageUploader';

// Import icons
import imgVibe from "@/assets/069a22575b2de9057cfc00d9b4538d072f7fe115.png";
import imgSidekick from "@/assets/sidekick-icon.png";
import imgAgents from "@/assets/agents-icon.png";
import imgWM from "@/assets/5d4f550f18adfa644c6653f867bc960bdc8a53dc.png";
import imgCRM from "@/assets/6cf10de3ca3f528bc9d9457024ed87915acf1b6f.png";
import imgCampaigns from "@/assets/41abe475f056daef6e610ed3282d554ea3b88606.png";
import imgService from "@/assets/9fae7b5cd33e1ccaf1f329bad81508b9daae5210.png";
import imgDev from "@/assets/f416d94ad48b77a56df38e1f5ca7412f0e86202f.png";
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

const colorOptions = [
  '#97aeff', '#ffc875', '#ff5ac4', '#ff7575', 
  '#a358d1', '#5ac4a3', '#ff9a6c', '#6fcfed'
];

const departmentOptions = [
  { value: 'marketing', label: 'Marketing' },
  { value: 'sales', label: 'Sales' },
  { value: 'operations', label: 'Operations' },
  { value: 'support', label: 'Support' },
  { value: 'product', label: 'Product' },
  { value: 'legal', label: 'Legal' },
  { value: 'finance', label: 'Finance' },
  { value: 'hr', label: 'HR' },
];

type ContentTab = 'overview' | 'products' | 'agents' | 'vibeapps' | 'sidekick' | 'values';
type KnowledgeTab = 'products' | 'agents' | 'vibeapps' | 'sidekick';

interface NavigationItem {
  id: string;
  title: string;
  description: string | null;
  avatar_image: string | null;
  avatar_color: string;
  maps_to_department: string | null;
  order_index: number;
  is_active: boolean;
  // For departments only
  name?: string;
}

interface ContentItem {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
}

interface NavigationItemsEditorProps {
  type: 'outcomes' | 'pain_points' | 'ai_transformations' | 'departments';
  title: string;
  icon: React.ReactNode;
  onNavigateToKnowledge?: (tab?: KnowledgeTab) => void;
  onBack?: () => void;
}

export function NavigationItemsEditor({ type, title, icon, onNavigateToKnowledge, onBack }: NavigationItemsEditorProps) {
  const [items, setItems] = useState<NavigationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Selected item for content linking
  const [selectedItem, setSelectedItem] = useState<NavigationItem | null>(null);
  const [activeTab, setActiveTab] = useState<ContentTab>('overview');
  
  // All available content
  const [allProducts, setAllProducts] = useState<ContentItem[]>([]);
  const [allAgents, setAllAgents] = useState<ContentItem[]>([]);
  const [allVibeApps, setAllVibeApps] = useState<ContentItem[]>([]);
  const [allSidekick, setAllSidekick] = useState<ContentItem[]>([]);
  
  // Linked content IDs
  const [linkedProducts, setLinkedProducts] = useState<string[]>([]);
  const [linkedAgents, setLinkedAgents] = useState<string[]>([]);
  const [linkedVibeApps, setLinkedVibeApps] = useState<string[]>([]);
  const [linkedSidekick, setLinkedSidekick] = useState<string[]>([]);

  // Pending changes (for Save button functionality)
  const [pendingAdditions, setPendingAdditions] = useState<{
    products: Set<string>;
    agents: Set<string>;
    vibe_apps: Set<string>;
    sidekick_actions: Set<string>;
  }>({ products: new Set(), agents: new Set(), vibe_apps: new Set(), sidekick_actions: new Set() });
  
  const [pendingRemovals, setPendingRemovals] = useState<{
    products: Set<string>;
    agents: Set<string>;
    vibe_apps: Set<string>;
    sidekick_actions: Set<string>;
  }>({ products: new Set(), agents: new Set(), vibe_apps: new Set(), sidekick_actions: new Set() });
  
  const [isSaving, setIsSaving] = useState(false);

  // Calculate if there are unsaved changes
  const hasUnsavedChanges = 
    pendingAdditions.products.size > 0 || pendingAdditions.agents.size > 0 || 
    pendingAdditions.vibe_apps.size > 0 || pendingAdditions.sidekick_actions.size > 0 ||
    pendingRemovals.products.size > 0 || pendingRemovals.agents.size > 0 || 
    pendingRemovals.vibe_apps.size > 0 || pendingRemovals.sidekick_actions.size > 0;

  const pendingChangesCount = 
    pendingAdditions.products.size + pendingAdditions.agents.size + 
    pendingAdditions.vibe_apps.size + pendingAdditions.sidekick_actions.size +
    pendingRemovals.products.size + pendingRemovals.agents.size + 
    pendingRemovals.vibe_apps.size + pendingRemovals.sidekick_actions.size;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    avatar_image: '',
    avatar_color: '#97aeff',
    maps_to_department: 'marketing',
    name: '', // For departments only (internal slug)
  });

  // Check if this is departments type
  const isDepartments = type === 'departments';

  // Get junction table names based on type
  const getJunctionTableName = (contentType: string) => {
    if (isDepartments) {
      return `department_${contentType}`;
    }
    const prefix = type === 'outcomes' ? 'outcome' : type === 'pain_points' ? 'pain_point' : 'ai_transformation';
    return `${prefix}_${contentType}`;
  };

  const getIdFieldName = () => {
    if (isDepartments) return 'department_id';
    return type === 'outcomes' ? 'outcome_id' : type === 'pain_points' ? 'pain_point_id' : 'ai_transformation_id';
  };

  // Get the type display name for messages
  const getTypeDisplayName = () => {
    switch (type) {
      case 'outcomes': return 'outcome';
      case 'pain_points': return 'pain point';
      case 'ai_transformations': return 'AI transformation';
      case 'departments': return 'department';
      default: return 'item';
    }
  };

  // Fetch items
  useEffect(() => {
    fetchItems();
    fetchAllContent();
  }, [type]);

  // Fetch linked content when item is selected
  useEffect(() => {
    if (selectedItem) {
      fetchLinkedContent(selectedItem.id);
      resetPendingChanges(); // Reset pending changes when selecting a new item
    }
  }, [selectedItem]);

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from(type)
      .select('*')
      .order('order_index');
    
    if (!error && data) {
      setItems(data);
    }
    setLoading(false);
  };

  const fetchAllContent = async () => {
    const [products, agents, vibeApps, sidekick] = await Promise.all([
      supabase.from('products').select('id, name, description, image'),
      supabase.from('agents').select('id, name, description, image'),
      supabase.from('vibe_apps').select('id, name, value, image'),
      supabase.from('sidekick_actions').select('id, name, description, image'),
    ]);

    if (products.data) setAllProducts(products.data);
    if (agents.data) setAllAgents(agents.data);
    // Map 'value' to 'description' for vibe_apps
    if (vibeApps.data) setAllVibeApps(vibeApps.data.map((v: any) => ({ ...v, description: v.value })));
    if (sidekick.data) setAllSidekick(sidekick.data);
  };

  const fetchLinkedContent = async (itemId: string) => {
    const idField = getIdFieldName();
    
    try {
      const [products, agents, vibeApps, sidekick] = await Promise.all([
        supabase.from(getJunctionTableName('products')).select('product_id').eq(idField, itemId),
        supabase.from(getJunctionTableName('agents')).select('agent_id').eq(idField, itemId),
        supabase.from(getJunctionTableName('vibe_apps')).select('vibe_app_id').eq(idField, itemId),
        supabase.from(getJunctionTableName('sidekick_actions')).select('sidekick_action_id').eq(idField, itemId),
      ]);

      setLinkedProducts(products.data?.map(p => p.product_id) || []);
      setLinkedAgents(agents.data?.map(a => a.agent_id) || []);
      setLinkedVibeApps(vibeApps.data?.map(v => v.vibe_app_id) || []);
      setLinkedSidekick(sidekick.data?.map(s => s.sidekick_action_id) || []);
    } catch (error) {
      console.error('Error fetching linked content:', error);
      // Tables might not exist yet
      setLinkedProducts([]);
      setLinkedAgents([]);
      setLinkedVibeApps([]);
      setLinkedSidekick([]);
    }
  };

  // Reset pending changes when item changes
  const resetPendingChanges = () => {
    setPendingAdditions({ products: new Set(), agents: new Set(), vibe_apps: new Set(), sidekick_actions: new Set() });
    setPendingRemovals({ products: new Set(), agents: new Set(), vibe_apps: new Set(), sidekick_actions: new Set() });
  };

  const toggleLink = (contentType: 'products' | 'agents' | 'vibe_apps' | 'sidekick_actions', contentId: string, isLinked: boolean) => {
    if (!selectedItem) return;

    // Get the original linked state (from DB)
    const originalLinked = contentType === 'products' ? linkedProducts :
                           contentType === 'agents' ? linkedAgents :
                           contentType === 'vibe_apps' ? linkedVibeApps : linkedSidekick;
    const wasOriginallyLinked = originalLinked.includes(contentId);

    setPendingAdditions(prev => {
      const newSet = new Set(prev[contentType]);
      if (!isLinked && !wasOriginallyLinked) {
        // Adding a new link that wasn't in DB
        newSet.add(contentId);
      } else {
        // Remove from additions if we're unlinking
        newSet.delete(contentId);
      }
      return { ...prev, [contentType]: newSet };
    });

    setPendingRemovals(prev => {
      const newSet = new Set(prev[contentType]);
      if (isLinked && wasOriginallyLinked) {
        // Removing a link that was in DB
        newSet.add(contentId);
      } else {
        // Remove from removals if we're re-linking
        newSet.delete(contentId);
      }
      return { ...prev, [contentType]: newSet };
    });
  };

  // Check if an item is currently linked (considering pending changes)
  const isItemLinked = (contentType: 'products' | 'agents' | 'vibe_apps' | 'sidekick_actions', contentId: string): boolean => {
    const originalLinked = contentType === 'products' ? linkedProducts :
                           contentType === 'agents' ? linkedAgents :
                           contentType === 'vibe_apps' ? linkedVibeApps : linkedSidekick;
    const wasOriginallyLinked = originalLinked.includes(contentId);
    const isPendingAddition = pendingAdditions[contentType].has(contentId);
    const isPendingRemoval = pendingRemovals[contentType].has(contentId);

    if (isPendingAddition) return true;
    if (isPendingRemoval) return false;
    return wasOriginallyLinked;
  };

  // Save all pending changes to Supabase
  const handleSaveLinks = async () => {
    if (!selectedItem || !hasUnsavedChanges) return;

    setIsSaving(true);
    const idField = getIdFieldName();

    try {
      const promises: Promise<any>[] = [];

      // Process each content type
      const contentTypes: Array<'products' | 'agents' | 'vibe_apps' | 'sidekick_actions'> = ['products', 'agents', 'vibe_apps', 'sidekick_actions'];
      
      for (const contentType of contentTypes) {
        const tableName = getJunctionTableName(contentType);
        const contentIdField = contentType === 'products' ? 'product_id' : 
                               contentType === 'agents' ? 'agent_id' :
                               contentType === 'vibe_apps' ? 'vibe_app_id' : 'sidekick_action_id';

        // Handle removals
        for (const contentId of pendingRemovals[contentType]) {
          promises.push(
            supabase.from(tableName).delete().eq(idField, selectedItem.id).eq(contentIdField, contentId)
          );
        }

        // Handle additions
        for (const contentId of pendingAdditions[contentType]) {
          promises.push(
            supabase.from(tableName).insert({ [idField]: selectedItem.id, [contentIdField]: contentId })
          );
        }
      }

      await Promise.all(promises);

      // Refresh linked content and reset pending changes
      await fetchLinkedContent(selectedItem.id);
      resetPendingChanges();
    } catch (error) {
      console.error('Error saving links:', error);
      alert('Error saving changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Discard pending changes
  const handleDiscardChanges = () => {
    if (hasUnsavedChanges && !confirm('Are you sure you want to discard unsaved changes?')) {
      return false;
    }
    resetPendingChanges();
    return true;
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      avatar_image: '',
      avatar_color: '#97aeff',
      maps_to_department: 'marketing',
      name: '',
    });
    setShowAddForm(false);
    setEditingId(null);
  };

  const handleAdd = async () => {
    if (!formData.title.trim()) return;

    const insertData: Record<string, unknown> = {
      title: formData.title,
      description: formData.description,
      avatar_image: formData.avatar_image || null,
      avatar_color: formData.avatar_color,
      order_index: items.length,
      is_active: true,
    };

    if (isDepartments) {
      // Departments use 'name' (internal slug)
      insertData.name = formData.name || formData.title.toLowerCase().replace(/\s+/g, '_');
    } else {
      // Other types use maps_to_department
      insertData.maps_to_department = formData.maps_to_department;
    }

    const { error } = await supabase.from(type).insert(insertData);

    if (!error) {
      await fetchItems();
      resetForm();
    }
  };

  const handleUpdate = async (id: string) => {
    const updateData: Record<string, unknown> = {
      title: formData.title,
      description: formData.description,
      avatar_image: formData.avatar_image || null,
      avatar_color: formData.avatar_color,
    };

    if (isDepartments) {
      updateData.name = formData.name || formData.title.toLowerCase().replace(/\s+/g, '_');
    } else {
      updateData.maps_to_department = formData.maps_to_department;
    }

    const { error } = await supabase
      .from(type)
      .update(updateData)
      .eq('id', id);

    if (!error) {
      await fetchItems();
      resetForm();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    const { error } = await supabase.from(type).delete().eq('id', id);
    if (!error) {
      await fetchItems();
      if (selectedItem?.id === id) {
        setSelectedItem(null);
      }
    }
  };

  const handleToggleActive = async (id: string, currentState: boolean) => {
    console.log('[Toggle] Updating', type, 'id:', id, 'from', currentState, 'to', !currentState);
    
    const { data, error } = await supabase
      .from(type)
      .update({ is_active: !currentState })
      .eq('id', id)
      .select();

    if (error) {
      console.error('[Toggle] Error:', error);
      alert('שגיאה בעדכון הסטטוס: ' + error.message);
    } else {
      console.log('[Toggle] Success:', data);
      await fetchItems();
    }
  };

  const startEdit = (item: NavigationItem) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      description: item.description || '',
      avatar_image: item.avatar_image || '',
      avatar_color: item.avatar_color,
      maps_to_department: item.maps_to_department || 'marketing',
      name: item.name || '',
    });
  };

  const tabs = [
    { id: 'overview' as ContentTab, label: 'Overview', icon: Target },
    { id: 'products' as ContentTab, label: 'Products', icon: Package, count: linkedProducts.length },
    { id: 'agents' as ContentTab, label: 'Agents', icon: Users, count: linkedAgents.length },
    { id: 'vibeapps' as ContentTab, label: 'Vibe Apps', icon: Sparkles, count: linkedVibeApps.length },
    { id: 'sidekick' as ContentTab, label: 'Sidekick', icon: Zap, count: linkedSidekick.length },
    ...(isDepartments ? [{ id: 'values' as ContentTab, label: 'Business Values', icon: TrendingUp }] : []),
  ];

  const getCurrentContent = () => {
    switch (activeTab) {
      case 'products': return { items: allProducts, linked: linkedProducts, type: 'products' as const };
      case 'agents': return { items: allAgents, linked: linkedAgents, type: 'agents' as const };
      case 'vibeapps': return { items: allVibeApps, linked: linkedVibeApps, type: 'vibe_apps' as const };
      case 'sidekick': return { items: allSidekick, linked: linkedSidekick, type: 'sidekick_actions' as const };
      default: return null;
    }
  };

  const getContentIcon = (tabId: ContentTab) => {
    switch (tabId) {
      case 'agents': return imgAgents;
      case 'vibeapps': return imgVibe;
      case 'sidekick': return imgSidekick;
      default: return null;
    }
  };

  const getTabLabel = () => {
    switch (activeTab) {
      case 'products': return 'Product';
      case 'agents': return 'Agent';
      case 'vibeapps': return 'Vibe App';
      case 'sidekick': return 'Sidekick Action';
      default: return 'Item';
    }
  };

  // Navigate to AI Capabilities to add new content
  const handleAddInKnowledge = () => {
    if (onNavigateToKnowledge && activeTab !== 'overview') {
      onNavigateToKnowledge(activeTab as KnowledgeTab);
    }
  };

  if (loading) {
    return <div className="text-gray-400">Loading {title.toLowerCase()}...</div>;
  }

  // Show detail view if an item is selected
  if (selectedItem) {
    const currentContent = getCurrentContent();
    
    return (
      <div>
        {/* Header with back button */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => {
              if (handleDiscardChanges()) {
                setSelectedItem(null);
                setActiveTab('overview');
              }
            }}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </button>
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden"
            style={{ backgroundColor: selectedItem.avatar_color }}
          >
            {selectedItem.avatar_image ? (
              <img src={selectedItem.avatar_image} alt="" className="w-full h-full object-cover" />
            ) : (
              selectedItem.title.charAt(0)
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">{selectedItem.title}</h2>
            <p className="text-gray-400 text-sm">{selectedItem.description}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-800 pb-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">{tab.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' ? (
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">Item Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                <p className="text-white">{selectedItem.title}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                <p className="text-white">{selectedItem.description || 'No description'}</p>
              </div>
              {isDepartments ? (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Internal Name</label>
                  <p className="text-white font-mono text-sm">{selectedItem.name || 'Not set'}</p>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Maps to Department</label>
                  <p className="text-white">{selectedItem.maps_to_department || 'Not set'}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  selectedItem.is_active ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'
                }`}>
                  {selectedItem.is_active ? 'Active' : 'Hidden'}
                </span>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-800">
              <h4 className="text-md font-medium text-white mb-3">Linked Content Summary</h4>
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-gray-800 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-indigo-400">{linkedProducts.length}</p>
                  <p className="text-gray-400 text-sm">Products</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-purple-400">{linkedAgents.length}</p>
                  <p className="text-gray-400 text-sm">Agents</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-pink-400">{linkedVibeApps.length}</p>
                  <p className="text-gray-400 text-sm">Vibe Apps</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-amber-400">{linkedSidekick.length}</p>
                  <p className="text-gray-400 text-sm">Sidekick</p>
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'values' && isDepartments && selectedItem.name ? (
          <BusinessValuesPanel departmentName={selectedItem.name} />
        ) : currentContent ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-400">
                Select which {activeTab === 'vibeapps' ? 'Vibe Apps' : activeTab} to link to this {getTypeDisplayName()}.
              </p>
              <button
                onClick={handleAddInKnowledge}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add {getTabLabel()} in AI Capabilities
                <ExternalLink className="w-3 h-3 ml-1" />
              </button>
            </div>
            
            {currentContent.items.length === 0 ? (
              <div className="text-center py-12 bg-gray-900 rounded-xl border border-gray-800">
                <Package className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">No {getTabLabel()}s in AI Capabilities yet.</p>
                <p className="text-gray-500 text-sm mt-1">Go to AI Capabilities to add new content.</p>
                <button
                  onClick={handleAddInKnowledge}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Open AI Capabilities
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div>
                {/* Linked items first - single column (full width) */}
                {(() => {
                  // Deduplicate by name - keep first occurrence
                  const uniqueByName = (items: ContentItem[]) => {
                    const seen = new Set<string>();
                    return items.filter(item => {
                      if (seen.has(item.name)) return false;
                      seen.add(item.name);
                      return true;
                    });
                  };
                  
                  const linkedItems = uniqueByName(
                    currentContent.items.filter(item => isItemLinked(currentContent.type, item.id))
                  ).sort((a, b) => a.name.localeCompare(b.name));
                  
                  if (linkedItems.length === 0) return null;
                  
                  return (
                    <div className="mb-6">
                      <p className="text-sm text-gray-400 mb-3">Selected ({linkedItems.length})</p>
                      <div className="flex flex-col gap-3">
                        {linkedItems.map(content => {
                          const tabIcon = getContentIcon(activeTab);
                          return (
                            <button
                              key={content.id}
                              onClick={() => toggleLink(currentContent.type, content.id, true)}
                              className="flex items-center gap-4 p-4 rounded-xl border transition-all bg-indigo-600/20 border-indigo-500 text-white"
                            >
                              <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center overflow-hidden">
                                {(() => {
                                  const productIcon = getProductIcon(content.name);
                                  if (activeTab === 'products' && productIcon) {
                                    return <img src={productIcon} alt="" className="w-8 h-8 object-contain" />;
                                  } else if (tabIcon) {
                                    return <img src={tabIcon} alt="" className="w-8 h-8 object-contain" />;
                                  } else if (content.image) {
                                    return <img src={content.image} alt="" className="w-8 h-8 object-contain" />;
                                  } else {
                                    return <Package className="w-5 h-5 text-gray-500" />;
                                  }
                                })()}
                              </div>
                              <div className="flex-1 text-left">
                                <p className="font-medium">{content.name}</p>
                                {content.description && (
                                  <p className="text-sm text-gray-400 truncate">{content.description}</p>
                                )}
                              </div>
                              <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                                <Check className="w-4 h-4 text-white" />
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}

                {/* Unlinked items - two column grid */}
                {(() => {
                  // Deduplicate by name - keep first occurrence
                  const uniqueByName = (items: ContentItem[]) => {
                    const seen = new Set<string>();
                    return items.filter(item => {
                      if (seen.has(item.name)) return false;
                      seen.add(item.name);
                      return true;
                    });
                  };
                  
                  // Get names that are already linked (to exclude from unlinked)
                  const linkedNames = new Set(
                    currentContent.items
                      .filter(item => isItemLinked(currentContent.type, item.id))
                      .map(item => item.name)
                  );
                  
                  const unlinkedItems = uniqueByName(
                    currentContent.items.filter(item => !isItemLinked(currentContent.type, item.id) && !linkedNames.has(item.name))
                  ).sort((a, b) => a.name.localeCompare(b.name));
                  
                  if (unlinkedItems.length === 0) return null;
                  
                  return (
                    <div>
                      <p className="text-sm text-gray-400 mb-3">Available ({unlinkedItems.length})</p>
                      <div className="grid grid-cols-2 gap-3">
                        {unlinkedItems.map(content => {
                          const tabIcon = getContentIcon(activeTab);
                          return (
                            <button
                              key={content.id}
                              onClick={() => toggleLink(currentContent.type, content.id, false)}
                              className="flex items-center gap-4 p-4 rounded-xl border transition-all bg-gray-900 border-gray-700 text-gray-300 hover:border-gray-600"
                            >
                              <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center overflow-hidden">
                                {(() => {
                                  const productIcon = getProductIcon(content.name);
                                  if (activeTab === 'products' && productIcon) {
                                    return <img src={productIcon} alt="" className="w-8 h-8 object-contain" />;
                                  } else if (tabIcon) {
                                    return <img src={tabIcon} alt="" className="w-8 h-8 object-contain" />;
                                  } else if (content.image) {
                                    return <img src={content.image} alt="" className="w-8 h-8 object-contain" />;
                                  } else {
                                    return <Package className="w-5 h-5 text-gray-500" />;
                                  }
                                })()}
                              </div>
                              <div className="flex-1 text-left">
                                <p className="font-medium">{content.name}</p>
                                {content.description && (
                                  <p className="text-sm text-gray-400 truncate">{content.description}</p>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}

                {/* Save/Discard Buttons */}
                {hasUnsavedChanges && (
                  <div className="mt-6 p-4 bg-gray-800/50 border border-gray-700 rounded-xl">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-amber-400">
                        {pendingChangesCount} unsaved change{pendingChangesCount !== 1 ? 's' : ''}
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleDiscardChanges()}
                          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
                        >
                          Discard
                        </button>
                        <button
                          onClick={handleSaveLinks}
                          disabled={isSaving}
                          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                        >
                          {isSaving ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4" />
                              Save Changes
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : null}
      </div>
    );
  }

  // Show list view
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

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {icon}
          <h2 className="text-xl font-semibold text-white">{title} ({items.length})</h2>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </button>
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingId) && (
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            {editingId ? 'Edit Item' : 'Add New Item'}
          </h3>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. Drive Demand Generation"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              {isDepartments ? (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Internal Name (slug)</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. marketing (auto-generated if empty)"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Maps to Department</label>
                  <select
                    value={formData.maps_to_department}
                    onChange={(e) => setFormData({ ...formData, maps_to_department: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {departmentOptions.map(dept => (
                      <option key={dept.value} value={dept.value}>{dept.label}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Avatar Color</label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map(color => (
                    <button
                      key={color}
                      onClick={() => setFormData({ ...formData, avatar_color: color })}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        formData.avatar_color === color ? 'border-white scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Avatar Image (optional)</label>
                <ImageUploader
                  currentImage={formData.avatar_image}
                  onUpload={(url) => setFormData({ ...formData, avatar_image: url })}
                  folder="navigation"
                  label="Upload Avatar"
                />
              </div>

              {/* Preview */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Preview</label>
                <div className="flex items-center gap-3 p-4 bg-gray-800 rounded-lg">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden"
                    style={{ backgroundColor: formData.avatar_color }}
                  >
                    {formData.avatar_image ? (
                      <img src={formData.avatar_image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      formData.title.charAt(0) || '?'
                    )}
                  </div>
                  <div>
                    <p className="text-white font-medium">{formData.title || 'Title'}</p>
                    <p className="text-gray-400 text-sm">{formData.description || 'Description'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={editingId ? () => handleUpdate(editingId) : handleAdd}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white transition-colors"
            >
              <Save className="w-4 h-4" />
              {editingId ? 'Update' : 'Add'}
            </button>
            <button
              onClick={resetForm}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Items List */}
      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="text-center py-12 bg-gray-900 rounded-xl border border-gray-800">
            {icon}
            <p className="text-gray-400 mt-3">No items yet. Add your first one!</p>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 bg-gray-900 rounded-xl p-4 border border-gray-800 hover:border-gray-700 transition-colors cursor-pointer"
              onClick={() => setSelectedItem(item)}
            >
              <GripVertical className="w-5 h-5 text-gray-600 cursor-grab" />

              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 overflow-hidden"
                style={{ backgroundColor: item.avatar_color }}
              >
                {item.avatar_image ? (
                  <img src={item.avatar_image} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  item.title.charAt(0)
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-white font-medium truncate">{item.title}</h4>
                <p className="text-gray-400 text-sm truncate">{item.description}</p>
                {isDepartments ? (
                  <p className="text-gray-500 text-xs mt-1 font-mono">{item.name}</p>
                ) : (
                  <p className="text-gray-500 text-xs mt-1">Maps to: {item.maps_to_department}</p>
                )}
              </div>

              <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                {/* Toggle Switch */}
                <button
                  onClick={() => handleToggleActive(item.id, item.is_active)}
                  className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer"
                  style={{ backgroundColor: item.is_active ? '#22c55e' : '#4b5563' }}
                  title={item.is_active ? 'לחץ להסתרה' : 'לחץ להפעלה'}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      item.is_active ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <button
                  onClick={() => startEdit(item)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
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
          ))
        )}
      </div>
    </div>
  );
}
