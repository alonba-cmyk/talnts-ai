import { useState, useEffect, useCallback } from 'react';
import { Save, CheckCircle, ArrowLeft, LayoutGrid, Layers, Moon, Sparkles, ChevronUp, ChevronDown, Palette, Zap, Eye, Film, MessageSquare, Columns, GitBranch, Square, Minus, PanelRight, PanelLeftClose, AlignVerticalSpaceAround } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useDesignAssets } from '@/hooks/useSupabase';
import { DEPARTMENTS } from '@/app/components/workManagement/wmDepartmentData';
import { SQUAD_DEPARTMENTS } from '@/app/components/workManagement/WorkManagementSquadSection';

type WmLayersVariant = 'grid' | 'masonry_expand';
type WmBentoStyle = 'dark_gradient' | 'glass_blur';
type WmFirstFoldVariant = 'default' | 'live_delegation' | 'cinematic_assembly' | 'split_reveal' | 'roster_board';
type WmRosterLayout = 'mirrored' | 'vertical';
type WmBoardStyle = 'default' | 'kanban' | 'workflow' | 'focused' | 'minimal';
type WmCardLayout = 'default' | 'board_only' | 'compact_squad' | 'squad_header';

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

export function WorkManagementPageSettings({ onBack }: { onBack: () => void }) {
  const [selectedVariant, setSelectedVariant] = useState<WmLayersVariant>('grid');
  const [selectedBentoStyle, setSelectedBentoStyle] = useState<WmBentoStyle>('dark_gradient');
  const [selectedFirstFoldVariant, setSelectedFirstFoldVariant] = useState<WmFirstFoldVariant>('default');
  const [darkMode, setDarkMode] = useState(false);
  const [squadSplitChat, setSquadSplitChat] = useState(false);
  const [rosterLayout, setRosterLayout] = useState<WmRosterLayout>('mirrored');
  const [boardStyle, setBoardStyle] = useState<WmBoardStyle>('default');
  const [cardLayout, setCardLayout] = useState<WmCardLayout>('default');
  const [avatarOverrides, setAvatarOverrides] = useState<Record<string, string>>({});
  const [memberAvatarOverrides, setMemberAvatarOverrides] = useState<Record<string, string>>({});
  const [colorOverrides, setColorOverrides] = useState<Record<string, string>>({});
  const [deptOrder, setDeptOrder] = useState<string[]>(() => DEPARTMENTS.map(d => d.id));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const { assets: avatarAssets } = useDesignAssets('department_avatar');
  const allAvatarImages = avatarAssets.map(a => a.file_url);

  useEffect(() => {
    loadSettings();
  }, []);

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
            <h2 className="text-2xl font-bold text-white">Work Management Page</h2>
            <p className="text-sm text-gray-500 mt-1">Configure the platform layers section</p>
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

      {/* Squad Split & Chat Toggle */}
      <div className="bg-[#12131a] rounded-2xl border border-gray-800/60 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${squadSplitChat ? 'bg-violet-500/20' : 'bg-white/5'}`}>
              <MessageSquare className={`w-5 h-5 ${squadSplitChat ? 'text-violet-400' : 'text-gray-400'}`} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Squad Split & Chat</h3>
              <p className="text-sm text-gray-500">After a few seconds, humans and agents separate and exchange messages</p>
            </div>
          </div>
          <button
            onClick={() => setSquadSplitChat(!squadSplitChat)}
            className={`relative w-14 h-7 rounded-full transition-colors duration-200 ${squadSplitChat ? 'bg-violet-500' : 'bg-gray-700'}`}
          >
            <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-200 ${squadSplitChat ? 'translate-x-7' : 'translate-x-0.5'}`} />
          </button>
        </div>
      </div>

      {/* Roster Layout (only when split chat is on) */}
      {squadSplitChat && (
        <div className="bg-[#12131a] rounded-2xl border border-gray-800/60 p-6">
          <h3 className="text-lg font-semibold text-white mb-1">Roster Layout Style</h3>
          <p className="text-sm text-gray-500 mb-5">Choose how people and agents are arranged in the split chat view</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {([
              { value: 'mirrored' as const, label: 'Mirrored Horizontal', desc: 'People on left face agents on right — bubbles appear between them horizontally', accent: '#6161ff' },
              { value: 'vertical' as const, label: 'Vertical Cards', desc: 'Avatars stacked vertically with names and bubbles underneath each one', accent: '#00d2d2' },
            ]).map(opt => {
              const isSelected = rosterLayout === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setRosterLayout(opt.value)}
                  className={`relative text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                    isSelected
                      ? 'border-violet-500/60 bg-violet-500/5'
                      : 'border-gray-800 bg-white/[0.02] hover:border-gray-700 hover:bg-white/[0.04]'
                  }`}
                >
                  <p className={`text-sm font-semibold mb-1 ${isSelected ? 'text-white' : 'text-gray-300'}`}>{opt.label}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{opt.desc}</p>
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-2 h-2 rounded-full" style={{ backgroundColor: opt.accent }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* First Fold Hero Variant */}
      <div className="bg-[#12131a] rounded-2xl border border-gray-800/60 p-6">
        <h3 className="text-lg font-semibold text-white mb-1">First Fold Hero Style</h3>
        <p className="text-sm text-gray-500 mb-5">Choose the visual treatment for the hero section at the top of the page</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FIRST_FOLD_VARIANT_OPTIONS.map((option) => {
            const isSelected = selectedFirstFoldVariant === option.value;
            return (
              <button
                key={option.value}
                onClick={() => setSelectedFirstFoldVariant(option.value)}
                className={`
                  relative text-left p-4 rounded-xl border-2 transition-all duration-200
                  ${isSelected
                    ? 'border-violet-500/60 bg-violet-500/5'
                    : 'border-gray-800 bg-white/[0.02] hover:border-gray-700 hover:bg-white/[0.04]'
                  }
                `}
              >
                {option.badge && (
                  <span
                    className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: `${option.accent}20`, color: option.accent }}
                  >
                    {option.badge}
                  </span>
                )}
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{
                      backgroundColor: isSelected ? `${option.accent}20` : 'rgba(255,255,255,0.04)',
                      color: isSelected ? option.accent : '#6b7280',
                    }}
                  >
                    {option.icon}
                  </div>
                  <div className="min-w-0 flex-1 pr-8">
                    <p className={`text-sm font-semibold mb-1 ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                      {option.label}
                    </p>
                    <p className="text-xs text-gray-500 leading-relaxed">{option.description}</p>
                  </div>
                </div>
                {isSelected && (
                  <div
                    className="absolute top-3 left-3 w-2 h-2 rounded-full"
                    style={{ backgroundColor: option.accent }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Board Card Style */}
      <div className="bg-[#12131a] rounded-2xl border border-gray-800/60 p-6">
        <h3 className="text-lg font-semibold text-white mb-1">Board Card Style</h3>
        <p className="text-sm text-gray-500 mb-5">Choose how the task board / work surface is displayed inside the card</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {BOARD_STYLE_OPTIONS.map((option) => {
            const isSelected = boardStyle === option.value;
            return (
              <button
                key={option.value}
                onClick={() => setBoardStyle(option.value)}
                className={`
                  relative text-left p-4 rounded-xl border-2 transition-all duration-200
                  ${isSelected
                    ? 'border-violet-500/60 bg-violet-500/5'
                    : 'border-gray-800 bg-white/[0.02] hover:border-gray-700 hover:bg-white/[0.04]'
                  }
                `}
              >
                {option.badge && (
                  <span
                    className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: `${option.accent}20`, color: option.accent }}
                  >
                    {option.badge}
                  </span>
                )}
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{
                      backgroundColor: isSelected ? `${option.accent}20` : 'rgba(255,255,255,0.04)',
                      color: isSelected ? option.accent : '#6b7280',
                    }}
                  >
                    {option.icon}
                  </div>
                  <div className="min-w-0 flex-1 pr-8">
                    <p className={`text-sm font-semibold mb-1 ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                      {option.label}
                    </p>
                    <p className="text-xs text-gray-500 leading-relaxed">{option.description}</p>
                  </div>
                </div>
                {isSelected && (
                  <div
                    className="absolute top-3 left-3 w-2 h-2 rounded-full"
                    style={{ backgroundColor: option.accent }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Card Layout */}
      <div className="bg-[#12131a] rounded-2xl border border-gray-800/60 p-6">
        <h3 className="text-lg font-semibold text-white mb-1">Card Layout</h3>
        <p className="text-sm text-gray-500 mb-5">Choose how the Squad panel and Board are arranged inside the card</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CARD_LAYOUT_OPTIONS.map((option) => {
            const isSelected = cardLayout === option.value;
            return (
              <button
                key={option.value}
                onClick={() => setCardLayout(option.value)}
                className={`
                  relative text-left p-4 rounded-xl border-2 transition-all duration-200
                  ${isSelected
                    ? 'border-violet-500/60 bg-violet-500/5'
                    : 'border-gray-800 bg-white/[0.02] hover:border-gray-700 hover:bg-white/[0.04]'
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{
                      backgroundColor: isSelected ? `${option.accent}20` : 'rgba(255,255,255,0.04)',
                      color: isSelected ? option.accent : '#6b7280',
                    }}
                  >
                    {option.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-semibold mb-1 ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                      {option.label}
                    </p>
                    <p className="text-xs text-gray-500 leading-relaxed">{option.description}</p>
                  </div>
                </div>
                {isSelected && (
                  <div
                    className="absolute top-3 right-3 w-2 h-2 rounded-full"
                    style={{ backgroundColor: option.accent }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Platform Layers Variant */}
      <div className="bg-[#12131a] rounded-2xl border border-gray-800/60 p-6">
        <h3 className="text-lg font-semibold text-white mb-1">Platform Layers Visualization</h3>
        <p className="text-sm text-gray-500 mb-5">Choose how the "Three powerful layers" section is displayed</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {VARIANT_OPTIONS.map((option) => {
            const isSelected = selectedVariant === option.value;
            return (
              <button
                key={option.value}
                onClick={() => setSelectedVariant(option.value)}
                className={`
                  relative text-left p-4 rounded-xl border-2 transition-all duration-200
                  ${isSelected
                    ? 'border-emerald-500/60 bg-emerald-500/5'
                    : 'border-gray-800 bg-white/[0.02] hover:border-gray-700 hover:bg-white/[0.04]'
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: isSelected ? `${option.accent}20` : 'rgba(255,255,255,0.05)',
                      color: isSelected ? option.accent : '#9ca3af',
                    }}
                  >
                    {option.icon}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                      {option.label}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{option.description}</p>
                  </div>
                </div>
                {isSelected && (
                  <div
                    className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: option.accent }}
                  >
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bento Card Style (only for masonry_expand) */}
      {selectedVariant === 'masonry_expand' && (
        <div className="bg-[#12131a] rounded-2xl border border-gray-800/60 p-6">
          <h3 className="text-lg font-semibold text-white mb-1">Bento Card Style</h3>
          <p className="text-sm text-gray-500 mb-5">Choose the visual style for the bento cards</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {BENTO_STYLE_OPTIONS.map((option) => {
              const isSelected = selectedBentoStyle === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => setSelectedBentoStyle(option.value)}
                  className={`
                    relative text-left p-4 rounded-xl border-2 transition-all duration-200
                    ${isSelected
                      ? 'border-emerald-500/60 bg-emerald-500/5'
                      : 'border-gray-800 bg-white/[0.02] hover:border-gray-700 hover:bg-white/[0.04]'
                    }
                  `}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: isSelected ? `${option.accent}20` : 'rgba(255,255,255,0.05)',
                        color: isSelected ? option.accent : '#9ca3af',
                      }}
                    >
                      {option.icon}
                    </div>
                    <div className="min-w-0">
                      <p className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                        {option.label}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">{option.description}</p>
                    </div>
                  </div>
                  {isSelected && (
                    <div
                      className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: option.accent }}
                    >
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Department Customization */}
      <div className="bg-[#12131a] rounded-2xl border border-gray-800/60 p-6">
        <div className="flex items-center gap-3 mb-1">
          <Palette className="w-5 h-5 text-[#f59e0b]" />
          <h3 className="text-lg font-semibold text-white">Department Customization</h3>
        </div>
        <p className="text-sm text-gray-500 mb-6">Reorder departments, assign lead images, and set background colors</p>

        <div className="flex flex-col gap-3">
          {orderedDepts.map((dept, idx) => {
            const DIcon = dept.icon;
            const currentColor = colorOverrides[dept.id] || dept.color;
            const currentAvatar = avatarOverrides[dept.id] || '';

            return (
              <div
                key={dept.id}
                className="rounded-xl border border-gray-800 bg-white/[0.02] p-4"
              >
                <div className="flex items-center gap-3 mb-3">
                  {/* Reorder buttons */}
                  <div className="flex flex-col gap-0.5">
                    <button
                      onClick={() => moveDept(idx, -1)}
                      disabled={idx === 0}
                      className="w-6 h-6 rounded flex items-center justify-center bg-white/5 hover:bg-white/10 disabled:opacity-20 disabled:hover:bg-white/5 transition-colors"
                    >
                      <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                    <button
                      onClick={() => moveDept(idx, 1)}
                      disabled={idx === orderedDepts.length - 1}
                      className="w-6 h-6 rounded flex items-center justify-center bg-white/5 hover:bg-white/10 disabled:opacity-20 disabled:hover:bg-white/5 transition-colors"
                    >
                      <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                  </div>

                  {/* Dept icon + name */}
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${currentColor}20` }}
                  >
                    <DIcon className="w-4.5 h-4.5" style={{ color: currentColor }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">{dept.name}</p>
                    <p className="text-[11px] text-gray-500">{dept.description}</p>
                  </div>

                  {/* Color picker */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Color</span>
                    <label className="relative cursor-pointer">
                      <div
                        className="w-8 h-8 rounded-lg border-2 border-gray-700 hover:border-gray-500 transition-colors"
                        style={{ backgroundColor: currentColor }}
                      />
                      <input
                        type="color"
                        value={currentColor}
                        onChange={(e) => setColorOverrides(prev => ({ ...prev, [dept.id]: e.target.value }))}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                    </label>
                  </div>
                </div>

                {/* Image picker */}
                <div className="mt-2">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mb-2">Lead Image</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* No image option */}
                    <button
                      onClick={() => setAvatarOverrides(prev => {
                        const next = { ...prev };
                        delete next[dept.id];
                        return next;
                      })}
                      className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                        !currentAvatar
                          ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-[#12131a]'
                          : 'opacity-50 hover:opacity-80'
                      }`}
                      style={{ backgroundColor: `${currentColor}30` }}
                    >
                      <DIcon className="w-4 h-4" style={{ color: currentColor }} />
                    </button>

                    {allAvatarImages.map((img, imgIdx) => {
                      const isSelected = currentAvatar === img;
                      return (
                        <button
                          key={imgIdx}
                          onClick={() => setAvatarOverrides(prev => ({ ...prev, [dept.id]: img }))}
                          className={`w-11 h-11 rounded-full transition-all flex-shrink-0 flex items-center justify-center ${
                            isSelected
                              ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-[#12131a]'
                              : 'opacity-50 hover:opacity-80'
                          }`}
                          style={{ backgroundColor: currentColor, padding: '2.5px' }}
                        >
                          <div className="w-full h-full rounded-full overflow-hidden">
                            <img src={img} alt="" className="w-full h-full object-cover" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {allAvatarImages.length === 0 && (
                    <p className="text-[10px] text-gray-600 mt-1">No avatars found. Add images in Design Assets → Department Avatars.</p>
                  )}
                </div>

                {/* Team member image pickers */}
                {(() => {
                  const squadDept = SQUAD_DEPARTMENTS.find(sd => sd.id === dept.id);
                  if (!squadDept) return null;
                  const humanMembers = squadDept.members.filter(m => !m.isAgent && m.role !== 'Team Lead');
                  if (humanMembers.length === 0) return null;
                  return (
                    <div className="mt-3 pt-3 border-t border-gray-800/50">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mb-2">Team Member Images</p>
                      <div className="flex flex-col gap-3">
                        {humanMembers.map(member => {
                          const currentImg = memberAvatarOverrides[member.id] || '';
                          return (
                            <div key={member.id}>
                              <p className="text-[11px] text-gray-400 mb-1.5">{member.label}</p>
                              <div className="flex items-center gap-2 flex-wrap">
                                <button
                                  onClick={() => setMemberAvatarOverrides(prev => {
                                    const next = { ...prev };
                                    delete next[member.id];
                                    return next;
                                  })}
                                  className={`w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                                    !currentImg
                                      ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-[#12131a]'
                                      : 'opacity-50 hover:opacity-80'
                                  }`}
                                  style={{ backgroundColor: `${currentColor}30`, color: currentColor }}
                                  title="Auto (pool rotation)"
                                >
                                  {member.fallback || 'A'}
                                </button>
                                {allAvatarImages.map((img, imgIdx) => {
                                  const isSelected = currentImg === img;
                                  return (
                                    <button
                                      key={imgIdx}
                                      onClick={() => setMemberAvatarOverrides(prev => ({ ...prev, [member.id]: img }))}
                                      className={`w-10 h-10 rounded-full transition-all flex-shrink-0 flex items-center justify-center ${
                                        isSelected
                                          ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-[#12131a]'
                                          : 'opacity-50 hover:opacity-80'
                                      }`}
                                      style={{ backgroundColor: currentColor, padding: '2px' }}
                                    >
                                      <div className="w-full h-full rounded-full overflow-hidden">
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                      </div>
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
            );
          })}
        </div>
      </div>
    </div>
  );
}
