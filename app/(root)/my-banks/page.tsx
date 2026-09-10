import BankCard from "@/components/BankCard";
import HeaderBox from "@/components/HeaderBox";
import PlaidLink from "@/components/ui/PlaidLink";
import { getAccounts } from "@/lib/actions/banks.actions";
import { getLoggedInUser } from "@/lib/actions/current-user";
import { redirect } from "next/navigation";

const MyBanks = async () => {
  const loggedIn = await getLoggedInUser();

  if (!loggedIn) redirect("/sign-in");

  const accounts = await getAccounts({
    userId: loggedIn.$id,
  });

  const accountsData = accounts?.data ?? [];

  return (
    <section className="flex">
      <div className="my-banks">
        <HeaderBox
          title="My Bank Accounts"
          subtext="Effortlessly manage your banking activites."
        />

        <div className="space-y-4">
          <h2 className="header-2">Your cards</h2>

          {accountsData.length > 0 ? (
            <div className="flex flex-wrap gap-6">
              {accountsData.map((a: Account) => (
                <BankCard
                  key={a.appwriteItemId}
                  account={a}
                  userName={loggedIn?.firstName}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
              <p className="text-16 font-medium text-gray-500">
                You haven&apos;t connected any bank accounts yet
              </p>
              <p className="text-14 font-normal text-gray-400">
                Connect your first bank account to get started
              </p>
              <PlaidLink user={loggedIn} variant="primary" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MyBanks;