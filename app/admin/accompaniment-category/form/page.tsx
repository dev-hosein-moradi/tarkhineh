"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import CategoryForm from "../components/category-form";
import { getAccompanimentCategoryById } from "@/services/accompaniment-service";
import { toast } from "sonner";
import Navbar from "@/components/header";
import AdminNav from "../../components/admin-nav";

export default function CategoryFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("id");
  const [category, setCategory] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (categoryId) {
      setLoading(true);
      getAccompanimentCategoryById(categoryId)
        .then((data) => setCategory(data.data.data))
        .catch((err) => {
          console.error("Error loading category:", err);
          toast.error("خطا در دریافت اطلاعات دسته‌بندی");
        })
        .finally(() => setLoading(false));
    }
  }, [categoryId]);

  const handleSuccess = () => {
    router.push("/admin/accompaniment-category");
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div>
      <Navbar />
      <AdminNav />
      <div className="flex flex-col py-[16px] px-[5%] relative max-w-[1350px] mx-auto">
        <div className="w-full flex flex-row-reverse justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {categoryId ? "ویرایش دسته‌بندی" : "افزودن دسته‌بندی"}
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
            <div className="flex justify-center items-center py-8">
              <div className="text-lg">در حال بارگذاری...</div>
            </div>
          ) : (
            <CategoryForm category={category} onSuccess={handleSuccess} />
          )}
        </div>
      </div>
    </div>
  );
}
