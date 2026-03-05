"use client";

import { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  Sparkles,
  Bot,
  LayoutGrid,
  Send,
} from 'lucide-react';
import { useDepartments } from '@/hooks/useSupabase';
import { WORK_MANAGEMENT_TRIAL_URL } from '@/lib/workManagementUrls';
import {
  DEPARTMENTS,
  STATUS_CONFIG,
  PROGRESS_BY_COL,
  type BoardItem,
  type AgentInfo,
} from './wmDepartmentData';
import { SQUAD_DEPARTMENTS } from './WorkManagementSquadSection';

/* ─── Floating agent cursor ─── */

function FloatingAgentCursor({
  agent,
  x,
  y,
  deptColor,
}: {
  agent: AgentInfo;
  x: number;
  y: number;
  deptColor: string;
}) {
  return (
    <motion.div
      animate={{ left: `${x}%`, top: `${y}%` }}
      transition={{ type: 'spring', stiffness: 120, damping: 20, mass: 0.8 }}
      className="absolute z-30 pointer-events-none"
      style={{ transform: 'translate(-50%, -50%)' }}
    >
      <div className="flex items-center gap-2">
        <div
          className="w-9 h-9 rounded-xl overflow-hidden shadow-md flex-shrink-0"
          style={{
            border: `2px solid ${deptColor}`,
            background: `linear-gradient(135deg, ${agent.bgColor}90, ${agent.bgColor}cc)`,
          }}
        >
          <img
            src={agent.img}
            alt={agent.label}
            className="w-full h-full object-contain object-bottom"
            onError={(e) => {
              (e.target as HTMLImageElement).src = agent.fallback;
            }}
          />
        </div>
        <div
          className="flex items-center gap-1.5 bg-white/95 backdrop-blur-sm rounded-full px-2 py-1 shadow-sm"
          style={{ border: `1px solid ${deptColor}30` }}
        >
          <motion.span
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: deptColor }}
          />
          <span className="text-[10px] font-semibold text-gray-700 whitespace-nowrap">
            {agent.label}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Floating human cursor ─── */

function FloatingHumanCursor({
  name,
  color,
  x,
  y,
}: {
  name: string;
  color: string;
  x: number;
  y: number;
}) {
  return (
    <motion.div
      animate={{ left: `${x}%`, top: `${y}%` }}
      transition={{ type: 'spring', stiffness: 70, damping: 16, mass: 1.4 }}
      className="absolute z-[19] pointer-events-none"
      style={{ transform: 'translate(-2px, -2px)' }}
    >
      <svg width="12" height="16" viewBox="0 0 14 18" fill="none" className="drop-shadow-sm">
        <path
          d="M1 1L1 13.5L4.8 10L8 16.5L10.5 15.2L7.3 9L12.5 9L1 1Z"
          fill={color}
          stroke="white"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
      <div
        className="flex items-center gap-1 rounded-full px-1.5 py-px shadow-sm mt-0.5 ml-2"
        style={{ backgroundColor: `${color}ee` }}
      >
        <span className="text-[8px] font-semibold text-white whitespace-nowrap">{name}</span>
      </div>
    </motion.div>
  );
}

/* ─── Cursor position hooks ─── */

const HUMAN_WAYPOINTS = [
  { x: 48, y: 38 },
  { x: 55, y: 52 },
  { x: 62, y: 65 },
  { x: 50, y: 45 },
  { x: 58, y: 58 },
  { x: 52, y: 72 },
];

function useFloatingCursors(boardItems: BoardItem[], deptId: string) {
  const positions = useMemo(() => {
    return boardItems.slice(0, 6).map((item, idx) => ({
      x: 52 + (idx % 3) * 14,
      y: 30 + idx * 10,
      cardId: item.id,
    }));
  }, [boardItems]);

  const [tickA, setTickA] = useState(0);
  const [tickB, setTickB] = useState(0);

  useEffect(() => {
    setTickA(0);
    setTickB(0);
  }, [deptId]);

  useEffect(() => {
    if (positions.length === 0) return;
    const id = setInterval(() => setTickA((t) => t + 1), 3800);
    return () => clearInterval(id);
  }, [positions.length, deptId]);

  useEffect(() => {
    if (positions.length < 2) return;
    const id = setInterval(() => setTickB((t) => t + 1), 4600);
    return () => clearInterval(id);
  }, [positions.length, deptId]);

  const n = positions.length;
  const idxA = n > 0 ? tickA % n : -1;
  const offset = Math.max(1, Math.floor(n / 2));
  const idxB = n >= 2 ? (tickB + offset) % n : -1;

  const posA = idxA >= 0 ? positions[idxA] : null;
  const posB = idxB >= 0 ? positions[idxB] : null;

  return { posA, posB };
}

function useHumanCursor(deptId: string) {
  const [tick, setTick] = useState(0);

  useEffect(() => { setTick(0); }, [deptId]);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 5400);
    return () => clearInterval(id);
  }, [deptId]);

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
}: {
  agent: AgentInfo;
  isLit: boolean;
  deptColor: string;
  delay: number;
  status?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.35 }}
      className="flex items-center gap-3 relative"
    >
      {/* Glow backdrop */}
      <AnimatePresence>
        {isLit && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1.15 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4 }}
            className="absolute -inset-1 rounded-xl pointer-events-none z-0"
            style={{
              background: `radial-gradient(ellipse at left, ${agent.bgColor}30 0%, transparent 70%)`,
            }}
          />
        )}
      </AnimatePresence>

      {/* Avatar */}
      <motion.div
        animate={isLit ? { scale: [1, 1.08, 1] } : { scale: 1 }}
        transition={isLit ? { duration: 1.4, ease: 'easeInOut' } : { duration: 0.3 }}
        className="relative z-10 flex-shrink-0"
      >
        <div
          className={`w-11 h-11 rounded-xl overflow-hidden transition-all duration-300 ${
            isLit ? 'ring-[2.5px] ring-offset-2 ring-offset-white shadow-lg' : 'ring-1 ring-gray-200'
          }`}
          style={{
            background: `linear-gradient(145deg, ${agent.bgColor}cc, ${agent.bgColor})`,
            ...(isLit ? { ['--tw-ring-color' as string]: agent.bgColor } : {}),
          }}
        >
          <img
            src={agent.img}
            alt={agent.label}
            className="w-full h-full object-contain object-bottom"
            onError={(e) => {
              (e.target as HTMLImageElement).src = agent.fallback;
            }}
          />
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay + 0.2, type: 'spring', stiffness: 400 }}
          className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center z-20"
          style={{
            background: `linear-gradient(135deg, ${agent.bgColor}, ${agent.bgColor}cc)`,
            border: '2px solid white',
          }}
        >
          <Sparkles className="w-2 h-2 text-white" />
        </motion.div>
      </motion.div>

      {/* Info */}
      <div className="min-w-0 z-10">
        <p className="text-[12px] font-semibold text-gray-900 truncate">{agent.label}</p>
        <AnimatePresence mode="wait">
          {isLit && status ? (
            <motion.p
              key="status"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="text-[10px] font-medium flex items-center gap-1"
              style={{ color: deptColor }}
            >
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: deptColor }}
              />
              {status}
            </motion.p>
          ) : (
            <motion.p
              key="role"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[10px] text-gray-400 font-medium"
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
            isLit ? `${ringSize} ring-offset-2 ring-offset-white shadow-lg` : 'ring-1 ring-gray-200'
          }`}
          style={{
            backgroundColor: color,
            ...(isLit ? { ['--tw-ring-color' as string]: color } : {}),
          }}
        >
          {avatarImage ? (
            <img src={avatarImage} alt={label} className="w-full h-full object-cover" />
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
        <p className={`font-semibold text-gray-900 truncate ${isLead ? 'text-[13px]' : 'text-[12px]'}`}>
          {label}
        </p>
        <p className="text-[10px] text-gray-400 font-medium">
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
}: {
  item: BoardItem;
  agents: AgentInfo[];
  deptColor: string;
  isHighlighted: boolean;
  delay: number;
}) {
  const status = STATUS_CONFIG[item.columnIndex] || STATUS_CONFIG[0];
  const progress = PROGRESS_BY_COL[item.columnIndex] || 0;
  const agentIdx = item.agentWorking ? Math.abs(item.id.charCodeAt(item.id.length - 1)) % agents.length : -1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{
        opacity: 1,
        y: 0,
        backgroundColor: isHighlighted ? `${deptColor}08` : 'transparent',
      }}
      transition={{ delay, duration: 0.25 }}
      className="grid grid-cols-[1fr_48px_72px_60px] gap-2 px-3 py-2.5 border-b border-gray-50 rounded-md transition-colors"
      style={{
        boxShadow: isHighlighted ? `inset 3px 0 0 ${deptColor}` : 'none',
      }}
    >
      <span className="text-[11px] text-gray-800 font-medium truncate">{item.label}</span>

      <div className="flex items-center justify-center">
        {agentIdx >= 0 ? (
          <motion.div
            animate={isHighlighted ? { scale: [1, 1.15, 1] } : {}}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            className="w-6 h-6 rounded-lg overflow-hidden shadow-sm"
            style={{
              background: `linear-gradient(135deg, ${agents[agentIdx].bgColor}90, ${agents[agentIdx].bgColor}cc)`,
            }}
          >
            <img
              src={agents[agentIdx].img}
              alt=""
              className="w-full h-full object-contain object-bottom"
              onError={(e) => {
                (e.target as HTMLImageElement).src = agents[agentIdx].fallback;
              }}
            />
          </motion.div>
        ) : (
          <div className="w-6 h-6" />
        )}
      </div>

      <div className="flex items-center">
        <span
          className="text-[9px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap"
          style={{ color: status.color, backgroundColor: status.bg }}
        >
          {status.label}
        </span>
      </div>

      <div className="flex items-center">
        <div className="h-1.5 rounded-full bg-gray-100 w-full overflow-hidden">
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

/* ─── Light-up sync hook ─── */

function useLightUpSync(boardItems: BoardItem[], agents: AgentInfo[], deptId: string) {
  const agentWorkingItems = useMemo(
    () => boardItems.filter((item) => item.agentWorking),
    [boardItems],
  );

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [deptId]);

  useEffect(() => {
    if (agentWorkingItems.length === 0) return;
    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % agentWorkingItems.length);
    }, 3000);
    return () => clearInterval(id);
  }, [agentWorkingItems.length, deptId]);

  const activeItem = agentWorkingItems[activeIndex];
  const activeAgentIdx = activeItem
    ? Math.abs(activeItem.id.charCodeAt(activeItem.id.length - 1)) % agents.length
    : -1;

  const highlightedTaskIds = useMemo(() => {
    const ids = new Set<string>();
    if (activeItem) ids.add(activeItem.id);
    return ids;
  }, [activeItem]);

  const litAgentIndices = useMemo(() => {
    const indices = new Set<number>();
    if (activeAgentIdx >= 0) indices.add(activeAgentIdx);
    return indices;
  }, [activeAgentIdx]);

  return { highlightedTaskIds, litAgentIndices };
}

/* ─── Main component ─── */

export function WorkManagementFirstFold() {
  const [selectedDeptIndex, setSelectedDeptIndex] = useState(0);
  const [selectedJtbd, setSelectedJtbd] = useState(0);
  const { departments: supabaseDepts } = useDepartments();

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

  const dept = DEPARTMENTS[selectedDeptIndex];
  const boardItems = dept.boardItems;
  const avatar = avatarMap[dept.supabaseKey] || avatarMap[dept.name.toLowerCase()] || avatarMap[dept.id];
  const avatarColor = avatar?.color || dept.color;

  const { highlightedTaskIds, litAgentIndices } = useLightUpSync(
    boardItems,
    dept.agents,
    dept.id,
  );

  const handleDeptChange = useCallback((index: number) => {
    setSelectedDeptIndex(index);
    setSelectedJtbd(0);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setSelectedJtbd((prev) => (prev + 1) % dept.jtbd.length);
    }, 5000);
    return () => clearInterval(id);
  }, [dept.jtbd.length, selectedDeptIndex]);

  const { posA, posB } = useFloatingCursors(boardItems, dept.id);
  const humanCursor = useHumanCursor(dept.id);

  return (
    <section className="relative pt-16 sm:pt-20 pb-24 sm:pb-28 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-[1200px] mx-auto">
        {/* Hero: side-by-side layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-10 lg:gap-16 items-center mb-12 lg:mb-16"
        >
          {/* Left: copy */}
          <div className="flex flex-col items-start gap-5 order-1">
            <p className="text-base font-normal text-gray-600 leading-relaxed">
              AI Work Platform
            </p>

            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-3xl sm:text-4xl lg:text-5xl xl:text-[48px] font-bold text-black tracking-[-0.03em] leading-[1.12] max-w-[480px]"
            >
              Any business goal, driven by people and agents
            </motion.h1>

            <p className="text-sm sm:text-base text-gray-500 leading-relaxed max-w-[400px]">
              Your team and AI agents, side by side on every job to be done.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="flex flex-col items-start gap-2.5"
            >
              <a
                href={WORK_MANAGEMENT_TRIAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 h-13 px-6 bg-black hover:bg-gray-800 text-white font-medium text-lg rounded-[40px] transition-colors"
              >
                Get started
                <ArrowRight className="w-5 h-5" strokeWidth={2} />
              </a>
              <p className="text-sm text-[#7c7b7b]">
                Try it out first with a free trial | No credit card required.
              </p>
            </motion.div>
          </div>

          {/* Right: department selector + overlapping squad avatars (aligned) */}
          <div className="flex flex-col items-center gap-10 sm:gap-12 order-2 w-full">
            {/* Department selector bar – larger, more prominent */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex justify-center w-full"
            >
              <div className="inline-flex items-center gap-3 sm:gap-4 px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50">
                {DEPARTMENTS.map((d, i) => {
                  const isSelected = selectedDeptIndex === i;
                  const DepIcon = d.icon;
                  const av = avatarMap[d.supabaseKey] || avatarMap[d.name.toLowerCase()] || avatarMap[d.id];
                  const avColor = av?.color || d.color;
                  return (
                    <motion.button
                      key={d.id}
                      whileTap={{ scale: 0.93 }}
                      onClick={() => handleDeptChange(i)}
                      className="flex flex-col items-center gap-1 cursor-pointer shrink-0 group"
                    >
                      <div className="relative">
                        <div
                          className={`
                            rounded-full overflow-hidden transition-all duration-300
                            ${isSelected
                              ? 'w-10 h-10 sm:w-11 sm:h-11 ring-[2.5px] ring-offset-[2px] ring-offset-white'
                              : 'w-8 h-8 sm:w-9 sm:h-9 group-hover:ring-[1.5px] group-hover:ring-gray-300 group-hover:ring-offset-1 group-hover:ring-offset-white'
                            }
                          `}
                          style={{
                            backgroundColor: avColor,
                            ...(isSelected ? { ['--tw-ring-color' as string]: avColor } : {}),
                          }}
                        >
                          {av?.image ? (
                            <img src={av.image} alt={d.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <DepIcon
                                className={`text-white transition-all duration-300 ${
                                  isSelected ? 'w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8' : 'w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7'
                                }`}
                                strokeWidth={2}
                              />
                            </div>
                          )}
                        </div>
                        {isSelected && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0.15, 0.4, 0.15], scale: [1, 1.15, 1] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute inset-0 rounded-full pointer-events-none"
                            style={{ boxShadow: `0 0 16px ${avColor}` }}
                          />
                        )}
                      </div>
                      <span
                        className={`
                          transition-all duration-200 text-center whitespace-nowrap
                          ${isSelected
                            ? 'text-[10px] font-semibold text-gray-900'
                            : 'text-[9px] font-medium text-gray-400 group-hover:text-gray-500'
                          }
                        `}
                      >
                        {d.name}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            {/* Overlapping squad avatars strip – larger, more impactful */}
            <AnimatePresence mode="wait">
              <motion.div
                key={dept.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center gap-5"
              >
                <div className="flex items-center justify-center -space-x-5 sm:-space-x-6 md:-space-x-7">
                  {SQUAD_DEPARTMENTS[selectedDeptIndex]?.members.map((member, i) => {
                    const isCenter = member.role === 'Team Lead';
                    const size = isCenter
                      ? 'w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40'
                      : 'w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-[7.5rem] lg:h-[7.5rem]';
                    const humanAvatar = isCenter
                      ? avatar?.image
                      : avatarPool[(selectedDeptIndex + i) % Math.max(1, avatarPool.length)]?.image;
                    const showImage = member.isAgent ? (member.img || member.fallback) : humanAvatar;
                    const zIdx = isCenter ? 15 : i + 1;
                    return (
                      <motion.div
                        key={member.id}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.06, duration: 0.35 }}
                        className="flex flex-col items-center gap-2.5 flex-shrink-0"
                      >
                        <div className="relative" style={{ zIndex: zIdx }}>
                          <div
                            className={`${size} rounded-full overflow-hidden flex-shrink-0 shadow-lg ring-2 ring-white ring-offset-2 sm:ring-offset-[3px] ring-offset-white`}
                            style={{
                              border: `2px solid ${member.isAgent ? `${member.bgColor}40` : `${avatarColor}40`}`,
                              background: member.isAgent
                                ? `linear-gradient(145deg, ${member.bgColor}cc, ${member.bgColor})`
                                : `linear-gradient(145deg, ${avatarColor}ee, ${avatarColor})`,
                            }}
                          >
                            {showImage ? (
                              <img
                                src={showImage}
                                alt={member.label}
                                className={`w-full h-full ${member.isAgent ? 'object-contain object-bottom' : 'object-cover'}`}
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
                          </div>
                          {member.isAgent && (
                            <div
                              className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center z-20"
                              style={{
                                background: `linear-gradient(135deg, ${member.bgColor}, ${member.bgColor}cc)`,
                                border: '2px solid white',
                                boxShadow: `0 2px 6px ${member.bgColor}40`,
                              }}
                            >
                              <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                            </div>
                          )}
                        </div>
                        <span
                          className={`text-center whitespace-nowrap text-xs sm:text-[13px] font-medium ${
                            isCenter ? 'font-semibold' : 'text-gray-500'
                          }`}
                          style={isCenter ? { color: avatarColor } : undefined}
                        >
                          {member.label}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
                <p className="text-xs sm:text-sm font-medium text-gray-400 truncate max-w-full" style={{ color: `${avatarColor}99` }}>
                  {dept.jtbd[selectedJtbd]}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Main card: Squad + Board */}
        <div style={{ perspective: '1800px' }} className="mt-4">
          <motion.div
            initial={{ opacity: 0, y: 30, rotateX: 4 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 1.5 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="rounded-2xl border border-gray-200 bg-white overflow-hidden"
            style={{
              boxShadow:
                '0 20px 60px -12px rgba(0,0,0,0.12), 0 4px 20px -4px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.03)',
              transformOrigin: 'center bottom',
            }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[420px]">
              {/* Left panel: Squad */}
              <div className="lg:col-span-4 border-r border-gray-100 bg-gradient-to-b from-gray-50/60 to-white p-5 flex flex-col">
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
                        className="text-xl font-extrabold text-gray-900 tracking-tight mb-1"
                      >
                        {dept.name} squad
                      </motion.h3>
                      <p className="text-[12px] text-gray-500 leading-relaxed">
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

                    {/* Team lead */}
                    <div className="mb-2">
                      <HumanMember
                        label={`${dept.name} Lead`}
                        initials={dept.name.charAt(0)}
                        color={avatarColor}
                        isLead
                        isLit={false}
                        avatarImage={avatar?.image}
                        delay={0.1}
                      />
                    </div>

                    {/* Divider: humans → agents */}
                    <div className="flex items-center gap-2 my-3 px-1">
                      <div className="h-px flex-1 bg-gray-100" />
                      <span className="text-[9px] font-bold text-gray-300 uppercase tracking-wider">
                        AI Agents
                      </span>
                      <div className="h-px flex-1 bg-gray-100" />
                    </div>

                    {/* Agents */}
                    <div className="space-y-2 flex-1">
                      {dept.agents.map((agent, i) => (
                        <SquadMember
                          key={agent.label}
                          agent={agent}
                          isLit={litAgentIndices.has(i)}
                          deptColor={dept.color}
                          delay={0.15 + i * 0.08}
                          status={agent.status}
                        />
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Right panel: Work Surface */}
              <div className="lg:col-span-8 flex flex-col relative">
                {/* JTBD title bar */}
                <div className="flex items-center gap-3 px-5 py-2.5 border-b border-gray-100 bg-gray-50/30">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                  </div>
                  <div className="w-px h-4 bg-gray-200" />
                  <LayoutGrid className="w-3.5 h-3.5 text-gray-400" />
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={`${dept.id}-${selectedJtbd}`}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="text-[11px] font-semibold text-gray-700"
                    >
                      {dept.jtbd[selectedJtbd]}
                    </motion.span>
                  </AnimatePresence>
                </div>

                {/* Task table */}
                <div className="flex-1 p-4 min-w-0">
                  <div className="grid grid-cols-[1fr_48px_72px_60px] gap-2 px-3 py-2 border-b border-gray-100">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Task</span>
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Agent</span>
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Status</span>
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Progress</span>
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
                        />
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Sidekick input */}
                <div className="px-4 py-3 border-t border-gray-100">
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer">
                    <Bot className="w-4 h-4 text-violet-400 flex-shrink-0" />
                    <span className="text-[11px] text-gray-400 flex-1">Ask Sidekick...</span>
                    <Send className="w-3.5 h-3.5 text-gray-300" />
                  </div>
                </div>

                {/* Floating cursors overlay */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`cursors-${dept.id}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                    className="absolute inset-0 pointer-events-none z-20 overflow-hidden"
                  >
                    {posA && dept.agents[0] && (
                      <FloatingAgentCursor
                        agent={dept.agents[0]}
                        x={posA.x}
                        y={posA.y}
                        deptColor={dept.color}
                      />
                    )}
                    {posB && dept.agents[1] && (
                      <FloatingAgentCursor
                        agent={dept.agents[1]}
                        x={posB.x}
                        y={posB.y}
                        deptColor={dept.color}
                      />
                    )}
                    <FloatingHumanCursor
                      name={humanCursor.name}
                      color={humanCursor.color}
                      x={humanCursor.x}
                      y={humanCursor.y}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
