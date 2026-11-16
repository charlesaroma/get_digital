/* Admin: Messages */
import AdminPlaceholder from "@/AdminDashboard/components/AdminPlaceholder";

export default function AdminMessagesPage() {
  return (
    <AdminPlaceholder
      title="Messages"
      text="Read and answer contact form messages and course registrations."
      items={[
        "Inbox with read and answered states",
        "Export course registrations",
      ]}
    />
  );
}
