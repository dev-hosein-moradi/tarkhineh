"use client";

import { Toaster } from "@/components/ui/sonner";

export const ToastProvider = () => {
  return (
    <Toaster
      richColors
      className="text-xs sm:text-sm md:text-base lg:text-xl font-estedad mr-4"
    />
  );
};
