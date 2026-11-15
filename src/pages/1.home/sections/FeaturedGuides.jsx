/* Featured guides: lead story plus three compact stories, newest first. */
import { ArrowRight, BookOpen, RotateCcw } from "lucide-react";

import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { CompactGuide, GuidesSkeleton, LeadGuide } from "@/components/site/GuideCards";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import SectionHeading from "@/components/ui/SectionHeading";
import { useBlogCategories, useBlogs, usePageCopy } from "@/store/tanstackStore/queries/site";

export default function FeaturedGuides() {
  const { guides } = usePageCopy("home");
  const { data, isPending, isError, refetch } = useBlogs();
  const { data: categories } = useBlogCategories();
  const nameOf = (id) => categories?.find((c) => c.id === id)?.name;
  const posts = (data ?? []).filter((p) => p.status === "published").sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const [lead, ...rest] = posts;

  return (
    <section id="featured-guides" aria-labelledby="guides-title" className="py-16 sm:py-20 lg:py-28">
      <div className="container-gd">
        <Reveal>
          <SectionHeading
            id="guides-title"
            eyebrow={guides.eyebrow}
            title={guides.title}
            text={guides.text}
            action={
              <Button to="/blogs" variant="outline" iconRight={ArrowRight}>
                View all guides
              </Button>
            }
          />
        </Reveal>
        <div className="mt-10 lg:mt-14">
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
          ) : !lead ? (
            <EmptyState icon={BookOpen} title="New guides are on the way" text="Our first guides on the new website will appear here soon." />
          ) : (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-8">
              <Reveal className="lg:col-span-7">
                <LeadGuide post={lead} category={nameOf(lead.categoryId)} />
              </Reveal>
              <Stagger className="flex flex-col gap-1 divide-y divide-border lg:col-span-5">
                {rest.slice(0, 3).map((post) => (
                  <StaggerItem key={post.id} className="pt-1 first:pt-0">
                    <CompactGuide post={post} category={nameOf(post.categoryId)} />
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
