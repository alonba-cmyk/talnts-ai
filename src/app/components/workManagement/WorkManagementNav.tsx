import { Link } from 'react-router-dom';
import wmFullLogo from '@/assets/monday-work-management-logo.png';

export function WorkManagementNav() {
  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={wmFullLogo}
              alt="monday.com Work Management"
              className="h-8 w-auto"
            />
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="https://monday.com/product" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              Product
            </a>
            <a href="https://monday.com/solutions" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              Solutions
            </a>
            <a href="https://monday.com/pricing" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              Pricing
            </a>
            <a href="https://monday.com/resources" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              Resources
            </a>
            <a href="https://monday.com/company" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              Company
            </a>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://monday.com/contact-sales"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 px-4 py-2"
            >
              Contact Sales
            </a>
            <a
              href="https://auth.monday.com/users/sign_in"
              className="text-sm font-medium text-white bg-black hover:bg-gray-800 px-5 py-2.5 rounded-[40px] transition-colors"
            >
              Login
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
