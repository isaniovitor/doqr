import { Loader2Icon } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 flex justify-center items-center flex-col gap-2">
      <Loader2Icon className="animate-spin" />
      carregando...
    </div>
  );
}
