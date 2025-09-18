import { setupServer } from "msw/node";
import { handlers } from "./handlers";

// Single shared server for SSR/server actions
export const server = setupServer(...handlers);

// Start immediately when this module is imported in E2E mode
if (process.env.NEXT_PUBLIC_E2E === "1") {
  // Avoid double-listen in hot reload by memoizing on global
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const g = global as any;
  if (!g.__MSW_SERVER_LISTENING__) {
    server.listen({ onUnhandledRequest: "warn" });
    g.__MSW_SERVER_LISTENING__ = true;

    // Optional graceful shutdown (dev servers rarely need this)
    process.once("SIGINT", () => server.close());
    process.once("SIGTERM", () => server.close());

    server.events.on("request:match", ({ request }) => {
      console.log("[MSW][Node] MATCH:", request.method, request.url);
    });
    server.events.on("request:unhandled", ({ request }) => {
      console.warn("[MSW][Node] UNHANDLED:", request.method, request.url);
    });
  }
}
