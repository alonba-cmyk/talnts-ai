"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'motion/react';
import {
  ArrowRight,
  Sparkles,
  Bot,
  LayoutGrid,
  Send,
} from 'lucide-react';
import { useDepartments, useSiteSettings, type SiteSettings } from '@/hooks/useSupabase';
import { WORK_MANAGEMENT_TRIAL_URL } from '@/lib/workManagementUrls';
import {
  DEPARTMENTS,
  STATUS_CONFIG,
  PROGRESS_BY_COL,
  type BoardItem,
  type AgentInfo,
} from './wmDepartmentData';
import { SQUAD_DEPARTMENTS } from './squadData';
import {
  WmHeroLiveDelegation,
  WmHeroCinematicAssembly,
  WmHeroSplitReveal,
  WmHeroRosterBoard,
  SplitRosterView,
  type WmHeroVariantProps,
} from './WorkManagementHeroVariants';

/* ─── Floating agent cursor ─── */

function TypingDots({ color }: { color: string }) {
  return (
    <span className="inline-flex items-center gap-[3px]">
      {[0, 1, 2].map((i) => (
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

function AgentBubbleContent({ message, accentColor }: { message: string; accentColor: string }) {
  const [showText, setShowText] = useState(false);
  useEffect(() => {
    setShowText(false);
    const t = setTimeout(() => setShowText(true), 1800);
    return () => clearTimeout(t);
  }, [message]);

  return (
    <AnimatePresence mode="wait">
      {!showText ? (
        <motion.div
          key="dots"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <TypingDots color={accentColor} />
        </motion.div>
      ) : (
        <motion.div
          key="text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35 }}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Typewriter text component ─── */
function TypewriterText({ text, onDone }: { text: string; onDone?: () => void }) {
  const [displayed, setDisplayed] = useState('');
  const idxRef = useRef(0);
  useEffect(() => {
    setDisplayed('');
    idxRef.current = 0;
    const interval = setInterval(() => {
      idxRef.current += 1;
      setDisplayed(text.slice(0, idxRef.current));
      if (idxRef.current >= text.length) {
        clearInterval(interval);
        onDone?.();
      }
    }, 20);
    return () => clearInterval(interval);
  }, [text]);
  return <span>{displayed}<span className="opacity-0">|</span></span>;
}

/* ─── Story intro overlay — centered face-to-face conversation ─── */

function StoryIntro({
  humanName,
  humanAvatar,
  humanAvatarBg,
  humanMessage,
  agent,
  agentMessage,
  deptColor,
}: {
  humanName: string;
  humanAvatar?: string;
  humanAvatarBg: string;
  humanMessage: string;
  agent: AgentInfo;
  agentMessage: string;
  deptColor: string;
}) {
  // Sequential phases: 0=idle, 1=humanDots, 2=humanTyping, 3=agentDots, 4=agentTyping
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    setPhase(0);
    const timers = [
      setTimeout(() => setPhase(1), 1000),
      setTimeout(() => setPhase(2), 3000),
      setTimeout(() => setPhase(3), 5500),
      setTimeout(() => setPhase(4), 7500),
    ];
    return () => timers.forEach(clearTimeout);
  }, [humanMessage, agentMessage]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: 'easeInOut' }}
      className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
      style={{ backgroundColor: 'rgba(10,10,10,0.88)', backdropFilter: 'blur(8px)' }}
    >
      <div className="flex items-start gap-10 max-w-[680px] w-full px-8">
        {/* Human side */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-col items-center gap-4 flex-1"
        >
          {humanAvatar && (
            <div
              className="w-24 h-24 rounded-full overflow-hidden shadow-xl ring-2 ring-white/20"
              style={{ backgroundColor: humanAvatarBg }}
            >
              <img src={humanAvatar} alt={humanName} className="w-full h-full object-cover" loading="lazy" />
            </div>
          )}
          <span className="text-[13px] font-semibold text-white/90">{humanName}</span>
          {phase >= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="px-5 py-3.5 rounded-2xl text-[14px] leading-relaxed text-white shadow-lg w-full text-center"
              style={{
                backgroundColor: 'rgba(255,255,255,0.09)',
                border: '1px solid rgba(255,255,255,0.14)',
                minHeight: '54px',
              }}
            >
              <AnimatePresence mode="wait">
                {phase === 1 ? (
                  <motion.div key="hdots" className="flex justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                    <TypingDots color="#ffffff" />
                  </motion.div>
                ) : (
                  <motion.div key="htext" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
                    <TypewriterText text={humanMessage} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </motion.div>

        {/* Divider */}
        <div className="flex flex-col items-center gap-2 pt-10 flex-shrink-0">
          <div className="w-px h-16 bg-white/10" />
          <Sparkles className="w-5 h-5 text-white/30" />
          <div className="w-px h-16 bg-white/10" />
        </div>

        {/* Agent side */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-col items-center gap-4 flex-1"
        >
          <div
            className="w-24 h-24 rounded-2xl overflow-hidden shadow-xl"
            style={{ border: `2.5px solid ${deptColor}`, backgroundColor: agent.bgColor }}
          >
            <img
              src={agent.img}
              alt={agent.label}
              className="w-full h-full object-contain object-bottom"
              loading="lazy"
              onError={(e) => { (e.target as HTMLImageElement).src = agent.fallback; }}
            />
          </div>
          <span className="text-[13px] font-semibold text-white/90">{agent.label}</span>
          {phase >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="px-5 py-3.5 rounded-2xl text-[14px] leading-relaxed text-white shadow-lg w-full text-center"
              style={{
                backgroundColor: `${agent.bgColor}18`,
                border: `1px solid ${agent.bgColor}35`,
                minHeight: '54px',
              }}
            >
              <AnimatePresence mode="wait">
                {phase === 3 ? (
                  <motion.div key="adots" className="flex justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                    <TypingDots color={agent.bgColor} />
                  </motion.div>
                ) : (
                  <motion.div key="atext" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
                    <TypewriterText text={agentMessage} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

function FloatingAgentCursor({
  agent,
  x,
  y,
  deptColor,
  message,
  isDragging,
}: {
  agent: AgentInfo;
  x: number;
  y: number;
  deptColor: string;
  message?: string;
  isDragging?: boolean;
}) {
  return (
    <motion.div
      animate={{ left: `${x}%`, top: `${y}%` }}
      transition={{ type: 'spring', stiffness: 40, damping: 18, mass: 1.6 }}
      className="absolute z-30 pointer-events-none"
      style={{ transform: isDragging ? 'translate(-50%, 0)' : 'translate(-50%, -50%)' }}
    >
      {isDragging ? (
        <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
          <svg width="18" height="22" viewBox="0 0 24 24" fill="none" className="drop-shadow-md flex-shrink-0">
            <path
              d="M8 14.5V7.5C8 6.67 8.67 6 9.5 6S11 6.67 11 7.5V4.5C11 3.67 11.67 3 12.5 3S14 3.67 14 4.5V7.5C14 6.67 14.67 6 15.5 6S17 6.67 17 7.5V9.5C17 8.67 17.67 8 18.5 8S20 8.67 20 9.5V16.5C20 19.54 17.54 22 14.5 22H12C9.24 22 7 19.76 7 17V14.5C7 13.67 7.67 13 8.5 13S8 13.67 8 14.5Z"
              fill={deptColor}
              stroke="white"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
          <motion.div
            animate={{ boxShadow: [`0 0 0 0px ${deptColor}40`, `0 0 0 6px ${deptColor}00`] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
            className="w-14 h-14 rounded-2xl overflow-hidden shadow-lg"
            style={{
              border: `2.5px solid ${deptColor}`,
              backgroundColor: agent.bgColor,
            }}
          >
            <img
              src={agent.img}
              alt={agent.label}
              className="w-full h-full object-contain object-bottom"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = agent.fallback;
              }}
            />
          </motion.div>
        </div>
      ) : (
        <div className={`flex items-start gap-2.5 ${x > 55 ? 'flex-row-reverse' : ''}`}>
          <div className="relative flex-shrink-0">
            <div
              className="w-14 h-14 rounded-2xl overflow-hidden shadow-lg"
              style={{
                border: `2.5px solid ${deptColor}`,
                backgroundColor: agent.bgColor,
              }}
            >
              <img
                src={agent.img}
                alt={agent.label}
                className="w-full h-full object-contain object-bottom"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = agent.fallback;
                }}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1 mt-1">
            <div
              className="flex items-center gap-2 bg-white dark:bg-[#1a1a1a] rounded-full px-3 py-1.5 shadow-md"
              style={{ border: `1.5px solid ${deptColor}` }}
            >
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: deptColor }}
              />
              <span className="text-[12px] font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                {agent.label}
              </span>
            </div>
            {!message && (
              <span className="text-[10px] text-gray-500 dark:text-gray-500 pl-1 whitespace-nowrap">
                {agent.status}
              </span>
            )}
            {message && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.25 }}
                className="relative px-3 py-1.5 rounded-lg text-[11px] max-w-[180px] shadow-md"
                style={{
                  backgroundColor: 'rgba(20,20,20,0.92)',
                  color: '#e0e0e0',
                  borderLeft: `3px solid ${agent.bgColor}`,
                  backdropFilter: 'blur(8px)',
                }}
              >
                <AgentBubbleContent message={message} accentColor={agent.bgColor} />
              </motion.div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}

/* ─── Floating human cursor ─── */

function FloatingHumanCursor({
  name,
  color,
  x,
  y,
  avatarImage,
  deptColor,
  message,
  isDragging,
  showTyping,
}: {
  name: string;
  color: string;
  x: number;
  y: number;
  avatarImage?: string;
  deptColor: string;
  message?: string;
  isDragging?: boolean;
  showTyping?: boolean;
}) {
  const flipBubble = x > 60;
  return (
    <motion.div
      animate={{ left: `${x}%`, top: `${y}%` }}
      transition={{ type: 'spring', stiffness: 35, damping: 18, mass: 1.8 }}
      className="absolute z-[19] pointer-events-none"
      style={{ transform: isDragging ? 'translate(-2px, 0)' : 'translate(-2px, -2px)' }}
    >
      <div className={`flex items-start gap-2.5 ${flipBubble ? 'flex-row-reverse' : ''}`}>
        <div className="relative flex flex-col items-center gap-0.5">
          {!isDragging && (
            <svg width="14" height="18" viewBox="0 0 14 18" fill="none" className="drop-shadow-md flex-shrink-0">
              <path
                d="M1 1L1 13.5L4.8 10L8 16.5L10.5 15.2L7.3 9L12.5 9L1 1Z"
                fill={color}
                stroke="white"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
          )}
          {isDragging && (
            <svg width="18" height="22" viewBox="0 0 24 24" fill="none" className="drop-shadow-md flex-shrink-0">
              <path
                d="M8 14.5V7.5C8 6.67 8.67 6 9.5 6S11 6.67 11 7.5V4.5C11 3.67 11.67 3 12.5 3S14 3.67 14 4.5V7.5C14 6.67 14.67 6 15.5 6S17 6.67 17 7.5V9.5C17 8.67 17.67 8 18.5 8S20 8.67 20 9.5V16.5C20 19.54 17.54 22 14.5 22H12C9.24 22 7 19.76 7 17V14.5C7 13.67 7.67 13 8.5 13S8 13.67 8 14.5Z"
                fill={color}
                stroke="white"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
          )}
          {avatarImage && (
            <motion.div
              animate={isDragging ? {
                boxShadow: [`0 0 0 0px ${deptColor}40`, `0 0 0 6px ${deptColor}00`],
              } : {}}
              transition={isDragging ? { duration: 1.2, repeat: Infinity, ease: 'easeOut' } : {}}
              className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 shadow-lg ring-2 ring-white dark:ring-[#0a0a0a]"
              style={{
                border: `2.5px solid ${deptColor}60`,
                background: `linear-gradient(145deg, ${deptColor}ee, ${deptColor})`,
              }}
            >
              <img src={avatarImage} alt={name} className="w-full h-full object-cover" loading="lazy" />
            </motion.div>
          )}
        </div>
        <div className="flex flex-col gap-1.5 mt-3">
          <div
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1 shadow-md"
            style={{ backgroundColor: `${deptColor}ee` }}
          >
            <span className="text-[11px] font-semibold text-white whitespace-nowrap">{name}</span>
          </div>
          {(showTyping || message) && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.25 }}
              className="relative px-3 py-1.5 rounded-lg text-[11px] max-w-[200px] shadow-md flex items-center justify-center min-h-[32px]"
              style={{
                backgroundColor: 'rgba(20,20,20,0.92)',
                color: '#e0e0e0',
                borderLeft: `3px solid ${deptColor}`,
                backdropFilter: 'blur(8px)',
              }}
            >
              {showTyping ? <TypingDots color={deptColor} /> : message}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Cursor position hooks ─── */

/* ─── Conversation messages per member (JTBD-related) ─── */
const CONVERSATION_BY_LABEL: Record<string, string> = {
  'Risk Analyzer': 'Prioritizing risks...',
  'Vendor Researcher': 'Evaluating options...',
  'Assets Generator': 'Building deliverables...',
  'Program Manager': 'Assigning tasks...',
  'Project Lead': 'Aligning priorities...',
  'Product Manager': 'Reviewing backlog...',
  'UX Designer': 'Refining scope...',
  'Ops Manager': 'Streamlining flow...',
  'Process Analyst': 'Mapping process...',
  'Recruiter': 'Screening candidates...',
  'People Partner': 'Aligning on goals...',
  'Content Strategist': 'Planning content...',
  'Campaign Manager': 'Coordinating launch...',
  'Financial Analyst': 'Analyzing budget...',
  'Controller': 'Reviewing numbers...',
  'Account Executive': 'Closing deal...',
  'SDR': 'Qualifying leads...',
  'SysAdmin': 'Checking systems...',
  'DevOps Engineer': 'Deploying updates...',
};
function getConversationMessage(member: { label: string; role: string }, jtbd: string): string {
  if (member.role === 'Team Lead') {
    const msgs = [
      `Aligning team on ${jtbd.toLowerCase()}...`,
      'Reviewing progress...',
      'Delegating next steps...',
      'Syncing on priorities...',
    ];
    return msgs[Math.abs(jtbd.length) % msgs.length];
  }
  return CONVERSATION_BY_LABEL[member.label] ?? `Working on ${jtbd.toLowerCase()}...`;
}

function getTeamLeadRequest(jtbd: string): string {
  const templates = [
    `Can you help with ${jtbd.toLowerCase()}?`,
    `Let's focus on ${jtbd.toLowerCase()}`,
    `I need you on ${jtbd.toLowerCase()}`,
  ];
  return templates[Math.abs(jtbd.length) % templates.length];
}

const HUMAN_WAYPOINTS = [
  { x: 35, y: 60 },
  { x: 55, y: 65 },
  { x: 70, y: 58 },
  { x: 42, y: 72 },
  { x: 60, y: 68 },
  { x: 48, y: 75 },
];

const CURSOR_ZONES = [
  { x: 22, y: 20 },
  { x: 68, y: 18 },
  { x: 28, y: 48 },
  { x: 64, y: 44 },
  { x: 24, y: 70 },
  { x: 62, y: 68 },
];

function useFloatingCursors(boardItems: BoardItem[], deptId: string, paused = false) {
  const n = Math.min(boardItems.length, CURSOR_ZONES.length);

  const [tickA, setTickA] = useState(0);

  useEffect(() => { setTickA(0); }, [deptId]);

  useEffect(() => {
    if (n === 0 || paused) return;
    const id = setInterval(() => setTickA((t) => t + 1), 10000);
    return () => clearInterval(id);
  }, [n, deptId, paused]);

  const idxA = n > 0 ? tickA % n : -1;
  // Offset by half the zone count to guarantee distant placement
  const idxB = n > 1 ? (tickA + Math.max(1, Math.floor(n / 2))) % n : -1;
  const posA = idxA >= 0 ? CURSOR_ZONES[idxA] : null;
  const posB = idxB >= 0 && idxB !== idxA ? CURSOR_ZONES[idxB] : null;

  return { posA, posB };
}

function useHumanCursor(deptId: string, paused = false) {
  const [tick, setTick] = useState(0);

  useEffect(() => { setTick(0); }, [deptId]);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setTick((t) => t + 1), 11000);
    return () => clearInterval(id);
  }, [deptId, paused]);

  const wp = HUMAN_WAYPOINTS[tick % HUMAN_WAYPOINTS.length];
  return { name: 'Sarah K.', color: '#475569', x: wp.x, y: wp.y };
}

/* ─── Squad member avatar ─── */

function SquadMember({
  agent,
  isLit,
  deptColor,
  delay,
  status,
  anyActive,
}: {
  agent: AgentInfo;
  isLit: boolean;
  deptColor: string;
  delay: number;
  status?: string;
  anyActive?: boolean;
}) {
  const dimmedOpacity = anyActive ? 0.28 : 0.65;
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: isLit ? 1 : dimmedOpacity, x: 0, filter: (!isLit && anyActive) ? 'saturate(0.3)' : 'saturate(1)' }}
      transition={{ delay, duration: 0.35, opacity: { duration: 0.5 }, filter: { duration: 0.5 } }}
      className="flex items-center gap-3 relative rounded-lg px-2 py-1.5 -mx-2 transition-all duration-300"
      style={isLit ? {
        backgroundColor: `${agent.bgColor}18`,
        boxShadow: `0 0 10px 1px ${agent.bgColor}12`,
        marginLeft: '-10px',
        paddingLeft: '8px',
      } : {
        marginLeft: '-10px',
        paddingLeft: '8px',
      }}
    >
      {/* Avatar */}
      <div
        className="relative z-10 flex-shrink-0"
      >
        <div
          className={`w-14 h-14 rounded-xl overflow-hidden transition-all duration-300 ${
            isLit ? 'ring-1 ring-offset-1 ring-offset-white dark:ring-offset-[#0a0a0a]' : 'ring-1 ring-gray-200 dark:ring-white/10'
          }`}
          style={{
            background: `linear-gradient(145deg, ${agent.bgColor}cc, ${agent.bgColor})`,
            ...(isLit ? { ['--tw-ring-color' as string]: `${agent.bgColor}80` } : {}),
          }}
        >
          <img
            src={agent.img}
            alt={agent.label}
            className="w-full h-full object-contain object-bottom"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = agent.fallback;
            }}
          />
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay + 0.2, type: 'spring', stiffness: 400 }}
          className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center z-20 border-2 border-white dark:border-[#0a0a0a]"
          style={{
            background: `linear-gradient(135deg, ${agent.bgColor}, ${agent.bgColor}cc)`,
          }}
        >
          <Sparkles className="w-2.5 h-2.5 text-white" />
        </motion.div>
      </div>

      {/* Info */}
      <div className="min-w-0 z-10">
        <p className="text-[13px] font-semibold text-gray-900 dark:text-white truncate">{agent.label}</p>
        <AnimatePresence mode="wait">
          {isLit && status ? (
            <motion.p
              key="status"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="text-[11px] font-medium flex items-center gap-1"
              style={{ color: deptColor }}
            >
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: deptColor }}
              />
              {status}
            </motion.p>
          ) : (
            <motion.p
              key="role"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[11px] text-gray-400 dark:text-gray-500 font-medium"
            >
              AI Agent
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ─── Human team member ─── */

function HumanMember({
  label,
  initials,
  color,
  isLead,
  isLit,
  avatarImage,
  delay,
}: {
  label: string;
  initials: string;
  color: string;
  isLead?: boolean;
  isLit: boolean;
  avatarImage?: string;
  delay: number;
}) {
  const size = isLead ? 'w-14 h-14' : 'w-11 h-11';
  const ringSize = isLead ? 'ring-[3px]' : 'ring-[2.5px]';

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.35 }}
      className="flex items-center gap-3 relative"
    >
      <AnimatePresence>
        {isLit && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1.15 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4 }}
            className="absolute -inset-1 rounded-xl pointer-events-none z-0"
            style={{
              background: `radial-gradient(ellipse at left, ${color}25 0%, transparent 70%)`,
            }}
          />
        )}
      </AnimatePresence>

      <motion.div
        animate={isLit ? { scale: [1, 1.06, 1] } : { scale: 1 }}
        transition={isLit ? { duration: 1.4, ease: 'easeInOut' } : { duration: 0.3 }}
        className="relative z-10 flex-shrink-0"
      >
        <div
          className={`${size} rounded-full overflow-hidden transition-all duration-300 ${
            isLit ? `${ringSize} ring-offset-2 ring-offset-white dark:ring-offset-[#0a0a0a] shadow-lg` : 'ring-1 ring-gray-200 dark:ring-white/10'
          }`}
          style={{
            backgroundColor: color,
            ...(isLit ? { ['--tw-ring-color' as string]: color } : {}),
          }}
        >
          {avatarImage ? (
            <img src={avatarImage} alt={label} className="w-full h-full object-cover" loading="lazy" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className={`text-white font-bold ${isLead ? 'text-lg' : 'text-xs'}`}>
                {initials}
              </span>
            </div>
          )}
        </div>
      </motion.div>

      <div className="min-w-0 z-10">
        <p className={`font-semibold text-gray-900 dark:text-white truncate ${isLead ? 'text-[13px]' : 'text-[12px]'}`}>
          {label}
        </p>
        <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">
          {isLead ? 'Team Lead' : 'Team'}
        </p>
      </div>
    </motion.div>
  );
}

/* ─── Board task row ─── */

function TaskRow({
  item,
  agents,
  deptColor,
  isHighlighted,
  delay,
  avatarPool,
  anyActive,
}: {
  item: BoardItem;
  agents: AgentInfo[];
  deptColor: string;
  isHighlighted: boolean;
  delay: number;
  avatarPool: { image: string; color: string }[];
  anyActive?: boolean;
}) {
  const status = STATUS_CONFIG[item.columnIndex] || STATUS_CONFIG[0];
  const progress = PROGRESS_BY_COL[item.columnIndex] || 0;
  const agentIdx = item.agentWorking ? Math.abs(item.id.charCodeAt(item.id.length - 1)) % agents.length : -1;
  const ownerAvatarIndex = item.hasAvatar && avatarPool.length > 0
    ? Math.abs(item.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % avatarPool.length
    : -1;
  const ownerAvatar = ownerAvatarIndex >= 0 ? avatarPool[ownerAvatarIndex] : null;
  const isDimmed = anyActive && !isHighlighted;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{
        opacity: isDimmed ? 0.28 : 1,
        y: 0,
        backgroundColor: isHighlighted ? `${deptColor}08` : 'transparent',
        filter: isDimmed ? 'saturate(0.3)' : 'saturate(1)',
      }}
      transition={{ delay, duration: 0.25, opacity: { duration: 0.5 }, filter: { duration: 0.5 } }}
      className="grid grid-cols-[1fr_64px_56px_80px_72px] gap-2 px-3 py-3 border-b border-gray-50 dark:border-white/[0.03] rounded-md transition-colors"
      style={{
        boxShadow: isHighlighted ? `inset 3px 0 0 ${deptColor}` : 'none',
      }}
    >
      <span className="text-[13px] text-gray-800 dark:text-gray-300 font-medium truncate">{item.label}</span>

      {/* Owner: human avatars only */}
      <div className="flex items-center justify-center gap-0.5 min-w-[28px]">
        {item.hasAvatar && (
          ownerAvatar?.image ? (
            <div
              className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 ring-1 ring-gray-200 dark:ring-white/10"
              style={{
                background: `linear-gradient(145deg, ${item.avatarColor || ownerAvatar.color}ee, ${item.avatarColor || ownerAvatar.color})`,
              }}
            >
              <img src={ownerAvatar.image} alt="" className="w-full h-full object-cover" loading="lazy" />
            </div>
          ) : (
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ring-1 ring-gray-200 dark:ring-white/10 text-[10px] font-bold text-white"
              style={{ backgroundColor: item.avatarColor || deptColor }}
            >
              {item.label.charAt(0)}
            </div>
          )
        )}
      </div>

      <div className="flex items-center justify-center">
        {agentIdx >= 0 ? (
          <motion.div
            animate={isHighlighted ? { scale: [1, 1.15, 1] } : {}}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            className="w-8 h-8 rounded-lg overflow-hidden shadow-sm"
            style={{
              background: `linear-gradient(135deg, ${agents[agentIdx].bgColor}90, ${agents[agentIdx].bgColor}cc)`,
            }}
          >
            <img
              src={agents[agentIdx].img}
              alt=""
              className="w-full h-full object-contain object-bottom"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = agents[agentIdx].fallback;
              }}
            />
          </motion.div>
        ) : (
          <div className="w-8 h-8" />
        )}
      </div>

      <div className="flex items-center">
        <span
          className="text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap"
          style={{ color: status.color, backgroundColor: status.bg }}
        >
          {status.label}
        </span>
      </div>

      <div className="flex items-center">
        <div className="h-2 rounded-full bg-gray-100 dark:bg-white/10 w-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ delay: delay + 0.3, duration: 0.5, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{ backgroundColor: deptColor }}
          />
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Board surface: Kanban Cards ─── */

function KanbanBoard({
  items,
  agents,
  deptColor,
  isDark,
  avatarPool,
  dragEvent,
  columnOverrides,
  highlightedTaskIds,
  anyActive,
}: {
  items: BoardItem[];
  agents: AgentInfo[];
  deptColor: string;
  isDark: boolean;
  avatarPool: { image: string; color: string }[];
  dragEvent?: DragEvent | null;
  columnOverrides?: Map<string, number>;
  highlightedTaskIds?: Set<string>;
  anyActive?: boolean;
}) {
  const columns = [
    { label: 'To Do', color: '#94a3b8', idx: 0 },
    { label: 'Working', color: '#6161FF', idx: 1 },
    { label: 'Review', color: '#f59e0b', idx: 2 },
    { label: 'Done', color: '#10b981', idx: 3 },
  ];

  const displayItems = useMemo(() => {
    return items.map(item => {
      let col = columnOverrides?.get(item.id) ?? item.columnIndex;
      if (dragEvent && item.id === dragEvent.itemId &&
          (dragEvent.phase === 'moving' || dragEvent.phase === 'dropped')) {
        col = dragEvent.toCol;
      }
      return { ...item, columnIndex: col };
    });
  }, [items, columnOverrides, dragEvent]);

  return (
    <LayoutGroup>
      <div className="flex-1 p-4 min-w-0">
        <div className="grid grid-cols-4 gap-3 h-full">
          {columns.map((col) => {
            const colItems = displayItems.filter((it) => it.columnIndex === col.idx);
            const showPlaceholder = dragEvent &&
              dragEvent.fromCol === col.idx &&
              (dragEvent.phase === 'moving' || dragEvent.phase === 'dropped');

            return (
              <div key={col.idx} className="flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: col.color }} />
                  <span className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {col.label}
                  </span>
                  <span className={`text-[10px] ml-auto ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                    {colItems.length}
                  </span>
                </div>
                {colItems.map((item, i) => {
                  const isDragging = dragEvent?.itemId === item.id;
                  const isLifting = isDragging && dragEvent?.phase === 'lifting';
                  const isMoving = isDragging && dragEvent?.phase === 'moving';
                  const isDropped = isDragging && dragEvent?.phase === 'dropped';
                  const isElevated = isLifting || isMoving;
                  const isHighlighted = highlightedTaskIds?.has(item.id) ?? false;
                  const isDimmed = anyActive && !isHighlighted && !isDragging;

                  const agentIdx = item.agentWorking ? Math.abs(item.id.charCodeAt(item.id.length - 1)) % agents.length : -1;
                  const ownerIdx = item.hasAvatar && avatarPool.length > 0
                    ? Math.abs(item.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % avatarPool.length : -1;
                  return (
                    <motion.div
                      key={item.id}
                      layoutId={`kanban-${item.id}`}
                      layout
                      animate={{
                        scale: isElevated ? 1.05 : 1,
                        opacity: isDimmed ? 0.28 : 1,
                        filter: isDimmed ? 'saturate(0.3)' : 'saturate(1)',
                      }}
                      transition={{
                        layout: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] },
                        scale: { duration: 0.35, ease: 'easeOut' },
                        opacity: { duration: 0.5, ease: 'easeInOut' },
                        filter: { duration: 0.5, ease: 'easeInOut' },
                      }}
                      className={`rounded-lg p-3 border relative ${
                        isDark
                          ? 'bg-white/[0.03] border-white/[0.06] hover:border-white/[0.12]'
                          : 'bg-white border-gray-100 hover:border-gray-200 shadow-sm'
                      } transition-colors`}
                      style={{
                        zIndex: isDragging ? 10 : 0,
                        ...(isElevated ? {
                          boxShadow: `0 8px 24px rgba(0,0,0,0.25), 0 0 0 1.5px ${deptColor}50`,
                        } : {}),
                        ...(isDropped ? {
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        } : {}),
                        ...(isHighlighted && anyActive ? {
                          boxShadow: `0 0 0 1.5px ${deptColor}60`,
                        } : {}),
                      }}
                    >
                      <p className={`text-[12px] font-medium mb-2 leading-snug ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                        {item.label}
                      </p>
                      {item.tag && (
                        <span
                          className="text-[9px] font-bold px-1.5 py-0.5 rounded mb-2 inline-block"
                          style={{ backgroundColor: `${item.tagColor}20`, color: item.tagColor }}
                        >
                          {item.tag}
                        </span>
                      )}
                      <div className="flex items-center gap-1.5 mt-1">
                        {ownerIdx >= 0 && avatarPool[ownerIdx] && (
                          <div
                            className="w-6 h-6 rounded-full overflow-hidden ring-1 ring-white/10 flex-shrink-0"
                            style={{ backgroundColor: avatarPool[ownerIdx].color }}
                          >
                            <img src={avatarPool[ownerIdx].image} alt="" className="w-full h-full object-cover" loading="lazy" />
                          </div>
                        )}
                        {agentIdx >= 0 && (
                          <div
                            className="w-6 h-6 rounded-md overflow-hidden flex-shrink-0"
                            style={{ backgroundColor: agents[agentIdx].bgColor }}
                          >
                            <img src={agents[agentIdx].img} alt="" className="w-full h-full object-contain object-bottom" loading="lazy" />
                          </div>
                        )}
                        {item.priority && (
                          <span className={`ml-auto text-[9px] font-semibold ${
                            item.priority === 'high'
                              ? 'text-red-400'
                              : item.priority === 'medium'
                                ? 'text-amber-400'
                                : 'text-gray-500'
                          }`}>
                            {item.priority === 'high' ? '!!!' : item.priority === 'medium' ? '!!' : '!'}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
                {showPlaceholder && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-lg p-3 border-2 border-dashed"
                    style={{
                      borderColor: `${deptColor}25`,
                      backgroundColor: `${deptColor}05`,
                      minHeight: '60px',
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </LayoutGroup>
  );
}

/* ─── Board surface: Live Workflow ─── */

function WorkflowBoard({
  items,
  agents,
  deptColor,
  isDark,
  avatarPool,
  deptId,
}: {
  items: BoardItem[];
  agents: AgentInfo[];
  deptColor: string;
  isDark: boolean;
  avatarPool: { image: string; color: string }[];
  deptId: string;
}) {
  const [activeIdx, setActiveIdx] = useState(0);
  const taskItems = items.filter((it) => it.agentWorking || it.hasAvatar).slice(0, 4);

  useEffect(() => { setActiveIdx(0); }, [deptId]);
  useEffect(() => {
    if (taskItems.length === 0) return;
    const id = setInterval(() => setActiveIdx((p) => (p + 1) % taskItems.length), 4000);
    return () => clearInterval(id);
  }, [taskItems.length, deptId]);

  const item = taskItems[activeIdx] || items[0];
  if (!item) return null;

  const agentIdx = item.agentWorking ? Math.abs(item.id.charCodeAt(item.id.length - 1)) % agents.length : 0;
  const ownerIdx = avatarPool.length > 0
    ? Math.abs(item.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % avatarPool.length : -1;

  const stages = [
    { label: 'Assigned', icon: '📋', done: item.columnIndex >= 0 },
    { label: 'Agent picks up', icon: '🤖', done: item.columnIndex >= 1 },
    { label: 'Working', icon: '⚙️', done: item.columnIndex >= 1, active: item.columnIndex === 1 },
    { label: 'Review', icon: '👀', done: item.columnIndex >= 2, active: item.columnIndex === 2 },
    { label: 'Done', icon: '✓', done: item.columnIndex >= 3 },
  ];

  return (
    <div className="flex-1 p-6 flex flex-col justify-center min-w-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${deptId}-${item.id}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Task name + participants */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {ownerIdx >= 0 && avatarPool[ownerIdx] && (
                <div
                  className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-white/10"
                  style={{ backgroundColor: avatarPool[ownerIdx].color }}
                >
                  <img src={avatarPool[ownerIdx].image} alt="" className="w-full h-full object-cover" loading="lazy" />
                </div>
              )}
              <span className={`text-lg ${isDark ? 'text-gray-500' : 'text-gray-300'}`}>→</span>
              {agents[agentIdx] && (
                <div
                  className="w-9 h-9 rounded-lg overflow-hidden ring-2"
                  style={{ backgroundColor: agents[agentIdx].bgColor, borderColor: `${agents[agentIdx].bgColor}60` }}
                >
                  <img src={agents[agentIdx].img} alt="" className="w-full h-full object-contain object-bottom" loading="lazy" />
                </div>
              )}
            </div>
            <div className="ml-2 min-w-0">
              <p className={`text-[15px] font-semibold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.label}</p>
              {agents[agentIdx] && (
                <p className={`text-[11px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  {agents[agentIdx].label} · {agents[agentIdx].status}
                </p>
              )}
            </div>
          </div>

          {/* Flow stages */}
          <div className="flex items-center gap-0">
            {stages.map((s, i) => (
              <div key={i} className="flex items-center flex-1 min-w-0">
                <motion.div
                  animate={s.active ? { scale: [1, 1.08, 1] } : {}}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className={`flex flex-col items-center gap-1.5 flex-shrink-0 ${s.active ? 'z-10' : ''}`}
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm border-2 transition-colors ${
                      s.done
                        ? 'border-transparent'
                        : isDark
                          ? 'border-white/10 bg-white/[0.03]'
                          : 'border-gray-200 bg-gray-50'
                    }`}
                    style={s.done ? {
                      backgroundColor: s.active ? deptColor : `${deptColor}20`,
                      color: s.active ? 'white' : deptColor,
                    } : undefined}
                  >
                    {s.done && !s.active ? '✓' : s.icon}
                  </div>
                  <span className={`text-[9px] font-medium text-center leading-tight ${
                    s.active
                      ? 'font-bold'
                      : ''
                  } ${isDark ? (s.done ? 'text-gray-300' : 'text-gray-600') : (s.done ? 'text-gray-700' : 'text-gray-400')}`}>
                    {s.label}
                  </span>
                </motion.div>
                {i < stages.length - 1 && (
                  <div className="flex-1 mx-1">
                    <div
                      className="h-0.5 rounded-full"
                      style={{
                        backgroundColor: stages[i + 1].done
                          ? deptColor
                          : isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex justify-between mb-1.5">
              <span className={`text-[10px] font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Progress</span>
              <span className="text-[10px] font-bold" style={{ color: deptColor }}>
                {PROGRESS_BY_COL[item.columnIndex]}%
              </span>
            </div>
            <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-white/[0.06]' : 'bg-gray-100'}`}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${PROGRESS_BY_COL[item.columnIndex]}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ backgroundColor: deptColor }}
              />
            </div>
          </div>

          {/* Task counter */}
          <div className="flex items-center gap-2">
            {taskItems.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === activeIdx ? 'w-4' : 'opacity-30'}`}
                style={{ backgroundColor: deptColor }}
              />
            ))}
            <span className={`text-[10px] ml-auto ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
              {activeIdx + 1} / {taskItems.length}
            </span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ─── Board surface: Focused Story Card ─── */

function FocusedBoard({
  items,
  agents,
  deptColor,
  isDark,
  avatarPool,
  deptId,
}: {
  items: BoardItem[];
  agents: AgentInfo[];
  deptColor: string;
  isDark: boolean;
  avatarPool: { image: string; color: string }[];
  deptId: string;
}) {
  const [activeIdx, setActiveIdx] = useState(0);
  useEffect(() => { setActiveIdx(0); }, [deptId]);
  useEffect(() => {
    const id = setInterval(() => setActiveIdx((p) => (p + 1) % Math.min(items.length, 5)), 5000);
    return () => clearInterval(id);
  }, [items.length, deptId]);

  const item = items[activeIdx];
  if (!item) return null;

  const status = STATUS_CONFIG[item.columnIndex] || STATUS_CONFIG[0];
  const progress = PROGRESS_BY_COL[item.columnIndex] || 0;
  const agentIdx = item.agentWorking ? Math.abs(item.id.charCodeAt(item.id.length - 1)) % agents.length : -1;
  const ownerIdx = item.hasAvatar && avatarPool.length > 0
    ? Math.abs(item.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % avatarPool.length : -1;

  return (
    <div className="flex-1 p-6 flex flex-col justify-center min-w-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${deptId}-${item.id}`}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.35 }}
          className={`rounded-xl border p-5 ${
            isDark ? 'bg-white/[0.02] border-white/[0.08]' : 'bg-gray-50/50 border-gray-200'
          }`}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className={`text-[17px] font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.label}</p>
              {item.tag && (
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: `${item.tagColor}20`, color: item.tagColor }}
                >
                  {item.tag}
                </span>
              )}
            </div>
            <span
              className="text-[11px] font-bold px-3 py-1 rounded-full"
              style={{ color: status.color, backgroundColor: status.bg }}
            >
              {status.label}
            </span>
          </div>

          {/* Who's working */}
          <div className={`flex items-center gap-4 mb-5 p-3 rounded-lg ${isDark ? 'bg-white/[0.03]' : 'bg-white'}`}>
            {ownerIdx >= 0 && avatarPool[ownerIdx] && (
              <div className="flex items-center gap-2">
                <div
                  className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/10"
                  style={{ backgroundColor: avatarPool[ownerIdx].color }}
                >
                  <img src={avatarPool[ownerIdx].image} alt="" className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div>
                  <p className={`text-[11px] font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Owner</p>
                  <p className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Human</p>
                </div>
              </div>
            )}
            {ownerIdx >= 0 && agentIdx >= 0 && (
              <div className={`text-lg ${isDark ? 'text-gray-600' : 'text-gray-300'}`}>+</div>
            )}
            {agentIdx >= 0 && agents[agentIdx] && (
              <div className="flex items-center gap-2">
                <div
                  className="w-10 h-10 rounded-lg overflow-hidden"
                  style={{ backgroundColor: agents[agentIdx].bgColor }}
                >
                  <img src={agents[agentIdx].img} alt="" className="w-full h-full object-contain object-bottom" loading="lazy" />
                </div>
                <div>
                  <p className={`text-[11px] font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{agents[agentIdx].label}</p>
                  <p className={`text-[10px] ${isDark ? 'text-emerald-400/70' : 'text-emerald-600'}`}>
                    {agents[agentIdx].status}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Progress */}
          <div className="mb-3">
            <div className="flex justify-between mb-1.5">
              <span className={`text-[11px] font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Overall progress</span>
              <span className="text-[12px] font-bold" style={{ color: deptColor }}>{progress}%</span>
            </div>
            <div className={`h-2.5 rounded-full overflow-hidden ${isDark ? 'bg-white/[0.06]' : 'bg-gray-100'}`}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ backgroundColor: deptColor }}
              />
            </div>
          </div>

          {/* Priority */}
          {item.priority && (
            <div className="flex items-center gap-2">
              <span className={`text-[10px] ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>Priority:</span>
              <span className={`text-[10px] font-bold ${
                item.priority === 'high' ? 'text-red-400' : item.priority === 'medium' ? 'text-amber-400' : 'text-gray-500'
              }`}>
                {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
              </span>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Dots navigation */}
      <div className="flex items-center justify-center gap-1.5 mt-4">
        {items.slice(0, 5).map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIdx(i)}
            className={`h-1.5 rounded-full transition-all ${i === activeIdx ? 'w-5' : 'w-1.5 opacity-30'}`}
            style={{ backgroundColor: deptColor }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Board surface: Minimal List ─── */

function MinimalBoard({
  items,
  agents,
  deptColor,
  isDark,
  avatarPool,
}: {
  items: BoardItem[];
  agents: AgentInfo[];
  deptColor: string;
  isDark: boolean;
  avatarPool: { image: string; color: string }[];
}) {
  return (
    <div className="flex-1 p-5 min-w-0">
      <AnimatePresence>
        {items.slice(0, 5).map((item, idx) => {
          const status = STATUS_CONFIG[item.columnIndex] || STATUS_CONFIG[0];
          const agentIdx = item.agentWorking ? Math.abs(item.id.charCodeAt(item.id.length - 1)) % agents.length : -1;
          const ownerIdx = item.hasAvatar && avatarPool.length > 0
            ? Math.abs(item.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % avatarPool.length : -1;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.06, duration: 0.25 }}
              className={`flex items-center gap-4 py-3.5 ${
                idx < 4 ? `border-b ${isDark ? 'border-white/[0.04]' : 'border-gray-100'}` : ''
              }`}
            >
              {/* Task name */}
              <p className={`text-[14px] font-medium flex-1 min-w-0 truncate ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                {item.label}
              </p>

              {/* Avatars pair */}
              <div className="flex items-center -space-x-2 flex-shrink-0">
                {ownerIdx >= 0 && avatarPool[ownerIdx] && (
                  <div
                    className="w-8 h-8 rounded-full overflow-hidden ring-2 z-10"
                    style={{ backgroundColor: avatarPool[ownerIdx].color, borderColor: isDark ? '#141414' : '#fff' }}
                  >
                    <img src={avatarPool[ownerIdx].image} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </div>
                )}
                {agentIdx >= 0 && agents[agentIdx] && (
                  <div
                    className="w-8 h-8 rounded-lg overflow-hidden ring-2"
                    style={{ backgroundColor: agents[agentIdx].bgColor, borderColor: isDark ? '#141414' : '#fff' }}
                  >
                    <img src={agents[agentIdx].img} alt="" className="w-full h-full object-contain object-bottom" loading="lazy" />
                  </div>
                )}
              </div>

              {/* Status */}
              <span
                className="text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0"
                style={{ color: status.color, backgroundColor: status.bg }}
              >
                {status.label}
              </span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

/* ─── Light-up sync hook ─── */

function useLightUpSync(boardItems: BoardItem[], agents: AgentInfo[], deptId: string, paused = false) {
  const agentWorkingItems = useMemo(
    () => boardItems.filter((item) => item.agentWorking),
    [boardItems],
  );

  const [tick, setTick] = useState(0);

  useEffect(() => { setTick(0); }, [deptId]);

  useEffect(() => {
    if (agentWorkingItems.length === 0 || paused) return;
    const id = setInterval(() => setTick((t) => t + 1), 9000);
    return () => clearInterval(id);
  }, [agentWorkingItems.length, deptId, paused]);

  const totalSlots = agents.length + 1; // agents + human
  const slotA = tick % totalSlots;
  const slotB = (tick + Math.max(1, Math.floor(totalSlots / 2))) % totalSlots;

  const litAgentIndices = useMemo(() => {
    const indices = new Set<number>();
    if (slotA < agents.length) indices.add(slotA);
    if (slotB < agents.length) indices.add(slotB);
    return indices;
  }, [slotA, slotB, agents.length]);

  const humanActive = slotA >= agents.length || slotB >= agents.length;

  const highlightedTaskIds = useMemo(() => {
    const ids = new Set<string>();
    agentWorkingItems.forEach((item) => {
      const agentIdx = Math.abs(item.id.charCodeAt(item.id.length - 1)) % agents.length;
      if (litAgentIndices.has(agentIdx)) ids.add(item.id);
    });
    return ids;
  }, [agentWorkingItems, litAgentIndices, agents.length]);

  return { highlightedTaskIds, litAgentIndices, humanActive };
}

/* ─── Kanban drag animation ─── */

type DragPhase = 'idle' | 'approaching' | 'lifting' | 'moving' | 'dropped';

interface DragEvent {
  itemId: string;
  fromCol: number;
  toCol: number;
  agentIdx: number;
  isHuman: boolean;
  phase: DragPhase;
}

// Column X positions — tuned so human cursor touches card during drag (e.g. Landing page QA)
const KANBAN_COL_X = [18, 42, 58, 74];

function useDragAnimation(
  litAgentIndices: Set<number>,
  humanActive: boolean,
  boardItems: BoardItem[],
  agents: AgentInfo[],
  deptId: string,
  boardStyle: string,
) {
  const [dragEvent, setDragEvent] = useState<DragEvent | null>(null);
  const [columnOverrides, setColumnOverrides] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    setColumnOverrides(new Map());
    setDragEvent(null);
  }, [deptId]);

  const boardItemsRef = useRef(boardItems);
  boardItemsRef.current = boardItems;
  const agentsRef = useRef(agents);
  agentsRef.current = agents;
  const columnOverridesRef = useRef(columnOverrides);
  columnOverridesRef.current = columnOverrides;

  const litKey = `${Array.from(litAgentIndices).join(',')}-${humanActive}`;

  useEffect(() => {
    if (boardStyle !== 'kanban') { setDragEvent(null); return; }

    const currentItems = boardItemsRef.current;
    const currentAgents = agentsRef.current;
    const overrides = columnOverridesRef.current;
    const litAgents = Array.from(litAgentIndices);

    const getCol = (item: BoardItem) => overrides.get(item.id) ?? item.columnIndex;

    let targetItem: BoardItem | null = null;
    let isHuman = false;
    let agentIdx = -1;

    if (humanActive) {
      const reviewItems = currentItems.filter(it => getCol(it) === 2);
      targetItem = reviewItems.find(it => it.hasAvatar) ?? reviewItems[0] ?? null;
      isHuman = true;
    }

    if (!targetItem && litAgents.length > 0) {
      const primaryAgent = litAgents[0];
      const candidates = currentItems.filter(it => {
        if (!it.agentWorking) return false;
        const idx = Math.abs(it.id.charCodeAt(it.id.length - 1)) % currentAgents.length;
        return idx === primaryAgent && getCol(it) < 3;
      });
      targetItem = candidates.find(it => getCol(it) < 2) ?? candidates[0] ?? null;
      agentIdx = primaryAgent;
      isHuman = false;
    }

    if (!targetItem) { setDragEvent(null); return; }

    const fromCol = getCol(targetItem);
    const toCol = Math.min(fromCol + 1, 3);
    if (fromCol >= 3) { setDragEvent(null); return; }

    const itemId = targetItem.id;
    setDragEvent({ itemId, fromCol, toCol, agentIdx, isHuman, phase: 'idle' });

    const timers = [
      setTimeout(() => setDragEvent(prev => prev?.itemId === itemId ? { ...prev, phase: 'approaching' } : prev), 2500),
      setTimeout(() => setDragEvent(prev => prev?.itemId === itemId ? { ...prev, phase: 'lifting' } : prev), 3500),
      setTimeout(() => setDragEvent(prev => prev?.itemId === itemId ? { ...prev, phase: 'moving' } : prev), 4500),
      setTimeout(() => {
        setDragEvent(prev => prev?.itemId === itemId ? { ...prev, phase: 'dropped' } : prev);
        setColumnOverrides(prev => new Map(prev).set(itemId, toCol));
      }, 6500),
    ];

    return () => timers.forEach(clearTimeout);
  }, [litKey, boardStyle, deptId]);

  return { dragEvent, columnOverrides };
}

/* ─── Marketing scripted story ─── */

interface StoryScene {
  isIntro?: boolean;
  litAgentIndices: number[];
  humanActive: boolean;
  humanMessage?: string;
  agentMessages?: Record<number, string>;
  drag?: { itemId: string; toCol: number; isHuman: boolean };
  duration?: number;
  /** Delay (ms) before starting drag — used for Scene 1 so human speaks first */
  dragStartDelay?: number;
}

const SCENE_DURATION_DEFAULT = 12000;

const MARKETING_SCENES: StoryScene[] = [
  // Scene 0 — Intro: face-to-face conversation
  {
    isIntro: true,
    litAgentIndices: [0],
    humanActive: true,
    humanMessage: 'I need to launch a Q4 campaign for our new product — can you set up everything?',
    agentMessages: { 0: 'Setting up your campaign board — brief, creatives, ad copy, landing page, and performance tracking.' },
    duration: 13000,
  },
  // Scene 1 — Board: human kicks off, agent starts working (human types first, then agent drags)
  {
    litAgentIndices: [0],
    humanActive: true,
    humanMessage: 'Let\'s kick off with the campaign brief',
    agentMessages: { 0: 'On it — pulling target audience data and brand assets' },
    drag: { itemId: 'mk1', toCol: 1, isHuman: false },
    dragStartDelay: 4500,
  },
  // Scene 2 — Board: Assets Generator creates variants
  {
    litAgentIndices: [0, 1],
    humanActive: false,
    agentMessages: { 0: 'Creating 3 visual variants based on brand guidelines...' },
    drag: { itemId: 'mk2', toCol: 2, isHuman: false },
  },
  // Scene 3 — Board: Vendor Researcher + Campaign Optimizer
  {
    litAgentIndices: [1, 2],
    humanActive: false,
    agentMessages: {
      1: 'Analyzing top-performing channels for Q4...',
      2: 'Cross-referencing with budget and timeline',
    },
    drag: { itemId: 'mk3', toCol: 2, isHuman: false },
  },
  // Scene 4 — Board: Human reviews and approves → drags to Done
  {
    litAgentIndices: [2],
    humanActive: true,
    humanMessage: 'Reviewing the landing page — approved, ship it',
    drag: { itemId: 'mk4', toCol: 3, isHuman: true },
  },
  // Scene 5 — Board: Agents continue autonomously
  {
    litAgentIndices: [0, 2],
    humanActive: false,
    agentMessages: { 2: 'All 4 campaigns live — KPIs are green' },
    drag: { itemId: 'mk7', toCol: 1, isHuman: false },
  },
];

function useMarketingStory(
  boardItems: BoardItem[],
  agents: AgentInfo[],
  deptId: string,
  boardStyle: string,
  paused = false,
) {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [dragEvent, setDragEvent] = useState<DragEvent | null>(null);
  const [columnOverrides, setColumnOverrides] = useState<Map<string, number>>(new Map());

  const isActive = deptId === 'marketing' && boardStyle === 'kanban';

  useEffect(() => {
    setSceneIndex(0);
    setColumnOverrides(new Map());
    setDragEvent(null);
  }, [deptId]);

  // Scene timer — starts as soon as isActive, independent of paused/IntersectionObserver.
  useEffect(() => {
    if (!isActive) return;
    const scene = MARKETING_SCENES[sceneIndex];
    const dur = scene.duration ?? SCENE_DURATION_DEFAULT;
    const id = setTimeout(() => {
      setSceneIndex(prev => {
        const next = (prev + 1) % MARKETING_SCENES.length;
        if (next === 0) setColumnOverrides(new Map());
        return next;
      });
    }, dur);
    return () => clearTimeout(id);
  }, [isActive, deptId, sceneIndex]);

  const scene = MARKETING_SCENES[sceneIndex];

  const litAgentIndices = useMemo(
    () => new Set(scene.litAgentIndices),
    [sceneIndex],
  );

  const highlightedTaskIds = useMemo(() => {
    const ids = new Set<string>();
    if (scene.drag) ids.add(scene.drag.itemId);
    return ids;
  }, [sceneIndex]);

  const boardItemsRef = useRef(boardItems);
  boardItemsRef.current = boardItems;
  const columnOverridesRef = useRef(columnOverrides);
  columnOverridesRef.current = columnOverrides;

  // Scene 1 phased display: 0=human typing, 1=human message, 2=agent drag
  const [storyPhase, setStoryPhase] = useState(0);
  useEffect(() => {
    if (!isActive || sceneIndex !== 1) { setStoryPhase(2); return; }
    setStoryPhase(0);
    const t1 = setTimeout(() => setStoryPhase(1), 2500);
    const t2 = setTimeout(() => setStoryPhase(2), 4500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [isActive, sceneIndex]);

  useEffect(() => {
    if (!isActive) { setDragEvent(null); return; }

    const drag = scene.drag;
    if (!drag) { setDragEvent(null); return; }

    const delay = scene.dragStartDelay ?? 0;

    const startId = setTimeout(() => {
      const overrides = columnOverridesRef.current;
      const item = boardItemsRef.current.find(it => it.id === drag.itemId);
      if (!item) { setDragEvent(null); return; }

      const fromCol = overrides.get(item.id) ?? item.columnIndex;
      const toCol = drag.toCol;
      if (fromCol === toCol || fromCol > toCol) { setDragEvent(null); return; }

      const dragAgentIdx = drag.isHuman ? -1 : scene.litAgentIndices[0];

      setDragEvent({
        itemId: drag.itemId,
        fromCol,
        toCol,
        agentIdx: dragAgentIdx,
        isHuman: drag.isHuman,
        phase: 'idle',
      });

      const timers = [
        setTimeout(() => setDragEvent(prev => prev?.itemId === drag.itemId ? { ...prev, phase: 'approaching' } : prev), 3500),
        setTimeout(() => setDragEvent(prev => prev?.itemId === drag.itemId ? { ...prev, phase: 'lifting' } : prev), 4800),
        setTimeout(() => setDragEvent(prev => prev?.itemId === drag.itemId ? { ...prev, phase: 'moving' } : prev), 5800),
        setTimeout(() => {
          setDragEvent(prev => prev?.itemId === drag.itemId ? { ...prev, phase: 'dropped' } : prev);
          setColumnOverrides(prev => new Map(prev).set(drag.itemId, toCol));
        }, 7500),
      ];

      return () => timers.forEach(clearTimeout);
    }, delay);

    if (delay > 0) setDragEvent(null);

    return () => clearTimeout(startId);
  }, [sceneIndex, isActive, deptId]);

  return {
    litAgentIndices,
    humanActive: scene.humanActive,
    highlightedTaskIds,
    dragEvent,
    columnOverrides,
    humanMessage: scene.humanMessage,
    agentMessages: scene.agentMessages,
    isIntro: !!scene.isIntro,
    isActive,
    storyPhase,
  };
}

/* ─── Trust Bar ─── */

function TrustBar({ isRoster }: { isRoster: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scrollRatio, setScrollRatio] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const windowH = window.innerHeight;
      const triggerZone = windowH * 0.35;
      const progress = Math.max(0, Math.min(1, (windowH - rect.top) / triggerZone));
      setScrollRatio(progress);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const logos = [
    {
      id: 'holt',
      node: (
        <span className="flex items-center gap-1.5 font-black tracking-tight text-[13px]" style={{ fontFamily: 'Arial Black, Arial, sans-serif' }}>
          <span className={`inline-flex items-center justify-center w-[19px] h-[19px] rounded-[2px] text-[7px] font-black shrink-0 ${isRoster ? 'bg-gray-800 text-gray-500' : 'bg-gray-400 text-gray-600'}`}>CAT</span>
          HOLT
        </span>
      ),
    },
    {
      id: 'universal',
      node: (
        <span className="flex flex-col items-center leading-none">
          <span className="font-serif italic text-[12px] tracking-widest uppercase font-bold">Universal</span>
          <span className="font-sans text-[7px] tracking-[0.15em] uppercase mt-0.5 opacity-60">Music Group</span>
        </span>
      ),
    },
    {
      id: 'cocacola',
      node: (
        <span className="italic text-[18px] font-black" style={{ fontFamily: 'Georgia, Times New Roman, serif', letterSpacing: '-0.02em' }}>
          Coca‑Cola
        </span>
      ),
    },
    {
      id: 'lionsgate',
      node: (
        <span className="font-bold tracking-[0.14em] text-[12px] uppercase" style={{ fontFamily: 'Arial Narrow, Arial, sans-serif' }}>
          Lionsgate
        </span>
      ),
    },
    {
      id: 'carrefour',
      node: (
        <span className="font-bold text-[13px]" style={{ fontFamily: 'Arial, sans-serif' }}>
          Carrefour
        </span>
      ),
    },
    {
      id: 'bd',
      node: (
        <span className="font-bold text-[13px] tracking-wide" style={{ fontFamily: 'Arial, sans-serif' }}>
          BD
        </span>
      ),
    },
    {
      id: 'glossier',
      node: (
        <span className="font-bold text-[14px] tracking-[0.04em]" style={{ fontFamily: 'Georgia, serif' }}>
          Glossier.
        </span>
      ),
    },
  ];

  return (
    <div
      ref={ref}
      className={`flex flex-col items-center gap-5 py-8 border-t border-b transition-opacity duration-300 ${
        isRoster ? 'border-white/[0.07]' : 'border-gray-100 dark:border-white/[0.07]'
      }`}
      style={{ opacity: 0.06 + scrollRatio * 0.94 }}
    >
      <p className={`text-[10px] font-normal tracking-wide ${isRoster ? 'text-gray-600' : 'text-gray-500'}`}>
        Trusted by over 60% of the Fortune 500
      </p>
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 sm:gap-x-12">
        {logos.map((logo) => (
          <div
            key={logo.id}
            className={`transition-colors duration-200 ${isRoster ? 'text-gray-600 hover:text-gray-400' : 'text-gray-500 hover:text-gray-300'}`}
          >
            {logo.node}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main component ─── */

export function WorkManagementFirstFold({ settings: externalSettings, hideHero, hideDemo }: { settings?: SiteSettings; hideHero?: boolean; hideDemo?: boolean } = {}) {
  const [selectedDeptIndex, setSelectedDeptIndex] = useState(0);
  const [selectedJtbd, setSelectedJtbd] = useState(0);
  const { departments: supabaseDepts } = useDepartments();
  const { settings: ownSettings } = useSiteSettings();
  const siteSettings = externalSettings ?? ownSettings;

  const sectionRef = useRef<HTMLElement>(null);
  const demoRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const hasTriggered = useRef(false);

  useEffect(() => {
    const el = demoRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggered.current) {
          hasTriggered.current = true;
          setIsAnimating(true);
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const animationPaused = !isAnimating;

  const avatarOverrides = siteSettings?.wm_dept_avatar_overrides ?? {};
  const colorOverrides = siteSettings?.wm_dept_color_overrides ?? {};
  const memberAvatarOverrides = siteSettings?.wm_member_avatar_overrides ?? {};
  const deptOrderSetting = siteSettings?.wm_dept_order ?? [];
  const isDark = siteSettings?.wm_dark_mode ?? false;
  const firstFoldVariant = siteSettings?.wm_first_fold_variant ?? 'default';
  const boardStyle = siteSettings?.wm_board_style ?? 'default';
  const cardLayout = siteSettings?.wm_card_layout ?? 'default';

  const orderedDepts = useMemo(() => {
    if (deptOrderSetting.length === 0) return DEPARTMENTS;
    const ordered = deptOrderSetting.map(id => DEPARTMENTS.find(d => d.id === id)).filter(Boolean) as typeof DEPARTMENTS;
    const missing = DEPARTMENTS.filter(d => !deptOrderSetting.includes(d.id));
    return [...ordered, ...missing];
  }, [deptOrderSetting]);

  const orderedSquadDepts = useMemo(() => {
    if (deptOrderSetting.length === 0) return SQUAD_DEPARTMENTS;
    const ordered = deptOrderSetting.map(id => SQUAD_DEPARTMENTS.find(d => d.id === id)).filter(Boolean) as typeof SQUAD_DEPARTMENTS;
    const missing = SQUAD_DEPARTMENTS.filter(d => !deptOrderSetting.includes(d.id));
    return [...ordered, ...missing];
  }, [deptOrderSetting]);

  const avatarMap = useMemo(() => {
    const map: Record<string, { image: string; color: string }> = {};
    for (const sd of supabaseDepts) {
      const entry = { image: sd.avatar_image || '', color: sd.avatar_color || '#94a3b8' };
      if (sd.name) map[sd.name] = entry;
      if (sd.title) {
        map[sd.title] = entry;
        map[sd.title.toLowerCase()] = entry;
      }
    }
    return map;
  }, [supabaseDepts]);

  const avatarPool = useMemo(() => {
    return supabaseDepts
      .filter((sd) => sd.avatar_image)
      .map((sd) => ({ image: sd.avatar_image, color: sd.avatar_color || '#94a3b8' }));
  }, [supabaseDepts]);

  const dept = orderedDepts[selectedDeptIndex];
  const boardItems = dept.boardItems;
  const avatar = avatarMap[dept.supabaseKey] || avatarMap[dept.name.toLowerCase()] || avatarMap[dept.id];
  const avatarColor = colorOverrides[dept.id] || dept.color;

  const LOCAL_AVATAR_DEFAULTS: Record<string, string> = {
    product: '/avatars/product-lead.png',
  };

  const getCenterImageForIndex = useCallback((deptIndex: number): string | undefined => {
    const d = orderedDepts[deptIndex];
    if (!d) return undefined;
    if (avatarOverrides[d.id]) return avatarOverrides[d.id];
    if (LOCAL_AVATAR_DEFAULTS[d.id]) return LOCAL_AVATAR_DEFAULTS[d.id];
    if (avatarPool.length < 2) return undefined;
    const offset = Math.floor(avatarPool.length / 2) + 2;
    return avatarPool[(deptIndex + offset) % avatarPool.length]?.image;
  }, [orderedDepts, avatarOverrides, avatarPool]);

  const getCenterBgColorForIndex = useCallback((deptIndex: number): string => {
    const d = orderedDepts[deptIndex];
    if (!d) return '#e5e7eb';
    return colorOverrides[d.id] || d.color;
  }, [orderedDepts, colorOverrides]);

  const centerAvatarImage = useMemo(() => {
    return getCenterImageForIndex(selectedDeptIndex) || avatar?.image;
  }, [getCenterImageForIndex, selectedDeptIndex, avatar?.image]);

  const centerBgColor = useMemo(() => {
    return getCenterBgColorForIndex(selectedDeptIndex);
  }, [getCenterBgColorForIndex, selectedDeptIndex]);

  const sideAvatarPool = useMemo(() => {
    if (!centerAvatarImage) return avatarPool;
    return avatarPool.filter(a => a.image !== centerAvatarImage);
  }, [avatarPool, centerAvatarImage]);

  const genericSync = useLightUpSync(boardItems, dept.agents, dept.id, animationPaused);
  const story = useMarketingStory(boardItems, dept.agents, dept.id, boardStyle, animationPaused);

  const litAgentIndices = story.isActive ? story.litAgentIndices : genericSync.litAgentIndices;
  const humanActive = story.isActive ? story.humanActive : genericSync.humanActive;
  const highlightedTaskIds = story.isActive ? story.highlightedTaskIds : genericSync.highlightedTaskIds;
  const storyHumanMessage = story.isActive ? story.humanMessage : undefined;
  const storyAgentMessages = story.isActive ? story.agentMessages : undefined;
  const storyIsIntro = story.isActive && story.isIntro;
  const storyPhase = story.storyPhase ?? 2; // 0=human typing, 1=human message, 2=agent drag

  const litAgents = useMemo(() => Array.from(litAgentIndices), [litAgentIndices]);
  const anyActive = litAgentIndices.size > 0 || humanActive;

  const [litMemberIndex, setLitMemberIndex] = useState(2);
  const [isShowAllPhase, setIsShowAllPhase] = useState(true);

  const splitChatEnabled = siteSettings?.wm_squad_split_chat ?? false;
  const rosterLayout = siteSettings?.wm_roster_layout ?? 'mirrored';
  const [splitPhase, setSplitPhase] = useState<'together' | 'chatting'>('together');

  const handleSplitChatComplete = useCallback(() => {
    setTimeout(() => setSplitPhase('together'), 1600);
  }, []);

  const handleDeptChange = useCallback((index: number) => {
    setSelectedDeptIndex(index);
    setSelectedJtbd(0);
    const members = orderedSquadDepts[index]?.members ?? [];
    setLitMemberIndex(members.length > 0 ? Math.floor(members.length / 2) : 2);
    setIsShowAllPhase(true);
    setSplitPhase('together');
  }, []);

  useEffect(() => {
    const members = orderedSquadDepts[selectedDeptIndex]?.members ?? [];
    setLitMemberIndex(members.length > 0 ? Math.floor(members.length / 2) : 2);
    setIsShowAllPhase(true);
  }, [dept.id]);

  useEffect(() => {
    if (!isShowAllPhase) return;
    const id = setTimeout(() => {
      const members = orderedSquadDepts[selectedDeptIndex]?.members ?? [];
      setLitMemberIndex(members.length > 0 ? Math.floor(members.length / 2) : 2);
      setIsShowAllPhase(false);
    }, 3000);
    return () => clearTimeout(id);
  }, [isShowAllPhase, dept.id, selectedDeptIndex]);

  useEffect(() => {
    const id = setInterval(() => {
      setSelectedJtbd((prev) => (prev + 1) % dept.jtbd.length);
    }, 5000);
    return () => clearInterval(id);
  }, [dept.jtbd.length, selectedDeptIndex]);

  useEffect(() => {
    const members = orderedSquadDepts[selectedDeptIndex]?.members ?? [];
    if (members.length === 0 || isShowAllPhase) return;
    const id = setInterval(() => {
      setLitMemberIndex((prev) => {
        const next = (prev + 1) % members.length;
        if (next === 0 && prev === members.length - 1) {
          setIsShowAllPhase(true);
        }
        return next;
      });
    }, 2600);
    return () => clearInterval(id);
  }, [selectedDeptIndex, dept.id, isShowAllPhase]);

  // Split & chat animation — skip 'splitting', morph directly to roster
  useEffect(() => {
    if (!splitChatEnabled) { setSplitPhase('together'); return; }
    setSplitPhase('together');
    const timer = setTimeout(() => setSplitPhase('chatting'), 4000);
    return () => clearTimeout(timer);
  }, [splitChatEnabled, selectedDeptIndex]);

  const squadMembers = orderedSquadDepts[selectedDeptIndex]?.members ?? [];
  const squadHumans = useMemo(() => squadMembers.filter(m => !m.isAgent), [squadMembers]);
  const squadAgents = useMemo(() => squadMembers.filter(m => m.isAgent), [squadMembers]);

  const { posA, posB } = useFloatingCursors(boardItems, dept.id, animationPaused);
  const humanCursor = useHumanCursor(dept.id, animationPaused);

  const genericDrag = useDragAnimation(
    litAgentIndices, humanActive, boardItems, dept.agents, dept.id, boardStyle,
  );

  const dragEvent = story.isActive ? story.dragEvent : genericDrag.dragEvent;
  const columnOverrides = story.isActive ? story.columnOverrides : genericDrag.columnOverrides;

  const dragCursorOverride = useMemo(() => {
    if (!dragEvent || boardStyle !== 'kanban' || dragEvent.phase === 'idle') return null;

    const getCardY = (colIdx: number) => {
      const currentOverrides = story.isActive ? story.columnOverrides : genericDrag.columnOverrides;
      const items = boardItems.map(it => ({
        ...it,
        columnIndex: currentOverrides.get(it.id) ?? it.columnIndex,
      }));
      const colItems = items.filter(it => it.columnIndex === colIdx);
      const cardPos = colItems.findIndex(it => it.id === dragEvent.itemId);
      const idx = Math.max(0, cardPos);
      return Math.min(20 + idx * 15, 65);
    };

    if (dragEvent.phase === 'approaching' || dragEvent.phase === 'lifting') {
      return { x: KANBAN_COL_X[dragEvent.fromCol], y: getCardY(dragEvent.fromCol) };
    }
    if (dragEvent.phase === 'moving' || dragEvent.phase === 'dropped') {
      return { x: KANBAN_COL_X[dragEvent.toCol], y: getCardY(dragEvent.toCol) };
    }
    return null;
  }, [dragEvent, boardStyle, boardItems, story.isActive, story.columnOverrides, genericDrag.columnOverrides]);

  // When one cursor is dragging, push the other to the lower-center of the opposite half.
  // Activates as soon as the drag event exists (even in idle phase) to prevent overlap.
  const nonDragSafePos = useMemo(() => {
    if (!dragEvent) return null;
    // Base safe side on where the drag is heading, not on dragCursorOverride (which starts null)
    const destX = KANBAN_COL_X[dragEvent.toCol] ?? 50;
    // Keep the non-dragging cursor in the lower-middle area on the opposite side,
    // but not pushed all the way to the edge (avoids clipping).
    const oppositeX = destX > 50 ? 25 : 60;
    return { x: oppositeX, y: 70 };
  }, [dragEvent]);

  const variantSharedProps: WmHeroVariantProps = {
    orderedDepts,
    selectedDeptIndex,
    onDeptChange: handleDeptChange,
    getCenterImageForIndex,
    getCenterBgColorForIndex,
    deptId: dept.id,
    deptColor: avatarColor,
    deptName: dept.name,
    deptDescription: dept.description,
    deptAgents: dept.agents,
    deptBoardItems: boardItems,
    squadMembers: orderedSquadDepts[selectedDeptIndex]?.members ?? [],
    centerAvatarImage,
    centerBgColor,
    sideAvatarPool,
    avatarPool,
    avatarColor,
    isDark,
    splitPhase,
    deptJtbd: dept.jtbd,
    rosterLayout,
    memberAvatarOverrides,
    onSplitChatComplete: splitChatEnabled ? handleSplitChatComplete : undefined,
  };

  const isRoster = firstFoldVariant === 'roster_board';

  return (
    <section
      ref={sectionRef}
      className={`relative ${hideHero ? 'pt-2 pb-12 sm:pb-16' : hideDemo ? 'pt-24 sm:pt-28 lg:pt-32 pb-4 min-h-[85vh] flex flex-col justify-center' : 'pt-24 sm:pt-28 lg:pt-32 pb-16 sm:pb-20 min-h-[85vh] flex flex-col justify-center'} px-4 sm:px-6 lg:px-8 ${
        isRoster
          ? 'bg-[#0a0a0a] text-white'
          : 'bg-white dark:bg-[#0a0a0a]'
      }`}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
        style={{
          background: isRoster
            ? 'radial-gradient(ellipse 60% 50% at 70% 15%, rgba(0,210,210,0.04) 0%, transparent 60%), radial-gradient(ellipse 40% 35% at 20% 80%, rgba(97,97,255,0.03) 0%, transparent 60%)'
            : 'radial-gradient(ellipse 55% 45% at 80% 20%, rgba(97,97,255,0.06) 0%, transparent 70%)',
        }}
      />
      {/* Subtle grid overlay for roster variant */}
      {isRoster && (
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            maskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 0%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 0%, transparent 80%)',
          }}
        />
      )}
      <div className="max-w-[1200px] mx-auto w-full">
        {/* ═══ HERO SECTION ═══ */}
        {!hideHero && (<>
        {/* Department selector — full width above the grid (default variant only) */}
        {firstFoldVariant === 'default' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex justify-center w-full mb-10 sm:mb-12"
          >
            <div className={`flex items-center justify-start sm:justify-around w-full max-w-4xl px-4 sm:px-6 py-3 rounded-xl border overflow-x-auto scrollbar-hide gap-4 sm:gap-0 ${
              isRoster
                ? 'border-white/[0.08] bg-white/[0.03]'
                : 'border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.03]'
            }`}>
              {orderedDepts.map((d, i) => {
                const isSelected = selectedDeptIndex === i;
                const DepIcon = d.icon;
                const leaderImg = getCenterImageForIndex(i);
                const leaderBg = getCenterBgColorForIndex(i);
                return (
                  <motion.button
                    key={d.id}
                    whileTap={{ scale: 0.93 }}
                    onClick={() => handleDeptChange(i)}
                    className="flex flex-col items-center gap-1 cursor-pointer group flex-shrink-0"
                  >
                    <div
                      className={`rounded-full overflow-hidden transition-all w-10 h-10 ${isSelected ? 'ring-[2.5px] ring-offset-2' : 'opacity-55 hover:opacity-80'}`}
                      style={{
                        backgroundColor: leaderBg,
                        ...(isSelected ? { ['--tw-ring-color' as string]: d.color } : {}),
                      }}
                    >
                      {leaderImg ? (
                        <img src={leaderImg} alt={d.name} className="w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <DepIcon className="w-5 h-5 text-white" strokeWidth={2} />
                        </div>
                      )}
                    </div>
                    <span className={`text-[10px] font-medium ${
                      isSelected
                        ? (isRoster ? 'text-white' : 'text-gray-900 dark:text-white')
                        : (isRoster ? 'text-gray-500' : 'text-gray-400 dark:text-gray-500')
                    }`}>
                      {d.name}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Hero: side-by-side layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-14 lg:gap-20 items-center mb-20 lg:mb-28"
        >
          {/* Left: copy */}
          <div className="flex flex-col items-start gap-6 sm:gap-7 order-1">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${
                isRoster
                  ? 'border-[#00D2D2]/25 bg-[#00D2D2]/[0.08]'
                  : 'border-[#6161FF]/25 bg-[#6161FF]/[0.06] dark:bg-[#6161FF]/10'
              }`}
            >
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isRoster ? 'bg-[#00D2D2]' : 'bg-[#6161FF]'}`}
              />
              <span
                className={`text-[12px] font-semibold tracking-wide ${
                  isRoster ? 'text-[#00D2D2]' : 'text-[#6161FF]'
                }`}
              >
                AI Work Platform
              </span>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`text-3xl sm:text-4xl lg:text-5xl xl:text-[48px] font-bold tracking-[-0.03em] leading-[1.18] max-w-[480px] ${
                isRoster ? 'text-white' : 'text-black dark:text-white'
              }`}
            >
              Any business goal, driven by people and agents
            </motion.h1>

            <p className={`text-sm sm:text-base leading-relaxed max-w-[400px] ${
              isRoster ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'
            }`}>
              Your team and AI agents, side by side on every job to be done.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="flex flex-col items-start gap-3"
            >
              <a
                href={WORK_MANAGEMENT_TRIAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative inline-flex items-center justify-center gap-3 h-13 px-6 font-medium text-lg rounded-[40px] transition-colors overflow-hidden ${
                  isRoster
                    ? 'bg-[#00D2D2] hover:bg-[#00baba] text-[#0a0a0a]'
                    : 'bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black'
                }`}
              >
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none" />
                Get started
                <ArrowRight className="w-5 h-5" strokeWidth={2} />
              </a>
              <p className={`text-sm ${isRoster ? 'text-gray-500' : 'text-[#7c7b7b]'}`}>
                Try it out first with a free trial | No credit card required.
              </p>
            </motion.div>
          </div>

          {/* Right: hero variant */}
          {firstFoldVariant === 'live_delegation' ? (
            <WmHeroLiveDelegation {...variantSharedProps} />
          ) : firstFoldVariant === 'cinematic_assembly' ? (
            <WmHeroCinematicAssembly {...variantSharedProps} />
          ) : firstFoldVariant === 'split_reveal' ? (
            <WmHeroSplitReveal {...variantSharedProps} />
          ) : firstFoldVariant === 'roster_board' ? (
            <WmHeroRosterBoard {...variantSharedProps} />
          ) : (
          <div className="flex flex-col items-center gap-8 sm:gap-10 order-2 w-full">
            {/* Overlapping squad avatars strip */}
            <AnimatePresence mode="popLayout">
              {splitPhase === 'chatting' ? (
                <motion.div
                  key={`${dept.id}-roster`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  <SplitRosterView
                    humans={squadHumans}
                    agents={squadAgents}
                    centerAvatarImage={centerAvatarImage}
                    centerBgColor={centerBgColor}
                    sideAvatarPool={sideAvatarPool}
                    selectedDeptIndex={selectedDeptIndex}
                    avatarColor={avatarColor}
                    isDark={isDark}
                    deptId={dept.id}
                    deptJtbd={dept.jtbd}
                    layout={rosterLayout}
                    memberAvatarOverrides={memberAvatarOverrides}
                    onComplete={handleSplitChatComplete}
                  />
                </motion.div>
              ) : (
              <motion.div
                key={dept.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center gap-5"
              >
                <div className="flex items-end justify-center -space-x-5 sm:-space-x-6 md:-space-x-7">
                  {orderedSquadDepts[selectedDeptIndex]?.members.map((member, i, arr) => {
                    const isCenter = member.role === 'Team Lead';
                    const isLit = !isShowAllPhase && litMemberIndex === i;
                    const size = isCenter
                      ? 'w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40'
                      : 'w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-[7.5rem] lg:h-[7.5rem]';
                    const humanAvatar = isCenter
                      ? centerAvatarImage
                      : memberAvatarOverrides[member.id]
                        ? memberAvatarOverrides[member.id]
                        : sideAvatarPool.length > 0
                          ? sideAvatarPool[(selectedDeptIndex * 3 + i * 7 + 2) % sideAvatarPool.length]?.image
                          : null;
                    const agentImg = member.isAgent ? member.img : null;
                    const showImage = member.isAgent ? agentImg : humanAvatar;
                    const centerIndex = arr.findIndex(m => m.role === 'Team Lead');
                    const distFromCenter = Math.abs(i - centerIndex);
                    const zIdx = isLit ? 25 : (isCenter ? 15 : Math.max(1, arr.length - distFromCenter));
                    const squadDeptColor = colorOverrides[orderedSquadDepts[selectedDeptIndex]?.id] || orderedSquadDepts[selectedDeptIndex]?.color || avatarColor;
                    const ringColor = member.isAgent ? member.bgColor : squadDeptColor;

                    return (
                      <motion.div
                        key={member.id}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.06, duration: 0.35 }}
                        className="flex flex-col items-center gap-2.5 flex-shrink-0"
                      >
                        <div
                          className="relative transition-all duration-300"
                          style={{
                            zIndex: zIdx,
                            opacity: isLit || isShowAllPhase ? 1 : 0.65,
                            filter: isLit || isShowAllPhase ? 'none' : 'grayscale(0.6) brightness(1.05)',
                            transform: isShowAllPhase && isCenter ? 'scale(1.05)' : undefined,
                          }}
                        >
                          {member.isAgent && !isLit && (
                            <div
                              className="absolute -inset-1.5 rounded-full pointer-events-none z-0"
                              style={{
                                background: `radial-gradient(circle, ${member.bgColor}18 0%, transparent 70%)`,
                              }}
                            />
                          )}
                          <AnimatePresence>
                            {isLit && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1.05 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.4 }}
                                className="absolute -inset-2 rounded-full pointer-events-none z-0"
                                style={{
                                  background: `radial-gradient(circle, ${ringColor}30 0%, transparent 70%)`,
                                  boxShadow: `0 0 24px ${ringColor}50`,
                                }}
                              />
                            )}
                          </AnimatePresence>
                          <motion.div
                            layoutId={`avatar-${member.id}`}
                            className={`${size} rounded-full overflow-hidden flex-shrink-0 shadow-lg relative z-10 transition-all duration-300 ${
                              isLit
                                ? 'ring-[2.5px] ring-offset-2 ring-offset-white dark:ring-offset-[#0a0a0a]'
                                : isCenter
                                  ? 'ring-[3px] ring-offset-2 sm:ring-offset-[3px] ring-offset-white dark:ring-offset-[#0a0a0a]'
                                  : 'ring-2 ring-white dark:ring-[#0a0a0a] ring-offset-2 sm:ring-offset-[3px] ring-offset-white dark:ring-offset-[#0a0a0a]'
                            }`}
                            transition={{
                              layout: { type: 'spring', stiffness: 200, damping: 25, mass: 0.8 },
                            }}
                            style={{
                              border: `2px solid ${member.isAgent ? `${member.bgColor}40` : `${centerBgColor}60`}`,
                              background: member.isAgent
                                ? `linear-gradient(145deg, ${member.bgColor}cc, ${member.bgColor})`
                                : centerBgColor,
                              ...((isLit || isCenter) ? { ['--tw-ring-color' as string]: ringColor } : {}),
                            }}
                          >
                            {showImage ? (
                              <img
                                src={showImage}
                                alt={member.label}
                                className={`w-full h-full ${member.isAgent ? 'object-contain object-bottom' : 'object-cover'}`}
                                loading="lazy"
                                onError={(e) => {
                                  if (member.fallback && member.isAgent) {
                                    (e.target as HTMLImageElement).src = member.fallback;
                                  }
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className={`text-white font-bold ${isCenter ? 'text-xl sm:text-2xl md:text-3xl' : 'text-base sm:text-lg'}`}>
                                  {member.fallback || member.label.charAt(0)}
                                </span>
                              </div>
                            )}
                          </motion.div>
                          {member.isAgent && (
                            <div
                              className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center z-20 border-2 border-white dark:border-[#0a0a0a]"
                              style={{
                                background: `linear-gradient(135deg, ${member.bgColor}, ${member.bgColor}cc)`,
                                boxShadow: `0 2px 6px ${member.bgColor}40`,
                              }}
                            >
                              <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                            </div>
                          )}
                        </div>
                        <span
                          className={`text-center text-xs sm:text-[13px] font-medium transition-all duration-300 max-w-[4.5rem] leading-tight min-h-[2rem] flex items-start justify-center ${
                            isCenter ? 'font-semibold' : ''
                          } ${!isLit && !isShowAllPhase && member.isAgent ? 'opacity-60' : !isLit && !isShowAllPhase ? 'opacity-50' : ''}`}
                          style={{ color: member.isAgent ? member.bgColor : centerBgColor }}
                        >
                          {member.label}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
                <div className="min-h-[3.5rem] flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {(() => {
                      if (isShowAllPhase) return null;
                      const activeMember = orderedSquadDepts[selectedDeptIndex]?.members[litMemberIndex];
                      if (!activeMember) return null;
                      const dotColor = activeMember.isAgent ? activeMember.bgColor : avatarColor;
                      return (
                        <motion.div
                          key={`${dept.id}-${litMemberIndex}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex items-center gap-3 px-4 py-2.5 rounded-2xl max-w-md"
                          style={{
                            backgroundColor: isDark ? '#141414' : '#ffffff',
                            borderLeft: `3px solid ${dotColor}`,
                            border: `1.5px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb'}`,
                            borderLeftWidth: '3px',
                            borderLeftColor: dotColor,
                            boxShadow: isDark
                              ? '0 2px 8px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05)'
                              : '0 2px 8px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)',
                          }}
                        >
                        {/* Mini avatar */}
                        {(() => {
                          const isActiveMemberCenter = activeMember.role === 'Team Lead';
                          const memberImg = activeMember.isAgent
                            ? activeMember.img
                            : isActiveMemberCenter
                              ? centerAvatarImage
                              : memberAvatarOverrides[activeMember.id]
                                ? memberAvatarOverrides[activeMember.id]
                                : (sideAvatarPool.length > 0
                                  ? sideAvatarPool[(selectedDeptIndex * 3 + litMemberIndex * 7 + 2) % sideAvatarPool.length]?.image
                                  : null);
                          return (
                            <div
                              className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 ring-1 ring-white dark:ring-[#141414]"
                              style={{
                                background: activeMember.isAgent
                                  ? `linear-gradient(135deg, ${activeMember.bgColor}cc, ${activeMember.bgColor})`
                                  : `linear-gradient(135deg, ${avatarColor}ee, ${avatarColor})`,
                              }}
                            >
                              {memberImg ? (
                                <img
                                  src={memberImg}
                                  alt={activeMember.label}
                                  className={`w-full h-full ${activeMember.isAgent ? 'object-contain object-bottom' : 'object-cover'}`}
                                  loading="lazy"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <span className="text-white font-bold text-[9px]">{activeMember.label.charAt(0)}</span>
                                </div>
                              )}
                            </div>
                          );
                        })()}
                        <span className="text-sm font-medium truncate">
                          <span
                            className="font-bold"
                            style={{ color: isDark ? '#f3f4f6' : '#1f2937' }}
                          >
                            {activeMember.label}:
                          </span>{' '}
                          <span className="text-gray-600 dark:text-gray-400">
                            {getConversationMessage(activeMember, dept.jtbd[selectedJtbd])}
                          </span>
                        </span>
                      </motion.div>
                    );
                  })()}
                </AnimatePresence>
                </div>
              </motion.div>
              )}
            </AnimatePresence>
          </div>
          )}
        </motion.div>
        {/* ═══ TRUST BAR ═══ */}
        <TrustBar isRoster={isRoster} />
        </>)}

        {/* ═══ DEMO SECTION ═══ */}
        {!hideDemo && (<div ref={demoRef}>
        {/* Section title above demo */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mt-16 lg:mt-20 mb-8"
        >
          <h2 className={`text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-[-0.03em] leading-[1.15] mb-3 ${isRoster ? 'text-white' : 'text-black dark:text-white'}`}>
            Your unlimited workforce.
          </h2>
          <p className={`text-[15px] sm:text-[17px] ${isRoster ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>
            AI agents that work alongside your team — 24/7, at any scale, without limits
          </p>
        </motion.div>

        {/* Main card: Squad + Board */}
        <div style={{ perspective: '1800px' }} className="mt-0">
          <motion.div
            initial={{ opacity: 0, y: 30, rotateX: 4 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 1.5 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={`rounded-2xl ${
              isRoster
                ? 'border border-white/[0.08] bg-[#141414]'
                : 'border border-gray-200 dark:border-white/10 bg-white dark:bg-[#141414]'
            }`}
            style={{
              boxShadow: isDark || isRoster
                ? '0 20px 60px -12px rgba(0,0,0,0.5), 0 4px 20px -4px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.04)'
                : '0 20px 60px -12px rgba(0,0,0,0.12), 0 4px 20px -4px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.03)',
              transformOrigin: 'center bottom',
            }}
          >
            <div className={`grid grid-cols-1 min-h-[520px] overflow-hidden rounded-2xl ${
              cardLayout === 'board_only'
                ? 'lg:grid-cols-[84px_minmax(0,1fr)]'
                : cardLayout === 'compact_squad'
                  ? 'lg:grid-cols-[84px_160px_minmax(0,1fr)]'
                  : cardLayout === 'squad_header'
                    ? 'lg:grid-cols-[84px_minmax(0,1fr)]'
                    : 'lg:grid-cols-[84px_minmax(0,1fr)_minmax(0,1.4fr)]'
            }`}>
              {/* Leftmost: Department sidebar */}
              <div className={`hidden lg:flex flex-col border-r p-3 justify-start gap-0 ${
                isRoster
                  ? 'border-white/[0.06] bg-white/[0.02]'
                  : 'border-gray-100 dark:border-white/10 bg-gray-50/40 dark:bg-white/[0.03]'
              }`}>
                {orderedDepts.map((d, i) => {
                  const isSelected = selectedDeptIndex === i;
                  const DepIcon = d.icon;
                  const leaderImg = getCenterImageForIndex(i);
                  const leaderBg = getCenterBgColorForIndex(i);
                  return (
                    <motion.button
                      key={d.id}
                      whileTap={{ scale: 0.93 }}
                      onClick={() => handleDeptChange(i)}
                      animate={{ opacity: isSelected ? 1 : (anyActive ? 0.18 : 0.35) }}
                      transition={{ duration: 0.5, ease: 'easeInOut' }}
                      className={`flex flex-col items-center gap-0 py-px rounded-lg transition-all duration-200 group ${
                        isSelected ? '' : 'hover:opacity-60'
                      }`}
                    >
                      <div
                        className={`
                          w-12 h-12 rounded-full overflow-hidden flex-shrink-0 transition-all
                          ${isSelected
                            ? `ring-[2.5px] ring-offset-1 ${isRoster ? 'ring-offset-[#141414]' : 'ring-offset-gray-50 dark:ring-offset-[#141414]'}`
                            : `ring-1 ring-transparent ${isRoster ? 'group-hover:ring-white/10' : 'group-hover:ring-gray-200 dark:group-hover:ring-white/10'}'`}
                        `}
                        style={{
                          backgroundColor: leaderBg,
                          ...(isSelected ? { ['--tw-ring-color' as string]: d.color } : {}),
                          ...(!isSelected ? { filter: 'grayscale(0.5) brightness(1.02)' } : {}),
                        }}
                      >
                        {leaderImg ? (
                          <img src={leaderImg} alt={d.name} className="w-full h-full object-cover" loading="lazy" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <DepIcon className="w-5 h-5 text-white" strokeWidth={2} />
                          </div>
                        )}
                      </div>
                      <span
                        className={`text-[10px] font-medium transition-all duration-200 opacity-0 group-hover:opacity-100 ${
                          isSelected
                            ? (isRoster ? 'text-white' : 'text-gray-900 dark:text-white')
                            : (isRoster ? 'text-gray-500 group-hover:text-gray-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500')
                        }`}
                        title={d.name}
                      >
                        {d.name}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Center panel: Squad — hidden for board_only and squad_header */}
              {/* Squad panel — full (default) or compact, hidden for board_only/squad_header */}
              {cardLayout === 'default' && (
              <div className={`lg:col-start-2 border-r p-6 flex flex-col min-w-0 ${
                isRoster
                  ? 'border-white/[0.06] bg-gradient-to-b from-white/[0.02] to-[#141414]'
                  : 'border-gray-100 dark:border-white/10 bg-gradient-to-b from-gray-50/60 dark:from-white/[0.02] to-white dark:to-[#141414]'
              }`}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={dept.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col flex-1"
                  >
                    {/* Squad header */}
                    <div className="mb-5">
                      <motion.h3
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35 }}
                        className={`text-2xl font-extrabold tracking-tight mb-1 ${
                          isRoster ? 'text-white' : 'text-gray-900 dark:text-white'
                        }`}
                      >
                        {dept.name} squad
                      </motion.h3>
                      <p className={`text-[13px] leading-relaxed ${
                        isRoster ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {dept.description}
                      </p>
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.3, duration: 0.4, ease: 'easeOut' }}
                        className="h-0.5 rounded-full mt-4 origin-left"
                        style={{
                          background: `linear-gradient(to right, ${dept.color}, ${dept.color}20)`,
                        }}
                      />
                    </div>

                    {/* Team lead info row */}
                    <div
                      className={`flex items-center gap-3 mb-2 min-w-0 rounded-lg px-2 -mx-2 py-1.5 transition-all duration-300`}
                      style={humanActive ? {
                        backgroundColor: `${dept.color}12`,
                        boxShadow: `0 0 10px 1px ${dept.color}10`,
                      } : {}}
                    >
                      <motion.div
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1, duration: 0.35 }}
                        className="flex-shrink-0"
                      >
                        <div
                          className={`w-14 h-14 rounded-full overflow-hidden transition-all duration-300 ${
                            humanActive
                              ? 'ring-2 ring-offset-1 ring-offset-[#141414]'
                              : isRoster ? 'ring-2 ring-white/10' : 'ring-1 ring-gray-200 dark:ring-white/10'
                          }`}
                          style={{
                            backgroundColor: centerBgColor,
                            ...(humanActive ? { ['--tw-ring-color' as string]: `${dept.color}80` } : {}),
                          }}
                        >
                          {centerAvatarImage ? (
                            <img src={centerAvatarImage} alt={`${dept.name} Lead`} className="w-full h-full object-cover" loading="lazy" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-white font-bold text-lg">{dept.name.charAt(0)}</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15, duration: 0.35 }}
                        className="flex-shrink-0"
                      >
                        <p className={`text-[14px] font-semibold ${isRoster ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{dept.name} Lead</p>
                        <p className={`text-[11px] ${isRoster ? 'text-gray-500' : 'text-gray-400 dark:text-gray-500'}`}>Team Lead</p>
                        {humanActive && (
                          <p className="text-[10px] font-medium mt-0.5" style={{ color: dept.color }}>Coordinating</p>
                        )}
                      </motion.div>
                    </div>

                    {/* Divider: humans → agents */}
                    <div className="flex items-center gap-2 my-3 px-1">
                      <div className={`h-px flex-1 ${isRoster ? 'bg-white/[0.06]' : 'bg-gray-100 dark:bg-white/10'}`} />
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${isRoster ? 'text-gray-600' : 'text-gray-300 dark:text-gray-600'}`}>
                        AI Agents
                      </span>
                      <div className={`h-px flex-1 ${isRoster ? 'bg-white/[0.06]' : 'bg-gray-100 dark:bg-white/10'}`} />
                    </div>

                    {/* Agents */}
                    <div className="space-y-4 flex-1">
                      {dept.agents.map((agent, i) => (
                        <SquadMember
                          key={agent.label}
                          agent={agent}
                          isLit={litAgentIndices.has(i)}
                          deptColor={dept.color}
                          delay={0.15 + i * 0.08}
                          status={agent.status}
                          anyActive={anyActive}
                        />
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
              )}

              {/* Squad panel — compact (avatar + name only) */}
              {cardLayout === 'compact_squad' && (
              <div className={`lg:col-start-2 border-r flex flex-col min-w-0 overflow-hidden ${
                isRoster
                  ? 'border-white/[0.06] bg-white/[0.02]'
                  : 'border-gray-100 dark:border-white/10 bg-gray-50/30 dark:bg-white/[0.02]'
              }`}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={dept.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col h-full py-4 px-3 gap-1"
                  >
                    {/* Dept name pill */}
                    <div className="mb-2 px-1">
                      <span
                        className="text-[10px] font-bold uppercase tracking-widest"
                        style={{ color: dept.color }}
                      >
                        {dept.name}
                      </span>
                    </div>

                    {/* Team lead */}
                    <div
                      className={`flex flex-col items-center gap-1 py-2 rounded-lg transition-all duration-300 ${
                        humanActive ? 'bg-white/[0.07]' : ''
                      }`}
                      style={humanActive ? {
                        boxShadow: `0 0 10px 1px ${dept.color}12`,
                        outline: `1px solid ${dept.color}25`,
                      } : {}}
                    >
                      <div
                        className={`w-10 h-10 rounded-full overflow-hidden transition-all duration-300 ${
                          humanActive
                            ? 'ring-2 ring-offset-1 ring-offset-[#0a0a0a]'
                            : `ring-1 ${isRoster ? 'ring-white/20' : 'ring-gray-200 dark:ring-white/10'}`
                        }`}
                        style={{
                          backgroundColor: centerBgColor,
                          ...(humanActive ? { ['--tw-ring-color' as string]: `${dept.color}80` } : {}),
                        }}
                      >
                        {centerAvatarImage
                          ? <img src={centerAvatarImage} alt={`${dept.name} Lead`} className="w-full h-full object-cover" loading="lazy" />
                          : <div className="w-full h-full flex items-center justify-center"><span className="text-white font-bold text-xs">{dept.name.charAt(0)}</span></div>
                        }
                      </div>
                      <p className={`text-[10px] font-medium text-center leading-tight ${isRoster ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
                        {dept.name} Lead
                      </p>
                      <span className={`text-[9px] ${humanActive ? '' : ''} ${isRoster ? 'text-gray-600' : 'text-gray-400'}`}>Team Lead</span>
                      {humanActive && (
                        <span className="text-[9px] font-medium" style={{ color: dept.color }}>
                          Coordinating
                        </span>
                      )}
                    </div>

                    {/* Divider */}
                    <div className={`h-px mx-2 my-1 ${isRoster ? 'bg-white/[0.06]' : 'bg-gray-100 dark:bg-white/10'}`} />

                    {/* Agents — avatar + name stacked */}
                    {dept.agents.map((agent, i) => {
                      const isActive = litAgentIndices.has(i);
                      const compactDimmed = anyActive && !isActive;
                      return (
                      <motion.div
                        key={agent.label}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isActive ? 1 : (compactDimmed ? 0.28 : 0.7), filter: compactDimmed ? 'saturate(0.3)' : 'saturate(1)' }}
                        transition={{ delay: 0.1 + i * 0.07, duration: 0.3, opacity: { duration: 0.5 }, filter: { duration: 0.5 } }}
                        className={`flex flex-col items-center gap-1 py-2 rounded-lg transition-all duration-300 ${
                          isActive ? 'bg-white/[0.07]' : ''
                        }`}
                        style={isActive ? {
                          boxShadow: `0 0 10px 1px ${agent.bgColor}12`,
                          outline: `1px solid ${agent.bgColor}25`,
                        } : {}}
                      >
                        <div
                          className={`w-10 h-10 rounded-xl overflow-hidden transition-all duration-300 ${
                            isActive ? 'ring-2 ring-offset-1 ring-offset-[#0a0a0a]' : ''
                          }`}
                          style={{
                            backgroundColor: agent.bgColor,
                            ...(isActive ? { ['--tw-ring-color' as string]: `${agent.bgColor}60` } : {}),
                          }}
                        >
                          <img
                            src={agent.img}
                            alt={agent.label}
                            className="w-full h-full object-contain object-bottom"
                            loading="lazy"
                            onError={(e) => { (e.target as HTMLImageElement).src = agent.fallback; }}
                          />
                        </div>
                        <p className={`text-[10px] font-medium text-center leading-tight max-w-[120px] ${isRoster ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
                          {agent.label}
                        </p>
                        {isActive && (
                          <span className="text-[9px] font-medium" style={{ color: dept.color }}>
                            {agent.status}
                          </span>
                        )}
                      </motion.div>
                      );
                    })}
                  </motion.div>
                </AnimatePresence>
              </div>
              )}

              {/* Right panel: Work Surface */}
              <div className={`flex flex-col relative min-w-0 ${
                cardLayout === 'default' || cardLayout === 'compact_squad' ? 'lg:col-start-3' : 'lg:col-start-2'
              }`}>
                {/* Squad Header row — shown only for squad_header layout */}
                {cardLayout === 'squad_header' && (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={dept.id}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.25 }}
                      className={`flex items-center gap-3 px-5 py-3 border-b overflow-x-auto ${
                        isRoster
                          ? 'border-white/[0.06] bg-white/[0.02]'
                          : 'border-gray-100 dark:border-white/10 bg-gray-50/30 dark:bg-white/[0.02]'
                      }`}
                    >
                      {/* Team lead */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div
                          className={`w-9 h-9 rounded-full overflow-hidden ring-1 ${isRoster ? 'ring-white/20' : 'ring-gray-200 dark:ring-white/10'}`}
                          style={{ backgroundColor: centerBgColor }}
                        >
                          {centerAvatarImage
                            ? <img src={centerAvatarImage} alt={`${dept.name} Lead`} className="w-full h-full object-cover" loading="lazy" />
                            : <div className="w-full h-full flex items-center justify-center"><span className="text-white font-bold text-xs">{dept.name.charAt(0)}</span></div>
                          }
                        </div>
                        <div>
                          <p className={`text-[11px] font-semibold leading-tight ${isRoster ? 'text-white' : 'text-gray-800 dark:text-white'}`}>{dept.name} Lead</p>
                          <p className={`text-[9px] ${isRoster ? 'text-gray-500' : 'text-gray-400'}`}>Team Lead</p>
                        </div>
                      </div>

                      {/* Separator */}
                      <div className={`w-px h-8 flex-shrink-0 ${isRoster ? 'bg-white/[0.08]' : 'bg-gray-200 dark:bg-white/10'}`} />

                      {/* Agents inline */}
                      {dept.agents.map((agent, i) => (
                        <div key={agent.label} className="flex items-center gap-2 flex-shrink-0">
                          <motion.div
                            animate={litAgentIndices.has(i) ? { scale: [1, 1.08, 1] } : {}}
                            transition={{ duration: 1.2, repeat: Infinity }}
                            className="w-9 h-9 rounded-xl overflow-hidden"
                            style={{ backgroundColor: agent.bgColor }}
                          >
                            <img
                              src={agent.img}
                              alt={agent.label}
                              className="w-full h-full object-contain object-bottom"
                              loading="lazy"
                              onError={(e) => { (e.target as HTMLImageElement).src = agent.fallback; }}
                            />
                          </motion.div>
                          <div>
                            <p className={`text-[11px] font-semibold leading-tight ${isRoster ? 'text-white' : 'text-gray-800 dark:text-white'}`}>{agent.label}</p>
                            <p
                              className="text-[9px] font-medium"
                              style={{ color: litAgentIndices.has(i) ? dept.color : (isRoster ? '#6b7280' : '#9ca3af') }}
                            >
                              {litAgentIndices.has(i) ? agent.status : 'AI Agent'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                )}

                {/* JTBD title bar */}
                <div className={`flex items-center gap-3 px-5 py-2.5 border-b ${
                  isRoster
                    ? 'border-white/[0.06] bg-white/[0.02]'
                    : 'border-gray-100 dark:border-white/10 bg-gray-50/30 dark:bg-white/[0.02]'
                }`}>
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                  </div>
                  <div className="w-px h-4 bg-gray-200 dark:bg-white/10" />
                  <LayoutGrid className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={`${dept.id}-${selectedJtbd}`}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="text-[11px] font-semibold text-gray-700 dark:text-gray-300"
                    >
                      {dept.jtbd[selectedJtbd]}
                    </motion.span>
                  </AnimatePresence>
                </div>

                {/* Board surface — switched by boardStyle */}
                {boardStyle === 'kanban' ? (
                  <KanbanBoard
                    items={boardItems}
                    agents={dept.agents}
                    deptColor={dept.color}
                    isDark={isDark || isRoster}
                    avatarPool={avatarPool}
                    dragEvent={dragEvent}
                    columnOverrides={columnOverrides}
                    highlightedTaskIds={highlightedTaskIds}
                    anyActive={anyActive}
                  />
                ) : boardStyle === 'workflow' ? (
                  <WorkflowBoard
                    items={boardItems}
                    agents={dept.agents}
                    deptColor={dept.color}
                    isDark={isDark || isRoster}
                    avatarPool={avatarPool}
                    deptId={dept.id}
                  />
                ) : boardStyle === 'focused' ? (
                  <FocusedBoard
                    items={boardItems}
                    agents={dept.agents}
                    deptColor={dept.color}
                    isDark={isDark || isRoster}
                    avatarPool={avatarPool}
                    deptId={dept.id}
                  />
                ) : boardStyle === 'minimal' ? (
                  <MinimalBoard
                    items={boardItems}
                    agents={dept.agents}
                    deptColor={dept.color}
                    isDark={isDark || isRoster}
                    avatarPool={avatarPool}
                  />
                ) : (
                <div className="flex-1 p-4 min-w-0">
                  <div className={`grid grid-cols-[1fr_64px_56px_80px_72px] gap-2 px-3 py-2 border-b ${
                    isRoster ? 'border-white/[0.06]' : 'border-gray-100 dark:border-white/10'
                  }`}>
                    <span className={`text-[11px] font-semibold uppercase tracking-wider ${isRoster ? 'text-gray-500' : 'text-gray-400 dark:text-gray-500'}`}>Task</span>
                    <span className={`text-[11px] font-semibold uppercase tracking-wider ${isRoster ? 'text-gray-500' : 'text-gray-400 dark:text-gray-500'}`}>Owner</span>
                    <span className={`text-[11px] font-semibold uppercase tracking-wider ${isRoster ? 'text-gray-500' : 'text-gray-400 dark:text-gray-500'}`}>Agent</span>
                    <span className={`text-[11px] font-semibold uppercase tracking-wider ${isRoster ? 'text-gray-500' : 'text-gray-400 dark:text-gray-500'}`}>Status</span>
                    <span className={`text-[11px] font-semibold uppercase tracking-wider ${isRoster ? 'text-gray-500' : 'text-gray-400 dark:text-gray-500'}`}>Progress</span>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={dept.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {boardItems.slice(0, 6).map((item, idx) => (
                        <TaskRow
                          key={item.id}
                          item={item}
                          agents={dept.agents}
                          deptColor={dept.color}
                          isHighlighted={highlightedTaskIds.has(item.id)}
                          delay={idx * 0.05}
                          avatarPool={avatarPool}
                          anyActive={anyActive}
                        />
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </div>
                )}

                {/* Sidekick input */}
                <div className={`px-4 py-3 border-t ${isRoster ? 'border-white/[0.06]' : 'border-gray-100 dark:border-white/10'}`}>
                  <div className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                    isRoster
                      ? 'bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.15]'
                      : 'bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
                  }`}>
                    <Bot className={`w-5 h-5 flex-shrink-0 ${isRoster ? 'text-[#00D2D2]' : 'text-violet-400'}`} />
                    <span className={`text-[12px] flex-1 ${isRoster ? 'text-gray-500' : 'text-gray-400 dark:text-gray-500'}`}>Ask Sidekick...</span>
                    <Send className={`w-3.5 h-3.5 ${isRoster ? 'text-gray-600' : 'text-gray-300 dark:text-gray-600'}`} />
                  </div>
                </div>

                {/* Story intro overlay OR floating cursors */}
                <AnimatePresence mode="wait">
                  {storyIsIntro ? (
                    <StoryIntro
                      key="story-intro"
                      humanName={humanCursor.name}
                      humanAvatar={centerAvatarImage}
                      humanAvatarBg={centerBgColor}
                      humanMessage={storyHumanMessage ?? ''}
                      agent={dept.agents[0]}
                      agentMessage={storyAgentMessages?.[0] ?? ''}
                      deptColor={dept.color}
                    />
                  ) : (
                    <motion.div
                      key={`cursors-${dept.id}-${litAgents.join(',')}-${humanActive}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1, ease: 'easeInOut' }}
                      className="absolute inset-0 pointer-events-none z-20 overflow-visible"
                    >
                      {posA && litAgents[0] !== undefined && dept.agents[litAgents[0]] && (() => {
                        const isThisAgentDragging = !!dragEvent && !dragEvent.isHuman && dragEvent.agentIdx === litAgents[0];
                        const fallbackPos = !isThisAgentDragging && nonDragSafePos ? nonDragSafePos : posA;
                        return (
                          <FloatingAgentCursor
                            agent={dept.agents[litAgents[0]]}
                            x={isThisAgentDragging && dragCursorOverride ? dragCursorOverride.x : fallbackPos.x}
                            y={isThisAgentDragging && dragCursorOverride ? dragCursorOverride.y : fallbackPos.y}
                            deptColor={dept.color}
                            message={storyAgentMessages?.[litAgents[0]]}
                            isDragging={isThisAgentDragging && dragEvent?.phase !== 'idle' && dragEvent?.phase !== 'dropped'}
                          />
                        );
                      })()}
                      {posB && litAgents[1] !== undefined && dept.agents[litAgents[1]] && (() => {
                        const isThisAgentDragging = !!dragEvent && !dragEvent.isHuman && dragEvent.agentIdx === litAgents[1];
                        const fallbackPos = !isThisAgentDragging && nonDragSafePos ? nonDragSafePos : posB;
                        return (
                          <FloatingAgentCursor
                            agent={dept.agents[litAgents[1]]}
                            x={isThisAgentDragging && dragCursorOverride ? dragCursorOverride.x : fallbackPos.x}
                            y={isThisAgentDragging && dragCursorOverride ? dragCursorOverride.y : fallbackPos.y}
                            deptColor={dept.color}
                            message={storyAgentMessages?.[litAgents[1]]}
                            isDragging={isThisAgentDragging && dragEvent?.phase !== 'idle' && dragEvent?.phase !== 'dropped'}
                          />
                        );
                      })()}
                      {humanActive && (() => {
                        const isHumanDragging = !!dragEvent && !!dragEvent.isHuman;
                        const humanX = isHumanDragging && dragCursorOverride ? dragCursorOverride.x : (!isHumanDragging && nonDragSafePos ? nonDragSafePos.x : humanCursor.x);
                        const humanY = isHumanDragging && dragCursorOverride ? dragCursorOverride.y : (!isHumanDragging && nonDragSafePos ? nonDragSafePos.y : humanCursor.y);
                        return (
                          <FloatingHumanCursor
                            name={humanCursor.name}
                            color={humanCursor.color}
                            x={humanX}
                            y={humanY}
                            avatarImage={centerAvatarImage}
                            deptColor={avatarColor}
                            message={storyPhase >= 1 ? (storyHumanMessage ?? getTeamLeadRequest(dept.jtbd[selectedJtbd])) : undefined}
                            showTyping={storyPhase === 0}
                            isDragging={isHumanDragging && dragEvent?.phase !== 'idle' && dragEvent?.phase !== 'dropped'}
                          />
                        );
                      })()}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
        </div>)}
      </div>
    </section>
  );
}
