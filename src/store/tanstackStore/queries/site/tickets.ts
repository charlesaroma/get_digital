import { queryOptions, useQuery } from "@tanstack/react-query";
import { listEvents } from "../../services/tickets/eventsApi";
import { listTicketTypes } from "../../services/tickets/ticketTypesApi";
import { siteRoot } from "../keys";

export const eventsQuery = () => queryOptions({ queryKey: [...siteRoot, "events"], queryFn: ({ signal }) => listEvents({ signal }) });
export const ticketTypesQuery = () => queryOptions({ queryKey: [...siteRoot, "ticket-types"], queryFn: ({ signal }) => listTicketTypes({ signal }) });
export const useEvents = () => useQuery(eventsQuery());
export const useTicketTypes = () => useQuery(ticketTypesQuery());
