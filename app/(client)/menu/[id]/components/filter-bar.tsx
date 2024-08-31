"use client";
import { ChangeEvent, useState } from "react";
import { Input } from "@/components/ui/input";

export default function FilterBar() {
  const [selectedFilter, setSelectedFilter] = useState("");

  const filters = [
    { id: "economic", label: "اقتصادی‌ترین" },
    { id: "bestSelling", label: "پرفروش‌ترین" },
    { id: "sandwiches", label: "ساندویچ‌ها" },
    { id: "pizzas", label: "پیتزاها" },
    { id: "nonIranian", label: "غذاهای غیر ایرانی" },
    { id: "iranian", label: "غذاهای ایرانی" },
  ];

  const handleFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedFilter(event.target.value);
    // onFilterChange(event.target.value);
  };
  return (
    <div className="flex flex-row-reverse flex-wrap items-center justify-between max-w-[1350px] mx-auto px-[5%] py-4">
      <div className="flex flex-row justify-end gap-1 flex-wrap">
        {filters.map((filter) => (
          <div key={filter.id}>
            <input
              className="peer sr-only"
              value={filter.id}
              checked={selectedFilter === filter.id}
              onChange={handleFilterChange}
              name="filter"
              id={filter.id}
              type="radio"
            />
            <div className="flex h-9 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-gray-300 bg-gray-50 p-1 transition-transform duration-150 hover:border-main active:scale-95 peer-checked:border-main peer-checked:shadow-md peer-checked:shadow-tint-3">
              <label
                className="flex cursor-pointer items-center justify-center text-sm uppercase text-gray-500 peer-checked:text-main"
                htmlFor={filter.id}
              >
                {filter.label}
              </label>
            </div>
          </div>
        ))}
      </div>
      <Input
        className="w-full my-2 lg:my-0 lg:w-[30%]"
        placeholder="جستجو"
        dir="rtl"
      />
    </div>
  );
}
