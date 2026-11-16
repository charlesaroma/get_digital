/* Ticket types with quantity steppers, seats left and a running total. */
import { CircleCheck, Minus, Plus } from "lucide-react";

import { cn } from "@/utils/cn";
import { formatMoney } from "@/utils/format";

export default function TicketPicker({ types, quantities, onChange, disabled }) {
  return (
    <ul className="flex flex-col gap-3">
      {types.map((t) => {
        const left = Math.max(0, t.capacity - t.sold);
        const q = quantities[t.id] ?? 0;
        const max = Math.min(left, t.maxPerOrder);
        const soldOut = left === 0;
        return (
          <li key={t.id} className={cn("rounded-2xl p-4 ring-1 ring-inset", q > 0 ? "bg-surface ring-2 ring-foreground" : "bg-surface ring-border", soldOut && "opacity-60")}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-bold text-foreground">{t.name}</p>
                <p className="font-mono text-small font-semibold tabular-nums">{formatMoney(t.price, t.currency)}</p>
              </div>
              {soldOut || disabled ? (
                <span className="shrink-0 rounded-full bg-surface-muted px-3 py-1.5 text-small font-semibold text-muted">{soldOut ? "Sold out" : "Not on sale"}</span>
              ) : (
                <div className="flex shrink-0 items-center gap-1" role="group" aria-label={`${t.name} tickets`}>
                  <button type="button" aria-label={`One less ${t.name}`} disabled={q === 0} onClick={() => onChange(t.id, q - 1)} className="grid size-11 place-items-center rounded-full border border-border-strong bg-surface hover:bg-surface-muted disabled:opacity-40">
                    <Minus aria-hidden="true" size={16} strokeWidth={1.75} />
                  </button>
                  <span className="w-8 text-center font-mono text-h4 tabular-nums" aria-live="polite">
                    {q}
                  </span>
                  <button type="button" aria-label={`One more ${t.name}`} disabled={q >= max} onClick={() => onChange(t.id, q + 1)} className="grid size-11 place-items-center rounded-full border border-border-strong bg-surface hover:bg-surface-muted disabled:opacity-40">
                    <Plus aria-hidden="true" size={16} strokeWidth={1.75} />
                  </button>
                </div>
              )}
            </div>
            {t.description && <p className="mt-2 text-small text-muted">{t.description}</p>}
            {t.perks?.length > 0 && (
              <ul className="mt-3 flex flex-col gap-1 text-small text-muted">
                {t.perks.map((p) => (
                  <li key={p} className="flex items-start gap-2">
                    <CircleCheck aria-hidden="true" size={15} strokeWidth={1.75} className="mt-0.5 shrink-0 text-success" />
                    {p}
                  </li>
                ))}
              </ul>
            )}
            {!soldOut && left <= 20 && <p className="mt-3 text-small font-semibold text-warning">Only {left} left</p>}
          </li>
        );
      })}
    </ul>
  );
}
