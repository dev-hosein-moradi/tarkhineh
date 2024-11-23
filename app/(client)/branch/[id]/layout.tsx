import Footer from "@/components/footer";
import Navbar from "@/components/header";
import HeroSlider from "@/components/hero-slider";
import NavBreadcrumb from "@/components/nav-breadcrumb";
import { HeroSliderSkeleton } from "@/components/skeleton";
import { Separator } from "@/components/ui/separator";
import { Fragment, Suspense } from "react";
import banner from "@/public/image/banner/branch-banner.jpeg";

export default async function BranchLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  return (
    <Fragment>
      <Navbar />
      <Separator />
      <NavBreadcrumb now="شعبه" />
      <Suspense fallback={<HeroSliderSkeleton />}>
        <HeroSlider params={resolvedParams} banner={banner.src} />
      </Suspense>
      {children}
      <Footer />
    </Fragment>
  );
}
