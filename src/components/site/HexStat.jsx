/* A real number shown inside a small honeycomb. The centre cell carries the count; the
   neighbouring cells are the network around it. Used in page headers (partners, press). */
import { motion } from "motion/react";

import { EASE } from "@/components/motion/ease";
import { cn } from "@/utils/cn";

const R = 60; // cell radius
const GAP = 0.93; // shrink each cell a little so the cells do not touch
const STEP = Math.sqrt(3) * R; // distance between neighbouring flat-top cell centres

const rad = (deg) => (deg * Math.PI) / 180;
const points = (cx, cy, r) =>
  Array.from({ length: 6 }, (_, i) => `${(cx + r * Math.cos(rad(60 * i))).toFixed(1)},${(cy + r * Math.sin(rad(60 * i))).toFixed(1)}`).join(" ");

/* Neighbour directions, in order of use. Flat-top neighbours sit at 30, 90, 150, 210, 270, 330 degrees. */
const DIRECTIONS = [330, 90, 210, 30, 150, 270];
const FILLS = ["fill-gd-navy-900 dark:fill-gd-navy-700", "fill-gd-stone-200 dark:fill-gd-navy-800", "fill-gd-yellow-200 dark:fill-gd-yellow-900", "fill-gd-stone-200 dark:fill-gd-navy-800", "fill-gd-navy-900 dark:fill-gd-navy-700", "fill-gd-stone-200 dark:fill-gd-navy-800"];

export default function HexStat({ value, label, cells = 7, className }) {
  const neighbours = DIRECTIONS.slice(0, Math.max(0, cells - 1)).map((deg, i) => ({
    x: STEP * Math.cos(rad(deg)),
    y: STEP * Math.sin(rad(deg)),
    fill: FILLS[i],
  }));

  return (
    <figure role="img" aria-label={`${value} ${label}`} className={cn("w-full max-w-[17rem]", className)}>
      <svg viewBox="-170 -165 340 330" aria-hidden="true" className="w-full overflow-visible">
        {neighbours.map((c, i) => (
          <motion.polygon
            key={i}
            points={points(c.x, c.y, R * GAP)}
            className={c.fill}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.25 + i * 0.07 }}
          />
        ))}
        <motion.polygon
          points={points(0, 0, R * GAP)}
          className="fill-gd-yellow-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.15 }}
        />
        <text x="0" y="0" textAnchor="middle" dominantBaseline="central" className="fill-gd-navy-900 font-display text-[2.6rem] font-bold tabular-nums">
          {value}
        </text>
      </svg>
      <figcaption className="mt-3 text-center text-small font-semibold text-muted">{label}</figcaption>
    </figure>
  );
}
