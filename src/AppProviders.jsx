/* Application Providers */
import { QueryClientProvider } from "@tanstack/react-query";
import { MotionConfig } from "motion/react";

import { AdminAuthProvider } from "@/store/context/AdminAuthContext";
import { queryClient } from "@/store/tanstackStore/queryClient";

export default function AppProviders({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Animations follow the device "reduce motion" setting automatically. */}
      <MotionConfig reducedMotion="user">
        <AdminAuthProvider>{children}</AdminAuthProvider>
      </MotionConfig>
    </QueryClientProvider>
  );
}
