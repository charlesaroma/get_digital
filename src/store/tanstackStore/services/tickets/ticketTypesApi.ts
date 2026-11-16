/* ticketTypesApi: prices and seats left. Dummy mode keeps "sold" in memory so orders show up. */
import seed from "@/data/ticket-types.json";
import { http, mockApi, useMockApi } from "../api";
import type { TicketType } from "../types";

export const dummyTicketTypes: TicketType[] = (seed as TicketType[]).map((t) => ({ ...t }));

export const listTicketTypes = ({ signal }: { signal?: AbortSignal } = {}) =>
  useMockApi ? mockApi(() => dummyTicketTypes.map((t) => ({ ...t })), 200, signal) : http.get<TicketType[]>("ticket-types", { signal });
