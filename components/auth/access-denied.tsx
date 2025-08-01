"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { ShieldX, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface AccessDeniedProps {
  message?: string;
  showBackButton?: boolean;
  backTo?: string;
}

const AccessDenied: React.FC<AccessDeniedProps> = ({
  message = "شما دسترسی به این بخش را ندارید",
  showBackButton = true,
  backTo = "/admin",
}) => {
  const router = useRouter();

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-50"
      dir="rtl"
    >
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldX className="w-8 h-8 text-red-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">دسترسی محدود</h1>

        <p className="text-gray-600 mb-6">{message}</p>

        {showBackButton && (
          <Button
            onClick={() => router.push(backTo)}
            className="bg-main hover:bg-main/90 text-white"
          >
            <ArrowLeft className="w-4 h-4 ml-2" />
            بازگشت
          </Button>
        )}
      </div>
    </div>
  );
};

export default AccessDenied;
