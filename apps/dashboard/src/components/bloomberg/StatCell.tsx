interface Props {
  label: string;
  value: string | number;
  color?: 'green' | 'red' | 'yellow' | 'cyan' | 'orange' | 'default';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  hint?: string;
  numeral?: string;
}

const COLOR_MAP: Record<string, string> = {
  green: 'text-bb-green',
  red: 'text-bb-red',
  yellow: 'text-bb-yellow',
  cyan: 'text-bb-cyan',
  orange: 'text-bb-orange',
  default: 'text-bb-text',
};

const SIZE_MAP: Record<string, string> = {
  sm: 'text-[12px]',
  md: 'text-[16px]',
  lg: 'text-[22px]',
  xl: 'text-[34px]',
};

export function StatCell({ label, value, color = 'default', size = 'sm', hint, numeral }: Props) {
  const colorClass = COLOR_MAP[color] ?? COLOR_MAP.default;
  const valueSize = SIZE_MAP[size] ?? SIZE_MAP.sm;
  const isHero = size === 'lg' || size === 'xl';

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline gap-1.5">
        {numeral && (
          <span className="display text-bb-dim text-[11px] leading-none">
            {numeral}
          </span>
        )}
        <span className="text-[9px] uppercase tracking-wider3 text-bb-dim leading-none">
          {label}
        </span>
      </div>
      <span
        className={`${valueSize} ${colorClass} leading-none num ${
          isHero ? 'display-roman font-normal' : 'font-mono'
        }`}
      >
        {value}
      </span>
      {hint && (
        <span className="text-[9px] uppercase tracking-wider text-bb-muted leading-none mt-0.5">
          {hint}
        </span>
      )}
    </div>
  );
}
