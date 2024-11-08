"use client";
import { Fragment, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";

import { ChevronLeft, Info, Trash, User2, Wallet } from "lucide-react";
import { RootState, AppDispatch } from "@/hooks/store";
import { Button } from "@/components/ui/button";
import { addCustomLevel, clearCart, increaseLevel } from "@/hooks/use-cart";
import { useCategoryStore } from "@/hooks/use-category";

import CartStatus from "./cart-status";
import ProductBox from "./products-box";
import DeliverConfirm from "./deliver-confirm";
import EmptyBG from "@/public/image/empty-cart.svg";
import SelectPayment from "./select-payment";

import { onOpen } from "@/hooks/use-auth-modal";

export default function CartContent() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const carts = useSelector((state: RootState) => state.cart.items);
  const cartsLevel = useSelector((state: RootState) => state.cart.level);
  const { isOpen } = useSelector((state: RootState) => state.auth);
  const { isAuthenticated } = useSelector((state: RootState) => state.user);

  const { categories, fetchCategories } = useCategoryStore();
  const [discountAmount, setDiscountAmount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const calculateDiscount = useCallback(() => {
    const discount = carts.reduce(
      (acc, item) =>
        acc +
        item.quantity *
          (Number(item.mainPrice.replace(/,/g, "")) -
            Number(item.discountPrice.replace(/,/g, ""))),
      0
    );
    return discount;
  }, [carts]);

  const calculateTotalPrice = useCallback(() => {
    const total = carts.reduce(
      (acc, item) =>
        acc + item.quantity * Number(item.discountPrice.replace(/,/g, "")),
      0
    );
    return total;
  }, [carts]);

  useEffect(() => {
    setDiscountAmount(calculateDiscount());
    setTotalPrice(calculateTotalPrice());
  }, [carts, calculateDiscount, calculateTotalPrice]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleClearCart = () => {
    dispatch(clearCart());
    dispatch(addCustomLevel(0));
  };

  const handleCartProccess = () => {
    dispatch(increaseLevel());
  };

  const handleCompleteCart = () => {
    router.push(`/cart/success`);
  };

  if (categories?.length === 0) {
    return <></>;
  }

  return (
    <Fragment>
      {/* Cart Process Status */}
      <CartStatus />

      {/* Cart Items */}
      <section
        className={`min-h-[510px] max-w-[1350px] mx-auto px-[5%] py-5 flex flex-col items-center justify-center rounded-lg duration-200 relative ${
          !carts.length && " border border-gray-4"
        }`}
      >
        {!carts.length && (
          <Image
            src={EmptyBG}
            alt="empty background image"
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
            <Link
              className="z-[1] border flex items-center justify-center border-main w-[172px] h-[38px] rounded px-8 text-main font-medium text-sm mt-4 hover:bg-main bg-white hover:text-white duration-200 shadow-md"
              aria-label="منوی رستوران"
              href={`/menu/${categories[0]?.id}`}
            >
              منوی رستوران
            </Link>
          </Fragment>
        ) : (
          <section className="w-full border lg:border-none border-gray-4 h-fit rounded p-2 lg:p-0 lg:flex lg:flex-row-reverse justify-around">
            {/* Items List */}
            {cartsLevel == 1 ? (
              <ProductBox carts={carts} />
            ) : cartsLevel == 2 ? (
              <DeliverConfirm />
            ) : cartsLevel == 3 ? (
              <SelectPayment />
            ) : null}

            <hr className="mt-5 w-full border-gray-4 lg:hidden" />

            {/* Cart Summary */}
            <article className="w-full flex flex-col lg:border border-gray-4 lg:h-fit lg:p-6 lg:rounded-lg lg:max-w-[35%] mr-auto">
              <div className="lg:flex flex-row items-center justify-between py-2 hidden">
                <span onClick={handleClearCart} className="cursor-pointer">
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

              {isAuthenticated ? (
                cartsLevel === 3 ? (
                  <Button
                    onClick={handleCompleteCart}
                    className="group flex flex-row items-center justify-center w-full h-[35px] rounded bg-main hover:bg-white hover:text-main duration-300 hover:border-main border-2 text-white font-normal text-sm my-2"
                  >
                    <Wallet className="h-4 w-4 text-white group-hover:text-main duration-300" />
                    <span>تکمیل خرید</span>
                  </Button>
                ) : (
                  <Button
                    onClick={handleCartProccess}
                    className="group flex flex-row items-center justify-center w-full h-[35px] rounded bg-main hover:bg-white hover:text-main duration-300 hover:border-main border-2 text-white font-normal text-sm my-2"
                  >
                    <ChevronLeft className="h-4 w-4 text-white group-hover:text-main duration-300" />
                    <span>مرحله بعد</span>
                  </Button>
                )
              ) : (
                <Button
                  onClick={() => {
                    dispatch(onOpen());
                  }}
                  className="group flex flex-row items-center justify-center w-full h-[35px] rounded bg-main hover:bg-white hover:text-main duration-300 hover:border-main border-2 text-white font-normal text-sm my-2"
                >
                  <p>ورود / ثبت‌نام</p>
                  <User2 className="h-4 w-4 text-white group-hover:text-main duration-300" />
                </Button>
              )}
            </article>
          </section>
        )}
      </section>
    </Fragment>
  );
}
