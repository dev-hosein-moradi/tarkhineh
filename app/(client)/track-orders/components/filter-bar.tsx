"use client";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import React, { ChangeEvent, useState } from "react";

interface FilterBarProps {
  onFilterChange: (selectedFilter: string) => void;
}

export default function FilterBar({ onFilterChange }: FilterBarProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>("");

  const filters = [
    { code: "0", label: "همه" },
    { code: "1", label: "جاری" },
    { code: "3", label: "تحویل شده" },
    { code: "5", label: "لغو شده" },
  ];

  const handleFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    const newFilter = selectedFilter === newValue ? "" : newValue;
    setSelectedFilter(newFilter);
    onFilterChange(newFilter);
  };

  return (
    <div className="flex flex-row-reverse flex-wrap items-center justify-between max-w-[1350px] mx-auto px-[5%] py-4">
      <div className="flex flex-row justify-end gap-1 flex-wrap">
        <Button
          onClick={() => {
            setSelectedFilter("");
            onFilterChange("");
          }}
          variant="outline"
          size="icon"
          className="rounded-full"
        >
          <X className="w-4 h-4 text-gray-500" />
        </Button>
        {filters.map((filter) => (
          <div key={filter.code}>
            <input
              className="peer sr-only"
              value={filter.code}
              checked={selectedFilter === filter.code}
              onChange={handleFilterChange}
              name="filter"
              id={filter.code}
              type="radio"
            />
            <div
              className={`flex h-9 cursor-pointer flex-col items-center justify-center rounded-xl border-2 p-1 transition-transform duration-150 active:scale-95 ${
                selectedFilter === filter.code
                  ? "border-main shadow-md shadow-tint-3 bg-main text-white"
                  : "border-gray-300 bg-gray-50 text-gray-500 hover:border-main"
              }`}
            >
              <label
                className={`flex cursor-pointer items-center justify-center text-sm uppercase ${
                  selectedFilter === filter.code
                    ? "text-white"
                    : "text-gray-500"
                }`}
                htmlFor={filter.code}
              >
                {filter.label}
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
