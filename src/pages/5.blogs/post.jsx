/* One guide at /blogs/:slug. Old WordPress links redirect here.
   Category, title, author, published and updated dates, read time, cover, the full article,
   tags, share bar and related guides. "On this page" lists the sections on wide screens. */
import { ArrowLeft, BookOpen, CalendarDays, Clock, PenLine, RefreshCw } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { Reveal } from "@/components/motion/Reveal";
import ArticleBody from "@/components/site/ArticleBody";
import { CompactGuide } from "@/components/site/GuideCards";
import PhotoFrame from "@/components/site/PhotoFrame";
import ShareBar from "@/components/site/ShareBar";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/Skeleton";
import usePageMeta from "@/seo/usePageMeta";
import { useBlog, useBlogCategories, useBlogs } from "@/store/tanstackStore/queries/site";
import { absoluteUrl, coverOf, formatDate, readMinutesOf, slugify } from "@/utils/format";

export default function BlogPostPage() {
  const { slug } = useParams();
  const { data: post, isPending } = useBlog(slug);
  const { data: all = [] } = useBlogs();
  const { data: categories = [] } = useBlogCategories();
  const nameOf = (id) => categories.find((c) => c.id === id)?.name;
  const sameCategory = all.filter((p) => p.status === "published" && p.slug !== slug && p.categoryId === post?.categoryId);
  const related = [...sameCategory, ...all.filter((p) => p.status === "published" && p.slug !== slug && p.categoryId !== post?.categoryId)].slice(0, 2);
  const minutes = post?.body?.length ? readMinutesOf(post.body) : null;
  const updated = post?.updatedAt && post.updatedAt.slice(0, 10) !== post.publishedAt.slice(0, 10) ? post.updatedAt : null;
  const headings = (post?.body ?? []).filter((b) => b.type === "h2");

  usePageMeta({
    title: post?.title ?? "Guide",
    description: post?.excerpt,
    image: post ? coverOf(post) : undefined,
    imageAlt: post?.imageAlt,
    type: post ? "article" : "website",
    publishedTime: post?.publishedAt,
    modifiedTime: post?.updatedAt,
    jsonLd: post && {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: post.excerpt,
      image: absoluteUrl(coverOf(post)),
      datePublished: post.publishedAt,
      dateModified: post.updatedAt ?? post.publishedAt,
      author: { "@type": "Organization", name: post.author },
      publisher: { "@type": "NGO", name: "GetDigital256", logo: { "@type": "ImageObject", url: absoluteUrl("/logo/gd-logo-primary-light.png") } },
      mainEntityOfPage: absoluteUrl(`/blogs/${post.slug}`),
    },
  });

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
          <Reveal className="mt-6">
            {nameOf(post.categoryId) && <Badge tone="primary">{nameOf(post.categoryId)}</Badge>}
            <h1 className="mt-4 text-h1">{post.title}</h1>
            <p className="mt-5 max-w-[60ch] text-body-lg text-muted">{post.excerpt}</p>
            <ul className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-5 text-small text-muted">
              <li className="flex items-center gap-1.5">
                <PenLine aria-hidden="true" size={16} strokeWidth={1.75} />
                <span className="font-semibold text-foreground">{post.author}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CalendarDays aria-hidden="true" size={16} strokeWidth={1.75} />
                <span>
                  Published <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                </span>
              </li>
              {updated && (
                <li className="flex items-center gap-1.5">
                  <RefreshCw aria-hidden="true" size={15} strokeWidth={1.75} />
                  <span>
                    Updated <time dateTime={updated}>{formatDate(updated)}</time>
                  </span>
                </li>
              )}
              {minutes && (
                <li className="flex items-center gap-1.5">
                  <Clock aria-hidden="true" size={16} strokeWidth={1.75} />
                  {minutes} min read
                </li>
              )}
            </ul>
          </Reveal>
        )}
      </div>

      {post && (
        <>
          <Reveal variant="media" delay={0.06} className="container-gd mt-8 max-w-5xl">
            <PhotoFrame src={coverOf(post)} alt={post.imageAlt ?? ""} caption={`Cover photo for: ${post.title}`} ratio="16 / 9" priority className="rounded-[1.75rem]" />
          </Reveal>

          <div className="container-gd mt-10 grid max-w-5xl grid-cols-1 gap-10 lg:mt-14 lg:grid-cols-[1fr_15rem] lg:gap-14">
            <div className="min-w-0">
              <ArticleBody blocks={post.body ?? [{ type: "p", text: post.excerpt }]} className="max-w-[68ch]" />
              {post.tags?.length > 0 && (
                <ul className="mt-10 flex flex-wrap gap-2" aria-label="Topics">
                  {post.tags.map((t) => (
                    <li key={t}>
                      <Badge>{t}</Badge>
                    </li>
                  ))}
                </ul>
              )}
              <ShareBar className="mt-10 border-t border-border pt-8" path={`/blogs/${post.slug}`} title={post.title} text={post.title} label="Found this useful? Share it" />
            </div>
            {headings.length > 2 && (
              <nav aria-labelledby="toc-title" className="hidden lg:block">
                <div className="sticky top-28 flex flex-col gap-3">
                  <p id="toc-title" className="text-small font-semibold text-foreground">
                    On this page
                  </p>
                  <ol className="flex flex-col gap-1 border-l border-border">
                    {headings.map((h) => (
                      <li key={h.text}>
                        <a href={`#${slugify(h.text)}`} className="-ml-px block border-l border-transparent py-1.5 pl-4 text-small text-muted transition-colors hover:border-foreground hover:text-foreground">
                          {h.text}
                        </a>
                      </li>
                    ))}
                  </ol>
                </div>
              </nav>
            )}
          </div>
        </>
      )}

      {related.length > 0 && (
        <aside aria-labelledby="related-title" className="container-gd mt-16 max-w-5xl border-t border-border pt-10">
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
