FROM node:22-alpine

RUN apk add --no-cache unzip patch
WORKDIR /app

COPY SCHOLARK_V22_Deploy.zip /tmp/scholark.zip
COPY scholark_v23_patch.gz.b64 /tmp/scholark_v23_patch.gz.b64
COPY scholark_v23_education.gz.b64 /tmp/scholark_v23_education.gz.b64

RUN unzip /tmp/scholark.zip -d /app \
    && base64 -d /tmp/scholark_v23_patch.gz.b64 | gunzip > /tmp/scholark_v23.patch \
    && patch -p1 -d /app < /tmp/scholark_v23.patch \
    && base64 -d /tmp/scholark_v23_education.gz.b64 | gunzip > /app/education-expansion.js \
    && find /app -type f \( -name '*.js' -o -name '*.mjs' -o -name '*.html' -o -name '*.json' \) -exec sed -i 's#http://localhost:3000#https://scholark-app-shawiel.onrender.com#g' {} + \
    && find /app -type f \( -name '*.js' -o -name '*.mjs' -o -name '*.html' -o -name '*.json' \) -exec sed -i 's#14\.99#__SCHOLARK_PRO_PRICE__#g; s#9\.99#14.99#g; s#__SCHOLARK_PRO_PRICE__#19.99#g' {} + \
    && rm /tmp/scholark.zip /tmp/scholark_v23_patch.gz.b64 /tmp/scholark_v23_education.gz.b64 /tmp/scholark_v23.patch

RUN npm install --omit=dev

ENV NODE_ENV=production
EXPOSE 10000

CMD ["node", "backend/server.mjs"]
