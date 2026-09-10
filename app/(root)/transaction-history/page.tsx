import HeaderBox from "@/components/HeaderBox";
import TransactionHistoryTable from "@/components/TransactionHistoryTable";
import { getAccount, getAccounts } from "@/lib/actions/banks.actions";
import { getLoggedInUser } from "@/lib/actions/current-user";
import { formatAmount } from "@/lib/utils";
import { redirect } from "next/navigation";

const TransactionHistory = async ({ searchParams }: SearchParamProps) => {
  const { id, page } = await searchParams;
  const currentPage = Number(page as string) || 1;
  const loggedIn = await getLoggedInUser();

  if (!loggedIn) redirect("/sign-in");

  const accounts = await getAccounts({ userId: loggedIn.$id });
  const accountsData = accounts?.data ?? [];

  if (accountsData.length === 0) {
    return (
      <div className="flex max-h-screen w-full flex-col gap-8 overflow-y-scroll bg-gray-25 p-8 xl:py-12">
        <HeaderBox
          title="Transaction History"
          subtext="See your bank details and transactions"
        />
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <p className="text-16 font-medium text-gray-500">
            No bank accounts connected yet
          </p>
          <p className="text-14 font-normal text-gray-400">
            Connect a bank account to see your transaction history
          </p>
        </div>
      </div>
    );
  }

  const appwriteItemId = (id as string) || accountsData[0].appwriteItemId;

  const account = await getAccount({ appwriteItemId });

  return (
    <div className="flex max-h-screen w-full flex-col gap-8 overflow-y-scroll bg-gray-25 p-8 xl:py-12">
      <div className="flex w-full flex-col items-start justify-between gap-8 md:flex-row">
        <HeaderBox
          title="Transaction History"
          subtext="See your bank details and transactions"
        />
      </div>

      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 rounded-lg border-y border-white/25 bg-blue-600 px-4 py-5 md:flex-row">
          <div className="flex flex-col gap-2">
            <h2 className="text-18 font-bold text-white">
              {account?.data?.name ?? "Unknown account"}
            </h2>
            <p className="text-14 text-blue-25">
              {account?.data?.officialName ?? ""}
            </p>
            <p className="text-14 font-semibold tracking-[1.1px] text-white">
              ●●●● ●●●● ●●●●{" "}
              <span className="text-16">{account?.data?.mask ?? "••••"}</span>
            </p>
          </div>

          <div className="transactions-account-balance">
            <p className="text-14">Current balance</p>
            <p className="text-24 text-center font-bold">
              {formatAmount(account?.data?.currentBalance)}
            </p>
          </div>
        </div>

        <TransactionHistoryTable
          transactions={account?.transactions ?? []}
          page={currentPage}
        />
      </div>
    </div>
  );
};

export default TransactionHistory;