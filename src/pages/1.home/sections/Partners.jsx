/* Partners on the home page: heading on the left (sticky on desktop), cards on the right. */
import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/motion/Reveal";
import NodeMark from "@/components/site/NodeMark";
import PartnerGrid from "@/components/site/PartnerGrid";
import Button from "@/components/ui/Button";
import { usePageCopy } from "@/store/tanstackStore/queries/site";

export default function Partners() {
  const { partners } = usePageCopy("home");
  return (
    <section aria-labelledby="partners-title" className="py-16 sm:py-20 lg:py-28">
      <div className="container-gd grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
        <Reveal className="lg:col-span-5 xl:col-span-4">
          <div className="lg:sticky lg:top-28">
            <NodeMark number="03" label={partners.eyebrow} />
            <h2 id="partners-title" className="mt-4 text-h2">
              {partners.title}
            </h2>
            <p className="mt-4 max-w-[46ch] text-body-lg text-muted">{partners.text}</p>
            <Button to="/partners" variant="outline" iconRight={ArrowRight} className="mt-8">
              All partners
            </Button>
          </div>
        </Reveal>
        <PartnerGrid className="lg:col-span-7 xl:col-span-8" />
      </div>
    </section>
  );
}
