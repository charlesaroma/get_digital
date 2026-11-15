/* Contact page */
import ContactSection from "@/components/site/ContactSection";
import PageHeader from "@/components/site/PageHeader";
import usePageMeta from "@/seo/usePageMeta";
import { usePageCopy } from "@/store/tanstackStore/queries/site";

export default function ContactPage() {
  const copy = usePageCopy("contact");
  usePageMeta({ title: "Contact", description: copy.text });
  return (
    <>
      <PageHeader eyebrow="Contact" title={copy.title} text={copy.text} />
      <ContactSection showHeading={false} />
    </>
  );
}
