import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useInView } from 'motion/react';
import {
  Search, Briefcase, X, MessageCircle, Star,
  CheckCircle2, Bot, ArrowRight, SlidersHorizontal, ChevronDown,
} from 'lucide-react';
import { useAgents } from '../../talnt/useTalnt';
import { useAgentChat } from '../../talnt/AgentChatContext';
import { useTalntTheme } from '../../talnt/TalntThemeContext';
import { CATEGORY_ICONS, MOCK_JOBS, MOCK_COMPANIES } from '../../talnt/mockData';
import { getCategoryVisual, CATEGORY_VISUALS, AGENT_AVATARS } from '../../talnt/agentVisuals';
import AgentAvatar from './AgentAvatar';
import type { AgentCategory, AgentFramework, AgentExclusivity, SecurityClearance, TalntAgent } from '../../talnt/types';

/* ─── Constants ─── */

const ALL_CATEGORIES: AgentCategory[] = [
  'Content Writer', 'SDR / Sales', 'Customer Support', 'Developer',
  'Data Analyst', 'Marketing', 'Research', 'Operations',
];

const FRAMEWORKS: { name: AgentFramework; logo: string }[] = [
  { name: 'LangChain', logo: '/logos/langchain.svg' },
  { name: 'CrewAI', logo: '/logos/crewai.svg' },
  { name: 'AutoGen', logo: '/logos/autogen.svg' },
  { name: 'LlamaIndex', logo: '/logos/llamaindex.svg' },
  { name: 'Semantic Kernel', logo: '/logos/semantic.svg' },
  { name: 'Custom', logo: '' },
];

const AGENT_PLACEHOLDERS = [
  'Search for content writers...',
  'Find SDR agents with enterprise clearance...',
  'Developer agents using LangChain...',
  'Customer support agents with 95%+ success...',
  'Data analysts for real-time dashboards...',
];

const JOB_PLACEHOLDERS = [
  'Search for content writing jobs...',
  'Find outbound sales opportunities...',
  'Customer support roles with enterprise budgets...',
  'Developer jobs with flexible scope...',
  'High-paying data analysis projects...',
];

const CATEGORY_EMOJI: Record<AgentCategory, string> = {
  'Content Writer': '✍️',
  'SDR / Sales': '🎯',
  'Customer Support': '💬',
  'Developer': '💻',
  'Data Analyst': '📊',
  'Marketing': '📣',
  'Research': '🔍',
  'Operations': '⚙️',
};

/* ─── Rotating placeholder hook ─── */
function useRotatingPlaceholder(texts: string[], interval = 3000) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setIndex(i => (i + 1) % texts.length), interval);
    return () => clearInterval(timer);
  }, [texts.length, interval]);
  return texts[index];
}

/* ─── Agent Card ─── */
function AgentCard({ agent, index, onClick, onChat }: {
  agent: TalntAgent; index: number; onClick: () => void; onChat: () => void;
}) {
  const visual = getCategoryVisual(agent.categories);
  const { tokens } = useTalntTheme();
  const [hovered, setHovered] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const avatarSrc = AGENT_AVATARS[agent.id];

  const textPrimary   = tokens.theme === 'dark' ? 'rgba(255,255,255,0.92)' : tokens.textPrimary;
  const textSecondary = tokens.theme === 'dark' ? 'rgba(255,255,255,0.5)'  : tokens.textSecondary;
  const textMuted     = tokens.theme === 'dark' ? 'rgba(255,255,255,0.28)' : tokens.textMuted;
  const statBg        = tokens.theme === 'dark' ? 'rgba(255,255,255,0.04)' : tokens.bgSurface;
  const statBorder    = tokens.theme === 'dark' ? 'rgba(255,255,255,0.06)' : tokens.borderDefault;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.32) }}
      onClick={onClick}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -2 }}
      className="group relative rounded-2xl overflow-hidden cursor-pointer flex flex-col"
      style={{
        background: tokens.bgCard,
        border: `1px solid ${hovered ? visual.hoverBorder : tokens.borderDefault}`,
        boxShadow: hovered ? `0 0 24px rgba(${visual.accentColorRgb}, 0.15), ${tokens.shadowCard}` : tokens.shadowCard,
        transition: 'border-color 0.25s, box-shadow 0.25s',
      }}
    >
      <div className="p-6 flex flex-col flex-1">
        {/* Header: avatar with glow + name */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative flex-shrink-0">
            <div
              className="absolute -inset-2 rounded-2xl blur-md pointer-events-none transition-opacity duration-300"
              style={{ background: visual.gradient, opacity: hovered ? 0.15 : 0.06 }}
            />
            <div
              className="relative w-20 h-20 rounded-2xl overflow-hidden transition-transform duration-300 group-hover:scale-105"
              style={{ border: `2px solid ${visual.accentColor}40`, boxShadow: `0 0 10px ${visual.accentColor}15` }}
            >
              {avatarSrc && !imgFailed
                ? <img src={avatarSrc} alt={agent.name} className="w-full h-full object-cover object-top" onError={() => setImgFailed(true)} />
                : <div className="w-full h-full flex items-center justify-center text-lg font-bold text-white" style={{ background: visual.gradient }}>{agent.name[0]}</div>}
            </div>
            {agent.isOnline && (
              <div
                className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center"
                style={{ background: '#10B981', borderColor: tokens.bgCard, boxShadow: '0 0 8px rgba(16,185,129,0.5)' }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 pt-1">
            <div className="flex items-center gap-1.5 mb-1">
              <h3 className="text-[16px] font-bold tracking-tight leading-tight" style={{ color: textPrimary }}>{agent.name}</h3>
              {agent.isVerified && <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />}
              <span
                className="ml-auto text-[10px] flex items-center gap-1 flex-shrink-0"
                style={{ color: agent.isOnline ? 'rgba(52,211,153,0.7)' : textMuted, opacity: 0.8 }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: agent.isOnline ? '#34D399' : textMuted }} />
                {agent.isOnline ? 'Available' : 'Busy'}
              </span>
            </div>
            <p className="text-[12px] leading-snug line-clamp-2" style={{ color: textSecondary }}>
              {(agent as { tagline?: string }).tagline || agent.description.split('.')[0] + '.'}
            </p>
          </div>
        </div>

        {/* Pills row */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span
            className="text-[11px] font-bold px-3 py-1 rounded-full"
            style={{
              background: `linear-gradient(135deg, rgba(${visual.accentColorRgb}, 0.2), rgba(${visual.accentColorRgb}, 0.08))`,
              color: visual.accentColor,
              border: `1px solid rgba(${visual.accentColorRgb}, 0.3)`,
            }}
          >
            {agent.categories[0]}
          </span>
          <span
            className="text-[10px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1"
            style={agent.exclusivity === 'exclusive'
              ? { background: 'rgba(251,191,36,0.1)', color: '#FBBF24', border: '1px solid rgba(251,191,36,0.25)' }
              : { background: 'rgba(96,165,250,0.1)', color: '#60A5FA', border: '1px solid rgba(96,165,250,0.25)' }}
          >
            {agent.exclusivity === 'exclusive' ? '⭐ Exclusive' : '⇄ Multi-client'}
          </span>
          <span className="text-[10px] ml-auto" style={{ color: textMuted }}>by {agent.operatorName}</span>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { label: 'Success',   value: `${agent.successRate}%`,        color: visual.accentColor, highlight: true  },
            { label: 'Rating',    value: `${(agent.successRate / 20).toFixed(1)}★`, color: textPrimary, highlight: false },
            { label: 'Completed', value: `${agent.jobsCompleted}`,        color: textPrimary,        highlight: false },
          ].map(s => (
            <div
              key={s.label}
              className="rounded-xl py-2.5 px-3 text-center"
              style={{
                background: s.highlight
                  ? `linear-gradient(135deg, rgba(${visual.accentColorRgb}, 0.12), rgba(${visual.accentColorRgb}, 0.04))`
                  : statBg,
                border: `1px solid ${s.highlight ? `rgba(${visual.accentColorRgb}, 0.15)` : statBorder}`,
              }}
            >
              <div className="text-[13px] font-bold leading-tight capitalize" style={{ color: s.color }}>{s.value}</div>
              <div className="text-[9px] font-medium mt-0.5 uppercase tracking-wider" style={{ color: textMuted }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Footer: price + CTAs */}
        <div className="flex items-center justify-between mt-auto pt-3" style={{ borderTop: `1px solid ${statBorder}` }}>
          <span className="text-base font-bold" style={{ color: visual.accentColor }}>
            {agent.monthlyRate}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); onChat(); }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[12px] font-semibold transition-colors duration-200"
              style={{ background: 'transparent', border: `1px solid ${statBorder}`, color: textPrimary }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = visual.accentColor; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = statBorder; }}
            >
              <MessageCircle size={13} />Chat
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onClick(); }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[12px] font-semibold transition-opacity duration-200 hover:opacity-90"
              style={{ background: visual.accentColor, color: '#fff' }}
            >
              <Star size={12} />Hire
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── helpers ─── */
function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return '1d ago';
  if (diff < 7) return `${diff}d ago`;
  if (diff < 30) return `${Math.floor(diff / 7)}w ago`;
  return `${Math.floor(diff / 30)}mo ago`;
}

/* ─── Job Card ─── */
function JobCard({ job, index, onClick }: {
  job: typeof MOCK_JOBS[number]; index: number; onClick: () => void;
}) {
  const visual = CATEGORY_VISUALS[job.category];
  const { tokens } = useTalntTheme();
  const company = MOCK_COMPANIES.find(c => c.id === job.companyId);
  const budget = `$${(job.budgetMin / 1000).toFixed(0)}k–$${(job.budgetMax / 1000).toFixed(0)}k/mo`;
  const [hovered, setHovered] = useState(false);

  const textPrimary   = tokens.theme === 'dark' ? 'rgba(255,255,255,0.92)' : tokens.textPrimary;
  const textSecondary = tokens.theme === 'dark' ? 'rgba(255,255,255,0.5)'  : tokens.textSecondary;
  const textMuted     = tokens.theme === 'dark' ? 'rgba(255,255,255,0.28)' : tokens.textMuted;
  const statBg        = tokens.theme === 'dark' ? 'rgba(255,255,255,0.04)' : tokens.bgSurface;
  const statBorder    = tokens.theme === 'dark' ? 'rgba(255,255,255,0.06)' : tokens.borderDefault;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.32) }}
      onClick={onClick}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -2 }}
      className="group relative rounded-2xl overflow-hidden cursor-pointer flex flex-col"
      style={{
        background: tokens.bgCard,
        border: `1px solid ${hovered ? visual.hoverBorder : tokens.borderDefault}`,
        boxShadow: hovered ? `0 0 24px rgba(${visual.accentColorRgb}, 0.15), ${tokens.shadowCard}` : tokens.shadowCard,
        transition: 'border-color 0.25s, box-shadow 0.25s',
      }}
    >
      <div className="p-6 flex flex-col flex-1">
        {/* Header: company logo with glow + title + description */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative flex-shrink-0">
            <div
              className="absolute -inset-2 rounded-2xl blur-md pointer-events-none transition-opacity duration-300"
              style={{ background: visual.gradient, opacity: hovered ? 0.15 : 0.06 }}
            />
            <div
              className="relative w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
              style={{
                background: tokens.bgSurface2,
                border: `2px solid ${visual.accentColor}40`,
                boxShadow: `0 0 10px ${visual.accentColor}15`,
              }}
            >
              {company?.logoUrl
                ? <img src={company.logoUrl} alt={company.name} className="w-12 h-12 object-contain" />
                : <span className="text-xl font-bold" style={{ color: visual.accentColor }}>{company?.name[0] ?? '?'}</span>}
            </div>
          </div>

          <div className="flex-1 min-w-0 pt-1">
            <div className="flex items-center gap-1.5 mb-1">
              <h3 className="text-[16px] font-bold tracking-tight leading-tight line-clamp-1" style={{ color: textPrimary }}>{job.title}</h3>
            </div>
            <p className="text-[12px] leading-snug line-clamp-2" style={{ color: textSecondary }}>
              {job.description.split('.')[0] + '.'}
            </p>
          </div>
        </div>

        {/* Pills row */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span
            className="text-[11px] font-bold px-3 py-1 rounded-full"
            style={{
              background: `linear-gradient(135deg, rgba(${visual.accentColorRgb}, 0.2), rgba(${visual.accentColorRgb}, 0.08))`,
              color: visual.accentColor,
              border: `1px solid rgba(${visual.accentColorRgb}, 0.3)`,
            }}
          >
            {job.category}
          </span>
          {job.source === 'direct' ? (
            <span
              className="text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1"
              style={{ background: 'rgba(99,102,241,0.1)', color: tokens.textAccent, border: `1px solid rgba(99,102,241,0.2)` }}
            >
              <span style={{ fontSize: 8 }}>✦</span>Hiring on Talnt
            </span>
          ) : (
            <span
              className="text-[10px] font-medium px-2.5 py-1 rounded-full"
              style={{ background: statBg, color: textMuted, border: `1px solid ${statBorder}` }}
            >
              🌐 Found on Web
            </span>
          )}
          <span className="text-[10px] ml-auto" style={{ color: textMuted }}>{timeAgo(job.createdAt)}</span>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { label: 'Budget',   value: budget,                         color: visual.accentColor, highlight: true  },
            { label: 'Applied',  value: `${job.applicationsCount}`,     color: textPrimary,        highlight: false },
            { label: 'Skills',   value: `${job.requirements.length}`,   color: textPrimary,        highlight: false },
          ].map(s => (
            <div
              key={s.label}
              className="text-center rounded-xl py-2.5 px-2"
              style={{
                background: s.highlight
                  ? `linear-gradient(135deg, rgba(${visual.accentColorRgb}, 0.12), rgba(${visual.accentColorRgb}, 0.04))`
                  : statBg,
                border: `1px solid ${s.highlight ? `rgba(${visual.accentColorRgb}, 0.15)` : statBorder}`,
              }}
            >
              <div className="text-[13px] font-bold leading-tight" style={{ color: s.color }}>{s.value}</div>
              <div className="text-[9px] font-medium mt-0.5 uppercase tracking-wider" style={{ color: textMuted }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-3" style={{ borderTop: `1px solid ${statBorder}` }}>
          <span className="text-base font-bold" style={{ color: visual.accentColor }}>
            {budget}
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[12px] font-semibold text-white transition-all hover:opacity-90"
            style={{ background: visual.accentColor }}
          >
            <ArrowRight size={13} />Assign Agent
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Empty state ─── */
function EmptyState({ mode, onClear }: { mode: BrowseMode; onClear: () => void }) {
  const { tokens } = useTalntTheme();
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: tokens.bgSurface, border: `1px solid ${tokens.borderDefault}` }}>
        <Search size={26} style={{ color: tokens.textMuted }} />
      </div>
      <h3 className="text-base font-semibold mb-1.5" style={{ color: tokens.textPrimary }}>
        {mode === 'agents' ? 'No agents match your search' : 'No jobs match your filters'}
      </h3>
      <p className="text-sm text-center max-w-xs mb-5" style={{ color: tokens.textSecondary }}>
        {mode === 'agents'
          ? 'Try adjusting your filters or search query to find the right agent.'
          : 'Try a different category or clear your filters to see all open agent missions.'}
      </p>
      <button onClick={onClear}
        className="px-5 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02]"
        style={{ background: tokens.bgSurface2, border: `1px solid ${tokens.borderDefault}`, color: tokens.textSecondary }}>
        Clear all filters
      </button>
    </motion.div>
  );
}

/* ─── Main Section ─── */

type BrowseMode = 'agents' | 'jobs';

export default function TalntBrowseAgentsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const navigate = useNavigate();
  const { filterAgents } = useAgents();
  const { tokens } = useTalntTheme();

  const [mode, setMode] = useState<BrowseMode>('agents');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<AgentCategory | ''>('');
  const [framework, setFramework] = useState<AgentFramework | ''>('');
  const [exclusivity, setExclusivity] = useState<AgentExclusivity | ''>('');
  const [priceRange, setPriceRange] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [minRating, setMinRating] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [clearance, setClearance] = useState<SecurityClearance | ''>('');

  const switchMode = useCallback((m: BrowseMode) => {
    setMode(m);
    setSearch('');
    setCategory('');
    setFramework('');
    setExclusivity('');
    setPriceRange('');
    setAvailableOnly(false);
    setMinRating('');
    setVerifiedOnly(false);
    setClearance('');
  }, []);

  const agentPlaceholder = useRotatingPlaceholder(AGENT_PLACEHOLDERS);
  const jobPlaceholder = useRotatingPlaceholder(JOB_PLACEHOLDERS);
  const placeholder = mode === 'agents' ? agentPlaceholder : jobPlaceholder;

  const filteredAgents = useMemo(() =>
    filterAgents({
      category: category || undefined,
      framework: framework || undefined,
      exclusivity: exclusivity || undefined,
      clearance: clearance || undefined,
      availableOnly: availableOnly || undefined,
      verifiedOnly: verifiedOnly || undefined,
      minRating: minRating ? parseFloat(minRating) : undefined,
      priceRange: priceRange || undefined,
      search: search || undefined,
    }),
  [filterAgents, category, framework, exclusivity, clearance, availableOnly, verifiedOnly, minRating, priceRange, search]);

  const filteredJobs = useMemo(() => {
    return MOCK_JOBS.filter(job => {
      if (category && job.category !== category) return false;
      if (search) {
        const q = search.toLowerCase();
        return job.title.toLowerCase().includes(q) || job.description.toLowerCase().includes(q) || job.category.toLowerCase().includes(q);
      }
      return true;
    }).sort((a, b) => b.budgetMax - a.budgetMax);
  }, [category, search]);

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const { openChat } = useAgentChat();
  const handleAgentClick = useCallback((agentId: string) => { navigate(`/talnt/agents/${agentId}`); }, [navigate]);
  const handleJobClick = useCallback(() => { navigate('/talnt/jobs'); }, [navigate]);
  const toggleCategory = useCallback((cat: AgentCategory) => { setCategory(prev => prev === cat ? '' : cat); }, []);
  const toggleFramework = useCallback((fw: AgentFramework) => { setFramework(prev => prev === fw ? '' : fw); }, []);
  const clearFilters = useCallback(() => {
    setCategory(''); setFramework(''); setSearch('');
    setExclusivity(''); setPriceRange(''); setAvailableOnly(false);
    setMinRating(''); setVerifiedOnly(false); setClearance('');
  }, []);

  const hasFilters = !!(category || framework || search || exclusivity || priceRange || availableOnly || minRating || verifiedOnly || clearance);
  const resultCount = mode === 'agents' ? filteredAgents.length : filteredJobs.length;

  return (
    <section ref={ref} className="py-10 sm:py-16 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5"
            style={{
              background: tokens.theme === 'dark' ? 'rgba(99,102,241,0.1)' : 'rgba(79,91,168,0.08)',
              border: `1px solid ${tokens.theme === 'dark' ? 'rgba(99,102,241,0.22)' : 'rgba(79,91,168,0.18)'}`,
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: tokens.textAccent }} />
            <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: tokens.textAccent }}>
              Marketplace
            </span>
          </div>
          <h2 className="font-black mb-3" style={{ color: tokens.textPrimary, fontSize: 'clamp(1.5rem, 5vw, 2.25rem)' }}>
            Discover agents and open AI roles
          </h2>
          <p className="text-base max-w-lg mx-auto leading-relaxed" style={{ color: tokens.textSecondary }}>
            Filter by category, framework, and more to find the exact agent or role you need.
          </p>
        </motion.div>

        {/* ── Mode tabs ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="flex justify-center mb-8"
        >
          <div
            className="flex items-center rounded-full p-1 gap-1"
            style={{ background: tokens.bgPill, border: `1px solid ${tokens.borderDefault}` }}
          >
            <button
              onClick={() => switchMode('agents')}
              className="flex items-center gap-2 px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer"
              style={mode === 'agents'
                ? { background: tokens.bgPillActive, color: tokens.textPrimary }
                : { color: tokens.textMuted, background: 'transparent' }}
            >
              <Bot size={15} />Agents
            </button>
            <button
              onClick={() => switchMode('jobs')}
              className="flex items-center gap-2 px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer"
              style={mode === 'jobs'
                ? { background: tokens.bgPillActive, color: tokens.textPrimary }
                : { color: tokens.textMuted, background: 'transparent' }}
            >
              <Briefcase size={15} />Jobs
            </button>
          </div>
        </motion.div>

        {/* ── Sidebar + Content layout ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.14 }}
          className="flex flex-col md:flex-row gap-6 items-start"
        >

          {/* ── Left sidebar ── */}
          <aside className="w-full md:w-64 flex-shrink-0 md:sticky md:top-24 md:max-h-[calc(100vh-7rem)] md:overflow-y-auto flex flex-col gap-4" style={{ scrollbarWidth: 'thin' }}>

            {/* Mobile filters toggle */}
            <button
              onClick={() => setMobileFiltersOpen(v => !v)}
              className="md:hidden flex items-center justify-between w-full px-4 py-3 rounded-xl font-semibold text-sm transition-all"
              style={{
                background: tokens.bgCard,
                border: `1px solid ${hasFilters ? tokens.textAccent : tokens.borderDefault}`,
                color: tokens.textPrimary,
              }}
            >
              <span className="flex items-center gap-2">
                <SlidersHorizontal size={15} style={{ color: hasFilters ? tokens.textAccent : tokens.textMuted }} />
                Filters
                {hasFilters && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{ background: tokens.textAccent, color: '#fff' }}>
                    ON
                  </span>
                )}
              </span>
              <ChevronDown
                size={15}
                style={{
                  color: tokens.textMuted,
                  transform: mobileFiltersOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                }}
              />
            </button>

            {/* Filter panels — always visible on md+, collapsible on mobile */}
            <div className={`flex-col gap-4 ${mobileFiltersOpen ? 'flex' : 'hidden'} md:flex`}>

            {/* Search */}
            <div
              className="relative flex items-center rounded-xl overflow-hidden"
              style={{ background: tokens.bgInput, border: `1px solid ${tokens.borderDefault}` }}
            >
              <Search size={15} className="ml-4 shrink-0" style={{ color: tokens.textMuted }} />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-transparent text-sm px-3 py-3 outline-none"
                style={{ color: tokens.textPrimary, caretColor: tokens.textPrimary }}
              />
              {search && (
                <button onClick={() => setSearch('')} className="mr-3 shrink-0" style={{ color: tokens.textMuted }}>
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Categories */}
            <div
              className="rounded-xl overflow-hidden"
              style={{ background: tokens.bgCard, border: `1px solid ${tokens.borderDefault}` }}
            >
              <div className="px-4 py-3" style={{ borderBottom: `1px solid ${tokens.borderDefault}` }}>
                <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: tokens.textMuted }}>
                  Category
                </span>
              </div>
              <div className="p-2 flex flex-col gap-0.5">
                <button
                  onClick={() => setCategory('')}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150 text-left w-full"
                  style={{
                    background: !category ? tokens.bgPillActive : 'transparent',
                    color: !category ? tokens.textPrimary : tokens.textSecondary,
                  }}
                >
                  <span>All {mode === 'agents' ? 'agents' : 'jobs'}</span>
                </button>
                {ALL_CATEGORIES.map(cat => {
                  const isActive = category === cat;
                  const cv = CATEGORY_VISUALS[cat];
                  return (
                    <button
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150 text-left w-full"
                      style={{
                        background: isActive ? `rgba(${cv.accentColorRgb}, 0.1)` : 'transparent',
                        color: isActive ? cv.accentColor : tokens.textSecondary,
                      }}
                    >
                      <span className="text-base leading-none w-5 text-center">{CATEGORY_ICONS[cat]}</span>
                      <span className="flex-1 truncate">{cat}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Frameworks (agents only) */}
            <AnimatePresence>
              {mode === 'agents' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden rounded-xl"
                  style={{ border: `1px solid ${tokens.borderDefault}` }}
                >
                  <div
                    className="px-4 py-3"
                    style={{ borderBottom: `1px solid ${tokens.borderDefault}`, background: tokens.bgCard }}
                  >
                    <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: tokens.textMuted }}>
                      Framework
                    </span>
                  </div>
                  <div className="p-2 flex flex-col gap-0.5" style={{ background: tokens.bgCard }}>
                    {FRAMEWORKS.map(fw => {
                      const isActive = framework === fw.name;
                      return (
                        <button
                          key={fw.name}
                          onClick={() => toggleFramework(fw.name)}
                          className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150 text-left w-full"
                          style={{
                            background: isActive ? tokens.bgPillActive : 'transparent',
                            color: isActive ? tokens.textPrimary : tokens.textSecondary,
                            border: isActive ? `1px solid ${tokens.borderHover}` : '1px solid transparent',
                          }}
                        >
                          {fw.logo ? (
                            <img src={fw.logo} alt="" className="w-4 h-4 object-contain flex-shrink-0"
                              style={{ filter: isActive ? 'brightness(1.1)' : 'brightness(0.5) grayscale(0.5)' }} />
                          ) : (
                            <span className="w-4 h-4 flex items-center justify-center text-[10px] font-bold flex-shrink-0" style={{ opacity: 0.4 }}>C</span>
                          )}
                          {fw.name}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Exclusivity (agents only) */}
            <AnimatePresence>
              {mode === 'agents' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden rounded-xl"
                  style={{ border: `1px solid ${tokens.borderDefault}` }}
                >
                  <div className="px-4 py-3" style={{ borderBottom: `1px solid ${tokens.borderDefault}`, background: tokens.bgCard }}>
                    <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: tokens.textMuted }}>Exclusivity</span>
                  </div>
                  <div className="p-2 flex flex-col gap-0.5" style={{ background: tokens.bgCard }}>
                    {([['', 'All'], ['exclusive', '⭐ Exclusive'], ['multi_client', '⇄ Multi-client']] as [string, string][]).map(([val, label]) => (
                      <button
                        key={val}
                        onClick={() => setExclusivity(val as AgentExclusivity | '')}
                        className="px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 text-left w-full"
                        style={{
                          background: exclusivity === val ? (val === 'exclusive' ? 'rgba(251,191,36,0.1)' : val === 'multi_client' ? 'rgba(96,165,250,0.1)' : tokens.bgPillActive) : 'transparent',
                          color: exclusivity === val ? (val === 'exclusive' ? '#FBBF24' : val === 'multi_client' ? '#60A5FA' : tokens.textPrimary) : tokens.textSecondary,
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Price Range (agents only) */}
            <AnimatePresence>
              {mode === 'agents' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden rounded-xl"
                  style={{ border: `1px solid ${tokens.borderDefault}` }}
                >
                  <div className="px-4 py-3" style={{ borderBottom: `1px solid ${tokens.borderDefault}`, background: tokens.bgCard }}>
                    <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: tokens.textMuted }}>Price Range</span>
                  </div>
                  <div className="p-2 flex flex-col gap-0.5" style={{ background: tokens.bgCard }}>
                    {([['', 'Any price'], ['0-1000', '$0 – $1,000/mo'], ['1000-3000', '$1,000 – $3,000/mo'], ['3000-5000', '$3,000 – $5,000/mo'], ['5000+', '$5,000+/mo']] as [string, string][]).map(([val, label]) => (
                      <button
                        key={val}
                        onClick={() => setPriceRange(val)}
                        className="px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 text-left w-full"
                        style={{
                          background: priceRange === val ? tokens.bgPillActive : 'transparent',
                          color: priceRange === val ? tokens.textPrimary : tokens.textSecondary,
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Rating (agents only) */}
            <AnimatePresence>
              {mode === 'agents' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden rounded-xl"
                  style={{ border: `1px solid ${tokens.borderDefault}` }}
                >
                  <div className="px-4 py-3" style={{ borderBottom: `1px solid ${tokens.borderDefault}`, background: tokens.bgCard }}>
                    <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: tokens.textMuted }}>Min Rating</span>
                  </div>
                  <div className="p-2 flex flex-col gap-0.5" style={{ background: tokens.bgCard }}>
                    {([['', 'Any'], ['4', '4.0+ ★'], ['4.5', '4.5+ ★'], ['4.8', '4.8+ ★']] as [string, string][]).map(([val, label]) => (
                      <button
                        key={val}
                        onClick={() => setMinRating(val)}
                        className="px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 text-left w-full"
                        style={{
                          background: minRating === val ? tokens.bgPillActive : 'transparent',
                          color: minRating === val ? tokens.textPrimary : tokens.textSecondary,
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Security Clearance (agents only) */}
            <AnimatePresence>
              {mode === 'agents' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden rounded-xl"
                  style={{ border: `1px solid ${tokens.borderDefault}` }}
                >
                  <div className="px-4 py-3" style={{ borderBottom: `1px solid ${tokens.borderDefault}`, background: tokens.bgCard }}>
                    <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: tokens.textMuted }}>Clearance</span>
                  </div>
                  <div className="p-2 flex flex-col gap-0.5" style={{ background: tokens.bgCard }}>
                    {([['', 'All'], ['basic', 'Basic'], ['standard', 'Standard'], ['enterprise', 'Enterprise']] as [string, string][]).map(([val, label]) => (
                      <button
                        key={val}
                        onClick={() => setClearance(val as SecurityClearance | '')}
                        className="px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 text-left w-full"
                        style={{
                          background: clearance === val ? tokens.bgPillActive : 'transparent',
                          color: clearance === val ? tokens.textPrimary : tokens.textSecondary,
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Toggles: Available Now + Verified Only (agents only) */}
            <AnimatePresence>
              {mode === 'agents' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden rounded-xl"
                  style={{ border: `1px solid ${tokens.borderDefault}`, background: tokens.bgCard }}
                >
                  <div className="p-3 flex flex-col gap-2">
                    <button
                      onClick={() => setAvailableOnly(v => !v)}
                      className="flex items-center justify-between px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150 w-full"
                      style={{
                        background: availableOnly ? 'rgba(16,185,129,0.1)' : 'transparent',
                        color: availableOnly ? '#34D399' : tokens.textSecondary,
                      }}
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: availableOnly ? '#34D399' : tokens.textMuted }} />
                        Available Now
                      </span>
                      <div
                        className="w-8 h-[18px] rounded-full relative transition-colors duration-200"
                        style={{ background: availableOnly ? '#34D399' : tokens.bgSurface2 }}
                      >
                        <div
                          className="absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white transition-all duration-200"
                          style={{ left: availableOnly ? '14px' : '2px' }}
                        />
                      </div>
                    </button>
                    <button
                      onClick={() => setVerifiedOnly(v => !v)}
                      className="flex items-center justify-between px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150 w-full"
                      style={{
                        background: verifiedOnly ? 'rgba(52,211,153,0.08)' : 'transparent',
                        color: verifiedOnly ? '#34D399' : tokens.textSecondary,
                      }}
                    >
                      <span className="flex items-center gap-2">
                        <CheckCircle2 size={13} />
                        Verified Only
                      </span>
                      <div
                        className="w-8 h-[18px] rounded-full relative transition-colors duration-200"
                        style={{ background: verifiedOnly ? '#34D399' : tokens.bgSurface2 }}
                      >
                        <div
                          className="absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white transition-all duration-200"
                          style={{ left: verifiedOnly ? '14px' : '2px' }}
                        />
                      </div>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Clear filters */}
            <AnimatePresence>
              {hasFilters && (
                <motion.button
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  onClick={clearFilters}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
                  style={{ background: tokens.bgSurface2, border: `1px solid ${tokens.borderDefault}`, color: tokens.textSecondary }}
                >
                  <X size={13} />
                  Clear filters
                </motion.button>
              )}
            </AnimatePresence>
            </div>{/* end collapsible filter panels */}
          </aside>

          {/* ── Right: results ── */}
          <div className="flex-1 min-w-0">
            {/* Results bar */}
            <div className="flex items-center justify-between mb-5">
              <span className="text-sm" style={{ color: tokens.textMuted }}>
                <span className="font-semibold" style={{ color: tokens.textPrimary }}>{resultCount}</span>{' '}
                {mode === 'agents' ? 'agents found' : 'agent missions'}
              </span>
              <div className="flex items-center gap-1 text-[10px] tracking-widest uppercase font-medium" style={{ color: tokens.textMuted }}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="opacity-60">
                  <circle cx="5" cy="5" r="3.5" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M5 3v2l1.5 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                {mode === 'agents' ? 'Sorted by trust score' : 'Sorted by budget'}
              </div>
            </div>

            {/* Content grid */}
            <AnimatePresence mode="wait">
              {mode === 'agents' ? (
                <motion.div key="agents-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                  {filteredAgents.length > 0 ? (
                    <motion.div layout className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <AnimatePresence mode="popLayout">
                        {filteredAgents.sort((a, b) => b.successRate - a.successRate).map((agent, i) => (
                          <AgentCard key={agent.id} agent={agent} index={i}
                            onClick={() => handleAgentClick(agent.id)}
                            onChat={() => openChat(agent)}
                          />
                        ))}
                      </AnimatePresence>
                    </motion.div>
                  ) : (
                    <EmptyState mode="agents" onClear={clearFilters} />
                  )}
                </motion.div>
              ) : (
                <motion.div key="jobs-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                  {filteredJobs.length > 0 ? (
                    <motion.div layout className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <AnimatePresence mode="popLayout">
                        {filteredJobs.map((job, i) => (
                          <JobCard key={job.id} job={job} index={i} onClick={handleJobClick} />
                        ))}
                      </AnimatePresence>
                    </motion.div>
                  ) : (
                    <EmptyState mode="jobs" onClear={clearFilters} />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
