/* Magazine style guide cards: a large lead story and compact follow ups. Whole card is clickable. */
import { Clock } from "lucide-react";
import { Link } from "react-router-dom";

import Badge from "@/components/ui/Badge";
import Skeleton from "@/components/ui/Skeleton";
import { cn } from "@/utils/cn";
import { coverOf, formatDate } from "@/utils/format";
import PhotoFrame from "./PhotoFrame";

function Meta({ post, className }) {
  return (
    <p className={cn("flex flex-wrap items-center gap-x-3 gap-y-1 text-small text-muted", className)}>
      <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
      {post.readMinutes ? (
        <span className="flex items-center gap-1.5">
          <Clock aria-hidden="true" size={14} strokeWidth={1.75} />
          {post.readMinutes} min read
        </span>
      ) : null}
    </p>
  );
}

export function LeadGuide({ post, category }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-surface-muted">
      <div className="overflow-hidden">
        <PhotoFrame src={coverOf(post)} alt="" caption={`Cover photo for: ${post.title}`} ratio="16 / 10" className="rounded-none ring-0 transition-transform duration-500 ease-brand group-hover:scale-[1.02]" />
      </div>
      <div className="flex flex-1 flex-col p-6 sm:p-8">
        {category && <Badge tone="primary" className="self-start">{category}</Badge>}
        <h3 className="mt-4 text-h3">
          <Link to={`/blogs/${post.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {post.title}
          </Link>
        </h3>
        <p className="mt-3 max-w-[60ch] text-muted">{post.excerpt}</p>
        <Meta post={post} className="mt-auto pt-6" />
      </div>
    </article>
  );
}

export function CompactGuide({ post, category }) {
  return (
    <article className="group relative flex gap-4 rounded-2xl p-3 transition-colors duration-200 hover:bg-surface sm:gap-5 sm:p-4">
      <PhotoFrame src={coverOf(post)} alt="" ratio="1 / 1" className="w-24 shrink-0 rounded-xl sm:w-28 [&_figcaption]:hidden [&_span.font-mono]:hidden" />
      <div className="min-w-0 py-1">
        {category && <p className="eyebrow text-link">{category}</p>}
        <h3 className="mt-1.5 font-sans text-[1.0625rem] font-bold leading-snug text-foreground">
          <Link to={`/blogs/${post.slug}`} className="after:absolute after:inset-0 after:rounded-2xl after:content-['']">
            {post.title}
          </Link>
        </h3>
        <Meta post={post} className="mt-2" />
      </div>
    </article>
  );
}

export function GridGuide({ post, category }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-card transition-[transform,box-shadow] duration-300 ease-brand hover:-translate-y-1 hover:shadow-lift">
      <PhotoFrame src={coverOf(post)} alt="" caption={`Cover photo for: ${post.title}`} ratio="16 / 10" className="rounded-none ring-0" />
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {category && <Badge tone="primary" className="self-start">{category}</Badge>}
        <h3 className="mt-3 font-sans text-h4 font-bold">
          <Link to={`/blogs/${post.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {post.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-muted">{post.excerpt}</p>
        <Meta post={post} className="mt-auto pt-5" />
      </div>
    </article>
  );
}

export function GuidesSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-12" aria-busy="true" aria-label="Loading guides">
      <div className="overflow-hidden rounded-[1.75rem] border border-border bg-surface lg:col-span-7">
        <Skeleton className="aspect-[16/10] w-full rounded-none" />
        <div className="flex flex-col gap-3 p-8">
          <Skeleton className="h-6 w-32 rounded-full" />
          <Skeleton className="h-8 w-4/5" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
      <div className="flex flex-col gap-3 lg:col-span-5">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex gap-4 p-4">
            <Skeleton className="size-24 shrink-0 rounded-xl sm:size-28" />
            <div className="flex flex-1 flex-col gap-2 py-1">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
