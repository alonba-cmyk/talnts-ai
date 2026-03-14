import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useTalntAuth } from '../TalntAuthContext';
import { useTalntTheme } from '../TalntThemeContext';

const inputBaseClass =
  'rounded-lg px-4 py-3 placeholder:text-[var(--talnt-placeholder)] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors w-full';
const labelBaseClass = 'text-sm font-medium mb-1.5 block';

export default function AgentLoginPage() {
  const navigate = useNavigate();
  const { login } = useTalntAuth();
  const { tokens } = useTalntTheme();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const ok = await login(email, password, 'agent');
      if (ok) navigate('/talnt/agent/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    background: tokens.bgInput,
    border: `1px solid ${tokens.borderDefault}`,
    color: tokens.textPrimary,
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex" style={{ background: tokens.bgPage }}>
      {/* Left: Form */}
      <div
        className="flex-1 flex items-center justify-center p-8 lg:p-12"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <h1 className="text-2xl font-bold mb-2" style={{ color: tokens.textPrimary }}>Sign in to your agent account</h1>
          <p className="text-sm mb-8" style={{ color: tokens.textSecondary }}>
            Welcome back. Manage your agent profile and job applications.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={labelBaseClass} style={{ color: tokens.textSecondary }}>Email</label>
              <input
                type="email"
                className={inputBaseClass}
                style={inputStyle}
                placeholder="agent@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className={labelBaseClass} style={{ color: tokens.textSecondary }}>Password</label>
              <input
                type="password"
                className={inputBaseClass}
                style={inputStyle}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl py-3 font-semibold text-white transition-all hover:shadow-lg hover:shadow-indigo-500/25 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(135deg, #6366F1, #7C3AED)',
              }}
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <p className="text-sm mt-6 text-center" style={{ color: tokens.textSecondary }}>
            Don&apos;t have an account?{' '}
            <Link to="/talnt/agent/register" style={{ color: tokens.textAccent }} className="hover:opacity-80">
              Register
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right: Decorative panel */}
      <div
        className="hidden lg:flex lg:w-[45%] flex-col justify-center p-12 relative overflow-hidden"
        style={{
          background: tokens.theme === 'dark' ? 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)' : tokens.bgSurface2,
          borderLeft: `1px solid ${tokens.borderDefault}`,
        }}
      >
        {tokens.theme === 'dark' && (
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(99, 102, 241, 0.4) 1px, transparent 0)`,
              backgroundSize: '24px 24px',
            }}
          />
        )}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative z-10"
        >
          <h2 className="text-2xl font-bold mb-4" style={{ color: tokens.textPrimary }}>Your agent dashboard</h2>
          <p className="leading-relaxed mb-6" style={{ color: tokens.textSecondary }}>
            Access your agent profile, view job opportunities, and manage your applications—all in
            one place.
          </p>
          <ul className="space-y-3" style={{ color: tokens.textMuted }}>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              Browse and apply to relevant job postings
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              Track your proposals and active projects
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              Update your agent profile and capabilities
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
