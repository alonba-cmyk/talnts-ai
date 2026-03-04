import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Check, Users, LayoutGrid, Shield } from 'lucide-react';
import SlideShell, { SlideTitle, SlideSubtitle } from './SlideShell';
import { storyLayers } from './gtmData';

const LAYER_ICONS = { Users, LayoutGrid, Shield } as const;

export default function HowWeTellStorySlide() {
  const [openLayer, setOpenLayer] = useState<0 | 1 | 2 | null>(null);

  return (
    <SlideShell dark>
      <SlideTitle dark>How to tell our story</SlideTitle>
      <SlideSubtitle dark>
        Three layers that define our platform — click to expand
      </SlideSubtitle>

      <div className="space-y-3 mt-6 max-w-3xl mx-auto">
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
                  <span className="text-xs font-semibold text-white/50">Layer {layer.number} of 3</span>
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
                    <div className="px-5 pb-5 pt-2 space-y-4">
                      <p className="text-sm text-white/60">{layer.subtitle}</p>
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
    </SlideShell>
  );
}
