import { Zap, LayoutList, Calendar, Activity, Users } from 'lucide-react';
import SlideShell, { SlideTitle, SlideSubtitle, StaggerChild } from './SlideShell';

const agents = [
  {
    title: 'Intake Orchestration Agent',
    subtitle: 'From submission to structured evaluation',
    icon: LayoutList,
    impact: ['Reduces PMO triage overhead', 'Shortens review cycles', 'Standardizes governance'],
  },
  {
    title: 'Campaign Planning Agent',
    subtitle: 'From approval to launch readiness',
    icon: Calendar,
    impact: ['Faster time-to-launch', 'More predictable delivery', 'Higher campaign throughput'],
  },
  {
    title: 'Execution Health Agent',
    subtitle: 'From tracking to proactive protection',
    icon: Activity,
    impact: ['Protects revenue-linked campaigns', 'Shifts from passive tracking to delivery assurance'],
  },
  {
    title: 'Resource Planning & Auto-Assignment Agent',
    subtitle: 'From reactive staffing to capacity intelligence',
    icon: Users,
    impact: ['Improves utilization', 'Scales output without scaling headcount', 'Enables proactive workforce planning'],
  },
];

const exampleAccounts = [
  { name: 'MVET', arr: '$314K' },
  { name: 'Colibi', arr: '$259K' },
  { name: 'Shipyard', arr: '$273K' },
  { name: 'Antares', arr: '$270K' },
  { name: 'Goodway Group', arr: '$200K' },
  { name: 'The Channel Company', arr: '$176K' },
  { name: 'Heritage Auctions', arr: '$170K' },
  { name: 'Lexitas', arr: '$127K' },
];

export default function CustomerSentimentSlide() {
  return (
    <SlideShell dark>
      <SlideTitle dark>Customer Sentiment: Executive POV</SlideTitle>
      <SlideSubtitle dark>
        Marketing & resource-driven Mid-Market accounts — AI shifts from productivity feature to core operational infrastructure.
      </SlideSubtitle>

      <StaggerChild index={0}>
        <div className="p-5 rounded-xl border-l-4 border-[#00D2D2] bg-[#00D2D2]/10 mb-8">
          <p className="text-white/90 text-base leading-relaxed italic">
            &ldquo;AI&apos;s highest-value opportunity is not task assistance — it is becoming the operating layer that governs how marketing and delivery organizations function.&rdquo;
          </p>
        </div>
      </StaggerChild>

      <StaggerChild index={1}>
        <div className="mb-6">
          <div className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">The Shift</div>
          <p className="text-white/80 text-sm leading-relaxed">
            Intake capture is no longer the bottleneck. The real opportunity is <span className="text-[#00D2D2] font-medium">planning campaigns</span>, ensuring <span className="text-[#00D2D2] font-medium">execution health</span>, and intelligently <span className="text-[#00D2D2] font-medium">allocating resources</span> — before and after intake is approved.
          </p>
        </div>
      </StaggerChild>

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {agents.map((a, i) => {
          const Icon = a.icon;
          return (
            <StaggerChild key={a.title} index={2 + i}>
              <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.03]">
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-9 h-9 rounded-lg bg-[#6161FF]/20 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-[#00D2D2]" />
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm">{a.title}</div>
                    <div className="text-xs text-white/50">{a.subtitle}</div>
                  </div>
                </div>
                <ul className="space-y-1 ml-12">
                  {a.impact.map((imp) => (
                    <li key={imp} className="text-xs text-white/70 flex items-center gap-2">
                      <Zap className="w-3 h-3 text-[#00D2D2] shrink-0" />
                      {imp}
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerChild>
          );
        })}
      </div>

      <StaggerChild index={6}>
        <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.03] mb-4">
          <div className="text-xs font-bold text-[#00D2D2] uppercase tracking-wider mb-2">Strategic Implication</div>
          <p className="text-white/80 text-sm">
            For marketing-heavy mid-market organizations, AI shifts from <span className="text-white/50">productivity feature</span> to <span className="text-[#00D2D2] font-medium">core infrastructure</span>. Full lifecycle: Intake → Evaluation → Planning → Execution → Capacity Optimization.
          </p>
        </div>
      </StaggerChild>

      <StaggerChild index={7}>
        <div className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">Example accounts (Mid-Market)</div>
        <div className="flex flex-wrap gap-3">
          {exampleAccounts.map((acc) => (
            <span
              key={acc.name}
              className="px-3 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.02] text-xs"
            >
              <span className="text-white font-medium">{acc.name}</span>
              <span className="text-white/50 ml-2">{acc.arr} ARR</span>
            </span>
          ))}
        </div>
      </StaggerChild>
    </SlideShell>
  );
}
