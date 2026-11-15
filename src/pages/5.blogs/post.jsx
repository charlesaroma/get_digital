/* One guide at /blogs/:slug. Old WordPress links redirect here. */
import { ArrowLeft, BookOpen, Clock, Info } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { Reveal } from "@/components/motion/Reveal";
import { CompactGuide } from "@/components/site/GuideCards";
import PhotoFrame from "@/components/site/PhotoFrame";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/Skeleton";
import usePageMeta from "@/seo/usePageMeta";
import { useBlog, useBlogCategories, useBlogs, usePageCopy } from "@/store/tanstackStore/queries/site";
import { coverOf, formatDate } from "@/utils/format";

export default function BlogPostPage() {
  const { slug } = useParams();
  const copy = usePageCopy("blogs");
  const { data: post, isPending } = useBlog(slug);
  const { data: all = [] } = useBlogs();
  const { data: categories = [] } = useBlogCategories();
  usePageMeta({ title: post?.title ?? "Guide", description: post?.excerpt });
  const nameOf = (id) => categories.find((c) => c.id === id)?.name;
  const related = all.filter((p) => p.status === "published" && p.slug !== slug).slice(0, 2);

  return (
    <article className="pb-16 sm:pb-20 lg:pb-28">
      <div className="container-gd max-w-4xl pt-8 sm:pt-12">
        <Link to="/blogs" className="-ml-1 inline-flex min-h-11 items-center gap-2 rounded-full px-1 text-small font-semibold text-muted transition-colors hover:text-foreground">
          <ArrowLeft aria-hidden="true" size={16} strokeWidth={1.75} />
          All guides
        </Link>

        {isPending ? (
          <div className="mt-6 flex flex-col gap-4" aria-busy="true">
            <Skeleton className="h-7 w-40 rounded-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="mt-4 aspect-[16/9] w-full rounded-2xl" />
          </div>
        ) : !post ? (
          <EmptyState
            className="mt-6"
            icon={BookOpen}
            title="We could not find that guide"
            text="It may have moved during the switch to our new website."
            action={<Button to="/blogs">See all guides</Button>}
          />
        ) : (
          <>
            <Reveal className="mt-6">
              {nameOf(post.categoryId) && <Badge tone="primary">{nameOf(post.categoryId)}</Badge>}
              <h1 className="mt-4 text-h1">{post.title}</h1>
              <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-muted">
                <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                {post.readMinutes ? (
                  <span className="flex items-center gap-1.5">
                    <Clock aria-hidden="true" size={16} strokeWidth={1.75} />
                    {post.readMinutes} min read
                  </span>
                ) : null}
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <PhotoFrame src={coverOf(post)} alt="" caption={`Cover photo for: ${post.title}`} ratio="16 / 9" priority className="mt-8 rounded-[1.75rem]" />
            </Reveal>
            <Reveal delay={0.12} className="mx-auto mt-10 max-w-[68ch]">
              <p className="font-display text-h4 leading-snug tracking-tight text-foreground">{post.excerpt}</p>
              <p className="mt-8 flex items-start gap-3 rounded-2xl bg-info-soft p-5 text-info">
                <Info aria-hidden="true" size={20} strokeWidth={1.75} className="mt-0.5 shrink-0" />
                <span className="font-semibold">{copy.movingNote}</span>
              </p>
            </Reveal>
          </>
        )}
      </div>

      {related.length > 0 && (
        <aside aria-labelledby="related-title" className="container-gd mt-16 max-w-4xl border-t border-border pt-10">
          <h2 id="related-title" className="text-h3">
            More guides
          </h2>
          <ul className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {related.map((p) => (
              <li key={p.id}>
                <CompactGuide post={p} category={nameOf(p.categoryId)} />
              </li>
            ))}
          </ul>
        </aside>
      )}
    </article>
  );
}
