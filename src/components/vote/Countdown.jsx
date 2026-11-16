/* Live countdown to a moment (voting closes, voting opens). Ticks every second, reads out once. */
import { useEffect, useState } from "react";

import { cn } from "@/utils/cn";
import { formatDay, formatTime, timeParts } from "@/utils/format";

export default function Countdown({ to, label = "Voting closes in", compact = false, className }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const t = timeParts(to, now);
  const cells = [
    ["days", t.days],
    ["hours", t.hours],
    ["mins", t.minutes],
    ["secs", t.seconds],
  ];

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <p className="text-small font-semibold text-muted">
        {label} <span className="sr-only">{`${t.days} days and ${t.hours} hours, on ${formatDay(to)} at ${formatTime(to)} EAT`}</span>
      </p>
      <div aria-hidden="true" className="grid max-w-md grid-cols-4 gap-2">
        {cells.map(([unit, value]) => (
          <div key={unit} className={cn("flex flex-col items-center rounded-xl bg-surface ring-1 ring-inset ring-border", compact ? "py-2" : "py-3")}>
            <span className={cn("font-mono font-semibold tabular-nums text-foreground", compact ? "text-h4" : "text-h3")}>{String(value).padStart(2, "0")}</span>
            <span className="text-label uppercase text-muted">{unit}</span>
          </div>
        ))}
      </div>
      <p className="text-small text-muted">
        {formatDay(to)}, {formatTime(to)} EAT
      </p>
    </div>
  );
}
