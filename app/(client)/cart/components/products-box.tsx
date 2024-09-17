import { IFood } from "@/types";
import React from "react";
import CartFoodCard from "./food-card";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/hooks/store";
import { removeFoodFromCart } from "@/hooks/use-cart";

interface ProductBoxProps {
  carts: IFood[];
}

const ProductBox: React.FC<ProductBoxProps> = ({ carts }) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleRemoveFromCart = (id: string) => {
    dispatch(removeFoodFromCart(id));
  };
  return (
    <section className="lg:border border-gray-4 lg:p-6 lg:rounded-lg lg:max-w-[80%]">
      <article dir="ltr" className="overflow-y-auto max-h-[400px]">
        {carts.map((food: IFood) => (
          <div key={food.id} className="relative">
            <CartFoodCard food={food} />
            <Button
              variant="destructive"
              size="icon"
              onClick={() => handleRemoveFromCart(food.id)}
              className="absolute top-1 left-1 p-2 bg-error-light"
            >
              <Trash className="w-4 h-4 text-error-extra-light " />
            </Button>
          </div>
        ))}
      </article>
    </section>
  );
};

export default ProductBox;
