import { motion, useInView } from 'motion/react';
import { useRef, useState } from 'react';
import SlideShell, { SlideTitle, SlideSubtitle } from './SlideShell';
import { competitorMatrix, competitors, BRAND_COLORS } from './gtmData';

export default function CompetitorMatrixSlide() {
  const chartRef = useRef<HTMLDivElement>(null);
  const inView = useInView(chartRef, { once: true, amount: 0.3 });
  const [hoveredDot, setHoveredDot] = useState<string | null>(null);

  const getColor = (name: string): string => {
    if (name.includes('monday')) return BRAND_COLORS.blue;
    const comp = competitors.find((c) => name.includes(c.name));
    return comp?.color || '#888';
  };

  return (
    <SlideShell>
      <SlideTitle>Competitive Positioning</SlideTitle>
      <SlideSubtitle>Where we are today vs. where we need to be. Hover for details.</SlideSubtitle>

      <div ref={chartRef} className="relative w-full aspect-[5/3] max-w-[750px] mx-auto">
        <div className="absolute inset-[40px] rounded-2xl bg-white border border-[#e8e8e8] shadow-sm">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                'linear-gradient(to right, #e8e8e8 1px, transparent 1px), linear-gradient(to bottom, #e8e8e8 1px, transparent 1px)',
              backgroundSize: '20% 20%',
            }}
          />
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#e8e8e8]" />
          <div className="absolute top-1/2 left-0 right-0 h-px bg-[#e8e8e8]" />
        </div>

        <div className="absolute bottom-1 left-[40px] text-xs text-[#8a8a8a] font-medium">
          Vertical
        </div>
        <div className="absolute bottom-1 right-0 text-xs text-[#8a8a8a] font-medium">
          Horizontal
        </div>
        <div
          className="absolute top-2 left-0 text-xs text-[#8a8a8a] font-medium"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          Autonomous
        </div>
        <div
          className="absolute bottom-[44px] left-0 text-xs text-[#8a8a8a] font-medium"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          Assistive
        </div>

        {competitorMatrix.positions.map((pos) => {
          const isTarget = 'isTarget' in pos && pos.isTarget;
          const isMonday = pos.name.includes('monday');
          const color = getColor(pos.name);
          const hovered = hoveredDot === pos.name;

          return (
            <motion.div
              key={pos.name}
              initial={{ opacity: 0, scale: 0 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{
                duration: 0.45,
                delay: isTarget ? 1 : 0.2 + Math.random() * 0.4,
                type: 'spring',
              }}
              onMouseEnter={() => setHoveredDot(pos.name)}
              onMouseLeave={() => setHoveredDot(null)}
              className="absolute z-10 cursor-pointer"
              style={{
                left: `calc(40px + ${pos.x}% * (100% - 80px) / 100)`,
                bottom: `calc(40px + ${pos.y}% * (100% - 80px) / 100)`,
                transform: 'translate(-50%, 50%)',
              }}
            >
              <div
                className="rounded-full transition-all duration-200"
                style={{
                  width: isMonday ? 14 : 10,
                  height: isMonday ? 14 : 10,
                  background: isTarget ? 'transparent' : color,
                  border: isTarget ? `2px dashed ${color}` : 'none',
                  boxShadow: hovered ? `0 0 16px ${color}44` : 'none',
                  transform: hovered ? 'scale(1.4)' : 'scale(1)',
                }}
              />
              <div
                className="absolute left-1/2 -translate-x-1/2 whitespace-pre text-center mt-1.5"
                style={{ top: '100%', opacity: hovered || isMonday ? 1 : 0.7 }}
              >
                <span
                  className="text-[10px] font-semibold leading-tight"
                  style={{ color: isMonday ? color : '#6b6b6b' }}
                >
                  {pos.name}
                </span>
              </div>
              {hovered && !isMonday && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 p-3 rounded-lg bg-white border border-[#e8e8e8] shadow-lg w-44 z-50"
                >
                  <div className="text-xs font-bold text-[#1a1a1a] mb-0.5">{pos.name}</div>
                  <div className="text-[11px] text-[#6b6b6b]">
                    {competitors.find((c) => pos.name.includes(c.name))?.tagline}
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </SlideShell>
  );
}
