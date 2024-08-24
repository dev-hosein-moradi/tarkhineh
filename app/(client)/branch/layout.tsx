import Footer from "@/components/footer";
import Navbar from "@/components/header";
import HeroSLider from "@/components/hero-slider";
import { HeroSliderSkeleton } from "@/components/skeleton";
import { Fragment, Suspense } from "react";

export default function BranchLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Fragment>
      <Navbar />
      <Suspense fallback={<HeroSliderSkeleton />}>
        <HeroSLider />
      </Suspense>
      {children}
      <Footer />
    </Fragment>
  );
}
