/* Admin: Blogs */
import AdminPlaceholder from "@/AdminDashboard/components/AdminPlaceholder";

export default function AdminBlogsPage() {
  return (
    <AdminPlaceholder
      title="Blogs"
      text="Write and publish guides with the same blocks the site shows."
      items={[
        "Title, category, cover photo and alt text, tags",
        "Paragraphs, headings, lists and quotes",
        "Draft, schedule or publish; the updated date sets itself",
        "Preview the link card before sharing",
      ]}
    />
  );
}
