/* Partners page */
import PageHeader from "@/components/site/PageHeader";
import PartnerGrid from "@/components/site/PartnerGrid";
import usePageMeta from "@/seo/usePageMeta";
import { usePageCopy } from "@/store/tanstackStore/queries/site";

export default function PartnersPage() {
  const copy = usePageCopy("partners");
  usePageMeta({ title: copy.title, description: copy.text });
  return (
    <>
      <PageHeader eyebrow="Working together" title={copy.title} text={copy.text} />
      <section aria-label="Partner organisations" className="py-12 sm:py-16 lg:py-20">
        <div className="container-gd">
          <PartnerGrid className="lg:grid-cols-2" />
        </div>
      </section>
    </>
  );
}
