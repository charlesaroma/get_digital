/* Sticky glass header: logo, main links with a sliding active pill, the Free AI Learning pill
   and, below 1024px, a slide over menu. */
import { GraduationCap, Menu } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

import Logo from "@/components/site/Logo";
import Button from "@/components/ui/Button";
import { cn } from "@/utils/cn";
import MobileNav from "./MobileNav";

export default function SiteHeader({ items, cta }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40">
      <div className="border-b border-border/80 bg-background/80 shadow-[var(--shadow-inset-glass)] backdrop-blur-xl backdrop-saturate-150 dark:shadow-none">
        <div className="container-gd flex h-16 items-center justify-between gap-4 lg:h-[4.5rem]">
          <Link to="/" aria-label="GetDigital256 home" className="-ml-1 flex min-h-11 shrink-0 items-center rounded-md px-1">
            <Logo alt="" className="h-9 lg:h-10" />
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-0.5 xl:gap-1">
              {items.map((item) => (
                <li key={item.title}>
                  <NavLink
                    to={item.target.page}
                    end={item.target.page === "/"}
                    className={({ isActive }) =>
                      cn(
                        "relative flex min-h-11 items-center rounded-full px-3 text-small font-semibold transition-colors duration-200 xl:px-3.5",
                        isActive ? "text-foreground" : "text-muted hover:text-foreground",
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <motion.span
                            layoutId="site-nav-pill"
                            className="absolute inset-0 rounded-full bg-surface shadow-card ring-1 ring-border"
                            transition={{ type: "spring", stiffness: 380, damping: 32 }}
                          />
                        )}
                        <span className="relative">{item.title}</span>
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Button to={cta.target.page} size="sm" icon={GraduationCap} className="max-sm:hidden">
              {cta.title}
            </Button>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="site-menu"
              className="grid size-11 place-items-center rounded-full border border-border bg-surface text-foreground transition-colors hover:bg-surface-muted active:scale-[0.98] lg:hidden"
            >
              <Menu aria-hidden="true" size={22} strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </div>
      <MobileNav open={open} onClose={() => setOpen(false)} items={items} cta={cta} />
    </header>
  );
}
