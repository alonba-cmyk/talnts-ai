"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ArrowRight, X, ChevronLeft, ChevronRight, MessageCircle, Plug, Zap, Rocket, Sparkles, Plus, GitBranch, CheckCheck, Check } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSupabase';
import { AgentCoverflowCarousel } from './AgentRosterSection';
import agentCyanImg from '@/assets/agent-cyan.png';
import {
  HORIZONTAL_AGENTS,
  CATEGORY_META,
  ALL_CATEGORIES,
  type AgentCategory,
  type HorizontalAgent,
} from './horizontalAgentsData';

export type AgentCatalogVariant = 'compact_grid' | 'showcase_carousel' | 'masonry_cards' | 'none';

/* ═══════════════════════════════════════════════════════════
   SHARED: Filter Chips Row
   ═══════════════════════════════════════════════════════════ */

function FilterChipsRow({
  active,
  onChange,
  counts,
}: {
  active: AgentCategory | 'all';
  onChange: (cat: AgentCategory | 'all') => void;
  counts: Record<AgentCategory | 'all', number>;
}) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <button
        onClick={() => onChange('all')}
        className="px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all duration-200"
        style={{
          backgroundColor: active === 'all' ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)',
          color: active === 'all' ? '#fff' : 'rgba(255,255,255,0.5)',
          border: `1px solid ${active === 'all' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)'}`,
        }}
      >
        All ({counts.all})
      </button>
      {ALL_CATEGORIES.map(cat => {
        const meta = CATEGORY_META[cat];
        const isActive = active === cat;
        return (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className="px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all duration-200 flex items-center gap-1.5"
            style={{
              backgroundColor: isActive ? `${meta.color}20` : 'rgba(255,255,255,0.04)',
              color: isActive ? meta.color : 'rgba(255,255,255,0.5)',
              border: `1px solid ${isActive ? `${meta.color}40` : 'rgba(255,255,255,0.06)'}`,
            }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: isActive ? meta.color : 'rgba(255,255,255,0.25)' }}
            />
            {meta.label} ({counts[cat]})
          </button>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SHARED: Expanded Agent Panel
   ═══════════════════════════════════════════════════════════ */

function AgentExpandedPanel({
  agent,
  onClose,
}: {
  agent: HorizontalAgent;
  onClose: () => void;
}) {
  const catMeta = CATEGORY_META[agent.category];
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className="overflow-hidden"
    >
      <div
        className="relative rounded-2xl overflow-hidden mt-4"
        style={{
          backgroundColor: '#111',
          border: `1px solid ${catMeta.color}25`,
          boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 40px ${catMeta.color}10`,
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] min-h-[360px]">
          {/* Left: Info */}
          <div className="px-10 py-10 flex flex-col gap-5 justify-center">
            <div className="flex items-center gap-3">
              <span
                className="text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5"
                style={{ backgroundColor: `${catMeta.color}20`, color: catMeta.color }}
              >
                <catMeta.icon className="w-3 h-3" />
                {catMeta.label}
              </span>
              <span className="flex items-center gap-1.5 text-[11px] text-gray-500">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                {agent.status === 'production' ? 'Production' : 'Coming soon'}
              </span>
            </div>

            <h3 className="text-white text-[32px] font-extrabold leading-tight tracking-tight">{agent.name}</h3>
            <p className="text-gray-300 text-[14px] leading-relaxed">{agent.detailedDescription}</p>

            {/* Agent steps cascade */}
            <div className="flex flex-col gap-2 mt-1">
              {agent.exampleSteps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.15, duration: 0.35 }}
                  className="flex items-start gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: catMeta.color }} />
                  <span className="text-[13px] text-gray-300 leading-snug">{step}</span>
                </motion.div>
              ))}
            </div>

            <p className="text-[13px] text-gray-400 mt-1 italic">{agent.exampleResult}</p>

            <motion.a
              href="#"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.4 }}
              className="mt-1 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-semibold w-fit"
              style={{ backgroundColor: catMeta.color, color: '#0a0a0a', boxShadow: `0 0 20px ${catMeta.color}40` }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              Try it with monday AI
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.a>
          </div>

          {/* Right: Prompt bubble + category visual */}
          <div className="relative flex flex-col items-center justify-center gap-6 px-8 py-10"
            style={{ background: `linear-gradient(135deg, ${catMeta.color}08, transparent 70%)` }}
          >
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="rounded-xl px-5 py-4 max-w-[320px]"
              style={{
                backgroundColor: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Example prompt</span>
              </div>
              <p className="text-[14px] text-gray-200 leading-relaxed italic">"{agent.examplePrompt}"</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5, type: 'spring' }}
              className="w-20 h-20 rounded-2xl flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${catMeta.color}30, ${catMeta.color}10)`,
                border: `1px solid ${catMeta.color}30`,
              }}
            >
              <catMeta.icon className="w-10 h-10" style={{ color: catMeta.color }} />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   VARIANT 1: Split Panel (sidebar categories + content)
   ═══════════════════════════════════════════════════════════ */

/* ─── Builder step definitions ─── */
const BUILDER_STEPS = [
  {
    id: 'describe',
    icon: MessageCircle,
    title: 'Describe your task',
    subtitle: 'Tell the agent what you need in plain language',
  },
  {
    id: 'tools',
    icon: Plug,
    title: 'Choose your tools',
    subtitle: 'Connect boards, integrations, and data sources',
  },
  {
    id: 'triggers',
    icon: GitBranch,
    title: 'Set triggers',
    subtitle: 'Define when your agent should act',
  },
  {
    id: 'deploy',
    icon: Rocket,
    title: 'Deploy',
    subtitle: 'Your agent is live and working',
  },
] as const;

/* ─── Typing animation hook ─── */
function useTypingEffect(text: string, speed = 40, startDelay = 300) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    setDisplayed('');
    let i = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayed(text.slice(0, ++i));
        if (i >= text.length) clearInterval(interval);
      }, speed);
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(timeout);
  }, [text, speed, startDelay]);
  return displayed;
}

/* ─── Builder right-panel step previews ─── */
function BuilderStepPreview({ stepIdx }: { stepIdx: number }) {
  const TEAL = '#00D2D2';

  if (stepIdx === 0) {
    return <DescribePreview color={TEAL} />;
  }
  if (stepIdx === 1) {
    return <ToolsPreview color={TEAL} />;
  }
  if (stepIdx === 2) {
    return <TriggersPreview color={TEAL} />;
  }
  return <DeployPreview color={TEAL} />;
}

function DescribePreview({ color }: { color: string }) {
  const prompt = 'When a new support ticket arrives, analyze its urgency, assign it to the right team, and send a Slack notification to the owner.';
  const typed = useTypingEffect(prompt, 22, 200);
  return (
    <div className="h-full flex flex-col items-center justify-center px-12 gap-6">
      <div className="w-full max-w-[460px]">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4" style={{ color }} />
          <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color }}>Describe in plain language</span>
        </div>
        <div
          className="rounded-2xl px-6 py-5 min-h-[110px]"
          style={{
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: `1px solid ${color}30`,
            boxShadow: `0 0 40px ${color}08`,
          }}
        >
          <p className="text-gray-200 text-[15px] leading-relaxed">
            {typed}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.7 }}
              className="inline-block w-[2px] h-[16px] ml-0.5 align-middle rounded-full"
              style={{ backgroundColor: color }}
            />
          </p>
        </div>
        <p className="text-gray-500 text-[12px] mt-3">monday AI understands intent — no code, no configuration.</p>
      </div>
    </div>
  );
}

const INTEGRATION_TILES = [
  { name: 'monday Board', color: '#6161FF', letter: 'M' },
  { name: 'Slack', color: '#4A154B', letter: 'S' },
  { name: 'Gmail', color: '#EA4335', letter: 'G' },
  { name: 'Jira', color: '#0052CC', letter: 'J' },
  { name: 'Salesforce', color: '#00A1E0', letter: 'SF' },
  { name: 'HubSpot', color: '#FF7A59', letter: 'H' },
];

function ToolsPreview({ color }: { color: string }) {
  const [connected, setConnected] = useState<number[]>([]);
  useEffect(() => {
    const timers = INTEGRATION_TILES.map((_, i) =>
      setTimeout(() => setConnected(prev => [...prev, i]), 300 + i * 280),
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="h-full flex flex-col items-center justify-center px-10 gap-5">
      <div className="w-full max-w-[460px]">
        <div className="flex items-center gap-2 mb-4">
          <Plug className="w-4 h-4" style={{ color }} />
          <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color }}>Connect your tools</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {INTEGRATION_TILES.map((tile, i) => {
            const isConnected = connected.includes(i);
            return (
              <motion.div
                key={tile.name}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: isConnected ? 1 : 0.25, scale: isConnected ? 1 : 0.92 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="rounded-xl px-3 py-3 flex flex-col gap-1.5"
                style={{
                  backgroundColor: isConnected ? `${tile.color}18` : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${isConnected ? `${tile.color}40` : 'rgba(255,255,255,0.06)'}`,
                }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-black"
                  style={{ backgroundColor: tile.color }}
                >
                  {tile.letter}
                </div>
                <span className="text-[11px] text-gray-300 font-medium leading-tight">{tile.name}</span>
                {isConnected && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3 h-3" style={{ color }} />
                    <span className="text-[10px]" style={{ color }}>Connected</span>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function TriggersPreview({ color }: { color: string }) {
  const [activeRule, setActiveRule] = useState(0);
  const rules = [
    { when: 'New item created', on: 'Support Tickets board', then: 'Analyze & route' },
    { when: 'Status changes to "Done"', on: 'Sprint board', then: 'Send Slack notification' },
    { when: 'Due date within 2 days', on: 'Any board', then: 'Escalate to manager' },
  ];
  useEffect(() => {
    const interval = setInterval(() => setActiveRule(r => (r + 1) % rules.length), 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full flex flex-col items-center justify-center px-10 gap-5">
      <div className="w-full max-w-[460px]">
        <div className="flex items-center gap-2 mb-4">
          <GitBranch className="w-4 h-4" style={{ color }} />
          <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color }}>Set your triggers</span>
        </div>
        <div className="flex flex-col gap-2.5">
          {rules.map((rule, i) => {
            const isActive = i === activeRule;
            return (
              <motion.div
                key={i}
                animate={{
                  backgroundColor: isActive ? `${color}10` : 'rgba(255,255,255,0.02)',
                  borderColor: isActive ? `${color}35` : 'rgba(255,255,255,0.06)',
                  scale: isActive ? 1 : 0.98,
                }}
                transition={{ duration: 0.4 }}
                className="rounded-xl px-4 py-3.5"
                style={{ border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: isActive ? `${color}25` : 'rgba(255,255,255,0.06)' }}
                  >
                    <Zap className="w-3.5 h-3.5" style={{ color: isActive ? color : '#555' }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[12px] text-gray-400">When</span>
                      <span className="text-[12px] font-semibold text-white">{rule.when}</span>
                      <span className="text-[12px] text-gray-400">on</span>
                      <span className="text-[12px] font-semibold" style={{ color: isActive ? color : '#aaa' }}>{rule.on}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[12px] text-gray-400">→</span>
                      <span className="text-[12px] text-gray-300">{rule.then}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DeployPreview({ color }: { color: string }) {
  const [agentProgress, setAgentProgress] = useState(0);

  useEffect(() => {
    setAgentProgress(0);
    const interval = setInterval(() => {
      setAgentProgress(prev => {
        if (prev >= 100) { clearInterval(interval); return 100; }
        return prev + 2;
      });
    }, 65);
    return () => clearInterval(interval);
  }, []);

  const circumference = 2 * Math.PI * 54; // r=54
  const strokeOffset = circumference - (circumference * agentProgress) / 100;
  const isDone = agentProgress >= 100;

  const steps = [
    { text: 'Initializing agent...', threshold: 0 },
    { text: 'Loading knowledge base...', threshold: 25 },
    { text: 'Configuring workflows...', threshold: 50 },
    { text: 'Agent ready!', threshold: 75 },
  ];

  return (
    <div className="h-full flex flex-col items-center justify-center px-10 gap-4 overflow-y-auto py-6">
      <div className="w-full max-w-[380px] flex flex-col items-center gap-4">

        {/* Progress ring + agent image */}
        <div className="relative w-28 h-28 flex-shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <defs>
              <linearGradient id="deployGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00D2D2" />
                <stop offset="100%" stopColor="#14b8a6" />
              </linearGradient>
            </defs>
            {/* Track */}
            <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="5" />
            {/* Progress */}
            <motion.circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="url(#deployGradient)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              animate={{ strokeDashoffset: strokeOffset }}
              transition={{ duration: 0.2 }}
            />
          </svg>

          {/* Agent image inside ring */}
          <div className="absolute inset-[6px] rounded-full overflow-hidden bg-gray-800 border border-gray-700">
            <img
              src={agentCyanImg}
              alt="Agent"
              className="w-full h-full object-contain scale-110"
              loading="lazy"
              style={{
                filter: `grayscale(${1 - agentProgress / 100})`,
                transition: 'filter 0.3s',
              }}
            />
          </div>

          {/* Done checkmark badge */}
          <AnimatePresence>
            {isDone && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center border-2 border-[#0d0d0d]"
                style={{ background: 'linear-gradient(135deg, #34d399, #14b8a6)' }}
              >
                <Check className="w-4 h-4 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Agent name */}
        <div className="text-center">
          <p className="text-white text-[16px] font-bold leading-tight">Support Ticket Router</p>
          <p className="text-gray-500 text-[12px] mt-0.5">Custom AI Agent</p>
        </div>

        {/* Steps checklist */}
        <div className="flex flex-col gap-2.5 w-full">
          {steps.map((step, i) => {
            const isComplete = agentProgress >= step.threshold + 25;
            const isActive = agentProgress >= step.threshold && agentProgress < step.threshold + 25;
            return (
              <div key={i} className="flex items-center gap-3">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: isComplete
                      ? 'linear-gradient(135deg, #00D2D2, #14b8a6)'
                      : isActive
                      ? 'rgba(0,210,210,0.15)'
                      : 'rgba(255,255,255,0.05)',
                    border: isActive ? '1px solid #00D2D2' : '1px solid transparent',
                  }}
                >
                  {isComplete ? (
                    <Check className="w-3 h-3 text-white" />
                  ) : isActive ? (
                    <motion.div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: color }}
                      animate={{ scale: [1, 1.4, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-gray-600" />
                  )}
                </div>
                <span
                  className="text-[13px]"
                  style={{
                    color: isComplete ? color : isActive ? '#ffffff' : '#4b5563',
                  }}
                >
                  {step.text}
                </span>
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="w-full">
          <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.07)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #00D2D2, #14b8a6)' }}
              animate={{ width: `${agentProgress}%` }}
              transition={{ duration: 0.2 }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[11px] text-gray-500">
              {isDone ? 'Agent Ready!' : 'Creating agent...'}
            </span>
            <span className="text-[12px] font-bold" style={{ color }}>{agentProgress}%</span>
          </div>
        </div>

        {/* CTA */}
        <AnimatePresence>
          {isDone && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <motion.a
                href="#"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-[13px] font-bold"
                style={{ backgroundColor: color, color: '#0a0a0a', boxShadow: `0 0 24px ${color}50` }}
              >
                <Plus className="w-4 h-4" />
                Start building your own
              </motion.a>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

function SplitPanelVariant({
  imageOverrides = {},
  syncCategory,
  syncAgentId,
  onCategoryChange,
  onAgentSelect,
}: {
  imageOverrides?: Record<string, string>;
  syncCategory?: AgentCategory;
  syncAgentId?: string | null;
  onCategoryChange?: (cat: AgentCategory) => void;
  onAgentSelect?: (agentId: string) => void;
}) {
  const [activeCategory, setActiveCategory] = useState<AgentCategory>(syncCategory ?? ALL_CATEGORIES[0]);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(syncAgentId ?? null);
  const [builderStep, setBuilderStep] = useState(0);

  const isCustom = activeCategory === 'custom';

  const agentsInCategory = useMemo(
    () => HORIZONTAL_AGENTS.filter(a => a.category === activeCategory),
    [activeCategory],
  );

  const getAgentImage = (agent: HorizontalAgent) => imageOverrides[agent.id] || agent.image;

  const selectedAgent = selectedAgentId
    ? agentsInCategory.find(a => a.id === selectedAgentId) ?? agentsInCategory[0]
    : agentsInCategory[0];

  useEffect(() => {
    if (syncCategory !== undefined && syncCategory !== activeCategory) {
      setActiveCategory(syncCategory);
      setBuilderStep(0);
    }
  }, [syncCategory]);

  useEffect(() => {
    if (syncAgentId !== undefined) setSelectedAgentId(syncAgentId);
  }, [syncAgentId]);

  const handleCategoryClick = useCallback((cat: AgentCategory) => {
    setActiveCategory(cat);
    setSelectedAgentId(null);
    setBuilderStep(0);
    onCategoryChange?.(cat);
  }, [onCategoryChange]);

  const handleAgentClick = useCallback((agentId: string) => {
    setSelectedAgentId(agentId);
    onAgentSelect?.(agentId);
  }, [onAgentSelect]);

  const catMeta = CATEGORY_META[activeCategory];

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: '#0d0d0d',
        border: '1px solid rgba(255,255,255,0.10)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
      }}
    >
      {/* Horizontal category tabs - full width */}
      <div
        className="flex items-center justify-center gap-3 px-6 py-4 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#111111' }}
      >
        {ALL_CATEGORIES.map(cat => {
          const meta = CATEGORY_META[cat];
          const isActive = activeCategory === cat;
          const isCustomTab = cat === 'custom';
          return (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className="relative flex flex-col items-center gap-1.5 transition-all duration-200"
              style={{
                width: 100,
                height: 88,
                borderRadius: 18,
                backgroundColor: isActive
                  ? `${meta.color}18`
                  : isCustomTab
                  ? 'rgba(0,210,210,0.04)'
                  : 'transparent',
                border: isActive
                  ? `1.5px solid ${meta.color}50`
                  : isCustomTab
                  ? '1.5px dashed rgba(0,210,210,0.25)'
                  : '1.5px solid transparent',
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mt-2"
                style={{
                  backgroundColor: isActive ? `${meta.color}30` : isCustomTab ? 'rgba(0,210,210,0.08)' : 'rgba(255,255,255,0.05)',
                }}
              >
                <meta.icon className="w-7 h-7" style={{ color: isActive ? meta.color : isCustomTab ? '#00D2D2' : '#666' }} />
              </div>
              <span
                className="text-[11px] font-semibold text-center leading-tight px-1"
                style={{ color: isActive ? '#fff' : isCustomTab ? '#00D2D2' : '#6b7280' }}
              >
                {meta.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="split-cat-indicator"
                  className="absolute -bottom-[1px] left-1/2 -translate-x-1/2 h-[2px] w-10 rounded-full"
                  style={{ backgroundColor: meta.color }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr]">
        {/* LEFT: Agent list OR Builder steps */}
        <div
          className="flex flex-col px-4 py-4 overflow-y-auto h-[560px]"
          style={{
            backgroundColor: '#0f0f0f',
            borderRight: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <AnimatePresence mode="wait">
            {isCustom ? (
              <motion.div
                key="builder-steps"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-2"
              >
                <p className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold px-1 mb-1">How it works</p>
                {BUILDER_STEPS.map((step, i) => {
                  const isActive = builderStep === i;
                  const StepIcon = step.icon;
                  return (
                    <button
                      key={step.id}
                      onClick={() => setBuilderStep(i)}
                      className="flex items-start gap-3 px-3 py-3.5 rounded-xl text-left transition-all duration-200"
                      style={{
                        backgroundColor: isActive ? '#00D2D218' : 'transparent',
                        border: isActive ? '1px solid #00D2D230' : '1px solid transparent',
                        boxShadow: isActive ? '0 0 16px #00D2D215' : 'none',
                      }}
                    >
                      {/* Step number + icon */}
                      <div className="flex flex-col items-center gap-1 flex-shrink-0">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{
                            backgroundColor: isActive ? '#00D2D225' : 'rgba(255,255,255,0.05)',
                            border: isActive ? '1.5px solid #00D2D240' : '1.5px solid transparent',
                          }}
                        >
                          <StepIcon className="w-4.5 h-4.5" style={{ color: isActive ? '#00D2D2' : '#555' }} />
                        </div>
                        {i < BUILDER_STEPS.length - 1 && (
                          <div
                            className="w-px h-4 rounded-full"
                            style={{ backgroundColor: isActive ? '#00D2D230' : 'rgba(255,255,255,0.06)' }}
                          />
                        )}
                      </div>
                      <div className="min-w-0 pt-1">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="text-[10px] font-bold tabular-nums"
                            style={{ color: isActive ? '#00D2D2' : '#444' }}
                          >
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <p className={`text-[13px] font-semibold leading-tight ${isActive ? 'text-white' : 'text-gray-400'}`}>
                            {step.title}
                          </p>
                        </div>
                        <p className="text-[11px] text-gray-500 leading-snug mt-0.5">{step.subtitle}</p>
                      </div>
                    </button>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-1.5"
              >
                {agentsInCategory.map(agent => {
                  const isSelected = selectedAgent?.id === agent.id;
                  return (
                    <button
                      key={agent.id}
                      onClick={() => handleAgentClick(agent.id)}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-200"
                      style={{
                        backgroundColor: isSelected ? catMeta.color : 'transparent',
                        border: isSelected ? `1px solid ${catMeta.color}` : '1px solid transparent',
                        boxShadow: isSelected ? `0 0 16px ${catMeta.color}35` : 'none',
                      }}
                    >
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: isSelected ? 'rgba(10,10,10,0.2)' : `${catMeta.color}25`,
                          border: isSelected ? '1.5px solid rgba(10,10,10,0.15)' : '1.5px solid transparent',
                        }}
                      >
                        {getAgentImage(agent) ? (
                          <img
                            src={getAgentImage(agent)}
                            alt={agent.name}
                            className="w-8 h-8 object-contain"
                            loading="lazy"
                          />
                        ) : (
                          <catMeta.icon className="w-5 h-5" style={{ color: catMeta.color }} />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className={`text-[13px] font-semibold leading-tight ${isSelected ? 'text-[#0a0a0a]' : 'text-gray-300'}`}>
                          {agent.name}
                        </p>
                        <p className={`text-[11px] leading-snug line-clamp-1 mt-0.5 ${isSelected ? 'text-[#0a0a0a]/70' : 'text-gray-500'}`}>{agent.description}</p>
                      </div>
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT: Agent content OR Builder preview */}
        <div className="flex flex-col overflow-hidden">
          <div className="relative flex-1 overflow-hidden h-[560px]">
            <AnimatePresence mode="wait">
              {isCustom ? (
                <motion.div
                  key={`builder-${builderStep}`}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                  style={{
                    background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,210,210,0.05), transparent 70%)',
                  }}
                >
                  <BuilderStepPreview stepIdx={builderStep} />
                </motion.div>
              ) : (
                selectedAgent && (
                  <motion.div
                    key={selectedAgent.id}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.3 }}
                    className="relative h-full"
                  >
                    {/* Agent background image */}
                    {getAgentImage(selectedAgent) && (
                      <motion.div
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="absolute inset-0 pointer-events-none"
                      >
                        <img
                          src={getAgentImage(selectedAgent)}
                          alt=""
                          className="absolute right-2 bottom-0 w-[48%] max-h-[90%] object-contain object-bottom"
                          loading="lazy"
                          style={{
                            opacity: 0.9,
                            mixBlendMode: 'screen',
                            filter: `drop-shadow(0 0 60px ${catMeta.color}40)`,
                            maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 20%, rgba(0,0,0,0.5) 70%, transparent 100%)',
                            WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 20%, rgba(0,0,0,0.5) 70%, transparent 100%)',
                          }}
                        />
                        <div
                          className="absolute inset-0"
                          style={{
                            background: `radial-gradient(ellipse 50% 60% at 80% 60%, ${catMeta.color}12, transparent 70%)`,
                          }}
                        />
                      </motion.div>
                    )}

                    {/* Content */}
                    <div
                      className="relative z-10 h-full px-10 py-8 flex flex-col gap-4 justify-center overflow-y-auto"
                      style={{ background: `linear-gradient(135deg, ${catMeta.color}06, transparent 60%)` }}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5"
                          style={{ backgroundColor: `${catMeta.color}20`, color: catMeta.color }}
                        >
                          <catMeta.icon className="w-3 h-3" />
                          {catMeta.label}
                        </span>
                        <span className="flex items-center gap-1.5 text-[11px] text-gray-500">
                          <span className="w-2 h-2 rounded-full bg-green-500" />
                          {selectedAgent.status === 'production' ? 'Production' : 'Coming soon'}
                        </span>
                      </div>

                      <h3 className="text-white text-[32px] font-extrabold leading-tight tracking-tight">{selectedAgent.name}</h3>
                      <p className="text-gray-300 text-[14px] leading-relaxed max-w-[520px]">{selectedAgent.detailedDescription}</p>

                      {/* Prompt example */}
                      <div
                        className="rounded-xl px-5 py-4 max-w-[440px]"
                        style={{
                          backgroundColor: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.06)',
                          backdropFilter: 'blur(8px)',
                        }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <MessageCircle className="w-3.5 h-3.5 text-gray-500" />
                          <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Example prompt</span>
                        </div>
                        <p className="text-[13px] text-gray-200 leading-relaxed italic">"{selectedAgent.examplePrompt}"</p>
                      </div>

                      {/* Steps */}
                      <div className="flex flex-col gap-2">
                        {selectedAgent.exampleSteps.map((step, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.15 + i * 0.1, duration: 0.3 }}
                            className="flex items-start gap-2"
                          >
                            <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: catMeta.color }} />
                            <span className="text-[13px] text-gray-300 leading-snug">{step}</span>
                          </motion.div>
                        ))}
                      </div>

                      <p className="text-[12px] text-gray-500 italic max-w-[440px]">{selectedAgent.exampleResult}</p>

                      <motion.a
                        href="#"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.4 }}
                        className="mt-1 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-semibold w-fit"
                        style={{ backgroundColor: catMeta.color, color: '#0a0a0a', boxShadow: `0 0 20px ${catMeta.color}40` }}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        Try it with monday AI
                        <ArrowRight className="w-3.5 h-3.5" />
                      </motion.a>
                    </div>
                  </motion.div>
                )
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   VARIANT 2: Showcase Carousel
   ═══════════════════════════════════════════════════════════ */

function ShowcaseCarouselVariant() {
  const [filter, setFilter] = useState<AgentCategory | 'all'>('all');
  const [activeIdx, setActiveIdx] = useState(0);
  const [direction, setDirection] = useState(0);
  const autoRef = useRef<ReturnType<typeof setTimeout>>();
  const hoverRef = useRef(false);

  const filtered = useMemo(
    () => filter === 'all' ? HORIZONTAL_AGENTS : HORIZONTAL_AGENTS.filter(a => a.category === filter),
    [filter],
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: HORIZONTAL_AGENTS.length };
    ALL_CATEGORIES.forEach(cat => { c[cat] = HORIZONTAL_AGENTS.filter(a => a.category === cat).length; });
    return c as Record<AgentCategory | 'all', number>;
  }, []);

  const agent = filtered[activeIdx] ?? filtered[0];
  const catMeta = agent ? CATEGORY_META[agent.category] : CATEGORY_META.think;

  const navigate = useCallback((dir: number) => {
    setDirection(dir);
    setActiveIdx(prev => {
      const next = prev + dir;
      if (next < 0) return filtered.length - 1;
      if (next >= filtered.length) return 0;
      return next;
    });
  }, [filtered.length]);

  useEffect(() => {
    setActiveIdx(0);
  }, [filter]);

  useEffect(() => {
    clearTimeout(autoRef.current);
    if (!hoverRef.current && filtered.length > 1) {
      autoRef.current = setTimeout(() => navigate(1), 6000);
    }
    return () => clearTimeout(autoRef.current);
  }, [activeIdx, filtered.length, navigate]);

  if (!agent) return null;

  const prevAgent = filtered[(activeIdx - 1 + filtered.length) % filtered.length];
  const nextAgent = filtered[(activeIdx + 1) % filtered.length];

  return (
    <div>
      <FilterChipsRow active={filter} onChange={(c) => { setFilter(c); setActiveIdx(0); }} counts={counts} />

      <div
        className="relative mt-8"
        onMouseEnter={() => { hoverRef.current = true; }}
        onMouseLeave={() => { hoverRef.current = false; }}
      >
        {/* Navigation arrows */}
        {filtered.length > 1 && (
          <>
            <button
              onClick={() => navigate(-1)}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors backdrop-blur-sm -ml-2"
            >
              <ChevronLeft className="w-5 h-5 text-white/70" />
            </button>
            <button
              onClick={() => navigate(1)}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors backdrop-blur-sm -mr-2"
            >
              <ChevronRight className="w-5 h-5 text-white/70" />
            </button>
          </>
        )}

        {/* Side peeks */}
        {filtered.length > 2 && (
          <>
            <div
              className="absolute left-0 top-0 bottom-0 w-[8%] z-10 rounded-l-2xl overflow-hidden cursor-pointer opacity-30 hover:opacity-50 transition-opacity"
              onClick={() => navigate(-1)}
              style={{
                background: `linear-gradient(135deg, ${CATEGORY_META[prevAgent.category].color}10, #111)`,
                border: '1px solid rgba(255,255,255,0.04)',
              }}
            />
            <div
              className="absolute right-0 top-0 bottom-0 w-[8%] z-10 rounded-r-2xl overflow-hidden cursor-pointer opacity-30 hover:opacity-50 transition-opacity"
              onClick={() => navigate(1)}
              style={{
                background: `linear-gradient(225deg, ${CATEGORY_META[nextAgent.category].color}10, #111)`,
                border: '1px solid rgba(255,255,255,0.04)',
              }}
            />
          </>
        )}

        {/* Main featured card */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={agent.id}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 80 : -80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -80 : 80 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="relative rounded-2xl overflow-hidden mx-[8%]"
            style={{
              backgroundColor: '#111',
              border: `1px solid ${catMeta.color}25`,
              boxShadow: `0 24px 80px rgba(0,0,0,0.6), 0 0 60px ${catMeta.color}10`,
              minHeight: 460,
            }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] min-h-[460px]">
              {/* Left */}
              <div className="px-10 py-10 flex flex-col gap-5 justify-center">
                <div className="flex items-center gap-3">
                  <span
                    className="text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5"
                    style={{ backgroundColor: `${catMeta.color}20`, color: catMeta.color }}
                  >
                    <catMeta.icon className="w-3 h-3" />
                    {catMeta.label}
                  </span>
                  <span className="flex items-center gap-1.5 text-[11px] text-gray-500">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    {agent.status === 'production' ? 'Production' : 'Coming soon'}
                  </span>
                </div>

                <h3 className="text-white text-[36px] font-extrabold leading-[1.1] tracking-tight">{agent.name}</h3>
                <p className="text-gray-300 text-[14px] leading-relaxed max-w-[440px]">{agent.detailedDescription}</p>

                <div className="flex flex-col gap-2 mt-1">
                  {agent.exampleSteps.map((step, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.12, duration: 0.3 }}
                      className="flex items-start gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: catMeta.color }} />
                      <span className="text-[13px] text-gray-300 leading-snug">{step}</span>
                    </motion.div>
                  ))}
                </div>

                <motion.a
                  href="#"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.4 }}
                  className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-semibold w-fit"
                  style={{ backgroundColor: catMeta.color, color: '#0a0a0a', boxShadow: `0 0 20px ${catMeta.color}40` }}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Try it with monday AI
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.a>
              </div>

              {/* Right */}
              <div
                className="relative flex flex-col items-center justify-center gap-6 px-8 py-10"
                style={{ background: `linear-gradient(135deg, ${catMeta.color}08, transparent 70%)` }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="rounded-xl px-5 py-4 max-w-[320px]"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle className="w-3.5 h-3.5 text-gray-500" />
                    <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Example prompt</span>
                  </div>
                  <p className="text-[14px] text-gray-200 leading-relaxed italic">"{agent.examplePrompt}"</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.5, type: 'spring' }}
                  className="w-24 h-24 rounded-2xl flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${catMeta.color}30, ${catMeta.color}10)`,
                    border: `1px solid ${catMeta.color}30`,
                  }}
                >
                  <catMeta.icon className="w-12 h-12" style={{ color: catMeta.color }} />
                </motion.div>

                <p className="text-[12px] text-gray-500 text-center max-w-[260px] italic">
                  {agent.exampleResult}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dot navigation */}
        {filtered.length > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-5">
            {filtered.map((_, i) => (
              <button
                key={i}
                onClick={() => { setDirection(i > activeIdx ? 1 : -1); setActiveIdx(i); }}
                className="transition-all duration-300"
              >
                <div
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === activeIdx ? 24 : 8,
                    height: 8,
                    backgroundColor: i === activeIdx ? catMeta.color : 'rgba(255,255,255,0.15)',
                  }}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   VARIANT 3: Category Sidebar (square icons + agent cards)
   ═══════════════════════════════════════════════════════════ */

function CategorySidebarVariant({ imageOverrides = {} }: { imageOverrides?: Record<string, string> }) {
  const [activeCategory, setActiveCategory] = useState<AgentCategory>(ALL_CATEGORIES[0]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const getAgentImage = (agent: HorizontalAgent) => imageOverrides[agent.id] || agent.image;

  const agentsInCategory = useMemo(
    () => HORIZONTAL_AGENTS.filter(a => a.category === activeCategory),
    [activeCategory],
  );

  useEffect(() => {
    setExpandedId(null);
  }, [activeCategory]);

  const catMeta = CATEGORY_META[activeCategory];

  return (
    <div className="flex gap-6">
      {/* LEFT: Category square buttons */}
      <div className="flex flex-col gap-2 flex-shrink-0">
        {ALL_CATEGORIES.map(cat => {
          const meta = CATEGORY_META[cat];
          const isActive = activeCategory === cat;
          return (
            <motion.button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              className="relative flex flex-col items-center justify-center gap-1.5 rounded-xl transition-all duration-200"
              style={{
                width: 76,
                height: 76,
                backgroundColor: isActive ? `${meta.color}18` : 'rgba(255,255,255,0.03)',
                border: `1.5px solid ${isActive ? `${meta.color}50` : 'rgba(255,255,255,0.06)'}`,
                boxShadow: isActive ? `0 0 20px ${meta.color}15` : 'none',
              }}
            >
              <meta.icon
                className="w-5 h-5"
                style={{ color: isActive ? meta.color : '#6b7280' }}
              />
              <span
                className="text-[10px] font-semibold"
                style={{ color: isActive ? meta.color : '#6b7280' }}
              >
                {meta.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="category-indicator"
                  className="absolute -right-[5px] top-1/2 -translate-y-1/2 w-[3px] h-7 rounded-full"
                  style={{ backgroundColor: meta.color }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* RIGHT: Agent cards for selected category */}
      <div className="flex-1 min-w-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-2"
          >
            {agentsInCategory.map((agent, i) => {
              const isExpanded = expandedId === agent.id;
              return (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.04 }}
                >
                  {/* Agent row */}
                  <button
                    onClick={() => setExpandedId(prev => prev === agent.id ? null : agent.id)}
                    className="w-full text-left flex items-start gap-4 px-5 py-4 rounded-xl transition-all duration-200"
                    style={{
                      backgroundColor: isExpanded ? `${catMeta.color}08` : '#111',
                      border: `1px solid ${isExpanded ? `${catMeta.color}20` : 'rgba(255,255,255,0.04)'}`,
                    }}
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{
                        backgroundColor: isExpanded ? `${catMeta.color}20` : 'rgba(255,255,255,0.04)',
                      }}
                    >
                      <catMeta.icon className="w-4 h-4" style={{ color: isExpanded ? catMeta.color : '#555' }} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={`text-[15px] font-bold leading-tight ${isExpanded ? 'text-white' : 'text-gray-300'}`}>
                        {agent.name}
                      </p>
                      <p className="text-[12px] text-gray-500 leading-relaxed mt-1">{agent.description}</p>
                      {!isExpanded && (
                        <p className="text-[11px] text-gray-600 italic mt-1.5 line-clamp-1">"{agent.examplePrompt}"</p>
                      )}
                    </div>

                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex-shrink-0 mt-1"
                    >
                      <ChevronLeft className="w-4 h-4 text-gray-600 -rotate-90" />
                    </motion.div>
                  </button>

                  {/* Expanded detail */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div
                          className="px-5 py-5 rounded-b-xl border-x border-b ml-[52px]"
                          style={{
                            backgroundColor: '#0f0f0f',
                            borderColor: `${catMeta.color}12`,
                          }}
                        >
                          <p className="text-gray-300 text-[13px] leading-relaxed mb-4">{agent.detailedDescription}</p>

                          {/* Prompt bubble */}
                          <div
                            className="rounded-lg px-4 py-3 mb-4"
                            style={{
                              backgroundColor: 'rgba(255,255,255,0.03)',
                              border: '1px solid rgba(255,255,255,0.06)',
                            }}
                          >
                            <div className="flex items-center gap-2 mb-1.5">
                              <MessageCircle className="w-3 h-3 text-gray-600" />
                              <span className="text-[9px] font-semibold text-gray-600 uppercase tracking-wider">Example prompt</span>
                            </div>
                            <p className="text-[13px] text-gray-200 italic leading-relaxed">"{agent.examplePrompt}"</p>
                          </div>

                          {/* Steps */}
                          <div className="flex flex-col gap-2 mb-4">
                            {agent.exampleSteps.map((step, si) => (
                              <motion.div
                                key={si}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.08 + si * 0.08, duration: 0.25 }}
                                className="flex items-start gap-2"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: catMeta.color }} />
                                <span className="text-[12px] text-gray-400 leading-snug">{step}</span>
                              </motion.div>
                            ))}
                          </div>

                          {/* Result */}
                          <p className="text-[12px] text-gray-500 italic mb-4">{agent.exampleResult}</p>

                          <a
                            href="#"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-semibold w-fit transition-transform hover:scale-[1.03]"
                            style={{ backgroundColor: catMeta.color, color: '#0a0a0a' }}
                          >
                            Try it with monday AI
                            <ArrowRight className="w-3 h-3" />
                          </a>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SHELL: WorkManagementAgentCatalog
   ═══════════════════════════════════════════════════════════ */

export function WorkManagementAgentCatalog({
  variant = 'compact_grid',
  showCarousel = false,
}: {
  variant?: AgentCatalogVariant;
  showCarousel?: boolean;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const { settings } = useSiteSettings();
  const imageOverrides = settings?.wm_agent_image_overrides ?? {};

  const [syncedCategory, setSyncedCategory] = useState<AgentCategory>(ALL_CATEGORIES[0]);
  const [syncedAgentId, setSyncedAgentId] = useState<string | null>(null);

  const handleCarouselChange = useCallback((agent: HorizontalAgent) => {
    if (agent.category !== 'custom') {
      setSyncedCategory(agent.category as AgentCategory);
      setSyncedAgentId(agent.id);
    }
  }, []);

  const handleCatalogCategoryChange = useCallback((cat: AgentCategory) => {
    setSyncedCategory(cat);
    if (cat !== 'custom') {
      const firstAgent = HORIZONTAL_AGENTS.find(a => a.category === cat);
      if (firstAgent) setSyncedAgentId(firstAgent.id);
    }
  }, []);

  const handleCatalogAgentSelect = useCallback((agentId: string) => {
    setSyncedAgentId(agentId);
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.1 },
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  if (variant === 'none') return null;

  return (
    <section ref={sectionRef} className="relative py-12 sm:py-16 px-6 lg:px-12" style={{ backgroundColor: '#0a0a0a' }}>
      <div className="max-w-[1240px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-white text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            Every agent your team needs
          </h2>
          <p className="text-gray-400 text-base max-w-[520px] mx-auto leading-relaxed mt-4">
            Cross-functional AI agents that work across any team, any workflow — ready to deploy in minutes.
          </p>
        </motion.div>

        {/* Coverflow carousel (optional) */}
        {showCarousel && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-16"
          >
            <AgentCoverflowCarousel
              scrollToAgentId={syncedAgentId ?? undefined}
              onCenterChange={handleCarouselChange}
              imageOverrides={imageOverrides}
            />
          </motion.div>
        )}

        {/* Active catalog variant */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: showCarousel ? 0.2 : 0.15 }}
        >
          {variant === 'compact_grid' && (
            <SplitPanelVariant
              imageOverrides={imageOverrides}
              {...(showCarousel ? {
                syncCategory: syncedCategory,
                syncAgentId: syncedAgentId,
                onCategoryChange: handleCatalogCategoryChange,
                onAgentSelect: handleCatalogAgentSelect,
              } : {})}
            />
          )}
          {variant === 'showcase_carousel' && <ShowcaseCarouselVariant />}
          {variant === 'masonry_cards' && <CategorySidebarVariant imageOverrides={imageOverrides} />}
        </motion.div>
      </div>
    </section>
  );
}
