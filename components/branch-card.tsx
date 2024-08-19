"use client";

import Image from "next/image";

import { IBranch } from "@/types";
import { cn } from "@/lib/utils";

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

export function MdBrnach() {
  return <div></div>;
}

export function LgBrnach() {
  return <div></div>;
}
