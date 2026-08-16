import http from 'node:http';

const originalEmit = http.Server.prototype.emit;
const json = (res, status, body) => {
  if (res.headersSent) return;
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
  });
  res.end(JSON.stringify(body));
};

const readBody = req => new Promise((resolve, reject) => {
  let raw = '';
  req.setEncoding('utf8');
  req.on('data', chunk => {
    raw += chunk;
    if (raw.length > 2_500_000) {
      reject(new Error('Request too large'));
      req.destroy();
    }
  });
  req.on('end', () => {
    try { resolve(raw ? JSON.parse(raw) : {}); }
    catch { reject(new Error('Invalid JSON')); }
  });
  req.on('error', reject);
});

const modeRules = {
  presentation: 'Return a complete presentation plan. Each section is one slide. Vary the content logic across slides: opening, evidence, comparison, timeline, stats, quote, implications, conclusion when appropriate. Never invent statistics or citations.',
  webpage: 'Return a complete responsive webpage content architecture: hero, value proposition, sections, proof, useful information, CTA and FAQ when appropriate. Write conversion-quality copy without generic filler.',
  document: 'Return a complete professional document structure with substantive section prose, evidence-aware claims, logical transitions, conclusions and references when research is used.',
  social: 'Return a complete social content set/carousel with strong hooks, useful body copy, caption, CTA and platform-appropriate hashtags. Avoid engagement bait and generic filler.',
  graphic: 'Return a complete visual-content system for a poster/infographic/graphic: headline, concise supporting copy, information blocks, hierarchy, CTA and visual-direction notes.',
};

const schema = {
  type: 'object',
  additionalProperties: false,
  required: ['title','subtitle','summary','sections','cta','caption','hashtags','sources'],
  properties: {
    title: { type: 'string' },
    subtitle: { type: 'string' },
    summary: { type: 'string' },
    sections: {
      type: 'array',
      items: {
        type: 'object', additionalProperties: false,
        required: ['title','body','bullets','stat','label','layoutHint'],
        properties: {
          title: { type: 'string' },
          body: { type: 'string' },
          bullets: { type: 'array', items: { type: 'string' } },
          stat: { type: 'string' },
          label: { type: 'string' },
          layoutHint: { type: 'string', enum: ['hero','split','cards','timeline','compare','stats','quote','statement','grid','closing','section'] },
        }
      }
    },
    cta: { type: 'string' },
    caption: { type: 'string' },
    hashtags: { type: 'array', items: { type: 'string' } },
    sources: {
      type: 'array',
      items: {
        type: 'object', additionalProperties: false,
        required: ['title','url'],
        properties: { title: { type: 'string' }, url: { type: 'string' } }
      }
    }
  }
};

function extractText(data) {
  if (typeof data?.output_text === 'string') return data.output_text;
  for (const item of data?.output || []) {
    for (const part of item?.content || []) {
      if (part?.type === 'output_text' && typeof part.text === 'string') return part.text;
    }
  }
  return '';
}

async function generate(payload) {
  const key = String(process.env.OPENAI_API_KEY || '').trim();
  if (!key) {
    const err = new Error('OPENAI_API_KEY is not configured on the server');
    err.code = 'AI_ENGINE_NOT_CONFIGURED';
    throw err;
  }

  const mode = String(payload.mode || '').toLowerCase();
  if (!modeRules[mode]) throw new Error('Unsupported Studio mode');
  const model = String(process.env.OPENAI_STUDIO_MODEL || 'gpt-5.6').trim();
  const requested = Math.max(1, Math.min(mode === 'presentation' ? 100 : 40, Number(payload.count || payload.settings?.count || 10) || 10));
  const level = payload.level || 'student';
  const outline = Array.isArray(payload.outline) ? payload.outline.slice(0, 100) : [];
  const references = Array.isArray(payload.references) ? payload.references.slice(0, 20) : [];
  const userInput = {
    request: payload.prompt || '',
    mode,
    desiredItems: requested,
    learningOrWorkLevel: level,
    outputLanguage: payload.language || payload.settings?.language || 'auto',
    audience: payload.audience || payload.settings?.audience || '',
    style: payload.style || payload.settings?.style || 'modern',
    purpose: payload.purpose || payload.settings?.purpose || '',
    outline,
    references,
  };

  const instructions = `You are SCHOLARK Studio AI, an elite research, writing, information-design and visual-communication engine. Produce the strongest useful first draft possible, not filler. Follow the user's exact request. Adapt complexity to the selected learner/work level without becoming childish unless the level requires it. Research factual claims when needed, prefer primary/reliable sources, never fabricate facts, URLs, quotes or statistics, and make uncertainty explicit. Think deeply about narrative, hierarchy, audience, clarity, persuasion, evidence and visual structure before writing. ${modeRules[mode]} Return exactly ${requested} sections when the mode naturally uses a count, unless doing so would materially harm quality. The JSON is consumed by an editor, so every field must be polished, specific and immediately usable.`;

  const request = {
    model,
    store: false,
    reasoning: { effort: 'xhigh' },
    text: {
      verbosity: 'high',
      format: { type: 'json_schema', name: 'scholark_studio_artifact', strict: true, schema },
    },
    tools: payload.research === false ? [] : [{ type: 'web_search' }],
    input: [
      { role: 'developer', content: [{ type: 'input_text', text: instructions }] },
      { role: 'user', content: [{ type: 'input_text', text: JSON.stringify(userInput) }] },
    ],
  };

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${key}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(request),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const err = new Error(data?.error?.message || `AI engine returned HTTP ${response.status}`);
    err.code = data?.error?.code || 'AI_ENGINE_ERROR';
    throw err;
  }
  const text = extractText(data);
  if (!text) throw new Error('AI engine returned no usable output');
  let artifact;
  try { artifact = JSON.parse(text); }
  catch { throw new Error('AI engine returned invalid structured output'); }
  return { ok: true, provider: 'openai', model, quality: 'highest', artifact };
}

async function handle(req, res) {
  const url = new URL(req.url || '/', 'http://localhost');
  if (url.pathname === '/api/studio/health' && req.method === 'GET') {
    return json(res, 200, {
      ok: true,
      configured: Boolean(String(process.env.OPENAI_API_KEY || '').trim()),
      model: String(process.env.OPENAI_STUDIO_MODEL || 'gpt-5.6'),
      quality: 'highest',
    });
  }
  if (url.pathname !== '/api/studio/generate' || req.method !== 'POST') return false;
  try {
    const body = await readBody(req);
    const result = await generate(body);
    json(res, 200, result);
  } catch (error) {
    json(res, error?.code === 'AI_ENGINE_NOT_CONFIGURED' ? 503 : 500, {
      ok: false,
      code: error?.code || 'STUDIO_AI_ERROR',
      error: error?.message || 'Studio AI generation failed',
    });
  }
  return true;
}

http.Server.prototype.emit = function(event, ...args) {
  if (event === 'request') {
    const [req, res] = args;
    const url = String(req?.url || '');
    if (url.startsWith('/api/studio/')) {
      handle(req, res).catch(err => json(res, 500, { ok:false, code:'STUDIO_AI_ERROR', error:err?.message || 'Studio AI generation failed' }));
      return true;
    }
  }
  return originalEmit.call(this, event, ...args);
};
