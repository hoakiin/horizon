import Image from "next/image";
import AnimatedCounter from "./AnimatedCounter";
import DoughnutChart from "./DoughnutChart";

function TotalBalanceBox({
  accounts = [],
  totalBanks,
  totalCurrentBalance,
}: TotlaBalanceBoxProps) {
  const total = typeof totalCurrentBalance === "number" ? totalCurrentBalance : 0;

  return (
    <section className="flex w-full items-center gap-4 rounded-xl border border-gray-200 p-4 shadow-chart sm:gap-6 sm:p-6">
      <div className="flex size-full max-w-[100px] items-center sm:max-w-[120px]">
        {accounts.length > 0 ? (
          <DoughnutChart accounts={accounts} />
        ) : (
          <div className="flex-center size-full max-h-[120px] rounded-full border border-dashed border-gray-300 bg-gray-50">
            <Image
              src="/icons/credit-card.svg"
              width={36}
              height={36}
              alt="credit card"
            />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-6">
        <h2 className="header-2"> Bank Accounts: {totalBanks}</h2>
        <div className="flex flex-col gap-2">
          <p className="total-balance-label">Total Current Balance</p>
          <div className="text-24 lg:text-30 flex-1 font-semibold text-gray-900 flex-center gap-2">
            <AnimatedCounter amount={total} />
          </div>
          {totalBanks === 0 && (
            <p className="text-14 font-normal text-gray-500">
              Connect a bank account to see your balance
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default TotalBalanceBox;