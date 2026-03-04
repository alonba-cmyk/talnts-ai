import { motion } from 'motion/react';
import SlideShell, { SlideTitle, SlideSubtitle, StaggerChild } from './SlideShell';
import { agenticPlatformStackLayers, agenticPlatformStackConclusion } from './gtmData';

export default function AgenticPlatformStackSlide() {
  return (
    <SlideShell dark>
      <SlideTitle dark>The emerging agentic platform stack</SlideTitle>
      <SlideSubtitle dark>
        The battle is shifting to the operating layer for human + agent execution
      </SlideSubtitle>

      <div className="mt-4 max-w-4xl mx-auto w-full space-y-2">
        {agenticPlatformStackLayers.map((layer, i) => (
          <StaggerChild key={layer.id} index={i}>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="rounded-xl p-4 transition-colors hover:bg-white/[0.03]"
              style={{
                border: `1px solid ${layer.color}30`,
                background: `${layer.color}08`,
              }}
            >
              <h3 className="text-base md:text-lg font-semibold text-white mb-1">{layer.title}</h3>
              <p className="text-sm text-white/70 mb-3">
                {layer.description}. {layer.tagline}
              </p>
              <div className="flex flex-wrap gap-2">
                {layer.companies.map((company) => (
                  <span
                    key={company.name}
                    title={company.name}
                    className={`inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      company.isMonday
                        ? 'border border-[#00D2D2] bg-[#00D2D2]/15 text-white'
                        : 'bg-white/[0.06] text-white/70 border border-white/[0.06]'
                    }`}
                  >
                    <img
                      src={company.logoUrl}
                      alt=""
                      className="w-5 h-5 rounded-sm object-contain flex-shrink-0 bg-white/5"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    {company.name}
                  </span>
                ))}
              </div>
            </motion.div>
          </StaggerChild>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-6 text-center text-sm text-white/60 italic max-w-2xl mx-auto"
      >
        {agenticPlatformStackConclusion}
      </motion.p>
    </SlideShell>
  );
}
