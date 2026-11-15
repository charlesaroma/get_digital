/* Hex network texture taken from the node cluster in the logo. Decorative only. */
import { useId } from "react";

import { cn } from "@/utils/cn";

export default function HexPattern({ className, stroke = "currentColor", size = 28 }) {
  const id = useId();
  const h = size * Math.sqrt(3);
  const s = size;
  const d = `M${s / 2} 0 L${s * 1.5} 0 L${s * 2} ${h / 2} L${s * 1.5} ${h} L${s / 2} ${h} L0 ${h / 2} Z`;
  return (
    <svg aria-hidden="true" focusable="false" className={cn("pointer-events-none", className)}>
      <defs>
        <pattern id={id} width={s * 3} height={h} patternUnits="userSpaceOnUse">
          <path d={d} fill="none" stroke={stroke} strokeWidth="1.25" />
          <path d={`M${s * 2} ${h / 2} L${s * 3} ${h / 2}`} fill="none" stroke={stroke} strokeWidth="1.25" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
