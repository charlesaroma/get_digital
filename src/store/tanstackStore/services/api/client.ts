/* Http Client */
import { apiTimeout, apiUrl } from "./config";
import { ApiError } from "./error";

export const http = {
  async get<T>(path: string, opts: { signal?: AbortSignal } = {}): Promise<T> {
    const timeout = AbortSignal.timeout(apiTimeout);
    const signal = opts.signal ? AbortSignal.any([opts.signal, timeout]) : timeout;
    const res = await fetch(apiUrl(path), { signal, headers: { Accept: "application/json" } });
    if (!res.ok) throw new ApiError(res.status, "http_error", res.statusText);
    return (await res.json()) as T;
  },
};
