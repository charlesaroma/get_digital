/* A nominee as a portrait card: name above the photo, live vote count below.
   While voting is open the photo is the Vote button; otherwise it opens the profile. */
import { Trophy } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { cn } from "@/utils/cn";
import { formatCount, initialsOf } from "@/utils/format";

const ordinal = (n) => {
  const v = n % 100;
  return `${n}${["th", "st", "nd", "rd"][(v - 20) % 10] || ["th", "st", "nd", "rd"][v] || "th"}`;
};

function Portrait({ nominee, winner }) {
  const [failed, setFailed] = useState(false);
  return (
    <span className="relative block aspect-[3/4] overflow-hidden rounded-2xl bg-primary-soft ring-1 ring-inset ring-border transition duration-300 group-hover:-translate-y-1 group-hover:shadow-card group-focus-visible:ring-2 group-focus-visible:ring-foreground">
      {nominee.image && !failed ? (
        <img src={nominee.image} alt="" loading="lazy" onError={() => setFailed(true)} className="size-full object-cover object-[center_25%] transition duration-500 group-hover:scale-105" />
      ) : (
        <span aria-hidden="true" className="grid size-full place-items-center font-display text-h2 font-semibold text-gd-navy-900 dark:text-gd-yellow-100">
          {initialsOf(nominee.name)}
        </span>
      )}
      {winner && (
        <span className="absolute inset-x-2 bottom-2 inline-flex items-center justify-center gap-1 rounded-full bg-primary px-2.5 py-1 text-label uppercase text-gd-navy-900">
          <Trophy aria-hidden="true" size={13} strokeWidth={2} /> Winner
        </span>
      )}
    </span>
  );
}

export default function NomineeCard({ nominee, rank, href, showCounts, canVote, onVote, winner, className }) {
  const label = `${nominee.name}${showCounts ? `, ${formatCount(nominee.votes)} votes, ${ordinal(rank)}` : ""}${canVote ? ". Vote" : ""}`;
  const photo = <Portrait nominee={nominee} winner={winner} />;
  return (
    <li className={cn("group flex flex-col text-center", className)}>
      <p className="mb-2.5 truncate text-small font-semibold text-foreground">{nominee.name}</p>
      {canVote ? (
        <button type="button" onClick={onVote} aria-label={label} className="block w-full outline-none">
          {photo}
        </button>
      ) : (
        <Link to={href} aria-label={label} className="block w-full outline-none">
          {photo}
        </Link>
      )}
      {showCounts && (
        <p className="mt-2.5 leading-none">
          <span className="font-mono text-h4 font-bold tabular-nums text-foreground">{formatCount(nominee.votes)}</span>
          <span className="ml-1.5 text-label uppercase text-muted">votes</span>
        </p>
      )}
      {canVote && (
        <Link to={href} className="mx-auto mt-2 inline-flex min-h-11 items-center px-3 text-small text-muted underline-offset-4 hover:text-foreground hover:underline">
          Profile<span className="sr-only"> of {nominee.name}</span>
        </Link>
      )}
    </li>
  );
}
