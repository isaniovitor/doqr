import { getEmployee } from "@/modules/employees/actions/actions";
import CreateOrUpdateForm from "@/modules/employees/sections/createOrUpdate/form/CreateOrUpdateForm";
import { EmployeeDTO } from "@/modules/employees/types/dto";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function EmployeeCreateOrUpdatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isCreating = id === "new";
  const title = isCreating ? "Criar" : "Editar";
  let employee = {} as EmployeeDTO;

  if (!isCreating) {
    const data = await getEmployee(id);
    employee = data.data as EmployeeDTO;
  }

  return (
    <div className="w-full rounded-2xl  bg-white ">
      <div className="mb-3 flex items-end justify-between gap-2">
        <div>
          <Link href={"/employees/list"} className="font-bold flex mb-4 gap-1">
            <ArrowLeft />
            Voltar
          </Link>
          <h1 className="text-md md:text-4xl font-bold">
            {title} de Funcionário
          </h1>
          <p className="text-sm md:text-xl font-bold text-black/70">
            Empresa DoQR Tecnologia
          </p>
        </div>
      </div>
      <CreateOrUpdateForm employee={employee} />
    </div>
  );
}
