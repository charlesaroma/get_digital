/* An event in a list: photo with a date tile, title, place and the lowest price. */
import { ArrowRight, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

import PhotoFrame from "@/components/site/PhotoFrame";
import Badge from "@/components/ui/Badge";
import { dateTile, formatMoney, formatShortDay, formatTimeRange } from "@/utils/format";

export default function EventCard({ event, types = [] }) {
  const tile = dateTile(event.startsAt);
  const onSale = types.filter((t) => t.active);
  const from = onSale.length ? Math.min(...onSale.map((t) => t.price)) : null;
  const soldOut = onSale.length > 0 && onSale.every((t) => t.sold >= t.capacity);
  const ended = event.status === "ended";
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-surface ring-1 ring-inset ring-border transition-[box-shadow,transform] duration-300 ease-brand hover:-translate-y-1 hover:shadow-lift">
      <div className="relative">
        <PhotoFrame src={event.image} alt={event.imageAlt ?? ""} caption={event.title} ratio="16 / 9" className="rounded-none ring-0" />
        <span className="absolute top-3 left-3 flex w-14 flex-col items-center rounded-xl bg-surface py-1.5 shadow-card">
          <span className="font-display text-h4 leading-none">{tile.day}</span>
          <span className="text-label uppercase text-muted">{tile.month}</span>
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{event.category}</Badge>
          {soldOut && !ended && <Badge tone="neutral">Sold out</Badge>}
        </div>
        <h3 className="text-h4">
          <Link to={`/tickets/${event.slug}`} className="after:absolute after:inset-0">
            {event.title}
          </Link>
        </h3>
        <p className="text-small text-muted">
          {formatShortDay(event.startsAt)}, {formatTimeRange(event.startsAt, event.endsAt)}
        </p>
        <p className="flex items-center gap-1.5 text-small text-muted">
          <MapPin aria-hidden="true" size={15} strokeWidth={1.75} />
          {event.venue}, {event.city}
        </p>
        <p className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4 text-small">
          <span className="font-semibold text-foreground">{ended ? "Event ended" : from === null ? "" : from === 0 ? "Free" : `From ${formatMoney(from)}`}</span>
          <span className="flex items-center gap-1 font-semibold">
            {ended ? "See what happened" : "Get tickets"}
            <ArrowRight aria-hidden="true" size={16} strokeWidth={1.75} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </span>
        </p>
      </div>
    </article>
  );
}
