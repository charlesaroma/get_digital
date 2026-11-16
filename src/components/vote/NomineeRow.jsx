/* One line of a category leaderboard: rank, nominee, share of the category's votes, Vote. */
import { Trophy } from "lucide-react";
import { Link } from "react-router-dom";

import Button from "@/components/ui/Button";
import { cn } from "@/utils/cn";
import { formatCount } from "@/utils/format";
import NomineeAvatar from "./NomineeAvatar";

const SUFFIX = ["th", "st", "nd", "rd"];
const ordinal = (n) => {
  const v = n % 100;
  return `${n}${SUFFIX[(v - 20) % 10] || SUFFIX[v] || SUFFIX[0]}`;
};

export default function NomineeRow({ nominee, rank, total, href, showCounts, canVote, onVote, winner }) {
  const share = total ? Math.round((nominee.votes / total) * 100) : 0;
  return (
    <li className={cn("relative grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-3 rounded-2xl bg-surface p-4 ring-1 ring-inset ring-border transition-shadow hover:shadow-card sm:grid-cols-[2.25rem_auto_1fr_auto] sm:p-5", winner && "ring-2 ring-gd-yellow-500")}>
      <span className="hidden font-mono text-small font-semibold tabular-nums text-muted sm:block">{showCounts ? ordinal(rank) : ""}</span>
      <NomineeAvatar nominee={nominee} size="row" />
      <div className="min-w-0">
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <Link to={href} className="font-bold text-foreground underline-offset-4 after:absolute after:inset-0 hover:underline">
            {nominee.name}
          </Link>
          {winner && (
            <span className="relative z-10 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-label uppercase text-gd-navy-900">
              <Trophy aria-hidden="true" size={13} strokeWidth={2} /> Winner
            </span>
          )}
        </p>
        <p className="truncate text-small text-muted">
          {nominee.town} <span aria-hidden="true">·</span> {nominee.headline}
        </p>
        {showCounts && (
          <div className="mt-2.5 flex items-center gap-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-muted" role="presentation">
              <div className="h-full rounded-full bg-gd-yellow-500 transition-[width] duration-700 ease-brand" style={{ width: `${Math.max(share, 2)}%` }} />
            </div>
            <p className="shrink-0 text-small text-foreground">
              <span className="font-mono text-body font-bold tabular-nums">{formatCount(nominee.votes)}</span>
              <span className="text-muted"> votes, {share}%</span>
            </p>
          </div>
        )}
      </div>
      {canVote && (
        <Button size="sm" onClick={onVote} className="relative z-10 col-span-2 w-full sm:col-span-1 sm:w-auto">
          Vote<span className="sr-only"> for {nominee.name}</span>
        </Button>
      )}
    </li>
  );
}
