"use client";

import { useEffect } from "react";
import { worker } from "@/mocks/browser";

export default function MswProvider() {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_E2E === "1") {
      // Start the SW. Silence logs if you like: { quiet: true }
      worker.start({
        serviceWorker: { url: "/mockServiceWorker.js" },
        onUnhandledRequest: "bypass",
      });
    }
  }, []);
  return null;
}
