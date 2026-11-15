/* Hooks the UI uses. UI never imports services or src/data. */
import { useQuery } from "@tanstack/react-query";
import { getNavigation, getPageCopy } from "../../services/content/pagesApi";
import { blogsQuery, partnersQuery, pressQuery, settingsQuery } from "./content";

export const useSettings = () => useQuery(settingsQuery());
export const usePartners = () => useQuery(partnersQuery());
export const useBlogs = () => useQuery(blogsQuery());
export const usePress = () => useQuery(pressQuery());

type Pages = Parameters<typeof getPageCopy>[0];
export const usePageCopy = (page: Pages) => getPageCopy(page);
export const useNavigation = () => getNavigation();

export * from "./voting";
export * from "./tickets";
