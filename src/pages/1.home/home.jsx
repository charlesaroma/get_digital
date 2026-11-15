/* Home page: one file per real section in sections/ */
import ContactSection from "@/components/site/ContactSection";
import MissionBento from "@/components/site/MissionBento";
import usePageMeta from "@/seo/usePageMeta";
import { usePageCopy } from "@/store/tanstackStore/queries/site";
import AiCohort from "./sections/AiCohort";
import FeaturedGuides from "./sections/FeaturedGuides";
import Hero from "./sections/Hero";
import Partners from "./sections/Partners";

export default function HomePage() {
  const { hero } = usePageCopy("home");
  usePageMeta({ description: hero.text });
  return (
    <>
      <Hero />
      <MissionBento />
      <AiCohort />
      <Partners />
      <FeaturedGuides />
      <ContactSection />
    </>
  );
}
