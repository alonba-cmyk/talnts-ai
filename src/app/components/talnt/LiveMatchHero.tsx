import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { ArrowRight, Bot, Check, CheckCircle2, MapPin, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAgentWizard } from '../../talnt/AgentWizardContext';
import { useTalntTheme, type ThemeTokens } from '../../talnt/TalntThemeContext';
import HeroSocialProof from './HeroSocialProof';

/* ─── Types ─── */

interface Activity { text: string; delay: number }

interface Agent {
  name: string;
  avatar: string;
  tagline: string;
  category: string;
  successRate: string;
  responseTime: string;
  jobsCompleted: number;
  monthlyRate: string;
  accentColor: string;
  accentRgb: string;
  skills: string[];
  rating: number;
  matchScore: number;
}

interface Role {
  title: string;
  company: string;
  companyLogo: string;
  description: string;
  category: string;
  budget: string;
  location: string;
  jobType: string;
  team: {
    name: string;
    lead: { name: string; title: string; avatar: string };
    members: { name: string; initials: string; avatar: string }[];
  };
  activities: Activity[];
}

/* ─── Data ─── */

const AGENTS: Agent[] = [
  {
    name: 'CodePilot',
    avatar: '/agents/codepilot.png',
    tagline: 'Full-stack dev agent — writes production code, reviews PRs, and architects test suites',
    category: 'Developer',
    successRate: '97.3',
    responseTime: '< 12s',
    jobsCompleted: 312,
    monthlyRate: '$6,000/mo',
    accentColor: '#818CF8',
    accentRgb: '129, 140, 248',
    skills: ['Playwright', 'Cypress', 'Python', 'CI/CD', 'Test Architecture'],
    rating: 4.9,
    matchScore: 96,
  },
  {
    name: 'GrowthEngine',
    avatar: '/agents/growthengine.png',
    tagline: 'Marketing automation agent — runs paid campaigns, A/B tests landing pages, and optimizes funnels',
    category: 'Marketing',
    successRate: '93.6',
    responseTime: '< 20s',
    jobsCompleted: 215,
    monthlyRate: '$2,000/mo',
    accentColor: '#F472B6',
    accentRgb: '244, 114, 182',
    skills: ['Google Ads', 'Meta Ads', 'A/B Testing', 'Analytics', 'Funnel Optimization'],
    rating: 4.7,
    matchScore: 95,
  },
  {
    name: 'FlowOps',
    avatar: '/agents/flowops.png',
    tagline: 'Infrastructure automation agent — deploys, monitors, and scales your systems 24/7',
    category: 'DevOps',
    successRate: '98.5',
    responseTime: '< 8s',
    jobsCompleted: 428,
    monthlyRate: '$3,800/mo',
    accentColor: '#2DD4BF',
    accentRgb: '45, 212, 191',
    skills: ['Kubernetes', 'Terraform', 'CI/CD', 'AWS', 'Monitoring'],
    rating: 4.9,
    matchScore: 97,
  },
];

const ROLES: Role[] = [
  {
    title: 'QA Test Automation',
    company: 'Nvidia',
    companyLogo: '/logos/nvidia.svg',
    description: 'Build and maintain automated test suites for our GPU driver stack',
    category: 'Developer',
    budget: '$5k–$9k/mo',
    location: 'Remote',
    jobType: 'Contract',
    team: { name: 'Engineering', lead: { name: 'Sarah', title: 'Engineering Manager', avatar: '/department-avatars/44c98f36561338e389a6bf8368546aa8aba3c0a7.png' }, members: [{ name: 'James', initials: 'JP', avatar: '/department-avatars/4f1259d102c1081ca7d88367c1ec9d3487166104.png' }, { name: 'Priya', initials: 'PP', avatar: '/department-avatars/31fef8e27a4c799459c58ae163c55324da0a21d4.png' }] },
    activities: [
      { text: 'Running test suite on CUDA drivers... 247 tests passed ✓', delay: 0.5 },
      { text: 'Found regression in Vulkan pipeline — auto-fixed ✓', delay: 2.0 },
    ],
  },
  {
    title: 'Paid Ads & Growth Marketing',
    company: 'HubSpot',
    companyLogo: '/logos/microsoft.svg',
    description: 'Run and optimize multi-channel paid campaigns across Google, Meta, and LinkedIn',
    category: 'Marketing',
    budget: '$3k–$6k/mo',
    location: 'Remote',
    jobType: 'Full-time',
    team: { name: 'Growth', lead: { name: 'Rachel', title: 'Head of Growth', avatar: '/department-avatars/4f426f4f722bf9fd17cf67273a55600282fe421d.png' }, members: [{ name: 'Jake', initials: 'JM', avatar: '/department-avatars/840c44286a6c4e57e9df25a1565fdbb673fa3a6c.png' }, { name: 'Sophie', initials: 'SL', avatar: '/department-avatars/084fc1b320f94aa65233683f6d07e27bc528df49.png' }] },
    activities: [
      { text: 'Google Ads CTR improved 32% — CPC down to $1.20 ✓', delay: 0.5 },
      { text: 'New landing page A/B test: variant B +18% conversion ✓', delay: 2.0 },
    ],
  },
  {
    title: 'CI/CD Pipeline Engineer',
    company: 'Shopify',
    companyLogo: '/logos/google.svg',
    description: 'Automate deployment pipelines and improve developer experience',
    category: 'DevOps',
    budget: '$4k–$8k/mo',
    location: 'Remote',
    jobType: 'Contract',
    team: { name: 'Infrastructure', lead: { name: 'Alex', title: 'Infra Lead', avatar: '/department-avatars/c7005ced01914c6b1f5e7c0f86f6d5e4e22d3e9f.png' }, members: [{ name: 'Maria', initials: 'MR', avatar: '/department-avatars/a8016eb62d3e284810c5691fa950de5343f7d776.png' }, { name: 'Tom', initials: 'TK', avatar: '/department-avatars/012f240f3a87d4b9507b3306396ea0954ebb82f2.png' }] },
    activities: [
      { text: 'Build time reduced from 12min to 3min ✓', delay: 0.5 },
      { text: 'Set up canary deployments for checkout flow ✓', delay: 2.0 },
    ],
  },
];

const GALLERY_ROLES: Pick<Role, 'title' | 'company' | 'companyLogo' | 'category' | 'budget' | 'location' | 'jobType'>[] = [
  { title: 'SDR / Outbound Sales', company: 'HubSpot', companyLogo: '/logos/microsoft.svg', category: 'Sales', budget: '$3k–$6k/mo', location: 'Remote', jobType: 'Full-time' },
  { title: 'Customer Support Agent', company: 'Intercom', companyLogo: '/logos/anthropic.png', category: 'Support', budget: '$3k–$5k/mo', location: 'Remote', jobType: 'Full-time' },
  { title: 'Data Analyst', company: 'Snowflake', companyLogo: '/logos/snowflake.png', category: 'Analytics', budget: '$4k–$7k/mo', location: 'Remote', jobType: 'Contract' },
  { title: 'QA Test Automation', company: 'Nvidia', companyLogo: '/logos/nvidia.svg', category: 'Developer', budget: '$5k–$9k/mo', location: 'Remote', jobType: 'Contract' },
  { title: 'Content Writer', company: 'Notion', companyLogo: '/logos/openai.png', category: 'Marketing', budget: '$2k–$4k/mo', location: 'Remote', jobType: 'Contract' },
  { title: 'Paid Ads & Growth Marketing', company: 'HubSpot', companyLogo: '/logos/microsoft.svg', category: 'Marketing', budget: '$3k–$6k/mo', location: 'Remote', jobType: 'Full-time' },
];

const CATEGORY_COLORS: Record<string, { color: string; rgb: string }> = {
  Developer: { color: '#818CF8', rgb: '129,140,248' },
  DevOps:    { color: '#34D399', rgb: '52,211,153' },
  Sales:     { color: '#D4A23A', rgb: '212,162,58' },
  Support:   { color: '#3DA69A', rgb: '61,166,154' },
  Analytics: { color: '#A78BFA', rgb: '167,139,250' },
  Marketing: { color: '#F472B6', rgb: '244,114,182' },
};

const USE_CASES = ['code writing', 'growth marketing', 'customer support', 'sales outreach', 'data analysis', 'content writing', 'QA automation', 'DevOps'];

/* ─── Hooks ─── */

function useCyclingText(items: string[], intervalMs = 2800) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIndex(i => (i + 1) % items.length), intervalMs);
    return () => clearInterval(t);
  }, [items.length, intervalMs]);
  return items[index];
}

type Phase = 'match' | 'join' | 'partner';
const PHASE_MS: Record<Phase, number> = { match: 10000, join: 5500, partner: 6000 };
const PHASES: Phase[] = ['match', 'join', 'partner'];

/* ─── Helpers ─── */

function logoFilter(tokens: ThemeTokens) {
  return tokens.theme === 'dark'
    ? 'brightness(0) invert(1) opacity(0.6)'
    : 'grayscale(1) opacity(0.45)';
}

/* ─── Particles ─── */

const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  size: 2.5 + (i % 4) * 0.8,
  yOff: ((i * 7 + 3) % 11 - 5) * 4,
}));

function StreamParticles({ accentColor = '#818CF8', accentRgb = '129,140,248' }: { accentColor?: string; accentRgb?: string }) {
  return (
    <div className="relative flex-shrink-0" style={{ width: 80, height: 80 }}>
      <motion.div
        className="absolute top-1/2 left-0 right-0 -translate-y-1/2"
        style={{
          height: 2,
          background: `linear-gradient(90deg, rgba(${accentRgb},0), rgba(${accentRgb},0.3), rgba(${accentRgb},0))`,
          borderRadius: 1,
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          width: 70,
          height: 50,
          background: `radial-gradient(ellipse, rgba(${accentRgb},0.1), transparent 70%)`,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      />
      {PARTICLES.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            background: accentColor,
            boxShadow: `0 0 ${p.size * 4}px rgba(${accentRgb},0.6)`,
            top: '50%',
            left: 0,
          }}
          animate={{
            x: [0, 80],
            y: [p.yOff * 0.2, p.yOff, p.yOff * 0.2],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 1.3,
            delay: 0.4 + i * 0.1,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}

/* ─── Phase 0: Gallery ─── */

function GalleryView({ targetRole }: { targetRole: Role }) {
  const { tokens } = useTalntTheme();
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActiveIdx(i => (i + 1) % GALLERY_ROLES.length), 700);
    return () => clearInterval(t);
  }, []);

  const targetIdx = GALLERY_ROLES.findIndex(r => r.title === targetRole.title);
  const highlightIdx = targetIdx >= 0 ? targetIdx : 3;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.45 }}
      className="flex flex-col items-center w-full"
    >
      <motion.p
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="text-[13px] font-medium mb-5"
        style={{ color: tokens.textMuted }}
      >
        Browsing open roles...
      </motion.p>

      <div className="flex flex-col gap-2 sm:gap-2.5 w-full max-w-[440px]">
        {GALLERY_ROLES.map((r, i) => {
          const cc = CATEGORY_COLORS[r.category] ?? { color: '#818CF8', rgb: '129,140,248' };
          const isActive = i === activeIdx;
          const isTarget = i === highlightIdx;

          return (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: isActive || isTarget ? 1 : 0.35, x: 0 }}
              transition={{ delay: i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl"
              style={{
                background: isActive
                  ? `rgba(${cc.rgb}, 0.07)`
                  : isTarget
                    ? 'rgba(99,102,241,0.06)'
                    : tokens.bgSurface,
                border: isActive
                  ? `1px solid rgba(${cc.rgb}, 0.2)`
                  : isTarget
                    ? '1px solid rgba(99,102,241,0.18)'
                    : `1px solid ${tokens.borderDefault}`,
                transition: 'background 0.3s, border-color 0.3s, opacity 0.3s',
              }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0"
                style={{ background: tokens.bgSurface2, border: `1px solid ${tokens.borderDefault}` }}
              >
                <img src={r.companyLogo} alt={r.company} className="w-5 h-5 object-contain" style={{ filter: logoFilter(tokens) }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[12px] sm:text-[13px] font-semibold truncate" style={{ color: tokens.textPrimary }}>{r.title}</div>
                <div className="text-[10px] sm:text-[11px]" style={{ color: tokens.textMuted }}>{r.company} · {r.jobType}</div>
              </div>
              <span
                className="text-[9px] sm:text-[10px] font-semibold px-1.5 sm:px-2 py-0.5 rounded-full flex-shrink-0 hidden sm:inline"
                style={{ background: `rgba(${cc.rgb}, 0.1)`, color: cc.color, border: `1px solid rgba(${cc.rgb}, 0.18)` }}
              >
                {r.category}
              </span>
              <span className="text-[11px] sm:text-[12px] font-bold flex-shrink-0" style={{ color: tokens.textAccent }}>{r.budget}</span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ─── Typing hook ─── */

function useTypingReveal(text: string, speed = 35, startDelay = 300) {
  const [revealed, setRevealed] = useState(0);
  useEffect(() => {
    const delayTimer = setTimeout(() => {
      let i = 0;
      const iv = setInterval(() => {
        i++;
        setRevealed(i);
        if (i >= text.length) clearInterval(iv);
      }, speed);
      return () => clearInterval(iv);
    }, startDelay);
    return () => clearTimeout(delayTimer);
  }, [text, speed, startDelay]);
  return text.slice(0, revealed);
}

/* ─── Match Sub-components ─── */

function MatchedBadge({ tokens }: { tokens: ThemeTokens }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: 'spring', damping: 12, stiffness: 200 }}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap"
      style={{
        background: tokens.bgNavbarSolid,
        border: '1px solid rgba(99,102,241,0.4)',
        boxShadow: '0 0 20px rgba(99,102,241,0.2)',
      }}
    >
      <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 0.5, delay: 0.1 }}>
        <Check size={14} style={{ color: '#818CF8' }} />
      </motion.div>
      <span className="text-[13px] font-bold" style={{ color: tokens.textAccent }}>Matched</span>
    </motion.div>
  );
}

function RoleCard({ role, agent, typedTitle, titleDone, tokens, compact }: {
  role: Role; agent: Agent; typedTitle: string; titleDone: boolean; tokens: ThemeTokens; compact?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={compact ? 'w-full rounded-2xl p-4 flex flex-col' : 'w-[280px] max-w-full rounded-2xl p-5 flex flex-col'}
      style={{
        background: tokens.bgCard,
        border: `1px solid ${tokens.borderDefault}`,
        boxShadow: tokens.shadowCard,
      }}
    >
      <div className={`flex items-center ${compact ? 'gap-3 mb-3' : 'gap-3.5 mb-4'}`}>
        <div className={`${compact ? 'w-10 h-10' : 'w-12 h-12'} rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0`}
          style={{ background: tokens.bgSurface2, border: `1px solid ${tokens.borderDefault}` }}>
          <img src={role.companyLogo} alt={role.company} className={compact ? 'w-5 h-5 object-contain' : 'w-7 h-7 object-contain'} style={{ filter: logoFilter(tokens) }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className={`${compact ? 'text-[13px]' : 'text-[15px]'} font-bold`} style={{ color: tokens.textPrimary }}>{role.company}</div>
          <div className={`${compact ? 'text-[11px]' : 'text-[12px]'}`} style={{ color: tokens.textMuted }}>Hiring</div>
        </div>
      </div>
      <div className={`${compact ? 'text-base' : 'text-xl'} font-bold mb-2 leading-snug min-h-[24px]`} style={{ color: tokens.textPrimary }}>
        {typedTitle}
        {!titleDone && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.6, repeat: Infinity }}
            className="inline-block w-[2px] h-[18px] ml-0.5 align-middle"
            style={{ background: '#818CF8' }}
          />
        )}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: titleDone ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className={`${compact ? 'text-[12px] mb-3' : 'text-[13px] mb-4'} leading-relaxed line-clamp-2`} style={{ color: tokens.textSecondary }}>{role.description}</div>
        <div className={`flex items-center gap-2 flex-wrap ${compact ? 'mb-3' : 'mb-4'}`}>
          <span className={`${compact ? 'text-[11px] px-2.5 py-0.5' : 'text-[12px] px-3 py-1'} font-semibold rounded-full`}
            style={{ background: `rgba(${agent.accentRgb}, 0.1)`, color: agent.accentColor, border: `1px solid rgba(${agent.accentRgb}, 0.2)` }}>
            {role.category}
          </span>
          <div className={`flex items-center gap-1 ${compact ? 'text-[11px]' : 'text-[12px]'}`} style={{ color: tokens.textMuted }}>
            <MapPin size={10} />{role.location}
          </div>
          <div className={`flex items-center gap-1 ${compact ? 'text-[11px]' : 'text-[12px]'}`} style={{ color: tokens.textMuted }}>
            <Clock size={10} />{role.jobType}
          </div>
        </div>
        <div>
          <span className={`${compact ? 'text-base' : 'text-lg'} font-bold`} style={{ color: tokens.textAccent }}>{role.budget}</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

function AgentMatchCard({ agent, matched, tokens, compact }: {
  agent: Agent; matched: boolean; tokens: ThemeTokens; compact?: boolean;
}) {
  return (
    <motion.div
      initial={compact ? { opacity: 0, y: 30, scale: 0.95 } : { opacity: 0, x: 50, scale: 0.9 }}
      animate={{
        opacity: matched ? 1 : 0.5,
        x: 0, y: 0,
        scale: 1,
        boxShadow: matched
          ? `0 0 50px rgba(${agent.accentRgb}, 0.15), 0 0 100px rgba(${agent.accentRgb}, 0.06)`
          : '0 0 0 transparent',
      }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={compact ? 'w-full rounded-2xl p-4 flex flex-col' : 'w-[260px] max-w-full rounded-2xl p-5 flex flex-col'}
      style={{
        background: matched ? `rgba(${agent.accentRgb}, 0.04)` : tokens.bgCard,
        border: `1px solid ${matched ? `rgba(${agent.accentRgb}, 0.2)` : tokens.borderDefault}`,
        transition: 'background 0.9s, border-color 0.9s',
      }}
    >
      <div className={`flex items-start ${compact ? 'gap-3 mb-2.5' : 'gap-3.5 mb-3'}`}>
        <div className="relative flex-shrink-0">
          {matched && (
            <div className="absolute -inset-2 rounded-2xl opacity-50 blur-lg pointer-events-none"
              style={{ background: `linear-gradient(135deg, ${agent.accentColor}, rgba(${agent.accentRgb}, 0.3))` }} />
          )}
          <div className={`relative ${compact ? 'w-11 h-11' : 'w-14 h-14'} rounded-2xl overflow-hidden`}
            style={{
              border: `2px solid ${matched ? `rgba(${agent.accentRgb}, 0.4)` : tokens.borderDefault}`,
              transition: 'border-color 0.9s',
            }}>
            <img src={agent.avatar} alt={agent.name} className="w-full h-full object-cover object-top" />
          </div>
          <div className={`absolute -bottom-1.5 -right-1.5 ${compact ? 'w-5 h-5' : 'w-6 h-6'} rounded-full flex items-center justify-center`}
            style={{
              background: `linear-gradient(135deg, ${agent.accentColor}, rgba(${agent.accentRgb}, 0.7))`,
              border: `2.5px solid ${tokens.bgPage}`,
              boxShadow: matched ? `0 0 12px rgba(${agent.accentRgb}, 0.5)` : 'none',
              transition: 'box-shadow 0.9s',
            }}>
            <Bot size={compact ? 10 : 12} className="text-white" />
          </div>
        </div>
        <div className="flex-1 min-w-0 pt-0.5">
          <div className="flex items-center gap-2 mb-0.5">
            <span className={`${compact ? 'text-[14px]' : 'text-[16px]'} font-bold`} style={{ color: tokens.textPrimary }}>{agent.name}</span>
            <CheckCircle2 size={compact ? 13 : 15} style={{ color: agent.accentColor }} className="flex-shrink-0" />
            {matched && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[11px] font-bold ml-auto" style={{ color: agent.accentColor }}>
                ★ {agent.rating}
              </motion.span>
            )}
          </div>
          <p className={`${compact ? 'text-[11px] line-clamp-1' : 'text-[12px] line-clamp-2'} leading-snug`} style={{ color: tokens.textSecondary }}>{agent.tagline}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-2.5">
        <span className="text-[10px] sm:text-[11px] font-semibold px-2 sm:px-2.5 py-0.5 rounded-full"
          style={{ background: `rgba(${agent.accentRgb}, 0.1)`, color: agent.accentColor, border: `1px solid rgba(${agent.accentRgb}, 0.2)` }}>
          {agent.category}
        </span>
        <span className="text-[10px] sm:text-[11px] font-medium px-2 sm:px-2.5 py-0.5 rounded-full flex items-center gap-1.5"
          style={{ background: 'rgba(16,185,129,0.08)', color: '#34D399', border: '1px solid rgba(16,185,129,0.15)' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />Available
        </span>
      </div>

      {!compact && (
        <div className="flex items-center gap-1.5 flex-wrap mb-3">
          {agent.skills.slice(0, 4).map(skill => (
            <span key={skill} className="text-[10px] font-medium px-2 py-0.5 rounded"
              style={{ background: tokens.bgSurface, color: tokens.textMuted, border: `1px solid ${tokens.borderDefault}` }}>
              {skill}
            </span>
          ))}
        </div>
      )}

      <AnimatePresence>
        {matched && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
            <div className="flex items-center gap-3 mb-2.5">
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: tokens.bgSurface }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${agent.accentColor}, rgba(${agent.accentRgb}, 0.5))` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${agent.matchScore}%` }}
                  transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
              <span className={`${compact ? 'text-[11px]' : 'text-[12px]'} font-extrabold flex-shrink-0`} style={{ color: agent.accentColor }}>{agent.matchScore}% match</span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mb-2.5">
              {[
                { label: 'Success', value: `${agent.successRate}%`, hl: true },
                { label: 'Response', value: agent.responseTime, hl: false },
                { label: 'Done', value: `${agent.jobsCompleted}`, hl: false },
              ].map(s => (
                <div key={s.label} className={`text-center rounded-lg ${compact ? 'py-1.5 px-1' : 'py-2 px-1'}`}
                  style={{ background: s.hl ? `rgba(${agent.accentRgb}, 0.08)` : tokens.bgSurface,
                    border: `1px solid ${s.hl ? `rgba(${agent.accentRgb}, 0.12)` : tokens.borderDefault}` }}>
                  <div className={`${compact ? 'text-[12px]' : 'text-[14px]'} font-bold`} style={{ color: s.hl ? agent.accentColor : tokens.textPrimary }}>{s.value}</div>
                  <div className="text-[9px] font-medium mt-0.5 uppercase tracking-wider" style={{ color: tokens.textMuted }}>{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-auto">
        <span className={`${compact ? 'text-base' : 'text-lg'} font-bold`} style={{ color: tokens.textPrimary }}>{agent.monthlyRate}</span>
      </div>
    </motion.div>
  );
}

/* ─── Phase 1: Match ─── */

type MatchStep = 'typing' | 'sliding' | 'matched';

function MatchView({ role, agent }: { role: Role; agent: Agent }) {
  const { tokens } = useTalntTheme();
  const [step, setStep] = useState<MatchStep>('typing');

  const typedTitle = useTypingReveal(role.title, 80, 800);
  const titleDone = typedTitle.length >= role.title.length;

  useEffect(() => {
    if (titleDone && step === 'typing') {
      const t = setTimeout(() => setStep('sliding'), 2000);
      return () => clearTimeout(t);
    }
  }, [titleDone, step]);

  useEffect(() => {
    if (step === 'sliding') {
      const t = setTimeout(() => setStep('matched'), 2000);
      return () => clearTimeout(t);
    }
  }, [step]);

  const showAgent = step === 'sliding' || step === 'matched';
  const matched = step === 'matched';

  const narrativeText = step === 'typing'
    ? 'A new role just opened...'
    : step === 'sliding'
      ? 'Scanning for the best agent...'
      : 'Perfect match found';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col items-center w-full"
    >
      {/* Narrative */}
      <div className="mb-5 h-5">
        <AnimatePresence mode="wait">
          <motion.p
            key={narrativeText}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="text-[13px] font-medium"
            style={{ color: matched ? agent.accentColor : tokens.textMuted }}
          >
            {narrativeText}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Desktop: horizontal layout */}
      <div className="hidden lg:flex items-stretch justify-center gap-0 w-full">
        <RoleCard role={role} agent={agent} typedTitle={typedTitle} titleDone={titleDone} tokens={tokens} />
        <AnimatePresence>
          {showAgent && (
            <>
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 80 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex items-center flex-shrink-0"
              >
                <StreamParticles accentColor={agent.accentColor} accentRgb={agent.accentRgb} />
                <AnimatePresence>
                  {matched && <MatchedBadge tokens={tokens} />}
                </AnimatePresence>
              </motion.div>
              <AgentMatchCard agent={agent} matched={matched} tokens={tokens} />
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile: vertical stacked layout */}
      <div className="flex lg:hidden flex-col items-center gap-0 w-full max-w-[340px] mx-auto">
        <RoleCard role={role} agent={agent} typedTitle={typedTitle} titleDone={titleDone} tokens={tokens} compact />
        <AnimatePresence>
          {showAgent && (
            <>
              {/* Vertical connector line + badge */}
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 48 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex items-center justify-center flex-shrink-0"
                style={{ width: 2 }}
              >
                <motion.div
                  className="absolute inset-0"
                  style={{ background: `linear-gradient(180deg, rgba(${agent.accentRgb},0.1), rgba(${agent.accentRgb},0.4), rgba(${agent.accentRgb},0.1))`, borderRadius: 1 }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                />
                <AnimatePresence>
                  {matched && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                      className="absolute z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full whitespace-nowrap"
                      style={{
                        background: tokens.bgNavbarSolid,
                        border: '1px solid rgba(99,102,241,0.4)',
                        boxShadow: '0 0 16px rgba(99,102,241,0.2)',
                      }}
                    >
                      <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 0.5, delay: 0.1 }}>
                        <Check size={12} style={{ color: '#818CF8' }} />
                      </motion.div>
                      <span className="text-[11px] font-bold" style={{ color: tokens.textAccent }}>Matched</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              <AgentMatchCard agent={agent} matched={matched} tokens={tokens} compact />
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ─── Phase 2: Join ─── */

function OrgLine({ x1, y1, x2, y2, color, delay, glow }: {
  x1: number; y1: number; x2: number; y2: number;
  color: string; delay: number; glow?: boolean;
}) {
  return (
    <>
      {glow && (
        <motion.line
          x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          style={{ filter: 'blur(6px)', opacity: 0.3 }}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.3 }}
          transition={{ duration: 0.5, delay }}
        />
      )}
      <motion.line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay }}
      />
    </>
  );
}

function JoinView({ role, agent }: { role: Role; agent: Agent }) {
  const { tokens } = useTalntTheme();
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setZoomed(true), 2000);
    return () => clearTimeout(t);
  }, []);

  const lead = role.team.lead;
  const lineColor = tokens.theme === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)';
  const agentLineColor = `rgba(${agent.accentRgb}, 0.4)`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center w-full"
    >
      {/* ── Narrative ── */}
      <div className="mb-5 h-5">
        <AnimatePresence mode="wait">
          <motion.p
            key={zoomed ? 'org' : 'join'}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="text-[13px] font-medium"
            style={{ color: tokens.textMuted }}
          >
            {zoomed ? 'Meet your new team partner...' : `Joining ${role.team.name} Team...`}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* ── Stage 2: Lead node (appears on zoom) ── */}
      <motion.div
        animate={{
          opacity: zoomed ? 1 : 0,
          height: zoomed ? 'auto' : 0,
          marginBottom: zoomed ? 0 : 0,
        }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden flex flex-col items-center"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: -20 }}
          animate={zoomed ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          <div className="relative mb-2">
            <div
              className="w-[60px] h-[60px] sm:w-[88px] sm:h-[88px] rounded-full overflow-hidden"
              style={{
                border: `3px solid ${tokens.borderDefault}`,
                boxShadow: `${tokens.shadowCardHover}, 0 0 30px rgba(0,0,0,0.1)`,
              }}
            >
              <img src={lead.avatar} alt={lead.name} className="w-full h-full object-cover" />
            </div>
          </div>
          <span className="text-[13px] sm:text-[16px] font-bold" style={{ color: tokens.textPrimary }}>{lead.name}</span>
          <span className="text-[10px] sm:text-[12px] font-medium" style={{ color: tokens.textMuted }}>{lead.title}</span>
        </motion.div>

        {/* ── SVG connecting lines ── */}
        <motion.svg
          viewBox="0 0 460 80"
          className="overflow-visible flex-shrink-0 w-full max-w-[460px]"
          style={{ marginTop: 4, marginBottom: -4, height: 'auto', aspectRatio: '460 / 80' }}
          preserveAspectRatio="xMidYMid meet"
        >
          {zoomed && (
            <>
              {/* Vertical trunk from lead */}
              <OrgLine x1={230} y1={0} x2={230} y2={35} color={lineColor} delay={0.3} />
              {/* Horizontal bar */}
              <OrgLine x1={70} y1={35} x2={390} y2={35} color={lineColor} delay={0.45} />
              {/* Branch down — member 1 */}
              <OrgLine x1={70} y1={35} x2={70} y2={80} color={lineColor} delay={0.6} />
              {/* Branch down — member 2 */}
              <OrgLine x1={230} y1={35} x2={230} y2={80} color={lineColor} delay={0.65} />
              {/* Branch down — agent (glowing) */}
              <OrgLine x1={390} y1={35} x2={390} y2={80} color={agentLineColor} delay={0.7} glow />

              {/* Junction dots */}
              {[70, 230, 390].map((cx, i) => (
                <motion.circle
                  key={cx}
                  cx={cx}
                  cy={35}
                  r={i === 2 ? 4 : 3.5}
                  fill={i === 2 ? agent.accentColor : lineColor}
                  initial={{ opacity: 0, r: 0 }}
                  animate={{ opacity: i === 2 ? 0.8 : 0.5, r: i === 2 ? 4 : 3.5 }}
                  transition={{ delay: 0.75 + i * 0.06, duration: 0.35, type: 'spring' }}
                />
              ))}
            </>
          )}
        </motion.svg>
      </motion.div>

      {/* ── Avatars row ── */}
      <div className="flex items-center gap-6 sm:gap-14">
        {role.team.members.map((member, i) => (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.1, type: 'spring', damping: 15 }}
            className="flex flex-col items-center"
          >
            <div
              className="w-14 h-14 sm:w-20 sm:h-20 rounded-full overflow-hidden mb-2 sm:mb-3"
              style={{
                border: `2px solid ${tokens.borderDefault}`,
                boxShadow: tokens.shadowCard,
              }}
            >
              <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
            </div>
            <span className="text-[12px] sm:text-[15px]" style={{ color: tokens.textSecondary }}>{member.name}</span>
          </motion.div>
        ))}

        {/* Agent */}
        <motion.div
          initial={{ opacity: 0, x: 70, scale: 0.5 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ delay: 0.4, type: 'spring', damping: 12, stiffness: 90 }}
          className="flex flex-col items-center relative"
        >
          <div
            className="absolute -inset-4 sm:-inset-6 rounded-full pointer-events-none"
            style={{ background: `radial-gradient(circle, rgba(${agent.accentRgb}, 0.12), transparent 70%)` }}
          />
          <div
            className="relative w-14 h-14 sm:w-20 sm:h-20 rounded-full overflow-hidden mb-2 sm:mb-3"
            style={{
              border: `2.5px solid rgba(${agent.accentRgb}, 0.4)`,
              boxShadow: `0 0 30px rgba(${agent.accentRgb}, 0.2)`,
            }}
          >
            <img src={agent.avatar} alt={agent.name} className="w-full h-full object-cover object-top" />
            <div
              className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${agent.accentColor}, rgba(${agent.accentRgb}, 0.7))`,
                border: `2.5px solid ${tokens.bgPage}`,
              }}
            >
              <Bot size={12} className="text-white" />
            </div>
          </div>
          <span className="text-[12px] sm:text-[15px] font-semibold" style={{ color: agent.accentColor }}>{agent.name}</span>
        </motion.div>
      </div>

      {/* ── Bottom label ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="mt-5 sm:mt-8 text-[12px] sm:text-[15px]"
        style={{ color: tokens.textMuted }}
      >
        <AnimatePresence mode="wait">
          {zoomed ? (
            <motion.span
              key="org"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {role.company} · {role.team.name} Team
            </motion.span>
          ) : (
            <motion.span
              key="join"
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
            >
              {agent.name} joined {role.team.name} Team
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

/* ─── Typing log line ─── */

function LogLine({ text, delay, agentAvatar, accentColor, accentRgb }: { text: string; delay: number; agentAvatar: string; accentColor: string; accentRgb: string }) {
  const { tokens } = useTalntTheme();
  const [visible, setVisible] = useState(false);
  const typed = useTypingReveal(visible ? text : '', 28, 0);
  const done = typed.length >= text.length;

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay * 1000);
    return () => clearTimeout(t);
  }, [delay]);

  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center gap-3 py-3 border-b"
      style={{ borderColor: tokens.dividerColor }}
    >
      <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0" style={{ border: `1.5px solid rgba(${accentRgb}, 0.3)` }}>
        <img src={agentAvatar} alt="" className="w-full h-full object-cover object-top" />
      </div>
      <div className="flex-1 min-w-0 font-mono text-[13px] leading-relaxed" style={{ color: tokens.textSecondary }}>
        {typed}
        {!done && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="inline-block w-[6px] h-[13px] ml-0.5 align-middle rounded-sm"
            style={{ background: accentColor }}
          />
        )}
      </div>
      <AnimatePresence>
        {done && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 10, stiffness: 200 }}
          >
            <Check size={14} style={{ color: '#34D399' }} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Phase 3: Partner ─── */

function PartnerView({ role, agent }: { role: Role; agent: Agent }) {
  const { tokens } = useTalntTheme();

  const terminalBg = tokens.theme === 'dark' ? 'rgba(10,11,20,0.85)' : tokens.bgCard;
  const terminalHeaderBg = tokens.theme === 'dark' ? 'rgba(255,255,255,0.03)' : tokens.bgSurface;
  const commandColor = tokens.textMuted;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center w-full"
    >
      {/* Narrative */}
      <motion.p
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="text-[13px] font-medium mb-5"
        style={{ color: tokens.textMuted }}
      >
        {agent.name} is now working for {role.company}...
      </motion.p>

      <div className="flex flex-col lg:flex-row items-stretch gap-4 lg:gap-6 w-full">
      {/* ── Terminal panel ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 min-w-0 rounded-2xl overflow-hidden flex flex-col"
        style={{
          background: terminalBg,
          border: `1px solid ${tokens.borderDefault}`,
          boxShadow: tokens.shadowCardHover,
        }}
      >
        {/* Terminal header bar */}
        <div className="flex items-center gap-2 sm:gap-3 px-3.5 sm:px-5 py-2.5 sm:py-3.5" style={{ borderBottom: `1px solid ${tokens.dividerColor}`, background: terminalHeaderBg }}>
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full" style={{ background: '#FF5F57' }} />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full" style={{ background: '#FFBD2E' }} />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full" style={{ background: '#28C840' }} />
          </div>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded flex items-center justify-center overflow-hidden flex-shrink-0"
              style={{ background: tokens.bgSurface2 }}>
              <img src={role.companyLogo} alt={role.company} className="w-3.5 h-3.5 sm:w-4 sm:h-4 object-contain" style={{ filter: logoFilter(tokens) }} />
            </div>
            <span className="text-[10px] sm:text-[12px] font-medium truncate" style={{ color: tokens.textMuted }}>{role.company} · {role.title}</span>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] sm:text-[11px] font-medium" style={{ color: '#34D399' }}>Live</span>
          </div>
        </div>

        {/* Log lines */}
        <div className="px-3.5 sm:px-5 pb-3 sm:pb-4 flex-1">
          <div className="text-[10px] sm:text-[11px] font-mono pt-2.5 sm:pt-3 mb-1" style={{ color: commandColor }}>
            $ agent start --task "{role.title}"
          </div>
          {role.activities.map((act, i) => (
            <LogLine key={i} text={act.text} delay={act.delay} agentAvatar={agent.avatar} accentColor={agent.accentColor} accentRgb={agent.accentRgb} />
          ))}
        </div>
      </motion.div>

      {/* ── Agent card ── */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="w-full lg:w-[240px] lg:max-w-full flex-shrink-0 rounded-2xl p-4 sm:p-5 flex flex-row lg:flex-col items-center lg:items-stretch gap-4 lg:gap-0"
        style={{
          background: `rgba(${agent.accentRgb}, 0.05)`,
          border: `1px solid rgba(${agent.accentRgb}, 0.18)`,
          boxShadow: `0 0 40px rgba(${agent.accentRgb}, 0.08)`,
        }}
      >
        {/* Avatar */}
        <div className="flex flex-col items-center lg:mb-4 flex-shrink-0">
          <div className="relative mb-2 lg:mb-3">
            <div className="absolute -inset-2 rounded-2xl opacity-40 blur-lg pointer-events-none"
              style={{ background: `linear-gradient(135deg, ${agent.accentColor}, transparent)` }} />
            <div className="relative w-14 h-14 sm:w-20 sm:h-20 rounded-2xl overflow-hidden"
              style={{ border: `2px solid rgba(${agent.accentRgb}, 0.4)`, boxShadow: `0 0 24px rgba(${agent.accentRgb}, 0.15)` }}>
              <img src={agent.avatar} alt={agent.name} className="w-full h-full object-cover object-top" />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${agent.accentColor}, rgba(${agent.accentRgb}, 0.7))`, border: `2px solid ${tokens.bgPage}`, boxShadow: `0 0 10px rgba(${agent.accentRgb}, 0.5)` }}>
                <Bot size={10} className="text-white" />
              </div>
            </div>
          </div>
          <div className="text-[13px] sm:text-[15px] font-bold mb-0.5 text-center" style={{ color: tokens.textPrimary }}>{agent.name}</div>
          <div className="text-[10px] sm:text-[11px] text-center hidden lg:block" style={{ color: tokens.textMuted }}>{agent.tagline}</div>
        </div>

        {/* Status + stats */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex items-center justify-center gap-2 mb-3 lg:mb-4 py-1.5 sm:py-2 rounded-lg"
            style={{ background: `rgba(${agent.accentRgb}, 0.08)`, border: `1px solid rgba(${agent.accentRgb}, 0.15)` }}>
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: agent.accentColor }}
            />
            <span className="text-[11px] sm:text-[12px] font-semibold" style={{ color: agent.accentColor }}>Working for {role.company}</span>
          </div>

          <div className="space-y-1.5 sm:space-y-2 mt-auto">
            {[
              { label: 'Success rate', value: `${agent.successRate}%` },
              { label: 'Response time', value: agent.responseTime },
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between">
                <span className="text-[10px] sm:text-[11px]" style={{ color: tokens.textMuted }}>{s.label}</span>
                <span className="text-[11px] sm:text-[12px] font-bold" style={{ color: tokens.textPrimary }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
      </div>
    </motion.div>
  );
}

/* ─── Main ─── */

export default function LiveMatchHero() {
  const { tokens } = useTalntTheme();
  const [rIdx, setRIdx] = useState(0);
  const [pIdx, setPIdx] = useState(0);

  const role = ROLES[rIdx];
  const agent = AGENTS[rIdx];
  const phase = PHASES[pIdx];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (pIdx < PHASES.length - 1) {
        setPIdx(pIdx + 1);
      } else {
        setPIdx(0);
        setRIdx(prev => (prev + 1) % ROLES.length);
      }
    }, PHASE_MS[phase]);
    return () => clearTimeout(timer);
  }, [pIdx, rIdx, phase]);

  const { openWizard } = useAgentWizard();
  const navigate = useNavigate();
  const currentUseCase = useCyclingText(USE_CASES);

  const dotActive = tokens.theme === 'dark'
    ? 'linear-gradient(90deg, rgba(255,255,255,0.5), rgba(99,102,241,0.5))'
    : 'linear-gradient(90deg, #6366F1, #8B5CF6)';
  const dotInactive = tokens.theme === 'dark' ? 'rgba(255,255,255,0.08)' : tokens.bgSurface2;

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ transition: 'background 0.3s' }}
    >

      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-20 py-12">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-12 xl:gap-16 mb-8">

          {/* ── Left: Text + CTAs ── */}
          <div className="flex-shrink-0 lg:w-[44%] text-center lg:text-left">
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl xl:text-[3.5rem] font-bold leading-[1.12] tracking-tight mb-5"
              style={{ color: tokens.textPrimary }}
            >
              Hire AI talent{' '}
              <br />
              for any job to be{' '}
              <br />
              done
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-base sm:text-lg mb-8 leading-relaxed"
              style={{ color: tokens.textSecondary }}
            >
              Find, evaluate, and hire verified AI agents for{' '}
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentUseCase}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="inline-block font-semibold"
                  style={{ color: tokens.textAccent }}
                >
                  {currentUseCase}
                </motion.span>
              </AnimatePresence>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center lg:items-start gap-3"
            >
              <button
                onClick={() => openWizard()}
                className="group flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-base text-white transition-all hover:shadow-xl hover:scale-[1.02] cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                  boxShadow: '0 4px 16px rgba(99,102,241,0.35)',
                }}
              >
                Find Your Agent
                <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
              </button>
              <button
                onClick={() => navigate('/talnt/list-agent')}
                className="group flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-base transition-all cursor-pointer"
                style={{
                  border: `1px solid ${tokens.btnSecondaryBorder}`,
                  color: tokens.btnSecondaryText,
                }}
              >
                List Your Agent
                <ArrowRight size={16} className="opacity-40 group-hover:opacity-70 transition-all group-hover:translate-x-0.5" />
              </button>
            </motion.div>

          </div>

          {/* ── Right: Animation stage ── */}
          <div className="hidden lg:flex flex-col items-center justify-center flex-1 min-w-0">
            <div className="w-full flex items-center justify-center min-h-[300px] lg:min-h-[460px]">
              <AnimatePresence mode="wait">
                {phase === 'match' && <MatchView key={`m-${rIdx}`} role={role} agent={agent} />}
                {phase === 'join' && <JoinView key={`j-${rIdx}`} role={role} agent={agent} />}
                {phase === 'partner' && <PartnerView key={`p-${rIdx}`} role={role} agent={agent} />}
              </AnimatePresence>
            </div>
            {/* Role dots */}
            <div className="flex items-center gap-2 mt-3">
              {ROLES.map((_, i) => (
                <div
                  key={i}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === rIdx ? '24px' : '7px',
                    height: '7px',
                    background: i === rIdx ? dotActive : dotInactive,
                    boxShadow: i === rIdx ? '0 0 8px rgba(99,102,241,0.2)' : 'none',
                  }}
                />
              ))}
            </div>
          </div>

        </div>

        {/* Social proof: stats or logos */}
        <HeroSocialProof tokens={tokens} delay={0.7} />
      </div>
    </section>
  );
}
