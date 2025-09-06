import { PenBox } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import UserMenu from "./user-menu";
import { checkUser } from "@/lib/checkUser";

const Header: React.FC = async () => {

  await checkUser() ;

  return (
    <nav className="mx-auto py-2 px-4 flex justify-between items-center shadow-md border-b-2">
      <Link href={"/"} className="flex items-center">
        <Image
          className="bg-transparent h-16 w-auto"
          draggable={false}
          src="/logo.png"
          alt="logo"
          width={160}
          height={60}
        />
      </Link>
      <div className="flex items-center gap-4">
        <Link href={"/events?create=true"}>
          <Button>
            <PenBox size={18} />
            Create Event
          </Button>
        </Link>

        <SignedOut>
          <SignInButton forceRedirectUrl={"/dashboard"}>
            <Button variant="outline">Login</Button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <UserMenu />
        </SignedIn>
      </div>
    </nav>
  );
};

export default Header;
