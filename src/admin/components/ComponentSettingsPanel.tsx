/**
 * Inline settings panel for a page component.
 * Renders editable fields based on component type and registry defaults.
 * JTBD Workspace and Platform Showcase get a grouped layout matching
 * the site-settings editor UX (Page Structure / Board / Chat / Showcase).
 */
import { useState, useRef, useEffect } from 'react';
import { Pencil, Check } from 'lucide-react';
import { getComponentMeta, componentCategories } from '@/admin/componentRegistry';
import type { PageComponentRow } from '@/hooks/useSupabase';

export interface ComponentSettingsPanelProps {
  component: PageComponentRow;
  onSettingsChange: (settings: Record<string, any>) => void;
  onNameChange?: (name: string) => void;
}

const selectOptions: Record<string, { value: string; label: string }[]> = {
  font_size: [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' },
    { value: 'xlarge', label: 'XLarge' },
  ],
  background_type: [
    { value: 'solid', label: 'Solid' },
    { value: 'gradient', label: 'Gradient' },
    { value: 'image', label: 'Image' },
  ],
  layout: [
    { value: 'mixed_circle', label: 'Mixed Circle' },
    { value: 'team_with_agents', label: 'Team + Agents' },
    { value: 'side_by_side_unified', label: 'Side by Side' },
    { value: 'cards_layout', label: 'Cards' },
    { value: 'team_flanked', label: 'Team Flanked' },
    { value: 'app_frame_list', label: 'App Frame List' },
    { value: 'app_frame_canvas', label: 'App Frame Canvas' },
    { value: 'app_frame_board', label: 'App Frame Board' },
  ],
  sidekick_panel_style: [
    { value: 'right_overlay', label: 'Right Overlay' },
    { value: 'center_modal', label: 'Center Modal' },
    { value: 'left_overlay', label: 'Left Overlay' },
  ],
  v3_team_avatars: [
    { value: 'in_chat', label: 'In Chat' },
    { value: 'header_row', label: 'Header Row' },
    { value: 'header_merged', label: 'Header Merged' },
  ],
  v4_left_panel: [
    { value: 'sidekick_chat', label: 'Sidekick Chat' },
    { value: 'v1_sidebar', label: 'V1 Sidebar' },
  ],
  use_cases_variant: [
    { value: 'cards_grid', label: 'Cards Grid' },
    { value: 'hero_featured', label: 'Hero Featured' },
    { value: 'department_tabs', label: 'Department Tabs' },
    { value: 'bento_mosaic', label: 'Bento Mosaic' },
  ],
};

function isPrimitive(v: unknown): v is string | number | boolean {
  return typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean';
}

/* ─── Reusable small controls ─────────────────────────────────── */

function Toggle({ value, onChange, color = 'indigo' }: { value: boolean; onChange: (v: boolean) => void; color?: string }) {
  const bg = value
    ? color === 'indigo' ? 'bg-indigo-600'
    : color === 'blue' ? 'bg-blue-600'
    : color === 'violet' ? 'bg-violet-600'
    : color === 'teal' ? 'bg-teal-600'
    : 'bg-indigo-600'
    : 'bg-gray-700';
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${bg}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );
}

function SegmentedButton({ options, value, onChange, color = 'indigo' }: { options: { value: string; label: string }[]; value: string; onChange: (v: string) => void; color?: string }) {
  const activeClasses =
    color === 'indigo' ? 'bg-indigo-600 text-white'
    : color === 'violet' ? 'bg-violet-600 text-white'
    : 'bg-indigo-600 text-white';
  return (
    <div className="flex rounded-lg overflow-hidden border border-gray-600 flex-shrink-0">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1.5 text-xs font-medium transition-colors ${
            value === opt.value ? activeClasses : 'bg-gray-700 text-gray-400 hover:text-gray-300'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function SettingRow({ label, description, children, border = true }: { label: string; description?: string; children: React.ReactNode; border?: boolean }) {
  return (
    <div className={`flex items-center justify-between py-2.5 ${border ? 'border-b border-gray-700/30' : ''}`}>
      <div className="min-w-0 pr-4">
        <p className="text-xs font-medium text-gray-300">{label}</p>
        {description && <p className="text-gray-500 text-[10px] mt-0.5 leading-snug">{description}</p>}
      </div>
      {children}
    </div>
  );
}

function SettingGroup({ title, borderColor, children }: { title: string; borderColor: string; children: React.ReactNode }) {
  return (
    <div className={`rounded-lg border-l-[3px] bg-gray-900/30 border border-gray-700/40 overflow-hidden`} style={{ borderLeftColor: borderColor }}>
      <div className="px-3.5 py-3">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">{title}</p>
        {children}
      </div>
    </div>
  );
}

/* ─── Editable Section Name ───────────────────────────────────── */

function EditableSectionName({ name, onSave }: { name: string; onSave: (name: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const handleSave = () => {
    const trimmed = value.trim();
    if (trimmed && trimmed !== name) {
      onSave(trimmed);
    } else {
      setValue(name);
    }
    setEditing(false);
  };

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="group flex items-center gap-2 hover:bg-gray-700/40 rounded-lg px-2 py-1 -mx-2 -my-1 transition-colors"
      >
        <span className="text-sm font-medium text-white">{name}</span>
        <Pencil className="w-3 h-3 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSave();
          if (e.key === 'Escape') { setValue(name); setEditing(false); }
        }}
        onBlur={handleSave}
        className="flex-1 px-2 py-1 rounded-md bg-gray-900 border border-gray-600 text-white text-sm focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none"
      />
      <button onClick={handleSave} className="p-1 rounded hover:bg-gray-700 text-green-400">
        <Check className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

/* ─── Custom grouped layout for JTBD Workspace ───────────────── */

function JTBDWorkspaceSettings({ settings, defaults, onChange }: { settings: Record<string, any>; defaults: Record<string, any>; onChange: (key: string, value: any) => void }) {
  const val = (key: string) => settings[key] ?? defaults[key];

  return (
    <div className="space-y-3">
      {/* Workspace Intro */}
      <SettingGroup title="Workspace Intro" borderColor="#f59e0b">
        <SettingRow label="Team Intro Animation" description="Show an animated intro with department avatar and AI agents before the workspace loads.">
          <Toggle value={val('show_intro')} onChange={(v) => onChange('show_intro', v)} color="blue" />
        </SettingRow>
        {val('show_intro') && (
          <SettingRow label="Intro Layout" description="Unified = overlapping avatars as one squad. Dept + Agents = department avatar, '+' separator, then agents." border={false}>
            <SegmentedButton
              options={[{ value: 'unified', label: 'Unified' }, { value: 'with_plus', label: 'Dept + Agents' }]}
              value={val('intro_style')}
              onChange={(v) => onChange('intro_style', v)}
            />
          </SettingRow>
        )}
      </SettingGroup>

      {/* Header */}
      <SettingGroup title="Header" borderColor="#3b82f6">
        <SettingRow label="Department Bar" description="Show the department selection strip between the hero and the workspace." border={false}>
          <Toggle value={val('show_department_bar')} onChange={(v) => onChange('show_department_bar', v)} color="blue" />
        </SettingRow>
      </SettingGroup>

      {/* Side Panel (external, beside the board) */}
      <SettingGroup title="Side Panel (beside the board)" borderColor="#0ea5e9">
        <SettingRow label="Show Side Panel" description="Show a panel beside the workspace board. V1 = task list, V3 = Sidekick chat, V4 = configurable below.">
          <Toggle value={val('show_jtbd_sidebar')} onChange={(v) => onChange('show_jtbd_sidebar', v)} color="blue" />
        </SettingRow>
        <SettingRow label="Side Panel Content" description="Choose what appears in the side panel: a Sidekick Chat or a Task List. Applies to the Platform Card (V4) layout." border={false}>
          <SegmentedButton
            options={[{ value: 'sidekick_chat', label: 'Sidekick Chat' }, { value: 'v1_sidebar', label: 'Task List' }]}
            value={val('v4_left_panel')}
            onChange={(v) => onChange('v4_left_panel', v)}
          />
        </SettingRow>
      </SettingGroup>

      {/* Inside the Board */}
      <SettingGroup title="Inside the Board" borderColor="#6366f1">
        <SettingRow label="Inline Sidekick Chat" description="Show a persistent Sidekick chat column on the left side inside the board itself.">
          <Toggle value={val('show_inline_sidekick')} onChange={(v) => onChange('show_inline_sidekick', v)} />
        </SettingRow>
        <SettingRow label="Agents & Apps Position" description="Which side the Agents & Apps panel sits on inside the board.">
          <SegmentedButton
            options={[{ value: 'false', label: 'Right' }, { value: 'true', label: 'Left' }]}
            value={String(val('sidebar_left'))}
            onChange={(v) => onChange('sidebar_left', v === 'true')}
          />
        </SettingRow>
        <SettingRow label="Work / Context Switch" description="Show a toggle in the board header to switch between Work and Context views." border={false}>
          <Toggle value={val('context_toggle')} onChange={(v) => onChange('context_toggle', v)} />
        </SettingRow>
      </SettingGroup>

      {/* Chat Behavior */}
      <SettingGroup title="Chat Behavior" borderColor="#8b5cf6">
        <SettingRow label="Chat Overlay Position" description="Where the Sidekick chat overlay appears when a task starts.">
          <SegmentedButton
            options={[{ value: 'right_overlay', label: 'Right' }, { value: 'left_overlay', label: 'Left' }, { value: 'center_modal', label: 'Center' }]}
            value={val('sidekick_panel_style')}
            onChange={(v) => onChange('sidekick_panel_style', v)}
            color="violet"
          />
        </SettingRow>
        <SettingRow label="Team Avatars Position" description="Where team member avatars appear inside the Sidekick chat sidebar.">
          <SegmentedButton
            options={[{ value: 'in_chat', label: 'In Chat' }, { value: 'header_row', label: 'Header' }, { value: 'header_merged', label: 'Merged' }]}
            value={val('v3_team_avatars')}
            onChange={(v) => onChange('v3_team_avatars', v)}
            color="violet"
          />
        </SettingRow>
        <SettingRow label="Minimal Chat Mode" description="After a task is selected, hide messages and only show the opening prompt and options." border={false}>
          <Toggle value={val('v3_minimal_chat')} onChange={(v) => onChange('v3_minimal_chat', v)} color="violet" />
        </SettingRow>
      </SettingGroup>
    </div>
  );
}

/* ─── Custom grouped layout for Platform Showcase ────────────── */

function PlatformShowcaseSettings({ settings, defaults, onChange }: { settings: Record<string, any>; defaults: Record<string, any>; onChange: (key: string, value: any) => void }) {
  const val = (key: string) => settings[key] ?? defaults[key];

  return (
    <div className="space-y-3">
      <SettingGroup title="Showcase Variant" borderColor="#0f766e">
        <SettingRow label="Display Mode" description="Classic = flat capability cards. Sandbox = architecture-integrated layers that reconfigure per JTBD." border={false}>
          <SegmentedButton
            options={[{ value: 'classic', label: 'Classic' }, { value: 'sandbox', label: 'Sandbox' }]}
            value={val('showcase_variant') || 'classic'}
            onChange={(v) => onChange('showcase_variant', v)}
          />
        </SettingRow>
      </SettingGroup>

      <SettingGroup title="Showcase Layout" borderColor="#14b8a6">
        <SettingRow label="Department Navigation" description="How departments are displayed in the showcase section.">
          <select
            value={typeof val('show_department_bar') === 'boolean' ? (val('show_department_bar') ? 'horizontal' : 'none') : (val('show_department_bar') || 'horizontal')}
            onChange={(e) => onChange('show_department_bar', e.target.value)}
            className="bg-gray-900 text-gray-200 text-xs rounded-lg px-3 py-1.5 border border-gray-600 focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            <option value="none">Hidden</option>
            <option value="horizontal">Horizontal Bar (top)</option>
            <option value="vertical_sidebar">Vertical Sidebar (left)</option>
            <option value="both">Both</option>
          </select>
        </SettingRow>
        <SettingRow label="Side Panel" description="Show the side panel beside the showcase board.">
          <Toggle value={val('show_jtbd_sidebar')} onChange={(v) => onChange('show_jtbd_sidebar', v)} color="teal" />
        </SettingRow>
        <SettingRow label="Inline Sidekick Chat" description="Show a persistent Sidekick chat column inside the showcase board." border={false}>
          <Toggle value={val('show_inline_sidekick')} onChange={(v) => onChange('show_inline_sidekick', v)} color="teal" />
        </SettingRow>
      </SettingGroup>
    </div>
  );
}

/* ─── Platform Hero Settings ───────────────────────────────── */

function PlatformHeroSettings({ settings, defaults, onChange }: { settings: Record<string, any>; defaults: Record<string, any>; onChange: (key: string, value: any) => void }) {
  const val = (key: string) => settings[key] ?? defaults[key];
  const heroVariants: { value: string; label: string; desc: string; icon: string }[] = [
    { value: 'typewriter', label: 'Typewriter', desc: 'Clean white background with animated typewriter text', icon: '⌨️' },
    { value: 'gradient_wave', label: 'Gradient Wave', desc: 'Dark gradient with animated flowing wave and glowing text', icon: '🌊' },
    { value: 'bold_statement', label: 'Bold Statement', desc: 'Full-screen dark hero with gradient headline and particles', icon: '✨' },
    { value: 'glassmorphism', label: 'Glassmorphism', desc: 'Frosted glass cards over animated gradient mesh', icon: '🪟' },
    { value: 'spotlight', label: 'Spotlight', desc: 'Minimal white hero with radial spotlight and refined typography', icon: '💡' },
    { value: 'orbit', label: 'Orbit', desc: 'Animated concentric rings with orbiting icons around logo', icon: '🪐' },
    { value: 'split', label: 'Split', desc: 'Two-column layout with animated platform layer cards', icon: '📐' },
    { value: 'reveal', label: 'Reveal', desc: 'Staggered letter reveal animation with animated counters', icon: '🎬' },
    { value: 'spotlight_v2', label: 'Spotlight V2', desc: 'Stacked lines with breathing glow and badge', icon: '💡' },
    { value: 'spotlight_v3', label: 'Spotlight V3', desc: 'Horizontal rules framing title with mono label', icon: '✦' },
    { value: 'spotlight_v4', label: 'Spotlight V4', desc: 'Floating dots, gradient underline, capability badges', icon: '◆' },
  ];

  return (
    <div className="space-y-3">
      <SettingGroup title="Hero Style" borderColor="#7c3aed">
        <p className="text-gray-500 text-[10px] mb-2 leading-snug">Choose the visual style for the hero section at the top of the platform page.</p>
        <div className="grid grid-cols-2 gap-2">
          {heroVariants.map((variant) => (
            <button
              key={variant.value}
              onClick={() => onChange('hero_variant', variant.value)}
              className={`p-2.5 rounded-lg text-left transition-all ${
                val('hero_variant') === variant.value
                  ? 'bg-violet-600/30 border-2 border-violet-500 ring-1 ring-violet-400/30'
                  : 'bg-gray-800/60 border-2 border-transparent hover:bg-gray-700/60 hover:border-gray-600'
              }`}
            >
              <span className="text-base mb-0.5 block">{variant.icon}</span>
              <span className={`block text-xs font-medium ${
                val('hero_variant') === variant.value ? 'text-violet-300' : 'text-gray-200'
              }`}>{variant.label}</span>
              <span className="block text-[10px] text-gray-500 mt-0.5 leading-snug">{variant.desc}</span>
            </button>
          ))}
        </div>
      </SettingGroup>
    </div>
  );
}

/* ─── Platform Architecture Layer Settings ────────────────── */

function PlatformArchitectureSettings({ settings, defaults, onChange }: { settings: Record<string, any>; defaults: Record<string, any>; onChange: (key: string, value: any) => void }) {
  const val = (key: string) => settings[key] ?? defaults[key];

  return (
    <div className="space-y-3">
      <SettingGroup title="Architecture Layout" borderColor="#115e59">
        <SettingRow label="Layout Variant" description="Classic = original concentric rings. Restructured = top-down flow with AI Capabilities at top and Integrations at bottom." border={false}>
          <select
            value={val('architecture_variant') || 'classic'}
            onChange={(e) => onChange('architecture_variant', e.target.value)}
            className="bg-gray-900 text-gray-200 text-xs rounded-lg px-3 py-1.5 border border-gray-600 focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            <option value="classic">Classic (concentric rings)</option>
            <option value="restructured">Restructured (top-down flow)</option>
          </select>
        </SettingRow>
      </SettingGroup>
    </div>
  );
}

/* ─── Main panel ─────────────────────────────────────────────── */

export function ComponentSettingsPanel({ component, onSettingsChange, onNameChange }: ComponentSettingsPanelProps) {
  const meta = getComponentMeta(component.component_type);
  const settings = component.settings || {};

  if (!meta?.hasSettings) {
    // Even components without settings can have their name changed
    if (onNameChange) {
      return (
        <div className="rounded-lg border border-gray-700/50 bg-gray-800/40 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gray-500" />
            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Section Name</p>
          </div>
          <EditableSectionName
            name={component.display_name || component.component_type}
            onSave={onNameChange}
          />
          <p className="text-gray-500 text-xs">No other configurable settings for this component.</p>
        </div>
      );
    }
    return (
      <div className="rounded-lg border border-gray-700/50 bg-gray-800/40 p-4">
        <p className="text-gray-500 text-sm">No configurable settings for this component.</p>
      </div>
    );
  }

  const defaultSettings = meta.defaultSettings || {};
  const cat = componentCategories[meta.category];
  const catColor = cat?.color || '#6366f1';

  const handleChange = (key: string, value: string | number | boolean) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  // Shared header with editable name
  const panelHeader = (
    <div className="space-y-2 mb-1">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: meta.color || catColor }} />
        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Section Name</p>
      </div>
      {onNameChange ? (
        <EditableSectionName
          name={component.display_name || meta.name}
          onSave={onNameChange}
        />
      ) : (
        <span className="text-sm font-medium text-white">{component.display_name || meta.name}</span>
      )}
    </div>
  );

  // ─── Custom grouped panels for workspace, showcase & hero ───
  if (component.component_type === 'platform_hero') {
    return (
      <div className="rounded-lg border border-gray-700/50 bg-gray-800/40 p-4 space-y-4">
        {panelHeader}
        <PlatformHeroSettings settings={settings} defaults={defaultSettings} onChange={handleChange} />
      </div>
    );
  }

  if (component.component_type === 'jtbd_workspace') {
    return (
      <div className="rounded-lg border border-gray-700/50 bg-gray-800/40 p-4 space-y-4">
        {panelHeader}
        <JTBDWorkspaceSettings settings={settings} defaults={defaultSettings} onChange={handleChange} />
      </div>
    );
  }

  if (component.component_type === 'platform_showcase') {
    return (
      <div className="rounded-lg border border-gray-700/50 bg-gray-800/40 p-4 space-y-4">
        {panelHeader}
        <PlatformShowcaseSettings settings={settings} defaults={defaultSettings} onChange={handleChange} />
      </div>
    );
  }

  if (component.component_type === 'platform_architecture_layer') {
    return (
      <div className="rounded-lg border border-gray-700/50 bg-gray-800/40 p-4 space-y-4">
        {panelHeader}
        <PlatformArchitectureSettings settings={settings} defaults={defaultSettings} onChange={handleChange} />
      </div>
    );
  }

  // ─── Generic fallback for all other component types ───
  const flatKeys = Object.keys(defaultSettings).filter(k => isPrimitive(defaultSettings[k]));
  const objectKeys = Object.keys(defaultSettings).filter(k => typeof defaultSettings[k] === 'object' && defaultSettings[k] !== null && !Array.isArray(defaultSettings[k]));

  return (
    <div className="rounded-lg border border-gray-700/50 bg-gray-800/40 p-4 space-y-4">
      {panelHeader}

      <div className="space-y-3">
        {flatKeys.map((key) => {
          const val = settings[key] ?? defaultSettings[key];
          const opts = selectOptions[key];

          if (opts) {
            return (
              <div key={key} className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-400 capitalize">
                  {key.replace(/_/g, ' ')}
                </label>
                <select
                  value={String(val ?? '')}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-600 text-white text-sm focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                >
                  {opts.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            );
          }

          if (typeof val === 'boolean') {
            return (
              <div key={key} className="flex items-center justify-between">
                <label className="text-xs font-medium text-gray-400 capitalize">
                  {key.replace(/_/g, ' ')}
                </label>
                <button
                  type="button"
                  onClick={() => handleChange(key, !val)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    val ? 'bg-indigo-600' : 'bg-gray-700'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      val ? 'left-5' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>
            );
          }

          return (
            <div key={key} className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-400 capitalize">
                {key.replace(/_/g, ' ')}
              </label>
              <input
                type={typeof val === 'number' ? 'number' : 'text'}
                value={val ?? ''}
                onChange={(e) =>
                  handleChange(
                    key,
                    typeof val === 'number' ? Number(e.target.value) : e.target.value
                  )
                }
                className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-600 text-white text-sm focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
              />
            </div>
          );
        })}

        {objectKeys.length > 0 && (
          <p className="text-xs text-gray-500 pt-2">
            Theme and advanced settings are managed elsewhere.
          </p>
        )}
      </div>
    </div>
  );
}
