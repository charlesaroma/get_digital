/* Admin auth realm, separate from the public site. The session lives in sessionStorage
   (key getdigital:auth:admin), so closing the tab signs staff out. Real mode: the token is
   checked by the server on every request; this context only remembers who is signed in. */
import { createContext, useContext, useMemo, useState } from "react";

const KEY = "getdigital:auth:admin";
const AdminAuthContext = createContext(null);

const read = () => {
  try {
    return JSON.parse(sessionStorage.getItem(KEY)) ?? null;
  } catch {
    return null;
  }
};

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(read);
  const value = useMemo(
    () => ({
      admin,
      signIn: (session) => {
        try {
          sessionStorage.setItem(KEY, JSON.stringify(session));
        } catch {
          /* private mode: stays signed in until reload */
        }
        setAdmin(session);
      },
      signOut: () => {
        try {
          sessionStorage.removeItem(KEY);
        } catch {
          /* nothing stored */
        }
        setAdmin(null);
      },
    }),
    [admin],
  );
  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAdminAuth = () => useContext(AdminAuthContext);
