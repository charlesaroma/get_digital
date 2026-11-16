/* Events and tickets: the featured event first, then what's coming up and what has happened. */
import { ArrowRight, CalendarDays, Clock, MapPin, Ticket } from "lucide-react";

import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import PageHeader from "@/components/site/PageHeader";
import PhotoFrame from "@/components/site/PhotoFrame";
import EventCard from "@/components/tickets/EventCard";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { SkeletonGroup, SkeletonPanel } from "@/components/ui/Skeleton";
import usePageMeta from "@/seo/usePageMeta";
import { useEvents, usePageCopy, useTicketTypes } from "@/store/tanstackStore/queries/site";
import { formatDay, formatMoney, formatTimeRange } from "@/utils/format";
import useNow from "@/utils/useNow";

export default function TicketsPage() {
  const copy = usePageCopy("tickets");
  usePageMeta({ title: copy.title, description: copy.text });
  const events = useEvents();
  const now = useNow();
  const types = useTicketTypes();
  const typesOf = (id) => (types.data ?? []).filter((t) => t.eventId === id);
  const all = [...(events.data ?? [])].sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  const upcoming = all.filter((e) => e.status === "published" && Date.parse(e.endsAt) > now);
  const featured = upcoming.find((e) => e.featured) ?? upcoming[0];
  const rest = upcoming.filter((e) => e !== featured);
  const past = all.filter((e) => e.status === "ended" || Date.parse(e.endsAt) <= now).reverse();

  return (
    <>
      <PageHeader eyebrow="Events" title={copy.title} text={copy.text} />
      <section aria-label="Events" className="py-12 sm:py-16 lg:py-20">
        <div className="container-gd flex flex-col gap-16">
          {events.isPending ? (
            <SkeletonGroup label="Loading events">
              <SkeletonPanel tiles={3} />
            </SkeletonGroup>
          ) : !upcoming.length && !past.length ? (
            <EmptyState icon={Ticket} title={copy.emptyTitle} text={copy.emptyText} action={<Button to="/#free-ai-course" variant="outline">Free AI course</Button>} />
          ) : (
            <>
              {featured && <Featured event={featured} types={typesOf(featured.id)} />}
              {rest.length > 0 && (
                <div>
                  <h2 className="text-h2">Coming up</h2>
                  <Stagger as="ul" className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {rest.map((e) => (
                      <StaggerItem as="li" key={e.id}>
                        <EventCard event={e} types={typesOf(e.id)} />
                      </StaggerItem>
                    ))}
                  </Stagger>
                </div>
              )}
              {past.length > 0 && (
                <div>
                  <h2 className="text-h2">Past events</h2>
                  <ul className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {past.map((e) => (
                      <li key={e.id}>
                        <EventCard event={e} types={typesOf(e.id)} />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}

function Featured({ event, types }) {
  const active = types.filter((t) => t.active);
  const from = active.length ? Math.min(...active.map((t) => t.price)) : 0;
  const seatsLeft = active.reduce((s, t) => s + Math.max(0, t.capacity - t.sold), 0);
  return (
    <article className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
      <Reveal variant="media" className="lg:col-span-6">
        <PhotoFrame src={event.image} alt={event.imageAlt ?? ""} caption={`Event photo: ${event.title}`} ratio="4 / 3" priority />
      </Reveal>
      <Reveal delay={0.06} className="lg:col-span-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="primary">Featured event</Badge>
          <Badge>{event.category}</Badge>
        </div>
        <h2 className="mt-4 text-h2">{event.title}</h2>
        <p className="mt-4 text-body-lg text-muted">{event.summary}</p>
        <ul className="mt-6 flex flex-col gap-2 text-foreground">
          <li className="flex items-center gap-2.5">
            <CalendarDays aria-hidden="true" size={18} strokeWidth={1.75} className="text-muted" />
            {formatDay(event.startsAt)}
          </li>
          <li className="flex items-center gap-2.5">
            <Clock aria-hidden="true" size={18} strokeWidth={1.75} className="text-muted" />
            {formatTimeRange(event.startsAt, event.endsAt)}
          </li>
          <li className="flex items-center gap-2.5">
            <MapPin aria-hidden="true" size={18} strokeWidth={1.75} className="text-muted" />
            {event.venue}, {event.city}
          </li>
        </ul>
        <div className="mt-8 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p>
            <span className="block font-mono text-h3 font-semibold tabular-nums">{from === 0 ? "Free" : `From ${formatMoney(from)}`}</span>
            <span className="text-small text-muted">{seatsLeft} seats left</span>
          </p>
          <Button to={`/tickets/${event.slug}`} size="lg" iconRight={ArrowRight}>
            {from === 0 ? "Get a free ticket" : "Get tickets"}
          </Button>
        </div>
      </Reveal>
    </article>
  );
}
