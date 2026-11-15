/* Loading placeholders shaped like the content they stand in for.
   Skeleton is the base block; the named shapes below compose it. */
import { cn } from "@/utils/cn";

export default function Skeleton({ className }) {
  return <div aria-hidden="true" className={cn("gd-skeleton rounded-md", className)} />;
}

/* Lines of text; the last line is shorter so it reads as a paragraph. */
export function SkeletonText({ lines = 3, className }) {
  return (
    <div aria-hidden="true" className={cn("flex flex-col gap-2.5", className)}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} className={cn("h-4", i === lines - 1 && lines > 1 ? "w-3/5" : "w-full")} />
      ))}
    </div>
  );
}

/* Poll / event row: meta line, title, body, then a grid of option tiles. */
export function SkeletonPanel({ tiles = 4, className }) {
  return (
    <div aria-hidden="true" className={cn("rounded-2xl bg-surface-muted p-6 sm:p-8", className)}>
      <Skeleton className="h-6 w-36 rounded-full" />
      <Skeleton className="mt-5 h-8 w-2/3" />
      <SkeletonText lines={2} className="mt-4 max-w-md" />
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {Array.from({ length: tiles }, (_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

/* Wraps a group of skeletons with one polite status announcement. */
export function SkeletonGroup({ label = "Loading", className, children }) {
  return (
    <div role="status" aria-busy="true" aria-label={label} className={className}>
      {children}
    </div>
  );
}
