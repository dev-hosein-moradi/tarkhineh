import Image from "next/image";

import Logo from "@/public/image/Logo.svg";
import { MainNav } from "./main-nav";
import Link from "next/link";

const Navbar = () => {
  return (
    <header className="flex flex-row items-center justify-between py-[16px] px-[5%] relative max-w-[1350px] mx-auto">
      <MainNav />
      <Link href={"/"}>
        <Image
          src={Logo}
          alt="logo"
          className="w-[150px] h-[38px] md:h-[42px] lg:h-[50px]"
          priority
          width={100}
          height={100}
          quality={100}
        />
      </Link>
    </header>
  );
};

export default Navbar;
