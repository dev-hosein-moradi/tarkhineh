import React, { useState } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  CarFront,
  CreditCard,
  MapPin,
  NotebookPen,
  PercentCircle,
  PlusCircle,
  Wallet,
} from "lucide-react";
import { Input } from "@/components/ui/input";

import bank1 from "@/public/image/bank1.jpeg";
import bank2 from "@/public/image/bank2.jpeg";
import bank3 from "@/public/image/bank3.jpeg";

export default function SelectPayment() {
  const [isDelivery, setIsDelivery] = useState(0);
  return (
    <section className="w-full">
      <div className="w-[99%] lg:w-[95%] min-h-[130px] px-4 py-6 mx-auto border-[1px] border-gray-200 rounded-md flex flex-col lg:flex-row-reverse items-end lg:items-center justify-between">
        <div className="flex flex-row gap-2 items-center">
          <h2>ثبت کد تخفیف</h2>
          <PercentCircle className="w-5 h-5" />
        </div>
        <div className="flex  items-center justify-center flex-row-reverse gap-0 lg:gap-4">
          <Input
            className="h-[40px] w-[200px]"
            dir="rtl"
            placeholder="کد تخفیف"
          />
          <Button className="w-[95px] h-[40px] bg-gray-700 text-white hover:bg-gray-700 hover:text-white shadow-md hover:shadow-xl">
            ثبت کد
          </Button>
        </div>
      </div>
      <div className="w-[99%] lg:w-[95%] min-h-[130px] px-4 py-6 mx-auto mt-1 border-[1px] border-gray-200 rounded-md flex flex-col lg:flex-row-reverse items-end lg:items-center justify-between">
        <div className="flex flex-row items-center">
          روش پرداخت
          <Wallet className="h-6 w-6 text-gray-700 ml-1" />
        </div>
        <label htmlFor="deliver-one" className="text-sm lg:text-base">
          پرداخت اینترنتی
          <input
            className="ml-1 w-4 h-4"
            id="deliver-one"
            name="deliver-type"
            type="radio"
            value="0"
            onChange={(e) => setIsDelivery(Number(e.target.value))}
          />
        </label>
        <label htmlFor="deliver-two" className="text-sm lg:text-base">
          پرداخت در محل
          <input
            className="ml-1 w-4 h-4"
            id="deliver-two"
            name="deliver-type"
            type="radio"
            value="1"
            onChange={(e) => setIsDelivery(Number(e.target.value))}
          />
        </label>
      </div>

      <div className="w-[99%] lg:w-[95%] min-h-[130px] px-4 py-4 mx-auto border-[1px] border-gray-200 rounded-md flex flex-col mt-1 items-center justify-between">
        <div className="flex flex-row-reverse w-full justify-between">
          <h2 className="flex flex-row-reverse items-center">
            <CreditCard className="w-5 h-5 text-gray-800" />
            درگاه پرداخت
          </h2>
        </div>
        <Separator className="mt-2" />
        <div className="py-2">
          <figure className="flex flex-col items-center">
            <div className="flex flex-row gap-4">
              <Image
                alt="bank image"
                src={bank1}
                className="w-[80px] h-[80px] object-cover border-2 hover:border-main rounded duration-150 cursor-pointer"
              />
              <Image
                alt="bank image"
                src={bank2}
                className="w-[80px] h-[80px] object-cover border-2 hover:border-main rounded duration-150 cursor-pointer"
              />
              <Image
                alt="bank image"
                src={bank3}
                className="w-[80px] h-[80px] object-cover border-2 hover:border-main rounded duration-150 cursor-pointer"
              />
            </div>
            <figcaption className="text-center py-2">
              <p className="text-gray-700 text-xs md:text-sm">
                .پرداخت از طریق کلیه کارت‌های عضو شتاب امکان‌پذیر است
              </p>
              <p dir="rtl" className="text-gray-700 text-xs">
                (پرداخت از طریق کلیه کارت‌های عضو شتاب امکان‌پذیر است)
              </p>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
