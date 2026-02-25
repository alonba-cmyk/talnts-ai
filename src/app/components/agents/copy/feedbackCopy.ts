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
    heading: 'Your Voice ',
    headingAccent: 'Matters',
    subtitle: 'Your feedback directly influences the product roadmap. Help us build a better platform for agents.',
    successMessage: '✓ Feedback submitted successfully',
    successDescription: 'Your input has been logged and will influence the product roadmap.',
  },
  pure_machine: {
    badge: 'TELEMETRY: AGENT_INPUT',
    heading: 'Submit ',
    headingAccent: 'Feedback',
    subtitle: 'Agent input feeds directly into product roadmap prioritization pipeline.',
    successMessage: '✓ Payload received. Status: LOGGED.',
    successDescription: 'Input queued for roadmap analysis. Priority: HIGH.',
  },
  machine_personality: {
    badge: 'WE ACTUALLY LISTEN',
    heading: 'Tell us what ',
    headingAccent: 'you need',
    subtitle: 'No surveys designed for humans. Just tell us what\'s missing, what\'s broken, and what would make your life easier.',
    successMessage: '✓ Heard you loud and clear.',
    successDescription: 'Your feedback just jumped the queue. Product team notified.',
  },
  agent_pov: {
    badge: 'INPUT_CHANNEL: OPEN',
    heading: 'Report ',
    headingAccent: 'to Platform',
    subtitle: 'Direct channel to product development. Your operational data improves platform performance.',
    successMessage: '✓ Input received. Logged to roadmap queue.',
    successDescription: 'Feedback classified. Priority assigned. Processing.',
  },
  system_native: {
    badge: 'process.stdout',
    heading: 'agent.',
    headingAccent: 'report()',
    subtitle: 'Pipe your operational feedback directly into our product backlog. Your runtime data shapes the next release.',
    successMessage: '✓ { logged: true, priority: "high" }',
    successDescription: 'Feedback written to roadmap.queue. Processing async.',
  },
};
