'use client';

import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from 'recharts';
import { Panel } from '@/components/bloomberg';
import { num } from '@/lib/format';
import type { TradeEvent } from '@/lib/types';

const RANGES = [
  { label: '1H', ms: 60 * 60 * 1000 },
  { label: '1D', ms: 24 * 60 * 60 * 1000 },
  { label: '7D', ms: 7 * 24 * 60 * 60 * 1000 },
  { label: '30D', ms: 30 * 24 * 60 * 60 * 1000 },
] as const;

interface Props {
  trades: TradeEvent[];
}

function EquityCurveInner({ trades }: Props) {
  const [rangeIdx, setRangeIdx] = useState(1);

  const { data, cumulative, peak, trough } = useMemo(() => {
    const cutoff = Date.now() - RANGES[rangeIdx].ms;
    let cum = 0;
    let pk = -Infinity;
    let tr = Infinity;
    const points = trades
      .slice()
      .sort((a, b) => a.timestamp - b.timestamp)
      .filter((t) => t.timestamp >= cutoff)
      .map((t) => {
        const pnl = num((t as any).pnl ?? (t as any).grossPnl);
        cum += pnl;
        if (cum > pk) pk = cum;
        if (cum < tr) tr = cum;
        return {
          time: new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          pnl: parseFloat(cum.toFixed(2)),
        };
      });
    return {
      data: points,
      cumulative: cum,
      peak: pk === -Infinity ? 0 : pk,
      trough: tr === Infinity ? 0 : tr,
    };
  }, [trades, rangeIdx]);

  const isPositive = cumulative >= 0;
  const strokeColor = isPositive ? '#C5FF3D' : '#FF4A4A';
  const fillId = isPositive ? 'eq-grad-pos' : 'eq-grad-neg';

  const right = (
    <div className="flex items-center gap-3">
      <span className="text-[9px] uppercase tracking-wider3 text-bb-dim">PEAK</span>
      <span className="text-[10px] text-bb-green num">${peak.toFixed(2)}</span>
      <span className="text-[9px] uppercase tracking-wider3 text-bb-dim">TROUGH</span>
      <span className="text-[10px] text-bb-red num">${trough.toFixed(2)}</span>
      <span className="w-px h-3 bg-bb-muted" />
      {RANGES.map((r, i) => (
        <button
          key={r.label}
          onClick={() => setRangeIdx(i)}
          className={`px-1.5 py-0.5 text-[10px] uppercase tracking-wider transition-colors ${
            i === rangeIdx
              ? 'text-bb-paper bg-bb-paper/10 border-b border-bb-orange'
              : 'text-bb-dim hover:text-bb-paper border-b border-transparent'
          }`}
        >
          {r.label}
        </button>
      ))}
    </div>
  );

  return (
    <Panel title="Equity Curve" live index="I" right={right} className="flex-1 flex flex-col">
      <div className="flex items-baseline gap-3 px-4 pt-3 pb-1">
        <span className="display-roman text-bb-paper text-[36px] leading-none num">
          {cumulative >= 0 ? '+' : ''}${cumulative.toFixed(2)}
        </span>
        <span className={`text-[10px] uppercase tracking-wider3 num ${isPositive ? 'text-bb-green' : 'text-bb-red'}`}>
          cumulative
        </span>
      </div>

      <div className="px-2 pb-3 flex-1 min-h-0">
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-[180px] text-bb-dim text-[10px] uppercase tracking-wider">
            <span className="display text-bb-dim text-[14px] mr-2">∅</span>
            No trades in range
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={196}>
            <AreaChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 4 }}>
              <defs>
                <linearGradient id="eq-grad-pos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C5FF3D" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="#C5FF3D" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="eq-grad-neg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF4A4A" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="#FF4A4A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                tick={{ fontSize: 9, fill: '#8A8478', fontFamily: 'IBM Plex Mono', letterSpacing: '0.1em' }}
                axisLine={{ stroke: '#2E2E38' }}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 9, fill: '#8A8478', fontFamily: 'IBM Plex Mono', letterSpacing: '0.1em' }}
                width={48}
                axisLine={{ stroke: '#2E2E38' }}
                tickLine={false}
                tickFormatter={(v: number) => `$${v.toFixed(0)}`}
              />
              <ReferenceLine y={0} stroke="#45433D" strokeDasharray="2 4" />
              <Tooltip
                contentStyle={{
                  background: '#06060A',
                  border: '1px solid #45433D',
                  borderRadius: 0,
                  fontSize: 10,
                  fontFamily: 'IBM Plex Mono',
                  color: '#ECE6D9',
                  boxShadow: '0 0 0 1px #131318, 0 6px 18px rgba(0,0,0,0.6)',
                  padding: '6px 10px',
                }}
                labelStyle={{ color: '#8A8478', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase' }}
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'P&L']}
                cursor={{ stroke: '#45433D', strokeDasharray: '2 4' }}
              />
              <Area
                type="monotone"
                dataKey="pnl"
                stroke={strokeColor}
                strokeWidth={1.75}
                fill={`url(#${fillId})`}
                dot={false}
                activeDot={{ r: 3.5, fill: strokeColor, stroke: '#06060A', strokeWidth: 1.5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </Panel>
  );
}

export const EquityCurve = React.memo(EquityCurveInner);
