'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { StatsStrip } from '@/components/overview/StatsStrip';
import { ArbMarketsTable } from '@/components/overview/ArbMarketsTable';
import { EquityCurve } from '@/components/shared/EquityCurve';
import { TradeFeed } from '@/components/shared/TradeFeed';
import { StatusDot } from '@/components/bloomberg';
import type {
  CoreStreamState,
  DashboardStats,
  ServiceHealth,
  TradeEvent,
  MarketSummary,
} from '@/lib/types';

/* ─── Default states ──────────────────────────────────────────────────────── */

const DEFAULT_CORE: CoreStreamState = {
  balance: 0,
  killSwitches: {},
  configOverrides: { btc5mMaxPosition: null, btc5mMomentumMaxBet: null, maxSlippageBps: null },
};

const DEFAULT_STATS: DashboardStats = {
  balance: 0,
  todayPnl: 0,
  totalPnl: 0,
  winRate: 0,
  totalTrades: 0,
  maxDrawdown: 0,
  messagesIngested: 0,
};

const DEFAULT_SERVICES: ServiceHealth = {
  redis: { status: 'down', metric: '' },
  ingestion: { status: 'down', metric: '' },
  'signal-core': { status: 'down', metric: '' },
  execution: { status: 'down', metric: '' },
  settlement: { status: 'down', metric: '' },
  'btc-5m': { status: 'down', metric: '' },
  'btc-5m-momentum': { status: 'down', metric: '' },
};

function formatNow(): string {
  return new Date().toLocaleString([], {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/* ─── Overview Page ───────────────────────────────────────────────────────── */

export default function OverviewPage() {
  const [core, setCore] = useState<CoreStreamState>(DEFAULT_CORE);
  const [stats, setStats] = useState<DashboardStats>(DEFAULT_STATS);
  const [services, setServices] = useState<ServiceHealth>(DEFAULT_SERVICES);
  const [trades, setTrades] = useState<TradeEvent[]>([]);
  const [markets, setMarkets] = useState<MarketSummary[]>([]);
  const [connected, setConnected] = useState(false);
  const [stale, setStale] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState<string | null>(null);
  const [now, setNow] = useState<string>(formatNow());
  const backfilled = useRef(false);

  useEffect(() => {
    const t = setInterval(() => setNow(formatNow()), 30_000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const es = new EventSource('/api/stream');

    es.onopen = () => { setConnected(true); setStale(false); };
    es.onerror = () => { setConnected(false); setStale(true); };

    es.addEventListener('stats_tick', (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        if (data.stale) { setStale(true); return; }
        setStale(false);
        if (data.balance !== undefined) {
          setCore({
            balance: data.balance ?? 0,
            killSwitches: data.killSwitches ?? {},
            configOverrides: data.configOverrides ?? { btc5mMaxPosition: null, btc5mMomentumMaxBet: null, maxSlippageBps: null },
          });
        }
        if (data.stats) setStats(data.stats);
      } catch { /* noop */ }
    });

    es.addEventListener('trade_event', (e: MessageEvent) => {
      try {
        const trade: TradeEvent = JSON.parse(e.data);
        setTrades((prev) => [trade, ...prev].slice(0, 100));
      } catch { /* noop */ }
    });

    es.addEventListener('trade_backfill', (e: MessageEvent) => {
      if (backfilled.current) return;
      try {
        const data = JSON.parse(e.data);
        if (Array.isArray(data)) {
          setTrades(data);
          backfilled.current = true;
        }
      } catch { /* noop */ }
    });

    es.addEventListener('market_snapshot', (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        if (data.markets) {
          setMarkets(data.markets);
          setSelectedMarket((prev) => prev ?? data.markets[0].id);
        }
      } catch { /* noop */ }
    });

    es.addEventListener('service_health', (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        if (data.services) setServices(data.services);
      } catch { /* noop */ }
    });

    es.onmessage = (event: MessageEvent) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'stats' && msg.data) {
          if (msg.data.stale) {
            setStale(true);
          } else {
            setStale(false);
            if (msg.data.stats) setStats(msg.data.stats);
            if (msg.data.services) setServices(msg.data.services);
            if (msg.data.markets) setMarkets(msg.data.markets);
            if (msg.data.trades && !backfilled.current) {
              setTrades(msg.data.trades);
              backfilled.current = true;
            }
            if (msg.data.stats?.balance !== undefined) {
              setCore((prev) => ({ ...prev, balance: msg.data.stats.balance }));
            }
          }
        } else if (msg.type === 'trade' && msg.data) {
          setTrades((prev) => [msg.data, ...prev].slice(0, 100));
        }
      } catch { /* noop */ }
    };

    return () => es.close();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelectMarket = useCallback((id: string) => {
    setSelectedMarket(id);
  }, []);

  const upServices = Object.values(services).filter((s) => s.status === 'up').length;
  const totalServices = Object.values(services).length;

  return (
    <div className="flex flex-col gap-3 p-4 h-full">
      {/* Editorial masthead */}
      <header className="flex items-end justify-between border-b-2 border-bb-paper pb-2">
        <div className="flex items-baseline gap-3">
          <span className="display text-bb-orange text-[28px] leading-none">№</span>
          <div>
            <div className="text-[9px] uppercase tracking-wider3 text-bb-dim leading-none mb-1">
              The Quant Lab Daily — Vol I, Edition I
            </div>
            <h1 className="display-roman text-bb-paper text-[28px] leading-[0.95]">
              Overview <span className="display text-bb-dim italic">— live tape</span>
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-4 pb-1">
          <span className="text-[9px] uppercase tracking-wider3 text-bb-dim num">{now}</span>
          <span className="w-px h-4 bg-bb-muted" />
          <StatusDot
            status={connected ? 'up' : 'down'}
            label={connected ? 'Connected' : 'Disconnected'}
          />
          {stale && (
            <span className="text-[9px] uppercase tracking-wider3 text-bb-yellow flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-bb-yellow bb-blink" />
              Data stale
            </span>
          )}
          <span className="w-px h-4 bg-bb-muted" />
          <span className="text-[9px] uppercase tracking-wider3 text-bb-dim num">
            {upServices}<span className="text-bb-muted">/{totalServices}</span> services
          </span>
        </div>
      </header>

      {/* Hero stats strip */}
      <StatsStrip core={core} stats={stats} />

      {/* Middle: Equity curve + Trade feed */}
      <div className="flex gap-3 flex-1 min-h-[320px]">
        <div className="w-[62%] flex flex-col">
          <EquityCurve trades={trades} />
        </div>
        <div className="w-[38%] flex flex-col min-h-0">
          <TradeFeed trades={trades} />
        </div>
      </div>

      {/* Bottom: arb markets */}
      <ArbMarketsTable
        markets={markets}
        selectedMarket={selectedMarket ?? undefined}
        onSelectMarket={handleSelectMarket}
      />

      {/* Footer */}
      <footer className="flex items-center justify-between text-[8px] uppercase tracking-wider3 text-bb-muted pt-1 border-t border-bb-rule">
        <span>Open-source · MIT · Paper-mode default</span>
        <span className="display text-bb-muted text-[12px] -mt-0.5">— fin —</span>
        <span>github.com/dantraynor/algorithmic-trading-polymarket</span>
      </footer>
    </div>
  );
}
