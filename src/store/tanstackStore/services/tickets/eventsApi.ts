/* eventsApi (read only for now) */
import seed from "@/data/events.json";
import { http, mockApi, useMockApi } from "../api";
import type { EventItem } from "../types";

export const listEvents = ({ signal }: { signal?: AbortSignal } = {}) =>
  useMockApi ? mockApi(() => seed as EventItem[], 250, signal) : http.get<EventItem[]>("events", { signal });
