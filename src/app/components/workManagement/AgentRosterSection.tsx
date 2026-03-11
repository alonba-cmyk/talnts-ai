"use client";

import { useState, useCallback, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  HORIZONTAL_AGENTS,
  CATEGORY_META,
  type HorizontalAgent,
} from './horizontalAgentsData';

/* ─── data: only real agents, no custom category ─── */
const ROSTER_AGENTS: HorizontalAgent[] = HORIZONTAL_AGENTS.filter(a => a.category !== 'custom');

/* ─── per-category vibrant card gradients ─── */
const CARD_GRADIENTS: Record<string, string> = {
  think:    'linear-gradient(155deg, #7c3aed 0%, #a855f7 60%, #c084fc 100%)',
  plan:     'linear-gradient(155deg, #1d4ed8 0%, #3b82f6 60%, #60a5fa 100%)',
  research: 'linear-gradient(155deg, #047857 0%, #10b981 60%, #34d399 100%)',
  build:    'linear-gradient(155deg, #b45309 0%, #f59e0b 60%, #fcd34d 100%)',
  analyze:  'linear-gradient(155deg, #be123c 0%, #f43f5e 60%, #fb7185 100%)',
  automate: 'linear-gradient(155deg, #0e7490 0%, #06b6d4 60%, #22d3ee 100%)',
};

/* ─── coverflow position math ─── */
function getCardStyle(offset: number): {
  x: string;
  scale: number;
  zIndex: number;
  opacity: number;
  rotateY: number;
} {
  const abs = Math.abs(offset);
  if (abs === 0) return { x: '0%',    scale: 1,    zIndex: 10, opacity: 1,   rotateY: 0 };
  if (abs === 1) return { x: `${offset * 68}%`, scale: 0.84, zIndex: 7,  opacity: 0.72, rotateY: offset * -18 };
  if (abs === 2) return { x: `${offset * 75}%`, scale: 0.68, zIndex: 5,  opacity: 0.45, rotateY: offset * -28 };
  return                 { x: `${offset * 80}%`, scale: 0.54, zIndex: 3,  opacity: 0.18, rotateY: offset * -35 };
}

export function AgentCoverflowCarousel({
  scrollToAgentId,
  onCenterChange,
  imageOverrides = {},
}: {
  scrollToAgentId?: string;
  onCenterChange?: (agent: HorizontalAgent) => void;
  imageOverrides?: Record<string, string>;
} = {}) {
  const agents = ROSTER_AGENTS;
  const total = agents.length;
  const [centerIdx, setCenterIdx] = useState(0);

  useEffect(() => {
    if (!scrollToAgentId) return;
    const idx = agents.findIndex(a => a.id === scrollToAgentId);
    if (idx >= 0) setCenterIdx(idx);
  }, [scrollToAgentId, agents]);

  useEffect(() => {
    onCenterChange?.(agents[centerIdx]);
  }, [centerIdx]);

  const go = useCallback((dir: 1 | -1) => {
    setCenterIdx(i => (i + dir + total) % total);
  }, [total]);

  const centerAgent = agents[centerIdx];
  const catMeta = CATEGORY_META[centerAgent.category];

  /* visible window: center ±3 */
  const visible = [-3, -2, -1, 0, 1, 2, 3].map(offset => {
    const idx = ((centerIdx + offset) % total + total) % total;
    return { agent: agents[idx], offset };
  });

  const CARD_W = 220;
  const CARD_H = 300;

  return (
    <div className="flex flex-col items-center gap-8 select-none">
      {/* Carousel stage */}
      <div
        className="relative w-full"
        style={{ height: CARD_H + 30, perspective: '1200px' }}
      >
        {visible.map(({ agent, offset }) => {
          const style = getCardStyle(offset);
          const gradient = CARD_GRADIENTS[agent.category] ?? CARD_GRADIENTS.think;
          const isCenter = offset === 0;
          return (
            <motion.button
              key={`${agent.id}-${offset}`}
              onClick={() => {
                if (offset < 0) go(-1);
                else if (offset > 0) go(1);
              }}
            className="absolute top-0 left-1/2 overflow-hidden rounded-3xl"
            style={{
              width: CARD_W,
              height: CARD_H,
              marginLeft: -CARD_W / 2,
              transformOrigin: 'center bottom',
              cursor: isCenter ? 'default' : 'pointer',
              background: gradient,
            }}
              animate={{
                x: style.x,
                scale: style.scale,
                zIndex: style.zIndex,
                opacity: style.opacity,
                rotateY: style.rotateY,
              }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            >
              {/* Card background */}
              <div className="absolute inset-0" style={{ background: gradient }} />

              {/* Shine overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 50%)',
                }}
              />

              {/* Agent image */}
              <img
                src={imageOverrides[agent.id] || agent.image}
                alt={agent.name}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 object-contain object-bottom"
                loading="eager"
                style={{
                  width: '90%',
                  height: '90%',
                }}
              />

              {/* Name label at bottom */}
              <div
                className="absolute bottom-0 left-0 right-0 px-4 py-3"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55) 60%, transparent)' }}
              >
                <p className="text-white text-[14px] font-bold leading-tight text-center drop-shadow">
                  {agent.name}
                </p>
              </div>

              {/* Center ring */}
              {isCenter && (
                <div
                  className="absolute inset-0 rounded-3xl pointer-events-none"
                  style={{ border: '2px solid rgba(255,255,255,0.45)', boxShadow: '0 0 30px rgba(255,255,255,0.12)' }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Nav arrows */}
      <div className="flex items-center gap-8 -mt-2">
        <motion.button
          onClick={() => go(-1)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.93 }}
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ backgroundColor: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
        >
          <ChevronLeft className="w-6 h-6 text-gray-300" />
        </motion.button>

        {/* Dot indicators */}
        <div className="flex gap-2">
          {agents.map((_, i) => (
            <button
              key={i}
              onClick={() => setCenterIdx(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === centerIdx ? 22 : 8,
                height: 8,
                backgroundColor: i === centerIdx ? catMeta.color : 'rgba(255,255,255,0.2)',
              }}
            />
          ))}
        </div>

        <motion.button
          onClick={() => go(1)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.93 }}
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ backgroundColor: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
        >
          <ChevronRight className="w-6 h-6 text-gray-300" />
        </motion.button>
      </div>

    </div>
  );
}
