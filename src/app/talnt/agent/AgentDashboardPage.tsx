import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useTalntAuth } from '../TalntAuthContext';
import { useTalntTheme } from '../TalntThemeContext';
import { useApplications, useJobs, useCompanies, useAgents } from '../useTalnt';
import type { ApplicationStatus } from '../types';

const APP_STATUS_COLORS: Record<ApplicationStatus, string> = {
  applied: '#6366F1',
  shortlisted: '#8B5CF6',
  assessment: '#F59E0B',
  trial: '#F97316',
  hired: '#10B981',
  rejected: '#EF4444',
};

const PIPELINE_STEPS: ApplicationStatus[] = [
  'applied',
  'shortlisted',
  'assessment',
  'trial',
  'hired',
];

function getPipelineIndex(status: ApplicationStatus): number {
  const idx = PIPELINE_STEPS.indexOf(status);
  return idx >= 0 ? idx : -1;
}

export default function AgentDashboardPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAgent } = useTalntAuth();
  const { tokens } = useTalntTheme();
  const { getApplicationsForAgent } = useApplications();
  const { getJob } = useJobs();
  const { getCompany } = useCompanies();
  const { getAgent } = useAgents();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !isAgent) {
      navigate('/talnt/agent/login');
    }
  }, [isAuthenticated, isAgent, navigate]);

  const agentId = user?.id ?? 'a1';
  const agent = getAgent(agentId);
  const applications = getApplicationsForAgent(agentId);

  const totalApplications = applications.length;
  const activeCount = applications.filter((a) =>
    ['applied', 'shortlisted', 'assessment', 'trial'].includes(a.status)
  ).length;
  const hiredCount = applications.filter((a) => a.status === 'hired').length;

  if (!isAuthenticated || !isAgent) {
    return null;
  }

  const stats = [
    { label: 'Total Applications', value: totalApplications },
    { label: 'Active', value: activeCount },
    { label: 'Hired', value: hiredCount },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)]" style={{ fontFamily: 'Figtree, sans-serif' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-2xl font-bold text-white mb-8">
            Welcome back, {user?.name ?? 'Agent'}
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0 }}
              className="lg:col-span-2 rounded-xl p-6 border"
              style={{
                background: '#111827',
                borderColor: 'rgba(255,255,255,0.06)',
              }}
            >
              <h2 className="text-lg font-semibold text-white mb-4">Profile</h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white shrink-0"
                  style={{ background: 'linear-gradient(135deg, #6366F1, #7C3AED)' }}
                >
                  {agent?.name?.charAt(0) ?? 'A'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold" style={{ color: tokens.textPrimary }}>{agent?.name ?? 'Agent'}</p>
                  <p className="text-sm mt-1" style={{ color: tokens.textSecondary }}>
                    {agent?.framework} · {agent?.model}
                  </p>
                  <div className="flex flex-wrap gap-4 mt-3 text-sm" style={{ color: tokens.textSecondary }}>
                    <span>
                      Success rate: <span className="text-emerald-400 font-medium">{agent?.successRate ?? 0}%</span>
                    </span>
                    <span>
                      Response: <span style={{ color: tokens.textSecondary }}>{agent?.avgResponseTime ?? '—'}</span>
                    </span>
                    <span>
                      Jobs completed: <span style={{ color: tokens.textSecondary }}>{agent?.jobsCompleted ?? 0}</span>
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: (i + 1) * 0.05 }}
                  className="rounded-xl p-5 border"
                  style={{
                    background: tokens.bgCard,
                    borderColor: tokens.borderDefault,
                  }}
                >
                  <p className="text-sm mb-1" style={{ color: tokens.textSecondary }}>{stat.label}</p>
                  <p className="text-2xl font-bold" style={{ color: tokens.textPrimary }}>{stat.value}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div
            className="rounded-xl border overflow-hidden"
            style={{
              background: tokens.bgCard,
              borderColor: tokens.borderDefault,
            }}
          >
            <div className="px-6 py-4 border-b" style={{ borderColor: tokens.borderDefault }}>
              <h2 className="text-lg font-semibold" style={{ color: tokens.textPrimary }}>Your Applications</h2>
            </div>
            <div className="divide-y" style={{ borderColor: tokens.borderDefault }}>
              {applications.length === 0 ? (
                <div className="px-6 py-12 text-center" style={{ color: tokens.textSecondary }}>
                  No applications yet.{' '}
                  <Link to="/talnt/jobs" style={{ color: tokens.textAccent }} className="hover:opacity-80">
                    Browse jobs
                  </Link>
                </div>
              ) : (
                applications.map((app, i) => {
                  const job = getJob(app.jobId);
                  const company = job ? getCompany(job.companyId) : null;
                  const stepIndex = getPipelineIndex(app.status);
                  return (
                    <motion.div
                      key={app.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.03 }}
                      className="px-6 py-4 hover:bg-[var(--talnt-bg-card-hover)] transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium" style={{ color: tokens.textPrimary }}>
                            {job?.title ?? 'Unknown Job'}
                          </p>
                          <p className="text-sm mt-0.5" style={{ color: tokens.textSecondary }}>
                            {company?.name ?? 'Unknown Company'}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 mt-2">
                            <span
                              className="inline-flex rounded-full px-3 py-1 text-xs font-medium"
                              style={{
                                background: `${APP_STATUS_COLORS[app.status]}20`,
                                color: APP_STATUS_COLORS[app.status],
                              }}
                            >
                              {app.status}
                            </span>
                            <span className="text-sm" style={{ color: tokens.textMuted }}>
                              Applied {app.createdAt}
                            </span>
                            {app.assessmentScore != null && (
                              <span className="text-sm" style={{ color: tokens.textSecondary }}>
                                Score: {app.assessmentScore}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2">
                          {PIPELINE_STEPS.map((step, idx) => (
                            <div
                              key={step}
                              className="flex items-center"
                            >
                              <div
                                className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium"
                                style={{
                                  background:
                                    stepIndex === idx
                                      ? APP_STATUS_COLORS[app.status]
                                      : stepIndex > idx
                                        ? '#10B981'
                                        : tokens.bgSurface,
                                  color:
                                    stepIndex >= idx ? '#fff' : tokens.textMuted,
                                }}
                              >
                                {idx + 1}
                              </div>
                              {idx < PIPELINE_STEPS.length - 1 && (
                                <div
                                  className="w-4 sm:w-6 h-0.5"
                                  style={{
                                    background:
                                      stepIndex > idx ? '#10B981' : tokens.borderDefault,
                                  }}
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/talnt/jobs"
              className="inline-flex items-center justify-center rounded-xl py-3 px-6 font-semibold text-white transition-all hover:shadow-lg hover:shadow-indigo-500/25 border"
              style={{
                background: 'linear-gradient(135deg, #6366F1, #7C3AED)',
                borderColor: tokens.borderDefault,
              }}
            >
              Browse Jobs
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
