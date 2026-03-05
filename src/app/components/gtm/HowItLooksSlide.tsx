import { motion } from 'motion/react';
import SlideShell, { SlideTitle, SlideSubtitle, StaggerChild } from './SlideShell';

const mockTasks = [
  { name: 'Create Q2 campaign brief', assignee: 'Sarah M.', type: 'human', status: 'Working on it', statusColor: '#FDAB3D' },
  { name: 'Research competitor pricing', assignee: 'Research Agent', type: 'agent', status: 'Done', statusColor: '#00C875' },
  { name: 'Generate social media assets', assignee: 'Content Agent', type: 'agent', status: 'In Review', statusColor: '#E2445C' },
  { name: 'Update product roadmap', assignee: 'Alex K.', type: 'human', status: 'Working on it', statusColor: '#FDAB3D' },
  { name: 'Qualify inbound leads', assignee: 'SDR Agent', type: 'agent', status: 'Working on it', statusColor: '#FDAB3D' },
  { name: 'Weekly standup summary', assignee: 'PMO Agent', type: 'agent', status: 'Done', statusColor: '#00C875' },
];

const activityLog = [
  { agent: 'Research Agent', action: 'Completed competitor analysis — 12 companies', time: '2m ago' },
  { agent: 'SDR Agent', action: 'Qualified 3 new leads, moved to pipeline', time: '5m ago' },
  { agent: 'Content Agent', action: 'Generated 8 ad variants — awaiting review', time: '12m ago' },
];

export default function HowItLooksSlide() {
  return (
    <SlideShell>
      <SlideTitle>How This Could Look</SlideTitle>
      <SlideSubtitle>Humans and agents on one surface. A monday.com board where both work side by side.</SlideSubtitle>

      <StaggerChild index={0}>
        <div className="rounded-2xl border border-[#e8e8e8] bg-white shadow-md overflow-hidden mb-6">
          <div className="flex items-center justify-between px-5 py-3 bg-[#f8f8f8] border-b border-[#e8e8e8]">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-sm bg-[#6161FF]" />
              <span className="font-semibold text-sm text-[#1a1a1a]">Q2 Marketing Sprint</span>
              <span className="text-xs text-[#8a8a8a] bg-white px-2 py-0.5 rounded border border-[#e8e8e8]">
                4 humans &middot; 3 agents
              </span>
            </div>
            <span className="text-xs font-semibold text-[#00D2D2] bg-[#00D2D2]/10 px-3 py-1 rounded-lg">
              + New Agent
            </span>
          </div>

          <div className="grid grid-cols-[1fr_140px_110px] px-5 py-2 text-xs font-semibold text-[#8a8a8a] uppercase tracking-wider border-b border-[#e8e8e8] bg-[#fafafa]">
            <div>Task</div>
            <div>Assignee</div>
            <div>Status</div>
          </div>

          {mockTasks.map((task, i) => (
            <motion.div
              key={task.name}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="grid grid-cols-[1fr_140px_110px] px-5 py-3 border-b border-[#f0f0f0] items-center text-sm hover:bg-[#fafafa] transition-colors"
            >
              <div className="text-[#4a4a4a] truncate">{task.name}</div>
              <div className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] text-white font-bold ${
                    task.type === 'agent'
                      ? 'bg-gradient-to-br from-[#6161FF] to-[#00D2D2]'
                      : 'bg-[#579BFC]'
                  }`}
                >
                  {task.type === 'agent' ? 'AI' : task.assignee.split(' ').map((w) => w[0]).join('')}
                </div>
                <span
                  className={`text-xs truncate ${
                    task.type === 'agent' ? 'text-[#6161FF] font-medium' : 'text-[#6b6b6b]'
                  }`}
                >
                  {task.assignee}
                </span>
              </div>
              <span
                className="text-xs px-2.5 py-1 rounded-full text-white font-medium w-fit"
                style={{ background: task.statusColor }}
              >
                {task.status}
              </span>
            </motion.div>
          ))}
        </div>
      </StaggerChild>

      <StaggerChild index={1}>
        <div className="rounded-2xl border border-[#e8e8e8] bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold text-[#8a8a8a] uppercase tracking-wider mb-3">
            Agent Activity Feed
          </div>
          <div className="space-y-2">
            {activityLog.map((log, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-center gap-3 text-sm"
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#6161FF] to-[#00D2D2] flex items-center justify-center shrink-0">
                  <span className="text-[8px] text-white font-bold">AI</span>
                </div>
                <span className="text-[#6161FF] font-medium text-xs">{log.agent}</span>
                <span className="text-[#4a4a4a] text-xs flex-1">{log.action}</span>
                <span className="text-[#9a9a9a] text-xs">{log.time}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </StaggerChild>
    </SlideShell>
  );
}
