import Footer from "@/components/footer";
import Navbar from "@/components/header";
import { Fragment } from "react";

export default function SuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Fragment>
      <Navbar />
      
      <Footer />
    </Fragment>
  );
}
