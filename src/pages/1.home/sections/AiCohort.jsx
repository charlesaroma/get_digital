/* Free AI Learning spotlight: high contrast navy card, cohort date, six benefits and registration in a modal. */
import { BadgeCheck, BookOpen, CalendarDays, CircleCheck, MessageCircleQuestion, ShieldCheck, Smartphone, Zap } from "lucide-react";
import { useState } from "react";

import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import CourseRegistrationForm from "@/components/site/CourseRegistrationForm";
import HexPattern from "@/components/site/HexPattern";
import PhotoFrame from "@/components/site/PhotoFrame";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { usePageCopy } from "@/store/tanstackStore/queries/site";

const POINT_ICONS = [Smartphone, BookOpen, MessageCircleQuestion, ShieldCheck, Zap, BadgeCheck];

export default function AiCohort() {
  const { freeAi } = usePageCopy("home");
  const [open, setOpen] = useState(false);

  return (
    <section id="free-ai-course" aria-labelledby="free-ai-title" className="scroll-mt-20 py-6 sm:py-10 lg:py-14">
      <div className="container-gd">
        <Reveal className="relative isolate overflow-hidden rounded-[2rem] bg-gd-navy-900 text-white">
          <HexPattern className="absolute -top-8 right-0 -z-10 h-72 w-full text-gd-yellow-500/[0.09] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
          <div className="grid grid-cols-1 gap-10 p-6 sm:p-10 lg:grid-cols-12 lg:gap-12 lg:p-14">
            <div className="lg:col-span-7">
              <p className="eyebrow text-gd-yellow-400">{freeAi.eyebrow}</p>
              <h2 id="free-ai-title" className="mt-3 max-w-[18ch] text-h2 text-white">
                {freeAi.title}
              </h2>
              <p className="mt-4 text-body-lg font-semibold text-gd-navy-100">{freeAi.class}</p>

              <div className="mt-6 flex flex-wrap gap-2">
                <p className="inline-flex min-h-11 items-center gap-2 rounded-full bg-gd-yellow-500 px-4 text-small font-bold text-gd-navy-900">
                  <CalendarDays aria-hidden="true" size={18} strokeWidth={1.75} />
                  <time dateTime={freeAi.startsOn}>{freeAi.startLabel}</time>
                </p>
                {freeAi.facts.map((f) => (
                  <p key={f} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white/10 px-4 text-small font-semibold text-white ring-1 ring-inset ring-white/15">
                    <CircleCheck aria-hidden="true" size={16} strokeWidth={1.75} className="text-gd-yellow-400" />
                    {f}
                  </p>
                ))}
              </div>

              <Stagger as="ul" className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {freeAi.points.map((point, i) => {
                  const Icon = POINT_ICONS[i % POINT_ICONS.length];
                  return (
                    <StaggerItem as="li" key={point} className="flex items-center gap-3 rounded-2xl bg-white/[0.06] p-3.5 ring-1 ring-inset ring-white/10">
                      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gd-yellow-500 text-gd-navy-900">
                        <Icon aria-hidden="true" size={19} strokeWidth={1.75} />
                      </span>
                      <span className="font-semibold">{point}</span>
                    </StaggerItem>
                  );
                })}
              </Stagger>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" onClick={() => setOpen(true)} aria-haspopup="dialog">
                  {freeAi.cta}
                </Button>
                <Button to="/contact" size="lg" variant="onDark" icon={MessageCircleQuestion}>
                  {freeAi.secondaryCta}
                </Button>
              </div>
            </div>
            <div className="lg:col-span-5">
              <PhotoFrame
                src="/images/home-ai-course.webp"
                alt="A young woman learning on her smartphone at home in the evening"
                caption="A young woman learning AI on her smartphone at home"
                ratio="4 / 5"
                tone="dark"
                className="mx-auto max-w-md lg:max-w-none"
              />
            </div>
          </div>
        </Reveal>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Register for the free AI course" description={`${freeAi.class}. ${freeAi.startLabel}.`}>
        <CourseRegistrationForm startLabel="Monday, 11 January 2027" onDone={() => setOpen(false)} />
      </Modal>
    </section>
  );
}
