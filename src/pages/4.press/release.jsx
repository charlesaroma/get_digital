/* One press release at /press/:slug: dateline, headline, summary, full text, media contacts, share. */
import { ArrowLeft, CalendarDays, Clock, Mail, MapPin, Newspaper } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { Reveal } from "@/components/motion/Reveal";
import ArticleBody from "@/components/site/ArticleBody";
import PhotoFrame from "@/components/site/PhotoFrame";
import ShareBar from "@/components/site/ShareBar";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/Skeleton";
import usePageMeta from "@/seo/usePageMeta";
import { usePageCopy, usePressRelease } from "@/store/tanstackStore/queries/site";
import { absoluteUrl, formatDate } from "@/utils/format";

export default function PressReleasePage() {
  const { slug } = useParams();
  const copy = usePageCopy("press");
  const { data: item, isPending } = usePressRelease(slug);

  usePageMeta({
    title: item?.title ?? "Press release",
    description: item?.summary,
    image: item?.image ?? undefined,
    type: item ? "article" : "website",
    publishedTime: item?.publishedAt,
    jsonLd: item && {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      headline: item.title,
      description: item.summary,
      datePublished: item.publishedAt,
      dateline: item.location,
      publisher: { "@type": "NGO", name: "GetDigital256", url: "https://gd256.org" },
      mainEntityOfPage: absoluteUrl(`/press/${item.slug}`),
    },
  });

  return (
    <article className="pb-16 sm:pb-20 lg:pb-28">
      <div className="container-gd max-w-4xl pt-8 sm:pt-12">
        <Link to="/press" className="-ml-1 inline-flex min-h-11 items-center gap-2 rounded-full px-1 text-small font-semibold text-muted transition-colors hover:text-foreground">
          <ArrowLeft aria-hidden="true" size={16} strokeWidth={1.75} />
          All press releases
        </Link>
        {isPending ? (
          <div className="mt-6 flex flex-col gap-4" aria-busy="true">
            <Skeleton className="h-6 w-56" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-2/3" />
          </div>
        ) : !item ? (
          <EmptyState className="mt-6" icon={Newspaper} title="We could not find that press release" text="It may have moved." action={<Button to="/press">See all press releases</Button>} />
        ) : (
          <>
            <Reveal className="mt-6">
              <Badge tone="primary">{item.kind ?? "Press release"}</Badge>
              <h1 className="mt-4 text-h1">{item.title}</h1>
              <p className="mt-5 max-w-[62ch] text-body-lg text-muted">{item.summary}</p>
              <ul className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-5 text-small text-muted">
                <li className="flex items-center gap-1.5">
                  <MapPin aria-hidden="true" size={16} strokeWidth={1.75} />
                  {item.location}
                </li>
                <li className="flex items-center gap-1.5">
                  <CalendarDays aria-hidden="true" size={16} strokeWidth={1.75} />
                  <time dateTime={item.publishedAt}>{formatDate(item.publishedAt)}</time>
                </li>
                <li className="flex items-center gap-1.5">
                  <Clock aria-hidden="true" size={16} strokeWidth={1.75} />
                  {item.readMinutes} min read
                </li>
              </ul>
            </Reveal>
            {item.image && (
              <Reveal variant="media" className="mt-8">
                <PhotoFrame src={item.image} alt={item.imageAlt ?? ""} ratio="16 / 9" />
              </Reveal>
            )}
            <ArticleBody blocks={item.body ?? []} className="mt-10 max-w-[68ch]" />

            {item.contacts?.length > 0 && (
              <section aria-labelledby="media-title" className="mt-12 rounded-2xl bg-gd-stone-100 p-6 ring-1 ring-inset ring-border sm:p-8 dark:bg-gd-navy-900">
                <h2 id="media-title" className="text-h4">
                  {copy.mediaTitle}
                </h2>
                <p className="mt-1 text-muted">{copy.mediaText}</p>
                <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {item.contacts.map((c) => (
                    <li key={c.name}>
                      <p className="font-bold">{c.name}</p>
                      <p className="text-small text-muted">{c.role}</p>
                      <a href={`mailto:${c.email}`} className="mt-1 inline-flex min-h-11 items-center gap-2 break-all text-small font-semibold text-link underline-offset-4 hover:underline">
                        <Mail aria-hidden="true" size={16} strokeWidth={1.75} />
                        {c.email}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            <ShareBar className="mt-10" path={`/press/${item.slug}`} title={item.title} text={item.title} label="Share this release" />
          </>
        )}
      </div>
    </article>
  );
}
