import Footer from "@/components/footer";
import Navbar from "@/components/header";
import HeroSLider from "@/components/hero-slider";
import NavBreadcrumb from "@/components/nav-breadcrumb";
import { HeroSliderSkeleton } from "@/components/skeleton";
import { Separator } from "@/components/ui/separator";
import { Fragment, Suspense } from "react";
import banner from "@/public/image/banner/menu-banner.jpeg";

export default async function MenuLayout({
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
      <NavBreadcrumb now="منو" />
      <Suspense fallback={<HeroSliderSkeleton />}>
        <HeroSLider params={resolvedParams} banner={banner.src} />
      </Suspense>
      {children}
      <Footer />
    </Fragment>
  );
}
