"use server";

import { revalidateTag } from "next/cache";
import { EMPLOYEES_CACHE_TAG } from "../keys/keys";
import { EmployeeDTO } from "../types/dto";
import { handleFetchError } from "@/utils/utils";

const API = "https://api-testefrontend.qforms.com.br";

export type ActionResult<T = void> = {
  ok: boolean;
  error?: string;
  data?: T;
};

export const getEmployees = async (
  name: string = ""
): Promise<ActionResult<EmployeeDTO[]>> => {
  try {
    const query = name ? `?name=${encodeURIComponent(name)}` : "";
    const res = await fetch(`${API}/employees${query}`, {
      next: {
        tags: [EMPLOYEES_CACHE_TAG, name],
      },
    });

    handleFetchError(res);
    const data = res.status == 204 ? [] : ((await res.json()) as EmployeeDTO[]);
    return { ok: true, data };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to delete employee.";
    return { ok: false, error: msg };
  }
};

export const getEmployee = async (
  id: string
): Promise<ActionResult<EmployeeDTO>> => {
  try {
    const res = await fetch(`${API}/employees/${id}`, {
      next: {
        tags: [EMPLOYEES_CACHE_TAG, id],
      },
    });

    handleFetchError(res);
    const data = (await res.json()) as EmployeeDTO;
    return { ok: true, data };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to delete employee.";
    return { ok: false, error: msg };
  }
};

export const addEmployee = async (
  employee: EmployeeDTO
): Promise<ActionResult> => {
  try {
    const res = await fetch(`${API}/employees/`, {
      method: "POST",
      body: JSON.stringify(employee),
      headers: {
        "Content-Type": "application/json",
      },
    });

    handleFetchError(res);
    revalidateTag(EMPLOYEES_CACHE_TAG);
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to add employee.";
    return { ok: false, error: msg };
  }
};

export const editEmployee = async (
  id: string,
  employee: EmployeeDTO
): Promise<ActionResult> => {
  try {
    const res = await fetch(`${API}/employees/${id}`, {
      method: "PUT",
      body: JSON.stringify(employee),
      headers: {
        "Content-Type": "application/json",
      },
    });

    handleFetchError(res);
    revalidateTag(EMPLOYEES_CACHE_TAG);
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to add employee.";
    return { ok: false, error: msg };
  }
};

export const removeEmployee = async (id: string): Promise<ActionResult> => {
  try {
    const res = await fetch(`${API}/employees/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return {
        ok: false,
        error: `Failed: ${res.status} ${res.statusText}${
          body ? ` - ${body}` : ""
        }`,
      };
    }

    handleFetchError(res);
    revalidateTag(EMPLOYEES_CACHE_TAG);
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to delete employee.";
    return { ok: false, error: msg };
  }
};
