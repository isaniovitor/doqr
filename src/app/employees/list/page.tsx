import { getEmployees } from "@/modules/employees/actions/actions";
import EmployeeTable from "@/modules/employees/sections/list/Table/EmployeesTable";

export default async function EmployeesListPage() {
  const employees = await getEmployees();
  return (
    <div className="w-full rounded-2xl  bg-white ">
      <div className="mb-3 flex items-end justify-between gap-2">
        <div>
          <h1 className="text-md md:text-4xl font-bold">
            Controle de Funcionários
          </h1>
          <p className="text-sm md:text-xl font-bold text-black/70">
            Empresa DoQR Tecnologia
          </p>
        </div>
      </div>
      <EmployeeTable employees={employees.data || []} />
    </div>
  );
}
