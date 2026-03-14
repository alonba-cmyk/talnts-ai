import { useState, useEffect, useCallback } from 'react';
import {
  ExternalLink, GripVertical, Eye, EyeOff, ChevronDown,
  Users, Sparkles, LayoutGrid, Briefcase, BarChart2, List, Search, Megaphone,
} from 'lucide-react';
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

/* ─── Section Metadata ─── */

interface TalntSectionMeta {
  id: string;
  name: string;
  description: string;
  category: string;
  categoryColor: string;
}

const TALNT_SECTIONS: TalntSectionMeta[] = [
  { id: 'hero',         name: 'First Fold',    description: 'Hero animation with title, CTAs, and social proof',        category: 'Hero',    categoryColor: '#6161FF' },
  { id: 'how_it_works', name: 'How It Works',  description: '3-step process cards with mockup visualizations',          category: 'Content', categoryColor: '#10b981' },
  { id: 'mid_section',  name: 'Explore Roles', description: 'Dual-path entry or popular role categories grid',           category: 'Content', categoryColor: '#22d3ee' },
  { id: 'trust',        name: 'Three-Party Trust', description: 'Enterprise-grade safety features: audit trail, kill switch, credential vault', category: 'Content', categoryColor: '#10B981' },
  { id: 'browse_agents','name': 'Browse Agents','description': 'Full searchable agent and job catalog with filters',      category: 'Catalog', categoryColor: '#a78bfa' },
  { id: 'cta',          name: 'CTA',            description: 'Final call-to-action for posting a role or browsing',      category: 'CTA',     categoryColor: '#f59e0b' },
];

const TALNT_DEFAULT_ORDER = TALNT_SECTIONS.map(s => s.id);

/* ─── localStorage keys ─── */

const LS = {
  HERO_VARIANT:      'talnt_hero_variant',
  SOCIAL_PROOF:      'talnt_hero_social_proof',
  MID_VARIANT:       'talnt_mid_section_variant',
  SECTIONS_ORDER:    'talnt_sections_order',
  SECTIONS_VISIBILITY: 'talnt_sections_visibility',
};

type HeroVariant       = 'top_agents' | 'hire_cards' | 'inline_wizard' | 'live_match';
type SocialProofVariant = 'stats' | 'logos';
type MidVariant        = 'dual_path' | 'popular_roles';
type HowItWorksStyle   = 'with_mockups' | 'text_only' | 'minimal_mockups' | 'icon_emphasis';

/* ─── Variant option helpers ─── */

const HERO_VARIANTS: { value: HeroVariant; label: string; description: string; accent: string; badge: string }[] = [
  { value: 'top_agents',    label: 'Top Agents',    description: '3 featured agent cards with trust scores and categories.',             accent: '#7C3AED', badge: 'Default' },
  { value: 'hire_cards',    label: 'Hire Cards',    description: 'Marketplace-style talent cards with availability, rate, and CTA.',     accent: '#10b981', badge: 'Marketplace' },
  { value: 'inline_wizard', label: 'Inline Wizard', description: 'Category-selection grid embedded in the hero — starts the AI wizard.', accent: '#6366F1', badge: 'Interactive' },
  { value: 'live_match',    label: 'Live Match',    description: 'Animated matching engine: roles → agents → teams. Dark cinematic feel.', accent: '#f59e0b', badge: 'Immersive' },
];

const SOCIAL_PROOF_VARIANTS: { value: SocialProofVariant; label: string; description: string; accent: string }[] = [
  { value: 'stats', label: 'Platform Stats', description: '500+ agents, 1,200+ jobs, 98.2% match success, <2hrs response.', accent: '#6366F1' },
  { value: 'logos', label: 'Company Logos',  description: 'Google, Microsoft, NVIDIA and other trusted companies.',          accent: '#22d3ee' },
];

const MID_VARIANTS: { value: MidVariant; label: string; description: string; accent: string }[] = [
  { value: 'dual_path',     label: 'Dual Path',      description: '"Post a role / Find an agent" side-by-side browseable cards.', accent: '#6366F1' },
  { value: 'popular_roles', label: 'Popular Roles',  description: '8 category cards with job counts and accent colors.',            accent: '#22d3ee' },
];

const HOW_IT_WORKS_VARIANTS: { value: HowItWorksStyle; label: string; description: string; accent: string }[] = [
  { value: 'with_mockups',    label: 'Full Mockups',    description: 'Step cards with detailed UI mockups (job card, match bars, timeline).', accent: '#6366F1' },
  { value: 'text_only',       label: 'Text Only',       description: 'Clean cards with icon + label + title + description. No mockups.',       accent: '#10b981' },
  { value: 'minimal_mockups', label: 'Minimal Mockups', description: 'Mockups remain but smaller and faded — subtle visual hint.',             accent: '#f59e0b' },
  { value: 'icon_emphasis',   label: 'Icon Emphasis',   description: 'Centered layout: large glowing icon, step number, title, description.', accent: '#22d3ee' },
];

/* ─── Sortable Section Card ─── */

function SortableTalntSectionCard({
  section, index, isVisible, onToggleVisible, isExpanded, onToggleExpand, children,
}: {
  section: TalntSectionMeta;
  index: number;
  isVisible: boolean;
  onToggleVisible: () => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  children?: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });

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
        {/* Drag handle */}
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1.5 hover:bg-gray-700 rounded-lg flex-shrink-0">
          <GripVertical className="w-4 h-4 text-gray-600" />
        </div>

        {/* Order number */}
        <div className="w-6 h-6 rounded-md bg-gray-700/50 flex items-center justify-center flex-shrink-0">
          <span className="text-[10px] font-bold text-gray-400">{index + 1}</span>
        </div>

        {/* Name + category */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-white font-medium text-sm">{section.name}</span>
            <span
              className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
              style={{ backgroundColor: `${section.categoryColor}20`, color: section.categoryColor }}
            >
              {section.category}
            </span>
          </div>
          <p className="text-gray-500 text-xs truncate">{section.description}</p>
        </div>

        {/* Visibility toggle */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {isVisible ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4 text-gray-600" />}
          <button
            onClick={onToggleVisible}
            className={`relative w-11 h-6 rounded-full transition-colors ${isVisible ? 'bg-emerald-500' : 'bg-gray-700'}`}
          >
            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all shadow-sm ${isVisible ? 'left-5' : 'left-0.5'}`} />
          </button>
        </div>

        {/* Expand chevron — only when section has settings */}
        {hasSettings && (
          <button
            onClick={onToggleExpand}
            className={`p-1.5 rounded-lg transition-all flex-shrink-0 ${
              isExpanded ? 'bg-indigo-600/20 text-indigo-400' : 'text-gray-600 hover:bg-gray-700 hover:text-gray-400'
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
          <div className="pt-5 space-y-6">{children}</div>
        </div>
      )}
    </div>
  );
}

/* ─── Variant Selector ─── */

function VariantSelector<T extends string>({
  label, description, options, value, onChange,
}: {
  label: string;
  description?: string;
  options: { value: T; label: string; description: string; accent: string; badge?: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-white mb-1">{label}</h4>
      {description && <p className="text-xs text-gray-500 mb-3">{description}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {options.map(opt => {
          const isSelected = value === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={`relative text-left p-3 rounded-xl border-2 transition-all duration-200 ${
                isSelected
                  ? 'border-violet-500/60 bg-violet-500/5'
                  : 'border-gray-700/50 bg-white/[0.02] hover:border-gray-600 hover:bg-white/[0.04]'
              }`}
            >
              {opt.badge && (
                <span
                  className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ backgroundColor: `${opt.accent}20`, color: opt.accent }}
                >
                  {opt.badge}
                </span>
              )}
              <div className="flex items-start gap-2">
                <div
                  className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                  style={{ background: isSelected ? opt.accent : '#4b5563' }}
                />
                <div className="min-w-0 flex-1 pr-6">
                  <p className={`text-xs font-semibold mb-0.5 ${isSelected ? 'text-white' : 'text-gray-300'}`}>{opt.label}</p>
                  <p className="text-[10px] text-gray-500 leading-relaxed">{opt.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Main Component ─── */

interface WorkDraftPageSettingsProps {
  onBack: () => void;
  onRegisterSave?: (fn: (() => Promise<void>) | null) => void;
}

export function WorkDraftPageSettings({ onBack, onRegisterSave }: WorkDraftPageSettingsProps) {
  /* State */
  const [heroVariant, setHeroVariant]       = useState<HeroVariant>(() => (localStorage.getItem(LS.HERO_VARIANT) as HeroVariant) ?? 'top_agents');
  const [socialProof, setSocialProof]       = useState<SocialProofVariant>(() => (localStorage.getItem(LS.SOCIAL_PROOF) as SocialProofVariant) ?? 'stats');
  const [midVariant, setMidVariant]         = useState<MidVariant>(() => (localStorage.getItem(LS.MID_VARIANT) as MidVariant) ?? 'dual_path');
  const [howItWorksStyle, setHowItWorksStyle] = useState<HowItWorksStyle>(() => (localStorage.getItem('talnt_how_it_works_style') as HowItWorksStyle) ?? 'with_mockups');
  const [sectionsOrder, setSectionsOrder]   = useState<string[]>(() => {
    let stored: string[];
    try { stored = JSON.parse(localStorage.getItem(LS.SECTIONS_ORDER) ?? '') as string[]; } catch { stored = TALNT_DEFAULT_ORDER; }
    // Merge any new sections that are in TALNT_DEFAULT_ORDER but not in stored order
    const missing = TALNT_DEFAULT_ORDER.filter(id => !stored.includes(id));
    if (missing.length === 0) return stored;
    const ctaIdx = stored.indexOf('cta');
    const insertAt = ctaIdx >= 0 ? ctaIdx : stored.length;
    return [...stored.slice(0, insertAt), ...missing, ...stored.slice(insertAt)];
  });
  const [sectionsVisibility, setSectionsVisibility] = useState<Record<string, boolean>>(() => {
    try { return JSON.parse(localStorage.getItem(LS.SECTIONS_VISIBILITY) ?? '') as Record<string, boolean>; } catch { return {}; }
  });
  const [expandedSectionId, setExpandedSectionId] = useState<string | null>(null);

  /* Sensors */
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  /* Helpers */
  const isSectionVisible = (id: string) => sectionsVisibility[id] !== false;

  const toggleSectionVisibility = (id: string) => {
    setSectionsVisibility(prev => ({ ...prev, [id]: !isSectionVisible(id) }));
  };

  const handleSectionDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = sectionsOrder.indexOf(active.id as string);
    const newIndex = sectionsOrder.indexOf(over.id as string);
    if (oldIndex === -1 || newIndex === -1) return;
    setSectionsOrder(arrayMove(sectionsOrder, oldIndex, newIndex));
  };

  const orderedSections = sectionsOrder
    .map(id => TALNT_SECTIONS.find(s => s.id === id))
    .filter(Boolean) as TalntSectionMeta[];

  /* Save */
  const save = useCallback(async () => {
    localStorage.setItem(LS.HERO_VARIANT, heroVariant);
    localStorage.setItem(LS.SOCIAL_PROOF, socialProof);
    localStorage.setItem(LS.MID_VARIANT, midVariant);
    localStorage.setItem('talnt_how_it_works_style', howItWorksStyle);
    localStorage.setItem(LS.SECTIONS_ORDER, JSON.stringify(sectionsOrder));
    localStorage.setItem(LS.SECTIONS_VISIBILITY, JSON.stringify(sectionsVisibility));
  }, [heroVariant, socialProof, midVariant, howItWorksStyle, sectionsOrder, sectionsVisibility]);

  useEffect(() => {
    onRegisterSave?.(save);
    return () => onRegisterSave?.(null);
  }, [save, onRegisterSave]);

  const previewUrl = '/talnt';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white font-bold text-xl">Talnt Page Settings</h2>
          <p className="text-gray-500 text-sm mt-0.5">AI agent hiring marketplace at /talnt</p>
        </div>
        <a
          href={previewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-sm font-medium rounded-xl border border-gray-700 transition-all"
        >
          <ExternalLink className="w-4 h-4" />
          Preview Page
        </a>
      </div>

      {/* Page Sections */}
      <div className="bg-gray-900/50 rounded-2xl border border-gray-800/60 p-6">
        <div className="flex items-center gap-2 mb-1">
          <LayoutGrid className="w-4 h-4 text-gray-400" />
          <h3 className="text-white font-semibold text-base">Page Sections</h3>
        </div>
        <p className="text-gray-500 text-sm mb-5">Drag to reorder sections, toggle visibility on/off</p>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleSectionDragEnd}>
          <SortableContext items={sectionsOrder} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
              {orderedSections.map((section, idx) => {
                /* Per-section expandable settings */
                const sectionChildren = (() => {
                  if (section.id === 'hero') return (
                    <>
                      <VariantSelector
                        label="Hero Style"
                        description="Choose the visual treatment for the right side of the hero section"
                        options={HERO_VARIANTS}
                        value={heroVariant}
                        onChange={setHeroVariant}
                      />
                      <div className="border-t border-gray-700/40 pt-1">
                        <VariantSelector
                          label="Social Proof"
                          description="What to show below the hero CTAs"
                          options={SOCIAL_PROOF_VARIANTS}
                          value={socialProof}
                          onChange={setSocialProof}
                        />
              </div>
                    </>
                  );

                  if (section.id === 'mid_section') return (
                    <VariantSelector
                      label="Layout"
                      description="How to display the roles/agents discovery section"
                      options={MID_VARIANTS}
                      value={midVariant}
                      onChange={setMidVariant}
                    />
                  );

                  if (section.id === 'how_it_works') return (
                    <VariantSelector
                      label="Display Style"
                      description="How to render the step mockups in the How It Works section"
                      options={HOW_IT_WORKS_VARIANTS}
                      value={howItWorksStyle}
                      onChange={setHowItWorksStyle}
                    />
                  );

                  return null;
                })();

                return (
                  <SortableTalntSectionCard
                    key={section.id}
                    section={section}
                    index={idx}
                    isVisible={isSectionVisible(section.id)}
                    onToggleVisible={() => toggleSectionVisibility(section.id)}
                    isExpanded={expandedSectionId === section.id}
                    onToggleExpand={() => setExpandedSectionId(prev => prev === section.id ? null : section.id)}
                  >
                    {sectionChildren}
                  </SortableTalntSectionCard>
                );
              })}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* Footer buttons */}
      <div className="flex gap-3">
        <a
          href={previewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-3 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #7C3AED, #6366F1)' }}
        >
          <ExternalLink className="w-4 h-4" />
          Preview Page
        </a>
        <button
          onClick={onBack}
          className="px-5 py-3 rounded-xl text-gray-400 hover:text-white text-sm font-medium transition-colors border border-gray-700 hover:border-gray-600"
        >
          Back
        </button>
      </div>
    </div>
  );
}
