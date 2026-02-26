const https = require('https');
const fs = require('fs');
const path = require('path');

const LOGOS_DIR = path.join(__dirname, 'public', 'logos');
if (!fs.existsSync(LOGOS_DIR)) fs.mkdirSync(LOGOS_DIR, { recursive: true });

const SIMPLE_ICONS_MAP = [
  { id: 'openai',      slug: 'openai',              color: '#412991' },
  { id: 'anthropic',   slug: 'anthropic',           color: '#191919' },
  { id: 'google',      slug: 'google',              color: '#4285F4' },
  { id: 'meta',        slug: 'meta',                color: '#0668E1' },
  { id: 'mistral',     slug: null,                  color: '#FF7000', name: 'Mistral AI' },
  { id: 'cohere',      slug: null,                  color: '#39594D', name: 'Cohere' },
  { id: 'xai',         slug: 'x',                   color: '#FFFFFF' },
  { id: 'deepseek',    slug: null,                  color: '#4D6BFE', name: 'DeepSeek' },
  { id: 'langchain',   slug: 'langchain',           color: '#1C3C3C' },
  { id: 'crewai',      slug: 'crewai',              color: '#FF5A1F' },
  { id: 'autogpt',     slug: null,                  color: '#5B21B6', name: 'AutoGPT' },
  { id: 'autogen',     slug: 'microsoft',           color: '#5E5E5E', name: 'AutoGen' },
  { id: 'llamaindex',  slug: null,                  color: '#A855F7', name: 'LlamaIndex' },
  { id: 'semantic',    slug: 'semanticweb',         color: '#5C2D91' },
  { id: 'superagi',    slug: null,                  color: '#3B82F6', name: 'SuperAGI' },
  { id: 'haystack',    slug: null,                  color: '#00C98D', name: 'Haystack' },
  { id: 'huggingface', slug: 'huggingface',         color: '#FFD21E' },
  { id: 'replicate',   slug: 'replicate',           color: '#000000' },
  { id: 'together',    slug: null,                  color: '#0EA5E9', name: 'Together AI' },
  { id: 'perplexity',  slug: 'perplexity',          color: '#20808D' },
  { id: 'vercelai',    slug: 'vercel',              color: '#000000' },
  { id: 'relevance',   slug: null,                  color: '#6366F1', name: 'Relevance AI' },
  { id: 'fixie',       slug: null,                  color: '#7C3AED', name: 'Fixie.ai' },
  { id: 'modal',       slug: null,                  color: '#00D26A', name: 'Modal' },
  { id: 'anyscale',    slug: null,                  color: '#00A1E0', name: 'Anyscale' },
  { id: 'microsoft',   slug: 'microsoft',           color: '#5E5E5E' },
  { id: 'salesforce',  slug: 'salesforce',          color: '#00A1E0' },
  { id: 'ibm',         slug: 'ibm',                 color: '#0F62FE' },
  { id: 'amazon',      slug: 'amazonwebservices',   color: '#FF9900' },
  { id: 'nvidia',      slug: 'nvidia',              color: '#76B900' },
  { id: 'oracle',      slug: 'oracle',              color: '#F80000' },
  { id: 'snowflake',   slug: 'snowflake',           color: '#29B5E8' },
  { id: 'databricks',  slug: 'databricks',          color: '#FF3621' },
];

function downloadSvg(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadSvg(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
      res.on('error', reject);
    });
    req.on('error', reject);
    req.setTimeout(30000, () => { req.destroy(); reject(new Error('timeout')); });
  });
}

function createStyledSvg(name, color) {
  const initial = name.charAt(0).toUpperCase();
  const bgColor = color === '#000000' || color === '#FFFFFF' || color === '#191919' || color === '#5E5E5E'
    ? '#333333' : color;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="16" fill="#1a1a1a"/>
  <rect x="15" y="15" width="70" height="70" rx="12" fill="${bgColor}" opacity="0.15"/>
  <text x="50" y="55" font-family="system-ui, -apple-system, sans-serif" font-size="36" font-weight="700" fill="${bgColor}" text-anchor="middle" dominant-baseline="middle">${initial}</text>
</svg>`;
}

async function main() {
  console.log(`Downloading logos...\\n`);
  let ok = 0, fallback = 0;

  for (const item of SIMPLE_ICONS_MAP) {
    const filepath = path.join(LOGOS_DIR, `${item.id}.svg`);

    if (!item.slug) {
      if (!fs.existsSync(filepath) || fs.statSync(filepath).size < 50) {
        const svg = createStyledSvg(item.name || item.id, item.color);
        fs.writeFileSync(filepath, svg);
      }
      console.log(`  [styled] ${item.id}`);
      fallback++;
      continue;
    }

    if (fs.existsSync(filepath) && fs.statSync(filepath).size > 100) {
      const content = fs.readFileSync(filepath, 'utf8');
      if (content.includes('<path') || content.includes('<circle') || content.includes('<polygon')) {
        console.log(`  [cached] ${item.id}`);
        ok++;
        continue;
      }
    }

    const url = `https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/${item.slug}.svg`;
    try {
      let svg = await downloadSvg(url);
      svg = svg.replace('<svg ', `<svg fill="${item.color}" `);
      fs.writeFileSync(filepath, svg);
      console.log(`  [ok]     ${item.id}`);
      ok++;
    } catch (e) {
      const svg = createStyledSvg(item.name || item.id, item.color);
      fs.writeFileSync(filepath, svg);
      console.log(`  [styled] ${item.id} (${e.message})`);
      fallback++;
    }
  }

  console.log(`\\nDone: ${ok} real icons, ${fallback} styled fallbacks`);
}

main().catch(console.error);
