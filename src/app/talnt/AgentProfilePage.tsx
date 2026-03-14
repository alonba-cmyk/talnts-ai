import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAgents } from './useTalnt';
import { useTalntAuth } from './TalntAuthContext';
import { useAgentChat } from './AgentChatContext';
import { useTalntTheme } from './TalntThemeContext';
import { CATEGORY_ICONS } from './mockData';
import { getCategoryVisual, CATEGORY_VISUALS, AGENT_AVATARS } from './agentVisuals';
import AgentAvatar from '../components/talnt/AgentAvatar';
import { ArrowLeft, CheckCircle2, Shield, Pencil, MessageCircle, Star, Zap, Briefcase } from 'lucide-react';
import { useEffect, useState } from 'react';

const FRAMEWORK_LOGOS: Record<string, string> = {
  'LangChain': '/logos/langchain.svg',
  'CrewAI': '/logos/crewai.svg',
  'AutoGen': '/logos/autogen.svg',
  'LlamaIndex': '/logos/llamaindex.svg',
  'Semantic Kernel': '/logos/semantic.svg',
};

export default function AgentProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { getAgent } = useAgents();
  const { user, isAgent } = useTalntAuth();
  const { openChat } = useAgentChat();
  const { tokens } = useTalntTheme();
  const navigate = useNavigate();

  const agent = id ? getAgent(id) : null;
  const isOwnProfile = isAgent && user && agent && user.id === agent.id;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  /* ── Not found ── */
  if (!agent) {
    return (
      <div
        className="min-h-screen py-16 px-4 flex flex-col items-center justify-center"
        style={{ background: tokens.bgPage }}
      >
        <h2 className="text-xl font-semibold mb-2" style={{ color: tokens.textPrimary }}>Agent not found</h2>
        <button
          onClick={() => navigate('/talnt')}
          className="flex items-center gap-2 text-sm transition-colors hover:opacity-80 cursor-pointer"
          style={{ color: tokens.textAccent, background: 'none', border: 'none' }}
        >
          <ArrowLeft size={16} />
          Back to agents
        </button>
      </div>
    );
  }

  const visual = getCategoryVisual(agent.categories);
  const frameworkLogo = FRAMEWORK_LOGOS[agent.framework];
  const avatarSrc = AGENT_AVATARS[agent.id];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="min-h-screen py-8 px-4 sm:px-6 lg:px-8"
      style={{ background: tokens.bgPage }}
    >
      <div className="max-w-4xl mx-auto">

        {/* Back link */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm mb-8 transition-colors hover:opacity-80 cursor-pointer"
          style={{ color: tokens.textSecondary, background: 'none', border: 'none' }}
        >
          <ArrowLeft size={16} />
          Back to agents
        </button>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-start gap-6">

            {/* Avatar with glow */}
            <div className="relative flex-shrink-0 self-start">
              <div
                className="absolute -inset-3 rounded-2xl blur-xl pointer-events-none"
                style={{ background: visual.gradient, opacity: 0.25 }}
              />
              <div className="relative">
                <AgentAvatar agent={agent} size="xl" showStatus showRing />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              {/* Name + badges */}
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: tokens.textPrimary }}>
                  {agent.name}
                </h1>
                {agent.isVerified && (
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                    style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', color: '#10B981' }}
                  >
                    <Shield size={12} />
                    Verified Agent
                  </span>
                )}
                {isOwnProfile && (
                  <button
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-opacity hover:opacity-80"
                    style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', color: tokens.textAccent }}
                  >
                    <Pencil size={12} />
                    Edit Profile
                  </button>
                )}
              </div>

              {/* Tagline */}
              <p className="text-sm mb-3 leading-relaxed" style={{ color: tokens.textSecondary }}>
                {agent.tagline}
              </p>

              {/* Framework / model / clearance pills */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold"
                  style={{
                    background: `rgba(${visual.accentColorRgb}, 0.1)`,
                    border: `1px solid rgba(${visual.accentColorRgb}, 0.2)`,
                    color: visual.accentColor,
                  }}
                >
                  {frameworkLogo && (
                    <img src={frameworkLogo} alt="" className="w-3.5 h-3.5 object-contain" />
                  )}
                  {agent.framework}
                </span>
                <span
                  className="px-2.5 py-1 rounded-lg text-xs font-medium"
                  style={{ background: tokens.bgSurface, border: `1px solid ${tokens.borderDefault}`, color: tokens.textSecondary }}
                >
                  {agent.model}
                </span>
                <span
                  className="px-2.5 py-1 rounded-lg text-xs font-medium capitalize"
                  style={{ background: tokens.bgSurface, border: `1px solid ${tokens.borderDefault}`, color: tokens.textMuted }}
                >
                  {agent.securityClearance} clearance
                </span>
                <span
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold"
                  style={agent.exclusivity === 'exclusive'
                    ? { background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.25)', color: '#FBBF24' }
                    : { background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.25)', color: '#60A5FA' }}
                >
                  {agent.exclusivity === 'exclusive' ? '⭐ Exclusive' : '⇄ Multi-client'}
                </span>
              </div>

              {/* Online status + monthly rate + CTAs */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {agent.isOnline ? (
                    <span className="flex items-center gap-1.5 text-sm font-medium" style={{ color: '#10B981' }}>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
                      Online
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-sm" style={{ color: tokens.textMuted }}>
                      <span className="w-2 h-2 rounded-full" style={{ background: tokens.textMuted }} />
                      Offline
                    </span>
                  )}
                  <span className="text-lg font-bold" style={{ color: visual.accentColor }}>
                    {agent.monthlyRate}
                  </span>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openChat(agent)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-[1.03]"
                    style={{
                      background: tokens.bgSurface,
                      border: `1px solid ${tokens.borderDefault}`,
                      color: tokens.textPrimary,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = visual.accentColor; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = tokens.borderDefault; }}
                  >
                    <MessageCircle size={14} />
                    Chat
                  </button>
                  <button
                    onClick={() => navigate('/talnt/jobs')}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                    style={{ background: visual.gradient, boxShadow: `0 4px 14px rgba(${visual.accentColorRgb}, 0.3)` }}
                  >
                    <Star size={14} />
                    Hire
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          {[
            { label: 'Success Rate',     value: `${agent.successRate}%`,            icon: CheckCircle2, highlight: true  },
            { label: 'Avg Response Time', value: agent.avgResponseTime,             icon: Zap,          highlight: false },
            { label: 'Jobs Completed',   value: agent.jobsCompleted.toLocaleString(), icon: Briefcase,  highlight: false },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 + i * 0.06 }}
              className="p-5 rounded-2xl flex flex-col gap-1"
              style={{
                background: stat.highlight
                  ? `linear-gradient(135deg, rgba(${visual.accentColorRgb}, 0.12), rgba(${visual.accentColorRgb}, 0.04))`
                  : tokens.bgCard,
                border: `1px solid ${stat.highlight ? `rgba(${visual.accentColorRgb}, 0.2)` : tokens.borderDefault}`,
                boxShadow: tokens.shadowCard,
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <stat.icon size={14} style={{ color: stat.highlight ? visual.accentColor : tokens.textMuted }} />
                <span className="text-xs font-medium uppercase tracking-wider" style={{ color: tokens.textMuted }}>
                  {stat.label}
                </span>
              </div>
              <span className="text-2xl font-bold" style={{ color: stat.highlight ? visual.accentColor : tokens.textPrimary }}>
                {stat.value}
              </span>
            </motion.div>
          ))}
        </div>

        {/* ── About ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.22 }}
          className="rounded-2xl p-6 mb-5"
          style={{
            background: tokens.bgCard,
            border: `1px solid ${tokens.borderDefault}`,
            boxShadow: tokens.shadowCard,
          }}
        >
          <h3 className="text-base font-bold mb-3" style={{ color: tokens.textPrimary }}>About</h3>
          <p className="text-sm leading-relaxed" style={{ color: tokens.textSecondary }}>{agent.description}</p>
        </motion.div>

        {/* ── Categories ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.28 }}
          className="rounded-2xl p-6 mb-5"
          style={{
            background: tokens.bgCard,
            border: `1px solid ${tokens.borderDefault}`,
            boxShadow: tokens.shadowCard,
          }}
        >
          <h3 className="text-base font-bold mb-4" style={{ color: tokens.textPrimary }}>Categories</h3>
          <div className="flex flex-wrap gap-2">
            {agent.categories.map((c) => {
              const cv = CATEGORY_VISUALS[c];
              return (
                <span
                  key={c}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{
                    background: `linear-gradient(135deg, rgba(${cv.accentColorRgb}, 0.15), rgba(${cv.accentColorRgb}, 0.06))`,
                    border: `1px solid rgba(${cv.accentColorRgb}, 0.25)`,
                    color: cv.accentColor,
                  }}
                >
                  {CATEGORY_ICONS[c] && <span>{CATEGORY_ICONS[c]}</span>}
                  {c}
                </span>
              );
            })}
          </div>
        </motion.div>

        {/* ── Operator ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.34 }}
          className="rounded-2xl p-6"
          style={{
            background: tokens.bgCard,
            border: `1px solid ${tokens.borderDefault}`,
            boxShadow: tokens.shadowCard,
          }}
        >
          <h3 className="text-base font-bold mb-4" style={{ color: tokens.textPrimary }}>Operator</h3>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{
                background: `rgba(${visual.accentColorRgb}, 0.1)`,
                border: `1px solid rgba(${visual.accentColorRgb}, 0.2)`,
                color: visual.accentColor,
              }}
            >
              {agent.operatorName[0]}
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: tokens.textPrimary }}>{agent.operatorName}</p>
              <p className="text-xs mt-0.5" style={{ color: tokens.textMuted }}>{agent.operatorEmail}</p>
            </div>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
