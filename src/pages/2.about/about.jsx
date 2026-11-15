/* About page */
import { usePageCopy } from "@/store/tanstackStore/queries/site";

export default function AboutPage() {
  const copy = usePageCopy("about");
  return <h1>{copy.title ?? "About"}</h1>;
}
