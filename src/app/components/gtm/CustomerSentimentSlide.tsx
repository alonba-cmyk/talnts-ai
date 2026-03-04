import { LayoutList, Calendar, Activity, Users } from 'lucide-react';
import SlideShell, { SlideTitle, SlideSubtitle, StaggerChild } from './SlideShell';

const agents = [
  {
    title: 'Intake Orchestration Agent',
    oneLiner: 'Submission → structured evaluation',
    icon: LayoutList,
  },
  {
    title: 'Campaign Planning Agent',
    oneLiner: 'Approval → launch readiness',
    icon: Calendar,
  },
  {
    title: 'Execution Health Agent',
    oneLiner: 'Tracking → proactive protection',
    icon: Activity,
  },
  {
    title: 'Resource Planning Agent',
    oneLiner: 'Reactive staffing → capacity intelligence',
    icon: Users,
  },
];

export default function CustomerSentimentSlide() {
  return (
    <SlideShell dark>
      <SlideTitle dark>Customer Sentiment: Executive POV</SlideTitle>
      <SlideSubtitle dark>
        Mid-Market marketing & delivery — AI as the operating layer, not just task assistance.
      </SlideSubtitle>

      <StaggerChild index={0}>
        <p className="text-white/75 text-sm leading-relaxed mb-6 italic">
          &ldquo;The real opportunity: <span className="text-[#00D2D2] font-medium">planning campaigns</span>, <span className="text-[#00D2D2] font-medium">execution health</span>, <span className="text-[#00D2D2] font-medium">allocating resources</span> — before and after intake.&rdquo;
        </p>
      </StaggerChild>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {agents.map((a, i) => {
          const Icon = a.icon;
          return (
            <StaggerChild key={a.title} index={1 + i}>
              <div className="flex items-center gap-3 p-4 rounded-xl border border-white/[0.08] bg-white/[0.03]">
                <div className="w-10 h-10 rounded-lg bg-[#6161FF]/20 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-[#00D2D2]" />
                </div>
                <div>
                  <div className="font-semibold text-white text-sm">{a.title}</div>
                  <div className="text-xs text-white/50">{a.oneLiner}</div>
                </div>
              </div>
            </StaggerChild>
          );
        })}
      </div>
    </SlideShell>
  );
}
