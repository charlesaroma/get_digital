/* Share a page: WhatsApp first (how most people share in Uganda), then Facebook, X, LinkedIn,
   Telegram, email and copy link. On phones a Share button opens the phone's own share sheet.
   The preview card (image, title, summary) comes from the page's meta tags. */
import { Check, Link2, Mail, Share2 } from "lucide-react";
import { useState } from "react";

import SocialIcon from "@/components/site/SocialIcon";
import { cn } from "@/utils/cn";
import { absoluteUrl } from "@/utils/format";

const targets = (url, text) => {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(text);
  return [
    { id: "whatsapp", label: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}` },
    { id: "facebook", label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    { id: "x", label: "X", href: `https://x.com/intent/post?text=${t}&url=${u}` },
    { id: "linkedin", label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
    { id: "telegram", label: "Telegram", href: `https://t.me/share/url?url=${u}&text=${t}` },
  ];
};

const btn =
  "inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-border-strong bg-surface text-foreground transition-colors hover:border-foreground/40 hover:bg-surface-muted";

export default function ShareBar({ path, title, text, label = "Share", className }) {
  const url = absoluteUrl(path);
  const message = text || title;
  const [copied, setCopied] = useState(false);
  const canNativeShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <p className="text-small font-semibold text-foreground">{label}</p>
      <ul className="flex flex-wrap items-center gap-2">
        {canNativeShare && (
          <li className="sm:hidden">
            <button type="button" onClick={() => navigator.share({ title, text: message, url }).catch(() => {})} className={cn(btn, "w-auto gap-2 px-4 font-semibold")}>
              <Share2 aria-hidden="true" size={18} strokeWidth={1.75} />
              Share
            </button>
          </li>
        )}
        {targets(url, message).map((t) => (
          <li key={t.id}>
            <a href={t.href} target="_blank" rel="noopener noreferrer" aria-label={`Share on ${t.label} (opens in a new tab)`} className={btn}>
              <SocialIcon id={t.id} size={18} />
            </a>
          </li>
        ))}
        <li>
          <a href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${message}\n\n${url}`)}`} aria-label="Share by email" className={btn}>
            <Mail aria-hidden="true" size={18} strokeWidth={1.75} />
          </a>
        </li>
        <li>
          <button type="button" onClick={copy} className={cn(btn, "w-auto gap-2 px-4 text-small font-semibold")}>
            {copied ? <Check aria-hidden="true" size={18} strokeWidth={2} className="text-success" /> : <Link2 aria-hidden="true" size={18} strokeWidth={1.75} />}
            {copied ? "Link copied" : "Copy link"}
          </button>
        </li>
      </ul>
      <span className="sr-only" role="status" aria-live="polite">
        {copied ? "Link copied to clipboard" : ""}
      </span>
    </div>
  );
}
