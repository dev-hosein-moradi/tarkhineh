"use client";

import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import BranchsWrapper from "@/components/branchs-wrapper";
import CategoryWrapper from "@/components/category-wrapper";
import Footer from "@/components/footer";
import Navbar from "@/components/header";
import HeroSLider from "@/components/hero-slider";
import QuickAbout from "@/components/quick-about";
import SearchWrapper from "@/components/search-wrapper";
import { HeroSliderSkeleton } from "@/components/skeleton";
import banner from "@/public/image/banner/banner.webp";
import { useAuth } from "@/contexts/auth-context";

interface PageProps {
  params: any;
}

export default function Page({ params }: PageProps) {
  const { user, isAuthenticated, initialized } = useAuth();
  const router = useRouter();

  // Handle redirect for admin users
  useEffect(() => {
    if (initialized && user && isAuthenticated) {
      if (user.role === "superAdmin" || user.role === "admin") {
        router.push("/admin");
      }
    }
  }, [initialized, user, isAuthenticated, router]);

  // Show loading while auth is initializing
  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <Suspense fallback={<HeroSliderSkeleton />}>
        <HeroSLider params={params} banner={banner.src} />
      </Suspense>
      <SearchWrapper />
      <CategoryWrapper />
      <QuickAbout />
      <BranchsWrapper />
      <Footer />
    </div>
  );
}
