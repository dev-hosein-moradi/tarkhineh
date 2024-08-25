"use client";

import { BranchReviewSkeleton } from "@/components/skeleton";
import { fakeBlurDataURL } from "@/lib/blurDataImage";
import { getBranch } from "@/services/branch-service";
import { IBranch } from "@/types";
import { Clock, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function BranchReview({
  params,
}: {
  params: { id: string };
}) {
  const [branch, setBranch] = useState<IBranch | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchBranch = async () => {
      try {
        const branch: IBranch = await getBranch(params.id);
        if (isMounted) {
          setBranch(branch);
        }
      } catch (error) {
        console.error("Failed to fetch branch:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (params.id) {
      fetchBranch();
    }

    return () => {
      isMounted = false;
    };
  }, [params.id]);

  function formatPhoneNumber(phoneNumber: string) {
    return phoneNumber.match(/.{1,8}/g)?.join("-") ?? phoneNumber;
  }

  if (loading) {
    return <BranchReviewSkeleton />;
  }

  if (!branch) {
    return <BranchReviewSkeleton />;
  }

  return (
    <div className="py-16">
      <h2 className="w-full text-center text-2xl md:text-3xl lg:text-4xl font-semibold py-4">
        {branch?.name}
      </h2>
      <div className="relative h-[300px] sm:h-[400px]">
        <Image
          alt="branch banner image"
          src={branch.image}
          width={928}
          height={100}
          quality={100}
          loading="lazy"
          placeholder="blur"
          blurDataURL={fakeBlurDataURL} 
          className="brightness-50 w-full h-full object-cover"
        />
        <div className="bg-white w-full sm:w-[80%] md:w-[70%] absolute translate-x-[-50%] left-[50%] -bottom-5 mx-auto h-20 sm:h-24 rounded border-main border flex flex-col sm:flex-row sm:items-center justify-around px-2 pb-2">
          <article className="flex flex-row-reverse sm:flex-col flex-1 text-center w-full items-center justify-start">
            <MapPin className="w-5 h-5 text-main mx-2" />
            <address className="font-normal text-sm lg:text-base">
              {branch.address}
            </address>
          </article>
          <div className="flex flex-2 flex-row items-center justify-between sm:w-[60%]">
            <article className="flex flex-row-reverse sm:flex-col items-center flex-1">
              <Clock className="w-5 h-5 text-main mx-2" />
              <p className="font-normal text-xs lg:text-base">
                {branch.workTime}
              </p>
            </article>
            <article className="flex flex-row-reverse sm:flex-col items-center justify-start flex-1">
              <Phone className="w-5 h-5 text-main mx-2" />
              <p className="font-normal text-xs lg:text-base">
                {branch.tel
                  .map((number) => formatPhoneNumber(number))
                  .join(" - ")}
              </p>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
}
