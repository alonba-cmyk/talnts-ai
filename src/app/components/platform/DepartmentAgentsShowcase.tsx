import { motion } from 'motion/react';
import { Bot } from 'lucide-react';
import { useDepartmentData } from '@/hooks/useSupabase';
import type { DepartmentRow, AgentRow } from '@/types/database';
import agentsLogo from '@/assets/99be461a455ae49743d963276e2023ed6cd1445d.png';

interface ImpactMetric {
  value: string;
  label: string;
}

const DEPT_SHOWCASE_CONFIG: Record<string, { badge: string; tagline: string; metric: ImpactMetric }> = {
  marketing: {
    badge: 'Marketing Hub',
    tagline: 'Launch campaigns, create content & analyze performance with AI',
    metric: { value: '10x', label: 'faster campaign launches' },
  },
  sales: {
    badge: 'Sales Den',
    tagline: 'Qualify leads, prep calls & keep CRM clean',
    metric: { value: '22%', label: 'higher win rates' },
  },
  operations: {
    badge: 'Operations',
    tagline: 'Automate workflows & eliminate bottlenecks at scale',
    metric: { value: '40%', label: 'fewer manual tasks' },
  },
  support: {
    badge: 'IT Operations',
    tagline: 'Intelligent ticket resolution & incident response',
    metric: { value: '8 min', label: 'avg response time (was 4 hrs)' },
  },
  product: {
    badge: 'Product',
    tagline: 'Prioritize roadmaps & ship features with AI insights',
    metric: { value: '3x', label: 'faster feature delivery' },
  },
  legal: {
    badge: 'Legal',
    tagline: 'Review contracts & manage compliance at speed',
    metric: { value: '60%', label: 'faster contract review' },
  },
  finance: {
    badge: 'Finance',
    tagline: 'Budget planning, forecasting & financial reporting',
    metric: { value: '85%', label: 'forecast accuracy' },
  },
  hr: {
    badge: 'HR Workforce',
    tagline: 'End-to-end global recruitment management',
    metric: { value: '5x', label: 'more candidates screened per week' },
  },
};

function parseBullets(description: string): string[] {
  if (!description) return [];
  const parts = description
    .split(/[.;\n]/)
    .map(s => s.trim())
    .filter(s => s.length > 3);
  return parts.slice(0, 3);
}

function DepartmentCard({ department, index }: { department: DepartmentRow; index: number }) {
  const { agents, loading } = useDepartmentData(department.id);
  const config = DEPT_SHOWCASE_CONFIG[department.name] || {
    badge: department.title,
    tagline: department.description || 'AI-powered workflows for your team',
    metric: { value: '10x', label: 'productivity boost' },
  };

  const visibleAgents = agents.slice(0, 3);
  const color = department.avatar_color || '#6161ff';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="rounded-2xl border border-gray-200 bg-white shadow-lg shadow-gray-100/50 p-6 flex flex-col h-full hover:shadow-xl transition-shadow duration-300"
    >
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.15 + 0.2 }}
      >
        <span
          className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-4"
          style={{
            backgroundColor: `${color}12`,
            color: color,
            border: `1px solid ${color}30`,
          }}
        >
          {config.badge}
        </span>
      </motion.div>

      {/* Tagline */}
      <h3 className="text-[15px] md:text-[17px] font-bold text-gray-900 leading-snug mb-6 min-h-[44px]">
        {config.tagline}
      </h3>

      {/* Agents row */}
      <div className="flex-1">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-5 h-5 border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin" />
          </div>
        ) : visibleAgents.length > 0 ? (
          <div className="flex gap-4 justify-center">
            {visibleAgents.map((agent, i) => (
              <AgentAvatar key={agent.id} agent={agent} index={i} parentDelay={index * 0.15} color={color} />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-8">
            <p className="text-xs text-gray-300">No agents configured</p>
          </div>
        )}
      </div>

      {/* Impact metric */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.15 + 0.5 }}
        className="mt-6 pt-5 border-t border-gray-100"
      >
        <div className="flex items-baseline gap-2">
          <span
            className="text-2xl md:text-3xl font-black"
            style={{ color }}
          >
            {config.metric.value}
          </span>
          <span className="text-[12px] text-gray-400 font-medium">
            {config.metric.label}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

function AgentAvatar({ agent, index, parentDelay, color }: { agent: AgentRow; index: number; parentDelay: number; color: string }) {
  const bullets = parseBullets(agent.description);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: parentDelay + 0.3 + index * 0.1, duration: 0.4 }}
      className="flex flex-col items-center text-center flex-1 min-w-0 max-w-[130px]"
    >
      {/* Avatar */}
      <div className="relative mb-2.5">
        {agent.image ? (
          <motion.img
            src={agent.image}
            alt={agent.name}
            className="w-[72px] h-[72px] md:w-20 md:h-20 rounded-2xl object-cover ring-2 ring-gray-100 shadow-md"
            whileHover={{ scale: 1.06, y: -3 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          />
        ) : (
          <div
            className="w-[72px] h-[72px] md:w-20 md:h-20 rounded-2xl flex items-center justify-center ring-2 ring-gray-100 shadow-md"
            style={{ background: `linear-gradient(135deg, ${color}20, ${color}08)` }}
          >
            <Bot className="w-8 h-8 text-gray-400" />
          </div>
        )}
        <motion.div
          className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-white shadow-sm"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Name */}
      <p className="text-[11px] md:text-[12px] font-bold text-gray-800 mb-1.5 truncate w-full">{agent.name}</p>

      {/* Bullets */}
      {bullets.length > 0 && (
        <div className="space-y-0.5 w-full">
          {bullets.map((b, i) => (
            <p key={i} className="text-[8px] md:text-[9px] text-gray-400 leading-snug flex items-start gap-1">
              <span className="flex-shrink-0 mt-px" style={{ color: `${color}80` }}>→</span>
              <span className="truncate">{b}</span>
            </p>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export function DepartmentAgentsShowcase({ departments }: { departments: DepartmentRow[] }) {
  const showDepts = departments.slice(0, 3);

  if (showDepts.length === 0) return null;

  return (
    <section className="py-16 md:py-28 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 md:px-8 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="flex items-center justify-center gap-2.5 mb-4">
            <img src={agentsLogo} alt="Agents" className="w-7 h-7 object-contain" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">
              AI Agents by Department
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-3">
            Specialized agents for{' '}
            <span className="bg-gradient-to-r from-[#6161ff] to-[#00d2d2] bg-clip-text text-transparent">
              every team
            </span>
          </h2>
          <p className="text-sm md:text-base text-gray-500 max-w-xl mx-auto">
            Each department gets purpose-built AI agents that understand your workflows and deliver measurable impact.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {showDepts.map((dept, i) => (
            <DepartmentCard key={dept.id} department={dept} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
