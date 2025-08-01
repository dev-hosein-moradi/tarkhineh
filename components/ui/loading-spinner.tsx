import React from "react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  className,
  text = "در حال بارگذاری...",
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-[200px] p-8"
      dir="rtl"
    >
      <div
        className={cn(
          "animate-spin rounded-full border-2 border-gray-300 border-t-main",
          sizeClasses[size],
          className
        )}
      />
      {text && <p className="mt-4 text-gray-600 text-sm">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
