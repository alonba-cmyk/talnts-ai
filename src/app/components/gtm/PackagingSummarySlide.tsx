import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Check, Users, LayoutGrid, Shield, LayoutDashboard, Square, Lock } from 'lucide-react';
import SlideShell, { SlideTitle, SlideSubtitle } from './SlideShell';
import { storyLayers } from './gtmData';
import vibeLogo from '@/assets/069a22575b2de9057cfc00d9b4538d072f7fe115.png';
import sidekickLogo from '@/assets/1babfe88a809998ec3c5c5d597d8051ef7639a6f.png';
import agentsLogo from '@/assets/99be461a455ae49743d963276e2023ed6cd1445d.png';
import workflowsLogo from '@/assets/workflows-logo.png';
import personImg1 from '@/assets/a8016eb62d3e284810c5691fa950de5343f7d776.png';
import personImg2 from '@/assets/4f1259d102c1081ca7d88367c1ec9d3487166104.png';
import agentImg1 from '@/assets/053936dfeea2ccad575c77f11dabe02cb2e01b92.png';
import agentImg2 from '@/assets/f158e4bd7406bb7f1accf54fb06c7de8cfd09e48.png';

const LAYER_ICONS = { Users, LayoutGrid, Shield } as const;

const EXECUTION_PRODUCTS = [
  { label: 'monday vibe', logo: vibeLogo },
  { label: 'monday sidekick', logo: sidekickLogo },
  { label: 'monday agents', logo: agentsLogo },
  { label: 'monday workflows', logo: workflowsLogo },
];

const WORK_CONTEXT_ICONS = [
  { icon: LayoutGrid, label: 'Boards' },
  { icon: Square, label: 'Items' },
  { icon: LayoutDashboard, label: 'Dashboards' },
];

export default function PackagingSummarySlide() {
  const [openLayer, setOpenLayer] = useState<0 | 1 | 2 | null>(null);

  return (
    <SlideShell dark>
      <SlideTitle dark>Our packaging</SlideTitle>
      <SlideSubtitle dark>
        Three layers that define our platform — click to expand
      </SlideSubtitle>

      <div className="relative mt-6 max-w-4xl mr-auto">
        {/* Agentic Work Platform — frames the content */}
        <div className="absolute -top-3 left-0 right-0 flex justify-center pointer-events-none">
          <span className="inline-block px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-white/90 bg-gradient-to-r from-[#6161FF]/30 to-[#00D2D2]/30 border border-white/[0.15]">
            Agentic Work Platform
          </span>
        </div>
        <div className="rounded-2xl border-2 border-white/[0.12] bg-white/[0.02] p-6 pt-8 space-y-3">
        {storyLayers.map((layer, idx) => {
          const isOpen = openLayer === idx;
          const Icon = LAYER_ICONS[layer.lucideIcon as keyof typeof LAYER_ICONS] ?? Users;
          return (
            <motion.div
              key={layer.number}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="rounded-xl border border-white/[0.08] bg-white/[0.03] overflow-hidden hover:border-white/[0.12] transition-colors"
            >
              <button
                type="button"
                onClick={() => setOpenLayer(isOpen ? null : idx)}
                className={`w-full text-left px-5 py-4 flex items-center justify-between gap-4 transition-all hover:bg-white/[0.05] cursor-pointer ${
                  isOpen ? 'border-b border-white/[0.06]' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: layer.color + '22', color: layer.color }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xl font-bold text-white/70">{layer.number}</span>
                  <h3 className="text-base md:text-lg font-semibold text-white">{layer.title}</h3>
                </div>
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-white/50 shrink-0"
                >
                  <ChevronDown className="w-5 h-5" />
                </motion.span>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-2 space-y-4 text-left">
                      <p className="text-sm text-white/60">{layer.subtitle}</p>

                      {/* Execution layer: Agents + Humans leading, tools supporting */}
                      {layer.number === 1 && (
                        <div className="space-y-3 text-left">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-[#6161FF]/10 border border-[#6161FF]/20">
                              <div className="flex items-center gap-3">
                                <div className="flex gap-1.5">
                                  <img src={personImg1} alt="" className="w-12 h-12 rounded-full object-cover ring-2 ring-[#00D2D2]/50" />
                                  <img src={personImg2} alt="" className="w-12 h-12 rounded-full object-cover ring-2 ring-[#00D2D2]/50" />
                                </div>
                                <span className="text-sm font-medium text-white/90">Humans</span>
                              </div>
                              <div className="w-px h-10 bg-white/20" />
                              <div className="flex items-center gap-3">
                                <div className="flex gap-1.5">
                                  <img src={agentImg1} alt="" className="w-12 h-12 rounded-full object-cover ring-2 ring-[#6161FF]/50" />
                                  <img src={agentImg2} alt="" className="w-12 h-12 rounded-full object-cover ring-2 ring-[#6161FF]/50" />
                                </div>
                                <span className="text-sm font-medium text-white/90">Agents</span>
                              </div>
                            </div>
                            <span className="text-sm text-white/50">at the center</span>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs text-white/40 mr-1">Supporting tools:</span>
                            {EXECUTION_PRODUCTS.map((p) => (
                              <div
                                key={p.label}
                                className="inline-flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] shrink-0"
                              >
                                <img src={p.logo} alt="" className="w-5 h-5 rounded object-contain" />
                                <span className="text-[11px] font-medium text-white/80">{p.label}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Work context layer: visual pills */}
                      {layer.number === 2 && (
                        <div className="flex flex-wrap gap-2 justify-start">
                          {WORK_CONTEXT_ICONS.map(({ icon: IconCmp, label }) => (
                            <div
                              key={label}
                              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.06] border border-white/[0.08]"
                              style={{ color: layer.color }}
                            >
                              <IconCmp className="w-4 h-4 shrink-0" />
                              <span className="text-xs font-medium text-white">{label}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Data layer: shield + lock emphasis */}
                      {layer.number === 3 && (
                        <div className="flex flex-wrap gap-2 justify-start">
                          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.06] border border-white/[0.08]">
                            <Shield className="w-4 h-4 text-[#00D2D2]" />
                            <span className="text-xs font-medium text-white">Security</span>
                          </div>
                          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.06] border border-white/[0.08]">
                            <Lock className="w-4 h-4 text-[#00D2D2]" />
                            <span className="text-xs font-medium text-white">Governance</span>
                          </div>
                        </div>
                      )}

                      <ul className="space-y-2">
                        {layer.points.map((point, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-white/85">
                            <Check
                              className="w-4 h-4 shrink-0 mt-0.5"
                              style={{ color: layer.color }}
                            />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
        </div>
      </div>
    </SlideShell>
  );
}
