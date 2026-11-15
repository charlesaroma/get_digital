/* Press page */
import { usePageCopy } from "@/store/tanstackStore/queries/site";

export default function PressPage() {
  const copy = usePageCopy("press");
  return <h1>{copy.title ?? "Press"}</h1>;
}
