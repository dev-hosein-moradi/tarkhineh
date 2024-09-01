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
}

export default function MenuFoodByType({ foodsByType, error }: MenuFoodByTypeProps) {
  const router = useRouter();

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
}: {
  type: string;
  foods: IFood[];
  index: number;
}) => {
  const router = useRouter();
  const label = typeLabels[type] || "سایر غذاها";
  return (
    <div className={`bg-white w-full max-w-[1350px] mx-auto px-[5%] py-12`}>
      <h2
        className={` text-black text-lg ml-auto lg:text-2xl text-right font-semibold mb-4 flex justify-between`}
      >
        {index == 0 && (
          <Button
            onClick={() => router.push(`/cart`)}
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
          <FoodCard key={food.id} food={food} />
        ))}
      </div>
    </div>
  );
};

const MemoizedCardSlider = React.memo(MenuFoodCard);
