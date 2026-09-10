import HeaderBox from '@/components/HeaderBox'
import PaymentTransferForm from '@/components/PaymentTransferForm';
import PlaidLink from '@/components/ui/PlaidLink';
import { getAccounts } from '@/lib/actions/banks.actions';
import { getLoggedInUser } from '@/lib/actions/current-user';
import { redirect } from 'next/navigation';

const Transfer = async () => {
  const loggedIn = await getLoggedInUser();

  if (!loggedIn) redirect('/sign-in');

  const accounts = await getAccounts({
    userId: loggedIn.$id
  })

  const accountsData = accounts?.data ?? [];

  return (
    <section className="payment-transfer">
      <HeaderBox
        title="Payment Transfer"
        subtext="Please provide any specific details or notes related to the payment transfer"
      />

      <section className="size-full pt-5">
        {accountsData.length > 0 ? (
          <PaymentTransferForm accounts={accountsData} />
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
            <p className="text-16 font-medium text-gray-500">
              You need to connect a bank account to make transfers
            </p>
            <PlaidLink user={loggedIn} variant="primary" />
          </div>
        )}
      </section>
    </section>
  )
}

export default Transfer