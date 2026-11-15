/* blogsApi (read only) */
import seed from "@/data/blogs.json";
import categories from "@/data/blog-categories.json";
import { http, mockApi, useMockApi } from "../api";
import type { BlogCategory, BlogPost } from "../types";

export const listBlogs = ({ signal }: { signal?: AbortSignal } = {}) =>
  useMockApi ? mockApi(() => seed as BlogPost[], 250, signal) : http.get<BlogPost[]>("blogs", { signal });

export const listBlogCategories = ({ signal }: { signal?: AbortSignal } = {}) =>
  useMockApi ? mockApi(() => categories as BlogCategory[], 150, signal) : http.get<BlogCategory[]>("blog-categories", { signal });
