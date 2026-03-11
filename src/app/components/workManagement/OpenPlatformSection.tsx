"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AI_COMPANIES } from '@/app/components/agents/aiCompanies';
import { useDepartments, useSiteSettings } from '@/hooks/useSupabase';
import { DEPARTMENTS } from '@/app/components/workManagement/wmDepartmentData';

/* ─── Types & Data ────────────────────────────────────────────────────────── */

interface DemoAgent {
  id: string;
  name: string;
  logo: string;
  color: string;
}

interface DemoHuman {
  name: string;
  initials: string;
  color: string;
}

type TaskStatus = 'todo' | 'working' | 'review' | 'done';

const STATUS_META: Record<TaskStatus, { label: string; color: string }> = {
  todo:    { label: 'To Do',   color: '#94a3b8' },
  working: { label: 'Working', color: '#6161FF' },
  review:  { label: 'Review',  color: '#f59e0b' },
  done:    { label: 'Done',    color: '#10b981' },
};

const DEMO_AGENTS: DemoAgent[] = [
  { id: 'openai',    name: 'OpenAI',    logo: '/logos/openai.svg',    color: '#10A37F' },
  { id: 'cursor',    name: 'Cursor',    logo: '/logos/cursor.svg',    color: '#7C3AED' },
  { id: 'anthropic', name: 'Anthropic', logo: '/logos/anthropic.svg', color: '#D4A574' },
  { id: 'google',    name: 'Google AI', logo: '/logos/google.svg',    color: '#4285F4' },
  { id: 'langchain', name: 'LangChain', logo: '/logos/langchain.svg', color: '#1C3C3C' },
];

const DEMO_HUMANS: DemoHuman[] = [
  { name: 'Sarah K.', initials: 'SK', color: '#6366f1' },
  { name: 'Mike T.',  initials: 'MT', color: '#ec4899' },
];

interface TaskDef {
  id: string;
  label: string;
  defaultStatus: TaskStatus;
  agentId?: string;
  humanIdx?: number;
}

const TASKS: TaskDef[] = [
  { id: 't1', label: 'Draft product announcement',    defaultStatus: 'working', agentId: 'openai',    humanIdx: 0 },
  { id: 't2', label: 'Design social media assets',    defaultStatus: 'done',    agentId: 'anthropic' },
  { id: 't3', label: 'Configure CI/CD pipeline',      defaultStatus: 'working', agentId: 'cursor',    humanIdx: 1 },
  { id: 't4', label: 'Analyze market research',       defaultStatus: 'review',  agentId: 'google',    humanIdx: 0 },
  { id: 't5', label: 'Generate API documentation',    defaultStatus: 'todo',    agentId: 'langchain' },
  { id: 't6', label: 'Review compliance requirements',defaultStatus: 'working', agentId: 'anthropic' },
  { id: 't7', label: 'Build landing page',            defaultStatus: 'done',    agentId: 'cursor',    humanIdx: 1 },
  { id: 't8', label: 'Create onboarding flow',        defaultStatus: 'todo',    humanIdx: 0 },
];

interface SceneCursor {
  id: string;
  x: number;
  y: number;
  message: string;
}

interface SceneDef {
  agentCursors: SceneCursor[];
  humanCursors: { idx: number; x: number; y: number; message: string }[];
  statusOverrides?: Record<string, TaskStatus>;
  duration?: number;
}

const SCENE_DURATION = 10000;

const SCENES: SceneDef[] = [
  {
    agentCursors: [
      { id: 'openai', x: 14, y: 20, message: 'Generating announcement based on product brief...' },
      { id: 'cursor', x: 70, y: 44, message: 'Configuring deployment pipeline...' },
    ],
    humanCursors: [
      { idx: 0, x: 52, y: 16, message: 'Let me review the draft' },
    ],
  },
  {
    agentCursors: [
      { id: 'anthropic', x: 16, y: 62, message: 'Checking regulatory compliance...' },
      { id: 'google', x: 64, y: 48, message: 'Cross-referencing competitor landscape...' },
    ],
    humanCursors: [
      { idx: 0, x: 44, y: 30, message: 'Great insights — incorporating these' },
      { idx: 1, x: 76, y: 20, message: 'Adding technical specs' },
    ],
    statusOverrides: { t4: 'done', t6: 'review' },
  },
  {
    agentCursors: [
      { id: 'langchain', x: 22, y: 54, message: 'Generating SDK examples...' },
      { id: 'openai', x: 60, y: 14, message: 'Announcement finalized ✓' },
      { id: 'cursor', x: 74, y: 68, message: 'Deployed — all tests passing' },
    ],
    humanCursors: [
      { idx: 1, x: 40, y: 38, message: 'Ship it! Looking great' },
    ],
    statusOverrides: { t1: 'done', t5: 'working' },
  },
  {
    agentCursors: [
      { id: 'anthropic', x: 16, y: 28, message: 'All compliance items cleared ✓' },
      { id: 'google', x: 54, y: 58, message: 'Market analysis complete — 3 key insights' },
      { id: 'langchain', x: 72, y: 36, message: 'API docs ready for review' },
    ],
    humanCursors: [
      { idx: 0, x: 34, y: 68, message: 'Assigning onboarding flow next' },
    ],
    statusOverrides: { t6: 'done', t5: 'review', t8: 'working' },
  },
];

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

function TypingDots({ color }: { color: string }) {
  return (
    <span className="inline-flex items-center gap-[3px]">
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.18, ease: 'easeInOut' }}
          className="w-[5px] h-[5px] rounded-full inline-block"
          style={{ backgroundColor: color }}
        />
      ))}
    </span>
  );
}

function useSceneManager() {
  const [sceneIdx, setSceneIdx] = useState(0);
  const [statusAccum, setStatusAccum] = useState<Record<string, TaskStatus>>({});

  useEffect(() => {
    const dur = SCENES[sceneIdx].duration ?? SCENE_DURATION;
    const id = setTimeout(() => {
      setSceneIdx(prev => {
        const next = (prev + 1) % SCENES.length;
        if (next === 0) setStatusAccum({});
        return next;
      });
    }, dur);
    return () => clearTimeout(id);
  }, [sceneIdx]);

  useEffect(() => {
    const overrides = SCENES[sceneIdx].statusOverrides;
    if (overrides) {
      setStatusAccum(prev => ({ ...prev, ...overrides }));
    }
  }, [sceneIdx]);

  const scene = SCENES[sceneIdx];

  const currentStatuses = useMemo(() => {
    const statuses: Record<string, TaskStatus> = {};
    TASKS.forEach(t => { statuses[t.id] = t.defaultStatus; });
    Object.entries(statusAccum).forEach(([id, s]) => { statuses[id] = s; });
    return statuses;
  }, [statusAccum]);

  return { scene, sceneIdx, currentStatuses };
}

/* ─── Floating Cursors ────────────────────────────────────────────────────── */

function AgentCursorOverlay({
  agent,
  x,
  y,
  message,
}: {
  agent: DemoAgent;
  x: number;
  y: number;
  message: string;
}) {
  const [showText, setShowText] = useState(false);
  useEffect(() => {
    setShowText(false);
    const t = setTimeout(() => setShowText(true), 1800);
    return () => clearTimeout(t);
  }, [message]);

  return (
    <motion.div
      animate={{ left: `${x}%`, top: `${y}%` }}
      transition={{ type: 'spring', stiffness: 40, damping: 18, mass: 1.6 }}
      className="absolute z-20 pointer-events-none"
      style={{ transform: 'translate(-50%, -50%)' }}
    >
      <div className="flex items-start gap-2.5">
        <div
          className="w-11 h-11 rounded-xl overflow-hidden shadow-lg flex items-center justify-center flex-shrink-0"
          style={{
            border: `2px solid ${agent.color}`,
            backgroundColor: '#1a1a1a',
          }}
        >
          <img
            src={agent.logo}
            alt={agent.name}
            className="w-6 h-6 object-contain"
            loading="lazy"
          />
        </div>
        <div className="flex flex-col gap-1 mt-0.5">
          <div
            className="flex items-center gap-2 bg-[#1a1a1a] rounded-full px-3 py-1.5 shadow-md"
            style={{ border: `1.5px solid ${agent.color}` }}
          >
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: agent.color }}
            />
            <span className="text-[11px] font-semibold text-gray-300 whitespace-nowrap">
              {agent.name}
            </span>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.25 }}
            className="px-3 py-1.5 rounded-lg text-[11px] max-w-[190px] shadow-md"
            style={{
              backgroundColor: 'rgba(20,20,20,0.92)',
              color: '#e0e0e0',
              borderLeft: `3px solid ${agent.color}`,
              backdropFilter: 'blur(8px)',
            }}
          >
            <AnimatePresence mode="wait">
              {!showText ? (
                <motion.div key="dots" className="flex justify-center py-0.5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                  <TypingDots color={agent.color} />
                </motion.div>
              ) : (
                <motion.div key="text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
                  {message}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

function HumanCursorOverlay({
  human,
  x,
  y,
  message,
  avatarImage,
}: {
  human: DemoHuman;
  x: number;
  y: number;
  message: string;
  avatarImage?: string;
}) {
  const [showText, setShowText] = useState(false);
  useEffect(() => {
    setShowText(false);
    const t = setTimeout(() => setShowText(true), 2200);
    return () => clearTimeout(t);
  }, [message]);

  const flipBubble = x > 60;

  return (
    <motion.div
      animate={{ left: `${x}%`, top: `${y}%` }}
      transition={{ type: 'spring', stiffness: 35, damping: 18, mass: 1.8 }}
      className="absolute z-[19] pointer-events-none"
      style={{ transform: 'translate(-2px, -2px)' }}
    >
      <div className={`flex items-start gap-2.5 ${flipBubble ? 'flex-row-reverse' : ''}`}>
        <div className="relative flex flex-col items-center gap-0.5">
          <svg width="14" height="18" viewBox="0 0 14 18" fill="none" className="drop-shadow-md flex-shrink-0">
            <path
              d="M1 1L1 13.5L4.8 10L8 16.5L10.5 15.2L7.3 9L12.5 9L1 1Z"
              fill={human.color}
              stroke="white"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
          {avatarImage ? (
            <div
              className="w-10 h-10 rounded-full overflow-hidden shadow-lg ring-2 ring-[#0a0a0a]"
              style={{ background: `linear-gradient(145deg, ${human.color}ee, ${human.color})` }}
            >
              <img src={avatarImage} alt={human.name} className="w-full h-full object-cover" loading="lazy" />
            </div>
          ) : (
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg ring-2 ring-[#0a0a0a]"
              style={{ background: `linear-gradient(145deg, ${human.color}ee, ${human.color})` }}
            >
              {human.initials}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1.5 mt-3">
          <div
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1 shadow-md"
            style={{ backgroundColor: `${human.color}ee` }}
          >
            <span className="text-[11px] font-semibold text-white whitespace-nowrap">{human.name}</span>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.25 }}
            className="px-3 py-1.5 rounded-lg text-[11px] max-w-[200px] shadow-md"
            style={{
              backgroundColor: 'rgba(20,20,20,0.92)',
              color: '#e0e0e0',
              borderLeft: `3px solid ${human.color}`,
              backdropFilter: 'blur(8px)',
            }}
          >
            <AnimatePresence mode="wait">
              {!showText ? (
                <motion.div key="dots" className="flex justify-center py-0.5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                  <TypingDots color={human.color} />
                </motion.div>
              ) : (
                <motion.div key="text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
                  {message}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Board Table ─────────────────────────────────────────────────────────── */

function StatusPill({ status }: { status: TaskStatus }) {
  const meta = STATUS_META[status];
  return (
    <motion.span
      layout
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider"
      style={{ backgroundColor: `${meta.color}20`, color: meta.color }}
      animate={{ backgroundColor: `${meta.color}20`, color: meta.color }}
      transition={{ duration: 0.5 }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: meta.color }} />
      {meta.label}
    </motion.span>
  );
}

function AgentBadge({ agent }: { agent: DemoAgent }) {
  return (
    <div className="flex items-center gap-1.5">
      <div
        className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: '#222', border: `1px solid ${agent.color}40` }}
      >
        <img src={agent.logo} alt={agent.name} className="w-3.5 h-3.5 object-contain" loading="lazy" />
      </div>
      <span className="text-[11px] text-gray-400 truncate">{agent.name}</span>
    </div>
  );
}

function HumanBadge({ human, avatarImage }: { human: DemoHuman; avatarImage?: string }) {
  return (
    <div className="flex items-center gap-1.5">
      {avatarImage ? (
        <div
          className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 ring-1 ring-white/10"
          style={{ backgroundColor: human.color }}
        >
          <img src={avatarImage} alt={human.name} className="w-full h-full object-cover" loading="lazy" />
        </div>
      ) : (
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
          style={{ background: human.color }}
        >
          {human.initials}
        </div>
      )}
      <span className="text-[11px] text-gray-400 truncate">{human.name}</span>
    </div>
  );
}

function BoardTable({ currentStatuses, avatarPool }: { currentStatuses: Record<string, TaskStatus>; avatarPool: { image: string; color: string }[] }) {
  const agentsMap = useMemo(() => {
    const m = new Map<string, DemoAgent>();
    DEMO_AGENTS.forEach(a => m.set(a.id, a));
    return m;
  }, []);

  return (
    <div className="w-full overflow-x-auto">
      {/* Group header */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.06]">
        <div className="w-1 h-4 rounded-full" style={{ backgroundColor: '#00D2D2' }} />
        <span className="text-[13px] font-medium text-gray-300">Product Launch Board</span>
        <span className="text-[10px] text-gray-600 ml-auto">{TASKS.length} items</span>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-[minmax(0,2fr)_100px_120px_100px] gap-px bg-white/[0.04] border-b border-white/[0.06]">
        <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-500">Task</div>
        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-500">Status</div>
        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-500">AI Agent</div>
        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-500">Owner</div>
      </div>

      {/* Rows */}
      {TASKS.map(task => {
        const status = currentStatuses[task.id] ?? task.defaultStatus;
        const agent = task.agentId ? agentsMap.get(task.agentId) : undefined;
        const human = task.humanIdx !== undefined ? DEMO_HUMANS[task.humanIdx] : undefined;

        return (
          <div
            key={task.id}
            className="grid grid-cols-[minmax(0,2fr)_100px_120px_100px] gap-px border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
          >
            <div className="px-4 py-3 text-[12px] text-gray-200 font-medium truncate">
              {task.label}
            </div>
            <div className="px-3 py-2.5 flex items-center">
              <StatusPill status={status} />
            </div>
            <div className="px-3 py-2.5 flex items-center">
              {agent ? <AgentBadge agent={agent} /> : <span className="text-[11px] text-gray-600">—</span>}
            </div>
            <div className="px-3 py-2.5 flex items-center">
              {human ? (
                <HumanBadge
                  human={human}
                  avatarImage={task.humanIdx !== undefined && avatarPool[task.humanIdx] ? avatarPool[task.humanIdx].image : undefined}
                />
              ) : <span className="text-[11px] text-gray-600">—</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Logo Marquee ────────────────────────────────────────────────────────── */

const MARQUEE_COMPANIES = [
  ...AI_COMPANIES,
  { id: 'cursor', name: 'Cursor', logo: '/logos/cursor.svg', category: 'platform' as const, color: '#7C3AED' },
];

function LogoMarquee() {
  const doubled = useMemo(() => [...MARQUEE_COMPANIES, ...MARQUEE_COMPANIES], []);

  return (
    <div className="relative overflow-hidden py-6 mt-10">
      <p className="text-center text-[11px] font-medium uppercase tracking-widest text-gray-500 mb-6">
        Welcoming agents from {MARQUEE_COMPANIES.length}+ frameworks & platforms
      </p>
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 z-10" style={{ background: 'linear-gradient(to right, #0a0a0a, transparent)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-20 z-10" style={{ background: 'linear-gradient(to left, #0a0a0a, transparent)' }} />
        <motion.div
          className="flex items-center gap-10 w-max"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        >
          {doubled.map((company, i) => (
            <div
              key={`${company.id}-${i}`}
              className="flex items-center gap-2 flex-shrink-0 opacity-50 hover:opacity-80 transition-opacity"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <img src={company.logo} alt={company.name} className="w-5 h-5 object-contain" loading="lazy" />
              </div>
              <span className="text-[11px] text-gray-500 whitespace-nowrap">{company.name}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Main Section ────────────────────────────────────────────────────────── */

export function OpenPlatformSection() {
  const { scene, sceneIdx, currentStatuses } = useSceneManager();
  const { departments: supabaseDepts } = useDepartments();
  const { settings } = useSiteSettings();
  const boardRef = useRef<HTMLDivElement>(null);

  const agentsMap = useMemo(() => {
    const m = new Map<string, DemoAgent>();
    DEMO_AGENTS.forEach(a => m.set(a.id, a));
    return m;
  }, []);

  const avatarOverrides = settings?.wm_dept_avatar_overrides ?? {};
  const colorOverrides = settings?.wm_dept_color_overrides ?? {};
  const deptOrderSetting = settings?.wm_dept_order ?? [];

  const orderedDepts = useMemo(() => {
    if (deptOrderSetting.length === 0) return DEPARTMENTS;
    const ordered = deptOrderSetting.map(id => DEPARTMENTS.find(d => d.id === id)).filter(Boolean) as typeof DEPARTMENTS;
    const missing = DEPARTMENTS.filter(d => !deptOrderSetting.includes(d.id));
    return [...ordered, ...missing];
  }, [deptOrderSetting]);

  const rawAvatarPool = useMemo(() => {
    return supabaseDepts
      .filter(sd => sd.avatar_image)
      .map(sd => ({ image: sd.avatar_image, color: sd.avatar_color || '#94a3b8' }));
  }, [supabaseDepts]);

  const LOCAL_AVATAR_DEFAULTS: Record<string, string> = {
    product: '/avatars/product-lead.png',
  };

  const avatarPool = useMemo(() => {
    return orderedDepts.map((d, i) => {
      const overrideImg = avatarOverrides[d.id];
      const overrideColor = colorOverrides[d.id] || d.color;
      if (overrideImg) return { image: overrideImg, color: overrideColor };
      if (LOCAL_AVATAR_DEFAULTS[d.id]) return { image: LOCAL_AVATAR_DEFAULTS[d.id], color: overrideColor };
      if (rawAvatarPool.length < 2) return { image: '', color: overrideColor };
      const offset = Math.floor(rawAvatarPool.length / 2) + 2;
      const poolEntry = rawAvatarPool[(i + offset) % rawAvatarPool.length];
      return { image: poolEntry?.image || '', color: overrideColor };
    }).filter(a => a.image);
  }, [orderedDepts, avatarOverrides, colorOverrides, rawAvatarPool]);

  return (
    <section className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#0a0a0a] overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
      >
        <h2 className="text-3xl sm:text-4xl lg:text-[48px] font-bold tracking-[-0.03em] leading-[1.1] text-white mb-4">
          Welcoming all AI agents.
        </h2>
        <p className="text-[15px] sm:text-[17px] text-gray-400 leading-relaxed max-w-2xl mx-auto">
          monday.com is now open to every AI agent. From OpenAI to Cursor to Anthropic — they can all sign up, connect, and work alongside your team.
        </p>
      </motion.div>

      {/* Board Demo Card */}
      <div style={{ perspective: '1800px' }} className="max-w-[960px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30, rotateX: 4 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 1.5 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="rounded-2xl border border-white/[0.08] bg-[#141414] relative overflow-hidden"
          style={{
            boxShadow: '0 20px 60px -12px rgba(0,0,0,0.5), 0 4px 20px -4px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.04)',
            transformOrigin: 'center bottom',
          }}
        >
          {/* Board content */}
          <div ref={boardRef} className="relative min-h-[420px] sm:min-h-[480px]">
            <BoardTable currentStatuses={currentStatuses} avatarPool={avatarPool} />

            {/* Floating cursors — hidden on mobile */}
            <div className="hidden lg:block">
              <AnimatePresence mode="wait">
                <motion.div
                  key={sceneIdx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  {scene.agentCursors.map(c => {
                    const agent = agentsMap.get(c.id);
                    if (!agent) return null;
                    return (
                      <AgentCursorOverlay
                        key={c.id}
                        agent={agent}
                        x={c.x}
                        y={c.y}
                        message={c.message}
                      />
                    );
                  })}
                  {scene.humanCursors.map(c => {
                    const human = DEMO_HUMANS[c.idx];
                    if (!human) return null;
                    const avatar = avatarPool[c.idx];
                    return (
                      <HumanCursorOverlay
                        key={`human-${c.idx}`}
                        human={human}
                        x={c.x}
                        y={c.y}
                        message={c.message}
                        avatarImage={avatar?.image}
                      />
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Scene indicator dots */}
          <div className="flex items-center justify-center gap-2 py-4 border-t border-white/[0.06]">
            {SCENES.map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full transition-all duration-500"
                style={{
                  backgroundColor: i === sceneIdx ? '#00D2D2' : 'rgba(255,255,255,0.1)',
                  boxShadow: i === sceneIdx ? '0 0 8px rgba(0,210,210,0.4)' : 'none',
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Logo Marquee */}
      <div className="max-w-[960px] mx-auto">
        <LogoMarquee />
      </div>
    </section>
  );
}
