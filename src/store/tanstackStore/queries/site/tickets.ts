import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listEvents } from "../../services/tickets/eventsApi";
import { createTicketOrder } from "../../services/tickets/ordersApi";
import { listTicketTypes } from "../../services/tickets/ticketTypesApi";
import type { EventItem } from "../../services/types";
import { siteRoot } from "../keys";

export const eventsQuery = () => queryOptions({ queryKey: [...siteRoot, "events"], queryFn: ({ signal }) => listEvents({ signal }) });
export const ticketTypesQuery = () => queryOptions({ queryKey: [...siteRoot, "ticket-types"], queryFn: ({ signal }) => listTicketTypes({ signal }) });
export const useEvents = () => useQuery(eventsQuery());
export const useTicketTypes = () => useQuery(ticketTypesQuery());
export const useEvent = (slug: string | undefined) =>
  useQuery({ ...eventsQuery(), select: (events: EventItem[]) => events.find((e) => e.slug === slug) ?? null });

export function useCreateTicketOrder() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: createTicketOrder, onSuccess: () => qc.invalidateQueries({ queryKey: ticketTypesQuery().queryKey }) });
}
