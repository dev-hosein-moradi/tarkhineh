import BranchsWrapper from "@/components/branchs-wrapper";
import CategoryWrapper from "@/components/category-wrapper";
import Footer from "@/components/footer";
import Navbar from "@/components/header";
import HeroSLider from "@/components/hero-slider";
import QuickAbout from "@/components/quick-about";
import SearchWrapper from "@/components/search-wrapper";

export default function Page() {
  return (
    <div>
      <Navbar />
      <HeroSLider />
      <SearchWrapper />
      <CategoryWrapper />
      <QuickAbout />
      <BranchsWrapper />
      <Footer />
    </div>
  );
}
