/* blogsApi (read only) */
import seed from "@/data/blogs.json";
import { http, mockApi, useMockApi } from "../api";
import type { BlogPost } from "../types";

export const listBlogs = ({ signal }: { signal?: AbortSignal } = {}) =>
  useMockApi ? mockApi(() => seed as BlogPost[], 250, signal) : http.get<BlogPost[]>("blogs", { signal });
