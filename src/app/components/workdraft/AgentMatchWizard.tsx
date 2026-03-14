import { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAgentWizard } from '../../workdraft/AgentWizardContext';
import { useAgents } from '../../workdraft/useWorkDraft';
import { CATEGORY_ICONS } from '../../workdraft/mockData';
import { getCategoryVisual, CATEGORY_VISUALS } from '../../workdraft/agentVisuals';
import AgentAvatar from './AgentAvatar';
import type { AgentCategory, AgentFramework, WDAgent } from '../../workdraft/types';
import {
  X, ArrowRight, ArrowLeft, Sparkles, CheckCircle2, Shield,
  Zap, Clock, Briefcase, ChevronRight, RotateCcw,
} from 'lucide-react';

const ALL_CATEGORIES: AgentCategory[] = [
  'Content Writer', 'SDR / Sales', 'Customer Support', 'Developer',
  'Data Analyst', 'Marketing', 'Research', 'Operations',
];

const CATEGORY_DESCRIPTIONS: Record<AgentCategory, string> = {
  'Content Writer': 'Blog posts, copywriting, documentation, newsletters',
  'SDR / Sales': 'Outbound prospecting, lead qualification, demo booking',
  'Customer Support': 'Ticket handling, live chat, onboarding, escalation',
  'Developer': 'Code writing, bug fixes, testing, API integrations',
  'Data Analyst': 'Dashboards, reports, SQL queries, trend analysis',
  'Marketing': 'Campaigns, social media, SEO, growth optimization',
  'Research': 'Market research, competitive intelligence, literature review',
  'Operations': 'Workflow automation, task management, process optimization',
};

type Priority = 'speed' | 'accuracy' | 'cost' | 'security' | 'experience';

const PRIORITIES: { id: Priority; label: string; icon: typeof Zap; desc: string }[] = [
  { id: 'speed', label: 'Fast Response', icon: Zap, desc: 'Minimum latency, quick turnaround' },
  { id: 'accuracy', label: 'High Accuracy', icon: CheckCircle2, desc: '95%+ success rate required' },
  { id: 'cost', label: 'Budget Friendly', icon: Briefcase, desc: 'Best value for money' },
  { id: 'security', label: 'Enterprise Security', icon: Shield, desc: 'SOC 2, HIPAA, enterprise clearance' },
  { id: 'experience', label: 'Most Experienced', icon: Clock, desc: 'Highest job completion count' },
];

const FRAMEWORKS_LIST: { name: AgentFramework; logo: string }[] = [
  { name: 'LangChain', logo: '/logos/langchain.svg' },
  { name: 'CrewAI', logo: '/logos/crewai.svg' },
  { name: 'AutoGen', logo: '/logos/autogen.svg' },
  { name: 'LlamaIndex', logo: '/logos/llamaindex.svg' },
  { name: 'Semantic Kernel', logo: '/logos/semantic.svg' },
  { name: 'Custom', logo: '' },
];

type BudgetRange = 'any' | 'low' | 'mid' | 'high';

const BUDGET_RANGES: { id: BudgetRange; label: string; desc: string; range: string }[] = [
  { id: 'any', label: 'Any Budget', desc: 'Show me all options', range: '' },
  { id: 'low', label: 'Starter', desc: 'Cost-effective solutions', range: '$1K - $3K/mo' },
  { id: 'mid', label: 'Growth', desc: 'Balance of quality and cost', range: '$3K - $6K/mo' },
  { id: 'high', label: 'Enterprise', desc: 'Premium, top-tier agents', range: '$6K+/mo' },
];

const TOTAL_STEPS = 5;

interface WizardState {
  category: AgentCategory | null;
  priorities: Priority[];
  frameworks: AgentFramework[];
  budget: BudgetRange;
}

function computeMatchScore(agent: WDAgent, state: WizardState): number {
  let score = 50;

  if (state.category && agent.categories.includes(state.category)) score += 20;

  if (state.priorities.includes('speed')) {
    const time = agent.avgResponseTime;
    if (time.includes('< 10s') || time.includes('< 15s') || time.includes('< 8s')) score += 10;
    else if (time.includes('< 20s') || time.includes('< 30s') || time.includes('< 45s')) score += 6;
    else score += 2;
  }

  if (state.priorities.includes('accuracy')) {
    if (agent.successRate >= 97) score += 10;
    else if (agent.successRate >= 94) score += 7;
    else if (agent.successRate >= 90) score += 4;
  }

  if (state.priorities.includes('security')) {
    if (agent.securityClearance === 'enterprise') score += 10;
    else if (agent.securityClearance === 'standard') score += 5;
  }

  if (state.priorities.includes('experience')) {
    if (agent.jobsCompleted >= 300) score += 10;
    else if (agent.jobsCompleted >= 150) score += 7;
    else if (agent.jobsCompleted >= 80) score += 4;
  }

  if (state.priorities.includes('cost')) {
    if (agent.jobsCompleted < 100) score += 6;
    else score += 3;
  }

  if (state.frameworks.length > 0 && state.frameworks.includes(agent.framework)) {
    score += 8;
  }

  if (agent.isVerified) score += 3;
  if (agent.isOnline) score += 2;

  return Math.min(99, score);
}

/* ─── Step Indicator ─── */
function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="flex items-center gap-2">
          <motion.div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            animate={{
              background: i < current ? '#6366F1' : i === current ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.05)',
              color: i <= current ? '#fff' : '#64748B',
              border: i === current ? '2px solid #6366F1' : '2px solid transparent',
            }}
            transition={{ duration: 0.3 }}
          >
            {i < current ? <CheckCircle2 size={14} /> : i + 1}
          </motion.div>
          {i < total - 1 && (
            <motion.div
              className="w-8 h-0.5 rounded-full"
              animate={{
                background: i < current ? '#6366F1' : 'rgba(255,255,255,0.08)',
              }}
              transition={{ duration: 0.3 }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Step 1: Category ─── */
function StepCategory({ selected, onSelect }: { selected: AgentCategory | null; onSelect: (c: AgentCategory) => void }) {
  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">What kind of agent are you looking for?</h2>
      <p className="text-slate-400 mb-8">Select the category that best matches your needs.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ALL_CATEGORIES.map(cat => {
          const isActive = selected === cat;
          const visual = CATEGORY_VISUALS[cat];
          return (
            <motion.button
              key={cat}
              onClick={() => onSelect(cat)}
              className="relative rounded-xl p-5 text-left transition-all cursor-pointer overflow-hidden"
              style={{
                background: isActive ? visual.pillBg : 'rgba(255,255,255,0.03)',
                border: `2px solid ${isActive ? visual.hoverBorder : 'rgba(255,255,255,0.06)'}`,
              }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {isActive && (
                <motion.div
                  layoutId="category-glow"
                  className="absolute inset-0 rounded-xl pointer-events-none"
                  style={{ boxShadow: `inset 0 0 30px ${visual.glowColor}` }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <div className="relative z-10 flex items-start gap-4">
                <span className="text-2xl">{CATEGORY_ICONS[cat]}</span>
                <div>
                  <h3 className="font-semibold text-white text-sm mb-0.5">{cat}</h3>
                  <p className="text-xs text-slate-500">{CATEGORY_DESCRIPTIONS[cat]}</p>
                </div>
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto shrink-0"
                  >
                    <CheckCircle2 size={20} style={{ color: visual.accentColor }} />
                  </motion.div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Step 2: Priorities ─── */
function StepPriorities({ selected, onToggle }: { selected: Priority[]; onToggle: (p: Priority) => void }) {
  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">What matters most to you?</h2>
      <p className="text-slate-400 mb-8">Pick up to 3 priorities. We'll weight matches accordingly.</p>

      <div className="space-y-3">
        {PRIORITIES.map(p => {
          const isActive = selected.includes(p.id);
          const disabled = !isActive && selected.length >= 3;
          const Icon = p.icon;
          return (
            <motion.button
              key={p.id}
              onClick={() => !disabled && onToggle(p.id)}
              className="w-full rounded-xl p-5 text-left transition-all cursor-pointer flex items-center gap-4"
              style={{
                background: isActive ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.03)',
                border: `2px solid ${isActive ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.06)'}`,
                opacity: disabled ? 0.4 : 1,
              }}
              whileHover={disabled ? {} : { scale: 1.01 }}
              whileTap={disabled ? {} : { scale: 0.99 }}
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: isActive ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.05)' }}
              >
                <Icon size={20} className={isActive ? 'text-indigo-400' : 'text-slate-500'} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white text-sm">{p.label}</h3>
                <p className="text-xs text-slate-500">{p.desc}</p>
              </div>
              {isActive && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  <CheckCircle2 size={20} className="text-indigo-400" />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Step 3: Tech / Framework ─── */
function StepTech({ selected, onToggle }: { selected: AgentFramework[]; onToggle: (f: AgentFramework) => void }) {
  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Any framework preference?</h2>
      <p className="text-slate-400 mb-8">Select the frameworks you'd prefer, or skip to see all agents.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {FRAMEWORKS_LIST.map(fw => {
          const isActive = selected.includes(fw.name);
          return (
            <motion.button
              key={fw.name}
              onClick={() => onToggle(fw.name)}
              className="rounded-xl p-5 text-left transition-all cursor-pointer flex items-center gap-4"
              style={{
                background: isActive ? 'rgba(139,92,246,0.1)' : 'rgba(255,255,255,0.03)',
                border: `2px solid ${isActive ? 'rgba(139,92,246,0.4)' : 'rgba(255,255,255,0.06)'}`,
              }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: 'rgba(255,255,255,0.05)' }}
              >
                {fw.logo ? (
                  <img src={fw.logo} alt="" className="w-7 h-7 object-contain"
                    style={{ filter: isActive ? 'brightness(1.1)' : 'brightness(0.5) grayscale(0.5)' }}
                  />
                ) : (
                  <span className="text-slate-500 text-xs font-bold">C</span>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white text-sm">{fw.name}</h3>
              </div>
              {isActive && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  <CheckCircle2 size={20} className="text-purple-400" />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Step 4: Budget ─── */
function StepBudget({ selected, onSelect }: { selected: BudgetRange; onSelect: (b: BudgetRange) => void }) {
  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">What's your budget range?</h2>
      <p className="text-slate-400 mb-8">This helps us find agents within your price range.</p>

      <div className="space-y-3">
        {BUDGET_RANGES.map(b => {
          const isActive = selected === b.id;
          return (
            <motion.button
              key={b.id}
              onClick={() => onSelect(b.id)}
              className="w-full rounded-xl p-5 text-left transition-all cursor-pointer flex items-center gap-4"
              style={{
                background: isActive ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.03)',
                border: `2px solid ${isActive ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.06)'}`,
              }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-white text-sm">{b.label}</h3>
                  {b.range && <span className="text-xs text-emerald-400 font-medium">{b.range}</span>}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{b.desc}</p>
              </div>
              {isActive && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  <CheckCircle2 size={20} className="text-emerald-400" />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Step 5: Results ─── */
function StepResults({
  agents,
  onViewProfile,
  onReset,
}: {
  agents: { agent: WDAgent; score: number }[];
  onViewProfile: (id: string) => void;
  onReset: () => void;
}) {
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    if (revealed < agents.length) {
      const timer = setTimeout(() => setRevealed(r => r + 1), 300);
      return () => clearTimeout(timer);
    }
  }, [revealed, agents.length]);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">Your Top Matches</h2>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white transition-colors"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        >
          <RotateCcw size={12} /> Start Over
        </button>
      </div>
      <p className="text-slate-400 mb-8">
        We found <span className="text-white font-semibold">{agents.length}</span> agents that match your criteria, ranked by compatibility.
      </p>

      <div className="space-y-3">
        {agents.map(({ agent, score }, i) => {
          const visual = getCategoryVisual(agent.categories);
          const isRevealed = i < revealed;

          return (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={isRevealed ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.97 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => onViewProfile(agent.id)}
              className="group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300"
              style={{ background: '#111827', border: `1px solid rgba(255,255,255,0.06)` }}
            >
              {/* Rank badge */}
              <div
                className="absolute top-0 left-0 w-8 h-8 flex items-center justify-center text-xs font-bold rounded-br-xl z-20"
                style={{
                  background: i === 0 ? 'rgba(16,185,129,0.2)' : i === 1 ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.05)',
                  color: i === 0 ? '#10B981' : i === 1 ? '#818CF8' : '#64748B',
                }}
              >
                #{i + 1}
              </div>

              {/* Top shimmer */}
              <div
                className="absolute top-0 left-0 right-0 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `linear-gradient(180deg, rgba(${visual.accentColorRgb}, 0.06) 0%, transparent 100%)` }}
              />

              <div className="relative z-10 p-5 pl-10 flex items-center gap-4">
                <AgentAvatar agent={agent} size="lg" showStatus showRing={false} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-semibold truncate">{agent.name}</h3>
                    {agent.isVerified && (
                      <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full shrink-0"
                        style={{ background: 'rgba(16,185,129,0.15)' }}
                      >
                        <CheckCircle2 size={10} className="text-emerald-400" />
                        <span className="text-[9px] font-semibold text-emerald-400">Verified</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span>{agent.framework}</span>
                    <span className="text-slate-600">&middot;</span>
                    <span>{agent.model}</span>
                    <span className="text-slate-600">&middot;</span>
                    <span>{agent.successRate}% success</span>
                    <span className="text-slate-600">&middot;</span>
                    <span>{agent.jobsCompleted} jobs</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {agent.categories.map(cat => {
                      const catV = CATEGORY_VISUALS[cat];
                      return (
                        <span key={cat} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium"
                          style={{ background: catV.pillBg, border: `1px solid ${catV.pillBorder}`, color: catV.pillText }}
                        >
                          {CATEGORY_ICONS[cat]} {cat}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Match score */}
                <div className="shrink-0 text-right">
                  <MatchScoreRing score={score} color={visual.accentColor} size={56} />
                  <div className="text-[10px] text-slate-500 mt-1">match</div>
                </div>

                <ChevronRight size={18} className="text-slate-600 group-hover:text-white transition-colors shrink-0" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Match Score Ring ─── */
function MatchScoreRing({ score, color, size = 56 }: { score: number; color: string; size?: number }) {
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={strokeWidth} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          style={{ filter: `drop-shadow(0 0 6px ${color}50)` }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold" style={{ color }}>{score}%</span>
      </div>
    </div>
  );
}

/* ─── Main Wizard ─── */
export default function AgentMatchWizard() {
  const { isOpen, initialCategory, closeWizard } = useAgentWizard();
  const navigate = useNavigate();
  const { filterAgents } = useAgents();

  const [step, setStep] = useState(0);
  const [state, setState] = useState<WizardState>({
    category: null,
    priorities: [],
    frameworks: [],
    budget: 'any',
  });
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    if (isOpen) {
      if (initialCategory) {
        setStep(1);
        setState({ category: initialCategory, priorities: [], frameworks: [], budget: 'any' });
      } else {
        setStep(0);
        setState({ category: null, priorities: [], frameworks: [], budget: 'any' });
      }
      setDirection(1);
    }
  }, [isOpen, initialCategory]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeWizard(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, closeWizard]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const matchedAgents = useMemo(() => {
    const agents = filterAgents({
      category: state.category || undefined,
      framework: state.frameworks.length === 1 ? state.frameworks[0] : undefined,
    });

    let filtered = agents;
    if (state.frameworks.length > 1) {
      filtered = agents.filter(a => state.frameworks.includes(a.framework));
    }

    return filtered
      .map(agent => ({ agent, score: computeMatchScore(agent, state) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
  }, [filterAgents, state]);

  const goNext = useCallback(() => {
    setDirection(1);
    setStep(s => Math.min(s + 1, TOTAL_STEPS - 1));
  }, []);

  const goBack = useCallback(() => {
    setDirection(-1);
    setStep(s => Math.max(s - 1, 0));
  }, []);

  const canProceed = step === 0 ? !!state.category
    : step === 1 ? state.priorities.length > 0
    : true;

  const handleViewProfile = useCallback((id: string) => {
    closeWizard();
    navigate(`/workdraft/agents/${id}`);
  }, [closeWizard, navigate]);

  const handleReset = useCallback(() => {
    setDirection(-1);
    setState({ category: null, priorities: [], frameworks: [], budget: 'any' });
    setStep(0);
  }, []);

  const stepTitles = ['Category', 'Priorities', 'Framework', 'Budget', 'Results'];

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -80 : 80, opacity: 0 }),
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeWizard}
            className="fixed inset-0 z-[100]"
            style={{ background: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(12px)' }}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-x-0 top-0 bottom-0 z-[101] flex flex-col"
            style={{ fontFamily: 'Figtree, sans-serif' }}
          >
            <div className="flex-1 overflow-y-auto" onClick={(e) => { if (e.target === e.currentTarget) closeWizard(); }}>
              <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-8 pb-20">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, #6366F1, #7C3AED)' }}
                    >
                      <Sparkles size={20} className="text-white" />
                    </div>
                    <div>
                      <h1 className="text-lg font-bold text-white">Agent Match Wizard</h1>
                      <p className="text-xs text-slate-500">{stepTitles[step]} &middot; Step {step + 1} of {TOTAL_STEPS}</p>
                    </div>
                  </div>
                  <button
                    onClick={closeWizard}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                    style={{ background: 'rgba(255,255,255,0.06)' }}
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Step indicator */}
                <div className="flex justify-center mb-10">
                  <StepIndicator current={step} total={TOTAL_STEPS} />
                </div>

                {/* Step content */}
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={step}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {step === 0 && (
                      <StepCategory
                        selected={state.category}
                        onSelect={c => setState(s => ({ ...s, category: c }))}
                      />
                    )}
                    {step === 1 && (
                      <StepPriorities
                        selected={state.priorities}
                        onToggle={p => setState(s => ({
                          ...s,
                          priorities: s.priorities.includes(p)
                            ? s.priorities.filter(x => x !== p)
                            : [...s.priorities, p],
                        }))}
                      />
                    )}
                    {step === 2 && (
                      <StepTech
                        selected={state.frameworks}
                        onToggle={f => setState(s => ({
                          ...s,
                          frameworks: s.frameworks.includes(f)
                            ? s.frameworks.filter(x => x !== f)
                            : [...s.frameworks, f],
                        }))}
                      />
                    )}
                    {step === 3 && (
                      <StepBudget
                        selected={state.budget}
                        onSelect={b => setState(s => ({ ...s, budget: b }))}
                      />
                    )}
                    {step === 4 && (
                      <StepResults
                        agents={matchedAgents}
                        onViewProfile={handleViewProfile}
                        onReset={handleReset}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                {step < TOTAL_STEPS - 1 && (
                  <div className="flex items-center justify-between mt-10 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <button
                      onClick={goBack}
                      disabled={step === 0}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      style={{ background: 'rgba(255,255,255,0.05)' }}
                    >
                      <ArrowLeft size={16} /> Back
                    </button>

                    <div className="flex items-center gap-3">
                      {(step === 2 || step === 3) && (
                        <button
                          onClick={goNext}
                          className="text-sm text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                        >
                          Skip
                        </button>
                      )}
                      <button
                        onClick={step === 3 ? () => { setDirection(1); setStep(4); } : goNext}
                        disabled={!canProceed}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-indigo-500/20 cursor-pointer"
                        style={{
                          background: canProceed ? 'linear-gradient(135deg, #6366F1, #7C3AED)' : 'rgba(99,102,241,0.3)',
                        }}
                      >
                        {step === 3 ? (
                          <>Find My Agents <Sparkles size={16} /></>
                        ) : (
                          <>Continue <ArrowRight size={16} /></>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
