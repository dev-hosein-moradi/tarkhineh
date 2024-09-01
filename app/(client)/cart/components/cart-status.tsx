import {
  CheckCircle,
  ChevronRight,
  ShoppingCart,
  Trash,
  Wallet,
} from "lucide-react";

export default function CartStatus() {
  return (
    <div
      className="h-auto flex flex-row items-center justify-around my-4"
      dir="rtl"
    >
      <div className="lg:hidden">
        <ChevronRight className="w-4 h-4 text-gray-700" />
      </div>

      <div
        className={`flex flex-row items-center justify-center lg:justify-around mx-5 lg:mx-0 `}
      >
        <div className={`flex flex-row-reverse items-center justify-center `}>
          <p className={`mr-1 `}>سبد خرید</p>
          <ShoppingCart className="w-5 h-5 text-main" />
        </div>

        <hr className="hidden lg:inline-block border-dashed w-[150px]  border-gray-4 mx-2" />

        <div
          className={`flex flex-row-reverse items-center justify-center mx-5 lg:mx-0 `}
        >
          <p className={`mr-1`}>تکمیل اطلاعات</p>
          <CheckCircle className="w-5 h-5 text-main" />
        </div>

        <hr className="hidden lg:inline-block border-dashed w-[150px] border-gray-4 mx-2" />

        <div
          className={`flex flex-row-reverse items-center justify-center mx-5 lg:mx-0 `}
        >
          <p className={`mr-1 `}>پرداخت</p>
          <Wallet className="w-5 h-5 text-main" />
        </div>
      </div>

      <div className="lg:hidden cursor-pointer">
        <Trash className="w-5 h-5 text-gray-700" />
      </div>
    </div>
  );
}
