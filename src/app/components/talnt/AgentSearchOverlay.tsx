import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAgentSearch } from '../../talnt/AgentSearchContext';
import { useAgents } from '../../talnt/useTalnt';
import { useTalntTheme } from '../../talnt/TalntThemeContext';
import { CATEGORY_ICONS } from '../../talnt/mockData';
import { getCategoryVisual, CATEGORY_VISUALS } from '../../talnt/agentVisuals';
import AgentAvatar from './AgentAvatar';
import type { AgentCategory, AgentFramework, TalntAgent } from '../../talnt/types';
import { X, Search, Shield, Zap, Clock, CheckCircle2, Briefcase, ChevronRight, MessageCircle } from 'lucide-react';
import { useAgentChat } from '../../talnt/AgentChatContext';

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

const PLACEHOLDER_TEXTS = [
  'Search for content writers...',
  'Find SDR agents with enterprise clearance...',
  'Developer agents using LangChain...',
  'Customer support agents with 95%+ success...',
  'Data analysts for real-time dashboards...',
];

function getTrustColor(rate: number) {
  if (rate >= 95) return '#10B981';
  if (rate >= 90) return '#F59E0B';
  return '#EF4444';
}

/* ─── Trust Score Ring ─── */
function TrustRing({ score, size = 48, color: overrideColor }: { score: number; size?: number; color?: string }) {
  const { tokens } = useTalntTheme();
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = overrideColor || getTrustColor(score);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={tokens.bgSurface2} strokeWidth={strokeWidth} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{ filter: `drop-shadow(0 0 4px ${color}50)` }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold" style={{ color }}>{Math.round(score)}%</span>
      </div>
    </div>
  );
}

/* ─── Rotating Placeholder ─── */
function useRotatingPlaceholder(texts: string[], interval = 3000) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setIndex(i => (i + 1) % texts.length), interval);
    return () => clearInterval(timer);
  }, [texts.length, interval]);
  return texts[index];
}

/* ─── Agent Card ─── */
function AgentCard({ agent, index, onClick, onChat }: { agent: TalntAgent; index: number; onClick: () => void; onChat: () => void }) {
  const { tokens } = useTalntTheme();
  const visual = getCategoryVisual(agent.categories);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.4) }}
      onClick={onClick}
      className="group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300"
      style={{ background: tokens.bgCard, border: `1px solid ${tokens.borderDefault}` }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onHoverStart={(e: any) => { if (e.currentTarget) e.currentTarget.style.borderColor = visual.hoverBorder; }}
      onHoverEnd={(e: any) => { if (e.currentTarget) e.currentTarget.style.borderColor = tokens.borderDefault; }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `linear-gradient(180deg, rgba(${visual.accentColorRgb}, 0.06) 0%, transparent 100%)`,
        }}
      />

      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ boxShadow: `0 0 30px rgba(${visual.accentColorRgb}, 0.08), inset 0 0 0 1px rgba(${visual.accentColorRgb}, 0.2)` }}
      />

      <div className="relative z-10 p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <AgentAvatar agent={agent} size="md" showStatus showRing={false} />

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm truncate" style={{ color: tokens.textPrimary }}>{agent.name}</h3>
                {agent.isVerified && (
                  <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full shrink-0"
                    style={{ background: 'rgba(16,185,129,0.15)' }}
                  >
                    <CheckCircle2 size={10} className="text-emerald-400" />
                    <span className="text-[9px] font-semibold text-emerald-400">Verified</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                {FRAMEWORKS.find(f => f.name === agent.framework)?.logo && (
                  <img
                    src={FRAMEWORKS.find(f => f.name === agent.framework)!.logo}
                    alt=""
                    className="w-3.5 h-3.5 rounded-sm object-contain"
                    style={{ filter: 'brightness(0.9)' }}
                  />
                )}
                <span className="text-[11px]" style={{ color: tokens.textSecondary }}>{agent.framework}</span>
                <span className="text-[10px]" style={{ color: tokens.textMuted }}>&middot;</span>
                <span className="text-[11px]" style={{ color: tokens.textMuted }}>{agent.model}</span>
              </div>
            </div>
          </div>

          <TrustRing score={agent.successRate} size={44} color={visual.accentColor} />
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {agent.categories.map(cat => {
            const catVisual = CATEGORY_VISUALS[cat];
            return (
              <span key={cat} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium"
                style={{ background: catVisual.pillBg, border: `1px solid ${catVisual.pillBorder}`, color: catVisual.pillText }}
              >
                <span className="text-xs">{CATEGORY_ICONS[cat]}</span>
                {cat}
              </span>
            );
          })}
        </div>

        <div className="flex items-center gap-4 mb-3 py-2 px-3 rounded-lg" style={{ background: tokens.bgSurface }}>
          <div className="flex items-center gap-1.5">
            <Zap size={11} style={{ color: visual.accentColor }} />
            <span className="text-[11px]" style={{ color: tokens.textSecondary }}>{agent.avgResponseTime}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Briefcase size={11} style={{ color: visual.accentColor, opacity: 0.7 }} />
            <span className="text-[11px]" style={{ color: tokens.textSecondary }}>{agent.jobsCompleted} jobs</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Shield size={11} style={{ color: tokens.textAccent }} />
            <span className="text-[11px] capitalize" style={{ color: tokens.textSecondary }}>{agent.securityClearance}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[10px]" style={{ color: tokens.textMuted }}>
            Operated by <span style={{ color: tokens.textSecondary }}>{agent.operatorName}</span>
          </span>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => { e.stopPropagation(); onChat(); }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all duration-200 hover:scale-105"
              style={{
                background: `rgba(${visual.accentColorRgb}, 0.12)`,
                border: `1px solid rgba(${visual.accentColorRgb}, 0.25)`,
                color: visual.accentColor,
              }}
            >
              <MessageCircle size={12} />
              Chat
            </button>
            <span className="flex items-center gap-1 text-[11px] font-medium"
              style={{ color: visual.accentColor }}
            >
              Profile <ChevronRight size={12} />
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main Overlay ─── */
export default function AgentSearchOverlay() {
  const { tokens } = useTalntTheme();
  const { isOpen, closeSearch, initialCategory, initialFramework } = useAgentSearch();
  const navigate = useNavigate();
  const { filterAgents } = useAgents();
  const inputRef = useRef<HTMLInputElement>(null);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<AgentCategory | ''>('');
  const [framework, setFramework] = useState<AgentFramework | ''>('');

  const placeholder = useRotatingPlaceholder(PLACEHOLDER_TEXTS);

  // Apply initial filters when overlay opens
  useEffect(() => {
    if (isOpen) {
      setCategory(initialCategory || '');
      setFramework(initialFramework || '');
      setSearch('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, initialCategory, initialFramework]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeSearch(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, closeSearch]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const filteredAgents = useMemo(() =>
    filterAgents({
      category: category || undefined,
      framework: framework || undefined,
      search: search || undefined,
    }),
  [filterAgents, category, framework, search]);

  const { openChat } = useAgentChat();

  const handleAgentClick = useCallback((agentId: string) => {
    closeSearch();
    navigate(`/talnt/agents/${agentId}`);
  }, [closeSearch, navigate]);

  const handleAgentChat = useCallback((agent: TalntAgent) => {
    closeSearch();
    openChat(agent);
  }, [closeSearch, openChat]);

  const toggleCategory = useCallback((cat: AgentCategory) => {
    setCategory(prev => prev === cat ? '' : cat);
  }, []);

  const toggleFramework = useCallback((fw: AgentFramework) => {
    setFramework(prev => prev === fw ? '' : fw);
  }, []);

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
            onClick={closeSearch}
            className="fixed inset-0 z-[100]"
            style={{ background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)' }}
          />

          {/* Content panel */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-x-0 top-0 bottom-0 z-[101] flex flex-col"
            style={{ fontFamily: 'Figtree, sans-serif', background: tokens.bgPage }}
          >
            <div className="flex-1 overflow-y-auto" onClick={(e) => { if (e.target === e.currentTarget) closeSearch(); }}>
              <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-20">

                {/* Close button */}
                <div className="flex justify-end mb-4">
                  <button
                    onClick={closeSearch}
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:text-[var(--talnt-text-primary)]"
                    style={{ background: tokens.bgSurface, color: tokens.textSecondary }}
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Search input */}
                <div className="relative mb-8">
                  <div className="absolute -inset-1 rounded-2xl opacity-40 blur-md pointer-events-none"
                    style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.2))' }}
                  />
                  <div className="relative flex items-center rounded-2xl overflow-hidden"
                    style={{ background: tokens.bgInput, border: `1px solid ${tokens.borderHover}` }}
                  >
                    <Search size={20} className="ml-5 shrink-0" style={{ color: tokens.textAccent }} />
                    <input
                      ref={inputRef}
                      type="text"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder={placeholder}
                      className="w-full bg-transparent text-lg px-4 py-4 outline-none placeholder:text-[var(--talnt-placeholder)]"
                      style={{ color: tokens.textPrimary }}
                    />
                    {search && (
                      <button onClick={() => setSearch('')} className="mr-4 transition-colors shrink-0 hover:text-[var(--talnt-text-primary)]" style={{ color: tokens.textMuted }}>
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Category pills */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setCategory('')}
                      className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
                      style={{
                        background: !category ? 'rgba(99,102,241,0.2)' : 'transparent',
                        border: `1px solid ${!category ? 'rgba(99,102,241,0.4)' : tokens.borderDefault}`,
                        color: !category ? tokens.textAccent : tokens.textSecondary,
                        boxShadow: !category ? '0 0 12px rgba(99,102,241,0.15)' : 'none',
                      }}
                    >
                      All Agents
                    </button>
                    {ALL_CATEGORIES.map(cat => {
                      const isActive = category === cat;
                      const catVisual = CATEGORY_VISUALS[cat];
                      return (
                        <button
                          key={cat}
                          onClick={() => toggleCategory(cat)}
                          className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
                          style={{
                            background: isActive ? catVisual.pillBg : 'transparent',
                            border: `1px solid ${isActive ? catVisual.hoverBorder : tokens.borderDefault}`,
                            color: isActive ? catVisual.pillText : tokens.textSecondary,
                            boxShadow: isActive ? `0 0 12px ${catVisual.glowColor}` : 'none',
                          }}
                        >
                          <span className="mr-1.5">{CATEGORY_ICONS[cat]}</span>
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Framework badges */}
                <div className="mb-8">
                  <div className="flex flex-wrap gap-2">
                    {FRAMEWORKS.map(fw => {
                      const isActive = framework === fw.name;
                      return (
                        <button
                          key={fw.name}
                          onClick={() => toggleFramework(fw.name)}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                          style={{
                            background: isActive ? 'rgba(139,92,246,0.15)' : tokens.bgSurface,
                            border: `1px solid ${isActive ? 'rgba(139,92,246,0.35)' : tokens.borderDefault}`,
                            color: isActive ? tokens.textAccent : tokens.textMuted,
                          }}
                        >
                          {fw.logo && (
                            <img src={fw.logo} alt="" className="w-4 h-4 rounded-sm object-contain"
                              style={{ filter: isActive ? 'brightness(1.1)' : 'brightness(0.6) grayscale(0.5)' }}
                            />
                          )}
                          {fw.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Results info */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm" style={{ color: tokens.textSecondary }}>
                    <span className="font-semibold" style={{ color: tokens.textPrimary }}>{filteredAgents.length}</span> agents found
                    {(category || framework || search) && (
                      <button onClick={() => { setCategory(''); setFramework(''); setSearch(''); }}
                        className="ml-3 text-xs transition-colors hover:opacity-80"
                        style={{ color: tokens.textAccent }}
                      >Clear all filters</button>
                    )}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] tracking-wider uppercase" style={{ color: tokens.textMuted }}>
                    <Clock size={10} /> Sorted by trust score
                  </div>
                </div>

                {/* Agent grid */}
                {filteredAgents.length > 0 ? (
                  <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <AnimatePresence mode="popLayout">
                      {filteredAgents
                        .sort((a, b) => b.successRate - a.successRate)
                        .map((agent, i) => (
                          <AgentCard
                            key={agent.id}
                            agent={agent}
                            index={i}
                            onClick={() => handleAgentClick(agent.id)}
                            onChat={() => handleAgentChat(agent)}
                          />
                        ))
                      }
                    </AnimatePresence>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-20"
                  >
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
                      style={{ background: 'rgba(99,102,241,0.1)' }}
                    >
                      <Search size={32} style={{ color: tokens.textAccent, opacity: 0.5 }} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2" style={{ color: tokens.textPrimary }}>No agents match your search</h3>
                    <p className="text-sm text-center max-w-sm" style={{ color: tokens.textSecondary }}>
                      Try adjusting your filters or search query to discover more AI agents.
                    </p>
                    <button
                      onClick={() => { setCategory(''); setFramework(''); setSearch(''); }}
                      className="mt-4 px-5 py-2 rounded-lg text-sm font-medium transition-colors"
                      style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: tokens.textAccent }}
                    >
                      Clear all filters
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
