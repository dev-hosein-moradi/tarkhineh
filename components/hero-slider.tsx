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
import agh from "@/public/image/banner/aghdasieh.webp";
import cha from "@/public/image/banner/chalus.webp";
import ekb from "@/public/image/banner/ekbatan.webp";
import van from "@/public/image/banner/vanak.webp";
import banner from "@/public/image/banner/banner.jpg";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";

const banners = [banner];

const HeroSLider = () => {
  const paths = usePathname();
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
                  className="object-cover w-[100%] h-[500px] brightness-[0.3]"
                  quality={100}
                  priority
                />
              </div>
              <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] ">
                <h1 className="text-white text-[4.5vw] font-bold w-fit text-nowrap">
                  تجربه غذای سالم و گیاهی به سبک ترخینه
                </h1>
                {paths.includes("menu") && (
                  <Button className="bg-main text-white">
                    سفارش آنلاین غذا
                  </Button>
                )}
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
