/* Admin shell: sidebar + outlet. Sidebar order comes from lib/constants.jsx. */
import { Suspense } from "react";
import { Link, Outlet } from "react-router-dom";

import LogoLoader from "@/components/motion/LogoLoader";

import { ADMIN_NAV } from "./lib/constants";

export default function AdminLayout() {
  return (
    <div>
      <aside>
        {ADMIN_NAV.map((item) => (
          <Link key={item.to} to={item.to}>{item.label}</Link>
        ))}
      </aside>
      <main>
        <Suspense fallback={<LogoLoader />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}
