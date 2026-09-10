"use client";

import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Footer from "./Footer";
import PlaidLink from "./ui/PlaidLink";

function Sidebar({ user }: SiderbarProps) {
  const pathname = usePathname();
  const [pendingRoute, setPendingRoute] = useState<string | null>(null);
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setPendingRoute(null);
  }

  return (
    <section className="sticky left-0 top-0 flex h-screen w-fit flex-col justify-between border-r border-gray-200 bg-white pt-8 text-white max-md:hidden sm:p-4 xl:p-6 2xl:w-[355px]">
      <nav className="flex flex-col gap-4">
        <Link href="/" className="mb-12 cursor-pointer items-center gap-2 flex">
          <Image
            src="/icons/logo.svg"
            width={34}
            height={34}
            alt="Horizon logo"
            className="size-[24px] max-xl:size-14"
          />
          <h1 className="2xl:text-26 font-ibm-plex-serif text-[26px] font-bold text-black-1 max-xl:hidden">
            Horizon
          </h1>
        </Link>

        {sidebarLinks.map((item) => {
          const isActive =
            pendingRoute === item.route ||
            pathname === item.route ||
            pathname.startsWith(`${item.route}/`);

          return (
            <Link
              href={item.route}
              key={item.label}
              prefetch={true}
              onClick={() => setPendingRoute(item.route)}
              className={cn(
                "grid grid-cols-[24px_1fr] items-center gap-3 rounded-lg justify-items-start px-4 py-2 md:px-3 md:py-3 2xl:px-4 2xl:py-4",
                { "bg-bank-gradient": isActive },
              )}
            >
              <div className="relative size-6 shrink-0">
                <Image
                  src={item.imgURL}
                  alt={item.label}
                  fill
                  className={cn({
                    "brightness-[3] invert-0": isActive,
                  })}
                />
              </div>
              <p
                className={cn(
                  "text-16 font-semibold text-black-2 max-xl:hidden",
                  { "!text-white": isActive },
                )}
              >
                {item.label}
              </p>
            </Link>
          );
        })}
        <PlaidLink user={user} />
      </nav>

      <Footer user={user} />
    </section>
  );
}

export default Sidebar;
