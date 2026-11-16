/* Inner page header: node marker, title, intro. Left aligned. `aside` is an optional right hand
   composition (for example a HexStat); without it a quiet hex texture fills the right side. */
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/utils/cn";
import HexPattern from "./HexPattern";
import NodeMark from "./NodeMark";

export default function PageHeader({ eyebrow, title, text, aside, children }) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      {!aside && (
        <HexPattern className="absolute inset-y-0 right-0 hidden w-1/2 text-gd-navy-900/[0.07] md:block [mask-image:linear-gradient(to_left,black,transparent)] dark:text-white/[0.07]" />
      )}
      <div className={cn("container-gd relative pt-12 pb-12 sm:pt-16 lg:pt-20 lg:pb-16", aside && "grid grid-cols-1 items-center gap-10 lg:grid-cols-12")}>
        <Reveal className={aside ? "lg:col-span-7" : undefined}>
          {eyebrow && <NodeMark label={eyebrow} />}
          <h1 className="mt-4 max-w-[18ch] text-h1">{title}</h1>
          {text && <p className="mt-5 max-w-[60ch] text-body-lg text-muted">{text}</p>}
          {children}
        </Reveal>
        {aside && <div className="flex lg:col-span-5 lg:justify-end">{aside}</div>}
      </div>
    </section>
  );
}
