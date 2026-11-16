/* Checkout for tickets: details, payment for paid tickets, then the tickets with QR codes.
   Free orders skip payment. The server confirms seats and payment and emails the tickets. */
import { CalendarPlus, CircleAlert, CircleCheck, Mail, ShieldCheck } from "lucide-react";
import { useId, useState } from "react";
import { Link } from "react-router-dom";

import ShareBar from "@/components/site/ShareBar";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { useCreateTicketOrder } from "@/store/tanstackStore/queries/site";
import { icsHref } from "@/utils/calendar";
import { cn } from "@/utils/cn";
import { absoluteUrl, formatDay, formatMoney, formatTimeRange } from "@/utils/format";
import TicketQr from "./TicketQr";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const UG_PHONE = /^(\+?256|0)7\d{8}$/;
const clean = (v) => v.replace(/[\s()-]/g, "");
const input =
  "h-12 w-full rounded-md border border-border-strong bg-surface px-4 text-body text-foreground placeholder:text-subtle focus:border-foreground focus:outline-none focus-visible:ring-4 focus-visible:ring-gd-yellow-500/35 aria-[invalid=true]:border-error";
const METHODS = [
  { id: "mtn", label: "MTN MoMo" },
  { id: "airtel", label: "Airtel Money" },
  { id: "card", label: "Card" },
];

export default function CheckoutDialog({ open, onClose, event, types, quantities }) {
  return (
    <Modal open={open} onClose={onClose} title="Get your tickets" description={event?.title}>
      {event && <Checkout event={event} types={types} quantities={quantities} onClose={onClose} />}
    </Modal>
  );
}

function Checkout({ event, types, quantities, onClose }) {
  const order = useCreateTicketOrder();
  const lines = types.filter((t) => (quantities[t.id] ?? 0) > 0).map((t) => ({ type: t, quantity: quantities[t.id] }));
  const total = lines.reduce((s, l) => s + l.type.price * l.quantity, 0);
  const [v, setV] = useState({ name: "", email: "", phone: "", method: "mtn", consent: false });
  const [submitted, setSubmitted] = useState(false);
  const ids = { name: useId(), email: useId(), phone: useId() };
  const errors = (() => {
    const e = {};
    if (v.name.trim().length < 2) e.name = "Enter the name for the tickets.";
    if (!EMAIL.test(v.email.trim())) e.email = "Enter your email. Your tickets are sent here.";
    if (!UG_PHONE.test(clean(v.phone))) e.phone = total > 0 && v.method !== "card" ? `Enter the ${v.method === "mtn" ? "MTN" : "Airtel"} number that will pay.` : "Enter a Ugandan mobile number, for example 0772 123 456.";
    if (!v.consent) e.consent = "Please agree to the Ticket Terms.";
    return e;
  })();
  const err = (k) => (submitted ? errors[k] : "");
  const set = (k) => (e) => setV((s) => ({ ...s, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  if (order.isSuccess) return <Tickets order={order.data} event={event} types={types} onClose={onClose} />;
  if (order.isPending) {
    return (
      <div role="status" className="flex flex-col items-center gap-4 py-8 text-center">
        <span aria-hidden="true" className="size-12 animate-spin rounded-full border-4 border-gd-yellow-500 border-t-transparent" />
        <p className="text-h4">{total ? "Waiting for payment confirmation" : "Booking your seats"}</p>
        <p className="max-w-[40ch] text-muted">{total && v.method !== "card" ? `Approve the prompt on ${clean(v.phone)} with your PIN.` : "This takes a few seconds."}</p>
      </div>
    );
  }

  return (
    <form
      noValidate
      className="flex flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
        if (Object.keys(errors).length) return;
        order.mutate({ eventId: event.id, items: lines.map((l) => ({ ticketTypeId: l.type.id, quantity: l.quantity })), name: v.name.trim(), email: v.email.trim(), phone: clean(v.phone), paymentMethod: total ? v.method : "free", consent: v.consent });
      }}
    >
      {order.isError && (
        <p role="alert" className="flex items-start gap-2 rounded-xl bg-error-soft p-4 text-small font-semibold text-error">
          <CircleAlert aria-hidden="true" size={18} strokeWidth={1.75} className="mt-0.5 shrink-0" />
          {order.error.message || "We could not complete your booking. Try again."}
        </p>
      )}
      <ul className="flex flex-col gap-2 rounded-2xl bg-surface-muted p-4">
        {lines.map((l) => (
          <li key={l.type.id} className="flex justify-between gap-4 text-small">
            <span>
              {l.quantity} × {l.type.name}
            </span>
            <span className="font-mono tabular-nums">{formatMoney(l.type.price * l.quantity)}</span>
          </li>
        ))}
        <li className="mt-1 flex justify-between gap-4 border-t border-border pt-2 font-bold">
          <span>Total</span>
          <span className="font-mono tabular-nums">{formatMoney(total)}</span>
        </li>
      </ul>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Text id={ids.name} label="Full name" value={v.name} onChange={set("name")} error={err("name")} autoComplete="name" />
        <Text id={ids.email} label="Email" type="email" value={v.email} onChange={set("email")} error={err("email")} autoComplete="email" placeholder="name@gmail.com" />
      </div>
      {total > 0 && (
        <div role="radiogroup" aria-label="Pay with" className="grid grid-cols-3 gap-2">
          {METHODS.map((m) => (
            <label key={m.id} className={cn("flex min-h-12 cursor-pointer items-center justify-center rounded-xl border px-2 text-center text-small font-semibold has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-gd-yellow-500/35", v.method === m.id ? "border-foreground bg-surface-muted" : "border-border-strong hover:bg-surface-muted")}>
              <input type="radio" name="pay" value={m.id} checked={v.method === m.id} onChange={set("method")} className="sr-only" />
              {m.label}
            </label>
          ))}
        </div>
      )}
      <Text id={ids.phone} label={total > 0 && v.method !== "card" ? `${v.method === "mtn" ? "MTN" : "Airtel"} number that will pay` : "Phone (WhatsApp)"} type="tel" value={v.phone} onChange={set("phone")} error={err("phone")} autoComplete="tel" placeholder="0772 123 456" />
      <div className="flex flex-col gap-2">
        <label className="flex min-h-11 items-start gap-3 text-small">
          <input type="checkbox" checked={v.consent} onChange={set("consent")} className="mt-0.5 size-5 shrink-0 accent-gd-navy-900" />
          <span>
            I agree to the{" "}
            <Link to="/ticket-terms" target="_blank" className="font-semibold text-link underline-offset-4 hover:underline">
              Ticket Terms and Refunds
            </Link>{" "}
            and the{" "}
            <Link to="/privacy" target="_blank" className="font-semibold text-link underline-offset-4 hover:underline">
              Privacy Policy
            </Link>
            .
          </span>
        </label>
        {err("consent") && <p className="text-small font-semibold text-error">{err("consent")}</p>}
      </div>
      <Button type="submit" size="lg" className="w-full">
        {total ? `Pay ${formatMoney(total)}` : "Book my free seat"}
      </Button>
      {total > 0 && (
        <p className="flex items-start gap-2 text-small text-muted">
          <ShieldCheck aria-hidden="true" size={18} strokeWidth={1.75} className="mt-0.5 shrink-0 text-success" />
          You pay on our payment partner's secure page. GetDigital never sees your PIN or card number.
        </p>
      )}
    </form>
  );
}

function Text({ id, label, error, ...rest }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-small font-semibold text-foreground">
        {label}
      </label>
      <input id={id} className={input} aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-error` : undefined} {...rest} />
      {error && (
        <p id={`${id}-error`} className="text-small font-semibold text-error">
          {error}
        </p>
      )}
    </div>
  );
}

function Tickets({ order, event, types, onClose }) {
  const nameOf = (id) => types.find((t) => t.id === id)?.name;
  const location = `${event.venue}, ${event.address}, ${event.city}`;
  return (
    <div role="status" className="flex flex-col gap-6">
      <div className="flex flex-col items-start gap-3">
        <span className="grid size-12 place-items-center rounded-full bg-success-soft text-success">
          <CircleCheck aria-hidden="true" size={24} strokeWidth={1.75} />
        </span>
        <p className="text-h4">{order.tickets.length === 1 ? "Your ticket is ready" : `Your ${order.tickets.length} tickets are ready`}</p>
        <p className="flex items-start gap-2 text-muted">
          <Mail aria-hidden="true" size={18} strokeWidth={1.75} className="mt-1 shrink-0" />
          We sent {order.tickets.length === 1 ? "it" : "them"} to {order.email}. Order reference {order.reference}.
        </p>
      </div>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {order.tickets.map((t) => (
          <li key={t.code} className="flex flex-col items-center gap-3 rounded-2xl bg-surface-muted p-4 text-center">
            <TicketQr code={t.code} className="w-40" />
            <p className="font-mono text-small font-semibold">{t.code}</p>
            <p className="text-small text-muted">
              {nameOf(t.ticketTypeId)}, {formatDay(event.startsAt)}, {formatTimeRange(event.startsAt, event.endsAt)}
            </p>
          </li>
        ))}
      </ul>
      <p className="text-small text-muted">Show the QR code at the door, on your phone or printed. Each code lets one person in once.</p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button href={icsHref({ title: event.title, description: event.summary, location, startsAt: event.startsAt, endsAt: event.endsAt, url: absoluteUrl(`/tickets/${event.slug}`) })} download={`${event.slug}.ics`} variant="outline" icon={CalendarPlus}>
          Add to calendar
        </Button>
        <Button variant="ghost" onClick={onClose} className="sm:ml-auto">
          Close
        </Button>
      </div>
      <ShareBar path={`/tickets/${event.slug}`} title={event.title} text={`I'm going to ${event.title}. Join me:`} label="Invite a friend" />
    </div>
  );
}
