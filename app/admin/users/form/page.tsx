"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import UserForm from "../components/user-form";
import { getUserById } from "@/services/user-service";
import { toast } from "sonner";

export default function UserFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      setLoading(true);
      getUserById(userId)
        .then((data) => setUser(data.data.data))
        .catch((err) => {
          console.error("Error loading user:", err);
          toast.error("خطا در دریافت اطلاعات کاربر");
        })
        .finally(() => setLoading(false));
    }
  }, [userId]);

  const handleSuccess = () => {
    router.push("/admin/users");
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {userId ? "ویرایش کاربر" : "افزودن کاربر جدید"}
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
          <UserForm user={user} onSuccess={handleSuccess} />
        )}
      </div>
    </div>
  );
}
