import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Loader2,
  Bot,
  Sparkles,
  CheckCircle2,
  Clock,
  Plug,
  LayoutGrid,
  Zap,
  Send,
  FileText,
  BarChart3,
  Image,
  MessageSquare,
  Calendar,
  Mail,
  Globe,
  Megaphone,
  PenTool,
  Video,
  Plus,
  Database,
  Brain,
  Puzzle,
  Shield,
  Workflow,
  Link2,
  MapPin,
  Users,
  X,
  ArrowRight,
  ArrowUp,
  TrendingUp,
  Activity,
  ListChecks,
  Boxes,
  Lock,
  Layers,
  Cpu,
  type LucideIcon,
} from 'lucide-react';
import { useDepartmentData } from '@/hooks/useSupabase';
import type { DepartmentRow } from '@/types/database';
import { DepartmentBar, DepartmentSidebar } from './DepartmentBar';
import { getToolLogo } from '@/app/utils/toolLogos';
import { LivingWorkspaceShowcase } from './LivingWorkspaceShowcase';
import agentsLogo from '@/assets/99be461a455ae49743d963276e2023ed6cd1445d.png';
import vibeLogo from '@/assets/069a22575b2de9057cfc00d9b4538d072f7fe115.png';
import sidekickLogo from '@/assets/1babfe88a809998ec3c5c5d597d8051ef7639a6f.png';

// ─── App Icon Mapping ────────────────────────────────────────────

interface AppIconInfo { icon: LucideIcon; bg: string; fg: string; }

const APP_ICON_MAP: Record<string, AppIconInfo> = {
  content:   { icon: FileText,      bg: 'bg-blue-50',    fg: 'text-blue-500' },
  blog:      { icon: FileText,      bg: 'bg-blue-50',    fg: 'text-blue-500' },
  article:   { icon: FileText,      bg: 'bg-blue-50',    fg: 'text-blue-500' },
  document:  { icon: FileText,      bg: 'bg-blue-50',    fg: 'text-blue-500' },
  docs:      { icon: FileText,      bg: 'bg-blue-50',    fg: 'text-blue-500' },
  writer:    { icon: FileText,      bg: 'bg-blue-50',    fg: 'text-blue-500' },
  analytics: { icon: BarChart3,     bg: 'bg-violet-50',  fg: 'text-violet-500' },
  report:    { icon: BarChart3,     bg: 'bg-violet-50',  fg: 'text-violet-500' },
  dashboard: { icon: BarChart3,     bg: 'bg-violet-50',  fg: 'text-violet-500' },
  data:      { icon: BarChart3,     bg: 'bg-violet-50',  fg: 'text-violet-500' },
  insights:  { icon: BarChart3,     bg: 'bg-violet-50',  fg: 'text-violet-500' },
  design:    { icon: Image,         bg: 'bg-pink-50',    fg: 'text-pink-500' },
  image:     { icon: Image,         bg: 'bg-pink-50',    fg: 'text-pink-500' },
  photo:     { icon: Image,         bg: 'bg-pink-50',    fg: 'text-pink-500' },
  visual:    { icon: Image,         bg: 'bg-pink-50',    fg: 'text-pink-500' },
  creative:  { icon: Image,         bg: 'bg-pink-50',    fg: 'text-pink-500' },
  brand:     { icon: Image,         bg: 'bg-pink-50',    fg: 'text-pink-500' },
  asset:     { icon: Image,         bg: 'bg-pink-50',    fg: 'text-pink-500' },
  chat:      { icon: MessageSquare, bg: 'bg-emerald-50', fg: 'text-emerald-500' },
  message:   { icon: MessageSquare, bg: 'bg-emerald-50', fg: 'text-emerald-500' },
  support:   { icon: MessageSquare, bg: 'bg-emerald-50', fg: 'text-emerald-500' },
  calendar:  { icon: Calendar,      bg: 'bg-orange-50',  fg: 'text-orange-500' },
  schedule:  { icon: Calendar,      bg: 'bg-orange-50',  fg: 'text-orange-500' },
  planner:   { icon: Calendar,      bg: 'bg-orange-50',  fg: 'text-orange-500' },
  event:     { icon: Calendar,      bg: 'bg-orange-50',  fg: 'text-orange-500' },
  email:     { icon: Mail,          bg: 'bg-sky-50',     fg: 'text-sky-500' },
  newsletter:{ icon: Mail,          bg: 'bg-sky-50',     fg: 'text-sky-500' },
  outreach:  { icon: Mail,          bg: 'bg-sky-50',     fg: 'text-sky-500' },
  campaign:  { icon: Mail,          bg: 'bg-sky-50',     fg: 'text-sky-500' },
  social:    { icon: Globe,         bg: 'bg-cyan-50',    fg: 'text-cyan-500' },
  web:       { icon: Globe,         bg: 'bg-cyan-50',    fg: 'text-cyan-500' },
  seo:       { icon: Globe,         bg: 'bg-cyan-50',    fg: 'text-cyan-500' },
  website:   { icon: Globe,         bg: 'bg-cyan-50',    fg: 'text-cyan-500' },
  publish:   { icon: Globe,         bg: 'bg-cyan-50',    fg: 'text-cyan-500' },
  marketing: { icon: Megaphone,     bg: 'bg-amber-50',   fg: 'text-amber-500' },
  ads:       { icon: Megaphone,     bg: 'bg-amber-50',   fg: 'text-amber-500' },
  promotion: { icon: Megaphone,     bg: 'bg-amber-50',   fg: 'text-amber-500' },
  growth:    { icon: Megaphone,     bg: 'bg-amber-50',   fg: 'text-amber-500' },
  launch:    { icon: Megaphone,     bg: 'bg-amber-50',   fg: 'text-amber-500' },
  copy:      { icon: PenTool,       bg: 'bg-indigo-50',  fg: 'text-indigo-500' },
  edit:      { icon: PenTool,       bg: 'bg-indigo-50',  fg: 'text-indigo-500' },
  write:     { icon: PenTool,       bg: 'bg-indigo-50',  fg: 'text-indigo-500' },
  text:      { icon: PenTool,       bg: 'bg-indigo-50',  fg: 'text-indigo-500' },
  video:     { icon: Video,         bg: 'bg-rose-50',    fg: 'text-rose-500' },
  media:     { icon: Video,         bg: 'bg-rose-50',    fg: 'text-rose-500' },
  animation: { icon: Video,         bg: 'bg-rose-50',    fg: 'text-rose-500' },
};

const DEFAULT_APP_ICON: AppIconInfo = { icon: Sparkles, bg: 'bg-teal-50', fg: 'text-teal-500' };

function getAppIcon(appName: string): AppIconInfo {
  const lower = appName.toLowerCase();
  for (const [keyword, info] of Object.entries(APP_ICON_MAP)) {
    if (lower.includes(keyword)) return info;
  }
  return DEFAULT_APP_ICON;
}

// ─── Team Members per Department ────────────────────────────────

interface TeamMember {
  name: string;
  role: string;
  image: string;
}

const TEAM_MEMBERS: Record<string, TeamMember[]> = {
  marketing: [
    { name: 'Emma W.', role: 'Marketing Lead', image: 'https://randomuser.me/api/portraits/women/65.jpg' },
    { name: 'Jason T.', role: 'Content Strategist', image: 'https://randomuser.me/api/portraits/men/75.jpg' },
    { name: 'Maria S.', role: 'Growth Manager', image: 'https://randomuser.me/api/portraits/women/90.jpg' },
  ],
  sales: [
    { name: 'Sarah K.', role: 'Team Lead', image: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { name: 'David M.', role: 'Account Executive', image: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { name: 'Lisa R.', role: 'SDR Manager', image: 'https://randomuser.me/api/portraits/women/68.jpg' },
  ],
  operations: [
    { name: 'Mike B.', role: 'Ops Director', image: 'https://randomuser.me/api/portraits/men/46.jpg' },
    { name: 'Rachel K.', role: 'Process Manager', image: 'https://randomuser.me/api/portraits/women/47.jpg' },
    { name: 'Tom H.', role: 'Systems Analyst', image: 'https://randomuser.me/api/portraits/men/22.jpg' },
  ],
  support: [
    { name: 'Anna C.', role: 'Support Lead', image: 'https://randomuser.me/api/portraits/women/33.jpg' },
    { name: 'Chris D.', role: 'Escalation Manager', image: 'https://randomuser.me/api/portraits/men/86.jpg' },
    { name: 'Nina P.', role: 'CX Specialist', image: 'https://randomuser.me/api/portraits/women/56.jpg' },
  ],
  product: [
    { name: 'Dan F.', role: 'Product Lead', image: 'https://randomuser.me/api/portraits/men/52.jpg' },
    { name: 'Sophie L.', role: 'UX Researcher', image: 'https://randomuser.me/api/portraits/women/17.jpg' },
    { name: 'Alex N.', role: 'Tech PM', image: 'https://randomuser.me/api/portraits/men/64.jpg' },
  ],
  legal: [
    { name: 'James W.', role: 'Legal Counsel', image: 'https://randomuser.me/api/portraits/men/41.jpg' },
    { name: 'Emily R.', role: 'Compliance Officer', image: 'https://randomuser.me/api/portraits/women/76.jpg' },
    { name: 'Kate M.', role: 'Contract Manager', image: 'https://randomuser.me/api/portraits/women/89.jpg' },
  ],
  finance: [
    { name: 'Robert S.', role: 'Finance Director', image: 'https://randomuser.me/api/portraits/men/67.jpg' },
    { name: 'Helen T.', role: 'Controller', image: 'https://randomuser.me/api/portraits/women/54.jpg' },
    { name: 'Paul K.', role: 'FP&A Manager', image: 'https://randomuser.me/api/portraits/men/29.jpg' },
  ],
  hr: [
    { name: 'Linda G.', role: 'HR Director', image: 'https://randomuser.me/api/portraits/women/42.jpg' },
    { name: 'Steve J.', role: 'Talent Manager', image: 'https://randomuser.me/api/portraits/men/36.jpg' },
    { name: 'Karen H.', role: 'People Ops', image: 'https://randomuser.me/api/portraits/women/63.jpg' },
  ],
};

// ─── Types ──────────────────────────────────────────────────────

interface JTBDItem {
  id: string;
  title: string;
  agentName: string;
  agentImage?: string | null;
  relatedTools: string[];
}

// ─── Main Exported Section ──────────────────────────────────────

interface JTBDWorkspaceSectionProps {
  department: DepartmentRow | null;
  allDepartments?: DepartmentRow[];
  contextToggle?: boolean;
  sidekickPanelStyle?: string;
  teamAvatarsPlacement?: 'in_chat' | 'header_row' | 'header_merged';
  minimalChat?: boolean;
  sidebarLeft?: boolean;
  leftPanelStyle?: 'sidekick_chat' | 'v1_sidebar';
  showJtbdSidebar?: boolean;
  showInlineSidekick?: boolean;
  showDepartmentBar?: boolean;
  showIntro?: boolean;
  introStyle?: 'unified' | 'with_plus';
}

export function JTBDWorkspaceSection({ department, allDepartments = [], contextToggle = false, sidekickPanelStyle = 'right_overlay', sidebarLeft = false, showJtbdSidebar = true, showInlineSidekick = false, showIntro = false, introStyle = 'unified' }: JTBDWorkspaceSectionProps) {
  if (!department) {
    return (
      <section className="py-16 bg-white">
        <p className="text-center text-gray-400 text-sm">
          Select a department above to explore its jobs to be done
        </p>
      </section>
    );
  }

  return (
    <section className="py-8 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <JTBDWorkspaceContent
          department={department}
          allDepartments={allDepartments}
          contextToggle={contextToggle}
          sidekickPanelStyle={sidekickPanelStyle}
          sidebarLeft={sidebarLeft}
          showJtbdSidebar={showJtbdSidebar}
          showInlineSidekick={showInlineSidekick}
          showIntro={showIntro}
          introStyle={introStyle}
        />
      </div>
    </section>
  );
}

// ─── V2: Unified Board Layout ────────────────────────────────────

// Map department name to short label (same as DepartmentBar)
const DEPT_LABEL: Record<string, string> = {
  marketing: 'Marketing', sales: 'Sales', operations: 'Operations',
  support: 'Support', product: 'Product', legal: 'Legal',
  finance: 'Finance', hr: 'HR',
};

interface JTBDWorkspaceSectionV2Props {
  departments: DepartmentRow[];
  selectedDeptId: string | null;
  onSelectDepartment: (id: string) => void;
  department: DepartmentRow | null;
  contextToggle?: boolean;
  sidekickPanelStyle?: string;
  sidebarLeft?: boolean;
}

export function JTBDWorkspaceSectionV2({
  departments,
  selectedDeptId,
  onSelectDepartment,
  department,
  contextToggle = false,
  sidekickPanelStyle = 'right_overlay',
  sidebarLeft = false,
}: JTBDWorkspaceSectionV2Props) {
  if (!department) {
    return (
      <section className="py-16 bg-white">
        <p className="text-center text-gray-400 text-sm">Loading...</p>
      </section>
    );
  }

  return (
    <section className="py-8 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <JTBDWorkspaceContentV2
          departments={departments}
          selectedDeptId={selectedDeptId}
          onSelectDepartment={onSelectDepartment}
          department={department}
          contextToggle={contextToggle}
          sidekickPanelStyle={sidekickPanelStyle}
          sidebarLeft={sidebarLeft}
        />
      </div>
    </section>
  );
}

// ─── V2 Inner Content ────────────────────────────────────────────

function JTBDWorkspaceContentV2({
  departments,
  selectedDeptId,
  onSelectDepartment,
  department,
  contextToggle = false,
  sidekickPanelStyle = 'right_overlay',
  sidebarLeft = false,
}: {
  departments: DepartmentRow[];
  selectedDeptId: string | null;
  onSelectDepartment: (id: string) => void;
  department: DepartmentRow;
  contextToggle?: boolean;
  sidekickPanelStyle?: string;
  sidebarLeft?: boolean;
}) {
  const { agents, vibeApps, sidekickActions, loading } = useDepartmentData(department.id);
  const [selectedJTBD, setSelectedJTBD] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('work');

  const JTBD_TITLES: string[] = [
    'Launch campaign',
    'Research competitors',
    'Build event app',
    'Create visuals',
  ];

  const jtbdItems: JTBDItem[] = useMemo(() => {
    const items: JTBDItem[] = [];
    agents.forEach((agent, i) => {
      items.push({
        id: `agent-${agent.id}`,
        title: JTBD_TITLES[i] || agent.name,
        agentName: agent.name,
        agentImage: agent.image,
        relatedTools: [],
      });
    });
    sidekickActions.forEach((action, i) => {
      items.push({
        id: `sidekick-${action.id}`,
        title: JTBD_TITLES[agents.length + i] || action.name,
        agentName: 'Sidekick',
        agentImage: null,
        relatedTools: [],
      });
    });
    vibeApps.forEach((app) => {
      if (app.replaces_tools && app.replaces_tools.length > 0) {
        items.forEach((item, idx) => {
          if (idx < app.replaces_tools.length) {
            item.relatedTools.push(...app.replaces_tools.slice(0, 3));
          }
        });
      }
    });
    return items.slice(0, 8);
  }, [agents, sidekickActions, vibeApps]);

  useEffect(() => {
    if (jtbdItems.length > 0) {
      setSelectedJTBD(jtbdItems[0].id);
    }
  }, [jtbdItems]);

  const activeJTBD = jtbdItems.find((j) => j.id === selectedJTBD);

  const allTools = useMemo(() => {
    return vibeApps
      .flatMap((app) => app.replaces_tools || [])
      .filter((tool, i, arr) => arr.indexOf(tool) === i)
      .slice(0, 6);
  }, [vibeApps]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-[#6161ff] animate-spin" />
      </div>
    );
  }

  const toggleElement = contextToggle ? (
    <WorkContextToggle mode={viewMode} onToggle={setViewMode} />
  ) : undefined;

  const teamMembers = TEAM_MEMBERS[department.name] || [];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-xl shadow-gray-100/50 overflow-hidden relative">
      {/* ─── Row 1: Department pills ─── */}
      <div className="flex items-center gap-2 px-5 pt-4 pb-2 border-b border-gray-100/60 bg-gray-50/30 flex-wrap">
        {departments.map((dept) => {
          const isActive = selectedDeptId === dept.id;
          const label = DEPT_LABEL[dept.name] || dept.name;
          return (
            <motion.button
              key={dept.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectDepartment(dept.id)}
              className={`
                px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer
                ${isActive
                  ? 'bg-[#6161ff] text-white shadow-sm shadow-[#6161ff]/20'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'
                }
              `}
            >
              {label}
            </motion.button>
          );
        })}
      </div>

      {/* ─── Row 2: Team + Agents strip ─── */}
      <div className="flex items-center gap-3 px-5 py-2 border-b border-gray-100/40">
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Team members */}
          <div className="flex -space-x-1.5">
            {teamMembers.slice(0, 3).map((m, i) => (
              <img
                key={`member-${i}`}
                src={m.image}
                alt={m.name}
                className="w-6 h-6 rounded-full object-cover border-[1.5px] border-white"
                style={{ zIndex: 10 - i }}
              />
            ))}
          </div>
          {/* Agent count badge */}
          {agents.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-medium text-emerald-700 whitespace-nowrap">
              +{agents.length} {agents.length === 1 ? 'agent' : 'agents'}
            </span>
          )}
        </div>
      </div>

      {/* ─── Row 3: JTBD tabs + Work/Context toggle ─── */}
      <div className="flex items-center justify-between px-5 py-2.5 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
          {jtbdItems.map((item) => {
            const isActive = selectedJTBD === item.id;
            return (
              <motion.button
                key={item.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedJTBD(item.id)}
                className={`
                  px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-200 cursor-pointer whitespace-nowrap
                  ${isActive
                    ? 'bg-[#6161ff]/10 text-[#6161ff] ring-1 ring-[#6161ff]/20'
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                  }
                `}
              >
                {item.title}
              </motion.button>
            );
          })}
        </div>
        {toggleElement && (
          <div className="flex-shrink-0 ml-3">{toggleElement}</div>
        )}
      </div>

      {/* ─── Row 4: AnimatedWorkspace (frameless — no extra border) ─── */}
      <AnimatedWorkspace
        department={department}
        activeJTBD={activeJTBD || null}
        agents={agents}
        vibeApps={vibeApps}
        allTools={allTools}
        toggleSlot={undefined}
        viewMode={viewMode}
        sidekickPanelStyle={sidekickPanelStyle}
        frameless
        sidebarLeft={sidebarLeft}
      />
    </div>
  );
}

// ─── V3: Sidekick Chat Sidebar Layout ────────────────────────────

export function JTBDWorkspaceSectionV3({ department, allDepartments = [], contextToggle = false, sidekickPanelStyle = 'right_overlay', teamAvatarsPlacement = 'header_row', minimalChat = false, sidebarLeft = false, showJtbdSidebar = true, showInlineSidekick = false, showIntro = false, introStyle = 'unified' }: JTBDWorkspaceSectionProps) {
  if (!department) {
    return (
      <section className="py-16 bg-white">
        <p className="text-center text-gray-400 text-sm">
          Select a department above to explore its jobs to be done
        </p>
      </section>
    );
  }

  return (
    <section className="py-8 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <JTBDWorkspaceContentV3
          department={department}
          allDepartments={allDepartments}
          contextToggle={contextToggle}
          sidekickPanelStyle={sidekickPanelStyle}
          teamAvatarsPlacement={teamAvatarsPlacement}
          minimalChat={minimalChat}
          sidebarLeft={sidebarLeft}
          showJtbdSidebar={showJtbdSidebar}
          showInlineSidekick={showInlineSidekick}
          showIntro={showIntro}
          introStyle={introStyle}
        />
      </div>
    </section>
  );
}

function JTBDWorkspaceContentV3({
  department,
  allDepartments,
  contextToggle = false,
  sidekickPanelStyle = 'right_overlay',
  teamAvatarsPlacement = 'header_row',
  minimalChat = false,
  sidebarLeft = false,
  showJtbdSidebar = true,
  showInlineSidekick = false,
  showIntro = false,
  introStyle = 'unified',
}: {
  department: DepartmentRow;
  allDepartments: DepartmentRow[];
  contextToggle?: boolean;
  sidekickPanelStyle?: string;
  teamAvatarsPlacement?: 'in_chat' | 'header_row' | 'header_merged';
  minimalChat?: boolean;
  sidebarLeft?: boolean;
  showJtbdSidebar?: boolean;
  showInlineSidekick?: boolean;
  showIntro?: boolean;
  introStyle?: 'unified' | 'with_plus';
}) {
  const { agents, vibeApps, sidekickActions, loading } = useDepartmentData(department.id);
  const [selectedJTBD, setSelectedJTBD] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('work');
  const [introActive, setIntroActive] = useState(showIntro);

  // Reset intro when department changes
  useEffect(() => {
    if (showIntro) {
      setIntroActive(true);
    }
  }, [department.id, showIntro]);

  const JTBD_TITLES: string[] = [
    'Launch campaign',
    'Research competitors',
    'Build event app',
    'Create visuals',
  ];

  const jtbdItems: JTBDItem[] = useMemo(() => {
    const items: JTBDItem[] = [];
    agents.forEach((agent, i) => {
      items.push({
        id: `agent-${agent.id}`,
        title: JTBD_TITLES[i] || agent.name,
        agentName: agent.name,
        agentImage: agent.image,
        relatedTools: [],
      });
    });
    sidekickActions.forEach((action, i) => {
      items.push({
        id: `sidekick-${action.id}`,
        title: JTBD_TITLES[agents.length + i] || action.name,
        agentName: 'Sidekick',
        agentImage: null,
        relatedTools: [],
      });
    });
    vibeApps.forEach((app) => {
      if (app.replaces_tools && app.replaces_tools.length > 0) {
        items.forEach((item, idx) => {
          if (idx < app.replaces_tools.length) {
            item.relatedTools.push(...app.replaces_tools.slice(0, 3));
          }
        });
      }
    });
    return items.slice(0, 8);
  }, [agents, sidekickActions, vibeApps]);

  useEffect(() => {
    if (jtbdItems.length > 0) {
      setSelectedJTBD(jtbdItems[0].id);
    }
  }, [jtbdItems]);

  const activeJTBD = jtbdItems.find((j) => j.id === selectedJTBD);

  const allTools = useMemo(() => {
    return vibeApps
      .flatMap((app) => app.replaces_tools || [])
      .filter((tool, i, arr) => arr.indexOf(tool) === i)
      .slice(0, 6);
  }, [vibeApps]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-[#6161ff] animate-spin" />
      </div>
    );
  }

  const toggleElement = contextToggle ? (
    <WorkContextToggle mode={viewMode} onToggle={setViewMode} />
  ) : undefined;

  const teamMembers = TEAM_MEMBERS[department.name] || [];
  const firstMember = teamMembers[0];

  // Show intro if enabled and active
  if (introActive && showIntro && agents.length > 0) {
    return (
      <AnimatePresence mode="wait">
        <WorkspaceIntro
          department={department}
          agents={agents}
          allDepartments={allDepartments}
          onStart={() => setIntroActive(false)}
          introStyle={introStyle}
        />
      </AnimatePresence>
    );
  }

  return (
    <div className={`${showJtbdSidebar ? 'grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start' : 'flex justify-center'}`}>
      {/* ─── Left Panel: Workspace ─── */}
      <div className={showJtbdSidebar ? 'lg:col-span-8' : 'w-full max-w-5xl'}>
        <AnimatedWorkspace
          department={department}
          activeJTBD={activeJTBD || null}
          agents={agents}
          vibeApps={vibeApps}
          allTools={allTools}
          toggleSlot={toggleElement}
          viewMode={viewMode}
          sidekickPanelStyle={sidekickPanelStyle}
          skipPromptPhase
          staticMode
          sidebarLeft={sidebarLeft}
          showInlineSidekick={showInlineSidekick}
          allDepartments={allDepartments}
          jtbdItems={jtbdItems}
          selectedJTBD={selectedJTBD}
          onSelectJTBD={setSelectedJTBD}
        />
      </div>

      {/* ─── Right Panel: Sidekick Chat ─── */}
      {showJtbdSidebar && (
      <div className="lg:col-span-4">
        <SidekickChatSidebar
          department={department}
          allDepartments={allDepartments}
          teamMembers={teamMembers}
          firstMember={firstMember}
          jtbdItems={jtbdItems}
          selectedJTBD={selectedJTBD}
          onSelectJTBD={setSelectedJTBD}
          teamAvatarsPlacement={teamAvatarsPlacement}
          minimalChat={minimalChat}
        />
      </div>
      )}
    </div>
  );
}

// ─── V4 Platform Card Layout ──────────────────────────────────────

function PlatformCardFrame({ department, children }: { department: DepartmentRow; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-lg shadow-gray-100/50 overflow-hidden">
      {/* Header: department avatar + title + description */}
      <div className="flex items-center gap-3.5 px-5 py-4 border-b border-gray-100 bg-gray-50/30">
        {department.avatar_image ? (
          <div
            className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-white shadow-sm"
            style={{ backgroundColor: department.avatar_color || '#e5e7eb' }}
          >
            <img src={department.avatar_image} alt={department.title} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0" />
        )}
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-gray-800">{department.title}</h3>
          {department.description && (
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{department.description}</p>
          )}
        </div>
      </div>
      {/* Board content */}
      <div>{children}</div>
    </div>
  );
}

export function JTBDWorkspaceSectionV4({ department, allDepartments = [], contextToggle = false, sidekickPanelStyle = 'right_overlay', teamAvatarsPlacement = 'header_row', minimalChat = false, sidebarLeft = false, leftPanelStyle = 'sidekick_chat', showJtbdSidebar = true, showInlineSidekick = false, showIntro = false, introStyle = 'unified' }: JTBDWorkspaceSectionProps) {
  if (!department) {
    return (
      <section className="py-16 bg-white">
        <p className="text-center text-gray-400 text-sm">
          Select a department above to explore its jobs to be done
        </p>
      </section>
    );
  }

  return (
    <section className="pt-2 md:pt-3 pb-2 md:pb-4 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <JTBDWorkspaceContentV4
          department={department}
          allDepartments={allDepartments}
          contextToggle={contextToggle}
          sidekickPanelStyle={sidekickPanelStyle}
          teamAvatarsPlacement={teamAvatarsPlacement}
          minimalChat={minimalChat}
          sidebarLeft={sidebarLeft}
          leftPanelStyle={leftPanelStyle}
          showJtbdSidebar={showJtbdSidebar}
          showInlineSidekick={showInlineSidekick}
          showIntro={showIntro}
          introStyle={introStyle}
        />
      </div>
    </section>
  );
}

function JTBDWorkspaceContentV4({
  department,
  allDepartments,
  contextToggle = false,
  sidekickPanelStyle = 'right_overlay',
  teamAvatarsPlacement = 'header_row',
  minimalChat = false,
  sidebarLeft = false,
  leftPanelStyle = 'sidekick_chat',
  showJtbdSidebar = true,
  showInlineSidekick = false,
  showIntro = false,
  introStyle = 'unified',
}: {
  department: DepartmentRow;
  allDepartments: DepartmentRow[];
  contextToggle?: boolean;
  sidekickPanelStyle?: string;
  teamAvatarsPlacement?: 'in_chat' | 'header_row' | 'header_merged';
  minimalChat?: boolean;
  sidebarLeft?: boolean;
  leftPanelStyle?: 'sidekick_chat' | 'v1_sidebar';
  showJtbdSidebar?: boolean;
  showInlineSidekick?: boolean;
  showIntro?: boolean;
  introStyle?: 'unified' | 'with_plus';
}) {
  const { agents, vibeApps, sidekickActions, loading } = useDepartmentData(department.id);
  const [selectedJTBD, setSelectedJTBD] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('work');
  const [introActive, setIntroActive] = useState(showIntro);
  const [transitioning, setTransitioning] = useState(false);

  // Reset intro when department changes
  useEffect(() => {
    if (showIntro) {
      setIntroActive(true);
      setTransitioning(false);
    }
  }, [department.id, showIntro]);

  // After CTA click, wait for crossfade then dismiss intro overlay
  useEffect(() => {
    if (transitioning) {
      const timer = setTimeout(() => {
        setIntroActive(false);
        setTransitioning(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [transitioning]);

  const JTBD_TITLES: string[] = [
    'Launch campaign',
    'Research competitors',
    'Build event app',
    'Create visuals',
  ];

  const jtbdItems: JTBDItem[] = useMemo(() => {
    const items: JTBDItem[] = [];
    agents.forEach((agent, i) => {
      items.push({
        id: `agent-${agent.id}`,
        title: JTBD_TITLES[i] || agent.name,
        agentName: agent.name,
        agentImage: agent.image,
        relatedTools: [],
      });
    });
    sidekickActions.forEach((action, i) => {
      items.push({
        id: `sidekick-${action.id}`,
        title: JTBD_TITLES[agents.length + i] || action.name,
        agentName: 'Sidekick',
        agentImage: null,
        relatedTools: [],
      });
    });
    vibeApps.forEach((app) => {
      if (app.replaces_tools && app.replaces_tools.length > 0) {
        items.forEach((item, idx) => {
          if (idx < app.replaces_tools.length) {
            item.relatedTools.push(...app.replaces_tools.slice(0, 3));
          }
        });
      }
    });
    return items.slice(0, 8);
  }, [agents, sidekickActions, vibeApps]);

  useEffect(() => {
    if (jtbdItems.length > 0) {
      setSelectedJTBD(jtbdItems[0].id);
    }
  }, [jtbdItems]);

  const activeJTBD = jtbdItems.find((j) => j.id === selectedJTBD);

  const allTools = useMemo(() => {
    return vibeApps
      .flatMap((app) => app.replaces_tools || [])
      .filter((tool, i, arr) => arr.indexOf(tool) === i)
      .slice(0, 6);
  }, [vibeApps]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-[#6161ff] animate-spin" />
      </div>
    );
  }

  const toggleElement = contextToggle ? (
    <WorkContextToggle mode={viewMode} onToggle={setViewMode} />
  ) : undefined;

  const teamMembers = TEAM_MEMBERS[department.name] || [];
  const firstMember = teamMembers[0];

  const useSidekickChat = leftPanelStyle === 'sidekick_chat';

  const showIntroNow = introActive && showIntro && agents.length > 0;

  return (
    <div className="relative">
      {/* ─── Board: renders when transitioning (underneath) OR after intro is dismissed ─── */}
      {(transitioning || !showIntroNow) && (
        <motion.div
          key="board"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: transitioning ? 0.2 : 0 }}
          className={`${showJtbdSidebar ? 'grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start' : 'flex justify-center'}`}
        >
          {/* ─── Left Panel ─── */}
          {showJtbdSidebar && (
          <div className="lg:col-span-4">
            {useSidekickChat ? (
              <SidekickChatSidebar
                department={department}
                allDepartments={allDepartments}
                teamMembers={teamMembers}
                firstMember={firstMember}
                jtbdItems={jtbdItems}
                selectedJTBD={selectedJTBD}
                onSelectJTBD={setSelectedJTBD}
                teamAvatarsPlacement={teamAvatarsPlacement}
                minimalChat={minimalChat}
              />
            ) : (
              /* V1-style sidebar */
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{department.title} team</h3>
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="flex -space-x-2.5">
                      {department.avatar_image && (
                        <div
                          className="w-12 h-12 rounded-full overflow-hidden border-2 border-white flex-shrink-0 z-10"
                          style={{ backgroundColor: department.avatar_color || '#e5e7eb' }}
                        >
                          <img src={department.avatar_image} alt={department.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      {allDepartments
                        .filter((d) => d.id !== department.id && d.avatar_image)
                        .slice(0, 3)
                        .map((d, i) => (
                          <div
                            key={d.id}
                            className="w-10 h-10 rounded-full overflow-hidden border-2 border-white flex-shrink-0"
                            style={{ backgroundColor: d.avatar_color || '#e5e7eb', zIndex: 9 - i }}
                          >
                            <img src={d.avatar_image} alt="" className="w-full h-full object-cover" />
                          </div>
                        ))}
                    </div>
                    {agents.length > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-medium text-emerald-700 whitespace-nowrap">
                        +{agents.length} {agents.length === 1 ? 'agent' : 'agents'}
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-400 mb-2">Jobs to be done</p>
                <div className="space-y-1.5">
                  {jtbdItems.map((item) => {
                    const isActive = item.id === selectedJTBD;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setSelectedJTBD(item.id)}
                        className={`w-full text-left px-3 py-2.5 rounded-xl border transition-all duration-200 flex items-center gap-2.5 ${
                          isActive
                            ? 'border-[#6161ff]/30 bg-[#6161ff]/5 shadow-sm'
                            : 'border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <Zap className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-[#6161ff]' : 'text-gray-300'}`} />
                        <span className={`text-[12px] ${isActive ? 'text-[#6161ff] font-semibold' : 'text-gray-600'}`}>
                          {item.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          )}

          {/* ─── Right Panel: Platform Card Frame + Board ─── */}
          <div className={showJtbdSidebar ? 'lg:col-span-8' : 'w-full max-w-5xl'}>
            <PlatformCardFrame department={department}>
              <AnimatedWorkspace
                department={department}
                activeJTBD={activeJTBD || null}
                agents={agents}
                vibeApps={vibeApps}
                allTools={allTools}
                toggleSlot={toggleElement}
                viewMode={viewMode}
                sidekickPanelStyle={sidekickPanelStyle}
                frameless
                skipPromptPhase={useSidekickChat}
                sidebarLeft={sidebarLeft}
                showInlineSidekick={showInlineSidekick}
                allDepartments={allDepartments}
                jtbdItems={jtbdItems}
                selectedJTBD={selectedJTBD}
                onSelectJTBD={setSelectedJTBD}
              />
            </PlatformCardFrame>
          </div>
        </motion.div>
      )}

      {/* ─── Intro overlay: normal flow when idle, absolute overlay during transition ─── */}
      {showIntroNow && (
        <div className={transitioning ? 'absolute inset-0 z-30 pointer-events-none' : 'relative'}>
          <WorkspaceIntro
            key="intro"
            department={department}
            agents={agents}
            allDepartments={allDepartments}
            onStart={() => setTransitioning(true)}
            introStyle={introStyle}
            transitioning={transitioning}
          />
        </div>
      )}
    </div>
  );
}

// ─── Sidekick Chat Sidebar Component ─────────────────────────────

function SidekickChatSidebar({
  department,
  allDepartments,
  teamMembers,
  firstMember,
  jtbdItems,
  selectedJTBD,
  onSelectJTBD,
  teamAvatarsPlacement = 'header_row',
  minimalChat = false,
}: {
  department: DepartmentRow;
  allDepartments: DepartmentRow[];
  teamMembers: { name: string; role: string; image: string }[];
  firstMember?: { name: string; role: string; image: string };
  jtbdItems: JTBDItem[];
  selectedJTBD: string | null;
  onSelectJTBD: (id: string) => void;
  teamAvatarsPlacement?: 'in_chat' | 'header_row' | 'header_merged';
  minimalChat?: boolean;
}) {
  const activeItem = jtbdItems.find((j) => j.id === selectedJTBD);
  const promptText = activeItem ? (JTBD_PROMPTS[activeItem.title] || DEFAULT_PROMPT) : '';

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-lg shadow-gray-100/50 overflow-hidden flex flex-col" style={{ minHeight: 420 }}>
      {/* ─── Header ─── */}
      <div className={`px-4 border-b border-gray-100 ${teamAvatarsPlacement === 'header_merged' ? 'py-4 bg-gray-50/60' : 'py-3 bg-gray-50/30'}`}>
        <div className={`flex items-center ${teamAvatarsPlacement === 'header_merged' ? 'gap-3' : 'gap-2.5'}`}>
          {/* Avatar area: single or merged */}
          <div className="relative flex-shrink-0">
            {teamAvatarsPlacement === 'header_merged' ? (
              /* Merged: overlapping department + team avatars — larger */
              <div className="flex -space-x-2 items-center">
                {department.avatar_image && (
                  <div
                    className="w-11 h-11 rounded-full overflow-hidden border-2 border-white flex-shrink-0 z-10 relative"
                    style={{ backgroundColor: department.avatar_color || '#e5e7eb' }}
                  >
                    <img src={department.avatar_image} alt={department.title} className="w-full h-full object-cover" />
                    <img src={sidekickLogo} alt="" className="absolute -bottom-0.5 -right-0.5 w-4.5 h-4.5 object-contain rounded-full bg-white border border-gray-100" />
                  </div>
                )}
                {allDepartments
                  .filter((d) => d.id !== department.id && d.avatar_image)
                  .slice(0, 2)
                  .map((d, i) => (
                    <div
                      key={d.id}
                      className="w-10 h-10 rounded-full overflow-hidden border-2 border-white flex-shrink-0"
                      style={{ backgroundColor: d.avatar_color || '#e5e7eb', zIndex: 9 - i }}
                    >
                      <img src={d.avatar_image} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
              </div>
            ) : (
              /* Single department avatar (used for header_row & in_chat) */
              <>
                {department.avatar_image ? (
                  <div
                    className="w-9 h-9 rounded-full overflow-hidden"
                    style={{ backgroundColor: department.avatar_color || '#e5e7eb' }}
                  >
                    <img src={department.avatar_image} alt={department.title} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gray-200" />
                )}
                <img src={sidekickLogo} alt="" className="absolute -bottom-0.5 -right-0.5 w-4.5 h-4.5 object-contain rounded-full bg-white border border-gray-100" />
              </>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className={`font-semibold text-gray-700 truncate ${teamAvatarsPlacement === 'header_merged' ? 'text-sm font-bold' : 'text-[12px]'}`}>
              {department.title} team
            </p>
            <div className={`flex items-center gap-1 ${teamAvatarsPlacement === 'header_merged' ? 'mt-0.5' : ''}`}>
              <span className={`text-gray-400 ${teamAvatarsPlacement === 'header_merged' ? 'text-[10px]' : 'text-[9px]'}`}>with</span>
              <img src={sidekickLogo} alt="" className={`object-contain ${teamAvatarsPlacement === 'header_merged' ? 'w-3.5 h-3.5' : 'w-3 h-3'}`} />
              <span className={`font-bold text-[#6161ff] ${teamAvatarsPlacement === 'header_merged' ? 'text-[10px]' : 'text-[9px]'}`}>sidekick</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span className="text-[9px] text-green-600 font-medium">Online</span>
          </div>
        </div>
        {/* Team avatars as separate row (header_row mode only) */}
        {teamAvatarsPlacement === 'header_row' && (
          <div className="flex items-center gap-2.5 mt-2.5 pt-2.5 border-t border-gray-100/60">
            <div className="flex -space-x-2 flex-shrink-0">
              {department.avatar_image && (
                <div
                  className="w-8 h-8 rounded-full overflow-hidden border-2 border-white flex-shrink-0 z-10"
                  style={{ backgroundColor: department.avatar_color || '#e5e7eb' }}
                >
                  <img src={department.avatar_image} alt={department.title} className="w-full h-full object-cover" />
                </div>
              )}
              {allDepartments
                .filter((d) => d.id !== department.id && d.avatar_image)
                .slice(0, 2)
                .map((d, i) => (
                  <div
                    key={d.id}
                    className="w-8 h-8 rounded-full overflow-hidden border-2 border-white flex-shrink-0"
                    style={{ backgroundColor: d.avatar_color || '#e5e7eb', zIndex: 9 - i }}
                  >
                    <img src={d.avatar_image} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* ─── Chat area ─── */}
      <div className="flex-1 p-4 flex flex-col gap-3 overflow-hidden">
        {/* Sidekick welcome message */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="flex items-start gap-2"
        >
          <img src={sidekickLogo} alt="" className="w-7 h-7 object-contain flex-shrink-0 mt-0.5" />
          <div className="bg-gray-50 border border-gray-100 rounded-xl rounded-tl-sm px-3 py-2">
            <p className="text-[11px] text-gray-700 leading-relaxed">
              Hey! I'm working with the <span className="font-semibold">{department.title}</span> team.
            </p>
            <p className="text-[11px] text-gray-700 leading-relaxed mt-1">What would you like to do?</p>
          </div>
        </motion.div>

        {/* Team avatars in chat (in_chat mode only) */}
        {teamAvatarsPlacement === 'in_chat' && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.35 }}
            className="flex items-center gap-3 px-1 py-1"
          >
            <div className="flex -space-x-2 flex-shrink-0">
              {department.avatar_image && (
                <div
                  className="w-9 h-9 rounded-full overflow-hidden border-2 border-white flex-shrink-0 z-10"
                  style={{ backgroundColor: department.avatar_color || '#e5e7eb' }}
                >
                  <img src={department.avatar_image} alt={department.title} className="w-full h-full object-cover" />
                </div>
              )}
              {allDepartments
                .filter((d) => d.id !== department.id && d.avatar_image)
                .slice(0, 2)
                .map((d, i) => (
                  <div
                    key={d.id}
                    className="w-9 h-9 rounded-full overflow-hidden border-2 border-white flex-shrink-0"
                    style={{ backgroundColor: d.avatar_color || '#e5e7eb', zIndex: 9 - i }}
                  >
                    <img src={d.avatar_image} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
            </div>
          </motion.div>
        )}

        {/* JTBD suggestion cards OR selected state */}
        <AnimatePresence mode="wait">
          {!selectedJTBD ? (
            /* ── No selection yet: show suggestion cards ── */
            <motion.div
              key="suggestions"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
              className="space-y-1.5"
            >
              {jtbdItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: 0.4 + index * 0.06 }}
                  onClick={() => onSelectJTBD(item.id)}
                  className="w-full text-left px-3 py-2 rounded-xl border border-gray-100 bg-white hover:border-[#6161ff]/30 hover:bg-[#6161ff]/[0.03] transition-all duration-200 cursor-pointer group flex items-center gap-2"
                >
                  <Send className="w-3 h-3 text-gray-300 group-hover:text-[#6161ff] transition-colors flex-shrink-0" />
                  <span className="text-[11px] text-gray-600 group-hover:text-gray-800">{item.title}</span>
                </motion.button>
              ))}
            </motion.div>
          ) : (
            /* ── Selection made: show user message + Sidekick response ── */
            <motion.div
              key={`selected-${selectedJTBD}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-3"
            >
              {/* JTBD suggestion cards (dim, with active highlighted) */}
              <div className="space-y-1">
                {jtbdItems.map((item, index) => {
                  const isActive = item.id === selectedJTBD;
                  return (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                      onClick={() => onSelectJTBD(item.id)}
                      className={`
                        w-full text-left px-3 py-2 rounded-xl border transition-all duration-200 cursor-pointer flex items-center gap-2
                        ${isActive
                          ? 'border-[#6161ff]/30 bg-[#6161ff]/5'
                          : 'border-gray-100 bg-white hover:border-gray-200 opacity-50 hover:opacity-80'
                        }
                      `}
                    >
                      <Send className={`w-3 h-3 flex-shrink-0 ${isActive ? 'text-[#6161ff]' : 'text-gray-300'}`} />
                      <span className={`text-[11px] ${isActive ? 'text-[#6161ff] font-medium' : 'text-gray-500'}`}>{item.title}</span>
                    </motion.button>
                  );
                })}
              </div>

              {/* User "sent" message + Sidekick confirmation (hidden in minimal mode) */}
              {!minimalChat && (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.15 }}
                    className="flex items-start gap-2 justify-end"
                  >
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl rounded-tr-sm px-3 py-2 max-w-[85%]">
                      <p className="text-[11px] text-gray-700 leading-relaxed">{promptText}</p>
                    </div>
                    {firstMember && (
                      <img src={firstMember.image} alt="" className="w-6 h-6 rounded-full object-cover flex-shrink-0 mt-0.5" />
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                    className="flex items-start gap-2"
                  >
                    <img src={sidekickLogo} alt="" className="w-7 h-7 object-contain flex-shrink-0 mt-0.5" />
                    <div className="bg-[#6161ff]/5 border border-[#6161ff]/15 rounded-xl rounded-tl-sm px-3 py-2">
                      <p className="text-[11px] text-gray-700 leading-relaxed">On it! Setting up agents now.</p>
                    </div>
                  </motion.div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── Input area (decorative) ─── */}
      <div className="px-4 pb-3 pt-1 border-t border-gray-50">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50/50">
          <span className="text-[10px] text-gray-300 flex-1">Type a message...</span>
          <Send className="w-3 h-3 text-gray-300" />
        </div>
      </div>
    </div>
  );
}

// ─── V1 Inner Content (loads data per department) ────────────────

function JTBDWorkspaceContent({
  department,
  allDepartments,
  contextToggle = false,
  sidekickPanelStyle = 'right_overlay',
  sidebarLeft = false,
  showJtbdSidebar = true,
  showInlineSidekick = false,
  showIntro = false,
  introStyle = 'unified',
}: {
  department: DepartmentRow;
  allDepartments: DepartmentRow[];
  contextToggle?: boolean;
  sidekickPanelStyle?: string;
  sidebarLeft?: boolean;
  showJtbdSidebar?: boolean;
  showInlineSidekick?: boolean;
  showIntro?: boolean;
  introStyle?: 'unified' | 'with_plus';
}) {
  const { agents, vibeApps, sidekickActions, loading } = useDepartmentData(department.id);
  const teamMembers = TEAM_MEMBERS[department.name] || [];
  const [selectedJTBD, setSelectedJTBD] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('work');
  const [introActive, setIntroActive] = useState(showIntro);

  // Reset intro when department changes
  useEffect(() => {
    if (showIntro) {
      setIntroActive(true);
    }
  }, [department.id, showIntro]);

  // Readable JTBD titles (override agent/action names with real jobs)
  const JTBD_TITLES: string[] = [
    'Launch campaign',
    'Research competitors',
    'Build event app',
    'Create visuals',
  ];

  // Build JTBD items
  const jtbdItems: JTBDItem[] = useMemo(() => {
    const items: JTBDItem[] = [];

    agents.forEach((agent, i) => {
      items.push({
        id: `agent-${agent.id}`,
        title: JTBD_TITLES[i] || agent.name,
        agentName: agent.name,
        agentImage: agent.image,
        relatedTools: [],
      });
    });

    sidekickActions.forEach((action, i) => {
      items.push({
        id: `sidekick-${action.id}`,
        title: JTBD_TITLES[agents.length + i] || action.name,
        agentName: 'Sidekick',
        agentImage: null,
        relatedTools: [],
      });
    });

    // Enrich with related tools from vibe apps
    vibeApps.forEach((app) => {
      if (app.replaces_tools && app.replaces_tools.length > 0) {
        // Distribute tools across JTBD items
        items.forEach((item, idx) => {
          if (idx < app.replaces_tools.length) {
            item.relatedTools.push(...app.replaces_tools.slice(0, 3));
          }
        });
      }
    });

    return items.slice(0, 8);
  }, [agents, sidekickActions, vibeApps]);

  // Auto-select first JTBD
  useEffect(() => {
    if (jtbdItems.length > 0) {
      setSelectedJTBD(jtbdItems[0].id);
    }
  }, [jtbdItems]);

  const activeJTBD = jtbdItems.find((j) => j.id === selectedJTBD);

  // All tools from all vibe apps
  const allTools = useMemo(() => {
    return vibeApps
      .flatMap((app) => app.replaces_tools || [])
      .filter((tool, i, arr) => arr.indexOf(tool) === i)
      .slice(0, 6);
  }, [vibeApps]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-[#6161ff] animate-spin" />
      </div>
    );
  }

  // The toggle element — only rendered when enabled
  const toggleElement = contextToggle ? (
    <WorkContextToggle mode={viewMode} onToggle={setViewMode} />
  ) : undefined;

  // Show intro if enabled and active
  if (introActive && showIntro && agents.length > 0) {
    return (
      <AnimatePresence mode="wait">
        <WorkspaceIntro
          department={department}
          agents={agents}
          allDepartments={allDepartments}
          onStart={() => setIntroActive(false)}
          introStyle={introStyle}
        />
      </AnimatePresence>
    );
  }

  return (
    <div className={`${showJtbdSidebar ? 'grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start' : 'flex justify-center'}`}>
      {/* ─── Left Panel ─── */}
      {showJtbdSidebar && (
      <div className="lg:col-span-4">
        <AnimatePresence mode="wait">
          {viewMode === 'work' ? (
            <motion.div
              key="left-work"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            >
              {/* ── Title ── */}
              <h3 className="text-lg font-bold text-gray-900 mb-3">{department.title} team</h3>

              {/* ── Team: original department avatars + agent avatars + roles ── */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Department / team member avatars */}
                  <div className="flex -space-x-2.5">
                    {department.avatar_image && (
                      <div
                        className="w-12 h-12 rounded-full overflow-hidden border-2 border-white flex-shrink-0 z-10"
                        style={{ backgroundColor: department.avatar_color || '#e5e7eb' }}
                      >
                        <img
                          src={department.avatar_image}
                          alt={department.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    {allDepartments
                      .filter((d) => d.id !== department.id && d.avatar_image)
                      .slice(0, 3)
                      .map((d, i) => (
                        <div
                          key={d.id}
                          className="w-11 h-11 rounded-full overflow-hidden border-2 border-white flex-shrink-0"
                          style={{ backgroundColor: d.avatar_color || '#e5e7eb', zIndex: 9 - i }}
                        >
                          <img
                            src={d.avatar_image}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                  </div>
                  {/* Agent count badge */}
                  {agents.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-medium text-emerald-700 whitespace-nowrap">
                      +{agents.length} {agents.length === 1 ? 'agent' : 'agents'}
                    </span>
                  )}
                </div>
              </div>

              {/* ── "Jobs to be done" label ── */}
              <p className="text-xs text-gray-400 mb-2">Jobs to be done</p>

              {/* ── JTBD Bubbles ── */}
              <div className="space-y-2">
                {jtbdItems.map((item, index) => {
                  const isActive = selectedJTBD === item.id;

                  return (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.06 }}
                      onClick={() => setSelectedJTBD(item.id)}
                      className={`
                        w-full text-left px-4 py-3 rounded-2xl border cursor-pointer
                        transition-all duration-300 group relative
                        ${isActive
                          ? 'bg-[#6161ff] text-white border-[#6161ff] shadow-lg shadow-[#6161ff]/20'
                          : 'bg-gray-50 text-gray-700 border-gray-100 hover:border-gray-200 hover:bg-gray-100'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <Send
                          className={`w-3.5 h-3.5 flex-shrink-0 transition-colors
                            ${isActive ? 'text-white/70' : 'text-gray-300 group-hover:text-gray-400'}
                          `}
                        />
                        <span className="text-sm leading-snug">{item.title}</span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="left-context"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            >
              <ContextFeaturesList department={department} allDepartments={allDepartments} agents={agents} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      )}

      {/* ─── Right Panel: Workspace frame stays, content transitions inside ─── */}
      <div className={showJtbdSidebar ? 'lg:col-span-8' : 'w-full max-w-5xl'}>
        <AnimatedWorkspace
          department={department}
          activeJTBD={activeJTBD || null}
          agents={agents}
          vibeApps={vibeApps}
          allTools={allTools}
          toggleSlot={toggleElement}
          viewMode={viewMode}
          sidekickPanelStyle={sidekickPanelStyle}
          sidebarLeft={sidebarLeft}
          showInlineSidekick={showInlineSidekick}
          allDepartments={allDepartments}
          jtbdItems={jtbdItems}
          selectedJTBD={selectedJTBD}
          onSelectJTBD={setSelectedJTBD}
        />
      </div>
    </div>
  );
}

// ─── Workspace Content Data ──────────────────────────────────────

interface WorkspaceRow {
  task: string;
  notification?: string;
  humanComment?: string;
}

const WORKSPACE_CONTENT: Record<string, WorkspaceRow[]> = {
  'Launch campaign': [
    { task: 'Q1 Product Launch Event', notification: 'Guest list compiled — 847 contacts', humanComment: 'Can you also add the VIP list?' },
    { task: 'Partner Summit Invitations', notification: 'RSVPs tracked in real-time' },
    { task: 'Webinar Registration Flow', notification: 'Registration form live' },
  ],
  'Research competitors': [
    { task: 'Market Landscape Analysis', notification: 'Competitive matrix generated', humanComment: 'Focus on the top 5 competitors' },
    { task: 'Feature Gap Report', notification: 'Gap analysis complete' },
    { task: 'Pricing Intelligence Brief', notification: 'Pricing data compiled' },
  ],
  'Build event app': [
    { task: 'Designing event registration UI', notification: 'UI components ready' },
    { task: 'Adding RSVP logic & notifications', notification: 'Backend logic deployed' },
    { task: 'Publishing to workspace', notification: 'Event App is live!' },
  ],
  'Create visuals': [
    { task: 'Brand Asset Library Update', notification: '12 visual assets created', humanComment: 'Use the new brand colors' },
    { task: 'Social Media Templates', notification: 'Templates ready for review' },
    { task: 'Landing Page Mockups', notification: 'Mockups delivered' },
  ],
};

// Fallback content for any JTBD not in the map
const DEFAULT_WORKSPACE_ROWS: WorkspaceRow[] = [
  { task: 'Analyze requirements', notification: 'Analysis complete', humanComment: 'Check the latest data first' },
  { task: 'Generate deliverables', notification: 'Deliverables ready' },
  { task: 'Quality review & publish', notification: 'Published successfully' },
];

// ─── Human prompt text per JTBD (typed into Sidekick at the start) ──
const JTBD_PROMPTS: Record<string, string> = {
  'Launch campaign': 'Launch our Q1 product event campaign',
  'Research competitors': 'Research our top competitors and gaps',
  'Build event app': 'Build an event registration app for Q1',
  'Create visuals': 'Create brand visuals for the new launch',
};
const DEFAULT_PROMPT = 'Help me get started with this task';

// ─── Context View Data ───────────────────────────────────────────

interface ContextFeature {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}

const CONTEXT_FEATURES: ContextFeature[] = [
  { icon: Database, title: 'mondayDB', description: 'Structured data layer powering every board', color: '#6161ff' },
  { icon: Brain, title: 'Context', description: 'AI memory and understanding across workflows', color: '#8b5cf6' },
  { icon: Puzzle, title: 'Open Ecosystem', description: 'Extensible platform for custom apps and integrations', color: '#0ea5e9' },
  { icon: Link2, title: 'Integrations', description: '200+ connected tools and services', color: '#10b981' },
  { icon: Shield, title: 'Security & Governance', description: 'Enterprise-grade access controls and compliance', color: '#f59e0b' },
  { icon: Workflow, title: 'Workflows Engine', description: 'Automations and business logic', color: '#ec4899' },
];

interface ContextRow {
  icon: LucideIcon;
  title: string;
  detail: string;
  color: string;
}

const CONTEXT_ROWS: ContextRow[] = [
  { icon: Database, title: 'mondayDB', detail: '3 boards · 47 items · 12 columns', color: '#6161ff' },
  { icon: Link2, title: 'Integrations', detail: '8 connected tools feeding data', color: '#10b981' },
  { icon: Brain, title: 'Context Memory', detail: 'Learning from 1,247 interactions', color: '#8b5cf6' },
  { icon: Workflow, title: 'Workflows', detail: '5 active automations running', color: '#ec4899' },
  { icon: Shield, title: 'Security', detail: 'Enterprise SSO · SOC2 compliant', color: '#f59e0b' },
];

// ─── Work / Context Toggle ───────────────────────────────────────

type ViewMode = 'work' | 'context';

function WorkContextToggle({ mode, onToggle }: { mode: ViewMode; onToggle: (m: ViewMode) => void }) {
  return (
    <div className="inline-flex items-center bg-gray-100 rounded-full p-0.5 relative">
      {/* Sliding indicator */}
      <motion.div
        className="absolute top-[2px] bottom-[2px] rounded-full bg-white shadow-sm"
        initial={false}
        animate={{
          left: mode === 'work' ? 2 : '50%',
          right: mode === 'context' ? 2 : '50%',
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      />
      <button
        onClick={() => onToggle('work')}
        className={`relative z-10 px-3 py-0.5 text-[11px] font-medium rounded-full transition-colors duration-200 ${
          mode === 'work' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
        }`}
      >
        Work
      </button>
      <button
        onClick={() => onToggle('context')}
        className={`relative z-10 px-3 py-0.5 text-[11px] font-medium rounded-full transition-colors duration-200 ${
          mode === 'context' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
        }`}
      >
        Context
      </button>
    </div>
  );
}

// ─── Context View: Left Panel (Department + Capabilities) ───────

function ContextFeaturesList({
  department,
  allDepartments,
  agents = [],
}: {
  department: DepartmentRow;
  allDepartments: DepartmentRow[];
  agents?: any[];
}) {
  return (
    <div>
      {/* Department header — same as Work mode for visual continuity */}
      <h3 className="text-lg font-bold text-gray-900 mb-3">{department.title} team</h3>
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex -space-x-2.5">
            {department.avatar_image && (
              <div
                className="w-12 h-12 rounded-full overflow-hidden border-2 border-white flex-shrink-0 z-10"
                style={{ backgroundColor: department.avatar_color || '#e5e7eb' }}
              >
                <img src={department.avatar_image} alt={department.title} className="w-full h-full object-cover" />
              </div>
            )}
            {allDepartments
              .filter((d) => d.id !== department.id && d.avatar_image)
              .slice(0, 3)
              .map((d, i) => (
                <div
                  key={d.id}
                  className="w-11 h-11 rounded-full overflow-hidden border-2 border-white flex-shrink-0"
                  style={{ backgroundColor: d.avatar_color || '#e5e7eb', zIndex: 9 - i }}
                >
                  <img src={d.avatar_image} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
          </div>
          {agents.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-medium text-emerald-700 whitespace-nowrap">
              +{agents.length} {agents.length === 1 ? 'agent' : 'agents'}
            </span>
          )}
        </div>
      </div>

      {/* "Powered by" label */}
      <p className="text-xs text-gray-400 mb-2">Powered by</p>

      {/* Capability badges */}
      <div className="space-y-2">
        {CONTEXT_FEATURES.map((feature, i) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="flex items-center gap-3 px-4 py-2.5 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-sm hover:border-gray-200 transition-all cursor-default"
            >
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${feature.color}12` }}
              >
                <Icon className="w-3.5 h-3.5" style={{ color: feature.color }} />
              </div>
              <span className="text-sm text-gray-700">{feature.title}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Sub-Components ─────────────────────────────────────────────

/** Typing text reveal — progressively shows text character by character */
function TypingText({ text, durationMs = 1200, delay = 0, className = '' }: {
  text: string;
  durationMs?: number;
  delay?: number;
  className?: string;
}) {
  const [visibleChars, setVisibleChars] = useState(0);

  useEffect(() => {
    setVisibleChars(0);
    const charInterval = durationMs / text.length;
    let frame: number;
    let startTime: number;

    const delayTimer = setTimeout(() => {
      startTime = performance.now();
      const animate = (now: number) => {
        const elapsed = now - startTime;
        const chars = Math.min(Math.floor(elapsed / charInterval), text.length);
        setVisibleChars(chars);
        if (chars < text.length) {
          frame = requestAnimationFrame(animate);
        }
      };
      frame = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(delayTimer);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [text, durationMs, delay]);

  return (
    <span className={className}>
      {text.slice(0, visibleChars)}
      {visibleChars < text.length && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="inline-block w-[2px] h-[1em] bg-[#6161ff] ml-[1px] align-middle"
        />
      )}
    </span>
  );
}

/** Notification toast that slides in from top-right */
function NotificationToast({ message, show, onDone }: {
  message: string;
  show: boolean;
  onDone?: () => void;
}) {
  useEffect(() => {
    if (show && onDone) {
      const t = setTimeout(onDone, 3000);
      return () => clearTimeout(t);
    }
  }, [show, onDone]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: -10, x: 20 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="absolute top-14 right-3 z-20 flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-green-200 shadow-lg shadow-green-100/40 max-w-[220px]"
        >
          <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-3 h-3 text-green-600" />
          </div>
          <span className="text-[11px] text-gray-700 leading-tight">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Floating Agent Cursor — Figma-style cursor that follows the agent across board rows.
 * Movement is deliberate: types on the task, slides to the status column, clicks to
 * open a dropdown, and selects Done.
 */
function FloatingAgentCursor({ agentName, agentImage, phase, boardRef }: {
  agentName: string;
  agentImage?: string | null;
  phase: TimelinePhase;
  boardRef: React.RefObject<HTMLDivElement | null>;
}) {
  // Map phases to data-cursor-target attribute values on DOM elements
  const phaseToTarget: Partial<Record<TimelinePhase, string>> = {
    entering:       'row1-task',
    row1_typing:    'row1-task',
    row1_to_status: 'row1-status',
    row1_clicking:  'row1-status',
    row1_done:      'row1-status',
    row2_typing:    'row2-task',
    row2_to_status: 'row2-status',
    row2_clicking:  'row2-status',
    row2_done:      'row2-status',
    row3_typing:    'row3-task',
    row3_to_status: 'row3-status',
    row3_clicking:  'row3-status',
    app_building:   'build-your-own',
    complete:       'row3-status',
  };

  const [pos, setPos] = useState({ top: -30, left: 100 });

  // Measure target position from DOM whenever phase changes
  useEffect(() => {
    const targetId = phaseToTarget[phase];
    if (!targetId || !boardRef.current) return;

    // Use rAF + small delay to ensure DOM element is rendered after state change
    let timer: ReturnType<typeof setTimeout>;
    const raf = requestAnimationFrame(() => {
      timer = setTimeout(() => {
        const board = boardRef.current;
        if (!board) return;
        const el = document.querySelector(`[data-cursor-target="${targetId}"]`);
        if (!el) return;
        const boardRect = board.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        setPos({
          top: elRect.top - boardRect.top + elRect.height / 2,
          left: elRect.left - boardRect.left + elRect.width / 2,
        });
      }, 60);
    });
    return () => { cancelAnimationFrame(raf); clearTimeout(timer); };
  }, [phase]);

  const isHidden = phase === 'idle' || phase === 'entering' || phase === 'human_moving' || phase === 'human_typing' || phase === 'human_sent' || phase === 'app_panel_open' || phase === 'app_preview' || phase === 'app_added' || phase === 'row1_approving' || phase === 'row2_approving';

  const isClicking = phase.endsWith('_clicking');
  const isMovingToStatus = phase.endsWith('_to_status');
  const isTyping = phase.endsWith('_typing');

  // Natural movement transitions per phase type
  const getTransition = () => {
    if (phase === 'app_building') {
      return { type: 'spring' as const, stiffness: 60, damping: 18, mass: 1 };
    }
    if (isMovingToStatus) {
      return { type: 'tween' as const, ease: [0.25, 0.1, 0.25, 1.0] as number[], duration: 1.0 };
    }
    if (isClicking) {
      return { type: 'spring' as const, stiffness: 400, damping: 25 };
    }
    if (isTyping) {
      return { type: 'spring' as const, stiffness: 80, damping: 20, mass: 0.8 };
    }
    // Default (row transitions, done states)
    return { type: 'spring' as const, stiffness: 70, damping: 18, mass: 1 };
  };

  return (
    <AnimatePresence>
      {!isHidden && (
        <motion.div
          initial={{ opacity: 0, top: pos.top - 30, left: pos.left }}
          animate={{
            opacity: 1,
            top: pos.top,
            left: pos.left,
            scale: isClicking ? 0.85 : 1,
          }}
          exit={{ opacity: 0, scale: 0.7, transition: { duration: 0.2 } }}
          transition={getTransition()}
          className="absolute z-30 pointer-events-none"
          style={{ willChange: 'top, left, transform' }}
        >
          {/* Arrow (green — agent) */}
          <svg width="14" height="18" viewBox="0 0 14 18" fill="none" className="drop-shadow-sm">
            <path d="M1 1L12.5 9L6.5 10L4.5 17L1 1Z" fill="#10b981" stroke="#059669" strokeWidth="0.8" />
          </svg>

          {/* Name tag */}
          <div className="flex items-center gap-1.5 mt-0.5 ml-2.5 px-2 py-1 rounded-md bg-emerald-600 shadow-lg shadow-emerald-600/20 whitespace-nowrap">
            {agentImage && (
              <img src={agentImage} alt="" className="w-7 h-7 rounded-full object-cover border-2 border-white/40" />
            )}
            <span className="text-[10px] font-semibold text-white leading-none">{agentName}</span>
          </div>

          {/* Click ripple effect */}
          <AnimatePresence>
            {isClicking && (
              <motion.div
                initial={{ scale: 0, opacity: 0.6 }}
                animate={{ scale: 2.5, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="absolute top-0 left-0 w-4 h-4 rounded-full bg-emerald-400/30"
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Status dropdown — Monday-style dropdown that appears when agent clicks on the status badge.
 * Shows status options, highlights "Done", then closes.
 */
function StatusDropdown({ show }: { show: boolean }) {
  const [highlightDone, setHighlightDone] = useState(false);

  useEffect(() => {
    if (show) {
      setHighlightDone(false);
      const t = setTimeout(() => setHighlightDone(true), 350);
      return () => clearTimeout(t);
    }
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: -4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -4 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="absolute top-full left-0 mt-1 z-40 w-[120px] bg-white rounded-lg border border-gray-200 shadow-xl shadow-gray-200/50 py-1 overflow-hidden"
        >
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] text-blue-600 font-medium">
            <div className="w-2 h-2 rounded-full bg-blue-400" />
            In Progress
          </div>
          <motion.div
            animate={highlightDone ? {
              backgroundColor: 'rgba(34,197,94,0.1)',
            } : {}}
            transition={{ duration: 0.2 }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-semibold rounded-sm mx-0.5 ${
              highlightDone ? 'text-green-700 ring-1 ring-green-400/60' : 'text-green-600'
            }`}
          >
            <div className="w-2 h-2 rounded-full bg-green-500" />
            Done
            {highlightDone && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 20 }}
              >
                <CheckCircle2 className="w-2.5 h-2.5 text-green-600 ml-auto" />
              </motion.div>
            )}
          </motion.div>
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] text-red-400 font-medium">
            <div className="w-2 h-2 rounded-full bg-red-400" />
            Blocked
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Floating Human Cursor — appears at a fixed position on the board with a speech bubble.
 * Stays relatively still to feel natural (humans don't constantly scan).
 */
/**
 * Floating Human Cursor — appears inside the right sidebar, moves down to the
 * "Ask Sidekick..." input, clicks it, then disappears as the prompt panel opens.
 * This keeps the board clean with only the agent cursor.
 */
function FloatingHumanCursor({ memberName, memberImage, showCursor, isClicking }: {
  memberName: string;
  memberImage: string;
  showCursor: boolean;
  isClicking: boolean;
}) {
  return (
    <AnimatePresence>
      {showCursor && (
        <motion.div
          initial={{ opacity: 0, bottom: '70px', left: '25%' }}
          animate={{
            opacity: 1,
            bottom: isClicking ? '4px' : '30px',
            left: isClicking ? '30%' : '25%',
            scale: isClicking ? 0.85 : 1,
          }}
          exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
          transition={{ type: 'tween', ease: [0.4, 0.0, 0.2, 1], duration: isClicking ? 0.6 : 0.8 }}
          className="absolute z-50 pointer-events-none"
          style={{ willChange: 'bottom, left, transform' }}
        >
          {/* Arrow (green tint for human) */}
          <svg width="14" height="18" viewBox="0 0 14 18" fill="none" className="drop-shadow-sm">
            <path d="M1 1L12.5 9L6.5 10L4.5 17L1 1Z" fill="#10b981" stroke="#059669" strokeWidth="0.8" />
          </svg>
          {/* Name tag */}
          <div className="flex items-center gap-1.5 mt-0.5 ml-2.5 px-2 py-1 rounded-md bg-emerald-600 shadow-lg shadow-emerald-600/20 whitespace-nowrap">
            <img src={memberImage} alt="" className="w-5 h-5 rounded-full object-cover border border-white/30" />
            <span className="text-[10px] font-semibold text-white leading-none">{memberName}</span>
          </div>
          {/* Click ripple */}
          <AnimatePresence>
            {isClicking && (
              <motion.div
                initial={{ scale: 0, opacity: 0.5 }}
                animate={{ scale: 2.5, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="absolute top-0 left-0 w-4 h-4 rounded-full bg-emerald-400/30"
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Floating Approval Cursor — green cursor that appears on the board after agent
 * completes a row, moves to the Done badge and clicks to "approve" it.
 */
function FloatingApprovalCursor({ memberName, memberImage, phase, boardRef, cursorColor }: {
  memberName: string;
  memberImage: string;
  phase: TimelinePhase;
  boardRef: React.RefObject<HTMLDivElement | null>;
  cursorColor: string;
}) {
  const phaseToTarget: Partial<Record<TimelinePhase, string>> = {
    row1_approving: 'row1-review',
    row2_approving: 'row2-review',
  };

  const isVisible = phase === 'row1_approving' || phase === 'row2_approving';
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const [isClicking, setIsClicking] = useState(false);

  // Derive a slightly darker shade for stroke
  const strokeColor = cursorColor + 'cc';

  // Measure target position from DOM
  useEffect(() => {
    const targetId = phaseToTarget[phase];
    if (!targetId || !boardRef.current) return;

    setIsClicking(false);

    let timer: ReturnType<typeof setTimeout>;
    const raf = requestAnimationFrame(() => {
      timer = setTimeout(() => {
        const board = boardRef.current;
        if (!board) return;
        const el = document.querySelector(`[data-cursor-target="${targetId}"]`);
        if (!el) return;
        const boardRect = board.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        setPos({
          top: elRect.top - boardRect.top + elRect.height / 2,
          left: elRect.left - boardRect.left + elRect.width / 2,
        });
      }, 50);
    });

    // Click after the cursor has arrived (tween duration is 1.1s + buffer)
    const clickTimer = setTimeout(() => setIsClicking(true), 1300);

    return () => { cancelAnimationFrame(raf); clearTimeout(timer); clearTimeout(clickTimer); };
  }, [phase]);

  // Reset position when cursor hides so it enters fresh next time
  useEffect(() => {
    if (!isVisible) { setPos(null); setIsClicking(false); }
  }, [isVisible]);

  // Don't render until we have a measured position
  if (!isVisible || !pos) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, top: pos.top + 60, left: pos.left }}
        animate={{
          opacity: 1,
          top: pos.top,
          left: pos.left,
          scale: isClicking ? 0.88 : 1,
        }}
        exit={{ opacity: 0, y: 12, transition: { duration: 0.3 } }}
        transition={{
          top: { type: 'tween', ease: [0.22, 0.68, 0.35, 1.0], duration: 1.1 },
          left: { type: 'tween', ease: [0.22, 0.68, 0.35, 1.0], duration: 1.1 },
          opacity: { duration: 0.4 },
          scale: { type: 'spring', stiffness: 300, damping: 20 },
        }}
        className="absolute z-40 pointer-events-none"
        style={{ willChange: 'top, left, transform' }}
      >
        {/* Arrow — colored to match department avatar */}
        <svg width="14" height="18" viewBox="0 0 14 18" fill="none" className="drop-shadow-sm">
          <path d="M1 1L12.5 9L6.5 10L4.5 17L1 1Z" fill={cursorColor} stroke={strokeColor} strokeWidth="0.8" />
        </svg>

        {/* Name tag */}
        <div
          className="flex items-center gap-1.5 mt-0.5 ml-2.5 px-2 py-1 rounded-md shadow-lg whitespace-nowrap"
          style={{ backgroundColor: cursorColor, boxShadow: `0 4px 12px ${cursorColor}33` }}
        >
          {memberImage && (
            <img src={memberImage} alt="" className="w-5 h-5 rounded-full object-cover border border-white/30" />
          )}
          <span className="text-[10px] font-semibold text-white leading-none">{memberName}</span>
        </div>

        {/* Click ripple */}
        <AnimatePresence>
          {isClicking && (
            <motion.div
              initial={{ scale: 0, opacity: 0.4 }}
              animate={{ scale: 2.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="absolute top-0 left-0 w-4 h-4 rounded-full"
              style={{ backgroundColor: `${cursorColor}30` }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * Human Prompt Sidebar — slides in from the right when the team member wants to
 * instruct the agent. Looks like a chat/prompt panel overlaying the right sidebar.
 */
function HumanPromptSidebar({ show, memberName, memberImage, commentText }: {
  show: boolean;
  memberName: string;
  memberImage: string;
  commentText: string;
}) {
  return (
    <AnimatePresence>
      {show && commentText && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'tween', ease: [0.4, 0.0, 0.2, 1], duration: 0.35 }}
          className="absolute top-0 right-0 bottom-0 w-[220px] z-40 bg-white border-l border-gray-200 shadow-2xl shadow-gray-300/30 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center gap-2 px-3 py-2.5 border-b border-gray-100 bg-gray-50/50">
            <img src={memberImage} alt="" className="w-6 h-6 rounded-full object-cover" />
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-gray-700 truncate">{memberName}</p>
              <p className="text-[9px] text-emerald-500 font-medium">Online</p>
            </div>
          </div>

          {/* Chat area */}
          <div className="flex-1 p-3 flex flex-col justify-end">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-emerald-50 border border-emerald-100 rounded-xl rounded-bl-sm px-3 py-2 max-w-[180px]"
            >
              <TypingText text={commentText} durationMs={2800} delay={400} className="text-[11px] text-gray-700 leading-relaxed" />
            </motion.div>
          </div>

          {/* Input area */}
          <div className="px-3 pb-3 pt-1">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50/50">
              <span className="text-[10px] text-gray-300 flex-1">Message agent...</span>
              <Send className="w-3.5 h-3.5 text-gray-300" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Sidekick Chat Panel (opens at the start of every JTBD) ──────

function SidekickChatPanel({
  show,
  phase,
  memberName,
  memberImage,
  avatarColor,
  promptText,
  mode = 'right_overlay',
  sidebarLeft = false,
}: {
  show: boolean;
  phase: TimelinePhase;
  memberName: string;
  memberImage: string;
  avatarColor?: string;
  promptText: string;
  mode?: string;
  sidebarLeft?: boolean;
}) {
  // Typing progress for user message
  const [typedChars, setTypedChars] = useState(0);
  useEffect(() => {
    if (phase !== 'human_typing') { if (phase === 'idle' || phase === 'entering' || phase === 'human_moving') setTypedChars(0); return; }
    if (typedChars < promptText.length) {
      const timer = setTimeout(() => setTypedChars(prev => prev + 1), 45);
      return () => clearTimeout(timer);
    }
  }, [phase, typedChars, promptText]);

  const showWelcome = phase === 'human_moving' || phase === 'human_typing' || phase === 'human_sent';
  const showUserMsg = phase === 'human_typing' || phase === 'human_sent';
  const showConfirm = phase === 'human_sent';

  // When sidebar is on the left, flip overlay direction so the panel doesn't overlap the sidebar
  const effectiveMode = sidebarLeft
    ? (mode === 'left_overlay' ? 'right_overlay' : mode === 'right_overlay' ? 'left_overlay' : mode)
    : mode;
  const isCenter = effectiveMode === 'center_modal';
  const isLeft = effectiveMode === 'left_overlay';

  const panelContent = (
    <>
      {/* Header — Sidekick branding + team member */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-gray-100">
        <div className="relative flex-shrink-0">
          <div className="w-8 h-8 rounded-full overflow-hidden" style={{ backgroundColor: avatarColor || '#e5e7eb' }}>
            <img src={memberImage} alt={memberName} className="w-full h-full object-cover" />
          </div>
          <img src={sidekickLogo} alt="" className="absolute -bottom-0.5 -right-0.5 w-4 h-4 object-contain rounded-full bg-white border border-gray-100" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold text-gray-700 truncate">{memberName}</p>
          <div className="flex items-center gap-1">
            <span className="text-[9px] text-gray-400">with</span>
            <span className="text-[9px] font-bold text-[#6161ff]">sidekick</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
          <span className="text-[9px] text-green-600 font-medium">Online</span>
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 p-4 flex flex-col justify-end gap-3 overflow-hidden">
        {/* Sidekick welcome message */}
        <AnimatePresence>
          {showWelcome && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-start gap-2"
            >
              <img src={sidekickLogo} alt="" className="w-7 h-7 object-contain flex-shrink-0 mt-0.5" />
              <div className="bg-gray-50 border border-gray-100 rounded-xl rounded-tl-sm px-3 py-2">
                <p className="text-[11px] text-gray-700 leading-relaxed">Hey! How can I help today?</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* User message bubble */}
        <AnimatePresence>
          {showUserMsg && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-start gap-2 justify-end"
            >
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl rounded-tr-sm px-3 py-2 max-w-[85%]">
                <p className="text-[11px] text-gray-700 leading-relaxed">
                  {promptText.slice(0, typedChars)}
                  {typedChars < promptText.length && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
                      className="text-emerald-500"
                    >|</motion.span>
                  )}
                </p>
              </div>
              <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 mt-0.5" style={{ backgroundColor: avatarColor || '#e5e7eb' }}>
                <img src={memberImage} alt="" className="w-full h-full object-cover" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sidekick confirmation */}
        <AnimatePresence>
          {showConfirm && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
              className="flex items-start gap-2"
            >
              <img src={sidekickLogo} alt="" className="w-7 h-7 object-contain flex-shrink-0 mt-0.5" />
              <div className="bg-[#6161ff]/5 border border-[#6161ff]/15 rounded-xl rounded-tl-sm px-3 py-2">
                <p className="text-[11px] text-gray-700 leading-relaxed">On it! Setting up agents now.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input area */}
      <div className="px-4 pb-3 pt-1">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50/50">
          <span className="text-[10px] text-gray-300 flex-1">Type a message...</span>
          <Send className="w-3 h-3 text-gray-300" />
        </div>
      </div>
    </>
  );

  return (
    <AnimatePresence>
      {show && (
        isCenter ? (
          /* ── Center modal mode ── */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'tween', ease: [0.4, 0.0, 0.2, 1], duration: 0.35 }}
              className="w-[300px] bg-white rounded-2xl border border-gray-200 shadow-2xl shadow-gray-200/50 flex flex-col overflow-hidden"
              style={{ maxHeight: '80%' }}
            >
              {panelContent}
            </motion.div>
          </motion.div>
        ) : isLeft ? (
          /* ── Left overlay mode ── */
          <motion.div
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ type: 'tween', ease: [0.4, 0.0, 0.2, 1], duration: 0.35 }}
            className="absolute top-0 left-0 bottom-0 w-[220px] z-50 bg-white border-r border-gray-200 shadow-2xl shadow-gray-300/30 flex flex-col"
          >
            {panelContent}
          </motion.div>
        ) : (
          /* ── Right overlay mode (default) ── */
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'tween', ease: [0.4, 0.0, 0.2, 1], duration: 0.35 }}
            className="absolute top-0 right-0 bottom-0 w-[220px] z-50 bg-white border-l border-gray-200 shadow-2xl shadow-gray-300/30 flex flex-col"
          >
            {panelContent}
          </motion.div>
        )
      )}
    </AnimatePresence>
  );
}

// ─── App Builder Panel (slides in from right, shows app being built visually) ──

function AppBuilderPanel({ show, buildComplete }: { show: boolean; buildComplete: boolean }) {
  const [vibeProgress, setVibeProgress] = useState(0);

  useEffect(() => {
    if (!show) { setVibeProgress(0); return; }
    // Increment from 0 → 95 over ~3.8s (every 80ms, +2), then jump to 100 on buildComplete
    if (buildComplete) { setVibeProgress(100); return; }
    if (vibeProgress < 95) {
      const timer = setTimeout(() => setVibeProgress(prev => Math.min(prev + 2, 95)), 80);
      return () => clearTimeout(timer);
    }
  }, [show, buildComplete, vibeProgress]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'tween', ease: [0.4, 0.0, 0.2, 1], duration: 0.35 }}
          className="absolute top-0 right-0 bottom-0 w-[220px] z-40 bg-white border-l border-gray-200 shadow-2xl shadow-gray-300/30 flex flex-col"
        >
          {/* Header — Vibe branding */}
          <div className="flex items-center gap-2.5 px-3 py-2.5 border-b border-gray-100">
            <img src={vibeLogo} alt="Vibe" className="w-7 h-7 rounded-lg" />
            <div className="flex-1 min-w-0">
              <h4 className="text-[11px] font-bold text-gray-800">
                {buildComplete ? 'Building with Vibe' : 'Building with Vibe'}
              </h4>
              <p className="text-[9px] text-gray-400">Event Registration App</p>
            </div>
          </div>

          {/* Dark canvas — app being built progressively */}
          <div className="flex-1 px-3 py-3 overflow-hidden">
            <div className="bg-gray-900 rounded-xl p-3 space-y-2 relative overflow-hidden">
              {/* Shimmer sweep effect */}
              {vibeProgress > 5 && vibeProgress < 100 && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
              )}

              {/* Event header banner */}
              <motion.div
                className="rounded-lg bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 relative overflow-hidden"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{
                  scaleX: vibeProgress > 10 ? 1 : 0,
                  opacity: vibeProgress > 10 ? 1 : 0,
                }}
                style={{ transformOrigin: 'left', minHeight: 52 }}
                transition={{ duration: 0.4 }}
              >
                <div className="p-2.5 text-center relative z-10">
                  {vibeProgress > 25 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                      <Sparkles className="w-4 h-4 mx-auto mb-1 text-white/90" />
                      <p className="text-[9px] font-bold text-white">Annual Event 2026</p>
                      <p className="text-[7px] text-white/70">The future awaits</p>
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Info rows — date, location, attendees */}
              {[
                { threshold: 40, icon: Calendar, label: 'March 15, 2026', sub: '9:00 AM - 6:00 PM' },
                { threshold: 55, icon: MapPin, label: 'Innovation Center', sub: 'San Francisco, CA' },
                { threshold: 70, icon: Users, label: '500+ Attendees', sub: 'Join the community' },
              ].map((row, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-2 px-1"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{
                    opacity: vibeProgress > row.threshold ? 1 : 0,
                    x: vibeProgress > row.threshold ? 0 : -8,
                  }}
                  transition={{ duration: 0.35 }}
                >
                  <div className="w-5 h-5 rounded-md bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <row.icon className="w-2.5 h-2.5 text-purple-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[8px] font-semibold text-white/90">{row.label}</p>
                    <p className="text-[6px] text-white/40">{row.sub}</p>
                  </div>
                </motion.div>
              ))}

              {/* Register Now button */}
              <motion.div
                className="h-6 bg-purple-500 rounded-lg flex items-center justify-center"
                initial={{ opacity: 0, y: 6 }}
                animate={{
                  opacity: vibeProgress > 85 ? 1 : 0,
                  y: vibeProgress > 85 ? 0 : 6,
                }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-white text-[8px] font-bold">Register Now</span>
              </motion.div>

              {/* Final glow when complete */}
              {vibeProgress >= 100 && (
                <motion.div
                  className="absolute inset-0 rounded-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.15, 0] }}
                  transition={{ duration: 0.8 }}
                  style={{ boxShadow: 'inset 0 0 30px rgba(168, 85, 247, 0.4)' }}
                />
              )}
            </div>

            {/* App ready confirmation */}
            {buildComplete && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2.5 flex items-center gap-1.5 justify-center"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                <span className="text-[10px] font-semibold text-green-600">App ready!</span>
              </motion.div>
            )}
          </div>

          {/* Progress bar + percentage */}
          <div className="px-3 pb-3 pt-1">
            <div className="flex items-center justify-between text-[9px] mb-1">
              <span className="text-gray-400">{buildComplete ? 'Complete' : 'Building...'}</span>
              <span className="font-bold text-[#6161ff]">{vibeProgress}%</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                initial={{ width: 0 }}
                animate={{ width: `${vibeProgress}%` }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Animation Timeline Hook ────────────────────────────────────

type TimelinePhase =
  | 'idle' | 'entering'
  | 'human_moving' | 'human_typing' | 'human_sent'
  | 'row1_typing' | 'row1_to_status' | 'row1_clicking' | 'row1_done' | 'row1_approving'
  | 'row2_typing' | 'row2_to_status' | 'row2_clicking' | 'row2_done' | 'row2_approving'
  | 'row3_typing' | 'row3_to_status' | 'row3_clicking'
  | 'app_building' | 'app_panel_open' | 'app_preview' | 'app_added'
  | 'complete';

const HUMAN_PROMPT_PHASES: TimelinePhase[] = ['human_moving', 'human_typing', 'human_sent'];

function useAnimationTimeline(activeId: string | null, activeTitle: string | null = null, skipPrompt: boolean = false) {
  const [phase, setPhase] = useState<TimelinePhase>('idle');
  const [notification, setNotification] = useState<string | null>(null);
  const [showComment, setShowComment] = useState(false);
  const [showHumanCursor, setShowHumanCursor] = useState(false);
  const [humanClicking, setHumanClicking] = useState(false);

  useEffect(() => {
    if (!activeId) {
      setPhase('idle');
      setNotification(null);
      setShowComment(false);
      setShowHumanCursor(false);
      setHumanClicking(false);
      return;
    }

    // Reset
    setPhase('entering');
    setNotification(null);
    setShowComment(false);
    setShowHumanCursor(false);
    setHumanClicking(false);

    const timers: ReturnType<typeof setTimeout>[] = [];
    const t = (fn: () => void, ms: number) => { timers.push(setTimeout(fn, ms)); };

    let P: number;

    if (skipPrompt) {
      // V3 mode: skip chat panel phases, go straight to agent work
      P = 600;
    } else {
      // ════════ COMMON START: Sidekick chat panel opens ════════
      // Panel slides open, Sidekick welcome message appears
      t(() => setPhase('human_moving'), 600);
      // User's prompt starts typing in the chat panel
      t(() => setPhase('human_typing'), 1800);
      // Sidekick responds with confirmation
      t(() => setPhase('human_sent'), 3800);
      // Panel closes (entering = buffer while panel exit-animates, agent cursor still hidden)
      t(() => setPhase('entering'), 5200);

      // Offset for everything after the prompt phase
      // Agent cursor appears only after panel has fully closed
      P = 5700;
    }

    if (activeTitle === 'Build event app') {
      // ════════ BUILD EVENT APP — custom flow ════════
      t(() => setPhase('row1_typing'), P);
      t(() => setPhase('app_building'), P + 1400);
      t(() => setPhase('app_panel_open'), P + 2400);
      t(() => setPhase('app_preview'), P + 6400);
      t(() => setPhase('app_added'), P + 7900);
      t(() => setNotification('notify_app'), P + 8200);
      t(() => setPhase('row1_done'), P + 8900);
      t(() => setNotification(null), P + 9400);
      // Human approves row 1 (2.5s window)
      t(() => setPhase('row1_approving'), P + 9700);
      // Row 2
      t(() => setPhase('row2_typing'), P + 12200);
      t(() => setPhase('row2_to_status'), P + 14700);
      t(() => setPhase('row2_clicking'), P + 15900);
      t(() => setPhase('row2_done'), P + 16700);
      // Human approves row 2 (2.5s window)
      t(() => setPhase('row2_approving'), P + 17500);
      // Row 3
      t(() => setPhase('row3_typing'), P + 20000);
      t(() => setPhase('row3_to_status'), P + 21800);
      t(() => setPhase('row3_clicking'), P + 23000);
      // Complete
      t(() => setNotification('notify_summary'), P + 23400);
      t(() => setPhase('complete'), P + 23800);
      t(() => setNotification(null), P + 25800);
    } else {
      // ════════ STANDARD FLOW ════════
      // ── Row 1 ──
      t(() => setPhase('row1_typing'), P);
      t(() => setPhase('row1_to_status'), P + 2600);
      t(() => setPhase('row1_clicking'), P + 3800);
      t(() => setPhase('row1_done'), P + 4600);
      t(() => setNotification('notify1'), P + 4900);
      // Human approves row 1 (2.5s window — cursor travels 1.1s, clicks, badge appears)
      t(() => setPhase('row1_approving'), P + 5400);

      // ── Row 2 ──
      t(() => setPhase('row2_typing'), P + 7900);
      t(() => setNotification(null), P + 8900);
      t(() => setPhase('row2_to_status'), P + 10700);
      t(() => setPhase('row2_clicking'), P + 11900);
      t(() => setPhase('row2_done'), P + 12700);
      // Human approves row 2 (2.5s window)
      t(() => setPhase('row2_approving'), P + 13500);

      // ── Row 3 ──
      t(() => setPhase('row3_typing'), P + 16000);
      t(() => setPhase('row3_to_status'), P + 17800);
      t(() => setPhase('row3_clicking'), P + 19000);

      // All done
      t(() => setNotification('notify_summary'), P + 19400);
      t(() => setPhase('complete'), P + 19800);
      t(() => setNotification(null), P + 21800);
    }

    return () => timers.forEach(clearTimeout);
  }, [activeId]);

  return { phase, notification, showComment, showHumanCursor, humanClicking };
}

// ─── Event App Preview (mockup shown when building an app) ──────

function EventAppPreview() {
  const eventCards = [
    { name: 'Q1 Product Launch', date: 'Mar 15', location: 'Tel Aviv Convention Center', attendees: 847, color: '#6161ff', status: 'Registrations open', statusColor: '#10b981' },
    { name: 'Partner Summit 2025', date: 'Apr 22', location: 'Online · Zoom', attendees: 312, color: '#10b981', status: 'Almost full', statusColor: '#f59e0b' },
    { name: 'Webinar: AI at Work', date: 'May 8', location: 'Online · Webex', attendees: 1420, color: '#f59e0b', status: 'Coming soon', statusColor: '#6161ff' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="h-full flex flex-col"
    >
      {/* App window frame */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-lg shadow-gray-100/60 overflow-hidden flex flex-col flex-1">
        {/* Window title bar */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-[#ff5f57]" />
              <div className="w-2 h-2 rounded-full bg-[#febc2e]" />
              <div className="w-2 h-2 rounded-full bg-[#28c840]" />
            </div>
            <div className="flex items-center gap-1.5 ml-1.5">
              <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-[#6161ff] to-purple-500 flex items-center justify-center">
                <Calendar className="w-3 h-3 text-white" />
              </div>
              <span className="text-[10px] font-bold text-gray-700">Event Registration</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.span
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: [0.7, 1.1, 1] }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="inline-flex items-center gap-1 text-[8px] font-semibold px-1.5 py-0.5 rounded-full bg-green-50 text-green-600 border border-green-100"
            >
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <CheckCircle2 className="w-2.5 h-2.5" />
              </motion.div>
              Live
            </motion.span>
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-gray-50 border border-gray-100">
              <img src={vibeLogo} alt="Vibe" className="w-3 h-3 object-contain" />
              <span className="text-[7px] text-gray-400 font-medium">Built with Vibe</span>
            </div>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex items-center gap-0 px-3 border-b border-gray-100">
          <div className="px-3 py-1.5 text-[9px] font-semibold text-[#6161ff] border-b-2 border-[#6161ff]">Events</div>
          <div className="px-3 py-1.5 text-[9px] font-medium text-gray-400">Analytics</div>
          <div className="px-3 py-1.5 text-[9px] font-medium text-gray-400">Settings</div>
        </div>

        {/* Event cards */}
        <div className="flex-1 p-3 space-y-2 overflow-hidden">
          {eventCards.map((event, i) => (
            <motion.div
              key={event.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.15 + i * 0.1 }}
              className="p-2.5 rounded-lg border border-gray-100 bg-gradient-to-r from-white to-gray-50/50 hover:shadow-sm transition-all"
              style={{ borderLeftWidth: 3, borderLeftColor: event.color }}
            >
              <div className="flex items-start justify-between mb-1.5">
                <p className="text-[11px] font-semibold text-gray-800">{event.name}</p>
                <span
                  className="text-[7px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0 ml-2"
                  style={{ backgroundColor: `${event.statusColor}10`, color: event.statusColor }}
                >
                  {event.status}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="flex items-center gap-1 text-[9px] text-gray-400">
                  <Calendar className="w-2.5 h-2.5" /> {event.date}
                </span>
                <span className="flex items-center gap-1 text-[9px] text-gray-400">
                  <MapPin className="w-2.5 h-2.5" /> {event.location}
                </span>
                <span className="flex items-center gap-1 text-[9px] text-gray-500 ml-auto">
                  <Users className="w-2.5 h-2.5" />
                  <span className="font-semibold">{event.attendees.toLocaleString()}</span>
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom action bar */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="px-3 pb-3 flex items-center gap-2"
        >
          <div className="flex-1 h-7 rounded-lg bg-gradient-to-r from-[#6161ff] to-purple-500 shadow-md shadow-[#6161ff]/20 flex items-center justify-center cursor-default">
            <span className="text-[10px] font-bold text-white">+ Create New Event</span>
          </div>
          <div className="h-7 px-3 rounded-lg border border-gray-200 bg-white flex items-center justify-center cursor-default gap-1">
            <Globe className="w-3 h-3 text-gray-400" />
            <span className="text-[10px] font-medium text-gray-500">Share</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Inline Workspace Sidekick Chat ─────────────────────────────

function InlineWorkspaceSidekick({
  department,
  allDepartments = [],
  jtbdItems = [],
  selectedJTBD = null,
  onSelectJTBD,
}: {
  department: DepartmentRow;
  allDepartments?: DepartmentRow[];
  jtbdItems?: JTBDItem[];
  selectedJTBD?: string | null;
  onSelectJTBD?: (id: string) => void;
}) {
  const teamMembers = TEAM_MEMBERS[department.name] || [];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-gray-100 bg-white/60">
        <div className="flex items-center gap-2">
          {department.avatar_image && (
            <div
              className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0"
              style={{ backgroundColor: department.avatar_color || '#e5e7eb' }}
            >
              <img src={department.avatar_image} alt={department.title} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="min-w-0">
            <div className="text-[11px] font-semibold text-gray-700 truncate">{department.title}</div>
            <div className="text-[9px] text-gray-400">with sidekick</div>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <span className="text-[9px] text-gray-400">Online</span>
          </div>
        </div>
      </div>

      {/* Chat body */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2.5" style={{ maxHeight: '340px' }}>
        {/* Sidekick welcome */}
        <div className="flex gap-2">
          <img src={sidekickLogo} alt="Sidekick" className="w-5 h-5 rounded-full flex-shrink-0 mt-0.5" />
          <div className="bg-white rounded-xl rounded-tl-sm px-2.5 py-1.5 text-[10px] text-gray-600 border border-gray-100 shadow-sm">
            Hey {teamMembers[0]?.name || 'there'}! What would you like to work on?
          </div>
        </div>

        {/* JTBD suggestion buttons */}
        {jtbdItems.length > 0 && (
          <div className="flex flex-wrap gap-1 pl-7">
            {jtbdItems.slice(0, 4).map((item) => {
              const isActive = item.id === selectedJTBD;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectJTBD?.(item.id)}
                  className={`px-2 py-1 rounded-lg text-[9px] border transition-all ${
                    isActive
                      ? 'bg-[#6161ff]/10 border-[#6161ff]/30 text-[#6161ff] font-medium'
                      : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'
                  }`}
                >
                  {item.title}
                </button>
              );
            })}
          </div>
        )}

        {/* Active JTBD response */}
        {selectedJTBD && (() => {
          const active = jtbdItems.find((j) => j.id === selectedJTBD);
          if (!active) return null;
          const promptText = JTBD_PROMPTS[active.title] || DEFAULT_PROMPT;
          return (
            <>
              {/* User message */}
              <div className="flex justify-end">
                <div className="bg-[#6161ff] text-white rounded-xl rounded-tr-sm px-2.5 py-1.5 text-[10px] max-w-[85%]">
                  {promptText}
                </div>
              </div>
              {/* Sidekick reply */}
              <div className="flex gap-2">
                <img src={sidekickLogo} alt="Sidekick" className="w-5 h-5 rounded-full flex-shrink-0 mt-0.5" />
                <div className="bg-white rounded-xl rounded-tl-sm px-2.5 py-1.5 text-[10px] text-gray-600 border border-gray-100 shadow-sm">
                  On it! Setting up agents for <span className="font-medium text-[#6161ff]">{active.title}</span> now.
                </div>
              </div>
            </>
          );
        })()}
      </div>

      {/* Input area */}
      <div className="px-3 py-2 border-t border-gray-100 bg-white/60">
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white border border-gray-200">
          <img src={sidekickLogo} alt="Sidekick" className="w-3.5 h-3.5 object-contain flex-shrink-0" />
          <span className="text-[9px] text-gray-400 flex-1">Type a message...</span>
          <Send className="w-3 h-3 text-gray-300" />
        </div>
      </div>
    </div>
  );
}

// ─── Workspace Intro Component ──────────────────────────────────

const INTRO_RING_COLORS = ['ring-pink-400', 'ring-cyan-400', 'ring-purple-400', 'ring-teal-400', 'ring-amber-400'];
const INTRO_BG_COLORS = ['#fce7f3', '#cffafe', '#ede9fe', '#ccfbf1', '#fef3c7'];

function IntroAvatar({ image, name, ringClass, size = 'lg', delay = 0, label }: { image?: string | null; name: string; ringClass: string; size?: 'lg' | 'md'; delay?: number; label?: string }) {
  const dim = size === 'lg' ? 'w-20 h-20 md:w-24 md:h-24' : 'w-16 h-16 md:w-20 md:h-20';
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="flex flex-col items-center gap-2"
    >
      <div className={`${dim} rounded-full overflow-hidden ring-[3px] ${ringClass} shadow-lg flex-shrink-0`}>
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#6161ff] to-purple-400 flex items-center justify-center">
            <Bot className="w-7 h-7 text-white" />
          </div>
        )}
      </div>
      <span className="text-xs font-semibold text-gray-800 text-center max-w-[100px] truncate">{name}</span>
      {label && <span className="text-[10px] text-gray-400 -mt-1">{label}</span>}
    </motion.div>
  );
}

function WorkspaceIntro({
  department,
  agents,
  onStart,
  introStyle = 'unified',
  allDepartments = [],
  transitioning = false,
}: {
  department: DepartmentRow;
  agents: any[];
  onStart: () => void;
  introStyle?: 'unified' | 'with_plus';
  allDepartments?: DepartmentRow[];
  transitioning?: boolean;
}) {
  const deptName = department.title || 'Your';
  const displayAgents = agents.slice(0, 5);

  // Shorten agent names to compact "X Agent" format
  const shortAgentName = (name: string) => {
    const cleaned = name.replace(/\s*(agent|ai)\s*/gi, '').trim();
    const firstWord = cleaned.split(' ')[0];
    return firstWord ? `${firstWord} Agent` : name;
  };

  // Render a label as two stacked lines (split at first space)
  const twoLineLabel = (text: string, color: string) => {
    const words = text.trim().split(' ');
    const line1 = words[0] || '';
    const line2 = words.slice(1).join(' ') || '';
    return (
      <span className={`text-[11px] md:text-xs font-medium text-center leading-tight ${color}`}>
        {line1}<br />{line2}
      </span>
    );
  };

  // Team roles from TEAM_MEMBERS for this department
  const teamRoles = TEAM_MEMBERS[department.name] || [];

  // Use other departments' avatars as team member images, labeled with current dept roles
  const teamAvatars = allDepartments
    .filter((d) => d.id !== department.id && d.avatar_image)
    .slice(0, Math.min(2, teamRoles.length))
    .map((d, i) => ({
      id: d.id,
      image: d.avatar_image,
      color: d.avatar_color || '#e5e7eb',
      role: teamRoles[i]?.role || d.title,
    }));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="flex flex-col items-center justify-center pt-0 pb-8 md:pb-12 px-4 overflow-hidden relative"
    >
      {/* White background layer — fades to transparent during transition */}
      {/* White background layer — fades to transparent during crossfade */}
      <motion.div
        className="absolute inset-0 bg-white z-0"
        animate={{ opacity: transitioning ? 0 : 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />

      {/* All content sits above the bg layer */}

      {/* ── Line 1: Label ── */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={transitioning ? { opacity: 0, y: -20 } : { opacity: 1, y: 0 }}
        transition={transitioning ? { duration: 0.25 } : { delay: 0.05, duration: 0.4 }}
        className="text-xs tracking-[0.2em] uppercase font-semibold text-[#6161ff]/70 mb-3 relative z-10"
      >
        AI Work Platform
      </motion.p>

      {/* ── Line 2: Headline ── */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={transitioning ? { opacity: 0, y: -20 } : { opacity: 1, y: 0 }}
        transition={transitioning ? { duration: 0.3, delay: 0.05 } : { delay: 0.12, duration: 0.4 }}
        className="text-2xl md:text-4xl font-bold text-gray-900 mb-2 text-center relative z-10"
      >
        Meet your new{' '}
        <span className="bg-gradient-to-r from-[#6161ff] via-[#b06ab3] to-[#ff6b6b] bg-clip-text text-transparent italic">
          {deptName.toLowerCase()}
        </span>
        {' '}squad
      </motion.h2>

      {/* ── Line 3: Subtitle ── */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={transitioning ? { opacity: 0, y: -20 } : { opacity: 1, y: 0 }}
        transition={transitioning ? { duration: 0.3, delay: 0.1 } : { delay: 0.2, duration: 0.4 }}
        className="text-sm text-gray-500 mb-12 text-center relative z-10"
      >
        Your team and AI agents, working as one
      </motion.p>

      {/* ── Avatar Row ── */}
      {introStyle === 'unified' ? (
        /* UNIFIED: overlapping squad — each avatar is a column with label below */
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.5 }}
          className="flex items-end justify-center -space-x-5 mb-12 relative z-10"
        >
          {/* Left: team member avatars — shrink + slide to upper-left (sidebar) on transition */}
          {teamAvatars.map((ta, i) => (
            <motion.div
              key={`team-${ta.id}`}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={transitioning
                ? { opacity: 0.3, x: '-30vw', y: -150, scale: 0.25 }
                : { opacity: 1, scale: 1, x: 0, y: 0 }
              }
              transition={transitioning
                ? { duration: 0.7, delay: i * 0.04, ease: [0.4, 0, 0.2, 1] }
                : { delay: 0.2 + i * 0.07, duration: 0.4, type: 'spring', stiffness: 180 }
              }
              className="flex flex-col items-center gap-1.5 relative"
              style={{ zIndex: teamAvatars.length - i + 5 }}
            >
              <div
                className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden ring-[3px] ring-white shadow-lg flex-shrink-0"
                style={{ backgroundColor: ta.color }}
              >
                <img src={ta.image} alt={ta.role} className="w-full h-full object-cover" />
              </div>
              {twoLineLabel(ta.role, 'text-gray-400')}
            </motion.div>
          ))}

          {/* Center: department avatar — shrink + slide to upper-left (sidebar) on transition */}
          {department.avatar_image && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={transitioning
                ? { opacity: 0.3, x: '-28vw', y: -130, scale: 0.2 }
                : { opacity: 1, scale: 1, x: 0, y: 0 }
              }
              transition={transitioning
                ? { duration: 0.7, delay: 0.06 + teamAvatars.length * 0.04, ease: [0.4, 0, 0.2, 1] }
                : { delay: 0.3 + teamAvatars.length * 0.07, duration: 0.5, type: 'spring', stiffness: 160 }
              }
              className="flex flex-col items-center gap-2 relative z-30 mx-1"
            >
              <div
                className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden ring-4 ring-[#6161ff]/60 shadow-2xl flex-shrink-0"
                style={{ backgroundColor: department.avatar_color || '#e5e7eb' }}
              >
                <img src={department.avatar_image} alt={department.title} className="w-full h-full object-cover" />
              </div>
              {twoLineLabel('Team Lead', 'text-[#6161ff] !font-bold')}
            </motion.div>
          )}

          {/* Right: AI agent avatars — shrink + slide to upper-left (same as team) on transition */}
          {displayAgents.map((agent: any, i: number) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={transitioning
                ? { opacity: 0.3, x: '-30vw', y: -150, scale: 0.25 }
                : { opacity: 1, scale: 1, x: 0, y: 0 }
              }
              transition={transitioning
                ? { duration: 0.7, delay: 0.08 + i * 0.04, ease: [0.4, 0, 0.2, 1] }
                : { delay: 0.4 + i * 0.07, duration: 0.4, type: 'spring', stiffness: 180 }
              }
              className="flex flex-col items-center gap-1.5 relative"
              style={{ zIndex: displayAgents.length - i, marginLeft: i === 0 ? '-12px' : undefined }}
            >
              <div
                className={`w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden ring-[3px] ${INTRO_RING_COLORS[i % INTRO_RING_COLORS.length]} shadow-lg flex-shrink-0`}
                style={{ backgroundColor: INTRO_BG_COLORS[i % INTRO_BG_COLORS.length] }}
              >
                {agent.image ? (
                  <img src={agent.image} alt={agent.name} className="w-full h-full object-cover scale-[1.15]" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#6161ff] to-purple-400 flex items-center justify-center">
                    <Bot className="w-7 h-7 text-white" />
                  </div>
                )}
              </div>
              {twoLineLabel(shortAgentName(agent.name), 'text-gray-500')}
            </motion.div>
          ))}
        </motion.div>
      ) : (
        /* WITH PLUS: team+dept group — + separator — agents group, each with labels */
        <div className="flex items-end justify-center gap-5 md:gap-7 mb-12 relative z-10">
          {/* Left group: team + dept — shrink + slide to upper-left on transition */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={transitioning
              ? { opacity: 0.3, x: '-30vw', y: -150, scale: 0.25 }
              : { opacity: 1, x: 0, y: 0, scale: 1 }
            }
            transition={transitioning
              ? { duration: 0.7, ease: [0.4, 0, 0.2, 1] }
              : { delay: 0.25, duration: 0.5 }
            }
            className="flex items-end -space-x-3"
          >
            {teamAvatars.map((ta, i) => (
              <motion.div
                key={`team-${ta.id}`}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.07, duration: 0.35, type: 'spring', stiffness: 200 }}
                className="flex flex-col items-center gap-1.5 relative"
                style={{ zIndex: teamAvatars.length - i + 5 }}
              >
                <div
                  className="w-[72px] h-[72px] md:w-20 md:h-20 rounded-full overflow-hidden ring-[3px] ring-white shadow-lg flex-shrink-0"
                  style={{ backgroundColor: ta.color }}
                >
                  <img src={ta.image} alt={ta.role} className="w-full h-full object-cover" />
                </div>
                {twoLineLabel(ta.role, 'text-gray-400')}
              </motion.div>
            ))}
            {department.avatar_image && (
              <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + teamAvatars.length * 0.07, duration: 0.4, type: 'spring', stiffness: 180 }}
                className="flex flex-col items-center gap-1.5 relative z-30 mx-1"
              >
                <div
                  className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden ring-4 ring-[#6161ff]/60 shadow-xl flex-shrink-0"
                  style={{ backgroundColor: department.avatar_color || '#e5e7eb' }}
                >
                  <img src={department.avatar_image} alt={department.title} className="w-full h-full object-cover" />
                </div>
                {twoLineLabel('Team Lead', 'text-[#6161ff] !font-bold')}
              </motion.div>
            )}
          </motion.div>

          {/* Plus separator — fade out on transition */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={transitioning
              ? { opacity: 0, scale: 0 }
              : { opacity: 1, scale: 1 }
            }
            transition={transitioning
              ? { duration: 0.2 }
              : { delay: 0.4, type: 'spring', stiffness: 300 }
            }
            className="flex items-center justify-center self-center mb-4"
          >
            <div className="w-12 h-12 rounded-full bg-[#6161ff]/10 border-2 border-[#6161ff]/20 flex items-center justify-center">
              <Plus className="w-6 h-6 text-[#6161ff]/60" />
            </div>
          </motion.div>

          {/* Right group: agents — shrink + slide to right on transition */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={transitioning
              ? { opacity: 0.3, x: '25vw', y: 50, scale: 0.25 }
              : { opacity: 1, x: 0, y: 0, scale: 1 }
            }
            transition={transitioning
              ? { duration: 0.7, ease: [0.4, 0, 0.2, 1] }
              : { delay: 0.45, duration: 0.5 }
            }
            className="flex items-end -space-x-3"
          >
            {displayAgents.map((agent: any, i: number) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.07, duration: 0.35, type: 'spring', stiffness: 200 }}
                className="flex flex-col items-center gap-1.5 relative"
                style={{ zIndex: displayAgents.length - i }}
              >
                <div
                  className={`w-[72px] h-[72px] md:w-20 md:h-20 rounded-full overflow-hidden ring-[3px] ${INTRO_RING_COLORS[i % INTRO_RING_COLORS.length]} shadow-lg flex-shrink-0`}
                  style={{ backgroundColor: INTRO_BG_COLORS[i % INTRO_BG_COLORS.length] }}
                >
                  {agent.image ? (
                    <img src={agent.image} alt={agent.name} className="w-full h-full object-cover scale-[1.15]" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#6161ff] to-purple-400 flex items-center justify-center">
                      <Bot className="w-7 h-7 text-white" />
                    </div>
                  )}
                </div>
                {twoLineLabel(shortAgentName(agent.name), 'text-gray-500')}
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}

      {/* ── CTA Button ── */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={transitioning ? { opacity: 0, y: -20 } : { opacity: 1, y: 0 }}
        transition={transitioning ? { duration: 0.25 } : { delay: 0.7, duration: 0.4 }}
        whileHover={transitioning ? {} : { scale: 1.04 }}
        whileTap={transitioning ? {} : { scale: 0.97 }}
        onClick={() => !transitioning && onStart()}
        className="px-8 py-3.5 bg-[#6161ff] hover:bg-[#5050dd] text-white font-semibold rounded-xl shadow-lg shadow-[#6161ff]/25 transition-colors text-sm flex items-center gap-2.5 relative z-10"
      >
        <Sparkles className="w-4 h-4" />
        Start working together
        <span className="ml-1">&rarr;</span>
      </motion.button>
    </motion.div>
  );
}

// ─── Animated Workspace Component ───────────────────────────────

function AnimatedWorkspace({
  department,
  activeJTBD,
  agents,
  vibeApps,
  allTools,
  toggleSlot,
  viewMode = 'work',
  sidekickPanelStyle = 'right_overlay',
  frameless = false,
  skipPromptPhase = false,
  staticMode = false,
  sidebarLeft = false,
  showInlineSidekick = false,
  allDepartments = [],
  jtbdItems = [],
  selectedJTBD = null,
  onSelectJTBD,
}: {
  department: DepartmentRow;
  activeJTBD: JTBDItem | null;
  agents: any[];
  vibeApps: any[];
  allTools: string[];
  toggleSlot?: React.ReactNode;
  viewMode?: ViewMode;
  sidekickPanelStyle?: string;
  frameless?: boolean;
  skipPromptPhase?: boolean;
  staticMode?: boolean;
  sidebarLeft?: boolean;
  showInlineSidekick?: boolean;
  allDepartments?: DepartmentRow[];
  jtbdItems?: JTBDItem[];
  selectedJTBD?: string | null;
  onSelectJTBD?: (id: string) => void;
}) {
  const timeline = useAnimationTimeline(activeJTBD?.id || null, activeJTBD?.title || null, skipPromptPhase);
  // In static mode, override phase to 'complete' so everything renders instantly
  const phase = staticMode && activeJTBD ? 'complete' as TimelinePhase : timeline.phase;
  const { notification, showComment, showHumanCursor, humanClicking } = staticMode
    ? { notification: null, showComment: false, showHumanCursor: false, humanClicking: false }
    : timeline;
  const boardRef = useRef<HTMLDivElement | null>(null);

  const promptText = activeJTBD ? (JTBD_PROMPTS[activeJTBD.title] || DEFAULT_PROMPT) : '';
  const isPromptPhase = skipPromptPhase ? false : HUMAN_PROMPT_PHASES.includes(phase);

  const activeAgent = activeJTBD
    ? agents.find((a) => a.name === activeJTBD.agentName) || agents[0]
    : null;

  const relatedTools = activeJTBD?.relatedTools.length
    ? activeJTBD.relatedTools
    : allTools.slice(0, 4);

  // Get workspace rows for the active JTBD
  const rows = activeJTBD
    ? WORKSPACE_CONTENT[activeJTBD.title] || DEFAULT_WORKSPACE_ROWS
    : [];

  // Determine which rows are visible/active based on explicit phase checks
  // (supports non-linear phase order for "Build event app" flow)
  const row1Visible = phase !== 'idle' && phase !== 'entering' && !HUMAN_PROMPT_PHASES.includes(phase);
  const row1Done = ['row1_done', 'row1_approving', 'row2_typing', 'row2_to_status', 'row2_clicking', 'row2_done', 'row2_approving',
    'row3_typing', 'row3_to_status', 'row3_clicking', 'complete'].includes(phase);
  const row1AgentOnStatus = ['row1_to_status', 'row1_clicking', 'row1_done'].includes(phase);
  const row2Visible = ['row2_typing', 'row2_to_status', 'row2_clicking', 'row2_done', 'row2_approving',
    'row3_typing', 'row3_to_status', 'row3_clicking', 'complete'].includes(phase);
  const row2Done = ['row2_done', 'row2_approving', 'row3_typing', 'row3_to_status', 'row3_clicking', 'complete'].includes(phase);
  const row2AgentOnStatus = ['row2_to_status', 'row2_clicking', 'row2_done'].includes(phase);
  const row3Visible = ['row3_typing', 'row3_to_status', 'row3_clicking', 'complete'].includes(phase);
  const allDone = phase === 'complete';
  const row3AgentOnStatus = ['row3_to_status', 'row3_clicking'].includes(phase);

  // Persistent approval state — once approved, badge stays visible
  const [row1Approved, setRow1Approved] = useState(false);
  const [row2Approved, setRow2Approved] = useState(false);
  useEffect(() => {
    if (phase === 'idle') { setRow1Approved(false); setRow2Approved(false); }
    if (phase === 'row1_approving') setRow1Approved(true);
    if (phase === 'row2_approving') setRow2Approved(true);
  }, [phase]);

  // Current notification message
  const notificationMessage = useMemo(() => {
    if (notification === 'notify1') return rows[0]?.notification || 'Task completed';
    if (notification === 'notify_app') return 'Event App is live!';
    if (notification === 'notify_summary') return `${rows.length} tasks completed`;
    return '';
  }, [notification, rows]);

  const content = (
    <>
      {/* Title bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex items-center gap-2 ml-3">
            <LayoutGrid className="w-4 h-4 text-gray-400" />
            <AnimatePresence mode="wait">
              <motion.span
                key={viewMode === 'context' ? 'context-title' : (activeJTBD?.id || 'default')}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="text-sm font-semibold text-gray-700"
              >
                {viewMode === 'context' ? 'Platform Context' : (activeJTBD ? activeJTBD.title : `${department.title} Workspace`)}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {toggleSlot && (
            <div className="mr-2">{toggleSlot}</div>
          )}
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Zap className="w-3.5 h-3.5" />
            AI-powered
          </div>
        </div>
      </div>

      {/* Notification toast */}
      <NotificationToast
        message={notificationMessage}
        show={!!notification}
      />

      {/* Workspace body */}
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[420px]">
        <AnimatePresence mode="wait">
          {viewMode === 'context' ? (
            /* ──────── CONTEXT MODE ──────── */
            <motion.div
              key="context-body"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="col-span-1 md:col-span-12 grid grid-cols-1 md:grid-cols-12"
            >
              {/* Context: Main area — context layer rows */}
              <div className={`col-span-1 md:col-span-9 p-4 md:p-5 ${sidebarLeft ? 'md:order-2' : ''}`}>
                {/* Column headers */}
                <div className="grid grid-cols-12 gap-2 text-[10px] uppercase tracking-wider text-gray-400 font-semibold px-3 pb-2">
                  <div className="col-span-5">Layer</div>
                  <div className="col-span-5">Details</div>
                  <div className="col-span-2">Status</div>
                </div>

                {/* Context rows */}
                <div className="space-y-1.5">
                  {CONTEXT_ROWS.map((row, i) => {
                    const Icon = row.icon;
                    return (
                      <motion.div
                        key={row.title}
                        initial={{ opacity: 0, y: 10, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.35, delay: i * 0.08 }}
                        className="grid grid-cols-12 gap-2 items-center pl-0 pr-3 py-3 rounded-xl border border-gray-100 bg-white hover:shadow-sm transition-all"
                        style={{ borderLeftWidth: 4, borderLeftColor: row.color }}
                      >
                        <div className="col-span-5 flex items-center gap-2.5 pl-3">
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: `${row.color}10` }}
                          >
                            <Icon className="w-3.5 h-3.5" style={{ color: row.color }} />
                          </div>
                          <span className="text-xs font-semibold text-gray-800">{row.title}</span>
                        </div>
                        <div className="col-span-5 text-[11px] text-gray-500 truncate">
                          {row.title === 'Integrations' ? (
                            <div className="flex items-center gap-1.5">
                              {(allTools.length > 0 ? allTools.slice(0, 4) : ['Slack', 'Salesforce', 'HubSpot', 'Jira']).map((tool) => {
                                const logo = getToolLogo(tool);
                                return logo ? (
                                  <img key={tool} src={logo} alt={tool} className="w-4 h-4 rounded-sm object-contain" />
                                ) : (
                                  <Plug key={tool} className="w-3.5 h-3.5 text-gray-300" />
                                );
                              })}
                              <span className="text-[10px] text-gray-400 ml-1">+{Math.max(0, (allTools.length || 200) - 4)} more</span>
                            </div>
                          ) : (
                            row.detail
                          )}
                        </div>
                        <div className="col-span-2">
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 + i * 0.08 }}
                            className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: `${row.color}10`, color: row.color }}
                          >
                            <CheckCircle2 className="w-3 h-3" /> Active
                          </motion.span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Context: sidebar — Open Ecosystem */}
              <div className={`hidden md:block col-span-3 p-3 bg-gray-50/20 ${sidebarLeft ? 'md:order-1 border-r border-gray-100' : 'border-l border-gray-100'}`}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-3">
                    <Puzzle className="w-3.5 h-3.5" />
                    <span>Open Ecosystem</span>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 mb-4">
                    {(allTools.length > 0 ? allTools : ['Slack', 'Salesforce', 'HubSpot', 'Jira', 'GitHub', 'Figma']).slice(0, 9).map((tool, i) => {
                      const logo = getToolLogo(tool);
                      return (
                        <motion.div
                          key={tool}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.25, delay: 0.3 + i * 0.04 }}
                          className="flex flex-col items-center gap-1 p-2 rounded-lg bg-white border border-gray-100"
                        >
                          {logo ? (
                            <img src={logo} alt={tool} className="w-5 h-5 object-contain" />
                          ) : (
                            <Plug className="w-4 h-4 text-gray-300" />
                          )}
                          <span className="text-[8px] text-gray-400 truncate w-full text-center">{tool}</span>
                        </motion.div>
                      );
                    })}
                  </div>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-[10px] text-gray-400 text-center"
                  >
                    200+ available
                  </motion.p>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            /* ──────── WORK MODE (existing) ──────── */
            <motion.div
              key="work-body"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="col-span-1 md:col-span-12 grid grid-cols-1 md:grid-cols-12 relative"
            >
              {/* Inline Sidekick Chat (inside workspace) */}
              {showInlineSidekick && (
                <div className="hidden md:flex md:col-span-3 flex-col border-r border-gray-100 bg-gray-50/30 md:order-first">
                  <InlineWorkspaceSidekick
                    department={department}
                    allDepartments={allDepartments}
                    jtbdItems={jtbdItems}
                    selectedJTBD={selectedJTBD}
                    onSelectJTBD={onSelectJTBD}
                  />
                </div>
              )}

              {/* Main board area */}
              <motion.div
                ref={boardRef}
                className={`col-span-1 ${showInlineSidekick ? 'md:col-span-6' : 'md:col-span-9'} p-4 md:p-5 relative ${sidebarLeft ? 'md:order-2' : ''}`}
                animate={{ opacity: isPromptPhase ? 0.35 : 1 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              >
                {phase === 'idle' ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12">
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-4"
                    >
                      <Sparkles className="w-7 h-7 text-gray-300" />
                    </motion.div>
                    <p className="text-sm text-gray-400 font-medium">Your workspace is ready</p>
                    <p className="text-xs text-gray-300 mt-1">Click a job to be done to activate it</p>
                  </div>
                ) : (
                  <AnimatePresence mode="wait">
                    {phase === 'app_added' && activeJTBD?.title === 'Build event app' ? (
                      <motion.div
                        key="app-preview"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <EventAppPreview />
                      </motion.div>
                    ) : (
                    <motion.div
                      key={activeJTBD?.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      {/* Column headers */}
                      <div className="grid grid-cols-12 gap-2 text-[10px] uppercase tracking-wider text-gray-400 font-semibold px-3 pb-2">
                        <div className="col-span-4">Task</div>
                        <div className="col-span-3">Agent</div>
                        <div className="col-span-2">Status</div>
                        <div className="col-span-1 flex items-center justify-center">
                          <Users className="w-3 h-3" />
                        </div>
                        <div className="col-span-2">Progress</div>
                      </div>

                      {/* ── Row 1 ── */}
                      <AnimatePresence>
                        {row1Visible && rows[0] && (
                          <motion.div
                            initial={{ opacity: 0, y: 12, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.35 }}
                            className={`grid grid-cols-12 gap-2 items-center pl-0 pr-3 py-3 rounded-xl mb-1.5 transition-all duration-500 border-l-4 ${
                              row1Done
                                ? phase === 'row1_approving'
                                  ? 'border border-emerald-200 bg-emerald-50/40 border-l-emerald-500 ring-1 ring-emerald-200/50'
                                  : 'border border-green-100 bg-green-50/30 border-l-green-400'
                                : (phase === 'row1_typing' || row1AgentOnStatus)
                                  ? 'border border-[#6161ff]/20 bg-[#6161ff]/[0.03] border-l-[#6161ff]'
                                  : 'border border-gray-100 bg-white border-l-transparent'
                            }`}
                          >
                            <div data-cursor-target="row1-task" className="col-span-4 text-xs font-medium text-gray-800 truncate pl-3">
                              {!row1Done ? (
                                <TypingText text={rows[0].task} durationMs={2000} className="text-xs font-medium text-gray-800" />
                              ) : (
                                rows[0].task
                              )}
                            </div>
                            <div className="col-span-3 flex items-center gap-1.5">
                              {activeAgent?.image ? (
                                <motion.img
                                  src={activeAgent.image}
                                  alt=""
                                  className="w-5 h-5 rounded-full object-cover"
                                  animate={(phase === 'row1_typing' || row1AgentOnStatus) ? { boxShadow: ['0 0 0 0px rgba(97,97,255,0.4)', '0 0 0 4px rgba(97,97,255,0.15)', '0 0 0 0px rgba(97,97,255,0.4)'] } : { boxShadow: '0 0 0 0px rgba(97,97,255,0)' }}
                                  transition={{ duration: 1.5, repeat: (phase === 'row1_typing' || row1AgentOnStatus) ? Infinity : 0 }}
                                />
                              ) : (
                                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#6161ff] to-purple-400 flex items-center justify-center">
                                  <Bot className="w-3 h-3 text-white" />
                                </div>
                              )}
                              <span className="text-[11px] text-gray-600 truncate">{'RSVP Agent'}</span>
                            </div>
                            <div data-cursor-target="row1-status" className="col-span-2 relative">
                              {row1Done ? (
                                <motion.span
                                  initial={{ opacity: 0, scale: 0.7 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                                  className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-50 text-green-700"
                                >
                                  <CheckCircle2 className="w-3 h-3" /> Done
                                </motion.span>
                              ) : (
                                <>
                                  <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 ${phase === 'row1_clicking' ? 'ring-2 ring-[#6161ff]/40' : ''}`}>
                                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                                      <Sparkles className="w-3 h-3" />
                                    </motion.div>
                                    Working
                                  </span>
                                  <StatusDropdown show={phase === 'row1_clicking'} />
                                </>
                              )}
                            </div>
                            {/* Review cell */}
                            <div data-cursor-target="row1-review" className="col-span-1 flex items-center justify-center">
                              {row1Done && !row1Approved && (
                                <div className="w-4 h-4 rounded-full border border-dashed border-gray-300" />
                              )}
                              <AnimatePresence>
                                {row1Approved && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                                    className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                            <div className="col-span-2">
                              <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                                <motion.div
                                  className="h-full rounded-full"
                                  style={{ backgroundColor: row1Done ? '#22c55e' : (department.avatar_color || '#6161ff') }}
                                  initial={{ width: '0%' }}
                                  animate={{ width: row1Done ? '100%' : row1AgentOnStatus ? '88%' : '55%' }}
                                  transition={{ duration: row1Done ? 0.4 : 2, ease: 'easeOut' }}
                                />
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* ── Row 2 ── */}
                      <AnimatePresence>
                        {row2Visible && rows[1] && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35 }}
                            className={`grid grid-cols-12 gap-2 items-center pl-0 pr-3 py-2.5 rounded-lg mb-1.5 transition-all duration-500 border-l-4 ${
                              row2Done
                                ? phase === 'row2_approving'
                                  ? 'border border-emerald-200 bg-emerald-50/40 border-l-emerald-500 ring-1 ring-emerald-200/50'
                                  : 'border border-green-100 bg-green-50/20 border-l-green-400'
                                : (phase === 'row2_typing' || row2AgentOnStatus)
                                  ? 'border border-[#6161ff]/10 bg-[#6161ff]/[0.02] border-l-[#6161ff]'
                                  : 'border border-gray-100 bg-white border-l-transparent'
                            }`}
                          >
                            <div data-cursor-target="row2-task" className="col-span-4 text-xs text-gray-700 truncate pl-3">
                              {!row2Done ? (
                                <TypingText text={rows[1].task} durationMs={1800} className="text-xs text-gray-700" />
                              ) : (
                                rows[1].task
                              )}
                            </div>
                            <div className="col-span-3 flex items-center gap-1.5">
                              {activeAgent?.image ? (
                                <motion.img
                                  src={activeAgent.image}
                                  alt=""
                                  className="w-5 h-5 rounded-full object-cover"
                                  animate={(phase === 'row2_typing' || row2AgentOnStatus) ? { boxShadow: ['0 0 0 0px rgba(97,97,255,0.4)', '0 0 0 4px rgba(97,97,255,0.15)', '0 0 0 0px rgba(97,97,255,0.4)'] } : { boxShadow: '0 0 0 0px rgba(97,97,255,0)' }}
                                  transition={{ duration: 1.5, repeat: (phase === 'row2_typing' || row2AgentOnStatus) ? Infinity : 0 }}
                                />
                              ) : (
                                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#6161ff] to-purple-400 flex items-center justify-center">
                                  <Bot className="w-3 h-3 text-white" />
                                </div>
                              )}
                              <span className="text-[11px] text-gray-500 truncate">{'RSVP Agent'}</span>
                            </div>
                            <div data-cursor-target="row2-status" className="col-span-2 relative">
                              {row2Done ? (
                                <motion.span initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                                  className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-50 text-green-700">
                                  <CheckCircle2 className="w-3 h-3" /> Done
                                </motion.span>
                              ) : (
                                <>
                                  <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 ${phase === 'row2_clicking' ? 'ring-2 ring-[#6161ff]/40' : ''}`}>
                                    <Clock className="w-3 h-3" /> Working
                                  </span>
                                  <StatusDropdown show={phase === 'row2_clicking'} />
                                </>
                              )}
                            </div>
                            {/* Review cell */}
                            <div data-cursor-target="row2-review" className="col-span-1 flex items-center justify-center">
                              {row2Done && !row2Approved && (
                                <div className="w-4 h-4 rounded-full border border-dashed border-gray-300" />
                              )}
                              <AnimatePresence>
                                {row2Approved && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                                    className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                            <div className="col-span-2">
                              <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                                <motion.div
                                  className="h-full rounded-full"
                                  style={{ backgroundColor: row2Done ? '#22c55e' : '#f59e0b' }}
                                  initial={{ width: '0%' }}
                                  animate={{ width: row2Done ? '100%' : row2AgentOnStatus ? '85%' : '35%' }}
                                  transition={{ duration: row2Done ? 0.4 : 1.5, ease: 'easeOut' }}
                                />
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* ── Row 3 ── */}
                      <AnimatePresence>
                        {row3Visible && rows[2] && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35 }}
                            className={`grid grid-cols-12 gap-2 items-center pl-0 pr-3 py-2.5 rounded-lg mb-1.5 transition-all duration-500 border-l-4 ${
                              allDone
                                ? 'border border-green-100 bg-green-50/20 border-l-green-400'
                                : (phase === 'row3_typing' || row3AgentOnStatus)
                                  ? 'border border-gray-100 bg-white border-l-[#6161ff]'
                                  : 'border border-gray-100 bg-white border-l-transparent'
                            }`}
                          >
                            <div data-cursor-target="row3-task" className="col-span-4 text-xs text-gray-600 truncate pl-3">
                              {!allDone ? (
                                <TypingText text={rows[2].task} durationMs={1500} className="text-xs text-gray-600" />
                              ) : (
                                rows[2].task
                              )}
                            </div>
                            <div className="col-span-3 flex items-center gap-1.5">
                              {activeAgent?.image ? (
                                <motion.img
                                  src={activeAgent.image}
                                  alt=""
                                  className="w-5 h-5 rounded-full object-cover"
                                  animate={(phase === 'row3_typing' || row3AgentOnStatus) ? { boxShadow: ['0 0 0 0px rgba(97,97,255,0.4)', '0 0 0 4px rgba(97,97,255,0.15)', '0 0 0 0px rgba(97,97,255,0.4)'] } : { boxShadow: '0 0 0 0px rgba(97,97,255,0)' }}
                                  transition={{ duration: 1.5, repeat: (phase === 'row3_typing' || row3AgentOnStatus) ? Infinity : 0 }}
                                />
                              ) : (
                                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#6161ff] to-purple-400 flex items-center justify-center">
                                  <Bot className="w-3 h-3 text-white" />
                                </div>
                              )}
                              <span className="text-[11px] text-gray-500 truncate">{'RSVP Agent'}</span>
                            </div>
                            <div data-cursor-target="row3-status" className="col-span-2 relative">
                              {allDone ? (
                                <motion.span initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                                  className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-50 text-green-700">
                                  <CheckCircle2 className="w-3 h-3" /> Done
                                </motion.span>
                              ) : (
                                <>
                                  <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${
                                    phase === 'row3_clicking' ? 'bg-blue-50 text-blue-600 ring-2 ring-[#6161ff]/40' :
                                    (phase === 'row3_typing' || row3AgentOnStatus) ? 'bg-blue-50 text-blue-600' :
                                    'bg-gray-50 text-gray-400'
                                  }`}>
                                    <Clock className="w-3 h-3" /> {(phase === 'row3_typing' || row3AgentOnStatus) ? 'Working' : 'Queued'}
                                  </span>
                                  <StatusDropdown show={phase === 'row3_clicking'} />
                                </>
                              )}
                            </div>
                            {/* Review cell — empty for row 3 (no approval) */}
                            <div className="col-span-1" />
                            <div className="col-span-2">
                              <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                                <motion.div
                                  className="h-full rounded-full"
                                  style={{ backgroundColor: allDone ? '#22c55e' : row3AgentOnStatus ? '#6161ff' : '#e5e7eb' }}
                                  initial={{ width: '0%' }}
                                  animate={{ width: allDone ? '100%' : row3AgentOnStatus ? '82%' : '10%' }}
                                  transition={{ duration: allDone ? 0.4 : 1.2, ease: 'easeOut' }}
                                />
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Skeleton placeholder rows when building */}
                      {!row3Visible && (
                        <div className="space-y-1.5 mt-1">
                          {Array.from({ length: row2Visible ? 1 : 2 }).map((_, i) => (
                            <motion.div
                              key={`skel-${i}`}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 0.5 }}
                              transition={{ duration: 0.3, delay: i * 0.1 }}
                              className="grid grid-cols-12 gap-2 items-center px-3 py-2.5 rounded-lg border border-dashed border-gray-100"
                            >
                              <div className="col-span-5 h-3 bg-gray-100 rounded w-3/4 animate-pulse" />
                              <div className="col-span-3 h-3 bg-gray-100 rounded w-1/2 animate-pulse" />
                              <div className="col-span-2 h-3 bg-gray-100 rounded w-2/3 animate-pulse" />
                              <div className="col-span-2 h-3 bg-gray-100 rounded animate-pulse" />
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                    )}
                  </AnimatePresence>
                )}

                {/* ── Agent cursor (absolute inside board) ── */}
                <FloatingAgentCursor
                  agentName="RSVP Agent"
                  agentImage={activeAgent?.image}
                  phase={phase}
                  boardRef={boardRef}
                />

                {/* ── Human approval cursor (appears after agent marks rows Done) ── */}
                {(() => {
                  const members = TEAM_MEMBERS[department.name] || [];
                  const member = members[0];
                  const approvalAvatar = department.avatar_image || member?.image || '';
                  const approvalName = member?.name || department.title;
                  return approvalAvatar ? (
                    <FloatingApprovalCursor
                      memberName={approvalName}
                      memberImage={approvalAvatar}
                      phase={phase}
                      boardRef={boardRef}
                      cursorColor={department.avatar_color || '#6161ff'}
                    />
                  ) : null;
                })()}
              </motion.div>

              {/* Sidebar - Agents & Apps */}
              <div className={`hidden md:block col-span-3 p-3 bg-gray-50/20 relative ${sidebarLeft ? 'md:order-1 border-r border-gray-100' : 'border-l border-gray-100'}`}>
                <AnimatePresence>
                  {phase !== 'idle' ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4, delay: 0.5 }}
                      className="flex flex-col h-full"
                    >
                      {/* Top content */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-2">
                          <span>Active Agents</span>
                          <div className="flex items-center gap-0.5 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
                            <img src={agentsLogo} alt="Agents" className="w-3.5 h-3.5 object-contain" />
                            <Plus className="w-3 h-3" />
                          </div>
                        </div>
                        <div className="space-y-1.5 mb-4">
                          {agents.slice(0, 3).map((agent, i) => (
                            <motion.div
                              key={agent.id}
                              initial={{ opacity: 0, x: 16 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: 0.6 + i * 0.1 }}
                              className="flex items-center gap-2 p-1.5 rounded-lg bg-white border border-gray-100"
                            >
                              {agent.image ? (
                                <div className="w-12 h-12 rounded-lg ring-1 ring-gray-200 overflow-hidden flex-shrink-0">
                                  <img src={agent.image} alt={agent.name} className="w-full h-full object-cover scale-110" />
                                </div>
                              ) : (
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#6161ff] to-purple-400 flex items-center justify-center flex-shrink-0">
                                  <Bot className="w-5 h-5 text-white" />
                                </div>
                              )}
                              <div className="min-w-0">
                                <p className="text-[10px] font-semibold text-gray-700 truncate">{agent.name.replace(/\s+Manager\b/i, '').replace(/\s+Research\b/i, '').trim()}</p>
                                <div className="flex items-center gap-1">
                                  <motion.div
                                    className="w-1.5 h-1.5 rounded-full bg-green-500"
                                    animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                  />
                                  <span className="text-[9px] text-green-600 font-medium">Active</span>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-2">
                          <span>Vibe Apps</span>
                          <div className="flex items-center gap-0.5 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
                            <img src={vibeLogo} alt="Vibe" className="w-3.5 h-3.5 object-contain" />
                            <Plus className="w-3 h-3" />
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-1.5 mb-4">
                          {vibeApps.slice(0, 5).map((app, i) => {
                            const { icon: IconComponent } = getAppIcon(app.name);
                            return (
                              <motion.div
                                key={app.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.25, delay: 0.8 + i * 0.04 }}
                                className="flex flex-col items-center gap-1 p-2 rounded-lg bg-white border border-gray-100"
                              >
                                <IconComponent className="w-5 h-5 text-gray-400" />
                                <span className="text-[8px] text-gray-400 truncate w-full text-center">{app.name}</span>
                              </motion.div>
                            );
                          })}
                          {/* Build your own / Event App tile */}
                          <AnimatePresence mode="wait">
                            {(phase === 'app_added' || phase === 'complete') && activeJTBD?.title === 'Build event app' ? (
                              <motion.div
                                key="event-app-tile"
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: [0, 1.15, 1], opacity: 1 }}
                                transition={{ duration: 0.5, type: 'spring', stiffness: 300, damping: 15 }}
                                className="flex flex-col items-center gap-1 p-2 rounded-lg bg-gradient-to-br from-[#6161ff]/5 to-purple-50 border border-[#6161ff]/30 ring-2 ring-[#6161ff]/20"
                              >
                                <Calendar className="w-5 h-5 text-[#6161ff]" />
                                <span className="text-[8px] text-[#6161ff] font-semibold truncate w-full text-center">Event App</span>
                              </motion.div>
                            ) : (
                              <motion.div
                                key="build-your-own"
                                data-cursor-target="build-your-own"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{
                                  opacity: 1,
                                  scale: (phase === 'app_building' || phase === 'app_panel_open') ? 1.05 : 1,
                                }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.25, delay: 0.8 + 5 * 0.04 }}
                                className={`flex flex-col items-center gap-1 p-2 rounded-lg bg-white border border-dashed cursor-pointer transition-all ${
                                  (phase === 'app_building' || phase === 'app_panel_open')
                                    ? 'border-[#6161ff] ring-2 ring-[#6161ff]/30 shadow-md shadow-[#6161ff]/10'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <Plus className={`w-5 h-5 ${(phase === 'app_building' || phase === 'app_panel_open') ? 'text-[#6161ff]' : 'text-gray-300'}`} />
                                <span className={`text-[8px] truncate w-full text-center ${(phase === 'app_building' || phase === 'app_panel_open') ? 'text-[#6161ff] font-semibold' : 'text-gray-400'}`}>Build your own</span>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* Ask Sidekick input — pinned to bottom */}
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 1.2 }}
                        className="mt-auto pt-3 border-t border-gray-100"
                      >
                        <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-white border border-gray-200 hover:border-gray-300 transition-all duration-300 cursor-pointer">
                          <img src={sidekickLogo} alt="Sidekick" className="w-4 h-4 object-contain flex-shrink-0" />
                          <span className="text-[10px] text-gray-400 flex-1">Ask Sidekick...</span>
                          <Send className="w-3 h-3 text-gray-300" />
                        </div>
                      </motion.div>

                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center h-full text-center py-12"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center mb-2">
                        <Bot className="w-4 h-4 text-gray-300" />
                      </div>
                      <p className="text-[10px] text-gray-300">Agents ready</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Human cursor — moves to "Ask Sidekick..." and clicks it */}
                {(() => {
                  const members = TEAM_MEMBERS[department.name] || [];
                  const member = members[0];
                  const cursorAvatar = department.avatar_image || member?.image || '';
                  const cursorName = member?.name || department.title;
                  return cursorAvatar ? (
                    <>
                      <FloatingHumanCursor
                        memberName={cursorName}
                        memberImage={cursorAvatar}
                        showCursor={showHumanCursor}
                        isClicking={humanClicking}
                      />
                      <HumanPromptSidebar
                        show={showComment}
                        memberName={cursorName}
                        memberImage={cursorAvatar}
                        commentText={rows[0]?.humanComment || ''}
                      />
                    </>
                  ) : null;
                })()}

                {/* App Builder Panel — slides in when building event app */}
                <AppBuilderPanel
                  show={activeJTBD?.title === 'Build event app' && ['app_panel_open', 'app_preview'].includes(phase)}
                  buildComplete={phase === 'app_preview'}
                />

              </div>

              {/* Sidekick Chat Panel — opens at the start of every JTBD (positioned relative to full board) */}
              {(() => {
                const members = TEAM_MEMBERS[department.name] || [];
                const member = members[0];
                // Use department avatar (colorful character) if available, fall back to team member photo
                const chatAvatar = department.avatar_image || member?.image || '';
                const chatName = department.avatar_image ? department.title : (member?.name || department.title);
                return chatAvatar ? (
                  <SidekickChatPanel
                    show={isPromptPhase}
                    phase={phase}
                    memberName={chatName}
                    memberImage={chatAvatar}
                    avatarColor={department.avatar_color || undefined}
                    promptText={promptText}
                    mode={sidekickPanelStyle}
                    sidebarLeft={sidebarLeft}
                  />
                ) : null;
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );

  if (frameless) return content;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-xl shadow-gray-100/50 overflow-hidden relative">
      {content}
    </div>
  );
}

// ─── Platform Showcase Section ───────────────────────────────────

function ShowcaseCardHeader({ department }: { department: DepartmentRow }) {
  return (
    <div className="text-center py-8 px-6 border-b border-gray-100 bg-gradient-to-b from-gray-50/80 to-white">
      {/* Avatar with glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="flex justify-center mb-5"
      >
        <div className="relative">
          <div
            className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-white shadow-md"
            style={{ backgroundColor: department.avatar_color || '#e5e7eb' }}
          >
            {department.avatar_image ? (
              <img src={department.avatar_image} alt={department.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                {department.title.charAt(0)}
              </div>
            )}
          </div>
          {/* Subtle glow ring */}
          <div
            className="absolute inset-0 rounded-full opacity-20 blur-lg -z-10 scale-125"
            style={{ backgroundColor: department.avatar_color || '#6161ff' }}
          />
        </div>
      </motion.div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <h2 className="text-xl md:text-2xl mb-1.5" style={{ lineHeight: '1.3', letterSpacing: '-0.01em' }}>
          <span className="text-gray-800 font-normal block">Your AI Work Platform</span>
          <span className="bg-gradient-to-r from-[#6161ff] to-[#8b5cf6] bg-clip-text text-transparent font-bold block">
            for {department.title}
          </span>
        </h2>
        {department.description && (
          <p className="text-sm text-gray-500 max-w-lg mx-auto mt-1">{department.description}</p>
        )}
      </motion.div>
    </div>
  );
}

export type ShowcaseDepartmentBarMode = 'none' | 'horizontal' | 'vertical_sidebar' | 'both';

export type ShowcaseVariant = 'classic' | 'sandbox';

function LivingWorkspaceWrapper({
  department,
  hideHeader,
}: {
  department: DepartmentRow;
  allDepartments: DepartmentRow[];
  hideHeader?: boolean;
}) {
  const showcaseJTBDs = useMemo(() => getShowcaseJTBDs(department.name), [department.name]);
  return <LivingWorkspaceShowcase department={department} showcaseJTBDs={showcaseJTBDs} hideHeader={hideHeader} />;
}

export function PlatformShowcaseSection({
  departments,
  loading,
  selectedDeptId,
  onSelectDepartment,
  contextToggle = false,
  sidekickPanelStyle = 'right_overlay',
  sidebarLeft = false,
  showJtbdSidebar = true,
  showInlineSidekick = false,
  showDepartmentBar = 'horizontal',
  variant = 'classic',
}: {
  departments: DepartmentRow[];
  loading: boolean;
  selectedDeptId: string | null;
  onSelectDepartment: (id: string) => void;
  contextToggle?: boolean;
  sidekickPanelStyle?: string;
  sidebarLeft?: boolean;
  showJtbdSidebar?: boolean;
  showInlineSidekick?: boolean;
  showDepartmentBar?: ShowcaseDepartmentBarMode;
  variant?: ShowcaseVariant;
}) {
  const selectedDept = departments.find((d) => d.id === selectedDeptId) || null;

  const showHorizontal = showDepartmentBar === 'horizontal' || showDepartmentBar === 'both';
  const showVertical = showDepartmentBar === 'vertical_sidebar' || showDepartmentBar === 'both';

  const ShowcaseContent = variant === 'sandbox' ? LivingWorkspaceWrapper : PlatformShowcaseContent;

  return (
    <section className="pt-16 md:pt-24 pb-8 md:pb-16 bg-white">
      {/* Horizontal DepartmentBar (above content) */}
      {showHorizontal && (
        <DepartmentBar
          departments={departments}
          loading={loading}
          selectedDeptId={selectedDeptId}
          onSelectDepartment={onSelectDepartment}
        />
      )}

      <div className={`max-w-5xl mx-auto px-4 md:px-8 ${showHorizontal ? 'mt-8' : ''}`}>
        {selectedDept ? (
          <div className={showVertical ? 'flex gap-4 items-start' : ''}>
            {/* Vertical DepartmentSidebar (left) */}
            {showVertical && (
              <div className="hidden lg:block flex-shrink-0" style={{ width: '72px' }}>
                <DepartmentSidebar
                  departments={departments}
                  loading={loading}
                  selectedDeptId={selectedDeptId}
                  onSelectDepartment={onSelectDepartment}
                />
              </div>
            )}

            {/* Showcase content */}
            <div className="flex-1 min-w-0">
              <ShowcaseContent
                department={selectedDept}
                allDepartments={departments}
                hideHeader={showVertical}
              />
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-400 text-sm">
            Select a department above to explore its showcase
          </p>
        )}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   JTBD-First Showcase Content
   ═══════════════════════════════════════════════════════════════════ */

export interface ShowcaseJTBD {
  id: string;
  title: string;
  tagline: string;
  icon: LucideIcon;
  agents: { description: string; valueAccent: string };
  vibe: { description: string; replacesTools: string[]; valueAccent: string };
  mondayDB: { description: string; valueAccent: string };
  context: { description: string; valueAccent: string };
}

const SHOWCASE_JTBD_DATA: Record<string, ShowcaseJTBD[]> = {
  marketing: [
    {
      id: 'launch-campaign', title: 'Launch Campaign', tagline: 'Automate your campaign lifecycle', icon: Megaphone,
      agents: { description: 'Campaign Agent handles targeting, scheduling & A/B testing automatically', valueAccent: 'Save ~4 hours per campaign' },
      vibe: { description: 'Build a custom Campaign Manager app tailored to your workflow', replacesTools: ['Mailchimp', 'HubSpot'], valueAccent: 'No-code, fully yours' },
      mondayDB: { description: 'All campaign data — leads, performance metrics, creative assets — enterprise secured & governed', valueAccent: 'Enterprise-grade security' },
      context: { description: 'Knows your past campaigns, audience segments & integrations — so every recommendation is precise', valueAccent: 'AI that learns your work' },
    },
    {
      id: 'research-market', title: 'Research Market', tagline: 'Understand your competitive landscape', icon: Globe,
      agents: { description: 'Research Agent scans competitors, collects market data & generates insights automatically', valueAccent: 'Always up to date' },
      vibe: { description: 'Build a competitive intelligence dashboard that updates in real time', replacesTools: ['Crayon', 'Klue'], valueAccent: 'Custom views, your data' },
      mondayDB: { description: 'Market research, competitor profiles & trend data — all stored securely with full audit trail', valueAccent: 'Governed & auditable' },
      context: { description: 'Connects your CRM data, industry feeds & internal boards to surface the insights that matter', valueAccent: 'Cross-source intelligence' },
    },
    {
      id: 'build-event-app', title: 'Build Event App', tagline: 'Create custom event experiences', icon: Calendar,
      agents: { description: 'Event Agent manages RSVPs, sends reminders & tracks attendance without manual effort', valueAccent: 'Zero manual follow-ups' },
      vibe: { description: 'Build a branded event registration & check-in app in minutes', replacesTools: ['Eventbrite', 'Splash'], valueAccent: 'Fully branded, no code' },
      mondayDB: { description: 'Attendee data, sessions, feedback — all in one secure place with role-based access', valueAccent: 'Privacy-first by design' },
      context: { description: 'Pulls from your contact lists, past events & preferences to personalize every interaction', valueAccent: 'Personalized at scale' },
    },
    {
      id: 'create-content', title: 'Create Content', tagline: 'Produce content at scale', icon: PenTool,
      agents: { description: 'Content Agent drafts copy, suggests headlines & adapts tone across channels', valueAccent: '10x content output' },
      vibe: { description: 'Build a content calendar & approval workflow app your team will actually use', replacesTools: ['CoSchedule', 'Notion'], valueAccent: 'One place for all content' },
      mondayDB: { description: 'All drafts, assets, approvals & published content — versioned, searchable & permission-controlled', valueAccent: 'Never lose a version' },
      context: { description: 'Understands your brand voice, past performance & audience preferences for on-brand suggestions', valueAccent: 'Always on-brand' },
    },
    {
      id: 'analyze-performance', title: 'Analyze Performance', tagline: 'Measure what matters', icon: BarChart3,
      agents: { description: 'Analytics Agent collects metrics, identifies trends & flags anomalies across all campaigns', valueAccent: 'Proactive insights' },
      vibe: { description: 'Build custom dashboards that combine data from all your marketing channels', replacesTools: ['Tableau', 'Looker'], valueAccent: 'Real-time, custom views' },
      mondayDB: { description: 'Historical performance data, attribution models & benchmarks — enterprise secured with governance', valueAccent: 'Single source of truth' },
      context: { description: 'Correlates campaign data with sales outcomes, budgets & team activity for full-picture insights', valueAccent: 'Connected intelligence' },
    },
  ],
  sales: [
    {
      id: 'qualify-leads', title: 'Qualify Leads', tagline: 'Focus on the right prospects', icon: Users,
      agents: { description: 'Lead Agent scores, enriches & routes leads to the right rep automatically', valueAccent: 'Never miss a hot lead' },
      vibe: { description: 'Build a custom lead scoring & routing app tailored to your sales process', replacesTools: ['Clearbit', 'ZoomInfo'], valueAccent: 'Your rules, your app' },
      mondayDB: { description: 'All lead data, interactions & scores — secured with role-based access for your team', valueAccent: 'Compliant & controlled' },
      context: { description: 'Connects CRM history, email threads & meeting notes to give reps the full picture before every call', valueAccent: 'Full prospect context' },
    },
    {
      id: 'close-deals', title: 'Close Deals', tagline: 'Accelerate your pipeline', icon: Zap,
      agents: { description: 'Deal Agent tracks progress, suggests next steps & alerts you when deals stall', valueAccent: 'Faster close rates' },
      vibe: { description: 'Build a deal room app with proposals, contracts & real-time collaboration', replacesTools: ['DocuSign', 'PandaDoc'], valueAccent: 'One place to close' },
      mondayDB: { description: 'Pipeline data, deal history & forecasts — enterprise secured with full audit trail', valueAccent: 'Auditable pipeline' },
      context: { description: 'Understands deal patterns, buyer behavior & past wins to recommend winning strategies', valueAccent: 'Data-driven selling' },
    },
    {
      id: 'manage-accounts', title: 'Manage Accounts', tagline: 'Grow existing relationships', icon: Globe,
      agents: { description: 'Account Agent monitors health signals, flags churn risks & suggests upsell opportunities', valueAccent: 'Proactive retention' },
      vibe: { description: 'Build a customer success hub with health scores, renewal tracking & engagement tools', replacesTools: ['Gainsight', 'ChurnZero'], valueAccent: 'Custom success workflows' },
      mondayDB: { description: 'Complete account history, contracts & engagement data — permission-controlled by team', valueAccent: 'Full relationship view' },
      context: { description: 'Connects support tickets, usage data & billing to surface what each account really needs', valueAccent: '360° account intelligence' },
    },
    {
      id: 'forecast-revenue', title: 'Forecast Revenue', tagline: 'Predict with confidence', icon: BarChart3,
      agents: { description: 'Forecast Agent analyzes pipeline, rep activity & historical data to generate accurate projections', valueAccent: 'Reliable forecasts' },
      vibe: { description: 'Build a forecasting dashboard with custom models and scenario planning', replacesTools: ['Clari', 'Gong'], valueAccent: 'Your models, live data' },
      mondayDB: { description: 'Revenue data, quota tracking & historical benchmarks — governed, versioned & enterprise-grade', valueAccent: 'Trusted numbers' },
      context: { description: 'Correlates pipeline changes with market signals, team capacity & seasonal trends', valueAccent: 'Contextual predictions' },
    },
    {
      id: 'onboard-reps', title: 'Onboard Reps', tagline: 'Ramp new hires faster', icon: Users,
      agents: { description: 'Onboarding Agent guides new reps through playbooks, assigns training & tracks progress', valueAccent: '50% faster ramp' },
      vibe: { description: 'Build a rep onboarding portal with resources, quizzes & milestone tracking', replacesTools: ['Lessonly', 'Seismic'], valueAccent: 'Structured & measurable' },
      mondayDB: { description: 'Training materials, performance benchmarks & certification data — securely managed', valueAccent: 'Organized knowledge' },
      context: { description: 'Recommends relevant playbooks based on territory, product line & learning pace', valueAccent: 'Personalized learning' },
    },
  ],
  operations: [
    {
      id: 'automate-workflows', title: 'Automate Workflows', tagline: 'Eliminate repetitive tasks', icon: Workflow,
      agents: { description: 'Workflow Agent identifies bottlenecks, automates handoffs & optimizes processes', valueAccent: '70% less manual work' },
      vibe: { description: 'Build custom workflow automation apps without a single line of code', replacesTools: ['Zapier', 'Make'], valueAccent: 'No-code automation' },
      mondayDB: { description: 'Process data, SLAs & audit logs — enterprise secured with full compliance', valueAccent: 'Fully auditable' },
      context: { description: 'Understands your team structure, tool stack & process dependencies for smarter automation', valueAccent: 'Context-aware routing' },
    },
    {
      id: 'manage-resources', title: 'Manage Resources', tagline: 'Optimize team capacity', icon: Users,
      agents: { description: 'Resource Agent balances workloads, flags overallocation & suggests optimal assignments', valueAccent: 'Balanced workloads' },
      vibe: { description: 'Build a resource planning app with capacity views and skill matching', replacesTools: ['Resource Guru', 'Float'], valueAccent: 'Visual capacity planning' },
      mondayDB: { description: 'Team capacity, skills matrix & allocation history — governed with role-based access', valueAccent: 'Single capacity view' },
      context: { description: 'Connects project timelines, team availability & skill sets to optimize every assignment', valueAccent: 'Smart matching' },
    },
    {
      id: 'track-okrs', title: 'Track OKRs', tagline: 'Align goals across teams', icon: BarChart3,
      agents: { description: 'OKR Agent monitors progress, sends check-in reminders & surfaces blockers automatically', valueAccent: 'Always on track' },
      vibe: { description: 'Build an OKR tracking app with cascade views and progress dashboards', replacesTools: ['Lattice', 'Ally'], valueAccent: 'Custom goal tracking' },
      mondayDB: { description: 'Objectives, key results & progress data — secured with organizational hierarchy permissions', valueAccent: 'Aligned & governed' },
      context: { description: 'Links OKRs to actual project work, team output & department metrics for real progress visibility', valueAccent: 'Goals meet reality' },
    },
    {
      id: 'vendor-management', title: 'Manage Vendors', tagline: 'Streamline procurement', icon: Link2,
      agents: { description: 'Vendor Agent tracks contracts, manages renewals & flags compliance issues', valueAccent: 'Never miss a renewal' },
      vibe: { description: 'Build a vendor portal with contract tracking, approvals & performance scoring', replacesTools: ['Coupa', 'SAP Ariba'], valueAccent: 'Tailored procurement' },
      mondayDB: { description: 'Vendor contracts, SLAs, invoices & compliance docs — enterprise secured & governed', valueAccent: 'Compliance-ready' },
      context: { description: 'Connects spend data, performance metrics & contract terms to surface optimization opportunities', valueAccent: 'Smarter vendor decisions' },
    },
    {
      id: 'incident-response', title: 'Incident Response', tagline: 'Resolve issues faster', icon: Shield,
      agents: { description: 'Incident Agent detects anomalies, triggers escalation workflows & coordinates response', valueAccent: '60% faster resolution' },
      vibe: { description: 'Build an incident command center with real-time status and post-mortem tracking', replacesTools: ['PagerDuty', 'OpsGenie'], valueAccent: 'Custom runbooks' },
      mondayDB: { description: 'Incident logs, resolution data & post-mortem reports — audit-ready with full history', valueAccent: 'Full incident history' },
      context: { description: 'Correlates system metrics, recent changes & team on-call schedules for rapid root-cause analysis', valueAccent: 'Root cause in minutes' },
    },
  ],
  support: [
    {
      id: 'resolve-tickets', title: 'Resolve Tickets', tagline: 'Fast, accurate responses', icon: MessageSquare,
      agents: { description: 'Support Agent triages tickets, suggests solutions & auto-resolves common issues', valueAccent: '40% auto-resolution' },
      vibe: { description: 'Build a custom help desk with smart routing and SLA tracking', replacesTools: ['Zendesk', 'Freshdesk'], valueAccent: 'Your perfect help desk' },
      mondayDB: { description: 'Ticket history, customer data & resolution patterns — enterprise secured', valueAccent: 'Complete ticket history' },
      context: { description: 'Connects customer history, product usage & past interactions for personalized support', valueAccent: 'Know every customer' },
    },
    {
      id: 'build-knowledge-base', title: 'Build Knowledge Base', tagline: 'Self-service at scale', icon: FileText,
      agents: { description: 'KB Agent generates articles from resolved tickets, keeps docs updated & identifies gaps', valueAccent: 'Always current docs' },
      vibe: { description: 'Build a branded self-service portal with search, categories & feedback', replacesTools: ['Confluence', 'Notion'], valueAccent: 'Branded & searchable' },
      mondayDB: { description: 'All articles, FAQs & guides — versioned, searchable & permission-controlled', valueAccent: 'Organized knowledge' },
      context: { description: 'Analyzes ticket trends to recommend which articles to create or update next', valueAccent: 'Proactive documentation' },
    },
    {
      id: 'monitor-satisfaction', title: 'Monitor Satisfaction', tagline: 'Track customer happiness', icon: BarChart3,
      agents: { description: 'CSAT Agent collects feedback, identifies trends & alerts you to satisfaction drops', valueAccent: 'Early warning system' },
      vibe: { description: 'Build a customer satisfaction dashboard with NPS, CSAT & sentiment analysis', replacesTools: ['Delighted', 'SurveyMonkey'], valueAccent: 'Real-time sentiment' },
      mondayDB: { description: 'Survey data, feedback history & satisfaction trends — enterprise secured with governance', valueAccent: 'Trusted CSAT data' },
      context: { description: 'Connects satisfaction scores with ticket volume, response times & product changes', valueAccent: 'Root cause visibility' },
    },
    {
      id: 'manage-escalations', title: 'Manage Escalations', tagline: 'Handle critical issues', icon: Shield,
      agents: { description: 'Escalation Agent prioritizes by impact, notifies stakeholders & tracks resolution SLAs', valueAccent: 'SLA compliance' },
      vibe: { description: 'Build an escalation workflow app with priority routing and executive dashboards', replacesTools: ['StatusPage', 'PagerDuty'], valueAccent: 'Custom escalation paths' },
      mondayDB: { description: 'Escalation history, SLA data & resolution metrics — fully auditable', valueAccent: 'Audit-ready records' },
      context: { description: 'Understands customer tier, contract terms & issue history to escalate intelligently', valueAccent: 'Smart prioritization' },
    },
    {
      id: 'onboard-customers', title: 'Onboard Customers', tagline: 'Smooth first experience', icon: Users,
      agents: { description: 'Onboarding Agent guides new customers through setup, sends check-ins & tracks milestones', valueAccent: 'Faster time to value' },
      vibe: { description: 'Build a customer onboarding portal with progress tracking and resource library', replacesTools: ['WalkMe', 'Userpilot'], valueAccent: 'Branded onboarding' },
      mondayDB: { description: 'Onboarding progress, setup data & milestone tracking — secure & permission-controlled', valueAccent: 'Structured onboarding' },
      context: { description: 'Adapts onboarding flow based on plan type, team size & use case for personalized guidance', valueAccent: 'Tailored first steps' },
    },
  ],
  product: [
    {
      id: 'prioritize-roadmap', title: 'Prioritize Roadmap', tagline: 'Build what matters most', icon: MapPin,
      agents: { description: 'Roadmap Agent scores features by impact, effort & customer demand automatically', valueAccent: 'Data-driven priorities' },
      vibe: { description: 'Build a roadmap planning app with scoring frameworks and stakeholder views', replacesTools: ['Productboard', 'Aha!'], valueAccent: 'Your prioritization logic' },
      mondayDB: { description: 'Feature requests, scoring data & roadmap history — governed with team permissions', valueAccent: 'Single source of truth' },
      context: { description: 'Connects customer feedback, support tickets & usage data to inform every prioritization decision', valueAccent: 'Customer-driven roadmap' },
    },
    {
      id: 'manage-sprints', title: 'Manage Sprints', tagline: 'Ship faster, ship better', icon: Zap,
      agents: { description: 'Sprint Agent tracks velocity, flags blockers & optimizes task assignments across teams', valueAccent: 'Predictable delivery' },
      vibe: { description: 'Build a sprint management app with burndown charts and retro templates', replacesTools: ['Jira', 'Linear'], valueAccent: 'Agile, your way' },
      mondayDB: { description: 'Sprint data, velocity metrics & backlog items — enterprise secured with dev team access controls', valueAccent: 'Engineering metrics' },
      context: { description: 'Understands team capacity, code changes & dependency chains for realistic sprint planning', valueAccent: 'Realistic commitments' },
    },
    {
      id: 'collect-feedback', title: 'Collect Feedback', tagline: 'Hear your customers', icon: MessageSquare,
      agents: { description: 'Feedback Agent aggregates input from multiple channels, tags themes & surfaces top requests', valueAccent: 'Unified voice of customer' },
      vibe: { description: 'Build a feedback portal where customers vote, comment & track feature status', replacesTools: ['Canny', 'UserVoice'], valueAccent: 'Public-facing portal' },
      mondayDB: { description: 'All feedback, votes & themes — structured, searchable & permission-controlled', valueAccent: 'Organized insights' },
      context: { description: 'Links feedback to account value, usage patterns & support tickets for weighted prioritization', valueAccent: 'Weighted by impact' },
    },
    {
      id: 'launch-features', title: 'Launch Features', tagline: 'Coordinate releases', icon: Megaphone,
      agents: { description: 'Launch Agent coordinates releases across teams, generates changelogs & notifies stakeholders', valueAccent: 'Smooth releases' },
      vibe: { description: 'Build a release coordination app with checklists, timelines & stakeholder signoff', replacesTools: ['LaunchDarkly', 'Notion'], valueAccent: 'Custom launch process' },
      mondayDB: { description: 'Release history, feature flags & rollout data — auditable with full version control', valueAccent: 'Traceable releases' },
      context: { description: 'Connects code repos, QA status & marketing readiness for go/no-go decisions you can trust', valueAccent: 'Full release context' },
    },
    {
      id: 'track-metrics', title: 'Track Metrics', tagline: 'Measure product impact', icon: BarChart3,
      agents: { description: 'Metrics Agent monitors KPIs, detects anomalies & generates weekly product health reports', valueAccent: 'Proactive monitoring' },
      vibe: { description: 'Build a product analytics dashboard combining usage, retention & business metrics', replacesTools: ['Amplitude', 'Mixpanel'], valueAccent: 'All metrics, one view' },
      mondayDB: { description: 'Product metrics, experiments & cohort data — enterprise secured with analytics governance', valueAccent: 'Trusted analytics' },
      context: { description: 'Correlates feature releases with metric changes, user segments & A/B test results', valueAccent: 'Release impact clarity' },
    },
  ],
  legal: [
    {
      id: 'review-contracts', title: 'Review Contracts', tagline: 'Faster contract cycles', icon: FileText,
      agents: { description: 'Contract Agent reviews terms, flags risks & suggests standard clause alternatives', valueAccent: '3x faster reviews' },
      vibe: { description: 'Build a contract management app with templates, redlining & approval workflows', replacesTools: ['Ironclad', 'DocuSign CLM'], valueAccent: 'Custom legal workflows' },
      mondayDB: { description: 'All contracts, amendments & clause libraries — enterprise secured with legal-grade compliance', valueAccent: 'Compliance-ready' },
      context: { description: 'Understands your standard terms, past negotiations & risk thresholds for consistent reviews', valueAccent: 'Consistent standards' },
    },
    {
      id: 'manage-compliance', title: 'Manage Compliance', tagline: 'Stay ahead of regulations', icon: Shield,
      agents: { description: 'Compliance Agent monitors regulatory changes, maps impact & assigns remediation tasks', valueAccent: 'Never miss a regulation' },
      vibe: { description: 'Build a compliance tracker with policy mapping, audit trails & certification management', replacesTools: ['Vanta', 'Drata'], valueAccent: 'Your compliance framework' },
      mondayDB: { description: 'Policies, audit records & certification data — enterprise secured with immutable audit trail', valueAccent: 'Audit-proof records' },
      context: { description: 'Connects regulatory requirements with your actual processes, data flows & vendor agreements', valueAccent: 'Gap analysis on demand' },
    },
    {
      id: 'handle-ip', title: 'Protect IP', tagline: 'Manage intellectual property', icon: Shield,
      agents: { description: 'IP Agent tracks filings, monitors deadlines & flags potential infringement issues', valueAccent: 'Protected portfolio' },
      vibe: { description: 'Build an IP portfolio app with filing tracker, renewal alerts & status dashboards', replacesTools: ['Anaqua', 'CPA Global'], valueAccent: 'IP at a glance' },
      mondayDB: { description: 'Patents, trademarks, filings & legal documents — secured with strict access controls', valueAccent: 'Confidential & secure' },
      context: { description: 'Links IP assets with product roadmap, competitive filings & market activity for strategic decisions', valueAccent: 'Strategic IP intelligence' },
    },
    {
      id: 'legal-requests', title: 'Legal Requests', tagline: 'Streamline intake', icon: MessageSquare,
      agents: { description: 'Intake Agent routes requests by type, assigns priority & tracks SLAs automatically', valueAccent: 'Organized legal queue' },
      vibe: { description: 'Build a legal intake portal with request forms, priority tiers & status tracking', replacesTools: ['Jira Service Desk', 'ServiceNow'], valueAccent: 'Self-service legal' },
      mondayDB: { description: 'Request history, response times & workload data — governed with department permissions', valueAccent: 'Transparent workload' },
      context: { description: 'Understands request patterns, team capacity & business urgency for optimal routing', valueAccent: 'Smart triage' },
    },
    {
      id: 'due-diligence', title: 'Due Diligence', tagline: 'Thorough & efficient', icon: Database,
      agents: { description: 'DD Agent assembles data rooms, checks documents & flags missing items automatically', valueAccent: '50% faster DD cycles' },
      vibe: { description: 'Build a due diligence data room with checklists, document staging & reviewer access', replacesTools: ['Intralinks', 'Datasite'], valueAccent: 'Custom data rooms' },
      mondayDB: { description: 'All DD documents, checklists & review notes — enterprise secured with granular access', valueAccent: 'Bank-grade security' },
      context: { description: 'Connects financial data, legal docs & corporate records to ensure nothing is missed', valueAccent: 'Comprehensive coverage' },
    },
  ],
  finance: [
    {
      id: 'budget-planning', title: 'Plan Budgets', tagline: 'Forecast with precision', icon: BarChart3,
      agents: { description: 'Budget Agent builds forecasts from historical data, flags variances & suggests adjustments', valueAccent: 'Accurate forecasts' },
      vibe: { description: 'Build a budget planning app with department rollups and scenario modeling', replacesTools: ['Adaptive Insights', 'Anaplan'], valueAccent: 'Custom budget models' },
      mondayDB: { description: 'Budget data, actuals & forecasts — enterprise secured with CFO-level governance', valueAccent: 'Financial-grade security' },
      context: { description: 'Connects actuals, department requests & market conditions for realistic budget planning', valueAccent: 'Grounded in reality' },
    },
    {
      id: 'process-invoices', title: 'Process Invoices', tagline: 'Automate AP workflows', icon: FileText,
      agents: { description: 'AP Agent extracts invoice data, matches POs & routes approvals automatically', valueAccent: '80% touchless processing' },
      vibe: { description: 'Build an invoice processing app with OCR, matching rules & approval chains', replacesTools: ['Bill.com', 'Tipalti'], valueAccent: 'Custom AP workflows' },
      mondayDB: { description: 'Invoice records, payment history & vendor data — fully auditable with SOX compliance', valueAccent: 'SOX-ready records' },
      context: { description: 'Matches invoices against contracts, budgets & past payments to catch errors before they happen', valueAccent: 'Proactive error detection' },
    },
    {
      id: 'close-books', title: 'Close Books', tagline: 'Faster month-end close', icon: Calendar,
      agents: { description: 'Close Agent manages the close checklist, reconciles accounts & flags exceptions', valueAccent: 'Days off your close' },
      vibe: { description: 'Build a month-end close app with task sequencing, sign-offs & reconciliation tracking', replacesTools: ['FloQast', 'BlackLine'], valueAccent: 'Your close process' },
      mondayDB: { description: 'GL data, reconciliations & close documentation — immutable audit trail', valueAccent: 'Audit-ready always' },
      context: { description: 'Connects sub-ledgers, bank feeds & intercompany data for automated reconciliation', valueAccent: 'Automated matching' },
    },
    {
      id: 'expense-management', title: 'Manage Expenses', tagline: 'Control spend efficiently', icon: Shield,
      agents: { description: 'Expense Agent reviews submissions, enforces policies & flags outliers automatically', valueAccent: 'Policy-compliant spend' },
      vibe: { description: 'Build an expense management app with receipt capture, approval flows & reporting', replacesTools: ['Expensify', 'SAP Concur'], valueAccent: 'Tailored expense policies' },
      mondayDB: { description: 'Expense records, receipts & policy data — enterprise secured with approval audit trails', valueAccent: 'Complete spend visibility' },
      context: { description: 'Understands department budgets, travel policies & historical patterns to flag unusual spend', valueAccent: 'Smart anomaly detection' },
    },
    {
      id: 'financial-reporting', title: 'Build Reports', tagline: 'Real-time financial insights', icon: BarChart3,
      agents: { description: 'Reporting Agent generates financial reports, variance analysis & board-ready presentations', valueAccent: 'Board-ready in minutes' },
      vibe: { description: 'Build a financial reporting hub combining P&L, cash flow & custom KPI dashboards', replacesTools: ['Tableau', 'Power BI'], valueAccent: 'Live financial views' },
      mondayDB: { description: 'Financial statements, KPIs & historical benchmarks — governed with executive access controls', valueAccent: 'Trusted financials' },
      context: { description: 'Connects ERP data, bank feeds & departmental metrics for real-time financial visibility', valueAccent: 'Cross-system insights' },
    },
  ],
  hr: [
    {
      id: 'recruit-talent', title: 'Recruit Talent', tagline: 'Hire the right people faster', icon: Users,
      agents: { description: 'Recruiting Agent screens resumes, schedules interviews & sends personalized follow-ups', valueAccent: '60% less time to hire' },
      vibe: { description: 'Build an ATS app with pipeline stages, interview scorecards & offer management', replacesTools: ['Greenhouse', 'Lever'], valueAccent: 'Your hiring process' },
      mondayDB: { description: 'Candidate data, interview feedback & hiring metrics — enterprise secured with GDPR compliance', valueAccent: 'GDPR-compliant hiring' },
      context: { description: 'Connects role requirements, team gaps & past hiring data for smarter candidate matching', valueAccent: 'Better-fit candidates' },
    },
    {
      id: 'onboard-employees', title: 'Onboard Employees', tagline: 'Great first day experience', icon: Zap,
      agents: { description: 'Onboarding Agent assigns tasks, provisions tools & sends welcome sequences automatically', valueAccent: 'Automated day-one setup' },
      vibe: { description: 'Build a new hire portal with checklists, introductions & training modules', replacesTools: ['BambooHR', 'Rippling'], valueAccent: 'Branded onboarding' },
      mondayDB: { description: 'Employee records, onboarding progress & compliance docs — secured with HR-grade permissions', valueAccent: 'Compliant & organized' },
      context: { description: 'Adapts onboarding based on role, department, location & seniority for personalized experiences', valueAccent: 'Personalized journeys' },
    },
    {
      id: 'run-reviews', title: 'Run Reviews', tagline: 'Meaningful performance cycles', icon: BarChart3,
      agents: { description: 'Review Agent collects peer feedback, generates summaries & tracks calibration progress', valueAccent: 'Objective reviews' },
      vibe: { description: 'Build a performance review app with 360 feedback, goal tracking & calibration tools', replacesTools: ['Lattice', '15Five'], valueAccent: 'Your review framework' },
      mondayDB: { description: 'Review data, feedback history & calibration records — confidential with strict access controls', valueAccent: 'Confidential by design' },
      context: { description: 'Connects project contributions, peer feedback & goal progress for data-backed reviews', valueAccent: 'Evidence-based reviews' },
    },
    {
      id: 'manage-benefits', title: 'Manage Benefits', tagline: 'Simplify benefits admin', icon: Shield,
      agents: { description: 'Benefits Agent answers employee questions, processes enrollments & flags important deadlines', valueAccent: 'Self-service benefits' },
      vibe: { description: 'Build a benefits enrollment portal with plan comparisons and life event workflows', replacesTools: ['Gusto', 'Namely'], valueAccent: 'Clear benefits experience' },
      mondayDB: { description: 'Benefits elections, plan data & employee records — enterprise secured with PII protection', valueAccent: 'PII-protected' },
      context: { description: 'Understands employee demographics, plan usage & life events for proactive benefits guidance', valueAccent: 'Personalized recommendations' },
    },
    {
      id: 'track-engagement', title: 'Track Engagement', tagline: 'Build a great culture', icon: MessageSquare,
      agents: { description: 'Engagement Agent runs pulse surveys, analyzes sentiment & recommends action items', valueAccent: 'Real-time pulse' },
      vibe: { description: 'Build an employee engagement hub with surveys, recognition & team insights', replacesTools: ['Culture Amp', 'Officevibe'], valueAccent: 'Your engagement toolkit' },
      mondayDB: { description: 'Survey data, sentiment trends & engagement metrics — anonymized & enterprise secured', valueAccent: 'Anonymous & trusted' },
      context: { description: 'Correlates engagement data with turnover, performance & team changes for actionable insights', valueAccent: 'Prevent attrition' },
    },
  ],
};

// Fallback: generate generic JTBDs for departments without hardcoded data
export function getShowcaseJTBDs(deptName: string): ShowcaseJTBD[] {
  return SHOWCASE_JTBD_DATA[deptName] || SHOWCASE_JTBD_DATA['marketing'] || [];
}

/* ─── Animated Counter Hook ─── */
function useAnimatedCounter(target: number, duration = 1.2) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let frame: number;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplay(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);
  return display;
}

/* ─── Demo Agent Pool ─── */
const DEMO_AGENT_POOL = [
  { id: 'demo-1', name: 'Research Agent', description: 'Scans data & generates insights', color: 'from-violet-400 to-purple-500', icon: Brain },
  { id: 'demo-2', name: 'Writing Agent', description: 'Drafts copy & content automatically', color: 'from-pink-400 to-rose-500', icon: PenTool },
  { id: 'demo-3', name: 'Analytics Agent', description: 'Tracks metrics & spots trends', color: 'from-cyan-400 to-blue-500', icon: BarChart3 },
  { id: 'demo-4', name: 'Outreach Agent', description: 'Manages outbound communications', color: 'from-amber-400 to-orange-500', icon: Send },
  { id: 'demo-5', name: 'Scheduler Agent', description: 'Optimizes timing & calendars', color: 'from-emerald-400 to-green-500', icon: Calendar },
];

/* ─── Demo App Types ─── */
const DEMO_APP_TYPES = [
  { id: 'demo-dashboard', name: 'Dashboard', icon: BarChart3, bg: 'bg-violet-50', fg: 'text-violet-500' },
  { id: 'demo-tracker', name: 'Tracker', icon: Activity, bg: 'bg-emerald-50', fg: 'text-emerald-500' },
  { id: 'demo-form', name: 'Form', icon: FileText, bg: 'bg-blue-50', fg: 'text-blue-500' },
  { id: 'demo-report', name: 'Report', icon: TrendingUp, bg: 'bg-amber-50', fg: 'text-amber-500' },
];

/* ─── Demo Integration Pool ─── */
const DEMO_INTEGRATIONS = [
  { id: 'int-slack', name: 'Slack', color: '#4A154B' },
  { id: 'int-drive', name: 'Google Drive', color: '#0F9D58' },
  { id: 'int-jira', name: 'Jira', color: '#0052CC' },
  { id: 'int-salesforce', name: 'Salesforce', color: '#00A1E0' },
  { id: 'int-notion', name: 'Notion', color: '#000000' },
];

/* ─── mondayDB Badge Tooltips ─── */
const DB_BADGE_TOOLTIPS: Record<string, string> = {
  Secure: 'SOC2, HIPAA, GDPR compliant. Data encrypted at rest and in transit.',
  Governed: 'Fine-grained permissions, audit trails, and role-based access control.',
  Enterprise: 'Built for scale: 99.99% uptime SLA, global CDN, dedicated infrastructure.',
};

/* ─── Capability Card Wrapper (grounded, unified) ─── */
function CapabilityCard({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, type: 'spring', stiffness: 280, damping: 26 }}
      className="group/card relative rounded-xl border border-gray-200/80 bg-white p-5 transition-all duration-300 hover:border-[#6161ff]/20 hover:shadow-md hover:shadow-[#6161ff]/[0.04]"
    >
      {/* Subtle left accent stripe */}
      <div className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full bg-gradient-to-b from-[#6161ff]/30 via-[#6161ff]/15 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
      <div className="relative">{children}</div>
    </motion.div>
  );
}

/* ─── Card Icon Container (clean, unified brand color) ─── */
function CardIcon({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-10 h-10 rounded-xl bg-[#6161ff]/8 flex items-center justify-center flex-shrink-0">
      {children}
    </div>
  );
}

/* ─── Value Badge (animated pop-in, unified brand color) ─── */
function ValueBadge({
  label,
  delay = 0,
}: {
  label: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: delay + 0.3, duration: 0.4, type: 'spring', stiffness: 400, damping: 20 }}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#6161ff]/5 border border-[#6161ff]/10"
    >
      <Sparkles className="w-3 h-3 text-[#6161ff]" />
      <span className="text-[10px] font-semibold text-[#6161ff]">{label}</span>
    </motion.div>
  );
}

/* ─── Flow Connector (subtle line between cards) ─── */
function FlowConnector() {
  return (
    <div className="flex justify-center py-0.5">
      <div className="w-[1px] h-3 bg-gradient-to-b from-gray-200 to-transparent" />
    </div>
  );
}

function PlatformShowcaseContent({
  department,
  allDepartments,
  hideHeader,
}: {
  department: DepartmentRow;
  allDepartments: DepartmentRow[];
  hideHeader?: boolean;
}) {
  const { agents, vibeApps, loading } = useDepartmentData(department.id);
  const showcaseJTBDs = useMemo(() => getShowcaseJTBDs(department.name), [department.name]);
  const [selectedIdx, setSelectedIdx] = useState(0);

  // ─── Interactive Demo State ───
  const [demoAgents, setDemoAgents] = useState<typeof DEMO_AGENT_POOL>([]);
  const [demoApps, setDemoApps] = useState<typeof DEMO_APP_TYPES>([]);
  const [demoIntegrations, setDemoIntegrations] = useState<typeof DEMO_INTEGRATIONS>([]);
  const [showAppPicker, setShowAppPicker] = useState(false);
  const [showIntPicker, setShowIntPicker] = useState(false);
  const [agentToast, setAgentToast] = useState<string | null>(null);
  const [intToast, setIntToast] = useState<string | null>(null);
  const [hoveredBadge, setHoveredBadge] = useState<string | null>(null);

  // Reset selection and demo state when department changes
  useEffect(() => {
    setSelectedIdx(0);
    setDemoAgents([]);
    setDemoApps([]);
    setDemoIntegrations([]);
    setShowAppPicker(false);
    setShowIntPicker(false);
  }, [department.id]);

  // Reset demo state when JTBD changes
  useEffect(() => {
    setDemoAgents([]);
    setDemoApps([]);
    setDemoIntegrations([]);
    setShowAppPicker(false);
    setShowIntPicker(false);
  }, [selectedIdx]);

  const selectedJob = showcaseJTBDs[selectedIdx] || showcaseJTBDs[0];

  // ─── Interactive Handlers ───
  const addDemoAgent = useCallback(() => {
    const available = DEMO_AGENT_POOL.filter((a) => !demoAgents.find((d) => d.id === a.id));
    if (available.length === 0) return;
    const next = available[0];
    setDemoAgents((prev) => [...prev, next]);
    setAgentToast(next.name + ' added!');
    setTimeout(() => setAgentToast(null), 2000);
  }, [demoAgents]);

  const removeDemoAgent = useCallback((id: string) => {
    setDemoAgents((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const addDemoApp = useCallback((app: typeof DEMO_APP_TYPES[number]) => {
    if (demoApps.find((a) => a.id === app.id)) return;
    setDemoApps((prev) => [...prev, app]);
    setShowAppPicker(false);
  }, [demoApps]);

  const addDemoIntegration = useCallback((integ: typeof DEMO_INTEGRATIONS[number]) => {
    if (demoIntegrations.find((i) => i.id === integ.id)) return;
    setDemoIntegrations((prev) => [...prev, integ]);
    setIntToast(integ.name + ' connected!');
    setShowIntPicker(false);
    setTimeout(() => setIntToast(null), 2000);
  }, [demoIntegrations]);

  // Animated counters for footer
  const jobCount = useAnimatedCounter(showcaseJTBDs.length, 0.8);
  const agentCount = useAnimatedCounter(agents.length + demoAgents.length, 0.8);
  const appCount = useAnimatedCounter(vibeApps.length + demoApps.length, 0.8);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        >
          <Loader2 className="w-6 h-6 text-[#6161ff]" />
        </motion.div>
      </div>
    );
  }

  if (!selectedJob) return null;

  // Collect tool logos for Context card
  const allTools = vibeApps
    .flatMap((app) => app.replaces_tools || [])
    .filter((tool, i, arr) => arr.indexOf(tool) === i)
    .slice(0, 5);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-lg shadow-gray-100/40 overflow-hidden">
        {!hideHeader && <ShowcaseCardHeader department={department} />}

        {/* ─── JTBD Grid ─── */}
        <div className="px-5 pt-5 pb-4">
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4"
          >
            What would you like to accomplish?
          </motion.p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {showcaseJTBDs.map((job, idx) => {
              const isActive = idx === selectedIdx;
              const IconComp = job.icon;
              return (
                <motion.button
                  key={job.id}
                  initial={{ opacity: 0, y: 16, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    delay: 0.05 * idx,
                    duration: 0.4,
                    type: 'spring',
                    stiffness: 300,
                    damping: 22,
                  }}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setSelectedIdx(idx)}
                  className={`
                    relative flex flex-col items-center gap-1.5 px-2.5 py-3 rounded-xl border transition-all duration-300 cursor-pointer text-center
                    ${isActive
                      ? 'border-[#6161ff]/30 bg-gradient-to-br from-[#6161ff]/8 to-[#6161ff]/3 shadow-md shadow-[#6161ff]/15'
                      : 'border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50/80 hover:shadow-sm'
                    }
                  `}
                >
                  {/* Active indicator glow */}
                  {isActive && (
                    <motion.div
                      layoutId="jtbd-glow"
                      className="absolute inset-0 rounded-xl"
                      style={{ boxShadow: '0 0 20px rgba(97,97,255,0.12)' }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <div className={`relative w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-300 ${isActive ? 'bg-[#6161ff]/12' : 'bg-gray-50'}`}>
                    <IconComp className={`w-4 h-4 transition-colors duration-300 ${isActive ? 'text-[#6161ff]' : 'text-gray-400'}`} />
                  </div>
                  <span className={`text-[10px] font-semibold leading-tight transition-colors duration-300 ${isActive ? 'text-[#6161ff]' : 'text-gray-700'}`}>
                    {job.title}
                  </span>
                  <span className="text-[8px] text-gray-400 leading-snug line-clamp-2">{job.tagline}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* ─── Job Detail View (4 capability cards) ─── */}
        <div className="px-5 pb-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedJob.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              {/* Title row */}
              <motion.div
                className="mb-4"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
              >
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  {selectedJob.title}
                  <motion.span
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring', stiffness: 400, damping: 15 }}
                    className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#6161ff]/10"
                  >
                    <Zap className="w-3 h-3 text-[#6161ff]" />
                  </motion.span>
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">How monday&apos;s AI platform makes it happen</p>
              </motion.div>

              {/* Row 1: Agents & Vibe side by side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-1">
                {/* ═══ Agents Card ═══ */}
                <CapabilityCard delay={0.05}>
                  <div className="flex items-center gap-3 mb-4">
                    <CardIcon>
                      <img src={agentsLogo} alt="Agents" className="w-6 h-6 object-contain" />
                    </CardIcon>
                    <span className="text-[15px] font-bold text-gray-900">Agents</span>
                    <span className="ml-auto text-[9px] font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                      AI-Powered
                    </span>
                  </div>
                  <p className="text-[12px] text-gray-600 leading-relaxed mb-3">{selectedJob.agents.description}</p>

                  {/* Agent mini-cards: real + demo + add */}
                  <div className="flex flex-col gap-2 mb-3">
                    {agents.slice(0, 3).map((agent, aIdx) => (
                      <motion.div
                        key={agent.id}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: aIdx * 0.08, duration: 0.3 }}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-gray-100 bg-gray-50/50 hover:border-[#6161ff]/20 transition-all"
                      >
                        {/* Avatar with active dot */}
                        <div className="relative flex-shrink-0">
                          {agent.image ? (
                            <img src={agent.image} alt={agent.name} className="w-10 h-10 rounded-full object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6161ff] to-purple-400 flex items-center justify-center">
                              <Bot className="w-5 h-5 text-white" />
                            </div>
                          )}
                          {agent.is_active && (
                            <motion.div
                              className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white"
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                            />
                          )}
                        </div>
                        {/* Name + description */}
                        <div className="min-w-0 flex-1">
                          <p className="text-[12px] font-semibold text-gray-800 truncate">{agent.name}</p>
                          <p className="text-[10px] text-gray-400 line-clamp-1">{agent.description || 'AI Assistant'}</p>
                        </div>
                      </motion.div>
                    ))}

                    {/* Demo agents */}
                    <AnimatePresence>
                      {demoAgents.map((demo) => {
                        const DemoIcon = demo.icon;
                        return (
                          <motion.div
                            key={demo.id}
                            initial={{ opacity: 0, scale: 0.95, x: -12 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95, x: -12 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-gray-100 bg-gray-50/50 hover:border-red-200 cursor-pointer group/demo transition-all"
                            onClick={() => removeDemoAgent(demo.id)}
                            title={`Remove ${demo.name}`}
                          >
                            <div className="relative flex-shrink-0">
                              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${demo.color} flex items-center justify-center`}>
                                <DemoIcon className="w-5 h-5 text-white group-hover/demo:hidden" />
                                <X className="w-5 h-5 text-white hidden group-hover/demo:block" />
                              </div>
                              <motion.div
                                className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-[12px] font-semibold text-gray-800 truncate">{demo.name}</p>
                              <p className="text-[10px] text-gray-400 line-clamp-1">{demo.description}</p>
                            </div>
                            <span className="text-[9px] text-red-400 opacity-0 group-hover/demo:opacity-100 transition-opacity flex-shrink-0">remove</span>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>

                    {/* Add agent card */}
                    {demoAgents.length < DEMO_AGENT_POOL.length && (
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={addDemoAgent}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border-2 border-dashed border-[#6161ff]/15 hover:border-[#6161ff]/30 hover:bg-[#6161ff]/[0.02] transition-all"
                      >
                        <div className="w-10 h-10 rounded-full border-2 border-dashed border-[#6161ff]/20 flex items-center justify-center flex-shrink-0">
                          <Plus className="w-5 h-5 text-[#6161ff]/30" />
                        </div>
                        <div className="text-left">
                          <p className="text-[12px] font-semibold text-[#6161ff]/50">Add Agent</p>
                          <p className="text-[10px] text-gray-300">Click to add a new AI agent</p>
                        </div>
                      </motion.button>
                    )}
                  </div>

                  <span className="text-[10px] text-gray-400 font-medium">
                    {agents.length + demoAgents.length} agent{(agents.length + demoAgents.length) !== 1 ? 's' : ''} ready
                  </span>

                  {/* Agent toast */}
                  <AnimatePresence>
                    {agentToast && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="text-[10px] text-[#6161ff] font-medium mb-2 flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3" /> {agentToast}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <ValueBadge
                    label={selectedJob.agents.valueAccent}
                    delay={0.05}
                  />
                </CapabilityCard>

                {/* ═══ Vibe Card ═══ */}
                <CapabilityCard delay={0.15}>
                  <div className="flex items-center gap-3 mb-4">
                    <CardIcon>
                      <img src={vibeLogo} alt="Vibe" className="w-6 h-6 object-contain" />
                    </CardIcon>
                    <span className="text-[15px] font-bold text-gray-900">Vibe</span>
                    <span className="ml-auto text-[9px] font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                      No-Code
                    </span>
                  </div>
                  <p className="text-[12px] text-gray-600 leading-relaxed mb-3">{selectedJob.vibe.description}</p>

                  {/* Vibe app icons: real + demo + create button */}
                  <div className="relative flex items-center gap-2.5 mb-4 flex-wrap">
                    {vibeApps.slice(0, 4).map((app) => {
                      const { icon: AppIcon, bg, fg } = getAppIcon(app.name);
                      return (
                        <motion.div
                          key={app.id}
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          whileHover={{ scale: 1.15, rotate: 3 }}
                          className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center cursor-default shadow-sm`}
                          title={app.name}
                        >
                          <AppIcon className={`w-5 h-5 ${fg}`} />
                        </motion.div>
                      );
                    })}
                    {/* Demo apps */}
                    <AnimatePresence>
                      {demoApps.map((app) => {
                        const AppIcon = app.icon;
                        return (
                          <motion.div
                            key={app.id}
                            initial={{ opacity: 0, scale: 0, rotate: -90 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            exit={{ opacity: 0, scale: 0 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                            className={`w-10 h-10 rounded-xl ${app.bg} flex items-center justify-center shadow-sm`}
                            title={app.name}
                          >
                            <AppIcon className={`w-5 h-5 ${app.fg}`} />
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>

                    {/* Create app button */}
                    <div className="relative">
                      <motion.button
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowAppPicker(!showAppPicker)}
                        className="w-10 h-10 rounded-xl border-2 border-dashed border-[#6161ff]/20 flex items-center justify-center hover:border-[#6161ff]/40 hover:bg-[#6161ff]/5 transition-all"
                        title="Create app"
                      >
                        <Plus className="w-4 h-4 text-[#6161ff]/40" />
                      </motion.button>

                      {/* App type picker popover */}
                      <AnimatePresence>
                        {showAppPicker && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 4 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 4 }}
                            transition={{ duration: 0.15 }}
                            className="absolute bottom-full mb-2 left-0 z-30 bg-white rounded-xl shadow-xl border border-gray-100 p-2 min-w-[140px]"
                          >
                            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider px-1.5 mb-2">Create app</p>
                            {DEMO_APP_TYPES.filter((t) => !demoApps.find((d) => d.id === t.id)).map((appType) => {
                              const TypeIcon = appType.icon;
                              return (
                                <motion.button
                                  key={appType.id}
                                  whileHover={{ x: 2, backgroundColor: '#f9fafb' }}
                                  onClick={() => addDemoApp(appType)}
                                  className="flex items-center gap-2.5 w-full px-2 py-2 rounded-lg text-left transition-colors"
                                >
                                  <div className={`w-7 h-7 rounded-lg ${appType.bg} flex items-center justify-center`}>
                                    <TypeIcon className={`w-4 h-4 ${appType.fg}`} />
                                  </div>
                                  <span className="text-[12px] font-medium text-gray-700">{appType.name}</span>
                                </motion.button>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <span className="text-[11px] text-gray-400 ml-1 font-medium">{vibeApps.length + demoApps.length} app{(vibeApps.length + demoApps.length) !== 1 ? 's' : ''}</span>
                  </div>

                  {selectedJob.vibe.replacesTools.length > 0 && (
                    <p className="text-[10px] text-gray-400 mb-3">
                      Replaces: {selectedJob.vibe.replacesTools.join(', ')}
                    </p>
                  )}

                  <ValueBadge
                    label={selectedJob.vibe.valueAccent}
                    delay={0.15}
                  />
                </CapabilityCard>
              </div>

              {/* Flow connector between rows */}
              <FlowConnector />

              {/* ═══ Context Card (full-width) ═══ */}
              <div className="mb-1">
                <CapabilityCard delay={0.25}>
                  <div className="flex items-center gap-3 mb-4">
                    <CardIcon>
                      <Brain className="w-6 h-6 text-[#6161ff]" />
                    </CardIcon>
                    <span className="text-[15px] font-bold text-gray-900">Context</span>
                    <span className="ml-auto text-[9px] font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                      Deep Knowledge
                    </span>
                  </div>
                  <div className="md:flex md:items-start md:justify-between md:gap-6">
                    <div className="flex-1">
                      <p className="text-[12px] text-gray-600 leading-relaxed mb-3">{selectedJob.context.description}</p>
                      {/* Integration logos: real + demo + connect button */}
                      <div className="relative flex items-center gap-3 mb-4 md:mb-0 flex-wrap">
                        {allTools.slice(0, 4).map((tool) => {
                          const logo = getToolLogo(tool);
                          return (
                            <motion.div
                              key={tool}
                              whileHover={{ scale: 1.2, y: -2 }}
                              className="cursor-default"
                            >
                              {logo ? (
                                <img src={logo} alt={tool} className="w-9 h-9 object-contain rounded-lg shadow-sm" title={tool} />
                              ) : (
                                <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shadow-sm" title={tool}>
                                  <Plug className="w-4 h-4 text-gray-400" />
                                </div>
                              )}
                            </motion.div>
                          );
                        })}
                        {/* Demo integrations */}
                        <AnimatePresence>
                          {demoIntegrations.map((integ) => (
                            <motion.div
                              key={integ.id}
                              initial={{ opacity: 0, scale: 0, rotate: -180 }}
                              animate={{ opacity: 1, scale: 1, rotate: 0 }}
                              exit={{ opacity: 0, scale: 0 }}
                              transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                              className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-[10px] font-bold shadow-sm"
                              style={{ backgroundColor: integ.color }}
                              title={integ.name}
                            >
                              {integ.name.charAt(0)}
                            </motion.div>
                          ))}
                        </AnimatePresence>

                        {/* Connect integration button */}
                        <div className="relative">
                          <motion.button
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setShowIntPicker(!showIntPicker)}
                            className="w-9 h-9 rounded-lg border-2 border-dashed border-[#6161ff]/20 flex items-center justify-center hover:border-[#6161ff]/40 hover:bg-[#6161ff]/5 transition-all"
                            title="Connect integration"
                          >
                            <Plus className="w-4 h-4 text-[#6161ff]/40" />
                          </motion.button>

                          {/* Integration picker popover */}
                          <AnimatePresence>
                            {showIntPicker && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 4 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 4 }}
                                transition={{ duration: 0.15 }}
                                className="absolute bottom-full mb-2 left-0 z-30 bg-white rounded-xl shadow-xl border border-gray-100 p-2 min-w-[150px]"
                              >
                                <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider px-1.5 mb-2">Connect</p>
                                {DEMO_INTEGRATIONS.filter((i) => !demoIntegrations.find((d) => d.id === i.id)).map((integ) => (
                                  <motion.button
                                    key={integ.id}
                                    whileHover={{ x: 2, backgroundColor: '#f9fafb' }}
                                    onClick={() => addDemoIntegration(integ)}
                                    className="flex items-center gap-2.5 w-full px-2 py-2 rounded-lg text-left transition-colors"
                                  >
                                    <div
                                      className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[9px] font-bold"
                                      style={{ backgroundColor: integ.color }}
                                    >
                                      {integ.name.charAt(0)}
                                    </div>
                                    <span className="text-[12px] font-medium text-gray-700">{integ.name}</span>
                                  </motion.button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Integration toast */}
                        <AnimatePresence>
                          {intToast && (
                            <motion.span
                              initial={{ opacity: 0, x: -4 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0 }}
                              className="text-[10px] text-[#6161ff] font-medium flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3 h-3" /> {intToast}
                            </motion.span>
                          )}
                        </AnimatePresence>

                        {!intToast && (
                          <span className="text-[10px] text-gray-400">+ your integrations</span>
                        )}
                      </div>
                    </div>
                    <ValueBadge
                      label={selectedJob.context.valueAccent}
                      delay={0.25}
                    />
                  </div>
                </CapabilityCard>
              </div>

              {/* Flow connector */}
              <FlowConnector />

              {/* ═══ mondayDB Card (full-width) ═══ */}
              <CapabilityCard delay={0.35}>
                <div className="flex items-center gap-3 mb-4">
                  <CardIcon>
                    <Database className="w-6 h-6 text-[#6161ff]" />
                  </CardIcon>
                  <span className="text-[15px] font-bold text-gray-900">mondayDB</span>
                  <span className="ml-auto text-[9px] font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                    Enterprise-Grade
                  </span>
                </div>
                <div className="md:flex md:items-start md:justify-between md:gap-6">
                  <div className="flex-1">
                    <p className="text-[12px] text-gray-600 leading-relaxed mb-3">{selectedJob.mondayDB.description}</p>
                    {/* Animated badges with tooltips */}
                    <div className="flex items-center gap-3 mb-3 md:mb-0">
                      {[
                        { label: 'Secure', icon: Shield },
                        { label: 'Governed', icon: Users },
                        { label: 'Enterprise', icon: Database },
                      ].map((badge, bIdx) => {
                        const BadgeIcon = badge.icon;
                        return (
                          <div key={badge.label} className="relative">
                            <motion.div
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.4 + bIdx * 0.1, duration: 0.3 }}
                              onMouseEnter={() => setHoveredBadge(badge.label)}
                              onMouseLeave={() => setHoveredBadge(null)}
                              className="flex items-center gap-2 cursor-default px-2.5 py-1.5 rounded-lg hover:bg-[#6161ff]/5 transition-colors"
                            >
                              <BadgeIcon className="w-4 h-4 text-[#6161ff]/50" />
                              <span className="text-[11px] text-gray-500 font-medium">{badge.label}</span>
                            </motion.div>
                            {/* Tooltip */}
                            <AnimatePresence>
                              {hoveredBadge === badge.label && (
                                <motion.div
                                  initial={{ opacity: 0, y: 4 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: 4 }}
                                  transition={{ duration: 0.15 }}
                                  className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-30 w-52"
                                >
                                  <div className="bg-gray-900 text-white text-[10px] leading-relaxed px-3 py-2 rounded-lg shadow-lg">
                                    {DB_BADGE_TOOLTIPS[badge.label]}
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45 -mt-1" />
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>

                    {/* Animated data counters */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                      className="flex items-center gap-4 mt-2"
                    >
                      <DataCounter label="Items stored" value={12847} suffix="" color="text-[#6161ff]" />
                      <DataCounter label="Queries/sec" value={340} suffix="" color="text-[#6161ff]" />
                      <DataCounter label="Uptime" value={99.99} suffix="%" color="text-[#6161ff]" isDecimal />
                    </motion.div>
                  </div>
                  <ValueBadge
                    label={selectedJob.mondayDB.valueAccent}
                    delay={0.35}
                  />
                </div>
              </CapabilityCard>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ─── Enhanced Footer ─── */}
        <div className="relative px-5 py-4 bg-gradient-to-r from-gray-50/50 via-white to-gray-50/50">
          {/* Animated gradient border top */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-[1px]"
            style={{
              background: 'linear-gradient(90deg, transparent, #6161ff20, #6161ff30, #6161ff20, transparent)',
              backgroundSize: '200% 100%',
            }}
            animate={{ backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {department.avatar_image && (
                <motion.img
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  src={department.avatar_image}
                  alt=""
                  className="w-5 h-5 rounded-full object-cover ring-1 ring-gray-200"
                />
              )}
              <span className="text-[11px] text-gray-400">
                Tailored for your <span className="font-semibold text-gray-600">{department.title}</span> team
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] text-[#6161ff] font-medium tabular-nums">
                {jobCount} jobs · {agentCount} agents · {appCount} apps
              </span>
              <motion.button
                whileHover={{ scale: 1.03, x: 2 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-1 text-[10px] font-semibold text-[#6161ff] bg-[#6161ff]/5 hover:bg-[#6161ff]/10 px-3 py-1.5 rounded-full transition-colors"
              >
                Explore full platform
                <ArrowRight className="w-3 h-3" />
              </motion.button>
            </div>
          </div>
        </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Sandbox Showcase Variant (V2) — Architecture-Integrated
   ═══════════════════════════════════════════════════════════════════ */

function SandboxFlowArrows({ direction = 'up' }: { direction?: 'up' | 'down' }) {
  const rotation = direction === 'up' ? 0 : 180;
  return (
    <div className="flex justify-center gap-2 py-1.5">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{ y: direction === 'up' ? [0, -4, 0] : [0, 4, 0] }}
          transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowUp
            className="w-3.5 h-3.5"
            style={{ color: '#6161ff50', transform: `rotate(${rotation}deg)` }}
          />
        </motion.div>
      ))}
    </div>
  );
}

function SandboxBiDirectionalArrows() {
  return (
    <div className="flex justify-center gap-2 py-1.5">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex flex-col items-center gap-0">
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ArrowUp className="w-3.5 h-3.5" style={{ color: '#6161ff50' }} />
          </motion.div>
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.5, delay: i * 0.2 + 0.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ArrowUp className="w-3.5 h-3.5 rotate-180" style={{ color: '#6161ff50' }} />
          </motion.div>
        </div>
      ))}
    </div>
  );
}

function PlatformShowcaseContentV2({
  department,
  allDepartments,
}: {
  department: DepartmentRow;
  allDepartments: DepartmentRow[];
}) {
  const { agents, vibeApps, loading } = useDepartmentData(department.id);
  const showcaseJTBDs = useMemo(() => getShowcaseJTBDs(department.name), [department.name]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [hoveredLayer, setHoveredLayer] = useState<string | null>(null);

  useEffect(() => {
    setSelectedIdx(0);
    setHoveredLayer(null);
  }, [department.id]);

  const selectedJob = showcaseJTBDs[selectedIdx] || showcaseJTBDs[0];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        >
          <Loader2 className="w-6 h-6 text-[#6161ff]" />
        </motion.div>
      </div>
    );
  }

  if (!selectedJob) return null;

  const integrationLogos = [
    ...selectedJob.vibe.replacesTools,
    ...(vibeApps
      .flatMap((app) => app.replaces_tools || [])
      .filter((tool, i, arr) => arr.indexOf(tool) === i && !selectedJob.vibe.replacesTools.includes(tool))
      .slice(0, 3)),
  ].slice(0, 6);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-lg shadow-gray-100/40 overflow-hidden">
      <ShowcaseCardHeader department={department} />

      {/* JTBD Selection Bar */}
      <div className="px-5 pt-5 pb-4">
        <motion.p
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4"
        >
          What would you like to accomplish?
        </motion.p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {showcaseJTBDs.map((job, idx) => {
            const isActive = idx === selectedIdx;
            const IconComp = job.icon;
            return (
              <motion.button
                key={job.id}
                initial={{ opacity: 0, y: 16, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.05 * idx, duration: 0.4, type: 'spring', stiffness: 300, damping: 22 }}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setSelectedIdx(idx)}
                className={`
                  relative flex flex-col items-center gap-1.5 px-2.5 py-3 rounded-xl border transition-all duration-300 cursor-pointer text-center
                  ${isActive
                    ? 'border-[#6161ff]/30 bg-gradient-to-br from-[#6161ff]/8 to-[#6161ff]/3 shadow-md shadow-[#6161ff]/15'
                    : 'border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50/80 hover:shadow-sm'
                  }
                `}
              >
                {isActive && (
                  <motion.div
                    layoutId="jtbd-glow-v2"
                    className="absolute inset-0 rounded-xl"
                    style={{ boxShadow: '0 0 20px rgba(97,97,255,0.12)' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <div className={`relative w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-300 ${isActive ? 'bg-[#6161ff]/12' : 'bg-gray-50'}`}>
                  <IconComp className={`w-4 h-4 transition-colors duration-300 ${isActive ? 'text-[#6161ff]' : 'text-gray-400'}`} />
                </div>
                <span className={`text-[10px] font-semibold leading-tight transition-colors duration-300 ${isActive ? 'text-[#6161ff]' : 'text-gray-700'}`}>
                  {job.title}
                </span>
                <span className="text-[8px] text-gray-400 leading-snug line-clamp-2">{job.tagline}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Architecture-Integrated Sandbox View */}
      <div className="px-5 pb-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedJob.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {/* Outer dashed border: AI Work Platform */}
            <div className="relative rounded-3xl border-2 border-dashed border-[#6161ff]/20 bg-gradient-to-b from-[#6161ff]/[0.015] to-white p-4 md:p-6">

              {/* Sandbox title */}
              <div className="text-center mb-5">
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <motion.div
                    initial={{ rotate: -10, scale: 0.8 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  >
                    <Sparkles className="w-5 h-5 text-[#6161ff]" />
                  </motion.div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900">
                    Tailored for:{' '}
                    <span className="bg-gradient-to-r from-[#6161ff] to-[#8b5cf6] bg-clip-text text-transparent">
                      {selectedJob.title}
                    </span>
                  </h3>
                </div>
                <p className="text-xs text-gray-400">{selectedJob.tagline} — powered by monday&apos;s AI platform</p>
              </div>

              {/* ═══ Layer 1: AI Work Capabilities ═══ */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="relative rounded-2xl border border-[#6161ff]/15 bg-gradient-to-br from-[#6161ff]/[0.02] to-white p-4 md:p-5 pt-7 transition-all duration-300"
                style={{
                  boxShadow: hoveredLayer === 'capabilities' ? '0 0 24px rgba(97,97,255,0.08)' : 'none',
                }}
                onMouseEnter={() => setHoveredLayer('capabilities')}
                onMouseLeave={() => setHoveredLayer(null)}
              >
                {/* Label pill */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-3 py-0.5 rounded-full border border-[#6161ff]/15 shadow-sm">
                  <div className="flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-[#6161ff]" />
                    <span className="text-xs font-semibold text-[#6161ff]">AI Work Capabilities</span>
                  </div>
                </div>

                {/* Agents + Vibe side by side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Agents card */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                    whileHover={{ y: -2 }}
                    className="rounded-xl border border-gray-100 bg-white p-4 hover:border-[#6161ff]/20 hover:shadow-md hover:shadow-[#6161ff]/[0.04] transition-all duration-300"
                  >
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-9 h-9 rounded-lg bg-[#6161ff]/8 flex items-center justify-center">
                        <img src={agentsLogo} alt="Agents" className="w-6 h-6 object-contain" />
                      </div>
                      <div>
                        <span className="text-sm font-bold text-gray-900 block">Agents</span>
                        <span className="text-[9px] text-gray-400 font-medium">AI-Powered</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-gray-500 leading-relaxed mb-3">{selectedJob.agents.description}</p>

                    {/* Agent mini-cards */}
                    <div className="flex flex-col gap-1.5 mb-3">
                      {agents.slice(0, 2).map((agent, aIdx) => (
                        <motion.div
                          key={agent.id}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.15 + aIdx * 0.08, duration: 0.3 }}
                          className="flex items-center gap-2 px-2.5 py-2 rounded-lg border border-gray-50 bg-gray-50/60"
                        >
                          <div className="relative flex-shrink-0">
                            {agent.image ? (
                              <img src={agent.image} alt={agent.name} className="w-8 h-8 rounded-full object-cover" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6161ff] to-purple-400 flex items-center justify-center">
                                <Bot className="w-4 h-4 text-white" />
                              </div>
                            )}
                            {agent.is_active && (
                              <motion.div
                                className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                              />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-semibold text-gray-700 truncate">{agent.name}</p>
                            <p className="text-[9px] text-gray-400 line-clamp-1">{agent.description || 'AI Assistant'}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <ValueBadge label={selectedJob.agents.valueAccent} delay={0.1} />
                  </motion.div>

                  {/* Vibe card */}
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15, duration: 0.4 }}
                    whileHover={{ y: -2 }}
                    className="rounded-xl border border-gray-100 bg-white p-4 hover:border-[#6161ff]/20 hover:shadow-md hover:shadow-[#6161ff]/[0.04] transition-all duration-300"
                  >
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-9 h-9 rounded-lg bg-[#6161ff]/8 flex items-center justify-center">
                        <img src={vibeLogo} alt="Vibe" className="w-6 h-6 object-contain" />
                      </div>
                      <div>
                        <span className="text-sm font-bold text-gray-900 block">Vibe</span>
                        <span className="text-[9px] text-gray-400 font-medium">No-Code</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-gray-500 leading-relaxed mb-3">{selectedJob.vibe.description}</p>

                    {/* App icons */}
                    <div className="flex items-center gap-2 flex-wrap mb-3">
                      {vibeApps.slice(0, 3).map((app) => {
                        const { icon: AppIcon, bg, fg } = getAppIcon(app.name);
                        return (
                          <motion.div
                            key={app.id}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.15, rotate: 3 }}
                            className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center shadow-sm cursor-default`}
                            title={app.name}
                          >
                            <AppIcon className={`w-4.5 h-4.5 ${fg}`} />
                          </motion.div>
                        );
                      })}
                      <div className="w-9 h-9 rounded-xl border-2 border-dashed border-[#6161ff]/15 flex items-center justify-center">
                        <Plus className="w-3.5 h-3.5 text-[#6161ff]/30" />
                      </div>
                    </div>

                    {selectedJob.vibe.replacesTools.length > 0 && (
                      <p className="text-[9px] text-gray-400 mb-2">
                        Replaces: {selectedJob.vibe.replacesTools.join(', ')}
                      </p>
                    )}

                    <ValueBadge label={selectedJob.vibe.valueAccent} delay={0.15} />
                  </motion.div>
                </div>

                {/* Powered by message */}
                <div className="text-center mt-3">
                  <p className="text-[10px] text-gray-400">
                    Powered by <span className="font-semibold text-[#6161ff]/70">Work Context</span> · Understands your business deeply
                  </p>
                </div>
              </motion.div>

              {/* Flow: Context → Capabilities */}
              <SandboxFlowArrows direction="up" />

              {/* ═══ Layer 2: Work Context ═══ */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="relative rounded-2xl border border-[#6161ff]/15 bg-gradient-to-br from-[#6161ff]/[0.02] to-purple-50/20 p-4 md:p-5 pt-7 transition-all duration-300"
                style={{
                  boxShadow: hoveredLayer === 'context' ? '0 0 20px rgba(97,97,255,0.06)' : 'none',
                }}
                onMouseEnter={() => setHoveredLayer('context')}
                onMouseLeave={() => setHoveredLayer(null)}
              >
                {/* Label pill */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-3 py-0.5 rounded-full border border-[#6161ff]/15 shadow-sm">
                  <div className="flex items-center gap-1.5">
                    <Brain className="w-3.5 h-3.5 text-[#6161ff]" />
                    <span className="text-xs font-semibold text-[#6161ff]">Work Context</span>
                  </div>
                </div>

                <p className="text-[11px] text-gray-500 leading-relaxed mb-3 text-center max-w-lg mx-auto">
                  {selectedJob.context.description}
                </p>

                {/* Building blocks grid */}
                <div className="grid grid-cols-5 gap-2 mb-2">
                  {[
                    { icon: LayoutGrid, label: 'Boards' },
                    { icon: ListChecks, label: 'Items' },
                    { icon: BarChart3, label: 'Dashboards' },
                    { icon: Boxes, label: 'Blocks' },
                    { icon: FileText, label: 'Files' },
                  ].map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + i * 0.05, duration: 0.3 }}
                      className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl bg-[#6161ff]/[0.03] border border-[#6161ff]/8 hover:bg-[#6161ff]/[0.06] hover:border-[#6161ff]/15 transition-colors"
                    >
                      <item.icon className="w-6 h-6 text-[#6161ff]/40" />
                      <span className="text-[9px] text-[#6161ff]/60 font-semibold">{item.label}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="text-center mt-2">
                  <ValueBadge label={selectedJob.context.valueAccent} delay={0.2} />
                </div>
              </motion.div>

              {/* Bidirectional arrows: Context ↔ SoR */}
              <SandboxBiDirectionalArrows />

              {/* ═══ Layer 3: System of Records ═══ */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="relative rounded-xl border border-gray-200 bg-gray-50/50 p-4 md:p-5 pt-6 pb-6 transition-all duration-300"
                style={{
                  boxShadow: hoveredLayer === 'sor' ? '0 2px 12px rgba(0,0,0,0.04)' : 'none',
                }}
                onMouseEnter={() => setHoveredLayer('sor')}
                onMouseLeave={() => setHoveredLayer(null)}
              >
                {/* Label pill */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-3 py-0.5 rounded-full border border-gray-100">
                  <div className="flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-xs font-semibold text-gray-500">System of Records</span>
                  </div>
                </div>

                {/* Enterprise Secure badge at bottom */}
                <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-white px-2.5 py-0.5 rounded-full border border-[#6161ff]/10 flex items-center gap-1 z-10">
                  <Shield className="w-2.5 h-2.5 text-[#6161ff]/50" />
                  <span className="text-[9px] font-medium text-[#6161ff]/60">Enterprise Grade Secure</span>
                </div>

                <div className="flex items-center justify-center gap-4 md:gap-8 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#6161ff]/5 border border-[#6161ff]/10 flex items-center justify-center">
                      <Lock className="w-4 h-4 text-[#6161ff]/40" />
                    </div>
                    <span className="text-[11px] font-medium text-gray-600">Governance & Permissions</span>
                  </div>
                  <div className="w-px h-6 bg-gray-200" />
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#6161ff]/5 border border-[#6161ff]/10 flex items-center justify-center">
                      <Layers className="w-4 h-4 text-[#6161ff]/40" />
                    </div>
                    <span className="text-[11px] font-medium text-gray-600">Your Organization Data</span>
                  </div>
                </div>

                <p className="text-[10px] text-gray-400 text-center leading-relaxed">
                  {selectedJob.mondayDB.description}
                </p>
                <div className="text-center mt-2">
                  <ValueBadge label={selectedJob.mondayDB.valueAccent} delay={0.3} />
                </div>
              </motion.div>

              {/* Integrations strip */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="flex items-center justify-center gap-3 mt-5 pt-4 border-t border-dashed border-gray-100"
              >
                <div className="flex items-center gap-1.5">
                  <Globe className="w-3 h-3 text-gray-300" />
                  <span className="text-[10px] text-gray-400 font-medium">Connected:</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {integrationLogos.map((tool) => {
                    const logo = getToolLogo(tool);
                    return (
                      <motion.div
                        key={tool}
                        whileHover={{ scale: 1.2, y: -2 }}
                        className="group relative w-7 h-7 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center cursor-default hover:border-[#6161ff]/20 transition-colors"
                      >
                        {logo ? (
                          <img src={logo} alt={tool} className="w-4 h-4 object-contain rounded-sm" />
                        ) : (
                          <Plug className="w-3 h-3 text-gray-400" />
                        )}
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                          <div className="bg-gray-900 text-white text-[9px] px-2 py-0.5 rounded whitespace-nowrap">
                            {tool}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                  <div className="w-7 h-7 rounded-lg border border-dashed border-gray-200 flex items-center justify-center hover:border-[#6161ff]/20 transition-colors cursor-default">
                    <Plus className="w-3 h-3 text-gray-300" />
                  </div>
                </div>
                <span className="text-[9px] text-gray-300">+ your integrations</span>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="relative px-5 py-4 bg-gradient-to-r from-gray-50/50 via-white to-gray-50/50">
        <motion.div
          className="absolute top-0 left-0 right-0 h-[1px]"
          style={{
            background: 'linear-gradient(90deg, transparent, #6161ff20, #6161ff30, #6161ff20, transparent)',
            backgroundSize: '200% 100%',
          }}
          animate={{ backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {department.avatar_image && (
              <img src={department.avatar_image} alt="" className="w-5 h-5 rounded-full object-cover ring-1 ring-gray-200" />
            )}
            <span className="text-[11px] text-gray-400">
              Tailored for your <span className="font-semibold text-gray-600">{department.title}</span> team
            </span>
          </div>
          <motion.button
            whileHover={{ scale: 1.03, x: 2 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-1 text-[10px] font-semibold text-[#6161ff] bg-[#6161ff]/5 hover:bg-[#6161ff]/10 px-3 py-1.5 rounded-full transition-colors"
          >
            Explore full platform
            <ArrowRight className="w-3 h-3" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}

/* ─── Data Counter ─── */
function DataCounter({
  label,
  value,
  suffix,
  color,
  isDecimal = false,
}: {
  label: string;
  value: number;
  suffix: string;
  color: string;
  isDecimal?: boolean;
}) {
  const displayVal = useAnimatedCounter(isDecimal ? Math.round(value * 100) : value, 1.5);
  const formatted = isDecimal
    ? (displayVal / 100).toFixed(2)
    : displayVal.toLocaleString();

  return (
    <div className="flex items-center gap-1.5">
      <motion.div
        className="w-1.5 h-1.5 rounded-full bg-[#6161ff]"
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div>
        <span className={`text-[13px] font-bold ${color} tabular-nums`}>{formatted}{suffix}</span>
        <span className="text-[9px] text-gray-400 ml-1">{label}</span>
      </div>
    </div>
  );
}
