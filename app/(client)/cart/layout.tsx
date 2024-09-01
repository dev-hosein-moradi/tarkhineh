import Footer from "@/components/footer";
import Navbar from "@/components/header";
import NavBreadcrumb from "@/components/nav-breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Fragment } from "react";

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Fragment>
      <Navbar />
      <Separator />
      {children}
      <Footer />
    </Fragment>
  );
}
