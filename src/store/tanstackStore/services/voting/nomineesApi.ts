/* nomineesApi: nominees with their live totals. Dummy mode keeps totals in memory so votes show up. */
import seed from "@/data/nominees.json";
import { http, mockApi, useMockApi } from "../api";
import type { Nominee } from "../types";

/** In dummy mode this is the "database" that votesApi writes to. */
export const dummyNominees: Nominee[] = (seed as Nominee[]).map((n) => ({ ...n }));

export const listNominees = ({ signal }: { signal?: AbortSignal } = {}) =>
  useMockApi ? mockApi(() => dummyNominees.map((n) => ({ ...n })), 200, signal) : http.get<Nominee[]>("nominees", { signal });
