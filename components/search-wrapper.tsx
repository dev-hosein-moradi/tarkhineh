"use client";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";

export default function SearchWrapper() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState("");

  const onChangeQuery = (e: any) => {
    setQuery(e.target.value);
  };
  return (
    <div className="relative flex flex-col items-center justify-center max-w-[1350px] mx-auto px-[5%] py-8">
      <div className="w-full">
        <Input
          placeholder="جستجو در رستوران..."
          name="query"
          value={query}
          onChange={onChangeQuery}
          className="min-w-[300px] w-[50%] mx-auto shadow-md"
          dir="rtl"
        />
      </div>
      <div
        className={`${
          query.length > 0 ? "flex" : "hidden"
        } absolute -bottom-[190px] w-[45%] min-w-[300px] mx-auto border rounded-md px-8 py-4 flex-col text-right bg-white z-10`}
      >
        <h2 className="font-semibold mb-3">نتایج جستجو</h2>
        <Separator />
        <ul className="h-[150px] overflow-y-auto">
          <li className="hover:text-main hover:bg-tint-1 font-medium rounded px-1 py-2 cursor-pointer duration-150">
            پیتزا قارچ
          </li>
          <li className="hover:text-main hover:bg-tint-1 font-medium rounded px-1 py-2 cursor-pointer duration-150">
            پیتزا قارچ
          </li>
          <li className="hover:text-main hover:bg-tint-1 font-medium rounded px-1 py-2 cursor-pointer duration-150">
            پیتزا قارچ
          </li>
          <li className="hover:text-main hover:bg-tint-1 font-medium rounded px-1 py-2 cursor-pointer duration-150">
            پیتزا قارچ
          </li>
          <li className="hover:text-main hover:bg-tint-1 font-medium rounded px-1 py-2 cursor-pointer duration-150">
            پیتزا قارچ
          </li>
          <li className="hover:text-main hover:bg-tint-1 font-medium rounded px-1 py-2 cursor-pointer duration-150">
            پیتزا قارچ
          </li>
        </ul>
      </div>
    </div>
  );
}
