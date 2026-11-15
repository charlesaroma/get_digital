/* Mock Api */
import { ApiError } from "./error";

/** Resolves `resolver()` after a short delay, honouring an AbortSignal. */
export function mockApi<T>(resolver: () => T, ms = 250, signal?: AbortSignal): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      try { resolve(resolver()); } catch (e) { reject(e); }
    }, ms);
    signal?.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(new ApiError(0, "aborted", "Request aborted"));
    });
  });
}
