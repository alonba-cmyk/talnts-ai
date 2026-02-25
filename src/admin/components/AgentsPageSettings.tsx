import { useState, useEffect } from 'react';
import { Save, ExternalLink, Monitor, Terminal, Brain, Zap, Code2, Radar, CheckCircle, FileText, Bot, Cpu, ScanLine, Eye, FileCode } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type AgentsPageLayout = 'visual' | 'plain_text';

type AgentHeroVariant = 'matrix' | 'boot' | 'neural' | 'glitch' | 'cli' | 'radar';
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
    description: 'Falling characters in brand colors with real monday logo and typing animation',
    icon: <Terminal className="w-5 h-5" />,
    accent: '#00ff41',
  },
  {
    value: 'boot',
    label: 'Boot Sequence',
    description: 'BIOS simulation with memory checks, module loading, and brand-colored progress bar',
    icon: <Monitor className="w-5 h-5" />,
    accent: '#00D2D2',
  },
  {
    value: 'neural',
    label: 'Neural Network',
    description: 'Animated node graph pulsing in product colors that converges to reveal the message',
    icon: <Brain className="w-5 h-5" />,
    accent: '#6161FF',
  },
  {
    value: 'glitch',
    label: 'Glitch / CRT',
    description: 'CRT scanlines with chromatic aberration, VHS distortion, and brand color splits',
    icon: <Zap className="w-5 h-5" />,
    accent: '#FB275D',
  },
  {
    value: 'cli',
    label: 'Command Prompt',
    description: 'Realistic terminal with whoami, ping, and SSH commands connecting to monday.com',
    icon: <Code2 className="w-5 h-5" />,
    accent: '#00CA72',
  },
  {
    value: 'radar',
    label: 'Radar Scan',
    description: 'Rotating radar sweep in brand colors that progressively reveals content',
    icon: <Radar className="w-5 h-5" />,
    accent: '#FFCB00',
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
  const [selectedLayout, setSelectedLayout] = useState<AgentsPageLayout>('visual');
  const [selectedVariant, setSelectedVariant] = useState<AgentHeroVariant>('matrix');
  const [selectedTone, setSelectedTone] = useState<MessagingTone>('belong_here');
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
        if (sv._agents_page_layout) {
          setSelectedLayout(sv._agents_page_layout as AgentsPageLayout);
        }
        if (sv._agents_hero_variant) {
          setSelectedVariant(sv._agents_hero_variant as AgentHeroVariant);
        }
        if (sv._agents_messaging_tone) {
          setSelectedTone(sv._agents_messaging_tone as MessagingTone);
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
            _agents_page_layout: selectedLayout,
            _agents_hero_variant: selectedVariant,
            _agents_messaging_tone: selectedTone,
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

      {/* Page Layout Toggle */}
      <div className="bg-gray-900/60 rounded-2xl border border-gray-800/60 p-6">
        <h3 className="text-white font-semibold text-lg mb-2">Page Layout</h3>
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

      {/* Messaging Tone Selector */}
      <div className="bg-gray-900/60 rounded-2xl border border-gray-800/60 p-6">
        <h3 className="text-white font-semibold text-lg mb-2">Messaging Tone</h3>
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
