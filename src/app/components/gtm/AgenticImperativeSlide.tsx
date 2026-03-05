import { motion } from 'motion/react';
import SlideShell, { SlideTitle, SlideSubtitle } from './SlideShell';
import { ExternalLink } from 'lucide-react';

const panels = [
  {
    id: 'copilots-to-agents',
    bgClass: 'bg-[#0073EA]/20 border-[#0073EA]/40',
    title: 'The market is shifting from copilots to agents that execute',
    content: (
      <>
        <p className="text-sm md:text-base text-white/90 leading-relaxed mb-3">
          &ldquo;40% of enterprise applications will embed AI agents by the end of 2026&hellip; executives have a short window to{' '}
          <strong className="text-white">define an agentic strategy</strong> or risk being outpaced.&rdquo; — Gartner
        </p>
        <p className="text-xs md:text-sm text-white/70 italic mt-4 pt-4 border-t border-white/10">
          &gt; The agentic &quot;category landgrab&quot; is happening now
        </p>
      </>
    ),
  },
  {
    id: 'human-agents',
    bgClass: 'bg-white/[0.04] border-white/[0.1]',
    title: 'Human + agents will define how work gets done',
    content: (
      <>
        <p className="text-sm md:text-base text-white/90 leading-relaxed mb-3">
          &ldquo;By 2030, CIOs expect 75% of IT work to be done by{' '}
          <strong className="text-white">humans augmented with AI</strong>, and 25% by AI alone.&rdquo; — Gartner
        </p>
        <p className="text-xs md:text-sm text-white/70 italic mt-4 pt-4 border-t border-white/10">
          &gt; Work is being redesigned around human + agent collaboration
        </p>
      </>
    ),
  },
  {
    id: 'platform-word',
    bgClass: 'bg-white/[0.08] border-white/[0.15]',
    title: '"Agent" is becoming a platform word — not a feature word',
    content: (
      <>
        <p className="text-sm md:text-base text-white/90 leading-relaxed mb-3">
          Major platforms are publicly branding around &quot;agentic platforms&quot;
        </p>
        <p className="text-xs md:text-sm text-white/70 italic mt-4 pt-4 border-t border-white/10">
          &gt; If monday stays in &quot;AI capabilities&quot; language, we risk looking tactical
        </p>
      </>
    ),
  },
];

export default function AgenticImperativeSlide() {
  return (
    <SlideShell dark>
      <SlideTitle dark>The agentic imperative</SlideTitle>
      <SlideSubtitle dark>
        Three strategic trends shaping the market — Gartner-backed
      </SlideSubtitle>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
        {panels.map((panel, i) => (
          <motion.div
            key={panel.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className={`rounded-xl border p-5 md:p-6 flex flex-col min-h-[200px] ${panel.bgClass}`}
          >
            <h3 className="text-base md:text-lg font-semibold text-white leading-snug mb-4">
              {panel.title}
            </h3>
            <div className="flex-1 flex flex-col">
              {panel.content}
            </div>
          </motion.div>
        ))}
      </div>

      <p className="mt-6 text-center">
        <a
          href="https://www.gartner.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs text-white/50 hover:text-white/80 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Gartner sources
        </a>
      </p>
    </SlideShell>
  );
}
