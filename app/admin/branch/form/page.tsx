"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import BranchForm from "../components/branch-form";
import { getBranchById } from "@/services/branch-service";

export default function BranchFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const branchId = searchParams.get("id");
  const [branch, setBranch] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (branchId) {
      setLoading(true);
      getBranchById(branchId)
        .then((data) => setBranch(data.data.data))
        .catch((err) => console.error("Error loading branch:", err))
        .finally(() => setLoading(false));
    }

    console.log(branch);
  }, [branchId]);

  const handleSuccess = () => {
    router.push("/admin/branch");
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="flex flex-col py-[16px] px-[5%] relative max-w-[1350px] mx-auto">
      <div className="w-full flex flex-row-reverse justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {branchId ? "ویرایش شعبه" : "افزودن شعبه"}
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
          <BranchForm branch={branch} onSuccess={handleSuccess} />
        )}
      </div>
    </div>
  );
}
