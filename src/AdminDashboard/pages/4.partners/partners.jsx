/* Admin: Partners */
import AdminPlaceholder from "@/AdminDashboard/components/AdminPlaceholder";

export default function AdminPartnersPage() {
  return (
    <AdminPlaceholder
      title="Partners"
      text="Add, reorder and hide partners."
      items={[
        "Name, description, website and logo upload",
        "Drag to reorder",
        "Show or hide without deleting",
      ]}
    />
  );
}
