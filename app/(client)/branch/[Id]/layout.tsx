import Footer from "@/components/footer";
import Navbar from "@/components/header";
import HeroSLider from "@/components/hero-slider";
import NavBreadcrumb from "@/components/nav-breadcrumb";
import { HeroSliderSkeleton } from "@/components/skeleton";
import { Separator } from "@/components/ui/separator";
import { Fragment, Suspense } from "react";
import banner from "@/public/image/banner/branch-banner.jpeg";

export default function BranchLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  return (
    <Fragment>
      <Navbar />
      <Separator />
      <NavBreadcrumb now="شعبه" />
      <Suspense fallback={<HeroSliderSkeleton />}>
        <HeroSLider params={params} banner={banner.src} />
      </Suspense>
      {children}
      <Footer />
    </Fragment>
  );
}
