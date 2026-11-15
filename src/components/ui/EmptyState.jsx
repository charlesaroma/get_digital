/* Empty or error state: what happened and what to do next. */
import { cn } from "@/utils/cn";

export default function EmptyState({ icon: Icon, title, text, action, tone = "neutral", className }) {
  return (
    <div
      role={tone === "error" ? "alert" : undefined}
      className={cn(
        "flex flex-col items-start gap-4 rounded-2xl border border-dashed border-border-strong bg-surface p-6 sm:flex-row sm:items-center sm:p-8",
        className,
      )}
    >
      {Icon && (
        <span
          className={cn(
            "grid size-12 shrink-0 place-items-center rounded-xl",
            tone === "error" ? "bg-error-soft text-error" : "bg-primary-soft text-gd-navy-900 dark:text-gd-yellow-100",
          )}
        >
          <Icon aria-hidden="true" size={22} strokeWidth={1.75} />
        </span>
      )}
      <div className="flex-1">
        <p className="font-bold text-foreground">{title}</p>
        {text && <p className="mt-1 max-w-[60ch] text-muted">{text}</p>}
      </div>
      {action}
    </div>
  );
}
