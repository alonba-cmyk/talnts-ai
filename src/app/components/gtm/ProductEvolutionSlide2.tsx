import { motion } from 'motion/react';
import SlideShell, { SlideTitle, SlideSubtitle, StaggerChild } from './SlideShell';
import { SidekickLogo, VibeLogo, AgentsLogo, WorkflowsLogo } from '@/app/components/ProductLogos';

const aiProducts = [
  { name: 'Sidekick', Logo: SidekickLogo },
  { name: 'Vibe', Logo: VibeLogo },
  { name: 'Agents', Logo: AgentsLogo },
  { name: 'Workflows', Logo: WorkflowsLogo },
];

export default function ProductEvolutionSlide2() {
  return (
    <SlideShell dark>
      <SlideTitle dark>We launched AI products</SlideTitle>
      <SlideSubtitle dark>
        Sidekick, Vibe, Agents, Workflows — expanding how teams work with AI
      </SlideSubtitle>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {aiProducts.map(({ name, Logo }, i) => (
          <StaggerChild key={name} index={i}>
            <div className="p-5 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.05] transition-all flex flex-col items-center justify-center min-h-[120px]">
              <div className="[&_svg]:w-12 [&_svg]:h-12 [&_.w-14]:w-12 [&_.h-14]:h-12 scale-90 origin-center">
                <Logo className="[&_span]:text-xs [&_.flex-col]:gap-0" />
              </div>
            </div>
          </StaggerChild>
        ))}
      </motion.div>
    </SlideShell>
  );
}
