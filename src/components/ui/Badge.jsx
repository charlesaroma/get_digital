/* Small status or category label. Never colour alone: always a word. */
import { cn } from "@/utils/cn";

const tones = {
  neutral: "bg-surface-muted text-foreground ring-border",
  primary: "bg-primary-soft text-gd-yellow-900 ring-gd-yellow-300 dark:text-gd-yellow-100 dark:ring-gd-yellow-800",
  navy: "bg-gd-navy-900 text-white ring-gd-navy-900",
  success: "bg-success-soft text-success ring-transparent",
  info: "bg-info-soft text-info ring-transparent",
  onDark: "bg-white/10 text-white ring-white/15",
};

export default function Badge({ tone = "neutral", icon: Icon, className, children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-small font-semibold whitespace-nowrap ring-1 ring-inset",
        tones[tone],
        className,
      )}
    >
      {Icon && <Icon aria-hidden="true" size={15} strokeWidth={1.75} />}
      {children}
    </span>
  );
}
