import { EmployeeDTO } from "./dto";

export type EmployeeModel = EmployeeDTO & {
  isRemoving?: boolean;
  isCreating?: boolean;
  isEditing?: boolean;
};
