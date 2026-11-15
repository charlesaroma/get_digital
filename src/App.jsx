/* Root Application */
import { Suspense, useEffect } from "react";
import { BrowserRouter, Routes } from "react-router-dom";

import LogoLoader from "@/components/motion/LogoLoader";
import { markAppReady } from "@/utils/bootLoader";

import AppProviders from "./AppProviders";
import adminRoutes from "./routes/AdminRoutes";
import siteRoutes from "./routes/SiteRoutes";

function App() {
  // Lets the boot loader in index.html fade out once the first screen is ready.
  useEffect(() => {
    markAppReady();
  }, []);

  return (
    <AppProviders>
      <BrowserRouter>
        <Suspense fallback={<LogoLoader />}>
          <Routes>
            {adminRoutes()}
            {siteRoutes()}
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AppProviders>
  );
}

export default App;
