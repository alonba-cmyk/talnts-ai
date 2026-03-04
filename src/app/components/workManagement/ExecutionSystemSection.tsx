"use client";

import { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  Briefcase,
  Target,
  FileText,
  TrendingUp,
  Bot,
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
import { WORK_MANAGEMENT_TRIAL_URL } from '@/lib/workManagementUrls';

const FIGMA_AGENT_ASSETS = {
  assetsGenerator:
    'https://www.figma.com/api/mcp/asset/a4778f09-d617-48b6-beca-66dfaea6d37d',
  riskAnalyzer:
    'https://www.figma.com/api/mcp/asset/9fac6eaf-0070-4330-a0e8-9b709bc7992f',
  vendorResearcher:
    'https://www.figma.com/api/mcp/asset/0d268e64-b934-4159-b4b4-3714996b634e',
};

/* ─── Department data ─── */

type Department = {
  id: string;
  name: string;
  color: string;
  icon: LucideIcon;
  supabaseKey: string;
  agent: {
    label: string;
    bgColor: string;
    img: string;
    fallback: string;
    status: string;
    description: string;
  };
  jtbd: string[];
  boardItems: { id: string; label: string; columnIndex: number }[];
};

const DEPARTMENTS: Department[] = [
  {
    id: 'pmo',
    name: 'PMO',
    color: '#ff6b10',
    icon: Briefcase,
    supabaseKey: 'operations',
    agent: {
      label: 'Risk analyzer',
      bgColor: '#FFD633',
      img: FIGMA_AGENT_ASSETS.riskAnalyzer,
      fallback: agentOrange,
      status: 'Prioritizing risks',
      description: 'Detects ticket intent, urgency, and required expertise',
    },
    jtbd: [
      'Track portfolio progress',
      'Manage resource capacity',
      'Automate status reports',
      'Align teams on goals',
      'Flag project risks',
    ],
    boardItems: [
      { id: 'pmo1', label: 'Q4 Portfolio review', columnIndex: 0 },
      { id: 'pmo2', label: 'Resource allocation', columnIndex: 0 },
      { id: 'pmo3', label: 'Budget reforecast', columnIndex: 1 },
      { id: 'pmo4', label: 'Stakeholder update', columnIndex: 1 },
      { id: 'pmo5', label: 'Risk assessment', columnIndex: 2 },
      { id: 'pmo6', label: 'Sprint retrospective', columnIndex: 3 },
    ],
  },
  {
    id: 'product',
    name: 'Product',
    color: '#6161FF',
    icon: Lightbulb,
    supabaseKey: 'product',
    agent: {
      label: 'Assets Generator',
      bgColor: '#93beff',
      img: FIGMA_AGENT_ASSETS.assetsGenerator,
      fallback: agentCyan,
      status: 'Generating mockups',
      description: 'Creates images from text prompts based on your brand guidelines',
    },
    jtbd: [
      'Prioritize feature backlog',
      'Analyze user feedback',
      'Plan sprint capacity',
      'Track release progress',
      'Generate product specs',
    ],
    boardItems: [
      { id: 'pr1', label: 'Feature discovery', columnIndex: 0 },
      { id: 'pr2', label: 'User research', columnIndex: 0 },
      { id: 'pr3', label: 'Design review', columnIndex: 1 },
      { id: 'pr4', label: 'API integration', columnIndex: 2 },
      { id: 'pr5', label: 'QA testing', columnIndex: 2 },
      { id: 'pr6', label: 'Release notes', columnIndex: 3 },
    ],
  },
  {
    id: 'operations',
    name: 'Operations',
    color: '#00baff',
    icon: Settings,
    supabaseKey: 'operations',
    agent: {
      label: 'Vendor researcher',
      bgColor: '#d7bdff',
      img: FIGMA_AGENT_ASSETS.vendorResearcher,
      fallback: agentPink,
      status: 'Researching vendors',
      description: 'Researches vendors based on pre-defined criteria',
    },
    jtbd: [
      'Optimize vendor pipeline',
      'Manage procurement flow',
      'Track SLA compliance',
      'Automate onboarding',
      'Audit operational costs',
    ],
    boardItems: [
      { id: 'op1', label: 'Vendor evaluation', columnIndex: 0 },
      { id: 'op2', label: 'Contract renewal', columnIndex: 0 },
      { id: 'op3', label: 'SLA monitoring', columnIndex: 1 },
      { id: 'op4', label: 'Cost optimization', columnIndex: 2 },
      { id: 'op5', label: 'Process automation', columnIndex: 3 },
    ],
  },
  {
    id: 'hr',
    name: 'HR',
    color: '#fc0',
    icon: Heart,
    supabaseKey: 'hr',
    agent: {
      label: 'Risk analyzer',
      bgColor: '#FFD633',
      img: FIGMA_AGENT_ASSETS.riskAnalyzer,
      fallback: agentOrange,
      status: 'Screening candidates',
      description: 'Screens resumes and matches candidates to open roles',
    },
    jtbd: [
      'Streamline hiring pipeline',
      'Onboard new employees',
      'Track employee engagement',
      'Manage performance reviews',
      'Automate leave requests',
    ],
    boardItems: [
      { id: 'hr1', label: 'Job posting review', columnIndex: 0 },
      { id: 'hr2', label: 'Candidate screening', columnIndex: 1 },
      { id: 'hr3', label: 'Interview scheduling', columnIndex: 1 },
      { id: 'hr4', label: 'Offer approval', columnIndex: 2 },
      { id: 'hr5', label: 'Onboarding checklist', columnIndex: 3 },
    ],
  },
  {
    id: 'marketing',
    name: 'Marketing',
    color: '#ff84e4',
    icon: Megaphone,
    supabaseKey: 'marketing',
    agent: {
      label: 'Assets Generator',
      bgColor: '#93beff',
      img: FIGMA_AGENT_ASSETS.assetsGenerator,
      fallback: agentCyan,
      status: 'Generating assets',
      description: 'Creates images from text prompts based on your brand guidelines',
    },
    jtbd: [
      'Plan campaign launches',
      'Generate creative assets',
      'Analyze campaign ROI',
      'Manage content calendar',
      'Track brand consistency',
    ],
    boardItems: [
      { id: 'mk1', label: 'Campaign brief', columnIndex: 0 },
      { id: 'mk2', label: 'Creative production', columnIndex: 1 },
      { id: 'mk3', label: 'Ad copy review', columnIndex: 1 },
      { id: 'mk4', label: 'Landing page QA', columnIndex: 2 },
      { id: 'mk5', label: 'Launch go/no-go', columnIndex: 2 },
      { id: 'mk6', label: 'Performance report', columnIndex: 3 },
    ],
  },
  {
    id: 'finance',
    name: 'Finance',
    color: '#00D2D2',
    icon: DollarSign,
    supabaseKey: 'finance',
    agent: {
      label: 'Risk analyzer',
      bgColor: '#FFD633',
      img: FIGMA_AGENT_ASSETS.riskAnalyzer,
      fallback: agentOrange,
      status: 'Analyzing budgets',
      description: 'Detects anomalies in financial data and flags risks',
    },
    jtbd: [
      'Automate expense approval',
      'Track budget vs. actuals',
      'Forecast revenue trends',
      'Manage invoice workflows',
      'Ensure compliance',
    ],
    boardItems: [
      { id: 'fn1', label: 'Monthly close', columnIndex: 0 },
      { id: 'fn2', label: 'Expense review', columnIndex: 1 },
      { id: 'fn3', label: 'Budget reforecast', columnIndex: 2 },
      { id: 'fn4', label: 'Audit preparation', columnIndex: 3 },
    ],
  },
];

const COLUMNS = ['To Do', 'In Progress', 'Review', 'Done'];

const JTBD_ICONS = [Target, Briefcase, FileText, TrendingUp, Bot];

type BoardItem = {
  id: string;
  label: string;
  columnIndex: number;
  pendingApproval?: boolean;
  isNew?: boolean;
};

function AnimatedStatus({ text, color = '#6161FF' }: { text: string; color?: string }) {
  const [dots, setDots] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setDots((d) => (d + 1) % 4), 350);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="text-sm font-semibold" style={{ color }}>
      {text}{'.'.repeat(dots)}
    </span>
  );
}

/* ─── Board views with staggered Notion-style entrance ─── */

function BoardTasksView({
  itemsByColumn,
  highlightedCardId,
  animKey,
}: {
  itemsByColumn: BoardItem[][];
  highlightedCardId: string | null;
  animKey: string;
}) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {COLUMNS.map((col, colIdx) => (
        <motion.div
          key={`${animKey}-col-${col}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: colIdx * 0.07, duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="rounded-lg bg-gray-50 border border-gray-100 p-3"
        >
          <div className="text-xs font-medium text-gray-500 mb-3">{col}</div>
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {itemsByColumn[colIdx]?.map((item, cardIdx) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    boxShadow:
                      highlightedCardId === item.id
                        ? '0 0 0 2px #6161FF'
                        : 'none',
                  }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    delay: colIdx * 0.07 + cardIdx * 0.05,
                    type: 'spring',
                    stiffness: 400,
                    damping: 28,
                  }}
                  className={`h-8 rounded-md bg-white border flex items-center justify-between px-3 text-xs text-gray-700 ${
                    item.pendingApproval
                      ? 'border-amber-400 bg-amber-50/60'
                      : 'border-gray-200'
                  }`}
                >
                  <span className="truncate flex-1">{item.label}</span>
                  {item.pendingApproval && (
                    <span className="text-[10px] text-amber-600 shrink-0 ml-2">
                      Pending
                    </span>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Main component ─── */

export function ExecutionSystemSection() {
  const [selectedDeptIndex, setSelectedDeptIndex] = useState(0);
  const [selectedJtbd, setSelectedJtbd] = useState(0);
  const [highlightedCardId, setHighlightedCardId] = useState<string | null>(null);

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
  const itemsByColumn = COLUMNS.map((_, colIdx) =>
    boardItems.filter((i) => i.columnIndex === colIdx)
  );
  const animKey = dept.id;

  const handleDeptChange = useCallback((index: number) => {
    setSelectedDeptIndex(index);
    setSelectedJtbd(0);
    setHighlightedCardId(null);
  }, []);

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
              const DeptIcon = d.icon;
              const avatar = avatarMap[d.supabaseKey];
              const avatarColor = avatar?.color || d.color;
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
                        backgroundColor: avatarColor,
                        ...(isSelected ? { ['--tw-ring-color' as string]: avatarColor } : {}),
                      }}
                    >
                      {avatar?.image ? (
                        <img
                          src={avatar.image}
                          alt={d.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <DeptIcon
                            className={`text-white transition-all duration-300 ${
                              isSelected ? 'w-6 h-6 md:w-7 md:h-7' : 'w-5 h-5 md:w-6 md:h-6'
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
                        style={{ boxShadow: `0 0 20px ${avatarColor}` }}
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

        {/* ── Main workspace ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-2xl border border-gray-200 bg-gray-50/30 shadow-xl shadow-black/[0.04] overflow-hidden"
        >
          {/* Content area: sidebar + board + agent */}
          <div className="grid grid-cols-[200px_1fr] min-h-[460px]">
            {/* ── Left sidebar: JTBD ── */}
            <div className="border-r border-gray-100 bg-gray-50/40 p-4">
              <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Jobs to be done
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={dept.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-1"
                >
                  {dept.jtbd.map((job, i) => {
                    const Icon = JTBD_ICONS[i % JTBD_ICONS.length];
                    return (
                      <motion.button
                        key={job}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04, duration: 0.25 }}
                        onClick={() => setSelectedJtbd(i)}
                        className={`w-full flex items-start gap-2.5 px-3 py-2.5 rounded-lg text-left transition-all ${
                          selectedJtbd === i
                            ? 'bg-white shadow-sm border border-gray-200 text-gray-900'
                            : 'text-gray-600 hover:bg-white/70 hover:text-gray-800'
                        }`}
                      >
                        <Icon
                          className={`w-4 h-4 mt-0.5 shrink-0 ${
                            selectedJtbd === i ? 'text-[#6161FF]' : 'text-gray-400'
                          }`}
                        />
                        <span className="text-xs font-medium leading-snug">
                          {job}
                        </span>
                      </motion.button>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ── Board + floating agent ── */}
            <div className="relative p-6 pb-8">
              {/* Board content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={animKey}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <BoardTasksView
                    itemsByColumn={itemsByColumn}
                    highlightedCardId={highlightedCardId}
                    animKey={animKey}
                  />
                </motion.div>
              </AnimatePresence>

              {/* ── Floating agent card ── */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={dept.id}
                  initial={{ opacity: 0, y: 24, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.94 }}
                  transition={{ type: 'spring', stiffness: 240, damping: 20, delay: 0.15 }}
                  className="absolute bottom-4 right-5 w-[300px] rounded-2xl bg-white overflow-visible"
                  style={{
                    border: `1.5px solid ${dept.agent.bgColor}50`,
                    boxShadow: `0 12px 40px ${dept.agent.bgColor}30, 0 4px 12px rgba(0,0,0,0.08)`,
                  }}
                >
                  {/* Agent illustration -- large, overflowing top */}
                  <div
                    className="relative rounded-t-2xl overflow-hidden"
                    style={{ background: `linear-gradient(135deg, ${dept.agent.bgColor}, ${dept.agent.bgColor}cc)` }}
                  >
                    <div className="relative h-48 flex items-end justify-center">
                      <img
                        src={dept.agent.img}
                        alt={dept.agent.label}
                        className="h-[110%] w-auto max-w-none object-contain object-bottom drop-shadow-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = dept.agent.fallback;
                        }}
                      />
                    </div>
                    {/* Bottom gradient into white */}
                    <div
                      className="absolute inset-x-0 bottom-0 h-16 pointer-events-none"
                      style={{ background: 'linear-gradient(to top, white, transparent)' }}
                    />
                    {/* AI badge floating on image */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 shadow-sm">
                      <motion.span
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: dept.color }}
                      />
                      <span className="text-[10px] font-bold text-gray-700">AI Agent</span>
                    </div>
                  </div>

                  {/* Agent info */}
                  <div className="px-5 pt-2 pb-4">
                    <div className="flex items-center gap-2.5 mb-2">
                      <span className="text-lg font-bold text-gray-900">
                        {dept.agent.label}
                      </span>
                      <span
                        className="text-[10px] font-bold text-white px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: dept.color }}
                      >
                        {dept.name}
                      </span>
                    </div>
                    <AnimatedStatus text={dept.agent.status} color={dept.color} />
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed line-clamp-2">
                      {dept.agent.description}
                    </p>
                  </div>

                  {/* Ambient glow behind card */}
                  <motion.div
                    animate={{ opacity: [0.06, 0.18, 0.06] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -inset-2 rounded-3xl pointer-events-none -z-10"
                    style={{ boxShadow: `0 0 50px ${dept.agent.bgColor}` }}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
