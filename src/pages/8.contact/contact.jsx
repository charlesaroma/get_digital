/* Contact page */
import { usePageCopy } from "@/store/tanstackStore/queries/site";

export default function ContactPage() {
  const copy = usePageCopy("contact");
  return <h1>{copy.title ?? "Contact"}</h1>;
}
