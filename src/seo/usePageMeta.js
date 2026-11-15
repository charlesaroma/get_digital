/* Per page title, description, canonical and share URL for this single page app. */
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE = "https://gd256.org";
const BRAND = "GetDigital256";

function setMeta(selector, attr, key, value) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement(attr === "rel" ? "link" : "meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute(attr === "rel" ? "href" : "content", value);
}

export default function usePageMeta({ title, description } = {}) {
  const { pathname } = useLocation();

  useEffect(() => {
    const fullTitle = title ? `${title} | ${BRAND}` : `${BRAND} | Technology Made Simple`;
    const url = `${SITE}${pathname === "/" ? "/" : pathname.replace(/\/$/, "")}`;
    document.title = fullTitle;
    setMeta('meta[property="og:title"]', "property", "og:title", fullTitle);
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", fullTitle);
    setMeta('meta[property="og:url"]', "property", "og:url", url);
    setMeta('link[rel="canonical"]', "rel", "canonical", url);
    if (description) {
      setMeta('meta[name="description"]', "name", "description", description);
      setMeta('meta[property="og:description"]', "property", "og:description", description);
      setMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
    }
  }, [title, description, pathname]);
}
