import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useMemo, useRef } from 'react';
import {
  Bot, CheckCircle2, Plug, BarChart3, PenTool,
  Mail, Globe, Activity, FileText, Calendar, Shield,
  Users, Megaphone, Zap, Workflow, MessageSquare, MapPin,
  Database, Plus, Clock, LayoutGrid, Loader2,
  type LucideIcon,
} from 'lucide-react';
import { useDepartmentData } from '@/hooks/useSupabase';
import type { DepartmentRow } from '@/types/database';
import { getToolLogo } from '@/app/utils/toolLogos';
import vibeLogo from '@/assets/069a22575b2de9057cfc00d9b4538d072f7fe115.png';

export interface ShowcaseJTBDInput {
  id: string;
  title: string;
  tagline: string;
  icon: LucideIcon;
  agents: { description: string; valueAccent: string };
  vibe: { description: string; replacesTools: string[]; valueAccent: string };
  mondayDB: { description: string; valueAccent: string };
  context: { description: string; valueAccent: string };
}

interface BoardTask {
  task: string;
  status: 'todo' | 'in_progress' | 'done';
  agentIdx?: number;
}

type ViewType = 'kanban' | 'table' | 'canvas' | 'calendar';

interface WSData {
  boardTasks: BoardTask[];
  integrations: string[];
  viewType?: ViewType;
}

interface AppIconInfo { icon: LucideIcon; bg: string; fg: string }
const APP_ICONS: [string, AppIconInfo][] = [
  ['campaign', { icon: Megaphone, bg: 'bg-orange-50', fg: 'text-orange-500' }],
  ['email', { icon: Mail, bg: 'bg-blue-50', fg: 'text-blue-500' }],
  ['event', { icon: Calendar, bg: 'bg-pink-50', fg: 'text-pink-500' }],
  ['content', { icon: PenTool, bg: 'bg-purple-50', fg: 'text-purple-500' }],
  ['dashboard', { icon: BarChart3, bg: 'bg-violet-50', fg: 'text-violet-500' }],
  ['analytics', { icon: BarChart3, bg: 'bg-cyan-50', fg: 'text-cyan-500' }],
  ['report', { icon: FileText, bg: 'bg-amber-50', fg: 'text-amber-500' }],
  ['tracker', { icon: Activity, bg: 'bg-emerald-50', fg: 'text-emerald-500' }],
  ['form', { icon: FileText, bg: 'bg-blue-50', fg: 'text-blue-500' }],
  ['chat', { icon: MessageSquare, bg: 'bg-green-50', fg: 'text-green-500' }],
  ['calendar', { icon: Calendar, bg: 'bg-red-50', fg: 'text-red-500' }],
  ['board', { icon: LayoutGrid, bg: 'bg-indigo-50', fg: 'text-indigo-500' }],
  ['workflow', { icon: Workflow, bg: 'bg-teal-50', fg: 'text-teal-500' }],
  ['pipeline', { icon: Activity, bg: 'bg-sky-50', fg: 'text-sky-500' }],
  ['planner', { icon: Calendar, bg: 'bg-rose-50', fg: 'text-rose-500' }],
  ['score', { icon: BarChart3, bg: 'bg-amber-50', fg: 'text-amber-500' }],
  ['check', { icon: CheckCircle2, bg: 'bg-emerald-50', fg: 'text-emerald-500' }],
  ['help', { icon: MessageSquare, bg: 'bg-sky-50', fg: 'text-sky-500' }],
  ['desk', { icon: MessageSquare, bg: 'bg-sky-50', fg: 'text-sky-500' }],
  ['contract', { icon: FileText, bg: 'bg-slate-50', fg: 'text-slate-500' }],
  ['budget', { icon: BarChart3, bg: 'bg-emerald-50', fg: 'text-emerald-500' }],
  ['hire', { icon: Users, bg: 'bg-violet-50', fg: 'text-violet-500' }],
  ['recruit', { icon: Users, bg: 'bg-violet-50', fg: 'text-violet-500' }],
  ['interview', { icon: Users, bg: 'bg-pink-50', fg: 'text-pink-500' }],
  ['offer', { icon: FileText, bg: 'bg-green-50', fg: 'text-green-500' }],
];
function getAppIcon(name: string): AppIconInfo {
  const lower = name.toLowerCase();
  for (const [key, info] of APP_ICONS) {
    if (lower.includes(key)) return info;
  }
  return { icon: LayoutGrid, bg: 'bg-gray-50', fg: 'text-gray-400' };
}

/* ═══════════════════════════════════════════════════════════════════
   JTBD Board Tasks + Integrations
   ═══════════════════════════════════════════════════════════════════ */

const WS_DATA: Record<string, WSData> = {
  'launch-campaign': {
    viewType: 'kanban',
    boardTasks: [
      { task: 'Segment audience', status: 'done', agentIdx: 0 },
      { task: 'Design email template', status: 'in_progress', agentIdx: 1 },
      { task: 'Set up A/B test', status: 'todo', agentIdx: 0 },
      { task: 'Schedule send', status: 'todo' },
      { task: 'Analyze open rates', status: 'todo', agentIdx: 0 },
    ],
    integrations: ['Mailchimp', 'HubSpot', 'Google Analytics', 'Salesforce'],
  },
  'research-market': {
    viewType: 'canvas',
    boardTasks: [
      { task: 'Scan competitors', status: 'done', agentIdx: 0 },
      { task: 'Analyze market trends', status: 'in_progress', agentIdx: 0 },
      { task: 'Generate insights', status: 'todo', agentIdx: 1 },
      { task: 'Update positioning', status: 'todo' },
      { task: 'Share findings', status: 'todo', agentIdx: 1 },
    ],
    integrations: ['Crayon', 'Semrush', 'Google Trends', 'LinkedIn'],
  },
  'build-event-app': {
    viewType: 'calendar',
    boardTasks: [
      { task: 'Set up registration', status: 'done', agentIdx: 0 },
      { task: 'Configure RSVP flow', status: 'in_progress', agentIdx: 0 },
      { task: 'Design landing page', status: 'todo', agentIdx: 1 },
      { task: 'Send invitations', status: 'todo' },
      { task: 'Track attendance', status: 'todo', agentIdx: 0 },
    ],
    integrations: ['Eventbrite', 'Zoom', 'Google Calendar', 'Slack'],
  },
  'create-content': {
    viewType: 'table',
    boardTasks: [
      { task: 'Draft blog post', status: 'done', agentIdx: 0 },
      { task: 'Create social assets', status: 'in_progress', agentIdx: 0 },
      { task: 'Review brand voice', status: 'todo', agentIdx: 1 },
      { task: 'Schedule posts', status: 'todo' },
      { task: 'Track engagement', status: 'todo', agentIdx: 1 },
    ],
    integrations: ['WordPress', 'Canva', 'Buffer', 'Google Docs'],
  },
  'analyze-performance': {
    viewType: 'kanban',
    boardTasks: [
      { task: 'Pull campaign metrics', status: 'done', agentIdx: 0 },
      { task: 'Build attribution model', status: 'in_progress', agentIdx: 0 },
      { task: 'Compare channels', status: 'todo', agentIdx: 1 },
      { task: 'Flag anomalies', status: 'todo', agentIdx: 0 },
      { task: 'Generate report', status: 'todo', agentIdx: 1 },
    ],
    integrations: ['Google Analytics', 'Facebook Ads', 'HubSpot', 'Tableau'],
  },
  'qualify-leads': {
    viewType: 'table',
    boardTasks: [
      { task: 'Enrich lead data', status: 'done', agentIdx: 0 },
      { task: 'Score inbound leads', status: 'in_progress', agentIdx: 0 },
      { task: 'Route to sales reps', status: 'todo', agentIdx: 0 },
      { task: 'Send intro emails', status: 'todo', agentIdx: 1 },
      { task: 'Schedule discovery', status: 'todo' },
    ],
    integrations: ['Salesforce', 'LinkedIn', 'ZoomInfo', 'Outreach'],
  },
  'close-deals': {
    viewType: 'kanban',
    boardTasks: [
      { task: 'Prepare proposal', status: 'done', agentIdx: 0 },
      { task: 'Send contract', status: 'in_progress', agentIdx: 0 },
      { task: 'Track negotiation', status: 'todo', agentIdx: 1 },
      { task: 'Schedule follow-up', status: 'todo' },
      { task: 'Record outcome', status: 'todo', agentIdx: 0 },
    ],
    integrations: ['Salesforce', 'DocuSign', 'Gong', 'Slack'],
  },
  'automate-workflows': {
    viewType: 'canvas',
    boardTasks: [
      { task: 'Map current process', status: 'done', agentIdx: 0 },
      { task: 'Identify bottlenecks', status: 'in_progress', agentIdx: 0 },
      { task: 'Build automation', status: 'todo', agentIdx: 1 },
      { task: 'Test workflow', status: 'todo' },
      { task: 'Deploy to team', status: 'todo', agentIdx: 1 },
    ],
    integrations: ['Zapier', 'Slack', 'Jira', 'Asana'],
  },
  'resolve-tickets': {
    viewType: 'table',
    boardTasks: [
      { task: 'Triage incoming', status: 'done', agentIdx: 0 },
      { task: 'Suggest solutions', status: 'in_progress', agentIdx: 0 },
      { task: 'Auto-resolve common', status: 'todo', agentIdx: 0 },
      { task: 'Escalate complex', status: 'todo', agentIdx: 1 },
      { task: 'Update KB', status: 'todo', agentIdx: 1 },
    ],
    integrations: ['Zendesk', 'Slack', 'Confluence', 'Intercom'],
  },
  'prioritize-roadmap': {
    viewType: 'canvas',
    boardTasks: [
      { task: 'Collect requests', status: 'done', agentIdx: 0 },
      { task: 'Score by impact', status: 'in_progress', agentIdx: 0 },
      { task: 'Review with team', status: 'todo', agentIdx: 1 },
      { task: 'Update roadmap', status: 'todo' },
      { task: 'Share decisions', status: 'todo', agentIdx: 1 },
    ],
    integrations: ['Jira', 'Productboard', 'Slack', 'Intercom'],
  },
  'review-contracts': {
    viewType: 'table',
    boardTasks: [
      { task: 'Extract key terms', status: 'done', agentIdx: 0 },
      { task: 'Flag risk clauses', status: 'in_progress', agentIdx: 0 },
      { task: 'Compare to templates', status: 'todo', agentIdx: 1 },
      { task: 'Suggest redlines', status: 'todo', agentIdx: 0 },
      { task: 'Track approval', status: 'todo' },
    ],
    integrations: ['Ironclad', 'DocuSign', 'Google Drive', 'Slack'],
  },
  'budget-planning': {
    viewType: 'calendar',
    boardTasks: [
      { task: 'Collect dept requests', status: 'done', agentIdx: 0 },
      { task: 'Build forecast', status: 'in_progress', agentIdx: 0 },
      { task: 'Run scenarios', status: 'todo', agentIdx: 1 },
      { task: 'Present to CFO', status: 'todo' },
      { task: 'Finalize allocations', status: 'todo', agentIdx: 1 },
    ],
    integrations: ['SAP', 'Excel', 'Google Sheets', 'Slack'],
  },
  'recruit-talent': {
    viewType: 'kanban',
    boardTasks: [
      { task: 'Post job openings', status: 'done', agentIdx: 0 },
      { task: 'Screen resumes', status: 'in_progress', agentIdx: 0 },
      { task: 'Schedule interviews', status: 'todo', agentIdx: 1 },
      { task: 'Collect scorecards', status: 'todo' },
      { task: 'Send offer letters', status: 'todo', agentIdx: 0 },
    ],
    integrations: ['Greenhouse', 'LinkedIn', 'Calendly', 'Slack'],
  },
};

function getWSData(jtbd: ShowcaseJTBDInput): WSData {
  if (WS_DATA[jtbd.id]) return WS_DATA[jtbd.id];
  const noun = jtbd.title.split(' ').slice(1).join(' ') || jtbd.title;
  return {
    boardTasks: [
      { task: `Gather ${noun.toLowerCase()} data`, status: 'done', agentIdx: 0 },
      { task: `Analyze ${noun.toLowerCase()}`, status: 'in_progress', agentIdx: 0 },
      { task: `Build tracking view`, status: 'todo', agentIdx: 1 },
      { task: `Review and validate`, status: 'todo' },
      { task: `Share with team`, status: 'todo', agentIdx: 1 },
    ],
    integrations: jtbd.vibe.replacesTools.length > 0
      ? [...jtbd.vibe.replacesTools, 'Slack'].slice(0, 4)
      : ['Slack', 'Google Drive', 'Jira', 'Notion'],
  };
}

/* ═══════════════════════════════════════════════════════════════════
   Animation Hook
   ═══════════════════════════════════════════════════════════════════ */

function useWorkspaceAnimation(boardTasks: BoardTask[], jobId: string) {
  const [animStep, setAnimStep] = useState(0);

  useEffect(() => {
    setAnimStep(0);
    const interval = setInterval(() => setAnimStep(s => s + 1), 3500);
    return () => clearInterval(interval);
  }, [jobId]);

  return useMemo(() => {
    const initial = boardTasks.map(t => t.status);
    const statuses: ('todo' | 'in_progress' | 'done')[] = [...initial];

    let totalMoves = 0;
    const temp = [...initial];
    while (true) {
      const idx = temp.findIndex(s => s !== 'done');
      if (idx === -1) break;
      temp[idx] = temp[idx] === 'todo' ? 'in_progress' : 'done';
      totalMoves++;
    }

    const cycleLen = totalMoves + 3;
    const step = animStep % cycleLen;

    let movingTaskIdx: number | null = null;
    let actionType: 'started working on' | 'completed' = 'started working on';

    for (let s = 0; s < Math.min(step, totalMoves); s++) {
      const idx = statuses.findIndex(st => st !== 'done');
      if (idx === -1) break;
      const prev = statuses[idx];
      statuses[idx] = prev === 'todo' ? 'in_progress' : 'done';
      if (s === step - 1) {
        movingTaskIdx = idx;
        actionType = prev === 'todo' ? 'started working on' : 'completed';
      }
    }

    return { statuses, movingTaskIdx, actionType };
  }, [boardTasks, animStep]);
}

/* ═══════════════════════════════════════════════════════════════════
   Floating Agent Cursor (like JTBD Workspace)
   ═══════════════════════════════════════════════════════════════════ */

function FloatingAgentCursor({
  agentImage,
  agentName,
  targetId,
  boardRef,
  show,
}: {
  agentImage?: string | null;
  agentName: string;
  targetId: string;
  boardRef: React.RefObject<HTMLDivElement | null>;
  show: boolean;
}) {
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!show || !boardRef.current) { setReady(false); return; }
    requestAnimationFrame(() => {
      setTimeout(() => {
        if (!boardRef.current) return;
        const el = boardRef.current.querySelector(`[data-cursor-target="${targetId}"]`);
        if (!el) return;
        const bRect = boardRef.current.getBoundingClientRect();
        const eRect = el.getBoundingClientRect();
        setPos({
          top: eRect.top - bRect.top + eRect.height * 0.55,
          left: eRect.left - bRect.left + eRect.width * 0.75,
        });
        setReady(true);
      }, 100);
    });
  }, [show, targetId, boardRef]);

  if (!ready) return null;

  return (
    <motion.div
      className="absolute z-30 pointer-events-none"
      initial={{ opacity: 0, scale: 0.4, top: pos.top + 30, left: pos.left + 20 }}
      animate={{ opacity: 1, scale: 1, top: pos.top, left: pos.left }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ type: 'spring', stiffness: 80, damping: 18 }}
    >
      <svg width="14" height="20" viewBox="0 0 12 18" fill="none" className="drop-shadow-sm">
        <path d="M1 1L11 9L5 10L7 17L1 1Z" fill="#10b981" stroke="white" strokeWidth="1.5" />
      </svg>
      <div className="mt-0.5 flex items-center gap-1 bg-emerald-500 rounded-full pl-0.5 pr-2 py-0.5 shadow-lg whitespace-nowrap">
        {agentImage ? (
          <img src={agentImage} alt="" className="w-5 h-5 rounded-full object-cover border border-white/40" />
        ) : (
          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
            <Bot className="w-3 h-3 text-white" />
          </div>
        )}
        <span className="text-[8px] font-semibold text-white leading-none">{agentName}</span>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Workspace Board (full-width, with cursor)
   ═══════════════════════════════════════════════════════════════════ */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function WorkspaceBoard({
  tasks,
  statuses,
  realAgents,
  movingTaskIdx,
  jobId,
}: {
  tasks: BoardTask[];
  statuses: ('todo' | 'in_progress' | 'done')[];
  realAgents: any[];
  movingTaskIdx: number | null;
  jobId: string;
}) {
  const boardRef = useRef<HTMLDivElement>(null);

  const columns = [
    { key: 'todo' as const, label: 'To Do', headerColor: 'text-gray-500', bgColor: 'bg-gray-50/80', dotColor: 'bg-gray-300' },
    { key: 'in_progress' as const, label: 'In Progress', headerColor: 'text-[#6161ff]', bgColor: 'bg-[#6161ff]/[0.03]', dotColor: 'bg-[#6161ff]' },
    { key: 'done' as const, label: 'Done', headerColor: 'text-emerald-500', bgColor: 'bg-emerald-50/40', dotColor: 'bg-emerald-400' },
  ];

  const movingTask = movingTaskIdx !== null ? tasks[movingTaskIdx] : null;
  const cursorAgent = movingTask?.agentIdx != null && movingTask.agentIdx < realAgents.length
    ? realAgents[movingTask.agentIdx]
    : null;

  return (
    <div ref={boardRef} className="relative rounded-xl border border-gray-200 bg-white shadow-sm h-full flex flex-col" style={{ overflow: 'visible' }}>
      <AnimatePresence>
        {movingTaskIdx !== null && cursorAgent && (
          <FloatingAgentCursor
            key={`cursor-${jobId}-${movingTaskIdx}`}
            agentImage={cursorAgent.image}
            agentName={cursorAgent.name}
            targetId={`task-${movingTaskIdx}`}
            boardRef={boardRef}
            show
          />
        )}
      </AnimatePresence>

      <div className="grid grid-cols-3 divide-x divide-gray-100 rounded-xl overflow-hidden flex-1">
        {columns.map(col => {
          const colTasks = tasks
            .map((t, i) => ({ ...t, idx: i, currentStatus: statuses[i] }))
            .filter(t => t.currentStatus === col.key);

          return (
            <div key={col.key} className={`${col.bgColor} p-2.5`}>
              <div className="flex items-center gap-1.5 mb-3">
                <div className={`w-1.5 h-1.5 rounded-full ${col.dotColor}`} />
                <span className={`text-[9px] font-bold uppercase tracking-wider ${col.headerColor}`}>{col.label}</span>
                <span className="text-[8px] text-gray-300 ml-auto">{colTasks.length}</span>
              </div>
              <div className="flex flex-col gap-2">
                {colTasks.map(task => {
                  const agent = task.agentIdx != null && task.agentIdx < realAgents.length
                    ? realAgents[task.agentIdx]
                    : null;
                  const isMoving = task.idx === movingTaskIdx;

                  return (
                    <motion.div
                      key={`${jobId}-${task.task}`}
                      layout
                      layoutId={`ws-task-${jobId}-${task.task}`}
                      data-cursor-target={`task-${task.idx}`}
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        boxShadow: isMoving ? '0 0 14px rgba(97,97,255,0.15)' : '0 1px 2px rgba(0,0,0,0.04)',
                      }}
                      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                      className={`bg-white rounded-lg border p-2.5 ${isMoving ? 'border-[#6161ff]/30 ring-1 ring-[#6161ff]/10' : 'border-gray-100'}`}
                    >
                      <p className="text-[11px] text-gray-700 font-medium leading-snug">{task.task}</p>
                      {agent && (
                        <div className="flex items-center gap-1.5 mt-2">
                          {agent.image ? (
                            <motion.img
                              src={agent.image}
                              alt={agent.name}
                              className="w-5 h-5 rounded-full object-cover"
                              animate={isMoving ? {
                                boxShadow: ['0 0 0 0px rgba(16,185,129,0.4)', '0 0 0 3px rgba(16,185,129,0.15)', '0 0 0 0px rgba(16,185,129,0.4)'],
                              } : {}}
                              transition={{ duration: 1.5, repeat: isMoving ? Infinity : 0 }}
                            />
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#6161ff] to-purple-400 flex items-center justify-center">
                              <Bot className="w-3 h-3 text-white" />
                            </div>
                          )}
                          <span className="text-[8px] text-gray-400">{agent.name}</span>
                        </div>
                      )}
                      {col.key === 'done' && (
                        <div className="flex items-center gap-0.5 mt-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span className="text-[8px] text-emerald-500 font-medium">Complete</span>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Table View — monday.com style board rows
   ═══════════════════════════════════════════════════════════════════ */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function WorkspaceTable({
  tasks,
  statuses,
  realAgents,
  movingTaskIdx,
  jobId,
}: {
  tasks: BoardTask[];
  statuses: ('todo' | 'in_progress' | 'done')[];
  realAgents: any[];
  movingTaskIdx: number | null;
  jobId: string;
}) {
  const statusConfig = {
    todo: { label: 'To Do', bg: 'bg-gray-100', text: 'text-gray-500', dot: 'bg-gray-300' },
    in_progress: { label: 'Working', bg: 'bg-[#6161ff]/10', text: 'text-[#6161ff]', dot: 'bg-[#6161ff]' },
    done: { label: 'Done', bg: 'bg-emerald-50', text: 'text-emerald-600', dot: 'bg-emerald-400' },
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm h-full flex flex-col overflow-hidden">
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-0 bg-gray-50/80 border-b border-gray-200 text-[9px] font-bold uppercase tracking-wider text-gray-400">
        <div className="col-span-5 px-3 py-2.5">Task</div>
        <div className="col-span-3 px-3 py-2.5 border-l border-gray-100">Status</div>
        <div className="col-span-2 px-3 py-2.5 border-l border-gray-100">Owner</div>
        <div className="col-span-2 px-3 py-2.5 border-l border-gray-100">Priority</div>
      </div>
      {/* Table Rows */}
      <div className="flex-1 divide-y divide-gray-50">
        {tasks.map((task, idx) => {
          const status = statuses[idx];
          const sc = statusConfig[status];
          const agent = task.agentIdx != null && task.agentIdx < realAgents.length ? realAgents[task.agentIdx] : null;
          const isMoving = idx === movingTaskIdx;
          const priorities = ['High', 'Medium', 'Low', 'Medium', 'Low'];
          const prioColors: Record<string, string> = { High: 'bg-red-50 text-red-500', Medium: 'bg-amber-50 text-amber-500', Low: 'bg-blue-50 text-blue-400' };
          const prio = priorities[idx % priorities.length];

          return (
            <motion.div
              key={`${jobId}-${task.task}`}
              layout
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0, backgroundColor: isMoving ? 'rgba(97,97,255,0.04)' : 'transparent' }}
              transition={{ delay: idx * 0.04, duration: 0.25 }}
              className={`grid grid-cols-12 gap-0 items-center ${isMoving ? 'ring-1 ring-[#6161ff]/10' : ''}`}
            >
              <div className="col-span-5 px-3 py-2.5 flex items-center gap-2">
                <div className={`w-1 h-6 rounded-full flex-shrink-0 ${sc.dot}`} />
                <span className="text-[11px] text-gray-700 font-medium truncate">{task.task}</span>
              </div>
              <div className="col-span-3 px-3 py-2.5 border-l border-gray-50">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold ${sc.bg} ${sc.text}`}>
                  <span className={`w-1 h-1 rounded-full ${sc.dot}`} />
                  {sc.label}
                </span>
              </div>
              <div className="col-span-2 px-3 py-2.5 border-l border-gray-50">
                {agent ? (
                  <div className="flex items-center gap-1.5">
                    {agent.image ? (
                      <img src={agent.image} alt={agent.name} className="w-5 h-5 rounded-full object-cover" />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#6161ff] to-purple-400 flex items-center justify-center">
                        <Bot className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <span className="text-[8px] text-gray-400 truncate">{agent.name.split(' ')[0]}</span>
                  </div>
                ) : (
                  <span className="text-[8px] text-gray-300">—</span>
                )}
              </div>
              <div className="col-span-2 px-3 py-2.5 border-l border-gray-50">
                <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${prioColors[prio]}`}>{prio}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Canvas View — connected nodes showing a workflow/process
   ═══════════════════════════════════════════════════════════════════ */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function WorkspaceCanvas({
  tasks,
  statuses,
  realAgents,
  movingTaskIdx,
  jobId,
}: {
  tasks: BoardTask[];
  statuses: ('todo' | 'in_progress' | 'done')[];
  realAgents: any[];
  movingTaskIdx: number | null;
  jobId: string;
}) {
  const statusColors = {
    todo: { border: 'border-gray-200', bg: 'bg-white', ring: '', dot: 'bg-gray-300' },
    in_progress: { border: 'border-[#6161ff]/30', bg: 'bg-[#6161ff]/[0.03]', ring: 'ring-1 ring-[#6161ff]/10', dot: 'bg-[#6161ff]' },
    done: { border: 'border-emerald-200', bg: 'bg-emerald-50/40', ring: '', dot: 'bg-emerald-400' },
  };

  const nodePositions = [
    { left: '8%', top: '15%' },
    { left: '38%', top: '4%' },
    { left: '68%', top: '12%' },
    { left: '22%', top: '58%' },
    { left: '58%', top: '62%' },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm h-full flex flex-col overflow-hidden">
      {/* Canvas toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100 bg-gray-50/40">
        <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Canvas View</span>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="flex items-center gap-1 text-[8px] text-gray-300"><span className="w-1.5 h-1.5 rounded-full bg-gray-300" /> To Do</div>
          <div className="flex items-center gap-1 text-[8px] text-[#6161ff]"><span className="w-1.5 h-1.5 rounded-full bg-[#6161ff]" /> Working</div>
          <div className="flex items-center gap-1 text-[8px] text-emerald-500"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Done</div>
        </div>
      </div>
      {/* Canvas area */}
      <div className="flex-1 relative min-h-[200px]" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(97,97,255,0.02) 0%, transparent 70%)' }}>
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.25]"
          style={{
            backgroundImage: 'radial-gradient(circle, #c4c4c4 0.5px, transparent 0.5px)',
            backgroundSize: '20px 20px',
          }}
        />

        {/* Connection lines (SVG) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
          {tasks.slice(0, -1).map((_, i) => {
            const from = nodePositions[i];
            const to = nodePositions[i + 1];
            if (!from || !to) return null;
            const fromX = parseFloat(from.left) + 8;
            const fromY = parseFloat(from.top) + 6;
            const toX = parseFloat(to.left);
            const toY = parseFloat(to.top) + 6;
            return (
              <motion.line
                key={`line-${i}`}
                x1={`${fromX}%`} y1={`${fromY}%`}
                x2={`${toX}%`} y2={`${toY}%`}
                stroke={statuses[i] === 'done' ? '#34d399' : '#d1d5db'}
                strokeWidth="1.5"
                strokeDasharray={statuses[i] === 'done' ? '0' : '4 3'}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.5 }}
                transition={{ delay: 0.1 * i + 0.3, duration: 0.5 }}
              />
            );
          })}
        </svg>

        {/* Nodes */}
        {tasks.map((task, idx) => {
          const pos = nodePositions[idx];
          if (!pos) return null;
          const status = statuses[idx];
          const sc = statusColors[status];
          const agent = task.agentIdx != null && task.agentIdx < realAgents.length ? realAgents[task.agentIdx] : null;
          const isMoving = idx === movingTaskIdx;

          return (
            <motion.div
              key={`${jobId}-node-${idx}`}
              className="absolute"
              style={{ left: pos.left, top: pos.top }}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.08 * idx + 0.2, type: 'spring', stiffness: 300, damping: 22 }}
            >
              <motion.div
                animate={isMoving ? { boxShadow: ['0 0 0 0px rgba(97,97,255,0.2)', '0 0 0 6px rgba(97,97,255,0.05)', '0 0 0 0px rgba(97,97,255,0.2)'] } : {}}
                transition={{ duration: 1.8, repeat: isMoving ? Infinity : 0 }}
                className={`relative rounded-xl border ${sc.border} ${sc.bg} ${sc.ring} p-2.5 shadow-sm min-w-[110px] max-w-[140px] cursor-default`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${sc.dot}`} />
                  <span className="text-[9px] text-gray-400 font-medium">{status === 'done' ? 'Done' : status === 'in_progress' ? 'Working' : 'To Do'}</span>
                </div>
                <p className="text-[10px] text-gray-700 font-semibold leading-snug">{task.task}</p>
                {agent && (
                  <div className="flex items-center gap-1 mt-1.5">
                    {agent.image ? (
                      <img src={agent.image} alt={agent.name} className="w-4 h-4 rounded-full object-cover" />
                    ) : (
                      <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#6161ff] to-purple-400 flex items-center justify-center">
                        <Bot className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                    <span className="text-[7px] text-gray-400">{agent.name}</span>
                  </div>
                )}
                {status === 'done' && (
                  <div className="absolute -top-1.5 -right-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-white" />
                  </div>
                )}
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Calendar/Timeline View — weekly schedule with task blocks
   ═══════════════════════════════════════════════════════════════════ */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function WorkspaceCalendar({
  tasks,
  statuses,
  realAgents,
  movingTaskIdx,
  jobId,
}: {
  tasks: BoardTask[];
  statuses: ('todo' | 'in_progress' | 'done')[];
  realAgents: any[];
  movingTaskIdx: number | null;
  jobId: string;
}) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const dates = [3, 4, 5, 6, 7];

  const taskSlots: { taskIdx: number; dayIdx: number; span: number }[] = [
    { taskIdx: 0, dayIdx: 0, span: 2 },
    { taskIdx: 1, dayIdx: 1, span: 2 },
    { taskIdx: 2, dayIdx: 2, span: 1 },
    { taskIdx: 3, dayIdx: 3, span: 2 },
    { taskIdx: 4, dayIdx: 4, span: 1 },
  ];

  const statusColors = {
    todo: { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-500', bar: 'bg-gray-300' },
    in_progress: { bg: 'bg-[#6161ff]/[0.06]', border: 'border-[#6161ff]/25', text: 'text-[#6161ff]', bar: 'bg-[#6161ff]' },
    done: { bg: 'bg-emerald-50/60', border: 'border-emerald-200', text: 'text-emerald-600', bar: 'bg-emerald-400' },
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm h-full flex flex-col overflow-hidden">
      {/* Calendar header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100 bg-gray-50/40">
        <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Timeline View</span>
        <span className="text-[9px] text-gray-300 ml-1">Mar 3 – 7</span>
      </div>
      {/* Day columns */}
      <div className="flex-1 flex flex-col">
        {/* Day headers */}
        <div className="grid grid-cols-5 border-b border-gray-100">
          {days.map((day, i) => (
            <div key={day} className={`px-2 py-2 text-center border-r border-gray-50 last:border-r-0 ${i === 1 ? 'bg-[#6161ff]/[0.03]' : ''}`}>
              <p className="text-[8px] text-gray-400 uppercase font-semibold">{day}</p>
              <p className={`text-[11px] font-bold ${i === 1 ? 'text-[#6161ff]' : 'text-gray-700'}`}>{dates[i]}</p>
            </div>
          ))}
        </div>
        {/* Timeline area */}
        <div className="flex-1 relative grid grid-cols-5">
          {days.map((_, i) => (
            <div key={i} className={`border-r border-gray-50 last:border-r-0 ${i === 1 ? 'bg-[#6161ff]/[0.02]' : ''}`} />
          ))}
          {/* Task blocks */}
          {taskSlots.map(({ taskIdx, dayIdx, span }) => {
            if (taskIdx >= tasks.length) return null;
            const task = tasks[taskIdx];
            const status = statuses[taskIdx];
            const sc = statusColors[status];
            const agent = task.agentIdx != null && task.agentIdx < realAgents.length ? realAgents[task.agentIdx] : null;
            const isMoving = taskIdx === movingTaskIdx;
            const topPct = 8 + taskIdx * 18;

            return (
              <motion.div
                key={`${jobId}-cal-${taskIdx}`}
                className="absolute px-1"
                style={{
                  left: `${(dayIdx / 5) * 100}%`,
                  width: `${(span / 5) * 100}%`,
                  top: `${topPct}%`,
                }}
                initial={{ opacity: 0, y: 6, scaleX: 0.8 }}
                animate={{ opacity: 1, y: 0, scaleX: 1 }}
                transition={{ delay: taskIdx * 0.06 + 0.15, duration: 0.3, ease: 'easeOut' }}
              >
                <motion.div
                  animate={isMoving ? { boxShadow: ['0 0 0 0px rgba(97,97,255,0.2)', '0 0 0 4px rgba(97,97,255,0.08)', '0 0 0 0px rgba(97,97,255,0.2)'] } : {}}
                  transition={{ duration: 1.8, repeat: isMoving ? Infinity : 0 }}
                  className={`rounded-lg border ${sc.border} ${sc.bg} p-1.5 cursor-default`}
                >
                  <div className="flex items-start gap-1.5">
                    <div className={`w-0.5 h-full min-h-[20px] rounded-full flex-shrink-0 ${sc.bar}`} />
                    <div className="min-w-0 flex-1">
                      <p className={`text-[9px] font-semibold leading-snug truncate ${sc.text}`}>{task.task}</p>
                      {agent && (
                        <div className="flex items-center gap-1 mt-0.5">
                          {agent.image ? (
                            <img src={agent.image} alt={agent.name} className="w-3.5 h-3.5 rounded-full object-cover" />
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-[#6161ff] to-purple-400 flex items-center justify-center">
                              <Bot className="w-2 h-2 text-white" />
                            </div>
                          )}
                          <span className="text-[7px] text-gray-400 truncate">{agent.name.split(' ')[0]}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   View Dispatcher — picks the right view based on viewType
   ═══════════════════════════════════════════════════════════════════ */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function WorkspaceView({
  viewType,
  tasks,
  statuses,
  realAgents,
  movingTaskIdx,
  jobId,
}: {
  viewType: ViewType;
  tasks: BoardTask[];
  statuses: ('todo' | 'in_progress' | 'done')[];
  realAgents: any[];
  movingTaskIdx: number | null;
  jobId: string;
}) {
  const props = { tasks, statuses, realAgents, movingTaskIdx, jobId };

  switch (viewType) {
    case 'table':
      return <WorkspaceTable {...props} />;
    case 'canvas':
      return <WorkspaceCanvas {...props} />;
    case 'calendar':
      return <WorkspaceCalendar {...props} />;
    case 'kanban':
    default:
      return <WorkspaceBoard {...props} />;
  }
}

/* ═══════════════════════════════════════════════════════════════════
   Unified Workspace Sidebar (JTBD list + Agents)
   ═══════════════════════════════════════════════════════════════════ */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function WorkspaceSidebar({
  department,
  showcaseJTBDs,
  selectedIdx,
  onSelectIdx,
  agents,
  movingAgentIdx,
  vibeApps,
}: {
  department: DepartmentRow;
  showcaseJTBDs: ShowcaseJTBDInput[];
  selectedIdx: number;
  onSelectIdx: (idx: number) => void;
  agents: any[];
  movingAgentIdx: number | null;
  vibeApps: any[];
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col h-full">
      {/* Sidebar Header */}
      <div className="px-4 py-3.5 border-b border-gray-100 bg-gray-50/40">
        <div className="flex items-center gap-2.5">
          {department.avatar_image ? (
            <div
              className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-white shadow-sm flex-shrink-0"
              style={{ backgroundColor: department.avatar_color || '#e5e7eb' }}
            >
              <img src={department.avatar_image} alt={department.title} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
              style={{ backgroundColor: department.avatar_color || '#6161ff' }}
            >
              {department.title.charAt(0)}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-[12px] font-semibold text-gray-700 truncate">{department.title} workspace</p>
            <p className="text-[9px] text-gray-400">AI Work Platform</p>
          </div>
        </div>
      </div>

      {/* JTBD List */}
      <div className="px-3 py-3 flex-1">
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">Jobs to be done</p>
        <div className="space-y-1">
          {showcaseJTBDs.map((job, idx) => {
            const isActive = idx === selectedIdx;
            const IconComp = job.icon;
            return (
              <motion.button
                key={job.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.03 * idx, duration: 0.2 }}
                onClick={() => onSelectIdx(idx)}
                className={`
                  w-full text-left px-2.5 py-2 rounded-xl border transition-all duration-200 cursor-pointer flex items-center gap-2
                  ${isActive
                    ? 'border-[#6161ff]/30 bg-[#6161ff]/5 shadow-sm'
                    : 'border-transparent bg-transparent hover:border-gray-100 hover:bg-gray-50'}
                `}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${isActive ? 'bg-[#6161ff]/10' : 'bg-gray-50'}`}>
                  <IconComp className={`w-3.5 h-3.5 ${isActive ? 'text-[#6161ff]' : 'text-gray-400'}`} />
                </div>
                <span className={`text-[11px] leading-tight truncate ${isActive ? 'text-[#6161ff] font-semibold' : 'text-gray-600'}`}>
                  {job.title}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Agents Section */}
      {agents.length > 0 && (
        <div className="px-3 py-4 border-t border-gray-100">
          <div className="flex items-center gap-2 mb-3 px-1">
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#6161ff]/15 to-purple-100 flex items-center justify-center">
              <Bot className="w-3 h-3 text-[#6161ff]" />
            </div>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Active Agents</span>
            <span className="ml-auto text-[9px] text-[#6161ff]/60 font-semibold">{agents.slice(0, 4).length}</span>
          </div>
          <div className="space-y-2">
            {agents.slice(0, 4).map((agent: any, i: number) => {
              const isActive = i === movingAgentIdx;
              return (
                <motion.div
                  key={agent.id || i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 * i, type: 'spring', stiffness: 300, damping: 24 }}
                  className={`relative rounded-xl border p-2.5 transition-all duration-500 ${
                    isActive
                      ? 'border-emerald-200 bg-gradient-to-r from-emerald-50/80 to-white shadow-md shadow-emerald-100/40'
                      : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-xl pointer-events-none"
                      animate={{ boxShadow: ['0 0 0 0px rgba(16,185,129,0.15)', '0 0 12px 2px rgba(16,185,129,0.1)', '0 0 0 0px rgba(16,185,129,0.15)'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  )}
                  <div className="flex items-center gap-3">
                    <div className="relative flex-shrink-0">
                      {agent.image ? (
                        <motion.img
                          src={agent.image}
                          alt={agent.name}
                          className={`w-12 h-12 rounded-xl object-cover ring-2 ${isActive ? 'ring-emerald-300' : 'ring-gray-100'}`}
                          animate={isActive ? {
                            boxShadow: ['0 0 0 0px rgba(16,185,129,0.4)', '0 0 0 4px rgba(16,185,129,0.12)', '0 0 0 0px rgba(16,185,129,0.4)'],
                          } : {}}
                          transition={{ duration: 1.8, repeat: isActive ? Infinity : 0 }}
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6161ff] to-purple-400 flex items-center justify-center shadow-sm">
                          <Bot className="w-6 h-6 text-white" />
                        </div>
                      )}
                      <motion.div
                        className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${isActive ? 'bg-emerald-400' : 'bg-gray-300'}`}
                        animate={isActive ? { scale: [1, 1.4, 1] } : {}}
                        transition={{ duration: 1, repeat: isActive ? Infinity : 0 }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[12px] font-bold text-gray-800 truncate">{agent.name}</p>
                      {agent.description && (
                        <p className="text-[9px] text-gray-400 truncate mt-0.5">{agent.description}</p>
                      )}
                      <div className={`flex items-center gap-1.5 mt-1 ${isActive ? 'text-emerald-500' : 'text-gray-300'}`}>
                        {isActive ? (
                          <>
                            <motion.div
                              className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0"
                              animate={{ opacity: [1, 0.3, 1], scale: [1, 1.2, 1] }}
                              transition={{ duration: 1.2, repeat: Infinity }}
                            />
                            <span className="text-[9px] font-semibold text-emerald-500">Working...</span>
                          </>
                        ) : (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0" />
                            <span className="text-[9px] font-medium text-gray-400">Ready</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Vibe Apps (compact icon strip) */}
      {vibeApps.length > 0 && (
        <div className="px-3 py-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5 mb-2 px-1">
            <img src={vibeLogo} alt="Vibe" className="w-3.5 h-3.5 object-contain" />
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Vibe Apps</span>
          </div>
          <div className="flex flex-wrap gap-1.5 px-1">
            {vibeApps.slice(0, 5).map((app: any, i: number) => {
              const { icon: AppIcon, bg, fg } = getAppIcon(app.name);
              return (
                <motion.div
                  key={app.id || i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.03 * i, duration: 0.2 }}
                  whileHover={{ scale: 1.1 }}
                  className={`w-7 h-7 rounded-lg ${bg} flex items-center justify-center cursor-default group relative`}
                  title={app.name}
                >
                  <AppIcon className={`w-3.5 h-3.5 ${fg}`} />
                </motion.div>
              );
            })}
            <div className="w-7 h-7 rounded-lg border border-dashed border-[#6161ff]/15 bg-[#6161ff]/[0.02] flex items-center justify-center cursor-default">
              <Plus className="w-3 h-3 text-[#6161ff]/25" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Vibe Apps Grid (like JTBD Workspace)
   ═══════════════════════════════════════════════════════════════════ */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function VibeAppsGrid({ vibeApps }: { vibeApps: any[] }) {
  if (!vibeApps.length) return null;
  return (
    <div className="mt-4">
      <div className="flex items-center gap-1.5 mb-2">
        <img src={vibeLogo} alt="Vibe" className="w-4 h-4 object-contain" />
        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Vibe Apps</span>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
        {vibeApps.slice(0, 5).map((app: any, i: number) => {
          const { icon: AppIcon, bg, fg } = getAppIcon(app.name);
          return (
            <motion.div
              key={app.id || i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.04 * i, duration: 0.3 }}
              whileHover={{ scale: 1.05, y: -1 }}
              className="flex flex-col items-center gap-1 p-2 rounded-lg border border-gray-100 bg-white hover:border-[#6161ff]/15 hover:shadow-sm transition-all cursor-default"
            >
              <div className={`w-7 h-7 rounded-lg ${bg} flex items-center justify-center`}>
                <AppIcon className={`w-4 h-4 ${fg}`} />
              </div>
              <span className="text-[7px] text-gray-500 text-center truncate w-full leading-tight">{app.name}</span>
            </motion.div>
          );
        })}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="flex flex-col items-center gap-1 p-2 rounded-lg border border-dashed border-[#6161ff]/15 bg-white cursor-default"
        >
          <div className="w-7 h-7 rounded-lg bg-[#6161ff]/[0.04] flex items-center justify-center">
            <Plus className="w-3.5 h-3.5 text-[#6161ff]/30" />
          </div>
          <span className="text-[7px] text-[#6161ff]/40 font-medium">Build yours</span>
        </motion.div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Foundation Strip + Activity Feed (kept from previous)
   ═══════════════════════════════════════════════════════════════════ */

function FoundationStrip({ integrations }: { integrations: string[] }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="flex items-center gap-1 flex-shrink-0">
          <Plug className="w-3 h-3 text-gray-300" />
          <span className="text-[9px] text-gray-400 font-medium">Connected:</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {integrations.map(tool => {
            const logo = getToolLogo(tool);
            return (
              <motion.div
                key={tool}
                whileHover={{ scale: 1.1, y: -1 }}
                className="group relative flex items-center gap-1 px-1.5 py-1 rounded-full border border-emerald-100 bg-emerald-50/40 cursor-default"
              >
                {logo ? (
                  <img src={logo} alt={tool} className="w-3.5 h-3.5 rounded-sm object-contain" />
                ) : (
                  <Plug className="w-3 h-3 text-emerald-400" />
                )}
                <span className="text-[8px] text-emerald-600 font-medium">{tool}</span>
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                  <div className="bg-gray-900 text-white text-[8px] px-1.5 py-0.5 rounded whitespace-nowrap">Connected</div>
                </div>
              </motion.div>
            );
          })}
          <div className="w-5 h-5 rounded-full border border-dashed border-gray-200 flex items-center justify-center cursor-default">
            <Plus className="w-2.5 h-2.5 text-gray-300" />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1 ml-3 pl-3 border-l border-gray-100 flex-shrink-0">
        <Shield className="w-3 h-3 text-[#6161ff]/40" />
        <span className="text-[8px] text-gray-400 font-medium whitespace-nowrap">Enterprise Secure</span>
      </div>
    </div>
  );
}

function WorkspaceActivityFeed({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 min-h-[18px]">
      <motion.div
        className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <AnimatePresence mode="wait">
        {message ? (
          <motion.p
            key={message}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="text-[9px] text-gray-500"
          >
            {message}
          </motion.p>
        ) : (
          <motion.p key="idle" initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} className="text-[9px] text-gray-400">
            Workspace ready — agents standing by
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════════════════════════════ */

export function LivingWorkspaceShowcase({
  department,
  showcaseJTBDs,
  hideHeader = false,
}: {
  department: DepartmentRow;
  showcaseJTBDs: ShowcaseJTBDInput[];
  hideHeader?: boolean;
}) {
  const { agents: realAgents, vibeApps: realVibeApps, loading } = useDepartmentData(department.id);
  const [selectedIdx, setSelectedIdx] = useState(0);

  useEffect(() => { setSelectedIdx(0); }, [department.id]);

  const selectedJob = showcaseJTBDs[selectedIdx] || showcaseJTBDs[0];
  const wsData = useMemo(
    () => selectedJob ? getWSData(selectedJob) : WS_DATA['launch-campaign'],
    [selectedJob?.id],
  );

  const { statuses, movingTaskIdx, actionType } = useWorkspaceAnimation(wsData.boardTasks, selectedJob?.id || '');

  const movingTask = movingTaskIdx !== null ? wsData.boardTasks[movingTaskIdx] : null;
  const movingAgentIdx = movingTask?.agentIdx ?? null;
  const activeAgent = movingAgentIdx !== null && movingAgentIdx < realAgents.length
    ? realAgents[movingAgentIdx]
    : null;
  const feedMsg = activeAgent && movingTask
    ? `${activeAgent.name} ${actionType} "${movingTask.task}"`
    : '';

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white shadow-lg flex items-center justify-center py-24">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}>
          <Loader2 className="w-6 h-6 text-[#6161ff]" />
        </motion.div>
      </div>
    );
  }

  if (!selectedJob) return null;

  return (
    <div>
      {/* Centered Header */}
      {!hideHeader && (
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex justify-center mb-4"
          >
            <div className="relative">
              <div
                className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-white shadow-md"
                style={{ backgroundColor: department.avatar_color || '#e5e7eb' }}
              >
                {department.avatar_image ? (
                  <img src={department.avatar_image} alt={department.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-xl font-bold">
                    {department.title.charAt(0)}
                  </div>
                )}
              </div>
              <div
                className="absolute inset-0 rounded-full opacity-20 blur-lg -z-10 scale-125"
                style={{ backgroundColor: department.avatar_color || '#6161ff' }}
              />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h2 className="text-xl md:text-2xl mb-1" style={{ lineHeight: '1.3', letterSpacing: '-0.01em' }}>
              <span className="text-gray-800 font-normal block">Your AI Work Platform</span>
              <span className="bg-gradient-to-r from-[#6161ff] to-[#8b5cf6] bg-clip-text text-transparent font-bold block">
                for {department.title}
              </span>
            </h2>
          </motion.div>
        </div>
      )}

      {/* Grid: Sidebar + Board */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Sidebar */}
        <div className="lg:col-span-3">
          <WorkspaceSidebar
            department={department}
            showcaseJTBDs={showcaseJTBDs}
            selectedIdx={selectedIdx}
            onSelectIdx={setSelectedIdx}
            agents={realAgents}
            movingAgentIdx={movingAgentIdx}
            vibeApps={realVibeApps}
          />
        </div>

        {/* Right Content */}
        <div className="lg:col-span-9 flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedJob.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col flex-1"
            >
              {/* Board / Table / Canvas / Calendar */}
              <div className="flex-1 min-h-0">
                <WorkspaceView
                  viewType={wsData.viewType || 'kanban'}
                  tasks={wsData.boardTasks}
                  statuses={statuses}
                  realAgents={realAgents}
                  movingTaskIdx={movingTaskIdx}
                  jobId={selectedJob.id}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Foundation Strip — full width below grid */}
      <div className="mt-5 px-3 py-2.5 rounded-xl border border-gray-100 bg-gray-50/40">
        <FoundationStrip integrations={wsData.integrations} />
      </div>

      {/* Activity Feed — full width below foundation */}
      <div className="mt-2 px-3 py-2">
        <WorkspaceActivityFeed message={feedMsg} />
      </div>
    </div>
  );
}
