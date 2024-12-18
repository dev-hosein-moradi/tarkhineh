import { Button } from "@/components/ui/button";
import { RootState } from "@/hooks/store";
import { decreaseLevel } from "@/hooks/use-cart";
import {
  CheckCircle,
  ChevronRight,
  ShoppingCart,
  Trash,
  Wallet,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

export default function CartStatus() {
  const dispatch = useDispatch();
  const cartLevel = useSelector((state: RootState) => state.cart.level);
  const handleCartProccess = () => {
    dispatch(decreaseLevel());
  };
  return (
    <div
      className="h-auto w-[90%] mx-auto flex flex-col gap-4 sm:gap-0 sm:flex-row items-center justify-around my-4"
      dir="rtl"
    >
      <Button
        onClick={handleCartProccess}
        variant="outline"
        size="icon"
        className="min-w-8 ml-auto sm:ml-2 bg-white text-gray-700"
      >
        <ChevronRight className="w-5 h-5 text-gray-700" />
      </Button>

      <div
        className={`w-[100%] sm:w-[90%] mr-auto flex flex-row items-center justify-around flex-1 lg:flex-none lg:justify-around`}
      >
        <div
          className={`flex flex-row-reverse items-center justify-center gap-2 flex-1`}
        >
          <hr
            className={`inline-block border-dashed border-[1.5px] w-[90%] mr-1 ${
              cartLevel >= 1 ? "border-main" : "border-gray-4"
            }`}
          />
          <p className={`mr-1 hidden md:flex min-w-max`}>سبد خرید</p>
          <ShoppingCart
            className={`min-w-5 min-h-5 ${
              cartLevel < 1 ? "text-gray-500" : "text-main"
            }`}
          />
        </div>

        <div
          className={`flex flex-row-reverse items-center justify-center gap-2 flex-1`}
        >
          <hr
            className={`inline-block border-dashed border-[1.5px] w-[90%] ${
              cartLevel >= 2 ? "border-main" : "border-gray-4"
            }`}
          />
          <p className={`mr-1 hidden md:flex min-w-max`}>تکمیل اطلاعات</p>
          <CheckCircle
            className={`min-w-5 min-h-5 ${
              cartLevel < 2 ? "text-gray-500" : "text-main"
            }`}
          />
          <hr
            className={`inline-block border-dashed border-[1.5px] w-[90%] mr-1 ${
              cartLevel >= 2 ? "border-main" : "border-gray-4"
            }`}
          />
        </div>

        <div
          className={`flex flex-row-reverse items-center justify-center gap-2 flex-1`}
        >
          <p className={`mr-1 hidden md:flex min-w-max`}>پرداخت</p>
          <Wallet
            className={`min-w-5 min-h-5 ${
              cartLevel < 3 ? "text-gray-500" : "text-main"
            }`}
          />
          <hr
            className={`inline-block border-dashed border-[1.5px] w-[90%] mr-1 ${
              cartLevel >= 3 ? "border-main" : "border-gray-4"
            }`}
          />
        </div>
      </div>
    </div>
  );
}
