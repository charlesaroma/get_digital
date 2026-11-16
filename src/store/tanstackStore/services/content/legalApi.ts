/* legalApi: privacy, terms, voting rules, ticket terms and cookies. Ships with the code like page copy,
   so legal pages work even if the API is down. Move to the API if staff should edit them. */
import legal from "@/data/legal.json";
import type { LegalDoc } from "../types";

const docs = legal as Record<string, LegalDoc>;
export const getLegalDoc = (slug: string): LegalDoc | null => docs[slug] ?? null;
export const listLegalDocs = () => Object.values(docs).map(({ slug, title }) => ({ slug, title }));
