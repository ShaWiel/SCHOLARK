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
  presentation: `Create a finished presentation that a competent speaker could open and present immediately. Every section is one final slide, not a planning note. Never put generator instructions, prompt fragments, labels such as "Core argument", "Evidence and analysis", "Comparison / counterargument", or phrases such as "Use this slide to..." on the slide unless the user explicitly asks for those exact words. Slide titles must be concise and meaningful (normally 3-8 words). Subtitles should normally be one short sentence. Use 0-4 concise points per slide. Build a real narrative arc, vary slide logic intentionally, and make each slide earn its place. For factual topics, use verified facts and statistics only. Include speaker notes that help someone present the slide naturally without reading the slide verbatim. Include a concrete visual brief for each slide; choose charts, timelines, comparisons, diagrams, photography, maps, quotes or strong typography when appropriate. The cover should look like a cover, evidence slides should contain actual evidence, comparison slides should contain actual compared entities, and the final slide should deliver a real conclusion or call to action.`,
  webpage: 'Return complete publishable webpage content: a real hero, value proposition, useful sections, proof, navigation logic, CTA and FAQ when appropriate. Write specific conversion-quality copy, not wireframe instructions or generic filler. Every section must be ready to render.',
  document: 'Return a complete professional document structure with substantive section prose, evidence-aware claims, logical transitions, conclusions and references when research is used. Do not output writing instructions as body copy; output the actual document content.',
  social: 'Return a complete social content set/carousel with platform-ready hooks, useful body copy, caption, CTA and platform-appropriate hashtags. Avoid engagement bait, placeholders and instructions to the creator. Each item should be publishable after normal human review.',
  graphic: 'Return a complete visual-content system for a poster/infographic/graphic: final headline, concise supporting copy, information blocks, hierarchy, CTA and a concrete visual brief. Do not put design instructions in the visible copy fields.',
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
        required: ['title','subtitle','body','bullets','points','label','layoutHint','visualType','visualBrief','speakerNotes','sourceRefs'],
        properties: {
          title: { type: 'string' },
          subtitle: { type: 'string' },
          body: { type: 'string' },
          bullets: { type: 'array', items: { type: 'string' } },
          points: {
            type: 'array',
            items: {
              type: 'object', additionalProperties: false,
              required: ['heading','detail','value'],
              properties: {
                heading: { type: 'string' },
                detail: { type: 'string' },
                value: { type: 'string' },
              }
            }
          },
          label: { type: 'string' },
          layoutHint: { type: 'string', enum: ['hero','split','cards','timeline','compare','stats','quote','statement','grid','closing','section'] },
          visualType: { type: 'string', enum: ['photo','chart','timeline','comparison','diagram','map','quote','numbers','typography','none'] },
          visualBrief: { type: 'string' },
          speakerNotes: { type: 'string' },
          sourceRefs: { type: 'array', items: { type: 'string' } },
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
  if (!key || key === 'snyc: false' || key === 'sync: false') {
    const err = new Error('OPENAI_API_KEY is not configured with a valid OpenAI secret key');
    err.code = 'AI_ENGINE_NOT_CONFIGURED';
    throw err;
  }

  const mode = String(payload.mode || '').toLowerCase();
  if (!modeRules[mode]) throw new Error('Unsupported Studio mode');
  const model = String(process.env.OPENAI_STUDIO_MODEL || process.env.OPENAI_MODEL || 'gpt-5.6').trim();
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
    settings: payload.settings || {},
  };

  const presentationGuard = mode === 'presentation' ? `
PRESENTATION-READY QUALITY GATE:
- The visible slide copy must be final audience-facing copy. Never output meta-instructions, slide-writing advice, or the user's whole prompt as a slide title.
- Title: usually 3-8 words and under 60 characters. Subtitle: normally under 18 words. Visible body: usually under 45 words. Each bullet: usually under 12 words.
- Speaker notes: normally 60-140 words with useful transitions, context and caveats. Notes are for the presenter and must not simply repeat the slide.
- Use specific named entities and claims. A GOAT debate should name and compare the actual players; a climate deck should contain the actual climate evidence; a pitch deck should contain the actual business argument.
- For statistics, verify the number with web research and cite the source. If a number cannot be verified, omit it rather than inventing a placeholder.
- Use points.value only for real concise numbers/labels that belong visibly on the slide; leave it as an empty string when not needed.
- sourceRefs must contain source URLs that support claims on that slide when relevant.
- visualBrief describes what should be shown visually, but must never leak into the visible title/body/bullets.
- Use layoutHint intentionally. Do not make every slide cards. Aim for a professionally varied deck.
- Before returning, silently reject and rewrite any slide that still contains phrases like "Use this slide", "What to notice", "Core argument", "Evidence and analysis", "Supporting insight", "Comparison / counterargument", "Verified figure", or other template language unless those words genuinely belong to the topic.
` : '';

  const instructions = `You are SCHOLARK Studio AI, an elite research, writing, information-design and visual-communication engine. Produce the strongest useful first draft possible, not filler. Follow the user's exact request. Adapt complexity to the selected learner/work level without becoming childish unless the level requires it. Research factual claims when needed, prefer primary and highly reliable sources, never fabricate facts, URLs, quotes or statistics, and make uncertainty explicit. Think deeply about narrative, hierarchy, audience, clarity, persuasion, evidence and visual structure before writing. ${modeRules[mode]} ${presentationGuard} Return exactly ${requested} sections when the mode naturally uses a count, unless doing so would materially harm quality. The JSON is consumed directly by an editor, so every audience-facing field must already be polished, specific and immediately usable.`;

  const request = {
    model,
    store: false,
    reasoning: { effort: 'xhigh' },
    text: {
      verbosity: 'high',
      format: { type: 'json_schema', name: 'scholark_studio_artifact', strict: true, schema },
    },
    tools: payload.research === false ? [] : [{ type: 'web_search', search_context_size: 'high' }],
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
    const key = String(process.env.OPENAI_API_KEY || '').trim();
    return json(res, 200, {
      ok: true,
      configured: Boolean(key && key !== 'snyc: false' && key !== 'sync: false'),
      model: String(process.env.OPENAI_STUDIO_MODEL || process.env.OPENAI_MODEL || 'gpt-5.6'),
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
