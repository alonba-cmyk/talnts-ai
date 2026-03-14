import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Network,
  BookOpen,
  Kanban,
  TrendingUp,
  CalendarRange,
  FileInput,
  ArrowRight,
  Check,
  Replace,
  Users,
  Mail,
  Briefcase,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import vibeLogo from '@/assets/069a22575b2de9057cfc00d9b4538d072f7fe115.png';

export const FAVICON = (domain: string) =>
  `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

/* ═══════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════ */

export interface ReplacedTool {
  name: string;
  domain: string;
}

export interface ToolCategory {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
  tagline: string;
  replacedTools: ReplacedTool[];
}

export const TOOL_CATEGORIES: ToolCategory[] = [
  {
    id: 'org_chart',
    label: 'Org Chart',
    icon: Network,
    color: '#a78bfa',
    tagline: 'Build your org chart — always live, always up to date.',
    replacedTools: [
      { name: 'Lucidchart', domain: 'lucidchart.com' },
      { name: 'Pingboard', domain: 'pingboard.com' },
      { name: 'ChartHop', domain: 'charthop.com' },
    ],
  },
  {
    id: 'knowledge_hub',
    label: 'Knowledge Hub',
    icon: BookOpen,
    color: '#60a5fa',
    tagline: 'One wiki for your entire organization.',
    replacedTools: [
      { name: 'Confluence', domain: 'atlassian.com' },
      { name: 'Notion', domain: 'notion.so' },
      { name: 'SharePoint', domain: 'sharepoint.com' },
    ],
  },
  {
    id: 'project_tracker',
    label: 'Project Tracker',
    icon: Kanban,
    color: '#34d399',
    tagline: 'Track every project in one place.',
    replacedTools: [
      { name: 'Asana', domain: 'asana.com' },
      { name: 'Trello', domain: 'trello.com' },
      { name: 'Basecamp', domain: 'basecamp.com' },
    ],
  },
  {
    id: 'crm_dashboard',
    label: 'CRM Dashboard',
    icon: TrendingUp,
    color: '#fbbf24',
    tagline: 'Manage your pipeline without the enterprise tax.',
    replacedTools: [
      { name: 'HubSpot', domain: 'hubspot.com' },
      { name: 'Salesforce', domain: 'salesforce.com' },
      { name: 'Pipedrive', domain: 'pipedrive.com' },
    ],
  },
  {
    id: 'resource_planning',
    label: 'Resource Planning',
    icon: CalendarRange,
    color: '#f87171',
    tagline: 'See who\'s free, who\'s overloaded — in real time.',
    replacedTools: [
      { name: 'Float', domain: 'float.com' },
      { name: 'Teamdeck', domain: 'teamdeck.io' },
      { name: 'Resource Guru', domain: 'resourceguruapp.com' },
    ],
  },
  {
    id: 'intake_forms',
    label: 'Intake Forms',
    icon: FileInput,
    color: '#f472b6',
    tagline: 'Collect requests that flow straight into your workflow.',
    replacedTools: [
      { name: 'Typeform', domain: 'typeform.com' },
      { name: 'Google Forms', domain: 'google.com' },
      { name: 'JotForm', domain: 'jotform.com' },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════
   INTERACTIVE PREVIEWS
   ═══════════════════════════════════════════════════════════ */

function OrgChartPreview() {
  const team = [
    { name: 'Sarah Chen', role: 'CEO', dept: 'Executive', reports: 3, color: '#a78bfa', level: 0 },
    { name: 'James Ko', role: 'VP Eng', dept: 'R&D', reports: 12, color: '#60a5fa', level: 1 },
    { name: 'Maria Lopez', role: 'VP Marketing', dept: 'Marketing', reports: 8, color: '#f472b6', level: 1 },
    { name: 'Alex Rivera', role: 'VP Ops', dept: 'Operations', reports: 6, color: '#34d399', level: 1 },
  ];

  return (
    <div className="px-3 py-4 space-y-3">
      {/* Top node */}
      <div className="flex justify-center">
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl" style={{ background: `${team[0].color}10`, border: `1px solid ${team[0].color}30` }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold" style={{ background: `linear-gradient(135deg, ${team[0].color}, ${team[0].color}99)` }}>SC</div>
          <div>
            <p className="text-[12px] font-semibold text-white leading-tight">{team[0].name}</p>
            <p className="text-[9px] text-gray-500">{team[0].role} · {team[0].reports} reports</p>
          </div>
        </div>
      </div>

      {/* Connector */}
      <div className="flex justify-center"><div className="w-px h-5" style={{ background: 'linear-gradient(to bottom, rgba(167,139,250,0.3), rgba(255,255,255,0.06))' }} /></div>

      {/* Direct reports */}
      <div className="flex justify-center"><div className="h-px w-3/4" style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent)' }} /></div>
      <div className="grid grid-cols-3 gap-2">
        {team.slice(1).map((person, i) => (
          <motion.div
            key={person.name}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="rounded-xl p-3 text-center"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="w-7 h-7 rounded-full mx-auto mb-2 flex items-center justify-center text-white text-[9px] font-bold" style={{ background: `linear-gradient(135deg, ${person.color}, ${person.color}88)` }}>
              {person.name.split(' ').map(w => w[0]).join('')}
            </div>
            <p className="text-[10px] font-semibold text-white leading-tight">{person.name}</p>
            <p className="text-[9px] text-gray-500 mt-0.5">{person.role}</p>
            <div className="mt-2 flex items-center justify-center gap-1">
              <Users className="w-2.5 h-2.5 text-gray-600" />
              <span className="text-[8px] text-gray-500">{person.reports}</span>
            </div>
            <div className="mt-1.5 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${(person.reports / 12) * 100}%` }} transition={{ delay: 0.5 + i * 0.15, duration: 0.6 }} className="h-full rounded-full" style={{ backgroundColor: person.color }} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary */}
      <div className="flex justify-center gap-4 pt-1">
        {[{ label: 'Departments', val: '4' }, { label: 'Total', val: '29' }].map(s => (
          <div key={s.label} className="text-center">
            <p className="text-[14px] font-bold text-white">{s.val}</p>
            <p className="text-[8px] text-gray-600 uppercase tracking-wider">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function KnowledgeHubPreview() {
  const [activePage, setActivePage] = useState(0);

  const pages = [
    { title: 'Getting Started', sections: ['Welcome to the team', 'First-week checklist', 'Key contacts'], icon: '📖', views: 342, updated: '2h ago' },
    { title: 'Brand Guidelines', sections: ['Logo usage', 'Color palette', 'Typography rules'], icon: '🎨', views: 128, updated: '1d ago' },
    { title: 'Engineering Wiki', sections: ['Architecture overview', 'API reference', 'Deploy process'], icon: '⚙️', views: 891, updated: '4h ago' },
    { title: 'HR Policies', sections: ['PTO policy', 'Benefits overview', 'Performance reviews'], icon: '📋', views: 67, updated: '3d ago' },
  ];

  const active = pages[activePage];

  return (
    <div className="grid grid-cols-[130px_1fr] gap-0 h-full" style={{ borderRadius: 12, overflow: 'hidden' }}>
      {/* Sidebar */}
      <div className="flex flex-col gap-0.5 py-3 px-2" style={{ background: 'rgba(255,255,255,0.02)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-[8px] font-bold uppercase tracking-widest text-gray-600 px-2 mb-2">Pages</p>
        {pages.map((page, i) => (
          <button
            key={page.title}
            onClick={() => setActivePage(i)}
            className="text-left px-2 py-2 rounded-lg transition-all duration-200 flex items-center gap-2"
            style={{
              background: activePage === i ? '#60a5fa12' : 'transparent',
              borderLeft: activePage === i ? '2px solid #60a5fa' : '2px solid transparent',
            }}
          >
            <span className="text-[11px]">{page.icon}</span>
            <span className={`text-[10px] font-medium leading-tight ${activePage === i ? 'text-white' : 'text-gray-500'}`}>{page.title}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="px-4 py-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            <div>
              <h4 className="text-[14px] font-bold text-white mb-0.5">{active.icon} {active.title}</h4>
              <div className="flex items-center gap-3 text-[9px] text-gray-600">
                <span>{active.views} views</span>
                <span>Updated {active.updated}</span>
              </div>
            </div>
            <div className="h-px w-full" style={{ background: 'linear-gradient(to right, #60a5fa40, transparent)' }} />
            <div className="space-y-1.5">
              {active.sections.map((section, i) => (
                <motion.div
                  key={section}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-white/[0.03] transition-colors"
                >
                  <ChevronRight className="w-3 h-3 text-[#60a5fa] flex-shrink-0" />
                  <span className="text-[11px] text-gray-300">{section}</span>
                </motion.div>
              ))}
            </div>
            {/* Content skeleton */}
            <div className="mt-3 space-y-2 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
              {[95, 80, 65, 90, 50].map((w, i) => (
                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.05 }} className="h-1.5 rounded-full" style={{ width: `${w}%`, background: `rgba(255,255,255,${0.04 - i * 0.005})` }} />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function ProjectTrackerPreview() {
  const projects = [
    { name: 'Homepage redesign', owner: 'SC', progress: 72, status: 'On track', statusColor: '#10b981', priority: 'High', prioColor: '#ef4444' },
    { name: 'API integration', owner: 'JK', progress: 45, status: 'At risk', statusColor: '#f59e0b', priority: 'High', prioColor: '#ef4444' },
    { name: 'User research', owner: 'ML', progress: 90, status: 'On track', statusColor: '#10b981', priority: 'Med', prioColor: '#f59e0b' },
    { name: 'Mobile app v2', owner: 'AR', progress: 15, status: 'On track', statusColor: '#10b981', priority: 'Low', prioColor: '#6b7280' },
    { name: 'DB migration', owner: 'JK', progress: 100, status: 'Done', statusColor: '#a78bfa', priority: 'High', prioColor: '#ef4444' },
  ];

  const colors = ['#60a5fa', '#a78bfa', '#f472b6', '#34d399', '#60a5fa'];

  return (
    <div className="px-2 py-3">
      {/* Header row */}
      <div className="grid grid-cols-[1fr_44px_60px_52px_60px] gap-2 px-2 pb-2 mb-1" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {['Project', 'Owner', 'Progress', 'Priority', 'Status'].map(h => (
          <span key={h} className="text-[8px] font-bold uppercase tracking-widest text-gray-600">{h}</span>
        ))}
      </div>

      {/* Rows */}
      <div className="space-y-0.5">
        {projects.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="grid grid-cols-[1fr_44px_60px_52px_60px] gap-2 items-center px-2 py-2 rounded-lg hover:bg-white/[0.02] transition-colors"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-1 h-5 rounded-full flex-shrink-0" style={{ backgroundColor: colors[i] }} />
              <span className="text-[11px] font-medium text-gray-300 truncate">{p.name}</span>
            </div>
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold text-white" style={{ background: `linear-gradient(135deg, ${colors[i]}, ${colors[i]}88)` }}>{p.owner}</div>
            <div className="flex items-center gap-1.5">
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${p.progress}%` }} transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }} className="h-full rounded-full" style={{ backgroundColor: p.progress === 100 ? '#a78bfa' : colors[i] }} />
              </div>
              <span className="text-[9px] text-gray-500 w-7 text-right">{p.progress}%</span>
            </div>
            <span className="text-[9px] font-medium px-1.5 py-0.5 rounded text-center" style={{ color: p.prioColor, background: `${p.prioColor}15` }}>{p.priority}</span>
            <span className="text-[9px] font-medium px-1.5 py-0.5 rounded text-center" style={{ color: p.statusColor, background: `${p.statusColor}15` }}>{p.status}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function CRMDashboardPreview() {
  const stages = [
    { name: 'Lead', count: 24, value: 48, color: '#6b7280' },
    { name: 'Qualified', count: 12, value: 96, color: '#60a5fa' },
    { name: 'Proposal', count: 8, value: 210, color: '#fbbf24' },
    { name: 'Closed Won', count: 5, value: 380, color: '#10b981' },
  ];

  const maxVal = Math.max(...stages.map(s => s.value));
  const totalPipeline = stages.reduce((s, st) => s + st.value, 0);

  return (
    <div className="px-3 py-3 space-y-4">
      {/* Summary row */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[9px] text-gray-600 uppercase tracking-wider font-bold">Pipeline value</p>
          <p className="text-[20px] font-bold text-white leading-tight">${totalPipeline}K</p>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full" style={{ background: '#10b98115', border: '1px solid #10b98125' }}>
          <TrendingUp className="w-3 h-3 text-[#10b981]" />
          <span className="text-[10px] font-semibold text-[#10b981]">+18%</span>
        </div>
      </div>

      {/* Horizontal bar chart */}
      <div className="space-y-2.5">
        {stages.map((stage, i) => (
          <motion.div
            key={stage.name}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="space-y-1"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: stage.color }} />
                <span className="text-[11px] font-medium text-gray-300">{stage.name}</span>
                <span className="text-[9px] text-gray-600">{stage.count} deals</span>
              </div>
              <span className="text-[11px] font-bold" style={{ color: stage.color }}>${stage.value}K</span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(stage.value / maxVal) * 100}%` }}
                transition={{ delay: 0.3 + i * 0.12, duration: 0.6, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${stage.color}, ${stage.color}88)` }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Conversion rates */}
      <div className="flex justify-between pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        {[{ label: 'Lead → Qual', val: '50%' }, { label: 'Qual → Prop', val: '67%' }, { label: 'Prop → Won', val: '63%' }].map(c => (
          <div key={c.label} className="text-center">
            <p className="text-[11px] font-bold text-white">{c.val}</p>
            <p className="text-[8px] text-gray-600">{c.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ResourcePlanningPreview() {
  const team = [
    { name: 'Sarah C.', role: 'Designer', load: 85, color: '#a78bfa', blocks: [{ w: 40, label: 'Brand' }, { w: 30, label: 'App UI' }, { w: 15, label: '' }] },
    { name: 'James K.', role: 'Engineer', load: 60, color: '#60a5fa', blocks: [{ w: 35, label: 'API v2' }, { w: 25, label: 'DB' }] },
    { name: 'Maria L.', role: 'PM', load: 95, color: '#f472b6', blocks: [{ w: 30, label: 'Q4' }, { w: 35, label: 'Roadmap' }, { w: 30, label: 'OKRs' }] },
    { name: 'Alex R.', role: 'Analyst', load: 40, color: '#34d399', blocks: [{ w: 40, label: 'Research' }] },
  ];

  const loadColor = (load: number) => load > 90 ? '#ef4444' : load > 70 ? '#f59e0b' : '#10b981';

  return (
    <div className="px-2 py-3 space-y-3">
      {/* Summary */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-4">
          {[{ label: 'Avg load', val: '70%' }, { label: 'At risk', val: '1' }].map(s => (
            <div key={s.label}>
              <p className="text-[13px] font-bold text-white">{s.val}</p>
              <p className="text-[8px] text-gray-600 uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-1">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((d, i) => (
            <span key={d} className={`text-[7px] px-1.5 py-0.5 rounded ${i === 2 ? 'bg-white/10 text-white font-bold' : 'text-gray-600'}`}>{d}</span>
          ))}
        </div>
      </div>

      {/* Timeline rows */}
      <div className="space-y-2">
        {team.map((member, i) => {
          const overloaded = member.load > 90;
          return (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="space-y-1"
            >
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[7px] font-bold" style={{ background: `linear-gradient(135deg, ${member.color}, ${member.color}88)` }}>
                    {member.name.split(' ').map(w => w[0]).join('')}
                  </div>
                  <span className="text-[10px] font-medium text-gray-300">{member.name}</span>
                  <span className="text-[9px] text-gray-600">{member.role}</span>
                </div>
                <span className="text-[9px] font-bold" style={{ color: loadColor(member.load) }}>{member.load}%</span>
              </div>
              {/* Timeline bar */}
              <div className="flex gap-0.5 h-5 rounded-md overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)' }}>
                {member.blocks.map((block, bi) => (
                  <motion.div
                    key={bi}
                    initial={{ width: 0 }}
                    animate={{ width: `${block.w}%` }}
                    transition={{ delay: 0.3 + i * 0.1 + bi * 0.08, duration: 0.5 }}
                    className="h-full rounded-sm flex items-center justify-center overflow-hidden"
                    style={{
                      background: `linear-gradient(90deg, ${member.color}${overloaded ? '50' : '35'}, ${member.color}${overloaded ? '30' : '20'})`,
                      borderLeft: bi > 0 ? '1px solid rgba(0,0,0,0.3)' : undefined,
                    }}
                  >
                    {block.label && <span className="text-[7px] font-medium text-gray-300 px-1 truncate">{block.label}</span>}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function IntakeFormsPreview() {
  const submissions = [
    { id: '#1042', title: 'Laptop replacement', requester: 'Sarah C.', priority: 'High', prioColor: '#ef4444', status: 'Open', statusColor: '#60a5fa', time: '2h ago' },
    { id: '#1041', title: 'Software license', requester: 'James K.', priority: 'Med', prioColor: '#f59e0b', status: 'In Review', statusColor: '#fbbf24', time: '5h ago' },
    { id: '#1040', title: 'VPN access request', requester: 'Alex R.', priority: 'Low', prioColor: '#6b7280', status: 'Approved', statusColor: '#10b981', time: '1d ago' },
    { id: '#1039', title: 'Meeting room booking', requester: 'Maria L.', priority: 'Low', prioColor: '#6b7280', status: 'Completed', statusColor: '#a78bfa', time: '2d ago' },
  ];

  return (
    <div className="px-2 py-3 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <FileInput className="w-3.5 h-3.5 text-[#f472b6]" />
          <span className="text-[12px] font-bold text-white">IT Requests</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-gray-500">{submissions.length} submissions</span>
          <span className="text-[9px] font-medium text-[#f472b6] bg-[#f472b6]/10 px-2 py-0.5 rounded-full">Live</span>
        </div>
      </div>

      {/* Table header */}
      <div className="grid grid-cols-[1fr_50px_58px_48px] gap-2 px-2 pb-1" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {['Request', 'Priority', 'Status', 'Time'].map(h => (
          <span key={h} className="text-[8px] font-bold uppercase tracking-widest text-gray-600">{h}</span>
        ))}
      </div>

      {/* Rows */}
      <div className="space-y-0.5">
        {submissions.map((sub, i) => (
          <motion.div
            key={sub.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="grid grid-cols-[1fr_50px_58px_48px] gap-2 items-center px-2 py-2 rounded-lg hover:bg-white/[0.02] transition-colors"
          >
            <div className="min-w-0">
              <p className="text-[10px] font-medium text-gray-300 truncate">{sub.title}</p>
              <p className="text-[8px] text-gray-600">{sub.id} · {sub.requester}</p>
            </div>
            <span className="text-[9px] font-medium px-1.5 py-0.5 rounded text-center" style={{ color: sub.prioColor, background: `${sub.prioColor}15` }}>{sub.priority}</span>
            <span className="text-[8px] font-medium px-1 py-0.5 rounded text-center" style={{ color: sub.statusColor, background: `${sub.statusColor}15` }}>{sub.status}</span>
            <span className="text-[9px] text-gray-600 text-right">{sub.time}</span>
          </motion.div>
        ))}
      </div>

      {/* Quick stats */}
      <div className="flex justify-between px-1 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        {[{ label: 'Open', val: '2', color: '#60a5fa' }, { label: 'In Review', val: '1', color: '#fbbf24' }, { label: 'Completed', val: '1', color: '#a78bfa' }].map(s => (
          <div key={s.label} className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.color }} />
            <span className="text-[9px] text-gray-500"><span className="font-bold text-gray-400">{s.val}</span> {s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export const PREVIEW_COMPONENTS: Record<string, React.FC> = {
  org_chart: OrgChartPreview,
  knowledge_hub: KnowledgeHubPreview,
  project_tracker: ProjectTrackerPreview,
  crm_dashboard: CRMDashboardPreview,
  resource_planning: ResourcePlanningPreview,
  intake_forms: IntakeFormsPreview,
};

/* ═══════════════════════════════════════════════════════════
   REPLACED TOOLS PANEL
   ═══════════════════════════════════════════════════════════ */

export function ReplacedToolsPanel({ tools, color }: { tools: ReplacedTool[]; color: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 h-full py-6">
      <div className="flex items-center gap-2 mb-1">
        <Replace className="w-4 h-4 text-gray-500" />
        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Replaces</span>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-[200px]">
        {tools.map((tool, i) => (
          <motion.div
            key={tool.name}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.15, duration: 0.35 }}
            className="relative flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <img src={FAVICON(tool.domain)} alt={tool.name} className="w-6 h-6 rounded" loading="lazy" />
            <span className="text-[12px] text-gray-400 font-medium line-through decoration-gray-600">{tool.name}</span>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + i * 0.15, type: 'spring', stiffness: 300 }}
              className="absolute -right-2 -top-2 w-5 h-5 rounded-full flex items-center justify-center"
              style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}40` }}
            >
              <Check className="w-3 h-3 text-white" />
            </motion.div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex items-center gap-2 mt-2 px-4 py-2 rounded-full"
        style={{ background: `${color}12`, border: `1px solid ${color}25` }}
      >
        <CheckCircle2 className="w-3.5 h-3.5" style={{ color }} />
        <span className="text-[11px] font-semibold" style={{ color }}>Built on monday</span>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TAB-BASED VIEW (original)
   ═══════════════════════════════════════════════════════════ */

function TabBasedView() {
  const [activeIdx, setActiveIdx] = useState(0);
  const hoverRef = useRef(false);
  const autoRef = useRef<ReturnType<typeof setTimeout>>();

  const active = TOOL_CATEGORIES[activeIdx];
  const ActivePreview = PREVIEW_COMPONENTS[active.id];

  useEffect(() => {
    clearTimeout(autoRef.current);
    if (!hoverRef.current) {
      autoRef.current = setTimeout(() => {
        setActiveIdx(prev => (prev + 1) % TOOL_CATEGORIES.length);
      }, 6000);
    }
    return () => clearTimeout(autoRef.current);
  }, [activeIdx]);

  const totalReplaced = TOOL_CATEGORIES.reduce((sum, cat) => sum + cat.replacedTools.length, 0);

  return (
    <div
      onMouseEnter={() => { hoverRef.current = true; clearTimeout(autoRef.current); }}
      onMouseLeave={() => { hoverRef.current = false; }}
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="flex flex-wrap justify-center gap-2 mb-10"
      >
        {TOOL_CATEGORIES.map((cat, i) => {
          const isActive = activeIdx === i;
          const CatIcon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveIdx(i)}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-semibold transition-all duration-300 cursor-pointer"
              style={{
                backgroundColor: isActive ? `${cat.color}18` : 'rgba(255,255,255,0.04)',
                color: isActive ? cat.color : 'rgba(255,255,255,0.45)',
                border: `1px solid ${isActive ? `${cat.color}40` : 'rgba(255,255,255,0.06)'}`,
                boxShadow: isActive ? `0 0 20px ${cat.color}15` : 'none',
              }}
            >
              <CatIcon className="w-4 h-4" />
              {cat.label}
            </button>
          );
        })}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="rounded-2xl overflow-hidden"
        style={{
          backgroundColor: '#111',
          border: `1px solid ${active.color}20`,
          boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${active.color}08`,
          transition: 'border-color 0.5s, box-shadow 0.5s',
        }}
      >
        <div className="h-[3px] w-full transition-all duration-500" style={{ background: `linear-gradient(90deg, ${active.color}, ${active.color}50)` }} />

        <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <AnimatePresence mode="wait">
            <motion.p
              key={active.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="text-[15px] font-medium text-gray-300"
            >
              {active.tagline}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.6fr] min-h-[420px]">
          <div className="px-6 py-5" style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.35 }}
                className="h-full"
              >
                <ActivePreview />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="px-4 py-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <ReplacedToolsPanel tools={active.replacedTools} color={active.color} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-10"
      >
        <div className="flex items-center gap-3 px-5 py-3 rounded-full" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex -space-x-1.5">
            {TOOL_CATEGORIES.slice(0, 4).map(cat => (
              <div key={cat.id} className="w-3.5 h-3.5 rounded-full border-2 border-[#111]" style={{ backgroundColor: cat.color }} />
            ))}
          </div>
          <span className="text-[13px] text-gray-400">
            <span className="font-bold text-white">{totalReplaced}+ tools</span> consolidated into one platform
          </span>
        </div>

        <motion.a
          href="#"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-[13px] font-semibold bg-white text-[#0a0a0a]"
          style={{ boxShadow: '0 0 20px rgba(255,255,255,0.1)' }}
        >
          Start building
          <ArrowRight className="w-3.5 h-3.5" />
        </motion.a>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   CONNECTOR GRID VIEW (Glean-style drag & drop)
   ═══════════════════════════════════════════════════════════ */

export function ConnectorGridView() {
  const [connectedIdx, setConnectedIdx] = useState<number | null>(null);
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
  const [isNearDrop, setIsNearDrop] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  const connected = connectedIdx !== null ? TOOL_CATEGORIES[connectedIdx] : null;
  const ConnectedPreview = connected ? PREVIEW_COMPONENTS[connected.id] : null;

  const interact = useCallback((idx: number) => {
    setConnectedIdx(idx);
    setHasInteracted(true);
  }, []);

  const handleDragEnd = useCallback((_: never, info: { point: { x: number; y: number } }) => {
    if (dropRef.current && draggingIdx !== null) {
      const rect = dropRef.current.getBoundingClientRect();
      const inZone =
        info.point.x >= rect.left - 60 &&
        info.point.x <= rect.right + 60 &&
        info.point.y >= rect.top - 60 &&
        info.point.y <= rect.bottom + 60;

      if (inZone) {
        interact(draggingIdx);
      }
    }
    setDraggingIdx(null);
    setIsNearDrop(false);
  }, [draggingIdx, interact]);

  const handleDrag = useCallback((_: never, info: { point: { x: number; y: number } }) => {
    if (!dropRef.current) return;
    const rect = dropRef.current.getBoundingClientRect();
    const near =
      info.point.x >= rect.left - 80 &&
      info.point.x <= rect.right + 80 &&
      info.point.y >= rect.top - 80 &&
      info.point.y <= rect.bottom + 80;
    setIsNearDrop(near);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_1fr] gap-0 rounded-2xl overflow-hidden min-h-[560px]" style={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.08)' }}>
      {/* Left: Use Case Grid */}
      <div className="p-6 border-r border-white/[0.06]">
        <p className="text-[15px] font-bold text-white mb-1 px-1">Which use cases do you have today?</p>
        <p className="text-[12px] text-gray-500 mb-5 px-1">Drag to Vibe or click to connect</p>
        <div className="grid grid-cols-2 gap-3">
          {TOOL_CATEGORIES.map((cat, i) => {
            const CatIcon = cat.icon;
            const isConnected = connectedIdx === i;
            const isDragging = draggingIdx === i;
            return (
              <motion.div
                key={cat.id}
                drag
                dragSnapToOrigin
                dragElastic={0.15}
                onDragStart={() => setDraggingIdx(i)}
                onDrag={handleDrag as any}
                onDragEnd={handleDragEnd as any}
                onClick={() => interact(i)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="flex flex-col items-center gap-2.5 px-4 py-4 rounded-xl cursor-grab active:cursor-grabbing transition-colors relative"
                style={{
                  backgroundColor: isConnected ? `${cat.color}15` : 'rgba(255,255,255,0.03)',
                  border: `1.5px solid ${isConnected ? `${cat.color}50` : isDragging ? `${cat.color}30` : 'rgba(255,255,255,0.06)'}`,
                  boxShadow: isConnected ? `0 0 16px ${cat.color}20` : 'none',
                  zIndex: isDragging ? 50 : 1,
                }}
              >
                <div
                  className="w-11 h-11 rounded-lg flex items-center justify-center"
                  style={{
                    background: isConnected ? `${cat.color}25` : 'rgba(255,255,255,0.05)',
                  }}
                >
                  <CatIcon className="w-5 h-5" style={{ color: isConnected ? cat.color : 'rgba(255,255,255,0.4)' }} />
                </div>
                <span className={`text-[12px] font-medium text-center leading-tight ${isConnected ? 'text-white' : 'text-gray-400'}`}>
                  {cat.label}
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {cat.replacedTools.map((tool) => (
                    <img
                      key={tool.domain}
                      src={FAVICON(tool.domain)}
                      alt={tool.name}
                      className="w-4.5 h-4.5 rounded-sm"
                      style={{ opacity: isConnected ? 0.4 : 0.7 }}
                      loading="lazy"
                    />
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Center: Drop Zone + Connection */}
      <div className="flex flex-col items-center justify-center relative border-r border-white/[0.06] py-8">
        {/* Pulsing arrow hint */}
        <AnimatePresence>
          {!hasInteracted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 pointer-events-none"
            >
              <motion.div
                animate={{ x: [0, 8, 0], opacity: [0.35, 0.7, 0.35] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <ArrowRight className="w-5 h-5 text-gray-500" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Concentric rings */}
        {[1, 2, 3].map(ring => (
          <motion.div
            key={ring}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 90 + ring * 55,
              height: 90 + ring * 55,
              border: `1px solid ${isNearDrop ? 'rgba(162,93,220,0.2)' : 'rgba(255,255,255,0.04)'}`,
              transition: 'border-color 0.3s',
            }}
            animate={isNearDrop ? { scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] } : { scale: 1, opacity: 1 }}
            transition={isNearDrop ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.3 }}
          />
        ))}

        {/* Drop zone target */}
        <div ref={dropRef} className="relative z-10 flex flex-col items-center gap-3">
          {/* Vibe logo */}
          <motion.div
            animate={isNearDrop ? { scale: 1.1, boxShadow: '0 0 30px rgba(162,93,220,0.4)' } : { scale: 1, boxShadow: '0 0 0px transparent' }}
            transition={{ duration: 0.3 }}
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))',
              border: `1.5px solid ${isNearDrop ? 'rgba(162,93,220,0.5)' : 'rgba(255,255,255,0.1)'}`,
            }}
          >
            <img src={vibeLogo} alt="Vibe" className="w-9 h-9 object-contain" loading="lazy" />
          </motion.div>

          {/* Connected use case icon */}
          <AnimatePresence>
            {connected && (
              <motion.div
                initial={{ opacity: 0, scale: 0, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="flex flex-col items-center gap-1.5"
              >
                <div className="text-[14px] text-gray-500 font-light">+</div>
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    background: `${connected.color}20`,
                    border: `1.5px solid ${connected.color}50`,
                    boxShadow: `0 0 20px ${connected.color}20`,
                  }}
                >
                  <connected.icon className="w-5 h-5" style={{ color: connected.color }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Instruction text */}
          {!connected && !isNearDrop && (
            <p className="text-[11px] text-gray-500 text-center max-w-[130px] mt-2 leading-relaxed font-medium">
              Drop here and see Vibe build it
            </p>
          )}
          {isNearDrop && !connected && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[12px] text-purple-400 text-center mt-2 font-bold"
            >
              Drop now!
            </motion.p>
          )}
        </div>
      </div>

      {/* Right: Result Panel */}
      <div
        className="p-6 min-h-[520px] flex flex-col relative overflow-hidden"
        style={{
          background: connected
            ? 'transparent'
            : 'linear-gradient(135deg, rgba(162,93,220,0.06), rgba(255,160,100,0.04))',
        }}
      >
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4">Result</p>

        <AnimatePresence mode="wait">
          {connected && ConnectedPreview ? (
            <motion.div
              key={connected.id}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col flex-1"
            >
              {/* Title */}
              <div className="flex items-center gap-2.5 mb-4">
                <img src={vibeLogo} alt="Vibe" className="w-6 h-6 object-contain" loading="lazy" />
                <span className="text-[13px] text-gray-500 font-medium">+</span>
                <span className="text-[15px] font-semibold text-white">{connected.label}</span>
              </div>

              <p className="text-[13px] text-gray-400 leading-relaxed mb-5">{connected.tagline}</p>

              {/* Interactive preview */}
              <div
                className="flex-1 rounded-xl overflow-hidden mb-5"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: `1px solid ${connected.color}15`,
                }}
              >
                <ConnectedPreview />
              </div>

              {/* Replaced tools */}
              <div className="pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <Replace className="w-3.5 h-3.5 text-gray-500" />
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Tools it can replace</span>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  {connected.replacedTools.map((tool, i) => (
                    <motion.div
                      key={tool.domain}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.25 + i * 0.12, duration: 0.3 }}
                      className="flex items-center gap-1.5 px-2 py-1.5 rounded-md"
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      <img
                        src={FAVICON(tool.domain)}
                        alt={tool.name}
                        className="w-4 h-4 rounded"
                        loading="lazy"
                      />
                      <span className="text-[10px] text-gray-400 font-medium line-through decoration-gray-600">{tool.name}</span>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex items-center gap-2 px-3 py-2 rounded-full w-fit"
                  style={{ background: `${connected.color}12`, border: `1px solid ${connected.color}25` }}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" style={{ color: connected.color }} />
                  <span className="text-[11px] font-semibold" style={{ color: connected.color }}>All built on monday</span>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center flex-1 text-center"
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'rgba(162,93,220,0.08)', border: '1px solid rgba(162,93,220,0.15)' }}>
                <Sparkles className="w-6 h-6 text-purple-400/60" />
              </div>
              <p className="text-[15px] font-semibold text-gray-400 mb-2">Pick a use case to get started</p>
              <p className="text-[12px] text-gray-600 max-w-[220px] leading-relaxed">
                See a live preview and discover which tools it can replace
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN SECTION
   ═══════════════════════════════════════════════════════════ */

export function ConsolidationSection({ variant = 'tab_based' }: { variant?: 'tab_based' | 'connector_grid' }) {
  const activeColor = '#a78bfa';

  return (
    <section
      className="py-16 sm:py-20 px-4 sm:px-6 relative overflow-hidden"
      style={{ backgroundColor: '#0a0a0a' }}
    >
      {/* Ambient glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(ellipse, ${activeColor}08 0%, transparent 65%)`, filter: 'blur(80px)' }}
      />

      <div className="max-w-[1200px] mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-4 border bg-white/[0.04] text-gray-400 border-white/[0.08]"
          >
            <Replace className="w-3 h-3" />
            Consolidation
          </motion.span>

          <h2 className="text-4xl sm:text-5xl lg:text-[52px] font-bold tracking-[-0.03em] leading-[1.1] text-white mb-4">
            Build it once.
            <br />
            <span className="text-[#a78bfa]">Replace them all.</span>
          </h2>
          <p className="text-lg text-gray-500 leading-relaxed max-w-[600px] mx-auto">
            Stop paying for a dozen tools that don't talk to each other.
            <br />
            Build exactly what you need — on one platform.
          </p>
        </motion.div>

        {variant === 'connector_grid' ? <ConnectorGridView /> : <TabBasedView />}
      </div>
    </section>
  );
}
