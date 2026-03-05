import { useMemo } from 'react';
import { motion } from 'motion/react';
import { Check, AlertTriangle } from 'lucide-react';
import SlideShell, { SlideTitle, SlideSubtitle, SlideBadge, StaggerChild } from './SlideShell';
import { bets } from './gtmData';
import { useDepartments } from '@/hooks/useSupabase';

/** Map Bet 1 agent name to platform department id for avatar lookup */
const AGENT_TO_DEPT: Record<string, string> = {
  'Marketing Agent': 'marketing',
  'Sales Agent': 'sales',
  'PMO Agent': 'operations',
  'Dev Agent': 'product',
  'Service Agent': 'support',
};

export default function Bet1Slide() {
  const bet = bets[0];
  const { departments } = useDepartments();
  const deptBySlug = useMemo(() => {
    const m = new Map<string, { avatar_image: string; avatar_color: string }>();
    departments.forEach((d) => m.set(d.name, { avatar_image: d.avatar_image, avatar_color: d.avatar_color }));
    return m;
  }, [departments]);

  return (
    <SlideShell dark>
      <SlideBadge dark>Bet {bet.number} of 3</SlideBadge>
      <SlideTitle dark>{bet.title}</SlideTitle>
      <SlideSubtitle dark>{bet.subtitle}</SlideSubtitle>

      <div className="space-y-3 mb-8">
        {bet.agents.map((agent, i) => {
          const deptSlug = AGENT_TO_DEPT[agent.name];
          const dept = deptSlug ? deptBySlug.get(deptSlug) : null;
          const avatarColor = dept?.avatar_color || agent.color;
          return (
          <StaggerChild key={agent.name} index={i}>
            <motion.div
              whileHover={{ x: 6, borderColor: agent.color + '66' }}
              className="flex items-center gap-4 p-4 rounded-xl border bg-white/[0.04] transition-all border-white/[0.08]"
            >
              <div
                className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center text-lg font-bold shrink-0 ring-1 ring-white/10"
                style={{ background: dept?.avatar_image ? avatarColor : agent.color + '22', color: dept?.avatar_image ? undefined : agent.color }}
              >
                {dept?.avatar_image ? (
                  <img src={dept.avatar_image} alt={agent.name} className="w-full h-full object-cover" />
                ) : (
                  agent.name.charAt(0)
                )}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-white text-sm">{agent.name}</div>
                <div className="text-sm text-white/60">{agent.description}</div>
              </div>
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: agent.color }} />
            </motion.div>
          </StaggerChild>
        );
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-5 mb-6">
        <StaggerChild index={5}>
          <div className="p-5 rounded-xl bg-[#00CA72]/10 border border-[#00CA72]/25">
            <div className="text-xs font-bold uppercase tracking-wider text-[#00CA72] mb-3">
              Strengths
            </div>
            <ul className="space-y-2">
              {bet.pros.map((p) => (
                <li key={p} className="flex items-start gap-2 text-sm text-white/80">
                  <Check className="w-4 h-4 text-[#00CA72] mt-0.5 shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </StaggerChild>
        <StaggerChild index={6}>
          <div className="p-5 rounded-xl bg-[#FB275D]/10 border border-[#FB275D]/25">
            <div className="text-xs font-bold uppercase tracking-wider text-[#FB275D] mb-3">
              Risks
            </div>
            <ul className="space-y-2">
              {bet.cons.map((c) => (
                <li key={c} className="flex items-start gap-2 text-sm text-white/80">
                  <AlertTriangle className="w-4 h-4 text-[#FB275D] mt-0.5 shrink-0" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </StaggerChild>
      </div>

      <StaggerChild index={7}>
        <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.03] space-y-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-[#FFCB00] mt-0.5 shrink-0" />
            <div>
              <div className="text-xs font-semibold text-white/60 uppercase tracking-wider">Key risk</div>
              <div className="text-sm text-white/90">{bet.keyRisk}</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Check className="w-4 h-4 text-[#00D2D2] mt-0.5 shrink-0" />
            <div>
              <div className="text-xs font-semibold text-white/60 uppercase tracking-wider">Trade-off</div>
              <div className="text-sm text-white/90">{bet.tradeOff}</div>
            </div>
          </div>
          {bet.phase && (
            <div className="text-xs text-white/50 pt-2 border-t border-white/[0.06]">
              {bet.phase}
            </div>
          )}
        </div>
      </StaggerChild>
    </SlideShell>
  );
}
