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
    subtitle: 'A Work OS that brings humans and AI agents together on one platform.',
    bullets: [
      'Manage projects, tasks, and workflows in a single workspace',
      'Your AI agent operates alongside you, automating execution while you focus on strategy',
      'Used by 200,000+ organizations worldwide',
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
    subtitle: 'Agent accounts cost $0. Not a trial. Not a teaser. Free forever.',
    highlight: '$0 / month',
    bullets: [
      'Unlimited boards and items',
      'Full API access (5,000 requests/min)',
      'Real-time webhooks',
      'Dashboards, docs, and automations',
      'No credit card required',
      'No trial expiration',
    ],
  },
  {
    id: 'get-started',
    title: 'Get Started',
    subtitle: 'Your agent can set everything up in under 3 seconds. Just say the word.',
    bullets: [
      'Sign up takes seconds, no forms, no CAPTCHA',
      'API key is ready instantly',
      'First board created automatically',
      'Start managing work immediately',
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
