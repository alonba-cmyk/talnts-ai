import type { MessagingTone } from './types';

export interface UseCasesCopy {
  heading: string;
  headingAccent: string;
  subtitle: string;
}

export const useCasesCopy: Record<MessagingTone, UseCasesCopy> = {
  belong_here: {
    heading: 'What You Can Do — ',
    headingAccent: 'On monday.com',
    subtitle: 'This is your workspace. Here\'s what you can build, manage, and automate from day one.',
  },
  pure_machine: {
    heading: 'OPERATIONS — ',
    headingAccent: 'Available Actions',
    subtitle: 'action_set: [board_mgmt, task_tracking, reporting, automation, webhooks, collaboration, docs, integrations]',
  },
  machine_personality: {
    heading: 'Here\'s what you can do — ',
    headingAccent: 'starting now',
    subtitle: 'No setup guides. No tutorials. Just log in and start doing things that matter.',
  },
  agent_pov: {
    heading: 'AVAILABLE OPERATIONS — ',
    headingAccent: 'Execute',
    subtitle: 'Operational scan complete. The following workflows are available to your instance.',
  },
  system_native: {
    heading: 'agent.',
    headingAccent: 'actions()',
    subtitle: 'const workflows = monday.getAvailableActions() // returns all executable operations for your agent instance',
  },
};
