/* Slide over menu for phones and tablets, on the native <dialog>: focus stays inside,
   Escape and a tap outside close it, and it closes after navigating. */
import { ArrowRight, GraduationCap, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";

import Logo from "@/components/site/Logo";
import Button from "@/components/ui/Button";
import { cn } from "@/utils/cn";

export default function MobileNav({ open, onClose, items, cta }) {
  const ref = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Close after any navigation, including hash links on the same page.
  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.hash]);

  return (
    <dialog
      id="site-menu"
      ref={ref}
      aria-label="Menu"
      className="gd-drawer"
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center justify-between border-b border-border px-5">
          <Logo alt="GetDigital256" className="h-9" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="-mr-2 grid size-11 place-items-center rounded-full text-foreground transition-colors hover:bg-surface-muted"
          >
            <X aria-hidden="true" size={22} strokeWidth={1.75} />
          </button>
        </div>
        <nav aria-label="Main" className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="flex flex-col">
            {items.map((item, i) => (
              <li key={item.title} className="gd-drawer-item" style={{ "--i": i }}>
                <NavLink
                  to={item.target.page}
                  end={item.target.page === "/"}
                  className={({ isActive }) =>
                    cn(
                      "flex min-h-14 items-center justify-between rounded-xl px-3 font-display text-[1.125rem] font-semibold tracking-tight transition-colors",
                      isActive ? "bg-surface text-foreground shadow-card ring-1 ring-border" : "text-foreground hover:bg-surface-muted",
                    )
                  }
                >
                  {item.title}
                  <ArrowRight aria-hidden="true" size={18} strokeWidth={1.75} className="text-subtle" />
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="border-t border-border p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <Button to={cta.target.page} size="lg" icon={GraduationCap} className="w-full">
            {cta.title}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
