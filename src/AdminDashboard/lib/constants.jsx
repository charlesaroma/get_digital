/* Sidebar order. `perm` is a module id from data/permissions.json. */
export const ADMIN_NAV = [
  { to: "/admin", label: "Overview" },
  { to: "/admin/blogs", label: "Blogs", perm: "blogs" },
  { to: "/admin/partners", label: "Partners", perm: "partners" },
  { to: "/admin/press", label: "Press", perm: "press" },
  { to: "/admin/voting", label: "Voting", perm: "voting" },
  { to: "/admin/tickets", label: "Tickets", perm: "tickets" },
  { to: "/admin/messages", label: "Messages", perm: "messages" },
  { to: "/admin/settings", label: "Settings", perm: "settings" },
];
