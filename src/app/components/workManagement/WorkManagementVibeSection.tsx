import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight, Sparkles, BarChart3, Users, FolderKanban,
  Workflow, Bot, Send, Replace, CheckCircle2,
} from 'lucide-react';
import vibeLogo from '@/assets/069a22575b2de9057cfc00d9b4538d072f7fe115.png';
import {
  TOOL_CATEGORIES,
  PREVIEW_COMPONENTS,
  ReplacedToolsPanel,
  ConnectorGridView,
} from './ConsolidationSection';
import { useSiteSettings } from '@/hooks/useSupabase';

import imgCompetitorTracker from '@/assets/vibe-apps/competitor-tracker.png';
import imgEcommerceStore from '@/assets/vibe-apps/ecommerce-store.png';
import imgResourceInsights from '@/assets/vibe-apps/resource-insights.png';
import imgBrandAssetPortal from '@/assets/vibe-apps/brand-asset-portal.png';
import imgDeliveryHub from '@/assets/vibe-apps/delivery-hub.png';
import imgProjectTrackerBlue from '@/assets/vibe-apps/project-tracker-blue.png';
import imgMarketingOkrs from '@/assets/vibe-apps/marketing-okrs.png';
import imgProjectTrackerPurple from '@/assets/vibe-apps/project-tracker-purple.png';

/* ═══════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════ */

const VIBE_SCENARIOS = [
  {
    id: 'marketing',
    label: 'Marketing',
    color: '#FF84E4',
    prompt: 'Build me a campaign health tracker that shows ROI across all channels in real time',
    app: {
      name: 'Campaign Health Tracker',
      description: 'Live ROI dashboard across paid, organic, and email channels with automated alerts.',
      icon: BarChart3,
      gradient: 'linear-gradient(135deg, #FF6B9D 0%, #FF84E4 100%)',
      mockRows: [
        { label: 'Google Ads', status: 'On Track', statusColor: '#00CA72', value: '$12.4K' },
        { label: 'Email Drip Q2', status: 'Review', statusColor: '#FFCB00', value: '$8.1K' },
        { label: 'Organic Social', status: 'Scaling', statusColor: '#6161FF', value: '$3.7K' },
      ],
    },
  },
  {
    id: 'product',
    label: 'Product',
    color: '#6161FF',
    prompt: 'Create a sprint retrospective board with sentiment analysis and action-item tracking',
    app: {
      name: 'Sprint Retro Board',
      description: 'Structured retrospectives with AI sentiment scoring and automatic follow-up tasks.',
      icon: FolderKanban,
      gradient: 'linear-gradient(135deg, #6161FF 0%, #A25DDC 100%)',
      mockRows: [
        { label: 'What went well', status: '12 items', statusColor: '#00CA72', value: '😊 92%' },
        { label: 'Improvements', status: '7 items', statusColor: '#FFCB00', value: '🔧 Auto' },
        { label: 'Action items', status: '5 tasks', statusColor: '#6161FF', value: '→ Sprint 14' },
      ],
    },
  },
  {
    id: 'hr',
    label: 'HR',
    color: '#00D2D2',
    prompt: 'Design an employee onboarding app that automates the first 90 days for new hires',
    app: {
      name: '90-Day Onboarding',
      description: 'Automated onboarding flows with milestone tracking, buddy assignments, and feedback loops.',
      icon: Users,
      gradient: 'linear-gradient(135deg, #00D2D2 0%, #00CA72 100%)',
      mockRows: [
        { label: 'Week 1: Setup', status: 'Complete', statusColor: '#00CA72', value: '✓ 8/8' },
        { label: 'Week 2-4: Ramp', status: 'In Progress', statusColor: '#FFCB00', value: '4/6' },
        { label: '60-Day Review', status: 'Scheduled', statusColor: '#6161FF', value: 'Mar 15' },
      ],
    },
  },
  {
    id: 'operations',
    label: 'Operations',
    color: '#FF3D57',
    prompt: 'Build a vendor management app with contract renewals, SLA tracking, and risk scoring',
    app: {
      name: 'Vendor Command Center',
      description: 'Unified vendor view with renewal alerts, compliance tracking, and risk heat maps.',
      icon: Workflow,
      gradient: 'linear-gradient(135deg, #FF3D57 0%, #FF6B9D 100%)',
      mockRows: [
        { label: 'AWS (Renews Jun)', status: 'Healthy', statusColor: '#00CA72', value: '$240K' },
        { label: 'Salesforce', status: 'Review SLA', statusColor: '#FFCB00', value: '$180K' },
        { label: 'Vendor X', status: 'At Risk', statusColor: '#FF3D57', value: '$95K' },
      ],
    },
  },
];

export type VibeCollageItem = {
  id: string;
  defaultSrc: string;
  alt: string;
};

export const VIBE_COLLAGE_ITEMS: VibeCollageItem[] = [
  { id: 'resource-insights', defaultSrc: imgResourceInsights, alt: 'Resource Insights' },
  { id: 'brand-asset-portal', defaultSrc: imgBrandAssetPortal, alt: 'Brand Asset Portal' },
  { id: 'competitor-tracker', defaultSrc: imgCompetitorTracker, alt: 'Competitor Intelligence Tracker' },
  { id: 'delivery-hub', defaultSrc: imgDeliveryHub, alt: 'Delivery Hub' },
  { id: 'ecommerce-store', defaultSrc: imgEcommerceStore, alt: 'E-commerce Store' },
  { id: 'marketing-okrs', defaultSrc: imgMarketingOkrs, alt: 'Marketing OKRs' },
  { id: 'project-tracker-blue', defaultSrc: imgProjectTrackerBlue, alt: 'Project Tracker' },
  { id: 'project-tracker-purple', defaultSrc: imgProjectTrackerPurple, alt: 'Project Tracker' },
];

const ROW_1_IDS = ['resource-insights', 'brand-asset-portal', 'competitor-tracker', 'ecommerce-store'];
const ROW_2_IDS = ['delivery-hub', 'marketing-okrs', 'project-tracker-blue', 'project-tracker-purple'];

const SUGGESTION_PILLS = [
  'Presentation', 'Inventory app', 'Documentation page',
  'Recruiting app', 'Time tracker', 'Event portal',
];

/* ═══════════════════════════════════════════════════════════
   HOOKS
   ═══════════════════════════════════════════════════════════ */

function useTypewriter(text: string, speed = 30, startDelay = 600) {
  const [displayed, setDisplayed] = useState('');
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setIsDone(false);
    let idx = 0;
    let interval: ReturnType<typeof setInterval>;
    const delayTimer = setTimeout(() => {
      interval = setInterval(() => {
        idx += 1;
        setDisplayed(text.slice(0, idx));
        if (idx >= text.length) {
          clearInterval(interval);
          setIsDone(true);
        }
      }, speed);
    }, startDelay);
    return () => { clearTimeout(delayTimer); clearInterval(interval!); };
  }, [text, speed, startDelay]);

  return { displayed, isDone };
}

/* ═══════════════════════════════════════════════════════════
   STATE 1: "BUILD YOUR OWN" — MARQUEE ROWS VIEW
   ═══════════════════════════════════════════════════════════ */

const CARD_WIDTH = 300;
const CARD_GAP = 20;

function MarqueeRow({
  items,
  direction,
  imageOverrides,
  duration = 40,
}: {
  items: VibeCollageItem[];
  direction: 'left' | 'right';
  imageOverrides?: Record<string, string>;
  duration?: number;
}) {
  const doubled = [...items, ...items];
  const oneSetWidth = items.length * (CARD_WIDTH + CARD_GAP);

  const xStart = direction === 'left' ? 0 : -oneSetWidth;
  const xEnd = direction === 'left' ? -oneSetWidth : 0;

  return (
    <div className="overflow-hidden w-full">
      <motion.div
        className="flex"
        style={{ gap: CARD_GAP, width: doubled.length * (CARD_WIDTH + CARD_GAP) }}
        animate={{ x: [xStart, xEnd] }}
        transition={{ duration, repeat: Infinity, ease: 'linear', repeatType: 'loop' }}
      >
        {doubled.map((item, i) => {
          const imgSrc = imageOverrides?.[item.id] || item.defaultSrc;
          return (
            <div
              key={`${item.id}-${i}`}
              className="flex-shrink-0 rounded-2xl overflow-hidden shadow-lg"
              style={{ width: CARD_WIDTH }}
            >
              <img
                src={imgSrc}
                alt={item.alt}
                className="w-full h-auto rounded-2xl"
                draggable={false}
                loading="lazy"
              />
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}

function BuildYourOwnView({ imageOverrides }: { imageOverrides?: Record<string, string> }) {
  const [inputValue, setInputValue] = useState('');

  const row1Items = ROW_1_IDS.map(id => VIBE_COLLAGE_ITEMS.find(c => c.id === id)!);
  const row2Items = ROW_2_IDS.map(id => VIBE_COLLAGE_ITEMS.find(c => c.id === id)!);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4 }}
      className="relative"
    >
      {/* Marquee rows behind the prompt */}
      <div className="relative w-full min-h-[520px] overflow-hidden">
        {/* Rows fill background */}
        <div className="absolute inset-0 flex flex-col justify-center gap-5 py-4">
          <MarqueeRow items={row1Items} direction="left" imageOverrides={imageOverrides} duration={35} />
          <MarqueeRow items={row2Items} direction="right" imageOverrides={imageOverrides} duration={45} />
        </div>

        {/* Radial vignette to clear center for prompt */}
        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{
            background: 'radial-gradient(ellipse 55% 50% at 50% 50%, #0a0a0a 15%, rgba(10,10,10,0.8) 45%, transparent 100%)',
          }}
        />
        {/* Left/right edge fade */}
        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{
            background: 'linear-gradient(90deg, #0a0a0a 0%, transparent 10%, transparent 90%, #0a0a0a 100%)',
          }}
        />

        {/* Center prompt */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-full max-w-[700px] px-4">
            <div
              className="rounded-2xl border border-white/[0.18] overflow-hidden"
              style={{ backdropFilter: 'blur(24px) saturate(1.4)', background: 'rgba(20,20,20,0.82)', boxShadow: '0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)' }}
            >
              {/* Subtle top-edge highlight */}
              <div
                className="absolute inset-x-0 top-0 h-px pointer-events-none"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)' }}
              />
              <div className="flex items-center gap-2.5 px-7 py-4">
                <img src={vibeLogo} alt="Vibe" className="w-8 h-8 object-contain" loading="lazy" />
                <span className="text-[16px] text-white/80 font-medium">monday <span className="font-light">vibe</span></span>
              </div>
              <div className="px-6 pb-5">
                <textarea
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  placeholder="What do you want to build?"
                  rows={4}
                  className="w-full rounded-xl border border-white/[0.1] bg-white/[0.05] px-5 py-4 text-[18px] text-white/90 placeholder:text-white/30 outline-none font-light resize-none leading-relaxed"
                />
                <div className="flex items-center justify-between mt-3">
                  <div className="flex flex-nowrap gap-2 overflow-hidden">
                    {SUGGESTION_PILLS.map(pill => (
                      <button
                        key={pill}
                        onClick={() => setInputValue(pill)}
                        className="px-3.5 py-1.5 rounded-full text-[12px] text-white/65 bg-white/[0.06] border border-white/[0.1] hover:bg-white/[0.12] hover:text-white/90 transition-all whitespace-nowrap shrink-0"
                      >
                        {pill}
                      </button>
                    ))}
                  </div>
                  <button
                    className="w-11 h-11 rounded-full flex items-center justify-center bg-white/[0.1] border border-white/[0.12] hover:bg-white/[0.18] transition-colors shrink-0 ml-3"
                    aria-label="Send"
                  >
                    <Send className="w-[18px] h-[18px] text-white/70" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   STATE 2: DEPARTMENT VIEW — SPLIT LAYOUT
   ═══════════════════════════════════════════════════════════ */

function PromptTerminal({ scenario }: { scenario: typeof VIBE_SCENARIOS[number] }) {
  const { displayed, isDone } = useTypewriter(scenario.prompt, 28, 400);

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#111] overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF3D57]/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFCB00]/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#00CA72]/60" />
        </div>
        <div className="flex items-center gap-2 ml-2">
          <img src={vibeLogo} alt="Vibe" className="w-4 h-4 object-contain" loading="lazy" />
          <span className="text-[11px] text-white/40 font-medium tracking-wide uppercase">monday Vibe</span>
        </div>
      </div>

      <div className="p-5 min-h-[120px] flex flex-col justify-between gap-4">
        <div className="flex items-start gap-3">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
            style={{ background: `${scenario.color}20` }}
          >
            <Sparkles className="w-3.5 h-3.5" style={{ color: scenario.color }} />
          </div>
          <p className="text-[15px] text-white/90 leading-relaxed font-light">
            {displayed}
            {!isDone && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, ease: 'steps(2)' }}
                className="inline-block w-[2px] h-[16px] bg-white/70 ml-0.5 align-middle"
              />
            )}
          </p>
        </div>

        <AnimatePresence>
          {isDone && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-center gap-2 ml-10"
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 120 }}
                transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
                className="h-1 rounded-full overflow-hidden bg-white/[0.06]"
              >
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.2, delay: 0.6, ease: 'easeInOut' }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: scenario.color }}
                />
              </motion.div>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8 }}
                className="text-[12px] text-white/40"
              >
                Building your app...
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function AppPreviewCard({ scenario }: { scenario: typeof VIBE_SCENARIOS[number] }) {
  const { app } = scenario;
  const Icon = app.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.97 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-white/[0.08] bg-[#141414] overflow-hidden"
    >
      <div className="p-5 pb-4 flex items-start gap-3.5">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg"
          style={{ background: app.gradient }}
        >
          <Icon className="w-5 h-5 text-white" strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-[15px] font-semibold text-white leading-tight">{app.name}</h4>
          <p className="text-[13px] text-white/50 mt-1 leading-relaxed">{app.description}</p>
        </div>
      </div>

      <div className="px-5 pb-5">
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          {app.mockRows.map((row, i) => (
            <motion.div
              key={row.label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.12 }}
              className={`flex items-center justify-between px-3.5 py-2.5 ${i > 0 ? 'border-t border-white/[0.04]' : ''}`}
            >
              <span className="text-[13px] text-white/70">{row.label}</span>
              <div className="flex items-center gap-3">
                <span
                  className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                  style={{ color: row.statusColor, backgroundColor: `${row.statusColor}15` }}
                >
                  {row.status}
                </span>
                <span className="text-[12px] text-white/40 font-mono">{row.value}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function DepartmentView({
  activeIdx,
}: {
  activeIdx: number;
}) {
  const scenario = VIBE_SCENARIOS[activeIdx];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4 }}
    >
      {/* Split layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        <div className="flex flex-col gap-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={scenario.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.35 }}
            >
              <PromptTerminal scenario={scenario} />
            </motion.div>
          </AnimatePresence>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'No code needed', icon: Sparkles },
              { label: 'AI-powered', icon: Bot },
              { label: 'Deploy instantly', icon: ArrowRight },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]"
              >
                <item.icon className="w-3.5 h-3.5 text-white/30" />
                <span className="text-[12px] text-white/40 font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <AppPreviewCard key={scenario.id} scenario={scenario} />
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   CONSOLIDATION BRIDGE (inline continuation)
   ═══════════════════════════════════════════════════════════ */

function VibeConsolidationBridge() {
  const { settings } = useSiteSettings();
  const variant = settings?.wm_consolidation_variant ?? 'tab_based';

  const [activeIdx, setActiveIdx] = useState(0);
  const hoverRef = useRef(false);
  const autoRef = useRef<ReturnType<typeof setTimeout>>();

  const active = TOOL_CATEGORIES[activeIdx];
  const ActivePreview = PREVIEW_COMPONENTS[active.id];

  useEffect(() => {
    if (variant !== 'tab_based') return;
    clearTimeout(autoRef.current);
    if (!hoverRef.current) {
      autoRef.current = setTimeout(() => {
        setActiveIdx(prev => (prev + 1) % TOOL_CATEGORIES.length);
      }, 6000);
    }
    return () => clearTimeout(autoRef.current);
  }, [activeIdx, variant]);

  return (
    <div
      className="mt-16 sm:mt-20"
      onMouseEnter={() => { hoverRef.current = true; clearTimeout(autoRef.current); }}
      onMouseLeave={() => { hoverRef.current = false; }}
    >
      {/* Transition bridge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="h-px w-10 bg-gradient-to-r from-transparent to-white/20" />
          <Replace className="w-4 h-4 text-white/30" />
          <div className="h-px w-10 bg-gradient-to-l from-transparent to-white/20" />
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-[-0.02em] mb-3">
          And replace the tools you no longer need.
        </h3>
        <p className="text-[15px] text-white/40 max-w-[520px] mx-auto leading-relaxed">
          Every app you build with Vibe is one less subscription, one less tab, one less tool to maintain.
        </p>
      </motion.div>

      {/* Variant-based content */}
      {variant === 'connector_grid' ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <ConnectorGridView />
        </motion.div>
      ) : (
        <>
          {/* Category tabs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap justify-center gap-2 mb-8"
          >
            {TOOL_CATEGORIES.map((cat, i) => {
              const isActive = activeIdx === i;
              const CatIcon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveIdx(i)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-semibold transition-all duration-300 cursor-pointer"
                  style={{
                    backgroundColor: isActive ? `${cat.color}18` : 'rgba(255,255,255,0.04)',
                    color: isActive ? cat.color : 'rgba(255,255,255,0.45)',
                    border: `1px solid ${isActive ? `${cat.color}40` : 'rgba(255,255,255,0.06)'}`,
                    boxShadow: isActive ? `0 0 20px ${cat.color}15` : 'none',
                  }}
                >
                  <CatIcon className="w-4 h-4" />
                  {cat.label}
                </button>
              );
            })}
          </motion.div>

          {/* Interactive area */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="rounded-2xl overflow-hidden"
            style={{
              backgroundColor: '#111',
              border: `1px solid ${active.color}20`,
              boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${active.color}08`,
              transition: 'border-color 0.5s, box-shadow 0.5s',
            }}
          >
            <div className="h-[3px] w-full transition-all duration-500" style={{ background: `linear-gradient(90deg, ${active.color}, ${active.color}50)` }} />

            <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <AnimatePresence mode="wait">
                <motion.p
                  key={active.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="text-[15px] font-medium text-gray-300"
                >
                  {active.tagline}
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.6fr] min-h-[420px]">
              <div className="px-6 py-5" style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16 }}
                    transition={{ duration: 0.35 }}
                    className="h-full"
                  >
                    <ActivePreview />
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="px-4 py-5">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                  >
                    <ReplacedToolsPanel tools={active.replacedTools} color={active.color} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN SECTION
   ═══════════════════════════════════════════════════════════ */

export function WorkManagementVibeSection({ collageImageOverrides }: { collageImageOverrides?: Record<string, string> } = {}) {
  const [selectedDept, setSelectedDept] = useState<number | null>(null);
  const activeColor = selectedDept !== null ? VIBE_SCENARIOS[selectedDept].color : '#A25DDC';

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 bg-[#0a0a0a] relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          key={activeColor}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1.2 }}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full blur-[120px]"
          style={{ backgroundColor: activeColor }}
        />
      </div>

      <div className="relative max-w-[1200px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] mb-6">
            <img src={vibeLogo} alt="Vibe" className="w-5 h-5 object-contain" loading="lazy" />
            <span className="text-[13px] text-white/60 font-medium">monday Vibe</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-[-0.03em] leading-[1.1] mb-5">
            Build any business software
            <br />
            in minutes
          </h2>
          <p className="text-base sm:text-lg text-white/50 max-w-[780px] mx-auto leading-relaxed">
            Reduce costs and clutter by replacing disconnected tools<br />
            with custom apps tailored to how your business actually works.
          </p>
        </motion.div>

        {/* Tab bar: departments + "Build your own" center */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center items-center gap-2 mb-10"
        >
          {VIBE_SCENARIOS.slice(0, 2).map((s, i) => {
            const isActive = selectedDept === i;
            return (
              <button
                key={s.id}
                onClick={() => setSelectedDept(isActive ? null : i)}
                className="px-5 py-2 rounded-full text-[13px] font-semibold transition-all duration-300"
                style={{
                  color: isActive ? s.color : 'rgba(255,255,255,0.45)',
                  backgroundColor: isActive ? `${s.color}15` : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${isActive ? `${s.color}35` : 'rgba(255,255,255,0.06)'}`,
                }}
              >
                {s.label}
              </button>
            );
          })}

          {/* Center: Build your own */}
          <button
            onClick={() => setSelectedDept(null)}
            className="px-8 py-3 rounded-full text-[16px] font-bold transition-all duration-300 flex items-center gap-2.5 mx-2"
            style={{
              color: selectedDept === null ? '#fff' : 'rgba(255,255,255,0.6)',
              backgroundColor: selectedDept === null ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.04)',
              border: `1.5px solid ${selectedDept === null ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.08)'}`,
              boxShadow: selectedDept === null ? '0 4px 20px rgba(255,255,255,0.08)' : 'none',
            }}
          >
            <Sparkles className="w-4 h-4" style={{ opacity: selectedDept === null ? 1 : 0.4 }} />
            Build your own
          </button>

          {VIBE_SCENARIOS.slice(2).map((s, i) => {
            const realIdx = i + 2;
            const isActive = selectedDept === realIdx;
            return (
              <button
                key={s.id}
                onClick={() => setSelectedDept(isActive ? null : realIdx)}
                className="px-5 py-2 rounded-full text-[13px] font-semibold transition-all duration-300"
                style={{
                  color: isActive ? s.color : 'rgba(255,255,255,0.45)',
                  backgroundColor: isActive ? `${s.color}15` : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${isActive ? `${s.color}35` : 'rgba(255,255,255,0.06)'}`,
                }}
              >
                {s.label}
              </button>
            );
          })}
        </motion.div>

        {/* Two states */}
        <AnimatePresence mode="wait">
          {selectedDept === null ? (
            <BuildYourOwnView key="build-your-own" imageOverrides={collageImageOverrides} />
          ) : (
            <DepartmentView
              key={`department-${selectedDept}`}
              activeIdx={selectedDept}
            />
          )}
        </AnimatePresence>

        {/* Consolidation continuation */}
        <VibeConsolidationBridge />

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-12"
        >
          <a
            href="https://monday.com/vibe"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 h-12 px-8 bg-white hover:bg-gray-200 text-black font-medium text-base rounded-[40px] transition-colors"
          >
            Vibe it
            <ArrowRight className="w-5 h-5" strokeWidth={2} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
