import { motion } from 'motion/react';
import { Megaphone, BarChart3, Handshake, Settings, Shield, RefreshCw } from 'lucide-react';
import SlideShell, { SlideTitle, SlideSubtitle, StaggerChild } from './SlideShell';
import { departmentIntentBlend } from './gtmData';

const ICON_MAP = {
  Megaphone,
  BarChart3,
  Handshake,
  Settings,
  Shield,
  RefreshCw,
} as const;

export default function CustomerIntentSlide() {
  return (
    <SlideShell dark>
      <SlideTitle dark>Intent Blend: Core vs Operational /projects</SlideTitle>
      <SlideSubtitle dark>
        How each department balances core business work with day‑to‑day operations.
      </SlideSubtitle>

      <div className="mt-4 mb-2 flex justify-center">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs text-white/40 border border-white/[0.1] bg-white/[0.02]">
          No validation on the information
        </span>
      </div>

      <div className="space-y-6 max-w-3xl">
        <StaggerChild index={0}>
          <div className="flex justify-between text-xs text-white/40 mb-1">
            <span>Core</span>
            <span>Operational /projects</span>
          </div>
        </StaggerChild>

        {departmentIntentBlend.map((dept, i) => {
          const Icon = ICON_MAP[dept.lucideIcon as keyof typeof ICON_MAP] ?? Megaphone;
          const corePercent = 100 - dept.operationalPercent;
          return (
            <StaggerChild key={dept.name} index={i + 1}>
              <div className="flex items-center gap-4">
                <div
                  className="w-40 shrink-0 flex items-center gap-2"
                  title={dept.label}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: dept.color + '22', color: dept.color }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-white truncate">{dept.name}</div>
                    {dept.label && (
                      <div className="text-xs text-white/45 truncate">{dept.label}</div>
                    )}
                  </div>
                </div>

                <div className="flex-1 h-10 rounded-lg overflow-hidden flex bg-white/[0.06] border border-white/[0.08]">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${corePercent}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full shrink-0"
                    style={{
                      background: dept.color + '44',
                      borderRight: `1px solid ${dept.color}66`,
                    }}
                  />
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${dept.operationalPercent}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.15 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full shrink-0"
                    style={{
                      background: dept.color + '18',
                    }}
                  />
                </div>

                <div className="w-16 shrink-0 text-right text-sm text-white/60 tabular-nums">
                  {dept.operationalPercent}% ops
                </div>
              </div>
            </StaggerChild>
          );
        })}
      </div>

      <StaggerChild index={8}>
        <div className="mt-10 p-5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <div className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">What each means</div>
          <div className="grid gap-3 text-sm text-white/70 md:grid-cols-2">
            <div>
              <span className="font-semibold text-white/90">Core</span>
              <span className="block mt-1 text-white/55">Strategic outcomes, primary business value — the “why” the department exists.</span>
            </div>
            <div>
              <span className="font-semibold text-white/90">Operational /projects</span>
              <span className="block mt-1 text-white/55">Workflows, boards, execution & coordination — the “how” day‑to‑day work gets done.</span>
            </div>
          </div>
        </div>
      </StaggerChild>
    </SlideShell>
  );
}
