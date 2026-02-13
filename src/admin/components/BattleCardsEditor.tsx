import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Save, ChevronDown, Swords, SlidersHorizontal, Zap, MessageSquare, Star, FileText, Quote, ExternalLink, CheckCircle2, XCircle, AlertCircle, ChevronRight, GripVertical } from 'lucide-react';
import { DEFAULT_BATTLE_CARD_CONTENT, type BattleCardContent, type ComparisonRow, type Differentiator } from '@/app/BattleCardsApp';

/* ─── Types ─── */
interface Product { id: string; name: string; }
interface Competitor { id: string; name: string; website: string; }
interface ObjectionHandler { id: string; product_id: string; competitor_id: string; objection_text: string; response_text: string; category: string; order_index: number; }

const MONDAY_CORE_PRODUCTS: Product[] = [
  { id: '__crm', name: 'monday CRM' },
  { id: '__wm', name: 'monday Work Management' },
  { id: '__service', name: 'monday Service' },
  { id: '__dev', name: 'monday Dev' },
];

const OBJECTION_CATEGORIES = ['general', 'pricing', 'features', 'security', 'migration', 'support', 'ai'];
const STATUS_OPTIONS: { value: 'green' | 'orange' | 'red'; label: string; color: string }[] = [
  { value: 'green', label: 'Advantage', color: '#10b981' },
  { value: 'orange', label: 'Partial', color: '#f59e0b' },
  { value: 'red', label: 'Weakness', color: '#ef4444' },
];

const LOGO_API = (domain: string) => `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
function getDomain(url: string) { try { return new URL(url.startsWith('http') ? url : `https://${url}`).hostname.replace('www.', ''); } catch { return ''; } }

function getProductKey(name: string) { return name.toLowerCase().replace('monday ', '').trim(); }

function StatusBadge({ status }: { status: 'green' | 'orange' | 'red' }) {
  const meta = STATUS_OPTIONS.find(s => s.value === status)!;
  const icons = { green: CheckCircle2, orange: AlertCircle, red: XCircle };
  const Icon = icons[status];
  return <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ backgroundColor: `${meta.color}15`, color: meta.color }}><Icon className="w-3 h-3" />{meta.label}</div>;
}

/* ─── Main Editor ─── */
interface BattleCardsEditorProps { onBack: () => void; }

export function BattleCardsEditor({ onBack }: BattleCardsEditorProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [objections, setObjections] = useState<ObjectionHandler[]>([]);
  const [links, setLinks] = useState<{ product_id: string; competitor_id: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<'content' | 'objections'>('content');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedCompetitorId, setSelectedCompetitorId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Editable battle card content per product
  const [allContent, setAllContent] = useState<Record<string, BattleCardContent>>({});

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [prodRes, compRes, objRes, linkRes, settingsRes] = await Promise.all([
      supabase.from('products').select('id, name').order('order_index'),
      supabase.from('competitors').select('id, name, website').eq('is_active', true).order('order_index'),
      supabase.from('objection_handlers').select('*').order('order_index'),
      supabase.from('product_competitors').select('product_id, competitor_id'),
      supabase.from('site_settings').select('*').eq('id', 'main').single(),
    ]);
    if (prodRes.data) {
      const coreProducts = MONDAY_CORE_PRODUCTS.map(core => {
        const coreKey = core.name.toLowerCase().replace('monday ', '').trim();
        const match = prodRes.data!.find(p => { const dbKey = p.name.toLowerCase().trim(); return dbKey === coreKey || dbKey.includes(coreKey) || coreKey.includes(dbKey); });
        return match ? { ...core, id: match.id } : core;
      });
      setProducts(coreProducts);
    }
    if (compRes.data) {
      const seen = new Map<string, Competitor>();
      for (const c of compRes.data) { const k = c.name.toLowerCase().trim(); if (!seen.has(k)) seen.set(k, c); }
      setCompetitors(Array.from(seen.values()));
    }
    if (objRes.data) setObjections(objRes.data);
    if (linkRes.data) setLinks(linkRes.data);

    // Load stored content, merge with defaults
    const stored = (settingsRes.data as any)?.battle_card_content || {};
    const merged: Record<string, BattleCardContent> = {};
    for (const [key, defaultContent] of Object.entries(DEFAULT_BATTLE_CARD_CONTENT)) {
      merged[key] = stored[key] || defaultContent;
    }
    setAllContent(merged);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    if (products.length && !selectedProductId) setSelectedProductId(products[0].id);
  }, [products, selectedProductId]);

  useEffect(() => {
    if (selectedProductId && !selectedCompetitorId) {
      const linkedCompIds = links.filter(l => l.product_id === selectedProductId).map(l => l.competitor_id);
      const available = competitors.filter(c => linkedCompIds.includes(c.id));
      if (available.length) setSelectedCompetitorId(available[0].id);
      else if (competitors.length) setSelectedCompetitorId(competitors[0].id);
    }
  }, [selectedProductId, competitors, links, selectedCompetitorId]);

  const competitorsForProduct = (() => {
    if (!selectedProductId) return competitors;
    const linkedCompIds = links.filter(l => l.product_id === selectedProductId).map(l => l.competitor_id);
    const linked = competitors.filter(c => linkedCompIds.includes(c.id));
    return linked.length ? linked : competitors;
  })();

  // Current product content
  const productKey = selectedProductId ? getProductKey(products.find(p => p.id === selectedProductId)?.name || '') : '';
  const content = allContent[productKey] || null;
  const competitorKey = selectedCompetitorId ? (competitors.find(c => c.id === selectedCompetitorId)?.name || '').toLowerCase().trim() : '';

  // Update content helpers
  const updateContent = (newContent: BattleCardContent) => {
    setAllContent(prev => ({ ...prev, [productKey]: newContent }));
    setSaved(false);
  };

  const updateHero = (field: string, value: string) => {
    if (!content) return;
    updateContent({ ...content, hero: { ...content.hero, [field]: value } });
  };

  const updateDifferentiator = (idx: number, field: keyof Differentiator, value: string) => {
    if (!content) return;
    const diffs = [...content.differentiators];
    diffs[idx] = { ...diffs[idx], [field]: value };
    updateContent({ ...content, differentiators: diffs });
  };

  const addDifferentiator = () => {
    if (!content) return;
    updateContent({ ...content, differentiators: [...content.differentiators, { title: '', description: '', proof: '' }] });
  };

  const removeDifferentiator = (idx: number) => {
    if (!content) return;
    updateContent({ ...content, differentiators: content.differentiators.filter((_, i) => i !== idx) });
  };

  const updateSocialProof = (field: string, value: string) => {
    if (!content) return;
    updateContent({ ...content, socialProof: { ...content.socialProof, [field]: value } });
  };

  const getComparisonRows = (): ComparisonRow[] => {
    if (!content) return [];
    return content.comparisons[competitorKey] || [];
  };

  const updateComparisonRow = (idx: number, field: keyof ComparisonRow, value: string) => {
    if (!content) return;
    const rows = [...getComparisonRows()];
    rows[idx] = { ...rows[idx], [field]: value };
    updateContent({ ...content, comparisons: { ...content.comparisons, [competitorKey]: rows } });
  };

  const addComparisonRow = () => {
    if (!content) return;
    const rows = [...getComparisonRows()];
    const lastCategory = rows.length > 0 ? rows[rows.length - 1].category : 'General';
    rows.push({ category: lastCategory, feature: '', mondayStatus: 'green', mondayTitle: '', mondayDescription: '', competitorStatus: 'red', competitorTitle: '', competitorDescription: '' });
    updateContent({ ...content, comparisons: { ...content.comparisons, [competitorKey]: rows } });
  };

  const removeComparisonRow = (idx: number) => {
    if (!content) return;
    const rows = getComparisonRows().filter((_, i) => i !== idx);
    updateContent({ ...content, comparisons: { ...content.comparisons, [competitorKey]: rows } });
  };

  // Save to Supabase
  const saveAll = async () => {
    setSaving(true);
    try {
      // Try to update the battle_card_content column on site_settings
      // If column doesn't exist, it will fail gracefully
      await supabase.from('site_settings').update({ battle_card_content: allContent } as any).eq('id', 'main');
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Failed to save battle card content:', err);
    }
    setSaving(false);
  };

  // Objection CRUD
  const addObjection = async () => {
    if (!selectedProductId || !selectedCompetitorId) return;
    const { data } = await supabase.from('objection_handlers').insert({ product_id: selectedProductId, competitor_id: selectedCompetitorId, objection_text: '', response_text: '', order_index: objections.length }).select().single();
    if (data) setObjections(prev => [...prev, data]);
  };
  const updateObjection = (id: string, field: string, value: any) => { setObjections(prev => prev.map(o => o.id === id ? { ...o, [field]: value } : o)); };
  const saveObjection = async (obj: ObjectionHandler) => { await supabase.from('objection_handlers').update({ objection_text: obj.objection_text, response_text: obj.response_text, category: obj.category }).eq('id', obj.id); };
  const deleteObjection = async (id: string) => { await supabase.from('objection_handlers').delete().eq('id', id); setObjections(prev => prev.filter(o => o.id !== id)); };
  const currentObjections = objections.filter(o => o.product_id === selectedProductId && o.competitor_id === selectedCompetitorId);

  const selectedComp = competitors.find(c => c.id === selectedCompetitorId);

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Loading battle cards...</div>;

  const rows = getComparisonRows();

  return (
    <div className="space-y-6">
      {/* Product & Competitor Selectors */}
      <div className="flex items-center gap-4 flex-wrap">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">monday Product</label>
          <select value={selectedProductId || ''} onChange={e => { setSelectedProductId(e.target.value); setSelectedCompetitorId(null); }}
            className="bg-gray-800/60 rounded-lg px-3 py-2.5 text-sm text-white border border-gray-700/40 focus:outline-none min-w-[200px]">
            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className="text-gray-600 text-2xl font-light pt-5">vs</div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Competitor</label>
          <select value={selectedCompetitorId || ''} onChange={e => setSelectedCompetitorId(e.target.value)}
            className="bg-gray-800/60 rounded-lg px-3 py-2.5 text-sm text-white border border-gray-700/40 focus:outline-none min-w-[200px]">
            {competitorsForProduct.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        {selectedComp && getDomain(selectedComp.website) && (
          <div className="pt-5"><img src={LOGO_API(getDomain(selectedComp.website))} alt="" className="w-8 h-8 rounded object-contain bg-gray-800 p-1" onError={e => (e.currentTarget.style.display = 'none')} /></div>
        )}
        <div className="ml-auto flex items-center gap-3 pt-5">
          <a href="/battle-cards" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2.5 text-gray-500 hover:text-gray-300 text-sm transition-colors"><ExternalLink className="w-4 h-4" /> Preview</a>
          <button onClick={saveAll} disabled={saving}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${saved ? 'bg-green-600/20 text-green-400' : 'bg-orange-600/20 hover:bg-orange-600/30 text-orange-400'} disabled:opacity-50`}>
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : saved ? 'Saved!' : 'Save All'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-900/50 rounded-xl p-1 border border-gray-800/40 w-fit">
        {[
          { key: 'content', label: 'Battle Card Content', icon: FileText },
          { key: 'objections', label: 'Objection Handlers', icon: MessageSquare },
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.key ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}>
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {/* CONTENT TAB */}
      {activeTab === 'content' && content && (
        <div className="space-y-8">

          {/* HERO SECTION */}
          <div className="bg-gray-900/50 rounded-xl border border-gray-800/40 p-6">
            <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2"><Swords className="w-4 h-4 text-orange-400" /> Hero Section</h3>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-gray-500 mb-1 block uppercase tracking-wider">Headline</label>
                <input value={content.hero.headline} onChange={e => updateHero('headline', e.target.value)}
                  className="w-full bg-gray-800/40 rounded-lg px-3 py-2.5 text-sm text-white border border-gray-700/30 focus:outline-none focus:border-orange-500/30 transition-colors" />
              </div>
              <div>
                <label className="text-[10px] text-gray-500 mb-1 block uppercase tracking-wider">Tagline</label>
                <textarea value={content.hero.tagline} onChange={e => updateHero('tagline', e.target.value)} rows={2}
                  className="w-full bg-gray-800/40 rounded-lg px-3 py-2.5 text-sm text-white border border-gray-700/30 focus:outline-none focus:border-orange-500/30 resize-none transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-gray-500 mb-1 block uppercase tracking-wider">Quote (optional)</label>
                  <textarea value={content.hero.quote || ''} onChange={e => updateHero('quote', e.target.value)} rows={2}
                    className="w-full bg-gray-800/40 rounded-lg px-3 py-2.5 text-sm text-white border border-gray-700/30 focus:outline-none focus:border-orange-500/30 resize-none transition-colors" placeholder="Research quote or stat..." />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 mb-1 block uppercase tracking-wider">Quote Source</label>
                  <input value={content.hero.quoteSource || ''} onChange={e => updateHero('quoteSource', e.target.value)}
                    className="w-full bg-gray-800/40 rounded-lg px-3 py-2.5 text-sm text-white border border-gray-700/30 focus:outline-none focus:border-orange-500/30 transition-colors" placeholder="e.g. Harvard Business Review" />
                </div>
              </div>
            </div>
          </div>

          {/* DIFFERENTIATORS */}
          <div className="bg-gray-900/50 rounded-xl border border-gray-800/40 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold text-sm flex items-center gap-2"><Star className="w-4 h-4 text-yellow-400" /> What Sets Us Apart</h3>
              <button onClick={addDifferentiator} className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-600/15 hover:bg-orange-600/25 text-orange-400 rounded-lg text-xs font-medium transition-colors">
                <Plus className="w-3 h-3" /> Add
              </button>
            </div>
            <div className="space-y-3">
              {content.differentiators.map((diff, i) => (
                <div key={i} className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/20 relative group">
                  <button onClick={() => removeDifferentiator(i)} className="absolute top-2 right-2 p-1 text-gray-700 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] text-gray-500 mb-1 block">Title</label>
                      <input value={diff.title} onChange={e => updateDifferentiator(i, 'title', e.target.value)}
                        className="w-full bg-gray-800/60 rounded-lg px-3 py-2 text-sm text-white border border-gray-700/30 focus:outline-none focus:border-orange-500/30 transition-colors" />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-500 mb-1 block">Description</label>
                      <input value={diff.description} onChange={e => updateDifferentiator(i, 'description', e.target.value)}
                        className="w-full bg-gray-800/60 rounded-lg px-3 py-2 text-sm text-white border border-gray-700/30 focus:outline-none focus:border-orange-500/30 transition-colors" />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-500 mb-1 block">Proof Point</label>
                      <input value={diff.proof} onChange={e => updateDifferentiator(i, 'proof', e.target.value)}
                        className="w-full bg-gray-800/60 rounded-lg px-3 py-2 text-sm text-white border border-gray-700/30 focus:outline-none focus:border-orange-500/30 transition-colors" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* COMPARISON TABLE */}
          <div className="bg-gray-900/50 rounded-xl border border-gray-800/40 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold text-sm flex items-center gap-2">
                <Swords className="w-4 h-4 text-indigo-400" /> Comparison Rows
                <span className="text-xs text-gray-600 font-normal">({rows.length} rows for {selectedComp?.name || 'competitor'})</span>
              </h3>
              <button onClick={addComparisonRow} className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-600/15 hover:bg-orange-600/25 text-orange-400 rounded-lg text-xs font-medium transition-colors">
                <Plus className="w-3 h-3" /> Add Row
              </button>
            </div>

            {rows.length === 0 ? (
              <div className="text-center py-8 text-gray-600">
                <Swords className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No comparison rows for this competitor yet</p>
                <p className="text-xs mt-1">Click "Add Row" to start building the comparison table</p>
              </div>
            ) : (
              <div className="space-y-3">
                {rows.map((row, i) => (
                  <div key={i} className="bg-gray-800/20 rounded-xl border border-gray-700/20 overflow-hidden group">
                    {/* Row header */}
                    <div className="flex items-center gap-3 px-4 py-2.5 border-b border-gray-800/20">
                      <input value={row.category} onChange={e => updateComparisonRow(i, 'category', e.target.value)}
                        className="bg-transparent text-xs text-gray-400 font-semibold uppercase tracking-wider border-none outline-none w-40 placeholder-gray-700" placeholder="Category name..." />
                      <span className="text-gray-700">/</span>
                      <input value={row.feature} onChange={e => updateComparisonRow(i, 'feature', e.target.value)}
                        className="bg-transparent text-xs text-gray-500 border-none outline-none flex-1 placeholder-gray-700" placeholder="Feature name..." />
                      <button onClick={() => removeComparisonRow(i)} className="p-1 text-gray-700 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                    {/* Two columns */}
                    <div className="grid grid-cols-2 divide-x divide-gray-800/20">
                      {/* Monday column */}
                      <div className="p-3 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-indigo-400 font-semibold uppercase w-12">monday</span>
                          <div className="flex gap-1">
                            {STATUS_OPTIONS.map(s => (
                              <button key={s.value} onClick={() => updateComparisonRow(i, 'mondayStatus', s.value)}
                                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${row.mondayStatus === s.value ? 'ring-1' : 'opacity-40 hover:opacity-70'}`}
                                style={{ backgroundColor: `${s.color}15`, color: s.color, ringColor: s.color }}>
                                {s.label}
                              </button>
                            ))}
                          </div>
                        </div>
                        <input value={row.mondayTitle} onChange={e => updateComparisonRow(i, 'mondayTitle', e.target.value)}
                          className="w-full bg-gray-800/40 rounded px-2.5 py-1.5 text-xs text-white border border-gray-700/20 focus:outline-none focus:border-indigo-500/30 transition-colors font-medium" placeholder="Title (bold)..." />
                        <textarea value={row.mondayDescription} onChange={e => updateComparisonRow(i, 'mondayDescription', e.target.value)} rows={2}
                          className="w-full bg-gray-800/40 rounded px-2.5 py-1.5 text-xs text-gray-400 border border-gray-700/20 focus:outline-none focus:border-indigo-500/30 resize-none transition-colors" placeholder="Description..." />
                      </div>
                      {/* Competitor column */}
                      <div className="p-3 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-red-400 font-semibold uppercase w-12 truncate">{selectedComp?.name?.split(' ')[0] || 'Comp.'}</span>
                          <div className="flex gap-1">
                            {STATUS_OPTIONS.map(s => (
                              <button key={s.value} onClick={() => updateComparisonRow(i, 'competitorStatus', s.value)}
                                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${row.competitorStatus === s.value ? 'ring-1' : 'opacity-40 hover:opacity-70'}`}
                                style={{ backgroundColor: `${s.color}15`, color: s.color, ringColor: s.color }}>
                                {s.label}
                              </button>
                            ))}
                          </div>
                        </div>
                        <input value={row.competitorTitle} onChange={e => updateComparisonRow(i, 'competitorTitle', e.target.value)}
                          className="w-full bg-gray-800/40 rounded px-2.5 py-1.5 text-xs text-white border border-gray-700/20 focus:outline-none focus:border-red-500/30 transition-colors font-medium" placeholder="Title (bold)..." />
                        <textarea value={row.competitorDescription} onChange={e => updateComparisonRow(i, 'competitorDescription', e.target.value)} rows={2}
                          className="w-full bg-gray-800/40 rounded px-2.5 py-1.5 text-xs text-gray-400 border border-gray-700/20 focus:outline-none focus:border-red-500/30 resize-none transition-colors" placeholder="Description..." />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SOCIAL PROOF */}
          <div className="bg-gray-900/50 rounded-xl border border-gray-800/40 p-6">
            <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2"><Quote className="w-4 h-4 text-green-400" /> Social Proof</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-gray-500 mb-1 block uppercase tracking-wider">Customer Quote</label>
                <textarea value={content.socialProof.quote} onChange={e => updateSocialProof('quote', e.target.value)} rows={3}
                  className="w-full bg-gray-800/40 rounded-lg px-3 py-2.5 text-sm text-white border border-gray-700/30 focus:outline-none focus:border-orange-500/30 resize-none transition-colors" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div><label className="text-[10px] text-gray-500 mb-1 block uppercase tracking-wider">Author</label><input value={content.socialProof.author} onChange={e => updateSocialProof('author', e.target.value)} className="w-full bg-gray-800/40 rounded-lg px-3 py-2 text-sm text-white border border-gray-700/30 focus:outline-none focus:border-orange-500/30 transition-colors" /></div>
                <div><label className="text-[10px] text-gray-500 mb-1 block uppercase tracking-wider">Role</label><input value={content.socialProof.role} onChange={e => updateSocialProof('role', e.target.value)} className="w-full bg-gray-800/40 rounded-lg px-3 py-2 text-sm text-white border border-gray-700/30 focus:outline-none focus:border-orange-500/30 transition-colors" /></div>
                <div><label className="text-[10px] text-gray-500 mb-1 block uppercase tracking-wider">Company</label><input value={content.socialProof.company} onChange={e => updateSocialProof('company', e.target.value)} className="w-full bg-gray-800/40 rounded-lg px-3 py-2 text-sm text-white border border-gray-700/30 focus:outline-none focus:border-orange-500/30 transition-colors" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-[10px] text-gray-500 mb-1 block uppercase tracking-wider">Analyst Stat</label><input value={content.socialProof.analystStat} onChange={e => updateSocialProof('analystStat', e.target.value)} className="w-full bg-gray-800/40 rounded-lg px-3 py-2 text-sm text-white border border-gray-700/30 focus:outline-none focus:border-orange-500/30 transition-colors" /></div>
                <div><label className="text-[10px] text-gray-500 mb-1 block uppercase tracking-wider">Analyst Source</label><input value={content.socialProof.analystSource} onChange={e => updateSocialProof('analystSource', e.target.value)} className="w-full bg-gray-800/40 rounded-lg px-3 py-2 text-sm text-white border border-gray-700/30 focus:outline-none focus:border-orange-500/30 transition-colors" /></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OBJECTIONS TAB */}
      {activeTab === 'objections' && selectedProductId && selectedCompetitorId && (
        <div className="space-y-3">
          <div className="flex justify-end">
            <button onClick={addObjection} className="flex items-center gap-2 px-3 py-2 bg-orange-600/20 hover:bg-orange-600/30 text-orange-400 rounded-lg text-sm transition-colors"><Plus className="w-4 h-4" /> Add Objection Handler</button>
          </div>
          {currentObjections.length === 0 && (
            <div className="text-center py-12 text-gray-600"><MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-30" /><p>No objection handlers yet for this matchup</p></div>
          )}
          {currentObjections.map(obj => (
            <div key={obj.id} className="bg-gray-900/50 rounded-xl border border-gray-800/40 p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-1 space-y-3">
                  <div>
                    <label className="text-[10px] text-red-400 font-semibold mb-1 block">OBJECTION</label>
                    <textarea value={obj.objection_text} onChange={e => updateObjection(obj.id, 'objection_text', e.target.value)} onBlur={() => saveObjection(obj)}
                      className="w-full bg-gray-800/40 rounded-lg px-3 py-2 text-sm text-white border border-gray-700/30 focus:outline-none resize-none" rows={2} placeholder='"They say their product does X better..."' />
                  </div>
                  <div>
                    <label className="text-[10px] text-green-400 font-semibold mb-1 block">RESPONSE</label>
                    <textarea value={obj.response_text} onChange={e => updateObjection(obj.id, 'response_text', e.target.value)} onBlur={() => saveObjection(obj)}
                      className="w-full bg-gray-800/40 rounded-lg px-3 py-2 text-sm text-white border border-gray-700/30 focus:outline-none resize-none" rows={2} placeholder="Here's how to respond..." />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <select value={obj.category} onChange={e => { updateObjection(obj.id, 'category', e.target.value); saveObjection({ ...obj, category: e.target.value }); }}
                    className="bg-gray-800/60 rounded-lg px-2 py-1.5 text-xs text-white border border-gray-700/40 focus:outline-none">
                    {OBJECTION_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <button onClick={() => deleteObjection(obj.id)} className="p-1.5 text-gray-600 hover:text-red-400 rounded transition-colors self-end"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
