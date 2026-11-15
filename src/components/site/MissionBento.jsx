/* Mission, Vision and Commitment as an asymmetric bento on flat tinted surfaces (no borders,
   no shadows): a tall mission card with a chamfered photo, one navy vision statement, and a
   soft yellow commitment card. Stacks to one column on phones. */
import { ArrowRight, Eye, ShieldCheck, Target } from "lucide-react";

import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import Button from "@/components/ui/Button";
import HexBadge from "@/components/ui/HexBadge";
import SectionHeading from "@/components/ui/SectionHeading";
import { usePageCopy } from "@/store/tanstackStore/queries/site";
import PhotoFrame from "./PhotoFrame";

export default function MissionBento({ showHeading = true, showLink = true }) {
  const { about } = usePageCopy("home");
  const [mission, vision, commitment] = about.cards;

  return (
    <section aria-labelledby={showHeading ? "about-title" : undefined} aria-label={showHeading ? undefined : "Mission, vision and commitment"} className="pt-16 pb-20 sm:pt-20 sm:pb-24 lg:pt-28 lg:pb-32">
      <div className="container-gd">
        {showHeading && (
          <Reveal>
            <SectionHeading
              id="about-title"
              number="01"
              eyebrow={about.eyebrow}
              title={about.title}
              text={about.text}
              action={
                showLink && (
                  <Button to="/about" variant="outline" iconRight={ArrowRight}>
                    More about us
                  </Button>
                )
              }
            />
          </Reveal>
        )}

        <Stagger className="mt-10 grid grid-cols-1 gap-3 sm:gap-4 lg:mt-14 lg:grid-cols-12 lg:grid-rows-[auto_1fr]">
          <StaggerItem as="article" className="flex flex-col rounded-[1.75rem] bg-surface-muted p-6 sm:p-8 lg:col-span-7 lg:row-span-2">
            <CardTop number={mission.number} title={mission.title} icon={Target} />
            <p className="mt-4 max-w-[30ch] font-display text-h3 tracking-tight text-foreground">{mission.text}</p>
            <PhotoFrame
              src="/images/home-mission.webp"
              alt="Learners using smartphones together at a GetDigital workshop in Lira"
              caption="Learners using smartphones together at a GetDigital workshop in Lira"
              ratio="16 / 10"
              chamfer
              className="mt-8 lg:mt-auto"
            />
          </StaggerItem>

          <StaggerItem as="article" className="rounded-[1.75rem] bg-gd-navy-900 p-6 sm:p-8 lg:col-span-5 dark:bg-gd-navy-800">
            <CardTop number={vision.number} title={vision.title} icon={Eye} dark />
            <p className="mt-4 font-display text-h2 tracking-tight text-white">{vision.text}</p>
          </StaggerItem>

          <StaggerItem as="article" className="rounded-[1.75rem] bg-primary-soft p-6 sm:p-8 lg:col-span-5">
            <CardTop number={commitment.number} title={commitment.title} icon={ShieldCheck} />
            <p className="mt-4 text-body-lg text-foreground">{commitment.text}</p>
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  );
}

function CardTop({ number, title, icon, dark = false }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h3 className={dark ? "flex items-baseline gap-3 font-sans text-[1rem] font-bold text-white" : "flex items-baseline gap-3 font-sans text-[1rem] font-bold text-foreground"}>
        <span className={dark ? "font-mono text-small text-gd-yellow-400" : "font-mono text-small text-link"}>{number}</span>
        {title}
      </h3>
      <HexBadge icon={icon} tone={dark ? "onDark" : "solid"} />
    </div>
  );
}
