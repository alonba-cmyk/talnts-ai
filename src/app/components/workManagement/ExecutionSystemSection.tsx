"use client";

import { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  Bot,
  LayoutGrid,
  Send,
  Zap,
  Plus,
} from 'lucide-react';
import { useDepartments } from '@/hooks/useSupabase';
import { WORK_MANAGEMENT_TRIAL_URL } from '@/lib/workManagementUrls';
import {
  DEPARTMENTS,
  JTBD_ICONS,
  STATUS_CONFIG,
  PROGRESS_BY_COL,
  type AgentInfo,
  type BoardItem,
} from './wmDepartmentData';

/* ─── Active agents sidebar ─── */

function ActiveAgentsSidebar({
  agents,
  deptColor,
  deptId,
}: {
  agents: AgentInfo[];
  deptColor: string;
  deptId: string;
}) {
  return (
    <div className="border-r border-gray-100 p-4 w-[180px] flex-shrink-0">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
          Active Agents
        </span>
        <div className="flex items-center gap-1">
          <Bot className="w-3.5 h-3.5 text-gray-300" />
          <Plus className="w-3 h-3 text-gray-300" />
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={deptId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-1.5"
        >
          {agents.slice(0, 3).map((agent, i) => (
            <motion.div
              key={agent.label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
              className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-gray-50/80 transition-colors"
            >
              <div
                className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 shadow-sm"
                style={{
                  border: `2px solid ${agent.bgColor}40`,
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
              <div className="min-w-0">
                <p className="text-[10px] font-semibold text-gray-800 truncate">
                  {agent.label}
                </p>
                <div className="flex items-center gap-1">
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-1.5 h-1.5 rounded-full bg-green-500"
                  />
                  <span className="text-[9px] text-green-600 font-medium">Active</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ─── Task table view ─── */

function TaskTableView({
  items,
  agents,
  deptColor,
  animKey,
  highlightedIds,
}: {
  items: BoardItem[];
  agents: AgentInfo[];
  deptColor: string;
  animKey: string;
  highlightedIds: Set<string>;
}) {
  return (
    <div className="flex-1 p-4 min-w-0">
      <div className="grid grid-cols-[1fr_60px_78px_68px] gap-3 px-3 py-2 border-b border-gray-100">
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
          Task
        </span>
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
          Agent
        </span>
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
          Status
        </span>
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
          Progress
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={animKey}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {items.slice(0, 6).map((item, idx) => {
            const status = STATUS_CONFIG[item.columnIndex] || STATUS_CONFIG[0];
            const progress = PROGRESS_BY_COL[item.columnIndex] || 0;
            const agentIdx = item.agentWorking ? idx % agents.length : -1;
            const isHighlighted = highlightedIds.has(item.id);

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  backgroundColor: isHighlighted ? `${deptColor}08` : 'transparent',
                }}
                transition={{ delay: idx * 0.05, duration: 0.25 }}
                className="grid grid-cols-[1fr_60px_78px_68px] gap-3 px-3 py-2.5 border-b border-gray-50 transition-colors rounded-md"
                style={{
                  boxShadow: isHighlighted
                    ? `inset 3px 0 0 ${deptColor}`
                    : 'none',
                }}
              >
                <span className="text-[11px] text-gray-800 font-medium truncate">
                  {item.label}
                </span>

                <div className="flex items-center justify-center">
                  {agentIdx >= 0 ? (
                    <div
                      className="w-7 h-7 rounded-lg overflow-hidden shadow-sm"
                      style={{
                        background: `linear-gradient(135deg, ${agents[agentIdx].bgColor}90, ${agents[agentIdx].bgColor}cc)`,
                      }}
                    >
                      <img
                        src={agents[agentIdx].img}
                        alt=""
                        className="w-full h-full object-contain object-bottom"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            agents[agentIdx].fallback;
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-7 h-7" />
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
                      transition={{
                        delay: idx * 0.08 + 0.3,
                        duration: 0.5,
                        ease: 'easeOut',
                      }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: deptColor }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ─── Floating agent cursors ─── */

type CursorPosition = {
  x: number;
  y: number;
  cardId: string;
};

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
      <div className="flex items-center gap-1.5">
        <div
          className="w-7 h-7 rounded-lg overflow-hidden shadow-md flex-shrink-0"
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
          className="flex items-center gap-1 bg-white/95 backdrop-blur-sm rounded-full px-1.5 py-0.5 shadow-sm"
          style={{ border: `1px solid ${deptColor}30` }}
        >
          <motion.span
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: deptColor }}
          />
          <span className="text-[8px] font-semibold text-gray-700 whitespace-nowrap">
            {agent.label}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function useFloatingCursors(
  boardItems: BoardItem[],
  deptId: string,
) {
  const positions = useMemo<CursorPosition[]>(() => {
    return boardItems.slice(0, 6).map((item, idx) => ({
      x: 52 + (idx % 3) * 14,
      y: 38 + idx * 8,
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

  const cardIdA = posA?.cardId ?? '';
  const cardIdB = posB?.cardId ?? '';

  const highlightedCardIds = useMemo(() => {
    const ids = new Set<string>();
    if (cardIdA) ids.add(cardIdA);
    if (cardIdB) ids.add(cardIdB);
    return ids;
  }, [cardIdA, cardIdB]);

  return { posA, posB, highlightedCardIds };
}

/* ─── Human orchestrator cursor ─── */

const HUMAN_PERSONAS = [
  { name: 'Sarah K.', color: '#475569' },
  { name: 'Alex M.', color: '#1e40af' },
];

const HUMAN_WAYPOINTS = [
  { x: 10, y: 42 },
  { x: 14, y: 56 },
  { x: 8, y: 68 },
  { x: 16, y: 48 },
  { x: 12, y: 62 },
  { x: 10, y: 75 },
];

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
      <svg
        width="12"
        height="16"
        viewBox="0 0 14 18"
        fill="none"
        className="drop-shadow-sm"
      >
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
        <span className="text-[8px] font-semibold text-white whitespace-nowrap">
          {name}
        </span>
      </div>
    </motion.div>
  );
}

function useHumanCursors(deptId: string) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setTick(0);
  }, [deptId]);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 5400);
    return () => clearInterval(id);
  }, [deptId]);

  const n = HUMAN_WAYPOINTS.length;
  const wp = HUMAN_WAYPOINTS[tick % n];

  return { human: { ...HUMAN_PERSONAS[0], x: wp.x, y: wp.y } };
}

/* ─── Main component ─── */

export function ExecutionSystemSection() {
  const [selectedDeptIndex, setSelectedDeptIndex] = useState(0);
  const [selectedJtbd, setSelectedJtbd] = useState(0);
  const { departments: supabaseDepts } = useDepartments();

  const avatarMap = useMemo(() => {
    const map: Record<string, { image: string; color: string }> = {};
    for (const sd of supabaseDepts) {
      map[sd.name] = { image: sd.avatar_image, color: sd.avatar_color };
    }
    return map;
  }, [supabaseDepts]);

  const dept = DEPARTMENTS[selectedDeptIndex];
  const boardItems = dept.boardItems as BoardItem[];
  const animKey = dept.id;

  const { posA, posB, highlightedCardIds } = useFloatingCursors(
    boardItems,
    dept.id,
  );

  const { human } = useHumanCursors(dept.id);

  const handleDeptChange = useCallback((index: number) => {
    setSelectedDeptIndex(index);
    setSelectedJtbd(0);
  }, []);

  const DeptIcon = dept.icon;
  const avatar = avatarMap[dept.supabaseKey];
  const avatarColor = avatar?.color || dept.color;

  return (
    <section className="relative pt-12 sm:pt-16 pb-20 sm:pb-24 lg:pb-28 px-4 sm:px-6 bg-white">
      <div className="max-w-[1200px] mx-auto">
        {/* ── Hero copy ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center flex flex-col items-center gap-6 mb-8 sm:mb-10"
        >
          <p className="text-base font-normal text-gray-600 leading-relaxed">
            Intelligent work execution
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[64px] font-bold text-black tracking-[-0.03em] leading-[1.1] max-w-[908px] mx-auto">
            Finally, execution that keeps up with your ambition
          </h1>
          <p className="text-lg sm:text-xl text-black/90 leading-relaxed max-w-[751px] mx-auto">
            You lead, AI delivers. Your teams&apos; ceiling just got higher.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex flex-col items-center gap-3"
          >
            <a
              href={WORK_MANAGEMENT_TRIAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 h-14 px-6 bg-black hover:bg-gray-800 text-white font-medium text-lg rounded-[40px] transition-colors"
            >
              Get started
              <ArrowRight className="w-5 h-5" strokeWidth={2} />
            </a>
            <p className="text-sm text-[#7c7b7b]">
              Try it out first with a free trial | No credit card required.
            </p>
          </motion.div>
        </motion.div>

        {/* ── Department bar (Platform-style avatars) ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex items-center gap-5 md:gap-6 px-6 py-4 rounded-xl border border-gray-200 bg-gray-50/40">
            {DEPARTMENTS.map((d, i) => {
              const isSelected = selectedDeptIndex === i;
              const DepIcon = d.icon;
              const av = avatarMap[d.supabaseKey];
              const avColor = av?.color || d.color;
              return (
                <motion.button
                  key={d.id}
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.04 * i, duration: 0.3 }}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => handleDeptChange(i)}
                  className="flex flex-col items-center gap-1.5 cursor-pointer shrink-0 group"
                >
                  <div className="relative">
                    <div
                      className={`
                        rounded-full overflow-hidden transition-all duration-300
                        ${isSelected
                          ? 'w-12 h-12 md:w-14 md:h-14 ring-[2.5px] ring-offset-[2.5px] ring-offset-white'
                          : 'w-10 h-10 md:w-12 md:h-12 group-hover:ring-[1.5px] group-hover:ring-gray-300 group-hover:ring-offset-1 group-hover:ring-offset-white'
                        }
                      `}
                      style={{
                        backgroundColor: avColor,
                        ...(isSelected
                          ? { ['--tw-ring-color' as string]: avColor }
                          : {}),
                      }}
                    >
                      {av?.image ? (
                        <img
                          src={av.image}
                          alt={d.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <DepIcon
                            className={`text-white transition-all duration-300 ${
                              isSelected
                                ? 'w-6 h-6 md:w-7 md:h-7'
                                : 'w-5 h-5 md:w-6 md:h-6'
                            }`}
                            strokeWidth={2}
                          />
                        </div>
                      )}
                    </div>

                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity: [0.15, 0.4, 0.15],
                          scale: [1, 1.15, 1],
                        }}
                        transition={{
                          duration: 2.5,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                        className="absolute inset-0 rounded-full pointer-events-none"
                        style={{ boxShadow: `0 0 20px ${avColor}` }}
                      />
                    )}
                  </div>

                  <span
                    className={`
                      transition-all duration-200 text-center whitespace-nowrap
                      ${isSelected
                        ? 'text-[11px] font-semibold text-gray-900'
                        : 'text-[10px] font-medium text-gray-400 group-hover:text-gray-500'
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

        {/* ── Main workspace (Platform-style card) ── */}
        <div style={{ perspective: '1800px' }}>
          <motion.div
            initial={{ opacity: 0, y: 30, rotateX: 4 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 1.5 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.7,
              delay: 0.2,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="rounded-2xl border border-gray-200 bg-white overflow-hidden"
            style={{
              boxShadow:
                '0 20px 60px -12px rgba(0,0,0,0.12), 0 4px 20px -4px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.03)',
              transformOrigin: 'center bottom',
            }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px] relative">
              {/* ── Left panel: team info + JTBD ── */}
              <div className="lg:col-span-4 border-r border-gray-100 bg-gradient-to-b from-gray-50/60 to-white p-6 flex flex-col">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={dept.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col flex-1"
                  >
                    {/* Team header block */}
                    <div className="relative mb-6">
                      <motion.h3
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35 }}
                        className="text-2xl font-extrabold text-gray-900 tracking-tight mb-1"
                      >
                        {dept.name} team
                      </motion.h3>
                      <p className="text-[13px] text-gray-500 leading-relaxed mb-5">
                        {dept.description}
                      </p>

                      {/* Avatars stack */}
                      <div className="flex items-center mb-2">
                        <div className="flex items-center -space-x-2.5">
                          {/* Department avatar */}
                          <motion.div
                            initial={{ opacity: 0, scale: 0.7 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 20 }}
                            className="relative z-10 w-12 h-12 rounded-full overflow-hidden flex-shrink-0 shadow-lg"
                            style={{
                              backgroundColor: avatarColor,
                              border: '3px solid white',
                            }}
                          >
                            {avatar?.image ? (
                              <img
                                src={avatar.image}
                                alt={dept.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <DeptIcon className="w-5 h-5 text-white" />
                              </div>
                            )}
                          </motion.div>

                          {/* Agent avatars */}
                          {dept.agents.slice(0, 3).map((agent, i) => (
                            <motion.div
                              key={agent.label}
                              initial={{ opacity: 0, scale: 0.6, x: -12 }}
                              animate={{ opacity: 1, scale: 1, x: 0 }}
                              transition={{
                                delay: 0.18 + i * 0.08,
                                type: 'spring',
                                stiffness: 280,
                                damping: 22,
                              }}
                              className="relative w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 shadow-md"
                              style={{
                                border: '3px solid white',
                                zIndex: 9 - i,
                                background: `linear-gradient(135deg, ${agent.bgColor}90, ${agent.bgColor}cc)`,
                              }}
                            >
                              <img
                                src={agent.img}
                                alt={agent.label}
                                className="w-full h-full object-contain object-bottom"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    agent.fallback;
                                }}
                              />
                            </motion.div>
                          ))}
                        </div>

                        {/* Agent count badge */}
                        <motion.span
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
                          className="text-[11px] font-bold px-3 py-1.5 rounded-full ml-3 whitespace-nowrap shadow-sm"
                          style={{
                            color: dept.color,
                            backgroundColor: `${dept.color}12`,
                            border: `1.5px solid ${dept.color}25`,
                          }}
                        >
                          +{dept.agents.length} agents
                        </motion.span>
                      </div>

                      {/* Colored accent line */}
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.3, duration: 0.4, ease: 'easeOut' }}
                        className="h-0.5 rounded-full mt-5 origin-left"
                        style={{
                          background: `linear-gradient(to right, ${dept.color}, ${dept.color}20)`,
                        }}
                      />
                    </div>

                    {/* JTBD list */}
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                      Jobs to be done
                    </div>
                    <div className="space-y-1 flex-1">
                      {dept.jtbd.map((job, i) => {
                        const Icon = JTBD_ICONS[i % JTBD_ICONS.length];
                        const isActive = selectedJtbd === i;
                        return (
                          <motion.button
                            key={job}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05, duration: 0.25 }}
                            onClick={() => setSelectedJtbd(i)}
                            className={`w-full flex items-start gap-2.5 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${
                              isActive
                                ? 'bg-white shadow-md border border-gray-200 text-gray-900'
                                : 'text-gray-500 hover:bg-white/80 hover:text-gray-700 hover:shadow-sm'
                            }`}
                            style={
                              isActive
                                ? {
                                    boxShadow: `0 2px 8px ${dept.color}15, 0 1px 3px rgba(0,0,0,0.06)`,
                                    borderColor: `${dept.color}30`,
                                  }
                                : undefined
                            }
                          >
                            <Icon
                              className={`w-4 h-4 mt-0.5 shrink-0 transition-colors duration-200 ${
                                isActive ? '' : 'text-gray-400'
                              }`}
                              style={isActive ? { color: dept.color } : undefined}
                            />
                            <span className="text-xs font-medium leading-snug">
                              {job}
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* ── Right panel: product card ── */}
              <div className="lg:col-span-8 flex flex-col">
                {/* Card header */}
                <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100">
                  <div
                    className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0"
                    style={{ backgroundColor: avatarColor }}
                  >
                    {avatar?.image ? (
                      <img
                        src={avatar.image}
                        alt={dept.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <DeptIcon className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <span className="text-sm font-bold text-gray-900 block">
                      {dept.name}
                    </span>
                    <span className="text-[11px] text-gray-500 block truncate">
                      {dept.description}
                    </span>
                  </div>
                  <span className="ml-auto flex items-center gap-1 text-[10px] font-semibold text-violet-600 bg-violet-50 px-2.5 py-1 rounded-full whitespace-nowrap">
                    <Zap className="w-3 h-3" />
                    AI-powered
                  </span>
                </div>

                {/* Traffic lights + JTBD title bar */}
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

                {/* Content: agents sidebar + table */}
                <div className="flex flex-1 relative">
                  <ActiveAgentsSidebar
                    agents={dept.agents}
                    deptColor={dept.color}
                    deptId={dept.id}
                  />
                  <TaskTableView
                    items={boardItems}
                    agents={dept.agents}
                    deptColor={dept.color}
                    animKey={animKey}
                    highlightedIds={highlightedCardIds}
                  />
                </div>

                {/* Ask Sidekick input */}
                <div className="px-4 py-3 border-t border-gray-100">
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer">
                    <Bot className="w-4 h-4 text-violet-400 flex-shrink-0" />
                    <span className="text-[11px] text-gray-400 flex-1">
                      Ask Sidekick...
                    </span>
                    <Send className="w-3.5 h-3.5 text-gray-300" />
                  </div>
                </div>
              </div>

              {/* ── Floating cursors overlay ── */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`cursors-${dept.id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                  className="absolute inset-0 pointer-events-none z-20"
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
                    name={human.name}
                    color={human.color}
                    x={human.x}
                    y={human.y}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
