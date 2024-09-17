import { RootState } from "@/hooks/store";
import {
  CheckCircle,
  ChevronRight,
  ShoppingCart,
  Trash,
  Wallet,
} from "lucide-react";
import { useSelector } from "react-redux";

export default function CartStatus() {
  const cartLevel = useSelector((state: RootState) => state.cart.level);
  return (
    <div
      className="h-auto flex flex-row items-center justify-around my-4"
      dir="rtl"
    >
      <div className="lg:hidden">
        <ChevronRight className="w-4 h-4 text-gray-700" />
      </div>

      <div
        className={`flex flex-row items-center justify-center lg:justify-around`}
      >
        <div className={`flex flex-row-reverse items-center justify-center `}>
          <hr
            className={`hidden lg:inline-block border-dashed border-[1.5px] w-[70px] mr-1 ${
              cartLevel >= 1 ? "border-main" : "border-gray-4"
            }`}
          />
          <p className={`mr-1 `}>سبد خرید</p>
          <ShoppingCart
            className={`w-5 h-5 ${
              cartLevel < 1 ? "text-gray-500" : "text-main"
            }`}
          />
        </div>

        <div className={`flex flex-row-reverse items-center justify-center`}>
          <hr
            className={`hidden lg:inline-block border-dashed border-[1.5px] w-[70px] ${
              cartLevel >= 2 ? "border-main" : "border-gray-4"
            }`}
          />
          <p className={`mr-1`}>تکمیل اطلاعات</p>
          <CheckCircle
            className={`w-5 h-5 ${
              cartLevel < 2 ? "text-gray-500" : "text-main"
            }`}
          />
          <hr
            className={`hidden lg:inline-block border-dashed border-[1.5px] w-[70px] mr-1 ${
              cartLevel >= 2 ? "border-main" : "border-gray-4"
            }`}
          />
        </div>

        <div className={`flex flex-row-reverse items-center justify-center `}>
          <p className={`mr-1 `}>پرداخت</p>
          <Wallet
            className={`w-5 h-5 ${
              cartLevel < 3 ? "text-gray-500" : "text-main"
            }`}
          />
          <hr
            className={`hidden lg:inline-block border-dashed border-[1.5px] w-[70px] mr-1 ${
              cartLevel >= 3 ? "border-main" : "border-gray-4"
            }`}
          />
        </div>
      </div>

      <div className="lg:hidden cursor-pointer">
        <Trash className="w-5 h-5 text-gray-700" />
      </div>
    </div>
  );
}
