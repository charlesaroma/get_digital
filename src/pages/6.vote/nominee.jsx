/* One nominee at /vote/:campaign/:nominee: the link nominees share. Profile, live total, rank,
   Vote, Boost and VIP, and the rest of the category. */
import { ArrowLeft, Crown, MapPin, Trophy, Vote, Zap } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import { Reveal } from "@/components/motion/Reveal";
import ShareBar from "@/components/site/ShareBar";
import NomineeAvatar from "@/components/vote/NomineeAvatar";
import NomineeRow from "@/components/vote/NomineeRow";
import VoteDialog from "@/components/vote/VoteDialog";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/Skeleton";
import usePageMeta from "@/seo/usePageMeta";
import { usePoll, usePollNominees } from "@/store/tanstackStore/queries/site";
import { formatCount, pollPhase, timeLeftLabel } from "@/utils/format";

export default function NomineePage() {
  const { campaign, nominee: slug } = useParams();
  const { data: poll, isPending } = usePoll(campaign);
  const { data: nominees = [], isPending: loadingNominees } = usePollNominees(poll?.id);
  const [dialog, setDialog] = useState(null);
  const nominee = nominees.find((n) => n.slug === slug);
  const category = poll?.categories.find((c) => c.id === nominee?.categoryId);
  const phase = pollPhase(poll);
  const rivals = nominees.filter((n) => n.categoryId === nominee?.categoryId).sort((a, b) => b.votes - a.votes);
  const rank = rivals.findIndex((n) => n.id === nominee?.id) + 1;
  const catTotal = rivals.reduce((s, n) => s + n.votes, 0);
  const showCounts = Boolean(poll) && phase !== "upcoming" && (poll.showLiveCounts || poll.resultsPublished);

  usePageMeta({
    title: nominee ? `Vote for ${nominee.name}` : "Vote",
    description: nominee && category ? `${nominee.name} is nominated for ${category.name} in ${poll.title}. ${nominee.headline}. Voting is free.` : poll?.summary,
    image: nominee?.image ?? poll?.image ?? undefined,
  });

  if (isPending || (poll && loadingNominees)) {
    return (
      <div className="container-gd grid grid-cols-1 gap-8 py-14 md:grid-cols-[auto_1fr]" aria-busy="true">
        <Skeleton className="size-36 rounded-2xl" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-12 w-2/3" />
          <Skeleton className="h-5 w-full" />
        </div>
      </div>
    );
  }
  if (!poll || !nominee) {
    return (
      <div className="container-gd py-16">
        <EmptyState icon={Vote} title="We could not find this nominee" text="The link may be wrong, or the nominee may have withdrawn." action={<Button to={poll ? `/vote/${poll.slug}` : "/vote"}>See all nominees</Button>} />
      </div>
    );
  }

  const first = nominee.name.split(" ")[0];
  return (
    <>
      <section className="border-b border-border">
        <div className="container-gd pt-8 pb-12 sm:pt-12 lg:pb-16">
          <Link to={`/vote/${poll.slug}`} className="-ml-1 inline-flex min-h-11 items-center gap-2 rounded-full px-1 text-small font-semibold text-muted hover:text-foreground">
            <ArrowLeft aria-hidden="true" size={16} strokeWidth={1.75} />
            {poll.title}
          </Link>
          <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-[auto_1fr] md:gap-10 lg:gap-14">
            <Reveal variant="media">
              <NomineeAvatar nominee={nominee} size="xl" />
            </Reveal>
            <Reveal delay={0.06} className="flex flex-col">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="primary">{category?.name}</Badge>
                {phase === "closed" && poll.resultsPublished && nominee.winner && (
                  <Badge tone="navy" icon={Trophy}>
                    Winner
                  </Badge>
                )}
              </div>
              <h1 className="mt-4 text-h1">{nominee.name}</h1>
              <p className="mt-3 flex items-center gap-1.5 text-muted">
                <MapPin aria-hidden="true" size={16} strokeWidth={1.75} />
                {nominee.town}
              </p>
              <p className="mt-5 max-w-[60ch] font-display text-h4 leading-snug tracking-tight">{nominee.headline}</p>
              <p className="mt-4 max-w-[62ch] text-body-lg text-muted">{nominee.bio}</p>

              {showCounts && (
                <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4 border-t border-border pt-5">
                  <div>
                    <dt className="text-small text-muted">Votes</dt>
                    <dd className="mt-1 font-mono text-h2 font-semibold tabular-nums">{formatCount(nominee.votes)}</dd>
                  </div>
                  <div>
                    <dt className="text-small text-muted">Position</dt>
                    <dd className="mt-1 text-h3">
                      {rank} of {rivals.length}
                    </dd>
                  </div>
                  {phase === "open" && (
                    <div>
                      <dt className="text-small text-muted">Voting</dt>
                      <dd className="mt-1 text-h3">{timeLeftLabel(poll.closesAt)}</dd>
                    </div>
                  )}
                </dl>
              )}

              {phase === "open" && (
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Button size="lg" icon={Vote} onClick={() => setDialog({ mode: "vote" })}>
                    Vote for {first}
                  </Button>
                  {poll.boost?.enabled && (
                    <Button size="lg" variant="outline" icon={Zap} onClick={() => setDialog({ mode: "boost" })}>
                      Boost votes
                    </Button>
                  )}
                  {poll.vip?.enabled && (
                    <Button size="lg" variant="secondary" icon={Crown} onClick={() => setDialog({ mode: "vip" })}>
                      VIP voter
                    </Button>
                  )}
                </div>
              )}

              <ShareBar
                className="mt-10"
                path={`/vote/${poll.slug}/${nominee.slug}`}
                title={`Vote for ${nominee.name}`}
                text={`Vote for ${nominee.name} in ${category?.name}, ${poll.title}. Voting is free:`}
                label={`Share ${first}'s voting link`}
              />
            </Reveal>
          </div>
        </div>
      </section>

      {rivals.length > 1 && (
        <section aria-labelledby="category-title" className="container-gd py-12 sm:py-16">
          <h2 id="category-title" className="text-h3">
            All nominees
          </h2>
          {category?.name && <p className="mt-1 text-muted">Category: {category.name}</p>}
          <ol className="mt-6 flex flex-col gap-3">
            {rivals.map((n, i) => (
              <NomineeRow
                key={n.id}
                nominee={n}
                rank={i + 1}
                total={catTotal}
                href={`/vote/${poll.slug}/${n.slug}`}
                showCounts={showCounts}
                canVote={phase === "open"}
                winner={phase === "closed" && poll.resultsPublished && n.winner}
                onVote={() => setDialog({ mode: "vote", nominee: n })}
              />
            ))}
          </ol>
        </section>
      )}

      <VoteDialog open={Boolean(dialog)} onClose={() => setDialog(null)} poll={poll} nominees={nominees} nominee={dialog?.nominee ?? nominee} mode={dialog?.mode} />
    </>
  );
}
