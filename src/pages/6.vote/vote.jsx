/* Vote page: open polls and their nominees. Shows a clear empty state until a poll opens. */
import { CalendarDays, GraduationCap, Vote } from "lucide-react";

import PageHeader from "@/components/site/PageHeader";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { SkeletonGroup, SkeletonPanel } from "@/components/ui/Skeleton";
import usePageMeta from "@/seo/usePageMeta";
import { useNominees, usePageCopy, usePolls } from "@/store/tanstackStore/queries/site";
import { formatDate } from "@/utils/format";

export default function VotePage() {
  const copy = usePageCopy("vote");
  usePageMeta({ title: copy.title, description: copy.text });
  const polls = usePolls();
  const nominees = useNominees();
  const open = (polls.data ?? []).filter((p) => p.status === "open");

  return (
    <>
      <PageHeader eyebrow="Awards" title={copy.title} text={copy.text} />
      <section aria-label="Polls" className="py-12 sm:py-16 lg:py-20">
        <div className="container-gd max-w-5xl">
          {polls.isPending ? (
            <SkeletonGroup label="Loading polls">
              <SkeletonPanel />
            </SkeletonGroup>
          ) : !open.length ? (
            <EmptyState icon={Vote} title={copy.emptyTitle} text={copy.emptyText} action={<Button to="/#free-ai-course" variant="outline" icon={GraduationCap}>Free AI course</Button>} />
          ) : (
            <ul className="flex flex-col gap-6">
              {open.map((poll) => (
                <li key={poll.id} className="rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-8">
                  <Badge tone="success" icon={CalendarDays}>
                    Open until {formatDate(poll.closesAt)}
                  </Badge>
                  <h2 className="mt-4 text-h3">{poll.title}</h2>
                  <p className="mt-2 text-muted">{poll.description}</p>
                  <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {(nominees.data ?? [])
                      .filter((n) => n.pollId === poll.id)
                      .sort((a, b) => a.position - b.position)
                      .map((n) => (
                        <li key={n.id} className="rounded-xl border border-border p-4">
                          <p className="font-bold">{n.name}</p>
                          <p className="mt-1 text-small text-muted">{n.bio}</p>
                        </li>
                      ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
