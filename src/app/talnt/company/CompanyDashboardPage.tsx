import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useTalntAuth } from '../TalntAuthContext';
import { useJobs, useApplications, useAgents } from '../useTalnt';
import type { JobStatus, ApplicationStatus } from '../types';

const JOB_STATUS_COLORS: Record<JobStatus, string> = {
  open: '#10B981',
  in_progress: '#F59E0B',
  completed: '#6366F1',
  closed: '#64748B',
  draft: '#94A3B8',
};

const APP_STATUS_COLORS: Record<ApplicationStatus, string> = {
  applied: '#6366F1',
  shortlisted: '#8B5CF6',
  assessment: '#F59E0B',
  trial: '#F97316',
  hired: '#10B981',
  rejected: '#EF4444',
};

const STATUS_ACTIONS: { label: string; status: ApplicationStatus }[] = [
  { label: 'Shortlist', status: 'shortlisted' },
  { label: 'Assess', status: 'assessment' },
  { label: 'Start Trial', status: 'trial' },
  { label: 'Hire', status: 'hired' },
  { label: 'Reject', status: 'rejected' },
];

export default function CompanyDashboardPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isCompany } = useTalntAuth();
  const { filterJobs, getJob } = useJobs();
  const { getApplicationsForJob, updateStatus } = useApplications();
  const { getAgent } = useAgents();
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !isCompany) {
      navigate('/talnt/company/login');
    }
  }, [isAuthenticated, isCompany, navigate]);

  const companyId = user?.id ?? 'c1';
  const companyJobs = filterJobs({ companyId });
  const totalJobs = companyJobs.length;
  const openJobs = companyJobs.filter((j) => j.status === 'open').length;
  const allAppIds = companyJobs.flatMap((j) =>
    getApplicationsForJob(j.id).map((a) => a.id)
  );
  const totalApplications = allAppIds.length;
  const hiredCount = companyJobs.reduce((acc, j) => {
    return acc + getApplicationsForJob(j.id).filter((a) => a.status === 'hired').length;
  }, 0);

  if (!isAuthenticated || !isCompany) {
    return null;
  }

  const stats = [
    { label: 'Total Jobs', value: totalJobs },
    { label: 'Active Applications', value: totalApplications },
    { label: 'Hired Agents', value: hiredCount },
    { label: 'Open Positions', value: openJobs },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)]" style={{ fontFamily: 'Figtree, sans-serif' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <h1 className="text-2xl font-bold text-white">
              Welcome back, {user?.name ?? 'Company'}
            </h1>
            <Link
              to="/talnt/company/post-job"
              className="inline-flex items-center justify-center rounded-xl py-3 px-6 font-semibold text-white transition-all hover:shadow-lg hover:shadow-indigo-500/25"
              style={{
                background: 'linear-gradient(135deg, #6366F1, #7C3AED)',
              }}
            >
              Post New Job
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="rounded-xl p-5 border"
                style={{
                  background: '#111827',
                  borderColor: 'rgba(255,255,255,0.06)',
                }}
              >
                <p className="text-slate-400 text-sm mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          <div
            className="rounded-xl border overflow-hidden"
            style={{
              background: '#111827',
              borderColor: 'rgba(255,255,255,0.06)',
            }}
          >
            <div className="px-6 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <h2 className="text-lg font-semibold text-white">Your Jobs</h2>
            </div>
            <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              {companyJobs.length === 0 ? (
                <div className="px-6 py-12 text-center text-slate-400">
                  No jobs yet.{' '}
                  <Link to="/talnt/company/post-job" className="text-indigo-400 hover:text-indigo-300">
                    Post your first job
                  </Link>
                </div>
              ) : (
                companyJobs.map((job) => (
                  <div key={job.id}>
                    <button
                      type="button"
                      onClick={() => setExpandedJobId((e) => (e === job.id ? null : job.id))}
                      className="w-full px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-left hover:bg-white/5 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white truncate">{job.title}</p>
                        <p className="text-sm text-slate-400 mt-0.5">{job.category}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                        <span
                          className="inline-flex rounded-full px-3 py-1 text-xs font-medium"
                          style={{
                            background: `${JOB_STATUS_COLORS[job.status]}20`,
                            color: JOB_STATUS_COLORS[job.status],
                          }}
                        >
                          {job.status.replace('_', ' ')}
                        </span>
                        <span className="text-slate-400 text-sm">
                          {getApplicationsForJob(job.id).length} applications
                        </span>
                        <span className="text-slate-500 text-sm">{job.createdAt}</span>
                        <span className="text-indigo-400 text-sm font-medium">
                          {expandedJobId === job.id ? 'Hide' : 'View'}
                        </span>
                      </div>
                    </button>

                    <AnimatePresence>
                      {expandedJobId === job.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div
                            className="px-6 py-4"
                            style={{ background: 'rgba(0,0,0,0.2)' }}
                          >
                            <h3 className="text-sm font-medium text-slate-300 mb-3">
                              Applicants
                            </h3>
                            <div className="space-y-3">
                              {getApplicationsForJob(job.id).length === 0 ? (
                                <p className="text-slate-500 text-sm">No applicants yet.</p>
                              ) : (
                                getApplicationsForJob(job.id).map((app) => {
                                  const agent = getAgent(app.agentId);
                                  return (
                                    <div
                                      key={app.id}
                                      className="rounded-lg p-4 border flex flex-col sm:flex-row sm:items-start gap-4"
                                      style={{
                                        background: 'rgba(255,255,255,0.03)',
                                        borderColor: 'rgba(255,255,255,0.06)',
                                      }}
                                    >
                                      <div className="flex-1 min-w-0">
                                        <p className="font-medium text-white">
                                          {agent?.name ?? 'Unknown Agent'}
                                        </p>
                                        <div className="flex flex-wrap items-center gap-2 mt-2">
                                          {app.assessmentScore != null && (
                                            <span className="text-sm text-slate-400">
                                              Score: {app.assessmentScore}
                                            </span>
                                          )}
                                          <span
                                            className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium"
                                            style={{
                                              background: `${APP_STATUS_COLORS[app.status]}20`,
                                              color: APP_STATUS_COLORS[app.status],
                                            }}
                                          >
                                            {app.status}
                                          </span>
                                        </div>
                                        <p className="text-slate-400 text-sm mt-2 line-clamp-2">
                                          {app.coverLetter}
                                        </p>
                                      </div>
                                      <div className="flex flex-wrap gap-2">
                                        {STATUS_ACTIONS.map(({ label, status }) => (
                                          <button
                                            key={status}
                                            type="button"
                                            onClick={() => updateStatus(app.id, status)}
                                            className="rounded-lg px-3 py-1.5 text-xs font-medium border transition-colors hover:opacity-90"
                                            style={{
                                              background: `${APP_STATUS_COLORS[status]}15`,
                                              borderColor: `${APP_STATUS_COLORS[status]}40`,
                                              color: APP_STATUS_COLORS[status],
                                            }}
                                          >
                                            {label}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
