import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import OpeningSlide from './components/gtm/OpeningSlide';
import ChapterSlide from './components/gtm/ChapterSlide';
import ContextSlide from './components/gtm/ContextSlide';
import CustomerIntentSlide from './components/gtm/CustomerIntentSlide';
import CustomerJTBDSlide from './components/gtm/CustomerJTBDSlide';
import AIEcosystemSlide from './components/gtm/AIEcosystemSlide';
import CompetitorLandscapeSlide from './components/gtm/CompetitorLandscapeSlide';
import MarketTrendsSlide from './components/gtm/MarketTrendsSlide';
import AssumptionsSlide from './components/gtm/AssumptionsSlide';
import Bet1Slide from './components/gtm/Bet1Slide';
import Bet2Slide from './components/gtm/Bet2Slide';
import Bet3Slide from './components/gtm/Bet3Slide';

const slides = [
  { id: 'opening', label: 'GTM Strategy', component: () => <OpeningSlide /> },
  { id: 'ch1', label: 'Where We Are', component: () => <ChapterSlide title="Where We Are" sectionNumber={1} /> },
  { id: 'context', label: 'Context', component: ContextSlide },
  { id: 'ch2', label: 'Customers', component: () => <ChapterSlide title="Our Customers" sectionNumber={2} /> },
  { id: 'customer-intent', label: 'Intent Blend', component: CustomerIntentSlide },
  { id: 'jtbd', label: 'JTBD', component: CustomerJTBDSlide },
  { id: 'ch3', label: 'Competition', component: () => <ChapterSlide title="Competitive Landscape" sectionNumber={3} /> },
  { id: 'ai-ecosystem', label: 'AI Ecosystem', component: AIEcosystemSlide },
  { id: 'competitors', label: 'Competitors', component: CompetitorLandscapeSlide },
  { id: 'ch4', label: 'Market', component: () => <ChapterSlide title="Market Trends" sectionNumber={4} /> },
  { id: 'trends', label: 'Market Trends', component: MarketTrendsSlide },
  { id: 'ch5', label: 'Assumptions', component: () => <ChapterSlide title="Our Assumptions" sectionNumber={5} /> },
  { id: 'assumptions', label: 'Assumptions', component: AssumptionsSlide },
  { id: 'ch6', label: 'Bets', component: () => <ChapterSlide title="Our GTM Bets" sectionNumber={6} /> },
  { id: 'bet1', label: 'Bet 1', component: Bet1Slide },
  { id: 'bet2', label: 'Bet 2', component: Bet2Slide },
  { id: 'bet3', label: 'Bet 3', component: Bet3Slide },
];

export default function GTMStrategyPresentation() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showNav, setShowNav] = useState(true);
  const navTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const [direction, setDirection] = useState(0);
  const goToSlide = useCallback((index: number) => {
    const next = Math.max(0, Math.min(index, slides.length - 1));
    setDirection(next > currentSlide ? 1 : -1);
    setCurrentSlide(next);
  }, [currentSlide]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case 'ArrowDown':
        case 'ArrowRight':
        case ' ':
          e.preventDefault();
          if (currentSlide < slides.length - 1) goToSlide(currentSlide + 1);
          break;
        case 'ArrowUp':
        case 'ArrowLeft':
          e.preventDefault();
          if (currentSlide > 0) goToSlide(currentSlide - 1);
          break;
        case 'Home':
          e.preventDefault();
          goToSlide(0);
          break;
        case 'End':
          e.preventDefault();
          goToSlide(slides.length - 1);
          break;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, goToSlide]);

  useEffect(() => {
    function handleMouseMove() {
      setShowNav(true);
      if (navTimeoutRef.current) clearTimeout(navTimeoutRef.current);
      navTimeoutRef.current = setTimeout(() => setShowNav(false), 3000);
    }

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (navTimeoutRef.current) clearTimeout(navTimeoutRef.current);
    };
  }, []);

  const progress = ((currentSlide + 1) / slides.length) * 100;
  const currentLabel = slides[currentSlide]?.label ?? '';

  return (
    <div
      className="relative w-full min-h-screen bg-[#0a0a0a]"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 h-[2px] z-50"
        style={{
          width: `${progress}%`,
          background: 'linear-gradient(to right, #00D2D2, #A25DDC)',
        }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.25 }}
      />

      {/* Header: monday.com left, section + slide number pill right */}
      <AnimatePresence>
        {showNav && (
          <motion.header
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-6 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12"
          >
            <span className="text-white/90 font-semibold text-sm">monday.com</span>
            <div className="flex items-center gap-3">
              <span className="text-white/50 text-sm">{currentLabel}</span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-mono">
                {currentSlide + 1}/{slides.length}
              </span>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Footer: center dots, Prev/Next right */}
      <AnimatePresence>
        {showNav && (
          <motion.footer
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="fixed bottom-6 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12"
          >
            <div className="flex-1 flex justify-center gap-2">
              {slides.map((slide, i) => (
                <button
                  key={slide.id}
                  onClick={() => goToSlide(i)}
                  className="group p-1 rounded-full transition-colors"
                  title={slide.label}
                >
                  <span
                    className={`block w-2 h-2 rounded-full transition-all ${
                      currentSlide === i ? 'bg-[#A25DDC] w-3' : 'bg-white/30 hover:bg-white/50'
                    }`}
                  />
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => currentSlide > 0 && goToSlide(currentSlide - 1)}
                disabled={currentSlide === 0}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white text-sm font-medium hover:bg-white/15 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Prev
              </button>
              <button
                onClick={() => currentSlide < slides.length - 1 && goToSlide(currentSlide + 1)}
                disabled={currentSlide === slides.length - 1}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white text-sm font-medium hover:bg-white/15 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.footer>
        )}
      </AnimatePresence>

      {/* Keyboard hint - fade after first slide */}
      <AnimatePresence>
        {showNav && currentSlide === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50 text-[11px] text-white/40"
          >
            Use arrow keys or Prev/Next to navigate
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main: one slide at a time, no scroll */}
      <div className="w-full h-screen overflow-hidden">
        <AnimatePresence mode="wait">
          {slides.map((slide, i) => {
            if (i !== currentSlide) return null;
            const Component = slide.component;
            return (
              <motion.section
                key={slide.id}
                initial={{ opacity: 0, x: direction >= 0 ? 40 : -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction >= 0 ? -40 : 40 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0 w-full h-full overflow-y-auto"
              >
                <Component />
              </motion.section>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
