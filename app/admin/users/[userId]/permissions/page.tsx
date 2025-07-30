"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, RefreshCw } from "lucide-react";
import UserPermissionsManager from "./components/user-permissions-manager";
import { getUserById } from "@/services/user-service";
import { toast } from "sonner";
import { IUser } from "@/types";

export default function UserPermissionsPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.userId as string;
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      setLoading(true);
      getUserById(userId)
        .then((response) => {
          setUser(response.data.data);
        })
        .catch((error) => {
          console.error("Error loading user:", error);
          toast.error("خطا در دریافت اطلاعات کاربر");
          router.push("/admin/users");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [userId, router]);

  const handleSuccess = () => {
    toast.success("دسترسی‌ها با موفقیت به‌روزرسانی شد");
    // Optionally redirect back to users list
    // router.push("/admin/users");
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center items-center py-12">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-6 h-6 animate-spin" />
            <span className="text-lg">در حال بارگذاری...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col justify-center items-center py-12">
          <p className="text-red-500 text-lg mb-4">کاربر یافت نشد</p>
          <Button onClick={handleBack} variant="outline">
            بازگشت
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">مدیریت دسترسی‌ها</h1>
        <Button
          variant="outline"
          onClick={handleBack}
          className="flex items-center gap-2"
        >
          <ArrowRight className="w-4 h-4" />
          بازگشت
        </Button>
      </div>

      <UserPermissionsManager user={user} onSuccess={handleSuccess} />
    </div>
  );
}
