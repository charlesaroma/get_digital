/* pressApi (read only) */
import seed from "@/data/press.json";
import { http, mockApi, useMockApi } from "../api";
import type { PressRelease } from "../types";

export const listPress = ({ signal }: { signal?: AbortSignal } = {}) =>
  useMockApi ? mockApi(() => seed as PressRelease[], 250, signal) : http.get<PressRelease[]>("press", { signal });
