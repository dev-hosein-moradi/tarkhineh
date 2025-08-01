"use client";

import React from "react";
import { useAuth } from "@/contexts/auth-context";
import { UserRole } from "@/types";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User2, LogOut, Settings, ShoppingBag, Shield } from "lucide-react";

const AccountDropdown = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      // Redirect will happen automatically
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  // Get role from user
  const userRole = user.role;
  const userMobile = user.mobileNumber;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="hover:border-main bg-tint-1 duration-150"
        >
          <User2 className="w-5 h-5 text-main duration-150" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel className="text-right">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userMobile}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userRole === "superAdmin" && "مدیر کل"}
              {userRole === "admin" && "مدیر"}
              {userRole === "branchManager" && "مدیر شعبه"}
              {userRole === "staff" && "کارمند"}
              {userRole === "customer" && "مشتری"}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="flex-row justify-between"
          onClick={() => router.push("/profile")}
        >
          <User2 className="mr-2 h-4 w-4" />
          <span>پروفایل</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="flex-row justify-between"
          onClick={() => router.push("/orders")}
        >
          <ShoppingBag className="mr-2 h-4 w-4" />
          <span>سفارشات</span>
        </DropdownMenuItem>

        {/* Show admin panel link for admin users */}
        {(userRole === "superAdmin" || userRole === "admin") && (
          <DropdownMenuItem
            className="flex-row justify-between"
            onClick={() => router.push("/admin")}
          >
            <Shield className="mr-2 h-4 w-4" />
            <span>پنل مدیریت</span>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem
          className="flex-row justify-between"
          onClick={() => router.push("/settings")}
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>تنظیمات</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="flex justify-between cursor-pointer text-right text-red-600 focus:text-red-600"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>خروج</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AccountDropdown;
