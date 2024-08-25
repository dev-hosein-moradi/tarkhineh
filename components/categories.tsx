"use client";

import { ICategory } from "@/types";
import CategoryCard from "./category-card";
import { useEffect } from "react";
import { useCategoryStore } from "@/hooks/use-category";
import { CategoryCardsSkeleton } from "./skeleton";

export default function Categories() {
  const { categories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  if (categories?.length == 0) {
    return <CategoryCardsSkeleton />;
  }
  return (
    <div className="flex flex-row-reverse justify-center gap-5 lg:gap-0 flex-wrap py-10 category_container min-h-[400px]">
      {categories?.map((cateory: ICategory) => (
        <CategoryCard key={cateory.id} data={cateory} classname="" />
      ))}
    </div>
  );
}
