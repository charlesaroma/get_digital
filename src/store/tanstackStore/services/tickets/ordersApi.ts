/* ordersApi: book tickets. The server checks seats, takes payment through the provider and
   emails the tickets. Dummy mode issues ticket codes straight away. */
import seedOrders from "@/data/ticket-orders.json";
import { ApiError, http, mockApi, useMockApi } from "../api";
import type { TicketOrder, TicketOrderInput } from "../types";
import { dummyTicketTypes } from "./ticketTypesApi";

const ref = () => `GD-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

export const createTicketOrder = (input: TicketOrderInput) =>
  useMockApi
    ? mockApi<TicketOrder>(() => {
        const lines = input.items.filter((i) => i.quantity > 0);
        if (!lines.length) throw new ApiError(422, "empty", "Choose at least one ticket.");
        let total = 0;
        for (const line of lines) {
          const t = dummyTicketTypes.find((x) => x.id === line.ticketTypeId);
          if (!t || !t.active) throw new ApiError(422, "unavailable", "One of these tickets is no longer on sale.");
          if (t.capacity - t.sold < line.quantity) throw new ApiError(409, "sold_out", `Only ${t.capacity - t.sold} ${t.name} tickets are left.`);
          total += t.price * line.quantity;
        }
        const reference = ref();
        const tickets = lines.flatMap((line) => {
          const t = dummyTicketTypes.find((x) => x.id === line.ticketTypeId)!;
          t.sold += line.quantity;
          return Array.from({ length: line.quantity }, () => ({ ticketTypeId: t.id, checkedInAt: null }));
        }).map((t, i) => ({ ...t, code: `${reference}-${i + 1}` }));
        return {
          id: `ord_${Date.now()}`, reference, eventId: input.eventId, items: lines, name: input.name, email: input.email, phone: input.phone,
          total, currency: "UGX", paymentMethod: total === 0 ? "free" : input.paymentMethod, status: total === 0 ? "confirmed" : "paid",
          createdAt: new Date().toISOString(), tickets,
        };
      }, 1600)
    : http.post<TicketOrder>("ticket-orders", input);

/** Admin: every order, newest first. */
export const listTicketOrders = ({ signal }: { signal?: AbortSignal } = {}) =>
  useMockApi
    ? mockApi(() => [...(seedOrders as TicketOrder[])].sort((a, b) => b.createdAt.localeCompare(a.createdAt)), 250, signal)
    : http.get<TicketOrder[]>("admin/ticket-orders", { signal });
