import { logoutAccount } from "@/lib/actions/user.actions";
import Image from "next/image";
import { useRouter } from "next/navigation";

function Footer({ user, type = "desktop" }: FooterProps) {
  const router = useRouter();

  const handleLogOut = async () => {
    const loggedOut = await logoutAccount();

    if (loggedOut) router.push("/sign-in");
  };

  return (
    <footer className="footer">
      <div
        className={
          type === "mobile"
            ? "footer_name-mobile"
            : "flex size-10 items-center justify-center rounded-full bg-gray-200 max-xl:hidden"
        }
      >
        <p className="text-xl font-bold text-gray-700">{user?.firstName[0]}</p>
      </div>

      <div
        className={
          type === "mobile"
            ? "footer_email-mobile"
            : "flex flex-1 flex-col justify-center max-xl:hidden"
        }
      >
        <h1 className="text-14 truncate text-gray-700 font-semibold">
          {user?.firstName}
        </h1>

        <p className="text-14 truncate font-normal text-gray-600"></p>
      </div>

      <div
        onClick={handleLogOut}
        className="relative size-5 max-xl:w-full max-xl:flex max-xl:justify-center max-xl:items-center"
      >
        <Image src="icons/logout.svg" fill alt="jsm" />
      </div>
    </footer>
  );
}

export default Footer;
