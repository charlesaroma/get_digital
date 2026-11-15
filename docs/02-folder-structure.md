# 02: Folder Structure

Adopted from QVFITS-Frontend. If you have to ask where something goes, the answer is here.

## Two run modes

| Command | Mode | Data comes from |
|---|---|---|
| `npm run dev` | development (the main production build's setup) | the real API, `/api` proxied to `localhost:5000` |
| `npm run dev:dummy` | `dummy` | the JSON seeds in `src/data` |

`services/api/config.ts` exposes `useMockApi` (true in `dummy` mode). Each service picks seed or API; nothing above the service knows which.

## Layers

component -> query hook (`store/tanstackStore/queries/site`) -> service (`services/content/*Api.ts`) -> `api/mock.ts` (dummy) or `api/client.ts` (real).
UI never imports services or `src/data`.

## Tree

```
get_digital/
├── docs/  scripts/  deploy/  public/ (logo/)
├── index.html  vite.config.js  tsconfig.json  eslint.config.js  .env.example
└── src/
    ├── main.jsx  App.jsx  AppProviders.jsx  index.css
    ├── routes/        SiteRoutes, SiteLayout, pages.js (lazy barrel)
    ├── store/
    │   ├── context/
    │   └── tanstackStore/  queryClient.ts · queries/{keys.ts, site/, admin/} · services/{api/, content/, types.ts}
    ├── data/          JSON seeds, one file per entity (shaped like the API tables)
    ├── components/    layout/ motion/ ui/ site/   (shared by pages)
    ├── pages/         numbered in nav order; page file + sections/ (flat)
    │   ├── 1.home  2.about  3.partners  4.press  5.blogs  6.vote  7.tickets  8.contact
    │   └── not-found.jsx
    ├── AdminDashboard/  /admin: AdminLayout, AdminPages (lazy barrel), components/, lib/ (ADMIN_NAV),
    │                    pages/ 1.auth 2.overview 3.blogs 4.partners 5.press 6.voting 7.tickets 8.messages 9.settings
    ├── styles/  utils/  seo/
```

## Data: backend vs static

| From the backend/admin dashboard (seeds in `src/data`) | Static, ships with code |
|---|---|
| `partners.json`, `blogs.json`, `blog-categories.json`, `press.json`, `settings.json`, `polls.json`, `nominees.json`, `votes.json`, `events.json`, `ticket-types.json`, `ticket-orders.json`, `messages.json`, `staff.json` | `pages.json` (page copy), `navigation.json` |

Seed content is snippets from gd256.org used as realistic placeholders, not a copy of that site.

## The admin never mixes with the site (binding)

`AdminDashboard/` is its own app in the same repo. It keeps its own components, lib, layout, lazy barrel and auth (`AdminAuthContext`). Site pages and `src/components` never import it, and it never imports `src/pages`. Code both need goes down to `components/ui`, `utils/` or `store/`. Only `routes/` and `App.jsx` mount both. `eslint.config.js` enforces this, along with "UI never imports services or src/data". Staff and permissions are placeholders until the admin is built.

## Where does it go?

| Adding | Put it in |
|---|---|
| A page | `pages/<n>.<name>/` + `routes/pages.js` + `SiteRoutes.jsx`; copy in `data/pages.json`; link in `data/navigation.json` |
| A section | `pages/<n>.<name>/sections/Name.jsx` (flat) |
| Data from the DB | `data/x.json` + type in `services/types.ts` + `services/content/xApi.ts` + query in `queries/site/` |
| Shared component | `components/ui/` (generic) or `components/site/` |
| An admin module | `AdminDashboard/pages/<n>.<name>/` + `ADMIN_NAV` + `AdminPages.jsx` + `routes/AdminRoutes.jsx` + a module in `data/permissions.json` |
| Pure helper | `utils/` |
