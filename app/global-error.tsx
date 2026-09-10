"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-white p-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="font-ibm-plex-serif text-[26px] font-bold text-black-1">
            Something went wrong!
          </p>
          <p className="text-16 font-normal text-gray-600">
            An unexpected error has occurred.
          </p>
          {error.digest && (
            <p className="text-14 font-normal text-gray-500">
              Error ID: {error.digest}
            </p>
          )}
          <button
            onClick={reset}
            className="mt-2 rounded-lg bg-bank-gradient px-4 py-2 text-14 font-semibold text-white transition-opacity hover:opacity-90"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}