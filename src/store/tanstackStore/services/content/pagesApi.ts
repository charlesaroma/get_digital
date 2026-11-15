/* pagesApi: page copy and navigation ship with the code in both modes (no dashboard) */
import pages from "@/data/pages.json";
import navigation from "@/data/navigation.json";

export const getPageCopy = (page: keyof typeof pages) => pages[page];
export const getNavigation = () => navigation;
