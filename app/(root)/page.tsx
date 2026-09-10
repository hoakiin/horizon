import HeaderBox from "@/components/HeaderBox";
import RecentTransactions from "@/components/RecentTransactions";
import RightSidebar from "@/components/RightSidebar";
import TotalBalanceBox from "@/components/TotalBalanceBox";
import { getAccount, getAccounts } from "@/lib/actions/banks.actions";
import { getLoggedInUser } from "@/lib/actions/current-user";
import { redirect } from "next/navigation";

const Home = async ({ searchParams }: SearchParamProps) => {
  const { id, page } = await searchParams;
  const currentPage = Number(page as string) || 1;
  const loggedIn = await getLoggedInUser();

  if (!loggedIn) redirect("/sign-in");

  const accounts = await getAccounts({ userId: loggedIn.$id });

  if (!accounts) return;

  const accountsData = accounts?.data;
  const appwriteItemId = (id as string) || accountsData[0]?.appwriteItemId;

  const accountResults = await Promise.all(
    accountsData.map((account: Account) =>
      getAccount({ appwriteItemId: account.appwriteItemId }),
    ),
  );

  const transactionsByItemId = accountResults.reduce<
    Record<string, Transaction[]>
  >((map, result) => {
    if (result?.data?.appwriteItemId) {
      map[result.data.appwriteItemId] = result.transactions ?? [];
    }
    return map;
  }, {});

  return (
    <section className="no-scrollbar flex w-full flex-row max-h-screen overflow-y-scroll overflow-x-hidden">
      <div className="no-scrollbar scrollbar-gutter-stable flex w-full min-w-0 flex-1 flex-col gap-8 px-5 sm:px-8 py-7 lg:py-12 xl:max-h-screen xl:overflow-y-scroll">
        <header className="home-header">
          <HeaderBox
            type="greeting"
            title="Welcome,"
            user={loggedIn?.firstName || "Guest"}
            subtext="Access and manage your account and transactions efficiently."
          />

          <TotalBalanceBox
            accounts={accountsData}
            totalBanks={accounts?.totalBanks}
            totalCurrentBalance={accounts?.totalCurrentBalance}
          />
        </header>
        <RecentTransactions
          accounts={accountsData}
          transactionsByItemId={transactionsByItemId}
          appwriteItemId={appwriteItemId}
          page={currentPage}
        />
      </div>

      <RightSidebar
        user={loggedIn}
        transactions={Object.values(transactionsByItemId).flat()}
        banks={accountsData?.slice(0, 2)}
      />
    </section>
  );
};

export default Home;
