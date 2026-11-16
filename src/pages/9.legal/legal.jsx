/* Legal pages: Privacy, Terms of Use, Voting Rules, Ticket Terms and Refunds, Cookies.
   One layout: title, last updated date, contents list (sticky on wide screens), numbered sections. */
import { FileText, Mail } from "lucide-react";
import { Link } from "react-router-dom";

import { Reveal } from "@/components/motion/Reveal";
import ArticleBody from "@/components/site/ArticleBody";
import PageHeader from "@/components/site/PageHeader";
import usePageMeta from "@/seo/usePageMeta";
import { useLegalDoc, useLegalLinks } from "@/store/tanstackStore/queries/site";
import { cn } from "@/utils/cn";
import { formatDate } from "@/utils/format";

export default function LegalPage({ slug }) {
  const doc = useLegalDoc(slug);
  const others = useLegalLinks().filter((d) => d.slug !== slug);
  usePageMeta({ title: doc?.title, description: doc?.summary });
  if (!doc) return null;

  return (
    <>
      <PageHeader eyebrow="Legal" title={doc.title} text={doc.summary}>
        <p className="mt-6 text-small text-muted">
          Last updated <time dateTime={doc.updatedAt}>{formatDate(doc.updatedAt)}</time>
        </p>
      </PageHeader>
      <div className="container-gd grid grid-cols-1 gap-10 py-12 sm:py-16 lg:grid-cols-[16rem_1fr] lg:gap-16">
        <nav aria-labelledby="contents-title" className="lg:order-none">
          <div className="lg:sticky lg:top-28">
            <p id="contents-title" className="text-small font-semibold text-foreground">
              Contents
            </p>
            <ol className="mt-3 grid grid-cols-1 gap-x-6 sm:grid-cols-2 lg:grid-cols-1">
              {doc.sections.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="flex min-h-11 items-center gap-3 text-small text-muted transition-colors hover:text-foreground">
                    <span className="w-5 font-mono tabular-nums text-subtle">{i + 1}</span>
                    {s.heading}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </nav>
        <div className="flex min-w-0 max-w-[70ch] flex-col gap-12">
          {doc.sections.map((s, i) => (
            <Reveal as="section" key={s.id} id={s.id} aria-labelledby={`${s.id}-h`} className="scroll-mt-28">
              <h2 id={`${s.id}-h`} className="flex items-baseline gap-3 text-h3">
                <span className="font-mono text-h4 tabular-nums text-link">{i + 1}.</span>
                {s.heading}
              </h2>
              <ArticleBody blocks={s.body} className="mt-4 text-body" />
            </Reveal>
          ))}
          <div className="flex flex-col gap-4 rounded-2xl bg-gd-stone-100 p-6 ring-1 ring-inset ring-border sm:p-8 dark:bg-gd-navy-900">
            <p className="flex items-center gap-2 font-bold">
              <Mail aria-hidden="true" size={18} strokeWidth={1.75} />
              Questions about this page?
            </p>
            <p className="text-muted">
              Email{" "}
              <a href="mailto:getdigital256@gmail.com" className="font-semibold text-link underline-offset-4 hover:underline">
                getdigital256@gmail.com
              </a>{" "}
              or write to GetDigital LTD, P.O. Box 331582, Lira, Uganda.
            </p>
          </div>
          <nav aria-label="Other legal pages">
            <ul className="flex flex-wrap gap-2">
              {others.map((d) => (
                <li key={d.slug}>
                  <Link to={`/${d.slug}`} className={cn("inline-flex min-h-11 items-center gap-2 rounded-full border border-border-strong bg-surface px-4 text-small font-semibold hover:bg-surface-muted")}>
                    <FileText aria-hidden="true" size={16} strokeWidth={1.75} />
                    {d.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
