"use client";

import React, { useEffect, useState, useTransition } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash, SquarePen, Loader2Icon, Plus } from "lucide-react";
import { EmployeeDTO } from "@/modules/employees/types/dto";
import useOptimisticCrud from "@/hook/useOptimisticCrud";
import { EmployeeModel } from "@/modules/employees/types/model";
import {
  getEmployees,
  removeEmployee,
} from "@/modules/employees/actions/actions";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import Link from "next/link";
import { toast } from "react-toastify";
import { formatCPF, formatDateBR, formatPhoneBR } from "@/utils/utils";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useDebouncedEffect } from "@/hook/useDebouncedEffect";

function StatusBadge({ status }: { status: EmployeeDTO["status"] }) {
  const base = "px-2.5 py-0.5 text-xs font-medium rounded-full";
  if (status)
    return (
      <Badge
        className={`${base} bg-emerald-100 text-emerald-700 hover:bg-emerald-100`}
      >
        Ativo
      </Badge>
    );
  return (
    <Badge className={`${base} bg-rose-100 text-rose-700 hover:bg-rose-100`}>
      Inativo
    </Badge>
  );
}

function Actions({
  empl,
  remove,
}: {
  empl: EmployeeModel;
  remove: (id: string) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        className="h-5 w-5 cursor-pointer text-blue-500 hover:text-blue-700"
        aria-label="Editar"
        disabled={empl.isEditing}
        onClick={() =>
          startTransition(() => {
            router.push(`/employees/createOrUpdate/${empl.id}`);
          })
        }
      >
        {isPending ? (
          <Loader2Icon className="animate-spin" />
        ) : (
          <SquarePen className="h-4 w-4" />
        )}
      </Button>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 cursor-pointer text-red-500 hover:text-red-700"
            aria-label="Excluir"
          >
            {empl.isRemoving ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <Trash className="h-5 w-5" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="!bg-white p-3 shadow-md flex flex-col">
            tem certeza?
            <Button
              variant="outline"
              className="h-5 cursor-pointer mt-1 w-full text-red-500 hover:text-red-700"
              aria-label="Excluir"
              onClick={() => remove(String(empl.id))}
            >
              sim
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

const EmployeeTable = ({ employees }: { employees: EmployeeDTO[] }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_isPending, startTransition] = useTransition();
  const [isSearchPending, onSearchTransition] = useTransition();
  const [query, setQuery] = useState<string | undefined>(undefined);
  const [data, setData] = useState(employees);
  const { items, remove } = useOptimisticCrud<EmployeeModel>(data);

  const handleDelete = (id: string) => {
    startTransition(async () => {
      remove(id);

      const res = await removeEmployee(id);
      if (res.ok) {
        if (!!query) await runSearch(query);
        toast.success("Funcionário deletado!");
        return;
      }

      toast.error(res.error);
    });
  };

  const runSearch = async (q: string | undefined) => {
    if (q === undefined) return;

    onSearchTransition(async () => {
      const res = await getEmployees(q);
      if (res.error) {
        toast.error(res.error);
      }

      setData(res.data || []);
    });
  };

  useDebouncedEffect(async () => runSearch(query), [query], 400);
  useEffect(() => {
    if (!query) setData(employees);
  }, [employees, query]);

  return (
    <>
      <div className="mb-3 mt-8 flex w-full justify-between gap-2">
        <div className="flex gap-2 items-center">
          <Input
            value={query || ""}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={"Buscas funcionário..."}
            className="lg:w-96"
            data-cy="search-employee"
          />

          {isSearchPending && <Loader2Icon className="animate-spin" />}
        </div>

        <Link href={`/employees/createOrUpdate/new`}>
          <Button
            variant="default"
            className="cursor-pointer bg-[#7741FB] hover:bg-[#511fd1]"
            aria-label="Novo Funcionário"
            data-cy="new-employee"
          >
            <Plus /> <span className="hidden md:block">Novo Funcionário</span>
          </Button>
        </Link>
      </div>

      <div className="w-full !rounded-xl border border-gray-75 overflow-hidden mb-20">
        <Table className="">
          <TableHeader>
            <TableRow className="bg-gray-100 [&_*]:!px-4">
              <TableHead className="w-[5%] text-[#58575A] font-bold">
                Nome
              </TableHead>
              <TableHead className="w-[5%] text-[#58575A] font-bold">
                E-mail
              </TableHead>
              <TableHead className="w-[10%] text-[#58575A] font-bold">
                CPF
              </TableHead>
              <TableHead className="w-[10%] text-[#58575A] font-bold">
                Celular
              </TableHead>
              <TableHead className="w-[15%] text-[#58575A] font-bold">
                Data de Nascimento
              </TableHead>
              <TableHead className="w-[15%] text-[#58575A] font-bold">
                Tipo Contratação
              </TableHead>
              <TableHead className="w-[5%] text-[#58575A] font-bold">
                Status
              </TableHead>
              <TableHead className="w-[5%] text-[#58575A] font-bold">
                Ação
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {items.length > 0 ? (
              <>
                {items.map((emp, idx) => (
                  <TableRow
                    key={idx}
                    className="hover:bg-muted/40 [&>*]:!py-3 [&>*]:!px-4"
                  >
                    <TableCell>{emp.name}</TableCell>
                    <TableCell>
                      <a
                        href={`mailto:${emp.email}`}
                        className="underline-offset-2 hover:underline"
                      >
                        {emp.email}
                      </a>
                    </TableCell>
                    <TableCell>{formatCPF(emp.cpf)}</TableCell>
                    <TableCell>{formatPhoneBR(emp.phone)}</TableCell>
                    <TableCell>{formatDateBR(emp.dateOfBith)}</TableCell>
                    <TableCell>{emp.typeOfHiring}</TableCell>
                    <TableCell>
                      <StatusBadge status={emp.status} />
                    </TableCell>
                    <TableCell>
                      <Actions empl={emp} remove={handleDelete} />
                    </TableCell>
                  </TableRow>
                ))}
              </>
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  Sem resultados!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default EmployeeTable;
