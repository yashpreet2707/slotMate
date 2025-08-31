import Image from "next/image";
import Link from "next/link";


const Header: React.FC = () => {
  return (
    <div className="mx-auto py-2 px-4 flex justify-between items-center shadow-md border-b-2">
      <Link href={"/"} className="flex items-center">
        <Image
          className="bg-transparent h-16 w-auto"
          src="/logo.png"
          alt="logo"
          width={160}
          height={60}
        />
      </Link>
    </div>
  );
};

export default Header;
