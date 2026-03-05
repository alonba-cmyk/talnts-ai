"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Briefcase,
  Lightbulb,
  Settings,
  Heart,
  Megaphone,
  DollarSign,
  type LucideIcon,
} from 'lucide-react';
import agentPink from '@/assets/agent-pink.png';
import agentCyan from '@/assets/agent-cyan.png';
import agentOrange from '@/assets/agent-orange.png';
import { useDepartments } from '@/hooks/useSupabase';

const FIGMA_AGENT_ASSETS = {
  assetsGenerator:
    'https://www.figma.com/api/mcp/asset/a4778f09-d617-48b6-beca-66dfaea6d37d',
  riskAnalyzer:
    'https://www.figma.com/api/mcp/asset/9fac6eaf-0070-4330-a0e8-9b709bc7992f',
  vendorResearcher:
    'https://www.figma.com/api/mcp/asset/0d268e64-b934-4159-b4b4-3714996b634e',
};

type SquadMember = {
  id: string;
  label: string;
  role: string;
  isAgent: boolean;
  bgColor: string;
  img: string;
  fallback: string;
};

type SquadDepartment = {
  id: string;
  name: string;
  color: string;
  icon: LucideIcon;
  supabaseKey: string;
  members: SquadMember[];
};

export const SQUAD_DEPARTMENTS: SquadDepartment[] = [
  {
    id: 'pmo',
    name: 'PMO',
    color: '#ff6b10',
    icon: Briefcase,
    supabaseKey: 'operations',
    members: [
      { id: 'pmo-h1', label: 'Program Manager', role: 'Team', isAgent: false, bgColor: '#ff6b10', img: '', fallback: 'PM' },
      { id: 'pmo-h2', label: 'Project Lead', role: 'Team', isAgent: false, bgColor: '#ff8c4a', img: '', fallback: 'PL' },
      { id: 'pmo-lead', label: 'PMO Lead', role: 'Team Lead', isAgent: false, bgColor: '#ff6b10', img: '', fallback: '' },
      { id: 'pmo-a1', label: 'Risk Analyzer', role: 'Agent', isAgent: true, bgColor: '#FFD633', img: FIGMA_AGENT_ASSETS.riskAnalyzer, fallback: agentOrange },
      { id: 'pmo-a2', label: 'Vendor Researcher', role: 'Agent', isAgent: true, bgColor: '#d7bdff', img: FIGMA_AGENT_ASSETS.vendorResearcher, fallback: agentPink },
    ],
  },
  {
    id: 'product',
    name: 'Product',
    color: '#6161FF',
    icon: Lightbulb,
    supabaseKey: 'product',
    members: [
      { id: 'pr-h1', label: 'Product Manager', role: 'Team', isAgent: false, bgColor: '#6161FF', img: '', fallback: 'PM' },
      { id: 'pr-h2', label: 'UX Designer', role: 'Team', isAgent: false, bgColor: '#8585ff', img: '', fallback: 'UX' },
      { id: 'pr-lead', label: 'Product Lead', role: 'Team Lead', isAgent: false, bgColor: '#6161FF', img: '', fallback: '' },
      { id: 'pr-a1', label: 'Assets Generator', role: 'Agent', isAgent: true, bgColor: '#93beff', img: FIGMA_AGENT_ASSETS.assetsGenerator, fallback: agentCyan },
      { id: 'pr-a2', label: 'Risk Analyzer', role: 'Agent', isAgent: true, bgColor: '#FFD633', img: FIGMA_AGENT_ASSETS.riskAnalyzer, fallback: agentOrange },
    ],
  },
  {
    id: 'operations',
    name: 'Operations',
    color: '#00baff',
    icon: Settings,
    supabaseKey: 'operations',
    members: [
      { id: 'op-h1', label: 'Ops Manager', role: 'Team', isAgent: false, bgColor: '#00baff', img: '', fallback: 'OM' },
      { id: 'op-h2', label: 'Process Analyst', role: 'Team', isAgent: false, bgColor: '#44ccff', img: '', fallback: 'PA' },
      { id: 'op-lead', label: 'Ops Lead', role: 'Team Lead', isAgent: false, bgColor: '#00baff', img: '', fallback: '' },
      { id: 'op-a1', label: 'Vendor Researcher', role: 'Agent', isAgent: true, bgColor: '#d7bdff', img: FIGMA_AGENT_ASSETS.vendorResearcher, fallback: agentPink },
      { id: 'op-a2', label: 'Assets Generator', role: 'Agent', isAgent: true, bgColor: '#93beff', img: FIGMA_AGENT_ASSETS.assetsGenerator, fallback: agentCyan },
    ],
  },
  {
    id: 'hr',
    name: 'HR',
    color: '#fc0',
    icon: Heart,
    supabaseKey: 'hr',
    members: [
      { id: 'hr-h1', label: 'Recruiter', role: 'Team', isAgent: false, bgColor: '#fc0', img: '', fallback: 'RC' },
      { id: 'hr-h2', label: 'People Partner', role: 'Team', isAgent: false, bgColor: '#ffd633', img: '', fallback: 'PP' },
      { id: 'hr-lead', label: 'HR Lead', role: 'Team Lead', isAgent: false, bgColor: '#fc0', img: '', fallback: '' },
      { id: 'hr-a1', label: 'Risk Analyzer', role: 'Agent', isAgent: true, bgColor: '#FFD633', img: FIGMA_AGENT_ASSETS.riskAnalyzer, fallback: agentOrange },
      { id: 'hr-a2', label: 'Assets Generator', role: 'Agent', isAgent: true, bgColor: '#93beff', img: FIGMA_AGENT_ASSETS.assetsGenerator, fallback: agentCyan },
    ],
  },
  {
    id: 'marketing',
    name: 'Marketing',
    color: '#ff84e4',
    icon: Megaphone,
    supabaseKey: 'marketing',
    members: [
      { id: 'mk-h1', label: 'Content Strategist', role: 'Team', isAgent: false, bgColor: '#ff84e4', img: '', fallback: 'CS' },
      { id: 'mk-h2', label: 'Campaign Manager', role: 'Team', isAgent: false, bgColor: '#ffa4ee', img: '', fallback: 'CM' },
      { id: 'mk-lead', label: 'Marketing Lead', role: 'Team Lead', isAgent: false, bgColor: '#ff84e4', img: '', fallback: '' },
      { id: 'mk-a1', label: 'Assets Generator', role: 'Agent', isAgent: true, bgColor: '#93beff', img: FIGMA_AGENT_ASSETS.assetsGenerator, fallback: agentCyan },
      { id: 'mk-a2', label: 'Vendor Researcher', role: 'Agent', isAgent: true, bgColor: '#d7bdff', img: FIGMA_AGENT_ASSETS.vendorResearcher, fallback: agentPink },
    ],
  },
  {
    id: 'finance',
    name: 'Finance',
    color: '#00D2D2',
    icon: DollarSign,
    supabaseKey: 'finance',
    members: [
      { id: 'fn-h1', label: 'Financial Analyst', role: 'Team', isAgent: false, bgColor: '#00D2D2', img: '', fallback: 'FA' },
      { id: 'fn-h2', label: 'Controller', role: 'Team', isAgent: false, bgColor: '#33e0e0', img: '', fallback: 'CT' },
      { id: 'fn-lead', label: 'Finance Lead', role: 'Team Lead', isAgent: false, bgColor: '#00D2D2', img: '', fallback: '' },
      { id: 'fn-a1', label: 'Risk Analyzer', role: 'Agent', isAgent: true, bgColor: '#FFD633', img: FIGMA_AGENT_ASSETS.riskAnalyzer, fallback: agentOrange },
      { id: 'fn-a2', label: 'Vendor Researcher', role: 'Agent', isAgent: true, bgColor: '#d7bdff', img: FIGMA_AGENT_ASSETS.vendorResearcher, fallback: agentPink },
    ],
  },
];

/* ─── Squad member avatar ─── */

function SquadAvatar({
  member,
  isCenter,
  isLit,
  deptColor,
  avatarImage,
  delay,
}: {
  member: SquadMember;
  isCenter: boolean;
  isLit: boolean;
  deptColor: string;
  avatarImage?: string;
  delay: number;
}) {
  const size = isCenter
    ? 'w-[88px] h-[88px] md:w-[110px] md:h-[110px]'
    : 'w-[64px] h-[64px] md:w-[76px] md:h-[76px]';

  const ringSize = isCenter ? 'ring-[3px]' : 'ring-[2.5px]';
  const showImage = member.isAgent ? member.img : (isCenter && avatarImage) ? avatarImage : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.85 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5, type: 'spring', stiffness: 200, damping: 18 }}
      className="flex flex-col items-center gap-2"
    >
      <div className="relative">
        {/* Glow ring on lit state */}
        <AnimatePresence>
          {isLit && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1.08 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="absolute -inset-1.5 rounded-full pointer-events-none z-0"
              style={{
                background: `radial-gradient(circle, ${member.isAgent ? member.bgColor : deptColor}40 0%, transparent 70%)`,
                boxShadow: `0 0 24px ${member.isAgent ? member.bgColor : deptColor}50`,
              }}
            />
          )}
        </AnimatePresence>

        <motion.div
          animate={isLit ? { scale: [1, 1.06, 1] } : { scale: 1 }}
          transition={isLit ? { duration: 1.2, ease: 'easeInOut' } : { duration: 0.3 }}
          className={`
            ${size} rounded-full overflow-hidden relative z-10 transition-all duration-300
            ${isLit ? `${ringSize} ring-offset-2 ring-offset-white` : 'ring-2 ring-gray-200'}
          `}
          style={{
            backgroundColor: member.isAgent
              ? `${member.bgColor}`
              : member.bgColor,
            ...(isLit
              ? { ['--tw-ring-color' as string]: member.isAgent ? member.bgColor : deptColor }
              : {}),
            background: member.isAgent
              ? `linear-gradient(145deg, ${member.bgColor}cc, ${member.bgColor})`
              : member.bgColor,
          }}
        >
          {showImage ? (
            <img
              src={showImage}
              alt={member.label}
              className={`w-full h-full ${member.isAgent ? 'object-contain object-bottom' : 'object-cover'}`}
              onError={(e) => {
                if (member.fallback) {
                  (e.target as HTMLImageElement).src = member.fallback;
                }
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className={`text-white font-bold ${isCenter ? 'text-xl md:text-2xl' : 'text-sm md:text-base'}`}>
                {member.fallback}
              </span>
            </div>
          )}
        </motion.div>

        {/* Agent sparkle badge */}
        {member.isAgent && (
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: delay + 0.3, type: 'spring', stiffness: 400 }}
            className="absolute -bottom-0.5 -right-0.5 w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center z-20"
            style={{
              background: `linear-gradient(135deg, ${member.bgColor}, ${member.bgColor}cc)`,
              border: '2px solid white',
              boxShadow: `0 2px 8px ${member.bgColor}40`,
            }}
          >
            <Sparkles className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" />
          </motion.div>
        )}
      </div>

      {/* Name */}
      <div className="text-center">
        <p className={`font-semibold text-gray-900 ${isCenter ? 'text-sm md:text-base' : 'text-xs md:text-sm'}`}>
          {member.label}
        </p>
        <p
          className={`font-medium ${isCenter ? 'text-xs' : 'text-[10px] md:text-[11px]'}`}
          style={{ color: member.isAgent ? member.bgColor : '#9ca3af' }}
        >
          {member.isAgent ? 'AI Agent' : member.role}
        </p>
      </div>
    </motion.div>
  );
}

/* ─── Main section ─── */

export function WorkManagementSquadSection() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [litMemberIndex, setLitMemberIndex] = useState(-1);
  const { departments: supabaseDepts } = useDepartments();

  const dept = SQUAD_DEPARTMENTS[selectedIndex];

  const avatarMap: Record<string, { image: string; color: string }> = {};
  for (const sd of supabaseDepts) {
    avatarMap[sd.name] = { image: sd.avatar_image, color: sd.avatar_color };
  }

  const avatar = avatarMap[dept.supabaseKey];
  const avatarColor = avatar?.color || dept.color;

  const handleDeptChange = useCallback((index: number) => {
    setSelectedIndex(index);
    setLitMemberIndex(-1);
  }, []);

  // Cycle through members to simulate activity
  useEffect(() => {
    const timer = setInterval(() => {
      setLitMemberIndex((prev) => {
        const next = prev + 1;
        return next >= dept.members.length ? 0 : next;
      });
    }, 2200);
    return () => clearInterval(timer);
  }, [dept.members.length, selectedIndex]);

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

          <AnimatePresence mode="wait">
            <motion.h2
              key={dept.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-[-0.03em] leading-[1.15] mb-3"
            >
              Meet your new{' '}
              <span
                className="italic"
                style={{ color: dept.color }}
              >
                {dept.name.toLowerCase()}
              </span>{' '}
              squad
            </motion.h2>
          </AnimatePresence>

          <p className="text-base sm:text-lg text-gray-500">
            Your team and AI agents, working as one
          </p>
        </motion.div>

        {/* Squad visual */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mb-10 sm:mb-12"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={dept.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex items-end justify-center gap-4 sm:gap-6 md:gap-8"
            >
              {dept.members.map((member, i) => {
                const isCenter = member.role === 'Team Lead';
                return (
                  <SquadAvatar
                    key={member.id}
                    member={member}
                    isCenter={isCenter}
                    isLit={litMemberIndex === i}
                    deptColor={dept.color}
                    avatarImage={isCenter ? avatar?.image : undefined}
                    delay={0.05 + i * 0.08}
                  />
                );
              })}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Department selector */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="flex justify-center"
        >
          <div className="inline-flex items-center gap-4 md:gap-5 px-5 py-3 rounded-xl border border-gray-200 bg-gray-50/40">
            {SQUAD_DEPARTMENTS.map((d, i) => {
              const isSelected = selectedIndex === i;
              const DepIcon = d.icon;
              const av = avatarMap[d.supabaseKey];
              const avColor = av?.color || d.color;

              return (
                <motion.button
                  key={d.id}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => handleDeptChange(i)}
                  className="flex flex-col items-center gap-1 cursor-pointer shrink-0 group"
                >
                  <div
                    className={`
                      rounded-full overflow-hidden transition-all duration-300
                      ${isSelected
                        ? 'w-11 h-11 md:w-12 md:h-12 ring-[2.5px] ring-offset-2 ring-offset-white'
                        : 'w-9 h-9 md:w-10 md:h-10 group-hover:ring-[1.5px] group-hover:ring-gray-300 group-hover:ring-offset-1 group-hover:ring-offset-white'
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
                          className={`text-white transition-all duration-300 ${isSelected ? 'w-5 h-5' : 'w-4 h-4'}`}
                          strokeWidth={2}
                        />
                      </div>
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
      </div>
    </section>
  );
}
