/* Voting hub: the featured campaign with its countdown and current leaders, how voting works,
   then open campaigns, coming soon and past results. Counts are public and refresh live. */
import { ArrowRight, Crown, KeyRound, ListChecks, Share2, Vote, Zap } from "lucide-react";
import { Link } from "react-router-dom";

import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import PhotoFrame from "@/components/site/PhotoFrame";
import CampaignCard from "@/components/vote/CampaignCard";
import Countdown from "@/components/vote/Countdown";
import NomineeAvatar from "@/components/vote/NomineeAvatar";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import SectionHeading from "@/components/ui/SectionHeading";
import Skeleton from "@/components/ui/Skeleton";
import usePageMeta from "@/seo/usePageMeta";
import { useNominees, usePageCopy, usePolls } from "@/store/tanstackStore/queries/site";
import { formatCount, formatDate, formatMoney, pollPhase } from "@/utils/format";

const STEPS = [
  { icon: ListChecks, title: "Pick a nominee", text: "Open a campaign, choose a category and tap Vote on the person or business you back." },
  { icon: KeyRound, title: "Confirm with a code", text: "Enter your phone number or email. We send a six digit code so every voter counts once." },
  { icon: Vote, title: "Your vote counts", text: "One free vote per category every day. Totals update live for everyone to see." },
  { icon: Share2, title: "Share their link", text: "Every nominee has their own link. Send it on WhatsApp so friends can vote too." },
];

export default function VotePage() {
  const copy = usePageCopy("vote");
  const polls = usePolls();
  const nominees = useNominees();
  const all = polls.data ?? [];
  const byPoll = (id) => (nominees.data ?? []).filter((n) => n.pollId === id);
  const open = all.filter((p) => pollPhase(p) === "open");
  const featured = open.find((p) => p.featured) ?? open[0];
  const otherOpen = open.filter((p) => p !== featured);
  const upcoming = all.filter((p) => pollPhase(p) === "upcoming");
  const results = all.filter((p) => pollPhase(p) === "closed" && p.resultsPublished);

  usePageMeta({
    title: featured ? `Vote: ${featured.title}` : copy.title,
    description: featured?.summary ?? copy.text,
    image: featured?.image ?? undefined,
  });

  if (polls.isPending) {
    return (
      <div className="container-gd grid grid-cols-1 gap-10 py-14 lg:grid-cols-12" aria-busy="true" aria-label="Loading campaigns">
        <div className="flex flex-col gap-4 lg:col-span-7">
          <Skeleton className="h-7 w-40 rounded-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-6 w-4/5" />
          <Skeleton className="mt-4 h-24 w-full max-w-md rounded-xl" />
        </div>
        <Skeleton className="aspect-[4/3] rounded-2xl lg:col-span-5" />
      </div>
    );
  }

  if (!all.length) {
    return (
      <section className="container-gd py-16">
        <EmptyState icon={Vote} title={copy.emptyTitle} text={copy.emptyText} />
      </section>
    );
  }

  return (
    <>
      {featured && <Featured poll={featured} nominees={byPoll(featured.id)} loading={nominees.isPending} />}

      <section id="how-voting-works" aria-labelledby="how-title" className="scroll-mt-24 border-y border-border bg-gd-stone-100 py-16 sm:py-20 dark:bg-gd-navy-900">
        <div className="container-gd">
          <SectionHeading id="how-title" eyebrow="How voting works" title="Free to vote. Counted once. Shown live." text="Anyone with a phone number or email can vote. Paid votes are optional and count exactly the same as free ones." />
          <Stagger as="ol" className="mt-10 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <StaggerItem as="li" key={s.title} className="flex flex-col gap-3 border-t border-border-strong pt-5">
                <span className="flex items-center gap-3">
                  <span className="font-mono text-small font-semibold text-link">0{i + 1}</span>
                  <s.icon aria-hidden="true" size={20} strokeWidth={1.75} className="text-foreground" />
                </span>
                <h3 className="text-h4">{s.title}</h3>
                <p className="text-muted">{s.text}</p>
              </StaggerItem>
            ))}
          </Stagger>
          {featured && (featured.boost?.enabled || featured.vip?.enabled) && (
            <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2">
              {featured.boost?.enabled && (
                <div className="flex gap-4 rounded-2xl bg-surface p-6 ring-1 ring-inset ring-border">
                  <Zap aria-hidden="true" size={22} strokeWidth={1.75} className="mt-1 shrink-0 text-gd-yellow-600" />
                  <div>
                    <h3 className="text-h4">Boost votes</h3>
                    <p className="mt-1 text-muted">
                      Add as many votes as you like for {formatMoney(featured.boost.pricePerVote, featured.boost.currency)} each, by mobile money or card.
                    </p>
                  </div>
                </div>
              )}
              {featured.vip?.enabled && (
                <div className="flex gap-4 rounded-2xl bg-surface p-6 ring-1 ring-inset ring-border">
                  <Crown aria-hidden="true" size={22} strokeWidth={1.75} className="mt-1 shrink-0 text-gd-yellow-600" />
                  <div>
                    <h3 className="text-h4">VIP voter</h3>
                    <p className="mt-1 text-muted">
                      From {formatMoney(Math.min(...featured.vip.packages.map((p) => p.price)), featured.vip.currency)}: votes straight away, extra votes every day until close, and a ticket to the Gala Night.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
          <p className="mt-8 text-small text-muted">
            Full details in the{" "}
            <Link to="/voting-rules" className="font-semibold text-link underline-offset-4 hover:underline">
              Voting Rules
            </Link>
            . Money from paid votes funds GetDigital's free digital skills classes.
          </p>
        </div>
      </section>

      <CampaignList id="more" title={featured ? "More campaigns" : "Campaigns"} items={[...otherOpen, ...upcoming, ...results]} byPoll={byPoll} />
    </>
  );
}

function Featured({ poll, nominees, loading }) {
  const total = nominees.reduce((s, n) => s + n.votes, 0);
  const leaders = poll.categories.map((c) => ({ category: c, top: nominees.filter((n) => n.categoryId === c.id).sort((a, b) => b.votes - a.votes)[0] })).filter((l) => l.top);

  return (
    <section aria-labelledby="featured-title" className="relative overflow-hidden">
      <div className="container-gd grid grid-cols-1 gap-10 pt-10 pb-16 sm:pt-14 lg:grid-cols-12 lg:gap-12 lg:pb-20">
        <Reveal className="flex flex-col lg:col-span-7">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="success">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60 motion-reduce:animate-none" />
                <span className="relative inline-flex size-2 rounded-full bg-success" />
              </span>
              Voting open
            </Badge>
            <span className="text-small font-semibold text-muted">Featured campaign</span>
          </div>
          <h1 id="featured-title" className="mt-5 max-w-[16ch] text-h1">
            {poll.title}
          </h1>
          <p className="mt-5 max-w-[56ch] text-body-lg text-muted">{poll.summary}</p>
          <Countdown to={poll.closesAt} className="mt-8" />
          <dl className="mt-8 grid max-w-md grid-cols-3 gap-4 border-t border-border pt-5">
            {[
              ["Votes so far", loading ? null : formatCount(total)],
              ["Nominees", loading ? null : nominees.length],
              ["Categories", poll.categories.length],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-small text-muted">{label}</dt>
                <dd className="mt-1 font-mono text-h4 font-semibold tabular-nums text-foreground">{value ?? <Skeleton className="h-7 w-16" />}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button to={`/vote/${poll.slug}`} size="lg" iconRight={ArrowRight}>
              Vote now
            </Button>
            <Button href="#how-voting-works" variant="outline" size="lg">
              How voting works
            </Button>
          </div>
        </Reveal>
        <Reveal variant="media" delay={0.1} className="lg:col-span-5">
          <PhotoFrame src={poll.image} alt={poll.imageAlt ?? ""} caption={`Campaign photo: ${poll.title}`} ratio="4 / 5" priority className="max-lg:aspect-[16/10]!" />
          <p className="mt-3 text-small text-muted">Results announced {formatDate(poll.resultsAt)}.</p>
        </Reveal>
      </div>

      {leaders.length > 0 && (
        <div className="container-gd pb-16 lg:pb-20">
          <h2 className="flex items-center gap-2 text-h4">
            Leading right now
            <span className="text-small font-normal text-muted">(updates live)</span>
          </h2>
          <Stagger as="ul" className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {leaders.map(({ category, top }) => (
              <StaggerItem as="li" key={category.id}>
                <Link
                  to={`/vote/${poll.slug}#${category.id}`}
                  className="flex h-full flex-col gap-3 rounded-2xl bg-surface p-4 ring-1 ring-inset ring-border transition-[box-shadow,transform] duration-300 ease-brand hover:-translate-y-0.5 hover:shadow-card"
                >
                  <span className="text-label uppercase text-muted">{category.name}</span>
                  <span className="flex items-center gap-3">
                    <NomineeAvatar nominee={top} size="sm" />
                    <span className="min-w-0">
                      <span className="block truncate font-bold text-foreground">{top.name}</span>
                      <span className="block font-mono text-small tabular-nums text-muted">{formatCount(top.votes)} votes</span>
                    </span>
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      )}
    </section>
  );
}

function CampaignList({ id, title, items, byPoll }) {
  if (!items.length) return null;
  return (
    <section aria-labelledby={`${id}-title`} className="py-14 sm:py-16">
      <div className="container-gd">
        <h2 id={`${id}-title`} className="text-h2">
          {title}
        </h2>
        <Stagger as="ul" className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {items.map((p) => (
            <StaggerItem as="li" key={p.id}>
              <CampaignCard poll={p} nominees={byPoll(p.id)} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
