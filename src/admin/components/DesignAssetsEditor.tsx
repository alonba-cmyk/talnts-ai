import { useState, useRef, useMemo } from 'react';
import {
  ArrowLeft, Upload, Plus, Trash2, Edit2, Save, X, Search,
  Loader2, Image, Grid3X3, Tag, Replace, ScanSearch,
  Palette, Bot, Building2, Package, Sparkles, Eye, Wand2, Zap,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useDesignAssets, type DesignAsset, type DesignAssetCategory } from '@/hooks/useSupabase';

// ─── Eagerly import ALL local assets via Vite glob ──────────────────────────
const localAssetModules = import.meta.glob<string>(
  '@/assets/*.png',
  { eager: true, import: 'default' },
);

// ─── Category Config ────────────────────────────────────────────────────────

const CATEGORIES: { id: DesignAssetCategory; label: string; icon: any; color: string }[] = [
  { id: 'product_logo', label: 'Product Logos', icon: Package, color: '#3b82f6' },
  { id: 'agent_image', label: 'Agent Images', icon: Bot, color: '#8b5cf6' },
  { id: 'department_avatar', label: 'Department Avatars', icon: Building2, color: '#f59e0b' },
  { id: 'vibe', label: 'Vibe', icon: Zap, color: '#a855f7' },
  { id: 'sidekick', label: 'Sidekick', icon: Wand2, color: '#ec4899' },
  { id: 'icon', label: 'Icons', icon: Sparkles, color: '#10b981' },
  { id: 'background', label: 'Backgrounds', icon: Palette, color: '#06b6d4' },
  { id: 'other', label: 'Other', icon: Grid3X3, color: '#6b7280' },
];

const getCategoryConfig = (cat: DesignAssetCategory) =>
  CATEGORIES.find(c => c.id === cat) || CATEGORIES[CATEGORIES.length - 1];

// ─── Auto-detect helper: guess file type from URL ───────────────────────────

function guessFileType(url: string): string {
  if (!url) return 'png';
  const ext = url.split('.').pop()?.split('?')[0]?.toLowerCase() || '';
  if (['png', 'svg', 'jpg', 'jpeg', 'webp', 'gif'].includes(ext)) return ext;
  return 'png';
}

// ─── Known local asset mappings (filename -> name + category) ───────────────
// Maps specific filenames in src/assets/ to descriptive names and categories.

type AssetMapping = { name: string; category: DesignAssetCategory; subcategory: string; tags: string[] };

const KNOWN_LOCAL_ASSETS: Record<string, AssetMapping> = {
  // ── Product Icons (small square icons) ──
  '5d4f550f18adfa644c6653f867bc960bdc8a53dc.png': { name: 'Work Management Icon', category: 'product_logo', subcategory: 'product-icon', tags: ['product', 'work-management', 'icon'] },
  '6cf10de3ca3f528bc9d9457024ed87915acf1b6f.png': { name: 'CRM Icon', category: 'product_logo', subcategory: 'product-icon', tags: ['product', 'crm', 'icon'] },
  '41abe475f056daef6e610ed3282d554ea3b88606.png': { name: 'Campaigns Icon', category: 'product_logo', subcategory: 'product-icon', tags: ['product', 'campaigns', 'icon'] },
  '9fae7b5cd33e1ccaf1f329bad81508b9daae5210.png': { name: 'Service Icon', category: 'product_logo', subcategory: 'product-icon', tags: ['product', 'service', 'icon'] },
  'f416d94ad48b77a56df38e1f5ca7412f0e86202f.png': { name: 'Dev Icon', category: 'product_logo', subcategory: 'product-icon', tags: ['product', 'dev', 'icon'] },

  // ── Product Logos (full logos) ──
  'monday-work-management-logo.png': { name: 'monday Work Management Logo', category: 'product_logo', subcategory: 'product-logo', tags: ['product', 'work-management', 'logo'] },
  'monday-crm-logo.png': { name: 'monday CRM Logo', category: 'product_logo', subcategory: 'product-logo', tags: ['product', 'crm', 'logo'] },
  'monday-crm-logo-new.png': { name: 'monday CRM Logo (new)', category: 'product_logo', subcategory: 'product-logo', tags: ['product', 'crm', 'logo', 'new'] },
  'monday-campaigns-logo.png': { name: 'monday Campaigns Logo', category: 'product_logo', subcategory: 'product-logo', tags: ['product', 'campaigns', 'logo'] },
  'monday-campaigns-logo-new.png': { name: 'monday Campaigns Logo (new)', category: 'product_logo', subcategory: 'product-logo', tags: ['product', 'campaigns', 'logo', 'new'] },
  'work-management-logo-new.png': { name: 'Work Management Logo (new)', category: 'product_logo', subcategory: 'product-logo', tags: ['product', 'work-management', 'logo', 'new'] },

  // ── AI Product Logos ──
  '1babfe88a809998ec3c5c5d597d8051ef7639a6f.png': { name: 'Sidekick Logo', category: 'product_logo', subcategory: 'ai-product', tags: ['sidekick', 'ai', 'logo'] },
  'sidekick-icon.png': { name: 'Sidekick Icon', category: 'product_logo', subcategory: 'ai-product', tags: ['sidekick', 'ai', 'icon'] },
  '99be461a455ae49743d963276e2023ed6cd1445d.png': { name: 'Agents Logo', category: 'product_logo', subcategory: 'ai-product', tags: ['agents', 'ai', 'logo'] },
  'agents-icon.png': { name: 'Agents Icon', category: 'product_logo', subcategory: 'ai-product', tags: ['agents', 'ai', 'icon'] },
  'agents-logo-new.png': { name: 'Agents Logo (new)', category: 'product_logo', subcategory: 'ai-product', tags: ['agents', 'ai', 'logo', 'new'] },
  'agents-logo.png': { name: 'Agents Logo (alt)', category: 'product_logo', subcategory: 'ai-product', tags: ['agents', 'ai', 'logo'] },
  'monday-agents-logo.png': { name: 'monday Agents Logo', category: 'product_logo', subcategory: 'ai-product', tags: ['agents', 'monday', 'logo'] },
  '069a22575b2de9057cfc00d9b4538d072f7fe115.png': { name: 'Vibe Logo', category: 'product_logo', subcategory: 'ai-product', tags: ['vibe', 'ai', 'logo'] },
  'vibe-logo.png': { name: 'Vibe Logo (alt)', category: 'product_logo', subcategory: 'ai-product', tags: ['vibe', 'ai', 'logo'] },
  'workflows-logo.png': { name: 'Workflows Logo', category: 'product_logo', subcategory: 'ai-product', tags: ['workflows', 'logo'] },
  'workflows-icon.png': { name: 'Workflows Icon', category: 'product_logo', subcategory: 'ai-product', tags: ['workflows', 'icon'] },

  // ── Agent Images ──
  '053936dfeea2ccad575c77f11dabe02cb2e01b92.png': { name: 'Agent Image 1', category: 'agent_image', subcategory: 'agent', tags: ['agent', 'character'] },
  'f158e4bd7406bb7f1accf54fb06c7de8cfd09e48.png': { name: 'Agent Image 2', category: 'agent_image', subcategory: 'agent', tags: ['agent', 'character'] },
  '552ed6ec83999a43766184b9ddf41b03d687acdf.png': { name: 'Agent Image 3', category: 'agent_image', subcategory: 'agent', tags: ['agent', 'character'] },
  'c7005ced01914c6b1f5e7c0f86f6d5e4e22d3e9f.png': { name: 'Sales Agent / User Avatar', category: 'agent_image', subcategory: 'agent', tags: ['agent', 'sales', 'avatar'] },
  'aece03b1670d8ad77897b40393abfd865bf22236.png': { name: 'Translator Agent', category: 'agent_image', subcategory: 'agent', tags: ['agent', 'translator'] },
  '1a6545c2a20393d4de191bc3df98cac4c2b88431.png': { name: 'Sales Agent 1', category: 'agent_image', subcategory: 'agent', tags: ['agent', 'sales'] },
  '0fafb66c9d5e1f1c3aa2960e503241167702ac82.png': { name: 'Sales Agent 2', category: 'agent_image', subcategory: 'agent', tags: ['agent', 'sales'] },
  'b2c9dfcefde52ea28ed14159ca39ccf040cdfd52.png': { name: 'Sales Agent 3', category: 'agent_image', subcategory: 'agent', tags: ['agent', 'sales'] },
  'agent-pink.png': { name: 'Agent Pink', category: 'agent_image', subcategory: 'hero-agent', tags: ['agent', 'hero', 'pink'] },
  'agent-cyan.png': { name: 'Agent Cyan', category: 'agent_image', subcategory: 'hero-agent', tags: ['agent', 'hero', 'cyan'] },
  'agent-orange.png': { name: 'Agent Orange', category: 'agent_image', subcategory: 'hero-agent', tags: ['agent', 'hero', 'orange'] },
  'agents-team-closeup.png': { name: 'Agents Team Closeup', category: 'agent_image', subcategory: 'team', tags: ['agent', 'team', 'closeup'] },
  'agents-team-hero.png': { name: 'Agents Team Hero', category: 'agent_image', subcategory: 'team', tags: ['agent', 'team', 'hero'] },
  'agents-team-transparent.png': { name: 'Agents Team Transparent', category: 'agent_image', subcategory: 'team', tags: ['agent', 'team', 'transparent'] },

  // ── User Avatars ──
  'a8016eb62d3e284810c5691fa950de5343f7d776.png': { name: 'Avatar 1', category: 'department_avatar', subcategory: 'avatar', tags: ['avatar', 'user'] },
  '4f1259d102c1081ca7d88367c1ec9d3487166104.png': { name: 'Avatar 2', category: 'department_avatar', subcategory: 'avatar', tags: ['avatar', 'user'] },
  '31fef8e27a4c799459c58ae163c55324da0a21d4.png': { name: 'Avatar 3', category: 'department_avatar', subcategory: 'avatar', tags: ['avatar', 'user'] },
  '4f426f4f722bf9fd17cf67273a55600282fe421d.png': { name: 'Avatar 4', category: 'department_avatar', subcategory: 'avatar', tags: ['avatar', 'user'] },
  '840c44286a6c4e57e9df25a1565fdbb673fa3a6c.png': { name: 'Avatar 5', category: 'department_avatar', subcategory: 'avatar', tags: ['avatar', 'user'] },
  '012f240f3a87d4b9507b3306396ea0954ebb82f2.png': { name: 'Avatar 6', category: 'department_avatar', subcategory: 'avatar', tags: ['avatar', 'user'] },
  '44c98f36561338e389a6bf8368546aa8aba3c0a7.png': { name: 'Avatar 7', category: 'department_avatar', subcategory: 'avatar', tags: ['avatar', 'user'] },
  '084fc1b320f94aa65233683f6d07e27bc528df49.png': { name: 'Avatar 8', category: 'department_avatar', subcategory: 'avatar', tags: ['avatar', 'user'] },
  'user-avatar-woman.png': { name: 'User Avatar Woman', category: 'department_avatar', subcategory: 'avatar', tags: ['avatar', 'user', 'woman'] },

  // ── Product Screenshots ──
  'd2ea19ded5803c4d8a582f673f09fc5cd9f2b474.png': { name: 'Work Management Screenshot', category: 'background', subcategory: 'product-screenshot', tags: ['product', 'work-management', 'screenshot'] },
  '66a85a213022574734ff989cb9e853fb2964d9ac.png': { name: 'CRM Screenshot', category: 'background', subcategory: 'product-screenshot', tags: ['product', 'crm', 'screenshot'] },
  '81da50cc2986a7749ea063a4709cf33a1969edc1.png': { name: 'Campaigns Screenshot', category: 'background', subcategory: 'product-screenshot', tags: ['product', 'campaigns', 'screenshot'] },

  // ── Vibe (app images) ──
  '5c1e9558f0852bdc2f86cf1e2165d47ef6a97194.png': { name: 'Social Media Calendar', category: 'vibe', subcategory: 'vibe-app', tags: ['vibe', 'social-media', 'calendar'] },
  'bc17ecea9b6a3dea74c123dfa6a80072df0aa8f0.png': { name: 'Customer Segmentation', category: 'vibe', subcategory: 'vibe-app', tags: ['vibe', 'customer', 'segmentation'] },

  // ── Sidekick (action images) ──
  '62829d5af3833ae6c80aed45f9b07fbc9d652a5f.png': { name: 'Generate Campaign Briefs', category: 'sidekick', subcategory: 'sidekick-action', tags: ['sidekick', 'campaigns', 'briefs'] },
  '35ef66e9bc144f2e71317c3d0dc5174c394e599c.png': { name: 'Market Intelligence', category: 'sidekick', subcategory: 'sidekick-action', tags: ['sidekick', 'market', 'intelligence'] },
  '67127cee3efc2e2d1244b02d7c14ce90ab332540.png': { name: 'Visual Creation', category: 'sidekick', subcategory: 'sidekick-action', tags: ['sidekick', 'visual', 'creation'] },
};

// ─── Auto-detect: scan DB tables + local assets ─────────────────────────────

interface DetectedAsset {
  name: string;
  file_url: string;
  category: DesignAssetCategory;
  subcategory: string;
  tags: string[];
  file_type: string;
}

function detectLocalAssets(): DetectedAsset[] {
  const detected: DetectedAsset[] = [];
  const seenUrls = new Set<string>();

  for (const [modulePath, resolvedUrl] of Object.entries(localAssetModules)) {
    if (!resolvedUrl || seenUrls.has(resolvedUrl)) continue;
    seenUrls.add(resolvedUrl);

    // Extract filename from the module path (e.g. "/src/assets/agent-pink.png" -> "agent-pink.png")
    const filename = modulePath.split('/').pop() || '';
    const known = KNOWN_LOCAL_ASSETS[filename];

    if (known) {
      detected.push({
        name: known.name,
        file_url: resolvedUrl,
        category: known.category,
        subcategory: known.subcategory,
        tags: known.tags,
        file_type: 'png',
      });
    } else {
      // Unknown local asset — still include it with a cleaned-up name
      const cleanName = filename
        .replace(/\.png$/, '')
        .replace(/^[a-f0-9]{40}$/, (hash) => `Asset ${hash.slice(0, 8)}`)
        .replace(/[-_]/g, ' ');
      detected.push({
        name: cleanName,
        file_url: resolvedUrl,
        category: 'other',
        subcategory: 'local',
        tags: ['local', 'uncategorized'],
        file_type: 'png',
      });
    }
  }

  return detected;
}

async function detectDatabaseAssets(): Promise<DetectedAsset[]> {
  const detected: DetectedAsset[] = [];

  const add = (
    name: string, url: string | null | undefined,
    category: DesignAssetCategory, subcategory: string, tags: string[],
  ) => {
    if (url && url.trim()) {
      detected.push({
        name, file_url: url.trim(), category, subcategory,
        tags, file_type: guessFileType(url),
      });
    }
  };

  // 1. Products -> product_logo
  const { data: products } = await supabase.from('products').select('name, image, images');
  if (products) {
    for (const p of products) {
      add(p.name, p.image, 'product_logo', 'product', ['product', p.name?.toLowerCase()].filter(Boolean));
      if (Array.isArray(p.images)) {
        p.images.forEach((img: string, i: number) => {
          if (img && img !== p.image) {
            add(`${p.name} (${i + 2})`, img, 'product_logo', 'product', ['product', p.name?.toLowerCase(), 'additional'].filter(Boolean));
          }
        });
      }
    }
  }

  // 2. Agents -> agent_image
  const { data: agents } = await supabase.from('agents').select('name, image');
  if (agents) {
    for (const a of agents) {
      add(a.name, a.image, 'agent_image', 'agent', ['agent', a.name?.toLowerCase()].filter(Boolean));
    }
  }

  // 3. Departments -> department_avatar
  const { data: departments } = await supabase.from('departments').select('name, avatar_image');
  if (departments) {
    for (const d of departments) {
      add(d.name, d.avatar_image, 'department_avatar', 'department', ['department', d.name?.toLowerCase()].filter(Boolean));
    }
  }

  // 4. Vibe Apps -> vibe
  const { data: vibeApps } = await supabase.from('vibe_apps').select('name, image');
  if (vibeApps) {
    for (const v of vibeApps) {
      add(v.name, v.image, 'vibe', 'vibe-app', ['vibe', 'app', v.name?.toLowerCase()].filter(Boolean));
    }
  }

  // 5. Sidekick Actions -> sidekick
  const { data: sidekickActions } = await supabase.from('sidekick_actions').select('name, image');
  if (sidekickActions) {
    for (const s of sidekickActions) {
      add(s.name, s.image, 'sidekick', 'sidekick-action', ['sidekick', s.name?.toLowerCase()].filter(Boolean));
    }
  }

  // 6. Outcomes -> icon
  const { data: outcomes } = await supabase.from('outcomes').select('name, avatar_image');
  if (outcomes) {
    for (const o of outcomes) {
      add(o.name, o.avatar_image, 'icon', 'outcome', ['outcome', o.name?.toLowerCase()].filter(Boolean));
    }
  }

  // 7. Pain Points -> icon
  const { data: painPoints } = await supabase.from('pain_points').select('name, avatar_image');
  if (painPoints) {
    for (const pp of painPoints) {
      add(pp.name, pp.avatar_image, 'icon', 'pain-point', ['pain-point', pp.name?.toLowerCase()].filter(Boolean));
    }
  }

  // 8. AI Transformations -> icon
  const { data: aiTransformations } = await supabase.from('ai_transformations').select('name, avatar_image');
  if (aiTransformations) {
    for (const at of aiTransformations) {
      add(at.name, at.avatar_image, 'icon', 'ai-transformation', ['ai', 'transformation', at.name?.toLowerCase()].filter(Boolean));
    }
  }

  return detected;
}

async function detectExistingAssets(): Promise<DetectedAsset[]> {
  // Combine local assets + DB assets, deduplicate by URL
  const local = detectLocalAssets();
  const db = await detectDatabaseAssets();

  const seenUrls = new Set<string>();
  const all: DetectedAsset[] = [];

  // Local assets first (they have proper categorization)
  for (const a of local) {
    if (!seenUrls.has(a.file_url)) {
      seenUrls.add(a.file_url);
      all.push(a);
    }
  }
  // Then DB assets
  for (const a of db) {
    if (!seenUrls.has(a.file_url)) {
      seenUrls.add(a.file_url);
      all.push(a);
    }
  }

  return all;
}

// ─── Asset Card ─────────────────────────────────────────────────────────────

function AssetCard({
  asset,
  onEdit,
  onDelete,
  onReplace,
}: {
  asset: DesignAsset;
  onEdit: () => void;
  onDelete: () => void;
  onReplace: () => void;
}) {
  const [imgError, setImgError] = useState(false);
  const cat = getCategoryConfig(asset.category);

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden group hover:border-gray-700 transition-colors">
      {/* Preview */}
      <div className="relative aspect-square bg-gray-800 flex items-center justify-center overflow-hidden">
        {asset.file_url && !imgError ? (
          <img
            src={asset.file_url}
            alt={asset.name}
            className="max-w-full max-h-full object-contain p-3"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-600">
            <Image className="w-10 h-10" />
            <span className="text-xs">No preview</span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          {asset.file_url && (
            <a href={asset.file_url} target="_blank" rel="noopener noreferrer"
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors" title="View full size">
              <Eye className="w-4 h-4 text-white" />
            </a>
          )}
          <button onClick={onReplace} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors" title="Replace file">
            <Replace className="w-4 h-4 text-white" />
          </button>
          <button onClick={onEdit} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors" title="Edit details">
            <Edit2 className="w-4 h-4 text-white" />
          </button>
          <button onClick={onDelete} className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors" title="Delete">
            <Trash2 className="w-4 h-4 text-red-400" />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-white text-sm font-medium truncate" title={asset.name}>{asset.name}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs px-1.5 py-0.5 rounded flex items-center gap-1" style={{ background: `${cat.color}15`, color: cat.color, border: `1px solid ${cat.color}30` }}>
            <cat.icon className="w-3 h-3" /> {cat.label}
          </span>
          <span className="text-xs text-gray-600 uppercase">{asset.file_type}</span>
        </div>
        {asset.tags.length > 0 && (
          <div className="flex gap-1 mt-2 flex-wrap">
            {asset.tags.slice(0, 3).map(t => (
              <span key={t} className="text-xs px-1.5 py-0.5 rounded bg-gray-800 text-gray-500">{t}</span>
            ))}
            {asset.tags.length > 3 && (
              <span className="text-xs text-gray-600">+{asset.tags.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Asset Form ─────────────────────────────────────────────────────────────

function AssetForm({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial: Partial<DesignAsset>;
  onSave: (a: Partial<DesignAsset>) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<Partial<DesignAsset>>({
    name: '', description: '', category: 'other', subcategory: '',
    file_url: '', tags: [], file_type: 'png', ...initial,
  });
  const [tagInput, setTagInput] = useState('');

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !(form.tags || []).includes(tag)) {
      setForm({ ...form, tags: [...(form.tags || []), tag] });
    }
    setTagInput('');
  };

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-400 text-sm mb-1">Name *</label>
          <input type="text" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-indigo-500 outline-none" />
        </div>
        <div>
          <label className="block text-gray-400 text-sm mb-1">Category</label>
          <select value={form.category || 'other'} onChange={e => setForm({ ...form, category: e.target.value as DesignAssetCategory })}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-indigo-500 outline-none">
            {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-gray-400 text-sm mb-1">Subcategory</label>
          <input type="text" value={form.subcategory || ''} onChange={e => setForm({ ...form, subcategory: e.target.value })}
            placeholder="e.g. sales, marketing"
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-indigo-500 outline-none" />
        </div>
        <div>
          <label className="block text-gray-400 text-sm mb-1">File Type</label>
          <select value={form.file_type || 'png'} onChange={e => setForm({ ...form, file_type: e.target.value })}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-indigo-500 outline-none">
            {['png', 'svg', 'jpg', 'jpeg', 'webp', 'gif'].map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
          </select>
        </div>
        <div className="col-span-2">
          <label className="block text-gray-400 text-sm mb-1">File URL</label>
          <input type="text" value={form.file_url || ''} onChange={e => setForm({ ...form, file_url: e.target.value })}
            placeholder="https://..."
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-indigo-500 outline-none" />
        </div>
        <div className="col-span-2">
          <label className="block text-gray-400 text-sm mb-1">Description</label>
          <input type="text" value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-indigo-500 outline-none" />
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-gray-400 text-sm mb-1">Tags</label>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {(form.tags || []).map(t => (
            <span key={t} className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-gray-800 text-gray-300">
              {t}
              <button onClick={() => setForm({ ...form, tags: (form.tags || []).filter(x => x !== t) })} className="text-gray-500 hover:text-red-400">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input type="text" value={tagInput} onChange={e => setTagInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
            placeholder="Add tag..."
            className="flex-1 px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:border-indigo-500 outline-none" />
          <button onClick={addTag} className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 text-sm"><Plus className="w-3.5 h-3.5" /></button>
        </div>
      </div>

      {/* Preview */}
      {form.file_url && (
        <div className="p-4 bg-gray-800 rounded-lg flex items-center justify-center" style={{ minHeight: 120 }}>
          <img src={form.file_url} alt="Preview" className="max-h-32 max-w-full object-contain"
            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        </div>
      )}

      <div className="flex items-center justify-end gap-3 pt-2">
        <button onClick={onCancel} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Cancel</button>
        <button onClick={() => onSave(form)} disabled={saving || !form.name?.trim()}
          className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-lg text-white font-medium transition-colors">
          <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
}

// ─── Main Editor ────────────────────────────────────────────────────────────

interface DesignAssetsEditorProps {
  onBack: () => void;
}

export function DesignAssetsEditor({ onBack }: DesignAssetsEditorProps) {
  const [activeCategory, setActiveCategory] = useState<DesignAssetCategory | 'all'>('all');
  const [editingAsset, setEditingAsset] = useState<Partial<DesignAsset> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [seeding, setSeeding] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceRef = useRef<{ id: string; callback: (url: string) => void } | null>(null);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);

  const { assets, loading, addAsset, updateAsset, deleteAsset, bulkAddAssets, refetch } = useDesignAssets(
    activeCategory === 'all' ? undefined : activeCategory
  );

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  // Filtered assets
  const filteredAssets = useMemo(() => {
    if (!searchQuery) return assets;
    const q = searchQuery.toLowerCase();
    return assets.filter(a =>
      a.name.toLowerCase().includes(q)
      || a.tags.some(t => t.includes(q))
      || a.subcategory.toLowerCase().includes(q)
    );
  }, [assets, searchQuery]);

  // Grouped by category for "All" view
  const groupedAssets = useMemo(() => {
    if (activeCategory !== 'all') return null;
    const groups: Record<string, DesignAsset[]> = {};
    filteredAssets.forEach(a => {
      if (!groups[a.category]) groups[a.category] = [];
      groups[a.category].push(a);
    });
    return groups;
  }, [filteredAssets, activeCategory]);

  // ── Upload file ──
  const handleUpload = async (file: File, category: DesignAssetCategory = 'other') => {
    const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
    const fileName = `assets/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

    try {
      const { error: uploadError } = await supabase.storage.from('Vibe').upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('Vibe').getPublicUrl(fileName);
      return data.publicUrl;
    } catch (err: any) {
      showMessage('error', `Upload failed: ${err.message}`);
      return null;
    }
  };

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const cat: DesignAssetCategory = activeCategory === 'all' ? 'other' : activeCategory;

    for (const file of Array.from(files)) {
      const url = await handleUpload(file, cat);
      if (url) {
        const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
        const name = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
        await addAsset({
          name,
          file_url: url,
          file_type: ext,
          category: cat,
          tags: [],
        });
      }
    }
    showMessage('success', `Uploaded ${files.length} file(s)`);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleReplaceFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !replaceRef.current) return;

    const url = await handleUpload(file);
    if (url) {
      await updateAsset(replaceRef.current.id, { file_url: url });
      showMessage('success', 'File replaced');
    }
    replaceRef.current = null;
    if (replaceFileInputRef.current) replaceFileInputRef.current.value = '';
  };

  // ── Auto-detect assets from existing DB tables ──
  const handleAutoDetect = async () => {
    setSeeding(true);
    try {
      const detected = await detectExistingAssets();

      if (detected.length === 0) {
        showMessage('success', 'No assets found in existing tables');
        setSeeding(false);
        return;
      }

      // Skip assets whose file_url already exists in design_assets
      const existingUrls = new Set(assets.map(a => a.file_url));
      const toImport = detected.filter(d => !existingUrls.has(d.file_url));

      if (toImport.length === 0) {
        showMessage('success', `All ${detected.length} detected assets are already imported`);
        setSeeding(false);
        return;
      }

      await bulkAddAssets(toImport);
      showMessage('success', `Imported ${toImport.length} assets (${detected.length} detected, ${detected.length - toImport.length} already existed)`);
    } catch (err: any) {
      showMessage('error', `Auto-detect failed: ${err.message}`);
    } finally {
      setSeeding(false);
    }
  };

  // ── Save asset ──
  const handleSaveAsset = async (a: Partial<DesignAsset>) => {
    setSaving(true);
    try {
      if (isNew) {
        await addAsset(a);
        showMessage('success', `Added "${a.name}"`);
      } else if (editingAsset?.id) {
        await updateAsset(editingAsset.id, a);
        showMessage('success', `Updated "${a.name}"`);
      }
      setEditingAsset(null);
      setIsNew(false);
    } catch (err: any) {
      showMessage('error', err.message);
    } finally {
      setSaving(false);
    }
  };

  // ── Edit mode ──
  if (editingAsset) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => { setEditingAsset(null); setIsNew(false); }} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </button>
          <h2 className="text-xl font-bold text-white">{isNew ? 'Add Asset' : `Edit: ${editingAsset.name}`}</h2>
        </div>
        <AssetForm initial={editingAsset} onSave={handleSaveAsset} onCancel={() => { setEditingAsset(null); setIsNew(false); }} saving={saving} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hidden file inputs */}
      <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleBulkUpload} className="hidden" />
      <input ref={replaceFileInputRef} type="file" accept="image/*" onChange={handleReplaceFile} className="hidden" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-white">Design Assets</h2>
            <p className="text-gray-400 text-sm">{assets.length} assets</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {message && (
            <span className={`text-sm mr-2 ${message.type === 'error' ? 'text-red-400' : 'text-green-400'}`}>{message.text}</span>
          )}
          <button onClick={handleAutoDetect} disabled={seeding}
            className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-gray-300 text-sm transition-colors disabled:opacity-50"
            title="Scan products, agents, departments and more for existing images">
            {seeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <ScanSearch className="w-4 h-4" />}
            {seeding ? 'Scanning...' : 'Auto-detect Assets'}
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        <button onClick={() => setActiveCategory('all')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeCategory === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white border border-gray-800'
          }`}>
          <Grid3X3 className="w-4 h-4" /> All
        </button>
        {CATEGORIES.map(cat => (
          <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeCategory === cat.id
                ? 'text-white' : 'bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white border border-gray-800'
            }`}
            style={activeCategory === cat.id ? { background: `${cat.color}25`, border: `1px solid ${cat.color}40`, color: cat.color } : undefined}>
            <cat.icon className="w-4 h-4" /> {cat.label}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name or tag..."
            className="w-full pl-9 pr-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white text-sm focus:border-indigo-500 outline-none" />
        </div>
        <div className="flex gap-2">
          <button onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-gray-300 font-medium text-sm transition-colors">
            <Upload className="w-4 h-4" /> Upload Files
          </button>
          <button onClick={() => { setEditingAsset({ category: activeCategory === 'all' ? 'other' : activeCategory }); setIsNew(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white font-medium text-sm transition-colors">
            <Plus className="w-4 h-4" /> Add Asset
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
        </div>
      ) : filteredAssets.length === 0 ? (
        <div className="text-center py-20 bg-gray-900 rounded-xl border border-gray-800">
          <Image className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">{assets.length === 0 ? 'No assets yet' : 'No matching assets'}</p>
          <p className="text-gray-500 text-sm mt-1">
            {assets.length === 0
              ? 'Auto-detect existing images from your products, agents, and departments'
              : 'Try a different search or category'}
          </p>
          {assets.length === 0 && (
            <div className="flex items-center justify-center gap-3 mt-6">
              <button onClick={handleAutoDetect} disabled={seeding}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white font-medium transition-colors disabled:opacity-50">
                {seeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <ScanSearch className="w-4 h-4" />}
                {seeding ? 'Scanning...' : 'Auto-detect Assets'}
              </button>
              <button onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-gray-300 font-medium transition-colors">
                <Upload className="w-4 h-4" /> Upload Files
              </button>
            </div>
          )}
        </div>
      ) : activeCategory === 'all' && groupedAssets ? (
        // Grouped view
        <div className="space-y-8">
          {CATEGORIES.map(cat => {
            const group = groupedAssets[cat.id];
            if (!group || group.length === 0) return null;
            return (
              <div key={cat.id}>
                <div className="flex items-center gap-2 mb-3">
                  <cat.icon className="w-4 h-4" style={{ color: cat.color }} />
                  <h3 className="text-white font-semibold">{cat.label}</h3>
                  <span className="text-xs text-gray-500">({group.length})</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {group.map(asset => (
                    <AssetCard
                      key={asset.id}
                      asset={asset}
                      onEdit={() => { setEditingAsset(asset); setIsNew(false); }}
                      onDelete={async () => { await deleteAsset(asset.id); showMessage('success', `Deleted "${asset.name}"`); }}
                      onReplace={() => {
                        replaceRef.current = { id: asset.id, callback: () => {} };
                        replaceFileInputRef.current?.click();
                      }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // Flat grid view
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredAssets.map(asset => (
            <AssetCard
              key={asset.id}
              asset={asset}
              onEdit={() => { setEditingAsset(asset); setIsNew(false); }}
              onDelete={async () => { await deleteAsset(asset.id); showMessage('success', `Deleted "${asset.name}"`); }}
              onReplace={() => {
                replaceRef.current = { id: asset.id, callback: () => {} };
                replaceFileInputRef.current?.click();
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
