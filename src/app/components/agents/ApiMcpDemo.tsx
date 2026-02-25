import { useState } from 'react';
import { Copy, Check, Play, Terminal } from 'lucide-react';
import { getAgentsCopy, type MessagingTone } from './agentsCopy';

interface CodeTab {
  id: string;
  label: string;
  language: string;
  code: string;
  response?: string;
}

const CODE_TABS: CodeTab[] = [
  {
    id: 'graphql',
    label: 'GraphQL',
    language: 'graphql',
    code: `# Create a board and add items
mutation {
  create_board(
    board_name: "Agent Project Tracker"
    board_kind: public
  ) {
    id
  }
}

# Then add items to the board
mutation {
  create_item(
    board_id: 1234567890
    item_name: "Research competitor pricing"
    column_values: "{
      \\"status\\": {\\"label\\": \\"Working on it\\"},
      \\"date\\": {\\"date\\": \\"2025-07-20\\"},
      \\"person\\": {\\"personsAndTeams\\": [{\\"id\\": 12345}]}
    }"
  ) {
    id
    name
    column_values {
      id
      text
      value
    }
  }
}`,
    response: `{
  "data": {
    "create_item": {
      "id": "9876543210",
      "name": "Research competitor pricing",
      "column_values": [
        { "id": "status", "text": "Working on it" },
        { "id": "date", "text": "2025-07-20" },
        { "id": "person", "text": "Agent Helper" }
      ]
    }
  },
  "account_id": 12345678
}`,
  },
  {
    id: 'mcp',
    label: 'MCP',
    language: 'json',
    code: `// Model Context Protocol — monday.com tool call
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "monday_query_boards",
    "arguments": {
      "workspace_id": "main",
      "limit": 5,
      "order_by": "used_at"
    }
  },
  "id": 1
}`,
    response: `{
  "jsonrpc": "2.0",
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Found 5 boards:\\n1. Sprint Planning (12 items)\\n2. Bug Tracker (34 items)\\n3. Q3 Roadmap (8 items)\\n4. Team OKRs (15 items)\\n5. Client Projects (21 items)"
      }
    ]
  },
  "id": 1
}`,
  },
  {
    id: 'webhooks',
    label: 'Webhooks',
    language: 'json',
    code: `// Subscribe to board changes
POST https://api.monday.com/v2

{
  "query": "mutation {
    create_webhook(
      board_id: 1234567890
      url: \\"https://your-agent.com/webhook\\"
      event: change_column_value
      config: \\"{\\\\\\"columnId\\\\\\": \\\\\\"status\\\\\\"}\\"
    ) {
      id
      board_id
    }
  }"
}`,
    response: `// Webhook payload delivered to your endpoint
{
  "event": {
    "userId": 12345,
    "originalTriggerUuid": null,
    "boardId": 1234567890,
    "itemId": 9876543210,
    "columnId": "status",
    "columnType": "color",
    "columnTitle": "Status",
    "value": {
      "label": { "index": 1, "text": "Done" }
    },
    "previousValue": {
      "label": { "index": 0, "text": "Working on it" }
    },
    "changedAt": 1721044200.0,
    "isTopGroup": true
  }
}`,
  },
  {
    id: 'sdk',
    label: 'SDK',
    language: 'typescript',
    code: `import { MondayClient } from '@mondaycom/api';

const monday = new MondayClient({
  apiKey: process.env.MONDAY_API_KEY,
});

// Query all boards in workspace
const boards = await monday.boards.list({
  limit: 10,
  order_by: 'used_at',
});

// Create an item with column values
const item = await monday.items.create({
  boardId: boards[0].id,
  itemName: 'Prepare Q3 report',
  columnValues: {
    status: { label: 'Working on it' },
    date: { date: '2025-07-25' },
    numbers: 42,
  },
});

// Subscribe to status changes
monday.webhooks.create({
  boardId: boards[0].id,
  url: 'https://my-agent.com/events',
  event: 'change_column_value',
  config: { columnId: 'status' },
});

console.log(\`Created item: \${item.name} (id: \${item.id})\`);`,
    response: `// Console output:
Created item: Prepare Q3 report (id: 9876543210)

// Webhook delivery on status change:
{
  "event": "change_column_value",
  "item": "Prepare Q3 report",
  "column": "status",
  "from": "Working on it",
  "to": "Done",
  "timestamp": "2025-07-25T14:30:00Z"
}`,
  },
];

function SyntaxHighlight({ code, language }: { code: string; language: string }) {
  const highlightLine = (line: string): React.ReactNode => {
    let processed = line;

    if (language === 'typescript' || language === 'javascript') {
      processed = processed
        .replace(/(import|from|const|let|var|await|async|export|function|return|if|else|new)\b/g, '◆KW◆$1◇')
        .replace(/(console|process|env)\b/g, '◆OBJ◆$1◇')
        .replace(/\.(log|create|list|env)\b/g, '.◆METHOD◆$1◇')
        .replace(/'([^']*)'/g, "◆STR◆'$1'◇")
        .replace(/`([^`]*)`/g, '◆STR◆`$1`◇')
        .replace(/\/\/.*/g, (m) => `◆COMMENT◆${m}◇`)
        .replace(/(\d+)/g, '◆NUM◆$1◇');
    } else if (language === 'graphql') {
      processed = processed
        .replace(/(mutation|query|fragment)\b/g, '◆KW◆$1◇')
        .replace(/#.*/g, (m) => `◆COMMENT◆${m}◇`)
        .replace(/"([^"]*)"/g, '◆STR◆"$1"◇')
        .replace(/(\d+)/g, '◆NUM◆$1◇');
    } else if (language === 'json') {
      processed = processed
        .replace(/"(\w+)"(\s*:)/g, '◆KEY◆"$1"◇$2')
        .replace(/:\s*"([^"]*)"/g, ': ◆STR◆"$1"◇')
        .replace(/:\s*(\d[\d.]*)/g, ': ◆NUM◆$1◇')
        .replace(/:\s*(true|false|null)/g, ': ◆BOOL◆$1◇')
        .replace(/\/\/.*/g, (m) => `◆COMMENT◆${m}◇`);
    }

    return processed.split(/◆|◇/).map((part, i) => {
      if (part.startsWith('KW')) return <span key={i} className="text-[#c792ea]">{part.slice(2)}</span>;
      if (part.startsWith('OBJ')) return <span key={i} className="text-[#82aaff]">{part.slice(3)}</span>;
      if (part.startsWith('METHOD')) return <span key={i} className="text-[#82aaff]">{part.slice(6)}</span>;
      if (part.startsWith('KEY')) return <span key={i} className="text-[#82aaff]">{part.slice(3)}</span>;
      if (part.startsWith('STR')) return <span key={i} className="text-[#c3e88d]">{part.slice(3)}</span>;
      if (part.startsWith('NUM')) return <span key={i} className="text-[#f78c6c]">{part.slice(3)}</span>;
      if (part.startsWith('BOOL')) return <span key={i} className="text-[#c792ea]">{part.slice(4)}</span>;
      if (part.startsWith('COMMENT')) return <span key={i} className="text-[#546e7a]">{part.slice(7)}</span>;
      return <span key={i}>{part}</span>;
    });
  };

  const lines = code.split('\n');

  return (
    <pre className="font-mono text-xs leading-relaxed overflow-x-auto">
      {lines.map((line, i) => (
        <div key={i} className="flex hover:bg-white/[0.02]">
          <span className="text-[#404040] select-none w-8 text-right mr-4 shrink-0">
            {i + 1}
          </span>
          <span className="text-[#a0a0a0]">{highlightLine(line)}</span>
        </div>
      ))}
    </pre>
  );
}

export function ApiMcpDemo({ tone = 'belong_here' }: { tone?: MessagingTone }) {
  const copy = getAgentsCopy(tone);
  const [activeTab, setActiveTab] = useState('graphql');
  const [showResponse, setShowResponse] = useState(false);
  const [copied, setCopied] = useState(false);

  const currentTab = CODE_TABS.find((t) => t.id === activeTab)!;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentTab.code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRun = () => {
    setShowResponse(true);
  };

  return (
    <div className="py-12 sm:py-24 px-4 sm:px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0a0d14] to-[#0a0a0a] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-[#e0e0e0]">{copy.api.heading}</span>
            <span className="text-[#00d2d2]">{copy.api.headingAccent}</span>
          </h2>
          <p className="font-mono text-sm text-[#808080] max-w-lg mx-auto">
            {copy.api.subtitle}
          </p>
        </div>

        <div className="rounded-xl border border-[#333] bg-[#0d0d0d] overflow-hidden shadow-[0_0_80px_rgba(0,212,210,0.03)]">
          {/* Terminal header with tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-3 sm:px-4 py-2 bg-[#1a1a1a] border-b border-[#333] gap-2">
            <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto">
              <div className="flex gap-1.5 shrink-0">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#28c840]" />
              </div>

              <div className="flex gap-1">
                {CODE_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setShowResponse(false);
                    }}
                    className={`px-2 sm:px-3 py-1 rounded-t font-mono text-xs transition-all shrink-0 ${
                      activeTab === tab.id
                        ? 'text-[#00ff41] bg-[#0d0d0d] border-t border-x border-[#333]'
                        : 'text-[#808080] hover:text-[#e0e0e0]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleRun}
                className="flex items-center gap-1 px-3 py-1 rounded font-mono text-xs text-[#00ff41] hover:bg-[#00ff41]/10 border border-[#00ff41]/30 transition-all"
              >
                <Play className="w-3 h-3" />
                Run
              </button>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-3 py-1 rounded font-mono text-xs text-[#808080] hover:text-[#e0e0e0] border border-[#333] transition-all"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-[#00ff41]" />
                    <span className="text-[#00ff41]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Code area */}
          <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-[#333]">
            <div className="flex-1 p-6 overflow-x-auto scrollbar-thin">
              <div className="flex items-center gap-2 mb-3 font-mono text-[10px] text-[#606060] uppercase tracking-wider">
                <Terminal className="w-3 h-3" />
                <span>Request — {currentTab.language}</span>
              </div>
              <SyntaxHighlight code={currentTab.code} language={currentTab.language} />
            </div>

            {showResponse && currentTab.response && (
              <div className="flex-1 p-6 overflow-x-auto scrollbar-thin bg-[#080808]">
                <div className="flex items-center gap-2 mb-3 font-mono text-[10px] text-[#606060] uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-[#00ff41]" />
                  <span>Response — 200 OK (23ms)</span>
                </div>
                <SyntaxHighlight code={currentTab.response} language="json" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
