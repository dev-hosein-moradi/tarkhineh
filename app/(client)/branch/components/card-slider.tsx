"use client";

import React, { Suspense, useMemo } from "react";
import { BranchFoodCardWrapperSkeleton } from "@/components/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { IFood } from "@/types";
import BranchFoodCard from "./food-card";
import { useFoods } from "@/hooks/useFoods";

export default function FoodSlidersByType() {
  const { foods, error } = useFoods();

  // Memoize the grouped foods by type
  const foodsByType = useMemo(() => {
    return foods?.reduce((acc: Record<string, IFood[]>, food) => {
      acc[food.type] = acc[food.type] || [];
      acc[food.type].push(food);
      return acc;
    }, {});
  }, [foods]);

  if (error) {
    return <div>Error loading foods: {error.message}</div>;
  }

  if (foods.length === 0) {
    return <BranchFoodCardWrapperSkeleton />;
  }

  return (
    <div>
      <Suspense fallback={<BranchFoodCardWrapperSkeleton />}>
        {foods &&
          Object.keys(foodsByType).map((type) => (
            <MemoizedCardSlider
              key={type}
              type={type}
              foods={foodsByType[type]}
            />
          ))}
      </Suspense>
    </div>
  );
}

const CardSlider = ({ type, foods }: { type: string; foods: IFood[] }) => {
  return (
    <div className="mb-8 w-[70%] sm:w-[80%] mx-auto">
      <h2 className="text-lg font-semibold mb-4">{type}</h2>
      <Carousel>
        <CarouselContent>
          <div className="w-[100%] mx-auto h-[380px] py-5 relative flex flex-row justify-end gap-4">
            {foods.map((food) => (
              <CarouselItem key={food.id} className="basis-[230px] pl-0">
                <BranchFoodCard food={food} />
              </CarouselItem>
            ))}
          </div>
        </CarouselContent>
        <CarouselNext />
        <CarouselPrevious />
      </Carousel>
    </div>
  );
};

const MemoizedCardSlider = React.memo(CardSlider);
