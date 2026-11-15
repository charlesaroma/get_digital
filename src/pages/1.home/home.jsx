/* Home page: one file per real section in sections/ */
import { usePageCopy } from "@/store/tanstackStore/queries/site";

export default function HomePage() {
  const { hero } = usePageCopy("home");
  return <h1>{hero.title}</h1>;
}
