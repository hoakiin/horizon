import HeaderBox from "@/components/HeaderBox";
import TransactionHistoryClient from "@/components/TransactionHistoryClient";
import { getAccount, getAccounts } from "@/lib/actions/banks.actions";
import { getLoggedInUser } from "@/lib/actions/current-user";
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
    <TransactionHistoryClient
      accounts={accountsData}
      account={account?.data}
      transactions={account?.transactions ?? []}
      currentPage={currentPage}
    />
  );
};

export default TransactionHistory;