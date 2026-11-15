/* Tickets page: published events and their ticket types. Clear empty state when none are on sale. */
import { CalendarDays, GraduationCap, MapPin, Ticket } from "lucide-react";

import PageHeader from "@/components/site/PageHeader";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { SkeletonGroup, SkeletonPanel } from "@/components/ui/Skeleton";
import usePageMeta from "@/seo/usePageMeta";
import { useEvents, usePageCopy, useTicketTypes } from "@/store/tanstackStore/queries/site";
import { formatDate } from "@/utils/format";

const money = (n, currency) => (n === 0 ? "Free" : new Intl.NumberFormat("en-UG", { style: "currency", currency, maximumFractionDigits: 0 }).format(n));

export default function TicketsPage() {
  const copy = usePageCopy("tickets");
  usePageMeta({ title: copy.title, description: copy.text });
  const events = useEvents();
  const types = useTicketTypes();
  const live = (events.data ?? []).filter((e) => e.status === "published");

  return (
    <>
      <PageHeader eyebrow="Events" title={copy.title} text={copy.text} />
      <section aria-label="Events" className="py-12 sm:py-16 lg:py-20">
        <div className="container-gd max-w-5xl">
          {events.isPending ? (
            <SkeletonGroup label="Loading events">
              <SkeletonPanel tiles={3} />
            </SkeletonGroup>
          ) : !live.length ? (
            <EmptyState icon={Ticket} title={copy.emptyTitle} text={copy.emptyText} action={<Button to="/#free-ai-course" variant="outline" icon={GraduationCap}>Free AI course</Button>} />
          ) : (
            <ul className="flex flex-col gap-6">
              {live.map((ev) => (
                <li key={ev.id} className="rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-8">
                  <p className="flex flex-wrap gap-x-4 gap-y-1 text-small text-muted">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays aria-hidden="true" size={14} strokeWidth={1.75} />
                      <time dateTime={ev.startsAt}>{formatDate(ev.startsAt)}</time>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin aria-hidden="true" size={14} strokeWidth={1.75} />
                      {ev.venue}
                    </span>
                  </p>
                  <h2 className="mt-3 text-h3">{ev.title}</h2>
                  <p className="mt-2 text-muted">{ev.description}</p>
                  <ul className="mt-6 divide-y divide-border rounded-xl border border-border">
                    {(types.data ?? [])
                      .filter((t) => t.eventId === ev.id && t.active)
                      .map((t) => (
                        <li key={t.id} className="flex items-center justify-between gap-4 p-4">
                          <span className="font-semibold">{t.name}</span>
                          <span className="font-mono tabular-nums">{money(t.price, t.currency)}</span>
                        </li>
                      ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
