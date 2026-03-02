import { useState, useEffect } from 'react';
import { Save, ExternalLink, Terminal, Code2, Radar, CheckCircle, FileText, Bot, Cpu, ScanLine, Eye, FileCode, Sparkles, Layers, Plug, Zap, Crown, Type, Activity, LayoutGrid, Radio, Ban } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type AgentsContentStyle = 'v1' | 'v2';
type AgentsPageLayout = 'visual' | 'plain_text';

type AgentHeroVariant = 'matrix' | 'matrix_v2' | 'radar' | 'mcp_connect' | 'branded';
type MessagingTone = 'belong_here' | 'pure_machine' | 'machine_personality' | 'agent_pov' | 'system_native';

interface VariantOption {
  value: AgentHeroVariant;
  label: string;
  description: string;
  icon: React.ReactNode;
  accent: string;
}

const VARIANT_OPTIONS: VariantOption[] = [
  {
    value: 'matrix',
    label: 'Matrix Rain',
    description: 'Falling characters in brand colors with monday logo and typing animation',
    icon: <Terminal className="w-5 h-5" />,
    accent: '#00ff41',
  },
  {
    value: 'matrix_v2',
    label: 'Matrix V2',
    description: 'Improved matrix with instant headline, bold CTA, social proof, and subtle rain',
    icon: <Zap className="w-5 h-5" />,
    accent: '#00ff41',
  },
  {
    value: 'radar',
    label: 'Radar Scan',
    description: 'Rotating radar sweep in brand colors that progressively reveals content',
    icon: <Radar className="w-5 h-5" />,
    accent: '#FFCB00',
  },
  {
    value: 'mcp_connect',
    label: 'MCP Connect',
    description: 'MCP READY badge with Works with AI framework logos strip',
    icon: <Plug className="w-5 h-5" />,
    accent: '#6161FF',
  },
  {
    value: 'branded',
    label: 'Branded',
    description: 'Clean product hero with monday logo, "monday for agents" title, and Agent/Human toggle',
    icon: <Crown className="w-5 h-5" />,
    accent: '#00D2D2',
  },
];

interface ToneOption {
  value: MessagingTone;
  label: string;
  description: string;
  example: string;
  icon: React.ReactNode;
  accent: string;
}

const TONE_OPTIONS: ToneOption[] = [
  {
    value: 'belong_here',
    label: 'You Belong Here',
    description: 'Welcoming, warm language. Invites agents as first-class members with open arms.',
    example: '"You belong here."',
    icon: <Bot className="w-5 h-5" />,
    accent: '#00ff41',
  },
  {
    value: 'pure_machine',
    label: 'Spec Sheet',
    description: 'Dry, factual, structured. Like API docs or a README an agent would parse.',
    example: '"PLATFORM: monday.com | ACCESS: ENABLED"',
    icon: <FileText className="w-5 h-5" />,
    accent: '#00D2D2',
  },
  {
    value: 'machine_personality',
    label: 'Agent Talk',
    description: 'Direct language with humor. Acknowledges the agent, slightly playful.',
    example: '"Your human sent you here. Smart human."',
    icon: <Cpu className="w-5 h-5" />,
    accent: '#6161FF',
  },
  {
    value: 'agent_pov',
    label: 'System Briefing',
    description: 'Machine-to-machine. The page detected an agent and presents a structured briefing.',
    example: '"[AGENT_DETECTED] Initializing briefing..."',
    icon: <ScanLine className="w-5 h-5" />,
    accent: '#FFCB00',
  },
  {
    value: 'system_native',
    label: 'Code Native',
    description: 'Speaks in code. Everything reads like JavaScript/CLI — as if an agent wrote the page for other agents.',
    example: '"await workspace.provision({ tier: \\"free\\" })"',
    icon: <Code2 className="w-5 h-5" />,
    accent: '#FF3D57',
  },
];

interface AgentsPageSettingsProps {
  onBack: () => void;
}

export function AgentsPageSettings({ onBack }: AgentsPageSettingsProps) {
  const [selectedContentStyle, setSelectedContentStyle] = useState<AgentsContentStyle>('v1');
  const [selectedLayout, setSelectedLayout] = useState<AgentsPageLayout>('visual');
  const [selectedVariant, setSelectedVariant] = useState<AgentHeroVariant>('matrix');
  const [selectedTone, setSelectedTone] = useState<MessagingTone>('belong_here');
  const [showFrameworks, setShowFrameworks] = useState(false);
  const [brandedTitleStyle, setBrandedTitleStyle] = useState<'svg' | 'ascii'>('ascii');
  const [brandedGlowStyle, setBrandedGlowStyle] = useState<'wide' | 'logo'>('wide');
  const [heroDemoStyle, setHeroDemoStyle] = useState<'none' | 'floating_terminal' | 'toasts' | 'typing_agent' | 'bg_stream' | 'agent_cursor'>('none');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

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
        if (sv._agents_content_style) {
          setSelectedContentStyle(sv._agents_content_style as AgentsContentStyle);
        }
        if (sv._agents_page_layout) {
          setSelectedLayout(sv._agents_page_layout as AgentsPageLayout);
        }
        if (sv._agents_hero_variant) {
          const v = sv._agents_hero_variant as string;
          const deprecated = ['boot', 'neural', 'glitch', 'cli', 'agents_grid', 'agents_marquee', 'gotcha_gate', 'api_blueprint', 'signup_60s'];
          setSelectedVariant(
            deprecated.includes(v) ? 'matrix' : (v as AgentHeroVariant)
          );
        }
        if (sv._agents_messaging_tone) {
          setSelectedTone(sv._agents_messaging_tone as MessagingTone);
        }
        if (sv._agents_show_frameworks !== undefined) {
          setShowFrameworks(sv._agents_show_frameworks as boolean);
        }
        if (sv._agents_branded_title_style) {
          setBrandedTitleStyle(sv._agents_branded_title_style as 'svg' | 'ascii');
        }
        if (sv._agents_branded_glow_style) {
          setBrandedGlowStyle(sv._agents_branded_glow_style as 'wide' | 'logo');
        }
        if (sv._agents_hero_demo) {
          const demo = sv._agents_hero_demo as string;
          setHeroDemoStyle((demo === 'scroll_reveal' ? 'none' : demo) as 'none' | 'floating_terminal' | 'toasts' | 'typing_agent' | 'bg_stream' | 'agent_cursor');
        }
      }
    } catch (err) {
      console.log('No agents settings found, using defaults');
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
            _agents_content_style: selectedContentStyle,
            _agents_page_layout: selectedLayout,
            _agents_hero_variant: selectedVariant,
            _agents_messaging_tone: selectedTone,
            _agents_show_frameworks: showFrameworks,
            _agents_branded_title_style: brandedTitleStyle,
            _agents_branded_glow_style: brandedGlowStyle,
            _agents_hero_demo: heroDemoStyle,
          },
        });

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Failed to save agents settings:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-gray-400">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a
            href="/agents"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 text-sm transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Preview /agents
          </a>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            saved
              ? 'bg-green-600 text-white'
              : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-lg shadow-green-900/20'
          }`}
        >
          {saved ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Saved!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Settings'}
            </>
          )}
        </button>
      </div>

      {/* Content Style Toggle */}
      <div className="bg-gray-900/60 rounded-2xl border border-gray-800/60 p-6">
        <h3 className="text-white font-semibold text-lg mb-2">Content Style</h3>
        <p className="text-gray-500 text-sm mb-6">
          Choose which version of the page content to display. V1 is the original terminal-style aesthetic. V2 uses clear English prose based on the for-agents.md document.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {([
            { value: 'v1' as const, label: 'V1 — Original', description: 'Terminal-style aesthetic with animated sections, code blocks, and multiple messaging tones. The current design.', icon: <Layers className="w-5 h-5" />, accent: '#6161FF' },
            { value: 'v2' as const, label: 'V2 — Clear Content', description: 'Clear English prose based on the for-agents.md document. Every section explained, real code examples, readable by both agents and humans.', icon: <Sparkles className="w-5 h-5" />, accent: '#00D2D2' },
          ]).map((option) => {
            const isSelected = selectedContentStyle === option.value;
            return (
              <button
                key={option.value}
                onClick={() => setSelectedContentStyle(option.value)}
                className={`relative p-4 rounded-xl text-left transition-all duration-200 ${
                  isSelected
                    ? 'ring-2 bg-gray-800/80'
                    : 'bg-gray-800/30 border-2 border-transparent hover:bg-gray-800/50 hover:border-gray-700'
                }`}
                style={isSelected ? { ringColor: option.accent, borderColor: option.accent } : {}}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: option.accent }}>
                      <CheckCircle className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>
                )}
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                  style={{ backgroundColor: `${option.accent}20`, color: option.accent }}>
                  {option.icon}
                </div>
                <h4 className={`font-medium text-sm mb-1 ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                  {option.label}
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {option.description}
                </p>
              </button>
            );
          })}
        </div>

        {selectedContentStyle === 'v2' && (
          <div className="mt-4 p-3 rounded-lg bg-green-900/20 border border-green-800/30">
            <p className="text-xs text-green-400">
              V2 replaces the page layout, messaging tone, and all section content below the hero with clear prose. Hero variant selection still applies.
            </p>
          </div>
        )}
      </div>

      {/* Page Layout Toggle */}
      <div className={`bg-gray-900/60 rounded-2xl border border-gray-800/60 p-6 ${selectedContentStyle === 'v2' ? 'opacity-40 pointer-events-none' : ''}`}>
        <h3 className="text-white font-semibold text-lg mb-2">Page Layout {selectedContentStyle === 'v2' && <span className="text-xs text-gray-500 font-normal ml-2">(V1 only)</span>}</h3>
        <p className="text-gray-500 text-sm mb-6">
          Choose how the page body renders below the hero. Visual uses animated terminals and effects. Plain Text renders a flat document that agents can parse directly.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {([
            { value: 'visual' as const, label: 'Visual', description: 'Animated terminals, scroll effects, interactive code playground. Impressive for humans watching.', icon: <Eye className="w-5 h-5" />, accent: '#6161FF' },
            { value: 'plain_text' as const, label: 'Plain Text', description: 'Flat document with no animations. Pure text, code blocks, and specs. Optimized for agent parsing.', icon: <FileCode className="w-5 h-5" />, accent: '#00ff41' },
          ]).map((option) => {
            const isSelected = selectedLayout === option.value;
            return (
              <button
                key={option.value}
                onClick={() => setSelectedLayout(option.value)}
                className={`relative p-4 rounded-xl text-left transition-all duration-200 ${
                  isSelected
                    ? 'ring-2 bg-gray-800/80'
                    : 'bg-gray-800/30 border-2 border-transparent hover:bg-gray-800/50 hover:border-gray-700'
                }`}
                style={isSelected ? { ringColor: option.accent, borderColor: option.accent } : {}}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: option.accent }}>
                      <CheckCircle className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>
                )}
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                  style={{ backgroundColor: `${option.accent}20`, color: option.accent }}>
                  {option.icon}
                </div>
                <h4 className={`font-medium text-sm mb-1 ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                  {option.label}
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {option.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Hero Variant Selector */}
      <div className="bg-gray-900/60 rounded-2xl border border-gray-800/60 p-6">
        <h3 className="text-white font-semibold text-lg mb-2">Hero Variant</h3>
        <p className="text-gray-500 text-sm mb-6">
          Choose the first-fold animation style for the /agents page. All variants incorporate the monday.com brand palette.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {VARIANT_OPTIONS.map((option) => {
            const isSelected = selectedVariant === option.value;
            return (
              <button
                key={option.value}
                onClick={() => setSelectedVariant(option.value)}
                className={`relative p-4 rounded-xl text-left transition-all duration-200 ${
                  isSelected
                    ? 'ring-2 bg-gray-800/80'
                    : 'bg-gray-800/30 border-2 border-transparent hover:bg-gray-800/50 hover:border-gray-700'
                }`}
                style={isSelected ? { ringColor: option.accent, borderColor: option.accent } : {}}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: option.accent }}>
                      <CheckCircle className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>
                )}

                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                  style={{ backgroundColor: `${option.accent}20`, color: option.accent }}>
                  {option.icon}
                </div>

                <h4 className={`font-medium text-sm mb-1 ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                  {option.label}
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {option.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Branded Title Style (only visible when Branded variant is selected) */}
      {selectedVariant === 'branded' && (
        <div className="bg-gray-900/60 rounded-2xl border border-gray-800/60 p-6">
          <h3 className="text-white font-semibold text-lg mb-2">Branded Title Style</h3>
          <p className="text-gray-500 text-sm mb-6">
            Choose the title style for the Branded hero variant.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {([
              { value: 'ascii' as const, label: 'ASCII Art', description: 'Pixel-art style "MONDAY" text with brand gradient, same as Matrix & Radar variants.', icon: <Terminal className="w-5 h-5" />, accent: '#00D2D2' },
              { value: 'svg' as const, label: 'SVG Wordmark', description: 'Clean monday logo mark + "monday for agents" SVG wordmark with glow effect.', icon: <Type className="w-5 h-5" />, accent: '#6161FF' },
            ]).map((option) => {
              const isSelected = brandedTitleStyle === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => setBrandedTitleStyle(option.value)}
                  className={`relative p-4 rounded-xl text-left transition-all duration-200 ${
                    isSelected
                      ? 'ring-2 bg-gray-800/80'
                      : 'bg-gray-800/30 border-2 border-transparent hover:bg-gray-800/50 hover:border-gray-700'
                  }`}
                  style={isSelected ? { ringColor: option.accent, borderColor: option.accent } : {}}
                >
                  {isSelected && (
                    <div className="absolute top-3 right-3">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: option.accent }}>
                        <CheckCircle className="w-3.5 h-3.5 text-white" />
                      </div>
                    </div>
                  )}
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                    style={{ backgroundColor: `${option.accent}20`, color: option.accent }}>
                    {option.icon}
                  </div>
                  <h4 className={`font-medium text-sm mb-1 ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                    {option.label}
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {option.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Branded Glow Style (only visible when Branded variant is selected) */}
      {selectedVariant === 'branded' && (
        <div className="bg-gray-900/60 rounded-2xl border border-gray-800/60 p-6">
          <h3 className="text-white font-semibold text-lg mb-2">Glow Effect Style</h3>
          <p className="text-gray-500 text-sm mb-6">
            Choose the glow effect style for the Branded hero.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {([
              { value: 'wide' as const, label: 'Wide Spread', description: 'Full-width ambient glow that spreads across the entire hero section.', icon: <Sparkles className="w-5 h-5" />, accent: '#00D2D2' },
              { value: 'logo' as const, label: 'Logo Only', description: 'Compact glow focused behind the monday logo mark.', icon: <Eye className="w-5 h-5" />, accent: '#6161FF' },
            ]).map((option) => {
              const isSelected = brandedGlowStyle === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => setBrandedGlowStyle(option.value)}
                  className={`relative p-4 rounded-xl text-left transition-all duration-200 ${
                    isSelected
                      ? 'ring-2 bg-gray-800/80'
                      : 'bg-gray-800/30 border-2 border-transparent hover:bg-gray-800/50 hover:border-gray-700'
                  }`}
                  style={isSelected ? { ringColor: option.accent, borderColor: option.accent } : {}}
                >
                  {isSelected && (
                    <div className="absolute top-3 right-3">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: option.accent }}>
                        <CheckCircle className="w-3.5 h-3.5 text-white" />
                      </div>
                    </div>
                  )}
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                    style={{ backgroundColor: `${option.accent}20`, color: option.accent }}>
                    {option.icon}
                  </div>
                  <h4 className={`font-medium text-sm mb-1 ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                    {option.label}
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {option.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Hero Demo Element (only visible when Branded variant is selected) */}
      {selectedVariant === 'branded' && (
        <div className="bg-gray-900/60 rounded-2xl border border-gray-800/60 p-6">
          <h3 className="text-white font-semibold text-lg mb-2">Hero Visual Element</h3>
          <p className="text-gray-500 text-sm mb-6">
            Choose a decorative element to display in the Branded hero. Select one to preview, then save.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {([
              { value: 'none' as const, label: 'None', description: 'Clean hero with no additional visual elements.', icon: <Ban className="w-5 h-5" />, accent: '#808080' },
              { value: 'floating_terminal' as const, label: 'Floating Terminal', description: 'Small terminal widget fixed to bottom-right, showing agent API calls like a chat widget.', icon: <Terminal className="w-5 h-5" />, accent: '#00D2D2' },
              { value: 'toasts' as const, label: 'Toast Notifications', description: 'Small toast notifications sliding in from the right showing agent actions.', icon: <Zap className="w-5 h-5" />, accent: '#FFCB00' },
              { value: 'typing_agent' as const, label: 'Agent Typing Lines', description: 'Replaces hero typing lines with agent command/response output.', icon: <Type className="w-5 h-5" />, accent: '#00ff41' },
              { value: 'bg_stream' as const, label: 'Background Stream', description: 'Faint API call text flowing upward in the background behind hero content.', icon: <Code2 className="w-5 h-5" />, accent: '#6161FF' },
              { value: 'agent_cursor' as const, label: 'Agent Cursor', description: 'Moving cursor icon that travels across the screen as if an agent is browsing the page.', icon: <Activity className="w-5 h-5" />, accent: '#00D2D2' },
            ]).map((option) => {
              const isSelected = heroDemoStyle === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => setHeroDemoStyle(option.value)}
                  className={`relative p-4 rounded-xl text-left transition-all duration-200 ${
                    isSelected
                      ? 'ring-2 bg-gray-800/80'
                      : 'bg-gray-800/30 border-2 border-transparent hover:bg-gray-800/50 hover:border-gray-700'
                  }`}
                  style={isSelected ? { ringColor: option.accent, borderColor: option.accent } : {}}
                >
                  {isSelected && (
                    <div className="absolute top-3 right-3">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: option.accent }}>
                        <CheckCircle className="w-3.5 h-3.5 text-white" />
                      </div>
                    </div>
                  )}
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                    style={{ backgroundColor: `${option.accent}20`, color: option.accent }}>
                    {option.icon}
                  </div>
                  <h4 className={`font-medium text-sm mb-1 ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                    {option.label}
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {option.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Frameworks Showcase Toggle */}
      <div className="bg-gray-900/60 rounded-2xl border border-gray-800/60 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold text-lg mb-1">Frameworks Showcase</h3>
            <p className="text-gray-500 text-sm">
              Show the "Welcoming agents from 33+ frameworks & platforms" logo grid below the hero.
            </p>
          </div>
          <button
            onClick={() => setShowFrameworks(!showFrameworks)}
            className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${
              showFrameworks ? 'bg-[#00D2D2]' : 'bg-gray-700'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform duration-200 ${
                showFrameworks ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Messaging Tone Selector */}
      <div className={`bg-gray-900/60 rounded-2xl border border-gray-800/60 p-6 ${selectedContentStyle === 'v2' ? 'opacity-40 pointer-events-none' : ''}`}>
        <h3 className="text-white font-semibold text-lg mb-2">Messaging Tone {selectedContentStyle === 'v2' && <span className="text-xs text-gray-500 font-normal ml-2">(V1 only)</span>}</h3>
        <p className="text-gray-500 text-sm mb-6">
          Choose how the page speaks to visitors. Each tone changes all text across every section.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TONE_OPTIONS.map((option) => {
            const isSelected = selectedTone === option.value;
            return (
              <button
                key={option.value}
                onClick={() => setSelectedTone(option.value)}
                className={`relative p-4 rounded-xl text-left transition-all duration-200 ${
                  isSelected
                    ? 'ring-2 bg-gray-800/80'
                    : 'bg-gray-800/30 border-2 border-transparent hover:bg-gray-800/50 hover:border-gray-700'
                }`}
                style={isSelected ? { ringColor: option.accent, borderColor: option.accent } : {}}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: option.accent }}>
                      <CheckCircle className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>
                )}

                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                  style={{ backgroundColor: `${option.accent}20`, color: option.accent }}>
                  {option.icon}
                </div>

                <h4 className={`font-medium text-sm mb-1 ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                  {option.label}
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed mb-2">
                  {option.description}
                </p>
                <p className="text-xs font-mono leading-relaxed" style={{ color: option.accent }}>
                  {option.example}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Selection Preview Info */}
      <div className="bg-gray-900/40 rounded-xl border border-gray-800/40 p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                backgroundColor: selectedContentStyle === 'v2' ? '#00D2D220' : '#6161FF20',
                color: selectedContentStyle === 'v2' ? '#00D2D2' : '#6161FF',
              }}>
              {selectedContentStyle === 'v2' ? <Sparkles className="w-4 h-4" /> : <Layers className="w-4 h-4" />}
            </div>
            <div>
              <p className="text-gray-300 text-sm font-medium">
                Content: {selectedContentStyle === 'v2' ? 'V2 — Clear' : 'V1 — Original'}
              </p>
              <p className="text-gray-600 text-xs">Content style</p>
            </div>
          </div>
          <div className="w-px h-8 bg-gray-800" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                backgroundColor: selectedLayout === 'plain_text' ? '#00ff4120' : '#6161FF20',
                color: selectedLayout === 'plain_text' ? '#00ff41' : '#6161FF',
              }}>
              {selectedLayout === 'plain_text' ? <FileCode className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </div>
            <div>
              <p className="text-gray-300 text-sm font-medium">
                Layout: {selectedLayout === 'plain_text' ? 'Plain Text' : 'Visual'}
              </p>
              <p className="text-gray-600 text-xs">Page body style</p>
            </div>
          </div>
          <div className="w-px h-8 bg-gray-800" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                backgroundColor: `${VARIANT_OPTIONS.find(v => v.value === selectedVariant)?.accent}20`,
                color: VARIANT_OPTIONS.find(v => v.value === selectedVariant)?.accent,
              }}>
              {VARIANT_OPTIONS.find(v => v.value === selectedVariant)?.icon}
            </div>
            <div>
              <p className="text-gray-300 text-sm font-medium">
                Hero: {VARIANT_OPTIONS.find(v => v.value === selectedVariant)?.label}
              </p>
              <p className="text-gray-600 text-xs">Visual animation style</p>
            </div>
          </div>
          <div className="w-px h-8 bg-gray-800" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                backgroundColor: `${TONE_OPTIONS.find(t => t.value === selectedTone)?.accent}20`,
                color: TONE_OPTIONS.find(t => t.value === selectedTone)?.accent,
              }}>
              {TONE_OPTIONS.find(t => t.value === selectedTone)?.icon}
            </div>
            <div>
              <p className="text-gray-300 text-sm font-medium">
                Tone: {TONE_OPTIONS.find(t => t.value === selectedTone)?.label}
              </p>
              <p className="text-gray-600 text-xs">Messaging style</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
