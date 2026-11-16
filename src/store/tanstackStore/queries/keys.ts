/* Realm roots. The public site and the admin dashboard never share cache entries. */
export const siteRoot = ["site"] as const;
export const adminRoot = ["admin"] as const;
