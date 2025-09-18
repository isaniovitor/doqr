export type EmployeeDTO = {
  id?: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  dateOfBith: string;
  typeOfHiring: "CLT" | "PJ";
  status: boolean;
};
