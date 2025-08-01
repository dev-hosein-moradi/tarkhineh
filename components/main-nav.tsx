"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/image/Logo.svg";
import {
  ChevronDown,
  Menu,
  Search,
  ShoppingCart,
  User2,
  X,
} from "lucide-react";

import { SmBranchCardsSkeleton } from "./skeleton";
import { useCategoryStore } from "@/hooks/use-category";
import { toast } from "sonner";
import { onOpen } from "@/hooks/use-auth-modal";

import { useSearchModal } from "@/hooks/use-search-modal";
import { useBranchStore } from "@/hooks/use-branch";
import { RootState } from "@/hooks/store";
import { useDispatch, useSelector } from "react-redux";
import AccountDropdown from "./account-dropdown";
// Add this import
import { useAuth } from "@/contexts/auth-context";

const Select = dynamic(
  () => import("@/components/ui/select").then((mod) => mod.Select),
  { ssr: false }
);
const SelectTrigger = dynamic(
  () => import("@/components/ui/select").then((mod) => mod.SelectTrigger),
  { ssr: false }
);
const SelectValue = dynamic(
  () => import("@/components/ui/select").then((mod) => mod.SelectValue),
  { ssr: false }
);
const SelectContent = dynamic(
  () => import("@/components/ui/select").then((mod) => mod.SelectContent),
  { ssr: false }
);
const Button = dynamic(() =>
  import("@/components/ui/button").then((mod) => mod.Button)
);

export const MainNav = ({
  className,
  ...props
}: React.HtmlHTMLAttributes<HTMLElement>) => {
  const dispatch = useDispatch();
  const searchModel = useSearchModal();
  const router = useRouter();

  // Use new auth context instead of Redux
  const { isAuthenticated, user, initialized } = useAuth();

  const [sideMenu, setSideMenu] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const {
    branches,
    fetchBranches,
    loading: branchesLoading,
    error: branchesError,
  } = useBranchStore();
  const {
    categories,
    fetchCategories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useCategoryStore();

  // Remove this old Redux selector:
  // const { isAuthenticated } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    fetchCategories().catch((e) => {
      toast.error(`دریافت دسته بندی ها با مشکل مواجه شد`);
    });
  }, []);

  useEffect(() => {
    fetchBranches().catch((e) => {
      toast.error(`دریافت شعبه ها با مشکل مواجه شد`);
    });
  }, []);

  useEffect(() => {
    if (branches?.length !== 0 && categories?.length !== 0) {
      setLoading(false);
    }
  }, [branches, categories]);

  const renderBranches = useCallback(
    (linkPrefix = "/branch") =>
      branches?.map((branch) => (
        <Link
          key={branch.id}
          href={`${linkPrefix}/${branch.id}`}
          className="hover:text-main duration-150 py-2 px-2"
        >
          {branch.name}
        </Link>
      )),
    [branches]
  );

  const renderMenu = useCallback(
    (linkPrefix = "/menu") =>
      categories?.map((category) => (
        <Link
          key={category.id}
          href={`${linkPrefix}/${category.id}`}
          className="hover:text-main duration-150 py-2 px-2"
        >
          {category.name}
        </Link>
      )),
    [categories]
  );

  // Show loading while auth is initializing
  if (!initialized) {
    return (
      <div className="flex flex-row-reverse justify-between w-full">
        <div className="hidden md:flex mx-auto">
          <div className="animate-pulse bg-gray-200 h-8 w-96 rounded"></div>
        </div>
        <div className="w-full md:w-auto flex items-center gap-1">
          <div className="animate-pulse bg-gray-200 h-10 w-10 rounded"></div>
        </div>
      </div>
    );
  }

  if (!branches || !categories) return <></>;

  return (
    <div className="flex flex-row-reverse justify-between w-full">
      {/* Large Screen Navigation */}
      <div className="hidden md:flex mx-auto">
        <ul className="flex flex-row-reverse">
          <Link
            href={"/"}
            className="lg:mx-1 px-1 cursor-pointer hover:text-Primary text-gray-7 border-b-white border-b-2 py-1 hover:border-Primary duration-75 ease-out"
          >
            صفحه اصلی
          </Link>

          {/* Branches Dropdown */}
          <span className="lg:mx-1 px-1 cursor-pointer hover:text-Primary text-gray-7 group relative">
            <p className="flex items-center border-b-white border-b-2 py-1 hover:border-Primary duration-75 ease-out">
              <ChevronDown className="w-4 h-4" /> شعبه
            </p>
            <ul className="flex-col text-right bg-white rounded-md hidden group-hover:flex absolute -right-10 h-[180px] w-[200px] p-2 z-10 shadow-md border">
              {branchesLoading ? (
                <SmBranchCardsSkeleton />
              ) : branchesError ? (
                <p className="text-red-500 p-2">{branchesError}</p>
              ) : (
                renderBranches()
              )}
            </ul>
          </span>

          {/* Menu Dropdown */}
          <span className="lg:mx-1 px-1 cursor-pointer hover:text-Primary text-gray-7 group relative">
            <p className="flex items-center border-b-white border-b-2 py-1 hover:border-Primary duration-75 ease-out">
              <ChevronDown className="w-4 h-4" /> منو
            </p>
            <ul className="flex-col text-right bg-white rounded-md hidden group-hover:flex absolute -right-10 h-[180px] w-[200px] p-2 z-10 shadow-md border">
              {categoriesLoading ? (
                <SmBranchCardsSkeleton />
              ) : categoriesError ? (
                <p className="text-red-500 p-2">{categoriesError}</p>
              ) : (
                renderMenu()
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
      <div className="w-full md:w-auto flex items-center gap-1">
        <Button
          className="hover:border-main text-main bg-tint-1 group duration-150 inline-flex md:hidden"
          variant="outline"
          size="icon"
          onClick={() => setSideMenu(true)}
        >
          <Menu className="w-6 h-6 group-hover:text-main duration-150" />
        </Button>

        {/* Updated authentication check */}
        {!isAuthenticated ? (
          <Button
            className="hover:border-main bg-tint-1 duration-150"
            variant="outline"
            size="icon"
            onClick={() => {
              dispatch(onOpen());
            }}
          >
            <User2 className="w-5 h-5 text-main duration-150" />
          </Button>
        ) : (
          <AccountDropdown />
        )}

        <Button
          className="hover:border-main bg-tint-1 duration-150"
          variant="outline"
          size="icon"
          onClick={() => router.push(`/cart`)}
        >
          <ShoppingCart className="h-5 w-5 text-main duration-150" />
        </Button>
        <Button
          className="hover:border-main bg-tint-1 duration-150 hidden lg:inline-flex"
          variant="outline"
          size="icon"
          onClick={() => {
            searchModel.onOpen();
          }}
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
            priority
          />
          <Button
            variant="outline"
            size="icon"
            className="bg-error-extra-light hover:border-error"
            onClick={() => setSideMenu(false)}
          >
            <X className="w-5 h-5 text-error" />
          </Button>
        </div>
        <ul className="px-3">
          <li className="py-2 my-1 cursor-pointer border-b-[1px] w-full">
            صفحه اصلی
          </li>

          {/* Add authentication info in mobile menu */}
          {isAuthenticated && user && (
            <li className="py-2 my-1 border-b-[1px] w-full">
              <div className="text-sm text-gray-600">
                خوش آمدید: {user.mobileNumber}
              </div>
              <div className="text-xs text-gray-500">نقش: {user.role}</div>
            </li>
          )}

          {/* Branches Select */}
          <Select>
            <SelectTrigger className="w-full text-right my-1" dir="rtl">
              <SelectValue placeholder="شعبه" />
            </SelectTrigger>
            <SelectContent dir="rtl">
              {branchesLoading ? (
                <SmBranchCardsSkeleton />
              ) : branchesError ? (
                <p className="text-red-500 p-2">{branchesError}</p>
              ) : (
                branches?.map((branch) => (
                  <Link
                    key={branch.id}
                    href={`/branch/${branch.name.split(" ")[1]}`}
                    className="hover:text-main duration-150 block py-1 px-4"
                  >
                    {branch.name}
                  </Link>
                ))
              )}
            </SelectContent>
          </Select>

          {/* Menu Select */}
          <Select>
            <SelectTrigger className="w-full text-right my-1" dir="rtl">
              <SelectValue placeholder="منو" />
            </SelectTrigger>
            <SelectContent dir="rtl" className="flex flex-col">
              {categoriesLoading ? (
                <SmBranchCardsSkeleton />
              ) : categoriesError ? (
                <p className="text-red-500 p-2">{categoriesError}</p>
              ) : (
                categories?.map((category) => (
                  <Link
                    key={category.id}
                    href={`/menu/${category.id}`}
                    className="hover:text-main duration-150 block py-1 px-4"
                  >
                    {category.name}
                  </Link>
                ))
              )}
            </SelectContent>
          </Select>

          <li className="py-2 my-1 cursor-pointer border-b-[1px] w-full">
            اعطای نمایندگی
          </li>

          <li className="py-2 my-1 cursor-pointer border-b-[1px] w-full">
            درباره ما
          </li>

          <li className="py-2 my-1 cursor-pointer border-b-[1px] w-full">
            تماس با ما
          </li>
        </ul>
      </div>
    </div>
  );
};
