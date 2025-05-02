"use client";

import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { IFood } from "@/types";
import { Heart, Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux"; // Use Redux hooks
import { addCustomLevel, addFoodToCart, CartToOrder } from "@/hooks/use-cart"; // Import the action from Redux
import { RootState } from "@/hooks/store";
import { useParams } from "next/navigation";

interface FoodCardProps {
  food: IFood;
}

const FoodCard: React.FC<FoodCardProps> = ({ food }) => {
  const { selectedBranch } = useSelector((state: RootState) => state.cart);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const params = useParams();
  const branchId = params?.id as string;

  const handleSubmitFoodToCart = (food: CartToOrder) => {
    dispatch(addCustomLevel(1));
    dispatch(addFoodToCart(food));
  };

  const onClickCard = (food: IFood) => {
    setLoading(true);
  
    const loadingToastId = toast.loading("در حال پردازش");
  
    // Create a new food item to add to the cart
    const newFood: CartToOrder = {
      ...food,
      branchId: selectedBranch,
    };
  
    // Dispatch actions synchronously
    handleSubmitFoodToCart(newFood);
  
    // Simulate async behavior to dismiss the loading toast after a delay
    setTimeout(() => {
      toast.dismiss(loadingToastId); // Dismiss the loading toast
      toast.success("آیتم مورد نظر به سبد خرید اضافه شد");
      setLoading(false);
    }, 500); // Adjust the delay as needed
  };
  

  return (
    <div className="w-[360px] lg:w-[400px] min-w-[320px] lg:min-w-[400px] h-[120px] lg:h-[170px] min-h-[120px] lg:min-h-[170px] rounded-md border-[1px] border-gray-4 bg-white p-2 shadow-card-shadow hover:shadow-content-card-shadow ease-in-out duration-300 flex flex-row-reverse justify-self-center">
      <Image
        className="min-w-[100px] lg:min-w-[140px] h-[102px] lg:h-[152px] object-cover rounded-md"
        alt={food?.name}
        src={food?.image}
        loading="lazy"
        width={200}
        height={100}
      />

      <div className="flex flex-col justify-between items-center w-full pr-2">
        <span className="flex flex-row-reverse items-center justify-between w-full">
          <h4 className="font-normal lg:font-semibold lg:text-xl text-sm text-center text-gray-8 leading-5 lg:leading-9">
            {food?.name}
          </h4>

          {food?.discountPrice !== null && (
            <div className="flex flex-row">
              <p className="text-xs font-normal text-error w-[32px] h-[19px] rounded-lg bg-error-extra-light flex justify-center items-center leading-4">
                %{food?.percentOfDiscount}
              </p>
              <p className="text-xs lg:text-sm  font-normal line-through text-gray-7 leading-4 ml-1">
                {food?.mainPrice}
              </p>
            </div>
          )}
        </span>

        <div className="flex justify-between w-full">
          <span>
            {food?.discountPrice === null ? (
              <p className="font-normal text-xs text-gray-8">
                {food?.mainPrice} تومان{" "}
              </p>
            ) : (
              <p dir="rtl" className="font-normal text-xs text-gray-8 rtl-grid">
                {food?.discountPrice} تومان
              </p>
            )}
          </span>

          <p
            className="rtl-grid font-normal text-xs lg:text-sm text-gray-8"
            dir="rtl"
          >
            {food?.compounds?.substring(0, 23) + "..."}
          </p>
        </div>

        <div className="w-full flex flex-row-reverse justify-between items-center">
          <span className="flex flex-row cursor-pointer">
            <Heart className="w-5 h-5" />
          </span>

          <div className="flex flex-row justify-between items-center">
            <span className="flex flex-row items-center justify-center">
              <Star className="h-4 w-4 text-yellow-400" />
            </span>
          </div>

          <Button
            onClick={() => {
              onClickCard(food);
            }}
            disabled={loading}
            className="bg-main hover:bg-main shadow-md hover:shadow-xl text-white w-[110px] h-[32px] rounded-md text-xs font-normal"
          >
            {loading ? <Spinner /> : " افزودن به سبد خرید"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
