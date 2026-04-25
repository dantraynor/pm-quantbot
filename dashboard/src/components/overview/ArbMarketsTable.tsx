'use client';

import { Panel, DataTable } from '@/components/bloomberg';
import type { MarketSummary } from '@/lib/types';

interface Props {
  markets: MarketSummary[];
  selectedMarket?: string;
  onSelectMarket?: (id: string) => void;
}

const COLUMNS = [
  { key: 'name', label: 'Market', align: 'left' as const },
  { key: 'yesBestBid', label: 'Y · Bid', align: 'right' as const },
  { key: 'yesBestAsk', label: 'Y · Ask', align: 'right' as const },
  { key: 'noBestBid', label: 'N · Bid', align: 'right' as const },
  { key: 'noBestAsk', label: 'N · Ask', align: 'right' as const },
  { key: 'sum', label: 'Σ', align: 'right' as const },
  { key: 'edge', label: 'Edge', align: 'right' as const },
];

function formatPrice(v: number): string {
  return v.toFixed(3);
}

export function ArbMarketsTable({ markets, selectedMarket, onSelectMarket }: Props) {
  const rows = markets.map((m) => ({
    id: m.id,
    name: m.name.length > 36 ? m.name.slice(0, 34) + '…' : m.name,
    yesBestBid: formatPrice(m.yesBestBid),
    yesBestAsk: formatPrice(m.yesBestAsk),
    noBestBid: formatPrice(m.noBestBid),
    noBestAsk: formatPrice(m.noBestAsk),
    sum: formatPrice(m.sum),
    edge: (
      <span className={m.edge > 0 ? 'text-bb-green' : m.edge < 0 ? 'text-bb-red' : 'text-bb-dim'}>
        {m.edge > 0 ? '+' : ''}{formatPrice(m.edge)}
      </span>
    ),
  }));

  const right = (
    <span className="text-[9px] uppercase tracking-wider3 text-bb-dim num">
      {markets.length} <span className="text-bb-muted">tracked</span>
    </span>
  );

  return (
    <Panel title="Arb Markets" live index="III" right={right}>
      {markets.length === 0 ? (
        <div className="flex items-center justify-center h-16 text-bb-dim text-[10px] uppercase tracking-wider">
          <span className="display text-bb-dim text-[14px] mr-2">∅</span>
          Waiting for market data
        </div>
      ) : (
        <DataTable
          columns={COLUMNS}
          rows={rows}
          selectedKey={selectedMarket}
          onRowClick={(row) => onSelectMarket?.(row.id)}
          numbered
        />
      )}
    </Panel>
  );
}
