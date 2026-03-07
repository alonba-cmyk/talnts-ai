"use client";

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, CheckCheck, Zap } from 'lucide-react';
import type { AgentInfo, BoardItem } from './wmDepartmentData';
import type { LucideIcon } from 'lucide-react';

/* ─── Shared types ─── */

export type SquadMemberData = {
  id: string;
  label: string;
  role: string;
  isAgent: boolean;
  bgColor: string;
  img: string;
  fallback: string;
  status?: string;
};

export type DeptSelectorData = {
  id: string;
  name: string;
  color: string;
  icon: LucideIcon;
};

export interface WmHeroVariantProps {
  orderedDepts: DeptSelectorData[];
  selectedDeptIndex: number;
  onDeptChange: (i: number) => void;
  getCenterImageForIndex: (i: number) => string | undefined;
  getCenterBgColorForIndex: (i: number) => string;

  deptId: string;
  deptColor: string;
  deptName: string;
  deptDescription?: string;
  deptAgents: AgentInfo[];
  deptBoardItems: BoardItem[];
  squadMembers: SquadMemberData[];

  centerAvatarImage?: string;
  centerBgColor: string;
  sideAvatarPool: { image: string; color: string }[];
  avatarPool: { image: string; color: string }[];
  avatarColor: string;

  isDark: boolean;

  splitPhase?: 'together' | 'chatting';
  deptJtbd?: string[];
  rosterLayout?: 'mirrored' | 'vertical';
  memberAvatarOverrides?: Record<string, string>;
}

/* ─── Shared: department selector tabs ─── */

function WmDeptTabs({
  orderedDepts,
  selectedDeptIndex,
  onDeptChange,
  getCenterImageForIndex,
  getCenterBgColorForIndex,
}: Pick<
  WmHeroVariantProps,
  'orderedDepts' | 'selectedDeptIndex' | 'onDeptChange' | 'getCenterImageForIndex' | 'getCenterBgColorForIndex'
>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="flex justify-center w-full"
    >
      <div className="inline-flex items-center justify-center px-6 py-3.5 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.03] gap-5 sm:gap-6">
        {orderedDepts.map((d, i) => {
          const isSelected = selectedDeptIndex === i;
          const DepIcon = d.icon;
          const leaderImg = getCenterImageForIndex(i);
          const leaderBg = getCenterBgColorForIndex(i);
          return (
            <motion.button
              key={d.id}
              whileTap={{ scale: 0.93 }}
              onClick={() => onDeptChange(i)}
              className="flex flex-col items-center gap-1.5 cursor-pointer shrink-0 group"
            >
              <div
                className={`rounded-full overflow-hidden transition-all w-12 h-12 ${
                  isSelected ? 'ring-[2.5px] ring-offset-2' : 'opacity-55 hover:opacity-80'
                }`}
                style={{
                  backgroundColor: leaderBg,
                  ...(isSelected ? { ['--tw-ring-color' as string]: d.color } : {}),
                }}
              >
                {leaderImg ? (
                  <img src={leaderImg} alt={d.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <DepIcon className="w-5 h-5 text-white" strokeWidth={2} />
                  </div>
                )}
              </div>
              <span
                className={`text-[11px] font-medium ${
                  isSelected ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                {d.name}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ─── Typing dots indicator ─── */

function RosterTypingDots({ isDark }: { isDark: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: isDark ? '#97aeff' : '#6161ff' }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}

/* ─── Conversation bubble (typing dots or text) ─── */

function RosterConvoBubble({
  text, typing, isDark, side, accentColor,
}: {
  text: string; typing: boolean; isDark: boolean;
  side: 'person' | 'agent'; accentColor: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="rounded-lg px-3.5 py-2"
      style={{
        background: isDark
          ? `linear-gradient(135deg, ${accentColor}20, ${accentColor}10)`
          : `${accentColor}08`,
        border: `1px solid ${accentColor}${isDark ? '30' : '18'}`,
        boxShadow: isDark ? `0 2px 12px ${accentColor}15` : `0 2px 8px ${accentColor}08`,
      }}
    >
      {typing ? (
        <RosterTypingDots isDark={isDark} />
      ) : (
        <span
          className={`text-[12px] font-medium leading-snug ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
          style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.35' }}
        >
          {text}
        </span>
      )}
    </motion.div>
  );
}

/* ─── Split Roster View (shared by variants) ─── */

type RosterConvoPhase = 'idle' | 'person_typing' | 'person_message' | 'agent_typing' | 'agent_message';

export function SplitRosterView({
  humans,
  agents,
  centerAvatarImage,
  centerBgColor,
  sideAvatarPool,
  selectedDeptIndex,
  avatarColor,
  isDark,
  deptId,
  deptJtbd = [],
  layout = 'mirrored',
  memberAvatarOverrides = {},
}: {
  humans: SquadMemberData[];
  agents: SquadMemberData[];
  centerAvatarImage?: string;
  centerBgColor: string;
  sideAvatarPool: { image: string; color: string }[];
  selectedDeptIndex: number;
  avatarColor: string;
  isDark: boolean;
  deptId: string;
  deptJtbd?: string[];
  layout?: 'mirrored' | 'vertical';
  memberAvatarOverrides?: Record<string, string>;
}) {
  const lead = humans.find(m => m.role === 'Team Lead');
  const nonLead = humans.filter(m => m.role !== 'Team Lead');
  const orderedHumans = lead ? [lead, ...nonLead.slice(0, 1)] : nonLead.slice(0, 2);
  const displayAgents = agents.slice(0, 2);
  const pairCount = Math.min(orderedHumans.length, displayAgents.length);

  const [activePair, setActivePair] = useState(0);
  const [phase, setPhase] = useState<RosterConvoPhase>('idle');
  const [jtbdIdx, setJtbdIdx] = useState(0);

  useEffect(() => {
    setActivePair(0);
    setPhase('idle');
    setJtbdIdx(0);
    const t = setTimeout(() => setPhase('person_typing'), 1200);
    return () => clearTimeout(t);
  }, [deptId]);

  useEffect(() => {
    if (phase === 'idle') return;
    let timeout: ReturnType<typeof setTimeout>;
    if (phase === 'person_typing') {
      timeout = setTimeout(() => setPhase('person_message'), 1000);
    } else if (phase === 'person_message') {
      timeout = setTimeout(() => setPhase('agent_typing'), 1200);
    } else if (phase === 'agent_typing') {
      timeout = setTimeout(() => setPhase('agent_message'), 1000);
    } else if (phase === 'agent_message') {
      timeout = setTimeout(() => {
        setActivePair(prev => (prev + 1) % pairCount);
        setJtbdIdx(prev => (prev + 1) % Math.max(deptJtbd.length, 1));
        setPhase('person_typing');
      }, 1800);
    }
    return () => clearTimeout(timeout);
  }, [phase, pairCount, deptJtbd.length]);

  const getHumanAvatar = (member: SquadMemberData) => {
    if (member.role === 'Team Lead') return centerAvatarImage;
    if (memberAvatarOverrides[member.id]) return memberAvatarOverrides[member.id];
    const origIdx = humans.indexOf(member);
    if (sideAvatarPool.length > 0) {
      return sideAvatarPool[(selectedDeptIndex * 3 + origIdx * 7 + 2) % sideAvatarPool.length]?.image;
    }
    return null;
  };

  const currentJtbd = deptJtbd[jtbdIdx] || '';
  const nextJtbd = deptJtbd[(jtbdIdx + 1) % Math.max(deptJtbd.length, 1)] || '';
  const getHumanMessage = (member: SquadMemberData, rowIdx: number): string => {
    if (member.role === 'Team Lead' && currentJtbd) {
      return `Can you ${currentJtbd.toLowerCase()}?`;
    }
    if (nextJtbd) {
      return `Also, let's ${nextJtbd.toLowerCase()}`;
    }
    const roleMessages: Record<string, string> = {
      'Content Strategist': 'Draft the messaging for this launch',
      'Campaign Manager': 'Set up the campaign timeline and budget',
      'Account Executive': 'Send the proposal to the client today',
      'SDR': 'Follow up with the leads from yesterday',
      'Program Manager': 'Update the cross-team dependencies',
      'Project Lead': 'Check resource allocation for next sprint',
      'SysAdmin': 'Review the pending access requests',
      'DevOps Engineer': 'Deploy the latest config changes',
      'Product Manager': 'Finalize the requirements doc',
      'UX Designer': 'Share the updated wireframes',
      'Ops Manager': 'Review the vendor contracts due this week',
      'Process Analyst': 'Map out the current approval flow',
      'Financial Analyst': 'Prepare the variance report for Q4',
      'Controller': 'Reconcile the outstanding invoices',
      'HR Manager': 'Schedule the new hire orientation',
      'Recruiter': 'Screen the top 5 candidates',
    };
    return roleMessages[member.label] || `Working on the next deliverable`;
  };

  const getAgentReply = (agent: SquadMemberData, _idx: number): string => {
    return agent.status || 'Processing...';
  };

  const personActive = phase === 'person_typing' || phase === 'person_message';
  const agentActive = phase === 'agent_typing' || phase === 'agent_message';

  /* ── Shared sub-renderers ── */

  const renderHumanAvatar = (human: SquadMemberData, isActive: boolean, size: string) => {
    const humanAvatar = getHumanAvatar(human);
    return (
      <motion.div
        layoutId={`avatar-${human.id}`}
        animate={isActive
          ? { scale: 1.06, boxShadow: isDark ? `0 0 28px ${avatarColor}50` : `0 0 20px ${avatarColor}25` }
          : { scale: 1, boxShadow: '0 0 0px transparent' }
        }
        transition={{ duration: 0.4, ease: 'easeOut', layout: { type: 'spring', stiffness: 200, damping: 25, mass: 0.8 } }}
        className={`${size} flex-shrink-0 rounded-full overflow-hidden`}
        style={{
          backgroundColor: centerBgColor,
          border: isActive
            ? `3px solid ${isDark ? avatarColor : `${avatarColor}aa`}`
            : `3px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'white'}`,
        }}
      >
        {humanAvatar ? (
          <img src={humanAvatar} alt={human.label} className="w-full h-full object-cover" />
        ) : (
          <span className="w-full h-full flex items-center justify-center text-white font-bold text-base">
            {human.fallback || human.label.charAt(0)}
          </span>
        )}
      </motion.div>
    );
  };

  const renderAgentAvatar = (agent: SquadMemberData, isActive: boolean, size: string) => (
    <div className="relative">
      <motion.div
        layoutId={`avatar-${agent.id}`}
        animate={isActive
          ? { scale: 1.06, boxShadow: isDark ? `0 0 28px ${agent.bgColor}60` : `0 0 20px ${agent.bgColor}30` }
          : { scale: 1, boxShadow: '0 0 0px transparent' }
        }
        transition={{ duration: 0.4, ease: 'easeOut', layout: { type: 'spring', stiffness: 200, damping: 25, mass: 0.8 } }}
        className={`${size} flex-shrink-0 rounded-2xl overflow-hidden`}
        style={{
          background: `linear-gradient(145deg, ${agent.bgColor}cc, ${agent.bgColor})`,
          border: isActive
            ? `3px solid ${isDark ? agent.bgColor : `${agent.bgColor}aa`}`
            : `3px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'white'}`,
        }}
      >
        <img
          src={agent.img}
          alt={agent.label}
          className="w-full h-full object-contain object-bottom"
          onError={(e) => { if (agent.fallback) (e.target as HTMLImageElement).src = agent.fallback; }}
        />
      </motion.div>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 400 }}
        className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center z-20 border-2"
        style={{
          background: `linear-gradient(135deg, ${agent.bgColor}, ${agent.bgColor}cc)`,
          borderColor: isDark ? '#0a0a0a' : '#fff',
        }}
      >
        <Sparkles className="w-3 h-3 text-white" />
      </motion.div>
    </div>
  );

  const renderHumanInfo = (human: SquadMemberData, isLead: boolean, isActive: boolean, rowIdx: number, align: 'center' | 'left' | 'right' = 'center') => (
    <AnimatePresence mode="wait">
      {isActive ? (
        <RosterConvoBubble
          key={phase === 'person_typing' ? 'typing' : `msg-${jtbdIdx}`}
          text={getHumanMessage(human, rowIdx)}
          typing={phase === 'person_typing'}
          isDark={isDark}
          side="person"
          accentColor={avatarColor}
        />
      ) : (
        <motion.div key="info" className={align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          <p className={`text-[15px] font-semibold truncate ${isDark ? 'text-white' : 'text-gray-800'}`}>
            {isLead ? human.label.replace(' Lead', '') : human.label.split(' ')[0]}
          </p>
          <p className={`text-[11px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {isLead ? 'Lead' : human.role}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const renderAgentInfo = (agent: SquadMemberData, i: number, isActive: boolean, align: 'center' | 'left' | 'right' = 'center') => (
    <AnimatePresence mode="wait">
      {isActive ? (
        <RosterConvoBubble
          key={phase === 'agent_typing' ? 'typing' : `msg-${jtbdIdx}`}
          text={getAgentReply(agent, i)}
          typing={phase === 'agent_typing'}
          isDark={isDark}
          side="agent"
          accentColor={agent.bgColor}
        />
      ) : (
        <motion.div key="info" className={align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          <p className={`text-[15px] font-semibold truncate ${isDark ? 'text-white' : 'text-gray-800'}`}>
            {agent.label}
          </p>
          <p className={`text-[11px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>AI Agent</p>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const connectionHub = (
    <div className="flex flex-col items-center gap-2.5 flex-shrink-0">
      <div className={`w-[2px] h-14 rounded-full ${isDark ? 'bg-gradient-to-b from-[#6161ff]/40 to-[#8b5cf6]/20' : 'bg-gradient-to-b from-[#6161ff]/20 to-[#8b5cf6]/10'}`} />
      <motion.div
        animate={(personActive || agentActive) ? { scale: [1, 1.08, 1] } : {}}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{
          background: isDark ? 'linear-gradient(135deg, #6161ff25, #8b5cf625)' : 'linear-gradient(135deg, #6161ff0d, #8b5cf60d)',
          border: `1.5px solid ${isDark ? '#6161ff40' : '#6161ff18'}`,
          boxShadow: isDark ? '0 0 30px rgba(97,97,255,0.15)' : undefined,
        }}
      >
        <Zap className={`w-6 h-6 ${isDark ? 'text-[#97aeff]' : 'text-[#6161ff]'}`} />
      </motion.div>
      <div className={`w-[2px] h-14 rounded-full ${isDark ? 'bg-gradient-to-b from-[#8b5cf6]/20 to-[#6161ff]/40' : 'bg-gradient-to-b from-[#8b5cf6]/10 to-[#6161ff]/20'}`} />
    </div>
  );

  /* ── Mirrored horizontal: [Avatar Name/Bubble] ⚡ [Name/Bubble Avatar] ── */
  if (layout === 'mirrored') {
    return (
      <div className="relative flex items-center justify-center w-full max-w-2xl mx-auto py-4">
        {/* People column */}
        <div className="flex-1 flex flex-col items-center gap-4">
          <span className={`text-[12px] font-bold uppercase tracking-[0.15em] whitespace-nowrap ${isDark ? 'text-[#97aeff]' : 'text-[#6161ff]/60'}`}>
            People
          </span>
          <div className="flex flex-col gap-5">
            {orderedHumans.map((human, i) => {
              const isLead = human.role === 'Team Lead';
              const isActive = personActive && activePair === i;
              return (
                <div key={human.id} className="flex items-center gap-3 justify-end">
                  {renderHumanAvatar(human, isActive, 'w-[80px] h-[80px] sm:w-[96px] sm:h-[96px]')}
                  <div className="flex flex-col justify-center overflow-hidden" style={{ width: 150, minHeight: 48 }}>
                    {renderHumanInfo(human, isLead, isActive, i, 'left')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Connection hub */}
        <div className="pt-8">
          {connectionHub}
        </div>

        {/* Agents column — mirrored: bubble then avatar */}
        <div className="flex-1 flex flex-col items-center gap-4">
          <span className={`text-[12px] font-bold uppercase tracking-[0.15em] whitespace-nowrap ${isDark ? 'text-[#c4b5fd]' : 'text-[#8b5cf6]/60'}`}>
            AI Agents
          </span>
          <div className="flex flex-col gap-5">
            {displayAgents.map((agent, i) => {
              const isActive = agentActive && activePair === i;
              return (
                <div key={agent.id} className="flex items-center gap-3 justify-start flex-row-reverse">
                  {renderAgentAvatar(agent, isActive, 'w-[80px] h-[80px] sm:w-[96px] sm:h-[96px]')}
                  <div className="flex flex-col justify-center overflow-hidden" style={{ width: 150, minHeight: 48 }}>
                    {renderAgentInfo(agent, i, isActive, 'right')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  /* ── Vertical cards: avatar on top, name/bubble below ── */
  return (
    <div className="relative flex items-start justify-center w-full max-w-2xl mx-auto py-4">
      {/* People column */}
      <div className="flex-1 flex flex-col items-center gap-4">
        <span className={`text-[12px] font-bold uppercase tracking-[0.15em] whitespace-nowrap ${isDark ? 'text-[#97aeff]' : 'text-[#6161ff]/60'}`}>
          People
        </span>
        <div className="flex flex-col items-center gap-6">
          {orderedHumans.map((human, i) => {
            const isLead = human.role === 'Team Lead';
            const isActive = personActive && activePair === i;
            return (
              <div key={human.id} className="flex flex-col items-center gap-2">
                {renderHumanAvatar(human, isActive, 'w-[80px] h-[80px] sm:w-[96px] sm:h-[96px]')}
                <div className="flex flex-col items-center justify-center overflow-hidden min-h-[48px]" style={{ width: 150 }}>
                  {renderHumanInfo(human, isLead, isActive, i, 'center')}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Connection hub */}
      <div className="pt-10">
        {connectionHub}
      </div>

      {/* Agents column */}
      <div className="flex-1 flex flex-col items-center gap-4">
        <span className={`text-[12px] font-bold uppercase tracking-[0.15em] whitespace-nowrap ${isDark ? 'text-[#c4b5fd]' : 'text-[#8b5cf6]/60'}`}>
          AI Agents
        </span>
        <div className="flex flex-col items-center gap-6">
          {displayAgents.map((agent, i) => {
            const isActive = agentActive && activePair === i;
            return (
              <div key={agent.id} className="flex flex-col items-center gap-2">
                {renderAgentAvatar(agent, isActive, 'w-[80px] h-[80px] sm:w-[96px] sm:h-[96px]')}
                <div className="flex flex-col items-center justify-center overflow-hidden min-h-[48px]" style={{ width: 140 }}>
                  {renderAgentInfo(agent, i, isActive, 'center')}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   VARIANT 1 — Live Delegation
   A task card visibly flies from the human lead to an agent.
   ════════════════════════════════════════════════════════════════ */

type DelegationPhase = 'idle' | 'flying' | 'received' | 'done';

export function WmHeroLiveDelegation({
  orderedDepts,
  selectedDeptIndex,
  onDeptChange,
  getCenterImageForIndex,
  getCenterBgColorForIndex,
  deptId,
  deptColor,
  deptAgents,
  deptBoardItems,
  centerAvatarImage,
  centerBgColor,
  isDark,
}: WmHeroVariantProps) {
  const tasks = useMemo(
    () => deptBoardItems.filter((b) => b.agentWorking).slice(0, 5),
    [deptBoardItems],
  );
  const fallbackTasks = useMemo(() => deptBoardItems.slice(0, 5), [deptBoardItems]);
  const taskList = tasks.length > 0 ? tasks : fallbackTasks;

  const [phase, setPhase] = useState<DelegationPhase>('idle');
  const [taskIdx, setTaskIdx] = useState(0);

  useEffect(() => {
    setPhase('idle');
    setTaskIdx(0);
  }, [deptId]);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    if (phase === 'idle') {
      t = setTimeout(() => setPhase('flying'), 1000);
    } else if (phase === 'flying') {
      t = setTimeout(() => setPhase('received'), 750);
    } else if (phase === 'received') {
      t = setTimeout(() => setPhase('done'), 800);
    } else if (phase === 'done') {
      t = setTimeout(() => {
        setTaskIdx((i) => (i + 1) % taskList.length);
        setPhase('idle');
      }, 1600);
    }
    return () => clearTimeout(t);
  }, [phase, taskList.length]);

  const agent = deptAgents[0];
  const currentTask = taskList[taskIdx];

  const isFlying = phase === 'flying';
  const agentActive = phase === 'received' || phase === 'done';
  const showDone = phase === 'done';

  return (
    <div className="flex flex-col items-center gap-8 sm:gap-10 order-2 w-full">
      <WmDeptTabs
        orderedDepts={orderedDepts}
        selectedDeptIndex={selectedDeptIndex}
        onDeptChange={onDeptChange}
        getCenterImageForIndex={getCenterImageForIndex}
        getCenterBgColorForIndex={getCenterBgColorForIndex}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={deptId}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="w-full flex flex-col items-center gap-6"
        >
          {/* Human ←→ Agent area */}
          <div className="relative flex items-center justify-center gap-10 sm:gap-16 w-full">

            {/* Human avatar */}
            <div className="flex flex-col items-center gap-2">
              <motion.div
                animate={{
                  boxShadow: phase === 'idle'
                    ? `0 0 0 0 ${centerBgColor}00`
                    : `0 0 24px 8px ${centerBgColor}30`,
                }}
                transition={{ duration: 0.4 }}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden ring-[3px] ring-offset-4 ring-offset-white dark:ring-offset-[#0a0a0a]"
                style={{
                  backgroundColor: centerBgColor,
                  ['--tw-ring-color' as string]: `${centerBgColor}80`,
                }}
              >
                {centerAvatarImage ? (
                  <img src={centerAvatarImage} alt="Team Lead" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-white font-bold text-3xl">H</span>
                  </div>
                )}
              </motion.div>
              <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-400">Team Lead</span>
              <span
                className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                style={{ color: deptColor, backgroundColor: `${deptColor}15` }}
              >
                Human
              </span>
            </div>

            {/* Flying task card */}
            <div className="absolute inset-0 pointer-events-none overflow-visible">
              <AnimatePresence>
                {phase !== 'done' && currentTask && (
                  <motion.div
                    key={`${deptId}-${taskIdx}-card`}
                    initial={{ x: '-120px', y: 8, opacity: 0, scale: 0.85 }}
                    animate={
                      isFlying || agentActive
                        ? { x: '80px', y: -12, opacity: 1, scale: 1 }
                        : { x: '-120px', y: 8, opacity: 1, scale: 1 }
                    }
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{
                      x: { type: 'spring', stiffness: 180, damping: 22, mass: 0.7 },
                      y: { type: 'spring', stiffness: 200, damping: 24 },
                      opacity: { duration: 0.25 },
                      scale: { duration: 0.25 },
                    }}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                  >
                    <div
                      className="px-3 py-2 rounded-xl shadow-lg border text-[11px] font-semibold text-gray-700 dark:text-gray-200 whitespace-nowrap"
                      style={{
                        backgroundColor: isDark ? '#1e1e1e' : '#ffffff',
                        borderColor: isDark ? `${deptColor}30` : '#e5e7eb',
                        boxShadow: `0 4px 16px ${deptColor}20, 0 2px 6px rgba(0,0,0,0.08)`,
                      }}
                    >
                      {currentTask.label}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Arrow connector */}
            <div className="flex flex-col items-center gap-1">
              <motion.div
                animate={{ opacity: isFlying ? 1 : 0.25, scale: isFlying ? 1.1 : 1 }}
                transition={{ duration: 0.3 }}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${deptColor}20`, color: deptColor }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.div>
            </div>

            {/* Agent avatar */}
            <div className="flex flex-col items-center gap-2 relative">
              {/* Glow ring when receiving */}
              <AnimatePresence>
                {agentActive && (
                  <motion.div
                    key="agent-glow"
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1.15 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{
                      boxShadow: `0 0 32px 12px ${agent?.bgColor ?? deptColor}40`,
                      borderRadius: '50%',
                    }}
                  />
                )}
              </AnimatePresence>

              <motion.div
                animate={{
                  scale: agentActive ? [1, 1.06, 1] : 1,
                  filter: agentActive ? 'brightness(1.1)' : 'brightness(1)',
                }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden ring-[3px] ring-offset-4 ring-offset-white dark:ring-offset-[#0a0a0a] relative z-10"
                style={{
                  background: agent
                    ? `linear-gradient(145deg, ${agent.bgColor}cc, ${agent.bgColor})`
                    : `#6161ff`,
                  ['--tw-ring-color' as string]: `${agent?.bgColor ?? deptColor}80`,
                }}
              >
                {agent?.img && (
                  <img
                    src={agent.img}
                    alt={agent.label}
                    className="w-full h-full object-contain object-bottom"
                    onError={(e) => {
                      if (agent.fallback) (e.target as HTMLImageElement).src = agent.fallback;
                    }}
                  />
                )}
              </motion.div>

              {/* Sparkle badge */}
              <div
                className="absolute -bottom-1 right-2 w-6 h-6 rounded-full flex items-center justify-center border-2 border-white dark:border-[#0a0a0a] z-20"
                style={{
                  background: agent
                    ? `linear-gradient(135deg, ${agent.bgColor}, ${agent.bgColor}cc)`
                    : '#6161ff',
                  boxShadow: `0 2px 8px ${agent?.bgColor ?? '#6161ff'}50`,
                }}
              >
                <Sparkles className="w-3 h-3 text-white" />
              </div>

              <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 relative z-10">
                {agent?.label ?? 'AI Agent'}
              </span>
              <span
                className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                style={{ color: agent?.bgColor ?? '#6161ff', backgroundColor: `${agent?.bgColor ?? '#6161ff'}15` }}
              >
                Agent
              </span>
            </div>
          </div>

          {/* Done confirmation */}
          <div className="h-10 flex items-center justify-center">
            <AnimatePresence>
              {showDone && (
                <motion.div
                  key="done-badge"
                  initial={{ opacity: 0, scale: 0.8, y: 6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -4 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
                  style={{
                    color: '#00ca72',
                    backgroundColor: '#00ca7215',
                    border: '1px solid #00ca7230',
                  }}
                >
                  <CheckCheck className="w-4 h-4" />
                  Done — task complete
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Current task label (idle/loading indicator) */}
          <div className="h-6 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {phase === 'idle' && currentTask && (
                <motion.p
                  key={taskIdx}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="text-xs text-gray-400 dark:text-gray-500"
                >
                  Next: <span className="text-gray-600 dark:text-gray-300 font-medium">{currentTask.label}</span>
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   VARIANT 2 — Cinematic Assembly
   Squad members materialize one by one. Agents: glow burst then
   avatar. Humans: soft slide-in. Resets on dept change.
   ════════════════════════════════════════════════════════════════ */

export function WmHeroCinematicAssembly({
  orderedDepts,
  selectedDeptIndex,
  onDeptChange,
  getCenterImageForIndex,
  getCenterBgColorForIndex,
  deptId,
  deptColor,
  avatarColor,
  squadMembers,
  centerAvatarImage,
  centerBgColor,
  sideAvatarPool,
  memberAvatarOverrides = {},
}: WmHeroVariantProps) {
  const [revealCount, setRevealCount] = useState(0);

  useEffect(() => {
    setRevealCount(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    squadMembers.forEach((_, i) => {
      timers.push(
        setTimeout(() => setRevealCount((c) => Math.max(c, i + 1)), 300 + i * 280),
      );
    });
    return () => timers.forEach(clearTimeout);
  }, [deptId, squadMembers.length]);

  const centerIndex = squadMembers.findIndex((m) => m.role === 'Team Lead');

  return (
    <div className="flex flex-col items-center gap-8 sm:gap-10 order-2 w-full">
      <WmDeptTabs
        orderedDepts={orderedDepts}
        selectedDeptIndex={selectedDeptIndex}
        onDeptChange={onDeptChange}
        getCenterImageForIndex={getCenterImageForIndex}
        getCenterBgColorForIndex={getCenterBgColorForIndex}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={deptId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col items-center gap-5"
        >
          {/* Avatar strip */}
          <div className="flex items-end justify-center -space-x-5 sm:-space-x-6 md:-space-x-7">
            {squadMembers.map((member, i) => {
              const isCenter = member.role === 'Team Lead';
              const revealed = revealCount > i;
              const isAgent = member.isAgent;
              const distFromCenter = Math.abs(i - centerIndex);
              const zIdx = isCenter ? 15 : Math.max(1, squadMembers.length - distFromCenter);

              const size = isCenter
                ? 'w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36'
                : 'w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28';

              const humanAvatar = isCenter
                ? centerAvatarImage
                : memberAvatarOverrides[member.id]
                  ? memberAvatarOverrides[member.id]
                  : sideAvatarPool.length > 0
                    ? sideAvatarPool[(selectedDeptIndex + i * 5 + 1) % sideAvatarPool.length]?.image
                    : null;

              const showImage = isAgent ? member.img : humanAvatar;
              const ringColor = isAgent ? member.bgColor : avatarColor;

              return (
                <div
                  key={member.id}
                  className="flex flex-col items-center gap-2.5 flex-shrink-0"
                  style={{ zIndex: zIdx }}
                >
                  <div className="relative">
                    {/* Agent: expanding glow ring that appears before avatar */}
                    {isAgent && (
                      <AnimatePresence>
                        {revealed && (
                          <motion.div
                            key="agent-ring"
                            initial={{ scale: 0.3, opacity: 0.9 }}
                            animate={{ scale: 1.4, opacity: 0 }}
                            transition={{ duration: 0.9, ease: 'easeOut' }}
                            className="absolute -inset-2 rounded-full pointer-events-none"
                            style={{
                              background: `radial-gradient(circle, ${member.bgColor}50 0%, transparent 70%)`,
                              boxShadow: `0 0 28px ${member.bgColor}60`,
                            }}
                          />
                        )}
                      </AnimatePresence>
                    )}

                    {/* Persistent agent ambient glow */}
                    {isAgent && revealed && (
                      <div
                        className="absolute -inset-1.5 rounded-full pointer-events-none"
                        style={{
                          background: `radial-gradient(circle, ${member.bgColor}20 0%, transparent 70%)`,
                        }}
                      />
                    )}

                    {/* Avatar */}
                    <motion.div
                      initial={isAgent
                        ? { scale: 0, opacity: 0 }
                        : { x: i < centerIndex ? -30 : 30, opacity: 0 }}
                      animate={revealed
                        ? { scale: 1, x: 0, opacity: 1 }
                        : isAgent
                          ? { scale: 0, opacity: 0 }
                          : { x: i < centerIndex ? -30 : 30, opacity: 0 }}
                      transition={isAgent
                        ? { type: 'spring', stiffness: 280, damping: 18, delay: 0.1 }
                        : { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className={`${size} rounded-full overflow-hidden flex-shrink-0 shadow-lg relative z-10 ring-2 ring-offset-2 ring-offset-white dark:ring-offset-[#0a0a0a]`}
                      style={{
                        background: isAgent
                          ? `linear-gradient(145deg, ${member.bgColor}cc, ${member.bgColor})`
                          : centerBgColor,
                        ['--tw-ring-color' as string]: isAgent ? `${member.bgColor}70` : `${avatarColor}50`,
                      }}
                    >
                      {showImage ? (
                        <img
                          src={showImage}
                          alt={member.label}
                          className={`w-full h-full ${isAgent ? 'object-contain object-bottom' : 'object-cover'}`}
                          onError={(e) => {
                            if (member.fallback && isAgent) {
                              (e.target as HTMLImageElement).src = member.fallback;
                            }
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className={`text-white font-bold ${isCenter ? 'text-2xl' : 'text-base'}`}>
                            {member.label.charAt(0)}
                          </span>
                        </div>
                      )}
                    </motion.div>

                    {/* Agent sparkle badge */}
                    {isAgent && revealed && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: 'spring', stiffness: 400 }}
                        className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center z-20 border-2 border-white dark:border-[#0a0a0a]"
                        style={{
                          background: `linear-gradient(135deg, ${member.bgColor}, ${member.bgColor}cc)`,
                          boxShadow: `0 2px 8px ${member.bgColor}50`,
                        }}
                      >
                        <Sparkles className="w-2.5 h-2.5 text-white" />
                      </motion.div>
                    )}
                  </div>

                  {/* Label */}
                  <motion.span
                    initial={{ opacity: 0, y: 4 }}
                    animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="text-xs font-medium text-center max-w-[5rem] leading-tight min-h-[2rem]"
                    style={{ color: revealed ? (isAgent ? member.bgColor : deptColor) : '#9ca3af' }}
                  >
                    {member.label}
                  </motion.span>
                </div>
              );
            })}
          </div>

          {/* Assembly progress message */}
          <div className="h-8 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {revealCount < squadMembers.length ? (
                <motion.p
                  key="assembling"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-gray-400 dark:text-gray-500"
                >
                  Assembling your squad…
                </motion.p>
              ) : (
                <motion.p
                  key="ready"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-xs font-semibold"
                  style={{ color: deptColor }}
                >
                  Squad ready — {squadMembers.filter((m) => m.isAgent).length} agents deployed
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   VARIANT 3 — Split Reveal
   Agents start fully grayscale; each one gets a color-splash
   reveal that floods in from center outward with a glow pulse.
   ════════════════════════════════════════════════════════════════ */

export function WmHeroSplitReveal({
  orderedDepts,
  selectedDeptIndex,
  onDeptChange,
  getCenterImageForIndex,
  getCenterBgColorForIndex,
  deptId,
  deptColor,
  avatarColor,
  squadMembers,
  centerAvatarImage,
  centerBgColor,
  sideAvatarPool,
  isDark,
  splitPhase = 'together',
  deptJtbd = [],
  rosterLayout = 'mirrored',
  memberAvatarOverrides = {},
}: WmHeroVariantProps) {
  const agentIndices = useMemo(
    () => squadMembers.map((m, i) => ({ i, isAgent: m.isAgent })).filter((x) => x.isAgent).map((x) => x.i),
    [squadMembers],
  );

  const humansOnly = useMemo(() => squadMembers.filter(m => !m.isAgent), [squadMembers]);
  const agentsOnly = useMemo(() => squadMembers.filter(m => m.isAgent), [squadMembers]);

  const [revealedAgents, setRevealedAgents] = useState<Set<number>>(new Set());
  const [pulsing, setPulsing] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (splitPhase === 'chatting') return;
    setRevealedAgents(new Set());
    setPulsing(new Set());

    const timers: ReturnType<typeof setTimeout>[] = [];
    agentIndices.forEach((memberIdx, revealOrder) => {
      const delay = 900 + revealOrder * 450;
      timers.push(
        setTimeout(() => {
          setRevealedAgents((prev) => new Set([...prev, memberIdx]));
          setPulsing((prev) => new Set([...prev, memberIdx]));
          setTimeout(() => {
            setPulsing((prev) => {
              const next = new Set(prev);
              next.delete(memberIdx);
              return next;
            });
          }, 900);
        }, delay),
      );
    });

    return () => timers.forEach(clearTimeout);
  }, [deptId, agentIndices.length, splitPhase]);

  const centerIndex = squadMembers.findIndex((m) => m.role === 'Team Lead');

  return (
    <div className="flex flex-col items-center gap-8 sm:gap-10 order-2 w-full">
      <WmDeptTabs
        orderedDepts={orderedDepts}
        selectedDeptIndex={selectedDeptIndex}
        onDeptChange={onDeptChange}
        getCenterImageForIndex={getCenterImageForIndex}
        getCenterBgColorForIndex={getCenterBgColorForIndex}
      />

      <AnimatePresence mode="popLayout">
        {splitPhase === 'chatting' ? (
          <motion.div
            key={`${deptId}-roster`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <SplitRosterView
              humans={humansOnly}
              agents={agentsOnly}
              centerAvatarImage={centerAvatarImage}
              centerBgColor={centerBgColor}
              sideAvatarPool={sideAvatarPool}
              selectedDeptIndex={selectedDeptIndex}
              avatarColor={avatarColor}
              isDark={isDark}
              deptId={deptId}
              deptJtbd={deptJtbd}
              layout={rosterLayout}
              memberAvatarOverrides={memberAvatarOverrides}
            />
          </motion.div>
        ) : (
        <motion.div
          key={deptId}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center gap-5"
        >
          {/* Avatar strip */}
          <div className="flex items-end justify-center -space-x-5 sm:-space-x-6 md:-space-x-7">
            {squadMembers.map((member, i) => {
              const isCenter = member.role === 'Team Lead';
              const isAgent = member.isAgent;
              const isRevealed = isAgent ? revealedAgents.has(i) : true;
              const isPulsing = pulsing.has(i);
              const distFromCenter = Math.abs(i - centerIndex);
              const zIdx = isCenter ? 15 : Math.max(1, squadMembers.length - distFromCenter);

              const size = isCenter
                ? 'w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36'
                : 'w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28';

              const humanAvatar = isCenter
                ? centerAvatarImage
                : memberAvatarOverrides[member.id]
                  ? memberAvatarOverrides[member.id]
                  : sideAvatarPool.length > 0
                    ? sideAvatarPool[(selectedDeptIndex + i * 5 + 1) % sideAvatarPool.length]?.image
                    : null;

              const showImage = isAgent ? member.img : humanAvatar;
              const ringColor = isAgent ? member.bgColor : avatarColor;

              return (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.06, duration: 0.35 }}
                  className="flex flex-col items-center gap-2.5 flex-shrink-0"
                  style={{ zIndex: zIdx }}
                >
                  <div className="relative">
                    <AnimatePresence>
                      {isPulsing && (
                        <motion.div
                          key="pulse"
                          initial={{ scale: 0.8, opacity: 0.8 }}
                          animate={{ scale: 1.6, opacity: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.9, ease: 'easeOut' }}
                          className="absolute -inset-2 rounded-full pointer-events-none"
                          style={{
                            background: `radial-gradient(circle, ${member.bgColor}45 0%, transparent 70%)`,
                            boxShadow: `0 0 32px ${member.bgColor}50`,
                          }}
                        />
                      )}
                    </AnimatePresence>

                    {isAgent && isRevealed && !isPulsing && (
                      <div
                        className="absolute -inset-1.5 rounded-full pointer-events-none transition-opacity duration-500"
                        style={{
                          background: `radial-gradient(circle, ${member.bgColor}20 0%, transparent 70%)`,
                        }}
                      />
                    )}

                    <motion.div
                      layoutId={`avatar-${member.id}`}
                      className={`${size} rounded-full overflow-hidden flex-shrink-0 shadow-lg relative z-10 ring-2 ring-offset-2 ring-offset-white dark:ring-offset-[#0a0a0a]`}
                      animate={{
                        filter: isAgent && !isRevealed ? 'grayscale(1) brightness(0.85)' : 'grayscale(0) brightness(1)',
                        scale: isPulsing ? [1, 1.07, 1] : 1,
                      }}
                      transition={{
                        layout: { type: 'spring', stiffness: 200, damping: 25, mass: 0.8 },
                        filter: { duration: 0.6, ease: 'easeOut' },
                        scale: { duration: 0.6, ease: 'easeInOut' },
                      }}
                      style={{
                        background: isAgent
                          ? `linear-gradient(145deg, ${member.bgColor}cc, ${member.bgColor})`
                          : centerBgColor,
                        ['--tw-ring-color' as string]: isRevealed
                          ? `${ringColor}70`
                          : 'rgba(156,163,175,0.4)',
                      }}
                    >
                      {showImage ? (
                        <img
                          src={showImage}
                          alt={member.label}
                          className={`w-full h-full ${isAgent ? 'object-contain object-bottom' : 'object-cover'}`}
                          onError={(e) => {
                            if (member.fallback && isAgent) {
                              (e.target as HTMLImageElement).src = member.fallback;
                            }
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className={`text-white font-bold ${isCenter ? 'text-2xl' : 'text-base'}`}>
                            {member.label.charAt(0)}
                          </span>
                        </div>
                      )}
                    </motion.div>

                    {isAgent && (
                      <AnimatePresence>
                        {isRevealed && (
                          <motion.div
                            key="sparkle"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 400 }}
                            className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center z-20 border-2 border-white dark:border-[#0a0a0a]"
                            style={{
                              background: `linear-gradient(135deg, ${member.bgColor}, ${member.bgColor}cc)`,
                              boxShadow: `0 2px 8px ${member.bgColor}50`,
                            }}
                          >
                            <Sparkles className="w-2.5 h-2.5 text-white" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </div>

                  <motion.span
                    animate={{
                      color: isAgent
                        ? isRevealed
                          ? member.bgColor
                          : '#9ca3af'
                        : deptColor,
                    }}
                    transition={{ duration: 0.5 }}
                    className="text-xs font-medium text-center max-w-[5rem] leading-tight min-h-[2rem]"
                  >
                    {member.label}
                  </motion.span>
                </motion.div>
              );
            })}
          </div>

          {/* Reveal status */}
          <div className="h-8 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {revealedAgents.size < agentIndices.length ? (
                <motion.p
                  key="revealing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-gray-400 dark:text-gray-500"
                >
                  AI agents joining your team…
                </motion.p>
              ) : (
                <motion.div
                  key="all-revealed"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-2 text-xs font-semibold"
                  style={{ color: deptColor }}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {agentIndices.length} agents active — working alongside your team
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   VARIANT 4 — Roster Board
   Squad presented inside a polished dark product-UI card with
   labeled avatar rows, lead-image highlight, and department
   color accents — inspired by the admin panel aesthetic.
   ════════════════════════════════════════════════════════════════ */

export function WmHeroRosterBoard({
  orderedDepts,
  selectedDeptIndex,
  onDeptChange,
  getCenterImageForIndex,
  getCenterBgColorForIndex,
  deptId,
  deptColor,
  deptName,
  deptDescription,
  deptAgents,
  avatarColor,
  squadMembers,
  centerAvatarImage,
  centerBgColor,
  sideAvatarPool,
  isDark,
  memberAvatarOverrides = {},
}: WmHeroVariantProps) {
  const [litAgentIdx, setLitAgentIdx] = useState(-1);

  useEffect(() => {
    setLitAgentIdx(-1);
    const t = setTimeout(() => setLitAgentIdx(0), 800);
    return () => clearTimeout(t);
  }, [deptId]);

  useEffect(() => {
    if (deptAgents.length === 0) return;
    const id = setInterval(() => {
      setLitAgentIdx((prev) => (prev + 1) % deptAgents.length);
    }, 3000);
    return () => clearInterval(id);
  }, [deptAgents.length, deptId]);

  const centerIndex = squadMembers.findIndex((m) => m.role === 'Team Lead');

  return (
    <div className="flex flex-col items-center gap-8 sm:gap-10 order-2 w-full">
      <WmDeptTabs
        orderedDepts={orderedDepts}
        selectedDeptIndex={selectedDeptIndex}
        onDeptChange={onDeptChange}
        getCenterImageForIndex={getCenterImageForIndex}
        getCenterBgColorForIndex={getCenterBgColorForIndex}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={deptId}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-[520px]"
        >
          {/* Main dark card */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              backgroundColor: isDark ? '#141414' : '#1a1a1a',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow:
                '0 20px 60px -12px rgba(0,0,0,0.5), 0 4px 20px -4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)',
            }}
          >
            {/* Card header: icon + name + description + color swatch */}
            <div className="flex items-center gap-3.5 px-6 pt-6 pb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: `${deptColor}20`,
                }}
              >
                {(() => {
                  const dept = orderedDepts[selectedDeptIndex];
                  if (!dept) return null;
                  const DepIcon = dept.icon;
                  return <DepIcon className="w-5 h-5" style={{ color: deptColor }} strokeWidth={2} />;
                })()}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[15px] font-bold text-white tracking-tight">
                  {deptName}
                </h3>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  {deptDescription || 'Department squad'}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                  Color
                </span>
                <div
                  className="w-6 h-6 rounded-md flex-shrink-0"
                  style={{ backgroundColor: deptColor }}
                />
              </div>
            </div>

            {/* Divider */}
            <div className="h-px mx-5" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />

            {/* Lead image label */}
            <div className="px-6 pt-4 pb-2">
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                Lead Image
              </span>
            </div>

            {/* Avatar row */}
            <div className="px-6 pb-5">
              <div className="flex items-center -space-x-3">
                {/* Department icon as first element */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-[1]"
                  style={{
                    backgroundColor: `${deptColor}25`,
                    border: '2px solid rgba(255,255,255,0.06)',
                  }}
                >
                  {(() => {
                    const dept = orderedDepts[selectedDeptIndex];
                    if (!dept) return null;
                    const DepIcon = dept.icon;
                    return <DepIcon className="w-4 h-4" style={{ color: deptColor }} strokeWidth={2} />;
                  })()}
                </div>

                {/* Squad member avatars */}
                {squadMembers.map((member, i) => {
                  const isCenter = member.role === 'Team Lead';
                  const isAgent = member.isAgent;
                  const agentGlobalIdx = isAgent
                    ? deptAgents.findIndex((a) => a.label === member.label)
                    : -1;
                  const isLitAgent = isAgent && agentGlobalIdx === litAgentIdx;

                  const humanAvatar = isCenter
                    ? centerAvatarImage
                    : memberAvatarOverrides[member.id]
                      ? memberAvatarOverrides[member.id]
                      : sideAvatarPool.length > 0
                        ? sideAvatarPool[(selectedDeptIndex + i * 5 + 1) % sideAvatarPool.length]?.image
                        : null;
                  const showImage = isAgent ? member.img : humanAvatar;

                  const size = isCenter ? 'w-14 h-14' : 'w-10 h-10';
                  const distFromCenter = Math.abs(i - centerIndex);
                  const zIdx = isCenter ? 15 : isLitAgent ? 20 : Math.max(2, squadMembers.length - distFromCenter + 1);

                  return (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06, duration: 0.3 }}
                      className="relative flex-shrink-0"
                      style={{ zIndex: zIdx }}
                    >
                      {/* Lead highlight ring */}
                      {isCenter && (
                        <motion.div
                          className="absolute -inset-[3px] rounded-full pointer-events-none"
                          style={{
                            border: `2.5px solid ${deptColor}`,
                            boxShadow: `0 0 12px ${deptColor}40`,
                          }}
                          animate={{ opacity: [0.7, 1, 0.7] }}
                          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                        />
                      )}

                      {/* Lit agent glow */}
                      {isLitAgent && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1.1 }}
                          className="absolute -inset-1.5 rounded-full pointer-events-none"
                          style={{
                            background: `radial-gradient(circle, ${member.bgColor}35 0%, transparent 70%)`,
                            boxShadow: `0 0 16px ${member.bgColor}40`,
                          }}
                        />
                      )}

                      <div
                        className={`${size} rounded-full overflow-hidden flex-shrink-0`}
                        style={{
                          background: isAgent
                            ? `linear-gradient(145deg, ${member.bgColor}cc, ${member.bgColor})`
                            : centerBgColor,
                          border: isCenter
                            ? 'none'
                            : `2px solid ${isDark ? '#141414' : '#1a1a1a'}`,
                          boxShadow: isLitAgent
                            ? `0 0 12px ${member.bgColor}50`
                            : '0 2px 4px rgba(0,0,0,0.3)',
                        }}
                      >
                        {showImage ? (
                          <img
                            src={showImage}
                            alt={member.label}
                            className={`w-full h-full ${isAgent ? 'object-contain object-bottom' : 'object-cover'}`}
                            onError={(e) => {
                              if (member.fallback && isAgent) {
                                (e.target as HTMLImageElement).src = member.fallback;
                              }
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className={`text-white font-bold ${isCenter ? 'text-lg' : 'text-[10px]'}`}>
                              {member.label.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Agent sparkle badge */}
                      {isAgent && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.3 + i * 0.06, type: 'spring', stiffness: 400 }}
                          className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center border-2 z-20"
                          style={{
                            borderColor: isDark ? '#141414' : '#1a1a1a',
                            background: `linear-gradient(135deg, ${member.bgColor}, ${member.bgColor}cc)`,
                          }}
                        >
                          <Sparkles className="w-2 h-2 text-white" />
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Divider */}
            <div className="h-px mx-5" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />

            {/* Status line */}
            <div className="px-6 py-4">
              <div className="h-6 flex items-center">
                <AnimatePresence mode="wait">
                  {litAgentIdx >= 0 && deptAgents[litAgentIdx] && (
                    <motion.div
                      key={`${deptId}-${litAgentIdx}`}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-2.5"
                    >
                      <div
                        className="w-5 h-5 rounded-lg overflow-hidden flex-shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${deptAgents[litAgentIdx].bgColor}90, ${deptAgents[litAgentIdx].bgColor}cc)`,
                        }}
                      >
                        <img
                          src={deptAgents[litAgentIdx].img}
                          alt=""
                          className="w-full h-full object-contain object-bottom"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = deptAgents[litAgentIdx].fallback;
                          }}
                        />
                      </div>
                      <motion.span
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: deptAgents[litAgentIdx].bgColor }}
                      />
                      <span className="text-[11px] text-gray-400">
                        <span className="font-semibold text-gray-300">
                          {deptAgents[litAgentIdx].label}
                        </span>
                        {' — '}
                        {deptAgents[litAgentIdx].status}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
