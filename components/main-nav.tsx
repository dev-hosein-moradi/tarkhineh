"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Logo from "@/public/image/Logo.svg";

import { SmBrnach } from "./branch-card";
import {
  ChevronDown,
  Menu,
  Search,
  ShoppingCart,
  User2,
  X,
} from "lucide-react";
import { getBranchs } from "@/services/branch-service";
import { IBranch } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { SmBranchCardsSkeleton } from "./skeleton";
import Link from "next/link";

export const MainNav = ({
  className,
  ...props
}: React.HtmlHTMLAttributes<HTMLElement>) => {
  const [sideMenu, setSideMenu] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [branchs, setBranchs] = useState<IBranch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBranchs = async () => {
      try {
        const data = await getBranchs();
        setBranchs(data);
      } catch (error) {
        setError("Failed to load branches.");
      } finally {
        setLoading(false);
      }
    };

    fetchBranchs();
  }, []);

  return (
    <div className="flex flex-row-reverse justify-between w-full">
      {/* Large Screen Navigation */}
      <div className="hidden md:flex mx-auto">
        <ul className="flex flex-row-reverse">
          <li className="lg:mx-1 px-1 cursor-pointer hover:text-Primary text-gray-7 border-b-white border-b-2 py-1 hover:border-Primary duration-75 ease-out">
            صحفه اصلی
          </li>

          {/* Branches Dropdown */}
          <span className="lg:mx-1 px-1 cursor-pointer hover:text-Primary text-gray-7 group relative">
            <p className="flex flex-row items-center border-b-white border-b-2 py-1 hover:border-Primary duration-75 ease-out">
              <ChevronDown className="w-4 h-4" /> شعبه
            </p>
            <ul className="flex-col text-right bg-gray-1 rounded-md hidden group-hover:flex absolute -right-10 h-[400px] w-[400px] p-2 z-10 bg-white border shadow-md">
              {loading ? (
                <SmBranchCardsSkeleton />
              ) : error ? (
                <p className="text-red-500 p-2">{error}</p>
              ) : (
                branchs.map((branch) => (
                  <SmBrnach
                    key={branch.id}
                    className="duration-300 hover:text-main"
                    data={branch}
                  />
                ))
              )}
            </ul>
          </span>

          {/* Menu Dropdown */}
          <span className="lg:mx-1 px-1 cursor-pointer hover:text-Primary text-gray-7 group relative">
            <p className="flex flex-row items-center border-b-white border-b-2 py-1 hover:border-Primary duration-75 ease-out">
              <ChevronDown className="w-4 h-4" /> منو
            </p>
            <ul className="flex-col text-right bg-gray-1 rounded-md hidden group-hover:flex absolute -right-10 h-[170px] w-[200px] p-2 z-10 bg-white border shadow-md">
              {loading ? (
                <SmBranchCardsSkeleton />
              ) : error ? (
                <p className="text-red-500 p-2">{error}</p>
              ) : (
                branchs.map((branch) => (
                  <Link
                    key={branch.id}
                    href={`/branch/${branch.title}/menu`}
                    className="p-1 hover:text-main duration-150"
                  >
                    {branch.name}
                  </Link>
                ))
              )}
            </ul>
          </span>

          <li className="lg:mx-1 px-1 cursor-pointer hover:text-Primary text-gray-7 border-b-white border-b-2 py-1 hover:border-Primary duration-75 ease-out">
            اعطای نمایندگی
          </li>

          <li className="lg:mx-1 px-1 cursor-pointer hover:text-Primary text-gray-7 border-b-white border-b-2 py-1 hover:border-Primary duration-75 ease-out">
            درباره ما
          </li>

          <li className="lg:mx-1 px-1 cursor-pointer hover:text-Primary text-gray-7 border-b-white border-b-2 py-1 hover:border-Primary duration-75 ease-out">
            تماس با ما
          </li>
        </ul>
      </div>

      {/* Small Screen Menu */}
      <div className="items-start w-full md:w-auto">
        <Button
          className="hover:border-main bg-tint-1 group duration-150 inline-flex md:hidden"
          variant="outline"
          size="icon"
          onClick={() => setSideMenu(true)}
        >
          <Menu className="w-6 h-6 group-hover:text-main duration-150" />
        </Button>
        <Button
          className="mx-1 hover:border-main bg-tint-1 duration-150 hidden md:inline-flex"
          variant="outline"
          size="icon"
        >
          <User2 className="w-5 h-5 text-main duration-150" />
        </Button>
        <Button
          className="mx-1 hover:border-main bg-tint-1 duration-150 hidden md:inline-flex"
          variant="outline"
          size="icon"
        >
          <ShoppingCart className="h-5 w-5 text-main duration-150" />
        </Button>
        <Button
          className="mx-1 hover:border-main bg-tint-1 duration-150 hidden lg:inline-flex"
          variant="outline"
          size="icon"
        >
          <Search className="h-5 w-5 text-main" />
        </Button>
      </div>

      {/* Side Menu */}
      <div
        className={`${
          sideMenu ? "w-full opacity-100 left-0" : "w-0 opacity-0 -left-12"
        } min-h-[100vh] flex flex-col text-right bg-white absolute top-0 z-10 duration-300 ease-out md:hidden`}
      >
        <div className="flex flex-row-reverse items-center px-3 py-5 justify-between bg-hero-slider bg-blend-darken bg-no-repeat bg-cover bg-center">
          <Image
            className="w-[150px] h-[38px] md:h-[42px] lg:h-[50px]"
            alt="logo"
            src={Logo}
          />
          <Button
            variant="outline"
            size="icon"
            className="cursor-pointer bg-error-extra-light hover:border-error"
            onClick={() => setSideMenu(false)}
          >
            <X className="w-5 h-5 text-error" />
          </Button>
        </div>
        <ul className="px-3 hover:*:text-main duration-150">
          <li className="py-2 my-1 cursor-pointer border-b-[1px] w-full ">
            صحفه اصلی
          </li>

          {/* Branches Select */}
          <Select>
            <SelectTrigger className="w-full text-right my-1" dir="rtl">
              <SelectValue placeholder="شعبه" />
            </SelectTrigger>
            <SelectContent dir="rtl">
              {loading ? (
                <SmBranchCardsSkeleton />
              ) : error ? (
                <p className="text-red-500 p-2">{error}</p>
              ) : (
                branchs.map((branch) => (
                  <SelectItem key={branch.id} value={branch.title}>
                    <Link
                      href={`/branch/${branch.title}`}
                      className="hover:text-main duration-150"
                    >
                      {branch.name}
                    </Link>
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>

          {/* Menu Select */}
          <Select>
            <SelectTrigger className="w-full text-right my-1" dir="rtl">
              <SelectValue placeholder="منو" />
            </SelectTrigger>
            <SelectContent dir="rtl">
              {loading ? (
                <SmBranchCardsSkeleton />
              ) : error ? (
                <p className="text-red-500 p-2">{error}</p>
              ) : (
                branchs.map((branch) => (
                  <SelectItem key={branch.id} value={branch.title}>
                    <Link
                      href={`/branch/${branch.title}/menu`}
                      className="hover:text-main duration-150"
                    >
                      {branch.name}
                    </Link>
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>

          <li className="py-2 my-1 cursor-pointer border-b-[1px] w-full ">
            اعطای نمایندگی
          </li>

          <li className="py-2 my-1 cursor-pointer border-b-[1px] w-full ">
            درباره ما
          </li>

          <li className="py-2 my-1 cursor-pointer border-b-[1px] w-full ">
            تماس با ما
          </li>
        </ul>
      </div>
    </div>
  );
};
