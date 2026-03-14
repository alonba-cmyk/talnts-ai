import { useState } from 'react';
import { motion } from 'motion/react';
import type { TalntAgent } from '../../talnt/types';
import { getCategoryVisual, AGENT_AVATARS } from '../../talnt/agentVisuals';
import { useTalntTheme } from '../../talnt/TalntThemeContext';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface AgentAvatarProps {
  agent: TalntAgent;
  size?: AvatarSize;
  showStatus?: boolean;
  showRing?: boolean;
  className?: string;
}

const SIZE_MAP: Record<AvatarSize, { container: number; status: number; ring: number; font: string }> = {
  sm: { container: 36, status: 8, ring: 40, font: 'text-sm' },
  md: { container: 48, status: 10, ring: 54, font: 'text-lg' },
  lg: { container: 64, status: 12, ring: 70, font: 'text-xl' },
  xl: { container: 96, status: 14, ring: 104, font: 'text-3xl' },
};

export default function AgentAvatar({
  agent,
  size = 'md',
  showStatus = true,
  showRing = true,
  className = '',
}: AgentAvatarProps) {
  const [imgError, setImgError] = useState(false);
  const { tokens } = useTalntTheme();
  const dims = SIZE_MAP[size];
  const visual = getCategoryVisual(agent.categories);
  const avatarSrc = AGENT_AVATARS[agent.id] || agent.avatarUrl;
  const hasImage = !!avatarSrc && !imgError;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {showRing && (
        <div
          className="absolute inset-0 rounded-full animate-pulse"
          style={{
            width: dims.ring,
            height: dims.ring,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: `radial-gradient(circle, ${visual.glowColor} 0%, transparent 70%)`,
            opacity: 0.6,
          }}
        />
      )}

      <motion.div
        className="relative rounded-full overflow-hidden flex items-center justify-center"
        style={{
          width: dims.container,
          height: dims.container,
          background: hasImage ? tokens.bgCard : visual.gradient,
          boxShadow: `0 0 20px ${visual.glowColor}`,
        }}
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        {hasImage ? (
          <img
            src={avatarSrc}
            alt={agent.name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <span className={`font-bold text-white ${dims.font}`}>
            {agent.name[0]}
          </span>
        )}
      </motion.div>

      {showStatus && (
        <motion.div
          className="absolute rounded-full border-2"
          style={{
            width: dims.status,
            height: dims.status,
            bottom: 0,
            right: 0,
            background: agent.isOnline ? visual.accentColor : '#4B5563',
            borderColor: tokens.bgPage,
          }}
          animate={agent.isOnline ? {
            boxShadow: [
              `0 0 0 0 ${visual.glowColor}`,
              `0 0 0 4px transparent`,
            ],
          } : undefined}
          transition={agent.isOnline ? {
            duration: 2,
            repeat: Infinity,
            ease: 'easeOut',
          } : undefined}
        />
      )}
    </div>
  );
}
