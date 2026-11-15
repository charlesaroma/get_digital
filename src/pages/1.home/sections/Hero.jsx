/* Hero: left aligned message and actions, the AI Lab preview on the right (below on phones). */
import { ArrowRight, BookOpen, Check, GraduationCap, MapPin } from "lucide-react";
import { motion } from "motion/react";

import { EASE } from "@/components/motion/ease";
import { Reveal } from "@/components/motion/Reveal";
import HexPattern from "@/components/site/HexPattern";
import Button from "@/components/ui/Button";
import { usePageCopy } from "@/store/tanstackStore/queries/site";
import AiLabWidget from "./AiLabWidget";

export default function Hero() {
  const { hero } = usePageCopy("home");
  const [lead, last] = [hero.title.split(" ").slice(0, -1).join(" "), hero.title.split(" ").slice(-1)[0]];

  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <HexPattern className="absolute top-0 right-0 hidden h-full w-[55%] text-gd-navy-900/[0.045] lg:block [mask-image:radial-gradient(70%_70%_at_70%_40%,black,transparent)] dark:text-white/[0.05]" />
      <div className="container-gd relative grid grid-cols-1 items-center gap-12 pt-10 pb-16 sm:pt-14 sm:pb-20 lg:grid-cols-12 lg:gap-8 lg:pt-16 lg:pb-24 xl:gap-12">
        <div className="lg:col-span-6">
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-2 text-small font-semibold text-foreground shadow-card">
              <MapPin aria-hidden="true" size={16} strokeWidth={1.75} className="text-gd-yellow-700 dark:text-gd-yellow-400" />
              {hero.badge}
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 id="hero-title" className="mt-6 max-w-[13ch] text-h1">
              {lead}{" "}
              <span className="relative inline-block whitespace-nowrap">
                <span className="relative z-10">{last}</span>
                <svg aria-hidden="true" viewBox="0 0 220 18" preserveAspectRatio="none" className="absolute -bottom-1 left-0 z-0 h-[0.32em] w-full">
                  <motion.path
                    d="M3 12 C 50 4, 120 3, 217 9"
                    fill="none"
                    stroke="var(--color-gd-yellow-500)"
                    strokeWidth="9"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}
                  />
                </svg>
              </span>
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-[54ch] text-body-lg text-muted">{hero.text}</p>
          </Reveal>
          <Reveal delay={0.18} className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button to={hero.primary.to} size="lg" icon={BookOpen} iconRight={ArrowRight}>
              {hero.primary.label}
            </Button>
            <Button to={hero.secondary.to} size="lg" variant="outline" icon={GraduationCap}>
              {hero.secondary.label}
            </Button>
          </Reveal>
          <Reveal delay={0.24}>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-small font-semibold text-muted">
              {hero.proof.map((p) => (
                <li key={p} className="flex items-center gap-2">
                  <Check aria-hidden="true" size={16} strokeWidth={2} className="text-success" />
                  {p}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
        <Reveal delay={0.15} y={28} className="lg:col-span-6 xl:col-span-5 xl:col-start-8">
          <AiLabWidget />
        </Reveal>
      </div>
    </section>
  );
}
