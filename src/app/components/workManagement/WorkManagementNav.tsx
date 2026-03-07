import { Link } from 'react-router-dom';

export function WorkManagementNav({ isDark }: { isDark?: boolean }) {
  return (
    <nav className={`sticky top-0 z-50 backdrop-blur-md border-b ${isDark ? 'bg-[#0a0a0a]/95 border-white/10' : 'bg-white/95 border-gray-100'}`}>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="flex items-center gap-2.5">
            <img
              src="/monday-mark.png"
              alt="monday.com"
              className="h-8 w-8 object-contain"
            />
            <span className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>monday.com</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {['Product', 'Solutions', 'Pricing', 'Resources', 'Company'].map(label => (
              <a
                key={label}
                href={`https://monday.com/${label.toLowerCase()}`}
                className={`text-sm font-medium transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}
              >
                {label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://monday.com/contact-sales"
              className={`text-sm font-medium px-4 py-2 ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}
            >
              Contact Sales
            </a>
            <a
              href="https://auth.monday.com/users/sign_in"
              className={`text-sm font-medium px-5 py-2.5 rounded-[40px] transition-colors ${isDark ? 'text-black bg-white hover:bg-gray-200' : 'text-white bg-black hover:bg-gray-800'}`}
            >
              Login
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
