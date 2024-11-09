import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/hooks/store";
import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { IFood } from "@/types";
import { Heart } from "lucide-react";
import Image from "next/image";
import { Fragment, useState } from "react";
import { toast } from "sonner";
import { addCustomLevel, addFoodToCart, CartToOrder } from "@/hooks/use-cart";

interface BranchFoodCardPageProps {
  params: { id: string };
  food: IFood;
}

const BranchFoodCard: React.FC<BranchFoodCardPageProps> = ({
  food,
  params,
}) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items); // Ensure the correct slice and state are used

  const handleSubmitFoodToCart = (food: CartToOrder) => {
    dispatch(addCustomLevel(1))
    dispatch(addFoodToCart(food));
  };

  const onClickCard = (food: IFood) => {
    setLoading(true);
    const newFood: CartToOrder = {
      ...food,
      branchId: params.id,
    };
    handleSubmitFoodToCart(newFood);
    toast.success("آیتم مورد نظر به سبد خرید اضافه شد");
    setLoading(false);
  };

  return (
    <div className="mx-auto w-[230px] min-w-[230px] h-[280px] min-h-[280px] rounded-md border-[1px] border-gray-4 bg-white p-2 shadow-lg hover:shadow-xl ease-in-out duration-300">
      <Image
        className="min-w-[213px] h-[130px] object-cover rounded-md"
        alt={food.name}
        src={food.image}
        width={213}
        height={130}
        loading="lazy"
      />

      <h4 className="font-normal text-base my-1 text-center">{food.name}</h4>

      <div className="flex flex-row justify-between items-center my-2">
        <span className="flex flex-row">
          {food.discountPrice !== "0" && (
            <Fragment>
              <p className="text-xs font-normal text-error w-[32px] h-[16px] rounded-lg bg-error-extra-light flex justify-center items-center">
                %{food.percentOfDiscount}
              </p>
              <p className="text-xs font-normal line-through text-gray-7 leading-4 ml-1">
                {food.mainPrice}
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
          {food.discountPrice ? (
            <p className="font-normal text-sm text-gray-8 leading-4">
              {food.discountPrice} تومان
            </p>
          ) : (
            <p className="font-normal text-xs">{food.mainPrice} تومان</p>
          )}
        </span>
        <span className="flex flex-row items-center justify-center">
          <p className="hidden sm:flex font-normal text-xs text-gray-5 mr-1">
            (امتیاز {food.numOfScore})
          </p>
          <p className="font-normal text-sm">{food.rate}</p>
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
};

export default BranchFoodCard;
