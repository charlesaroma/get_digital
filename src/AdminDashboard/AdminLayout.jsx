/* Admin shell: sidebar (filtered by the staff member's permissions), top bar, outlet. */
import { ExternalLink, LogOut, Menu, X } from "lucide-react";
import { Suspense, useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";

import LogoLoader from "@/components/motion/LogoLoader";
import Logo from "@/components/site/Logo";
import { useAdminAuth } from "@/store/context/AdminAuthContext";
import { cn } from "@/utils/cn";

import { ADMIN_NAV } from "./lib/constants";

export default function AdminLayout() {
  const { admin, signOut } = useAdminAuth();
  const [open, setOpen] = useState(false);
  const items = ADMIN_NAV.filter((i) => !i.perm || admin?.permissions?.includes(i.perm));

  const nav = (
    <nav aria-label="Admin" className="flex flex-col gap-1">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === "/admin"}
          onClick={() => setOpen(false)}
          className={({ isActive }) => cn("flex min-h-11 items-center rounded-xl px-4 text-small font-semibold transition-colors", isActive ? "bg-gd-navy-900 text-white" : "text-muted hover:bg-surface-muted hover:text-foreground")}
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="min-h-dvh bg-gd-stone-100 dark:bg-gd-navy-950">
      <header className="sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur">
        <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
          <button type="button" onClick={() => setOpen((o) => !o)} aria-label={open ? "Close menu" : "Open menu"} className="grid size-11 place-items-center rounded-full hover:bg-surface-muted lg:hidden">
            {open ? <X aria-hidden="true" size={20} strokeWidth={1.75} /> : <Menu aria-hidden="true" size={20} strokeWidth={1.75} />}
          </button>
          <Link to="/admin" className="flex items-center gap-3">
            <Logo alt="GetDigital256 admin" className="h-8" />
            <span className="rounded-full bg-surface-muted px-2.5 py-1 text-label uppercase text-muted max-xs:hidden">Admin</span>
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <a href="/" target="_blank" rel="noreferrer" className="hidden min-h-11 items-center gap-1.5 rounded-full px-3 text-small font-semibold text-muted hover:text-foreground sm:inline-flex">
              View site <ExternalLink aria-hidden="true" size={15} strokeWidth={1.75} />
            </a>
            <span className="hidden text-right text-small md:block">
              <span className="block font-semibold">{admin?.name}</span>
              <span className="block text-muted capitalize">{admin?.role}</span>
            </span>
            <button type="button" onClick={signOut} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border-strong px-4 text-small font-semibold hover:bg-surface-muted">
              <LogOut aria-hidden="true" size={16} strokeWidth={1.75} />
              <span className="max-xs:sr-only">Sign out</span>
            </button>
          </div>
        </div>
        {open && <div className="border-t border-border p-4 lg:hidden">{nav}</div>}
      </header>
      <div className="mx-auto flex max-w-[100rem] gap-8 px-4 py-8 sm:px-6">
        <aside className="hidden w-56 shrink-0 lg:block">
          <div className="sticky top-24">{nav}</div>
        </aside>
        <main className="min-w-0 flex-1">
          <Suspense fallback={<LogoLoader />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
