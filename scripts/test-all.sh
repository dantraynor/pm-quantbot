#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

run_npm() {
  local service_path="$1"
  local label="${2:-$service_path}"

  if [ ! -f "$ROOT/$service_path/package.json" ]; then
    return
  fi

  printf "\n==> %s: npm checks\n" "$label"
  if [ ! -d "$ROOT/$service_path/node_modules" ]; then
    npm --prefix "$ROOT/$service_path" ci
  fi

  local scripts
  scripts="$(npm --prefix "$ROOT/$service_path" run 2>/dev/null || true)"
  if grep -q " build" <<<"$scripts"; then
    npm --prefix "$ROOT/$service_path" run build
  fi
  if grep -q " test" <<<"$scripts"; then
    case "$label" in
      btc-5m-latency|btc-5m-momentum)
        npm --prefix "$ROOT/$service_path" test -- --runInBand
        ;;
      *)
        npm --prefix "$ROOT/$service_path" test
        ;;
    esac
  fi
}

run_cargo() {
  local service_path="$1"
  local label="${2:-$service_path}"

  if [ ! -f "$ROOT/$service_path/Cargo.toml" ]; then
    return
  fi

  printf "\n==> %s: cargo test\n" "$label"
  cargo test --manifest-path "$ROOT/$service_path/Cargo.toml"
}

run_cargo services/market-data/ingestion ingestion
run_cargo services/market-data/signal-core signal-core

for entry in \
  "packages/shared:shared" \
  "services/trading/execution:execution" \
  "services/trading/settlement:settlement" \
  "services/strategies/btc-5m:btc-5m" \
  "services/strategies/btc-5m-momentum:btc-5m-momentum" \
  "services/strategies/btc-5m-latency:btc-5m-latency" \
  "services/strategies/crypto-signals:crypto-signals" \
  "services/strategies/sports-signals:sports-signals" \
  "services/trading/alpha-executor:alpha-executor" \
  "apps/dashboard:dashboard"
do
  path="${entry%%:*}"
  name="${entry##*:}"
  run_npm "$path" "$name"
done

printf "\nAll configured checks completed.\n"
