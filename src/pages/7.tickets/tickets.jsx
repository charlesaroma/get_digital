/* Tickets page */
import { usePageCopy } from "@/store/tanstackStore/queries/site";

export default function TicketsPage() {
  const copy = usePageCopy("tickets");
  return <h1>{copy.title}</h1>;
}
