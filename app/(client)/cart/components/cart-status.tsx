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
      className="h-auto w-[90%] mx-auto flex flex-row items-center justify-around my-4"
      dir="rtl"
    >
      <Button
        onClick={handleCartProccess}
        variant="outline"
        size="icon"
        className="lg:hidden bg-white text-gray-700"
      >
        <ChevronRight className="w-4 h-4 text-gray-700" />
      </Button>

      <div
        className={`flex flex-row items-center justify-center flex-1 lg:flex-none lg:justify-around`}
      >
        <div className={`flex flex-row-reverse items-center justify-center `}>
          <hr
            className={`inline-block border-dashed border-[1.5px] w-[30px] lg:w-[70px] mr-1 ${
              cartLevel >= 1 ? "border-main" : "border-gray-4"
            }`}
          />
          <p className={`mr-1 hidden md:flex`}>سبد خرید</p>
          <ShoppingCart
            className={`w-5 h-5 ${
              cartLevel < 1 ? "text-gray-500" : "text-main"
            }`}
          />
        </div>

        <div className={`flex flex-row-reverse items-center justify-center`}>
          <hr
            className={`inline-block border-dashed border-[1.5px] w-[30px] lg:w-[70px] ${
              cartLevel >= 2 ? "border-main" : "border-gray-4"
            }`}
          />
          <p className={`mr-1 hidden md:flex`}>تکمیل اطلاعات</p>
          <CheckCircle
            className={`w-5 h-5 ${
              cartLevel < 2 ? "text-gray-500" : "text-main"
            }`}
          />
          <hr
            className={`inline-block border-dashed border-[1.5px] w-[30px] lg:w-[70px] mr-1 ${
              cartLevel >= 2 ? "border-main" : "border-gray-4"
            }`}
          />
        </div>

        <div className={`flex flex-row-reverse items-center justify-center `}>
          <p className={`mr-1 hidden md:flex`}>پرداخت</p>
          <Wallet
            className={`w-5 h-5 ${
              cartLevel < 3 ? "text-gray-500" : "text-main"
            }`}
          />
          <hr
            className={`inline-block border-dashed border-[1.5px] w-[30px] lg:w-[70px] mr-1 ${
              cartLevel >= 3 ? "border-main" : "border-gray-4"
            }`}
          />
        </div>
      </div>
    </div>
  );
}
