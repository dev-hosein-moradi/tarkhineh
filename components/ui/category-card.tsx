"use client";

import { ICategory } from "@/types";
import Image from "next/image";
import { Button } from "./button";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import ScrollTrigger from "gsap/dist/ScrollTrigger";

export default function CategoryCard({
  data,
  classname,
}: {
  data: ICategory;
  classname: string;
}) {
  const cardRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);

      gsap.fromTo(
        cardRef.current,
        {
          rotationX: gsap.utils.random(-180, 180),
          rotationY: gsap.utils.random(-180, 180),
          rotationZ: gsap.utils.random(-180, 180),
          scale: 0.5,
          autoAlpha: 0,
        },
        {
          rotationX: 0,
          rotationY: 0,
          rotationZ: 0,
          scale: 1,
          autoAlpha: 1,
          duration: 2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 80%", // Trigger when the top of the card hits 80% of the viewport height
            end: "bottom top", // End when the bottom of the card hits the top of the viewport
            toggleActions: "play none none none", // Play the animation when entering the viewport
          },
        }
      );
    }
  }, []);

  return (
    <div
      ref={cardRef}
      className={`category_card relative border-Primary border-[1px] rounded-[4px] h-[111px] lg:h-[160px] w-[162px] lg:w-[230px] mx-1 sm:mx-2 my-12 lg:my-20 hover:shadow-card-shadow ease-out duration-75`}
    >
      <Image
        className="object-cover absolute -top-14 lg:-top-24 w-[125px] lg:w-[208px] h-[122px] lg:h-[205px] mx-[11%] lg:mx-[5%] bg-gray-100 duration-200 mix-blend-multiply"
        alt="category image"
        src={data.image}
        width={100}
        height={100}
        quality={100}
      />
      <Button
        variant="default"
        className="absolute -bottom-4 mx-[20%] lg:mx-[16%] bg-Primary bg-main text-white w-[90px] lg:w-[155px] h-[32px] lg:h-[48px] rounded-[4px] font-normal text-[14px] lg:text-[20px]"
      >
        {data?.name}
      </Button>
    </div>
  );
}
