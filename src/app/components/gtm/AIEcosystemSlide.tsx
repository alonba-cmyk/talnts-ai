import {
  Briefcase,
  Megaphone,
  Code2,
  Palette,
  Video,
  TrendingUp,
  Workflow,
  Mic,
} from 'lucide-react';
import SlideShell, { SlideTitle, SlideSubtitle, StaggerChild } from './SlideShell';
import { aiEcosystemCategories } from './gtmData';

const CATEGORY_ICONS = {
  Briefcase,
  Megaphone,
  Code2,
  Palette,
  Video,
  TrendingUp,
  Workflow,
  Mic,
} as const;

export default function AIEcosystemSlide() {
  return (
    <SlideShell dark>
      <SlideTitle dark>The AI Tool Landscape</SlideTitle>
      <SlideSubtitle dark>
        70+ tools across 8 categories. Where does monday.com fit?
      </SlideSubtitle>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
        {aiEcosystemCategories.map((cat, i) => {
          const Icon = CATEGORY_ICONS[cat.lucideIcon as keyof typeof CATEGORY_ICONS] ?? Briefcase;
          return (
            <StaggerChild key={cat.id} index={i}>
              <div
                className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5 transition-colors hover:bg-white/[0.05]"
              >
                <div
                  className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0 mb-4"
                  style={{ background: `${cat.color}22`, color: cat.color }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-white mb-3">{cat.name}</h3>
                <div className="flex flex-wrap gap-2">
                  {cat.tools.map((tool) => (
                    <span
                      key={tool.name}
                      title={tool.name}
                      className={`inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        tool.isMonday
                          ? 'border border-[#00D2D2] bg-[#00D2D2]/15 text-white'
                          : 'bg-white/[0.06] text-white/70 border border-white/[0.06]'
                      }`}
                    >
                      <img
                        src={tool.logoUrl}
                        alt=""
                        className="w-5 h-5 rounded-sm object-contain flex-shrink-0 bg-white/5"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      {tool.name}
                    </span>
                  ))}
                </div>
              </div>
            </StaggerChild>
          );
        })}
      </div>
    </SlideShell>
  );
}
