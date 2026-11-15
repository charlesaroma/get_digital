/* Scrolls to the top on page change, or to the #section in the address (for example /#free-ai-course). */
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return undefined;
    }
    const id = decodeURIComponent(hash.slice(1));
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let tries = 0;
    let timer;
    const go = () => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
      else if (tries++ < 30) timer = setTimeout(go, 100);
    };
    go();
    return () => clearTimeout(timer);
  }, [pathname, hash]);

  return null;
}
