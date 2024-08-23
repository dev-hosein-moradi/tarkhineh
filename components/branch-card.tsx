"use client";

import Image from "next/image";

import { IBranch } from "@/types";
import { cn } from "@/lib/utils";
import { ChevronLeft, Expand } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fakeBlurDataURL } from "@/lib/blurDataImage";

export function SmBrnach({
  className,
  data,
}: {
  className: string;
  data: IBranch;
}) {
  return (
    <div className={cn("flex flex-row-reverse my-2", className)}>
      <Image
        className="rounded-md object-cover w-[100px] h-[80px]"
        alt="branch"
        src={data?.image}
        width={100}
        height={100}
        quality={100}
        priority
      />

      <div className="px-2 text-gray-7 hover:text-Primary">
        <h3 className="text-lg font-medium">{data?.name}</h3>
        <p className="text-sm font-normal">{data?.address}</p>
      </div>
    </div>
  );
}

export function MdBrnach({
  className,
  data,
}: {
  className: string;
  data: IBranch;
}) {
  return (
    <div
      className={`agency-card w-[340px] h-[102px] border border-gray-4 hover:border-Primary rounded-md flex flex-row-reverse my-2 sm:mx-1 lg:flex-col lg:w-[230px] lg:h-[344px] hover:shadow-md transition-transform duration-500 hover:translate-y-1 group cursor-pointer ${className}`}
    >
      <Image
        className="w-[160px] h-[100px] object-cover rounded-r-md lg:w-[228px] lg:h-[230px] lg:rounded-t-md lg:group-hover:h-[190px] transition-all duration-500 bg-gray-100 group-hover:brightness-50"
        alt={data.name}
        src={data.image}
        width={228}
        height={230}
        quality={100}
        loading="lazy"
        placeholder="blur"
        blurDataURL={fakeBlurDataURL}
      />
      <span className="absolute bottom-2 lg:bottom-[130px] right-2 lg:group-hover:right-[105px] lg:group-hover:bottom-[240px] transition-all duration-500">
        <Expand className="w-5 h-5 text-white" />
      </span>
      <div className="text-center px-2 flex flex-col justify-center items-center">
        <h3 className="font-medium text-[15px] text-gray-8 leading-6 py-1 lg:py-2 lg:text-[20px] lg:font-semibold">
          {data.name}
        </h3>
        <p className="text-[13px] font-normal text-gray-8 lg:text-[14px] lg:font-medium">
          {data.address}
        </p>
      </div>
      <Button className="hidden lg:flex justify-center items-center w-[128px] h-[35px] bg-white text-shade-2 border border-shade-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 mx-auto mt-1 hover:bg-main hover:text-white">
        <ChevronLeft className="w-4 h-4" /> صفحه شعبه
      </Button>
    </div>
  );
}
