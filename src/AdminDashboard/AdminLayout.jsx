/* Admin shell: sidebar + outlet. Sidebar order comes from lib/constants.jsx. */
import { Suspense } from "react";
import { Link, Outlet } from "react-router-dom";

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
        <Suspense fallback={null}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}
