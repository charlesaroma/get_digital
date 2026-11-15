/* Site Pages: one lazy chunk per page, numbered as in src/pages. */
import { lazy } from "react";

export const HomePage = lazy(() => import("@/pages/1.home/home"));
export const AboutPage = lazy(() => import("@/pages/2.about/about"));
export const PartnersPage = lazy(() => import("@/pages/3.partners/partners"));
export const PressPage = lazy(() => import("@/pages/4.press/press"));
export const BlogsPage = lazy(() => import("@/pages/5.blogs/blogs"));
export const ContactPage = lazy(() => import("@/pages/8.contact/contact"));
export const VotePage = lazy(() => import("@/pages/6.vote/vote"));
export const TicketsPage = lazy(() => import("@/pages/7.tickets/tickets"));
