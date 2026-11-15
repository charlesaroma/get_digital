/* Section marker for "the network": a hex node, an optional mono number, the label, and a
   hairline that draws out from the node when it scrolls into view. Replaces the all-caps eyebrow. */
import { motion } from "motion/react";

import { EASE } from "@/components/motion/ease";
import { cn } from "@/utils/cn";

/* Flat-top hexagon, the same shape as the cells in HexPattern and the logo's node cluster. */
export function HexDot({ className }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 14 12.12" className={cn("h-[0.8em] w-auto shrink-0 text-gd-yellow-500", className)}>
      <polygon points="3.5,0 10.5,0 14,6.06 10.5,12.12 3.5,12.12 0,6.06" fill="currentColor" />
    </svg>
  );
}

export default function NodeMark({ number, label, tone = "default", className }) {
  const dark = tone === "dark";
  return (
    <p className={cn("flex items-center gap-3 text-small font-semibold", dark ? "text-gd-navy-100" : "text-foreground", className)}>
      <HexDot className="text-[1.15rem]" />
      {number && <span className={cn("font-mono tabular-nums", dark ? "text-gd-yellow-400" : "text-link")}>{number}</span>}
      <span>{label}</span>
      <motion.span
        aria-hidden="true"
        className={cn("h-px w-12 origin-left sm:w-24", dark ? "bg-white/25" : "bg-border-strong")}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
      />
    </p>
  );
}
