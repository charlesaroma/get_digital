/* Admin: Press */
import AdminPlaceholder from "@/AdminDashboard/components/AdminPlaceholder";

export default function AdminPressPage() {
  return (
    <AdminPlaceholder
      title="Press"
      text="Publish press releases with media contacts."
      items={[
        "Dateline, summary and full text",
        "Media contacts",
        "Optional photo for link previews",
      ]}
    />
  );
}
