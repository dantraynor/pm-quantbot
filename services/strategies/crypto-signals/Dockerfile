FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache python3 make g++
COPY packages/shared/package.json packages/shared/package-lock.json* packages/shared/
RUN cd packages/shared && npm ci
COPY packages/shared/ packages/shared/
RUN cd packages/shared && npm run build
COPY services/strategies/crypto-signals/package.json services/strategies/crypto-signals/package-lock.json* services/strategies/crypto-signals/
RUN cd services/strategies/crypto-signals && npm ci
COPY services/strategies/crypto-signals/tsconfig.json services/strategies/crypto-signals/
COPY services/strategies/crypto-signals/src/ services/strategies/crypto-signals/src/
RUN cd services/strategies/crypto-signals && npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/services/strategies/crypto-signals/dist/ dist/
COPY --from=builder /app/services/strategies/crypto-signals/node_modules node_modules
CMD ["node", "dist/services/strategies/crypto-signals/src/index.js"]
