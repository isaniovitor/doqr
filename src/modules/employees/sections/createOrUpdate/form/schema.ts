import { onlyDigits } from "@/utils/utils";
import * as yup from "yup";

export const schema = yup.object({
  name: yup.string().required("Informe o nome."),
  email: yup.string().email("E-mail inválido.").required("Informe o e-mail."),
  cpf: yup
    .string()
    .test(
      "cpf-mask",
      "CPF inválido.",
      (v) => !!v && onlyDigits(v).length === 11
    )
    .required("Informe o CPF."),
  phone: yup
    .string()
    .test(
      "phone-mask",
      "Celular inválido.",
      (v) => !!v && onlyDigits(v).length >= 10
    )
    .required("Informe o celular."),
  dateOfBith: yup
    .string()
    .test("date-br", "Data inválida.", (v) => !!v && onlyDigits(v).length === 8)
    .required("Informe a data de nascimento."),
  typeOfHiring: yup
    .string()
    .oneOf(["CLT", "PJ"])
    .required("Selecione o tipo de contratação."),
  status: yup
    .string()
    .oneOf(["ATIVO", "INATIVO"])
    .required("Selecione o status."),
});

export type FormValues = yup.InferType<typeof schema>;
