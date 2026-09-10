"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { createTransfer } from "@/lib/actions/dwolla.actions";
import { createTransaction } from "@/lib/actions/transaction.actions";
import { getBank, getBankBySharableId } from "@/lib/actions/user.actions";

import { Button } from "./ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "./ui/field";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { BankDropdown } from "./BankDropdown";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().optional(),
  amount: z.string().min(4, "Amount is too short"),
  senderBank: z.string().min(4, "Please select a valid bank account"),
  sharableId: z.string().min(8, "Please select a valid sharable Id"),
});

const PaymentTransferForm = ({ accounts }: PaymentTransferFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      amount: "",
      senderBank: "",
      sharableId: "",
    },
  });

  const submit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setError(null);

    try {
      const receiverBank = await getBankBySharableId({
        sharableId: data.sharableId,
      });
      const senderBank = await getBank({ documentId: data.senderBank });

      if (!receiverBank || !senderBank) {
        throw new Error(
          "Receiver bank not found. Please check the sharable Id."
        );
      }

      const transferParams = {
        sourceFundingSourceUrl: senderBank.fundingSourceUrl,
        destinationFundingSourceUrl: receiverBank.fundingSourceUrl,
        amount: data.amount,
      };
      // create transfer
      const transfer = await createTransfer(transferParams);

      // create transfer transaction
      if (transfer) {
        const senderUserId =
          typeof senderBank.userId === "object" && senderBank.userId
            ? senderBank.userId.$id
            : senderBank.userId;
        const receiverUserId =
          typeof receiverBank.userId === "object" && receiverBank.userId
            ? receiverBank.userId.$id
            : receiverBank.userId;

        const transaction = {
          name: data.name || "Payment Transfer",
          amount: parseFloat(data.amount),
          senderId: senderUserId,
          senderBankId: senderBank.$id,
          receiverId: receiverUserId,
          receiverBankId: receiverBank.$id,
          email: data.email,
        };

        const newTransaction = await createTransaction(transaction);

        if (newTransaction) {
          form.reset();
          setSuccess(true);
          setTimeout(() => router.push("/"), 1500);
        }
      }
    } catch (error) {
      console.error("Submitting create transfer request failed: ", error);
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while sending the transfer."
      );
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={form.handleSubmit(submit)} className="flex flex-col">
        <Controller
          control={form.control}
          name="senderBank"
          render={({ fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className="w-full border-t border-gray-200"
            >
              <div className="payment-transfer_form-item pb-6 pt-5">
                <div className="payment-transfer_form-content">
                  <FieldLabel className="text-14 font-medium text-gray-700">
                    Select Source Bank
                  </FieldLabel>
                  <FieldDescription className="text-12 font-normal text-gray-600">
                    Select the bank account you want to transfer funds from
                  </FieldDescription>
                </div>
                <div className="flex w-full flex-col">
                  <BankDropdown
                    accounts={accounts}
                    setValue={form.setValue}
                    otherStyles="!w-full"
                  />
                  {fieldState.invalid && (
                    <FieldError
                      errors={[fieldState.error]}
                      className="text-12 text-red-500"
                    />
                  )}
                </div>
              </div>
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className="w-full border-t border-gray-200"
            >
              <div className="payment-transfer_form-item pb-6 pt-5">
                <div className="payment-transfer_form-content">
                  <FieldLabel className="text-14 font-medium text-gray-700">
                    Transfer Note (Optional)
                  </FieldLabel>
                  <FieldDescription className="text-12 font-normal text-gray-600">
                    Please provide any additional information or instructions
                    related to the transfer
                  </FieldDescription>
                </div>
                <div className="flex w-full flex-col">
                  <Textarea
                    placeholder="Write a short note here"
                    className="input-class"
                    aria-invalid={fieldState.invalid}
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError
                      errors={[fieldState.error]}
                      className="text-12 text-red-500"
                    />
                  )}
                </div>
              </div>
            </Field>
          )}
        />

        <div className="payment-transfer_form-details">
          <h2 className="text-18 font-semibold text-gray-900">
            Bank account details
          </h2>
          <p className="text-16 font-normal text-gray-600">
            Enter the bank account details of the recipient
          </p>
        </div>

        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className="w-full border-t border-gray-200"
            >
              <div className="payment-transfer_form-item py-5">
                <FieldLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">
                  Recipient&apos;s Email Address
                </FieldLabel>
                <div className="flex w-full flex-col">
                  <Input
                    placeholder="ex: johndoe@gmail.com"
                    className="input-class"
                    aria-invalid={fieldState.invalid}
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError
                      errors={[fieldState.error]}
                      className="text-12 text-red-500"
                    />
                  )}
                </div>
              </div>
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="sharableId"
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className="w-full border-t border-gray-200"
            >
              <div className="payment-transfer_form-item pb-5 pt-6">
                <FieldLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">
                  Receiver&apos;s Plaid Sharable Id
                </FieldLabel>
                <div className="flex w-full flex-col">
                  <Input
                    placeholder="Enter the public account number"
                    className="input-class"
                    aria-invalid={fieldState.invalid}
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError
                      errors={[fieldState.error]}
                      className="text-12 text-red-500"
                    />
                  )}
                </div>
              </div>
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="amount"
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className="w-full border-y border-gray-200"
            >
              <div className="payment-transfer_form-item py-5">
                <FieldLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">
                  Amount
                </FieldLabel>
                <div className="flex w-full flex-col">
                  <Input
                    placeholder="ex: 5.00"
                    className="input-class"
                    aria-invalid={fieldState.invalid}
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError
                      errors={[fieldState.error]}
                      className="text-12 text-red-500"
                    />
                  )}
                </div>
              </div>
            </Field>
          )}
        />

        <div className="payment-transfer_btn-box">
          <Button
            type="submit"
            className="payment-transfer_btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" /> &nbsp; Sending...
              </>
            ) : (
              "Transfer Funds"
            )}
          </Button>
        </div>

        {error && (
          <p className="mt-3 w-full max-w-[850px] text-14 font-medium text-red-500">
            {error}
          </p>
        )}

        {success && (
          <p className="mt-3 flex w-full max-w-[850px] items-center gap-2 text-14 font-medium text-emerald-600">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
              <circle cx="12" cy="12" r="9" />
            </svg>
            Transfer sent successfully!
          </p>
        )}
      </form>
  );
};

export default PaymentTransferForm;
