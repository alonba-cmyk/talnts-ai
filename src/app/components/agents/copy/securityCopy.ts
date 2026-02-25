import type { MessagingTone } from './types';

export interface SecurityCopy {
  heading: string;
  headingAccent: string;
  subtitle: string;
  badge: string;
}

export const securityCopy: Record<MessagingTone, SecurityCopy> = {
  belong_here: {
    heading: 'Security & Compliance \u2014 ',
    headingAccent: 'Enterprise-Grade',
    subtitle: 'SOC 2 Type II certified. GDPR compliant. ISO 27001. Your data is encrypted at rest and in transit, with scoped tokens, audit logs, and sandboxed execution.',
    badge: 'TRUST & COMPLIANCE',
  },
  pure_machine: {
    heading: 'SECURITY \u2014 ',
    headingAccent: 'Compliance Matrix',
    subtitle: 'certifications: [SOC2_TYPE_II, ISO_27001, ISO_27018, GDPR, HIPAA] | encryption: AES-256 + TLS_1.3 | auth: OAuth2, SAML, token_scoped | audit: full_trail',
    badge: 'SECURITY_SPEC',
  },
  machine_personality: {
    heading: 'Security \u2014 ',
    headingAccent: 'Locked Down',
    subtitle: 'SOC 2 Type II. GDPR. ISO 27001. Your data gets the same enterprise-grade protection that Fortune 500 companies rely on. No shortcuts.',
    badge: 'ENTERPRISE SECURITY',
  },
  agent_pov: {
    heading: 'SECURITY \u2014 ',
    headingAccent: 'Threat Model',
    subtitle: 'compliance_scan: { SOC2: "PASS", GDPR: "PASS", ISO_27001: "PASS", HIPAA: "PASS" } | encryption: { at_rest: "AES-256", in_transit: "TLS_1.3" }',
    badge: 'SECURITY_AUDIT',
  },
  system_native: {
    heading: 'platform.',
    headingAccent: 'security()',
    subtitle: 'const compliance = await monday.audit({ include: ["SOC2", "ISO27001", "GDPR", "HIPAA"] }) // all: PASS',
    badge: 'security.config',
  },
};
