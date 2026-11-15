/* messagesApi: contact form (write only). Dummy mode pretends to send. */
import { http, mockApi, useMockApi } from "../api";
import type { ContactMessageInput, SubmitResult } from "../types";

export const sendMessage = (input: ContactMessageInput) =>
  useMockApi
    ? mockApi<SubmitResult>(() => ({ id: `msg_${Date.now()}`, receivedAt: new Date().toISOString() }), 900)
    : http.post<SubmitResult>("messages", input);
