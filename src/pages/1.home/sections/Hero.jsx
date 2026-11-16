/* Hero: left aligned message and actions, a chamfered workshop photo on the right (below on phones). */
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

import { EASE } from "@/components/motion/ease";
import { Reveal } from "@/components/motion/Reveal";
import HexPattern from "@/components/site/HexPattern";
import NodeMark, { HexDot } from "@/components/site/NodeMark";
import PhotoFrame from "@/components/site/PhotoFrame";
import Button from "@/components/ui/Button";
import { usePageCopy } from "@/store/tanstackStore/queries/site";

export default function Hero() {
  const { hero } = usePageCopy("home");
  const [lead, last] = [hero.title.split(" ").slice(0, -1).join(" "), hero.title.split(" ").slice(-1)[0]];

  return (
    <section aria-labelledby="hero-title" className="relative flex min-h-[calc(100dvh-var(--header-h))] items-center overflow-hidden">
      <HexPattern className="absolute top-0 right-0 h-full w-full text-gd-navy-900/[0.08] lg:w-[60%] [mask-image:radial-gradient(70%_70%_at_75%_40%,black,transparent)] dark:text-white/[0.08]" />
      <div className="container-gd relative grid grid-cols-1 items-center gap-12 py-12 sm:py-16 lg:grid-cols-12 lg:gap-8 xl:gap-12">
        <div className="lg:col-span-6">
          <Reveal variant="fade">
            <NodeMark label={hero.badge} />
          </Reveal>
          <Reveal delay={0.06}>
            <h1 id="hero-title" className="mt-6 max-w-[13ch] text-h1">
              {lead}{" "}
              <span className="relative inline-block whitespace-nowrap">
                <span className="relative z-10">{last}</span>
                {/* Highlight bar cut on the hex angle; wipes in from the left (transform only). */}
                <motion.span
                  aria-hidden="true"
                  className="absolute inset-x-[-0.08em] bottom-[0.06em] z-0 h-[0.38em] origin-left bg-gd-yellow-500 [clip-path:polygon(0_0,100%_0,calc(100%-0.3em)_100%,0.3em_100%)]"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, ease: EASE, delay: 0.45 }}
                />
              </span>
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-[54ch] text-body-lg text-muted">{hero.text}</p>
          </Reveal>
          <Reveal delay={0.18} className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button to={hero.primary.to} size="lg" iconRight={ArrowRight}>
              {hero.primary.label}
            </Button>
            <Button to={hero.secondary.to} size="lg" variant="outline">
              {hero.secondary.label}
            </Button>
          </Reveal>
          <Reveal variant="fade" delay={0.24}>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-small font-semibold text-muted">
              {hero.proof.map((p) => (
                <li key={p} className="flex items-center gap-2.5">
                  <HexDot />
                  {p}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
        <Reveal variant="media" delay={0.15} className="relative lg:col-span-6 xl:col-span-5 xl:col-start-8">
          {/* Yellow chamfered slab offset behind the photo gives depth without a shadow. */}
          <div aria-hidden="true" className="gd-chamfer absolute inset-0 translate-x-3 translate-y-3 bg-gd-yellow-500 sm:translate-x-5 sm:translate-y-5" />
          <PhotoFrame
            src="/images/about-community.webp"
            alt="A GetDigital community workshop at Amara Hub in Lira"
            caption="A GetDigital community workshop at Amara Hub in Lira"
            ratio="5 / 4"
            chamfer
            priority
            className="relative"
          />
        </Reveal>
      </div>
    </section>
  );
}
