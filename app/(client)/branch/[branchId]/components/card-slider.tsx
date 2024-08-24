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
import { NotebookText } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  if (foods?.length === 0) {
    return <BranchFoodCardWrapperSkeleton />;
  }

  return (
    <div>
      <Suspense fallback={<BranchFoodCardWrapperSkeleton />}>
        {foods &&
          Object.keys(foodsByType).map((type, index) => (
            <MemoizedCardSlider
              key={type}
              type={type}
              foods={foodsByType[type]}
              index={index}
            />
          ))}
      </Suspense>
      <Button className="w-48 h-12 px-2 my-8 md:my-10 flex flex-row items-center justify-around mx-auto border-main border rounded shadow-sm hover:shadow-lg bg-white hover:bg-white text-main duration-150">
        <span className="text-Primary font-normal text-base">
          مشاهده منوی کامل
        </span>
        <NotebookText className="w-5 h-5 text-main" />
      </Button>
    </div>
  );
}

const typeLabels: { [key: string]: string } = {
  irani: "پیشنهاد ویژه",
  pizza: "غذاهای محبوب",
  other: "غذاهای غیر ایرانی",
};

const CardSlider = ({
  type,
  foods,
  index,
}: {
  type: string;
  foods: IFood[];
  index: number;
}) => {
  const label = typeLabels[type] || "سایر غذاها";
  return (
    <div
      className={`${
        index % 2 == 0 ? "bg-white" : "bg-main"
      } w-[70%] sm:w-[80%] mx-auto py-12 px-4`}
    >
      <h2
        className={`${
          index % 2 == 0 ? "text-black" : "text-white"
        } text-lg lg:text-2xl text-right font-semibold mb-4`}
      >
        {label}
      </h2>
      <Carousel>
        <CarouselContent className="h-[320px]">
          {foods.map((food) => (
            <CarouselItem
              key={food.id}
              className="md:basis-1/3 lg:basis-1/4 pl-0"
            >
              <BranchFoodCard food={food} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext />
        <CarouselPrevious />
      </Carousel>
    </div>
  );
};

const MemoizedCardSlider = React.memo(CardSlider);
