import { SetupWorker, setupWorker } from "msw/browser";

export let worker: SetupWorker = {} as SetupWorker;
// Create the worker with your handlers
if (typeof window !== "undefined") {
  worker = setupWorker(...handlers);
}

// Expose MSW on window so Cypress can override handlers per test if needed
// (MSW v2 exports are attached here for easy access)
import * as msw from "msw";
import { http, HttpResponse } from "msw";
import { handlers } from "./handlers";

declare global {
  interface Window {
    msw?: {
      worker: ReturnType<typeof setupWorker>;
      http: typeof http;
      HttpResponse: typeof HttpResponse;
      // you can export handlers too, if helpful:
      handlers: typeof handlers;
    };
  }
}

if (typeof window !== "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).msw = { worker, http, HttpResponse, handlers };
}
