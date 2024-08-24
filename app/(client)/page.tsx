import BranchsWrapper from "@/components/branchs-wrapper";
import CategoryWrapper from "@/components/category-wrapper";
import Footer from "@/components/footer";
import Navbar from "@/components/header";
import HeroSLider from "@/components/hero-slider";
import QuickAbout from "@/components/quick-about";
import SearchWrapper from "@/components/search-wrapper";
import { HeroSliderSkeleton } from "@/components/skeleton";
import { Suspense } from "react";

export default function Page() {
  return (
    <div>
      <Navbar />
      <Suspense fallback={<HeroSliderSkeleton />}>
        <HeroSLider />
      </Suspense>
      <SearchWrapper />
      <CategoryWrapper />
      <QuickAbout />
      <BranchsWrapper />
      <Footer />
    </div>
  );
}
