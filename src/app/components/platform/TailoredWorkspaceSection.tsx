import { motion, useInView } from 'motion/react';
import { useRef, useState, useEffect } from 'react';
import {
  Bot,
  Sparkles,
  CheckCircle2,
  Clock,
  Plug,
  LayoutGrid,
  Zap,
} from 'lucide-react';
import { useDepartments, useDepartmentData } from '@/hooks/useSupabase';
import type { DepartmentRow } from '@/types/database';
import { getToolLogo } from '@/app/utils/toolLogos';
import agentsLogo from '@/assets/99be461a455ae49743d963276e2023ed6cd1445d.png';
import vibeLogo from '@/assets/069a22575b2de9057cfc00d9b4538d072f7fe115.png';
import sidekickLogo from '@/assets/1babfe88a809998ec3c5c5d597d8051ef7639a6f.png';

export function TailoredWorkspaceSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const { departments, loading: deptsLoading } = useDepartments();
  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null);

  useEffect(() => {
    if (departments.length > 0 && !selectedDeptId) {
      const marketing = departments.find((d) => d.name === 'marketing');
      setSelectedDeptId(marketing?.id || departments[0].id);
    }
  }, [departments, selectedDeptId]);

  const selectedDept = departments.find((d) => d.id === selectedDeptId);

  return (
    <section ref={sectionRef} className="py-16 md:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Your workspace, tailored to the job
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            A white canvas that adapts to your needs — with the right agents,
            apps, and integrations built in
          </p>
        </motion.div>

        {/* Small department selector */}
        {!deptsLoading && (
          <div className="flex justify-center gap-2 mb-10">
            {departments.slice(0, 6).map((dept) => (
              <button
                key={dept.id}
                onClick={() => setSelectedDeptId(dept.id)}
                className={`
                  px-3 py-1.5 rounded-full text-xs font-medium transition-all border cursor-pointer
                  ${
                    selectedDeptId === dept.id
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                {dept.title}
              </button>
            ))}
          </div>
        )}

        {/* Workspace Mockup */}
        {selectedDept && (
          <WorkspaceMockup department={selectedDept} isInView={isInView} />
        )}
      </div>
    </section>
  );
}

function WorkspaceMockup({
  department,
  isInView,
}: {
  department: DepartmentRow;
  isInView: boolean;
}) {
  const { agents, vibeApps, products, loading } = useDepartmentData(department.id);

  // Collect replaces_tools from all vibe apps
  const allTools = vibeApps
    .flatMap((app) => app.replaces_tools || [])
    .filter((tool, index, arr) => arr.indexOf(tool) === index)
    .slice(0, 6);

  return (
    <motion.div
      key={department.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      {/* Workspace Frame */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-xl shadow-gray-100/80 overflow-hidden">
        {/* Title Bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="flex items-center gap-2 ml-3">
              <LayoutGrid className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-semibold text-gray-700">
                {department.title} Workspace
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Zap className="w-3.5 h-3.5" />
            AI-powered
          </div>
        </div>

        {/* Workspace Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[320px] md:min-h-[420px]">
          {/* Left sidebar - Integrations flowing in (hidden on mobile) */}
          <div className="hidden md:block col-span-2 border-r border-gray-100 p-4 bg-gray-50/30">
            <div className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-3">
              Integrations
            </div>
            <div className="space-y-2">
              {allTools.map((tool, i) => {
                const logo = getToolLogo(tool);
                return (
                  <motion.div
                    key={tool}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-white border border-gray-100 hover:border-gray-200 transition-colors"
                  >
                    {logo ? (
                      <img src={logo} alt={tool} className="w-4 h-4 rounded-sm" />
                    ) : (
                      <Plug className="w-3.5 h-3.5 text-gray-400" />
                    )}
                    <span className="text-[11px] text-gray-600 truncate">{tool}</span>
                  </motion.div>
                );
              })}
              {allTools.length === 0 && !loading && (
                <p className="text-[10px] text-gray-400 italic">No tools yet</p>
              )}
            </div>
          </div>

          {/* Main workspace area */}
          <div className="col-span-1 md:col-span-7 p-4 md:p-5">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="w-5 h-5 border-2 border-[#6161ff] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {/* Board-like header */}
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-2 h-8 rounded-full"
                    style={{ backgroundColor: department.avatar_color || '#6161ff' }}
                  />
                  <div>
                    <h4 className="text-base font-semibold text-gray-900">
                      {department.title} — Jobs To Be Done
                    </h4>
                    <p className="text-xs text-gray-400">
                      {agents.length} agents active &middot; {vibeApps.length} apps
                    </p>
                  </div>
                </div>

                {/* Board rows - simulating work items */}
                <div className="space-y-2">
                  {/* Column headers */}
                  <div className="grid grid-cols-12 gap-2 text-[10px] uppercase tracking-wider text-gray-400 font-semibold px-3 pb-1">
                    <div className="col-span-5">Task</div>
                    <div className="col-span-3">Assigned Agent</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Timeline</div>
                  </div>

                  {agents.slice(0, 4).map((agent, i) => (
                    <motion.div
                      key={agent.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
                      className="grid grid-cols-12 gap-2 items-center px-3 py-2.5 rounded-lg border border-gray-100 bg-white hover:bg-gray-50/50 transition-colors"
                    >
                      <div className="col-span-5 text-sm text-gray-700 truncate">
                        {agent.description
                          ? agent.description.slice(0, 45) + (agent.description.length > 45 ? '...' : '')
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
                        <span className="text-xs text-gray-600 truncate">{agent.name}</span>
                      </div>
                      <div className="col-span-2">
                        <span className={`
                          inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full
                          ${i === 0
                            ? 'bg-green-50 text-green-700'
                            : i === 1
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-amber-50 text-amber-700'
                          }
                        `}>
                          {i === 0 ? (
                            <><CheckCircle2 className="w-3 h-3" /> Done</>
                          ) : i === 1 ? (
                            <><Sparkles className="w-3 h-3" /> Working</>
                          ) : (
                            <><Clock className="w-3 h-3" /> Queued</>
                          )}
                        </span>
                      </div>
                      <div className="col-span-2">
                        <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: i === 0 ? '100%' : i === 1 ? '60%' : '20%',
                              backgroundColor: department.avatar_color || '#6161ff',
                              opacity: 0.7,
                            }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Add more placeholder rows */}
                  {agents.length < 4 &&
                    Array.from({ length: 4 - agents.length }).map((_, i) => (
                      <div
                        key={`placeholder-${i}`}
                        className="grid grid-cols-12 gap-2 items-center px-3 py-2.5 rounded-lg border border-dashed border-gray-100"
                      >
                        <div className="col-span-5 h-3 bg-gray-100 rounded w-3/4" />
                        <div className="col-span-3 h-3 bg-gray-100 rounded w-1/2" />
                        <div className="col-span-2 h-3 bg-gray-100 rounded w-2/3" />
                        <div className="col-span-2 h-3 bg-gray-100 rounded" />
                      </div>
                    ))}
                </div>
              </>
            )}
          </div>

          {/* Right panel - Active Agents & Apps (hidden on mobile) */}
          <div className="hidden md:block col-span-3 border-l border-gray-100 p-4 bg-gray-50/20">
            <div className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-3">
              Active AI
            </div>

            {/* Agents mini cards */}
            <div className="space-y-2 mb-5">
              {agents.slice(0, 3).map((agent, i) => (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }}
                  className="flex items-center gap-2 p-2 rounded-lg bg-white border border-gray-100"
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
                    <p className="text-[11px] font-medium text-gray-700 truncate">
                      {agent.name}
                    </p>
                    <p className="text-[9px] text-green-500 font-medium">Active</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-3">
              Apps
            </div>

            {/* Vibe apps mini cards */}
            <div className="space-y-2">
              {vibeApps.slice(0, 3).map((app, i) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.8 + i * 0.1 }}
                  className="flex items-center gap-2 p-2 rounded-lg bg-white border border-gray-100"
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
                  <p className="text-[11px] font-medium text-gray-700 truncate">
                    {app.name}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* AI Capabilities logos */}
            <div className="mt-5 pt-4 border-t border-gray-100">
              <div className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-2">
                Powered by
              </div>
              <div className="flex gap-2">
                {[
                  { logo: agentsLogo, label: 'Agents' },
                  { logo: sidekickLogo, label: 'Sidekick' },
                  { logo: vibeLogo, label: 'Vibe' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col items-center gap-0.5"
                  >
                    <img
                      src={item.logo}
                      alt={item.label}
                      className="w-6 h-6 object-contain"
                    />
                    <span className="text-[8px] text-gray-400">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Caption below workspace */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 1 }}
        className="text-center text-sm text-gray-400 mt-6"
      >
        Every workspace is automatically configured with the right agents, apps, and
        integrations for your team's jobs to be done
      </motion.p>
    </motion.div>
  );
}
