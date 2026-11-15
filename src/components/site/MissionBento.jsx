/* Mission, Vision and Commitment as an asymmetric bento: a tall photo card, a navy statement,
   and a soft yellow commitment card. Stacks to one column on phones. */
import { ArrowRight, Eye, ShieldCheck, Target } from "lucide-react";

import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import { usePageCopy } from "@/store/tanstackStore/queries/site";
import HexPattern from "./HexPattern";
import PhotoFrame from "./PhotoFrame";

export default function MissionBento({ showHeading = true, showLink = true }) {
  const { about } = usePageCopy("home");
  const [mission, vision, commitment] = about.cards;

  return (
    <section aria-labelledby={showHeading ? "about-title" : undefined} aria-label={showHeading ? undefined : "Mission, vision and commitment"} className="py-16 sm:py-20 lg:py-28">
      <div className="container-gd">
        {showHeading && (
          <Reveal>
            <SectionHeading
              id="about-title"
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

        <Stagger className="mt-10 grid grid-cols-1 gap-4 sm:gap-5 lg:mt-14 lg:grid-cols-12 lg:grid-rows-[auto_1fr]">
          <StaggerItem as="article" className="flex flex-col rounded-[1.75rem] border border-border bg-surface p-6 shadow-card sm:p-8 lg:col-span-7 lg:row-span-2">
            <CardTop number={mission.number} title={mission.title} icon={Target} />
            <p className="mt-4 max-w-[30ch] font-display text-h3 tracking-tight text-foreground">{mission.text}</p>
            <PhotoFrame
              src="/images/home-mission.webp"
              alt="Learners using smartphones together at a GetDigital workshop in Lira"
              caption="Learners using smartphones together at a GetDigital workshop in Lira"
              ratio="16 / 10"
              className="mt-8 lg:mt-auto"
            />
          </StaggerItem>

          <StaggerItem as="article" className="relative overflow-hidden rounded-[1.75rem] bg-gd-navy-900 p-6 text-white sm:p-8 lg:col-span-5">
            <HexPattern className="absolute -right-10 -bottom-10 h-56 w-72 text-gd-yellow-500/15" />
            <div className="relative">
              <CardTop number={vision.number} title={vision.title} icon={Eye} dark />
              <p className="mt-4 font-display text-h2 tracking-tight text-white">{vision.text}</p>
            </div>
          </StaggerItem>

          <StaggerItem as="article" className="rounded-[1.75rem] border border-gd-yellow-300 bg-primary-soft p-6 sm:p-8 lg:col-span-5 dark:border-gd-yellow-800">
            <CardTop number={commitment.number} title={commitment.title} icon={ShieldCheck} />
            <p className="mt-4 text-body-lg text-foreground">{commitment.text}</p>
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  );
}

function CardTop({ number, title, icon: Icon, dark = false }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h3 className={dark ? "flex items-baseline gap-3 font-sans text-[1rem] font-bold text-white" : "flex items-baseline gap-3 font-sans text-[1rem] font-bold text-foreground"}>
        <span className={dark ? "font-mono text-small text-gd-yellow-400" : "font-mono text-small text-link"}>{number}</span>
        {title}
      </h3>
      <span className={dark ? "grid size-11 place-items-center rounded-full bg-white/10 text-gd-yellow-400" : "grid size-11 place-items-center rounded-full bg-surface text-gd-navy-900 shadow-card dark:text-white"}>
        <Icon aria-hidden="true" size={20} strokeWidth={1.75} />
      </span>
    </div>
  );
}
