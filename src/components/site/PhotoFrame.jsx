/* Photo with a designed placeholder. Pass the final path as src: until the file exists in
   public/images, the frame shows what photo belongs here and the file name to use. */
import { Camera } from "lucide-react";
import { useState } from "react";

import { cn } from "@/utils/cn";
import HexPattern from "./HexPattern";

export default function PhotoFrame({ src, alt = "", caption, ratio = "4 / 3", tone = "light", priority = false, className }) {
  const [failed, setFailed] = useState(false);
  const dark = tone === "dark";
  const showPhoto = src && !failed;

  return (
    <figure
      className={cn(
        "relative isolate overflow-hidden rounded-2xl ring-1 ring-inset",
        dark ? "bg-gd-navy-800 ring-white/10" : "bg-gd-stone-100 ring-border dark:bg-gd-navy-800",
        className,
      )}
      style={{ aspectRatio: ratio }}
    >
      {showPhoto ? (
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onError={() => setFailed(true)}
          className="absolute inset-0 size-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
          <HexPattern className={cn("absolute inset-0 size-full", dark ? "text-white/[0.06]" : "text-gd-navy-900/[0.06]")} />
          <span className={cn("relative grid size-12 place-items-center rounded-full", dark ? "bg-white/10 text-white" : "bg-surface text-gd-navy-900 shadow-card")}>
            <Camera aria-hidden="true" size={22} strokeWidth={1.75} />
          </span>
          {caption && (
            <figcaption className={cn("relative max-w-[32ch] text-small font-semibold", dark ? "text-gd-navy-100" : "text-muted")}>
              <span className="sr-only">Photo coming soon: </span>
              {caption}
            </figcaption>
          )}
          {src && <span className={cn("relative font-mono text-[0.75rem]", dark ? "text-gd-navy-300" : "text-subtle")}>{src}</span>}
        </div>
      )}
    </figure>
  );
}
