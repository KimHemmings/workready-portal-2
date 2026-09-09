type Props = {
  percent: number;
  size?: number;
  label?: string;
  testId?: string;
};

export default function ProgressRing({ percent, size = 132, label = "complete", testId }: Props) {
  const stroke = 12;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, percent)) / 100) * circumference;

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${percent}% ${label}`}
      data-testid={testId}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          className="stroke-brand-purple-soft"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          strokeLinecap="round"
          className="stroke-brand-purple transition-[stroke-dashoffset] duration-1000 ease-out"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold font-heading tabular-nums">{percent}%</span>
        <span className="text-xs text-muted-foreground uppercase tracking-wider">{label}</span>
      </div>
    </div>
  );
}
