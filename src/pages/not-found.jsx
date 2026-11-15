/* Not found, rendered inside the site chrome */
import { ArrowLeft, BookOpen } from "lucide-react";

import { Reveal } from "@/components/motion/Reveal";
import HexPattern from "@/components/site/HexPattern";
import Button from "@/components/ui/Button";
import usePageMeta from "@/seo/usePageMeta";
import { usePageCopy } from "@/store/tanstackStore/queries/site";

export default function NotFound() {
  const copy = usePageCopy("notFound");
  usePageMeta({ title: copy.title });
  return (
    <section className="relative overflow-hidden">
      <HexPattern className="absolute inset-0 size-full text-gd-navy-900/[0.04] dark:text-white/[0.04]" />
      <Reveal className="container-gd relative flex min-h-[60dvh] flex-col justify-center py-20">
        <p className="font-mono text-small font-semibold text-link">Error 404</p>
        <h1 className="mt-3 max-w-[16ch] text-h1">{copy.title}</h1>
        <p className="mt-4 max-w-[52ch] text-body-lg text-muted">{copy.text}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button to="/" icon={ArrowLeft}>
            Back to home
          </Button>
          <Button to="/blogs" variant="outline" icon={BookOpen}>
            Browse guides
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
