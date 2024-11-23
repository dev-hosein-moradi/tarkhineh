"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import banner from "@/public/image/banner/banner.webp";
import { getBranchById } from "@/services/branch-service";
import { IBranch } from "@/types";
import { fakeBlurDataURL } from "@/lib/blurDataImage";
import { use } from 'react';

// Dynamically import the Carousel and Button components
const Carousel = dynamic(() =>
  import("@/components/ui/carousel").then((mod) => mod.Carousel)
);
const CarouselContent = dynamic(() =>
  import("@/components/ui/carousel").then((mod) => mod.CarouselContent)
);
const CarouselItem = dynamic(() =>
  import("@/components/ui/carousel").then((mod) => mod.CarouselItem)
);
const Button = dynamic(() =>
  import("@/components/ui/button").then((mod) => mod.Button)
);

const banners = [banner];

interface HeroSliderProps {
  params: { id: string }; // Params is already resolved before being passed here
  banner: string;
}

const HeroSlider: React.FC<HeroSliderProps> = ({ params, banner }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [branchName, setBranchName] = useState<string | null>("ترخینه");

  useEffect(() => {
    const fetchBranch = async () => {
      try {
        // Fetch branch data using the resolved params.id
        const response = await getBranchById(params.id);
        const branchData: IBranch = response.data.data; // Extract the IBranch object

        setBranchName(branchData?.name?.split(" ")[1] || "");
      } catch (error) {
        console.error("Failed to fetch branch:", error);
      }
    };

    if (pathname?.startsWith("/branch")) {
      fetchBranch();
    }
  }, [params.id, pathname, searchParams]);

  const bannerText = useMemo(() => {
    if (pathname?.startsWith("/branch") && branchName) {
      return `سرسبزی ${branchName} دلیل حس خوب شماست`;
    }
    return "تجربه غذای سالم و گیاهی به سبک ترخینه";
  }, [pathname, branchName]);

  return (
    <div>
      <Carousel className="w-full max-w-full">
        <CarouselContent className="relative h-auto">
          {banners.map((bannerImage, index) => (
            <CarouselItem key={index}>
              <div className="relative">
                <Image
                  src={bannerImage}
                  alt="banner image"
                  className="object-cover w-full h-[450px] brightness-[0.3]"
                  quality={70}
                  priority
                  placeholder="blur"
                  width={1000}
                  height={100}
                  blurDataURL={fakeBlurDataURL}
                />
              </div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center w-full">
                <h1 className="text-white text-center text-[5vw] lg:text-[4vw] font-bold w-full">
                  {bannerText}
                </h1>
                <Button
                  onClick={() =>
                    document
                      .getElementById("Category_Section")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="bg-main text-white mx-auto hover:bg-main my-2"
                >
                  سفارش آنلاین غذا
                </Button>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default HeroSlider;
