#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPOSE_DEMO=(docker compose -f docker-compose.yml -f docker-compose.dev.yml -f docker-compose.demo.yml)
COMPOSE_DEV=(docker compose -f docker-compose.yml -f docker-compose.dev.yml)

bold() {
  printf "\033[1m%s\033[0m\n" "$1"
}

say() {
  printf "%s\n" "$1"
}

need_docker() {
  if ! command -v docker >/dev/null 2>&1; then
    say ""
    bold "Docker is not installed."
    say "Install Docker Desktop first:"
    say "  https://docs.docker.com/desktop/"
    say ""
    say "After installing it, open Docker Desktop and run this again:"
    say "  make start"
    exit 1
  fi

  if ! docker compose version >/dev/null 2>&1; then
    say ""
    bold "Docker Compose v2 is missing."
    say "Update Docker Desktop, then run:"
    say "  make start"
    exit 1
  fi

  if ! docker info >/dev/null 2>&1; then
    say ""
    bold "Docker is installed, but it is not running."
    say "Open Docker Desktop, wait until it says it is running, then run:"
    say "  make start"
    exit 1
  fi
}

start_demo() {
  need_docker
  say ""
  bold "Starting safe demo mode..."
  say "This uses fake data only. It does not use a wallet and cannot place trades."
  say ""
  cd "$ROOT"
  "${COMPOSE_DEMO[@]}" up -d --build redis dashboard demo-seed
  say ""
  bold "Demo is running."
  say "Open:     http://127.0.0.1:3001"
  say "Password: demo_dashboard_secret"
  say ""
  say "Stop it later with:"
  say "  make demo-down"
}

prepare_paper_mode() {
  say ""
  bold "Preparing paper mode config..."
  cd "$ROOT"
  if [ -f .env ]; then
    say ".env already exists. I did not overwrite it."
  else
    cp .env.example .env
    say "Created .env from .env.example."
  fi
  say ""
  say "Next steps:"
  say "  1. Open .env in a text editor."
  say "  2. Set DASHBOARD_API_SECRET to any long password."
  say "  3. Leave every *_DRY_RUN value set to true."
  say "  4. Run: make up"
  say ""
  say "Do not add a private key until you understand docs/SAFETY.md and docs/WALLET_SETUP.md."
}

show_troubleshooting() {
  say ""
  bold "Common beginner fixes"
  say ""
  say "Docker command not found:"
  say "  Install Docker Desktop: https://docs.docker.com/desktop/"
  say ""
  say "Docker installed but not running:"
  say "  Open Docker Desktop and wait for it to finish starting."
  say ""
  say "Port 3001 already in use:"
  say "  Stop the old demo with: make demo-down"
  say ""
  say "Forgot the demo password:"
  say "  demo_dashboard_secret"
  say ""
  say "Want the step-by-step guide:"
  say "  Open docs/BEGINNER_GUIDE.md"
}

cat <<'MENU'

Polymarket Research Terminal

What do you want to do?

  1. Run the safe demo (recommended)
     Fake data, no wallet, no API keys, no trades.

  2. Prepare paper mode
     Creates .env so you can later run the full stack without live trading.

  3. Troubleshoot setup
     Show common beginner fixes.

  q. Quit

MENU

printf "Choose 1, 2, 3, or q: "
read -r choice

case "${choice:-}" in
  1|"")
    start_demo
    ;;
  2)
    prepare_paper_mode
    ;;
  3)
    show_troubleshooting
    ;;
  q|Q)
    say "No changes made."
    ;;
  *)
    say "Unknown choice. Run 'make start' and choose 1, 2, 3, or q."
    exit 1
    ;;
esac
