/* One campaign at /vote/:campaign. Countdown, categories with live leaderboards, and the vote window.
   Upcoming campaigns list the categories; closed ones show the results once published. */
import { ArrowLeft, CalendarClock, Crown, Ticket, Trophy, Vote, Zap } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import { Reveal } from "@/components/motion/Reveal";
import ShareBar from "@/components/site/ShareBar";
import Countdown from "@/components/vote/Countdown";
import Leaderboard from "@/components/vote/Leaderboard";
import VoteDialog from "@/components/vote/VoteDialog";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/Skeleton";
import usePageMeta from "@/seo/usePageMeta";
import { usePoll, usePollNominees } from "@/store/tanstackStore/queries/site";
import { formatCount, formatDate, formatDay, formatTime, pollPhase } from "@/utils/format";

export default function CampaignPage() {
  const { campaign } = useParams();
  const { data: poll, isPending } = usePoll(campaign);
  const { data: nominees = [] } = usePollNominees(poll?.id);
  const [dialog, setDialog] = useState(null);
  const phase = pollPhase(poll);
  const total = nominees.reduce((s, n) => s + n.votes, 0);
  const showCounts = Boolean(poll) && phase !== "upcoming" && (poll.showLiveCounts || poll.resultsPublished);

  usePageMeta({
    title: poll ? poll.title : "Vote",
    description: poll?.summary,
    image: poll?.image ?? undefined,
    imageAlt: poll?.imageAlt,
    jsonLd: poll && { "@context": "https://schema.org", "@type": "Event", name: poll.title, description: poll.summary, startDate: poll.opensAt, endDate: poll.closesAt, eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode", organizer: { "@type": "NGO", name: "GetDigital256", url: "https://gd256.org" } },
  });

  if (isPending) {
    return (
      <div className="container-gd flex flex-col gap-4 py-14" aria-busy="true">
        <Skeleton className="h-7 w-40 rounded-full" />
        <Skeleton className="h-14 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="mt-8 h-24 w-full rounded-2xl" />
        <Skeleton className="h-24 w-full rounded-2xl" />
      </div>
    );
  }
  if (!poll) {
    return (
      <div className="container-gd py-16">
        <EmptyState icon={Vote} title="We could not find that campaign" text="It may have ended or the link may be wrong." action={<Button to="/vote">See all campaigns</Button>} />
      </div>
    );
  }

  return (
    <>
      <section className="border-b border-border">
        <div className="container-gd pt-8 pb-12 sm:pt-12 lg:pb-16">
          <Link to="/vote" className="-ml-1 inline-flex min-h-11 items-center gap-2 rounded-full px-1 text-small font-semibold text-muted hover:text-foreground">
            <ArrowLeft aria-hidden="true" size={16} strokeWidth={1.75} />
            All campaigns
          </Link>
          <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
            <Reveal className="lg:col-span-7">
              <div className="flex flex-wrap items-center gap-2">
                {phase === "open" && <Badge tone="success">Voting open</Badge>}
                {phase === "upcoming" && <Badge tone="info">Opens {formatDate(poll.opensAt)}</Badge>}
                {phase === "closed" && <Badge>{poll.resultsPublished ? "Final results" : "Voting closed, results coming"}</Badge>}
              </div>
              <h1 className="mt-5 text-h1">{poll.title}</h1>
              <p className="mt-5 max-w-[62ch] text-body-lg text-muted">{poll.description}</p>
              <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
                {phase !== "upcoming" && (
                  <div>
                    <dt className="text-small text-muted">Total votes</dt>
                    <dd className="mt-1 font-mono text-h3 font-semibold tabular-nums">{formatCount(total)}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-small text-muted">Categories</dt>
                  <dd className="mt-1 font-mono text-h3 font-semibold tabular-nums">{poll.categories.length}</dd>
                </div>
                <div>
                  <dt className="text-small text-muted">Results</dt>
                  <dd className="mt-1 text-h4">{formatDate(poll.resultsAt)}</dd>
                </div>
              </dl>
            </Reveal>
            <Reveal delay={0.08} className="flex flex-col gap-6 lg:col-span-5">
              <div className="rounded-2xl bg-gd-stone-100 p-5 ring-1 ring-inset ring-border sm:p-6 dark:bg-gd-navy-900">
                {phase === "open" && <Countdown to={poll.closesAt} compact />}
                {phase === "upcoming" && <Countdown to={poll.opensAt} label="Voting opens in" compact />}
                {phase === "closed" && (
                  <p className="flex items-start gap-3 text-muted">
                    <CalendarClock aria-hidden="true" size={20} strokeWidth={1.75} className="mt-0.5 shrink-0" />
                    Voting closed on {formatDay(poll.closesAt)} at {formatTime(poll.closesAt)} EAT.
                  </p>
                )}
                {phase === "open" && (
                  <div className="mt-6 flex flex-col gap-2 border-t border-border pt-5">
                    <p className="text-small text-muted">
                      {poll.freeVotes.perCategory} free vote per category {poll.freeVotes.period === "day" ? "every day" : "for the whole campaign"}.
                    </p>
                    <div className="flex flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
                      {poll.boost?.enabled && (
                        <Button variant="outline" icon={Zap} onClick={() => setDialog({ mode: "boost" })}>
                          Boost votes
                        </Button>
                      )}
                      {poll.vip?.enabled && (
                        <Button variant="secondary" icon={Crown} onClick={() => setDialog({ mode: "vip" })}>
                          Become a VIP voter
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <ShareBar path={`/vote/${poll.slug}`} title={poll.title} text={`${poll.title}: ${poll.summary}`} label="Share this campaign" />
            </Reveal>
          </div>
        </div>
      </section>

      {poll.categories.length > 1 && (
        <nav aria-label="Categories" className="sticky top-16 z-20 lg:top-[4.5rem] border-b border-border bg-background/90 backdrop-blur">
          <ul className="container-gd flex gap-2 overflow-x-auto py-3 [scrollbar-width:none]">
            {poll.categories.map((c) => (
              <li key={c.id} className="shrink-0">
                <a href={`#${c.id}`} className="inline-flex min-h-11 items-center rounded-full border border-border-strong bg-surface px-4 text-small font-semibold text-foreground hover:bg-surface-muted">
                  {c.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <div className="container-gd flex flex-col gap-14 py-12 sm:py-16">
        {poll.categories.map((c) => {
          const list = nominees.filter((n) => n.categoryId === c.id).sort((a, b) => (showCounts ? b.votes - a.votes : a.position - b.position));
          const catTotal = list.reduce((s, n) => s + n.votes, 0);
          return (
            <section key={c.id} id={c.id} aria-labelledby={`${c.id}-title`} className="scroll-mt-40">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 id={`${c.id}-title`} className="text-h3">
                    {c.name}
                  </h2>
                  <p className="mt-1 text-muted">{c.description}</p>
                </div>
                {showCounts && <p className="font-mono text-small tabular-nums text-muted">{formatCount(catTotal)} votes</p>}
              </div>
              {list.length ? (
                <Leaderboard
                  nominees={list}
                  showCounts={showCounts}
                  canVote={phase === "open"}
                  hrefFor={(n) => `/vote/${poll.slug}/${n.slug}`}
                  isWinner={(n) => phase === "closed" && poll.resultsPublished && n.winner}
                  onVote={(n) => setDialog({ mode: "vote", nominee: n })}
                />
              ) : (
                <p className="mt-6 rounded-2xl border border-dashed border-border-strong p-6 text-muted">Nominees are announced when voting opens.</p>
              )}
            </section>
          );
        })}

        {poll.eventSlug && (
          <aside className="flex flex-col gap-4 rounded-2xl bg-gd-stone-100 p-6 ring-1 ring-inset ring-border sm:flex-row sm:items-center sm:p-8 dark:bg-gd-navy-900">
            <Trophy aria-hidden="true" size={28} strokeWidth={1.75} className="shrink-0 text-gd-yellow-600" />
            <div className="flex-1">
              <h2 className="text-h4">Be there when the winners are announced</h2>
              <p className="mt-1 text-muted">Tickets for the Gala Night on {formatDate(poll.resultsAt)} are on sale now.</p>
            </div>
            <Button to={`/tickets/${poll.eventSlug}`} variant="outline" icon={Ticket}>
              Get tickets
            </Button>
          </aside>
        )}
      </div>

      <VoteDialog open={Boolean(dialog)} onClose={() => setDialog(null)} poll={poll} nominees={nominees} nominee={dialog?.nominee} mode={dialog?.mode} />
    </>
  );
}
