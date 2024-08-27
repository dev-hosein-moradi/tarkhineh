"use client";
import { MenuBarSkeleton } from "@/components/skeleton";
import { useCategoryStore } from "@/hooks/use-category";
import { useEffect, useState } from "react";

export default function MenuBar() {
  const { categories, fetchCategories } = useCategoryStore();
  const [currentMenu, setCurrentMenu] = useState("");

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  if (categories?.length == 0) {
    return <MenuBarSkeleton />;
  }
  return (
    <div>
      <ul className="flex flex-row-reverse items-center justify-start px-3 h-12 bg-gray-3 md:px-[4%]">
        {categories?.map((category) => (
          <li
            key={category?.id}
            className={`w-20 py-3 h-full text-center leading-5 border-b-[1px] cursor-pointer hover:text-base ease-in-out duration-75 ${
              currentMenu === category?.id
                ? "text-base border-Primary font-medium text-Primary"
                : "text-gray-7 font-normal text-sm border-gray-3"
            }`}
            onClick={() => setCurrentMenu(category?.id)}
          >
            {category?.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
