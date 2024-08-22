"use client";

import { useEffect, useState } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getBranchs } from "@/services/branch-service";
import { IBranch } from "@/types";
import Image from "next/image";
import banner from "@/public/image/banner/banner.jpg";
import { Button } from "./ui/button";

const banners = [banner];

const HeroSLider = () => {
  const [error, setError] = useState(null);
  const [branchs, setBranchs] = useState<IBranch[]>([]);

  useEffect(() => {
    getBranchs()
      .then((data) => {
        setBranchs(data.data);
      })
      .catch((error) => setError(error));
  }, []);
  return (
    <div className="">
      <Carousel className="w-full max-w-[100%]">
        <CarouselContent className="relative h-auto">
          {banners.map((branch, index) => (
            <CarouselItem key={index} className="">
              <div className="relative">
                <Image
                  src={branch}
                  alt={`banner image`}
                  className="object-cover w-[100%] h-[400px] brightness-[0.3]"
                  quality={100}
                  priority
                  blurDataURL=""
                  placeholder="blur"
                  layout="responsive"
                />
              </div>
              <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] flex flex-col items-center">
                <h1 className="text-white text-[4vw] font-bold w-fit text-nowrap">
                  تجربه غذای سالم و گیاهی به سبک ترخینه
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
          {/* <CarouselPrevious className="absolute left-5 bottom-0" />
          <CarouselNext className="absolute right-5 bottom-0" /> */}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default HeroSLider;
