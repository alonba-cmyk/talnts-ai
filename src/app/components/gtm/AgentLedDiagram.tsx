import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Bot, User } from 'lucide-react';
import { useDepartments } from '@/hooks/useSupabase';
import { supabase } from '@/lib/supabase';
import type { AgentRow } from '@/types/database';
import vibeLogo from '@/assets/069a22575b2de9057cfc00d9b4538d072f7fe115.png';
import sidekickLogo from '@/assets/1babfe88a809998ec3c5c5d597d8051ef7639a6f.png';
import agentsLogo from '@/assets/99be461a455ae49743d963276e2023ed6cd1445d.png';
import workflowsLogo from '@/assets/workflows-logo.png';
import agentImg1 from '@/assets/053936dfeea2ccad575c77f11dabe02cb2e01b92.png';
import agentImg2 from '@/assets/f158e4bd7406bb7f1accf54fb06c7de8cfd09e48.png';
import agentImg3 from '@/assets/552ed6ec83999a43766184b9ddf41b03d687acdf.png';
import personImg1 from '@/assets/a8016eb62d3e284810c5691fa950de5343f7d776.png';
import personImg2 from '@/assets/4f1259d102c1081ca7d88367c1ec9d3487166104.png';
import personImg3 from '@/assets/31fef8e27a4c799459c58ae163c55324da0a21d4.png';

const FALLBACK_AGENT_IMAGES = [agentImg1, agentImg2, agentImg3, agentImg1, agentImg2, agentImg3];
const FALLBACK_PERSON_IMAGES = [personImg1, personImg2, personImg3];

const products = [
  { id: 'vibe', label: 'monday vibe', logo: vibeLogo, position: 'top-left' as const },
  { id: 'work-mgmt', label: 'monday work management', logo: agentsLogo, position: 'top-right' as const },
  { id: 'workflows', label: 'monday workflows', logo: workflowsLogo, position: 'bottom-left' as const },
  { id: 'sidekick', label: 'monday sidekick', logo: sidekickLogo, position: 'bottom-right' as const },
];

function useAgentsWithImages(limit = 6) {
  const [agents, setAgents] = useState<AgentRow[]>([]);

  const fetchAgents = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('agents')
        .select('id, name, description, image, order_index')
        .eq('is_active', true)
        .not('image', 'is', null)
        .order('order_index')
        .limit(limit);
      if (error) return;
      setAgents((data || []).filter((a) => a.image));
    } catch {
      /* ignore */
    }
  }, [limit]);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);
  return agents;
}

function AvatarCircle({
  image,
  isPerson,
  size,
  color,
  index,
  onImageError,
}: {
  image: string | null;
  isPerson: boolean;
  size: 'xs' | 'sm' | 'md' | 'lg';
  color: string;
  index: number;
  onImageError?: () => void;
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const sizeMap = { xs: 'w-12 h-12', sm: 'w-14 h-14', md: 'w-14 h-14 md:w-16 md:h-16', lg: 'w-16 h-16 md:w-20 md:h-20' };
  const iconMap = { xs: 'w-5 h-5', sm: 'w-6 h-6', md: 'w-7 h-7', lg: 'w-8 h-8' };
  const showIcon = !image || imgFailed;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="relative"
    >
      <motion.div
        animate={{ opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 rounded-full"
        style={{
          boxShadow: `0 0 24px ${color}40, 0 0 48px ${color}20`,
        }}
      />
      <div
        className={`relative ${sizeMap[size]} rounded-full overflow-hidden border-2 flex items-center justify-center`}
        style={{ borderColor: `${color}60`, backgroundColor: `${color}15` }}
      >
        {image && !imgFailed ? (
          <img
            src={image}
            alt=""
            className="w-full h-full object-cover"
            onError={() => {
              setImgFailed(true);
              onImageError?.();
            }}
          />
        ) : (
          <div
            className={`${sizeMap[size]} rounded-full flex items-center justify-center`}
            style={{ background: `linear-gradient(135deg, ${color}40, ${color}15)` }}
          >
            {isPerson ? (
              <User className={`${iconMap[size]} text-white/70`} />
            ) : (
              <Bot className={`${iconMap[size]} text-white/70`} />
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function AgentLedDiagram() {
  const { departments } = useDepartments();
  const agents = useAgentsWithImages(6);

  const peopleImages = departments
    .filter((d) => d.avatar_image)
    .slice(0, 3)
    .map((d) => d.avatar_image);

  // 9 avatars: [A A A] [P P P] [A A A] — 3 agents left, 3 people center, 3 agents right
  // Fill missing agent images with fallbacks from our repository
  const allAgentSlots = [agents[0], agents[1], agents[2], agents[3], agents[4], agents[5]];
  const leftAgents = allAgentSlots.slice(0, 3).map((a, i) => ({
    type: 'agent' as const,
    image: a?.image || FALLBACK_AGENT_IMAGES[i % FALLBACK_AGENT_IMAGES.length],
  }));
  const centerPeople = [
    peopleImages[0] || FALLBACK_PERSON_IMAGES[0],
    peopleImages[1] || FALLBACK_PERSON_IMAGES[1],
    peopleImages[2] || FALLBACK_PERSON_IMAGES[2],
  ].map((img) => ({ type: 'person' as const, image: img }));
  const rightAgents = allAgentSlots.slice(3, 6).map((a, i) => ({
    type: 'agent' as const,
    image: a?.image || FALLBACK_AGENT_IMAGES[(i + 3) % FALLBACK_AGENT_IMAGES.length],
  }));

  const purple = '#A25DDC';
  const teal = '#00D2D2';

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center gap-6 px-2">
      {/* Tagline */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <p className="text-xl md:text-2xl font-semibold text-white">
          Humans and Agents working together
        </p>
        <p className="text-sm text-white/45 mt-2">
          Tools around — humans & agents at the center
        </p>
      </motion.div>

      <div className="relative w-full aspect-[16/9] max-h-[45vh] min-h-[280px]">
        {/* Tools — in corners, surrounding humans + agents in center (no lines — layout conveys the idea) */}
        <div className="absolute left-[8%] top-[18%] z-10 flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.1] border border-white/20 shadow-lg" style={{ borderLeft: `3px solid ${purple}` }}>
          <img src={products[0].logo} alt="" className="w-5 h-5 object-contain shrink-0" />
          <span className="text-[10px] md:text-[11px] font-medium text-white/90 truncate max-w-[100px]">{products[0].label}</span>
        </div>
        <div className="absolute left-[8%] top-[72%] z-10 flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.1] border border-white/20 shadow-lg" style={{ borderLeft: `3px solid ${purple}` }}>
          <img src={products[2].logo} alt="" className="w-5 h-5 object-contain shrink-0" />
          <span className="text-[10px] md:text-[11px] font-medium text-white/90 truncate max-w-[100px]">{products[2].label}</span>
        </div>
        <div className="absolute right-[8%] top-[18%] z-10 flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.1] border border-white/20 shadow-lg" style={{ borderRight: `3px solid ${purple}` }}>
          <img src={products[1].logo} alt="" className="w-5 h-5 object-contain shrink-0" />
          <span className="text-[10px] md:text-[11px] font-medium text-white/90 truncate max-w-[100px]">{products[1].label}</span>
        </div>
        <div className="absolute right-[8%] top-[72%] z-10 flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.1] border border-white/20 shadow-lg" style={{ borderRight: `3px solid ${purple}` }}>
          <img src={products[3].logo} alt="" className="w-5 h-5 object-contain shrink-0" />
          <span className="text-[10px] md:text-[11px] font-medium text-white/90 truncate max-w-[100px]">{products[3].label}</span>
        </div>

        {/* Avatars — center */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center gap-1.5 md:gap-2 flex-shrink-0 z-20">
          {/* 3 agents left (smaller) */}
          {leftAgents.map((item, i) => (
            <AvatarCircle
              key={`l-${i}`}
              image={item.image}
              isPerson={false}
              size="sm"
              color={purple}
              index={i}
            />
          ))}
          {/* 3 people center */}
          {centerPeople.map((item, i) => (
            <AvatarCircle
              key={`c-${i}`}
              image={item.image}
              isPerson
              size="lg"
              color={teal}
              index={3 + i}
            />
          ))}
          {/* 3 agents right (smaller) */}
          {rightAgents.map((item, i) => (
            <AvatarCircle
              key={`r-${i}`}
              image={item.image}
              isPerson={false}
              size="sm"
              color={purple}
              index={6 + i}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
