import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Save, ExternalLink, Search, X, Link2, Unlink, Users, ChevronDown, Check, Package } from 'lucide-react';

interface Competitor {
  id: string;
  name: string;
  logo_url: string;
  website: string;
  description: string;
  pricing_info: string;
  founded: string;
  hq_location: string;
  tier: number;
  is_active: boolean;
  order_index: number;
}

interface Product {
  id: string;
  name: string;
  image: string;
}

interface ProductCompetitorLink {
  product_id: string;
  competitor_id: string;
}

const MONDAY_CORE_PRODUCTS: Product[] = [
  { id: '__crm', name: 'monday CRM', image: '' },
  { id: '__wm', name: 'monday Work Management', image: '' },
  { id: '__service', name: 'monday Service', image: '' },
  { id: '__dev', name: 'monday Dev', image: '' },
];

const LOGO_API = (domain: string) => `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

function getDomainFromUrl(url: string): string {
  try {
    return new URL(url.startsWith('http') ? url : `https://${url}`).hostname.replace('www.', '');
  } catch { return ''; }
}

interface CompetitorsEditorProps {
  onBack: () => void;
}

export function CompetitorsEditor({ onBack }: CompetitorsEditorProps) {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [links, setLinks] = useState<ProductCompetitorLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [compRes, prodRes, linkRes] = await Promise.all([
      supabase.from('competitors').select('*').order('order_index'),
      supabase.from('products').select('id, name, image').order('order_index'),
      supabase.from('product_competitors').select('product_id, competitor_id'),
    ]);
    if (compRes.data) {
      // Deduplicate competitors by name
      const seen = new Map<string, Competitor>();
      for (const c of compRes.data) {
        const key = c.name.toLowerCase().trim();
        if (!seen.has(key)) seen.set(key, c);
      }
      setCompetitors(Array.from(seen.values()));
    }
    if (prodRes.data) {
      const coreProducts = MONDAY_CORE_PRODUCTS.map(core => {
        const coreKey = core.name.toLowerCase().replace('monday ', '').trim();
        const match = prodRes.data!.find(p => {
          const dbKey = p.name.toLowerCase().trim();
          return dbKey === coreKey || dbKey.includes(coreKey) || coreKey.includes(dbKey);
        });
        return match ? { ...core, id: match.id, image: match.image || core.image } : core;
      });
      setProducts(coreProducts);
    }
    if (linkRes.data) setLinks(linkRes.data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const selected = competitors.find(c => c.id === selectedId) || null;

  const handleAdd = async () => {
    const { data } = await supabase.from('competitors').insert({
      name: 'New Competitor',
      order_index: competitors.length,
    }).select().single();
    if (data) {
      setCompetitors(prev => [...prev, data]);
      setSelectedId(data.id);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this competitor?')) return;
    await supabase.from('competitors').delete().eq('id', id);
    setCompetitors(prev => prev.filter(c => c.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const handleSave = async (comp: Competitor) => {
    setSaving(true);
    await supabase.from('competitors').update({
      name: comp.name,
      logo_url: comp.logo_url,
      website: comp.website,
      description: comp.description,
      pricing_info: comp.pricing_info,
      founded: comp.founded,
      hq_location: comp.hq_location,
      tier: comp.tier,
      is_active: comp.is_active,
    }).eq('id', comp.id);
    setSaving(false);
  };

  const updateField = (field: keyof Competitor, value: any) => {
    setCompetitors(prev => prev.map(c => {
      if (c.id !== selectedId) return c;
      const updated = { ...c, [field]: value };
      // Auto-set logo_url from website domain when website changes
      if (field === 'website' && value && !c.logo_url) {
        const domain = getDomainFromUrl(value);
        if (domain) updated.logo_url = LOGO_API(domain);
      }
      return updated;
    }));
  };

  const linkedProductIds = links.filter(l => l.competitor_id === selectedId).map(l => l.product_id);

  const toggleProductLink = async (productId: string) => {
    if (!selectedId) return;
    const isLinked = linkedProductIds.includes(productId);
    if (isLinked) {
      await supabase.from('product_competitors').delete()
        .eq('product_id', productId).eq('competitor_id', selectedId);
      setLinks(prev => prev.filter(l => !(l.product_id === productId && l.competitor_id === selectedId)));
    } else {
      await supabase.from('product_competitors').insert({ product_id: productId, competitor_id: selectedId });
      setLinks(prev => [...prev, { product_id: productId, competitor_id: selectedId }]);
    }
  };

  const [viewMode, setViewMode] = useState<'list' | 'by-product'>('list');
  const [selectedProductFilter, setSelectedProductFilter] = useState<string | null>(null);

  const filtered = competitors.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  // Toggle linking from product-centric view
  const toggleLinkFromProduct = async (productId: string, competitorId: string) => {
    const isLinked = links.some(l => l.product_id === productId && l.competitor_id === competitorId);
    if (isLinked) {
      await supabase.from('product_competitors').delete()
        .eq('product_id', productId).eq('competitor_id', competitorId);
      setLinks(prev => prev.filter(l => !(l.product_id === productId && l.competitor_id === competitorId)));
    } else {
      await supabase.from('product_competitors').insert({ product_id: productId, competitor_id: competitorId });
      setLinks(prev => [...prev, { product_id: productId, competitor_id: competitorId }]);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Loading competitors...</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] gap-4">
      {/* Top: View mode tabs */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button onClick={() => setViewMode('list')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${viewMode === 'list' ? 'bg-red-600/20 text-red-400 border border-red-500/30' : 'bg-gray-800/30 text-gray-400 hover:text-white border border-gray-700/30 hover:border-gray-600'}`}>
          <Users className="w-4 h-4" /> All Competitors
        </button>
        <button onClick={() => setViewMode('by-product')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${viewMode === 'by-product' ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' : 'bg-gray-800/30 text-gray-400 hover:text-white border border-gray-700/30 hover:border-gray-600'}`}>
          <Package className="w-4 h-4" /> By Product
        </button>
      </div>

      {/* By Product View */}
      {viewMode === 'by-product' ? (
        <div className="flex-1 bg-gray-900/50 rounded-2xl border border-gray-800/40 overflow-auto p-6">
          <p className="text-gray-500 text-sm mb-5">Select a monday.com product and manage which competitors are associated with it. These links determine which competitors appear in the Battle Cards app dropdown.</p>
          <div className="flex gap-3 mb-6 flex-wrap">
            {products.map(prod => {
              const count = links.filter(l => l.product_id === prod.id).length;
              return (
                <button key={prod.id} onClick={() => setSelectedProductFilter(selectedProductFilter === prod.id ? null : prod.id)}
                  className={`flex items-center gap-2.5 px-5 py-3 rounded-xl border text-sm font-medium transition-all ${selectedProductFilter === prod.id ? 'bg-indigo-600/15 border-indigo-500/40 text-white shadow-lg shadow-indigo-500/5' : 'bg-gray-800/30 border-gray-700/30 text-gray-400 hover:border-gray-600 hover:text-white'}`}>
                  <span>{prod.name}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${selectedProductFilter === prod.id ? 'bg-indigo-500/30 text-indigo-300' : 'bg-gray-700/50 text-gray-500'}`}>{count}</span>
                </button>
              );
            })}
          </div>

          {selectedProductFilter ? (
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">
                Competitors for <span className="text-indigo-400">{products.find(p => p.id === selectedProductFilter)?.name}</span>
              </h4>
              <p className="text-gray-600 text-xs mb-4">Click a competitor to link/unlink. Linked competitors will appear in the Battle Cards app when this product is selected.</p>
              <div className="grid grid-cols-3 gap-3">
                {competitors.filter(c => c.is_active).map(comp => {
                  const isLinked = links.some(l => l.product_id === selectedProductFilter && l.competitor_id === comp.id);
                  const domain = getDomainFromUrl(comp.website);
                  const logoSrc = comp.logo_url || (domain ? LOGO_API(domain) : '');
                  return (
                    <button key={comp.id} onClick={() => toggleLinkFromProduct(selectedProductFilter!, comp.id)}
                      className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all ${isLinked ? 'bg-indigo-600/10 border-indigo-500/30 text-white' : 'bg-gray-800/20 border-gray-700/30 text-gray-500 hover:border-gray-600 hover:text-gray-300'}`}>
                      <div className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {logoSrc ? <img src={logoSrc} alt="" className="w-6 h-6 object-contain" onError={e => (e.currentTarget.style.display = 'none')} /> : <span className="text-xs font-bold text-gray-600">{comp.name.charAt(0)}</span>}
                      </div>
                      <div className="flex-1 text-left">
                        <span className="text-sm font-medium">{comp.name}</span>
                        <span className={`ml-1.5 text-[9px] px-1 py-0.5 rounded font-bold ${comp.tier === 2 ? 'bg-gray-600/20 text-gray-500' : 'bg-pink-500/20 text-pink-400'}`}>T{comp.tier || 1}</span>
                      </div>
                      {isLinked ? <Check className="w-4 h-4 text-indigo-400 flex-shrink-0" /> : <Plus className="w-4 h-4 text-gray-600 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-600">
              <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium">Select a product above</p>
              <p className="text-sm mt-1">Choose a monday.com product to manage its competitors</p>
            </div>
          )}
        </div>
      ) : (

      <div className="flex gap-6 flex-1">
      {/* Left: List */}
      <div className="w-80 flex-shrink-0 flex flex-col bg-gray-900/50 rounded-2xl border border-gray-800/40 overflow-hidden">
        <div className="p-4 border-b border-gray-800/40">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-semibold">Competitors</h3>
            <button onClick={handleAdd} className="p-2 bg-red-600/20 hover:bg-red-600/30 rounded-lg text-red-400 transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search competitors..."
              className="w-full bg-gray-800/60 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-gray-600 border border-gray-700/40 focus:border-gray-600 focus:outline-none"
            />
          </div>
        </div>
        <div className="flex-1 overflow-auto p-2 space-y-1">
          {filtered.map(comp => {
            const domain = getDomainFromUrl(comp.website);
            const logoSrc = comp.logo_url || (domain ? LOGO_API(domain) : '');
            const prodCount = links.filter(l => l.competitor_id === comp.id).length;
            return (
              <button
                key={comp.id}
                onClick={() => setSelectedId(comp.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                  selectedId === comp.id
                    ? 'bg-red-600/10 border border-red-500/20 text-white'
                    : 'hover:bg-white/5 text-gray-400 border border-transparent'
                }`}
              >
                <div className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {logoSrc ? (
                    <img src={logoSrc} alt="" className="w-6 h-6 object-contain" onError={e => (e.currentTarget.style.display = 'none')} />
                  ) : (
                    <span className="text-gray-600 text-xs font-bold">{comp.name.charAt(0)}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-medium truncate">{comp.name}</p>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold flex-shrink-0 ${comp.tier === 1 ? 'bg-pink-500/20 text-pink-400' : 'bg-gray-600/20 text-gray-500'}`}>T{comp.tier || 1}</span>
                  </div>
                  <p className="text-xs text-gray-600">{prodCount} product{prodCount !== 1 ? 's' : ''}</p>
                </div>
                {!comp.is_active && (
                  <span className="text-[10px] text-gray-600 bg-gray-800 px-1.5 py-0.5 rounded">OFF</span>
                )}
              </button>
            );
          })}
          {filtered.length === 0 && (
            <p className="text-center text-gray-600 text-sm py-8">No competitors found</p>
          )}
        </div>
      </div>

      {/* Right: Detail */}
      {selected ? (
        <div className="flex-1 bg-gray-900/50 rounded-2xl border border-gray-800/40 overflow-auto">
          <div className="p-6 border-b border-gray-800/40 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gray-800 flex items-center justify-center overflow-hidden">
                {(selected.logo_url || getDomainFromUrl(selected.website)) ? (
                  <img src={selected.logo_url || LOGO_API(getDomainFromUrl(selected.website))} alt="" className="w-10 h-10 object-contain" onError={e => (e.currentTarget.style.display = 'none')} />
                ) : (
                  <span className="text-gray-500 text-xl font-bold">{selected.name.charAt(0)}</span>
                )}
              </div>
              <div>
                <input
                  value={selected.name}
                  onChange={e => updateField('name', e.target.value)}
                  className="text-xl font-bold text-white bg-transparent border-none outline-none"
                />
                {selected.website && (
                  <a href={selected.website.startsWith('http') ? selected.website : `https://${selected.website}`} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-gray-500 hover:text-gray-400 flex items-center gap-1 mt-0.5">
                    <ExternalLink className="w-3 h-3" /> {selected.website}
                  </a>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => handleSave(selected)} disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-xl text-sm font-medium transition-colors disabled:opacity-50">
                <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}
              </button>
              <button onClick={() => handleDelete(selected.id)}
                className="p-2 text-gray-600 hover:text-red-400 hover:bg-red-600/10 rounded-lg transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Website</label>
                <input value={selected.website} onChange={e => updateField('website', e.target.value)}
                  className="w-full bg-gray-800/60 rounded-lg px-3 py-2.5 text-sm text-white border border-gray-700/40 focus:border-gray-600 focus:outline-none" placeholder="https://example.com" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Logo URL</label>
                <div className="flex gap-2">
                  <input value={selected.logo_url} onChange={e => updateField('logo_url', e.target.value)}
                    className="flex-1 bg-gray-800/60 rounded-lg px-3 py-2.5 text-sm text-white border border-gray-700/40 focus:border-gray-600 focus:outline-none" placeholder="Leave blank to auto-detect" />
                  {selected.website && !selected.logo_url && (
                    <button
                      onClick={() => {
                        const domain = getDomainFromUrl(selected.website);
                        if (domain) updateField('logo_url', LOGO_API(domain));
                      }}
                      className="px-3 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 rounded-lg text-xs font-medium transition-colors whitespace-nowrap">
                      Fetch Logo
                    </button>
                  )}
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Founded</label>
                <input value={selected.founded} onChange={e => updateField('founded', e.target.value)}
                  className="w-full bg-gray-800/60 rounded-lg px-3 py-2.5 text-sm text-white border border-gray-700/40 focus:border-gray-600 focus:outline-none" placeholder="e.g. 2010" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">HQ Location</label>
                <input value={selected.hq_location} onChange={e => updateField('hq_location', e.target.value)}
                  className="w-full bg-gray-800/60 rounded-lg px-3 py-2.5 text-sm text-white border border-gray-700/40 focus:border-gray-600 focus:outline-none" placeholder="e.g. San Francisco, CA" />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1 block">Description</label>
              <textarea value={selected.description} onChange={e => updateField('description', e.target.value)} rows={3}
                className="w-full bg-gray-800/60 rounded-lg px-3 py-2.5 text-sm text-white border border-gray-700/40 focus:border-gray-600 focus:outline-none resize-none" placeholder="Brief description of this competitor..." />
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1 block">Pricing Info</label>
              <textarea value={selected.pricing_info} onChange={e => updateField('pricing_info', e.target.value)} rows={2}
                className="w-full bg-gray-800/60 rounded-lg px-3 py-2.5 text-sm text-white border border-gray-700/40 focus:border-gray-600 focus:outline-none resize-none" placeholder="Key pricing details..." />
            </div>

            {/* Tier & Active */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-500">Tier</label>
                <div className="flex gap-1">
                  <button onClick={() => updateField('tier', 1)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${(selected.tier || 1) === 1 ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30' : 'bg-gray-800/40 text-gray-500 border border-gray-700/30 hover:border-gray-600'}`}>
                    Tier 1
                  </button>
                  <button onClick={() => updateField('tier', 2)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selected.tier === 2 ? 'bg-gray-500/20 text-gray-400 border border-gray-500/30' : 'bg-gray-800/40 text-gray-500 border border-gray-700/30 hover:border-gray-600'}`}>
                    Tier 2
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => updateField('is_active', !selected.is_active)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${selected.is_active ? 'bg-red-600' : 'bg-gray-700'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${selected.is_active ? 'left-5.5' : 'left-0.5'}`} />
                </button>
                <span className="text-sm text-gray-400">Active</span>
              </div>
            </div>

            {/* Product Mapping */}
            <div>
              <h4 className="text-white font-semibold mb-3">Competes With (monday Products)</h4>
              <div className="grid grid-cols-2 gap-2">
                {products.map(product => {
                  const isLinked = linkedProductIds.includes(product.id);
                  return (
                    <button key={product.id} onClick={() => toggleProductLink(product.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                        isLinked
                          ? 'bg-red-600/10 border-red-500/30 text-white'
                          : 'bg-gray-800/30 border-gray-700/30 text-gray-500 hover:border-gray-600'
                      }`}>
                      {isLinked ? <Link2 className="w-4 h-4 text-red-400" /> : <Unlink className="w-4 h-4" />}
                      <span className="text-sm">{product.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-600">
          <div className="text-center">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium">Select a competitor</p>
            <p className="text-sm mt-1">Choose from the list or add a new one</p>
          </div>
        </div>
      )}
    </div>
    )}
    </div>
  );
}
