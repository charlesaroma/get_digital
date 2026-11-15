/* Application Providers */
import { QueryClientProvider } from "@tanstack/react-query";

import { AdminAuthProvider } from "@/store/context/AdminAuthContext";
import { queryClient } from "@/store/tanstackStore/queryClient";

export default function AppProviders({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminAuthProvider>{children}</AdminAuthProvider>
    </QueryClientProvider>
  );
}
