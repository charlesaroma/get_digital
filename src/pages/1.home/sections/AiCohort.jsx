/* Free AI Learning spotlight: light editorial layout on warm stone. Plain course facts,
   a numbered benefit list with hairlines, and a calendar card resting on the photo.
   Registration opens in a modal. */
import { ArrowRight, MessageCircleQuestion } from "lucide-react";
import { useState } from "react";

import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import CourseRegistrationForm from "@/components/site/CourseRegistrationForm";
import NodeMark, { HexDot } from "@/components/site/NodeMark";
import PhotoFrame from "@/components/site/PhotoFrame";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { usePageCopy } from "@/store/tanstackStore/queries/site";

export default function AiCohort() {
  const { freeAi } = usePageCopy("home");
  const [open, setOpen] = useState(false);
  const start = new Date(`${freeAi.startsOn}T09:00:00`);
  const month = start.toLocaleDateString("en-GB", { month: "short" });
  const day = start.getDate();
  const weekday = start.toLocaleDateString("en-GB", { weekday: "long" });
  const year = start.getFullYear();

  return (
    <section id="free-ai-course" aria-labelledby="free-ai-title" className="scroll-mt-20 border-y border-border bg-gd-stone-100 py-16 sm:py-20 lg:py-28 dark:bg-gd-navy-900/40">
      <div className="container-gd grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <Reveal>
            <NodeMark number="02" label={freeAi.eyebrow} />
            <h2 id="free-ai-title" className="mt-4 max-w-[18ch] text-h2">
              {freeAi.title}
            </h2>
            <p className="mt-4 text-body-lg text-muted">
              <span className="font-semibold text-foreground">{freeAi.class}</span>, starting {weekday}, {day} {start.toLocaleDateString("en-GB", { month: "long" })} {year}.
            </p>
            <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-small font-semibold text-foreground">
              {freeAi.facts.map((f) => (
                <li key={f} className="flex items-center gap-2.5">
                  <HexDot />
                  {f}
                </li>
              ))}
            </ul>
          </Reveal>

          <Stagger as="ol" className="mt-10 grid grid-cols-1 gap-x-10 sm:grid-cols-2">
            {freeAi.points.map((point, i) => (
              <StaggerItem as="li" key={point} className="flex items-baseline gap-4 border-t border-border-strong py-4">
                <span className="font-mono text-small font-semibold text-link tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-body-lg font-semibold text-foreground">{point}</span>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button size="lg" iconRight={ArrowRight} onClick={() => setOpen(true)} aria-haspopup="dialog">
              {freeAi.cta}
            </Button>
            <Button to="/contact" size="lg" variant="ghost" icon={MessageCircleQuestion}>
              {freeAi.secondaryCta}
            </Button>
          </Reveal>
        </div>

        <Reveal variant="media" delay={0.1} className="relative lg:col-span-5">
          <PhotoFrame
            src="/images/home-ai-course.webp"
            alt="A young woman learning on her smartphone at home in the evening"
            caption="A young woman learning AI on her smartphone at home"
            ratio="4 / 5"
            chamfer
            className="ml-auto max-w-md lg:max-w-none"
          />
          <div className="absolute -bottom-6 left-0 flex items-center gap-4 rounded-2xl bg-surface p-3 pr-6 shadow-lift ring-1 ring-border sm:-left-6 lg:-left-10">
            <div className="flex w-16 flex-col overflow-hidden rounded-xl text-center ring-1 ring-border">
              <span className="bg-primary py-1 text-label font-bold tracking-[0.12em] text-gd-navy-900 uppercase">{month}</span>
              <span className="py-1.5 font-display text-[1.75rem] leading-none font-bold text-foreground">{day}</span>
            </div>
            <div>
              <p className="text-small font-semibold text-foreground">Cohort starts {weekday}</p>
              <p className="text-small text-muted">Four weeks, free</p>
            </div>
          </div>
        </Reveal>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Register for the free AI course" description={`${freeAi.class}. ${freeAi.startLabel}.`}>
        <CourseRegistrationForm startLabel={`${weekday}, ${day} ${start.toLocaleDateString("en-GB", { month: "long" })} ${year}`} onDone={() => setOpen(false)} />
      </Modal>
    </section>
  );
}
