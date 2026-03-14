import { Link, useLocation } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'motion/react';
import { useTalntAuth } from '../../talnt/TalntAuthContext';
import { useAgentSearch } from '../../talnt/AgentSearchContext';
import { useAgentWizard } from '../../talnt/AgentWizardContext';
import { useTalntTheme } from '../../talnt/TalntThemeContext';
import { Menu, X, LogOut, LayoutDashboard, Search, ArrowRight, Sun, Moon } from 'lucide-react';
import { useState } from 'react';

const NAV_LINKS = [
  { label: 'Browse Agents', to: '/talnt/agents', isAgentSearch: true },
  { label: 'Browse Jobs', to: '/talnt/jobs', isAgentSearch: false },
];

export default function TalntNavbar() {
  const { isAuthenticated, user, logout, isCompany } = useTalntAuth();
  const { openSearch } = useAgentSearch();
  const { openWizard } = useAgentWizard();
  const { tokens, toggleTheme } = useTalntTheme();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const dashboardPath = isCompany ? '/talnt/company/dashboard' : '/talnt/agent/dashboard';

  const { scrollY } = useScroll();
  const navBg = useTransform(scrollY, [0, 80], [tokens.bgNavbar, tokens.bgNavbarSolid]);
  const navBorder = useTransform(scrollY, [0, 80], ['rgba(0,0,0,0)', tokens.borderNavbar]);
  const navBlur = useTransform(scrollY, [0, 80], ['blur(0px)', 'blur(20px)']);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: navBg,
        borderBottom: `1px solid`,
        borderColor: navBorder,
        backdropFilter: navBlur,
        WebkitBackdropFilter: navBlur,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo + nav links grouped together */}
          <div className="flex items-center gap-8">
            <Link to="/talnt" className="flex items-center gap-2.5 group">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}
              >
                T
              </div>
              <span
                className="font-semibold text-lg tracking-tight"
                style={{ fontFamily: 'Figtree, sans-serif', color: tokens.textPrimary }}
              >
                Talnt<span style={{ color: tokens.textAccent }}>.ai</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(link => {
              const isActive = location.pathname === link.to;
              if (link.isAgentSearch) {
                return (
                  <button
                    key={link.to}
                    onClick={() => openSearch()}
                    className="relative px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer hover:text-[#111827]"
                    style={{
                      color: isActive ? tokens.textPrimary : tokens.textSecondary,
                      fontFamily: 'Figtree, sans-serif',
                    }}
                  >
                    <Search size={14} />
                    {link.label}
                  </button>
                );
              }
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className="relative px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:text-[#111827]"
                  style={{
                    color: isActive ? tokens.textPrimary : tokens.textSecondary,
                    fontFamily: 'Figtree, sans-serif',
                  }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="talnt-nav-active"
                      className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full"
                      style={{ background: tokens.textAccent }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  {link.label}
                </Link>
              );
            })}
            </div>
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme toggle */}
            <motion.button
              onClick={toggleTheme}
              whileTap={{ scale: 0.88 }}
              className="p-2 rounded-lg transition-colors cursor-pointer"
              style={{
                color: tokens.textMuted,
                background: tokens.bgSurface,
                border: `1px solid ${tokens.borderDefault}`,
              }}
              title={tokens.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <motion.div
                key={tokens.theme}
                initial={{ rotate: -30, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.25 }}
              >
                {tokens.theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
              </motion.div>
            </motion.button>
            {isAuthenticated ? (
              <>
                <Link
                  to={dashboardPath}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-gray-100"
                  style={{
                    color: tokens.textSecondary,
                    fontFamily: 'Figtree, sans-serif',
                  }}
                >
                  <LayoutDashboard size={15} />
                  Dashboard
                </Link>
                <div className="flex items-center gap-2 px-2">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}
                  >
                    {user?.name?.[0]?.toUpperCase() ?? '?'}
                  </div>
                  <span className="text-sm max-w-[120px] truncate" style={{ color: tokens.textSecondary }}>
                    {user?.name}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="p-2 rounded-lg transition-colors hover:bg-gray-100 cursor-pointer"
                  style={{ color: tokens.textMuted }}
                  title="Logout"
                >
                  <LogOut size={15} />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/talnt/company/login"
                  className="px-4 py-2 text-sm font-medium transition-colors hover:text-[#111827]"
                  style={{ fontFamily: 'Figtree, sans-serif', color: tokens.textSecondary }}
                >
                  Log in
                </Link>
                <Link
                  to="/talnt/company/register"
                  className="px-4 py-2 text-sm font-medium transition-colors hover:text-[#111827]"
                  style={{ fontFamily: 'Figtree, sans-serif', color: tokens.textSecondary }}
                >
                  Post a Role
                </Link>
                <button
                  onClick={() => openWizard()}
                  className="group flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-lg cursor-pointer"
                  style={{
                    background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                    boxShadow: '0 2px 8px rgba(99,102,241,0.3)',
                    fontFamily: 'Figtree, sans-serif',
                  }}
                >
                  Find Your Agent
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                </button>
              </>
            )}
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg cursor-pointer"
              style={{ color: tokens.textMuted }}
              title={tokens.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {tokens.theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              className="p-2 cursor-pointer"
              style={{ color: tokens.textSecondary }}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="md:hidden border-t px-4 pb-4 pt-2"
          style={{
            background: tokens.bgNavbarMobile,
            borderColor: tokens.borderNavbar,
          }}
        >
          {NAV_LINKS.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 text-sm font-medium rounded-lg transition-colors"
              style={{ fontFamily: 'Figtree, sans-serif', color: tokens.textSecondary }}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-3 pt-3 border-t flex flex-col gap-2" style={{ borderColor: tokens.borderNavbar }}>
            {isAuthenticated ? (
              <>
                <Link to={dashboardPath} onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-sm rounded-xl text-center font-medium"
                  style={{ background: tokens.bgSurface, color: tokens.textPrimary }}
                >
                  Dashboard
                </Link>
                <button onClick={() => { logout(); setMobileOpen(false); }}
                  className="px-4 py-3 text-sm rounded-xl text-center cursor-pointer"
                  style={{ color: tokens.textSecondary }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/talnt/company/login" onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-sm rounded-xl text-center font-medium"
                  style={{ color: tokens.textSecondary }}
                >
                  Log in
                </Link>
                <button
                  onClick={() => { openWizard(); setMobileOpen(false); }}
                  className="px-4 py-3 text-sm text-white rounded-xl text-center font-semibold cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}
                >
                  Find Your Agent
                </button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
