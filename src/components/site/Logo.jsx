/* Brand logo. Always the supplied artwork from public/logo: never retype the wordmark.
   on="auto" swaps between the light and dark background versions with the theme.

   <Logo />                         full lockup, h-10 by default
   <Logo type="mark" className="h-8" />
   <Logo on="dark" />               white version for navy or photo backgrounds */
const FILES = {
  full: {
    light: "/logo/gd-logo-primary-light.svg",
    dark: "/logo/gd-logo-primary-dark.svg",
    width: 326,
    height: 113,
  },
  mark: {
    light: "/logo/gd-mark-primary-light.svg",
    dark: "/logo/gd-mark-primary-dark.svg",
    width: 158,
    height: 113,
  },
};

export default function Logo({ type = "full", on = "auto", className = "h-10", alt = "GetDigital256" }) {
  const file = FILES[type] ?? FILES.full;
  const size = { width: file.width, height: file.height, decoding: "async" };

  if (on === "light" || on === "dark") {
    return <img src={file[on]} alt={alt} className={`w-auto ${className}`} {...size} />;
  }

  return (
    <span className="inline-flex shrink-0">
      <img src={file.light} alt={alt} className={`w-auto dark:hidden ${className}`} {...size} />
      <img src={file.dark} alt={alt} className={`hidden w-auto dark:block ${className}`} {...size} />
    </span>
  );
}
