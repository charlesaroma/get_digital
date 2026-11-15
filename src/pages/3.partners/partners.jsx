/* Partners page */
import { usePageCopy } from "@/store/tanstackStore/queries/site";

export default function PartnersPage() {
  const copy = usePageCopy("partners");
  return <h1>{copy.title ?? "Partners"}</h1>;
}
