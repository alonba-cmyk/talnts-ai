import { useState, useEffect } from 'react';
import {
  ArrowLeft, Package, Users, Sparkles, Zap, Plus, Edit2, Trash2, Save, X,
  ChevronRight, Search, Eye, EyeOff, Target, ListChecks, TrendingUp, Check,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { ImageUploader } from './ImageUploader';

// Import product icons
import imgWM from "@/assets/5d4f550f18adfa644c6653f867bc960bdc8a53dc.png";
import imgCRM from "@/assets/6cf10de3ca3f528bc9d9457024ed87915acf1b6f.png";
import imgCampaigns from "@/assets/41abe475f056daef6e610ed3282d554ea3b88606.png";
import imgService from "@/assets/9fae7b5cd33e1ccaf1f329bad81508b9daae5210.png";
import imgDev from "@/assets/f416d94ad48b77a56df38e1f5ca7412f0e86202f.png";
import imgAgents from "@/assets/agents-icon.png";
import imgVibe from "@/assets/069a22575b2de9057cfc00d9b4538d072f7fe115.png";
import imgSidekick from "@/assets/sidekick-icon.png";

function getProductIcon(name: string): string | null {
  const n = name.toLowerCase();
  if (n.includes('work management')) return imgWM;
  if (n.includes('crm')) return imgCRM;
  if (n.includes('campaign')) return imgCampaigns;
  if (n.includes('service')) return imgService;
  if (n.includes('dev')) return imgDev;
  return null;
}

function getCapIcon(tab: string): string | null {
  if (tab === 'agents') return imgAgents;
  if (tab === 'vibeapps') return imgVibe;
  if (tab === 'sidekick') return imgSidekick;
  return null;
}

// ─── Types ──────────────────────────────────────────────────────────────────

interface Product {
  id: string;
  name: string;
  description: string | null;
  value: string | null;
  image: string | null;
  use_cases: string[];
  is_active: boolean;
  order_index: number;
}

interface CapabilityItem {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
}

type DetailTab = 'overview' | 'agents' | 'vibeapps' | 'sidekick' | 'usecases';

interface AIProductsEditorProps {
  onBack?: () => void;
  onNavigateToCapabilities?: () => void;
}

// ─── Component ──────────────────────────────────────────────────────────────

export function AIProductsEditor({ onBack, onNavigateToCapabilities }: AIProductsEditorProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<DetailTab>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  // All capabilities (for linking)
  const [allAgents, setAllAgents] = useState<CapabilityItem[]>([]);
  const [allVibeApps, setAllVibeApps] = useState<CapabilityItem[]>([]);
  const [allSidekick, setAllSidekick] = useState<CapabilityItem[]>([]);

  // Linked IDs
  const [linkedAgents, setLinkedAgents] = useState<string[]>([]);
  const [linkedVibeApps, setLinkedVibeApps] = useState<string[]>([]);
  const [linkedSidekick, setLinkedSidekick] = useState<string[]>([]);

  // Editing state
  const [editingOverview, setEditingOverview] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', description: '', value: '', image: '' });
  const [useCaseInput, setUseCaseInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // ─── Data Fetching ────────────────────────────────────────────────────────

  useEffect(() => {
    fetchProducts();
    fetchAllCapabilities();
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      fetchLinkedCapabilities(selectedProduct.id);
      setEditingOverview(false);
    }
  }, [selectedProduct?.id]);

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('products')
      .select('id, name, description, value, image, use_cases, is_active, order_index')
      .order('order_index');
    if (data) {
      // Deduplicate by product name — each core product should appear once
      const seen = new Map<string, Product>();
      for (const p of data) {
        const key = p.name.toLowerCase().trim();
        if (!seen.has(key)) {
          seen.set(key, p);
        } else {
          // Merge use_cases from duplicates into the first occurrence
          const existing = seen.get(key)!;
          const mergedCases = [...new Set([...existing.use_cases, ...p.use_cases])];
          seen.set(key, { ...existing, use_cases: mergedCases });
        }
      }
      setProducts(Array.from(seen.values()));
    }
    setLoading(false);
  };

  const fetchAllCapabilities = async () => {
    const [agents, vibeApps, sidekick] = await Promise.all([
      supabase.from('agents').select('id, name, description, image'),
      supabase.from('vibe_apps').select('id, name, value, image'),
      supabase.from('sidekick_actions').select('id, name, description, image'),
    ]);
    if (agents.data) setAllAgents(agents.data);
    if (vibeApps.data) setAllVibeApps(vibeApps.data.map((v: any) => ({ ...v, description: v.value })));
    if (sidekick.data) setAllSidekick(sidekick.data);
  };

  const fetchLinkedCapabilities = async (productId: string) => {
    try {
      const [agents, vibeApps, sidekick] = await Promise.all([
        supabase.from('product_agents').select('agent_id').eq('product_id', productId),
        supabase.from('product_vibe_apps').select('vibe_app_id').eq('product_id', productId),
        supabase.from('product_sidekick_actions').select('sidekick_action_id').eq('product_id', productId),
      ]);
      setLinkedAgents(agents.data?.map(r => r.agent_id) || []);
      setLinkedVibeApps(vibeApps.data?.map(r => r.vibe_app_id) || []);
      setLinkedSidekick(sidekick.data?.map(r => r.sidekick_action_id) || []);
    } catch {
      setLinkedAgents([]);
      setLinkedVibeApps([]);
      setLinkedSidekick([]);
    }
  };

  // ─── Linking ──────────────────────────────────────────────────────────────

  const toggleLink = async (type: 'agents' | 'vibe_apps' | 'sidekick_actions', capId: string) => {
    if (!selectedProduct) return;
    const table = `product_${type}`;
    const idField = type === 'agents' ? 'agent_id' : type === 'vibe_apps' ? 'vibe_app_id' : 'sidekick_action_id';
    const linked = type === 'agents' ? linkedAgents : type === 'vibe_apps' ? linkedVibeApps : linkedSidekick;
    const setLinked = type === 'agents' ? setLinkedAgents : type === 'vibe_apps' ? setLinkedVibeApps : setLinkedSidekick;

    const isLinked = linked.includes(capId);
    if (isLinked) {
      await supabase.from(table).delete().eq('product_id', selectedProduct.id).eq(idField, capId);
      setLinked(prev => prev.filter(id => id !== capId));
    } else {
      await supabase.from(table).insert({ product_id: selectedProduct.id, [idField]: capId });
      setLinked(prev => [...prev, capId]);
    }
  };

  // ─── Overview Editing ─────────────────────────────────────────────────────

  const startEditOverview = () => {
    if (!selectedProduct) return;
    setEditForm({
      name: selectedProduct.name,
      description: selectedProduct.description || '',
      value: selectedProduct.value || '',
      image: selectedProduct.image || '',
    });
    setEditingOverview(true);
  };

  const saveOverview = async () => {
    if (!selectedProduct) return;
    setSaving(true);
    const { error } = await supabase.from('products').update({
      name: editForm.name,
      description: editForm.description,
      value: editForm.value,
      image: editForm.image || null,
    }).eq('id', selectedProduct.id);
    if (!error) {
      setSelectedProduct({ ...selectedProduct, name: editForm.name, description: editForm.description, value: editForm.value, image: editForm.image || null });
      setProducts(prev => prev.map(p => p.id === selectedProduct.id ? { ...p, name: editForm.name, description: editForm.description, value: editForm.value, image: editForm.image || null } : p));
      setEditingOverview(false);
      flash('Saved!');
    }
    setSaving(false);
  };

  // ─── Use Cases ────────────────────────────────────────────────────────────

  const addUseCase = async () => {
    if (!selectedProduct || !useCaseInput.trim()) return;
    const updated = [...selectedProduct.use_cases, useCaseInput.trim()];
    await supabase.from('products').update({ use_cases: updated }).eq('id', selectedProduct.id);
    setSelectedProduct({ ...selectedProduct, use_cases: updated });
    setUseCaseInput('');
    flash('Use case added');
  };

  const removeUseCase = async (idx: number) => {
    if (!selectedProduct) return;
    const updated = selectedProduct.use_cases.filter((_, i) => i !== idx);
    await supabase.from('products').update({ use_cases: updated }).eq('id', selectedProduct.id);
    setSelectedProduct({ ...selectedProduct, use_cases: updated });
  };

  const flash = (msg: string) => { setMessage(msg); setTimeout(() => setMessage(null), 2000); };

  // ─── Helpers ──────────────────────────────────────────────────────────────

  const getTabItems = (): { items: CapabilityItem[]; linked: string[]; type: 'agents' | 'vibe_apps' | 'sidekick_actions' } | null => {
    switch (activeTab) {
      case 'agents': return { items: allAgents, linked: linkedAgents, type: 'agents' };
      case 'vibeapps': return { items: allVibeApps, linked: linkedVibeApps, type: 'vibe_apps' };
      case 'sidekick': return { items: allSidekick, linked: linkedSidekick, type: 'sidekick_actions' };
      default: return null;
    }
  };

  const tabs: { id: DetailTab; label: string; icon: typeof Package; count?: number }[] = [
    { id: 'overview', label: 'Overview', icon: Target },
    { id: 'agents', label: 'Agents', icon: Users, count: linkedAgents.length },
    { id: 'vibeapps', label: 'Vibe Apps', icon: Sparkles, count: linkedVibeApps.length },
    { id: 'sidekick', label: 'Sidekick', icon: Zap, count: linkedSidekick.length },
    { id: 'usecases', label: 'Use Cases', icon: ListChecks, count: selectedProduct?.use_cases.length },
  ];

  // ─── Render: Product List ─────────────────────────────────────────────────

  if (loading) {
    return <div className="text-gray-400 text-center py-12">Loading products...</div>;
  }

  if (!selectedProduct) {
    const filtered = products.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div>
        {onBack && (
          <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        )}

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <Package className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">AI Core Products</h2>
            <p className="text-gray-400">Manage core products and their linked capabilities, use cases, and value propositions</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-sm mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-9 pr-3 py-2.5 bg-gray-900/60 border border-gray-800/50 rounded-xl text-white text-sm focus:border-indigo-500 outline-none placeholder-gray-600"
          />
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(product => {
            const icon = getProductIcon(product.name);
            return (
              <button
                key={product.id}
                onClick={() => { setSelectedProduct(product); setActiveTab('overview'); }}
                className="bg-gray-900/80 rounded-2xl border border-gray-800/60 p-5 hover:border-indigo-500/40 transition-all text-left group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {icon ? (
                      <img src={icon} alt="" className="w-10 h-10 object-contain" />
                    ) : product.image ? (
                      <img src={product.image} alt="" className="w-10 h-10 object-contain" />
                    ) : (
                      <Package className="w-6 h-6 text-gray-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold group-hover:text-indigo-400 transition-colors">{product.name}</h3>
                    <p className="text-gray-500 text-sm line-clamp-2 mt-0.5">{product.description || 'No description'}</p>
                    {product.use_cases.length > 0 && (
                      <p className="text-xs text-gray-600 mt-2">{product.use_cases.length} use cases</p>
                    )}
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-700 group-hover:text-indigo-400 transition-colors mt-1" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ─── Render: Product Detail View ──────────────────────────────────────────

  const productIcon = getProductIcon(selectedProduct.name);
  const capData = getTabItems();

  return (
    <div>
      {/* Header with back */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => { setSelectedProduct(null); setActiveTab('overview'); }}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </button>
        <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center overflow-hidden">
          {productIcon ? (
            <img src={productIcon} alt="" className="w-10 h-10 object-contain" />
          ) : selectedProduct.image ? (
            <img src={selectedProduct.image} alt="" className="w-10 h-10 object-contain" />
          ) : (
            <Package className="w-6 h-6 text-gray-500" />
          )}
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-white">{selectedProduct.name}</h2>
          <p className="text-gray-400 text-sm">{selectedProduct.description}</p>
        </div>
        {message && (
          <span className="text-sm text-emerald-400 flex items-center gap-1"><Check className="w-4 h-4" />{message}</span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-800 pb-4 flex-wrap">
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

      {/* Tab Content: Overview */}
      {activeTab === 'overview' && (
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          {editingOverview ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Edit Product</h3>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                <input type="text" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:border-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                <textarea value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                  rows={3} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:border-indigo-500 outline-none resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Value Proposition</label>
                <textarea value={editForm.value} onChange={e => setEditForm(f => ({ ...f, value: e.target.value }))}
                  rows={2} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:border-indigo-500 outline-none resize-none"
                  placeholder="What makes this product valuable?" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Product Image</label>
                <ImageUploader
                  currentImage={editForm.image}
                  onImageChange={(url) => setEditForm(f => ({ ...f, image: url }))}
                  bucket="Agents"
                  folder="products"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={saveOverview} disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white font-medium transition-colors disabled:opacity-50">
                  <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}
                </button>
                <button onClick={() => setEditingOverview(false)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Product Details</h3>
                <button onClick={startEditOverview}
                  className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 text-sm transition-colors">
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 font-medium uppercase mb-0.5">Name</label>
                  <p className="text-white">{selectedProduct.name}</p>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 font-medium uppercase mb-0.5">Description</label>
                  <p className="text-gray-300 text-sm">{selectedProduct.description || 'No description'}</p>
                </div>
                {selectedProduct.value && (
                  <div>
                    <label className="block text-xs text-gray-500 font-medium uppercase mb-0.5">Value Proposition</label>
                    <p className="text-gray-300 text-sm">{selectedProduct.value}</p>
                  </div>
                )}
              </div>

              {/* Summary Cards */}
              <div className="mt-6 pt-6 border-t border-gray-800">
                <h4 className="text-sm font-medium text-white mb-3">Linked Capabilities</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-gray-800 rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-purple-400">{linkedAgents.length}</p>
                    <p className="text-gray-500 text-xs">Agents</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-pink-400">{linkedVibeApps.length}</p>
                    <p className="text-gray-500 text-xs">Vibe Apps</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-amber-400">{linkedSidekick.length}</p>
                    <p className="text-gray-500 text-xs">Sidekick</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Capabilities Linking (Agents / Vibe / Sidekick) */}
      {capData && (
        <div>
          <p className="text-gray-400 text-sm mb-4">
            Select which {activeTab === 'vibeapps' ? 'Vibe Apps' : activeTab} are part of {selectedProduct.name}.
          </p>

          {capData.items.length === 0 ? (
            <div className="text-center py-12 bg-gray-900 rounded-xl border border-gray-800">
              <Package className="w-10 h-10 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No {activeTab} in the system yet.</p>
              <p className="text-gray-500 text-sm mt-1">Add them in AI Capabilities first.</p>
              {onNavigateToCapabilities && (
                <button onClick={onNavigateToCapabilities}
                  className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-white text-sm transition-colors">
                  Open AI Capabilities
                </button>
              )}
            </div>
          ) : (
            <div>
              {/* Linked items */}
              {(() => {
                const linkedItems = capData.items.filter(i => capData.linked.includes(i.id));
                if (linkedItems.length === 0) return null;
                return (
                  <div className="mb-6">
                    <p className="text-sm text-gray-400 mb-3">Linked ({linkedItems.length})</p>
                    <div className="flex flex-col gap-2">
                      {linkedItems.map(item => {
                        const tabIcon = getCapIcon(activeTab);
                        return (
                          <button key={item.id} onClick={() => toggleLink(capData.type, item.id)}
                            className="flex items-center gap-3 p-3 rounded-xl border bg-indigo-600/20 border-indigo-500 text-white transition-all">
                            <div className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center overflow-hidden">
                              {tabIcon ? <img src={tabIcon} alt="" className="w-7 h-7 object-contain" />
                                : item.image ? <img src={item.image} alt="" className="w-7 h-7 object-contain" />
                                : <Package className="w-4 h-4 text-gray-500" />}
                            </div>
                            <div className="flex-1 text-left">
                              <p className="font-medium text-sm">{item.name}</p>
                              {item.description && <p className="text-xs text-gray-400 truncate">{item.description}</p>}
                            </div>
                            <Check className="w-4 h-4 text-indigo-400" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* Available items */}
              {(() => {
                const unlinked = capData.items.filter(i => !capData.linked.includes(i.id));
                if (unlinked.length === 0) return null;
                return (
                  <div>
                    <p className="text-sm text-gray-500 mb-3">Available ({unlinked.length})</p>
                    <div className="flex flex-col gap-2">
                      {unlinked.map(item => {
                        const tabIcon = getCapIcon(activeTab);
                        return (
                          <button key={item.id} onClick={() => toggleLink(capData.type, item.id)}
                            className="flex items-center gap-3 p-3 rounded-xl border border-gray-800 hover:border-gray-700 text-gray-400 hover:text-white transition-all">
                            <div className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center overflow-hidden">
                              {tabIcon ? <img src={tabIcon} alt="" className="w-7 h-7 object-contain" />
                                : item.image ? <img src={item.image} alt="" className="w-7 h-7 object-contain" />
                                : <Package className="w-4 h-4 text-gray-600" />}
                            </div>
                            <div className="flex-1 text-left">
                              <p className="font-medium text-sm">{item.name}</p>
                              {item.description && <p className="text-xs text-gray-600 truncate">{item.description}</p>}
                            </div>
                            <Plus className="w-4 h-4 text-gray-600" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Use Cases */}
      {activeTab === 'usecases' && (
        <div>
          <p className="text-gray-400 text-sm mb-4">
            Manage use cases for {selectedProduct.name}. These are displayed on landing pages and product sections.
          </p>

          {/* Add use case */}
          <div className="flex gap-2 mb-5">
            <input
              type="text"
              value={useCaseInput}
              onChange={e => setUseCaseInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') addUseCase(); }}
              placeholder="Enter a use case..."
              className="flex-1 px-3 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-white text-sm focus:border-indigo-500 outline-none placeholder-gray-600"
            />
            <button onClick={addUseCase} disabled={!useCaseInput.trim()}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl text-white text-sm font-medium transition-colors">
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>

          {/* Use cases list */}
          {selectedProduct.use_cases.length === 0 ? (
            <div className="text-center py-12 bg-gray-900 rounded-xl border border-gray-800">
              <ListChecks className="w-10 h-10 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No use cases yet</p>
              <p className="text-gray-500 text-sm mt-1">Add use cases that describe how customers use this product</p>
            </div>
          ) : (
            <div className="space-y-2">
              {selectedProduct.use_cases.map((uc, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-gray-900 rounded-xl border border-gray-800 group">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/15 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-indigo-400">{idx + 1}</span>
                  </div>
                  <p className="flex-1 text-sm text-gray-300">{uc}</p>
                  <button onClick={() => removeUseCase(idx)}
                    className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 rounded-lg text-gray-500 hover:text-red-400 transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
