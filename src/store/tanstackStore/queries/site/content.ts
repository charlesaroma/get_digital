import { queryOptions } from "@tanstack/react-query";
import { listBlogs } from "../../services/content/blogsApi";
import { listPartners } from "../../services/content/partnersApi";
import { listPress } from "../../services/content/pressApi";
import { getSettings } from "../../services/content/settingsApi";
import { siteRoot } from "../keys";

export const settingsQuery = () => queryOptions({ queryKey: [...siteRoot, "settings"], queryFn: ({ signal }) => getSettings({ signal }) });
export const partnersQuery = () => queryOptions({ queryKey: [...siteRoot, "partners"], queryFn: ({ signal }) => listPartners({ signal }) });
export const blogsQuery = () => queryOptions({ queryKey: [...siteRoot, "blogs"], queryFn: ({ signal }) => listBlogs({ signal }) });
export const pressQuery = () => queryOptions({ queryKey: [...siteRoot, "press"], queryFn: ({ signal }) => listPress({ signal }) });
