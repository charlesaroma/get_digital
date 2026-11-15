/* Api Config */
// `npm run dev:dummy` runs Vite in mode "dummy": services answer from src/data.
export const useMockApi = import.meta.env.MODE === "dummy";

const read = (key: string, fallback: string) => {
  const v: unknown = import.meta.env?.[key];
  return typeof v === "string" && v.trim() ? v.trim() : fallback;
};

export const apiBaseUrl = read("VITE_API_BASE_URL", "").replace(/\/+$/, "");
export const apiVersion = read("VITE_API_VERSION", "v1");
export const apiTimeout = Number(read("VITE_API_TIMEOUT", "15000"));
export const apiRoot = `${apiBaseUrl}/api/${apiVersion}`;

export const apiUrl = (path: string) => `${apiRoot}/${path.replace(/^\/+/, "")}`;
