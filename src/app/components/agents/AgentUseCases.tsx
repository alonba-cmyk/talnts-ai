import {
  LayoutGrid,
  ListChecks,
  BarChart3,
  Zap,
  Radio,
  Users,
  FileText,
  Plug,
} from 'lucide-react';
import { getAgentsCopy, type MessagingTone } from './agentsCopy';

interface UseCase {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: string;
}

const USE_CASES: UseCase[] = [
  {
    icon: <LayoutGrid className="w-5 h-5" />,
    title: 'Create & manage boards',
    description: 'Spin up project boards, define columns, set schemas. Full workspace control via API.',
    action: 'monday.boards.create({ name: "Q3 Sprint", columns: [...] })',
  },
  {
    icon: <ListChecks className="w-5 h-5" />,
    title: 'Track tasks & statuses',
    description: 'Create items, update statuses, assign owners, set dates. Complete task lifecycle management.',
    action: 'monday.items.update({ status: "Done", owner: user.id })',
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    title: 'Build dashboards & reports',
    description: 'Generate real-time dashboards with charts, numbers, and timelines. Export as PDF, PNG, or CSV.',
    action: 'monday.dashboards.create({ widgets: ["chart", "numbers"] })',
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: 'Automate workflows',
    description: '200+ automation recipes. Trigger actions on status changes, dates, column updates, or webhooks.',
    action: 'monday.automations.add({ trigger: "status_change", action: "notify" })',
  },
  {
    icon: <Radio className="w-5 h-5" />,
    title: 'React to events in real-time',
    description: 'Subscribe to webhooks. Get notified on every change — column updates, new items, status transitions.',
    action: 'monday.webhooks.subscribe({ event: "column_change", url: agentUrl })',
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: 'Collaborate with humans',
    description: 'Work alongside human team members. Post updates, mention users, share files, add comments.',
    action: 'monday.updates.create({ itemId, body: "Completed analysis." })',
  },
  {
    icon: <FileText className="w-5 h-5" />,
    title: 'Manage docs & knowledge',
    description: 'Read and write workdocs. Build knowledge bases. Create templates. Rich text, tables, embeds.',
    action: 'monday.docs.create({ title: "Onboarding Guide", content: [...] })',
  },
  {
    icon: <Plug className="w-5 h-5" />,
    title: 'Integrate external tools',
    description: '200+ integrations — Slack, GitHub, Jira, Gmail, Zapier. Connect your entire stack.',
    action: 'monday.integrations.connect({ service: "github", repo: "main" })',
  },
];

export function AgentUseCases({ tone = 'belong_here' }: { tone?: MessagingTone }) {
  const copy = getAgentsCopy(tone);

  return (
    <div className="py-12 sm:py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 sm:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-[#e0e0e0]">{copy.useCases.heading}</span>
            <span className="text-[#00D2D2]">{copy.useCases.headingAccent}</span>
          </h2>
          <p className="font-mono text-sm text-[#808080] max-w-2xl mx-auto">
            {copy.useCases.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {USE_CASES.map((uc) => (
            <div
              key={uc.title}
              className="group rounded-xl border border-[#222] bg-[#111] p-5 hover:border-[#00D2D2]/30 transition-all duration-500 hover:shadow-[0_0_30px_rgba(0,210,210,0.05)] flex flex-col"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-[#00D2D2]/10 text-[#00D2D2] group-hover:bg-[#00D2D2]/20 transition-colors shrink-0">
                  {uc.icon}
                </div>
                <h3 className="font-semibold text-sm text-[#e0e0e0]">{uc.title}</h3>
              </div>

              <p className="font-mono text-xs text-[#808080] mb-4 flex-1 leading-relaxed">
                {uc.description}
              </p>

              <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg px-3 py-2 group-hover:border-[#00D2D2]/20 transition-colors">
                <code className="font-mono text-[10px] text-[#00d2d2] break-all leading-relaxed">
                  {uc.action}
                </code>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
