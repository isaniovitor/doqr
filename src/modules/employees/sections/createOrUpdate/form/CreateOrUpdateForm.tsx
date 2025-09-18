"use client";

import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { withMask } from "use-mask-input";
import { EmployeeDTO } from "@/modules/employees/types/dto";
import { formatDateBR, onlyDigits, toISOStringFromBR } from "@/utils/utils";
import { FormValues, schema } from "./schema";
import { toast } from "react-toastify";
import {
  addEmployee,
  editEmployee,
  removeEmployee,
} from "@/modules/employees/actions/actions";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";

const CreateOrUpdateForm = ({ employee }: { employee: EmployeeDTO }) => {
  const [isPending, startTransition] = useTransition();
  const [isDeletePending, onDeleteTransition] = useTransition();
  const route = useRouter();
  const isCreating = !employee?.id;
  const form = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: "onTouched",
    shouldFocusError: true,
    defaultValues: {
      name: employee.name || "",
      email: employee.email || "",
      cpf: employee.cpf || "",
      phone: employee.phone || "",
      dateOfBith: formatDateBR(employee.dateOfBith) || "",
      typeOfHiring: employee.typeOfHiring || "CLT",
      status:
        employee.status === true
          ? "ATIVO"
          : employee.status === false
          ? "INATIVO"
          : "ATIVO",
    },
  });

  const handleDelete = () => {
    onDeleteTransition(async () => {
      const res = await removeEmployee(String(employee.id));
      if (res.ok) {
        toast.success("Funcionário deletado!");
        route.push("/employees/list");
        return;
      }

      toast.error(res.error);
    });
  };

  const onSubmit = (values: FormValues) => {
    const payload: EmployeeDTO = {
      ...values,
      cpf: onlyDigits(values.cpf),
      phone: onlyDigits(values.phone),
      dateOfBith: toISOStringFromBR(values.dateOfBith),
      status: values.status == "ATIVO",
    };

    startTransition(async () => {
      const res = !isCreating
        ? await editEmployee(String(employee.id), payload)
        : await addEmployee(payload);

      if (res.ok) {
        toast.success(`Funcionário  ${employee.id ? "editado" : "criado"}!`);
        route.push("/employees/list");

        return;
      }

      toast.error(res.error);
    });
  };

  return (
    <div className="space-y-4 mt-8">
      <Card className="border border-muted/40 shadow-[1px_1px_16px_0px_#00000026]">
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="name">Nome</FormLabel>
                      <FormControl>
                        <Input id="name" placeholder="Nome" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="email">E-mail</FormLabel>
                      <FormControl>
                        <Input
                          id="email"
                          placeholder="e-mail"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cpf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="cpf">CPF</FormLabel>
                      <FormControl>
                        <Input
                          id="cpf"
                          inputMode="numeric"
                          placeholder="000.000.000-00"
                          {...field}
                          ref={(el) => {
                            field.ref(el);
                            if (el)
                              withMask("999.999.999-99", { placeholder: "_" })(
                                el
                              );
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="phone">Celular</FormLabel>
                      <FormControl>
                        <Input
                          id="phone"
                          inputMode="numeric"
                          placeholder="(99) 99999-9999"
                          {...field}
                          ref={(el) => {
                            field.ref(el);
                            if (el)
                              withMask("(99) 99999-9999", { placeholder: "_" })(
                                el
                              );
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateOfBith"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="dateOfBith">
                        Data de Nascimento
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="dateOfBith"
                          inputMode="numeric"
                          placeholder="00/00/0000"
                          {...field}
                          ref={(el) => {
                            field.ref(el);
                            if (el) withMask("99/99/9999")(el);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="typeOfHiring"
                  render={({ field }) => (
                    <FormItem className="!w-ful">
                      <FormLabel id="typeOfHiring">
                        Tipo de Contratação
                      </FormLabel>
                      <FormControl>
                        <Select
                          {...field}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue
                              id="typeOfHiring"
                              placeholder="Selecione uma opção..."
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CLT">CLT</SelectItem>
                            <SelectItem value="PJ">PJ</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel id="status">Status</FormLabel>
                      <FormControl>
                        <Select
                          {...field}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue
                              id="status"
                              placeholder="Selecione uma opção..."
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ATIVO">Ativo</SelectItem>
                            <SelectItem value="INATIVO">Inativo</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-3 justify-end md:justify-start">
                {!isCreating && (
                  <Button
                    variant="default"
                    className=" cursor-pointer bg-[#FA5E5E] hover:bg-[#da2929]"
                    aria-label="Excluir"
                    type="button"
                    onClick={() => handleDelete()}
                    disabled={isDeletePending}
                  >
                    {isDeletePending && (
                      <Loader2Icon className="animate-spin" />
                    )}
                    Excluir
                  </Button>
                )}

                <Button
                  variant="default"
                  className=" cursor-pointer bg-[#7741FB] hover:bg-[#511fd1]"
                  aria-label="Cadastrar"
                  type="submit"
                  disabled={isPending}
                >
                  {isPending && <Loader2Icon className="animate-spin" />}
                  {isCreating ? "Cadastrar" : "Editar"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateOrUpdateForm;
