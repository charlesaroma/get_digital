/* Link previews for WhatsApp, Facebook, X, LinkedIn and Telegram.
   Those apps do not run JavaScript, so they only see the tags in index.html. This Express
   middleware fills in the right title, summary and image for each page before it is sent.
   Browsers get exactly the same page; React then takes over as usual.

   Use in the MERN server, after the /api routes and the static files:

     import { seoMeta } from "./seo-meta.mjs";
     app.use("/api", api);
     app.use(express.static(DIST, { index: false }));
     app.get("*", seoMeta({ distDir: DIST, lookup }));

   `lookup` is yours: it reads MongoDB and returns { title, description, image, imageAlt, type,
   publishedTime, modifiedTime } for a path, or null for the site defaults. An example is below. */
import { readFile } from "node:fs/promises";
import path from "node:path";

const SITE = "https://gd256.org";
const BRAND = "GetDigital256";
const DEFAULT = {
  title: `${BRAND} | Technology Made Simple`,
  description: "Practical tech guides, digital skills training and free AI learning for communities across Uganda.",
  image: "/og-image.png",
  imageAlt: "GetDigital256: Technology Made Simple.",
  type: "website",
};

const esc = (s = "") => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const abs = (u) => (/^https?:/.test(u) ? u : `${SITE}${u.startsWith("/") ? "" : "/"}${u}`);

function setTag(html, attr, key, value) {
  const re = new RegExp(`<meta ${attr}="${key}" content="[^"]*"\\s*/?>`);
  const tag = `<meta ${attr}="${key}" content="${esc(value)}" />`;
  return re.test(html) ? html.replace(re, tag) : html.replace("</head>", `    ${tag}\n  </head>`);
}

export function render(template, pathname, meta) {
  const m = { ...DEFAULT, ...(meta ?? {}) };
  const title = meta?.title ? `${meta.title} | ${BRAND}` : DEFAULT.title;
  const url = `${SITE}${pathname === "/" ? "/" : pathname.replace(/\/$/, "")}`;
  let html = template.replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`);
  html = setTag(html, "name", "description", m.description);
  html = setTag(html, "property", "og:type", m.type);
  html = setTag(html, "property", "og:title", title);
  html = setTag(html, "property", "og:description", m.description);
  html = setTag(html, "property", "og:url", url);
  html = setTag(html, "property", "og:image", abs(m.image));
  html = setTag(html, "property", "og:image:alt", m.imageAlt ?? m.title);
  html = setTag(html, "name", "twitter:title", title);
  html = setTag(html, "name", "twitter:description", m.description);
  html = setTag(html, "name", "twitter:image", abs(m.image));
  if (m.publishedTime) html = setTag(html, "property", "article:published_time", m.publishedTime);
  if (m.modifiedTime) html = setTag(html, "property", "article:modified_time", m.modifiedTime);
  html = html.replace(/<link rel="canonical" href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${esc(url)}" />`);
  return html;
}

export function seoMeta({ distDir, lookup }) {
  let template;
  return async (req, res, next) => {
    try {
      template ??= await readFile(path.join(distDir, "index.html"), "utf8");
      const meta = await lookup(req.path).catch(() => null);
      res.set("Cache-Control", "no-cache").type("html").send(render(template, req.path, meta));
    } catch (err) {
      next(err);
    }
  };
}

/* Example lookup with Mongoose models. Rename to match your schemas. Only published content
   is returned, so drafts never leak into a preview. */
export const exampleLookup = (models) => async (pathname) => {
  const [, section, a, b] = pathname.split("/");
  if (section === "blogs" && a) {
    const p = await models.Blog.findOne({ slug: a, status: "published" }).lean();
    return p && { title: p.title, description: p.excerpt, image: p.image || `/images/blog/${p.slug}.webp`, imageAlt: p.imageAlt, type: "article", publishedTime: p.publishedAt, modifiedTime: p.updatedAt };
  }
  if (section === "press" && a) {
    const p = await models.Press.findOne({ slug: a }).lean();
    return p && { title: p.title, description: p.summary, image: p.image || undefined, type: "article", publishedTime: p.publishedAt };
  }
  if (section === "vote" && a) {
    const poll = await models.Poll.findOne({ slug: a, status: { $ne: "draft" } }).lean();
    if (!poll) return null;
    if (b) {
      const n = await models.Nominee.findOne({ pollId: poll._id, slug: b }).lean();
      const cat = n && poll.categories.find((c) => c.id === n.categoryId);
      return n && { title: `Vote for ${n.name}`, description: `${n.name} is nominated for ${cat?.name} in ${poll.title}. ${n.headline}. Voting is free.`, image: n.image || poll.image || undefined };
    }
    return { title: poll.title, description: poll.summary, image: poll.image || undefined, imageAlt: poll.imageAlt };
  }
  if (section === "tickets" && a) {
    const e = await models.Event.findOne({ slug: a, status: { $ne: "draft" } }).lean();
    return e && { title: e.title, description: e.summary, image: e.image || undefined, imageAlt: e.imageAlt };
  }
  return null;
};
