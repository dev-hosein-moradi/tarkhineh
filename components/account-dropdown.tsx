"use client";

import { useDispatch } from "react-redux";
import { logout } from "@/hooks/use-user";
import { useRouter } from "next/navigation";

import {
  ChevronDown,
  CreditCard,
  LifeBuoy,
  LogOut,
  Settings,
  User,
  User2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { handleLogout } from "@/services/auth-service";

export default function AccountDropdown() {
  const dispatch = useDispatch();
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="p-2">
          <ChevronDown className="w-3 h-3 text-main duration-150" />
          <User2 className="w-3 h-3 text-main duration-150" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel className="text-right">
          حساب کاربری
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => router.push(`/profile`)}
            className="flex-row-reverse justify-between"
          >
            <span>مشخصات من</span>
            <User />
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/track-orders`)}
            className="flex-row-reverse justify-between"
          >
            <span>پیگیری سفارشات</span>
            <CreditCard />
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/setting`)}
            className="flex-row-reverse justify-between"
          >
            <span>تنظیمات</span>
            <Settings />
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => router.push(`/support`)}
          className="flex-row-reverse justify-between"
        >
          <span>پشتیبانی</span>
          <LifeBuoy />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            dispatch(logout());
            handleLogout();
            router.push("/");
          }}
          className="flex-row-reverse justify-between"
        >
          <span className="text-error">خروج</span>
          <LogOut className="text-error-light" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
