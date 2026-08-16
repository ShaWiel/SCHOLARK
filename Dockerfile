FROM node:22-alpine

RUN apk add --no-cache unzip patch
WORKDIR /app

COPY SCHOLARK_V22_Deploy.zip /tmp/scholark.zip
COPY scholark_v23_patch.gz.b64 /tmp/scholark_v23_patch.gz.b64
COPY scholark_v23_education.gz.b64 /tmp/scholark_v23_education.gz.b64
COPY server-key-shim.mjs /app/server-key-shim.mjs

# Only active runtime layers are copied. Shell glob order keeps V24 -> V51 deterministic.
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
     scholark-v46-navigation-cleanup.js \
     scholark-v47-dashboard-stability.js \
     scholark-v48-workspace-runtime.js \
     scholark-v49-workspace-tools.js \
     scholark-v50-school-finder.js \
     scholark-v51-workspace-layout.js \
     /tmp/

RUN unzip /tmp/scholark.zip -d /app \
    && base64 -d /tmp/scholark_v23_patch.gz.b64 | gunzip > /tmp/scholark_v23.patch \
    && patch -p1 -d /app < /tmp/scholark_v23.patch \
    && base64 -d /tmp/scholark_v23_education.gz.b64 | gunzip > /app/education-expansion.js \
    && find /app -type f \( -name '*.js' -o -name '*.mjs' -o -name '*.html' -o -name '*.json' \) -exec sed -i 's#http://localhost:3000#https://scholark-app-shawiel.onrender.com#g' {} + \
    && find /app -type f \( -name '*.js' -o -name '*.mjs' -o -name '*.html' -o -name '*.json' \) -exec sed -i 's#14\.99#__SCHOLARK_PRO_PRICE__#g; s#9\.99#14.99#g; s#__SCHOLARK_PRO_PRICE__#19.99#g' {} + \
    && find /app -type f \( -name '*.js' -o -name '*.mjs' -o -name '*.html' -o -name '*.json' \) -exec sed -i 's#For learners and students who create more often\.#7 days free, then $14.99/month. Cancel anytime.#g; s#For intensive use and maximum AI quality\.#7 days free, then $19.99/month. Cancel anytime.#g; s#Choose Plus#Start Plus free trial#g; s#Choose Pro#Start Pro free trial#g; s#Continue with Plus#Start 7-day Plus trial#g; s#Continue with Pro#Start 7-day Pro trial#g' {} + \
    && sed -i "s/h.includes('pricing')||/h.includes('dashboard')||h.includes('pricing')||/" /tmp/scholark-v30-native-home-autodemo.js \
    && find /app -type f -name '*.html' -exec sh -c 'dir=$(dirname "$1"); tags=""; for f in /tmp/scholark-v*.js; do base=$(basename "$f"); cp "$f" "$dir/$base"; tags="$tags<script src=\"$base\"></script>"; done; sed -i "s#</body>#$tags</body>#" "$1"' sh {} \; \
    && rm -f /tmp/scholark.zip /tmp/scholark_v23_patch.gz.b64 /tmp/scholark_v23_education.gz.b64 /tmp/scholark_v23.patch /tmp/scholark-v*.js

RUN npm install --omit=dev

ENV NODE_ENV=production
EXPOSE 10000

CMD ["node", "--import", "./server-key-shim.mjs", "backend/server.mjs"]