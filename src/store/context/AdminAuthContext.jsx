/* Admin auth realm. Separate from any public-site state; session key getdigital:auth:admin. */
import { createContext, useContext, useMemo, useState } from "react";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const value = useMemo(() => ({ admin, signIn: setAdmin, signOut: () => setAdmin(null) }), [admin]);
  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAdminAuth = () => useContext(AdminAuthContext);
