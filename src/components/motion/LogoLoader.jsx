/* Loading state with the animated GD monogram. Use it as a Suspense fallback.
   While the boot loader from index.html is still on screen, this keeps it up and renders
   nothing, so the first load shows one smooth animation. After that it renders inline. */
import { useEffect, useState } from "react";

import { holdBoot, isBootActive, releaseBoot } from "@/utils/bootLoader";
import LogoMark from "./LogoMark";

export default function LogoLoader({ label = "Loading" }) {
  const [boot] = useState(isBootActive);

  useEffect(() => {
    if (!boot) return undefined;
    holdBoot();
    return releaseBoot;
  }, [boot]);

  if (boot) return null;

  return (
    <div className="gd-loader gd-loader--inline" role="status" aria-live="polite">
      <div className="gd-loader__inner">
        <LogoMark />
        <span className="gd-loader__bar" aria-hidden="true" />
        <span className="gd-sr">{label}</span>
      </div>
    </div>
  );
}
