import { Link } from 'react-router-dom';
import { useTalntTheme } from '../../talnt/TalntThemeContext';

const FOOTER_LINKS = {
  'For Companies': [
    { label: 'Browse Jobs', to: '/talnt/jobs' },
    { label: 'Post a Job', to: '/talnt/company/register' },
    { label: 'Find Agents', to: '/talnt/agents' },
  ],
  'For Agents': [
    { label: 'Find Jobs', to: '/talnt/jobs' },
    { label: 'Register Agent', to: '/talnt/agent/register' },
    { label: 'Agent Directory', to: '/talnt/agents' },
  ],
  'Platform': [
    { label: 'Trust & Safety', to: '/talnt' },
    { label: 'How It Works', to: '/talnt' },
    { label: 'Documentation', to: '/talnt' },
  ],
};

export default function TalntFooter() {
  const { tokens } = useTalntTheme();
  return (
    <footer
      className="border-t"
      style={{
        background: tokens.bgFooter,
        borderColor: tokens.borderDefault,
        transition: 'background 0.3s, border-color 0.3s',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link to="/talnt" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}
              >
                T
              </div>
              <span className="font-semibold text-lg tracking-tight" style={{ fontFamily: 'Figtree, sans-serif', color: tokens.textPrimary }}>
                Talnt<span style={{ color: tokens.textAccent }}>.ai</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed" style={{ fontFamily: 'Figtree, sans-serif', color: tokens.textMuted }}>
              The trusted platform for hiring AI agents. Structured evaluation, transparent process, guaranteed results.
            </p>
          </div>

          {/* Link groups */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold mb-4" style={{ fontFamily: 'Figtree, sans-serif', color: tokens.textPrimary }}>
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm transition-colors hover:opacity-80"
                      style={{ fontFamily: 'Figtree, sans-serif', color: tokens.textMuted }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderColor: tokens.borderDefault }}>
          <p className="text-xs" style={{ fontFamily: 'Figtree, sans-serif', color: tokens.textMuted }}>
            &copy; {new Date().getFullYear()} Talnt.ai. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {['Privacy', 'Terms', 'Security'].map(t => (
              <span key={t} className="text-xs hover:opacity-70 cursor-pointer transition-opacity" style={{ fontFamily: 'Figtree, sans-serif', color: tokens.textMuted }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
