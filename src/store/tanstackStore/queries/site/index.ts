/* Hooks the UI uses. UI never imports services or src/data. */
import { useQuery } from "@tanstack/react-query";
import { getNavigation, getPageCopy } from "../../services/content/pagesApi";
import type { BlogPost } from "../../services/types";
import { blogCategoriesQuery, blogsQuery, partnersQuery, pressQuery, settingsQuery } from "./content";

export const useSettings = () => useQuery(settingsQuery());
export const usePartners = () => useQuery(partnersQuery());
export const useBlogs = () => useQuery(blogsQuery());
export const useBlogCategories = () => useQuery(blogCategoriesQuery());
export const usePress = () => useQuery(pressQuery());

/** One published post by slug, read from the cached list. */
export const useBlog = (slug: string | undefined) =>
  useQuery({
    ...blogsQuery(),
    select: (posts: BlogPost[]) => posts.find((p) => p.slug === slug && p.status === "published") ?? null,
  });

type Pages = Parameters<typeof getPageCopy>[0];
export const usePageCopy = <P extends Pages>(page: P) => getPageCopy(page);
export const useNavigation = () => getNavigation();

export * from "./voting";
export * from "./tickets";
export * from "./forms";
