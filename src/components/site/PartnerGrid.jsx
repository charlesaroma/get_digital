/* Partner cards with hover lift and an expandable "Read more" drawer.
   Loading shows skeleton cards; errors and empty lists explain what to do. */
import { ArrowUpRight, Handshake, Plus, RotateCcw } from "lucide-react";
import { useId, useState } from "react";

import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/Skeleton";
import { usePartners } from "@/store/tanstackStore/queries/site";
import { cn } from "@/utils/cn";
import { hostOf, initialsOf } from "@/utils/format";

const BADGE_TONES = [
  "bg-gd-navy-900 text-gd-yellow-500",
  "bg-gd-yellow-500 text-gd-navy-900",
  "bg-gd-stone-200 text-gd-navy-900 dark:bg-gd-navy-700 dark:text-white",
];

export default function PartnerGrid({ className }) {
  const { data, isPending, isError, refetch } = usePartners();
  const partners = (data ?? []).filter((p) => p.active).sort((a, b) => a.position - b.position);

  if (isPending) {
    return (
      <ul className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2", className)} aria-busy="true" aria-label="Loading partners">
        {Array.from({ length: 6 }).map((_, i) => (
          <li key={i} className="rounded-2xl border border-border bg-surface p-6">
            <div className="flex items-center gap-4">
              <Skeleton className="size-14 rounded-xl" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </div>
            <Skeleton className="mt-5 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-4/5" />
          </li>
        ))}
      </ul>
    );
  }

  if (isError) {
    return (
      <EmptyState
        tone="error"
        icon={Handshake}
        title="We could not load our partners"
        text="Check your internet connection and try again."
        action={
          <Button variant="outline" icon={RotateCcw} onClick={() => refetch()}>
            Try again
          </Button>
        }
      />
    );
  }

  if (!partners.length) {
    return <EmptyState icon={Handshake} title="Partners coming soon" text="We are updating this list. Contact us if you would like to work with GetDigital." />;
  }

  return (
    <Stagger as="ul" className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2", className)}>
      {partners.map((p, i) => (
        <StaggerItem as="li" key={p.id}>
          <PartnerCard partner={p} tone={BADGE_TONES[i % BADGE_TONES.length]} />
        </StaggerItem>
      ))}
    </Stagger>
  );
}

function PartnerCard({ partner, tone }) {
  const [open, setOpen] = useState(false);
  const regionId = useId();

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-border bg-surface p-5 shadow-card transition-[transform,box-shadow] duration-300 ease-brand hover:-translate-y-1 hover:shadow-lift sm:p-6">
      <div className="flex items-center gap-4">
        <HexBadge className={tone}>{initialsOf(partner.name)}</HexBadge>
        <div className="min-w-0">
          <h3 className="font-sans text-[1.0625rem] font-bold leading-snug text-foreground">{partner.name}</h3>
          <p className="truncate text-small text-muted">{hostOf(partner.url)}</p>
        </div>
      </div>
      <p className={cn("mt-4 text-muted", !open && "line-clamp-2")}>{partner.description}</p>
      <div id={regionId} className="grid transition-[grid-template-rows] duration-300 ease-brand" style={{ gridTemplateRows: open ? "1fr" : "0fr" }}>
        <div className="overflow-hidden">
          <a
            href={partner.url}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={open ? 0 : -1}
            className="mt-3 inline-flex min-h-11 items-center gap-1.5 font-semibold text-link underline-offset-4 hover:underline"
          >
            Visit {hostOf(partner.url)}
            <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.75} />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>
      </div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={regionId}
        onClick={() => setOpen((o) => !o)}
        className="mt-auto -ml-1 inline-flex min-h-11 items-center gap-1.5 self-start rounded-full px-1 pt-2 text-small font-semibold text-foreground"
      >
        <Plus aria-hidden="true" size={16} strokeWidth={2} className={cn("transition-transform duration-300 ease-brand", open && "rotate-45")} />
        {open ? "Show less" : "Read more"}
        <span className="sr-only"> about {partner.name}</span>
      </button>
    </article>
  );
}

function HexBadge({ className, children }) {
  return (
    <span aria-hidden="true" className={cn("relative grid size-14 shrink-0 place-items-center font-display text-[1rem] font-semibold [clip-path:polygon(25%_4%,75%_4%,100%_50%,75%_96%,25%_96%,0_50%)]", className)}>
      {children}
    </span>
  );
}
