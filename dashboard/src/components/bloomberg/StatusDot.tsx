interface Props {
  status: 'up' | 'down' | 'warn' | 'stale';
  label?: string;
  pulse?: boolean;
}

const STATUS_COLORS: Record<Props['status'], string> = {
  up: 'bg-bb-green',
  down: 'bg-bb-red',
  warn: 'bg-bb-yellow',
  stale: 'bg-bb-muted',
};

export function StatusDot({ status, label, pulse = true }: Props) {
  const dot = STATUS_COLORS[status];
  const showPulse = pulse && status === 'up';

  return (
    <div className="flex items-center gap-1.5">
      <span className="relative flex items-center justify-center w-2 h-2">
        {showPulse && (
          <span className={`absolute inset-0 ${dot} bb-pulse`} />
        )}
        <span className={`relative w-1.5 h-1.5 ${dot}`} />
      </span>
      {label && (
        <span className="text-[9px] text-bb-dim uppercase tracking-wider3">
          {label}
        </span>
      )}
    </div>
  );
}
