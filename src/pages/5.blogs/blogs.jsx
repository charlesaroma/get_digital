/* Blogs page: category filter and guide grid. */
import { BookOpen, RotateCcw } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { GridGuide, GuidesSkeleton } from "@/components/site/GuideCards";
import PageHeader from "@/components/site/PageHeader";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import usePageMeta from "@/seo/usePageMeta";
import { useBlogCategories, useBlogs, usePageCopy } from "@/store/tanstackStore/queries/site";
import { cn } from "@/utils/cn";

export default function BlogsPage() {
  const copy = usePageCopy("blogs");
  usePageMeta({ title: copy.title, description: copy.text });
  const [category, setCategory] = useState("all");
  const { data, isPending, isError, refetch } = useBlogs();
  const { data: categories = [] } = useBlogCategories();
  const nameOf = (id) => categories.find((c) => c.id === id)?.name;

  const published = (data ?? []).filter((p) => p.status === "published").sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const posts = category === "all" ? published : published.filter((p) => p.categoryId === category);
  const filters = [{ id: "all", name: "All guides" }, ...[...categories].sort((a, b) => a.position - b.position)];

  return (
    <>
      <PageHeader eyebrow="Guides" title={copy.title} text={copy.text} />
      <section aria-label="Guides" className="py-12 sm:py-16 lg:py-20">
        <div className="container-gd">
          <div className="-mx-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:overflow-visible sm:px-0">
            <ul className="flex w-max gap-2 sm:w-auto sm:flex-wrap" aria-label="Filter guides by category">
              {filters.map((f) => {
                const active = f.id === category;
                return (
                  <li key={f.id}>
                    <button
                      type="button"
                      aria-pressed={active}
                      onClick={() => setCategory(f.id)}
                      className={cn(
                        "relative min-h-11 rounded-full px-4 text-small font-semibold whitespace-nowrap transition-colors duration-200",
                        active ? "text-white dark:text-gd-navy-900" : "border border-border bg-surface text-muted hover:text-foreground",
                      )}
                    >
                      {active && (
                        <motion.span layoutId="blog-filter-pill" className="absolute inset-0 rounded-full bg-secondary" transition={{ type: "spring", stiffness: 420, damping: 34 }} />
                      )}
                      <span className="relative">{f.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="mt-8">
            {isPending ? (
              <GuidesSkeleton />
            ) : isError ? (
              <EmptyState
                tone="error"
                icon={BookOpen}
                title="We could not load the guides"
                text="Check your internet connection and try again."
                action={
                  <Button variant="outline" icon={RotateCcw} onClick={() => refetch()}>
                    Try again
                  </Button>
                }
              />
            ) : !posts.length ? (
              <EmptyState
                icon={BookOpen}
                title={copy.empty}
                text="Try another category or see all guides."
                action={
                  <Button variant="outline" onClick={() => setCategory("all")}>
                    Show all guides
                  </Button>
                }
              />
            ) : (
              <Stagger key={category} as="ul" className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:gap-6">
                {posts.map((post, i) => (
                  <StaggerItem as="li" key={post.id} className={i === 0 && posts.length > 2 ? "sm:col-span-2 lg:col-span-1" : undefined}>
                    <GridGuide post={post} category={nameOf(post.categoryId)} />
                  </StaggerItem>
                ))}
              </Stagger>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
