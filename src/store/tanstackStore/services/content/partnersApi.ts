/* partnersApi (read only) */
import seed from "@/data/partners.json";
import { http, mockApi, useMockApi } from "../api";
import type { Partner } from "../types";

export const listPartners = ({ signal }: { signal?: AbortSignal } = {}) =>
  useMockApi ? mockApi(() => seed as Partner[], 250, signal) : http.get<Partner[]>("partners", { signal });
