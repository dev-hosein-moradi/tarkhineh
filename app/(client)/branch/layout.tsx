import Footer from "@/components/footer";
import Navbar from "@/components/header";
import HeroSLider from "@/components/hero-slider";
import { Fragment } from "react";

export default function BranchLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Fragment>
      <Navbar />
      <HeroSLider />
      {children}
      <Footer />
    </Fragment>
  );
}
