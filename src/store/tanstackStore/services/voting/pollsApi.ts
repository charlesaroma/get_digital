/* pollsApi: voting campaigns (read only on the public site) */
import seed from "@/data/polls.json";
import { http, mockApi, useMockApi } from "../api";
import type { Poll } from "../types";

export const listPolls = ({ signal }: { signal?: AbortSignal } = {}) =>
  useMockApi
    ? mockApi(() => (seed as Poll[]).filter((p) => p.status !== "draft"), 250, signal)
    : http.get<Poll[]>("polls", { signal });
