/* Site Routes */
import { Route } from "react-router-dom";

import NotFound from "@/pages/not-found";
import SiteLayout from "./SiteLayout";
import {
  AboutPage, BlogPostPage, BlogsPage, CampaignPage, ContactPage, EventPage, HomePage, LegalPage, NomineePage,
  PartnersPage, PressPage, PressReleasePage, TicketsPage, VotePage,
} from "./pages";

/** Legal pages share one layout; the slug picks the document. */
const LEGAL = ["privacy", "terms", "voting-rules", "ticket-terms", "cookies"];

export default function siteRoutes() {
  return (
    <Route element={<SiteLayout />}>
      <Route index element={<HomePage />} />
      <Route path="about" element={<AboutPage />} />
      <Route path="partners" element={<PartnersPage />} />
      <Route path="press" element={<PressPage />} />
      <Route path="press/:slug" element={<PressReleasePage />} />
      <Route path="blogs" element={<BlogsPage />} />
      <Route path="blogs/:slug" element={<BlogPostPage />} />
      <Route path="vote" element={<VotePage />} />
      <Route path="vote/:campaign" element={<CampaignPage />} />
      <Route path="vote/:campaign/:nominee" element={<NomineePage />} />
      <Route path="tickets" element={<TicketsPage />} />
      <Route path="tickets/:event" element={<EventPage />} />
      <Route path="contact" element={<ContactPage />} />
      {LEGAL.map((slug) => (
        <Route key={slug} path={slug} element={<LegalPage key={slug} slug={slug} />} />
      ))}
      <Route path="*" element={<NotFound />} />
    </Route>
  );
}
