"use client";
import { Info, Trash, User2 } from "lucide-react";
import { Fragment, useEffect, useState, useCallback } from "react";
import CartStatus from "./cart-status";
import CartFoodCard from "./food-card";
import { CartFood } from "@/types";
import Image from "next/image";

import EmptyBG from "@/public/image/empty-cart.svg";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/hooks/use-cart";

export default function CartContent() {
  const { carts } = useCartStore();
  const [discountAmount, setDiscountAmount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  console.log(carts);

  const calculateDiscount = useCallback(() => {
    const discount = carts.reduce(
      (acc, item) =>
        acc +
        item.quantity * (Number(item.mainPrice) - Number(item.discountPrice)),
      0
    );
    return discount;
  }, [carts]);

  const calculateTotalPrice = useCallback(() => {
    const total = carts.reduce(
      (acc, item) => acc + item.quantity * Number(item.discountPrice),
      0
    );
    return total;
  }, [carts]);

  useEffect(() => {
    setDiscountAmount(calculateDiscount());
    setTotalPrice(calculateTotalPrice());
  }, [carts, calculateDiscount, calculateTotalPrice]);

  return (
    <Fragment>
      {/* Cart Process Status */}
      <CartStatus />

      {/* Cart Items */}
      <section
        className={`h-[510px] max-w-[1350px] mx-auto px-[5%] py-5 flex flex-col items-center justify-center rounded-lg duration-200 relative ${
          !carts.length && " border border-gray-4"
        }`}
      >
        {!carts.length && (
          <Image
            src={EmptyBG}
            alt="empty background iamge"
            className="absolute z-0"
          />
        )}

        {!carts.length ? (
          <Fragment>
            <p
              className="text-gray-7 font-medium text-base leading-6 z-[1]"
              dir="rtl"
            >
              شما در حال حاضر هیچ سفارشی ثبت نکرده‌اید!
            </p>
            <Button
              className="z-[1] border border-main w-[172px] h-[38px] rounded px-8 text-main font-medium text-sm mt-4 hover:bg-main bg-white hover:text-white duration-200 shadow-md"
              aria-label="منوی رستوران"
              role="button"
              variant="default"
              onClick={() => window.scrollTo(0, 0)}
            >
              منوی رستوران
            </Button>
          </Fragment>
        ) : (
          <section className="w-full border lg:border-none border-gray-4 h-fit rounded p-6 lg:p-0 lg:flex lg:flex-row-reverse justify-around">
            {/* Items List */}
            <section className="lg:border border-gray-4 lg:p-6 lg:rounded-lg lg:max-w-[80%]">
              <article dir="ltr" className="overflow-y-auto max-h-[400px]">
                {carts.map((food) => (
                  <CartFoodCard key={food.id} food={food} />
                ))}
              </article>
            </section>

            <hr className="mt-5 w-full border-gray-4 lg:hidden" />

            {/* Cart Summary */}
            <article className="w-full flex flex-col lg:border border-gray-4 lg:h-fit lg:p-6 lg:rounded-lg lg:max-w-[35%] mr-auto">
              <div className="lg:flex flex-row items-center justify-between py-2 hidden">
                <span className="cursor-pointer">
                  <Trash className="h-4 w-4 text-gray-700" />
                </span>
                <p className="font-normal text-sm text-gray-7" dir="rtl">
                  سبد خرید ({carts.length.toLocaleString("fa-IR")})
                </p>
              </div>

              <hr className="my-2 w-full border-gray-4 hidden lg:flex" />

              <div className="flex flex-row items-center justify-between py-2">
                <p className="font-normal text-sm text-gray-7" dir="rtl">
                  {discountAmount.toLocaleString("fa-IR")} تومان
                </p>
                <h3 className="font-normal text-sm text-gray-8">
                  تخفیف محصولات
                </h3>
              </div>

              <hr className="my-2 w-full border-gray-4" />

              <div className="w-full py-1">
                <span className="flex flex-row items-center justify-between">
                  <p className="font-normal text-sm text-gray-7" dir="rtl">
                    ۰ تومان
                  </p>
                  <h3 className="font-normal text-sm text-gray-8">
                    هزینه ارسال
                  </h3>
                </span>

                <span className="flex flex-row pt-2">
                  <p
                    className="text-right mr-1 text-warning font-normal text-xs"
                    dir="rtl"
                  >
                    هزینه ارسال در ادامه بر اساس آدرس، زمان و نحوه ارسال انتخابی
                    شما محاسبه و به این مبلغ اضافه خواهد شد.
                  </p>
                  <span>
                    <Info className="w-4 h-4 text-warning" />
                  </span>
                </span>
              </div>

              <hr className="my-2 w-full border-gray-4" />

              <div className="flex flex-row items-center justify-between py-1">
                <p className="font-normal text-sm text-Primary" dir="rtl">
                  {totalPrice.toLocaleString("fa-IR")} تومان
                </p>
                <h3 className="font-normal text-sm text-gray-8">
                  مبلغ قابل پرداخت
                </h3>
              </div>

              <Button className="flex flex-row items-center justify-center w-full h-[35px] rounded bg-main text-white font-normal text-sm my-2">
                <p>ورود / ثبت‌نام</p>
                <span className="ml-2">
                  <User2 className="h-4 w-4" />
                </span>
              </Button>
            </article>
          </section>
        )}
      </section>
    </Fragment>
  );
}
