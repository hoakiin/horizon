import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex h-full w-full flex-1 items-center justify-center">
      <Loader2 className="size-8 animate-spin text-blue-600" />
    </div>
  );
}
