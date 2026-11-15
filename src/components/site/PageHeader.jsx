/* Inner page header: eyebrow, title, intro. Left aligned with a quiet hex texture. */
import { Reveal } from "@/components/motion/Reveal";
import HexPattern from "./HexPattern";

export default function PageHeader({ eyebrow, title, text, children }) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <HexPattern className="absolute inset-y-0 right-0 hidden w-1/2 text-gd-navy-900/[0.05] md:block [mask-image:linear-gradient(to_left,black,transparent)] dark:text-white/[0.05]" />
      <div className="container-gd relative pt-12 pb-12 sm:pt-16 lg:pt-20 lg:pb-16">
        <Reveal>
          {eyebrow && <p className="eyebrow text-link">{eyebrow}</p>}
          <h1 className="mt-3 max-w-[18ch] text-h1">{title}</h1>
          {text && <p className="mt-5 max-w-[60ch] text-body-lg text-muted">{text}</p>}
          {children}
        </Reveal>
      </div>
    </section>
  );
}
