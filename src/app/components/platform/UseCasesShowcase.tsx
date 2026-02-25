import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Bot } from 'lucide-react';
import type { DepartmentRow, AgentRow } from '@/types/database';
import { getShowcaseJTBDs, type ShowcaseJTBD } from './DepartmentJTBDSection';
import { supabase } from '@/lib/supabase';

type Variant = 'cards_grid' | 'hero_featured' | 'department_tabs' | 'bento_mosaic';

interface UseCaseEntry {
  jtbd: ShowcaseJTBD;
  deptName: string;
  deptId: string;
  deptTitle: string;
  deptColor: string;
  agents: AgentRow[];
}

const CURATED_JTBD_IDS: Record<string, string> = {
  marketing: 'launch-campaign',
  sales: 'qualify-leads',
  operations: 'automate-workflows',
  support: 'resolve-tickets',
  product: 'prioritize-roadmap',
  legal: 'review-contracts',
  finance: 'budget-planning',
  hr: 'recruit-talent',
};

function useAgentsForDepartments(departments: DepartmentRow[]): Record<string, AgentRow[]> {
  const [agentsMap, setAgentsMap] = useState<Record<string, AgentRow[]>>({});

  const deptIds = useMemo(() => departments.map(d => d.id), [departments]);

  const fetchAll = useCallback(async () => {
    if (deptIds.length === 0) return;
    try {
      const { data, error } = await supabase
        .from('department_agents')
        .select('department_id, agents(*)')
        .in('department_id', deptIds);
      if (error || !data) return;

      const map: Record<string, AgentRow[]> = {};
      for (const row of data as any[]) {
        if (!row.agents || !row.agents.is_active) continue;
        const dId = row.department_id as string;
        if (!map[dId]) map[dId] = [];
        map[dId].push(row.agents);
      }
      setAgentsMap(map);
    } catch { /* ignore */ }
  }, [deptIds]);

  useEffect(() => { fetchAll(); }, [fetchAll]);
  return agentsMap;
}

function useCuratedUseCases(departments: DepartmentRow[], agentsMap: Record<string, AgentRow[]>): UseCaseEntry[] {
  return useMemo(() => {
    const entries: UseCaseEntry[] = [];
    for (const dept of departments) {
      const jtbds = getShowcaseJTBDs(dept.name);
      const targetId = CURATED_JTBD_IDS[dept.name];
      const jtbd = targetId ? jtbds.find(j => j.id === targetId) : jtbds[0];
      if (jtbd) {
        entries.push({
          jtbd,
          deptName: dept.name,
          deptId: dept.id,
          deptTitle: dept.title,
          deptColor: dept.avatar_color || '#6161ff',
          agents: (agentsMap[dept.id] || []).slice(0, 3),
        });
      }
    }
    return entries;
  }, [departments, agentsMap]);
}

/* ═══════════════════════════════════════════════════════════════════
   Shared Section Header
   ═══════════════════════════════════════════════════════════════════ */

function SectionHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="text-center mb-12 md:mb-16"
    >
      <div className="flex items-center justify-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-[#6161ff]/10 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-[#6161ff]" />
        </div>
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">
          What agents can do for you
        </span>
      </div>
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-3">
        From task to done —{' '}
        <span className="bg-gradient-to-r from-[#6161ff] to-[#00d2d2] bg-clip-text text-transparent">
          agents handle it
        </span>
      </h2>
      <p className="text-sm md:text-base text-gray-500 max-w-2xl mx-auto leading-relaxed">
        AI agents that understand your work, execute complex processes, and deliver results — across every department.
      </p>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Shared Agent Avatar Components
   ═══════════════════════════════════════════════════════════════════ */

function AgentAvatar({ agent, size = 'md', color, index = 0 }: { agent: AgentRow; size?: 'sm' | 'md' | 'lg' | 'xl'; color: string; index?: number }) {
  const sizeMap = { sm: 'w-12 h-12', md: 'w-16 h-16', lg: 'w-20 h-20', xl: 'w-24 h-24' };
  const iconMap = { sm: 'w-5 h-5', md: 'w-6 h-6', lg: 'w-8 h-8', xl: 'w-10 h-10' };
  const textMap = { sm: 'text-[10px]', md: 'text-[11px]', lg: 'text-[12px]', xl: 'text-[13px]' };
  const maxWMap = { sm: 'max-w-[80px]', md: 'max-w-[90px]', lg: 'max-w-[100px]', xl: 'max-w-[110px]' };
  const dotMap = { sm: 'w-3 h-3', md: 'w-3.5 h-3.5', lg: 'w-4 h-4', xl: 'w-4 h-4' };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="flex flex-col items-center gap-1.5 min-w-0"
    >
      <div className="relative group">
        {agent.image ? (
          <motion.img
            src={agent.image}
            alt={agent.name}
            className={`${sizeMap[size]} rounded-2xl object-cover shadow-lg ring-2 ring-white`}
            whileHover={{ scale: 1.08, y: -3 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          />
        ) : (
          <motion.div
            className={`${sizeMap[size]} rounded-2xl flex items-center justify-center shadow-lg ring-2 ring-white`}
            style={{ background: `linear-gradient(135deg, ${color}30, ${color}10)` }}
            whileHover={{ scale: 1.08, y: -3 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <Bot className={`${iconMap[size]} text-gray-400`} />
          </motion.div>
        )}
        <motion.div
          className={`absolute -bottom-0.5 -right-0.5 ${dotMap[size]} rounded-full border-2 border-white shadow-sm`}
          style={{ backgroundColor: color }}
          animate={{ scale: [1, 1.25, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
      <span className={`${textMap[size]} font-semibold text-gray-700 truncate ${maxWMap[size]} text-center leading-tight`}>
        {agent.name}
      </span>
    </motion.div>
  );
}

function AgentAvatarRow({ agents, size = 'md', color }: { agents: AgentRow[]; size?: 'sm' | 'md' | 'lg' | 'xl'; color: string }) {
  if (agents.length === 0) return null;
  return (
    <div className="flex items-start gap-4 justify-start mb-4">
      {agents.map((a, i) => (
        <AgentAvatar key={a.id} agent={a} size={size} color={color} index={i} />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Use Case Card (shared by multiple variants)
   ═══════════════════════════════════════════════════════════════════ */

function UseCaseCard({
  entry,
  index,
  compact = false,
}: {
  entry: UseCaseEntry;
  index: number;
  compact?: boolean;
}) {
  const Icon = entry.jtbd.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.08)' }}
      className="rounded-2xl border border-gray-200 bg-white p-5 flex flex-col h-full shadow-sm transition-shadow duration-300"
    >
      {/* Department badge */}
      <span
        className="self-start inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3"
        style={{
          backgroundColor: `${entry.deptColor}12`,
          color: entry.deptColor,
          border: `1px solid ${entry.deptColor}25`,
        }}
      >
        {entry.deptTitle}
      </span>

      {/* Icon + Title */}
      <div className="flex items-center gap-2.5 mb-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${entry.deptColor}10` }}
        >
          <Icon className="w-[18px] h-[18px]" style={{ color: entry.deptColor }} />
        </div>
        <h3 className="text-[15px] font-bold text-gray-900 leading-snug">{entry.jtbd.title}</h3>
      </div>

      {!compact && (
        <>
          {/* Tagline */}
          <p className="text-[12px] text-gray-400 mb-2 italic">{entry.jtbd.tagline}</p>

          {/* Agent description */}
          <p className="text-[13px] text-gray-600 leading-relaxed flex-1 mb-4">
            {entry.jtbd.agents.description}
          </p>
        </>
      )}

      {/* Agent avatars */}
      <AgentAvatarRow agents={entry.agents} size="md" color={entry.deptColor} />

      {/* Value accent */}
      <div className={`pt-3 border-t border-gray-100 ${compact ? 'mt-auto' : ''}`}>
        <p className="text-[13px] font-bold" style={{ color: entry.deptColor }}>
          {entry.jtbd.agents.valueAccent}
        </p>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Variant A: Cards Grid
   ═══════════════════════════════════════════════════════════════════ */

function CardsGridVariant({ entries }: { entries: UseCaseEntry[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
      {entries.map((entry, i) => (
        <UseCaseCard key={entry.jtbd.id} entry={entry} index={i} />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Variant B: Hero Featured + Supporting Cards
   ═══════════════════════════════════════════════════════════════════ */

function HeroFeaturedVariant({ entries }: { entries: UseCaseEntry[] }) {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx(prev => (prev + 1) % entries.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [entries.length]);

  const featured = entries[activeIdx];
  if (!featured) return null;
  const FeaturedIcon = featured.jtbd.icon;

  return (
    <div className="flex flex-col lg:flex-row gap-5 md:gap-6">
      {/* Featured card */}
      <div className="lg:w-[45%] flex-shrink-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={featured.jtbd.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-lg shadow-gray-100/50 h-full flex flex-col"
          >
            <span
              className="self-start inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-4"
              style={{
                backgroundColor: `${featured.deptColor}12`,
                color: featured.deptColor,
                border: `1px solid ${featured.deptColor}25`,
              }}
            >
              {featured.deptTitle}
            </span>

            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${featured.deptColor}10` }}
              >
                <FeaturedIcon className="w-6 h-6" style={{ color: featured.deptColor }} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{featured.jtbd.title}</h3>
                <p className="text-sm text-gray-400 italic">{featured.jtbd.tagline}</p>
              </div>
            </div>

            <p className="text-[14px] text-gray-600 leading-relaxed flex-1 mb-6">
              {featured.jtbd.agents.description}
            </p>

            <AgentAvatarRow agents={featured.agents} size="xl" color={featured.deptColor} />

            <div className="pt-4 border-t border-gray-100">
              <p className="text-lg font-black" style={{ color: featured.deptColor }}>
                {featured.jtbd.agents.valueAccent}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Supporting cards */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {entries.map((entry, i) => {
          const Icon = entry.jtbd.icon;
          const isActive = i === activeIdx;
          return (
            <motion.button
              key={entry.jtbd.id}
              onClick={() => setActiveIdx(i)}
              whileHover={{ y: -2 }}
              className={`text-left rounded-xl border p-4 transition-all duration-200 ${
                isActive
                  ? 'border-[#6161ff]/30 bg-[#6161ff]/[0.03] shadow-md'
                  : 'border-gray-200 bg-white hover:shadow-sm'
              }`}
            >
              <div className="flex items-center gap-2.5 mb-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${entry.deptColor}10` }}
                >
                  <Icon className="w-4 h-4" style={{ color: entry.deptColor }} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-bold text-gray-900 truncate">{entry.jtbd.title}</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">{entry.deptTitle}</p>
                </div>
                {entry.agents.length > 0 && (
                  <div className="flex -space-x-2 flex-shrink-0">
                    {entry.agents.slice(0, 2).map(a => (
                      a.image ? (
                        <img key={a.id} src={a.image} alt={a.name} className="w-9 h-9 rounded-xl object-cover ring-2 ring-white shadow-md" />
                      ) : (
                        <div key={a.id} className="w-9 h-9 rounded-xl flex items-center justify-center ring-2 ring-white shadow-md" style={{ background: `linear-gradient(135deg, ${entry.deptColor}25, ${entry.deptColor}08)` }}>
                          <Bot className="w-4 h-4 text-gray-400" />
                        </div>
                      )
                    ))}
                  </div>
                )}
              </div>
              <p className="text-[12px] font-semibold" style={{ color: entry.deptColor }}>
                {entry.jtbd.agents.valueAccent}
              </p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Variant C: Department Tabs
   ═══════════════════════════════════════════════════════════════════ */

function DepartmentTabsVariant({ departments, agentsMap }: { departments: DepartmentRow[]; agentsMap: Record<string, AgentRow[]> }) {
  const [activeDeptIdx, setActiveDeptIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || departments.length === 0) return;
    const timer = setInterval(() => {
      setActiveDeptIdx(prev => (prev + 1) % departments.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [departments.length, paused]);

  const activeDept = departments[activeDeptIdx];
  const jtbds = useMemo(
    () => (activeDept ? getShowcaseJTBDs(activeDept.name) : []),
    [activeDept],
  );

  if (!activeDept) return null;

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {departments.map((dept, i) => {
          const isActive = i === activeDeptIdx;
          return (
            <button
              key={dept.id}
              onClick={() => setActiveDeptIdx(i)}
              className={`px-4 py-2 rounded-full text-[12px] font-bold transition-all duration-200 ${
                isActive
                  ? 'text-white shadow-md'
                  : 'text-gray-500 bg-gray-100 hover:bg-gray-200'
              }`}
              style={isActive ? { backgroundColor: dept.avatar_color || '#6161ff' } : undefined}
            >
              {dept.title}
            </button>
          );
        })}
      </div>

      {/* Cards */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeDept.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.35 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
        >
          {jtbds.map((jtbd, i) => {
            const Icon = jtbd.icon;
            return (
              <motion.div
                key={jtbd.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.08)' }}
                className="rounded-2xl border border-gray-200 bg-white p-5 flex flex-col shadow-sm"
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${activeDept.avatar_color || '#6161ff'}10` }}
                  >
                    <Icon className="w-[18px] h-[18px]" style={{ color: activeDept.avatar_color || '#6161ff' }} />
                  </div>
                  <h3 className="text-[14px] font-bold text-gray-900 leading-snug">{jtbd.title}</h3>
                </div>
                <p className="text-[11px] text-gray-400 italic mb-2">{jtbd.tagline}</p>
                <p className="text-[12px] text-gray-600 leading-relaxed flex-1 mb-3">
                  {jtbd.agents.description}
                </p>
                <AgentAvatarRow agents={(agentsMap[activeDept.id] || []).slice(0, 2)} size="md" color={activeDept.avatar_color || '#6161ff'} />
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-[12px] font-bold" style={{ color: activeDept.avatar_color || '#6161ff' }}>
                    {jtbd.agents.valueAccent}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Variant D: Bento Mosaic
   ═══════════════════════════════════════════════════════════════════ */

function BentoMosaicVariant({ entries }: { entries: UseCaseEntry[] }) {
  const heroEntries = entries.slice(0, 2);
  const compactEntries = entries.slice(2);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 auto-rows-auto">
      {/* Hero tiles — span 2 columns each */}
      {heroEntries.map((entry, i) => {
        const Icon = entry.jtbd.icon;
        return (
          <motion.div
            key={entry.jtbd.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.12 }}
            whileHover={{ y: -4, boxShadow: '0 16px 48px rgba(0,0,0,0.08)' }}
            className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-6 md:p-7 shadow-md shadow-gray-100/40 flex flex-col"
          >
            <div className="flex items-start gap-4 mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${entry.deptColor}10` }}
              >
                <Icon className="w-6 h-6" style={{ color: entry.deptColor }} />
              </div>
              <div>
                <span
                  className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-1.5"
                  style={{
                    backgroundColor: `${entry.deptColor}12`,
                    color: entry.deptColor,
                    border: `1px solid ${entry.deptColor}25`,
                  }}
                >
                  {entry.deptTitle}
                </span>
                <h3 className="text-lg font-bold text-gray-900">{entry.jtbd.title}</h3>
                <p className="text-[12px] text-gray-400 italic">{entry.jtbd.tagline}</p>
              </div>
            </div>
            <p className="text-[13px] text-gray-600 leading-relaxed flex-1 mb-4">
              {entry.jtbd.agents.description}
            </p>
            <AgentAvatarRow agents={entry.agents} size="lg" color={entry.deptColor} />
            <div className="pt-4 border-t border-gray-100">
              <p className="text-lg font-black" style={{ color: entry.deptColor }}>
                {entry.jtbd.agents.valueAccent}
              </p>
            </div>
          </motion.div>
        );
      })}

      {/* Compact tiles */}
      {compactEntries.map((entry, i) => (
        <UseCaseCard key={entry.jtbd.id} entry={entry} index={i + 2} compact />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Main Export
   ═══════════════════════════════════════════════════════════════════ */

export function UseCasesShowcase({
  departments,
  variant = 'cards_grid',
}: {
  departments: DepartmentRow[];
  variant?: Variant;
}) {
  const agentsMap = useAgentsForDepartments(departments);
  const entries = useCuratedUseCases(departments, agentsMap);

  if (entries.length === 0) return null;

  return (
    <section className="py-16 md:py-28 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <SectionHeader />

        {variant === 'cards_grid' && <CardsGridVariant entries={entries} />}
        {variant === 'hero_featured' && <HeroFeaturedVariant entries={entries} />}
        {variant === 'department_tabs' && <DepartmentTabsVariant departments={departments} agentsMap={agentsMap} />}
        {variant === 'bento_mosaic' && <BentoMosaicVariant entries={entries} />}
      </div>
    </section>
  );
}
