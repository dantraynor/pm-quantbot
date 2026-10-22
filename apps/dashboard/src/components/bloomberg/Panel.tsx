import type { ReactNode } from 'react';

interface Props {
  title?: string;
  live?: boolean;
  right?: ReactNode;
  className?: string;
  children: ReactNode;
  index?: string;
}

export function Panel({ title, live, right, className, children, index }: Props) {
  return (
    <section className={`relative border border-bb-border bg-bb-panel ${className ?? ''}`}>
      {title && (
        <header className="flex items-center justify-between px-3 py-1.5 border-b border-bb-border bg-bb-panel2">
          <div className="flex items-center gap-2.5 min-w-0">
            {live ? (
              <span className="relative flex items-center justify-center w-2 h-2">
                <span className="absolute inset-0 bg-bb-green bb-pulse" />
                <span className="relative w-1.5 h-1.5 bg-bb-green" />
              </span>
            ) : (
              <span className="w-1 h-1 bg-bb-muted" />
            )}
            {index && (
              <span className="display text-bb-paper text-[14px] leading-none -mt-0.5">
                {index}
              </span>
            )}
            <span className="text-[10px] uppercase tracking-wider3 text-bb-paper font-semibold truncate">
              {title}
            </span>
            <span className="hidden md:block flex-1 h-px bg-bb-muted/60 ml-2 mr-2" />
          </div>
          {right && <div className="flex items-center gap-2 shrink-0">{right}</div>}
        </header>
      )}
      <div>{children}</div>
    </section>
  );
}
