"use client";

import { Fragment } from "react";
import Image from "next/image";
import Celebration from "@/public/image/Selebration.png";
import CheckSqure from "@/public/image/check-squre.png";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface SuccessPageProps {
  params: { code: string };
}

export default function PageSuccess({ params }: SuccessPageProps) {
  const router = useRouter();

  return (
    <Fragment>
      <section className="relative h-[500px] z-0">
        <Image
          alt="success background"
          src={Celebration}
          className="w-full h-full object-cover absolute left-0 top-0 -z-10"
        />
        <div className="w-full h-full flex flex-col items-center justify-center gap-4 z-10">
          <Image alt="check image" src={CheckSqure} className="" />
          <h1 className="text-main text-3xl lg:text-4xl font-bold text-center px-4">
            پرداخت شما با موفقیت انجام شد
          </h1>
          <p className="text-main text-xl font-normal" dir="rtl">
            کد رهگیری سفارش شما: {params?.code}
          </p>
          <div className="flex flex-row items-center gap-2">
            <Button className="bg-main hover:bg-main text-white hover:text-white shadow-md hover:shadow-xl duration-150 w-[180px]">
              پیگیری سفارش
            </Button>
            <Button
              onClick={() => router.push("/")}
              className="bg-white text-main hover:bg-white hover:text-main shadow-none border-2 border-main hover:shadow-2xl"
            >
              بازگشت به صفحه اصلی
            </Button>
          </div>
        </div>
      </section>
    </Fragment>
  );
}
