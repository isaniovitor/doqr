// MSW v2 API
import { http, HttpResponse } from "msw";

import employees from "../../cypress/fixtures/employee/employees.json";
import employeesSearch from "../../cypress/fixtures/employee/employees_search.json";
import employeesEmpty from "../../cypress/fixtures/employee/employees_empty.json";
import employeeEdit from "../../cypress/fixtures/employee/employee_dit.json";

/** Shared mock data used in e2e */
function chooseFixture(url: string, cookieHeader: string | null) {
  const u = new URL(url);
  const name = (u.searchParams.get("name") || "").toLowerCase();

  // ex.: cy.setCookie('x-e2e-case','empty')
  const forced = cookieHeader?.match(/x-e2e-case=([^;]+)/)?.[1];

  if (forced === "rose") return employeesSearch;
  if (forced === "empty") return employeesEmpty;

  if (!name) return employees;
  if (name.includes("rose")) return employeesSearch;
  if (name.includes("naoexiste")) return employeesEmpty;
  return employees; // default
}

/**
 * Handlers can target:
 *  - your external API (recommended if getEmployees hits it directly), or
 *  - your internal /api route (if you proxy through Next).
 *
 * Add both so you're covered.
 */
export const handlers = [
  // match exata + query
  http.get(
    /https?:\/\/api-testefrontend\.qforms\.com\.br\/employees(?:\?.*)?$/i,
    ({ request }) => {
      const cookie = request.headers.get("cookie");
      const body = chooseFixture(request.url, cookie);
      return HttpResponse.json(body, {
        status: 200,
      });
    }
  ),

  http.get(
    /https?:\/\/api-testefrontend\.qforms\.com\.br\/employees\/[^/?#]+$/i,
    () =>
      HttpResponse.json(employeeEdit, {
        status: 200,
      })
  ),

  // POST
  http.post("**/employees", async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ ...Object(body), id: 999 }, { status: 200 });
  }),

  // PUT
  http.put("**/employees/:id", async ({ request, params }) => {
    const body = await request.json();
    return HttpResponse.json(
      { ...Object(body), id: params.id },
      { status: 200 }
    );
  }),

  // DELETE
  http.delete("**/employees/:id", ({ request }) => {
    const cookie = request.headers.get("cookie");

    if (cookie?.includes("x-delete=error")) {
      return new HttpResponse("server error", {
        status: 500,
      });
    }

    return new HttpResponse(null, { status: 200 });
  }),
];
