/* eventsApi (read only on the public site) */
import seed from "@/data/events.json";
import { http, mockApi, useMockApi } from "../api";
import type { EventItem } from "../types";

export const listEvents = ({ signal }: { signal?: AbortSignal } = {}) =>
  useMockApi
    ? mockApi(() => (seed as EventItem[]).filter((e) => e.status !== "draft"), 250, signal)
    : http.get<EventItem[]>("events", { signal });
