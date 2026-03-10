"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
} from 'lucide-react';
import { useSiteSettings, useDesignAssets } from '@/hooks/useSupabase';
import { SQUAD_DEPARTMENTS } from './squadData';
import type { SquadMember, SquadDepartment } from './squadData';


/* ─── Agent row inside the squad card ─── */

function AgentRow({
  member,
  isLit,
  deptColor,
  delay,
}: {
  member: SquadMember;
  isLit: boolean;
  deptColor: string;
  delay: number;
}) {
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
              background: `radial-gradient(ellipse at left, ${member.bgColor}30 0%, transparent 70%)`,
            }}
          />
        )}
      </AnimatePresence>

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
            background: `linear-gradient(145deg, ${member.bgColor}cc, ${member.bgColor})`,
            ...(isLit ? { ['--tw-ring-color' as string]: member.bgColor } : {}),
          }}
        >
          <img
            src={member.img}
            alt={member.label}
            className="w-full h-full object-contain object-bottom"
            loading="lazy"
            onError={(e) => {
              if (member.fallback) {
                (e.target as HTMLImageElement).src = member.fallback;
              }
            }}
          />
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay + 0.2, type: 'spring', stiffness: 400 }}
          className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center z-20 border-2 border-white"
          style={{
            background: `linear-gradient(135deg, ${member.bgColor}, ${member.bgColor}cc)`,
          }}
        >
          <Sparkles className="w-2 h-2 text-white" />
        </motion.div>
      </motion.div>

      <div className="min-w-0 z-10">
        <p className="text-[12px] font-semibold text-gray-900 truncate">{member.label}</p>
        <AnimatePresence mode="wait">
          {isLit && member.status ? (
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
              {member.status}
            </motion.p>
          ) : (
            <motion.p
              key="role"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[10px] text-gray-400 font-medium flex items-center gap-1"
            >
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: `${member.bgColor}80` }}
              />
              {member.status || 'AI Agent'}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ─── Chat view shown after split ─── */

function SquadChatView({
  leadLabel,
  leadImage,
  leadBgColor,
  leadInitial,
  agent,
  jtbd,
  deptId,
  bubbleIndex,
  deptColor,
}: {
  leadLabel: string;
  leadImage: string | undefined;
  leadBgColor: string;
  leadInitial: string;
  agent: SquadMember;
  jtbd: string;
  deptId: string;
  bubbleIndex: number;
  deptColor: string;
}) {
  const [showReply, setShowReply] = useState(false);

  useEffect(() => {
    setShowReply(false);
    const timer = setTimeout(() => setShowReply(true), 1200);
    return () => clearTimeout(timer);
  }, [bubbleIndex]);

  return (
    <div className="flex flex-col gap-3">
      {/* Lead message (left-aligned) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`lead-${deptId}-${bubbleIndex}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
          className="flex items-start gap-2.5"
        >
          <div
            className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center"
            style={{ backgroundColor: leadBgColor, padding: '2px' }}
          >
            {leadImage ? (
              <div className="w-full h-full rounded-full overflow-hidden">
                <img src={leadImage} alt={leadLabel} className="w-full h-full object-cover" loading="lazy" />
              </div>
            ) : (
              <span className="text-white font-bold text-xs">{leadInitial}</span>
            )}
          </div>
          <div className="flex flex-col gap-0.5 min-w-0 flex-1">
            <span className="text-[10px] font-semibold text-gray-600">{leadLabel}</span>
            <div
              className="px-3 py-2 rounded-xl rounded-tl-none text-[12px] text-gray-700 leading-relaxed"
              style={{
                backgroundColor: '#f1f3f5',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              }}
            >
              I need you to {jtbd.toLowerCase()}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Agent reply (right-aligned) */}
      <AnimatePresence mode="wait">
        {showReply && (
          <motion.div
            key={`agent-${deptId}-${bubbleIndex}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="flex items-start gap-2.5 flex-row-reverse"
          >
            <div
              className="w-9 h-9 rounded-lg flex-shrink-0 overflow-hidden"
              style={{
                background: `linear-gradient(145deg, ${agent.bgColor}cc, ${agent.bgColor})`,
              }}
            >
              <img
                src={agent.img}
                alt={agent.label}
                className="w-full h-full object-contain object-bottom"
                loading="lazy"
              />
            </div>
            <div className="flex flex-col gap-0.5 min-w-0 flex-1 items-end">
              <span className="text-[10px] font-semibold text-gray-600">{agent.label}</span>
              <div
                className="px-3 py-2 rounded-xl rounded-tr-none text-[12px] text-white leading-relaxed"
                style={{
                  backgroundColor: deptColor,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                }}
              >
                <span className="flex items-center gap-1.5">
                  <motion.span
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-1.5 h-1.5 rounded-full bg-white/70 flex-shrink-0"
                  />
                  {agent.status || 'On it!'}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Main section ─── */

const AUTO_ROTATE_INTERVAL = 5000;

type SplitPhase = 'together' | 'splitting' | 'chatting';

const SPLIT_DELAY = 4000;
const CHAT_BUBBLE_INTERVAL = 4000;

export function WorkManagementSquadSection() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [litAgentIndex, setLitAgentIndex] = useState(0);
  const [jtbdIndex, setJtbdIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [splitPhase, setSplitPhase] = useState<SplitPhase>('together');
  const [chatBubbleIndex, setChatBubbleIndex] = useState(0);
  const autoRotateRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { settings: siteSettings } = useSiteSettings();
  const splitChatEnabled = siteSettings?.wm_squad_split_chat ?? false;
  const { assets: avatarAssets } = useDesignAssets('department_avatar');
  const avatarPool = useMemo(() => avatarAssets.map(a => a.file_url), [avatarAssets]);

  const avatarOverrides = siteSettings?.wm_dept_avatar_overrides ?? {};
  const colorOverrides = siteSettings?.wm_dept_color_overrides ?? {};
  const deptOrderSetting = siteSettings?.wm_dept_order ?? [];

  const orderedSquadDepts = useMemo(() => {
    if (deptOrderSetting.length === 0) return SQUAD_DEPARTMENTS;
    const ordered = deptOrderSetting.map(id => SQUAD_DEPARTMENTS.find(d => d.id === id)).filter(Boolean) as typeof SQUAD_DEPARTMENTS;
    const missing = SQUAD_DEPARTMENTS.filter(d => !deptOrderSetting.includes(d.id));
    return [...ordered, ...missing];
  }, [deptOrderSetting]);

  const dept = orderedSquadDepts[selectedIndex];
  const agents = useMemo(() => dept.members.filter(m => m.isAgent), [dept]);
  const lead = useMemo(() => dept.members.find(m => m.role === 'Team Lead'), [dept]);

  const getCenterImageForIndex = useCallback((deptIndex: number): string | undefined => {
    const d = orderedSquadDepts[deptIndex];
    if (!d) return undefined;
    if (avatarOverrides[d.id]) return avatarOverrides[d.id];
    const leadMember = d.members.find(m => m.role === 'Team Lead');
    if (leadMember?.img) return leadMember.img;
    if (avatarPool.length === 0) return undefined;
    const offset = Math.floor(avatarPool.length / 2) + 2;
    return avatarPool[(deptIndex + offset) % avatarPool.length];
  }, [orderedSquadDepts, avatarOverrides, avatarPool]);

  const getCenterBgColorForIndex = useCallback((deptIndex: number): string => {
    const d = orderedSquadDepts[deptIndex];
    if (!d) return '#e5e7eb';
    return colorOverrides[d.id] || d.color;
  }, [orderedSquadDepts, colorOverrides]);

  const centerImage = getCenterImageForIndex(selectedIndex);
  const centerBgColor = getCenterBgColorForIndex(selectedIndex);

  const handleDeptChange = useCallback((index: number) => {
    setSelectedIndex(index);
    setLitAgentIndex(0);
    setJtbdIndex(0);
    setSplitPhase('together');
    setChatBubbleIndex(0);
  }, []);

  // Auto-rotate departments (pauses on hover)
  useEffect(() => {
    if (isHovered) return;
    autoRotateRef.current = setInterval(() => {
      setSelectedIndex(prev => (prev + 1) % orderedSquadDepts.length);
      setLitAgentIndex(0);
      setJtbdIndex(0);
    }, AUTO_ROTATE_INTERVAL);
    return () => {
      if (autoRotateRef.current) clearInterval(autoRotateRef.current);
    };
  }, [isHovered, orderedSquadDepts.length]);

  // Cycle lit agent
  useEffect(() => {
    const timer = setInterval(() => {
      setLitAgentIndex(prev => (prev + 1) % agents.length);
    }, 2400);
    return () => clearInterval(timer);
  }, [agents.length, selectedIndex]);

  // Cycle jtbd speech bubble
  useEffect(() => {
    const timer = setInterval(() => {
      setJtbdIndex(prev => (prev + 1) % dept.jtbd.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [dept.jtbd.length, selectedIndex]);

  // Split & chat: after SPLIT_DELAY, start splitting, then transition to chatting
  useEffect(() => {
    if (!splitChatEnabled) { setSplitPhase('together'); return; }
    setSplitPhase('together');
    setChatBubbleIndex(0);
    const splitTimer = setTimeout(() => {
      setSplitPhase('splitting');
      setTimeout(() => setSplitPhase('chatting'), 700);
    }, SPLIT_DELAY);
    return () => clearTimeout(splitTimer);
  }, [splitChatEnabled, selectedIndex]);

  // Cycle chat bubbles when in chatting phase
  useEffect(() => {
    if (splitPhase !== 'chatting') return;
    const timer = setInterval(() => {
      setChatBubbleIndex(prev => (prev + 1) % dept.jtbd.length);
    }, CHAT_BUBBLE_INTERVAL);
    return () => clearInterval(timer);
  }, [splitPhase, dept.jtbd.length]);

  const chatAgent = agents[chatBubbleIndex % agents.length];
  const currentJtbd = dept.jtbd[jtbdIndex] ?? dept.jtbd[0];

  return (
    <section className="relative pt-8 pb-12 sm:pb-16 px-4 sm:px-6 bg-white overflow-hidden">
      <div className="max-w-[900px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-10"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-gray-400 mb-4">
            AI Work Platform
          </p>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-[-0.03em] leading-[1.15] mb-3">
            Your unlimited workforce.
          </h2>

          <p className="text-base sm:text-lg text-gray-500">
            AI agents that work alongside your team — 24/7, at any scale, without limits
          </p>
        </motion.div>

        {/* Squad card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mb-10 sm:mb-12"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            className="max-w-[420px] mx-auto rounded-2xl border border-gray-200 bg-white overflow-hidden"
            style={{
              boxShadow: '0 8px 32px -8px rgba(0,0,0,0.08), 0 2px 12px -4px rgba(0,0,0,0.04)',
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={dept.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="p-5 sm:p-6"
              >
                {/* Card header: squad name + description */}
                <div className="mb-5">
                  <h3 className="text-xl font-extrabold text-gray-900 tracking-tight mb-1">
                    {dept.name} squad
                  </h3>
                  <p className="text-[12px] text-gray-500 leading-relaxed">
                    {dept.description}
                  </p>
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.3, duration: 0.4, ease: 'easeOut' }}
                    className="h-0.5 rounded-full mt-4 origin-left"
                    style={{
                      background: `linear-gradient(to right, ${colorOverrides[dept.id] || dept.color}, ${colorOverrides[dept.id] || dept.color}20)`,
                    }}
                  />
                </div>

                <AnimatePresence mode="wait">
                  {splitPhase === 'chatting' ? (
                    <motion.div
                      key="chat-view"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35 }}
                    >
                      <SquadChatView
                        leadLabel={lead?.label ?? `${dept.name} Lead`}
                        leadImage={centerImage}
                        leadBgColor={centerBgColor}
                        leadInitial={dept.name.charAt(0)}
                        agent={chatAgent}
                        jtbd={dept.jtbd[chatBubbleIndex % dept.jtbd.length]}
                        deptId={dept.id}
                        bubbleIndex={chatBubbleIndex}
                        deptColor={colorOverrides[dept.id] || dept.color}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="default-view"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Team Lead with speech bubble */}
                      <motion.div
                        animate={splitPhase === 'splitting' ? { x: -30, opacity: 0.5 } : { x: 0, opacity: 1 }}
                        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                        className="flex items-start gap-3 mb-2 min-w-0"
                      >
                        <motion.div
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1, duration: 0.35 }}
                          className="flex-shrink-0"
                        >
                          <div
                            className="w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center"
                            style={{ backgroundColor: centerBgColor, padding: '3px' }}
                          >
                            {centerImage ? (
                              <div className="w-full h-full rounded-full overflow-hidden">
                                <img src={centerImage} alt={`${dept.name} Lead`} className="w-full h-full object-cover" loading="lazy" />
                              </div>
                            ) : (
                              <span className="text-white font-bold text-lg">{dept.name.charAt(0)}</span>
                            )}
                          </div>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.15, duration: 0.35 }}
                          className="flex-1 min-w-0 flex flex-col gap-1"
                        >
                          <p className="text-[13px] font-semibold text-gray-900">
                            {lead?.label ?? `${dept.name} Lead`}
                          </p>
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={`${dept.id}-${jtbdIndex}`}
                              initial={{ opacity: 0, x: 6 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -6 }}
                              transition={{ duration: 0.2 }}
                              className="relative px-3 py-1 rounded-xl rounded-tl-none border border-gray-200 text-[11px] text-gray-700 truncate"
                              style={{
                                backgroundColor: '#f8f9fa',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.03)',
                              }}
                            >
                              Let's focus on {currentJtbd.toLowerCase()}
                            </motion.div>
                          </AnimatePresence>
                        </motion.div>
                      </motion.div>

                      {/* Divider */}
                      <div className="flex items-center gap-2 my-3 px-1">
                        <div className="h-px flex-1 bg-gray-100" />
                        <span className="text-[9px] font-bold text-gray-300 uppercase tracking-wider">
                          AI Agents
                        </span>
                        <div className="h-px flex-1 bg-gray-100" />
                      </div>

                      {/* Agent rows */}
                      <motion.div
                        animate={splitPhase === 'splitting' ? { x: 30, opacity: 0.5 } : { x: 0, opacity: 1 }}
                        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                        className="space-y-2.5"
                      >
                        {agents.map((agent, i) => (
                          <AgentRow
                            key={agent.id}
                            member={agent}
                            isLit={litAgentIndex === i}
                            deptColor={colorOverrides[dept.id] || dept.color}
                            delay={0.15 + i * 0.08}
                          />
                        ))}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Department selector */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="flex justify-center"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="inline-flex items-center gap-4 md:gap-5 px-5 py-3 rounded-xl border border-gray-200 bg-gray-50/40">
            {orderedSquadDepts.map((d, i) => {
              const isSelected = selectedIndex === i;
              const DepIcon = d.icon;
              const leaderImg = getCenterImageForIndex(i);
              const leaderBg = getCenterBgColorForIndex(i);

              return (
                <motion.button
                  key={d.id}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => handleDeptChange(i)}
                  className={`flex flex-col items-center gap-1 cursor-pointer shrink-0 group transition-opacity duration-300 ${
                    isSelected ? 'opacity-100' : 'opacity-50 hover:opacity-80'
                  }`}
                >
                  <motion.div
                    animate={isSelected ? { scale: 1 } : { scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className={`
                      rounded-full transition-all duration-300 flex items-center justify-center
                      ${isSelected
                        ? 'w-11 h-11 md:w-12 md:h-12 shadow-md'
                        : 'w-9 h-9 md:w-10 md:h-10'
                      }
                    `}
                    style={{
                      backgroundColor: leaderBg,
                      padding: '2.5px',
                      ...(!isSelected ? { filter: 'grayscale(0.6)' } : {}),
                    }}
                  >
                    {leaderImg ? (
                      <div className="w-full h-full rounded-full overflow-hidden">
                        <img src={leaderImg} alt={d.name} className="w-full h-full object-cover" loading="lazy" />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <DepIcon
                          className={`text-white transition-all duration-300 ${isSelected ? 'w-5 h-5' : 'w-4 h-4'}`}
                          strokeWidth={2}
                        />
                      </div>
                    )}
                  </motion.div>
                  <span
                    className={`
                      transition-all duration-200 text-center whitespace-nowrap font-semibold
                      ${isSelected ? 'text-[11px]' : 'text-[10px]'}
                    `}
                    style={{ color: colorOverrides[d.id] || d.color }}
                  >
                    {d.name}
                  </span>

                  {/* Progress indicator for auto-rotation */}
                  {isSelected && !isHovered && (
                    <motion.div
                      className="h-[2px] rounded-full mt-0.5"
                      style={{ backgroundColor: d.color }}
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: AUTO_ROTATE_INTERVAL / 1000, ease: 'linear' }}
                      key={`progress-${d.id}-${selectedIndex}`}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
