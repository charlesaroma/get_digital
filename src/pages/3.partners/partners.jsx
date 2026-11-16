/* Partners page */
import HexStat from "@/components/site/HexStat";
import PageHeader from "@/components/site/PageHeader";
import PartnerGrid from "@/components/site/PartnerGrid";
import usePageMeta from "@/seo/usePageMeta";
import { usePageCopy, usePartners } from "@/store/tanstackStore/queries/site";

export default function PartnersPage() {
  const copy = usePageCopy("partners");
  usePageMeta({ title: copy.title, description: copy.text });
  const { data } = usePartners();
  const count = (data ?? []).filter((p) => p.active).length;
  return (
    <>
      <PageHeader eyebrow="Working together" title={copy.title} text={copy.text} aside={count > 0 ? <HexStat value={count} label={count === 1 ? "partner organisation" : "partner organisations"} cells={7} /> : undefined} />
      <section aria-label="Partner organisations" className="py-12 sm:py-16 lg:py-20">
        <div className="container-gd">
          <PartnerGrid className="lg:grid-cols-2" />
        </div>
      </section>
    </>
  );
}
