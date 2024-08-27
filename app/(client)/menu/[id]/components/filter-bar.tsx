"use client";
import { ChangeEvent, useState } from "react";

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
    <div className="flex flex-col items-start">
      {filters.map((filter) => (
        <label key={filter.id} className="mb-2">
          <input
            type="radio"
            name="foodFilter"
            value={filter.id}
            checked={selectedFilter === filter.id}
            onChange={handleFilterChange}
            className="mr-2"
          />
          {filter.label}
        </label>
      ))}
    </div>
  );
}
