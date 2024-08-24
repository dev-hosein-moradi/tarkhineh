"use client";

import { useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import banner from "@/public/image/banner/banner.jpg";
import { Button } from "./ui/button";

const banners = [banner];

const HeroSlider = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Extract the 'n' query parameter from the URL
  const branchName = searchParams?.get("n") || "ترخینه";

  // Memoize the banner text to avoid recalculating on each render
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
          {banners?.map((bannerImage, index) => (
            <CarouselItem key={index}>
              <div className="relative">
                <Image
                  src={bannerImage}
                  alt="banner image"
                  className="object-cover w-full h-[450px] brightness-50"
                  quality={100}
                  priority
                  placeholder="blur"
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
