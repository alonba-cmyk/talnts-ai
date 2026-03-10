import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  Bot,
  LayoutGrid,
  Database,
  Shield,
  Lock,
  BarChart3,
  FileText,
  Columns3,
  PenTool,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Globe,
  Layers,
  Eye,
  ThumbsUp,
  MessageSquare,
  Zap,
  Search,
  PenLine,
  List,
  FolderOpen,
  FileCode,
  Cpu,
} from 'lucide-react';
import { FIGMA_AGENT_ASSETS, DEPARTMENTS } from './wmDepartmentData';
import { useDepartments, useSiteSettings } from '@/hooks/useSupabase';

/* ─── Execution Layer Panel ─── */

const AGENTS = [
  { name: 'Assets Generator', img: FIGMA_AGENT_ASSETS.assetsGenerator, color: '#FFE066' },
  { name: 'Vendor Researcher', img: FIGMA_AGENT_ASSETS.vendorResearcher, color: '#d7bdff' },
];

type DeptAvatar = { name: string; img: string; color: string };

const EXEC_TASKS = [
  { label: 'Campaign brief review', person: 'Sarah K.', agent: 'Content Agent', status: 'In Progress', statusColor: '#f59e0b', statusBg: '#fef3c7' },
  { label: 'Vendor outreach batch', person: null, agent: 'Outreach Agent', status: 'Working', statusColor: '#8b5cf6', statusBg: '#ede9fe' },
  { label: 'Budget approval', person: 'Alex M.', agent: null, status: 'Pending', statusColor: '#6b7280', statusBg: '#f3f4f6' },
  { label: 'Risk assessment report', person: null, agent: 'Risk Analyzer', status: 'Done', statusColor: '#10b981', statusBg: '#d1fae5' },
];

function ExecutionLayerPanel({ people }: { people: DeptAvatar[] }) {
  const [activeRow, setActiveRow] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActiveRow(r => (r + 1) % EXEC_TASKS.length), 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#6161ff]/10">
          <Users className="w-5 h-5 text-[#6161ff]" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Execution Layer</h3>
          <p className="text-xs text-gray-500">People orchestrate, AI executes</p>
        </div>
      </div>

      {/* Squad strip — dept avatars from Supabase */}
      <div className="flex items-center gap-2 mb-5">
        {people.map((person, i) => (
          <motion.div
            key={person.name}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="w-10 h-10 rounded-full overflow-hidden shadow-sm ring-2 ring-white"
            style={{ backgroundColor: person.color }}
          >
            {person.img
              ? <img src={person.img} alt={person.name} className="w-full h-full object-cover" loading="lazy" />
              : <span className="w-full h-full flex items-center justify-center text-white text-[10px] font-bold">{person.name.charAt(0)}</span>
            }
          </motion.div>
        ))}
        <div className="w-px h-6 bg-gray-200 mx-1" />
        {AGENTS.map((agent, i) => (
          <motion.div
            key={agent.name}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="w-10 h-10 rounded-xl overflow-hidden shadow-sm"
            style={{ background: `linear-gradient(135deg, ${agent.color}cc, ${agent.color})` }}
          >
            <img src={agent.img} alt={agent.name} className="w-full h-full object-contain object-bottom" loading="lazy" />
          </motion.div>
        ))}
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-[10px] font-semibold text-[#6161ff] bg-[#6161ff]/8 px-2 py-1 rounded-full ml-1"
        >
          +3 agents
        </motion.span>
      </div>

      {/* Task list */}
      <div className="flex-1 space-y-1">
        {EXEC_TASKS.map((task, i) => {
          const isActive = activeRow === i;
          return (
            <motion.div
              key={task.label}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.08 }}
              animate={{
                backgroundColor: isActive ? '#f8f7ff' : 'transparent',
                borderColor: isActive ? '#6161ff30' : 'transparent',
              }}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg border transition-all"
            >
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-medium text-gray-800 truncate">{task.label}</p>
                <p className="text-[9px] text-gray-400 truncate">
                  {task.person && task.agent
                    ? `${task.person} + ${task.agent}`
                    : task.agent || task.person}
                </p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {task.agent && (
                  <motion.div
                    animate={isActive ? { opacity: [0.5, 1, 0.5] } : { opacity: 0.6 }}
                    transition={isActive ? { duration: 1.5, repeat: Infinity } : {}}
                  >
                    <Bot className="w-3 h-3 text-[#6161ff]" />
                  </motion.div>
                )}
                <span
                  className="text-[9px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap"
                  style={{ color: task.statusColor, backgroundColor: task.statusBg }}
                >
                  {task.status}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="pt-4 mt-auto border-t border-gray-100">
        <p className="text-[11px] text-gray-500 leading-relaxed">
          <span className="font-semibold text-gray-700">People orchestrate, AI executes.</span> You set the direction — agents handle the heavy lifting at scale.
        </p>
      </div>
    </div>
  );
}

/* ─── Execution Expanded: Orchestrators vs Executors ─── */

const EXPANDED_AGENTS = [
  { name: 'Assets Generator', img: FIGMA_AGENT_ASSETS.assetsGenerator, color: '#FFE066' },
  { name: 'Vendor Researcher', img: FIGMA_AGENT_ASSETS.vendorResearcher, color: '#d7bdff' },
  { name: 'Risk Analyzer', img: FIGMA_AGENT_ASSETS.riskAnalyzer, color: '#ff8fd8' },
];

const ORCHESTRATOR_ACTIONS = [
  { label: 'Set campaign direction', sub: 'Sarah K., Marketing lead', action: 'Approved', icon: ThumbsUp, color: '#10b981' },
  { label: 'Review vendor proposal', sub: 'Alex M., Procurement', action: 'Reviewed', icon: Eye, color: '#6161ff' },
  { label: 'Define Q3 goals', sub: 'Jamie L., Product owner', action: 'Set direction', icon: MessageSquare, color: '#f59e0b' },
  { label: 'Final budget sign-off', sub: 'Dana R., Finance', action: 'Approved', icon: ThumbsUp, color: '#10b981' },
];

const EXECUTOR_ACTIONS = [
  { label: 'Generated campaign brief', agent: 'Content Agent', icon: PenLine, color: '#8b5cf6' },
  { label: 'Analyzed 120 vendors', agent: 'Vendor Researcher', icon: Search, color: '#d7bdff' },
  { label: 'Drafted risk report', agent: 'Risk Analyzer', icon: FileText, color: '#ff8fd8' },
  { label: 'Built 14 ad variations', agent: 'Assets Generator', icon: Zap, color: '#FFE066' },
];

function ExecutionExpandedDual({ people }: { people: DeptAvatar[] }) {
  const [activeOrch, setActiveOrch] = useState(0);
  const [activeExec, setActiveExec] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveOrch(r => (r + 1) % ORCHESTRATOR_ACTIONS.length);
      setActiveExec(r => (r + 1) % EXECUTOR_ACTIONS.length);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  return (
    /* 6-cell grid: 2 cols × 3 rows — every row spans both sides so heights are always equal */
    <div
      className="grid min-h-[400px]"
      style={{ gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'auto auto 1fr' }}
    >
      {/* ── Row 1: Headers ── */}
      <div className="px-6 lg:px-8 pt-5 pb-4">
        <h4 className="text-base font-semibold text-gray-700">Orchestrators</h4>
        <p className="text-xs text-gray-400">People lead the way</p>
      </div>

      <div className="px-6 lg:px-8 pt-5 pb-4 border-l border-gray-100 bg-gradient-to-br from-[#8b5cf6]/[0.02] to-transparent">
        <h4 className="text-base font-semibold text-gray-700">Executors</h4>
        <p className="text-xs text-gray-400">AI agents do the heavy lifting</p>
      </div>

      {/* ── Row 2: Avatars ── */}
      <div className="flex items-center gap-3 px-6 lg:px-8 pb-5">
        {people.map((person, i) => (
          <motion.div
            key={person.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.35 }}
            className="flex flex-col items-center gap-1.5"
          >
            <div
              className="w-14 h-14 rounded-full overflow-hidden shadow-md ring-3 ring-white"
              style={{ backgroundColor: person.color }}
            >
              {person.img
                ? <img src={person.img} alt={person.name} className="w-full h-full object-cover" loading="lazy" />
                : <span className="w-full h-full flex items-center justify-center text-white text-sm font-bold">{person.name.charAt(0)}</span>
              }
            </div>
            <span className="text-[10px] font-medium text-gray-400 whitespace-nowrap">{person.name.split(' ')[0]}</span>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center gap-3 px-6 lg:px-8 pb-5 border-l border-gray-100 bg-gradient-to-br from-[#8b5cf6]/[0.02] to-transparent">
        {EXPANDED_AGENTS.map((agent, i) => (
          <motion.div
            key={agent.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 + i * 0.1, duration: 0.35 }}
            className="flex flex-col items-center gap-1.5"
          >
            <div
              className="w-14 h-14 rounded-xl overflow-hidden shadow-md"
              style={{ background: `linear-gradient(135deg, ${agent.color}bb, ${agent.color})` }}
            >
              <img src={agent.img} alt={agent.name} className="w-full h-full object-contain object-bottom" loading="lazy" />
            </div>
            <span className="text-[10px] font-medium text-gray-400 whitespace-nowrap">{agent.name.split(' ')[0]}</span>
          </motion.div>
        ))}
      </div>

      {/* ── Row 3: Action feeds ── */}
      <div className="px-6 lg:px-8 pb-6 lg:pb-8 space-y-1.5 self-start">
        {ORCHESTRATOR_ACTIONS.map((item, i) => {
          const isActive = activeOrch === i;
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              animate={{
                backgroundColor: isActive ? '#f8f7ff' : 'transparent',
                borderColor: isActive ? '#6161ff30' : '#f3f4f6',
                scale: isActive ? 1.005 : 1,
              }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border transition-all"
            >
              <div
                className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${item.color}10` }}
              >
                <Icon className="w-3.5 h-3.5" style={{ color: item.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-gray-600">{item.label}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{item.sub}</p>
              </div>
              <span
                className="text-[10px] font-medium px-2.5 py-0.5 rounded-full whitespace-nowrap"
                style={{ color: item.color, backgroundColor: `${item.color}10` }}
              >
                {item.action}
              </span>
            </motion.div>
          );
        })}
      </div>

      <div className="px-6 lg:px-8 pb-6 lg:pb-8 space-y-1.5 self-start border-l border-gray-100 bg-gradient-to-br from-[#8b5cf6]/[0.02] to-transparent">
        {EXECUTOR_ACTIONS.map((item, i) => {
          const isActive = activeExec === i;
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              animate={{
                backgroundColor: isActive ? '#faf5ff' : 'transparent',
                borderColor: isActive ? '#8b5cf630' : '#f3f4f6',
                scale: isActive ? 1.005 : 1,
              }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border transition-all"
            >
              <div
                className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${item.color}10` }}
              >
                <motion.div
                  animate={isActive ? { opacity: [0.5, 1, 0.5] } : { opacity: 0.7 }}
                  transition={isActive ? { duration: 1.5, repeat: Infinity } : {}}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: item.color }} />
                </motion.div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-gray-600">{item.label}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{item.agent}</p>
              </div>
              {isActive && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-1"
                >
                  <motion.div
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6]"
                  />
                  <span className="text-[9px] font-medium text-[#8b5cf6]">Working</span>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Work Surface Panel ─── */

const SURFACE_TABS = ['Items', 'Kanban', 'Dashboard', 'Canvas'] as const;
type SurfaceTab = typeof SURFACE_TABS[number];

function MiniItems() {
  const rows = [
    { name: 'Campaign brief', status: 'In Progress', statusColor: '#f59e0b', statusBg: '#fef3c7', priority: 'High', owner: 'S' },
    { name: 'Brand assets', status: 'Done', statusColor: '#10b981', statusBg: '#d1fae5', priority: 'Med', owner: 'A' },
    { name: 'Landing page copy', status: 'Stuck', statusColor: '#ef4444', statusBg: '#fee2e2', priority: 'High', owner: 'J' },
    { name: 'Social media kit', status: 'Not started', statusColor: '#9ca3af', statusBg: '#f3f4f6', priority: 'Low', owner: 'D' },
  ];
  return (
    <div className="space-y-0.5">
      {/* Header row */}
      <div className="grid grid-cols-[1fr_80px_48px_24px] gap-2 px-2 pb-1.5 border-b border-gray-100">
        <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">Item</span>
        <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">Status</span>
        <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">Priority</span>
        <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider"></span>
      </div>
      {rows.map((row, i) => (
        <motion.div
          key={row.name}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.06, duration: 0.25 }}
          className="grid grid-cols-[1fr_80px_48px_24px] gap-2 items-center px-2 py-1.5 rounded-md hover:bg-gray-50 transition-colors"
        >
          <span className="text-[10px] font-medium text-gray-700 truncate">{row.name}</span>
          <span
            className="text-[8px] font-semibold px-1.5 py-0.5 rounded text-center"
            style={{ color: row.statusColor, backgroundColor: row.statusBg }}
          >
            {row.status}
          </span>
          <span className="text-[8px] font-medium text-gray-500 text-center">{row.priority}</span>
          <div className="w-5 h-5 rounded-full bg-[#97aeff] flex items-center justify-center flex-shrink-0">
            <span className="text-[6px] text-white font-bold">{row.owner}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function MiniKanban() {
  const columns = [
    { name: 'To Do', color: '#6b7280', items: ['Design review', 'Copy update'] },
    { name: 'In Progress', color: '#f59e0b', items: ['Landing page', 'A/B test'] },
    { name: 'Done', color: '#10b981', items: ['Brand assets'] },
  ];
  return (
    <div className="grid grid-cols-3 gap-2">
      {columns.map((col) => (
        <div key={col.name} className="space-y-1.5">
          <div className="flex items-center gap-1.5 mb-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: col.color }} />
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">{col.name}</span>
          </div>
          {col.items.map((item) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white border border-gray-150 rounded-md px-2 py-2 shadow-sm"
            >
              <p className="text-[10px] text-gray-700 font-medium">{item}</p>
              <div className="flex items-center gap-1 mt-1.5">
                <div className="w-4 h-4 rounded-full bg-[#97aeff] flex items-center justify-center">
                  <span className="text-[6px] text-white font-bold">S</span>
                </div>
                <div className="h-1 flex-1 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full rounded-full bg-[#6161ff]/40" style={{ width: '60%' }} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  );
}

function MiniCanvas() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <PenTool className="w-3 h-3 text-[#00d2d2]" />
        <span className="text-[10px] font-semibold text-gray-600">Project Canvas</span>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded-full w-4/5" />
        <div className="h-3 bg-gray-150 rounded-full w-3/5" />
        <div className="h-3 bg-gray-100 rounded-full w-2/3" />
      </div>
      <div className="flex gap-2 mt-3">
        <div className="flex-1 rounded-lg border-2 border-dashed border-[#00d2d2]/30 bg-[#00d2d2]/5 p-3 flex flex-col items-center justify-center">
          <FileText className="w-5 h-5 text-[#00d2d2]/50 mb-1" />
          <span className="text-[8px] text-[#00d2d2] font-medium">Doc</span>
        </div>
        <div className="flex-1 rounded-lg border-2 border-dashed border-[#f59e0b]/30 bg-[#f59e0b]/5 p-3 flex flex-col items-center justify-center">
          <LayoutGrid className="w-5 h-5 text-[#f59e0b]/50 mb-1" />
          <span className="text-[8px] text-[#f59e0b] font-medium">Whiteboard</span>
        </div>
        <div className="flex-1 rounded-lg border-2 border-dashed border-[#8b5cf6]/30 bg-[#8b5cf6]/5 p-3 flex flex-col items-center justify-center">
          <Layers className="w-5 h-5 text-[#8b5cf6]/50 mb-1" />
          <span className="text-[8px] text-[#8b5cf6] font-medium">Form</span>
        </div>
      </div>
    </div>
  );
}

function MiniDashboard() {
  const bars = [65, 85, 45, 92, 70, 55, 80];
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold text-gray-600">Performance Overview</p>
          <p className="text-[8px] text-gray-400">Last 7 days</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-gray-900">94%</p>
          <p className="text-[8px] text-[#10b981] font-semibold">+12% vs last week</p>
        </div>
      </div>
      <div className="flex items-end gap-1.5 h-20">
        {bars.map((h, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            animate={{ height: `${h}%` }}
            transition={{ delay: i * 0.08, duration: 0.5, ease: 'easeOut' }}
            className="flex-1 rounded-t-sm"
            style={{
              background: i === bars.length - 1
                ? 'linear-gradient(to top, #6161ff, #8b8bff)'
                : 'linear-gradient(to top, #e5e7eb, #d1d5db)',
            }}
          />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Tasks done', value: '127', color: '#10b981' },
          { label: 'Active agents', value: '8', color: '#6161ff' },
          { label: 'Avg. time', value: '2.1h', color: '#f59e0b' },
        ].map((metric) => (
          <div key={metric.label} className="bg-gray-50 rounded-lg p-2 text-center">
            <p className="text-sm font-bold" style={{ color: metric.color }}>{metric.value}</p>
            <p className="text-[8px] text-gray-400 mt-0.5">{metric.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function WorkSurfacePanel() {
  const [activeTab, setActiveTab] = useState<SurfaceTab>('Items');

  useEffect(() => {
    const id = setInterval(() => {
      setActiveTab(current => {
        const idx = SURFACE_TABS.indexOf(current);
        return SURFACE_TABS[(idx + 1) % SURFACE_TABS.length];
      });
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const handleTabClick = useCallback((tab: SurfaceTab) => {
    setActiveTab(tab);
  }, []);

  const tabIcons: Record<SurfaceTab, typeof LayoutGrid> = {
    Items: List,
    Kanban: Columns3,
    Dashboard: BarChart3,
    Canvas: PenTool,
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#00d2d2]/10">
          <LayoutGrid className="w-5 h-5 text-[#00d2d2]" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Work Surface & Context</h3>
          <p className="text-xs text-gray-500">Your workspace, your way</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-4 bg-gray-100/80 rounded-lg p-1">
        {SURFACE_TABS.map((tab) => {
          const Icon = tabIcons[tab];
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`
                flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-[11px] font-medium transition-all duration-200
                ${isActive
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-400 hover:text-gray-600'
                }
              `}
            >
              <Icon className="w-3 h-3" />
              {tab}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 rounded-xl border border-gray-200 bg-gray-50/50 p-4 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {activeTab === 'Items' && <MiniItems />}
            {activeTab === 'Kanban' && <MiniKanban />}
            {activeTab === 'Dashboard' && <MiniDashboard />}
            {activeTab === 'Canvas' && <MiniCanvas />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="pt-4 mt-auto border-t border-gray-100">
        <p className="text-[11px] text-gray-500 leading-relaxed">
          <span className="font-semibold text-gray-700">Flexible by design.</span> Boards, docs, dashboards, forms — work however fits you best.
        </p>
      </div>
    </div>
  );
}

/* ─── Data Layer Panel ─── */

const INTEGRATIONS = [
  { name: 'Slack', domain: 'slack.com' },
  { name: 'Salesforce', domain: 'salesforce.com' },
  { name: 'Jira', domain: 'atlassian.com' },
  { name: 'Google', domain: 'google.com' },
  { name: 'GitHub', domain: 'github.com' },
  { name: 'HubSpot', domain: 'hubspot.com' },
];

const LOGO = (domain: string) =>
  `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

function DataLayerPanel() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#10b981]/10">
          <Database className="w-5 h-5 text-[#10b981]" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Data Layer</h3>
          <p className="text-xs text-gray-500">Your system of records</p>
        </div>
      </div>

      {/* mondayDB block */}
      <div className="rounded-xl border border-[#10b981]/20 bg-gradient-to-br from-[#10b981]/5 to-transparent p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Database className="w-4 h-4 text-[#10b981]" />
          <span className="text-[12px] font-bold text-gray-800">mondayDB</span>
          <span className="text-[9px] font-medium text-[#10b981] bg-[#10b981]/10 px-2 py-0.5 rounded-full ml-auto">Connected</span>
        </div>
        <div className="space-y-1.5">
          {[
            { label: 'Projects', count: '2,847 items', icon: LayoutGrid },
            { label: 'Contacts', count: '12,350 records', icon: Users },
            { label: 'Documents', count: '891 files', icon: FileText },
          ].map((row) => (
            <div key={row.label} className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-white/60">
              <row.icon className="w-3 h-3 text-gray-400" />
              <span className="text-[10px] font-medium text-gray-700 flex-1">{row.label}</span>
              <span className="text-[9px] text-gray-400">{row.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Integrations flow */}
      <div className="mb-4">
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-2">Connected sources</p>
        <div className="flex items-center gap-1.5 flex-wrap">
          {INTEGRATIONS.map((tool, i) => (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center shadow-sm hover:shadow-md hover:border-gray-300 transition-all"
              title={tool.name}
            >
              <img src={LOGO(tool.domain)} alt={tool.name} className="w-4 h-4" loading="lazy" />
            </motion.div>
          ))}
          <div className="w-8 h-8 rounded-lg bg-gray-50 border border-dashed border-gray-300 flex items-center justify-center">
            <span className="text-[9px] font-bold text-gray-400">+200</span>
          </div>
        </div>
      </div>

      {/* Security badges */}
      <div className="flex-1">
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-2">Compliance & Security</p>
        <div className="flex gap-2 flex-wrap">
          {[
            { label: 'SOC 2', icon: Shield },
            { label: 'GDPR', icon: Globe },
            { label: 'ISO 27001', icon: Lock },
            { label: 'HIPAA', icon: CheckCircle2 },
          ].map((badge) => (
            <div
              key={badge.label}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-50 border border-gray-200"
            >
              <badge.icon className="w-3 h-3 text-[#10b981]" />
              <span className="text-[9px] font-semibold text-gray-600">{badge.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 mt-auto border-t border-gray-100">
        <p className="text-[11px] text-gray-500 leading-relaxed">
          <span className="font-semibold text-gray-700">Single source of truth.</span> All your data — secured, governed, and compliant.
        </p>
      </div>
    </div>
  );
}

/* ─── Shared Panel Config ─── */

const PANEL_META = [
  {
    id: 'execution' as const,
    layerNumber: '01',
    accent: '#6161ff',
    icon: Users,
    title: 'Execution Layer',
    subtitle: 'People orchestrate, AI executes',
    description: 'Your team sets the direction, approves, and oversees — AI agents handle the heavy lifting at scale. A clear division: humans lead, machines deliver.',
    shortDescription: 'You lead, AI delivers — agents handle the heavy lifting at scale.',
    bullets: ['People define goals, review, and approve', 'Agents draft, analyze, research, and build', 'Full visibility and control at every step'],
  },
  {
    id: 'surface' as const,
    layerNumber: '02',
    accent: '#00d2d2',
    icon: LayoutGrid,
    title: 'Work Surface & Context',
    subtitle: 'Your workspace, your way',
    description: 'Boards, docs, dashboards, forms — choose the work surface that fits how you think. The platform adapts to you, not the other way around.',
    shortDescription: 'Boards, docs, dashboards — work however fits you best.',
    bullets: ['Kanban boards, timelines, tables', 'Canvas docs and whiteboards', 'Real-time dashboards and reports'],
  },
  {
    id: 'data' as const,
    layerNumber: '03',
    accent: '#10b981',
    icon: Database,
    title: 'Data Layer',
    subtitle: 'Your system of records',
    description: 'All your organizational data in one place — structured, secured, and compliant. Connected to 200+ tools with enterprise-grade governance.',
    shortDescription: 'All your data — structured, secured, and connected to 200+ tools.',
    bullets: ['mondayDB: your single source of truth', '200+ integrations connected', 'SOC 2, GDPR, ISO 27001, HIPAA compliant'],
  },
];

const PANELS = PANEL_META.map(p => ({
  ...p,
  Component: p.id === 'execution' ? ExecutionLayerPanel
    : p.id === 'surface' ? WorkSurfacePanel
    : DataLayerPanel,
}));

/* ─── Grid Variant (original) ─── */

function GridVariant({ people }: { people: DeptAvatar[] }) {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {PANELS.map((panel, i) => (
          <motion.div
            key={panel.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: i * 0.15, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.08)' }}
            className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-7 transition-shadow duration-300"
            style={{
              boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
              borderTop: `3px solid ${panel.accent}25`,
            }}
          >
            {panel.id === 'execution'
              ? <ExecutionLayerPanel people={people} />
              : <panel.Component />
            }
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="flex justify-center mt-10"
      >
        <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-gray-50 border border-gray-200">
          <div className="flex -space-x-1">
            {['#6161ff', '#00d2d2', '#10b981'].map((c) => (
              <div
                key={c}
                className="w-3 h-3 rounded-full border-2 border-white"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <span className="text-[12px] text-gray-600">
            All layers work together, powered by <span className="font-bold text-gray-800">monday AI</span>
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
        </div>
      </motion.div>
    </>
  );
}

/* ─── Masonry Expand Variant (Bento Swap) ─── */

type PanelId = 'execution' | 'surface' | 'data';
type BentoStyle = 'dark_gradient' | 'glass_blur';

/* ── Style helpers ── */

const isDark = (s: BentoStyle) => s === 'dark_gradient';

/* ── Featured visual previews (LEFT side of split card) ── */

const CONVERSATIONS = [
  { personMsg: 'Draft the Q4 report', agentMsg: 'Report drafted, 12 pages' },
  { personMsg: 'Find top 5 vendors', agentMsg: '5 vendors compared, report ready' },
  { personMsg: 'Analyze project risks', agentMsg: '3 risks identified, mitigations set' },
];

type ConvoPhase = 'idle' | 'person_typing' | 'person_message' | 'agent_typing' | 'agent_message';

function TypingDots({ dark }: { dark: boolean }) {
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: dark ? '#97aeff' : '#6161ff' }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}

function ConvoBubble({ text, typing, dark, side }: { text: string; typing: boolean; dark: boolean; side: 'person' | 'agent' }) {
  const isPerson = side === 'person';
  const accentColor = isPerson ? '#6161ff' : '#8b5cf6';
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="rounded-md px-2 py-1"
      style={{
        background: dark
          ? `linear-gradient(135deg, ${accentColor}20, ${accentColor}10)`
          : `${accentColor}08`,
        border: `1px solid ${accentColor}${dark ? '30' : '18'}`,
        boxShadow: dark ? `0 2px 12px ${accentColor}15` : `0 2px 8px ${accentColor}08`,
      }}
    >
      {typing ? (
        <TypingDots dark={dark} />
      ) : (
        <span className={`text-[9px] font-medium ${dark ? 'text-gray-300' : 'text-gray-700'}`} style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.3' }}>{text}</span>
      )}
    </motion.div>
  );
}

function FeaturedExecutionVisual({ people, dark }: { people: DeptAvatar[]; dark: boolean }) {
  const ringColor = dark ? 'rgba(255,255,255,0.15)' : 'white';
  const [activePair, setActivePair] = useState(0);
  const [phase, setPhase] = useState<ConvoPhase>('idle');

  useEffect(() => {
    const initialDelay = setTimeout(() => {
      setPhase('person_typing');
    }, 3000);
    return () => clearTimeout(initialDelay);
  }, []);

  useEffect(() => {
    if (phase === 'idle') return;
    let timeout: ReturnType<typeof setTimeout>;

    if (phase === 'person_typing') {
      timeout = setTimeout(() => setPhase('person_message'), 1200);
    } else if (phase === 'person_message') {
      timeout = setTimeout(() => setPhase('agent_typing'), 1300);
    } else if (phase === 'agent_typing') {
      timeout = setTimeout(() => setPhase('agent_message'), 1200);
    } else if (phase === 'agent_message') {
      timeout = setTimeout(() => {
        setActivePair(prev => (prev + 1) % CONVERSATIONS.length);
        setPhase('person_typing');
      }, 1800);
    }

    return () => clearTimeout(timeout);
  }, [phase]);

  const convo = CONVERSATIONS[activePair];
  const personActive = phase === 'person_typing' || phase === 'person_message';
  const agentActive = phase === 'agent_typing' || phase === 'agent_message';

  return (
    <div className="relative flex items-center justify-center h-full gap-5 py-6 px-6">
      {/* People */}
      <div className="flex flex-col items-center gap-4 min-w-0">
        <span className={`text-[10px] font-bold uppercase tracking-[0.15em] whitespace-nowrap ${dark ? 'text-[#97aeff]' : 'text-[#6161ff]/60'}`}>People</span>
        <div className="flex flex-col gap-3.5">
          {people.map((person, i) => {
            const isActive = personActive && activePair === i;
            return (
              <div key={person.name} className="relative flex items-center gap-3">
                <motion.div
                  animate={isActive ? { scale: 1.06, boxShadow: dark ? `0 0 28px #6161ff50` : `0 0 20px #6161ff25` } : { scale: 1, boxShadow: dark ? `0 0 20px ${person.color}40` : '0 0 0px transparent' }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="w-[60px] h-[60px] flex-shrink-0 rounded-full overflow-hidden"
                  style={{
                    backgroundColor: person.color,
                    border: isActive ? `3px solid ${dark ? '#6161ff' : '#6161ffaa'}` : `3px solid ${ringColor}`,
                  }}
                >
                  {person.img
                    ? <img src={person.img} alt={person.name} className="w-full h-full object-cover" loading="lazy" />
                    : <span className="w-full h-full flex items-center justify-center text-white font-bold text-base">{person.name.charAt(0)}</span>
                  }
                </motion.div>
                <div className="flex flex-col justify-center overflow-hidden" style={{ width: 80, height: 36 }}>
                  <AnimatePresence mode="wait">
                    {isActive ? (
                      <ConvoBubble
                        key={phase === 'person_typing' ? 'typing' : 'msg'}
                        text={convo.personMsg}
                        typing={phase === 'person_typing'}
                        dark={dark}
                        side="person"
                      />
                    ) : (
                      <motion.div key="info" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                        <p className={`text-[14px] font-semibold truncate ${dark ? 'text-white' : 'text-gray-800'}`}>{person.name.split(' ')[0]}</p>
                        <p className={`text-[10px] ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{['Strategist', 'Manager', 'Lead'][i]}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Connection hub */}
      <div className="flex flex-col items-center gap-2 self-center flex-shrink-0">
        <div className={`w-[2px] h-8 rounded-full ${dark ? 'bg-gradient-to-b from-[#6161ff]/40 to-[#8b5cf6]/20' : 'bg-gradient-to-b from-[#6161ff]/20 to-[#8b5cf6]/10'}`} />
        <motion.div
          animate={(personActive || agentActive) ? { scale: [1, 1.08, 1] } : {}}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          key={`hub-${activePair}-${phase}`}
          className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{
            background: dark ? 'linear-gradient(135deg, #6161ff25, #8b5cf625)' : 'linear-gradient(135deg, #6161ff0d, #8b5cf60d)',
            border: `1.5px solid ${dark ? '#6161ff40' : '#6161ff18'}`,
            boxShadow: dark ? '0 0 30px rgba(97,97,255,0.15)' : undefined,
          }}
        >
          <Zap className={`w-5 h-5 ${dark ? 'text-[#97aeff]' : 'text-[#6161ff]'}`} />
        </motion.div>
        <div className={`w-[2px] h-8 rounded-full ${dark ? 'bg-gradient-to-b from-[#8b5cf6]/20 to-[#6161ff]/40' : 'bg-gradient-to-b from-[#8b5cf6]/10 to-[#6161ff]/20'}`} />
      </div>

      {/* Agents */}
      <div className="flex flex-col items-center gap-4 min-w-0">
        <span className={`text-[10px] font-bold uppercase tracking-[0.15em] whitespace-nowrap ${dark ? 'text-[#c4b5fd]' : 'text-[#8b5cf6]/60'}`}>AI Agents</span>
        <div className="flex flex-col gap-3.5">
          {EXPANDED_AGENTS.map((agent, i) => {
            const isActive = agentActive && activePair === i;
            return (
              <div key={agent.name} className="relative flex items-center gap-3">
                <motion.div
                  animate={isActive ? { scale: 1.06, boxShadow: dark ? `0 0 28px ${agent.color}60` : `0 0 20px ${agent.color}30` } : { scale: 1, boxShadow: dark ? `0 0 20px ${agent.color}35` : '0 0 0px transparent' }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="w-[60px] h-[60px] flex-shrink-0 rounded-2xl overflow-hidden"
                  style={{
                    background: `linear-gradient(145deg, ${agent.color}cc, ${agent.color})`,
                    border: isActive ? `3px solid ${dark ? '#8b5cf6' : '#8b5cf6aa'}` : `3px solid ${ringColor}`,
                  }}
                >
                  <img src={agent.img} alt={agent.name} className="w-full h-full object-contain object-bottom" loading="lazy" />
                </motion.div>
                <div className="flex flex-col justify-center overflow-hidden" style={{ width: 80, height: 36 }}>
                  <AnimatePresence mode="wait">
                    {isActive ? (
                      <ConvoBubble
                        key={phase === 'agent_typing' ? 'typing' : 'msg'}
                        text={convo.agentMsg}
                        typing={phase === 'agent_typing'}
                        dark={dark}
                        side="agent"
                      />
                    ) : (
                      <motion.div key="info" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                        <p className={`text-[14px] font-semibold truncate ${dark ? 'text-white' : 'text-gray-800'}`}>{agent.name}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <div className="w-2 h-2 rounded-full bg-[#10b981]" style={dark ? { boxShadow: '0 0 8px #10b98180' } : undefined} />
                          <p className="text-[10px] text-[#10b981] font-medium">Active</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const SURFACE_NAV = [
  { label: 'Items', icon: List, color: '#6161ff', desc: 'Table views & lists', count: '2,847' },
  { label: 'Kanban', icon: Columns3, color: '#f59e0b', desc: 'Visual workflows', count: '124' },
  { label: 'Dashboard', icon: BarChart3, color: '#10b981', desc: 'Reports & insights', count: '38' },
  { label: 'Canvas', icon: PenTool, color: '#00d2d2', desc: 'Docs & whiteboards', count: '215' },
  { label: 'Files', icon: FolderOpen, color: '#f97316', desc: 'Shared storage', count: '1,204' },
  { label: 'Docs', icon: FileCode, color: '#a855f7', desc: 'Collaborative editing', count: '387' },
];

function SurfaceItemsView({ dark }: { dark: boolean }) {
  const c = '#6161ff';
  const rows = [
    { name: 'Homepage Redesign', status: 'In Progress', statusColor: '#f59e0b', person: 'A', pColor: '#6161ff', priority: 'High' },
    { name: 'API Integration', status: 'Done', statusColor: '#10b981', person: 'M', pColor: '#ec4899', priority: 'Medium' },
    { name: 'User Research', status: 'Review', statusColor: '#8b5cf6', person: 'S', pColor: '#f97316', priority: 'High' },
    { name: 'Mobile App v2', status: 'Blocked', statusColor: '#ef4444', person: 'D', pColor: '#00d2d2', priority: 'Critical' },
  ];
  const cellBg = dark ? 'rgba(255,255,255,0.03)' : '#f9fafb';
  const cellBorder = dark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #f3f4f6';
  return (
    <div className="flex flex-col gap-0 rounded-xl overflow-hidden" style={{ border: cellBorder }}>
      {/* Table header */}
      <div className="grid grid-cols-[1fr_90px_44px_70px] gap-0 px-4 py-2.5" style={{ background: dark ? `${c}08` : `${c}05`, borderBottom: cellBorder }}>
        {['Task', 'Status', '', 'Priority'].map(h => (
          <span key={h} className={`text-[10px] font-bold uppercase tracking-wider ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{h}</span>
        ))}
      </div>
      {rows.map((r, i) => (
        <div key={i} className="grid grid-cols-[1fr_90px_44px_70px] gap-0 items-center px-4 py-3" style={{ background: cellBg, borderBottom: i < rows.length - 1 ? cellBorder : 'none' }}>
          <span className={`text-[13px] font-medium truncate ${dark ? 'text-gray-300' : 'text-gray-700'}`}>{r.name}</span>
          <span className="text-[10px] font-semibold px-2 py-1 rounded-full text-center" style={{ color: r.statusColor, background: `${r.statusColor}15` }}>{r.status}</span>
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ backgroundColor: r.pColor }}>{r.person}</div>
          <span className={`text-[11px] font-medium ${r.priority === 'Critical' ? 'text-red-400' : dark ? 'text-gray-400' : 'text-gray-500'}`}>{r.priority}</span>
        </div>
      ))}
    </div>
  );
}

function SurfaceKanbanView({ dark }: { dark: boolean }) {
  const columns = [
    { title: 'To Do', color: '#6161ff', cards: ['Design Brief', 'Scope Doc'] },
    { title: 'In Progress', color: '#f59e0b', cards: ['Frontend', 'API Layer', 'Tests'] },
    { title: 'Review', color: '#8b5cf6', cards: ['Landing Page'] },
    { title: 'Done', color: '#10b981', cards: ['DB Schema', 'Auth Flow', 'CI/CD'] },
  ];
  return (
    <div className="grid grid-cols-4 gap-2.5 h-full">
      {columns.map(col => (
        <div key={col.title} className="flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col.color }} />
            <span className={`text-[11px] font-bold ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{col.title}</span>
            <span className={`text-[10px] ml-auto ${dark ? 'text-gray-600' : 'text-gray-400'}`}>{col.cards.length}</span>
          </div>
          {col.cards.map(card => (
            <div
              key={card}
              className="rounded-lg px-3 py-2.5"
              style={{
                background: dark ? 'rgba(255,255,255,0.04)' : 'white',
                border: dark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #e5e7eb',
                borderLeft: `3px solid ${col.color}`,
              }}
            >
              <span className={`text-[11px] font-medium ${dark ? 'text-gray-300' : 'text-gray-700'}`}>{card}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function SurfaceDashboardView({ dark }: { dark: boolean }) {
  const metrics = [
    { label: 'Completion', value: '87%', bar: 87, color: '#10b981' },
    { label: 'On Track', value: '94%', bar: 94, color: '#6161ff' },
    { label: 'Velocity', value: '+12%', bar: 62, color: '#00d2d2' },
    { label: 'Overdue', value: '3', bar: 8, color: '#ef4444' },
  ];
  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="grid grid-cols-2 gap-3">
        {metrics.map(m => (
          <div
            key={m.label}
            className="rounded-xl p-4 flex flex-col gap-2"
            style={{ background: dark ? 'rgba(255,255,255,0.03)' : '#f9fafb', border: dark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #f3f4f6' }}
          >
            <span className={`text-[10px] font-bold uppercase tracking-wider ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{m.label}</span>
            <span className={`text-[24px] font-bold tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`}>{m.value}</span>
            <div className="w-full h-1.5 rounded-full" style={{ background: dark ? 'rgba(255,255,255,0.06)' : '#e5e7eb' }}>
              <div className="h-full rounded-full" style={{ width: `${m.bar}%`, backgroundColor: m.color, boxShadow: dark ? `0 0 8px ${m.color}40` : undefined }} />
            </div>
          </div>
        ))}
      </div>
      {/* Mini bar chart */}
      <div className="flex-1 rounded-xl p-4 flex items-end gap-1.5" style={{ background: dark ? 'rgba(255,255,255,0.03)' : '#f9fafb', border: dark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #f3f4f6' }}>
        {[40, 65, 55, 80, 45, 90, 70, 85, 60, 75, 95, 50].map((h, i) => (
          <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, backgroundColor: i === 11 ? '#10b981' : (dark ? 'rgba(16,185,129,0.25)' : 'rgba(16,185,129,0.15)'), transition: 'height 0.3s' }} />
        ))}
      </div>
    </div>
  );
}

function SurfaceCanvasView({ dark }: { dark: boolean }) {
  const nodes = [
    { label: 'Product Vision', emoji: '🎯', x: 4, y: 4, w: 44, h: 38, color: '#00d2d2', sub: 'North star & strategy' },
    { label: 'Q4 Goals', emoji: '🚀', x: 52, y: 2, w: 44, h: 28, color: '#8b5cf6', sub: '3 key results defined' },
    { label: 'Sprint Plan', emoji: '📋', x: 2, y: 48, w: 38, h: 24, color: '#f59e0b', sub: 'Week 1–2 scope' },
    { label: 'Design System', emoji: '🎨', x: 44, y: 36, w: 52, h: 30, color: '#6161ff', sub: 'Components & tokens' },
    { label: 'Launch Checklist', emoji: '✅', x: 8, y: 76, w: 36, h: 20, color: '#ec4899', sub: '12 / 15 complete' },
    { label: 'Feedback', emoji: '💬', x: 52, y: 72, w: 42, h: 24, color: '#10b981', sub: '8 new responses' },
  ];

  const connections: [number, number][] = [[0, 1], [0, 2], [1, 3], [2, 4], [3, 5]];

  const getCenter = (n: typeof nodes[0]) => ({
    x: n.x + n.w / 2,
    y: n.y + n.h / 2,
  });

  return (
    <div
      className="relative h-full w-full rounded-xl overflow-hidden"
      style={{
        background: dark
          ? 'radial-gradient(ellipse at 30% 30%, rgba(0,210,210,0.04), transparent 60%), rgba(255,255,255,0.015)'
          : 'radial-gradient(ellipse at 30% 30%, rgba(0,210,210,0.06), transparent 60%), #fafbfc',
        border: dark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #f0f0f0',
      }}
    >
      {/* Grid dots */}
      <div className="absolute inset-0" style={{
        opacity: dark ? 0.12 : 0.2,
        backgroundImage: `radial-gradient(circle, ${dark ? '#666' : '#bbb'} 1px, transparent 1px)`,
        backgroundSize: '24px 24px',
      }} />

      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {connections.map(([from, to], i) => {
          const a = getCenter(nodes[from]);
          const b = getCenter(nodes[to]);
          const midX = (a.x + b.x) / 2;
          const midY = (a.y + b.y) / 2;
          const cx = midX + (b.y - a.y) * 0.15;
          const cy = midY - (b.x - a.x) * 0.15;
          return (
            <g key={i}>
              <path
                d={`M ${a.x}% ${a.y}% Q ${cx}% ${cy}% ${b.x}% ${b.y}%`}
                fill="none"
                stroke={dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)'}
                strokeWidth="1.5"
                strokeDasharray="6 4"
              />
              <circle cx={`${b.x}%`} cy={`${b.y}%`} r="3" fill={nodes[to].color} opacity={dark ? 0.4 : 0.3} />
            </g>
          );
        })}
      </svg>

      {/* Sticky notes */}
      {nodes.map(n => (
        <div
          key={n.label}
          className="absolute rounded-xl shadow-md flex flex-col justify-center px-3.5 py-2.5"
          style={{
            left: `${n.x}%`, top: `${n.y}%`,
            width: `${n.w}%`, height: `${n.h}%`,
            background: dark
              ? `linear-gradient(135deg, ${n.color}18, ${n.color}0a)`
              : `linear-gradient(135deg, ${n.color}14, ${n.color}06)`,
            border: `1px solid ${n.color}${dark ? '30' : '22'}`,
            boxShadow: dark
              ? `0 2px 12px ${n.color}10, inset 0 1px 0 ${n.color}15`
              : `0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 ${n.color}10`,
            backdropFilter: dark ? 'blur(8px)' : undefined,
          }}
        >
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[13px]">{n.emoji}</span>
            <span className={`text-[12px] font-bold leading-tight ${dark ? 'text-white' : 'text-gray-800'}`}>{n.label}</span>
          </div>
          <span className={`text-[10px] ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{n.sub}</span>
        </div>
      ))}
    </div>
  );
}

function SurfaceFilesView({ dark }: { dark: boolean }) {
  const files = [
    { name: 'brand-assets.zip', size: '24 MB', type: 'zip', color: '#f59e0b' },
    { name: 'Q3-report.pdf', size: '3.2 MB', type: 'pdf', color: '#ef4444' },
    { name: 'design-v2.fig', size: '18 MB', type: 'fig', color: '#a855f7' },
    { name: 'api-docs.md', size: '156 KB', type: 'md', color: '#10b981' },
    { name: 'wireframes.sketch', size: '42 MB', type: 'sketch', color: '#f97316' },
    { name: 'data-export.csv', size: '890 KB', type: 'csv', color: '#6161ff' },
  ];
  return (
    <div className="grid grid-cols-3 gap-2.5 h-full">
      {files.map(f => (
        <div
          key={f.name}
          className="rounded-xl p-3.5 flex flex-col items-center justify-center gap-2 text-center"
          style={{ background: dark ? 'rgba(255,255,255,0.03)' : '#f9fafb', border: dark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #f3f4f6' }}
        >
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${f.color}15` }}>
            <span className="text-[10px] font-bold uppercase" style={{ color: f.color }}>{f.type}</span>
          </div>
          <span className={`text-[11px] font-medium truncate w-full ${dark ? 'text-gray-300' : 'text-gray-700'}`}>{f.name}</span>
          <span className={`text-[9px] ${dark ? 'text-gray-600' : 'text-gray-400'}`}>{f.size}</span>
        </div>
      ))}
    </div>
  );
}

function SurfaceDocsView({ dark }: { dark: boolean }) {
  const c = '#a855f7';
  return (
    <div className="flex flex-col h-full rounded-xl overflow-hidden" style={{ background: dark ? 'rgba(255,255,255,0.02)' : 'white', border: dark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #f3f4f6' }}>
      {/* Doc toolbar */}
      <div className="flex items-center gap-2 px-4 py-2.5" style={{ borderBottom: dark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #f3f4f6' }}>
        <FileCode className="w-4 h-4" style={{ color: c }} />
        <span className={`text-[12px] font-bold ${dark ? 'text-white' : 'text-gray-800'}`}>PRD — Feature X</span>
        <span className={`text-[10px] ml-auto px-2 py-0.5 rounded-full ${dark ? 'bg-green-500/10 text-green-400' : 'bg-green-50 text-green-600'}`}>Live</span>
      </div>
      {/* Doc content */}
      <div className="flex-1 px-5 py-4 space-y-3">
        <div className={`text-[16px] font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>Overview</div>
        <div className="space-y-1.5">
          {[85, 100, 70, 100, 55].map((w, i) => (
            <div key={i} className="h-2 rounded-full" style={{ width: `${w}%`, background: dark ? 'rgba(255,255,255,0.06)' : '#e5e7eb' }} />
          ))}
        </div>
        <div className={`text-[14px] font-bold mt-2 ${dark ? 'text-white' : 'text-gray-900'}`}>Requirements</div>
        <div className="space-y-2">
          {['User authentication flow', 'Role-based permissions', 'API rate limiting'].map(item => (
            <div key={item} className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4" style={{ color: c }} />
              <span className={`text-[12px] ${dark ? 'text-gray-400' : 'text-gray-600'}`}>{item}</span>
            </div>
          ))}
        </div>
        <div className="space-y-1.5 mt-2">
          {[90, 60, 100, 45].map((w, i) => (
            <div key={i} className="h-2 rounded-full" style={{ width: `${w}%`, background: dark ? 'rgba(255,255,255,0.06)' : '#e5e7eb' }} />
          ))}
        </div>
      </div>
    </div>
  );
}

const SURFACE_RENDERERS = [SurfaceItemsView, SurfaceKanbanView, SurfaceDashboardView, SurfaceCanvasView, SurfaceFilesView, SurfaceDocsView];

function FeaturedSurfaceVisual({ dark }: { dark: boolean }) {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx(prev => (prev + 1) % SURFACE_NAV.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const ActiveView = SURFACE_RENDERERS[activeIdx];
  const nav = SURFACE_NAV[activeIdx];
  const VIcon = nav.icon;

  return (
    <div className="flex flex-col h-full py-5 px-5">
      <div className="flex-1 min-h-0 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIdx}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex-1 flex flex-col rounded-2xl p-5"
            style={{
              background: dark ? `linear-gradient(135deg, ${nav.color}10, ${nav.color}05)` : 'white',
              border: dark ? `1px solid ${nav.color}20` : '1px solid #e5e7eb',
              boxShadow: dark ? `0 4px 30px ${nav.color}08` : '0 2px 8px rgba(0,0,0,0.04)',
            }}
          >
            {/* Header */}
            <div className="flex items-center gap-4 mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${nav.color}${dark ? '20' : '10'}` }}
              >
                <VIcon className="w-6 h-6" style={{ color: nav.color }} />
              </div>
              <div className="flex-1">
                <p className={`text-[18px] font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>{nav.label}</p>
                <p className={`text-[11px] ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{nav.desc}</p>
              </div>
              <div className="text-right">
                <p className={`text-[24px] font-bold tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`}>{nav.count}</p>
                <p className={`text-[9px] font-medium uppercase tracking-wider ${dark ? 'text-gray-500' : 'text-gray-400'}`}>items</p>
              </div>
            </div>

            {/* Unique content */}
            <div className="flex-1 min-h-0">
              <ActiveView dark={dark} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation pills */}
      <div className="flex items-center justify-center gap-1 mt-4">
        {SURFACE_NAV.map((s, i) => {
          const SIcon = s.icon;
          const isActive = i === activeIdx;
          return (
            <button
              key={s.label}
              onClick={() => setActiveIdx(i)}
              className="rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 transition-all duration-300"
              style={{
                background: isActive ? (dark ? `${s.color}20` : `${s.color}10`) : 'transparent',
                border: isActive ? `1px solid ${s.color}${dark ? '35' : '25'}` : '1px solid transparent',
              }}
            >
              <SIcon className="w-3.5 h-3.5" style={{ color: isActive ? s.color : (dark ? '#555' : '#aaa') }} />
              {isActive && (
                <span className="text-[10px] font-semibold" style={{ color: s.color }}>{s.label}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const DATA_NAV = [
  { label: 'mondayDB', icon: Database, color: '#10b981', desc: 'Single source of truth', count: '15.2K' },
  { label: 'Integrations', icon: Globe, color: '#f59e0b', desc: 'Connected sources', count: '200+' },
  { label: 'MCP', icon: Cpu, color: '#6161ff', desc: 'Model Context Protocol', count: '12' },
];

function DataMondayDBView({ dark }: { dark: boolean }) {
  const c = '#10b981';
  const stats = [
    { label: 'Projects', count: '2,847', icon: LayoutGrid },
    { label: 'Contacts', count: '12.3K', icon: Users },
    { label: 'Documents', count: '891', icon: FileText },
  ];
  const cellBg = dark ? 'rgba(255,255,255,0.04)' : 'white';
  const cellBorder = dark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #f3f4f6';
  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="grid grid-cols-3 gap-3">
        {stats.map(s => (
          <div key={s.label} className="rounded-xl p-3.5 text-center" style={{ background: cellBg, border: cellBorder }}>
            <s.icon className={`w-5 h-5 mx-auto mb-1.5 ${dark ? 'text-gray-500' : 'text-gray-400'}`} />
            <p className={`text-[20px] font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>{s.count}</p>
            <p className={`text-[9px] mt-0.5 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{s.label}</p>
          </div>
        ))}
      </div>
      <div className="flex-1 rounded-xl overflow-hidden" style={{ border: cellBorder }}>
        <div className="grid grid-cols-[1fr_80px_70px] gap-0 px-3.5 py-2" style={{ background: dark ? `${c}08` : `${c}05`, borderBottom: cellBorder }}>
          {['Board', 'Items', 'Updated'].map(h => (
            <span key={h} className={`text-[9px] font-bold uppercase tracking-wider ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{h}</span>
          ))}
        </div>
        {[
          { board: 'Sprint Backlog', items: '142', time: '2m ago' },
          { board: 'CRM Pipeline', items: '1,204', time: '5m ago' },
          { board: 'Bug Tracker', items: '89', time: 'Just now' },
        ].map((r, i) => (
          <div key={i} className="grid grid-cols-[1fr_80px_70px] items-center px-3.5 py-2.5" style={{ background: cellBg, borderBottom: i < 2 ? cellBorder : 'none' }}>
            <span className={`text-[12px] font-medium truncate ${dark ? 'text-gray-300' : 'text-gray-700'}`}>{r.board}</span>
            <span className={`text-[12px] font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>{r.items}</span>
            <span className={`text-[10px] ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{r.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DataIntegrationsView({ dark }: { dark: boolean }) {
  const allTools = [
    ...INTEGRATIONS,
    { name: 'Figma', domain: 'figma.com' },
    { name: 'Notion', domain: 'notion.so' },
    { name: 'Zoom', domain: 'zoom.us' },
  ];
  const cellBg = dark ? 'rgba(255,255,255,0.04)' : '#f9fafb';
  const cellBorder = dark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #f3f4f6';
  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="grid grid-cols-3 gap-2.5">
        {allTools.map(tool => (
          <div
            key={tool.name}
            className="rounded-xl flex items-center gap-2.5 px-3 py-2.5"
            style={{ background: cellBg, border: cellBorder }}
          >
            <img src={LOGO(tool.domain)} alt={tool.name} className="w-6 h-6 rounded flex-shrink-0" loading="lazy" />
            <div className="min-w-0">
              <p className={`text-[11px] font-semibold truncate ${dark ? 'text-gray-300' : 'text-gray-700'}`}>{tool.name}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                <span className="text-[8px] text-[#10b981] font-medium">Synced</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: dark ? 'rgba(249,115,22,0.06)' : '#fff7ed', border: dark ? '1px solid rgba(249,115,22,0.15)' : '1px solid #fed7aa' }}>
        <div className="flex items-center gap-2">
          <Shield className={`w-4 h-4 ${dark ? 'text-[#f59e0b]' : 'text-[#f97316]'}`} />
          <span className={`text-[11px] font-medium ${dark ? 'text-gray-300' : 'text-gray-700'}`}>OAuth 2.0 secured</span>
        </div>
        <span className="text-[9px] font-semibold text-[#10b981] bg-[#10b981]/10 px-2 py-0.5 rounded-full">All verified</span>
      </div>
    </div>
  );
}

function DataMCPView({ dark }: { dark: boolean }) {
  const c = '#6161ff';
  const cellBg = dark ? 'rgba(255,255,255,0.04)' : '#f9fafb';
  const cellBorder = dark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #f3f4f6';
  const endpoints = [
    { name: 'read_board', type: 'GET', latency: '45ms', status: 'live' },
    { name: 'create_item', type: 'POST', latency: '120ms', status: 'live' },
    { name: 'update_column', type: 'PATCH', latency: '85ms', status: 'live' },
    { name: 'search_items', type: 'GET', latency: '200ms', status: 'live' },
  ];
  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex items-center gap-3 rounded-xl px-4 py-3" style={{ background: dark ? `${c}08` : `${c}04`, border: `1px solid ${c}${dark ? '20' : '12'}` }}>
        <Lock className={`w-4 h-4 flex-shrink-0`} style={{ color: c }} />
        <span className={`text-[11px] font-medium ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Standardized protocol layer</span>
        <span className="text-[9px] font-semibold ml-auto px-2 py-0.5 rounded-full" style={{ color: c, background: `${c}15` }}>v2.1</span>
      </div>
      <div className="flex-1 rounded-xl overflow-hidden" style={{ border: cellBorder }}>
        <div className="grid grid-cols-[1fr_50px_60px_44px] gap-0 px-3.5 py-2" style={{ background: dark ? `${c}06` : `${c}03`, borderBottom: cellBorder }}>
          {['Endpoint', 'Type', 'Latency', ''].map(h => (
            <span key={h} className={`text-[9px] font-bold uppercase tracking-wider ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{h}</span>
          ))}
        </div>
        {endpoints.map((ep, i) => (
          <div key={i} className="grid grid-cols-[1fr_50px_60px_44px] items-center px-3.5 py-2.5" style={{ background: cellBg, borderBottom: i < endpoints.length - 1 ? cellBorder : 'none' }}>
            <span className={`text-[11px] font-mono font-medium truncate ${dark ? 'text-gray-300' : 'text-gray-700'}`}>{ep.name}</span>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ color: ep.type === 'GET' ? '#10b981' : ep.type === 'POST' ? '#f59e0b' : '#8b5cf6', background: ep.type === 'GET' ? '#10b98112' : ep.type === 'POST' ? '#f59e0b12' : '#8b5cf612' }}>{ep.type}</span>
            <span className={`text-[10px] ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{ep.latency}</span>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
              <span className="text-[8px] text-[#10b981] font-medium">live</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const DATA_RENDERERS = [DataMondayDBView, DataIntegrationsView, DataMCPView];

function FeaturedDataVisual({ dark }: { dark: boolean }) {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx(prev => (prev + 1) % DATA_NAV.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const ActiveView = DATA_RENDERERS[activeIdx];
  const nav = DATA_NAV[activeIdx];
  const VIcon = nav.icon;

  return (
    <div className="flex flex-col h-full py-5 px-5">
      <div className="flex-1 min-h-0 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIdx}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex-1 flex flex-col rounded-2xl p-5"
            style={{
              background: dark ? `linear-gradient(135deg, ${nav.color}10, ${nav.color}05)` : 'white',
              border: dark ? `1px solid ${nav.color}20` : '1px solid #e5e7eb',
              boxShadow: dark ? `0 4px 30px ${nav.color}08` : '0 2px 8px rgba(0,0,0,0.04)',
            }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${nav.color}${dark ? '20' : '10'}` }}
              >
                <VIcon className="w-6 h-6" style={{ color: nav.color }} />
              </div>
              <div className="flex-1">
                <p className={`text-[18px] font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>{nav.label}</p>
                <p className={`text-[11px] ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{nav.desc}</p>
              </div>
              <div className="text-right">
                <p className={`text-[24px] font-bold tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`}>{nav.count}</p>
                <p className={`text-[9px] font-medium uppercase tracking-wider ${dark ? 'text-gray-500' : 'text-gray-400'}`}>records</p>
              </div>
            </div>

            <div className="flex-1 min-h-0">
              <ActiveView dark={dark} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center gap-1 mt-4">
        {DATA_NAV.map((s, i) => {
          const SIcon = s.icon;
          const isActive = i === activeIdx;
          return (
            <button
              key={s.label}
              onClick={() => setActiveIdx(i)}
              className="rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 transition-all duration-300"
              style={{
                background: isActive ? (dark ? `${s.color}20` : `${s.color}10`) : 'transparent',
                border: isActive ? `1px solid ${s.color}${dark ? '35' : '25'}` : '1px solid transparent',
              }}
            >
              <SIcon className="w-3.5 h-3.5" style={{ color: isActive ? s.color : (dark ? '#555' : '#aaa') }} />
              {isActive && (
                <span className="text-[10px] font-semibold" style={{ color: s.color }}>{s.label}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Compact (side card) previews ── */

function CompactExecutionPreview({ people, dark }: { people: DeptAvatar[]; dark: boolean }) {
  return (
    <div className="flex items-center justify-center gap-4 py-3">
      <div className="flex -space-x-2">
        {people.slice(0, 3).map((p) => (
          <div
            key={p.name}
            className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0"
            style={{
              backgroundColor: dark ? '#333' : '#ddd',
              border: dark ? '2px solid rgba(255,255,255,0.1)' : '2px solid white',
              filter: 'grayscale(40%)',
              opacity: 0.8,
            }}
          >
            {p.img ? <img src={p.img} alt="" className="w-full h-full object-cover" loading="lazy" /> : (
              <span className="w-full h-full flex items-center justify-center text-white text-xs font-bold">{p.name.charAt(0)}</span>
            )}
          </div>
        ))}
      </div>
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center"
        style={{
          backgroundColor: dark ? 'rgba(255,255,255,0.04)' : '#f0f0f0',
          border: dark ? '1px solid rgba(255,255,255,0.07)' : '1px solid #e0e0e0',
        }}
      >
        <Zap className={`w-3.5 h-3.5 ${dark ? 'text-gray-500' : 'text-gray-400'}`} />
      </div>
      <div className="flex -space-x-2">
        {EXPANDED_AGENTS.slice(0, 2).map((a) => (
          <div
            key={a.name}
            className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0"
            style={{
              backgroundColor: dark ? '#333' : '#e5e5e5',
              border: dark ? '2px solid rgba(255,255,255,0.1)' : '2px solid white',
              filter: 'grayscale(40%)',
              opacity: 0.8,
            }}
          >
            <img src={a.img} alt="" className="w-full h-full object-contain object-bottom" loading="lazy" />
          </div>
        ))}
      </div>
    </div>
  );
}

function CompactSurfacePreview({ dark }: { dark: boolean }) {
  const items = [
    { label: 'Items', icon: List },
    { label: 'Kanban', icon: Columns3 },
    { label: 'Dashboard', icon: BarChart3 },
    { label: 'Canvas', icon: PenTool },
    { label: 'Files', icon: FolderOpen },
    { label: 'Docs', icon: FileCode },
  ];
  return (
    <div className="flex items-center gap-3 py-3 justify-center">
      {items.map((item) => {
        const SIcon = item.icon;
        return (
          <div
            key={item.label}
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{
              backgroundColor: dark ? 'rgba(255,255,255,0.04)' : '#f5f5f5',
              border: dark ? '1px solid rgba(255,255,255,0.07)' : '1px solid #e8e8e8',
            }}
            title={item.label}
          >
            <SIcon className={`w-4 h-4 ${dark ? 'text-gray-500' : 'text-gray-400'}`} />
          </div>
        );
      })}
    </div>
  );
}

function CompactDataPreview({ dark }: { dark: boolean }) {
  const rows = [
    { label: 'mondayDB', icon: Database },
    { label: 'Integrations', icon: Globe },
    { label: 'MCP', icon: Cpu },
  ];
  return (
    <div className="space-y-2 py-2">
      {rows.map((row) => {
        const RIcon = row.icon;
        return (
          <div
            key={row.label}
            className="flex items-center gap-3 rounded-lg px-3.5 py-2.5"
            style={{
              background: dark ? 'rgba(255,255,255,0.03)' : '#f7f7f7',
              border: dark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #ebebeb',
            }}
          >
            <RIcon className={`w-4 h-4 flex-shrink-0 ${dark ? 'text-gray-500' : 'text-gray-400'}`} />
            <span className={`text-[12px] font-medium ${dark ? 'text-gray-400' : 'text-gray-600'}`}>{row.label}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ── Main Masonry Variant ── */

function MasonryExpandVariant({ people, bentoStyle, pageDark }: { people: DeptAvatar[]; bentoStyle: BentoStyle; pageDark?: boolean }) {
  const [featuredId, setFeaturedId] = useState<PanelId>('execution');

  const handleCardClick = useCallback((id: PanelId) => {
    setFeaturedId(id);
  }, []);

  const dark = pageDark || isDark(bentoStyle);
  const featured = PANEL_META.find(p => p.id === featuredId)!;
  const sidePanels = PANEL_META.filter(p => p.id !== featuredId);
  const FIcon = featured.icon;

  const renderFeaturedVisual = () => {
    if (featured.id === 'execution') return <FeaturedExecutionVisual people={people} dark={dark} />;
    if (featured.id === 'surface') return <FeaturedSurfaceVisual dark={dark} />;
    return <FeaturedDataVisual dark={dark} />;
  };

  const renderCompactPreview = (id: string) => {
    if (id === 'execution') return <CompactExecutionPreview people={people} dark={dark} />;
    if (id === 'surface') return <CompactSurfacePreview dark={dark} />;
    return <CompactDataPreview dark={dark} />;
  };

  const cardBg = dark ? '#141414' : undefined;

  const cardBorder = dark
    ? `1px solid rgba(255,255,255,0.06)`
    : '1px solid #e5e7eb';

  const sideBg = dark ? '#111111' : undefined;

  return (
    <div className="relative">
      {/* Background gradient orbs */}
      {dark ? (
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div
            className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full blur-3xl"
            style={{ background: 'radial-gradient(ellipse, #6161ff07 0%, transparent 65%)' }}
          />
          <div
            className="absolute top-1/2 right-0 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-3xl"
            style={{ background: 'radial-gradient(ellipse, #00d2d206 0%, transparent 65%)' }}
          />
        </div>
      ) : (
        <div className="absolute inset-0 -z-10 overflow-hidden rounded-3xl pointer-events-none">
          <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full opacity-20 blur-3xl" style={{ background: `radial-gradient(circle, ${featured.accent}40, transparent 70%)` }} />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full opacity-15 blur-3xl" style={{ background: 'radial-gradient(circle, #00d2d240, transparent 70%)' }} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:min-h-[560px]">
        {/* ── Featured large card (visual left, text right) ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`featured-${featured.id}`}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="lg:col-span-2 lg:row-span-2 rounded-2xl overflow-hidden flex flex-col"
            style={{
              background: cardBg || (bentoStyle === 'glass_blur' ? 'rgba(255,255,255,0.7)' : 'white'),
              backdropFilter: bentoStyle === 'glass_blur' ? 'blur(20px)' : undefined,
              WebkitBackdropFilter: bentoStyle === 'glass_blur' ? 'blur(20px)' : undefined,
              border: cardBorder,
              boxShadow: dark
                ? `0 8px 40px rgba(0,0,0,0.4), 0 0 80px ${featured.accent}08`
                : `0 4px 20px rgba(0,0,0,0.06), 0 12px 40px rgba(0,0,0,0.04)`,
            }}
          >
            {/* Accent gradient bar */}
            <div
              className="h-[3px] w-full"
              style={{ background: `linear-gradient(90deg, ${featured.accent}, ${featured.accent}60)` }}
            />

            {/* Split layout: text left, visual right */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_1.15fr]">
              {/* LEFT: text + bullets */}
              <div
                className="flex flex-col justify-center px-8 lg:px-10 py-8 lg:py-10"
                style={{
                  borderRight: dark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #f3f4f6',
                }}
              >
                <div className="mb-5">
                  <span className={`text-[11px] font-bold tracking-[0.18em] mb-2 block ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
                    {featured.layerNumber}
                  </span>
                  <h3 className={`text-[28px] font-bold tracking-[-0.02em] leading-tight ${dark ? 'text-white' : 'text-gray-900'}`}>
                    {featured.title}
                  </h3>
                  <p className={`text-sm mt-1 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{featured.subtitle}</p>
                </div>

                <p className={`text-[15px] leading-relaxed mb-7 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {featured.description}
                </p>

                <ul className="space-y-3.5">
                  {featured.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-3">
                      <CheckCircle2
                        className="w-5 h-5 mt-0.5 flex-shrink-0"
                        style={{ color: featured.accent }}
                      />
                      <span className={`text-[14px] ${dark ? 'text-gray-300' : 'text-gray-700'}`}>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* RIGHT: visual */}
              <div className="relative flex items-center justify-center">
                {dark && (
                  <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] rounded-full pointer-events-none"
                    style={{ background: `radial-gradient(circle, ${featured.accent}12, transparent 70%)` }}
                  />
                )}
                <div className="relative w-full h-full">
                  {renderFeaturedVisual()}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ── Side cards (secondary but visible) ── */}
        {sidePanels.map((panel, i) => {
          const SIcon = panel.icon;
          return (
            <motion.button
              key={`side-${panel.id}`}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 0.85, y: 0 }}
              whileHover={{ opacity: 1, y: -3 }}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              onClick={() => handleCardClick(panel.id as PanelId)}
              className="text-left rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer group flex flex-col justify-center"
              style={{
                background: sideBg || (bentoStyle === 'glass_blur' ? 'rgba(255,255,255,0.6)' : 'white'),
                backdropFilter: bentoStyle === 'glass_blur' ? 'blur(16px)' : undefined,
                WebkitBackdropFilter: bentoStyle === 'glass_blur' ? 'blur(16px)' : undefined,
                border: dark ? `1px solid ${panel.accent}18` : `1px solid ${panel.accent}20`,
                boxShadow: dark
                  ? `0 2px 12px rgba(0,0,0,0.3), 0 0 0 0.5px ${panel.accent}12`
                  : `0 2px 8px rgba(0,0,0,0.05), 0 0 0 0.5px ${panel.accent}10`,
              }}
            >
              <div className="px-5 py-5 flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: `${panel.accent}${dark ? '12' : '08'}`,
                  }}
                >
                  <SIcon className="w-5 h-5" style={{ color: `${panel.accent}${dark ? 'aa' : '88'}` }} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className={`text-[10px] font-bold tracking-[0.18em] mb-1 block ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
                    {panel.layerNumber}
                  </span>
                  <h3 className={`text-xl font-bold leading-tight flex items-center gap-2 ${dark ? 'text-white' : 'text-gray-900'}`}>
                    {panel.title}
                    <ArrowRight className={`w-4 h-4 flex-shrink-0 opacity-0 -translate-x-1 group-hover:opacity-70 group-hover:translate-x-0 transition-all duration-200 ${dark ? 'text-gray-400' : 'text-gray-400'}`} />
                  </h3>
                  <p className={`text-[11px] mt-0.5 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{panel.subtitle}</p>
                  <p className={`text-[13px] mt-2 leading-relaxed ${dark ? 'text-gray-500' : 'text-gray-500'}`}>
                    {panel.shortDescription}
                  </p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Footer pill */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="flex justify-center mt-10"
      >
        <div
          className="inline-flex items-center gap-3 px-5 py-3 rounded-full"
          style={{
            background: dark ? 'rgba(255,255,255,0.04)' : '#f9fafb',
            border: dark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #e5e7eb',
          }}
        >
          <div className="flex -space-x-1">
            {['#6161ff', '#00d2d2', '#10b981'].map((c) => (
              <div
                key={c}
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: c,
                  border: dark ? '2px solid #1a1a2e' : '2px solid white',
                  boxShadow: dark ? `0 0 6px ${c}40` : undefined,
                }}
              />
            ))}
          </div>
          <span className={`text-[12px] ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
            All layers work together, powered by <span className={`font-bold ${dark ? 'text-white' : 'text-gray-800'}`}>monday AI</span>
          </span>
          <ArrowRight className={`w-3.5 h-3.5 ${dark ? 'text-gray-500' : 'text-gray-400'}`} />
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Main Section ─── */

export function WorkManagementPlatformLayers() {
  const { departments: supabaseDepts } = useDepartments();
  const { settings: siteSettings } = useSiteSettings();
  const wm_platform_layers_variant = siteSettings?.wm_platform_layers_variant ?? 'grid';
  const wm_bento_style = (siteSettings?.wm_bento_style ?? 'dark_gradient') as BentoStyle;

  const people = useMemo<DeptAvatar[]>(() => {
    return DEPARTMENTS.slice(0, 3).map((dept) => {
      const sd = supabaseDepts.find(
        s => s.name === dept.supabaseKey || s.title?.toLowerCase() === dept.id || s.name?.toLowerCase() === dept.id
      );
      return {
        name: dept.name,
        img: sd?.avatar_image || '',
        color: dept.color,
      };
    });
  }, [supabaseDepts]);

  const pageDark = siteSettings?.wm_dark_mode ?? false;
  const dark = pageDark || isDark(wm_bento_style);

  return (
    <section
      className="py-20 sm:py-28 px-4 sm:px-6 relative"
      style={{
        background: dark ? '#0a0a0a' : 'white',
      }}
    >
      <div className="max-w-[1280px] mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-4 border ${
              dark
                ? 'bg-[#6161ff]/10 text-[#97aeff] border-[#6161ff]/20'
                : 'bg-gradient-to-r from-[#6161ff]/10 via-[#00d2d2]/10 to-[#10b981]/10 text-[#6161ff] border-[#6161ff]/15'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            AI Work Platform
          </motion.span>
          <h2 className={`text-4xl sm:text-5xl lg:text-[56px] font-bold tracking-[-0.03em] leading-[1.1] mb-4 ${dark ? 'text-white' : 'text-black'}`}>
            One platform built for
            <br />
            humans and agents.
          </h2>
          <p className={`text-lg sm:text-xl leading-relaxed max-w-[800px] mx-auto ${dark ? 'text-gray-500' : 'text-gray-600'}`}>
            Everything you need to plan, execute, and scale work — with AI built into every layer.
          </p>
        </motion.div>

        {wm_platform_layers_variant === 'masonry_expand'
          ? <MasonryExpandVariant people={people} bentoStyle={wm_bento_style} pageDark={pageDark} />
          : <GridVariant people={people} />
        }
      </div>
    </section>
  );
}
