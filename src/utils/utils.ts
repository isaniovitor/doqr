import { ActionResult } from "@/modules/employees/actions/actions";

// Mantém só dígitos
export const onlyDigits = (v: string) => String(v ?? "").replace(/\D/g, "");

/** CPF -> 111.222.333-44 */
export const formatCPF = (cpf: string) => {
  const d = onlyDigits(cpf).slice(0, 11);
  if (d.length !== 11) return String(cpf ?? "");
  return d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

/** phone BR -> 99999-9999 or 9999-9999 */
export const formatPhoneBR = (phone: string) => {
  const d = onlyDigits(phone);

  if (d.length === 11) {
    return d.replace(/(\d{2})(\d{5})(\d{4})/, "$1$2-$3");
  }
  if (d.length === 10) {
    return d.replace(/(\d{2})(\d{4})(\d{4})/, "$1$2-$3");
  }
  return String(phone ?? "");
};

/** Data ISO -> DD/MM/AAAA (ex.: "1997-08-08T03:00:00" -> "08/08/1997") */
export const formatDateBR = (isoDate: string) => {
  const m = String(isoDate ?? "").match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return String(isoDate ?? "");
  const [, yyyy, mm, dd] = m;
  return `${dd}/${mm}/${yyyy}`;
};

export const toISOStringFromBR = (dateStr: string): string => {
  const [day, month, year] = dateStr.split("/").map(Number);
  return new Date(year, month - 1, day).toISOString();
};

export const handleFetchError = async <T>(
  res: Response
): Promise<ActionResult<T> | undefined> => {
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    return {
      ok: false,
      error: `Failed: ${res.status} ${res.statusText}${
        body ? ` - ${body}` : ""
      }`,
    };
  }
};
