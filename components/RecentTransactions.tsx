"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { BankTabItem } from "./BankTabItem";
import BankInfo from "./BankInfo";
import TransactionsTable from "./TransactionsTable";
import { Pagination } from "./Pagination";
import { formUrlQuery } from "@/lib/utils";

const RecentTransactions = ({
  accounts,
  transactionsByItemId,
  appwriteItemId,
  page = 1,
}: RecentTransactionsProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const initialTab = accounts.some(
    (account) => account.appwriteItemId === appwriteItemId,
  )
    ? appwriteItemId
    : accounts[0]?.appwriteItemId;

  const [activeTab, setActiveTab] = useState(initialTab);

  const rowsPerPage = 10;
  const totalTransactions = transactionsByItemId[activeTab] ?? [];
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

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);

    if (page !== 1) {
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "page",
        value: "1",
      });

      startTransition(() => {
        router.push(newUrl, { scroll: false });
      });
    }
  };

  if (!accounts || accounts.length === 0) {
    return (
      <section className="recent-transactions">
        <header className="flex items-center justify-between">
          <h2 className="text-20 md:text-24 font-semibold text-gray-900">
            Recent transactions
          </h2>
          <Link href="/my-banks" className="view-all-btn">
            Connect a bank
          </Link>
        </header>

        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <Image
            src="/icons/credit-card.svg"
            width={40}
            height={40}
            alt="no accounts"
          />
          <p className="text-16 font-medium text-gray-500">
            No bank accounts connected yet
          </p>
          <p className="text-14 font-normal text-gray-400">
            Connect a bank account to see your transactions here
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="recent-transactions">
      <header className="flex items-center justify-between">
        <h2 className="text-20 md:text-24 font-semibold text-gray-900">
          Recent transactions
        </h2>
        <Link
          href={`/transaction-history/?id=${activeTab}`}
          className="view-all-btn"
        >
          View all
        </Link>
      </header>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList variant="line" className="recent-transactions-tablist">
          {accounts.map((account: Account) => (
            <TabsTrigger
              key={account.appwriteItemId}
              value={account.appwriteItemId}
              className="data-[state=active]:[&_p]:text-blue-600"
            >
              <BankTabItem account={account} />
            </TabsTrigger>
          ))}
        </TabsList>

        {accounts.map((account: Account) => (
          <TabsContent
            value={account.appwriteItemId}
            key={account.appwriteItemId}
            className="relative min-w-0 space-y-4"
          >
            <BankInfo
              account={account}
              appwriteItemId={activeTab}
              type="full"
            />

            {isPending && (
              <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white/70">
                <Loader2 className="size-8 animate-spin text-blue-600" />
              </div>
            )}

            <TransactionsTable transactions={currentTransactions} />

            {totalPages > 1 && (
              <div className="my-4 2-full">
                <Pagination
                  totalPages={totalPages}
                  page={page}
                  onPageChange={handlePageChange}
                  isPending={isPending}
                />
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
};

export default RecentTransactions;
