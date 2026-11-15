/* Vote page */
import { usePageCopy } from "@/store/tanstackStore/queries/site";

export default function VotePage() {
  const copy = usePageCopy("vote");
  return <h1>{copy.title}</h1>;
}
