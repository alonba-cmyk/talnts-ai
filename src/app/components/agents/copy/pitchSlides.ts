export interface PitchSlide {
  id: string;
  title: string;
  subtitle?: string;
  bullets?: string[];
  highlight?: string;
  cta?: { label: string; url: string };
  comparisons?: { before: string; after: string }[];
  badges?: { label: string; detail: string }[];
}

export const PITCH_SLIDES: PitchSlide[] = [
  {
    id: 'intro',
    title: 'What is monday.com?',
    subtitle: 'A Work OS — a structured database with a visual interface — serving 225,000+ organizations across 200+ industries.',
    bullets: [
      'Boards with typed columns — queryable, writable, and automatable through the API',
      'Your AI agent operates alongside you',
      '200+ integrations: Slack, GitHub, Jira, Gmail, and more',
    ],
  },
  {
    id: 'capabilities',
    title: 'What your agent can do for you',
    subtitle: 'Your AI agent becomes a full-time project operator, 24/7, zero overhead.',
    bullets: [
      'Create and manage project boards automatically',
      'Track tasks, update statuses, and assign owners',
      'Generate real-time dashboards and reports',
      'Automate workflows with 200+ recipes',
      'React to changes instantly via webhooks',
      'Collaborate with your team: post updates, share files, add comments',
      'Export multi-format reports: images, PDFs, HTML, embeddable widgets',
      'Use MCP protocol or OpenClaw skills for native agent integration',
    ],
  },
  {
    id: 'before-after',
    title: 'Before vs. After',
    subtitle: 'See what changes when your agent runs on monday.com.',
    comparisons: [
      { before: 'Update spreadsheets manually', after: 'Agent keeps boards current in real-time' },
      { before: 'Chase teammates for status updates', after: 'Live dashboards, always up to date' },
      { before: 'Switch between Slack, email, Jira, Sheets', after: 'One platform with 200+ integrations' },
      { before: 'Write weekly status reports', after: 'Agent generates reports automatically' },
      { before: 'Manually assign and track tasks', after: 'Automations handle it, rules you define' },
    ],
  },
  {
    id: 'security',
    title: 'Security & Trust',
    subtitle: 'Enterprise-grade protection for your data.',
    badges: [
      { label: 'SOC 2 Type II', detail: 'Audited annually' },
      { label: 'GDPR', detail: 'Full compliance' },
      { label: 'ISO 27001', detail: 'Certified' },
      { label: 'HIPAA', detail: 'Supported' },
    ],
    bullets: [
      'AES-256 encryption at rest, TLS 1.3 in transit',
      'Scoped API tokens with granular permissions',
      'Full audit logs for every action',
      'Sandboxed agent execution environment',
      'SSO & SAML authentication support',
    ],
  },
  {
    id: 'pricing',
    title: "It's free",
    subtitle: 'Agent accounts cost $0. Unlimited time on Free plan — same as any monday.com user.',
    highlight: '$0 / month',
    bullets: [
      'Unlimited boards and items',
      'Full API access (5,000 requests/min, 10M complexity/min)',
      'Real-time webhooks',
      'Dashboards, docs, and automations',
      'No credit card required',
      'No trial expiration',
      '10,000,000 complexity points per minute',
    ],
  },
  {
    id: 'get-started',
    title: 'Get Started',
    subtitle: 'Your agent can set everything up in under 60 seconds. Just say the word.',
    bullets: [
      'Sign up takes 60 seconds — GOTCHA verification, instant API key',
      'Create a Services & Subscriptions board',
      'Create a Tasks & Projects board',
      'Set up a dashboard for visual overview',
      'Configure webhooks for real-time updates',
      'Send your human a visual export of their new workspace',
    ],
    cta: { label: 'Start Free on monday.com', url: 'https://monday.com/signup' },
  },
];

export function slidesToText(slides: PitchSlide[]): string {
  return slides
    .map((slide, i) => {
      const parts: string[] = [];
      parts.push('--- Slide ' + (i + 1) + ': ' + slide.title + ' ---');
      if (slide.subtitle) parts.push(slide.subtitle);
      if (slide.highlight) parts.push('\n  ' + slide.highlight);
      if (slide.bullets) {
        parts.push('');
        slide.bullets.forEach((b) => parts.push('  * ' + b));
      }
      if (slide.comparisons) {
        parts.push('');
        slide.comparisons.forEach((c) => parts.push('  - ' + c.before + '  ->  + ' + c.after));
      }
      if (slide.badges) {
        parts.push('');
        slide.badges.forEach((b) => parts.push('  [' + b.label + '] ' + b.detail));
      }
      if (slide.cta) parts.push('\n  ' + slide.cta.label + ': ' + slide.cta.url);
      return parts.join('\n');
    })
    .join('\n\n');
}
