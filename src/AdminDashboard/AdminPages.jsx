/* Admin Pages: lazy barrel, numbered as in AdminDashboard/pages */
import { lazy } from "react";

export const AdminLoginPage = lazy(() => import("./pages/1.auth/login"));
export const AdminOverviewPage = lazy(() => import("./pages/2.overview/overview"));
export const AdminBlogsPage = lazy(() => import("./pages/3.blogs/blogs"));
export const AdminPartnersPage = lazy(() => import("./pages/4.partners/partners"));
export const AdminPressPage = lazy(() => import("./pages/5.press/press"));
export const AdminVotingPage = lazy(() => import("./pages/6.voting/voting"));
export const AdminTicketsPage = lazy(() => import("./pages/7.tickets/tickets"));
export const AdminMessagesPage = lazy(() => import("./pages/8.messages/messages"));
export const AdminSettingsPage = lazy(() => import("./pages/9.settings/settings"));
