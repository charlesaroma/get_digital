/* Site Shell: header, page, footer. Real chrome lands in components/layout. */
import { Suspense } from "react";
import { Link, Outlet } from "react-router-dom";

import { useNavigation } from "@/store/tanstackStore/queries/site";

export default function SiteLayout() {
  const { main } = useNavigation();
  return (
    <>
      <header>
        <nav>
          {main.map((item) => (
            <Link key={item.title} to={item.target.page}>{item.title}</Link>
          ))}
        </nav>
      </header>
      <main id="main">
        <Suspense fallback={null}>
          <Outlet />
        </Suspense>
      </main>
      <footer />
    </>
  );
}
