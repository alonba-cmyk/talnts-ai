import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useMemo } from 'react';
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
} from 'lucide-react';
import { useDepartmentData } from '@/hooks/useSupabase';
import type { DepartmentRow } from '@/types/database';
import { getToolLogo } from '@/app/utils/toolLogos';
import agentsLogo from '@/assets/99be461a455ae49743d963276e2023ed6cd1445d.png';
import vibeLogo from '@/assets/069a22575b2de9057cfc00d9b4538d072f7fe115.png';
import sidekickLogo from '@/assets/1babfe88a809998ec3c5c5d597d8051ef7639a6f.png';

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
}

export function JTBDWorkspaceSection({ department, allDepartments = [] }: JTBDWorkspaceSectionProps) {
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
        <JTBDWorkspaceContent department={department} allDepartments={allDepartments} />
      </div>
    </section>
  );
}

// ─── Inner Content (loads data per department) ──────────────────

function JTBDWorkspaceContent({ department, allDepartments }: { department: DepartmentRow; allDepartments: DepartmentRow[] }) {
  const { agents, vibeApps, sidekickActions, loading } = useDepartmentData(department.id);
  const [selectedJTBD, setSelectedJTBD] = useState<string | null>(null);

  // Build JTBD items
  const jtbdItems: JTBDItem[] = useMemo(() => {
    const items: JTBDItem[] = [];

    agents.forEach((agent) => {
      items.push({
        id: `agent-${agent.id}`,
        title: agent.name,
        agentName: agent.name,
        agentImage: agent.image,
        relatedTools: [],
      });
    });

    sidekickActions.forEach((action) => {
      items.push({
        id: `sidekick-${action.id}`,
        title: action.name,
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
      {/* ─── Left Panel: JTBD Bubbles ─── */}
      <div className="lg:col-span-4">
        {/* ── Title ── */}
        <h3 className="text-lg font-bold text-gray-900 mb-3">{department.title} team</h3>

        {/* ── Team: original department avatars + roles ── */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex -space-x-2.5 flex-shrink-0">
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
          <span className="text-[11px] text-gray-400 leading-snug">
            {(TEAM_MEMBERS[department.name] || []).map((m) => m.role).join(' · ')}
          </span>
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
      </div>

      {/* ─── Right Panel: Animated White Workspace ─── */}
      <div className="lg:col-span-8">
        <AnimatedWorkspace
          department={department}
          activeJTBD={activeJTBD || null}
          agents={agents}
          vibeApps={vibeApps}
          allTools={allTools}
        />
      </div>
    </div>
  );
}

// ─── Animated Workspace Component ───────────────────────────────

function AnimatedWorkspace({
  department,
  activeJTBD,
  agents,
  vibeApps,
  allTools,
}: {
  department: DepartmentRow;
  activeJTBD: JTBDItem | null;
  agents: any[];
  vibeApps: any[];
  allTools: string[];
}) {
  // Track animation phase when JTBD changes
  const [phase, setPhase] = useState<'idle' | 'building' | 'complete'>('idle');

  useEffect(() => {
    if (!activeJTBD) {
      setPhase('idle');
      return;
    }
    setPhase('building');
    const timer = setTimeout(() => setPhase('complete'), 2200);
    return () => clearTimeout(timer);
  }, [activeJTBD?.id]);

  // Find the specific agent for the active JTBD
  const activeAgent = activeJTBD
    ? agents.find((a) => a.name === activeJTBD.agentName) || agents[0]
    : null;

  // Related tools for the active JTBD
  const relatedTools = activeJTBD?.relatedTools.length
    ? activeJTBD.relatedTools
    : allTools.slice(0, 4);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-xl shadow-gray-100/50 overflow-hidden">
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
                key={activeJTBD?.id || 'default'}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="text-sm font-semibold text-gray-700"
              >
                {department.title} Workspace
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Zap className="w-3.5 h-3.5" />
          AI-powered
        </div>
      </div>

      {/* Workspace body */}
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[400px]">
        {/* Left sidebar - Integrations */}
        <div className="hidden md:block col-span-2 border-r border-gray-100 p-3 bg-gray-50/30">
          <div className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-3">
            Integrations
          </div>
          <AnimatePresence>
            {phase !== 'idle' &&
              relatedTools.map((tool, i) => {
                const logo = getToolLogo(tool);
                return (
                  <motion.div
                    key={tool}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.35, delay: 0.4 + i * 0.12 }}
                    className="flex items-center gap-2 px-2 py-1.5 mb-1.5 rounded-lg bg-white border border-gray-100"
                  >
                    {logo ? (
                      <img src={logo} alt={tool} className="w-4 h-4 rounded-sm" />
                    ) : (
                      <Plug className="w-3.5 h-3.5 text-gray-400" />
                    )}
                    <span className="text-[10px] text-gray-600 truncate">{tool}</span>
                  </motion.div>
                );
              })}
          </AnimatePresence>
          {phase === 'idle' && (
            <p className="text-[10px] text-gray-300 italic mt-2">
              Select a JTBD to see integrations
            </p>
          )}
        </div>

        {/* Main board area */}
        <div className="col-span-1 md:col-span-7 p-4 md:p-5">
          {phase === 'idle' ? (
            /* Empty canvas state */
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
            /* Active workspace with board */
            <>
              {/* Board header */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeJTBD?.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-3 mb-5"
                >
                  <div
                    className="w-2 h-8 rounded-full"
                    style={{ backgroundColor: department.avatar_color || '#6161ff' }}
                  />
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">
                      {activeJTBD?.title || 'Workspace'}
                    </h4>
                    <p className="text-[11px] text-gray-400">
                      {activeAgent?.name || 'Agent'} &middot;{' '}
                      {phase === 'building' ? 'Working...' : 'Complete'}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Column headers */}
              <div className="grid grid-cols-12 gap-2 text-[10px] uppercase tracking-wider text-gray-400 font-semibold px-3 pb-2">
                <div className="col-span-5">Task</div>
                <div className="col-span-3">Agent</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Progress</div>
              </div>

              {/* Active JTBD row -- the highlighted one */}
              <AnimatePresence mode="wait">
                {activeJTBD && (
                  <motion.div
                    key={activeJTBD.id}
                    initial={{ opacity: 0, y: 12, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35 }}
                    className="grid grid-cols-12 gap-2 items-center px-3 py-3 rounded-xl border-2 border-[#6161ff]/20 bg-[#6161ff]/[0.03] mb-2"
                  >
                    <div className="col-span-5 text-sm font-medium text-gray-800 truncate">
                      {activeJTBD.title.length > 40
                        ? activeJTBD.title.slice(0, 40) + '...'
                        : activeJTBD.title}
                    </div>
                    <div className="col-span-3 flex items-center gap-1.5">
                      {activeJTBD.agentImage ? (
                        <img
                          src={activeJTBD.agentImage}
                          alt={activeJTBD.agentName}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#6161ff] to-purple-400 flex items-center justify-center">
                          <Bot className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <span className="text-xs text-gray-700 truncate font-medium">
                        {activeJTBD.agentName}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <AnimatePresence mode="wait">
                        {phase === 'building' ? (
                          <motion.span
                            key="working"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700"
                          >
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            >
                              <Sparkles className="w-3 h-3" />
                            </motion.div>
                            Working
                          </motion.span>
                        ) : (
                          <motion.span
                            key="done"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-50 text-green-700"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            Done
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="col-span-2">
                      <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: department.avatar_color || '#6161ff' }}
                          initial={{ width: '0%' }}
                          animate={{ width: phase === 'complete' ? '100%' : '65%' }}
                          transition={{ duration: phase === 'building' ? 2 : 0.4, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Other agent rows -- background tasks */}
              {agents
                .filter((a) => activeJTBD && a.name !== activeJTBD.agentName)
                .slice(0, 3)
                .map((agent, i) => (
                  <motion.div
                    key={agent.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.6 + i * 0.12 }}
                    className="grid grid-cols-12 gap-2 items-center px-3 py-2.5 rounded-lg border border-gray-100 bg-white mb-1.5"
                  >
                    <div className="col-span-5 text-xs text-gray-500 truncate">
                      {agent.description
                        ? agent.description.slice(0, 38) + (agent.description.length > 38 ? '...' : '')
                        : agent.name}
                    </div>
                    <div className="col-span-3 flex items-center gap-1.5">
                      {agent.image ? (
                        <img
                          src={agent.image}
                          alt={agent.name}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#6161ff] to-purple-400 flex items-center justify-center">
                          <Bot className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <span className="text-[11px] text-gray-500 truncate">{agent.name}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-600">
                        <Clock className="w-3 h-3" />
                        Queued
                      </span>
                    </div>
                    <div className="col-span-2">
                      <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gray-200"
                          style={{ width: '10%' }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}

              {/* Placeholder rows */}
              {agents.length < 3 &&
                Array.from({ length: 3 - agents.length }).map((_, i) => (
                  <div
                    key={`ph-${i}`}
                    className="grid grid-cols-12 gap-2 items-center px-3 py-2.5 rounded-lg border border-dashed border-gray-100 mb-1.5"
                  >
                    <div className="col-span-5 h-3 bg-gray-50 rounded w-3/4" />
                    <div className="col-span-3 h-3 bg-gray-50 rounded w-1/2" />
                    <div className="col-span-2 h-3 bg-gray-50 rounded w-2/3" />
                    <div className="col-span-2 h-3 bg-gray-50 rounded" />
                  </div>
                ))}
            </>
          )}
        </div>

        {/* Right sidebar - Agents & Apps */}
        <div className="hidden md:block col-span-3 border-l border-gray-100 p-3 bg-gray-50/20">
          <AnimatePresence>
            {phase !== 'idle' ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                {/* Active agents */}
                <div className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-2">
                  Active Agents
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
                        <img
                          src={agent.image}
                          alt={agent.name}
                          className="w-6 h-6 rounded-md object-cover"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#6161ff] to-purple-400 flex items-center justify-center">
                          <Bot className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-[10px] font-medium text-gray-700 truncate">
                          {agent.name}
                        </p>
                        <p className="text-[9px] text-green-500 font-medium">Active</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Apps */}
                <div className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-2">
                  Apps
                </div>
                <div className="space-y-1.5 mb-4">
                  {vibeApps.slice(0, 3).map((app, i) => (
                    <motion.div
                      key={app.id}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.8 + i * 0.1 }}
                      className="flex items-center gap-2 p-1.5 rounded-lg bg-white border border-gray-100"
                    >
                      {app.image ? (
                        <img
                          src={app.image}
                          alt={app.name}
                          className="w-6 h-6 rounded-md object-cover"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#00d2d2] to-teal-400 flex items-center justify-center">
                          <Sparkles className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <p className="text-[10px] font-medium text-gray-700 truncate">
                        {app.name}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* Powered by */}
                <div className="pt-3 border-t border-gray-100">
                  <div className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold mb-2">
                    Powered by
                  </div>
                  <div className="flex gap-2">
                    {[
                      { logo: agentsLogo, label: 'Agents' },
                      { logo: sidekickLogo, label: 'Sidekick' },
                      { logo: vibeLogo, label: 'Vibe' },
                    ].map((item) => (
                      <div key={item.label} className="flex flex-col items-center gap-0.5">
                        <img
                          src={item.logo}
                          alt={item.label}
                          className="w-5 h-5 object-contain"
                        />
                        <span className="text-[8px] text-gray-400">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
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
        </div>
      </div>
    </div>
  );
}
