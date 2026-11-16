/* Admin: Voting */
import AdminPlaceholder from "@/AdminDashboard/components/AdminPlaceholder";

export default function AdminVotingPage() {
  return (
    <AdminPlaceholder
      title="Voting"
      text="Run campaigns from set up to results."
      items={[
        "Campaign: dates, featured, live counts on or off, free vote rule",
        "Categories and nominees (add many from photos named after each person)",
        "Boost price per vote and VIP packages",
        "Live tallies, every vote, flags for unusual patterns, void votes with a reason",
        "Close, check and publish results",
      ]}
    />
  );
}
