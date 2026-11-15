/* Loading placeholder that matches the size of the content it stands in for. */
import { cn } from "@/utils/cn";

export default function Skeleton({ className }) {
  return <div aria-hidden="true" className={cn("animate-pulse rounded-md bg-gd-stone-200/80 dark:bg-gd-navy-800", className)} />;
}
