FROM node:22-alpine

RUN apk add --no-cache unzip patch
WORKDIR /app

COPY SCHOLARK_V22_Deploy.zip /tmp/scholark.zip
COPY scholark_v23_patch.gz.b64 /tmp/scholark_v23_patch.gz.b64
COPY scholark_v23_education.gz.b64 /tmp/scholark_v23_education.gz.b64
COPY server-key-shim.mjs /app/server-key-shim.mjs
COPY studio-ai-route.mjs /app/studio-ai-route.mjs
COPY studio-media-route.mjs /app/studio-media-route.mjs
COPY studio-export-route.mjs /app/studio-export-route.mjs
COPY studio-reference-route.mjs /app/studio-reference-route.mjs
COPY studio-research-route.mjs /app/studio-research-route.mjs
COPY studio-public-page-route.mjs /app/studio-public-page-route.mjs
COPY studio-public-artifact-route.mjs /app/studio-public-artifact-route.mjs
COPY scholark-learning-route.mjs /app/scholark-learning-route.mjs
COPY scholark-prepaint-head.html /tmp/scholark-prepaint-head.html

# Active runtime only. Older V46-V49 workspace routers are intentionally not loaded.
COPY scholark-v24-ui.js \
     scholark-v25-enhancements.js \
     scholark-v27-voice-hotfix.js \
     scholark-v28-home-experience.js \
     scholark-v29-home-overlay.js \
     scholark-v30-native-home-autodemo.js \
     scholark-v32-mode-preview.js \
     scholark-v33-preview-compat.js \
     scholark-v35-pro-creator-limits.js \
     scholark-v36-workspace-i18n.js \
     scholark-v41-home-pricing-dashboard.js \
     scholark-v42-route-guard.js \
     scholark-v43-studio-workspace.js \
     scholark-v45-studio-generation-brief.js \
     scholark-v50-school-finder.js \
     scholark-v51-workspace-shell.js \
     scholark-v52-workspace-qa.js \
     scholark-v53-dashboard-bootstrap.js \
     scholark-v55-home-topbar-workspace-entry.js \
     scholark-v56-sidebar-cleanup.js \
     scholark-v57-presentation-deck.js \
     scholark-v58-studio-artifact-suite.js \
     scholark-v59-studio-ai-engine.js \
     scholark-v60-presentation-ready.js \
     scholark-v61-free-provider-messaging.js \
     scholark-v62-learning-ai.js \
     scholark-v63-presentation-visuals.js \
     scholark-v64-projects.js \
     scholark-v65-book-studio.js \
     scholark-v66-presentation-ai-tools.js \
     scholark-v67-professional-exports.js \
     scholark-v68-slide-block-editor.js \
     scholark-v69-reference-reader.js \
     scholark-v70-social-graphic-media.js \
     scholark-v71-research-agent.js \
     scholark-v72-cloud-projects.js \
     scholark-v73-web-publishing.js \
     scholark-v74-presenter-pro.js \
     scholark-v75-document-pro.js \
     scholark-v76-graphic-canvas.js \
     scholark-v77-webpage-pro.js \
     scholark-v78-artifact-sharing.js \
     scholark-v79-collaboration.js \
     scholark-v80-workspace-cloud.js \
     scholark-v81-stability-foundation.js \
     scholark-v82-tutor-cloud.js \
     scholark-v83-study-ahead-cloud.js \
     scholark-v84-profile-cloud.js \
     /tmp/

RUN unzip /tmp/scholark.zip -d /app \
    && base64 -d /tmp/scholark_v23_patch.gz.b64 | gunzip > /tmp/scholark_v23.patch \
    && patch -p1 -d /app < /tmp/scholark_v23.patch \
    && base64 -d /tmp/scholark_v23_education.gz.b64 | gunzip > /app/education-expansion.js \
    && find /app -type f \( -name '*.js' -o -name '*.mjs' -o -name '*.html' -o -name '*.json' \) -exec sed -i 's#http://localhost:3000#https://scholark-app-shawiel.onrender.com#g' {} + \
    && find /app -type f \( -name '*.js' -o -name '*.mjs' -o -name '*.html' -o -name '*.json' \) -exec sed -i 's#14\.99#__SCHOLARK_PRO_PRICE__#g; s#9\.99#14.99#g; s#__SCHOLARK_PRO_PRICE__#19.99#g' {} + \
    && find /app -type f \( -name '*.js' -o -name '*.mjs' -o -name '*.html' -o -name '*.json' \) -exec sed -i 's#For learners and students who create more often\.#7 days free, then $14.99/month. Cancel anytime.#g; s#For intensive use and maximum AI quality\.#7 days free, then $19.99/month. Cancel anytime.#g; s#Choose Plus#Start Plus free trial#g; s#Choose Pro#Start Pro free trial#g; s#Continue with Plus#Start 7-day Plus trial#g; s#Continue with Pro#Start 7-day Pro trial#g' {} + \
    && sed -i "s/h.includes('pricing')||/h.includes('dashboard')||h.includes('education')||h.includes('schools')||h.includes('study')||h.includes('book')||h.includes('webpage')||h.includes('document')||h.includes('graphic')||h.includes('social')||h.includes('studio')||h.includes('pricing')||/" /tmp/scholark-v30-native-home-autodemo.js \
    && find /app -type f -name '*.html' -exec sh -c 'snippet=$(cat /tmp/scholark-prepaint-head.html); sed -i "s~</head>~$snippet</head>~" "$1"' sh {} \; \
    && find /app -type f -name '*.html' -exec sh -c 'dir=$(dirname "$1"); tags=""; for f in /tmp/scholark-v*.js; do base=$(basename "$f"); cp "$f" "$dir/$base"; tags="$tags<script src=\"$base\"></script>"; done; sed -i "s#</body>#$tags</body>#" "$1"' sh {} \; \
    && rm -f /tmp/scholark.zip /tmp/scholark_v23_patch.gz.b64 /tmp/scholark_v23_education.gz.b64 /tmp/scholark_v23.patch /tmp/scholark-prepaint-head.html /tmp/scholark-v*.js

RUN npm install --omit=dev \
    && npm install --omit=dev --no-save pptxgenjs docx pdfkit @cedrugs/pdf-parse mammoth jszip sanitize-html

ENV NODE_ENV=production
ENV POLLINATIONS_MODEL=gpt-5.6-sol
ENV POLLINATIONS_FALLBACK_MODEL=claude-opus-4.7
ENV POLLINATIONS_LEARNING_MODEL=gpt-5.6-sol
ENV POLLINATIONS_IMAGE_MODEL=flux
ENV POLLINATIONS_RESEARCH_MODEL=perplexity-fast
ENV SUPABASE_URL=https://yhafbwdnnpvuedycdkll.supabase.co
ENV SUPABASE_PUBLISHABLE_KEY=sb_publishable_1f1KQE-QMOM8rR3RqvQlsw__79lCn6A
ENV OPENAI_STUDIO_MODEL=gpt-5.6-sol
ENV OPENAI_LEARNING_MODEL=gpt-5.6-sol
EXPOSE 10000

CMD ["node", "--import", "./server-key-shim.mjs", "--import", "./studio-ai-route.mjs", "--import", "./studio-media-route.mjs", "--import", "./studio-export-route.mjs", "--import", "./studio-reference-route.mjs", "--import", "./studio-research-route.mjs", "--import", "./studio-public-page-route.mjs", "--import", "./studio-public-artifact-route.mjs", "--import", "./scholark-learning-route.mjs", "backend/server.mjs"]
