/* Admin Routes: mounted under /admin. Auth guard (RequireAdmin) comes with the real sign-in. */
import { Route } from "react-router-dom";

import AdminLayout from "@/AdminDashboard/AdminLayout";
import {
  AdminBlogsPage, AdminLoginPage, AdminMessagesPage, AdminOverviewPage, AdminPartnersPage,
  AdminPressPage, AdminSettingsPage, AdminTicketsPage, AdminVotingPage,
} from "@/AdminDashboard/AdminPages";

export default function adminRoutes() {
  return (
    <>
      <Route path="admin/login" element={<AdminLoginPage />} />
      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<AdminOverviewPage />} />
        <Route path="blogs" element={<AdminBlogsPage />} />
        <Route path="partners" element={<AdminPartnersPage />} />
        <Route path="press" element={<AdminPressPage />} />
        <Route path="voting" element={<AdminVotingPage />} />
        <Route path="tickets" element={<AdminTicketsPage />} />
        <Route path="messages" element={<AdminMessagesPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>
    </>
  );
}
