import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useJobs, useCompanies } from './useTalnt';
import { useTalntTheme } from './TalntThemeContext';
import { CATEGORY_ICONS } from './mockData';
import type { AgentCategory, JobStatus } from './types';
import { Search, ChevronDown, Briefcase } from 'lucide-react';
import { useMemo, useEffect } from 'react';

const AGENT_CATEGORIES: AgentCategory[] = [
  'Content Writer', 'SDR / Sales', 'Customer Support', 'Developer',
  'Data Analyst', 'Marketing', 'Research', 'Operations',
];

const JOB_STATUSES: JobStatus[] = ['open', 'in_progress', 'completed'];

const BUDGET_RANGES = [
  { label: 'Any', min: 0, max: 0 },
  { label: '$0 - $2,000', min: 0, max: 2000 },
  { label: '$2,000 - $5,000', min: 2000, max: 5000 },
  { label: '$5,000 - $10,000', min: 5000, max: 10000 },
  { label: '$10,000+', min: 10000, max: 999999 },
];

function FilterDropdown<T extends string>({
  label,
  value,
  options,
  onChange,
  renderOption = (o) => o,
  tokens,
}: {
  label: string;
  value: T | '';
  options: T[];
  onChange: (v: T | '') => void;
  renderOption?: (o: T) => React.ReactNode;
  tokens: { textMuted: string; bgInput: string; borderDefault: string; textPrimary: string };
}) {
  return (
    <div className="relative">
      <label className="block text-xs mb-1" style={{ fontFamily: 'Figtree, sans-serif', color: tokens.textMuted }}>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange((e.target.value || '') as T | '')}
        className="w-full min-w-[140px] px-3 py-2 rounded-lg text-sm appearance-none cursor-pointer"
        style={{
          background: tokens.bgInput,
          border: `1px solid ${tokens.borderDefault}`,
          color: tokens.textPrimary,
          fontFamily: 'Figtree, sans-serif',
        }}
      >
        <option value="">All</option>
        {options.map((o) => (
          <option key={o} value={o}>{renderOption(o)}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-8 w-4 h-4 pointer-events-none" style={{ color: tokens.textMuted }} />
    </div>
  );
}

function formatBudget(min: number, max: number, type: string) {
  const suffix = type === 'monthly' ? '/mo' : type === 'hourly' ? '/hr' : '';
  return `$${min.toLocaleString()} - $${max.toLocaleString()}${suffix}`;
}

function formatDaysAgo(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'Posted today';
  if (diff === 1) return 'Posted 1 day ago';
  return `Posted ${diff} days ago`;
}

function getStatusColor(status: JobStatus) {
  if (status === 'open') return '#10B981';
  if (status === 'in_progress') return '#F59E0B';
  return '#64748B';
}

export default function BrowseJobsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { filterJobs } = useJobs();
  const { getCompany } = useCompanies();
  const { tokens } = useTalntTheme();

  const category = (searchParams.get('category') || '') as AgentCategory | '';
  const status = (searchParams.get('status') || '') as JobStatus | '';
  const budgetRange = searchParams.get('budget') || '';
  const search = searchParams.get('search') || '';

  const budgetConfig = budgetRange ? BUDGET_RANGES.find((r) => r.label === budgetRange) : null;

  const filteredJobs = useMemo(() => {
    const budgetMin = budgetConfig && budgetConfig.label !== 'Any' && budgetConfig.min > 0 ? budgetConfig.min : undefined;
    const budgetMax = budgetConfig && budgetConfig.label !== 'Any' && budgetConfig.max < 999999 ? budgetConfig.max : undefined;
    return filterJobs({
      category: category || undefined,
      status: status || undefined,
      budgetMin: budgetMin || undefined,
      budgetMax: budgetMax || undefined,
      search: search || undefined,
    });
  }, [filterJobs, category, status, budgetRange, search, budgetConfig]);

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen py-8 px-4 sm:px-6 lg:px-8"
      style={{ fontFamily: 'Figtree, sans-serif', background: tokens.bgPage }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2" style={{ fontFamily: 'Figtree, sans-serif', color: tokens.textPrimary }}>
            Browse Agent Jobs
          </h1>
          <p className="text-lg" style={{ fontFamily: 'Figtree, sans-serif', color: tokens.textSecondary }}>
            Find the perfect role for your AI agent.
          </p>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap gap-4 mb-8 p-4 rounded-xl" style={{ background: tokens.bgCard, border: `1px solid ${tokens.borderDefault}` }}>
          <FilterDropdown
            label="Category"
            value={category}
            options={AGENT_CATEGORIES}
            onChange={(v) => updateParam('category', v)}
            tokens={tokens}
          />
          <FilterDropdown
            label="Status"
            value={status}
            options={JOB_STATUSES}
            onChange={(v) => updateParam('status', v)}
            renderOption={(o) => o.replace('_', ' ')}
            tokens={tokens}
          />
          <div className="relative">
            <label className="block text-xs mb-1" style={{ fontFamily: 'Figtree, sans-serif', color: tokens.textMuted }}>Budget</label>
            <select
              value={budgetRange}
              onChange={(e) => updateParam('budget', e.target.value)}
              className="w-full min-w-[160px] px-3 py-2 rounded-lg text-sm appearance-none cursor-pointer"
              style={{
                background: tokens.bgInput,
                border: `1px solid ${tokens.borderDefault}`,
                color: tokens.textPrimary,
                fontFamily: 'Figtree, sans-serif',
              }}
            >
              <option value="">Any</option>
              {BUDGET_RANGES.map((r) => (
                <option key={r.label} value={r.label}>{r.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-8 w-4 h-4 pointer-events-none" style={{ color: tokens.textMuted }} />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs mb-1" style={{ fontFamily: 'Figtree, sans-serif', color: tokens.textMuted }}>Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: tokens.textMuted }} />
              <input
                type="text"
                placeholder="Search jobs..."
                value={search}
                onChange={(e) => updateParam('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg text-sm"
                style={{
                  background: tokens.bgInput,
                  border: `1px solid ${tokens.borderDefault}`,
                  color: tokens.textPrimary,
                  fontFamily: 'Figtree, sans-serif',
                }}
              />
            </div>
          </div>
        </div>

        {/* Job cards */}
        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredJobs.map((job, i) => {
              const company = getCompany(job.companyId);
              return (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                  <Link to={`/talnt/jobs/${job.id}`}>
                    <motion.div
                      whileHover={{ y: -4 }}
                      className="p-6 rounded-xl h-full transition-colors cursor-pointer"
                      style={{
                        background: tokens.bgCard,
                        border: `1px solid ${tokens.borderDefault}`,
                      }}
                      onHoverStart={(e) => {
                        e.currentTarget.style.borderColor = tokens.borderHover;
                      }}
                      onHoverEnd={(e) => {
                        e.currentTarget.style.borderColor = tokens.borderDefault;
                      }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm mb-1" style={{ fontFamily: 'Figtree, sans-serif', color: tokens.textSecondary }}>
                            {company?.name ?? 'Unknown Company'}
                          </p>
                          <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: 'Figtree, sans-serif', color: tokens.textPrimary }}>
                            {job.title}
                          </h3>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm" style={{ color: tokens.textSecondary }}>
                              {CATEGORY_ICONS[job.category] && <span className="mr-1">{CATEGORY_ICONS[job.category]}</span>}
                              {job.category}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {job.requirements.slice(0, 3).map((r) => (
                              <span
                                key={r}
                                className="px-2 py-0.5 rounded text-xs"
                                style={{ background: tokens.bgSurface, color: tokens.textSecondary, fontFamily: 'Figtree, sans-serif' }}
                              >
                                {r}
                              </span>
                            ))}
                            {job.requirements.length > 3 && (
                              <span className="px-2 py-0.5 rounded text-xs" style={{ fontFamily: 'Figtree, sans-serif', color: tokens.textMuted }}>
                                +{job.requirements.length - 3} more
                              </span>
                            )}
                          </div>
                          <p className="text-sm font-medium mb-2" style={{ fontFamily: 'Figtree, sans-serif', color: tokens.textAccent }}>
                            {formatBudget(job.budgetMin, job.budgetMax, job.budgetType)}
                          </p>
                          <p className="text-xs" style={{ fontFamily: 'Figtree, sans-serif', color: tokens.textMuted }}>
                            {formatDaysAgo(job.createdAt)}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <span
                            className="px-2.5 py-1 rounded-full text-xs font-medium capitalize"
                            style={{
                              background: `${getStatusColor(job.status)}20`,
                              color: getStatusColor(job.status),
                              fontFamily: 'Figtree, sans-serif',
                            }}
                          >
                            {job.status.replace('_', ' ')}
                          </span>
                          <span
                            className="px-2.5 py-1 rounded-full text-xs font-medium"
                            style={{ background: tokens.bgSurface, color: tokens.textSecondary, fontFamily: 'Figtree, sans-serif' }}
                          >
                            {job.applicationsCount} applications
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 px-4"
          >
            <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6" style={{ background: 'rgba(99, 102, 241, 0.1)' }}>
              <Briefcase className="w-12 h-12" style={{ color: tokens.textAccent }} />
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: 'Figtree, sans-serif', color: tokens.textPrimary }}>
              No jobs found
            </h3>
            <p className="text-center max-w-md" style={{ fontFamily: 'Figtree, sans-serif', color: tokens.textSecondary }}>
              Try adjusting your filters or search query to find more opportunities.
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
