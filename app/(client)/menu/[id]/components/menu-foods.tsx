import React, { Suspense } from "react";
import { ShoppingCartIcon } from "lucide-react";
import { BranchFoodCardWrapperSkeleton } from "@/components/skeleton";
import { IFood } from "@/types";
import { Button } from "@/components/ui/button";
import FoodCard from "./food-card";
import { useRouter } from "next/navigation";

interface MenuFoodByTypeProps {
  foodsByType: Record<string, IFood[]>;
  error: Error | null;
  params: { id: string };
}

export default function MenuFoodByType({
  foodsByType,
  error,
  params,
}: MenuFoodByTypeProps) {
  if (!foodsByType) {
    return <></>;
  }

  if (error) {
    return <div>Error loading foods: {error.message}</div>;
  }

  return (
    <div>
      <Suspense fallback={<BranchFoodCardWrapperSkeleton />}>
        {foodsByType &&
          Object.keys(foodsByType).map((type, index) => (
            <MemoizedCardSlider
              key={type}
              type={type}
              foods={foodsByType[type]}
              index={index}
              params={params}
            />
          ))}
      </Suspense>
    </div>
  );
}

const typeLabels: { [key: string]: string } = {
  irani: "پیشنهاد ویژه",
  pizza: "غذاهای محبوب",
  other: "غذاهای غیر ایرانی",
};

const MenuFoodCard = ({
  type,
  foods,
  index,
  params,
}: {
  type: string;
  foods: IFood[];
  index: number;
  params: { id: string };
}) => {
  const router = useRouter();
  const label = typeLabels[type] || "سایر غذاها";

  if (!foods) return <></>;
  return (
    <div className={`bg-white w-full max-w-[1350px] mx-auto px-[5%] py-12`}>
      <h2
        className={` text-black text-lg ml-auto lg:text-2xl text-right font-semibold mb-4 flex flex-row-reverse justify-between`}
      >
        {index == 0 && (
          <Button
            onClick={() => (window.location.href = "/cart")}
            variant="outline"
            className="text-main bg-white mr-auto border-main"
          >
            <ShoppingCartIcon className="w-4 h-4 text-main mr-2" />
            سبد خرید
          </Button>
        )}
        {label}
      </h2>
      <div className="flex flex-wrap flex-row justify-end gap-1">
        {foods.map((food) => (
          <FoodCard key={food.id} food={food} params={params} />
        ))}
      </div>
    </div>
  );
};

const MemoizedCardSlider = React.memo(MenuFoodCard);
