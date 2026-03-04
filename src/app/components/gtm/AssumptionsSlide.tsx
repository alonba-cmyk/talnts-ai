import { ExternalLink } from 'lucide-react';
import SlideShell, { SlideTitle, SlideSubtitle } from './SlideShell';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/app/components/ui/accordion';
import { assumptions } from './gtmData';

export default function AssumptionsSlide() {
  return (
    <SlideShell dark>
      <SlideTitle dark>Our Guiding Assumptions</SlideTitle>
      <SlideSubtitle dark>
        Seven beliefs that shape every GTM decision. Click to expand.
      </SlideSubtitle>

      <Accordion type="single" collapsible className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {assumptions.map((a) => {
          const value = String(a.number);
          return (
            <AccordionItem
              key={a.number}
              value={value}
              className={`rounded-xl border overflow-hidden data-[state=open]:border-white/[0.14] transition-colors ${
                a.highlight
                  ? 'bg-[#00D2D2]/08 border-[#00D2D2]/30'
                  : 'bg-white/[0.04] border-white/[0.08]'
              }`}
            >
              <AccordionTrigger
                className="flex items-center gap-3 py-4 px-4 md:px-5 hover:no-underline hover:bg-white/[0.03] data-[state=open]:bg-white/[0.03] text-left [&>svg]:text-white/40 [&>svg]:shrink-0 [&[data-state=open]>svg]:text-white/60"
              >
                <span
                  className={`text-sm font-bold uppercase tracking-wider shrink-0 ${
                    a.highlight ? 'text-[#00D2D2]' : 'text-white/50'
                  }`}
                >
                  #{a.number}
                </span>
                <h3 className="text-base font-semibold text-white leading-snug text-left flex-1 min-w-0">
                  {a.headline}
                </h3>
                {a.highlight && (
                  <span className="hidden sm:inline-flex text-xs font-bold uppercase tracking-wider text-[#00D2D2] bg-[#00D2D2]/15 px-2 py-0.5 rounded-full shrink-0">
                    Key differentiator
                  </span>
                )}
              </AccordionTrigger>
              <AccordionContent>
                <div className="px-4 md:px-5 pb-4 pt-0">
                  <p className="text-base text-white/70 leading-relaxed">{a.detail}</p>
                  {a.sourceUrl && (
                    <a
                      href={a.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-[#00D2D2] transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" /> Source
                    </a>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </SlideShell>
  );
}
