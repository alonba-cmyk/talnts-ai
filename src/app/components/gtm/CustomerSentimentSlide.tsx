import { LayoutList, CalendarCheck, Activity, Users } from 'lucide-react';
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
    icon: CalendarCheck,
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
        <div className="mb-8 p-5 rounded-xl border border-[#00D2D2]/20 bg-[#00D2D2]/5">
          <p className="text-base md:text-lg text-white/90 leading-relaxed italic">
            &ldquo;The real opportunity:{' '}
            <span className="text-[#00D2D2] font-semibold not-italic">planning campaigns</span>,{' '}
            <span className="text-[#00D2D2] font-semibold not-italic">execution health</span>,{' '}
            <span className="text-[#00D2D2] font-semibold not-italic">allocating resources</span>
            {' '}— before and after intake.&rdquo;
          </p>
        </div>
      </StaggerChild>

      <div className="space-y-2 mb-2">
        <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">Four AI agents address this opportunity</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agents.map((a, i) => {
          const Icon = a.icon;
          return (
            <StaggerChild key={a.title} index={1 + i}>
              <div className="flex items-start gap-4 p-5 rounded-xl border border-white/[0.12] bg-white/[0.06] hover:bg-white/[0.08] transition-colors">
                <div className="w-12 h-12 rounded-xl bg-[#00D2D2]/15 flex items-center justify-center shrink-0 border border-[#00D2D2]/30">
                  <Icon className="w-6 h-6 text-[#00D2D2]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-white text-base mb-1">{a.title}</div>
                  <div className="text-sm text-white/70">{a.oneLiner}</div>
                </div>
              </div>
            </StaggerChild>
          );
        })}
      </div>
    </SlideShell>
  );
}
