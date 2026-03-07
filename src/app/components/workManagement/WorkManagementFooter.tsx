import { Link } from 'react-router-dom';

const FOOTER_LINKS = {
  product: [
    { label: 'Pricing', href: 'https://monday.com/pricing' },
    { label: 'Contact us', href: 'https://monday.com/contact' },
    { label: 'Templates', href: 'https://monday.com/templates' },
    { label: 'SMB', href: 'https://monday.com/smb' },
    { label: 'Enterprise', href: 'https://monday.com/enterprise' },
    { label: 'Nonprofits', href: 'https://monday.com/nonprofits' },
    { label: 'App marketplace', href: 'https://monday.com/apps' },
    { label: '24/7 support', href: 'https://support.monday.com' },
  ],
  features: [
    { label: 'Docs', href: 'https://support.monday.com' },
    { label: 'Integrations', href: 'https://monday.com/integrations' },
    { label: 'Automations', href: 'https://monday.com/automations' },
    { label: 'Files', href: 'https://monday.com/features/files' },
    { label: 'Dashboards', href: 'https://monday.com/features/dashboards' },
    { label: 'Kanban', href: 'https://monday.com/kanban' },
    { label: 'Gantt', href: 'https://monday.com/gantt' },
  ],
  company: [
    { label: 'About us', href: 'https://monday.com/about' },
    { label: "Careers - We're hiring!", href: 'https://monday.com/careers' },
    { label: 'monday-U', href: 'https://monday.com/monday-u' },
    { label: 'Press', href: 'https://monday.com/press' },
    { label: 'Customer stories', href: 'https://monday.com/customers' },
    { label: 'Become a partner', href: 'https://monday.com/partners' },
  ],
  resources: [
    { label: 'Help Center', href: 'https://support.monday.com' },
    { label: 'Community', href: 'https://community.monday.com' },
    { label: 'Blog', href: 'https://monday.com/blog' },
    { label: "What's new", href: 'https://monday.com/whats-new' },
  ],
};

export function WorkManagementFooter() {
  return (
    <footer className="bg-white dark:bg-[#0a0a0a] border-t border-gray-100 dark:border-white/10">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          <div>
            <Link
              to="/"
              className="text-2xl font-bold text-black dark:text-white block mb-6"
            >
              monday.com
            </Link>
            <nav className="flex flex-col gap-4">
              {FOOTER_LINKS.product.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-black transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-6">
              Features
            </h4>
            <nav className="flex flex-col gap-4">
              {FOOTER_LINKS.features.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-black transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-6">
              Company
            </h4>
            <nav className="flex flex-col gap-4">
              {FOOTER_LINKS.company.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-black transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-6">
              Resources
            </h4>
            <nav className="flex flex-col gap-4">
              {FOOTER_LINKS.resources.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-black transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
        <div className="pt-8 border-t border-gray-100 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm text-gray-500 dark:text-gray-400">
            <a href="https://monday.com/security" className="hover:text-black dark:hover:text-white">
              Security
            </a>
            <span>|</span>
            <a href="https://monday.com/terms" className="hover:text-black dark:hover:text-white">
              Terms and privacy
            </a>
            <span>|</span>
            <a href="https://monday.com/privacy" className="hover:text-black dark:hover:text-white">
              Privacy policy
            </a>
            <span>|</span>
            <a href="https://monday.com/cookies" className="hover:text-black dark:hover:text-white">
              Cookie settings
            </a>
            <span>|</span>
            <a href="https://status.monday.com" className="hover:text-black dark:hover:text-white">
              Status
            </a>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            All Rights Reserved © monday.com
          </p>
        </div>
      </div>
    </footer>
  );
}
