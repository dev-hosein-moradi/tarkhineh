"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import AccompanimentForm from "../components/accompaniment-form";
import { getAccompanimentById } from "@/services/accompaniment-service";
import { toast } from "sonner";

export default function AccompanimentFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const accompanimentId = searchParams.get("id");
  const [accompaniment, setAccompaniment] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (accompanimentId) {
      setLoading(true);
      getAccompanimentById(accompanimentId)
        .then((data) => setAccompaniment(data.data.data))
        .catch((err) => {
          console.error("Error loading accompaniment:", err);
          toast.error("خطا در دریافت اطلاعات اقلام جانبی");
        })
        .finally(() => setLoading(false));
    }
  }, [accompanimentId]);

  const handleSuccess = () => {
    router.push("/admin/accompaniment");
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="flex flex-col py-[16px] px-[5%] relative max-w-[1350px] mx-auto">
      <div className="w-full flex flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {accompanimentId ? "ویرایش اقلام جانبی" : "افزودن اقلام جانبی"}
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
          <AccompanimentForm
            accompaniment={accompaniment}
            onSuccess={handleSuccess}
          />
        )}
      </div>
    </div>
  );
}
