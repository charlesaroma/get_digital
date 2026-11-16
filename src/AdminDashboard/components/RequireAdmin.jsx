/* Sends anyone who is not signed in to /admin/login, then back to where they were going. */
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAdminAuth } from "@/store/context/AdminAuthContext";

export default function RequireAdmin() {
  const { admin } = useAdminAuth();
  const location = useLocation();
  if (!admin) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  return <Outlet />;
}
