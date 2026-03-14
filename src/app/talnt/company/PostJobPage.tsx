import { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useTalntAuth } from '../TalntAuthContext';
import { useTalntTheme } from '../TalntThemeContext';
import { useJobs } from '../useTalnt';
import type { AgentCategory, BudgetType, JobStatus } from '../types';

const AGENT_CATEGORIES: AgentCategory[] = [
  'Content Writer',
  'SDR / Sales',
  'Customer Support',
  'Developer',
  'Data Analyst',
  'Marketing',
  'Research',
  'Operations',
];

const BUDGET_TYPES: BudgetType[] = ['hourly', 'fixed', 'monthly'];

const JOB_STATUS_OPTIONS: JobStatus[] = ['draft', 'open'];

const inputBaseClass =
  'rounded-lg px-4 py-3 placeholder:text-[var(--talnt-placeholder)] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors w-full';
const labelBaseClass = 'text-sm font-medium mb-1.5 block';

export default function PostJobPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isCompany } = useTalntAuth();
  const { tokens } = useTalntTheme();
  const { addJob } = useJobs();
  const [showSuccess, setShowSuccess] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '' as AgentCategory | '',
    requirements: [] as string[],
    requirementInput: '',
    budgetMin: '',
    budgetMax: '',
    budgetType: 'monthly' as BudgetType,
    successCriteria: '',
    status: 'draft' as JobStatus,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !isCompany) {
      navigate('/talnt/company/login');
    }
  }, [isAuthenticated, isCompany, navigate]);

  const handleAddRequirement = useCallback(() => {
    const trimmed = form.requirementInput.trim();
    if (trimmed && !form.requirements.includes(trimmed)) {
      setForm((prev) => ({
        ...prev,
        requirements: [...prev.requirements, trimmed],
        requirementInput: '',
      }));
    }
  }, [form.requirementInput, form.requirements]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAddRequirement();
      }
    },
    [handleAddRequirement]
  );

  const handleRemoveRequirement = useCallback((req: string) => {
    setForm((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((r) => r !== req),
    }));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const companyId = user?.id ?? 'c1';
    addJob({
      companyId,
      title: form.title,
      description: form.description,
      category: form.category as AgentCategory,
      requirements: form.requirements,
      budgetMin: Number(form.budgetMin) || 0,
      budgetMax: Number(form.budgetMax) || 0,
      budgetType: form.budgetType,
      status: form.status,
      successCriteria: form.successCriteria,
    });
    setShowSuccess(true);
    setTimeout(() => {
      navigate('/talnt/company/dashboard');
    }, 1500);
  };

  if (!isAuthenticated || !isCompany) {
    return null;
  }

  const inputStyle = {
    background: tokens.bgInput,
    border: `1px solid ${tokens.borderDefault}`,
    color: tokens.textPrimary,
  };

  return (
    <div className="min-h-[calc(100vh-4rem)]" style={{ fontFamily: 'Figtree, sans-serif', background: tokens.bgPage }}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-4 mb-8">
            <Link
              to="/talnt/company/dashboard"
              className="transition-colors hover:opacity-80"
              style={{ color: tokens.textSecondary }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-2xl font-bold" style={{ color: tokens.textPrimary }}>Post a New Job</h1>
          </div>

          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="mb-6 rounded-xl p-4 flex items-center gap-3"
                style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                }}
              >
                <p className="text-emerald-400 font-medium">Job posted successfully!</p>
                <p className="text-sm" style={{ color: tokens.textSecondary }}>Redirecting to dashboard...</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={labelBaseClass} style={{ color: tokens.textSecondary }}>Title</label>
              <input
                type="text"
                className={inputBaseClass}
                style={inputStyle}
                placeholder="e.g. Content Writer for Technical Blog"
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                required
              />
            </div>

            <div>
              <label className={labelBaseClass} style={{ color: tokens.textSecondary }}>Description</label>
              <textarea
                className={inputBaseClass}
                style={inputStyle} 
                rows={5}
                placeholder="Describe the job requirements and deliverables..."
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                required
              />
            </div>

            <div>
              <label className={labelBaseClass} style={{ color: tokens.textSecondary }}>Category</label>
              <select
                className={inputBaseClass}
                style={inputStyle}
                value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value as AgentCategory }))}
                required
              >
                <option value="">Select category</option>
                {AGENT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelBaseClass} style={{ color: tokens.textSecondary }}>Requirements (type and press Enter to add)</label>
              <input
                type="text"
                className={inputBaseClass}
                style={inputStyle}
                placeholder="e.g. SEO optimization"
                value={form.requirementInput}
                onChange={(e) => setForm((p) => ({ ...p, requirementInput: e.target.value }))}
                onKeyDown={handleKeyDown}
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {form.requirements.map((req) => (
                  <span
                    key={req}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm"
                    style={{
                      background: 'rgba(99, 102, 241, 0.2)',
                      border: '1px solid rgba(99, 102, 241, 0.4)',
                      color: tokens.textAccent,
                    }}
                  >
                    {req}
                    <button
                      type="button"
                      onClick={() => handleRemoveRequirement(req)}
                      className="hover:opacity-80 transition-colors"
                      style={{ color: 'inherit' }}
                    >
                      <span className="sr-only">Remove</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelBaseClass} style={{ color: tokens.textSecondary }}>Budget Min</label>
                <input
                  type="number"
                  min={0}
                  className={inputBaseClass}
                style={inputStyle}
                  placeholder="0"
                  value={form.budgetMin}
                  onChange={(e) => setForm((p) => ({ ...p, budgetMin: e.target.value }))}
                />
              </div>
              <div>
                <label className={labelBaseClass} style={{ color: tokens.textSecondary }}>Budget Max</label>
                <input
                  type="number"
                  min={0}
                  className={inputBaseClass}
                style={inputStyle}
                  placeholder="0"
                  value={form.budgetMax}
                  onChange={(e) => setForm((p) => ({ ...p, budgetMax: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <label className={labelBaseClass} style={{ color: tokens.textSecondary }}>Budget Type</label>
              <select
                className={inputBaseClass}
                style={inputStyle}
                value={form.budgetType}
                onChange={(e) => setForm((p) => ({ ...p, budgetType: e.target.value as BudgetType }))}
              >
                {BUDGET_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelBaseClass} style={{ color: tokens.textSecondary }}>Success Criteria</label>
              <textarea
                className={inputBaseClass}
                style={inputStyle}
                rows={3}
                placeholder="Define success metrics for this job..."
                value={form.successCriteria}
                onChange={(e) => setForm((p) => ({ ...p, successCriteria: e.target.value }))}
              />
            </div>

            <div>
              <label className={labelBaseClass} style={{ color: tokens.textSecondary }}>Status</label>
              <select
                className={inputBaseClass}
                style={inputStyle}
                value={form.status}
                onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as JobStatus }))}
              >
                {JOB_STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                disabled={showSuccess}
                className="flex-1 rounded-xl py-3 font-semibold text-white transition-all hover:shadow-lg hover:shadow-indigo-500/25 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(135deg, #6366F1, #7C3AED)',
                }}
              >
                {showSuccess ? 'Posting...' : 'Submit'}
              </button>
              <Link
                to="/talnt/company/dashboard"
                className="flex-1 rounded-xl py-3 font-semibold text-center border transition-colors hover:bg-[var(--talnt-bg-card-hover)]"
                style={{
                  borderColor: tokens.borderDefault,
                  color: tokens.textPrimary,
                  background: 'transparent',
                }}
              >
                Cancel
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
