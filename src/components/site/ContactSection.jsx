/* Contact: address and channels on the left, the form on the right. */
import { ArrowUpRight, Mail, MapPin } from "lucide-react";

import { Reveal } from "@/components/motion/Reveal";
import HexBadge from "@/components/ui/HexBadge";
import Skeleton from "@/components/ui/Skeleton";
import SectionHeading from "@/components/ui/SectionHeading";
import { usePageCopy, useSettings } from "@/store/tanstackStore/queries/site";
import ContactForm from "./ContactForm";
import SocialIcon from "./SocialIcon";

const MAPS = "https://www.google.com/maps/search/?api=1&query=Amara+Hub+Building+Lira+Uganda";

export default function ContactSection({ showHeading = true }) {
  const { contact } = usePageCopy("home");
  const { data: settings, isPending } = useSettings();

  return (
    <section id="contact" aria-labelledby={showHeading ? "contact-title" : undefined} aria-label={showHeading ? undefined : "Contact details and form"} className="py-16 sm:py-20 lg:py-28">
      <div className="container-gd">
        {showHeading && (
          <Reveal>
            <SectionHeading id="contact-title" number="05" eyebrow={contact.eyebrow} title={contact.title} text={contact.text} />
          </Reveal>
        )}
        <div className={showHeading ? "mt-10 grid grid-cols-1 gap-5 lg:mt-14 lg:grid-cols-12 lg:gap-8" : "grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-8"}>
          <Reveal className="flex flex-col gap-4 lg:col-span-5">
            <div className="rounded-2xl bg-surface-muted p-6 sm:p-7">
              <HexBadge icon={MapPin} tone="onDark" className="bg-gd-navy-900" />
              <h3 className="mt-4 font-sans text-[1.0625rem] font-bold">Visit us</h3>
              {isPending ? (
                <div className="mt-3 flex flex-col gap-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ) : (
                <address className="mt-2 not-italic text-muted">
                  {settings?.address}
                  {settings?.poBox && <span className="block">{settings.poBox}</span>}
                </address>
              )}
              <a href={MAPS} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-11 items-center gap-1.5 font-semibold text-link underline-offset-4 hover:underline">
                Open in Google Maps
                <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.75} />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </div>
            <div className="rounded-2xl bg-surface-muted p-6 sm:p-7">
              <HexBadge icon={Mail} tone="solid" />
              <h3 className="mt-4 font-sans text-[1.0625rem] font-bold">Email</h3>
              {isPending ? (
                <Skeleton className="mt-3 h-4 w-48" />
              ) : (
                <a href={`mailto:${settings?.email}`} className="mt-1 inline-flex min-h-11 items-center break-all font-semibold text-foreground underline-offset-4 hover:underline">
                  {settings?.email}
                </a>
              )}
              <ul className="mt-3 flex gap-2" aria-label="Social media">
                {(settings?.socials ?? []).map((s) => (
                  <li key={s.id}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center gap-2 rounded-full bg-surface px-4 text-small font-semibold text-foreground transition-colors hover:bg-background"
                    >
                      <SocialIcon id={s.id} size={16} />
                      {s.label}
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.08} className="rounded-[1.75rem] bg-surface p-6 sm:p-8 lg:col-span-7">
            <h3 className="font-sans text-h4 font-bold">Write to us</h3>
            <p className="mt-1 text-muted">Fields marked optional can be left empty.</p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
