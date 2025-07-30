"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, KeyRound, RefreshCw, Save } from "lucide-react";
import { getUserById, resetUserPassword } from "@/services/user-service";
import { toast } from "sonner";
import { IUser } from "@/types";

export default function UserPasswordResetPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.userId as string;
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passwords, setPasswords] = useState({
    password: "",
    confirmPassword: "",
  });

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwords.password.trim()) {
      toast.error("رمز عبور نمی‌تواند خالی باشد");
      return;
    }

    if (passwords.password.length < 6) {
      toast.error("رمز عبور باید حداقل ۶ کاراکتر باشد");
      return;
    }

    if (passwords.password !== passwords.confirmPassword) {
      toast.error("تکرار رمز عبور مطابقت ندارد");
      return;
    }

    setSaving(true);
    try {
      await resetUserPassword(userId, passwords.password);
      toast.success("رمز عبور با موفقیت تغییر کرد");
      router.push("/admin/users");
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error("خطا در تغییر رمز عبور");
    } finally {
      setSaving(false);
    }
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
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">تغییر رمز عبور کاربر</h1>
        <Button
          variant="outline"
          onClick={handleBack}
          className="flex items-center gap-2"
        >
          <ArrowRight className="w-4 h-4" />
          بازگشت
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <KeyRound className="w-6 h-6 text-main" />
            <div>
              <CardTitle>تغییر رمز عبور</CardTitle>
              <p className="text-gray-600 text-sm mt-1">
                رمز عبور جدید برای کاربر تعیین کنید
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 bg-gray-50 rounded-lg" dir="rtl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="text-sm text-gray-500">نام کاربر:</span>
                <p className="font-medium">
                  {user.firstName && user.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : "نام تعیین نشده"}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-500">شماره موبایل:</span>
                <p className="font-medium font-mono">{user.mobileNumber}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">ایمیل:</span>
                <p className="font-medium">{user.email || "ایمیل ندارد"}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
            <div>
              <label className="text-sm font-medium mb-2 block">
                رمز عبور جدید *
              </label>
              <Input
                type="password"
                name="password"
                value={passwords.password}
                onChange={handleInputChange}
                placeholder="رمز عبور جدید را وارد کنید"
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                تکرار رمز عبور *
              </label>
              <Input
                type="password"
                name="confirmPassword"
                value={passwords.confirmPassword}
                onChange={handleInputChange}
                placeholder="رمز عبور را مجدداً وارد کنید"
                required
                minLength={6}
              />
            </div>

            <div className="pt-6 border-t">
              <Button
                type="submit"
                disabled={saving}
                className="bg-main min-w-[120px]"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-4 h-4 ml-2 animate-spin" />
                    در حال ذخیره...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 ml-2" />
                    تغییر رمز عبور
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
