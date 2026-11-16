# Link previews and SEO on the live server

## Why this is needed

The website is a single page app. Google runs the JavaScript and reads each page's own title and
image, but WhatsApp, Facebook, X, LinkedIn and Telegram do not. Without server help every shared
link shows the general GetDigital card.

`seo-meta.mjs` fixes that: the Express server writes the right tags into `index.html` for each
page before sending it. Nothing changes for visitors.

| Page | Preview title | Preview text | Preview image |
|---|---|---|---|
| `/blogs/:slug` | Guide title | Excerpt | Cover photo (1200 × 630 is best) |
| `/press/:slug` | Release title | Summary | Release photo, else the site card |
| `/vote/:campaign` | Campaign title | Summary | Campaign photo |
| `/vote/:campaign/:nominee` | Vote for {name} | Category, campaign, headline | Nominee photo, else campaign photo |
| `/tickets/:event` | Event title | Summary | Event photo |
| Anything else | Site title | Site description | `/og-image.png` |

## Set up

1. Build the site: `npm run build`, which writes `dist/`.
2. In the Express app, after the API routes and static files:
   ```js
   import { seoMeta, exampleLookup } from "./seo-meta.mjs";
   app.use(express.static(DIST, { index: false }));
   app.get("*", seoMeta({ distDir: DIST, lookup: exampleLookup({ Blog, Press, Poll, Nominee, Event }) }));
   ```
3. In Nginx, send page requests to Node instead of serving `index.html` directly. In
   `deploy/gd256.org.nginx.conf` replace the last `location /` block with:
   ```nginx
   location / {
       try_files $uri @app;
   }
   location @app {
       proxy_pass http://127.0.0.1:5000;
       proxy_set_header Host $host;
       proxy_set_header X-Forwarded-Proto $scheme;
   }
   ```
   Files that exist (scripts, images, fonts) are still served by Nginx.
4. Check a link with the Facebook Sharing Debugger and the LinkedIn Post Inspector. WhatsApp
   caches previews, so add `?v=2` to the link when testing a change.

## Sitemap

`public/sitemap.xml` is built from `src/data` for now. Once the API is live, have the server answer
`/sitemap.xml` from the database (published guides, press releases, open campaigns and their
nominees, events, and the five legal pages) so new pages appear without a rebuild.

## Payments (votes and tickets)

The browser never decides that something is paid. The server creates the order, sends the buyer to
the payment partner's page (for example Pesapal or Flutterwave: MTN MoMo, Airtel Money, card) and
adds votes or issues tickets only when the partner's server confirms the payment (IPN or webhook).
