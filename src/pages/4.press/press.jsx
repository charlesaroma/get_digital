/* Press page: releases newest first, with loading, empty and error states. */
import { ArrowRight, Clock, MapPin, Newspaper, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";

import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import HexStat from "@/components/site/HexStat";
import PageHeader from "@/components/site/PageHeader";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/Skeleton";
import usePageMeta from "@/seo/usePageMeta";
import { usePageCopy, usePress } from "@/store/tanstackStore/queries/site";
import { formatDate } from "@/utils/format";

export default function PressPage() {
  const copy = usePageCopy("press");
  usePageMeta({ title: copy.title, description: copy.text });
  const { data, isPending, isError, refetch } = usePress();
  const items = [...(data ?? [])].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  return (
    <>
      <PageHeader eyebrow="Newsroom" title={copy.title} text={copy.text} aside={items.length > 0 ? <HexStat value={items.length} label={items.length === 1 ? "press release" : "press releases"} cells={3} /> : undefined} />
      <section aria-label="Press releases" className="py-12 sm:py-16 lg:py-20">
        <div className="container-gd max-w-5xl">
          {isPending ? (
            <div className="flex flex-col gap-4" aria-busy="true" aria-label="Loading press releases">
              {[0, 1].map((i) => (
                <div key={i} className="rounded-2xl bg-surface-muted p-6 sm:p-8">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="mt-4 h-7 w-4/5" />
                  <Skeleton className="mt-3 h-4 w-full" />
                </div>
              ))}
            </div>
          ) : isError ? (
            <EmptyState
              tone="error"
              icon={Newspaper}
              title="We could not load the press releases"
              text="Check your internet connection and try again."
              action={
                <Button variant="outline" icon={RotateCcw} onClick={() => refetch()}>
                  Try again
                </Button>
              }
            />
          ) : !items.length ? (
            <EmptyState icon={Newspaper} title="No press releases yet" text={copy.empty} />
          ) : (
            <Stagger as="ol" className="flex flex-col gap-4">
              {items.map((p) => (
                <StaggerItem as="li" key={p.id}>
                  <article className="group relative rounded-2xl bg-surface-muted p-6 transition-colors duration-200 hover:bg-primary-soft sm:p-8">
                    <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-small text-muted">
                      <time dateTime={p.publishedAt} className="font-semibold text-foreground">
                        {formatDate(p.publishedAt)}
                      </time>
                      <span className="flex items-center gap-1.5">
                        <MapPin aria-hidden="true" size={14} strokeWidth={1.75} />
                        {p.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock aria-hidden="true" size={14} strokeWidth={1.75} />
                        {p.readMinutes} min read
                      </span>
                    </p>
                    <h2 className="mt-3 text-h3">
                      <Link to={`/press/${p.slug}`} className="after:absolute after:inset-0">
                        {p.title}
                      </Link>
                    </h2>
                    <p className="mt-3 max-w-[70ch] text-muted">{p.summary}</p>
                    <p className="mt-4 inline-flex min-h-11 items-center gap-1.5 font-semibold text-link">
                      Read the full release
                      <ArrowRight aria-hidden="true" size={16} strokeWidth={1.75} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                    </p>
                  </article>
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </div>
      </section>
    </>
  );
}
