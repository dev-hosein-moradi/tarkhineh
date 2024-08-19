import CategoryWrapper from "@/components/category-wrapper";
import Navbar from "@/components/header";
import HeroSLider from "@/components/hero-slider";
import QuickAbout from "@/components/quick-about";

export default function Page() {
  return (
    <div>
      <Navbar />
      <HeroSLider />
      <CategoryWrapper />
      <QuickAbout />
    </div>
  );
}
