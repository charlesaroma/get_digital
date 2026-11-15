/* Press page: releases newest first, with loading, empty and error states. */
import { ArrowUpRight, Clock, MapPin, Newspaper, RotateCcw } from "lucide-react";

import { Stagger, StaggerItem } from "@/components/motion/Reveal";
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
      <PageHeader eyebrow="Newsroom" title={copy.title} text={copy.text} />
      <section aria-label="Press releases" className="py-12 sm:py-16 lg:py-20">
        <div className="container-gd max-w-5xl">
          {isPending ? (
            <div className="flex flex-col gap-4" aria-busy="true" aria-label="Loading press releases">
              {[0, 1].map((i) => (
                <div key={i} className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
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
                  <article className="rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-8">
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
                    <h2 className="mt-3 text-h3">{p.title}</h2>
                    <p className="mt-3 max-w-[70ch] text-muted">{p.summary}</p>
                    {p.url && (
                      <a href={p.url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex min-h-11 items-center gap-1.5 font-semibold text-link underline-offset-4 hover:underline">
                        Read the full release
                        <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.75} />
                        <span className="sr-only">(opens in a new tab)</span>
                      </a>
                    )}
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
