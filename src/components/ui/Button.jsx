/* Button: pill shaped, 44px minimum height, tactile press. Renders a router Link (to),
   an external link (href) or a button. */
import { LoaderCircle } from "lucide-react";
import { Link } from "react-router-dom";

import { cn } from "@/utils/cn";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap select-none " +
  "transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-brand active:scale-[0.98] " +
  "disabled:opacity-60 disabled:active:scale-100";

const variants = {
  primary: "bg-primary text-primary-foreground shadow-[inset_0_-2px_0_rgb(23_24_40/0.10)] hover:bg-primary-hover",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary-hover",
  outline: "border border-border-strong bg-surface text-foreground hover:border-foreground/35 hover:bg-surface-muted",
  ghost: "text-foreground hover:bg-surface-muted",
  onDark: "border border-white/20 bg-white/10 text-white hover:bg-white/15",
};

const sizes = {
  sm: "min-h-11 px-4 text-small",
  md: "min-h-12 px-5 text-[0.9375rem]",
  lg: "min-h-14 px-7 text-body",
};

export default function Button({
  to,
  href,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconRight: IconRight,
  loading = false,
  className,
  children,
  type = "button",
  ...rest
}) {
  const classes = cn(base, variants[variant], sizes[size], className);
  const content = (
    <>
      {loading ? (
        <LoaderCircle aria-hidden="true" size={18} strokeWidth={1.75} className="animate-spin" />
      ) : (
        Icon && <Icon aria-hidden="true" size={18} strokeWidth={1.75} />
      )}
      <span>{children}</span>
      {IconRight && (
        <IconRight
          aria-hidden="true"
          size={18}
          strokeWidth={1.75}
          className="transition-transform duration-200 ease-brand group-hover/btn:translate-x-0.5"
        />
      )}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {content}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {content}
      </a>
    );
  }
  return (
    <button type={type} className={classes} disabled={loading || rest.disabled} aria-busy={loading || undefined} {...rest}>
      {content}
    </button>
  );
}
