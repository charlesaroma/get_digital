/* Structured footer: brand, quick links, contact. Light stone, not a heavy colour band. */
import { Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

import Logo from "@/components/site/Logo";
import SocialIcon from "@/components/site/SocialIcon";
import Skeleton from "@/components/ui/Skeleton";
import { useSettings } from "@/store/tanstackStore/queries/site";

const linkClass = "inline-flex min-h-11 items-center text-muted transition-colors hover:text-foreground";

export default function SiteFooter({ items, cta }) {
  const { data: settings, isPending } = useSettings();
  const explore = items.filter((i) => ["/", "/about", "/partners", "/press", "/blogs"].includes(i.target.page));
  const takePart = [cta, ...items.filter((i) => ["/vote", "/tickets", "/contact"].includes(i.target.page))];
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-gd-stone-100 dark:bg-gd-navy-900">
      <div className="container-gd grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8 lg:py-16">
        <div className="sm:col-span-2 lg:col-span-4">
          <Logo alt="GetDigital256" className="h-11" />
          <p className="mt-5 font-display text-h4 tracking-tight text-foreground">Technology Made Simple.</p>
          <p className="mt-3 max-w-[42ch] text-muted">
            A Ugandan nonprofit making digital knowledge more accessible, from Lira to communities across the country.
          </p>
          <ul className="mt-6 flex gap-2" aria-label="GetDigital256 on social media">
            {(settings?.socials ?? []).map((s) => (
              <li key={s.id}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${s.label} (opens in a new tab)`}
                  className="grid size-11 place-items-center rounded-full border border-border-strong bg-surface text-foreground transition-colors hover:border-foreground/40 hover:bg-surface-muted"
                >
                  <SocialIcon id={s.id} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Explore" className="lg:col-span-2 lg:col-start-6">
          <p className="eyebrow text-foreground">Explore</p>
          <ul className="mt-4 flex flex-col">
            {explore.map((i) => (
              <li key={i.title}>
                <Link to={i.target.page} className={linkClass}>
                  {i.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Take part" className="lg:col-span-2">
          <p className="eyebrow text-foreground">Take part</p>
          <ul className="mt-4 flex flex-col">
            {takePart.map((i) => (
              <li key={i.title}>
                <Link to={i.target.page} className={linkClass}>
                  {i.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sm:col-span-2 lg:col-span-3">
          <p className="eyebrow text-foreground">Contact</p>
          {isPending ? (
            <div className="mt-4 flex flex-col gap-3">
              <Skeleton className="h-5 w-56" />
              <Skeleton className="h-5 w-44" />
            </div>
          ) : (
            <address className="mt-4 flex flex-col gap-3 not-italic text-muted">
              <p className="flex gap-3">
                <MapPin aria-hidden="true" size={18} strokeWidth={1.75} className="mt-1 shrink-0 text-foreground" />
                <span>
                  {settings?.address}
                  {settings?.poBox && <span className="block">{settings.poBox}</span>}
                </span>
              </p>
              <a href={`mailto:${settings?.email}`} className="flex min-h-11 items-center gap-3 break-all transition-colors hover:text-foreground">
                <Mail aria-hidden="true" size={18} strokeWidth={1.75} className="shrink-0 text-foreground" />
                {settings?.email}
              </a>
            </address>
          )}
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-gd flex flex-col gap-2 py-6 text-small text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {settings?.legalName ?? "GetDigital LTD"}. All rights reserved.
          </p>
          <p>Lira, Uganda</p>
        </div>
      </div>
    </footer>
  );
}
