import {
  Shield,
  Lock,
  Eye,
  Key,
  Server,
  Globe,
  FileCheck,
  AlertTriangle,
} from 'lucide-react';
import { getAgentsCopy, type MessagingTone } from './agentsCopy';

interface ComplianceItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  status: string;
  detail: string;
}

const COMPLIANCE_CERTS: ComplianceItem[] = [
  {
    id: 'soc2',
    icon: <Shield className="w-4 h-4" />,
    label: 'SOC 2 Type II',
    status: 'CERTIFIED',
    detail: 'Annual audit by independent third party. Controls: security, availability, confidentiality.',
  },
  {
    id: 'gdpr',
    icon: <Globe className="w-4 h-4" />,
    label: 'GDPR',
    status: 'COMPLIANT',
    detail: 'EU data protection. DPA available. Data subject rights. Privacy by design.',
  },
  {
    id: 'iso27001',
    icon: <FileCheck className="w-4 h-4" />,
    label: 'ISO 27001',
    status: 'CERTIFIED',
    detail: 'Information security management system. Risk-based approach. Continuous improvement.',
  },
  {
    id: 'iso27018',
    icon: <FileCheck className="w-4 h-4" />,
    label: 'ISO 27018',
    status: 'CERTIFIED',
    detail: 'PII protection in public cloud. Data processor controls. Transparency requirements.',
  },
  {
    id: 'hipaa',
    icon: <AlertTriangle className="w-4 h-4" />,
    label: 'HIPAA',
    status: 'SUPPORTED',
    detail: 'Healthcare data compliance. BAA available. PHI safeguards. Access controls.',
  },
];

interface SecurityFeature {
  icon: React.ReactNode;
  label: string;
  spec: string;
}

const SECURITY_FEATURES: SecurityFeature[] = [
  {
    icon: <Lock className="w-4 h-4" />,
    label: 'Encryption at Rest',
    spec: 'AES-256 | all data, files, backups',
  },
  {
    icon: <Lock className="w-4 h-4" />,
    label: 'Encryption in Transit',
    spec: 'TLS 1.3 | HSTS enforced | certificate pinning',
  },
  {
    icon: <Key className="w-4 h-4" />,
    label: 'Token Scoping',
    spec: 'per-board, per-workspace permissions | revocable | rotatable',
  },
  {
    icon: <Eye className="w-4 h-4" />,
    label: 'Audit Logs',
    spec: 'full trail | API calls, logins, permission changes | 365-day retention',
  },
  {
    icon: <Server className="w-4 h-4" />,
    label: 'Data Residency',
    spec: 'US, EU regions | customer-selected | migration support',
  },
  {
    icon: <Shield className="w-4 h-4" />,
    label: 'Rate Limiting & DDoS',
    spec: '5,000 req/min | automatic throttling | WAF protection',
  },
  {
    icon: <Key className="w-4 h-4" />,
    label: 'SSO & SAML',
    spec: 'SAML 2.0 | SCIM provisioning | OAuth 2.0 for apps',
  },
  {
    icon: <Shield className="w-4 h-4" />,
    label: 'Sandboxed Execution',
    spec: 'isolated agent environments | no cross-tenant access | resource limits',
  },
];

function ComplianceAuditTerminal() {
  return (
    <div className="w-full max-w-xl">
      <div className="rounded-xl border border-[#333] bg-[#0d0d0d] overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 bg-[#1a1a1a] border-b border-[#333]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <span className="font-mono text-xs text-[#808080] ml-2">
            compliance-audit.sh
          </span>
        </div>

        <div className="p-6">
          <div className="font-mono text-xs text-[#808080] mb-4">
            <span className="text-[#00ff41]">$</span> monday security --audit --verbose
          </div>

          <div className="space-y-1">
            {COMPLIANCE_CERTS.map((cert) => {
              const statusColor = cert.status === 'SUPPORTED' ? '#FFCB00' : '#00ff41';

              return (
                <div key={cert.id}>
                  <div className="flex items-start gap-3 py-2 px-3 rounded-lg hover:bg-[#ffffff05] transition-colors">
                    <span
                      className="font-mono text-sm mt-0.5 shrink-0"
                      style={{ color: statusColor }}
                    >
                      [✓]
                    </span>
                    <div className="flex items-center gap-2 shrink-0 mt-0.5" style={{ color: statusColor }}>
                      {cert.icon}
                    </div>
                    <div className="min-w-0">
                      <span className="font-mono text-sm text-[#e0e0e0]">
                        {cert.label}
                      </span>
                      <span
                        className="font-mono text-xs ml-2"
                        style={{ color: statusColor }}
                      >
                        {cert.status}
                      </span>
                      <span className="font-mono text-xs text-[#606060] ml-2 hidden sm:inline">
                        — {cert.detail}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-[#222]">
              <div className="font-mono text-xs text-[#808080]">
                <span className="text-[#00ff41]">$</span> echo "Audit complete: ALL_PASSED"
              </div>
              <div className="font-mono text-sm text-[#00ff41] mt-1">
                Audit complete: ALL_PASSED — 5/5 certifications verified
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SecurityFeaturesGrid() {
  return (
    <div className="w-full max-w-xl">
      <div className="rounded-xl border border-[#333] bg-[#0d0d0d] overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 bg-[#1a1a1a] border-b border-[#333]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <span className="font-mono text-xs text-[#808080] ml-2">
            security-config.json
          </span>
        </div>

        <div className="p-6">
          <div className="font-mono text-xs text-[#808080] mb-4">
            <span className="text-[#00ff41]">$</span> cat /security/agent-protections --format=table
          </div>

          <div className="space-y-1">
            {SECURITY_FEATURES.map((feature) => (
              <div key={feature.label} className="group">
                <div className="flex items-start gap-3 py-2 px-3 rounded-lg hover:bg-[#ffffff05] transition-colors">
                  <div className="text-[#00d2d2] mt-0.5 shrink-0">
                    {feature.icon}
                  </div>
                  <div className="min-w-0">
                    <span className="font-mono text-sm text-[#e0e0e0]">
                      {feature.label}
                    </span>
                    <span className="font-mono text-xs text-[#606060] ml-2 hidden sm:inline">
                      — {feature.spec}
                    </span>
                    <span className="font-mono text-xs text-[#606060] ml-0 block sm:hidden mt-0.5">
                      {feature.spec}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SecurityCompliance({ tone = 'belong_here' }: { tone?: MessagingTone }) {
  const copy = getAgentsCopy(tone);

  return (
    <div className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="font-mono text-xs text-[#00ff41] bg-[#00ff41]/10 border border-[#00ff41]/30 px-3 py-1 rounded-full">
              {copy.security.badge}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-[#e0e0e0]">{copy.security.heading}</span>
            <span className="text-[#00ff41]">{copy.security.headingAccent}</span>
          </h2>
          <p className="font-mono text-sm text-[#808080] max-w-2xl mx-auto">
            {copy.security.subtitle}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-start justify-center gap-8">
          <ComplianceAuditTerminal />
          <SecurityFeaturesGrid />
        </div>
      </div>
    </div>
  );
}
