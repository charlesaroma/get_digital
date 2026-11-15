/* Icon holder cut as a flat-top hexagon, so icons carry the brand shape instead of a plain circle. */
import { cn } from "@/utils/cn";

const sizes = { md: "h-[2.6rem] w-12", lg: "h-[3.25rem] w-15" };
const tones = {
  soft: "bg-primary-soft text-gd-navy-900 dark:text-gd-yellow-100",
  solid: "bg-primary text-gd-navy-900",
  onDark: "bg-white/10 text-gd-yellow-400",
};

export default function HexBadge({ icon: Icon, size = "md", tone = "soft", className }) {
  return (
    <span aria-hidden="true" className={cn("gd-hex grid shrink-0 place-items-center", sizes[size], tones[tone], className)}>
      <Icon size={size === "lg" ? 24 : 20} strokeWidth={1.75} />
    </span>
  );
}
