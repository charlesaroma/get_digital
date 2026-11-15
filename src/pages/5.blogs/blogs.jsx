/* Blogs page */
import { usePageCopy } from "@/store/tanstackStore/queries/site";

export default function BlogsPage() {
  const copy = usePageCopy("blogs");
  return <h1>{copy.title ?? "Blogs"}</h1>;
}
