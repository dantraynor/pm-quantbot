FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache python3 make g++
COPY packages/shared/package.json packages/shared/package-lock.json* packages/shared/
RUN cd packages/shared && npm ci
COPY packages/shared/ packages/shared/
RUN cd packages/shared && npm run build
COPY services/strategies/sports-signals/package.json services/strategies/sports-signals/package-lock.json* services/strategies/sports-signals/
RUN cd services/strategies/sports-signals && npm ci
COPY services/strategies/sports-signals/tsconfig.json services/strategies/sports-signals/
COPY services/strategies/sports-signals/src/ services/strategies/sports-signals/src/
RUN cd services/strategies/sports-signals && npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/services/strategies/sports-signals/dist/ dist/
COPY --from=builder /app/services/strategies/sports-signals/node_modules node_modules
CMD ["node", "dist/services/strategies/sports-signals/src/index.js"]
