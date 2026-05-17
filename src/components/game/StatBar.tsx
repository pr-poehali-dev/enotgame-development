interface StatBarProps {
  label: string;
  value: number;
  max?: number;
  color: string;
  emoji: string;
}

export default function StatBar({ label, value, max = 100, color, emoji }: StatBarProps) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-400 flex items-center gap-1">{emoji} {label}</span>
        <span className="font-semibold text-white">{value}<span className="text-gray-500">/{max}</span></span>
      </div>
      <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}
