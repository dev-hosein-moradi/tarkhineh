"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import StoreSwitcher from "@/components/store-switcher";
import { useBranchStore } from "@/hooks/use-branch";
import { useCategoryStore } from "@/hooks/use-category";
import { MenuBarSkeleton } from "@/components/skeleton";

interface MenuBarProps {
  params: { id: string };
  onSearchChange: (query: string) => void;
}

export default function MenuBar({ params, onSearchChange }: MenuBarProps) {
  const { categories, fetchCategories } = useCategoryStore();
  const [currentMenu, setCurrentMenu] = useState("");
  const { branches, fetchBranches } = useBranchStore();

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    setCurrentMenu(params.id);
  }, [params]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
  };

  if (categories?.length === 0) {
    return <MenuBarSkeleton />;
  }

  if (branches?.length === 0) {
    return <></>;
  }

  return (
    <div className="flex flex-row-reverse flex-wrap items-center justify-between max-w-[1350px] mx-auto px-[5%]">
      <ul className="flex flex-row-reverse gap-1 items-center justify-start h-12 mb-4 lg:mb-0">
        {categories?.map((category) => (
          <li
            key={category?.id}
            className={`w-20 py-3 h-full text-center leading-5 border-b-[1px] cursor-pointer hover:text-base ease-in-out duration-75 ${
              currentMenu === category?.id
                ? "text-base border-main font-medium text-main"
                : "text-gray-7 font-normal text-sm border-gray-3"
            }`}
            onClick={() => setCurrentMenu(category?.id)}
          >
            {category?.name}
          </li>
        ))}
      </ul>
      <Input
        className="w-[40%] my-2 lg:my-0 lg:w-[30%]"
        placeholder="جستجو"
        dir="rtl"
        onChange={handleSearchChange}
      />
      <StoreSwitcher items={branches} />
    </div>
  );
}
