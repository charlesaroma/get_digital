/* "Add to calendar": a small .ics file any phone or computer calendar can open. */
const stamp = (iso) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
const esc = (s = "") => s.replace(/[\\;,]/g, (m) => `\\${m}`).replace(/\n/g, "\\n");

export function icsHref({ title, description, location, startsAt, endsAt, url }) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//GetDigital256//Events//EN",
    "BEGIN:VEVENT",
    `UID:${stamp(startsAt)}-${encodeURIComponent(title)}@gd256.org`,
    `DTSTAMP:${stamp(new Date().toISOString())}`,
    `DTSTART:${stamp(startsAt)}`,
    `DTEND:${stamp(endsAt || startsAt)}`,
    `SUMMARY:${esc(title)}`,
    `DESCRIPTION:${esc(`${description ?? ""}${url ? `\n${url}` : ""}`)}`,
    `LOCATION:${esc(location)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(lines.join("\r\n"))}`;
}
