# Polymarket Research Terminal - Development Notes

## Architecture

This is a multi-service prediction-market research and execution stack.

### Repository layout

- `apps/dashboard` - Next.js monitoring and controls
- `packages/shared` - common types, Redis keys, and SQLite helpers
- `services/market-data/ingestion` - Rust WebSocket consumer for Polymarket order books
- `services/market-data/signal-core` - Rust arbitrage scanner
- `services/trading/execution` - TypeScript CLOB order execution
- `services/trading/settlement` - TypeScript position merge and settlement helper
- `services/trading/alpha-executor` - portfolio-aware signal execution and risk
- `services/strategies/btc-5m*` - BTC 5-minute strategy variants
- `services/strategies/crypto-signals` - multi-asset crypto signal publisher
- `services/strategies/sports-signals` - sports signal publisher

Docker Compose service names (`ingestion`, `dashboard`, etc.) match the logical service names, not necessarily the folder depth.

## Safety Defaults

- Demo mode must not start execution services.
- Dry-run mode should remain the default for strategy services.
- Live execution must require `TRADING_ENABLED=TRUE` and the relevant strategy switch.
- Do not add code paths that place orders from dashboard-only or demo flows.

## Critical Constants

- WebSocket: `wss://ws-subscriptions-clob.polymarket.com`
- Order type: FOK (Fill or Kill)
- Signature type: 2 (Gnosis Safe)
- Redis socket: `/var/run/redis/redis.sock`

## Common Commands

```bash
make doctor
make demo
make up
make test
make down
```

## Code Style

- Keep strategy signal generation separate from execution.
- Use Decimal.js or integer math for financial calculations.
- Prefer typed payloads and explicit config parsing.
- Add focused tests for signal, sizing, and risk behavior.
- Never commit `.env`, private keys, CLOB credentials, or dashboard secrets.
