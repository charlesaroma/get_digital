/* One event at /tickets/:event: what it is, when and where, agenda, speakers, and the ticket panel. */
import { ArrowLeft, CalendarDays, CalendarPlus, Clock, MapPin, Ticket, Users, Vote } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import { Reveal } from "@/components/motion/Reveal";
import ArticleBody from "@/components/site/ArticleBody";
import PhotoFrame from "@/components/site/PhotoFrame";
import ShareBar from "@/components/site/ShareBar";
import CheckoutDialog from "@/components/tickets/CheckoutDialog";
import TicketPicker from "@/components/tickets/TicketPicker";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/Skeleton";
import usePageMeta from "@/seo/usePageMeta";
import { useEvent, useTicketTypes } from "@/store/tanstackStore/queries/site";
import { icsHref } from "@/utils/calendar";
import { absoluteUrl, formatDay, formatMoney, formatTimeRange, initialsOf } from "@/utils/format";
import useNow from "@/utils/useNow";

export default function EventPage() {
  const { event: slug } = useParams();
  const { data: event, isPending } = useEvent(slug);
  const { data: allTypes = [] } = useTicketTypes();
  const [quantities, setQuantities] = useState({});
  const [checkout, setCheckout] = useState(false);
  const now = useNow();
  const types = allTypes.filter((t) => t.eventId === event?.id && (t.active || event?.status === "ended")).sort((a, b) => a.position - b.position);
  const ended = event && (event.status === "ended" || Date.parse(event.endsAt) <= now);
  const count = Object.values(quantities).reduce((s, q) => s + q, 0);
  const total = types.reduce((s, t) => s + t.price * (quantities[t.id] ?? 0), 0);
  const location = event ? `${event.venue}, ${event.address}, ${event.city}` : "";

  usePageMeta({
    title: event?.title ?? "Event",
    description: event?.summary,
    image: event?.image ?? undefined,
    imageAlt: event?.imageAlt,
    jsonLd: event && {
      "@context": "https://schema.org",
      "@type": "Event",
      name: event.title,
      description: event.summary,
      startDate: event.startsAt,
      endDate: event.endsAt,
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: { "@type": "Place", name: event.venue, address: { "@type": "PostalAddress", streetAddress: event.address, addressLocality: event.city, addressCountry: "UG" } },
      organizer: { "@type": "NGO", name: "GetDigital256", url: "https://gd256.org" },
      offers: types.map((t) => ({ "@type": "Offer", name: t.name, price: t.price, priceCurrency: t.currency, availability: t.sold >= t.capacity ? "https://schema.org/SoldOut" : "https://schema.org/InStock", url: absoluteUrl(`/tickets/${event.slug}`) })),
    },
  });

  if (isPending) {
    return (
      <div className="container-gd flex flex-col gap-4 py-14" aria-busy="true">
        <Skeleton className="h-7 w-32 rounded-full" />
        <Skeleton className="h-14 w-3/4" />
        <Skeleton className="mt-6 aspect-[16/9] w-full rounded-2xl" />
      </div>
    );
  }
  if (!event) {
    return (
      <div className="container-gd py-16">
        <EmptyState icon={Ticket} title="We could not find that event" text="It may have been moved or the link may be wrong." action={<Button to="/tickets">See all events</Button>} />
      </div>
    );
  }

  const panel = (
    <div className="flex flex-col gap-5 rounded-2xl bg-gd-stone-100 p-5 ring-1 ring-inset ring-border sm:p-6 dark:bg-gd-navy-900">
      <h2 className="flex items-center gap-2 text-h4">
        <Ticket aria-hidden="true" size={20} strokeWidth={1.75} />
        {ended ? "Tickets" : "Choose tickets"}
      </h2>
      <TicketPicker types={types} quantities={quantities} disabled={ended} onChange={(id, q) => setQuantities((s) => ({ ...s, [id]: q }))} />
      {!ended && (
        <>
          <p className="flex items-baseline justify-between gap-4 border-t border-border pt-4">
            <span className="text-muted">{count ? `${count} ${count === 1 ? "ticket" : "tickets"}` : "No tickets chosen"}</span>
            <span className="font-mono text-h4 font-semibold tabular-nums">{formatMoney(total)}</span>
          </p>
          <Button size="lg" disabled={!count} onClick={() => setCheckout(true)} className="w-full">
            {count ? (total ? "Continue to pay" : "Book my free seat") : "Choose a ticket"}
          </Button>
          <p className="text-small text-muted">
            See the{" "}
            <Link to="/ticket-terms" className="font-semibold text-link underline-offset-4 hover:underline">
              Ticket Terms and Refunds
            </Link>
            .
          </p>
        </>
      )}
    </div>
  );

  return (
    <>
      <section className="border-b border-border">
        <div className="container-gd pt-8 pb-12 sm:pt-12 lg:pb-16">
          <Link to="/tickets" className="-ml-1 inline-flex min-h-11 items-center gap-2 rounded-full px-1 text-small font-semibold text-muted hover:text-foreground">
            <ArrowLeft aria-hidden="true" size={16} strokeWidth={1.75} />
            All events
          </Link>
          <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
            <Reveal className="lg:col-span-7">
              <div className="flex flex-wrap items-center gap-2">
                <Badge>{event.category}</Badge>
                {ended && <Badge tone="neutral">Event ended</Badge>}
              </div>
              <h1 className="mt-4 text-h1">{event.title}</h1>
              <p className="mt-5 max-w-[60ch] text-body-lg text-muted">{event.summary}</p>
            </Reveal>
            <Reveal delay={0.06} className="lg:col-span-5">
              <ul className="flex flex-col gap-3 text-foreground">
                <li className="flex items-start gap-3">
                  <CalendarDays aria-hidden="true" size={20} strokeWidth={1.75} className="mt-0.5 shrink-0 text-muted" />
                  {formatDay(event.startsAt)}
                </li>
                <li className="flex items-start gap-3">
                  <Clock aria-hidden="true" size={20} strokeWidth={1.75} className="mt-0.5 shrink-0 text-muted" />
                  {formatTimeRange(event.startsAt, event.endsAt)}
                </li>
                <li className="flex items-start gap-3">
                  <MapPin aria-hidden="true" size={20} strokeWidth={1.75} className="mt-0.5 shrink-0 text-muted" />
                  <span>
                    {event.venue}, {event.address}, {event.city}
                    <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`} target="_blank" rel="noopener noreferrer" className="block min-h-11 pt-1 text-small font-semibold text-link underline-offset-4 hover:underline">
                      Open in Google Maps<span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </span>
                </li>
                {event.ageNote && (
                  <li className="flex items-start gap-3">
                    <Users aria-hidden="true" size={20} strokeWidth={1.75} className="mt-0.5 shrink-0 text-muted" />
                    {event.ageNote}
                  </li>
                )}
              </ul>
              {!ended && (
                <Button href={icsHref({ title: event.title, description: event.summary, location, startsAt: event.startsAt, endsAt: event.endsAt, url: absoluteUrl(`/tickets/${event.slug}`) })} download={`${event.slug}.ics`} variant="ghost" size="sm" icon={CalendarPlus} className="mt-3 -ml-3">
                  Add to calendar
                </Button>
              )}
            </Reveal>
          </div>
        </div>
      </section>

      <div className="container-gd grid grid-cols-1 gap-12 py-12 sm:py-16 lg:grid-cols-12 lg:gap-12">
        <div className="flex flex-col gap-12 lg:col-span-7">
          <Reveal variant="media">
            <PhotoFrame src={event.image} alt={event.imageAlt ?? ""} caption={`Event photo: ${event.title}`} ratio="16 / 9" />
          </Reveal>
          <div className="lg:hidden">{panel}</div>
          <section aria-labelledby="about-title">
            <h2 id="about-title" className="text-h3">
              About this event
            </h2>
            <ArticleBody blocks={event.description} className="mt-5" />
          </section>
          {event.agenda?.length > 0 && (
            <section aria-labelledby="agenda-title">
              <h2 id="agenda-title" className="text-h3">
                Programme
              </h2>
              <ol className="mt-5 flex flex-col">
                {event.agenda.map((a) => (
                  <li key={a.time + a.title} className="grid grid-cols-[4.5rem_1fr] gap-4 border-t border-border py-4 last:border-b">
                    <span className="font-mono font-semibold tabular-nums text-link">{a.time}</span>
                    <span className="text-foreground">{a.title}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-3 text-small text-muted">Times are East Africa Time and may change slightly on the day.</p>
            </section>
          )}
          {event.speakers?.length > 0 && (
            <section aria-labelledby="speakers-title">
              <h2 id="speakers-title" className="text-h3">
                Speakers and hosts
              </h2>
              <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {event.speakers.map((s) => (
                  <li key={s.name} className="flex items-center gap-3 rounded-2xl bg-surface p-4 ring-1 ring-inset ring-border">
                    <span aria-hidden="true" className="gd-hex grid h-[2.6rem] w-12 shrink-0 place-items-center bg-primary-soft font-display text-small font-semibold text-gd-navy-900 dark:text-gd-yellow-100">
                      {initialsOf(s.name)}
                    </span>
                    <span>
                      <span className="block font-bold">{s.name}</span>
                      <span className="block text-small text-muted">{s.role}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {event.voteSlug && (
            <aside className="flex flex-col gap-4 rounded-2xl bg-surface p-6 ring-1 ring-inset ring-border sm:flex-row sm:items-center">
              <Vote aria-hidden="true" size={26} strokeWidth={1.75} className="shrink-0 text-gd-yellow-600" />
              <p className="flex-1 text-muted">Voting decides tonight's winners. Have you voted yet?</p>
              <Button to={`/vote/${event.voteSlug}`} variant="outline">
                Vote now
              </Button>
            </aside>
          )}
          <ShareBar path={`/tickets/${event.slug}`} title={event.title} text={`${event.title}, ${formatDay(event.startsAt)} in ${event.city}:`} label="Share this event" />
        </div>
        <aside className="hidden lg:col-span-5 lg:block">
          <div className="sticky top-28">{panel}</div>
        </aside>
      </div>

      <CheckoutDialog
        open={checkout}
        onClose={() => {
          setCheckout(false);
          setQuantities({});
        }}
        event={event}
        types={types}
        quantities={quantities}
      />
    </>
  );
}
