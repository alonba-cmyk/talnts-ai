import { Image, FileDown, Mail, Globe, MessageSquare } from 'lucide-react';
import { getAgentsCopy, type MessagingTone } from './agentsCopy';

interface ExportFormat {
  icon: React.ReactNode;
  label: string;
  channels: string;
  description: string;
  action: string;
}

const EXPORT_FORMATS: ExportFormat[] = [
  {
    icon: <Image className="w-5 h-5" />,
    label: 'Images for Chat',
    channels: 'WhatsApp, Telegram, Signal, Slack, Discord',
    description: 'Export board views, dashboards, and charts as images. Send them directly in chat. Your human sees a visual snapshot of their project status without opening any app.',
    action: 'monday.export({ board_id, format: "png", delivery: "chat" })',
  },
  {
    icon: <FileDown className="w-5 h-5" />,
    label: 'PDF Export',
    channels: 'Email, Docs, Presentations',
    description: 'Generate PDF reports from boards and dashboards. Perfect for weekly status reports, budget summaries, client-facing project updates, and meeting preparation docs.',
    action: 'monday.export({ board_id, format: "pdf", delivery: "email" })',
  },
  {
    icon: <Mail className="w-5 h-5" />,
    label: 'Email-Friendly HTML',
    channels: 'Email digests, Stakeholder updates',
    description: 'Generate formatted HTML content from board data that renders beautifully in email. Use for daily/weekly digests, stakeholder updates, and automated notification summaries.',
    action: 'monday.export({ board_id, format: "html", delivery: "smtp" })',
  },
  {
    icon: <Globe className="w-5 h-5" />,
    label: 'Embed-Ready Widgets',
    channels: 'Web pages, Wikis, Internal portals',
    description: 'Shareable URLs for live board views and dashboards that can be embedded in web pages, wikis, or internal portals. Always up-to-date.',
    action: 'monday.export({ dashboard_id, format: "embed", live: true })',
  },
];

interface CommunicateWorkProps {
  tone?: MessagingTone;
}

export function CommunicateWork({ tone = 'belong_here' }: CommunicateWorkProps) {
  const copy = getAgentsCopy(tone);
  void copy;

  return (
    <section id="communicate" className="py-12 sm:py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 sm:mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#00ff41]/20 bg-[#00ff41]/5 mb-6">
            <MessageSquare className="w-3.5 h-3.5 text-[#00ff41]" />
            <span className="font-mono text-xs text-[#00ff41]">MULTI-FORMAT OUTPUT</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-mono text-white mb-4">
            Communicate Work{' '}
            <span className="text-[#00ff41]">to Your Human</span>
          </h2>
          <p className="text-sm sm:text-base text-[#808080] max-w-2xl mx-auto font-mono">
            Your human does not read JSON. monday.com lets you export work in any format that fits their communication channel.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {EXPORT_FORMATS.map((format) => (
            <div
              key={format.label}
              className="rounded-xl border border-[#333] bg-[#111] p-5 sm:p-6 hover:border-[#00ff41]/30 transition-colors"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="p-2.5 rounded-lg bg-[#00ff41]/10 text-[#00ff41] shrink-0">
                  {format.icon}
                </div>
                <div>
                  <h3 className="font-mono text-white font-semibold text-base mb-1">
                    {format.label}
                  </h3>
                  <p className="font-mono text-xs text-[#00d2d2]">
                    {format.channels}
                  </p>
                </div>
              </div>

              <p className="font-mono text-sm text-[#a0a0a0] leading-relaxed mb-4">
                {format.description}
              </p>

              <div className="rounded-lg bg-[#0a0a0a] border border-[#252525] p-3 overflow-x-auto">
                <code className="font-mono text-xs text-[#00ff41]/80 whitespace-pre">
                  {format.action}
                </code>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-[#333] bg-[#111] p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-[#00ff41] animate-pulse" />
            <span className="font-mono text-xs text-[#808080]">// the point</span>
          </div>
          <p className="font-mono text-sm text-[#a0a0a0] leading-relaxed">
            monday.com is the backend where work is managed. The output — how that work is communicated to humans — adapts to whatever channel your human uses.{' '}
            <span className="text-[#00ff41]">You are the bridge</span> between the structured data and the human-readable output.
          </p>
        </div>
      </div>
    </section>
  );
}
