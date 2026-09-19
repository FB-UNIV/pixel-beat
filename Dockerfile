# syntax=docker/dockerfile:1

# ---- Build stage: compile TypeScript ----
FROM node:25.2.0-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ---- Runtime stage: production deps + compiled output only ----
FROM node:25.2.0-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist
COPY public ./public
RUN mkdir -p public/assets

EXPOSE 8000
CMD ["node", "dist/server.js"]
