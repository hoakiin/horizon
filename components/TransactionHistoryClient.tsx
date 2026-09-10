"use client";

import { useState } from "react";

import { BankDropdown } from "@/components/BankDropdown";
import HeaderBox from "@/components/HeaderBox";
import TransactionHistoryTable from "@/components/TransactionHistoryTable";
import { getAccount } from "@/lib/actions/banks.actions";
import { formatAmount } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const TransactionHistoryClient = ({
  accounts,
  account: initialAccount,
  transactions: initialTransactions,
  currentPage,
}: {
  accounts: Account[];
  account?: Account;
  transactions: Transaction[];
  currentPage: number;
}) => {
  const [account, setAccount] = useState<Account | undefined>(initialAccount);
  const [transactions, setTransactions] =
    useState<Transaction[]>(initialTransactions);
  const [loading, setLoading] = useState(false);

  const handleBankChange = async (id: string) => {
    setLoading(true);
    try {
      const result = await getAccount({ appwriteItemId: id });
      setAccount(result?.data);
      setTransactions(result?.transactions ?? []);
    } catch (error) {
      console.error("Error switching account:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex max-h-screen w-full flex-col gap-8 overflow-y-scroll bg-gray-25 p-8 xl:py-12">
      <div className="flex w-full flex-col items-start justify-between gap-8 md:flex-row">
        <HeaderBox
          title="Transaction History"
          subtext="See your bank details and transactions"
        />
        <BankDropdown accounts={accounts} onBankChange={handleBankChange} />
      </div>

      <div className="relative space-y-6">
        <div className="flex flex-col justify-between gap-4 rounded-lg border-y border-white/25 bg-blue-600 px-4 py-5 md:flex-row">
          <div className="flex flex-col gap-2">
            <h2 className="text-18 font-bold text-white">
              {account?.name ?? "Unknown account"}
            </h2>
            <p className="text-14 text-blue-25">
              {account?.officialName ?? ""}
            </p>
            <p className="text-14 font-semibold tracking-[1.1px] text-white">
              ●●●● ●●●● ●●●●{" "}
              <span className="text-16">{account?.mask ?? "••••"}</span>
            </p>
          </div>

          <div className="transactions-account-balance">
            <p className="text-14">Current balance</p>
            <p className="text-24 text-center font-bold">
              {formatAmount(account?.currentBalance)}
            </p>
          </div>
        </div>

        <TransactionHistoryTable transactions={transactions} page={currentPage} />

        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white/70">
            <Loader2 className="size-8 animate-spin text-blue-600" />
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistoryClient;