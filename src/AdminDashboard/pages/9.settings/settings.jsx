/* Admin: Settings */
import AdminPlaceholder from "@/AdminDashboard/components/AdminPlaceholder";

export default function AdminSettingsPage() {
  return (
    <AdminPlaceholder
      title="Settings"
      text="Organisation details and staff accounts."
      items={[
        "Address, email and social links",
        "Staff accounts, roles and permissions",
        "Payment partner keys (kept on the server)",
      ]}
    />
  );
}
