/* ticketTypesApi (read only for now) */
import seed from "@/data/ticket-types.json";
import { http, mockApi, useMockApi } from "../api";
import type { TicketType } from "../types";

export const listTicketTypes = ({ signal }: { signal?: AbortSignal } = {}) =>
  useMockApi ? mockApi(() => seed as TicketType[], 250, signal) : http.get<TicketType[]>("ticket-types", { signal });
