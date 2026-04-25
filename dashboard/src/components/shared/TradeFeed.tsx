'use client';

import { Panel } from '@/components/bloomberg';
import { num, formatPnl, timeAgo } from '@/lib/format';
import { STRATEGIES, type StrategyId } from '@/lib/strategy-registry';
import type { TradeEvent } from '@/lib/types';

function resolveStrategy(raw: string): { label: string; color: string } {
  if (raw in STRATEGIES) {
    const def = STRATEGIES[raw as StrategyId];
    return { label: def.label, color: def.color };
  }
  if (raw === 'arbitrage' || raw === 'arb') return { label: 'ARB', color: 'text-bb-cyan' };
  if (raw === 'btc5m' || raw === 'btc-5m') return { label: 'BTC5M', color: 'text-bb-orange' };
  if (raw === 'momentum' || raw === 'btc5m_momentum') return { label: 'MOMTM', color: 'text-bb-orange' };
  if (raw === 'latency' || raw === 'btc5m_latency') return { label: 'LATCY', color: 'text-bb-yellow' };
  if (raw === 'alpha') return { label: 'ALPHA', color: 'text-bb-green' };
  return { label: raw.toUpperCase().slice(0, 5), color: 'text-bb-dim' };
}

interface Props {
  trades: TradeEvent[];
  maxRows?: number;
}

export function TradeFeed({ trades, maxRows = 30 }: Props) {
  const right = (
    <span className="text-[9px] uppercase tracking-wider3 text-bb-dim num">
      {trades.length} <span className="text-bb-muted">/ stream</span>
    </span>
  );

  return (
    <Panel title="Trade Feed" live index="II" right={right} className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 overflow-y-auto log-scroll">
        {trades.length === 0 ? (
          <div className="flex items-center justify-center h-24 text-bb-dim text-[10px] uppercase tracking-wider">
            <span className="display text-bb-dim text-[14px] mr-2">∅</span>
            Waiting for trades
          </div>
        ) : (
          <ul className="flex flex-col">
            {trades.slice(0, maxRows).map((trade, i) => {
              const pnl = num((trade as any).pnl ?? (trade as any).grossPnl);
              const strat = resolveStrategy(trade.strategy);
              const isPos = pnl >= 0;
              return (
                <li
                  key={`${trade.timestamp}-${i}`}
                  className={`group flex items-center gap-2 px-3 py-1 transition-colors hover:bg-bb-green/[0.04] ${
                    i % 2 === 0 ? 'bg-transparent' : 'bg-bb-panel2/30'
                  }`}
                >
                  <span className="text-[9px] text-bb-muted font-mono w-5 num shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className={`text-[10px] font-medium tracking-wider w-[42px] shrink-0 ${strat.color}`}>
                    {strat.label}
                  </span>
                  {trade.dryRun && (
                    <span className="text-[8px] text-bb-yellow font-medium border border-bb-yellow/40 px-1 leading-tight">
                      DRY
                    </span>
                  )}
                  <span className="text-[11px] text-bb-text truncate flex-1 font-mono">
                    {trade.market}
                  </span>
                  <span
                    className={`text-[12px] font-mono num shrink-0 ${
                      isPos ? 'text-bb-green' : 'text-bb-red'
                    }`}
                  >
                    {isPos ? '+' : ''}{formatPnl(pnl).replace(/^\+/, '')}
                  </span>
                  <span className="text-[9px] text-bb-dim w-[28px] text-right shrink-0 num uppercase tracking-wider">
                    {timeAgo(trade.timestamp)}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Panel>
  );
}
