import { useState, useCallback, Fragment } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import imgMultiProduct from '@/assets/product-multi-product.png';
import imgAiCapabilities from '@/assets/product-ai-capabilities.png';
import imgAgentLed from '@/assets/product-agent-led.png';
import AgentLedDiagram from './AgentLedDiagram';

const timelinePoints = [
  {
    id: 'multi-product',
    title: '2025 — Multi product',
    slideTitle: 'Introducing multi-product',
    image: imgMultiProduct,
  },
  {
    id: 'ai-capabilities',
    title: 'January 2026 — AI Capabilities',
    slideTitle: 'Introducing AI capabilities',
    image: imgAiCapabilities,
  },
  {
    id: 'agent-led',
    title: 'Agent led offering',
    slideTitle: 'Humans and Agents working together',
    image: imgAgentLed,
  },
];

export default function ProductTimelineSlide() {
  const [activeIndex, setActiveIndex] = useState(0);
  const point = timelinePoints[activeIndex];

  const goNext = useCallback(() => {
    setActiveIndex((i) => Math.min(i + 1, timelinePoints.length - 1));
  }, []);

  const goPrev = useCallback(() => {
    setActiveIndex((i) => Math.max(i - 1, 0));
  }, []);

  const goTo = useCallback((index: number) => {
    setActiveIndex(Math.max(0, Math.min(index, timelinePoints.length - 1)));
  }, []);

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#0a0a0a]">
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-12 py-12 md:py-16 flex flex-col h-full justify-center">
        {/* Timeline stepper */}
        <div className="flex items-center justify-center gap-4 md:gap-8 mb-6 md:mb-8">
          {timelinePoints.map((p, i) => (
            <Fragment key={p.id}>
              <button
                onClick={() => goTo(i)}
                className="flex flex-col items-center gap-2 group"
              >
                <span
                  className={`block w-3 h-3 rounded-full transition-all ${
                    activeIndex === i
                      ? 'bg-[#00D2D2] scale-125 ring-2 ring-[#00D2D2]/40'
                      : 'bg-white/30 group-hover:bg-white/50'
                  }`}
                />
                <span
                  className={`text-xs md:text-sm font-medium transition-colors ${
                    activeIndex === i ? 'text-white' : 'text-white/50'
                  }`}
                >
                  {p.title}
                </span>
              </button>
              {i < timelinePoints.length - 1 && (
                <div className="hidden md:block w-12 h-px bg-white/20" />
              )}
            </Fragment>
          ))}
        </div>

        {/* Image area with prev/next */}
        <div className="relative flex-1 flex items-center justify-center min-h-[50vh]">
          <button
            onClick={goPrev}
            disabled={activeIndex === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            aria-label="Previous point"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="flex-1 mx-4 md:mx-16 flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={point.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-4xl"
              >
                {point.id === 'agent-led' ? (
                  <div className="w-full max-w-4xl rounded-xl overflow-visible">
                    <AgentLedDiagram />
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-6">
                    <p className="text-xl md:text-2xl font-semibold text-white text-center">
                      {point.slideTitle}
                    </p>
                    <div className="w-full aspect-[4/3] max-h-[55vh] rounded-xl overflow-hidden shadow-2xl">
                      <img
                        src={point.image}
                        alt={point.title}
                        className="w-full h-full object-cover object-[center_25%]"
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <button
            onClick={goNext}
            disabled={activeIndex === timelinePoints.length - 1}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            aria-label="Next point"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
}
