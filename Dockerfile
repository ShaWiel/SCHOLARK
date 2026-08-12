FROM node:22-alpine

RUN apk add --no-cache unzip
WORKDIR /app

COPY SCHOLARK_V22_Deploy.zip /tmp/scholark.zip
RUN unzip /tmp/scholark.zip -d /app \
    && rm /tmp/scholark.zip

RUN npm install --omit=dev

ENV NODE_ENV=production
EXPOSE 10000

CMD ["node", "backend/server.mjs"]
