/* Admin: Overview. Live totals for voting and tickets, the leaders in each open campaign and the
   latest ticket orders. Refreshes every 30 seconds. */
import { Banknote, BookOpen, Ticket, Vote } from "lucide-react";

import Skeleton from "@/components/ui/Skeleton";
import { useAdminAuth } from "@/store/context/AdminAuthContext";
import { useAdminOverview } from "@/store/tanstackStore/queries/admin";
import { cn } from "@/utils/cn";
import { formatCount, formatDate, formatMoney, pollPhase } from "@/utils/format";

const STATUS = { paid: "bg-success-soft text-success", confirmed: "bg-success-soft text-success", pending: "bg-warning-soft text-warning", refunded: "bg-surface-muted text-muted", cancelled: "bg-error-soft text-error" };

export default function AdminOverviewPage() {
  const { admin } = useAdminAuth();
  const { data, isPending } = useAdminOverview();

  if (isPending || !data) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-busy="true">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 rounded-2xl" />
        ))}
      </div>
    );
  }

  const { polls, nominees, events, types, orders, blogs } = data;
  const open = polls.filter((p) => pollPhase(p) === "open");
  const liveVotes = nominees.filter((n) => open.some((p) => p.id === n.pollId)).reduce((s, n) => s + n.votes, 0);
  const sold = types.reduce((s, t) => s + t.sold, 0);
  const revenue = types.reduce((s, t) => s + t.sold * t.price, 0);
  const kpis = [
    { label: "Votes in open campaigns", value: formatCount(liveVotes), note: `${open.length} campaigns open`, icon: Vote },
    { label: "Tickets issued", value: formatCount(sold), note: `${events.filter((e) => e.status === "published").length} events on sale`, icon: Ticket },
    { label: "Ticket sales", value: formatMoney(revenue), note: "Paid tickets, all events", icon: Banknote },
    { label: "Published guides", value: blogs.filter((b) => b.status === "published").length, note: "Blogs", icon: BookOpen },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-h2">Hello, {admin?.name?.split(" ")[0]}</h1>
        <p className="mt-1 text-muted">Here is what is happening on gd256.org right now.</p>
      </div>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <li key={k.label} className="flex flex-col gap-2 rounded-2xl bg-surface p-5 ring-1 ring-inset ring-border">
            <k.icon aria-hidden="true" size={20} strokeWidth={1.75} className="text-muted" />
            <p className="text-small text-muted">{k.label}</p>
            <p className="font-mono text-h3 font-semibold tabular-nums">{k.value}</p>
            <p className="text-small text-muted">{k.note}</p>
          </li>
        ))}
      </ul>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section aria-labelledby="leaders-title" className="rounded-2xl bg-surface p-5 ring-1 ring-inset ring-border sm:p-6">
          <h2 id="leaders-title" className="text-h4">
            Leading now
          </h2>
          {open.map((p) => (
            <div key={p.id} className="mt-5">
              <p className="font-semibold">{p.title}</p>
              <ul className="mt-2 flex flex-col divide-y divide-border">
                {p.categories.map((c) => {
                  const top = nominees.filter((n) => n.categoryId === c.id && n.pollId === p.id).sort((a, b) => b.votes - a.votes)[0];
                  return (
                    top && (
                      <li key={c.id} className="flex items-center justify-between gap-4 py-2.5 text-small">
                        <span className="min-w-0">
                          <span className="block truncate font-semibold">{top.name}</span>
                          <span className="block truncate text-muted">{c.name}</span>
                        </span>
                        <span className="shrink-0 font-mono tabular-nums">{formatCount(top.votes)}</span>
                      </li>
                    )
                  );
                })}
              </ul>
            </div>
          ))}
        </section>

        <section aria-labelledby="orders-title" className="rounded-2xl bg-surface p-5 ring-1 ring-inset ring-border sm:p-6">
          <h2 id="orders-title" className="text-h4">
            Latest ticket orders
          </h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[32rem] text-left text-small">
              <thead className="text-muted">
                <tr className="border-b border-border">
                  <th scope="col" className="py-2 pr-4 font-semibold">Reference</th>
                  <th scope="col" className="py-2 pr-4 font-semibold">Event</th>
                  <th scope="col" className="py-2 pr-4 font-semibold">Total</th>
                  <th scope="col" className="py-2 pr-4 font-semibold">Status</th>
                  <th scope="col" className="py-2 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b border-border last:border-0">
                    <td className="py-3 pr-4 font-mono whitespace-nowrap">{o.reference}</td>
                    <td className="py-3 pr-4">{events.find((e) => e.id === o.eventId)?.title}</td>
                    <td className="py-3 pr-4 font-mono tabular-nums whitespace-nowrap">{formatMoney(o.total)}</td>
                    <td className="py-3 pr-4">
                      <span className={cn("rounded-full px-2.5 py-1 font-semibold capitalize", STATUS[o.status])}>{o.status}</span>
                    </td>
                    <td className="py-3 whitespace-nowrap">{formatDate(o.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
