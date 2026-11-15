/* Site Shell: skip link, header, page, footer. */
import { Suspense } from "react";
import { Outlet } from "react-router-dom";

import ScrollManager from "@/components/layout/ScrollManager";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import LogoLoader from "@/components/motion/LogoLoader";
import { useNavigation } from "@/store/tanstackStore/queries/site";

export default function SiteLayout() {
  const { main, cta } = useNavigation();
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-secondary focus:px-5 focus:py-3 focus:font-semibold focus:text-secondary-foreground"
      >
        Skip to main content
      </a>
      <ScrollManager />
      <SiteHeader items={main} cta={cta} />
      <main id="main" tabIndex={-1} className="outline-none">
        <Suspense fallback={<LogoLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <SiteFooter items={main} cta={cta} />
    </>
  );
}
