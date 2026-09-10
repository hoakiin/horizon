import { cn } from "@/lib/utils";

export const BankTabItem = ({ account }: BankTabItemProps) => {
  return (
    <p className={cn("text-16 line-clamp-1 font-medium text-gray-500")}>
      {account.name}
    </p>
  );
};