"use client";

import { getCategories } from "@/services/category-service";
import { ICategory } from "@/types";
import { useEffect, useState } from "react";
import CategoryCard from "./ui/category-card";

export default function CategoryWrapper() {
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState<ICategory[]>([]);

  useEffect(() => {
    getCategories()
      .then((data) => {
        setCategories(data.data);
      })
      .catch((error) => setError(error));
  }, []);
  return (
    <div className="w-full max-w-[1024px] mx-auto py-5 flex flex-col items-center">
      <h2 className="font-bold ml-auto text-gray-8 text-2xl sm:text-[26px] md:my-10 md:text-[30px] mt-8">
        منوی رستوران
      </h2>
      <div className="flex flex-row-reverse justify-center gap-5 lg:gap-0 flex-wrap py-10 category_container min-h-[400px]">
        {categories?.map((cateory, index) => (
          <CategoryCard key={cateory.id} data={cateory} classname="" />
        ))}
      </div>
    </div>
  );
}
