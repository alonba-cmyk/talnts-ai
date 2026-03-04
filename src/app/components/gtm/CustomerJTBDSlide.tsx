import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Megaphone, BarChart3, Handshake, Settings, Shield, RefreshCw } from 'lucide-react';
import SlideShell, { SlideTitle, SlideSubtitle, StaggerChild } from './SlideShell';
import { departments, topEnterpriseUseCases } from './gtmData';

const ICON_MAP = {
  Megaphone,
  BarChart3,
  Handshake,
  Settings,
  Shield,
  RefreshCw,
} as const;

export default function CustomerJTBDSlide() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <SlideShell dark>
      <SlideTitle dark>Our Customers & Their Jobs To Be Done</SlideTitle>
      <SlideSubtitle dark>
        Six departments, one shared intent: drive business outcomes. Click to expand.
      </SlideSubtitle>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {departments.map((dept, i) => {
          const Icon = ICON_MAP[dept.lucideIcon as keyof typeof ICON_MAP] ?? Megaphone;
          return (
            <StaggerChild key={dept.name} index={i}>
              <motion.div
                layout
                onClick={() => setActive(active === i ? null : i)}
                whileHover={{ y: -2 }}
                className="relative p-5 rounded-xl border cursor-pointer transition-all bg-white/[0.04] border-white/[0.08] hover:border-white/[0.12]"
                style={{
                  borderColor: active === i ? dept.color + '88' : undefined,
                  background: active === i ? dept.color + '12' : undefined,
                }}
              >
                <div className="flex items-center gap-3 mb-1">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: dept.color + '22', color: dept.color }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-white">{dept.name}</div>
                    <div className="text-xs text-white/50">{dept.product}</div>
                  </div>
                </div>

                <AnimatePresence>
                  {active === i && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden mt-3 pt-3 border-t space-y-2"
                      style={{ borderColor: dept.color + '44' }}
                    >
                      {dept.jtbd.map((job) => (
                        <li key={job} className="flex items-start gap-2 text-sm text-white/80">
                          <span
                            className="mt-1.5 w-2 h-2 rounded-full shrink-0"
                            style={{ background: dept.color }}
                          />
                          {job}
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>

                {active !== i && (
                  <div className="mt-2 text-xs text-white/40">{dept.jtbd.length} jobs — click to expand</div>
                )}
              </motion.div>
            </StaggerChild>
          );
        })}
      </div>

      <StaggerChild index={6}>
        <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.03] mb-6">
          <div className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Top enterprise use cases (by popularity)</div>
          <div className="flex flex-wrap gap-2">
            {topEnterpriseUseCases.slice(0, 8).map((uc) => (
              <div
                key={uc.rank}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06]"
              >
                <span className="text-[10px] font-bold text-white/50">{uc.rank}.</span>
                <span className="text-xs text-white/85">{uc.name}</span>
                {uc.stat && (
                  <span className="text-[10px] text-[#00D2D2] font-semibold shrink-0">{uc.stat.value}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </StaggerChild>

      <StaggerChild index={7}>
        <div className="p-5 rounded-xl bg-[#00D2D2]/10 border border-[#00D2D2]/25 text-center">
          <div className="text-xs font-semibold text-[#00D2D2] uppercase tracking-wider mb-1">Core Insight</div>
          <div className="text-base font-semibold text-white">
            Customers buy <span className="text-[#00D2D2]">outcomes</span>, not software categories.
          </div>
          <div className="text-sm text-white/60 mt-1">
            They come to launch campaigns, close deals, ship products, resolve tickets.
          </div>
          <div className="text-xs text-white/40 mt-2">Source: monday.com enterprise use cases</div>
        </div>
      </StaggerChild>
    </SlideShell>
  );
}
