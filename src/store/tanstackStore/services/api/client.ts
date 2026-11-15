/* Http Client */
import { apiTimeout, apiUrl } from "./config";
import { ApiError } from "./error";

const withTimeout = (signal?: AbortSignal) => {
  const timeout = AbortSignal.timeout(apiTimeout);
  return signal ? AbortSignal.any([signal, timeout]) : timeout;
};

async function parse<T>(res: Response): Promise<T> {
  if (!res.ok) throw new ApiError(res.status, "http_error", res.statusText);
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const http = {
  async get<T>(path: string, opts: { signal?: AbortSignal } = {}): Promise<T> {
    const res = await fetch(apiUrl(path), { signal: withTimeout(opts.signal), headers: { Accept: "application/json" } });
    return parse<T>(res);
  },
  async post<T>(path: string, body: unknown, opts: { signal?: AbortSignal } = {}): Promise<T> {
    const res = await fetch(apiUrl(path), {
      method: "POST",
      signal: withTimeout(opts.signal),
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return parse<T>(res);
  },
};
