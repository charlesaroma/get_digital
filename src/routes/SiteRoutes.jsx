/* Site Routes */
import { Route } from "react-router-dom";

import NotFound from "@/pages/not-found";
import SiteLayout from "./SiteLayout";
import { AboutPage, BlogsPage, ContactPage, HomePage, PartnersPage, PressPage, TicketsPage, VotePage } from "./pages";

export default function siteRoutes() {
  return (
    <Route element={<SiteLayout />}>
      <Route index element={<HomePage />} />
      <Route path="about" element={<AboutPage />} />
      <Route path="partners" element={<PartnersPage />} />
      <Route path="press" element={<PressPage />} />
      <Route path="blogs" element={<BlogsPage />} />
      <Route path="vote" element={<VotePage />} />
      <Route path="tickets" element={<TicketsPage />} />
      <Route path="contact" element={<ContactPage />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  );
}
