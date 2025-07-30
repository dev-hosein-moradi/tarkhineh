"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import FoodForm from "../components/food-form";
import { getFoodById } from "@/services/food-service";

export default function FoodFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const foodId = searchParams.get("id");
  const [food, setFood] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (foodId) {
      setLoading(true);
      getFoodById(foodId)
        .then((data) => setFood(data.data.data))
        .catch((err) => console.error("Error loading food:", err))
        .finally(() => setLoading(false));
    }

    console.log(food);
  }, [foodId]);

  const handleSuccess = () => {
    router.push("/admin/food");
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="flex flex-col py-[16px] px-[5%] relative max-w-[1350px] mx-auto">
      <div className="w-full flex flex-row-reverse justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {foodId ? "ویرایش غذا" : "افزودن غذا"}
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
          <FoodForm food={food} onSuccess={handleSuccess} />
        )}
      </div>
    </div>
  );
}
