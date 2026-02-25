import { Database, Workflow, Zap, Globe, Cpu, FileOutput } from 'lucide-react';
import { getAgentsCopy, type MessagingTone } from './agentsCopy';

interface CapabilityCard {
  icon: React.ReactNode;
  title: string;
  description: string;
  code: string;
  language: string;
}

const CAPABILITIES: CapabilityCard[] = [
  {
    icon: <Database className="w-5 h-5" />,
    title: 'Structured Data Model',
    description: 'type: relational_db | operations: query, filter, sort, group, aggregate | schema: typed_columns',
    language: 'json',
    code: `{
  "board": {
    "name": "Q3 Marketing Plan",
    "columns": [
      { "id": "status", "type": "status" },
      { "id": "person", "type": "people" },
      { "id": "date", "type": "date" },
      { "id": "budget", "type": "numbers" },
      { "id": "priority", "type": "dropdown" }
    ],
    "items_count": 247
  }
}`,
  },
  {
    icon: <Workflow className="w-5 h-5" />,
    title: 'GraphQL API',
    description: 'scope: boards, items, columns, updates, files, workspaces | access: full_crud | rate: 5000/min',
    language: 'graphql',
    code: `mutation {
  create_item (
    board_id: 1234567890
    group_id: "new_group"
    item_name: "Launch Campaign"
    column_values: "{
      \\"status\\": \\"Working on it\\",
      \\"date\\": \\"2025-07-15\\",
      \\"numbers\\": 15000
    }"
  ) {
    id
    name
    state
  }
}`,
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: 'Real-time Webhooks',
    description: 'protocol: HTTP POST | events: column_change, item_create, status_update | latency: <100ms',
    language: 'json',
    code: `{
  "event": {
    "type": "update_column_value",
    "triggerTime": "2025-07-15T10:30:00Z",
    "boardId": 1234567890,
    "itemId": 9876543210,
    "columnId": "status",
    "value": {
      "label": {
        "index": 1,
        "text": "Done"
      }
    }
  }
}`,
  },
  {
    icon: <Cpu className="w-5 h-5" />,
    title: 'MCP Support',
    description: 'protocol: Model Context Protocol v1.0 | tools: 15+ | transport: stdio, SSE | spec: tools/call',
    language: 'json',
    code: `{
  "tool": "monday_create_board",
  "input": {
    "board_name": "Sprint Planning",
    "board_kind": "public",
    "columns": [
      { "title": "Status", "type": "status" },
      { "title": "Owner", "type": "people" },
      { "title": "Points", "type": "numbers" }
    ]
  },
  "result": {
    "board_id": "8901234567",
    "url": "https://workspace.monday.com/..."
  }
}`,
  },
  {
    icon: <Globe className="w-5 h-5" />,
    title: 'Automations Engine',
    description: 'recipes: 200+ | triggers: status, date, column, webhook | actions: notify, create, move, api_call',
    language: 'yaml',
    code: `automation:
  trigger:
    type: status_change
    column: "status"
    to: "Done"
  actions:
    - notify:
        channel: "#project-updates"
        message: "Task completed: {item.name}"
    - create_item:
        board: "Completed Archive"
        values:
          name: "{item.name}"
          completed_date: "{now}"`,
  },
  {
    icon: <FileOutput className="w-5 h-5" />,
    title: 'Multi-format Output',
    description: 'export: pdf, png, html, csv | embed: iframe, widget | delivery: api, webhook, email',
    language: 'bash',
    code: `# Export board as PDF
$ curl -X POST https://api.monday.com/v2 \\
  -H "Authorization: mk_live_xxxxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "query": "{ boards(ids: 123) {
      views { id name type }
      exports { pdf { url } }
    }}"
  }'

# Response: { "url": "https://..." }`,
  },
];

function CodeBlock({ code, language }: { code: string; language: string }) {
  const colorize = (line: string): React.ReactNode => {
    if (language === 'graphql') {
      return line
        .replace(/(mutation|query|fragment|subscription)\b/g, '◆KEYWORD◆$1◇')
        .replace(/(\w+)(\s*\()/g, '◆FUNC◆$1◇$2')
        .replace(/"([^"]*)"/g, '◆STRING◆"$1"◇')
        .split(/◆|◇/)
        .map((part, i) => {
          if (part.startsWith('KEYWORD')) return <span key={i} className="text-[#c792ea]">{part.slice(7)}</span>;
          if (part.startsWith('FUNC')) return <span key={i} className="text-[#82aaff]">{part.slice(4)}</span>;
          if (part.startsWith('STRING')) return <span key={i} className="text-[#c3e88d]">{part.slice(6)}</span>;
          return <span key={i}>{part}</span>;
        });
    }

    if (language === 'json') {
      return line
        .replace(/"(\w+)"(\s*:)/g, '◆KEY◆"$1"◇$2')
        .replace(/:\s*"([^"]*)"/g, ': ◆VAL◆"$1"◇')
        .replace(/:\s*(\d+)/g, ': ◆NUM◆$1◇')
        .replace(/:\s*(true|false|null)/g, ': ◆BOOL◆$1◇')
        .split(/◆|◇/)
        .map((part, i) => {
          if (part.startsWith('KEY')) return <span key={i} className="text-[#82aaff]">{part.slice(3)}</span>;
          if (part.startsWith('VAL')) return <span key={i} className="text-[#c3e88d]">{part.slice(3)}</span>;
          if (part.startsWith('NUM')) return <span key={i} className="text-[#f78c6c]">{part.slice(3)}</span>;
          if (part.startsWith('BOOL')) return <span key={i} className="text-[#c792ea]">{part.slice(4)}</span>;
          return <span key={i}>{part}</span>;
        });
    }

    if (language === 'yaml') {
      return line
        .replace(/^(\s*[\w_]+):/g, '◆KEY◆$1◇:')
        .replace(/"([^"]*)"/g, '◆STR◆"$1"◇')
        .replace(/#.*/g, (m) => `◆COMMENT◆${m}◇`)
        .replace(/\{[^}]+\}/g, (m) => `◆TEMPLATE◆${m}◇`)
        .split(/◆|◇/)
        .map((part, i) => {
          if (part.startsWith('KEY')) return <span key={i} className="text-[#82aaff]">{part.slice(3)}</span>;
          if (part.startsWith('STR')) return <span key={i} className="text-[#c3e88d]">{part.slice(3)}</span>;
          if (part.startsWith('COMMENT')) return <span key={i} className="text-[#546e7a]">{part.slice(7)}</span>;
          if (part.startsWith('TEMPLATE')) return <span key={i} className="text-[#f78c6c]">{part.slice(8)}</span>;
          return <span key={i}>{part}</span>;
        });
    }

    if (language === 'bash') {
      return line
        .replace(/#.*/g, (m) => `◆COMMENT◆${m}◇`)
        .replace(/\$\s/g, '◆PROMPT◆$ ◇')
        .replace(/(curl|POST|GET)\b/g, '◆CMD◆$1◇')
        .replace(/"([^"]*)"/g, '◆STR◆"$1"◇')
        .replace(/(https?:\/\/[^\s"]+)/g, '◆URL◆$1◇')
        .split(/◆|◇/)
        .map((part, i) => {
          if (part.startsWith('COMMENT')) return <span key={i} className="text-[#546e7a]">{part.slice(7)}</span>;
          if (part.startsWith('PROMPT')) return <span key={i} className="text-[#00ff41]">{part.slice(6)}</span>;
          if (part.startsWith('CMD')) return <span key={i} className="text-[#c792ea]">{part.slice(3)}</span>;
          if (part.startsWith('STR')) return <span key={i} className="text-[#c3e88d]">{part.slice(3)}</span>;
          if (part.startsWith('URL')) return <span key={i} className="text-[#82aaff]">{part.slice(3)}</span>;
          return <span key={i}>{part}</span>;
        });
    }

    return <span>{line}</span>;
  };

  const lines = code.split('\n');

  return (
    <div className="bg-[#0a0a0a] rounded p-4 border border-[#222] overflow-x-auto scrollbar-thin">
      <div className="flex items-center gap-2 mb-3">
        <span className="font-mono text-[10px] text-[#808080] uppercase tracking-wider">{language}</span>
      </div>
      <pre className="font-mono text-xs leading-relaxed">
        {lines.map((line, i) => (
          <div key={i} className="flex">
            <span className="text-[#404040] select-none w-6 text-right mr-3 shrink-0">{i + 1}</span>
            <span className="text-[#a0a0a0]">{colorize(line)}</span>
          </div>
        ))}
      </pre>
    </div>
  );
}

export function WhyMondayForAgents({ tone = 'belong_here' }: { tone?: MessagingTone }) {
  const copy = getAgentsCopy(tone);
  return (
    <div className="py-12 sm:py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 sm:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-[#e0e0e0]">{copy.why.headingPrefix}</span>
            <span className="text-[#00d2d2]">{copy.why.headingBrand}</span>
            <span className="text-[#e0e0e0]">{copy.why.headingSuffix}</span>
          </h2>
          <p className="font-mono text-sm text-[#808080] max-w-lg mx-auto">
            {copy.why.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {CAPABILITIES.map((cap) => (
            <div
              key={cap.title}
              className="rounded-xl border border-[#222] bg-[#111] p-6 hover:border-[#00ff41]/30 transition-all duration-500 group hover:shadow-[0_0_40px_rgba(0,255,65,0.05)]"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 rounded-lg bg-[#00ff41]/10 text-[#00ff41] group-hover:bg-[#00ff41]/20 transition-colors">
                  {cap.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-[#e0e0e0] mb-1">{cap.title}</h3>
                  <p className="font-mono text-xs text-[#808080]">{cap.description}</p>
                </div>
              </div>
              <CodeBlock code={cap.code} language={cap.language} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
