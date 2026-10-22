FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache python3 make g++
COPY packages/shared/package.json packages/shared/package-lock.json* packages/shared/
RUN cd packages/shared && npm ci
COPY packages/shared/ packages/shared/
RUN cd packages/shared && npm run build
COPY services/trading/alpha-executor/package.json services/trading/alpha-executor/package-lock.json* services/trading/alpha-executor/
RUN cd services/trading/alpha-executor && npm ci
COPY services/trading/alpha-executor/tsconfig.json services/trading/alpha-executor/
COPY services/trading/alpha-executor/src/ services/trading/alpha-executor/src/
RUN cd services/trading/alpha-executor && npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/services/trading/alpha-executor/dist/ dist/
COPY --from=builder /app/services/trading/alpha-executor/node_modules node_modules
CMD ["node", "dist/services/trading/alpha-executor/src/index.js"]
