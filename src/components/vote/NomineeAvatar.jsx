/* Nominee photo, or their initials on a brand hexagon until a photo is uploaded. */
import { useState } from "react";

import { cn } from "@/utils/cn";
import { initialsOf } from "@/utils/format";

const sizes = { sm: "size-11 text-small", md: "size-14 text-body", row: "size-16 text-h4 sm:size-20", lg: "size-24 text-h3", xl: "size-36 text-h2 sm:size-44" };

export default function NomineeAvatar({ nominee, size = "md", className }) {
  const [failed, setFailed] = useState(false);
  if (nominee.image && !failed) {
    return <img src={nominee.image} alt="" loading="lazy" onError={() => setFailed(true)} className={cn("shrink-0 rounded-2xl object-cover object-[center_25%]", sizes[size], className)} />;
  }
  return (
    <span aria-hidden="true" className={cn("gd-hex grid shrink-0 place-items-center bg-primary-soft font-display font-semibold text-gd-navy-900 dark:text-gd-yellow-100", sizes[size], className)}>
      {initialsOf(nominee.name)}
    </span>
  );
}
