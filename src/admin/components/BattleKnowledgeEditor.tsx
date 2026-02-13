import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Upload, Globe, FileText, Clock, AlertCircle, CheckCircle, Loader2, FolderOpen, Search, ExternalLink } from 'lucide-react';

interface KnowledgeSource {
  id: string;
  title: string;
  file_url: string;
  source_url: string;
  file_type: string;
  competitor_id: string | null;
  product_id: string | null;
  extracted_data: any;
  status: string;
  error_message: string;
  scanned_at: string | null;
  created_at: string;
  updated_at: string;
}

interface Competitor {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
}

const STATUS_STYLES: Record<string, { color: string; icon: any; label: string }> = {
  pending: { color: '#f59e0b', icon: Clock, label: 'Pending' },
  processing: { color: '#3b82f6', icon: Loader2, label: 'Processing' },
  processed: { color: '#10b981', icon: CheckCircle, label: 'Processed' },
  error: { color: '#ef4444', icon: AlertCircle, label: 'Error' },
};

const FILE_TYPE_ICONS: Record<string, string> = {
  pdf: '📄',
  pptx: '📊',
  docx: '📝',
  url: '🌐',
  other: '📎',
};

interface BattleKnowledgeEditorProps {
  onBack: () => void;
}

export function BattleKnowledgeEditor({ onBack }: BattleKnowledgeEditorProps) {
  const [sources, setSources] = useState<KnowledgeSource[]>([]);
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [scanUrl, setScanUrl] = useState('');
  const [scanning, setScanning] = useState(false);
  const [selectedSource, setSelectedSource] = useState<KnowledgeSource | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [srcRes, compRes, prodRes] = await Promise.all([
      supabase.from('battle_knowledge_sources').select('*').order('created_at', { ascending: false }),
      supabase.from('competitors').select('id, name').order('name'),
      supabase.from('products').select('id, name').order('order_index'),
    ]);
    if (srcRes.data) setSources(srcRes.data);
    if (compRes.data) {
      const seen = new Map<string, Competitor>();
      for (const c of compRes.data) { const k = c.name.toLowerCase().trim(); if (!seen.has(k)) seen.set(k, c); }
      setCompetitors(Array.from(seen.values()));
    }
    if (prodRes.data) {
      const seen = new Map<string, Product>();
      for (const p of prodRes.data) { const k = p.name.toLowerCase().trim(); if (!seen.has(k)) seen.set(k, p); }
      setProducts(Array.from(seen.values()));
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const fileType = ['pdf', 'pptx', 'docx'].includes(ext) ? ext : 'other';

    // Upload to Supabase storage
    const filePath = `battle-knowledge/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('knowledge-assets')
      .upload(filePath, file);

    let fileUrl = '';
    if (!uploadError) {
      const { data: urlData } = supabase.storage.from('knowledge-assets').getPublicUrl(filePath);
      fileUrl = urlData.publicUrl;
    }

    const { data } = await supabase.from('battle_knowledge_sources').insert({
      title: file.name,
      file_url: fileUrl || filePath,
      file_type: fileType,
      status: 'pending',
    }).select().single();

    if (data) setSources(prev => [data, ...prev]);
    e.target.value = '';
  };

  const handleScanUrl = async () => {
    if (!scanUrl.trim()) return;
    setScanning(true);

    const { data } = await supabase.from('battle_knowledge_sources').insert({
      title: `Scan: ${scanUrl}`,
      source_url: scanUrl,
      file_type: 'url',
      status: 'pending',
    }).select().single();

    if (data) {
      setSources(prev => [data, ...prev]);

      // Try to fetch and extract basic info
      try {
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(scanUrl)}`;
        const response = await fetch(proxyUrl);
        const result = await response.json();

        if (result.contents) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(result.contents, 'text/html');
          const title = doc.querySelector('title')?.textContent || scanUrl;
          const description = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
          const headings = Array.from(doc.querySelectorAll('h1, h2, h3')).slice(0, 10).map(h => h.textContent?.trim());

          await supabase.from('battle_knowledge_sources').update({
            title: title.slice(0, 200),
            extracted_data: { description, headings, raw_length: result.contents.length },
            status: 'processed',
            scanned_at: new Date().toISOString(),
          }).eq('id', data.id);

          setSources(prev => prev.map(s => s.id === data.id ? {
            ...s,
            title: title.slice(0, 200),
            extracted_data: { description, headings },
            status: 'processed',
            scanned_at: new Date().toISOString(),
          } : s));
        }
      } catch (err) {
        await supabase.from('battle_knowledge_sources').update({
          status: 'error',
          error_message: 'Failed to scan URL',
        }).eq('id', data.id);
        setSources(prev => prev.map(s => s.id === data.id ? { ...s, status: 'error', error_message: 'Failed to scan' } : s));
      }
    }

    setScanUrl('');
    setScanning(false);
  };

  const updateSource = async (id: string, field: string, value: any) => {
    await supabase.from('battle_knowledge_sources').update({ [field]: value }).eq('id', id);
    setSources(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const deleteSource = async (id: string) => {
    if (!confirm('Delete this knowledge source?')) return;
    await supabase.from('battle_knowledge_sources').delete().eq('id', id);
    setSources(prev => prev.filter(s => s.id !== id));
    if (selectedSource?.id === id) setSelectedSource(null);
  };

  const filtered = sources.filter(s => {
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'all' || s.file_type === filterType;
    return matchSearch && matchType;
  });

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Loading knowledge sources...</div>;

  return (
    <div className="space-y-6">
      {/* Upload & Scan Section */}
      <div className="grid grid-cols-2 gap-4">
        {/* File Upload */}
        <div className="bg-gray-900/50 rounded-2xl border border-gray-800/40 border-dashed p-6">
          <div className="text-center">
            <Upload className="w-8 h-8 text-yellow-400/50 mx-auto mb-3" />
            <p className="text-white font-medium mb-1">Upload Documents</p>
            <p className="text-gray-600 text-sm mb-4">Battle cards, pitch decks, competitive analysis</p>
            <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-400 rounded-xl text-sm font-medium transition-colors cursor-pointer">
              <Upload className="w-4 h-4" /> Choose File
              <input type="file" accept=".pdf,.pptx,.docx" className="hidden" onChange={handleFileUpload} />
            </label>
            <p className="text-gray-700 text-xs mt-2">PDF, PPTX, DOCX supported</p>
          </div>
        </div>

        {/* URL Scanner */}
        <div className="bg-gray-900/50 rounded-2xl border border-gray-800/40 p-6">
          <div className="text-center">
            <Globe className="w-8 h-8 text-blue-400/50 mx-auto mb-3" />
            <p className="text-white font-medium mb-1">Scan Website</p>
            <p className="text-gray-600 text-sm mb-4">Competitor pages, review sites, feature comparisons</p>
            <div className="flex gap-2">
              <input value={scanUrl} onChange={e => setScanUrl(e.target.value)}
                placeholder="https://competitor.com/pricing"
                className="flex-1 bg-gray-800/60 rounded-lg px-3 py-2.5 text-sm text-white border border-gray-700/40 focus:outline-none"
                onKeyDown={e => e.key === 'Enter' && handleScanUrl()} />
              <button onClick={handleScanUrl} disabled={scanning || !scanUrl.trim()}
                className="px-4 py-2.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
                {scanning ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Scan'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search sources..."
            className="w-full bg-gray-800/60 rounded-lg pl-9 pr-3 py-2 text-sm text-white border border-gray-700/40 focus:outline-none" />
        </div>
        <div className="flex gap-1">
          {['all', 'pdf', 'pptx', 'docx', 'url'].map(type => (
            <button key={type} onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filterType === type ? 'bg-white/10 text-white' : 'text-gray-600 hover:text-gray-400'
              }`}>
              {type === 'all' ? 'All' : FILE_TYPE_ICONS[type]} {type !== 'all' ? type.toUpperCase() : ''}
            </button>
          ))}
        </div>
        <span className="text-gray-600 text-sm">{filtered.length} source{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Sources List */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-600">
            <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="text-lg font-medium">No knowledge sources yet</p>
            <p className="text-sm mt-1">Upload documents or scan competitor websites to build your knowledge base</p>
          </div>
        )}
        {filtered.map(source => {
          const status = STATUS_STYLES[source.status] || STATUS_STYLES.pending;
          const StatusIcon = status.icon;
          const competitor = competitors.find(c => c.id === source.competitor_id);
          const product = products.find(p => p.id === source.product_id);

          return (
            <div key={source.id} className="bg-gray-900/50 rounded-xl border border-gray-800/40 p-4 flex items-start gap-4 hover:border-gray-700/60 transition-colors">
              {/* Type Icon */}
              <div className="w-10 h-10 rounded-lg bg-gray-800/60 flex items-center justify-center text-xl flex-shrink-0">
                {FILE_TYPE_ICONS[source.file_type] || '📎'}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-white text-sm font-medium truncate">{source.title}</p>
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ backgroundColor: `${status.color}15`, color: status.color }}>
                    <StatusIcon className={`w-3 h-3 ${source.status === 'processing' ? 'animate-spin' : ''}`} />
                    {status.label}
                  </div>
                </div>

                {source.source_url && (
                  <a href={source.source_url} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-gray-600 hover:text-gray-400 flex items-center gap-1 mb-1">
                    <ExternalLink className="w-3 h-3" /> {source.source_url}
                  </a>
                )}

                <div className="flex items-center gap-3 mt-2">
                  <select value={source.competitor_id || ''} onChange={e => updateSource(source.id, 'competitor_id', e.target.value || null)}
                    className="bg-gray-800/40 rounded px-2 py-1 text-xs text-gray-400 border border-gray-700/30 focus:outline-none">
                    <option value="">No competitor</option>
                    {competitors.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <select value={source.product_id || ''} onChange={e => updateSource(source.id, 'product_id', e.target.value || null)}
                    className="bg-gray-800/40 rounded px-2 py-1 text-xs text-gray-400 border border-gray-700/30 focus:outline-none">
                    <option value="">No product</option>
                    {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                  <span className="text-xs text-gray-700">
                    {new Date(source.created_at).toLocaleDateString()}
                  </span>
                </div>

                {source.error_message && (
                  <p className="text-xs text-red-400 mt-1">{source.error_message}</p>
                )}
              </div>

              <button onClick={() => deleteSource(source.id)}
                className="p-2 text-gray-700 hover:text-red-400 rounded-lg transition-colors flex-shrink-0">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
