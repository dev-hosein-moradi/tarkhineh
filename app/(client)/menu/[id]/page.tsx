"use client";
import React, { useState, useEffect, useMemo } from "react";
import FilterBar from "./components/filter-bar";
import MenuBar from "./components/menu-bar";
import MenuFoodByType from "./components/menu-foods";
import { useFoods } from "@/hooks/useFoods";
import { IFood } from "@/types";
import { MenuFoodCardsSkeleton } from "@/components/skeleton";

interface MenuPageProps {
  params: { id: string };
}

const MenuPage: React.FC<MenuPageProps> = ({ params }) => {
  const { foods, error } = useFoods();
  const [filteredFoods, setFilteredFoods] = useState<IFood[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    setFilteredFoods(foods || []);
  }, [foods]);

  const handleFilterChange = (selectedFilter: string | null) => {
    if (!selectedFilter) {
      setFilteredFoods(foods || []);
    } else {
      const newFilteredFoods = foods?.filter(
        (food) => food.type === selectedFilter
      );
      setFilteredFoods(newFilteredFoods || []);
    }
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (!query) {
      setFilteredFoods(foods || []);
    } else {
      const newFilteredFoods = foods?.filter((food) =>
        food.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredFoods(newFilteredFoods || []);
    }
  };

  const filteredFoodsByType = useMemo(() => {
    return filteredFoods.reduce((acc: Record<string, IFood[]>, food) => {
      acc[food.type] = acc[food.type] || [];
      acc[food.type].push(food);
      return acc;
    }, {});
  }, [filteredFoods]);

  if(!foods) return <MenuFoodCardsSkeleton />

  return (
    <div>
      <MenuBar params={params} onSearchChange={handleSearchChange} />
      <FilterBar onFilterChange={handleFilterChange} />
      <MenuFoodByType
        foodsByType={filteredFoodsByType}
        error={error}
        params={params}
      />
    </div>
  );
};

export default MenuPage;
