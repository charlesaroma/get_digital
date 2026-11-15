# 03: Brand

Everything visual comes from the **Get Digital Brand Book, Edition 1.0**. Change it there first, then here.

## Where the brand lives

| What | File |
|---|---|
| Colour, type, radius, breakpoints, dark mode | `src/index.css` (Tailwind CSS v4 `@theme`) |
| Logo files (6 lockups, 6 monograms, PNG for email and schema) | `public/logo/` |
| Favicon and app icons | `public/favicon.ico`, `favicon.svg`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `site.webmanifest` |
| Share image (Open Graph, X) | `public/og-image.png` (1200 × 630) |
| Fonts (self hosted, Latin, variable) | `public/fonts/` with their OFL licences |
| SEO, organisation details, boot loader | `index.html` |
| Robots and sitemap | `public/robots.txt`, `public/sitemap.xml` |
| Redirects | `public/_redirects` (Netlify or Cloudflare), `public/.htaccess` (Apache or cPanel), `deploy/gd256.org.nginx.conf` (Nginx) |

## Rules

- Use semantic classes in components: `bg-surface`, `text-foreground`, `text-muted`, `bg-primary text-primary-foreground`, `border-border`, `text-link`. Brand ramps (`gd-yellow-*`, `gd-navy-*`, `gd-stone-*`) are for illustrations and special cases.
- Tailwind's default palette is switched off. Only brand colours exist.
- Never put yellow 500 text on white (1.8:1). Use `text-link` (yellow 800) instead. Text on yellow is always navy.
- Headings use Unbounded (`font-display`), everything else Manrope (`font-sans`), numbers and codes JetBrains Mono (`font-mono`).
- Logos: `<Logo />` from `components/site/Logo.jsx`. Never retype the wordmark or recolour the SVGs.
- Loading states: `<LogoLoader />` from `components/motion/LogoLoader.jsx` as the Suspense fallback.
- Dark mode: set `document.documentElement.dataset.theme = "dark"` and save `"dark"` under `localStorage["gd-theme"]`. The site starts in light unless that choice exists.
- Check every screen on small, medium and large phones, tablets, laptops and XL desktops. `xs` (375 px) and `3xl` (1920 px) breakpoints are added for that.

## Logo loader

`index.html` shows `#gd-boot` on the first paint. `src/utils/bootLoader.js` removes it once the app has mounted and the first lazy page has loaded, so first load plays one smooth animation. Later route changes show the same animation inline. Its styles live in `index.html` so they work before CSS loads.
