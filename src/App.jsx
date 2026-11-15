/* Root Application */
import { Suspense } from "react";
import { BrowserRouter, Routes } from "react-router-dom";

import AppProviders from "./AppProviders";
import adminRoutes from "./routes/AdminRoutes";
import siteRoutes from "./routes/SiteRoutes";

function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <Suspense fallback={null}>
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
