interface Props {
  current: number;
  total: number;
}

export function ReportStepper({ current, total }: Props) {
  const percent = (current / total) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-body font-medium text-ink-primary">
          {current} / {total}
        </span>
        <span className="text-xs font-body text-ink-muted">제보 단계</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <div
          className="h-full bg-primary-500 transition-all duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
