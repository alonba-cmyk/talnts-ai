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
  type LucideIcon,
} from 'lucide-react';

const FAVICON = (domain: string) =>
  `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

/* ═══════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════ */

interface ReplacedTool {
  name: string;
  domain: string;
}

interface ToolCategory {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
  tagline: string;
  replacedTools: ReplacedTool[];
}

const TOOL_CATEGORIES: ToolCategory[] = [
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
  const [expandedNode, setExpandedNode] = useState<string | null>(null);

  const nodes = [
    { id: 'ceo', name: 'Sarah Chen', role: 'CEO', dept: 'Executive', children: ['vp_eng', 'vp_mktg', 'vp_ops'] },
    { id: 'vp_eng', name: 'James Ko', role: 'VP Engineering', dept: 'R&D', children: ['eng1', 'eng2'] },
    { id: 'vp_mktg', name: 'Maria L.', role: 'VP Marketing', dept: 'Marketing', children: ['mktg1'] },
    { id: 'vp_ops', name: 'Alex R.', role: 'VP Operations', dept: 'Operations', children: [] },
  ];

  const childNodes: Record<string, { name: string; role: string }[]> = {
    vp_eng: [{ name: 'Dev Team A', role: '4 members' }, { name: 'Dev Team B', role: '6 members' }],
    vp_mktg: [{ name: 'Content Team', role: '3 members' }],
  };

  const colors = ['#a78bfa', '#60a5fa', '#f472b6', '#34d399'];

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      {/* CEO */}
      <motion.button
        onClick={() => setExpandedNode(expandedNode === 'ceo' ? null : 'ceo')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        className="relative rounded-xl px-5 py-3 text-center cursor-pointer"
        style={{
          background: expandedNode === 'ceo' ? '#a78bfa20' : 'rgba(255,255,255,0.04)',
          border: `1.5px solid ${expandedNode === 'ceo' ? '#a78bfa60' : 'rgba(255,255,255,0.08)'}`,
        }}
      >
        <div className="w-10 h-10 rounded-full mx-auto mb-1.5 flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: '#a78bfa' }}>SC</div>
        <p className="text-[13px] font-semibold text-white">{nodes[0].name}</p>
        <p className="text-[10px] text-gray-500">{nodes[0].role}</p>
        {expandedNode === 'ceo' && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-2 pt-2 border-t border-white/10">
            <p className="text-[10px] text-gray-400">{nodes[0].dept} · 3 direct reports</p>
          </motion.div>
        )}
      </motion.button>

      {/* Connector line */}
      <div className="w-px h-4 bg-white/10" />

      {/* VPs row */}
      <div className="flex gap-3 flex-wrap justify-center">
        {nodes.slice(1).map((node, i) => {
          const isExpanded = expandedNode === node.id;
          const children = childNodes[node.id];
          return (
            <div key={node.id} className="flex flex-col items-center gap-2">
              <motion.button
                onClick={() => setExpandedNode(isExpanded ? null : node.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="rounded-xl px-4 py-2.5 text-center cursor-pointer transition-colors"
                style={{
                  background: isExpanded ? `${colors[i + 1]}20` : 'rgba(255,255,255,0.03)',
                  border: `1.5px solid ${isExpanded ? `${colors[i + 1]}60` : 'rgba(255,255,255,0.06)'}`,
                }}
              >
                <div className="w-8 h-8 rounded-full mx-auto mb-1 flex items-center justify-center text-white font-bold text-[10px]" style={{ backgroundColor: colors[i + 1] }}>
                  {node.name.split(' ').map(w => w[0]).join('')}
                </div>
                <p className="text-[11px] font-semibold text-white whitespace-nowrap">{node.name}</p>
                <p className="text-[9px] text-gray-500">{node.role}</p>
              </motion.button>

              <AnimatePresence>
                {isExpanded && children && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-col gap-1 overflow-hidden"
                  >
                    <div className="w-px h-2 bg-white/10 mx-auto" />
                    {children.map(child => (
                      <div key={child.name} className="rounded-lg px-3 py-1.5 text-center" style={{ background: `${colors[i + 1]}10`, border: `1px solid ${colors[i + 1]}25` }}>
                        <p className="text-[10px] font-medium text-gray-300">{child.name}</p>
                        <p className="text-[8px] text-gray-500">{child.role}</p>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <p className="text-[10px] text-gray-600 mt-2">Click any node to expand</p>
    </div>
  );
}

function KnowledgeHubPreview() {
  const [activePage, setActivePage] = useState(0);

  const pages = [
    { title: 'Getting Started', sections: ['Welcome to the team', 'First-week checklist', 'Key contacts'], icon: '📖' },
    { title: 'Brand Guidelines', sections: ['Logo usage', 'Color palette', 'Typography rules'], icon: '🎨' },
    { title: 'Engineering Wiki', sections: ['Architecture overview', 'API reference', 'Deploy process'], icon: '⚙️' },
    { title: 'HR Policies', sections: ['PTO policy', 'Benefits overview', 'Performance reviews'], icon: '📋' },
  ];

  const active = pages[activePage];

  return (
    <div className="grid grid-cols-[140px_1fr] gap-0 rounded-xl overflow-hidden h-full" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
      {/* Sidebar */}
      <div className="flex flex-col gap-0.5 py-2 px-1.5" style={{ background: 'rgba(255,255,255,0.02)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
        {pages.map((page, i) => (
          <button
            key={page.title}
            onClick={() => setActivePage(i)}
            className="text-left px-2.5 py-2 rounded-lg transition-all duration-200 flex items-center gap-2"
            style={{
              background: activePage === i ? '#60a5fa15' : 'transparent',
              borderLeft: activePage === i ? '2px solid #60a5fa' : '2px solid transparent',
            }}
          >
            <span className="text-[12px]">{page.icon}</span>
            <span className={`text-[11px] font-medium leading-tight ${activePage === i ? 'text-white' : 'text-gray-500'}`}>{page.title}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="px-5 py-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            <h4 className="text-[16px] font-bold text-white mb-1">{active.icon} {active.title}</h4>
            <div className="w-12 h-0.5 rounded-full bg-[#60a5fa] mb-4" />
            <div className="space-y-2.5">
              {active.sections.map((section, i) => (
                <motion.div
                  key={section}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-2.5"
                >
                  <ChevronRight className="w-3 h-3 text-[#60a5fa] flex-shrink-0" />
                  <span className="text-[12px] text-gray-300">{section}</span>
                </motion.div>
              ))}
            </div>
            <div className="mt-4 space-y-1.5">
              {[80, 100, 60].map((w, i) => (
                <div key={i} className="h-1.5 rounded-full" style={{ width: `${w}%`, background: 'rgba(255,255,255,0.04)' }} />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function ProjectTrackerPreview() {
  const [cards, setCards] = useState([
    { id: 1, name: 'Homepage redesign', col: 0 },
    { id: 2, name: 'API integration', col: 0 },
    { id: 3, name: 'User research', col: 1 },
    { id: 4, name: 'Mobile app v2', col: 1 },
    { id: 5, name: 'DB migration', col: 2 },
  ]);

  const columns = [
    { name: 'To Do', color: '#6b7280' },
    { name: 'In Progress', color: '#f59e0b' },
    { name: 'Done', color: '#10b981' },
  ];

  const moveCard = useCallback((cardId: number) => {
    setCards(prev => prev.map(c =>
      c.id === cardId ? { ...c, col: Math.min(c.col + 1, columns.length - 1) } : c
    ));
  }, []);

  return (
    <div className="h-full">
      <div className="grid grid-cols-3 gap-2.5 h-full">
        {columns.map((col, colIdx) => (
          <div key={col.name} className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col.color }} />
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{col.name}</span>
              <span className="text-[10px] text-gray-600 ml-auto">{cards.filter(c => c.col === colIdx).length}</span>
            </div>
            <AnimatePresence>
              {cards.filter(c => c.col === colIdx).map(card => (
                <motion.button
                  key={card.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={() => colIdx < columns.length - 1 && moveCard(card.id)}
                  className="text-left rounded-lg px-3 py-2.5 transition-colors group"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderLeft: `3px solid ${col.color}`,
                    cursor: colIdx < columns.length - 1 ? 'pointer' : 'default',
                  }}
                  whileHover={colIdx < columns.length - 1 ? { x: 3 } : {}}
                >
                  <span className="text-[11px] font-medium text-gray-300">{card.name}</span>
                  {colIdx < columns.length - 1 && (
                    <span className="text-[9px] text-gray-600 block mt-0.5 group-hover:text-[#34d399] transition-colors">Click to advance →</span>
                  )}
                  {colIdx === columns.length - 1 && (
                    <span className="text-[9px] text-[#10b981] block mt-0.5 flex items-center gap-1">
                      <Check className="w-2.5 h-2.5" /> Complete
                    </span>
                  )}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-gray-600 text-center mt-3">Click cards to move them forward</p>
    </div>
  );
}

function CRMDashboardPreview() {
  const [expandedStage, setExpandedStage] = useState<number | null>(null);

  const stages = [
    { name: 'Lead', count: 24, value: '$48K', color: '#6b7280', deals: ['Acme Corp', 'TechStart Inc', 'DataFlow'] },
    { name: 'Qualified', count: 12, value: '$96K', color: '#60a5fa', deals: ['Enterprise Co', 'ScaleUp Ltd'] },
    { name: 'Proposal', count: 8, value: '$210K', color: '#fbbf24', deals: ['MegaCorp', 'CloudFirst'] },
    { name: 'Closed Won', count: 5, value: '$380K', color: '#10b981', deals: ['Alpha Inc'] },
  ];

  return (
    <div className="space-y-3 py-2">
      {/* Pipeline funnel */}
      <div className="space-y-1.5">
        {stages.map((stage, i) => {
          const isExpanded = expandedStage === i;
          const widthPct = 100 - i * 18;
          return (
            <div key={stage.name}>
              <motion.button
                onClick={() => setExpandedStage(isExpanded ? null : i)}
                className="w-full text-left rounded-lg px-3 py-2.5 transition-all group"
                style={{
                  width: `${widthPct}%`,
                  background: isExpanded ? `${stage.color}18` : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${isExpanded ? `${stage.color}40` : 'rgba(255,255,255,0.06)'}`,
                  marginLeft: `${(100 - widthPct) / 2}%`,
                }}
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: stage.color }} />
                    <span className="text-[12px] font-semibold text-gray-300">{stage.name}</span>
                    <span className="text-[10px] text-gray-600">{stage.count} deals</span>
                  </div>
                  <span className="text-[12px] font-bold" style={{ color: stage.color }}>{stage.value}</span>
                </div>
              </motion.button>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                    style={{ width: `${widthPct}%`, marginLeft: `${(100 - widthPct) / 2}%` }}
                  >
                    <div className="flex gap-2 py-2 px-1">
                      {stage.deals.map(deal => (
                        <div key={deal} className="rounded-md px-2.5 py-1.5" style={{ background: `${stage.color}12`, border: `1px solid ${stage.color}25` }}>
                          <p className="text-[10px] font-medium text-gray-300">{deal}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
      <p className="text-[10px] text-gray-600 text-center">Click a stage to see deals</p>
    </div>
  );
}

function ResourcePlanningPreview() {
  const [activeRow, setActiveRow] = useState<number | null>(null);

  const team = [
    { name: 'Sarah C.', role: 'Designer', load: 85, color: '#a78bfa', projects: ['Brand refresh', 'App UI'] },
    { name: 'James K.', role: 'Engineer', load: 60, color: '#60a5fa', projects: ['API v2', 'DB migration'] },
    { name: 'Maria L.', role: 'PM', load: 95, color: '#f472b6', projects: ['Q4 Launch', 'Roadmap', 'Standup'] },
    { name: 'Alex R.', role: 'Analyst', load: 40, color: '#34d399', projects: ['Market research'] },
  ];

  return (
    <div className="space-y-2 py-2">
      {/* Header */}
      <div className="grid grid-cols-[100px_1fr_50px] gap-2 px-2 pb-1" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Member</span>
        <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Capacity</span>
        <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider text-right">Load</span>
      </div>

      {team.map((member, i) => {
        const isActive = activeRow === i;
        const overloaded = member.load > 90;
        return (
          <div key={member.name}>
            <motion.button
              onClick={() => setActiveRow(isActive ? null : i)}
              className="w-full grid grid-cols-[100px_1fr_50px] gap-2 items-center px-2 py-2 rounded-lg transition-all"
              style={{
                background: isActive ? `${member.color}12` : 'transparent',
                border: `1px solid ${isActive ? `${member.color}30` : 'transparent'}`,
              }}
              whileHover={{ backgroundColor: `${member.color}08` }}
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[8px] font-bold" style={{ backgroundColor: member.color }}>
                  {member.name.split(' ').map(w => w[0]).join('')}
                </div>
                <div className="text-left">
                  <p className="text-[11px] font-medium text-gray-300 leading-tight">{member.name}</p>
                  <p className="text-[9px] text-gray-600">{member.role}</p>
                </div>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <motion.div
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${member.load}%` }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  style={{
                    backgroundColor: overloaded ? '#ef4444' : member.color,
                    boxShadow: isActive ? `0 0 8px ${member.color}40` : undefined,
                  }}
                />
              </div>
              <span className={`text-[11px] font-bold text-right ${overloaded ? 'text-red-400' : 'text-gray-400'}`}>{member.load}%</span>
            </motion.button>

            <AnimatePresence>
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden pl-10 pr-2 pb-1"
                >
                  <div className="flex gap-1.5 flex-wrap py-1.5">
                    {member.projects.map(proj => (
                      <span key={proj} className="text-[9px] font-medium px-2 py-0.5 rounded-full" style={{ background: `${member.color}15`, color: member.color, border: `1px solid ${member.color}25` }}>
                        {proj}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
      <p className="text-[10px] text-gray-600 text-center mt-1">Click a team member to see assignments</p>
    </div>
  );
}

function IntakeFormsPreview() {
  const [checkedFields, setCheckedFields] = useState<Record<string, boolean>>({});
  const [selectedRadio, setSelectedRadio] = useState<string | null>(null);
  const [typingField, setTypingField] = useState<string | null>(null);
  const [typedText, setTypedText] = useState('');

  const toggleCheck = (id: string) => setCheckedFields(prev => ({ ...prev, [id]: !prev[id] }));

  const startTyping = (id: string) => {
    if (typingField === id) return;
    setTypingField(id);
    setTypedText('');
    const text = id === 'name' ? 'Jane Cooper' : 'Need access to analytics dashboard';
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(text.slice(0, ++i));
      if (i >= text.length) clearInterval(interval);
    }, 40);
  };

  const fields = [
    { id: 'name', type: 'text', label: 'Full Name', placeholder: 'Enter your name' },
    { id: 'priority', type: 'radio', label: 'Priority', options: ['Low', 'Medium', 'High'] },
    { id: 'description', type: 'text', label: 'Description', placeholder: 'Describe your request' },
    { id: 'notify_manager', type: 'checkbox', label: 'Notify my manager' },
    { id: 'attach_files', type: 'checkbox', label: 'Attach supporting files' },
  ];

  return (
    <div className="rounded-xl py-3 px-1 space-y-3">
      <div className="flex items-center gap-2 mb-2 px-2">
        <FileInput className="w-4 h-4 text-[#f472b6]" />
        <span className="text-[12px] font-bold text-white">IT Request Form</span>
        <span className="text-[9px] font-medium text-[#f472b6] bg-[#f472b6]/10 px-2 py-0.5 rounded-full ml-auto">Live</span>
      </div>

      {fields.map(field => (
        <div key={field.id} className="px-2">
          <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">{field.label}</label>
          {field.type === 'text' && (
            <motion.button
              onClick={() => startTyping(field.id)}
              className="w-full text-left rounded-lg px-3 py-2 transition-all"
              style={{
                background: typingField === field.id ? '#f472b610' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${typingField === field.id ? '#f472b640' : 'rgba(255,255,255,0.06)'}`,
              }}
            >
              <span className={`text-[11px] ${typingField === field.id ? 'text-gray-200' : 'text-gray-600'}`}>
                {typingField === field.id ? typedText : field.placeholder}
                {typingField === field.id && (
                  <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.6, repeat: Infinity }} className="inline-block w-[1.5px] h-[12px] bg-[#f472b6] ml-0.5 align-middle" />
                )}
              </span>
            </motion.button>
          )}
          {field.type === 'radio' && field.options && (
            <div className="flex gap-2">
              {field.options.map(opt => (
                <button
                  key={opt}
                  onClick={() => setSelectedRadio(opt)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-all"
                  style={{
                    background: selectedRadio === opt ? '#f472b615' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${selectedRadio === opt ? '#f472b640' : 'rgba(255,255,255,0.06)'}`,
                    color: selectedRadio === opt ? '#f472b6' : '#9ca3af',
                  }}
                >
                  <div className="w-3 h-3 rounded-full border flex items-center justify-center" style={{ borderColor: selectedRadio === opt ? '#f472b6' : '#555' }}>
                    {selectedRadio === opt && <div className="w-1.5 h-1.5 rounded-full bg-[#f472b6]" />}
                  </div>
                  {opt}
                </button>
              ))}
            </div>
          )}
          {field.type === 'checkbox' && (
            <button
              onClick={() => toggleCheck(field.id)}
              className="flex items-center gap-2 px-2 py-1 rounded-lg text-[11px] transition-all"
              style={{ color: checkedFields[field.id] ? '#f472b6' : '#9ca3af' }}
            >
              <div
                className="w-4 h-4 rounded flex items-center justify-center transition-all"
                style={{
                  background: checkedFields[field.id] ? '#f472b6' : 'transparent',
                  border: `1.5px solid ${checkedFields[field.id] ? '#f472b6' : '#555'}`,
                }}
              >
                {checkedFields[field.id] && <Check className="w-2.5 h-2.5 text-white" />}
              </div>
              {field.label}
            </button>
          )}
        </div>
      ))}
      <p className="text-[10px] text-gray-600 text-center mt-1">Click fields to interact</p>
    </div>
  );
}

const PREVIEW_COMPONENTS: Record<string, React.FC> = {
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

function ReplacedToolsPanel({ tools, color }: { tools: ReplacedTool[]; color: string }) {
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
   MAIN SECTION
   ═══════════════════════════════════════════════════════════ */

export function ConsolidationSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const hoverRef = useRef(false);
  const autoRef = useRef<ReturnType<typeof setTimeout>>();

  const active = TOOL_CATEGORIES[activeIdx];
  const ActivePreview = PREVIEW_COMPONENTS[active.id];

  // Auto-cycle
  useEffect(() => {
    clearTimeout(autoRef.current);
    if (!hoverRef.current) {
      autoRef.current = setTimeout(() => {
        setActiveIdx(prev => (prev + 1) % TOOL_CATEGORIES.length);
      }, 6000);
    }
    return () => clearTimeout(autoRef.current);
  }, [activeIdx]);

  const handleTabClick = useCallback((idx: number) => {
    setActiveIdx(idx);
  }, []);

  // Count how many total tools are "replaced"
  const totalReplaced = TOOL_CATEGORIES.reduce((sum, cat) => sum + cat.replacedTools.length, 0);

  return (
    <section
      className="py-16 sm:py-20 px-4 sm:px-6 relative overflow-hidden"
      style={{ backgroundColor: '#0a0a0a' }}
      onMouseEnter={() => { hoverRef.current = true; clearTimeout(autoRef.current); }}
      onMouseLeave={() => { hoverRef.current = false; }}
    >
      {/* Ambient glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full pointer-events-none"
        animate={{ background: `radial-gradient(ellipse, ${active.color}08 0%, transparent 65%)` }}
        transition={{ duration: 1 }}
        style={{ filter: 'blur(80px)' }}
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
            <span style={{ color: active.color }} className="transition-colors duration-500">Replace them all.</span>
          </h2>
          <p className="text-lg text-gray-500 leading-relaxed max-w-[600px] mx-auto">
            Stop paying for a dozen tools that don't talk to each other.
            <br />
            Build exactly what you need — on one platform.
          </p>
        </motion.div>

        {/* Category tabs */}
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
                onClick={() => handleTabClick(i)}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-semibold transition-all duration-300"
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

        {/* Main interactive area */}
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
          {/* Accent bar */}
          <div className="h-[3px] w-full transition-all duration-500" style={{ background: `linear-gradient(90deg, ${active.color}, ${active.color}50)` }} />

          {/* Tagline */}
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

          {/* Split: preview + replaced tools */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.6fr] min-h-[420px]">
            {/* Left: Interactive preview */}
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

            {/* Right: Replaced tools */}
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

        {/* Bottom counter + CTA */}
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
    </section>
  );
}
