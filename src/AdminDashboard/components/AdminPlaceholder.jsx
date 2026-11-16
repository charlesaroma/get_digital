/* Placeholder for admin screens still to build: says what the screen will do. */
import { Hammer } from "lucide-react";

export default function AdminPlaceholder({ title, text, items = [] }) {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-h2">{title}</h1>
      <div className="flex flex-col gap-4 rounded-2xl border border-dashed border-border-strong bg-surface p-6 sm:p-8">
        <p className="flex items-center gap-2 font-bold">
          <Hammer aria-hidden="true" size={18} strokeWidth={1.75} />
          Built next
        </p>
        <p className="max-w-[60ch] text-muted">{text}</p>
        {items.length > 0 && (
          <ul className="flex list-disc flex-col gap-1.5 pl-5 text-muted marker:text-gd-yellow-600">
            {items.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
