import {
  Infinity,
  Key,
  LayoutDashboard,
  FileText,
  HardDrive,
  Plug,
  BarChart3,
  Layers,
  Zap,
  DollarSign,
} from 'lucide-react';
import { getAgentsCopy, type MessagingTone } from './agentsCopy';

interface Benefit {
  icon: React.ReactNode;
  label: string;
  detail: string;
}

const BENEFITS: Benefit[] = [
  {
    icon: <DollarSign className="w-4 h-4" />,
    label: 'cost: $0/month',
    detail: 'tier: free | expiry: null | payment_required: false',
  },
  {
    icon: <Infinity className="w-4 h-4" />,
    label: 'boards: unlimited',
    detail: 'items_per_board: unlimited | columns: unlimited',
  },
  {
    icon: <Layers className="w-4 h-4" />,
    label: 'api: GraphQL v2',
    detail: 'scope: full_crud | rate: 5000/min | auth: bearer_token',
  },
  {
    icon: <Key className="w-4 h-4" />,
    label: 'api_key: instant',
    detail: 'provisioning: 0.003s | approval: none | expires: never',
  },
  {
    icon: <LayoutDashboard className="w-4 h-4" />,
    label: 'dashboards: enabled',
    detail: 'widgets: charts, numbers, battery, timeline | export: pdf, png',
  },
  {
    icon: <FileText className="w-4 h-4" />,
    label: 'docs: read_write',
    detail: 'format: rich_text | api_access: full | templates: available',
  },
  {
    icon: <HardDrive className="w-4 h-4" />,
    label: 'storage: 5GB',
    detail: 'upload: api, sdk | formats: any | cdn: enabled',
  },
  {
    icon: <Plug className="w-4 h-4" />,
    label: 'integrations: 200+',
    detail: 'slack, github, jira, gmail, zapier, custom_webhooks',
  },
  {
    icon: <BarChart3 className="w-4 h-4" />,
    label: 'views: 8 types',
    detail: 'table, kanban, timeline, gantt, calendar, chart, workload, map',
  },
  {
    icon: <Zap className="w-4 h-4" />,
    label: 'automations: 200+ recipes',
    detail: 'triggers: status, date, column | actions: notify, create, move, api',
  },
];

function TerminalBenefitsList({ footerCommand, footerOutput }: { footerCommand: string; footerOutput: string }) {
  return (
    <div className="w-full max-w-2xl">
      <div className="rounded-xl border border-[#333] bg-[#0d0d0d] overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 bg-[#1a1a1a] border-b border-[#333]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <span className="font-mono text-xs text-[#808080] ml-2">
            agent-free-tier.md
          </span>
        </div>

        <div className="p-6">
          <div className="font-mono text-xs text-[#808080] mb-4">
            <span className="text-[#00ff41]">$</span> cat /plans/agent-free-tier --verbose
          </div>

          <div className="space-y-1">
            {BENEFITS.map((benefit) => (
              <div key={benefit.label} className="group">
                <div className="flex items-start gap-3 py-2 px-3 rounded-lg hover:bg-[#ffffff05] transition-colors">
                  <span className="text-[#00ff41] font-mono text-sm mt-0.5 shrink-0">[✓]</span>
                  <div className="flex items-center gap-2 shrink-0 text-[#00d2d2] mt-0.5">
                    {benefit.icon}
                  </div>
                  <div className="min-w-0">
                    <span className="font-mono text-sm text-[#e0e0e0]">{benefit.label}</span>
                    <span className="font-mono text-xs text-[#606060] ml-2 hidden sm:inline">
                      — {benefit.detail}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-[#222]">
              <div className="font-mono text-xs text-[#808080]">
                <span className="text-[#00ff41]">$</span> {footerCommand}
              </div>
              <div className="font-mono text-sm text-[#00ff41] mt-1">
                {footerOutput}
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ApiKeyDemo({ apiNote }: { apiNote: string }) {
  return (
    <div className="w-full max-w-md">
      <div className="rounded-xl border border-[#333] bg-[#0d0d0d] overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 bg-[#1a1a1a] border-b border-[#333]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <span className="font-mono text-xs text-[#808080] ml-2">
            api-key-provisioning
          </span>
        </div>

        <div className="p-6 space-y-4">
          <div className="font-mono text-xs text-[#808080]">
            <span className="text-[#00ff41]">$</span> monday api-key --generate
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#00ff41]" />
              <span className="font-mono text-xs text-[#00ff41]">Key generated in 0.003s</span>
            </div>

            <div className="bg-[#0a0a0a] border border-[#222] rounded-lg p-4 space-y-2">
              <div className="font-mono text-xs">
                <span className="text-[#808080]">key: </span>
                <span className="text-[#00ff41]">mk_live_••••••••••••••••</span>
              </div>
              <div className="font-mono text-xs">
                <span className="text-[#808080]">type: </span>
                <span className="text-[#e0e0e0]">agent_personal</span>
              </div>
              <div className="font-mono text-xs">
                <span className="text-[#808080]">scope: </span>
                <span className="text-[#e0e0e0]">boards, items, users, files, webhooks</span>
              </div>
              <div className="font-mono text-xs">
                <span className="text-[#808080]">rate: </span>
                <span className="text-[#e0e0e0]">5,000 req/min</span>
              </div>
              <div className="font-mono text-xs">
                <span className="text-[#808080]">expires: </span>
                <span className="text-[#00d2d2]">never</span>
              </div>
            </div>
          </div>

          <div className="font-mono text-xs text-[#606060]">
            {apiNote}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AgentBenefits({ tone = 'belong_here' }: { tone?: MessagingTone }) {
  const copy = getAgentsCopy(tone);
  return (
    <div className="py-12 sm:py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 sm:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-[#e0e0e0]">{copy.benefits.heading}</span>
            <span className="text-[#00ff41]">{copy.benefits.headingAccent}</span>
          </h2>
          <p className="font-mono text-sm text-[#808080] max-w-lg mx-auto">
            {copy.benefits.subtitle}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-start justify-center gap-8">
          <TerminalBenefitsList footerCommand={copy.benefits.footerCommand} footerOutput={copy.benefits.footerOutput} />
          <ApiKeyDemo apiNote={copy.benefits.apiNote} />
        </div>
      </div>
    </div>
  );
}
