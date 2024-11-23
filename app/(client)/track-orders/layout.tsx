import Footer from "@/components/footer";
import Navbar from "@/components/header";
import NavBreadcrumb from "@/components/nav-breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Fragment, Suspense } from "react";

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Fragment>
      <Navbar />
      <Separator />
      <NavBreadcrumb now="پیگیری سفارشات" />
      {children}
      <Footer />
    </Fragment>
  );
}
