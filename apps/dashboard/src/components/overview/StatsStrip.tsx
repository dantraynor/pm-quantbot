'use client';

import { formatUsd, formatCount } from '@/lib/format';
import type { CoreStreamState, DashboardStats } from '@/lib/types';

interface Props {
  core: CoreStreamState;
  stats: DashboardStats;
  totalExposure?: number;
}

type Color = 'green' | 'red' | 'yellow' | 'cyan' | 'orange' | 'default';

const COLOR: Record<Color, string> = {
  green: 'text-bb-green',
  red: 'text-bb-red',
  yellow: 'text-bb-yellow',
  cyan: 'text-bb-cyan',
  orange: 'text-bb-orange',
  default: 'text-bb-paper',
};

export function StatsStrip({ core, stats, totalExposure = 0 }: Props) {
  const activeCount = Object.values(core.killSwitches).filter(Boolean).length;
  const phase = activeCount === 0 ? 'IDLE' : activeCount <= 2 ? 'PARTIAL' : 'FULL';
  const phaseColor: Color = phase === 'FULL' ? 'green' : phase === 'PARTIAL' ? 'yellow' : 'orange';

  const dailyColor: Color = stats.todayPnl >= 0 ? 'green' : 'red';
  const totalColor: Color = stats.totalPnl >= 0 ? 'green' : 'red';
  const winColor: Color = stats.winRate >= 0.5 ? 'green' : 'yellow';
  const exposureColor: Color = totalExposure > core.balance * 0.5 ? 'yellow' : 'default';

  const stats2: Array<{
    label: string;
    value: string;
    color: Color;
    numeral: string;
    hint?: string;
  }> = [
    { numeral: 'I',   label: 'Daily P&L',   value: formatUsd(stats.todayPnl), color: dailyColor },
    { numeral: 'II',  label: 'Total P&L',   value: formatUsd(stats.totalPnl), color: totalColor },
    { numeral: 'III', label: 'Win Rate',    value: `${(stats.winRate * 100).toFixed(0)}%`, color: winColor, hint: 'rolling' },
    { numeral: 'IV',  label: 'Trades',      value: String(stats.totalTrades), color: 'default' },
    { numeral: 'V',   label: 'Exposure',    value: `$${totalExposure.toFixed(0)}`, color: exposureColor },
    { numeral: 'VI',  label: 'Msgs/ingest', value: formatCount(stats.messagesIngested), color: 'cyan' },
    { numeral: 'VII', label: 'Phase',       value: phase, color: phaseColor },
  ];

  return (
    <div className="border border-bb-border bg-bb-panel">
      {/* Hero balance row */}
      <div className="flex items-stretch border-b border-bb-border">
        <div className="flex-1 px-4 py-3 border-r border-bb-border bg-gradient-to-br from-bb-panel2/80 to-bb-panel relative overflow-hidden">
          <div className="flex items-baseline gap-3">
            <span className="display text-bb-dim text-[14px] leading-none">№</span>
            <span className="text-[9px] uppercase tracking-wider3 text-bb-dim leading-none">
              Account Balance
            </span>
            <span className="flex-1 h-px bg-bb-muted/60 ml-1 mr-1" />
            <span className="text-[8px] uppercase tracking-wider3 text-bb-muted">
              live
            </span>
          </div>
          <div className="flex items-end gap-2 mt-1.5">
            <span className="display-roman text-bb-paper text-[44px] leading-[0.95] num">
              ${core.balance.toFixed(2)}
            </span>
            <span className="text-[10px] uppercase tracking-wider3 text-bb-dim mb-1.5">USDC</span>
          </div>
          {/* Decorative italic flourish */}
          <span className="display absolute -right-2 -top-1 text-bb-paper/[0.04] text-[140px] leading-none pointer-events-none select-none">
            $
          </span>
        </div>
        <div className="w-[260px] flex">
          <Hero
            numeral="I"
            label="Daily P&L"
            value={formatUsd(stats.todayPnl)}
            color={dailyColor}
          />
        </div>
        <div className="w-[260px] flex border-l border-bb-border">
          <Hero
            numeral="II"
            label="Total P&L"
            value={formatUsd(stats.totalPnl)}
            color={totalColor}
          />
        </div>
      </div>

      {/* Secondary metrics row */}
      <div className="flex items-stretch divide-x divide-bb-border">
        {stats2.slice(2).map((cell) => (
          <div key={cell.label} className="flex-1 px-3 py-2.5">
            <div className="flex items-baseline gap-1.5 mb-1">
              <span className="display text-bb-dim text-[10px] leading-none">{cell.numeral}</span>
              <span className="text-[8px] uppercase tracking-wider3 text-bb-dim leading-none">
                {cell.label}
              </span>
            </div>
            <span className={`text-[15px] font-mono num leading-none ${COLOR[cell.color]}`}>
              {cell.value}
            </span>
            {cell.hint && (
              <div className="text-[8px] uppercase tracking-wider2 text-bb-muted mt-1 leading-none">
                {cell.hint}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Hero({
  numeral,
  label,
  value,
  color,
}: {
  numeral: string;
  label: string;
  value: string;
  color: Color;
}) {
  return (
    <div className="flex-1 px-4 py-3">
      <div className="flex items-baseline gap-1.5">
        <span className="display text-bb-dim text-[12px] leading-none">{numeral}</span>
        <span className="text-[9px] uppercase tracking-wider3 text-bb-dim leading-none">
          {label}
        </span>
      </div>
      <div className="mt-1.5">
        <span className={`display-roman text-[28px] leading-none num ${COLOR[color]}`}>
          {value}
        </span>
      </div>
    </div>
  );
}
