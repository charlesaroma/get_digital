/* About page */
import { ArrowRight, Globe, Lightbulb, Lock, Users } from "lucide-react";

import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import MissionBento from "@/components/site/MissionBento";
import PageHeader from "@/components/site/PageHeader";
import PhotoFrame from "@/components/site/PhotoFrame";
import Button from "@/components/ui/Button";
import usePageMeta from "@/seo/usePageMeta";
import { usePageCopy } from "@/store/tanstackStore/queries/site";

const VALUE_ICONS = { trust: Lock, accessibility: Users, innovation: Lightbulb, reach: Globe };

export default function AboutPage() {
  const copy = usePageCopy("about");
  usePageMeta({ title: copy.title, description: copy.text });

  return (
    <>
      <PageHeader eyebrow="About" title={copy.title} text={copy.text} />
      <section aria-label="Our community" className="pt-12 sm:pt-16">
        <div className="container-gd">
          <Reveal>
            <PhotoFrame
              src="/images/about-community.webp"
              alt="A GetDigital community workshop at Amara Hub in Lira"
              caption="A GetDigital community workshop at Amara Hub in Lira"
              ratio="21 / 9"
              priority
              className="rounded-[1.75rem] [aspect-ratio:4/3] sm:[aspect-ratio:21/9]"
            />
          </Reveal>
        </div>
      </section>
      <MissionBento showHeading={false} />
      <section aria-labelledby="values-title" className="pb-16 sm:pb-20 lg:pb-28">
        <div className="container-gd grid grid-cols-1 gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <p className="eyebrow text-link">Values</p>
            <h2 id="values-title" className="mt-3 text-h2">
              {copy.valuesTitle}
            </h2>
            <Button to="/#free-ai-course" iconRight={ArrowRight} className="mt-8">
              Join the free AI course
            </Button>
          </Reveal>
          <Stagger as="ul" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-8">
            {copy.values.map((v, i) => {
              const Icon = VALUE_ICONS[v.id] ?? Lightbulb;
              return (
                <StaggerItem as="li" key={v.id} className={i === 0 ? "rounded-2xl bg-gd-navy-900 p-6 text-white sm:p-7" : "rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-7"}>
                  <span className={i === 0 ? "grid size-11 place-items-center rounded-xl bg-gd-yellow-500 text-gd-navy-900" : "grid size-11 place-items-center rounded-xl bg-primary-soft text-gd-navy-900 dark:text-gd-yellow-100"}>
                    <Icon aria-hidden="true" size={20} strokeWidth={1.75} />
                  </span>
                  <h3 className={i === 0 ? "mt-5 font-display text-h4 text-white" : "mt-5 font-display text-h4"}>{v.title}</h3>
                  <p className={i === 0 ? "mt-2 text-gd-navy-100" : "mt-2 text-muted"}>{v.text}</p>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>
    </>
  );
}
