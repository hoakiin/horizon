"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import TransactionsTable from "./TransactionsTable";
import { Pagination } from "./Pagination";
import { formUrlQuery } from "@/lib/utils";

const TransactionHistoryTable = ({
  transactions,
  page = 1,
}: TransactionHistoryTableProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const rowsPerPage = 10;
  const totalTransactions = transactions ?? [];
  const totalPages = Math.ceil(totalTransactions.length / rowsPerPage);

  const indexOfLastTransaction = page * rowsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;
  const currentTransactions = totalTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction,
  );

  const handlePageChange = (pageNumber: number) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "page",
      value: pageNumber.toString(),
    });

    startTransition(() => {
      router.push(newUrl, { scroll: false });
    });
  };

  return (
    <section className="flex w-full flex-col gap-6">
      <div className="relative">
        {isPending && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white/70">
            <Loader2 className="size-8 animate-spin text-blue-600" />
          </div>
        )}

        <TransactionsTable transactions={currentTransactions} />
      </div>

      {totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          page={page}
          onPageChange={handlePageChange}
          isPending={isPending}
        />
      )}
    </section>
  );
};

export default TransactionHistoryTable;