"use client";

import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

import { formUrlQuery, formatAmount } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export const BankDropdown = ({
  accounts = [],
  setValue,
  otherStyles,
}: BankDropdownProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selected, setSeclected] = useState(accounts[0]);
  const [open, setOpen] = useState(false);

  const handleBankChange = (id: string) => {
    const account = accounts.find((account) => account.appwriteItemId === id)!;

    setSeclected(account);
    setOpen(false);
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "id",
      value: id,
    });
    router.push(newUrl, { scroll: false });

    if (setValue) {
      setValue("senderBank", id);
    }
  };

  return (
    <div className="relative w-full md:w-[300px]">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex w-full items-center justify-between gap-3 rounded-md border border-gray-300 bg-white px-3 py-2.5 text-left shadow-xs focus:outline-none focus-visible:ring-3 focus-visible:ring-gray-900/20 ${otherStyles}`}
      >
        <span className="flex flex-1 items-center gap-3">
          <Image
            src="icons/credit-card.svg"
            width={20}
            height={20}
            alt="account"
          />
          <span className="line-clamp-1 w-full text-left text-sm font-medium text-gray-900">
            {selected?.name ?? "Select a bank"}
          </span>
        </span>
        <ChevronDown
          className={`size-4 shrink-0 text-gray-500 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute left-0 top-full z-50 mt-2 w-full rounded-md border border-gray-200 bg-white py-1 shadow-md"
        >
          <p className="px-3 py-2 text-xs font-normal text-gray-500">
            Select a bank to display
          </p>
          {accounts.map((account: Account) => (
            <button
              type="button"
              key={account.id}
              onClick={() => handleBankChange(account.appwriteItemId)}
              className={`flex w-full flex-col items-start border-t border-gray-100 px-3 py-2 text-left hover:bg-gray-50 ${
                account.appwriteItemId === selected?.appwriteItemId
                  ? "bg-gray-50"
                  : ""
              }`}
            >
              <span className="text-sm font-medium text-gray-900">
                {account.name}
              </span>
              <span className="text-sm font-medium text-blue-600">
                {formatAmount(account.currentBalance)}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};