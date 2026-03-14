import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { useJobs, useCompanies, useApplications, useAgents } from './useTalnt';
import { useTalntAuth } from './TalntAuthContext';
import { useTalntTheme } from './TalntThemeContext';
import { CATEGORY_ICONS } from './mockData';
import AgentAvatar from '../components/talnt/AgentAvatar';
import { ArrowLeft, Check, Building2, Shield } from 'lucide-react';
import type { ApplicationStatus } from './types';

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

function getStatusColor(status: ApplicationStatus) {
  const colors: Record<ApplicationStatus, string> = {
    applied: '#6366F1',
    shortlisted: '#10B981',
    assessment: '#F59E0B',
    trial: '#10B981',
    hired: '#10B981',
    rejected: '#EF4444',
  };
  return colors[status] ?? '#64748B';
}

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getJob } = useJobs();
  const { getCompany } = useCompanies();
  const { getApplicationsForJob, hasApplied, apply } = useApplications();
  const { getAgent } = useAgents();
  const { user, isAgent, isCompany } = useTalntAuth();
  const { tokens } = useTalntTheme();

  const [coverLetter, setCoverLetter] = useState('');
  const [applySubmitted, setApplySubmitted] = useState(false);

  const job = id ? getJob(id) : null;
  const company = job ? getCompany(job.companyId) : null;
  const applications = job ? getApplicationsForJob(job.id) : [];
  const userHasApplied = job && user && isAgent ? hasApplied(job.id, user.id) : false;
  const userApplication = applications.find((a) => a.agentId === user?.id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const handleApply = () => {
    if (!job || !user || !isAgent) return;
    apply(job.id, user.id, coverLetter);
    setApplySubmitted(true);
  };

  if (!job) {
    return (
      <div className="min-h-screen py-16 px-4 flex flex-col items-center justify-center" style={{ fontFamily: 'Figtree, sans-serif' }}>
        <h2 className="text-xl font-semibold text-white mb-2">Job not found</h2>
        <Link to="/talnt/jobs" className="text-indigo-400 hover:text-indigo-300 flex items-center gap-2">
          <ArrowLeft size={16} />
          Back to jobs
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen py-8 px-4 sm:px-6 lg:px-8"
      style={{ fontFamily: 'Figtree, sans-serif' }}
    >
      <div className="max-w-4xl mx-auto">
        <Link
          to="/talnt/jobs"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
          style={{ fontFamily: 'Figtree, sans-serif' }}
        >
          <ArrowLeft size={18} />
          Back to jobs
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-8">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(99, 102, 241, 0.15)' }}>
            <Building2 className="w-7 h-7 text-indigo-400" />
          </div>
          <div className="flex-1">
            <p className="text-slate-400 text-sm mb-1" style={{ fontFamily: 'Figtree, sans-serif' }}>
              {company?.name ?? 'Unknown Company'}
            </p>
            <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Figtree, sans-serif' }}>
              {job.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="px-2.5 py-1 rounded-full text-xs font-medium capitalize"
                style={{
                  background: job.status === 'open' ? 'rgba(16, 185, 129, 0.2)' : job.status === 'in_progress' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(100, 116, 139, 0.2)',
                  color: job.status === 'open' ? '#10B981' : job.status === 'in_progress' ? '#F59E0B' : '#94A3B8',
                  fontFamily: 'Figtree, sans-serif',
                }}
              >
                {job.status.replace('_', ' ')}
              </span>
              <span className="text-sm text-slate-500" style={{ fontFamily: 'Figtree, sans-serif' }}>
                {formatDaysAgo(job.createdAt)}
              </span>
              <span className="text-sm text-slate-500" style={{ fontFamily: 'Figtree, sans-serif' }}>
                · {applications.length} applications
              </span>
            </div>
          </div>
        </div>

        {/* Budget */}
        <div className="p-5 rounded-xl mb-6" style={{ background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
          <p className="text-sm text-indigo-300 mb-1" style={{ fontFamily: 'Figtree, sans-serif' }}>Budget</p>
          <p className="text-2xl font-bold text-white" style={{ fontFamily: 'Figtree, sans-serif' }}>
            {formatBudget(job.budgetMin, job.budgetMax, job.budgetType)}
          </p>
        </div>

        {/* Description */}
        <div className="mb-6 p-6 rounded-xl" style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 className="text-lg font-semibold text-white mb-3" style={{ fontFamily: 'Figtree, sans-serif' }}>Description</h3>
          <p className="text-slate-300 leading-relaxed whitespace-pre-wrap" style={{ fontFamily: 'Figtree, sans-serif' }}>{job.description}</p>
        </div>

        {/* Requirements */}
        <div className="mb-6 p-6 rounded-xl" style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 className="text-lg font-semibold text-white mb-3" style={{ fontFamily: 'Figtree, sans-serif' }}>Requirements</h3>
          <ul className="space-y-2">
            {job.requirements.map((req, i) => (
              <li key={i} className="flex items-start gap-2 text-slate-300" style={{ fontFamily: 'Figtree, sans-serif' }}>
                <Check className="w-5 h-5 shrink-0 mt-0.5 text-[#10B981]" />
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Success criteria */}
        <div className="mb-8 p-6 rounded-xl" style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
          <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2" style={{ fontFamily: 'Figtree, sans-serif' }}>
            <Shield size={20} className="text-[#10B981]" />
            Success Criteria
          </h3>
          <p className="text-slate-300" style={{ fontFamily: 'Figtree, sans-serif' }}>{job.successCriteria}</p>
        </div>

        {/* Agent: Apply section */}
        {isAgent && user && (
          <div className="mb-8 p-6 rounded-xl" style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)' }}>
            {userHasApplied || applySubmitted ? (
              <div>
                <h3 className="text-lg font-semibold text-white mb-2" style={{ fontFamily: 'Figtree, sans-serif' }}>
                  You&apos;ve already applied
                </h3>
                <p className="text-slate-400" style={{ fontFamily: 'Figtree, sans-serif' }}>
                  {userApplication && (
                    <span
                      className="inline-block px-3 py-1 rounded-full text-sm font-medium mt-2"
                      style={{
                        background: `${getStatusColor(userApplication.status)}20`,
                        color: getStatusColor(userApplication.status),
                        fontFamily: 'Figtree, sans-serif',
                      }}
                    >
                      Status: {userApplication.status}
                    </span>
                  )}
                </p>
              </div>
            ) : job.status === 'open' ? (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3" style={{ fontFamily: 'Figtree, sans-serif' }}>
                  Apply Now
                </h3>
                <textarea
                  placeholder="Write a cover letter explaining why your agent is a great fit..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg text-white placeholder-slate-500 resize-none mb-4"
                  style={{
                    background: tokens.bgInput,
                    border: `1px solid ${tokens.borderDefault}`,
                    fontFamily: 'Figtree, sans-serif',
                    color: tokens.textPrimary,
                  }}
                />
                <button
                  onClick={handleApply}
                  disabled={!coverLetter.trim()}
                  className="px-6 py-3 rounded-lg font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: coverLetter.trim() ? 'linear-gradient(135deg, #6366F1, #7C3AED)' : 'rgba(99, 102, 241, 0.3)',
                    fontFamily: 'Figtree, sans-serif',
                  }}
                >
                  Submit Application
                </button>
              </div>
            ) : null}
          </div>
        )}

        {/* Company: Applicants list */}
        {isCompany && user && (
          <div className="p-6 rounded-xl" style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h3 className="text-lg font-semibold text-white mb-4" style={{ fontFamily: 'Figtree, sans-serif' }}>
              Applicants ({applications.length})
            </h3>
            {applications.length > 0 ? (
              <div className="space-y-4">
                {applications.map((app) => {
                  const agent = getAgent(app.agentId);
                  if (!agent) return null;
                  return (
                    <motion.div
                      key={app.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-lg flex items-center gap-4"
                      style={{ background: tokens.bgSurface, border: `1px solid ${tokens.borderDefault}` }}
                    >
                      <AgentAvatar agent={agent} size="md" showStatus showRing={false} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Link
                            to={`/talnt/agents/${agent.id}`}
                            className="font-semibold text-white hover:text-indigo-400 transition-colors"
                            style={{ fontFamily: 'Figtree, sans-serif' }}
                          >
                            {agent.name}
                          </Link>
                          {agent.isVerified && (
                            <Shield size={14} className="text-[#10B981]" />
                          )}
                        </div>
                        <p className="text-sm text-slate-400 truncate mt-0.5" style={{ fontFamily: 'Figtree, sans-serif' }}>
                          {agent.framework} · {agent.successRate}% success rate
                        </p>
                        {app.coverLetter && (
                          <p className="text-sm text-slate-500 mt-2 line-clamp-2" style={{ fontFamily: 'Figtree, sans-serif' }}>
                            {app.coverLetter}
                          </p>
                        )}
                      </div>
                      <div className="shrink-0 flex flex-col items-end gap-1">
                        {app.assessmentScore != null && (
                          <span className="text-sm font-medium text-white" style={{ fontFamily: 'Figtree, sans-serif' }}>
                            Score: {app.assessmentScore}
                          </span>
                        )}
                        <span
                          className="px-2.5 py-1 rounded-full text-xs font-medium capitalize"
                          style={{
                            background: `${getStatusColor(app.status)}20`,
                            color: getStatusColor(app.status),
                            fontFamily: 'Figtree, sans-serif',
                          }}
                        >
                          {app.status}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <p className="text-slate-500" style={{ fontFamily: 'Figtree, sans-serif' }}>No applications yet.</p>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
