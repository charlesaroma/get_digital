/* settingsApi (read only) */
import seed from "@/data/settings.json";
import { http, mockApi, useMockApi } from "../api";
import type { Settings } from "../types";

export const getSettings = ({ signal }: { signal?: AbortSignal } = {}) =>
  useMockApi ? mockApi(() => seed as Settings, 100, signal) : http.get<Settings>("settings", { signal });
