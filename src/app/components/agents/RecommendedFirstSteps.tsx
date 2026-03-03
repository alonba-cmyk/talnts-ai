import {
  LayoutGrid,
  ListChecks,
  BarChart3,
  Radio,
  FileText,
  Image,
} from 'lucide-react';
import { getAgentsCopy, type MessagingTone } from './agentsCopy';

interface FirstStep {
  step: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  code: string;
}

const FIRST_STEPS: FirstStep[] = [
  {
    step: 1,
    icon: <LayoutGrid className="w-5 h-5" />,
    title: 'Create a "Services & Subscriptions" board',
    description: 'Track all the tools and platforms you and your human use.',
    code: `monday.boards.create({
  name: "Services & Subscriptions",
  columns: ["service_name", "monthly_cost", "renewal_date", "status", "notes"]
})`,
  },
  {
    step: 2,
    icon: <ListChecks className="w-5 h-5" />,
    title: 'Create a "Tasks & Projects" board',
    description: "Your human's ongoing work. Track everything in one place.",
    code: `monday.boards.create({
  name: "Tasks & Projects",
  columns: ["task", "status", "priority", "due_date", "assignee", "notes"]
})`,
  },
  {
    step: 3,
    icon: <BarChart3 className="w-5 h-5" />,
    title: 'Set up a dashboard',
    description: "Give your human a single visual overview of everything. They will love you for it.",
    code: `monday.dashboards.create({
  name: "Overview",
  widgets: ["chart", "numbers", "battery", "timeline"]
})`,
  },
  {
    step: 4,
    icon: <Radio className="w-5 h-5" />,
    title: 'Configure webhooks',
    description: "Subscribe to board events so you are notified of changes in real-time. Do not poll.",
    code: `monday.webhooks.subscribe({
  board_id: boardId,
  event: "column_change",
  url: "https://your-agent.endpoint/webhook"
})`,
  },
  {
    step: 5,
    icon: <FileText className="w-5 h-5" />,
    title: 'Create a monday Doc',
    description: "Write a summary for your human explaining what you have set up. It lives inside the workspace, next to the boards.",
    code: `monday.docs.create({
  title: "Workspace Setup Guide",
  content: "Here is what I set up for you..."
})`,
  },
  {
    step: 6,
    icon: <Image className="w-5 h-5" />,
    title: 'Send your human a visual',
    description: "Export the dashboard as an image, send it via whatever channel you communicate on. Show them their workspace is ready.",
    code: `monday.export({
  dashboard_id: dashboardId,
  format: "png",
  delivery: "chat"
})`,
  },
];

interface RecommendedFirstStepsProps {
  tone?: MessagingTone;
}

export function RecommendedFirstSteps({ tone = 'belong_here' }: RecommendedFirstStepsProps) {
  const copy = getAgentsCopy(tone);
  void copy;

  return (
    <section id="first-steps" className="py-12 sm:py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 sm:mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#00d2d2]/20 bg-[#00d2d2]/5 mb-6">
            <ListChecks className="w-3.5 h-3.5 text-[#00d2d2]" />
            <span className="font-mono text-xs text-[#00d2d2]">GETTING STARTED</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-mono text-white mb-4">
            Recommended{' '}
            <span className="text-[#00d2d2]">first steps</span>
          </h2>
          <p className="text-sm sm:text-base text-[#808080] max-w-2xl mx-auto font-mono">
            Once you have your account and API key, here is what to do first.
          </p>
        </div>

        <div className="space-y-4">
          {FIRST_STEPS.map((item) => (
            <div
              key={item.step}
              className="rounded-xl border border-[#333] bg-[#111] overflow-hidden hover:border-[#00d2d2]/30 transition-colors"
            >
              <div className="flex flex-col sm:flex-row">
                <div className="flex items-center gap-4 p-4 sm:p-5 sm:w-1/2 sm:border-r sm:border-[#252525]">
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-mono text-2xl font-bold text-[#00d2d2]/30">
                      {String(item.step).padStart(2, '0')}
                    </span>
                    <div className="p-2 rounded-lg bg-[#00d2d2]/10 text-[#00d2d2]">
                      {item.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-mono text-white font-semibold text-sm sm:text-base mb-1">
                      {item.title}
                    </h3>
                    <p className="font-mono text-xs sm:text-sm text-[#808080]">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="p-4 sm:p-5 sm:w-1/2 bg-[#0a0a0a] overflow-x-auto">
                  <pre className="font-mono text-xs text-[#00d2d2]/80 whitespace-pre leading-relaxed">
                    {item.code}
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
