"use client";

import {
  createLinkToken,
  exchangePublicToken,
} from "@/lib/actions/user.actions";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  PlaidLinkOnSuccess,
  PlaidLinkOptions,
  usePlaidLink,
} from "react-plaid-link";
import { Button } from "./button";

function PlaidLink({ user, variant }: PlaidLinkProps) {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const getLinkToken = async () => {
      const data = await createLinkToken(user);
      setToken(data?.linkToken);
    };

    getLinkToken();
  }, [user]);

  const onSuccess = useCallback<PlaidLinkOnSuccess>(
    async (public_token: string) => {
      try {
        setError("");
        await exchangePublicToken({
          publicToken: public_token,
          user,
        });

        router.push("/");
      } catch (err) {
        console.error("Bank connection error:", err);
        setError(
          err instanceof Error && err.message
            ? err.message
            : "Failed to connect bank. Please try again.",
        );
      }
    },
    [router, user],
  );

  const config: PlaidLinkOptions = {
    token,
    onSuccess,
  };

  const { open, ready } = usePlaidLink(config);

  return (
    <>
      {variant === "primary" ? (
        <Button
          onClick={() => open()}
          disabled={!ready}
          className="plaidlink-primary"
        >
          Connect Bank
        </Button>
      ) : variant === "ghost" ? (
        <Button
          onClick={() => open()}
          variant={"ghost"}
          className="plaidlink-ghost"
        >
          <Image
            src="/icons/connect-bank.svg"
            alt="connect bank"
            width={24}
            height={24}
          />
          <p className="hiddenl text-[16px] font-semibold text-black-2 xl:block">
            Connect bank
          </p>
        </Button>
      ) : (
        <Button
          onClick={() => open()}
          className="plaidlink-default !gap-3 !px-4 !py-2 md:!px-3 md:!py-3 2xl:!px-4 2xl:!py-4"
        >
          <Image
            src="/icons/connect-bank.svg"
            alt="connect bank"
            width={24}
            height={24}
            className="shrink-0"
          />
          <p className="text-[16px] font-semibold text-black-2 max-xl:hidden">
            Connect bank
          </p>
        </Button>
      )}
      {error && <p className="text-14 text-red-500 mt-2">{error}</p>}
    </>
  );
}

export default PlaidLink;
