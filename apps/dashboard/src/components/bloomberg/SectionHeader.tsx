import type { ReactNode } from 'react';

interface Props {
  label: string;
  live?: boolean;
  right?: ReactNode;
  numeral?: string;
}

/**
 * Sub-section divider used INSIDE a Panel to separate logical groups.
 *
 * This is NOT a replacement for Panel — Panel is a container with a title bar,
 * border, and optional `right` slot. SectionHeader is a lightweight divider
 * for grouping rows within a Panel.
 */
export function SectionHeader({ label, live, right, numeral }: Props) {
  return (
    <div className="flex items-center justify-between px-3 py-1.5 border-b border-bb-border bg-bb-panel2/60">
      <div className="flex items-center gap-2 min-w-0">
        {live && (
          <span className="relative flex items-center justify-center w-2 h-2">
            <span className="absolute inset-0 bg-bb-green bb-pulse" />
            <span className="relative w-1.5 h-1.5 bg-bb-green" />
          </span>
        )}
        {numeral && (
          <span className="display text-bb-dim text-[12px] leading-none -mt-0.5">
            {numeral}
          </span>
        )}
        <span className="text-[9px] uppercase tracking-wider3 text-bb-paper font-semibold">
          {label}
        </span>
        <span className="hidden md:block flex-1 h-px bg-bb-muted/60 ml-2 mr-2 min-w-[24px]" />
      </div>
      {right && <div>{right}</div>}
    </div>
  );
}
