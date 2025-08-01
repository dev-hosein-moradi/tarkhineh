"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, RefreshCw } from "lucide-react";
import BranchForm from "../components/branch-form";
import { getBranchById } from "@/services/branch-service";
import { IBranch } from "@/types";

export default function BranchFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const branchId = searchParams.get("id");
  const [branch, setBranch] = useState<IBranch | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (branchId) {
      setLoading(true);
      setError(null);

      getBranchById(branchId)
        .then((data) => {
          if (data) {
            console.log("Raw branch data from API:", data);
            console.log("Branch image analysis:", {
              hasImages: !!data.images,
              imagesArray: data.images,
              hasMainImage: !!data.mainImage,
              mainImage: data.mainImage,
              firstImage: data.images?.[0],
            });
            setBranch(data);
          } else {
            setError("شعبه یافت نشد");
          }
        })
        .catch((err) => {
          console.error("Error loading branch:", err);
          setError("خطا در بارگذاری اطلاعات شعبه");
        })
        .finally(() => setLoading(false));
    }
  }, [branchId]);

  const handleSuccess = () => {
    router.push("/admin/branch");
  };

  const handleBack = () => {
    router.back();
  };

  const handleRetry = () => {
    if (branchId) {
      setBranch(null);
      setError(null);
      // Re-trigger the useEffect
      getBranchById(branchId)
        .then((data) => {
          if (data) {
            setBranch(data);
          } else {
            setError("شعبه یافت نشد");
          }
        })
        .catch((err) => {
          console.error("Error loading branch:", err);
          setError("خطا در بارگذاری اطلاعات شعبه");
        })
        .finally(() => setLoading(false));
    }
  };

  return (
    <div
      className="flex flex-col py-[16px] px-[5%] relative max-w-[1350px] mx-auto"
      dir="rtl"
    >
      <div className="w-full flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {branchId ? "ویرایش شعبه" : "افزودن شعبه جدید"}
        </h1>
        <Button
          variant="outline"
          onClick={handleBack}
          className="flex items-center gap-2"
        >
          <ArrowRight className="w-4 h-4" />
          بازگشت
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <div className="text-lg">در حال بارگذاری اطلاعات شعبه...</div>
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col justify-center items-center py-12">
            <div className="text-red-500 text-lg mb-4">{error}</div>
            <Button onClick={handleRetry} variant="outline">
              تلاش مجدد
            </Button>
          </div>
        ) : (
          <BranchForm
            branch={branch}
            onSuccess={handleSuccess}
            isEditing={!!branchId}
          />
        )}
      </div>
    </div>
  );
}
