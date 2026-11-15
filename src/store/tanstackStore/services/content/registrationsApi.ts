/* registrationsApi: free AI course sign up (write only). Dummy mode pretends to send. */
import { http, mockApi, useMockApi } from "../api";
import type { CourseRegistrationInput, SubmitResult } from "../types";

export const registerForCourse = (input: CourseRegistrationInput) =>
  useMockApi
    ? mockApi<SubmitResult>(() => ({ id: `reg_${Date.now()}`, receivedAt: new Date().toISOString() }), 900)
    : http.post<SubmitResult>("course-registrations", input);
