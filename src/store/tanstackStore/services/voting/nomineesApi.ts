/* nomineesApi (read only for now) */
import seed from "@/data/nominees.json";
import { http, mockApi, useMockApi } from "../api";
import type { Nominee } from "../types";

export const listNominees = ({ signal }: { signal?: AbortSignal } = {}) =>
  useMockApi ? mockApi(() => seed as Nominee[], 250, signal) : http.get<Nominee[]>("nominees", { signal });
