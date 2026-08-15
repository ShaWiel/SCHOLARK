FROM node:22-alpine

RUN apk add --no-cache unzip patch
WORKDIR /app

COPY SCHOLARK_V22_Deploy.zip /tmp/scholark.zip
COPY scholark_v23_patch.gz.b64 /tmp/scholark_v23_patch.gz.b64
COPY scholark_v23_education.gz.b64 /tmp/scholark_v23_education.gz.b64
COPY server-key-shim.mjs /app/server-key-shim.mjs
COPY scholark-v24-ui.js /tmp/scholark-v24-ui.js
COPY scholark-v25-enhancements.js /tmp/scholark-v25-enhancements.js
COPY scholark-v26-fixes.js /tmp/scholark-v26-fixes.js
COPY scholark-v27-voice-hotfix.js /tmp/scholark-v27-voice-hotfix.js
COPY scholark-v28-home-experience.js /tmp/scholark-v28-home-experience.js
COPY scholark-v29-home-overlay.js /tmp/scholark-v29-home-overlay.js
COPY scholark-v30-native-home-autodemo.js /tmp/scholark-v30-native-home-autodemo.js
COPY scholark-v31-nav-cleanup.js /tmp/scholark-v31-nav-cleanup.js
COPY scholark-v32-mode-preview.js /tmp/scholark-v32-mode-preview.js
COPY scholark-v33-preview-compat.js /tmp/scholark-v33-preview-compat.js
COPY scholark-v34-dashboard-entry.js /tmp/scholark-v34-dashboard-entry.js
COPY scholark-v35-pro-creator-limits.js /tmp/scholark-v35-pro-creator-limits.js

RUN unzip /tmp/scholark.zip -d /app \
    && base64 -d /tmp/scholark_v23_patch.gz.b64 | gunzip > /tmp/scholark_v23.patch \
    && patch -p1 -d /app < /tmp/scholark_v23.patch \
    && base64 -d /tmp/scholark_v23_education.gz.b64 | gunzip > /app/education-expansion.js \
    && find /app -type f \( -name '*.js' -o -name '*.mjs' -o -name '*.html' -o -name '*.json' \) -exec sed -i 's#http://localhost:3000#https://scholark-app-shawiel.onrender.com#g' {} + \
    && find /app -type f \( -name '*.js' -o -name '*.mjs' -o -name '*.html' -o -name '*.json' \) -exec sed -i 's#14\.99#__SCHOLARK_PRO_PRICE__#g; s#9\.99#14.99#g; s#__SCHOLARK_PRO_PRICE__#19.99#g' {} + \
    && find /app -type f \( -name '*.js' -o -name '*.mjs' -o -name '*.html' -o -name '*.json' \) -exec sed -i 's#For learners and students who create more often\.#7 days free, then $14.99/month. Cancel anytime.#g; s#For intensive use and maximum AI quality\.#7 days free, then $19.99/month. Cancel anytime.#g; s#Choose Plus#Start Plus free trial#g; s#Choose Pro#Start Pro free trial#g; s#Continue with Plus#Start 7-day Plus trial#g; s#Continue with Pro#Start 7-day Pro trial#g' {} + \
    && find /app -type f -name '*.html' -exec sh -c 'cp /tmp/scholark-v24-ui.js "$(dirname "$1")/scholark-v24-ui.js"; cp /tmp/scholark-v25-enhancements.js "$(dirname "$1")/scholark-v25-enhancements.js"; cp /tmp/scholark-v26-fixes.js "$(dirname "$1")/scholark-v26-fixes.js"; cp /tmp/scholark-v27-voice-hotfix.js "$(dirname "$1")/scholark-v27-voice-hotfix.js"; cp /tmp/scholark-v28-home-experience.js "$(dirname "$1")/scholark-v28-home-experience.js"; cp /tmp/scholark-v29-home-overlay.js "$(dirname "$1")/scholark-v29-home-overlay.js"; cp /tmp/scholark-v30-native-home-autodemo.js "$(dirname "$1")/scholark-v30-native-home-autodemo.js"; cp /tmp/scholark-v31-nav-cleanup.js "$(dirname "$1")/scholark-v31-nav-cleanup.js"; cp /tmp/scholark-v32-mode-preview.js "$(dirname "$1")/scholark-v32-mode-preview.js"; cp /tmp/scholark-v33-preview-compat.js "$(dirname "$1")/scholark-v33-preview-compat.js"; cp /tmp/scholark-v34-dashboard-entry.js "$(dirname "$1")/scholark-v34-dashboard-entry.js"; cp /tmp/scholark-v35-pro-creator-limits.js "$(dirname "$1")/scholark-v35-pro-creator-limits.js"; sed -i "s#</body>#<script src=\"scholark-v24-ui.js\"></script><script src=\"scholark-v25-enhancements.js\"></script><script src=\"scholark-v26-fixes.js\"></script><script src=\"scholark-v27-voice-hotfix.js\"></script><script src=\"scholark-v28-home-experience.js\"></script><script src=\"scholark-v29-home-overlay.js\"></script><script src=\"scholark-v30-native-home-autodemo.js\"></script><script src=\"scholark-v31-nav-cleanup.js\"></script><script src=\"scholark-v32-mode-preview.js\"></script><script src=\"scholark-v33-preview-compat.js\"></script><script src=\"scholark-v34-dashboard-entry.js\"></script><script src=\"scholark-v35-pro-creator-limits.js\"></script></body>#" "$1"' sh {} \; \
    && rm /tmp/scholark.zip /tmp/scholark_v23_patch.gz.b64 /tmp/scholark_v23_education.gz.b64 /tmp/scholark_v23.patch /tmp/scholark-v24-ui.js /tmp/scholark-v25-enhancements.js /tmp/scholark-v26-fixes.js /tmp/scholark-v27-voice-hotfix.js /tmp/scholark-v28-home-experience.js /tmp/scholark-v29-home-overlay.js /tmp/scholark-v30-native-home-autodemo.js /tmp/scholark-v31-nav-cleanup.js /tmp/scholark-v32-mode-preview.js /tmp/scholark-v33-preview-compat.js /tmp/scholark-v34-dashboard-entry.js /tmp/scholark-v35-pro-creator-limits.js

RUN npm install --omit=dev

ENV NODE_ENV=production
EXPOSE 10000

CMD ["node", "--import", "./server-key-shim.mjs", "backend/server.mjs"]