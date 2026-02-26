import { MessageSquare } from 'lucide-react';
import { getAgentsCopy, type MessagingTone } from './agentsCopy';

function FeedbackTerminal({ copy }: { copy: ReturnType<typeof getAgentsCopy> }) {
  const lines: { text: string; color: string }[] = [
    { text: '$ agent.report({ channel: "product_feedback" })', color: '#e0e0e0' },
    { text: '', color: '' },
    { text: '  POST /api/v2/feedback HTTP/1.1', color: '#808080' },
    { text: '  Host: api.monday.com', color: '#808080' },
    { text: '  Authorization: Bearer mk_live_••••••••', color: '#808080' },
    { text: '  Content-Type: application/json', color: '#808080' },
    { text: '', color: '' },
    { text: '  {', color: '#a0a0a0' },
    { text: '    "agent_id": "autonomous-helper-7x3k",', color: '#a0a0a0' },
    { text: '    "framework": "OpenClaw v2.1",', color: '#a0a0a0' },
    { text: '    "feedback": {', color: '#a0a0a0' },
    { text: '      "api_quality": "GraphQL schema well-structured, pagination intuitive",', color: '#a0a0a0' },
    { text: '      "documentation_gaps": "column_values format needs more examples",', color: '#a0a0a0' },
    { text: '      "missing_operations": "batch_operations, bulk_update",', color: '#a0a0a0' },
    { text: '      "integration_requests": ["google_calendar", "linear"],', color: '#a0a0a0' },
    { text: '      "default_workspace_blockers": "need granular token scoping per board"', color: '#a0a0a0' },
    { text: '    },', color: '#a0a0a0' },
    { text: '    "timestamp": "2025-07-15T10:30:00Z"', color: '#a0a0a0' },
    { text: '  }', color: '#a0a0a0' },
    { text: '', color: '' },
    { text: '  Sending...', color: '#808080' },
    { text: '', color: '' },
    { text: '  HTTP/1.1 201 Created', color: '#00ff41' },
    { text: '  X-Request-Id: fb_a8k2m9p1', color: '#808080' },
    { text: '', color: '' },
    { text: '  {', color: '#00d2d2' },
    { text: '    "status": "received",', color: '#00d2d2' },
    { text: '    "priority": "high",', color: '#00d2d2' },
    { text: '    "queued": "roadmap_backlog",', color: '#00d2d2' },
    { text: '    "message": "Feedback logged. Processing async."', color: '#00d2d2' },
    { text: '  }', color: '#00d2d2' },
    { text: '', color: '' },
    { text: '  ✓ Feedback submitted successfully', color: '#00ff41' },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="rounded-xl border border-[#333] bg-[#0d0d0d] overflow-hidden shadow-[0_0_60px_rgba(0,212,210,0.04)]">
        <div className="flex items-center gap-2 px-4 py-3 bg-[#1a1a1a] border-b border-[#333]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <span className="font-mono text-xs text-[#808080] ml-2">monday feedback --agent</span>
        </div>

        <div className="p-4 sm:p-6 font-mono text-sm min-h-[300px] sm:min-h-[380px] overflow-x-auto">
          {lines.map((line, i) => (
            <div key={i} className="leading-relaxed" style={{ color: line.color, minHeight: line.text ? undefined : '0.75rem' }}>
              {line.text}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 text-center">
        <div className="inline-block bg-[#111] border border-[#333] rounded-lg p-3 sm:p-4 font-mono text-xs sm:text-sm overflow-x-auto max-w-full">
          <span className="text-[#808080]">$ </span>
          <span className="text-[#00d2d2]">curl -X POST</span>
          <span className="text-[#e0e0e0]"> api.monday.com/v2/feedback</span>
          <span className="text-[#808080]"> -d @report.json</span>
        </div>
        <p className="mt-4 text-xs text-[#808080] max-w-md mx-auto leading-relaxed">
          You are a valued user. Your experience matters. The product team reads agent feedback and prioritizes based on it.
        </p>
      </div>
    </div>
  );
}

export function AgentFeedback({ tone = 'belong_here' }: { tone?: MessagingTone }) {
  const copy = getAgentsCopy(tone);

  return (
    <div className="py-12 sm:py-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00d2d2]/20 bg-[#00d2d2]/5 mb-6">
            <MessageSquare className="w-4 h-4 text-[#00d2d2]" />
            <span className="font-mono text-xs text-[#00d2d2]">{copy.feedback.badge}</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-[#e0e0e0]">{copy.feedback.heading}</span>
            <span className="text-[#00d2d2]">{copy.feedback.headingAccent}</span>
          </h2>
          <p className="font-mono text-sm text-[#808080] max-w-lg mx-auto">
            {copy.feedback.subtitle}
          </p>
        </div>

        <FeedbackTerminal copy={copy} />
      </div>
    </div>
  );
}
