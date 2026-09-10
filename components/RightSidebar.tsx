import Image from "next/image";
import Link from "next/link";
import BankCard from "./BankCard";
import { countTransactionCategories } from "@/lib/utils";
import Category from "./Category";

function RightSidebar({ user, transactions, banks }: RightSidebarProps) {
  const categories: CategoryCount[] = countTransactionCategories(
    transactions,
  ).slice(0, 3);

  return (
    <aside className="no-scrollbar scrollbar-gutter-stable hidden h-screen max-h-screen flex-col border-l border-gray-200 xl:flex w-[355px] xl:overflow-y-scroll">
      <section className="flex flex-col">
        <div className="profile-banner" />
        <div className="relative flex px-6 max-xl:justify-center">
          <div className="profile-img">
            <span className="text-5xl font-bold text-blue-500">
              {user.firstName[0]}
            </span>
          </div>

          <div className="profile-details">
            <h1 className="profile-name">
              {user.firstName} {user.lastName}
            </h1>
            <p className="profile-email">{user.email}</p>
          </div>
        </div>
      </section>

<section className="banks">
        <div className="flex w-full justify-between">
          <h2 className="header-2">My banks</h2>
          <Link href="/my-banks" className="flex gap-2">
            <Image src="/icons/plus.svg" width={20} height={20} alt="plus" />
            <h2 className="text-14 font-semibold text-gray-600">Add Bank</h2>
          </Link>
        </div>
{banks?.length > 0 ? (
          <div className="relative flex w-full flex-col items-center justify-center gap-5">
            <div className="relative z-10 w-[280px] -ml-10">
              <BankCard
                key={banks[0].$id}
                account={banks[0]}
                userName={`${user.firstName} ${user.lastName}`}
                showBalance={false}
              />
            </div>
            {banks[1] && (
              <div className="absolute right-0 top-8 z-0 w-[280px]">
                <BankCard
                  key={banks[1].$id}
                  account={banks[1]}
                  userName={`${user.firstName} ${user.lastName}`}
                  showBalance={false}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center">
            <p className="text-14 font-medium text-gray-500">
              No banks connected yet
            </p>
            <Link
              href="/my-banks"
              className="text-14 font-semibold text-blue-600"
            >
              Connect a bank
            </Link>
          </div>
        )}

        <div className="mt-10 flex flex-1 flex-col gap-6">
          <h2 className="header-2">Top categories</h2>

          {categories.length > 0 ? (
            <div className="space-y-3">
              {categories.map((category) => (
                <Category key={category.name} category={category} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center">
              <p className="text-14 font-medium text-gray-500">
                No transactions yet
              </p>
            </div>
          )}
        </div>
      </section>
    </aside>
  );
}

export default RightSidebar;
