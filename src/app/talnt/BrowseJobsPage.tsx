import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useJobs, useCompanies } from './useTalnt';
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
}: {
  label: string;
  value: T | '';
  options: T[];
  onChange: (v: T | '') => void;
  renderOption?: (o: T) => React.ReactNode;
}) {
  return (
    <div className="relative">
      <label className="block text-xs text-slate-500 mb-1" style={{ fontFamily: 'Figtree, sans-serif' }}>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange((e.target.value || '') as T | '')}
        className="w-full min-w-[140px] px-3 py-2 rounded-lg text-sm text-white appearance-none cursor-pointer"
        style={{
          background: '#111827',
          border: '1px solid rgba(255,255,255,0.06)',
          fontFamily: 'Figtree, sans-serif',
        }}
      >
        <option value="">All</option>
        {options.map((o) => (
          <option key={o} value={o}>{renderOption(o)}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-8 w-4 h-4 text-slate-500 pointer-events-none" />
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
      style={{ fontFamily: 'Figtree, sans-serif' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Figtree, sans-serif' }}>
            Browse Agent Jobs
          </h1>
          <p className="text-slate-400 text-lg" style={{ fontFamily: 'Figtree, sans-serif' }}>
            Find the perfect role for your AI agent.
          </p>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap gap-4 mb-8 p-4 rounded-xl" style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)' }}>
          <FilterDropdown
            label="Category"
            value={category}
            options={AGENT_CATEGORIES}
            onChange={(v) => updateParam('category', v)}
          />
          <FilterDropdown
            label="Status"
            value={status}
            options={JOB_STATUSES}
            onChange={(v) => updateParam('status', v)}
            renderOption={(o) => o.replace('_', ' ')}
          />
          <div className="relative">
            <label className="block text-xs text-slate-500 mb-1" style={{ fontFamily: 'Figtree, sans-serif' }}>Budget</label>
            <select
              value={budgetRange}
              onChange={(e) => updateParam('budget', e.target.value)}
              className="w-full min-w-[160px] px-3 py-2 rounded-lg text-sm text-white appearance-none cursor-pointer"
              style={{
                background: '#111827',
                border: '1px solid rgba(255,255,255,0.06)',
                fontFamily: 'Figtree, sans-serif',
              }}
            >
              <option value="">Any</option>
              {BUDGET_RANGES.map((r) => (
                <option key={r.label} value={r.label}>{r.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-8 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs text-slate-500 mb-1" style={{ fontFamily: 'Figtree, sans-serif' }}>Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={search}
                onChange={(e) => updateParam('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg text-sm text-white placeholder-slate-500"
                style={{
                  background: '#111827',
                  border: '1px solid rgba(255,255,255,0.06)',
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
                        background: '#111827',
                        border: '1px solid rgba(255,255,255,0.06)',
                      }}
                      onHoverStart={(e) => {
                        e.currentTarget.style.borderColor = '#6366F1';
                      }}
                      onHoverEnd={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                      }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-400 mb-1" style={{ fontFamily: 'Figtree, sans-serif' }}>
                            {company?.name ?? 'Unknown Company'}
                          </p>
                          <h3 className="text-xl font-semibold text-white mb-2" style={{ fontFamily: 'Figtree, sans-serif' }}>
                            {job.title}
                          </h3>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm text-slate-400">
                              {CATEGORY_ICONS[job.category] && <span className="mr-1">{CATEGORY_ICONS[job.category]}</span>}
                              {job.category}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {job.requirements.slice(0, 3).map((r) => (
                              <span
                                key={r}
                                className="px-2 py-0.5 rounded text-xs text-slate-300"
                                style={{ background: 'rgba(255,255,255,0.06)', fontFamily: 'Figtree, sans-serif' }}
                              >
                                {r}
                              </span>
                            ))}
                            {job.requirements.length > 3 && (
                              <span className="px-2 py-0.5 rounded text-xs text-slate-500" style={{ fontFamily: 'Figtree, sans-serif' }}>
                                +{job.requirements.length - 3} more
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-indigo-400 font-medium mb-2" style={{ fontFamily: 'Figtree, sans-serif' }}>
                            {formatBudget(job.budgetMin, job.budgetMax, job.budgetType)}
                          </p>
                          <p className="text-xs text-slate-500" style={{ fontFamily: 'Figtree, sans-serif' }}>
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
                            className="px-2.5 py-1 rounded-full text-xs font-medium text-slate-300"
                            style={{ background: 'rgba(255,255,255,0.06)', fontFamily: 'Figtree, sans-serif' }}
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
              <Briefcase className="w-12 h-12 text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2" style={{ fontFamily: 'Figtree, sans-serif' }}>
              No jobs found
            </h3>
            <p className="text-slate-400 text-center max-w-md" style={{ fontFamily: 'Figtree, sans-serif' }}>
              Try adjusting your filters or search query to find more opportunities.
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
