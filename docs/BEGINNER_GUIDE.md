# Beginner Guide

This guide is for people who want to try the project without already knowing Docker, wallets, Redis, or trading infrastructure.

## What This Project Does

The project runs a local dashboard that shows how an automated Polymarket research/trading system is organized.

You can use it in three levels:

| Level | What happens | Real money? |
| --- | --- | --- |
| Demo | Fake data appears in the dashboard | No |
| Paper mode | Real services can run, but orders stay disabled | No |
| Live mode | The system can place orders after you add keys and enable switches | Yes |

Start with **Demo**.

## What You Need For The Demo

You only need:

- A computer
- Docker Desktop
- This repository

You do not need:

- A wallet
- A private key
- A Polymarket account
- API keys
- A cloud server
- Rust or Node.js

## Step 1: Install Docker Desktop

Download and install Docker Desktop:

```text
https://docs.docker.com/desktop/
```

After installing it, open Docker Desktop and wait until it says Docker is running.

## Step 2: Get The Project

```bash
git clone https://github.com/dantraynor/algorithmic-trading-polymarket.git
cd algorithmic-trading-polymarket
```

If you already downloaded the project as a ZIP, open a terminal inside the project folder instead.

## Step 3: Run The Beginner Menu

```bash
make start
```

Choose:

```text
1. Run the safe demo
```

This starts a fake local market feed and the dashboard.

## Step 4: Open The Dashboard

Open this URL in your browser:

```text
http://127.0.0.1:3001
```

Password:

```text
demo_dashboard_secret
```

## Step 5: Stop The Demo

When you are done:

```bash
make demo-down
```

## Common Questions

### Can the demo trade with my money?

No. Demo mode starts only Redis, the dashboard, and a fake data feeder. It does not start the services that place orders.

### Why does it need Docker?

Docker lets the project run the same way on different computers without you manually installing Redis, Node.js services, and build tools.

### What is Redis?

Redis is a small local database/message bus. In this project, services use it to share market data, signals, health checks, and dashboard state.

### What is `.env`?

`.env` is a private settings file. It can contain passwords, API keys, wallet addresses, and private keys. Do not share it and do not commit it.

### Should I add my private key?

Not for the demo. Not for your first run. Only consider that after reading:

- [Safety guide](SAFETY.md)
- [Wallet setup](WALLET_SETUP.md)
- [Configuration guide](CONFIGURATION.md)

## Common Errors

### `docker: command not found`

Docker Desktop is not installed. Install it from:

```text
https://docs.docker.com/desktop/
```

### `Cannot connect to the Docker daemon`

Docker Desktop is installed but not running. Open Docker Desktop and wait for it to finish starting.

### `port is already allocated`

Something is already using port `3001`. Try:

```bash
make demo-down
make demo
```

### The dashboard asks for a password

Use:

```text
demo_dashboard_secret
```

## Next Steps After Demo

If you only want to explore, stay in demo mode.

If you want a more realistic local run without live orders:

```bash
make start
```

Choose:

```text
2. Prepare paper mode
```

Then read [Configuration guide](CONFIGURATION.md).

Do not enable live trading until you understand the safety model and risks.
