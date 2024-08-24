import Footer from "@/components/footer";
import Navbar from "@/components/header";
import HeroSLider from "@/components/hero-slider";
import { HeroSliderSkeleton } from "@/components/skeleton";
import { Fragment, Suspense } from "react";

export default function BranchLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { branchId: string };
}) {
  return (
    <Fragment>
      <Navbar />
      <Suspense fallback={<HeroSliderSkeleton />}>
        <HeroSLider params={params} />
      </Suspense>
      {children}
      <Footer />
    </Fragment>
  );
}
