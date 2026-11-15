/* Scroll reveals: fade up once, never again, so content does not flicker on mobile.
   Only transform and opacity animate. MotionConfig in AppProviders honours reduced motion. */
import { motion } from "motion/react";

import { EASE } from "./ease";
const VIEWPORT = { once: true, margin: "0px 0px -12% 0px" };

export function Reveal({ as = "div", delay = 0, y = 18, className, children, ...rest }) {
  const M = motion[as] ?? motion.div;
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.6, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </M>
  );
}

const group = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } } };

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
