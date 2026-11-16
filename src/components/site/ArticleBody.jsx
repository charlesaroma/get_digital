/* Renders the dashboard's text blocks (paragraph, heading, list, quote) with reading typography.
   Web addresses and email addresses in the text become links. */
import { Fragment } from "react";

import { cn } from "@/utils/cn";
import { slugify as slugOf } from "@/utils/format";

const LINK = /(https?:\/\/[^\s,;)]+|[\w.+-]+@[\w-]+\.[\w.-]+[a-z])/gi;

function Linked({ text }) {
  const parts = text.split(LINK);
  return parts.map((part, i) => {
    if (i % 2 === 0) return <Fragment key={i}>{part}</Fragment>;
    const email = part.includes("@") && !part.startsWith("http");
    return (
      <a
        key={i}
        href={email ? `mailto:${part}` : part}
        {...(email ? {} : { target: "_blank", rel: "noopener noreferrer" })}
        className="break-words font-semibold text-link underline decoration-1 underline-offset-4 hover:decoration-2"
      >
        {part.replace(/^https?:\/\//, "")}
      </a>
    );
  });
}


export default function ArticleBody({ blocks = [], className }) {
  return (
    <div className={cn("flex flex-col gap-5 text-body-lg text-foreground/90", className)}>
      {blocks.map((b, i) => {
        if (b.type === "h2")
          return (
            <h2 key={i} id={slugOf(b.text)} className="mt-6 scroll-mt-28 text-h3 text-foreground">
              {b.text}
            </h2>
          );
        if (b.type === "h3")
          return (
            <h3 key={i} className="mt-3 text-h4 text-foreground">
              {b.text}
            </h3>
          );
        if (b.type === "quote")
          return (
            <blockquote key={i} className="border-l-4 border-gd-yellow-500 pl-5 font-display text-h4 leading-snug text-foreground">
              <Linked text={b.text} />
            </blockquote>
          );
        if (b.type === "ul" || b.type === "ol") {
          const List = b.type;
          return (
            <List key={i} className={cn("flex flex-col gap-2.5 pl-6", b.type === "ul" ? "list-disc marker:text-gd-yellow-600" : "list-decimal marker:font-semibold")}>
              {b.items.map((item, j) => (
                <li key={j} className="pl-1">
                  <Linked text={item} />
                </li>
              ))}
            </List>
          );
        }
        return (
          <p key={i}>
            <Linked text={b.text} />
          </p>
        );
      })}
    </div>
  );
}
