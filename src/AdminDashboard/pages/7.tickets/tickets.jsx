/* Admin: Tickets */
import AdminPlaceholder from "@/AdminDashboard/components/AdminPlaceholder";

export default function AdminTicketsPage() {
  return (
    <AdminPlaceholder
      title="Tickets"
      text="Create events, sell tickets and check people in."
      items={[
        "Event details, agenda and speakers",
        "Ticket types with price, seats and perks",
        "Orders, refunds and resending tickets",
        "Door check in by scanning the QR code, even offline",
      ]}
    />
  );
}
