import { useState, useEffect, useCallback, useRef } from 'react';
import { Save, CheckCircle, ArrowLeft, LayoutGrid, Layers, Moon, Sparkles, ChevronUp, ChevronDown, Palette, Zap, Eye, EyeOff, Film, MessageSquare, Columns, GitBranch, Square, Minus, PanelRight, PanelLeftClose, AlignVerticalSpaceAround, ListCollapse, Rows3, ScrollText, Grid3x3, XCircle, Link, RotateCcw, ImageIcon, Maximize2, GripVertical, Monitor, Blocks, Shield, Award, Clapperboard } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useDesignAssets, useImageUpload } from '@/hooks/useSupabase';
import { DEPARTMENTS } from '@/app/components/workManagement/wmDepartmentData';
import { HORIZONTAL_AGENTS, CATEGORY_META } from '@/app/components/workManagement/horizontalAgentsData';
import { VIBE_COLLAGE_ITEMS } from '@/app/components/workManagement/WorkManagementVibeSection';
import { JTBD_BG_MAP } from '@/app/components/workManagement/jtbdBgMap';
import { SQUAD_DEPARTMENTS } from '@/app/components/workManagement/squadData';
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

/* ─── WM Section Metadata ────────────────────────────────────────────────── */

interface WmSectionMeta {
  id: string;
  name: string;
  description: string;
  category: string;
  categoryColor: string;
}

const WM_SECTIONS: WmSectionMeta[] = [
  { id: 'first_fold', name: 'First Fold', description: 'Hero copy, department selector, and squad avatars', category: 'Hero', categoryColor: '#6161FF' },
  { id: 'demo', name: 'Demo', description: 'Board card with department sidebar, squad panel, and task board', category: 'Hero', categoryColor: '#6161FF' },
  { id: 'platform_layers', name: 'Platform Layers', description: 'Three powerful layers: Execution, Work Surface, Data', category: 'Platform / Solution', categoryColor: '#10b981' },
  { id: 'solutions', name: 'Solutions', description: 'Horizontal scroll of solution cards by department', category: 'Platform / Solution', categoryColor: '#10b981' },
  { id: 'use_cases', name: 'Use Cases Showcase', description: 'Key use cases with value messaging, multiple layout variants', category: 'Platform / Solution', categoryColor: '#10b981' },
  { id: 'agent_catalog', name: 'Agent Catalog', description: 'Cross-functional AI agents organized by action category', category: 'Platform / Solution', categoryColor: '#22d3ee' },
  { id: 'vibe', name: 'Vibe', description: 'Interactive prompt-to-app showcase for monday Vibe', category: 'Platform / Solution', categoryColor: '#00D2D2' },
  { id: 'enterprise', name: 'Enterprise', description: 'Security, Gartner recognition, and Forrester ROI', category: 'Trust / Social Proof', categoryColor: '#f59e0b' },
  { id: 'what_sets_us_apart', name: 'What Sets Us Apart', description: 'Four differentiator cards', category: 'Platform / Solution', categoryColor: '#10b981' },
  { id: 'cta', name: 'CTA', description: 'Call to action with Sidekick branding', category: 'CTA', categoryColor: '#a855f7' },
];

const WM_DEFAULT_ORDER = WM_SECTIONS.map(s => s.id);

/* ─── Sortable Section Card ──────────────────────────────────────────────── */

function SortableWmSectionCard({
  section,
  index,
  isVisible,
  onToggleVisible,
  isExpanded,
  onToggleExpand,
  children,
}: {
  section: WmSectionMeta;
  index: number;
  isVisible: boolean;
  onToggleVisible: () => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  children?: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  const hasSettings = !!children;

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

        {/* Name + Category */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-white font-medium text-sm">
              {section.name}
            </span>
            <span
              className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
              style={{ backgroundColor: `${section.categoryColor}20`, color: section.categoryColor }}
            >
              {section.category}
            </span>
          </div>
          <p className="text-gray-500 text-xs truncate">
            {section.description}
          </p>
        </div>

        {/* Visibility Toggle */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {isVisible ? (
            <Eye className="w-4 h-4 text-emerald-400" />
          ) : (
            <EyeOff className="w-4 h-4 text-gray-600" />
          )}
          <button
            onClick={onToggleVisible}
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

        {/* Expand/Collapse chevron — only shown when section has settings */}
        {hasSettings && (
          <button
            onClick={onToggleExpand}
            className={`p-1.5 rounded-lg transition-all flex-shrink-0 ${
              isExpanded
                ? 'bg-indigo-600/20 text-indigo-400'
                : 'text-gray-600 hover:bg-gray-700 hover:text-gray-400'
            }`}
            title={isExpanded ? 'Collapse settings' : 'Expand settings'}
          >
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>

      {/* Expandable settings panel */}
      {isExpanded && hasSettings && (
        <div className="px-4 pb-5 border-t border-gray-700/40">
          <div className="pt-5 space-y-6">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Existing Types ─────────────────────────────────────────────────────── */

type WmLayersVariant = 'grid' | 'masonry_expand';
type WmBentoStyle = 'dark_gradient' | 'glass_blur';
type WmFirstFoldVariant = 'default' | 'live_delegation' | 'cinematic_assembly' | 'split_reveal' | 'roster_board';
type WmRosterLayout = 'mirrored' | 'vertical';
type WmBoardStyle = 'default' | 'kanban' | 'workflow' | 'focused' | 'minimal';
type WmCardLayout = 'default' | 'board_only' | 'compact_squad' | 'squad_header';
type WmUseCasesVariant = 'tabbed_cards' | 'tabbed_cards_c' | 'tabbed_cards_d' | 'tabbed_cards_e' | 'accordion' | 'marquee' | 'matrix' | 'none';

interface CardLayoutOption {
  value: WmCardLayout;
  label: string;
  description: string;
  icon: React.ReactNode;
  accent: string;
}

const CARD_LAYOUT_OPTIONS: CardLayoutOption[] = [
  {
    value: 'default',
    label: 'Classic 3-Column',
    description: 'Dept sidebar · Squad panel (team lead + agents) · Board — full product detail, all context visible',
    icon: <LayoutGrid className="w-5 h-5" />,
    accent: '#6161ff',
  },
  {
    value: 'board_only',
    label: 'Board Only',
    description: 'Squad panel hidden — board takes the full width. Maximum focus on the work surface',
    icon: <PanelRight className="w-5 h-5" />,
    accent: '#10b981',
  },
  {
    value: 'compact_squad',
    label: 'Compact Squad',
    description: 'Squad panel narrows to 160px showing only avatars and names. Board gets ~70% of the space',
    icon: <PanelLeftClose className="w-5 h-5" />,
    accent: '#f59e0b',
  },
  {
    value: 'squad_header',
    label: 'Squad as Header',
    description: 'Squad members shown inline as a horizontal row above the board — board takes full height below',
    icon: <AlignVerticalSpaceAround className="w-5 h-5" />,
    accent: '#00d2d2',
  },
];

interface BoardStyleOption {
  value: WmBoardStyle;
  label: string;
  description: string;
  icon: React.ReactNode;
  accent: string;
  badge?: string;
}

const BOARD_STYLE_OPTIONS: BoardStyleOption[] = [
  {
    value: 'default',
    label: 'Full Table',
    description: 'Classic board table with Task, Owner, Agent, Status, and Progress columns — full product fidelity',
    icon: <LayoutGrid className="w-5 h-5" />,
    accent: '#6161ff',
  },
  {
    value: 'kanban',
    label: 'Kanban Cards',
    description: 'Tasks as draggable-looking cards in To Do / Working / Done columns — visual and instantly familiar',
    icon: <Columns className="w-5 h-5" />,
    accent: '#00d2d2',
    badge: 'New',
  },
  {
    value: 'workflow',
    label: 'Live Workflow',
    description: 'A single task flows left-to-right through stages: Assign → Agent picks up → Working → Done — tells a story',
    icon: <GitBranch className="w-5 h-5" />,
    accent: '#f59e0b',
    badge: 'New',
  },
  {
    value: 'focused',
    label: 'Focused Card',
    description: 'One large task card at a time — shows who (human + agent) is working on it, what each did, and progress',
    icon: <Square className="w-5 h-5" />,
    accent: '#a855f7',
    badge: 'New',
  },
  {
    value: 'minimal',
    label: 'Minimal List',
    description: 'Clean 2-column list (Task + Pair) with larger text and avatars — no headers, no clutter',
    icon: <Minus className="w-5 h-5" />,
    accent: '#10b981',
    badge: 'New',
  },
];

interface FirstFoldVariantOption {
  value: WmFirstFoldVariant;
  label: string;
  description: string;
  icon: React.ReactNode;
  accent: string;
  badge?: string;
}

const FIRST_FOLD_VARIANT_OPTIONS: FirstFoldVariantOption[] = [
  {
    value: 'default',
    label: 'Default',
    description: 'Department selector + overlapping squad avatar strip with live task board below',
    icon: <LayoutGrid className="w-5 h-5" />,
    accent: '#6161ff',
  },
  {
    value: 'live_delegation',
    label: 'Live Delegation',
    description: 'A task card visibly flies from a human avatar to an agent — loops with different tasks. Clearest product value prop.',
    icon: <Zap className="w-5 h-5" />,
    accent: '#f59e0b',
    badge: 'Wow',
  },
  {
    value: 'cinematic_assembly',
    label: 'Cinematic Assembly',
    description: 'Squad members enter one by one: humans slide in softly, agents materialize with a glow burst and expanding ring.',
    icon: <Film className="w-5 h-5" />,
    accent: '#00d2d2',
    badge: 'Wow',
  },
  {
    value: 'split_reveal',
    label: 'Split Reveal',
    description: 'Agents start grayscale, then each one gets a color-splash reveal — before/after sensation that makes the value prop land.',
    icon: <Eye className="w-5 h-5" />,
    accent: '#a855f7',
    badge: 'Wow',
  },
  {
    value: 'roster_board',
    label: 'Roster Board',
    description: 'Squad displayed inside a polished dark product-UI card with labeled avatar rows, lead image highlight, and color accents — admin panel aesthetic.',
    icon: <Palette className="w-5 h-5" />,
    accent: '#00d2d2',
    badge: 'New',
  },
];

interface VariantOption {
  value: WmLayersVariant;
  label: string;
  description: string;
  icon: React.ReactNode;
  accent: string;
}

interface BentoStyleOption {
  value: WmBentoStyle;
  label: string;
  description: string;
  icon: React.ReactNode;
  accent: string;
}

const BENTO_STYLE_OPTIONS: BentoStyleOption[] = [
  {
    value: 'dark_gradient',
    label: 'Dark Gradient',
    description: 'Deep dark background with glowing accent orbs and luminous elements',
    icon: <Moon className="w-5 h-5" />,
    accent: '#8b5cf6',
  },
  {
    value: 'glass_blur',
    label: 'Glass Morphism',
    description: 'Semi-transparent frosted glass with backdrop blur and floating gradient orbs',
    icon: <Sparkles className="w-5 h-5" />,
    accent: '#00d2d2',
  },
];

const VARIANT_OPTIONS: VariantOption[] = [
  {
    value: 'grid',
    label: 'Grid (3 columns)',
    description: 'Three equal-width cards side by side showing Execution Layer, Work Surface, and Data Layer',
    icon: <LayoutGrid className="w-5 h-5" />,
    accent: '#6161ff',
  },
  {
    value: 'masonry_expand',
    label: 'Masonry Expand',
    description: 'Large masonry cards that expand on click to full-width with description + visualization',
    icon: <Layers className="w-5 h-5" />,
    accent: '#10b981',
  },
];

/* ─── Netflix Card Image Editor ─────────────────────────────────────────── */

type CardEditorMode = 'poster' | 'expanded';

const POSTER_DEFAULT_POS = '50% 3%';
const POSTER_DEFAULT_ZOOM = 130;
const EXPANDED_DEFAULT_POS = '25,0';
const EXPANDED_DEFAULT_ZOOM = 120;

function NetflixCardEditor({
  job, deptColor, defaultImg, currentImg,
  currentPos, currentZoom,
  posterPos, posterZoom,
  expandedPos, expandedZoom,
  onImgChange, onPosChange, onZoomChange,
  onPosterPosChange, onPosterZoomChange,
  onExpandedPosChange, onExpandedZoomChange,
  onReset,
  lockedMode,
  hideImageUrl,
}: {
  job: string;
  deptColor: string;
  defaultImg: string | undefined;
  currentImg: string;
  currentPos: string;
  currentZoom: number;
  posterPos: string;
  posterZoom: number;
  expandedPos: string;
  expandedZoom: number;
  onImgChange: (v: string) => void;
  onPosChange: (v: string) => void;
  onZoomChange: (v: number) => void;
  onPosterPosChange: (v: string) => void;
  onPosterZoomChange: (v: number) => void;
  onExpandedPosChange: (v: string) => void;
  onExpandedZoomChange: (v: number) => void;
  onReset: () => void;
  lockedMode?: CardEditorMode;
  hideImageUrl?: boolean;
}) {
  const activeImg = currentImg || defaultImg;
  const hasOverride = !!currentImg || !!currentPos || currentZoom !== 100 || !!posterPos || posterZoom !== POSTER_DEFAULT_ZOOM || !!expandedPos || expandedZoom !== EXPANDED_DEFAULT_ZOOM;
  const pickerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const [modeState, setModeState] = useState<CardEditorMode>(lockedMode ?? 'poster');
  const mode = lockedMode ?? modeState;

  const activePos = mode === 'poster' ? (posterPos || POSTER_DEFAULT_POS) : (expandedPos || EXPANDED_DEFAULT_POS);
  const activeZoom = mode === 'poster' ? (posterZoom || POSTER_DEFAULT_ZOOM) : (expandedZoom || EXPANDED_DEFAULT_ZOOM);
  const onActivePos = mode === 'poster' ? onPosterPosChange : onExpandedPosChange;
  const onActiveZoom = mode === 'poster' ? onPosterZoomChange : onExpandedZoomChange;

  const parseFp = (pos: string): { x: number; y: number } => {
    if (!pos) return { x: 50, y: 50 };
    const named: Record<string, { x: number; y: number }> = {
      center: { x: 50, y: 50 },
      'left center': { x: 0, y: 50 },
      'right center': { x: 100, y: 50 },
      'top center': { x: 50, y: 0 },
      'bottom center': { x: 50, y: 100 },
    };
    if (named[pos]) return named[pos];
    const parts = pos.replace(/%/g, '').split(' ');
    return { x: Math.round(parseFloat(parts[0]) || 50), y: Math.round(parseFloat(parts[1]) || 50) };
  };
  const fp = parseFp(activePos);

  const applyClick = useCallback((e: React.MouseEvent | MouseEvent) => {
    if (!pickerRef.current || !activeImg) return;
    const rect = pickerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, Math.round(((e.clientX - rect.left) / rect.width) * 100)));
    const y = Math.max(0, Math.min(100, Math.round(((e.clientY - rect.top) / rect.height) * 100)));
    onActivePos(`${x}% ${y}%`);
  }, [activeImg, onActivePos]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!activeImg) return;
    isDragging.current = true;
    applyClick(e);
    const onMove = (ev: MouseEvent) => { if (isDragging.current) applyClick(ev); };
    const onUp = () => { isDragging.current = false; window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [activeImg, applyClick]);

  const bgSize = activeZoom === 100 ? 'cover' : `${activeZoom}%`;
  const pickerHeight = 200;

  // For Expanded mode: parse "panX,panY" from activePos
  const parseExpandedXY = (pos: string): { panX: number; panY: number } => {
    if (pos && pos.includes(',')) {
      const [x, y] = pos.split(',').map(Number);
      return { panX: isNaN(x) ? 0 : x, panY: isNaN(y) ? 0 : y };
    }
    return { panX: 0, panY: 0 };
  };
  const expandedXY = parseExpandedXY(activePos);
  const expandedScale = activeZoom / 100;

  return (
    <div className="rounded-xl border border-gray-800/60 bg-black/20 overflow-hidden">
      {/* Header row */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-800/40">
        <p className="text-[12px] font-medium text-gray-200 truncate">{job}</p>
        <div className="flex items-center gap-2">
          {/* Mode toggle — hidden when locked to a single mode */}
          {!lockedMode && (
            <div className="flex items-center rounded-md overflow-hidden border border-gray-700/50">
              {(['poster', 'expanded'] as const).map(m => (
                <button
                  key={m}
                  onClick={() => setModeState(m)}
                  className="px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider transition-colors"
                  style={{
                    backgroundColor: mode === m ? `${deptColor}25` : 'transparent',
                    color: mode === m ? deptColor : '#6b7280',
                  }}
                >
                  {m === 'poster' ? 'Poster' : 'Expanded'}
                </button>
              ))}
            </div>
          )}
          {hasOverride && (
            <button
              onClick={onReset}
              className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              Reset
            </button>
          )}
        </div>
      </div>

      {mode === 'expanded' ? (
        /* ── EXPANDED MODE: background-position pan + zoom (matches live page rendering) ── */
        <div className="flex gap-0">
          {/* Preview — pan values are scaled proportionally so the preview
              visually matches the live panel (live ≈ 1100px, preview = 240px) */}
          <div
            className="flex-shrink-0 relative overflow-hidden select-none"
            style={{ width: 240, height: pickerHeight, background: '#111' }}
          >
            {activeImg ? (
              <>
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: `url(${activeImg})`,
                    backgroundSize: bgSize,
                    backgroundPosition: `calc(50% + ${(expandedXY.panX * 240 / 1100).toFixed(1)}px) calc(50% + ${(expandedXY.panY * 240 / 1100).toFixed(1)}px)`,
                    backgroundRepeat: 'no-repeat',
                  }}
                />
                <div className="absolute bottom-1.5 left-0 right-0 flex justify-center pointer-events-none">
                  <span className="text-[9px] text-white/40 bg-black/40 px-2 py-0.5 rounded-full">
                    pan {expandedXY.panX > 0 ? '+' : ''}{expandedXY.panX}px · {expandedXY.panY > 0 ? '+' : ''}{expandedXY.panY}px · ×{expandedScale.toFixed(2)}
                  </span>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-1.5">
                <ImageIcon className="w-6 h-6 text-gray-700" />
                <span className="text-[9px] text-gray-600">Add image URL</span>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex-1 flex flex-col gap-2.5 px-3 py-3 min-w-0">
            {/* Image URL — hidden for global editors */}
            {!hideImageUrl && (
              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-wider font-medium block mb-1">Image URL</label>
                <div className="flex items-center gap-1.5">
                  <Link className="w-3 h-3 text-gray-600 flex-shrink-0" />
                  <input
                    type="url"
                    value={currentImg}
                    onChange={e => onImgChange(e.target.value.trim())}
                    placeholder="Leave empty for default"
                    className="w-full text-[11px] bg-white/5 border border-gray-700/60 rounded-md px-2 py-1 text-gray-300 placeholder:text-gray-600 focus:outline-none focus:border-gray-500 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Pan X slider */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Pan X (→ right)</label>
                <span className="text-[10px] font-mono" style={{ color: deptColor }}>
                  {expandedXY.panX > 0 ? '+' : ''}{expandedXY.panX}px
                </span>
              </div>
              <input
                type="range"
                min={-400}
                max={400}
                step={5}
                value={expandedXY.panX}
                onChange={e => onActivePos(`${Number(e.target.value)},${expandedXY.panY}`)}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: deptColor }}
              />
              <div className="flex justify-between mt-0.5">
                <span className="text-[8px] text-gray-700">←</span>
                <span className="text-[8px] text-gray-700">center</span>
                <span className="text-[8px] text-gray-700">→</span>
              </div>
            </div>

            {/* Pan Y slider */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Pan Y (↓ down)</label>
                <span className="text-[10px] font-mono" style={{ color: deptColor }}>
                  {expandedXY.panY > 0 ? '+' : ''}{expandedXY.panY}px
                </span>
              </div>
              <input
                type="range"
                min={-300}
                max={300}
                step={5}
                value={expandedXY.panY}
                onChange={e => onActivePos(`${expandedXY.panX},${Number(e.target.value)}`)}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: deptColor }}
              />
              <div className="flex justify-between mt-0.5">
                <span className="text-[8px] text-gray-700">↑</span>
                <span className="text-[8px] text-gray-700">center</span>
                <span className="text-[8px] text-gray-700">↓</span>
              </div>
            </div>

            {/* Zoom slider */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Zoom</label>
                <span className="text-[10px] font-mono" style={{ color: deptColor }}>
                  ×{expandedScale.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min={80}
                max={300}
                step={5}
                value={activeZoom}
                onChange={e => onActiveZoom(Number(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: deptColor }}
              />
              <div className="flex justify-between mt-0.5">
                <span className="text-[8px] text-gray-700">×0.8</span>
                <span className="text-[8px] text-gray-700">×1.0</span>
                <span className="text-[8px] text-gray-700">×3.0</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ── POSTER MODE: focal-point drag picker ── */
        <div className="flex gap-0">
          <div
            ref={pickerRef}
            className="flex-shrink-0 relative overflow-hidden select-none"
            style={{
              width: 240,
              height: pickerHeight,
              cursor: activeImg ? 'crosshair' : 'default',
              background: '#111',
            }}
            onMouseDown={handleMouseDown}
          >
            {activeImg ? (
              <>
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: `url(${activeImg})`,
                    backgroundSize: bgSize,
                    backgroundPosition: `${fp.x}% ${fp.y}%`,
                    backgroundRepeat: 'no-repeat',
                  }}
                />
                <div className="absolute inset-0 pointer-events-none" style={{
                  backgroundImage: 'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
                  backgroundSize: '33.33% 33.33%',
                }} />
                <div
                  className="absolute top-0 bottom-0 pointer-events-none"
                  style={{ left: `${fp.x}%`, width: 1, marginLeft: -0.5, background: 'rgba(255,255,255,0.45)' }}
                />
                <div
                  className="absolute left-0 right-0 pointer-events-none"
                  style={{ top: `${fp.y}%`, height: 1, marginTop: -0.5, background: 'rgba(255,255,255,0.45)' }}
                />
                <div
                  className="absolute pointer-events-none"
                  style={{ left: `${fp.x}%`, top: `${fp.y}%`, transform: 'translate(-50%,-50%)' }}
                >
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{
                      border: '2.5px solid white',
                      background: `${deptColor}cc`,
                      boxShadow: '0 0 0 1.5px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.7)',
                    }}
                  />
                </div>
                <div className="absolute bottom-1.5 left-0 right-0 flex justify-center pointer-events-none">
                  <span className="text-[9px] text-white/40 bg-black/40 px-2 py-0.5 rounded-full">
                    Poster · {fp.x}% · {fp.y}%
                  </span>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-1.5">
                <ImageIcon className="w-6 h-6 text-gray-700" />
                <span className="text-[9px] text-gray-600">Add image URL</span>
              </div>
            )}
          </div>

          {/* Right controls */}
          <div className="flex-1 flex flex-col gap-2.5 px-3 py-3 min-w-0">
            {/* Image URL — hidden for global editors */}
            {!hideImageUrl && (
              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-wider font-medium block mb-1">Image URL</label>
                <div className="flex items-center gap-1.5">
                  <Link className="w-3 h-3 text-gray-600 flex-shrink-0" />
                  <input
                    type="url"
                    value={currentImg}
                    onChange={e => onImgChange(e.target.value.trim())}
                    placeholder="Leave empty for default"
                    className="w-full text-[11px] bg-white/5 border border-gray-700/60 rounded-md px-2 py-1 text-gray-300 placeholder:text-gray-600 focus:outline-none focus:border-gray-500 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Zoom slider */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Poster Zoom</label>
                <span className="text-[10px] font-mono" style={{ color: deptColor }}>
                  {activeZoom}%
                </span>
              </div>
              <input
                type="range"
                min={40}
                max={200}
                step={5}
                value={activeZoom}
                onChange={e => onActiveZoom(Number(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, ${deptColor} 0%, ${deptColor} ${((activeZoom - 40) / 160) * 100}%, rgba(255,255,255,0.1) ${((activeZoom - 40) / 160) * 100}%, rgba(255,255,255,0.1) 100%)`,
                  accentColor: deptColor,
                }}
              />
              <div className="flex justify-between mt-0.5">
                <span className="text-[8px] text-gray-700">40%</span>
                <span className="text-[8px] text-gray-700">Cover</span>
                <span className="text-[8px] text-gray-700">200%</span>
              </div>
            </div>

            {activeImg && (
              <div className="flex items-center gap-1.5 mt-auto pt-1">
                <span className="text-[9px] text-gray-600">
                  Click/drag to set focal point
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface WorkManagementPageSettingsProps {
  onBack: () => void;
  onRegisterSave?: (fn: (() => Promise<void>) | null) => void;
}

/* ─── Agent Image Grid ────────────────────────────────────────────────────── */

function AgentImageGrid({
  overrides,
  onChange,
}: {
  overrides: Record<string, string>;
  onChange: (v: Record<string, string>) => void;
}) {
  const { uploadImage, uploading } = useImageUpload();
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleFile = async (agentId: string, file: File) => {
    setUploadingId(agentId);
    const url = await uploadImage(file, 'agent-catalog');
    if (url) {
      onChange({ ...overrides, [agentId]: url });
    }
    setUploadingId(null);
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {HORIZONTAL_AGENTS.map(agent => {
        const catMeta = CATEGORY_META[agent.category];
        const overrideUrl = overrides[agent.id];
        const displayImage = overrideUrl || agent.image;
        const isUploading = uploadingId === agent.id;

        return (
          <div
            key={agent.id}
            className="rounded-xl p-3 flex gap-3 items-start"
            style={{ backgroundColor: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            {/* Preview */}
            <div
              className="relative w-14 h-14 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center"
              style={{ backgroundColor: `${catMeta.color}15` }}
            >
              {displayImage && (
                <img
                  src={displayImage}
                  alt={agent.name}
                  className="w-full h-full object-contain"
                  style={{ mixBlendMode: 'screen' }}
                />
              )}
              {isUploading && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-lg">
                  <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: `${catMeta.color} transparent transparent transparent` }} />
                </div>
              )}
            </div>

            {/* Info + controls */}
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-semibold text-white leading-tight mb-0.5">{agent.name}</p>
              <p className="text-[10px] mb-2" style={{ color: catMeta.color }}>{catMeta.label}</p>

              <div className="flex gap-1.5 flex-wrap">
                <button
                  onClick={() => fileRefs.current[agent.id]?.click()}
                  disabled={isUploading || (uploading && uploadingId !== agent.id)}
                  className="text-[10px] font-semibold px-2 py-1 rounded-md transition-colors"
                  style={{ backgroundColor: `${catMeta.color}20`, color: catMeta.color }}
                >
                  {overrideUrl ? 'Replace' : 'Upload'}
                </button>
                {overrideUrl && (
                  <button
                    onClick={() => {
                      const next = { ...overrides };
                      delete next[agent.id];
                      onChange(next);
                    }}
                    className="text-[10px] font-semibold px-2 py-1 rounded-md bg-white/[0.04] text-gray-400 hover:text-white transition-colors"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            <input
              ref={el => { fileRefs.current[agent.id] = el; }}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => {
                const f = e.target.files?.[0];
                if (f) handleFile(agent.id, f);
                e.target.value = '';
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

function VibeCollageImageGrid({
  overrides,
  onChange,
}: {
  overrides: Record<string, string>;
  onChange: (v: Record<string, string>) => void;
}) {
  const { uploadImage, uploading } = useImageUpload();
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleFile = async (itemId: string, file: File) => {
    setUploadingId(itemId);
    const url = await uploadImage(file, 'vibe');
    if (url) {
      onChange({ ...overrides, [itemId]: url });
    }
    setUploadingId(null);
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {VIBE_COLLAGE_ITEMS.map(item => {
        const overrideUrl = overrides[item.id];
        const displayImage = overrideUrl || item.defaultSrc;
        const isUploading = uploadingId === item.id;

        return (
          <div
            key={item.id}
            className="rounded-xl p-3 flex gap-3 items-start"
            style={{ backgroundColor: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="relative w-20 h-14 rounded-lg flex-shrink-0 overflow-hidden">
              <img
                src={displayImage}
                alt={item.alt}
                className="w-full h-full object-cover rounded-lg"
              />
              {isUploading && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-lg">
                  <div className="w-5 h-5 border-2 border-[#00D2D2] border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              {overrideUrl && (
                <div className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-[#00D2D2]" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-semibold text-white leading-tight mb-0.5">{item.alt}</p>
              <p className="text-[10px] text-gray-500 mb-2">{item.id}</p>

              <div className="flex gap-1.5 flex-wrap">
                <button
                  onClick={() => fileRefs.current[item.id]?.click()}
                  disabled={isUploading || (uploading && uploadingId !== item.id)}
                  className="text-[10px] font-semibold px-2 py-1 rounded-md transition-colors"
                  style={{ backgroundColor: '#00D2D220', color: '#00D2D2' }}
                >
                  {overrideUrl ? 'Replace' : 'Upload'}
                </button>
                {overrideUrl && (
                  <button
                    onClick={() => {
                      const next = { ...overrides };
                      delete next[item.id];
                      onChange(next);
                    }}
                    className="text-[10px] font-semibold px-2 py-1 rounded-md bg-white/[0.04] text-gray-400 hover:text-white transition-colors"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            <input
              ref={el => { fileRefs.current[item.id] = el; }}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => {
                const f = e.target.files?.[0];
                if (f) handleFile(item.id, f);
                e.target.value = '';
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

export function WorkManagementPageSettings({ onBack, onRegisterSave }: WorkManagementPageSettingsProps) {
  const [selectedVariant, setSelectedVariant] = useState<WmLayersVariant>('grid');
  const [selectedBentoStyle, setSelectedBentoStyle] = useState<WmBentoStyle>('dark_gradient');
  const [selectedFirstFoldVariant, setSelectedFirstFoldVariant] = useState<WmFirstFoldVariant>('default');
  const [darkMode, setDarkMode] = useState(false);
  const [squadSplitChat, setSquadSplitChat] = useState(false);
  const [rosterLayout, setRosterLayout] = useState<WmRosterLayout>('mirrored');
  const [boardStyle, setBoardStyle] = useState<WmBoardStyle>('default');
  const [cardLayout, setCardLayout] = useState<WmCardLayout>('default');
  const [useCasesVariant, setUseCasesVariant] = useState<WmUseCasesVariant>('none');
  const [agentCatalogVariant, setAgentCatalogVariant] = useState<'compact_grid' | 'showcase_carousel' | 'masonry_cards' | 'none'>('compact_grid');
  const [showAgentCarousel, setShowAgentCarousel] = useState(false);
  const [agentImageOverrides, setAgentImageOverrides] = useState<Record<string, string>>({});
  const [avatarOverrides, setAvatarOverrides] = useState<Record<string, string>>({});
  const [memberAvatarOverrides, setMemberAvatarOverrides] = useState<Record<string, string>>({});
  const [colorOverrides, setColorOverrides] = useState<Record<string, string>>({});
  const [jtbdBgOverrides, setJtbdBgOverrides] = useState<Record<string, string>>({});
  const [jtbdPositionOverrides, setJtbdPositionOverrides] = useState<Record<string, string>>({});
  const [jtbdZoomOverrides, setJtbdZoomOverrides] = useState<Record<string, number>>({});
  const [jtbdGlobalPosterPos, setJtbdGlobalPosterPos] = useState(POSTER_DEFAULT_POS);
  const [jtbdGlobalPosterZoom, setJtbdGlobalPosterZoom] = useState(POSTER_DEFAULT_ZOOM);
  const [jtbdGlobalExpandedPos, setJtbdGlobalExpandedPos] = useState(EXPANDED_DEFAULT_POS);
  const [jtbdGlobalExpandedZoom, setJtbdGlobalExpandedZoom] = useState(EXPANDED_DEFAULT_ZOOM);
  const [jtbdExpandedOverlayOpacity, setJtbdExpandedOverlayOpacity] = useState(45);
  const [deptOrder, setDeptOrder] = useState<string[]>(() => DEPARTMENTS.map(d => d.id));
  const [sectionsOrder, setSectionsOrder] = useState<string[]>(WM_DEFAULT_ORDER);
  const [sectionsVisibility, setSectionsVisibility] = useState<Record<string, boolean>>({});
  const [sectionsGap, setSectionsGap] = useState(0);
  const [vibeCollageImages, setVibeCollageImages] = useState<Record<string, string>>({});
  const [expandedDepts, setExpandedDepts] = useState<Set<string>>(new Set());
  const [expandedSectionId, setExpandedSectionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const { assets: avatarAssets } = useDesignAssets('department_avatar');
  const allAvatarImages = avatarAssets.map(a => a.file_url);

  const handleSaveRef = useRef<() => Promise<void>>(async () => {});

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    if (!onRegisterSave) return;
    onRegisterSave(() => handleSaveRef.current());
    return () => onRegisterSave(null);
  }, [onRegisterSave]);

  const loadSettings = async () => {
    try {
      const { data } = await supabase
        .from('site_settings')
        .select('sections_visibility')
        .eq('id', 'main')
        .single();

      if (data?.sections_visibility) {
        const sv = data.sections_visibility as Record<string, unknown>;
        if (sv._wm_platform_layers_variant) {
          setSelectedVariant(sv._wm_platform_layers_variant as WmLayersVariant);
        }
        if (sv._wm_bento_style) {
          setSelectedBentoStyle(sv._wm_bento_style as WmBentoStyle);
        }
        if (sv._wm_dark_mode != null) {
          setDarkMode(!!sv._wm_dark_mode);
        }
        if (sv._wm_dept_avatar_overrides) {
          setAvatarOverrides(sv._wm_dept_avatar_overrides as Record<string, string>);
        }
        if (sv._wm_dept_color_overrides) {
          setColorOverrides(sv._wm_dept_color_overrides as Record<string, string>);
        }
        if (sv._wm_dept_order && Array.isArray(sv._wm_dept_order) && (sv._wm_dept_order as string[]).length > 0) {
          const savedOrder = sv._wm_dept_order as string[];
          const missing = DEPARTMENTS.map(d => d.id).filter(id => !savedOrder.includes(id));
          setDeptOrder([...savedOrder, ...missing]);
        }
        if (sv._wm_first_fold_variant) {
          setSelectedFirstFoldVariant(sv._wm_first_fold_variant as WmFirstFoldVariant);
        }
        if (sv._wm_squad_split_chat != null) {
          setSquadSplitChat(!!sv._wm_squad_split_chat);
        }
        if (sv._wm_roster_layout) {
          setRosterLayout(sv._wm_roster_layout as WmRosterLayout);
        }
        if (sv._wm_member_avatar_overrides) {
          setMemberAvatarOverrides(sv._wm_member_avatar_overrides as Record<string, string>);
        }
        if (sv._wm_board_style) {
          setBoardStyle(sv._wm_board_style as WmBoardStyle);
        }
        if (sv._wm_card_layout) {
          setCardLayout(sv._wm_card_layout as WmCardLayout);
        }
        if (sv._wm_use_cases_variant) {
          setUseCasesVariant(sv._wm_use_cases_variant as WmUseCasesVariant);
        }
        if (sv._wm_agent_catalog_variant) {
          setAgentCatalogVariant(sv._wm_agent_catalog_variant as typeof agentCatalogVariant);
        }
        if (sv._wm_show_agent_carousel !== undefined) {
          setShowAgentCarousel(!!sv._wm_show_agent_carousel);
        }
        if (sv._wm_agent_image_overrides && typeof sv._wm_agent_image_overrides === 'object') {
          setAgentImageOverrides(sv._wm_agent_image_overrides as Record<string, string>);
        }
        if (sv._wm_vibe_collage_images && typeof sv._wm_vibe_collage_images === 'object') {
          setVibeCollageImages(sv._wm_vibe_collage_images as Record<string, string>);
        }
        if (sv._wm_jtbd_bg_overrides) {
          setJtbdBgOverrides(sv._wm_jtbd_bg_overrides as Record<string, string>);
        }
        if (sv._wm_jtbd_position_overrides) {
          setJtbdPositionOverrides(sv._wm_jtbd_position_overrides as Record<string, string>);
        }
        if (sv._wm_jtbd_zoom_overrides) {
          setJtbdZoomOverrides(sv._wm_jtbd_zoom_overrides as Record<string, number>);
        }
        if (typeof sv._wm_jtbd_global_poster_pos === 'string') {
          setJtbdGlobalPosterPos(sv._wm_jtbd_global_poster_pos as string);
        }
        if (typeof sv._wm_jtbd_global_poster_zoom === 'number') {
          setJtbdGlobalPosterZoom(sv._wm_jtbd_global_poster_zoom as number);
        }
        if (typeof sv._wm_jtbd_global_expanded_pos === 'string') {
          setJtbdGlobalExpandedPos(sv._wm_jtbd_global_expanded_pos as string);
        }
        if (typeof sv._wm_jtbd_global_expanded_zoom === 'number') {
          setJtbdGlobalExpandedZoom(sv._wm_jtbd_global_expanded_zoom as number);
        }
        if (typeof sv._wm_jtbd_expanded_overlay_opacity === 'number') {
          setJtbdExpandedOverlayOpacity(sv._wm_jtbd_expanded_overlay_opacity as number);
        }
        if (Array.isArray(sv._wm_sections_order) && (sv._wm_sections_order as string[]).length > 0) {
          const savedOrder = sv._wm_sections_order as string[];
          const missing = WM_DEFAULT_ORDER.filter(id => !savedOrder.includes(id));
          setSectionsOrder([...savedOrder, ...missing]);
        }
        if (sv._wm_sections_visibility && typeof sv._wm_sections_visibility === 'object') {
          setSectionsVisibility(sv._wm_sections_visibility as Record<string, boolean>);
        }
        if (typeof sv._wm_sections_gap === 'number') {
          setSectionsGap(sv._wm_sections_gap as number);
        }
      }
    } catch (err) {
      console.log('No WM settings found, using defaults');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await supabase
        .from('site_settings')
        .select('sections_visibility')
        .eq('id', 'main')
        .single();

      const currentSV = (data?.sections_visibility || {}) as Record<string, unknown>;

      await supabase
        .from('site_settings')
        .upsert({
          id: 'main',
          sections_visibility: {
            ...currentSV,
            _wm_platform_layers_variant: selectedVariant,
            _wm_bento_style: selectedBentoStyle,
            _wm_dark_mode: darkMode,
            _wm_dept_avatar_overrides: avatarOverrides,
            _wm_dept_color_overrides: colorOverrides,
            _wm_dept_order: deptOrder,
            _wm_first_fold_variant: selectedFirstFoldVariant,
            _wm_squad_split_chat: squadSplitChat,
            _wm_roster_layout: rosterLayout,
            _wm_member_avatar_overrides: memberAvatarOverrides,
            _wm_board_style: boardStyle,
            _wm_card_layout: cardLayout,
            _wm_use_cases_variant: useCasesVariant,
            _wm_agent_catalog_variant: agentCatalogVariant,
            _wm_show_agent_carousel: showAgentCarousel,
            _wm_agent_image_overrides: agentImageOverrides,
            _wm_vibe_collage_images: vibeCollageImages,
            _wm_jtbd_bg_overrides: jtbdBgOverrides,
            _wm_jtbd_position_overrides: jtbdPositionOverrides,
            _wm_jtbd_zoom_overrides: jtbdZoomOverrides,
            _wm_jtbd_global_poster_pos: jtbdGlobalPosterPos,
            _wm_jtbd_global_poster_zoom: jtbdGlobalPosterZoom,
            _wm_jtbd_global_expanded_pos: jtbdGlobalExpandedPos,
            _wm_jtbd_global_expanded_zoom: jtbdGlobalExpandedZoom,
            _wm_jtbd_expanded_overlay_opacity: jtbdExpandedOverlayOpacity,
            _wm_sections_order: sectionsOrder,
            _wm_sections_visibility: sectionsVisibility,
            _wm_sections_gap: sectionsGap,
          },
        });

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Failed to save WM settings:', err);
    } finally {
      setSaving(false);
    }
  };

  handleSaveRef.current = handleSave;

  const moveDept = useCallback((index: number, direction: -1 | 1) => {
    setDeptOrder(prev => {
      const next = [...prev];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= next.length) return prev;
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next;
    });
  }, []);

  const orderedDepts = deptOrder.map(id => DEPARTMENTS.find(d => d.id === id)).filter(Boolean) as typeof DEPARTMENTS;

  const orderedSections = sectionsOrder.map(id => WM_SECTIONS.find(s => s.id === id)).filter(Boolean) as WmSectionMeta[];

  const handleSectionDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = sectionsOrder.indexOf(active.id as string);
    const newIndex = sectionsOrder.indexOf(over.id as string);
    if (oldIndex === -1 || newIndex === -1) return;
    setSectionsOrder(arrayMove(sectionsOrder, oldIndex, newIndex));
  };

  const toggleSectionVisibility = (id: string) => {
    setSectionsVisibility(prev => ({
      ...prev,
      [id]: prev[id] === false ? true : false,
    }));
  };

  const isSectionVisible = (id: string) => sectionsVisibility[id] !== false;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-gray-400">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-white">monday.com</h2>
            <p className="text-sm text-gray-500 mt-1">Configure the monday.com landing page</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-sm transition-all disabled:opacity-50"
        >
          {saved ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Saved!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </>
          )}
        </button>
      </div>

      {/* ═══ Section Layout ═══ */}
      <div className="bg-[#12131a] rounded-2xl border border-gray-800/60 p-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-indigo-500/15">
            <Blocks className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Page Sections</h3>
            <p className="text-sm text-gray-500">Drag to reorder sections, toggle visibility on/off</p>
          </div>
        </div>
        <div className="mt-5 space-y-2">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleSectionDragEnd}
          >
            <SortableContext
              items={sectionsOrder}
              strategy={verticalListSortingStrategy}
            >
              {orderedSections.map((section, idx) => {
                /* ── Per-section settings content ── */
                const sectionChildren = (() => {
                  if (section.id === 'first_fold') return (
                    <>
                      {/* Hero Style */}
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-1">Hero Style</h4>
                        <p className="text-xs text-gray-500 mb-3">Choose the visual treatment for the hero section at the top of the page</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {FIRST_FOLD_VARIANT_OPTIONS.map((option) => {
                            const isSelected = selectedFirstFoldVariant === option.value;
                            return (
                              <button
                                key={option.value}
                                onClick={() => setSelectedFirstFoldVariant(option.value)}
                                className={`relative text-left p-3 rounded-xl border-2 transition-all duration-200 ${isSelected ? 'border-violet-500/60 bg-violet-500/5' : 'border-gray-700/50 bg-white/[0.02] hover:border-gray-600 hover:bg-white/[0.04]'}`}
                              >
                                {option.badge && (
                                  <span className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${option.accent}20`, color: option.accent }}>{option.badge}</span>
                                )}
                                <div className="flex items-start gap-2">
                                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: isSelected ? `${option.accent}20` : 'rgba(255,255,255,0.04)', color: isSelected ? option.accent : '#6b7280' }}>{option.icon}</div>
                                  <div className="min-w-0 flex-1 pr-6">
                                    <p className={`text-xs font-semibold mb-0.5 ${isSelected ? 'text-white' : 'text-gray-300'}`}>{option.label}</p>
                                    <p className="text-[10px] text-gray-500 leading-relaxed">{option.description}</p>
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Squad Split & Chat */}
                      <div className="border-t border-gray-700/40 pt-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${squadSplitChat ? 'bg-violet-500/20' : 'bg-white/5'}`}>
                              <MessageSquare className={`w-4 h-4 ${squadSplitChat ? 'text-violet-400' : 'text-gray-400'}`} />
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-white">Squad Split & Chat</h4>
                              <p className="text-xs text-gray-500">Humans and agents separate and exchange messages</p>
                            </div>
                          </div>
                          <button
                            onClick={() => setSquadSplitChat(!squadSplitChat)}
                            className={`relative w-11 h-6 rounded-full transition-colors ${squadSplitChat ? 'bg-violet-500' : 'bg-gray-700'}`}
                          >
                            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all shadow-sm ${squadSplitChat ? 'left-5' : 'left-0.5'}`} />
                          </button>
                        </div>
                        {squadSplitChat && (
                          <div className="mt-3">
                            <p className="text-xs text-gray-500 mb-2">Roster Layout</p>
                            <div className="grid grid-cols-2 gap-2">
                              {([
                                { value: 'mirrored' as const, label: 'Mirrored', desc: 'People on left, agents on right', accent: '#6161ff' },
                                { value: 'vertical' as const, label: 'Vertical', desc: 'Avatars stacked vertically', accent: '#00d2d2' },
                              ]).map(opt => {
                                const isSelected = rosterLayout === opt.value;
                                return (
                                  <button key={opt.value} onClick={() => setRosterLayout(opt.value)} className={`text-left p-3 rounded-xl border-2 transition-all ${isSelected ? 'border-violet-500/60 bg-violet-500/5' : 'border-gray-700/50 bg-white/[0.02] hover:border-gray-600'}`}>
                                    <p className={`text-xs font-semibold ${isSelected ? 'text-white' : 'text-gray-300'}`}>{opt.label}</p>
                                    <p className="text-[10px] text-gray-500 mt-0.5">{opt.desc}</p>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Department Customization */}
                      <div className="border-t border-gray-700/40 pt-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Palette className="w-4 h-4 text-[#f59e0b]" />
                          <h4 className="text-sm font-semibold text-white">Department Customization</h4>
                        </div>
                        <p className="text-xs text-gray-500 mb-3">Reorder departments, assign lead images, and set background colors</p>
                        <div className="flex flex-col gap-2">
                          {orderedDepts.map((dept, dIdx) => {
                            const DIcon = dept.icon;
                            const currentColor = colorOverrides[dept.id] || dept.color;
                            const currentAvatar = avatarOverrides[dept.id] || '';
                            return (
                              <div key={dept.id} className="rounded-xl border border-gray-700/50 bg-white/[0.02] p-3">
                                <div className="flex items-center gap-2">
                                  <div className="flex flex-col gap-0.5">
                                    <button onClick={() => moveDept(dIdx, -1)} disabled={dIdx === 0} className="w-5 h-5 rounded flex items-center justify-center bg-white/5 hover:bg-white/10 disabled:opacity-20 transition-colors"><ChevronUp className="w-3 h-3 text-gray-400" /></button>
                                    <button onClick={() => moveDept(dIdx, 1)} disabled={dIdx === orderedDepts.length - 1} className="w-5 h-5 rounded flex items-center justify-center bg-white/5 hover:bg-white/10 disabled:opacity-20 transition-colors"><ChevronDown className="w-3 h-3 text-gray-400" /></button>
                                  </div>
                                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${currentColor}20` }}>
                                    <DIcon className="w-4 h-4" style={{ color: currentColor }} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-white">{dept.name}</p>
                                    <p className="text-[10px] text-gray-500">{dept.description}</p>
                                  </div>
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    <label className="relative cursor-pointer">
                                      <div className="w-7 h-7 rounded-lg border-2 border-gray-700 hover:border-gray-500 transition-colors" style={{ backgroundColor: currentColor }} />
                                      <input type="color" value={currentColor} onChange={(e) => setColorOverrides(prev => ({ ...prev, [dept.id]: e.target.value }))} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                                    </label>
                                  </div>
                                  <button
                                    onClick={() => setExpandedDepts(prev => { const next = new Set(prev); if (next.has(dept.id)) next.delete(dept.id); else next.add(dept.id); return next; })}
                                    className={`p-1 rounded-lg transition-all flex-shrink-0 ${expandedDepts.has(dept.id) ? 'bg-amber-600/20 text-amber-400' : 'text-gray-600 hover:bg-gray-700 hover:text-gray-400'}`}
                                  >
                                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expandedDepts.has(dept.id) ? 'rotate-180' : ''}`} />
                                  </button>
                                </div>
                                {expandedDepts.has(dept.id) && (
                                  <div className="mt-3 pt-3 border-t border-gray-700/40">
                                    <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mb-2">Lead Image</p>
                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                      <button onClick={() => setAvatarOverrides(prev => { const next = { ...prev }; delete next[dept.id]; return next; })} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${!currentAvatar ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-[#1a1b24]' : 'opacity-50 hover:opacity-80'}`} style={{ backgroundColor: `${currentColor}30` }}><DIcon className="w-4 h-4" style={{ color: currentColor }} /></button>
                                      {allAvatarImages.map((img, imgIdx) => {
                                        const isSel = currentAvatar === img;
                                        return (
                                          <button key={imgIdx} onClick={() => setAvatarOverrides(prev => ({ ...prev, [dept.id]: img }))} className={`w-10 h-10 rounded-full transition-all flex-shrink-0 flex items-center justify-center ${isSel ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-[#1a1b24]' : 'opacity-50 hover:opacity-80'}`} style={{ backgroundColor: currentColor, padding: '2.5px' }}>
                                            <div className="w-full h-full rounded-full overflow-hidden"><img src={img} alt="" className="w-full h-full object-cover" /></div>
                                          </button>
                                        );
                                      })}
                                    </div>
                                    {allAvatarImages.length === 0 && <p className="text-[10px] text-gray-600">No avatars found. Add images in Design Assets → Department Avatars.</p>}
                                    {(() => {
                                      const squadDept = SQUAD_DEPARTMENTS.find(sd => sd.id === dept.id);
                                      if (!squadDept) return null;
                                      const humanMembers = squadDept.members.filter(m => !m.isAgent && m.role !== 'Team Lead');
                                      if (humanMembers.length === 0) return null;
                                      return (
                                        <div className="mt-3 pt-3 border-t border-gray-700/40">
                                          <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mb-2">Team Member Images</p>
                                          <div className="flex flex-col gap-2">
                                            {humanMembers.map(member => {
                                              const currentImg = memberAvatarOverrides[member.id] || '';
                                              return (
                                                <div key={member.id}>
                                                  <p className="text-[10px] text-gray-400 mb-1">{member.label}</p>
                                                  <div className="flex items-center gap-2 flex-wrap">
                                                    <button onClick={() => setMemberAvatarOverrides(prev => { const next = { ...prev }; delete next[member.id]; return next; })} className={`w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${!currentImg ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-[#1a1b24]' : 'opacity-50 hover:opacity-80'}`} style={{ backgroundColor: `${currentColor}30`, color: currentColor }} title="Auto">{member.fallback || 'A'}</button>
                                                    {allAvatarImages.map((img, imgIdx) => {
                                                      const isSel = currentImg === img;
                                                      return (
                                                        <button key={imgIdx} onClick={() => setMemberAvatarOverrides(prev => ({ ...prev, [member.id]: img }))} className={`w-9 h-9 rounded-full transition-all flex-shrink-0 flex items-center justify-center ${isSel ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-[#1a1b24]' : 'opacity-50 hover:opacity-80'}`} style={{ backgroundColor: currentColor, padding: '2px' }}>
                                                          <div className="w-full h-full rounded-full overflow-hidden"><img src={img} alt="" className="w-full h-full object-cover" /></div>
                                                        </button>
                                                      );
                                                    })}
                                                  </div>
                                                </div>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      );
                                    })()}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  );

                  if (section.id === 'demo') return (
                    <>
                      {/* Board Card Style */}
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-1">Board Card Style</h4>
                        <p className="text-xs text-gray-500 mb-3">Choose how the task board / work surface is displayed inside the card</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {BOARD_STYLE_OPTIONS.map((option) => {
                            const isSelected = boardStyle === option.value;
                            return (
                              <button key={option.value} onClick={() => setBoardStyle(option.value)} className={`relative text-left p-3 rounded-xl border-2 transition-all duration-200 ${isSelected ? 'border-violet-500/60 bg-violet-500/5' : 'border-gray-700/50 bg-white/[0.02] hover:border-gray-600 hover:bg-white/[0.04]'}`}>
                                {option.badge && <span className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${option.accent}20`, color: option.accent }}>{option.badge}</span>}
                                <div className="flex items-start gap-2">
                                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: isSelected ? `${option.accent}20` : 'rgba(255,255,255,0.04)', color: isSelected ? option.accent : '#6b7280' }}>{option.icon}</div>
                                  <div className="min-w-0 flex-1 pr-6">
                                    <p className={`text-xs font-semibold mb-0.5 ${isSelected ? 'text-white' : 'text-gray-300'}`}>{option.label}</p>
                                    <p className="text-[10px] text-gray-500 leading-relaxed">{option.description}</p>
                                  </div>
                                </div>
                                {isSelected && <div className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: option.accent }} />}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Card Layout */}
                      <div className="border-t border-gray-700/40 pt-1">
                        <h4 className="text-sm font-semibold text-white mb-1">Card Layout</h4>
                        <p className="text-xs text-gray-500 mb-3">Choose how the Squad panel and Board are arranged inside the card</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {CARD_LAYOUT_OPTIONS.map((option) => {
                            const isSelected = cardLayout === option.value;
                            return (
                              <button key={option.value} onClick={() => setCardLayout(option.value)} className={`relative text-left p-3 rounded-xl border-2 transition-all duration-200 ${isSelected ? 'border-violet-500/60 bg-violet-500/5' : 'border-gray-700/50 bg-white/[0.02] hover:border-gray-600 hover:bg-white/[0.04]'}`}>
                                <div className="flex items-start gap-2">
                                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: isSelected ? `${option.accent}20` : 'rgba(255,255,255,0.04)', color: isSelected ? option.accent : '#6b7280' }}>{option.icon}</div>
                                  <div className="min-w-0 flex-1">
                                    <p className={`text-xs font-semibold mb-0.5 ${isSelected ? 'text-white' : 'text-gray-300'}`}>{option.label}</p>
                                    <p className="text-[10px] text-gray-500 leading-relaxed">{option.description}</p>
                                  </div>
                                </div>
                                {isSelected && <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: option.accent }} />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  );

                  if (section.id === 'platform_layers') return (
                    <>
                      {/* Platform Layers Variant */}
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-1">Visualization Style</h4>
                        <p className="text-xs text-gray-500 mb-3">Choose how the "Three powerful layers" section is displayed</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {VARIANT_OPTIONS.map((option) => {
                            const isSelected = selectedVariant === option.value;
                            return (
                              <button key={option.value} onClick={() => setSelectedVariant(option.value)} className={`relative text-left p-3 rounded-xl border-2 transition-all duration-200 ${isSelected ? 'border-emerald-500/60 bg-emerald-500/5' : 'border-gray-700/50 bg-white/[0.02] hover:border-gray-600 hover:bg-white/[0.04]'}`}>
                                <div className="flex items-start gap-2">
                                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: isSelected ? `${option.accent}20` : 'rgba(255,255,255,0.05)', color: isSelected ? option.accent : '#9ca3af' }}>{option.icon}</div>
                                  <div className="min-w-0">
                                    <p className={`text-xs font-semibold ${isSelected ? 'text-white' : 'text-gray-300'}`}>{option.label}</p>
                                    <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">{option.description}</p>
                                  </div>
                                </div>
                                {isSelected && <div className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: option.accent }}><CheckCircle className="w-2.5 h-2.5 text-white" /></div>}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Bento Style (conditional) */}
                      {selectedVariant === 'masonry_expand' && (
                        <div className="border-t border-gray-700/40 pt-1">
                          <h4 className="text-sm font-semibold text-white mb-1">Bento Card Style</h4>
                          <p className="text-xs text-gray-500 mb-3">Choose the visual style for the bento cards</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {BENTO_STYLE_OPTIONS.map((option) => {
                              const isSelected = selectedBentoStyle === option.value;
                              return (
                                <button key={option.value} onClick={() => setSelectedBentoStyle(option.value)} className={`relative text-left p-3 rounded-xl border-2 transition-all duration-200 ${isSelected ? 'border-emerald-500/60 bg-emerald-500/5' : 'border-gray-700/50 bg-white/[0.02] hover:border-gray-600 hover:bg-white/[0.04]'}`}>
                                  <div className="flex items-start gap-2">
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: isSelected ? `${option.accent}20` : 'rgba(255,255,255,0.05)', color: isSelected ? option.accent : '#9ca3af' }}>{option.icon}</div>
                                    <div className="min-w-0">
                                      <p className={`text-xs font-semibold ${isSelected ? 'text-white' : 'text-gray-300'}`}>{option.label}</p>
                                      <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">{option.description}</p>
                                    </div>
                                  </div>
                                  {isSelected && <div className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: option.accent }}><CheckCircle className="w-2.5 h-2.5 text-white" /></div>}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </>
                  );

                  if (section.id === 'use_cases') return (
                    <>
                      {/* Variant picker */}
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-1">Variant</h4>
                        <p className="text-xs text-gray-500 mb-3">Show a dedicated section listing JTBD use cases across all departments</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {([
                            { value: 'none' as const, label: 'Hidden', desc: 'Not shown', icon: <XCircle className="w-4 h-4" />, accent: '#6b7280' },
                            { value: 'tabbed_cards' as const, label: 'Tabbed (A)', desc: 'Pills + card grid', icon: <Rows3 className="w-4 h-4" />, accent: '#6161ff' },
                            { value: 'tabbed_cards_c' as const, label: 'Media (C)', desc: 'Full-bleed images', icon: <Grid3x3 className="w-4 h-4" />, accent: '#00d2d2' },
                            { value: 'tabbed_cards_d' as const, label: 'Bento (D)', desc: 'Featured + cards', icon: <Rows3 className="w-4 h-4" />, accent: '#A25DDC' },
                            { value: 'tabbed_cards_e' as const, label: 'Netflix (E)', desc: 'Cinematic hover', icon: <Grid3x3 className="w-4 h-4" />, accent: '#E50914' },
                            { value: 'accordion' as const, label: 'Accordion', desc: 'Expandable rows', icon: <ListCollapse className="w-4 h-4" />, accent: '#f59e0b' },
                            { value: 'marquee' as const, label: 'Marquee', desc: 'Infinite scroll', icon: <ScrollText className="w-4 h-4" />, accent: '#f59e0b' },
                            { value: 'matrix' as const, label: 'Matrix', desc: 'Columns × rows', icon: <Grid3x3 className="w-4 h-4" />, accent: '#a855f7' },
                            { value: 'tabbed_cards_f' as const, label: 'Netflix Agentic', desc: 'Expanded + gallery', icon: <Clapperboard className="w-4 h-4" />, accent: '#06b6d4' },
                            { value: 'agentic_flow' as const, label: 'Agentic Flow', desc: 'Live agent workflow', icon: <Sparkles className="w-4 h-4" />, accent: '#10b981' },
                          ] as const).map(opt => {
                            const isSelected = useCasesVariant === opt.value;
                            return (
                              <button key={opt.value} onClick={() => setUseCasesVariant(opt.value)} className={`relative text-left p-3 rounded-xl border-2 transition-all duration-200 ${isSelected ? 'bg-white/[0.04]' : 'border-gray-700/50 bg-white/[0.02] hover:border-gray-600 hover:bg-white/[0.04]'}`} style={{ borderColor: isSelected ? `${opt.accent}60` : undefined }}>
                                {isSelected && <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: opt.accent }} />}
                                <div className="w-7 h-7 rounded-lg flex items-center justify-center mb-2" style={{ backgroundColor: isSelected ? `${opt.accent}20` : 'rgba(255,255,255,0.04)', color: isSelected ? opt.accent : '#6b7280' }}>{opt.icon}</div>
                                <p className={`text-xs font-semibold mb-0.5 ${isSelected ? 'text-white' : 'text-gray-300'}`}>{opt.label}</p>
                                <p className="text-[10px] text-gray-500 leading-relaxed">{opt.desc}</p>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Netflix Agentic (tabbed_cards_f) image controls */}
                      {useCasesVariant === 'tabbed_cards_f' && (
                        <div className="border-t border-gray-700/40 pt-1">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(6,182,212,0.15)' }}>
                              <Clapperboard className="w-4 h-4" style={{ color: '#06b6d4' }} />
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-white">Netflix Agentic — Background Images</h4>
                              <p className="text-xs text-gray-500">Control gallery card and expanded card image position</p>
                            </div>
                          </div>

                          {/* Gallery cards — poster position */}
                          <div className="rounded-xl border border-gray-800 bg-white/[0.02] p-3 mb-3">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-5 h-5 rounded flex items-center justify-center" style={{ backgroundColor: 'rgba(6,182,212,0.15)' }}><ImageIcon className="w-3 h-3" style={{ color: '#06b6d4' }} /></div>
                              <div>
                                <p className="text-[11px] font-semibold text-white">Gallery Cards Position</p>
                                <p className="text-[10px] text-gray-500">Focal point applied to all collapsed gallery cards</p>
                              </div>
                            </div>
                            <NetflixCardEditor
                              job="Global — Gallery Cards"
                              deptColor="#06b6d4"
                              defaultImg={JTBD_BG_MAP['Creative assets, no designer needed']}
                              currentImg="" currentPos="" currentZoom={100}
                              posterPos={jtbdGlobalPosterPos} posterZoom={jtbdGlobalPosterZoom}
                              expandedPos="" expandedZoom={EXPANDED_DEFAULT_ZOOM}
                              onImgChange={() => {}} onPosChange={() => {}} onZoomChange={() => {}}
                              onPosterPosChange={val => setJtbdGlobalPosterPos(val || POSTER_DEFAULT_POS)}
                              onPosterZoomChange={val => setJtbdGlobalPosterZoom(val)}
                              onExpandedPosChange={() => {}} onExpandedZoomChange={() => {}}
                              onReset={() => { setJtbdGlobalPosterPos(POSTER_DEFAULT_POS); setJtbdGlobalPosterZoom(POSTER_DEFAULT_ZOOM); }}
                              lockedMode="poster" hideImageUrl
                            />
                          </div>

                          {/* Expanded card — pan + zoom */}
                          <div className="rounded-xl border border-gray-800 bg-white/[0.02] p-3 mb-3">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-5 h-5 rounded flex items-center justify-center" style={{ backgroundColor: 'rgba(6,182,212,0.15)' }}><Maximize2 className="w-3 h-3" style={{ color: '#06b6d4' }} /></div>
                              <div>
                                <p className="text-[11px] font-semibold text-white">Expanded Card Position</p>
                                <p className="text-[10px] text-gray-500">Pan and zoom for the full-bleed background on the expanded card</p>
                              </div>
                            </div>
                            <NetflixCardEditor
                              job="Global — Expanded Card"
                              deptColor="#06b6d4"
                              defaultImg={JTBD_BG_MAP['Creative assets, no designer needed']}
                              currentImg="" currentPos="" currentZoom={100}
                              posterPos="" posterZoom={POSTER_DEFAULT_ZOOM}
                              expandedPos={jtbdGlobalExpandedPos} expandedZoom={jtbdGlobalExpandedZoom}
                              onImgChange={() => {}} onPosChange={() => {}} onZoomChange={() => {}}
                              onPosterPosChange={() => {}} onPosterZoomChange={() => {}}
                              onExpandedPosChange={val => setJtbdGlobalExpandedPos(val || EXPANDED_DEFAULT_POS)}
                              onExpandedZoomChange={val => setJtbdGlobalExpandedZoom(val)}
                              onReset={() => { setJtbdGlobalExpandedPos(EXPANDED_DEFAULT_POS); setJtbdGlobalExpandedZoom(EXPANDED_DEFAULT_ZOOM); }}
                              lockedMode="expanded" hideImageUrl
                            />
                            <div className="mt-3 pt-3 border-t border-gray-800">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <label className="text-[11px] font-semibold text-white block">Overlay Opacity</label>
                                  <p className="text-[10px] text-gray-500">How much the dark overlay dims the background image</p>
                                </div>
                                <span className="text-[12px] font-mono font-bold" style={{ color: '#06b6d4' }}>{jtbdExpandedOverlayOpacity}%</span>
                              </div>
                              <input type="range" min={0} max={90} step={5} value={jtbdExpandedOverlayOpacity} onChange={e => setJtbdExpandedOverlayOpacity(Number(e.target.value))} className="w-full h-1.5 rounded-full appearance-none cursor-pointer" style={{ background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${(jtbdExpandedOverlayOpacity / 90) * 100}%, rgba(255,255,255,0.1) ${(jtbdExpandedOverlayOpacity / 90) * 100}%, rgba(255,255,255,0.1) 100%)`, accentColor: '#06b6d4' }} />
                              <div className="flex justify-between mt-1">
                                <span className="text-[9px] text-gray-700">0% — transparent</span>
                                <span className="text-[9px] text-gray-700">90% — nearly black</span>
                              </div>
                            </div>
                          </div>

                          {/* Per-card image URLs */}
                          <div>
                            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Per-card Image URLs</p>
                            <div className="flex flex-col gap-4">
                              {DEPARTMENTS.map(dept => {
                                const DIcon = dept.icon;
                                return (
                                  <div key={dept.id} className="rounded-xl border border-gray-800 bg-white/[0.02] p-3">
                                    <div className="flex items-center gap-2 mb-2">
                                      <div className="w-6 h-6 rounded flex items-center justify-center" style={{ backgroundColor: `${dept.color}20` }}><DIcon className="w-3 h-3" style={{ color: dept.color }} /></div>
                                      <span className="text-xs font-semibold text-white">{dept.name}</span>
                                      <span className="text-[10px] text-gray-600 ml-1">({dept.jtbd.length} cards)</span>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                      {dept.jtbd.map(job => {
                                        const activeImg = jtbdBgOverrides[job] || JTBD_BG_MAP[job] || '';
                                        const hasCustomImg = !!jtbdBgOverrides[job];
                                        const [posterX, posterY] = (() => {
                                          const pos = jtbdGlobalPosterPos || POSTER_DEFAULT_POS;
                                          const parts = pos.split(' ');
                                          return [parseFloat(parts[0]) || 50, parseFloat(parts[1]) || 50];
                                        })();
                                        const posterScale = (jtbdGlobalPosterZoom || POSTER_DEFAULT_ZOOM) / 100;
                                        return (
                                          <div key={job} className="flex items-center gap-2 rounded-lg bg-black/20 border border-gray-800/40 px-2 py-1.5">
                                            <div className="w-12 h-8 rounded overflow-hidden flex-shrink-0 relative bg-gray-900">
                                              {activeImg && <img src={activeImg} alt="" className="absolute inset-0 w-full h-full" style={{ objectFit: 'cover', objectPosition: `${posterX}% ${posterY}%`, transform: `scale(${posterScale})`, transformOrigin: `${posterX}% ${posterY}%` }} />}
                                              {!activeImg && <div className="absolute inset-0 flex items-center justify-center"><ImageIcon className="w-3 h-3 text-gray-700" /></div>}
                                            </div>
                                            <span className="text-[10px] text-gray-400 w-28 flex-shrink-0 truncate">{job}</span>
                                            <div className="flex-1 flex items-center gap-1 min-w-0">
                                              <Link className="w-2.5 h-2.5 text-gray-600 flex-shrink-0" />
                                              <input type="url" value={jtbdBgOverrides[job] || ''} onChange={e => { const val = e.target.value.trim(); setJtbdBgOverrides(prev => { const n = { ...prev }; if (val) n[job] = val; else delete n[job]; return n; }); }} placeholder="Leave empty for default" className="w-full text-[10px] bg-white/5 border border-gray-700/60 rounded px-1.5 py-0.5 text-gray-300 placeholder:text-gray-600 focus:outline-none focus:border-gray-500" />
                                            </div>
                                            {hasCustomImg && <button onClick={() => setJtbdBgOverrides(prev => { const n = { ...prev }; delete n[job]; return n; })} className="flex-shrink-0 text-gray-500 hover:text-red-400 rounded px-1 py-0.5 transition-colors"><RotateCcw className="w-2.5 h-2.5" /></button>}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Netflix Card Images (conditional) */}
                      {useCasesVariant === 'tabbed_cards_e' && (
                        <div className="border-t border-gray-700/40 pt-1">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(229,9,20,0.15)' }}>
                              <Film className="w-4 h-4" style={{ color: '#E50914' }} />
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-white">Netflix Card Images</h4>
                              <p className="text-xs text-gray-500">Set global position for outer and expanded cards, then pick per-card images</p>
                            </div>
                          </div>

                          <div className="rounded-xl border border-gray-800 bg-white/[0.02] p-3 mb-3">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-5 h-5 rounded flex items-center justify-center" style={{ backgroundColor: 'rgba(229,9,20,0.15)' }}><ImageIcon className="w-3 h-3" style={{ color: '#E50914' }} /></div>
                              <div>
                                <p className="text-[11px] font-semibold text-white">Outer Card Position (all cards)</p>
                                <p className="text-[10px] text-gray-500">Focal point and zoom applied to every poster</p>
                              </div>
                            </div>
                            <NetflixCardEditor
                              job="Global — Outer Card"
                              deptColor="#E50914"
                              defaultImg={JTBD_BG_MAP['Generate creative assets']}
                              currentImg="" currentPos="" currentZoom={100}
                              posterPos={jtbdGlobalPosterPos} posterZoom={jtbdGlobalPosterZoom}
                              expandedPos="" expandedZoom={EXPANDED_DEFAULT_ZOOM}
                              onImgChange={() => {}} onPosChange={() => {}} onZoomChange={() => {}}
                              onPosterPosChange={val => setJtbdGlobalPosterPos(val || POSTER_DEFAULT_POS)}
                              onPosterZoomChange={val => setJtbdGlobalPosterZoom(val)}
                              onExpandedPosChange={() => {}} onExpandedZoomChange={() => {}}
                              onReset={() => { setJtbdGlobalPosterPos(POSTER_DEFAULT_POS); setJtbdGlobalPosterZoom(POSTER_DEFAULT_ZOOM); }}
                              lockedMode="poster" hideImageUrl
                            />
                          </div>

                          <div className="rounded-xl border border-gray-800 bg-white/[0.02] p-3 mb-3">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-5 h-5 rounded flex items-center justify-center" style={{ backgroundColor: 'rgba(229,9,20,0.15)' }}><Maximize2 className="w-3 h-3" style={{ color: '#E50914' }} /></div>
                              <div>
                                <p className="text-[11px] font-semibold text-white">Expanded Card Position (all cards)</p>
                                <p className="text-[10px] text-gray-500">Pan and zoom applied to every expanded inner card</p>
                              </div>
                            </div>
                            <NetflixCardEditor
                              job="Global — Expanded Card"
                              deptColor="#E50914"
                              defaultImg={JTBD_BG_MAP['Generate creative assets']}
                              currentImg="" currentPos="" currentZoom={100}
                              posterPos="" posterZoom={POSTER_DEFAULT_ZOOM}
                              expandedPos={jtbdGlobalExpandedPos} expandedZoom={jtbdGlobalExpandedZoom}
                              onImgChange={() => {}} onPosChange={() => {}} onZoomChange={() => {}
                              } onPosterPosChange={() => {}} onPosterZoomChange={() => {}}
                              onExpandedPosChange={val => setJtbdGlobalExpandedPos(val || EXPANDED_DEFAULT_POS)}
                              onExpandedZoomChange={val => setJtbdGlobalExpandedZoom(val)}
                              onReset={() => { setJtbdGlobalExpandedPos(EXPANDED_DEFAULT_POS); setJtbdGlobalExpandedZoom(EXPANDED_DEFAULT_ZOOM); }}
                              lockedMode="expanded" hideImageUrl
                            />
                            <div className="mt-3 pt-3 border-t border-gray-800">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <label className="text-[11px] font-semibold text-white block">Overlay Opacity</label>
                                  <p className="text-[10px] text-gray-500">How dark the overlay dims the background when a card is expanded</p>
                                </div>
                                <span className="text-[12px] font-mono font-bold" style={{ color: '#E50914' }}>{jtbdExpandedOverlayOpacity}%</span>
                              </div>
                              <input type="range" min={0} max={90} step={5} value={jtbdExpandedOverlayOpacity} onChange={e => setJtbdExpandedOverlayOpacity(Number(e.target.value))} className="w-full h-1.5 rounded-full appearance-none cursor-pointer" style={{ background: `linear-gradient(to right, #E50914 0%, #E50914 ${(jtbdExpandedOverlayOpacity / 90) * 100}%, rgba(255,255,255,0.1) ${(jtbdExpandedOverlayOpacity / 90) * 100}%, rgba(255,255,255,0.1) 100%)`, accentColor: '#E50914' }} />
                              <div className="flex justify-between mt-1">
                                <span className="text-[9px] text-gray-700">0% — transparent</span>
                                <span className="text-[9px] text-gray-700">90% — nearly black</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Per-card Image URLs</p>
                            <div className="flex flex-col gap-4">
                              {DEPARTMENTS.map(dept => {
                                const DIcon = dept.icon;
                                return (
                                  <div key={dept.id} className="rounded-xl border border-gray-800 bg-white/[0.02] p-3">
                                    <div className="flex items-center gap-2 mb-2">
                                      <div className="w-6 h-6 rounded flex items-center justify-center" style={{ backgroundColor: `${dept.color}20` }}><DIcon className="w-3 h-3" style={{ color: dept.color }} /></div>
                                      <span className="text-xs font-semibold text-white">{dept.name}</span>
                                      <span className="text-[10px] text-gray-600 ml-1">({dept.jtbd.length} cards)</span>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                      {dept.jtbd.map(job => {
                                        const activeImg = jtbdBgOverrides[job] || JTBD_BG_MAP[job] || '';
                                        const hasCustomImg = !!jtbdBgOverrides[job];
                                        const [posterX, posterY] = (() => {
                                          const pos = jtbdGlobalPosterPos || POSTER_DEFAULT_POS;
                                          const parts = pos.split(' ');
                                          return [parseFloat(parts[0]) || 50, parseFloat(parts[1]) || 50];
                                        })();
                                        const posterScale = (jtbdGlobalPosterZoom || POSTER_DEFAULT_ZOOM) / 100;
                                        return (
                                          <div key={job} className="flex items-center gap-2 rounded-lg bg-black/20 border border-gray-800/40 px-2 py-1.5">
                                            <div className="w-12 h-8 rounded overflow-hidden flex-shrink-0 relative bg-gray-900">
                                              {activeImg && <img src={activeImg} alt="" className="absolute inset-0 w-full h-full" style={{ objectFit: 'cover', objectPosition: `${posterX}% ${posterY}%`, transform: `scale(${posterScale})`, transformOrigin: `${posterX}% ${posterY}%` }} />}
                                              {!activeImg && <div className="absolute inset-0 flex items-center justify-center"><ImageIcon className="w-3 h-3 text-gray-700" /></div>}
                                            </div>
                                            <span className="text-[10px] text-gray-400 w-28 flex-shrink-0 truncate">{job.replace(/-/g, ' ')}</span>
                                            <div className="flex-1 flex items-center gap-1 min-w-0">
                                              <Link className="w-2.5 h-2.5 text-gray-600 flex-shrink-0" />
                                              <input type="url" value={jtbdBgOverrides[job] || ''} onChange={e => { const val = e.target.value.trim(); setJtbdBgOverrides(prev => { const n = { ...prev }; if (val) n[job] = val; else delete n[job]; return n; }); }} placeholder="Leave empty for default" className="w-full text-[10px] bg-white/5 border border-gray-700/60 rounded px-1.5 py-0.5 text-gray-300 placeholder:text-gray-600 focus:outline-none focus:border-gray-500" />
                                            </div>
                                            {hasCustomImg && <button onClick={() => setJtbdBgOverrides(prev => { const n = { ...prev }; delete n[job]; return n; })} className="flex-shrink-0 text-gray-500 hover:text-red-400 rounded px-1 py-0.5 transition-colors"><RotateCcw className="w-2.5 h-2.5" /></button>}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  );

                  if (section.id === 'vibe') return (
                    <>
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-1">Collage Images</h4>
                        <p className="text-xs text-gray-500 mb-4">Replace the background collage images. Upload a new image for any slot, or leave empty to use the default.</p>
                        <VibeCollageImageGrid
                          overrides={vibeCollageImages}
                          onChange={setVibeCollageImages}
                        />
                      </div>
                    </>
                  );

                  if (section.id === 'agent_catalog') return (
                    <>
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-1">Variant</h4>
                        <p className="text-xs text-gray-500 mb-3">Choose how to display the cross-functional agent catalog</p>
                        <div className="grid grid-cols-2 gap-2">
                          {([
                            { value: 'compact_grid' as const, label: 'Split Panel', desc: 'Sidebar + content view', accent: '#22d3ee' },
                            { value: 'showcase_carousel' as const, label: 'Showcase Carousel', desc: 'One agent spotlight', accent: '#a78bfa' },
                            { value: 'masonry_cards' as const, label: 'Category Sidebar', desc: 'Icon sidebar + agent cards', accent: '#34d399' },
                            { value: 'none' as const, label: 'Hidden', desc: 'Section disabled', accent: '#6b7280' },
                          ] as const).map(opt => {
                            const isSelected = agentCatalogVariant === opt.value;
                            return (
                              <button key={opt.value} onClick={() => setAgentCatalogVariant(opt.value)} className={`relative text-left p-3 rounded-xl border-2 transition-all duration-200 ${isSelected ? 'bg-white/[0.04]' : 'border-gray-700/50 bg-white/[0.02] hover:border-gray-600 hover:bg-white/[0.04]'}`} style={{ borderColor: isSelected ? `${opt.accent}60` : undefined }}>
                                {isSelected && <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: opt.accent }} />}
                                <p className={`text-xs font-semibold mb-0.5 ${isSelected ? 'text-white' : 'text-gray-300'}`}>{opt.label}</p>
                                <p className="text-[10px] text-gray-500">{opt.desc}</p>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Agent carousel toggle */}
                      <div className="pt-4 border-t border-white/[0.06]">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-semibold text-white mb-0.5">Agent Carousel</h4>
                            <p className="text-xs text-gray-500">Show a coverflow carousel of all agents above the catalog</p>
                          </div>
                          <button
                            onClick={() => setShowAgentCarousel(v => !v)}
                            className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${showAgentCarousel ? 'bg-cyan-500' : 'bg-gray-700'}`}
                          >
                            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${showAgentCarousel ? 'translate-x-5' : 'translate-x-0.5'}`} />
                          </button>
                        </div>
                      </div>

                      {/* Agent image overrides */}
                      <div className="pt-4 border-t border-white/[0.06]">
                        <h4 className="text-sm font-semibold text-white mb-1">Agent Images</h4>
                        <p className="text-xs text-gray-500 mb-4">Upload a custom image for each agent. Leave empty to use the default.</p>
                        <AgentImageGrid
                          overrides={agentImageOverrides}
                          onChange={setAgentImageOverrides}
                        />
                      </div>
                    </>
                  );

                  return null;
                })();

                return (
                  <SortableWmSectionCard
                    key={section.id}
                    section={section}
                    index={idx}
                    isVisible={isSectionVisible(section.id)}
                    onToggleVisible={() => toggleSectionVisibility(section.id)}
                    isExpanded={expandedSectionId === section.id}
                    onToggleExpand={() => setExpandedSectionId(prev => prev === section.id ? null : section.id)}
                  >
                    {sectionChildren}
                  </SortableWmSectionCard>
                );
              })}
            </SortableContext>
          </DndContext>
        </div>

        {/* Section Spacing Slider */}
        <div className="mt-6 pt-5 border-t border-gray-800/50">
          <div className="flex items-center justify-between mb-2">
            <div>
              <label className="text-sm font-medium text-white">Section Spacing</label>
              <p className="text-[11px] text-gray-500 mt-0.5">Negative = tighter, positive = more space between sections</p>
            </div>
            <span
              className="text-sm font-mono font-semibold tabular-nums"
              style={{ color: sectionsGap === 0 ? '#6b7280' : sectionsGap < 0 ? '#f59e0b' : '#6161FF' }}
            >
              {sectionsGap > 0 ? '+' : ''}{sectionsGap}px
            </span>
          </div>
          <input
            type="range"
            min={-160}
            max={80}
            step={4}
            value={sectionsGap}
            onChange={e => setSectionsGap(Number(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #6161FF 0%, #6161FF ${((sectionsGap + 160) / 240) * 100}%, rgba(255,255,255,0.1) ${((sectionsGap + 160) / 240) * 100}%, rgba(255,255,255,0.1) 100%)`,
              accentColor: '#6161FF',
            }}
          />
          <div className="flex justify-between mt-1">
            <span className="text-[9px] text-gray-700">-160px (tighter)</span>
            <span className="text-[9px] text-gray-700">0 (default)</span>
            <span className="text-[9px] text-gray-700">+80px (looser)</span>
          </div>
        </div>
      </div>

      {/* Dark Mode Toggle */}
      <div className="bg-[#12131a] rounded-2xl border border-gray-800/60 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${darkMode ? 'bg-indigo-500/20' : 'bg-white/5'}`}>
              <Moon className={`w-5 h-5 ${darkMode ? 'text-indigo-400' : 'text-gray-400'}`} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Dark Mode</h3>
              <p className="text-sm text-gray-500">Switch the entire page to a dark theme</p>
            </div>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`relative w-14 h-7 rounded-full transition-colors duration-200 ${darkMode ? 'bg-indigo-500' : 'bg-gray-700'}`}
          >
            <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-200 ${darkMode ? 'translate-x-7' : 'translate-x-0.5'}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
