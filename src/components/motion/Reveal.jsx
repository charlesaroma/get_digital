/* Scroll reveals: play once, never again, so content does not flicker on mobile.
   Only transform and opacity animate. MotionConfig in AppProviders honours reduced motion
   (transform motion is dropped, opacity stays).

   variant="rise"  text and blocks: short 12px lift + fade (default)
   variant="fade"  secondary detail: opacity only, so it never competes with the headline
   variant="media" photos: starts at scale 0.97, never 0, and settles with the fade */
import { motion } from "motion/react";

import { EASE } from "./ease";
const VIEWPORT = { once: true, margin: "0px 0px -12% 0px" };

const START = {
  rise: (y) => ({ opacity: 0, y }),
  fade: () => ({ opacity: 0 }),
  media: () => ({ opacity: 0, scale: 0.97 }),
};
const END = {
  rise: { opacity: 1, y: 0 },
  fade: { opacity: 1 },
  media: { opacity: 1, scale: 1 },
};

export function Reveal({ as = "div", variant = "rise", delay = 0, y = 12, className, children, ...rest }) {
  const M = motion[as] ?? motion.div;
  return (
    <M
      className={className}
      initial={START[variant](y)}
      whileInView={END[variant]}
      viewport={VIEWPORT}
      transition={{ duration: variant === "media" ? 0.7 : 0.5, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </M>
  );
}

/* Siblings cascade 50ms apart. Keep groups short: past ~8 items the last one feels late. */
const group = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } } };

export function Stagger({ as = "div", className, children, ...rest }) {
  const M = motion[as] ?? motion.div;
  return (
    <M className={className} variants={group} initial="hidden" whileInView="show" viewport={VIEWPORT} {...rest}>
      {children}
    </M>
  );
}

export function StaggerItem({ as = "div", className, children, ...rest }) {
  const M = motion[as] ?? motion.div;
  return (
    <M className={className} variants={item} {...rest}>
      {children}
    </M>
  );
}
