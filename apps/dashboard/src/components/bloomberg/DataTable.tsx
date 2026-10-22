'use client';

interface Column {
  key: string;
  label: string;
  align?: 'left' | 'right';
  width?: string;
}

interface Props {
  columns: Column[];
  rows: Record<string, any>[];
  onRowClick?: (row: Record<string, any>) => void;
  selectedKey?: string;
  numbered?: boolean;
}

export function DataTable({ columns, rows, onRowClick, selectedKey, numbered = false }: Props) {
  return (
    <div className="overflow-x-auto log-scroll">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-bb-border bg-bb-panel2/60">
            {numbered && (
              <th className="py-1.5 px-2 text-[9px] uppercase tracking-wider3 text-bb-dim text-right w-8">
                №
              </th>
            )}
            {columns.map((col) => (
              <th
                key={col.key}
                style={col.width ? { width: col.width } : undefined}
                className={`py-1.5 px-2 text-[9px] uppercase tracking-wider3 text-bb-dim font-medium ${
                  col.align === 'right' ? 'text-right' : 'text-left'
                }`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const key = row.id ?? row.key ?? i;
            const isSelected = selectedKey != null && String(key) === String(selectedKey);
            return (
              <tr
                key={key}
                onClick={() => onRowClick?.(row)}
                className={`
                  cursor-pointer transition-colors
                  ${isSelected
                    ? 'bg-bb-green/[0.06] outline outline-1 -outline-offset-1 outline-bb-green/30'
                    : i % 2 === 0
                      ? 'bg-transparent'
                      : 'bg-bb-panel2/40'}
                  hover:bg-bb-green/[0.04]
                `}
              >
                {numbered && (
                  <td className="py-1.5 px-2 text-[10px] text-bb-dim font-mono text-right num">
                    {String(i + 1).padStart(2, '0')}
                  </td>
                )}
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`py-1.5 px-2 text-[11px] text-bb-text font-mono num ${
                      col.align === 'right' ? 'text-right' : 'text-left'
                    }`}
                  >
                    {row[col.key] ?? <span className="text-bb-muted">—</span>}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
