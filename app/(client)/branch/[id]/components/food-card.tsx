"use client";

import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/hooks/use-cart";
import { IFood } from "@/types";
import { Heart } from "lucide-react";
import Image from "next/image";
import { Fragment, useState } from "react";
import { toast } from "sonner";

export default function BranchFoodCard({ food }: { food: IFood }) {
  const [loading, setLoading] = useState(false);

  const { addFoodToCart } = useCartStore();

  const handleSubmitFoodToCart = (food: IFood) => {
    addFoodToCart(food);
  };

  const onClickCard = (food: IFood) => {
    setLoading(true);
    toast.success("آیتم مورد نظر به سبد خرید اضافه شد");
    handleSubmitFoodToCart(food);
    setLoading(false);
  };

  return (
    <div className="mx-auto w-[230px] min-w-[230px] h-[280px] min-h-[280px] rounded-md border-[1px] border-gray-4 bg-white p-2 shadow-lg hover:shadow-xl ease-in-out duration-300">
      <Image
        className="min-w-[213px] h-[130px] object-cover rounded-md"
        alt={food?.name}
        src={food?.image}
        width={100}
        height={100}
        loading="lazy"
      />

      <h4 className="font-normal text-base my-1 text-center">{food?.name}</h4>

      <div className="flex flex-row justify-between items-center my-2">
        <span className="flex flex-row">
          {food?.discountPrice !== "0" && (
            <Fragment>
              <p className="text-xs font-normal text-error w-[32px] h-[16px] rounded-lg bg-error-extra-light flex justify-center items-center">
                %{food?.percentOfDiscount}
              </p>
              <p className="text-xs font-normal line-through text-gray-7 leading-4 ml-1">
                {food?.mainPrice}
              </p>
            </Fragment>
          )}
        </span>
        <span className="flex flex-row cursor-pointer">
          <Heart className="w-5 h-5" />
        </span>
      </div>

      <div className="flex flex-row justify-between items-center">
        <span>
          {food?.discountPrice === null ? (
            <p className="font-normal text-xs">{food?.mainPrice} تومان </p>
          ) : (
            <p className="font-normal text-sm text-gray-8 leading-4">
              {food?.discountPrice} تومان
            </p>
          )}
        </span>
        <span className="flex flex-row items-center justify-center">
          <p className="hidden sm:flex font-normal text-xs text-gray-5 mr-1">
            (امتیاز {food?.numOfScore})
          </p>
          <p className="font-normal text-sm">{food?.rate}</p>
        </span>
      </div>
      <Button
        onClick={() => onClickCard(food)}
        disabled={loading}
        className="bg-main hover:bg-main text-white w-[213px] h-[32px] rounded-md mt-4 text-sm font-normal flex items-center justify-center"
      >
        {loading ? <Spinner /> : " افزودن به سبد خرید"}
      </Button>
    </div>
  );
}
