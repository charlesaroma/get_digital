/* authApi: staff sign in. The real API checks a hashed password and returns a session token.
   Dummy mode checks src/data/staff.json so the dashboard can be tried locally. */
import staff from "@/data/staff.json";
import { ApiError, http, mockApi, useMockApi } from "../api";
import type { StaffSession } from "../types";

type StaffRow = { id: string; name: string; email: string; role: "owner" | "editor"; password: string; active: boolean; permissions?: string[] };
const ALL = ["blogs", "partners", "press", "voting", "tickets", "messages", "settings"];

export const signIn = (input: { email: string; password: string }) =>
  useMockApi
    ? mockApi<StaffSession>(() => {
        const row = (staff as StaffRow[]).find((s) => s.email.toLowerCase() === input.email.trim().toLowerCase());
        if (!row || row.password !== input.password || !row.active) throw new ApiError(401, "bad_credentials", "Email or password is not right.");
        return { id: row.id, name: row.name, email: row.email, role: row.role, permissions: row.role === "owner" ? ALL : row.permissions ?? [], token: `dummy.${row.id}.${Date.now()}` };
      }, 700)
    : http.post<StaffSession>("auth/staff/sign-in", input);
