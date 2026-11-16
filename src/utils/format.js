/* Display helpers. Dates and times show in Kampala time, whatever the visitor's device says. */
const TZ = "Africa/Kampala";
const dateFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" });
const dayFmt = new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: TZ });
const shortDayFmt = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: TZ });
const timeFmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: TZ });
const countFmt = new Intl.NumberFormat("en-GB");

/** "13 November 2026". Accepts a date or a full timestamp. */
export const formatDate = (iso) => (iso ? dateFmt.format(new Date(iso.length <= 10 ? `${iso}T12:00:00` : iso)) : "");
/** "Saturday, 9 January 2027" in Kampala time. */
export const formatDay = (iso) => (iso ? dayFmt.format(new Date(iso)) : "");
/** "Sat 9 Jan" in Kampala time. */
export const formatShortDay = (iso) => (iso ? shortDayFmt.format(new Date(iso)) : "");
/** "10:00" in Kampala time. */
export const formatTime = (iso) => (iso ? timeFmt.format(new Date(iso)) : "");
/** "10:00 to 14:00 EAT" */
export const formatTimeRange = (start, end) => `${formatTime(start)}${end ? ` to ${formatTime(end)}` : ""} EAT`;
/** Day of the month and short month for date tiles, in Kampala time. */
export const dateTile = (iso) => {
  const parts = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: TZ }).formatToParts(new Date(iso));
  return { day: parts.find((p) => p.type === "day")?.value, month: parts.find((p) => p.type === "month")?.value };
};

export const formatCount = (n) => countFmt.format(Math.max(0, Math.trunc(Number(n) || 0)));
export const votesLabel = (n) => `${formatCount(n)} ${Number(n) === 1 ? "vote" : "votes"}`;
/** "UGX 30,000", or "Free" for zero. */
export const formatMoney = (n, currency = "UGX") => (Number(n) === 0 ? "Free" : `${currency} ${countFmt.format(Number(n) || 0)}`);

/** Minutes to read a list of text blocks at 200 words a minute (at least 1). */
export const readMinutesOf = (blocks = []) => {
  const words = blocks.map((b) => b.text ?? (b.items ?? []).join(" ")).join(" ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
};

/** upcoming, open or closed, from the status and the dates. The server decides for real. */
export const pollPhase = (poll, now = Date.now()) => {
  if (!poll) return "closed";
  if (poll.status === "scheduled" || now < Date.parse(poll.opensAt)) return "upcoming";
  if (poll.status === "closed" || now >= Date.parse(poll.closesAt)) return "closed";
  return "open";
};

/** Whole days, hours, minutes and seconds until a moment. */
export const timeParts = (iso, now = Date.now()) => {
  const diff = Math.max(0, Date.parse(iso) - now);
  return {
    done: diff === 0,
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
};
/** "12 days left", "Ends today", "Ended". */
export const timeLeftLabel = (iso, now = Date.now()) => {
  const { done, days } = timeParts(iso, now);
  if (done) return "Ended";
  if (days === 0) return "Ends today";
  return `${days} ${days === 1 ? "day" : "days"} left`;
};

export const hostOf = (url) => {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
};

export const initialsOf = (name) =>
  name
    .replace(/&/g, " ")
    .split(/[\s-]+/)
    .filter((w) => w && !/^(of|and|the)$/i.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

/** Blog cover: the CMS image, else public/images/blog/<slug>.webp */
export const coverOf = (post) => post.image || `/images/blog/${post.slug}.webp`;

/** Absolute link to a page on the live site, for sharing. */
export const SITE_URL = "https://gd256.org";
export const absoluteUrl = (path = "/") => (/^https?:/.test(path) ? path : `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`);

/** "What AI Actually Does" → "what-ai-actually-does", for heading anchors. */
export const slugify = (text = "") => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
