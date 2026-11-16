/* Per page title, description, share image, canonical and structured data.
   Browsers and Google read these after the page runs. WhatsApp, Facebook and X do not run
   JavaScript, so the server fills the same tags before sending the page: deploy/seo/README.md. */
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { absoluteUrl } from "@/utils/format";

const BRAND = "GetDigital256";
const DEFAULT_IMAGE = "/og-image.png";
const DEFAULT_ALT = "GetDigital256: Technology Made Simple.";

function setMeta(selector, attr, key, value) {
  let el = document.head.querySelector(selector);
  if (value == null) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement(attr === "rel" ? "link" : "meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute(attr === "rel" ? "href" : "content", value);
}

export default function usePageMeta({ title, description, image, imageAlt, type = "website", publishedTime, modifiedTime, jsonLd } = {}) {
  const { pathname } = useLocation();
  const ld = jsonLd ? JSON.stringify(jsonLd) : null;

  useEffect(() => {
    const fullTitle = title ? `${title} | ${BRAND}` : `${BRAND} | Technology Made Simple`;
    const url = absoluteUrl(pathname === "/" ? "/" : pathname.replace(/\/$/, ""));
    const img = absoluteUrl(image || DEFAULT_IMAGE);
    document.title = fullTitle;
    setMeta('meta[property="og:title"]', "property", "og:title", fullTitle);
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", fullTitle);
    setMeta('meta[property="og:url"]', "property", "og:url", url);
    setMeta('link[rel="canonical"]', "rel", "canonical", url);
    setMeta('meta[property="og:type"]', "property", "og:type", type);
    setMeta('meta[property="og:image"]', "property", "og:image", img);
    setMeta('meta[name="twitter:image"]', "name", "twitter:image", img);
    setMeta('meta[property="og:image:alt"]', "property", "og:image:alt", imageAlt || (image ? title : DEFAULT_ALT));
    setMeta('meta[property="article:published_time"]', "property", "article:published_time", type === "article" ? publishedTime : null);
    setMeta('meta[property="article:modified_time"]', "property", "article:modified_time", type === "article" ? modifiedTime : null);
    if (description) {
      setMeta('meta[name="description"]', "name", "description", description);
      setMeta('meta[property="og:description"]', "property", "og:description", description);
      setMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
    }
    let script = document.getElementById("page-jsonld");
    if (ld) {
      if (!script) {
        script = document.createElement("script");
        script.type = "application/ld+json";
        script.id = "page-jsonld";
        document.head.appendChild(script);
      }
      script.textContent = ld;
    } else script?.remove();
  }, [title, description, image, imageAlt, type, publishedTime, modifiedTime, ld, pathname]);
}
