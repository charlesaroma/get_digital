/* The vote window. Three ways to back a nominee, in one dialog:
   Free vote: phone or email, a six digit code, done (one per category per day).
   Boost: choose how many votes, pay on the payment partner's page, votes added on confirmation.
   VIP voter: one payment, votes now, more every day until close, plus an event ticket.
   The server is the only judge of a valid vote; this window only shows its answers. */
import { CircleAlert, CircleCheck, Crown, Minus, Plus, ShieldCheck, Ticket, Vote, Zap } from "lucide-react";
import { useId, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import ShareBar from "@/components/site/ShareBar";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { useBuyVotes, useCastVote, useRequestVoteCode } from "@/store/tanstackStore/queries/site";
import { cn } from "@/utils/cn";
import { formatCount, formatMoney, votesLabel } from "@/utils/format";
import NomineeAvatar from "./NomineeAvatar";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const UG_PHONE = /^(\+?256|0)7\d{8}$/;
const clean = (v) => v.replace(/[\s()-]/g, "");
const input =
  "h-12 w-full rounded-md border border-border-strong bg-surface px-4 text-body text-foreground placeholder:text-subtle focus:border-foreground focus:outline-none focus-visible:ring-4 focus-visible:ring-gd-yellow-500/35 aria-[invalid=true]:border-error";

const MODES = [
  { id: "vote", label: "Free vote", icon: Vote },
  { id: "boost", label: "Boost", icon: Zap },
  { id: "vip", label: "VIP voter", icon: Crown },
];

export default function VoteDialog({ open, onClose, poll, nominees, nominee, mode = "vote" }) {
  return (
    <Modal open={open} onClose={onClose} title="Vote" description={poll?.title}>
      {poll && <VoteFlow poll={poll} nominees={nominees} initialNominee={nominee} initialMode={mode} onClose={onClose} />}
    </Modal>
  );
}

function VoteFlow({ poll, nominees, initialNominee, initialMode, onClose }) {
  const modes = MODES.filter((m) => m.id === "vote" || poll[m.id]?.enabled);
  const [mode, setMode] = useState(modes.some((m) => m.id === initialMode) ? initialMode : "vote");
  const [nomineeId, setNomineeId] = useState(initialNominee?.id ?? "");
  const [done, setDone] = useState(null);
  const nominee = nominees.find((n) => n.id === nomineeId);
  const category = poll.categories.find((c) => c.id === nominee?.categoryId);
  const share = nominee && { path: `/vote/${poll.slug}/${nominee.slug}`, title: `Vote for ${nominee.name}`, text: `Vote for ${nominee.name} in ${category?.name}, ${poll.title}. Voting is free:` };

  if (done) return <Done result={done} nominee={nominee} share={share} onMore={(m) => { setDone(null); setMode(m); }} modes={modes} onClose={onClose} />;

  return (
    <div className="flex flex-col gap-6">
      {modes.length > 1 && (
        <div role="tablist" aria-label="How to vote" className="grid grid-cols-3 gap-1 rounded-full bg-surface-muted p-1">
          {modes.map((m) => (
            <button
              key={m.id}
              type="button"
              role="tab"
              aria-selected={mode === m.id}
              onClick={() => setMode(m.id)}
              className={cn(
                "flex min-h-11 items-center justify-center gap-1.5 rounded-full px-2 text-small font-semibold transition-colors",
                mode === m.id ? "bg-surface text-foreground shadow-card" : "text-muted hover:text-foreground",
              )}
            >
              <m.icon aria-hidden="true" size={16} strokeWidth={1.75} />
              {m.label}
            </button>
          ))}
        </div>
      )}

      <NomineePicker poll={poll} nominees={nominees} nominee={nominee} value={nomineeId} onChange={setNomineeId} />

      {mode === "vote" && <FreeVote key="vote" poll={poll} nominee={nominee} onDone={setDone} />}
      {mode === "boost" && <PaidVote key="boost" kind="boost" poll={poll} nominee={nominee} onDone={setDone} />}
      {mode === "vip" && <PaidVote key="vip" kind="vip" poll={poll} nominee={nominee} onDone={setDone} />}
    </div>
  );
}

function NomineePicker({ poll, nominees, nominee, value, onChange }) {
  const [changing, setChanging] = useState(!nominee);
  const id = useId();
  if (nominee && !changing) {
    const category = poll.categories.find((c) => c.id === nominee.categoryId);
    return (
      <div className="flex items-center gap-3 rounded-2xl bg-surface-muted p-3">
        <NomineeAvatar nominee={nominee} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold text-foreground">{nominee.name}</p>
          <p className="truncate text-small text-muted">{category?.name}</p>
        </div>
        <button type="button" onClick={() => setChanging(true)} className="min-h-11 shrink-0 rounded-full px-3 text-small font-semibold text-link hover:underline">
          Change
        </button>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-small font-semibold text-foreground">
        Who do you want to vote for?
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          if (e.target.value) setChanging(false);
        }}
        className={cn(input, "gd-select appearance-none bg-[length:20px] bg-[right_0.875rem_center] bg-no-repeat pr-11")}
      >
        <option value="">Choose a nominee</option>
        {poll.categories.map((c) => (
          <optgroup key={c.id} label={c.name}>
            {nominees
              .filter((n) => n.categoryId === c.id)
              .map((n) => (
                <option key={n.id} value={n.id}>
                  {n.name}
                </option>
              ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}

function ErrorNote({ error }) {
  if (!error) return null;
  return (
    <p role="alert" className="flex items-start gap-2 rounded-xl bg-error-soft p-4 text-small font-semibold text-error">
      <CircleAlert aria-hidden="true" size={18} strokeWidth={1.75} className="mt-0.5 shrink-0" />
      {error.message || "Something went wrong. Check your connection and try again."}
    </p>
  );
}

function FreeVote({ poll, nominee, onDone }) {
  const codeReq = useRequestVoteCode();
  const cast = useCastVote();
  const [contact, setContact] = useState("");
  const [code, setCode] = useState("");
  const [touched, setTouched] = useState(false);
  const contactId = useId();
  const codeId = useId();
  const contactError = touched && !EMAIL.test(contact.trim()) && !UG_PHONE.test(clean(contact)) ? "Enter a Ugandan mobile number, for example 0772 123 456, or an email address." : "";
  const sent = codeReq.data;

  if (!sent) {
    return (
      <form
        noValidate
        className="flex flex-col gap-5"
        onSubmit={(e) => {
          e.preventDefault();
          setTouched(true);
          if (!nominee || (!EMAIL.test(contact.trim()) && !UG_PHONE.test(clean(contact)))) return;
          codeReq.mutate({ pollId: poll.id, contact: EMAIL.test(contact.trim()) ? contact.trim() : clean(contact) });
        }}
      >
        <ErrorNote error={codeReq.error} />
        <div className="flex flex-col gap-2">
          <label htmlFor={contactId} className="text-small font-semibold text-foreground">
            Phone number or email
          </label>
          <input
            id={contactId}
            className={input}
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            onBlur={() => setTouched(true)}
            autoComplete="tel email"
            placeholder="0772 123 456 or name@gmail.com"
            aria-invalid={contactError ? true : undefined}
            aria-describedby={`${contactId}-note`}
          />
          <p id={`${contactId}-note`} className={cn("text-small", contactError ? "font-semibold text-error" : "text-muted")}>
            {contactError || `We send a six digit code to confirm it is you. You get ${poll.freeVotes.perCategory} free vote per category ${poll.freeVotes.period === "day" ? "every day" : "for this campaign"}.`}
          </p>
        </div>
        <Trust />
        <Button type="submit" size="lg" loading={codeReq.isPending} disabled={!nominee} className="w-full">
          {codeReq.isPending ? "Sending code" : nominee ? `Send my code` : "Choose a nominee first"}
        </Button>
      </form>
    );
  }

  return (
    <form
      noValidate
      className="flex flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        if (code.trim().length !== 6) return;
        cast.mutate(
          { pollId: poll.id, categoryId: nominee.categoryId, nomineeId: nominee.id, contact: sent.sentTo, code },
          { onSuccess: (r) => onDone({ kind: "free", ...r }) },
        );
      }}
    >
      <ErrorNote error={cast.error} />
      <p className="text-muted">
        We sent a code by {sent.channel === "email" ? "email" : "SMS"} to <strong className="text-foreground">{sent.sentTo}</strong>. It works for 10 minutes.
      </p>
      <div className="flex flex-col gap-2">
        <label htmlFor={codeId} className="text-small font-semibold text-foreground">
          Six digit code
        </label>
        <input
          id={codeId}
          className={cn(input, "font-mono text-h4 tracking-[0.4em]")}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="000000"
          autoFocus
        />
        {sent.demoCode && <p className="text-small text-muted">Demo mode: the code is {sent.demoCode}. No message is sent.</p>}
      </div>
      <Button type="submit" size="lg" loading={cast.isPending} disabled={code.length !== 6} className="w-full">
        {cast.isPending ? "Counting your vote" : `Confirm vote for ${nominee?.name.split(" ")[0]}`}
      </Button>
      <button type="button" onClick={() => codeReq.reset()} className="min-h-11 self-center text-small font-semibold text-muted hover:text-foreground">
        Use a different number or email
      </button>
    </form>
  );
}

function Trust() {
  return (
    <p className="flex items-start gap-2 text-small text-muted">
      <ShieldCheck aria-hidden="true" size={18} strokeWidth={1.75} className="mt-0.5 shrink-0 text-success" />
      <span>
        We never show who you voted for. Read the{" "}
        <Link to="/voting-rules" target="_blank" className="font-semibold text-link underline-offset-4 hover:underline">
          Voting Rules
        </Link>
        .
      </span>
    </p>
  );
}

const METHODS = [
  { id: "mtn", label: "MTN MoMo" },
  { id: "airtel", label: "Airtel Money" },
  { id: "card", label: "Card" },
];

function PaidVote({ kind, poll, nominee, onDone }) {
  const buy = useBuyVotes();
  const boost = poll.boost ?? {};
  const packages = poll.vip?.packages ?? [];
  const [votes, setVotes] = useState(boost.quick?.[1] ?? 10);
  const [packageId, setPackageId] = useState(packages.find((p) => p.label)?.id ?? packages[0]?.id);
  const [payer, setPayer] = useState({ name: "", email: "", phone: "", method: "mtn", agree: false });
  const [submitted, setSubmitted] = useState(false);
  const ids = { name: useId(), email: useId(), phone: useId(), qty: useId() };
  const min = boost.min ?? 1;
  const max = boost.max ?? 10000;
  const pack = packages.find((p) => p.id === packageId);
  const amount = kind === "vip" ? pack?.price ?? 0 : votes * (boost.pricePerVote ?? 0);

  const errors = useMemo(() => {
    const e = {};
    if (!nominee) e.nominee = "Choose a nominee.";
    if (kind === "boost" && (votes < min || votes > max)) e.votes = `Choose between ${formatCount(min)} and ${formatCount(max)} votes.`;
    if (payer.name.trim().length < 2) e.name = "Enter your name.";
    if (!EMAIL.test(payer.email.trim())) e.email = "Enter your email. Your receipt goes here.";
    if (payer.method !== "card" && !UG_PHONE.test(clean(payer.phone))) e.phone = `Enter the ${payer.method === "mtn" ? "MTN" : "Airtel"} number that will pay.`;
    if (!payer.agree) e.agree = "Please agree to the Voting Rules.";
    return e;
  }, [nominee, kind, votes, min, max, payer]);
  const show = (k) => (submitted ? errors[k] : "");
  const set = (k) => (e) => setPayer((p) => ({ ...p, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  if (buy.isPending) {
    return (
      <div role="status" className="flex flex-col items-center gap-4 py-8 text-center">
        <span className="size-12 animate-spin rounded-full border-4 border-gd-yellow-500 border-t-transparent" aria-hidden="true" />
        <p className="text-h4">Waiting for payment confirmation</p>
        <p className="max-w-[40ch] text-muted">
          {payer.method === "card" ? "Complete the card payment on the secure page." : `Approve the prompt on ${clean(payer.phone)} with your PIN.`} Votes are added as soon as the payment is confirmed.
        </p>
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
        buy.mutate(
          { pollId: poll.id, nomineeId: nominee.id, kind, votes: kind === "boost" ? votes : undefined, packageId: kind === "vip" ? packageId : undefined, name: payer.name.trim(), email: payer.email.trim(), method: payer.method, phone: clean(payer.phone) },
          { onSuccess: (r) => onDone(r) },
        );
      }}
    >
      <ErrorNote error={buy.error} />

      {kind === "boost" ? (
        <fieldset className="flex flex-col gap-3">
          <legend className="text-small font-semibold text-foreground">How many votes?</legend>
          <div className="flex items-center gap-2">
            <button type="button" aria-label="Fewer votes" onClick={() => setVotes((v) => Math.max(min, v - 1))} className="grid size-12 shrink-0 place-items-center rounded-full border border-border-strong bg-surface hover:bg-surface-muted">
              <Minus aria-hidden="true" size={18} strokeWidth={1.75} />
            </button>
            <label htmlFor={ids.qty} className="sr-only">
              Number of votes
            </label>
            <input
              id={ids.qty}
              inputMode="numeric"
              value={votes}
              onChange={(e) => setVotes(Math.min(max, Number(e.target.value.replace(/\D/g, "")) || 0))}
              className={cn(input, "text-center font-mono text-h4 tabular-nums")}
              aria-invalid={show("votes") ? true : undefined}
            />
            <button type="button" aria-label="More votes" onClick={() => setVotes((v) => Math.min(max, v + 1))} className="grid size-12 shrink-0 place-items-center rounded-full border border-border-strong bg-surface hover:bg-surface-muted">
              <Plus aria-hidden="true" size={18} strokeWidth={1.75} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(boost.quick ?? []).map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setVotes(q)}
                aria-pressed={votes === q}
                className={cn("min-h-11 rounded-full border px-4 text-small font-semibold transition-colors", votes === q ? "border-foreground bg-foreground text-background" : "border-border-strong hover:bg-surface-muted")}
              >
                {formatCount(q)} votes
              </button>
            ))}
          </div>
          <p className={cn("text-small", show("votes") ? "font-semibold text-error" : "text-muted")}>
            {show("votes") || `${formatMoney(boost.pricePerVote, boost.currency)} per vote. Paid votes count the same as free votes.`}
          </p>
        </fieldset>
      ) : (
        <fieldset className="flex flex-col gap-3">
          <legend className="text-small font-semibold text-foreground">Choose a VIP package</legend>
          {packages.map((p) => (
            <label key={p.id} className={cn("relative flex cursor-pointer flex-col gap-2 rounded-2xl border p-4 transition-colors", packageId === p.id ? "border-foreground bg-surface-muted" : "border-border-strong hover:bg-surface-muted")}>
              <input type="radio" name="vip-package" value={p.id} checked={packageId === p.id} onChange={() => setPackageId(p.id)} className="peer sr-only" />
              <span className="flex flex-wrap items-center justify-between gap-2">
                <span className="flex items-center gap-2 font-bold text-foreground">
                  <Crown aria-hidden="true" size={18} strokeWidth={1.75} className="text-gd-yellow-600" />
                  {p.name}
                  {p.label && <span className="rounded-full bg-primary px-2 py-0.5 text-label uppercase text-gd-navy-900">{p.label}</span>}
                </span>
                <span className="font-mono font-semibold tabular-nums">{formatMoney(p.price, poll.vip.currency)}</span>
              </span>
              <ul className="flex flex-col gap-1 text-small text-muted">
                {p.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2">
                    <CircleCheck aria-hidden="true" size={15} strokeWidth={1.75} className="mt-0.5 shrink-0 text-success" />
                    {perk}
                  </li>
                ))}
              </ul>
              <span className="pointer-events-none absolute inset-0 rounded-2xl peer-focus-visible:ring-4 peer-focus-visible:ring-gd-yellow-500/35" />
            </label>
          ))}
        </fieldset>
      )}

      <fieldset className="flex flex-col gap-4">
        <legend className="text-small font-semibold text-foreground">Your details</legend>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Text id={ids.name} label="Full name" value={payer.name} onChange={set("name")} error={show("name")} autoComplete="name" />
          <Text id={ids.email} label="Email" type="email" value={payer.email} onChange={set("email")} error={show("email")} autoComplete="email" placeholder="name@gmail.com" />
        </div>
        <div role="radiogroup" aria-label="Pay with" className="grid grid-cols-3 gap-2">
          {METHODS.map((m) => (
            <label key={m.id} className={cn("flex min-h-12 cursor-pointer items-center justify-center rounded-xl border px-2 text-center text-small font-semibold transition-colors has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-gd-yellow-500/35", payer.method === m.id ? "border-foreground bg-surface-muted" : "border-border-strong hover:bg-surface-muted")}>
              <input type="radio" name="method" value={m.id} checked={payer.method === m.id} onChange={set("method")} className="sr-only" />
              {m.label}
            </label>
          ))}
        </div>
        {payer.method !== "card" && (
          <Text id={ids.phone} label={`${payer.method === "mtn" ? "MTN" : "Airtel"} number that will pay`} type="tel" value={payer.phone} onChange={set("phone")} error={show("phone")} autoComplete="tel" placeholder="0772 123 456" />
        )}
        <label className="flex min-h-11 items-start gap-3 text-small text-foreground">
          <input type="checkbox" checked={payer.agree} onChange={set("agree")} className="mt-0.5 size-5 shrink-0 accent-gd-navy-900" />
          <span>
            I agree to the{" "}
            <Link to="/voting-rules" target="_blank" className="font-semibold text-link underline-offset-4 hover:underline">
              Voting Rules
            </Link>
            . Paid votes are not refundable once added.
          </span>
        </label>
        {show("agree") && <p className="-mt-2 text-small font-semibold text-error">{show("agree")}</p>}
      </fieldset>

      <div className="flex flex-col gap-3 border-t border-border pt-5">
        <p className="flex items-baseline justify-between gap-4">
          <span className="text-muted">{kind === "vip" ? pack?.name : votesLabel(votes)}{nominee ? ` for ${nominee.name}` : ""}</span>
          <span className="font-mono text-h4 font-semibold tabular-nums">{formatMoney(amount)}</span>
        </p>
        <Button type="submit" size="lg" className="w-full">
          Pay {formatMoney(amount)}
        </Button>
        <p className="flex items-start gap-2 text-small text-muted">
          <ShieldCheck aria-hidden="true" size={18} strokeWidth={1.75} className="mt-0.5 shrink-0 text-success" />
          You pay on our payment partner's secure page. GetDigital never sees your PIN or card number.
        </p>
      </div>
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

function Done({ result, nominee, share, onMore, modes, onClose }) {
  const free = result.kind === "free";
  return (
    <div role="status" className="flex flex-col gap-6">
      <div className="flex flex-col items-start gap-3">
        <span className="grid size-12 place-items-center rounded-full bg-success-soft text-success">
          <CircleCheck aria-hidden="true" size={24} strokeWidth={1.75} />
        </span>
        <p className="text-h4">{free ? `Your vote for ${nominee?.name} counted` : `${votesLabel(result.added)} added for ${nominee?.name}`}</p>
        <p className="text-muted">
          {nominee?.name} now has <strong className="font-mono text-foreground">{formatCount(result.votes)}</strong> votes.{" "}
          {free && result.nextFreeVoteAt && "Your next free vote in this category opens tomorrow."}
          {result.kind === "vip" && ` You also get ${result.dailyVotes} votes every day until voting closes.`}
          {!free && ` Receipt reference: ${result.reference}.`}
        </p>
        {result.ticketCode && (
          <p className="flex items-center gap-2 rounded-xl bg-surface-muted px-4 py-3 text-small">
            <Ticket aria-hidden="true" size={18} strokeWidth={1.75} />
            Your event ticket <span className="font-mono font-semibold">{result.ticketCode}</span> is on its way by email.
          </p>
        )}
      </div>
      {share && <ShareBar {...share} label={`Ask friends to vote for ${nominee.name.split(" ")[0]}`} />}
      <div className="flex flex-col gap-2 border-t border-border pt-5 sm:flex-row">
        {modes.some((m) => m.id === "boost") && (
          <Button variant="outline" icon={Zap} onClick={() => onMore("boost")}>
            Add Boost votes
          </Button>
        )}
        {modes.some((m) => m.id === "vip") && result.kind !== "vip" && (
          <Button variant="outline" icon={Crown} onClick={() => onMore("vip")}>
            Become a VIP voter
          </Button>
        )}
        <Button variant="ghost" onClick={onClose} className="sm:ml-auto">
          Close
        </Button>
      </div>
    </div>
  );
}
