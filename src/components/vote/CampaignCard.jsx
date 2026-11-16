/* A voting campaign in a list: photo, status, title, summary, the key date and totals. */
import { ArrowRight, CalendarClock, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

import PhotoFrame from "@/components/site/PhotoFrame";
import Badge from "@/components/ui/Badge";
import { formatCount, formatDate, pollPhase, timeLeftLabel } from "@/utils/format";

export default function CampaignCard({ poll, nominees = [] }) {
  const phase = pollPhase(poll);
  const total = nominees.reduce((sum, n) => sum + n.votes, 0);
  const winners = nominees.filter((n) => n.winner);
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-surface ring-1 ring-inset ring-border transition-[box-shadow,transform] duration-300 ease-brand hover:-translate-y-1 hover:shadow-lift">
      <PhotoFrame src={poll.image} alt={poll.imageAlt ?? ""} caption={poll.title} ratio="16 / 9" className="rounded-none ring-0" />
      <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          {phase === "open" && <Badge tone="success">Voting open</Badge>}
          {phase === "upcoming" && <Badge tone="info">Coming soon</Badge>}
          {phase === "closed" && <Badge tone="neutral">{poll.resultsPublished ? "Results out" : "Voting closed"}</Badge>}
          <span className="flex items-center gap-1.5 text-small text-muted">
            <CalendarClock aria-hidden="true" size={15} strokeWidth={1.75} />
            {phase === "open" && timeLeftLabel(poll.closesAt)}
            {phase === "upcoming" && `Opens ${formatDate(poll.opensAt)}`}
            {phase === "closed" && `Closed ${formatDate(poll.closesAt)}`}
          </span>
        </div>
        <h3 className="text-h4 text-foreground">
          <Link to={`/vote/${poll.slug}`} className="after:absolute after:inset-0">
            {poll.title}
          </Link>
        </h3>
        <p className="text-muted">{poll.summary}</p>
        {phase === "closed" && poll.resultsPublished && winners.length > 0 && (
          <ul className="flex flex-col gap-1.5 text-small">
            {winners.map((w) => (
              <li key={w.id} className="flex items-center gap-2">
                <Trophy aria-hidden="true" size={15} strokeWidth={1.75} className="shrink-0 text-gd-yellow-600" />
                <span className="font-semibold text-foreground">{w.name}</span>
                <span className="truncate text-muted">{poll.categories.find((c) => c.id === w.categoryId)?.name}</span>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4 text-small">
          <span className="text-muted">
            {phase === "upcoming" ? `${poll.categories.length} categories` : `${formatCount(total)} votes, ${nominees.length} nominees`}
          </span>
          <span className="flex items-center gap-1 font-semibold text-foreground">
            {phase === "closed" ? "See results" : phase === "open" ? "Vote now" : "Find out more"}
            <ArrowRight aria-hidden="true" size={16} strokeWidth={1.75} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </span>
        </p>
      </div>
    </article>
  );
}
