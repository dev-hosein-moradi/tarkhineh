import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/hooks/store"; 
import {
  updateFoodQuantity,
  removeFoodFromCart,
  addCustomLevel,
} from "@/hooks/use-cart"; 
import { Star, Trash } from "lucide-react";
import Image from "next/image";
import { IFood } from "@/types";

export default function CartFoodCard({ food }: { food: IFood }) {
  const dispatch = useDispatch();
  const quantity = useSelector((state: RootState) => {
    const item = state.cart.items.find((item) => item.id === food.id);
    return item ? item.quantity : 0;
  });

  const handleIncrease = () => {
    if (food.id && quantity !== undefined) {
      dispatch(addCustomLevel(1));
      dispatch(updateFoodQuantity({ id: food.id, quantity: quantity + 1 }));
    }
  };

  const handleDecrease = () => {
    if (food.id && quantity !== undefined) {
      dispatch(addCustomLevel(1));
      if (quantity === 1) {
        dispatch(removeFoodFromCart(food.id));
      } else if (quantity > 1) {
        dispatch(updateFoodQuantity({ id: food.id, quantity: quantity - 1 }));
      }
    }
  };

  return (
    <div className="flex flex-row-reverse items-center justify-between bg-gray-1 lg:bg-white lg:border-[1px] border-gray-4 lg:rounded-lg p-2 mb-3 mr-1 lg:min-w-[610px]">
      {/* for large view */}
      <Image
        alt={food.name}
        src={food.image}
        className="w-[169px] h-[150px] rounded hidden lg:inline-block"
        width={200}
        height={100}
        loading="lazy"
      />

      <div className="lg:flex flex-col justify-between w-full h-[160px] pr-4 py-2 hidden">
        {/* for large view */}
        <div className="hidden lg:flex flex-row-reverse items-center justify-between">
          <h6 className="font-semibold text-xl leading-5 text-gray-8">
            {food.name}
          </h6>
        </div>

        {/* for large view */}
        <div className="hidden lg:flex flex-row-reverse justify-between">
          <p className="font-normal text-sm text-gray-8">{food.compounds}</p>

          <span className="flex flex-row-reverse">
            <p className="line-through text-gray-5 text-base font-normal ml-1">
              {Number(food.mainPrice.replace(/,/g, "")).toLocaleString("fa-IR")}
            </p>
            <p className="text-xs font-normal text-error p-1 rounded-md bg-error-extra-light">
              %{food.percentOfDiscount?.toLocaleString("fa-IR")}
            </p>
          </span>
        </div>

        {/* for large view */}
        <div className="hidden lg:flex flex-row justify-between items-center">
          <span>
            <p dir="rtl" className="font-normal text-xl text-gray-8 w-[150px]">
              {Number(food.discountPrice.replace(/,/g, "")).toLocaleString(
                "fa-IR"
              )}{" "}
              تومان
            </p>
          </span>
          <div className="flex flex-row-reverse items-center bg-tint-1 text-Primary p-1 rounded">
            <span
              onClick={handleDecrease}
              className="font-bold text-2xl cursor-pointer"
            >
              -
            </span>
            <span className="mx-2 font-medium text-base">
              {quantity?.toLocaleString("fa-IR")}
            </span>
            <span
              onClick={handleIncrease}
              className="font-bold text-2xl cursor-pointer"
            >
              +
            </span>
          </div>
          <span>
            <Star className="h-4 w-4 text-warning" />
          </span>
        </div>
      </div>

      {/* for small view */}
      <div className="lg:hidden">
        <h6 className="font-normal text-sm leading-5 text-gray-8">
          {food.name}
        </h6>
        <p dir="rtl" className="font-normal text-sm text-gray-7">
          {Number(food.discountPrice.replace(/,/g, "")).toLocaleString("fa-IR")}{" "}
          تومان
        </p>
      </div>

      <div className="flex flex-row-reverse items-center bg-tint-1 text-Primary p-1 rounded lg:hidden">
        <span
          onClick={handleDecrease}
          className="font-bold text-2xl cursor-pointer"
        >
          -
        </span>
        <span className="mx-2 font-medium text-base">
          {quantity?.toLocaleString("fa-IR")}
        </span>
        <span
          onClick={handleIncrease}
          className="font-bold text-2xl cursor-pointer"
        >
          +
        </span>
      </div>
    </div>
  );
}
