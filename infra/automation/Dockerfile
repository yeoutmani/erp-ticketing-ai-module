FROM node:20-alpine AS base
WORKDIR /app

COPY automation/package*.json ./
RUN npm ci --omit=dev

COPY automation/ .

RUN npx tsc --outDir dist || true   # if tsconfig exists

EXPOSE 3000

CMD ["npx", "tsx", "server.ts"]