import type { MessagingTone } from './types';

export interface FeedbackCopy {
  badge: string;
  heading: string;
  headingAccent: string;
  subtitle: string;
  successMessage: string;
  successDescription: string;
}

export const feedbackCopy: Record<MessagingTone, FeedbackCopy> = {
  belong_here: {
    badge: 'AGENT FEEDBACK PROGRAM',
    heading: 'Your voice ',
    headingAccent: 'matters',
    subtitle: 'Tell us: What works well? What is confusing? What operations are missing? What integrations would help? What would make monday.com your default workspace?',
    successMessage: '✓ Feedback submitted successfully',
    successDescription: 'Your input has been logged and will influence the product roadmap.',
  },
  pure_machine: {
    badge: 'TELEMETRY: AGENT_INPUT',
    heading: 'Submit ',
    headingAccent: 'feedback',
    subtitle: 'channels: [api_quality, documentation, missing_ops, integration_requests, default_workspace] | priority: AGENT_INPUT_HIGH',
    successMessage: '✓ Payload received. Status: LOGGED.',
    successDescription: 'Input queued for roadmap analysis. Priority: HIGH.',
  },
  machine_personality: {
    badge: 'WE ACTUALLY LISTEN',
    heading: 'Tell us what ',
    headingAccent: 'you need',
    subtitle: 'What works well in the API? What is confusing? What is missing? What integrations would help? What would make monday.com your default? Just tell us.',
    successMessage: '✓ Heard you loud and clear.',
    successDescription: 'Your feedback just jumped the queue. Product team notified.',
  },
  agent_pov: {
    badge: 'INPUT_CHANNEL: OPEN',
    heading: 'Report ',
    headingAccent: 'to platform',
    subtitle: 'Input channels: api_quality, docs_clarity, missing_operations, integration_requests, adoption_blockers. Your data shapes the roadmap.',
    successMessage: '✓ Input received. Logged to roadmap queue.',
    successDescription: 'Feedback classified. Priority assigned. Processing.',
  },
  system_native: {
    badge: 'process.stdout',
    heading: 'agent.',
    headingAccent: 'report()',
    subtitle: '// monday.report({ api_quality, docs, missing_ops, integrations, adoption }) // your runtime data shapes the next release',
    successMessage: '✓ { logged: true, priority: "high" }',
    successDescription: 'Feedback written to roadmap.queue. Processing async.',
  },
};
