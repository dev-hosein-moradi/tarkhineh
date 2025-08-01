"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createUser, updateUser } from "@/services/user-service";
import { getBranchs } from "@/services/branch-service";
import { toast } from "sonner";
import { IUser, UserRole, UserType, IBranch } from "@/types";

type UserFormProps = {
  user?: IUser;
  onSuccess: () => void;
};

export default function UserForm({ user, onSuccess }: UserFormProps) {
  // Helper function to get current user role (moved inside component)
  const getCurrentUserRole = (): UserRole | null => {
    try {
      const userInfo = localStorage.getItem("userInfo");
      if (userInfo) {
        const user = JSON.parse(userInfo);
        return user.role;
      }
      return null;
    } catch (error) {
      console.error("Error getting current user role:", error);
      return null;
    }
  };

  // Initialize form with proper defaults and handle user data correctly
  const [form, setForm] = useState(() => {
    if (user) {
      return {
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        mobileNumber: user.mobileNumber || "",
        password: "", // Always empty for edit mode
        type: user.type || UserType.user,
        role: user.role || UserRole.customer,
        branchId: user.branchId || "",
        isActive: user.isActive !== undefined ? user.isActive : true,
      };
    }
    return {
      firstName: "",
      lastName: "",
      email: "",
      mobileNumber: "",
      password: "",
      type: UserType.user,
      role: UserRole.customer,
      branchId: "",
      isActive: true,
    };
  });

  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState<IBranch[]>([]);
  const [branchesLoading, setBranchesLoading] = useState(true);

  // Update form when user prop changes
  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        mobileNumber: user.mobileNumber || "",
        password: "", // Always empty for edit mode
        type: user.type || UserType.user,
        role: user.role || UserRole.customer,
        branchId: user.branchId || "",
        isActive: user.isActive !== undefined ? user.isActive : true,
      });
    }
  }, [user]);

  // Fetch branches for branch managers
  useEffect(() => {
    const fetchBranches = () => {
      setBranchesLoading(true);
      getBranchs()
        .then((data) => {
          if (data && Array.isArray(data)) {
            setBranches(data);
          } else {
            setBranches([]);
          }
        })
        .catch((error) => {
          console.error("Error fetching branches:", error);
          toast.error("خطا در دریافت شعبه‌ها");
          setBranches([]);
        })
        .finally(() => {
          setBranchesLoading(false);
        });
    };

    fetchBranches();
  }, []);

  // Better typed event handlers
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setForm((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear branchId if role is not branchManager
    if (name === "role" && value !== UserRole.branchManager) {
      setForm((prev) => ({
        ...prev,
        branchId: "",
      }));
    }
  };

  // Get available roles based on current user's permissions
  const getAvailableRoles = () => {
    const currentRole = getCurrentUserRole();

    if (currentRole === UserRole.superAdmin) {
      // SuperAdmin can assign all roles
      return [
        { value: UserRole.customer, label: "مشتری" },
        { value: UserRole.staff, label: "کارمند" },
        { value: UserRole.branchManager, label: "مدیر شعبه" },
        { value: UserRole.admin, label: "مدیر" },
        { value: UserRole.superAdmin, label: "مدیر کل" },
      ];
    } else if (currentRole === UserRole.admin) {
      // Admin cannot assign superAdmin role
      return [
        { value: UserRole.customer, label: "مشتری" },
        { value: UserRole.staff, label: "کارمند" },
        { value: UserRole.branchManager, label: "مدیر شعبه" },
        { value: UserRole.admin, label: "مدیر" },
      ];
    } else {
      // Others cannot assign roles - fallback to basic roles
      return [
        { value: UserRole.customer, label: "مشتری" },
        { value: UserRole.staff, label: "کارمند" },
      ];
    }
  };

  // Better typed submit handler
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Validation
    if (!form.mobileNumber.trim()) {
      toast.error("شماره موبایل الزامی است");
      return;
    }

    if (!user && !form.password.trim()) {
      toast.error("رمز عبور الزامی است");
      return;
    }

    if (form.role === UserRole.branchManager && !form.branchId) {
      toast.error("برای مدیر شعبه، انتخاب شعبه الزامی است");
      return;
    }

    // Validate mobile number format (simple validation)
    const mobileRegex = /^09\d{9}$/;
    if (!mobileRegex.test(form.mobileNumber)) {
      toast.error("شماره موبایل باید با 09 شروع شده و 11 رقم باشد");
      return;
    }

    // Validate email if provided
    if (form.email && form.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        toast.error("فرمت ایمیل صحیح نیست");
        return;
      }
    }

    // Check role assignment permissions
    const currentRole = getCurrentUserRole();
    if (currentRole === UserRole.admin && form.role === UserRole.superAdmin) {
      toast.error("شما نمی‌توانید کاربری را مدیر کل کنید");
      return;
    }

    setLoading(true);

    // Prepare data for backend
    const submitData = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim() || undefined, // Send undefined if empty
      mobileNumber: form.mobileNumber.trim(),
      type: form.type,
      role: form.role,
      branchId: form.branchId || undefined, // Send undefined if empty
      isActive: form.isActive,
      // Only send password if it's not empty
      ...(form.password.trim() && { password: form.password }),
    };

    const apiCall =
      user && user.id
        ? updateUser(user.id, submitData)
        : createUser(submitData);

    apiCall
      .then(() => {
        toast.success(
          user && user.id
            ? "کاربر با موفقیت ویرایش شد."
            : "کاربر جدید با موفقیت ثبت شد."
        );
        onSuccess();
      })
      .catch((err) => {
        console.error("Submit error:", err);
        // Better error handling
        if (err.response?.data?.message) {
          toast.error(err.response.data.message);
        } else if (err.message) {
          toast.error(err.message);
        } else {
          toast.error("مشکلی در ثبت یا ویرایش کاربر رخ داد.");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <form className="space-y-6 text-right" dir="rtl" onSubmit={handleSubmit}>
      {/* Basic Information Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold border-b pb-2">اطلاعات شخصی</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">نام</label>
            <Input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="نام"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">
              نام خانوادگی
            </label>
            <Input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="نام خانوادگی"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              ایمیل (اختیاری)
            </label>
            <Input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="example@domain.com"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">
              شماره موبایل *
            </label>
            <Input
              name="mobileNumber"
              value={form.mobileNumber}
              onChange={handleChange}
              placeholder="09123456789"
              required
              maxLength={11}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              {user ? "رمز عبور جدید (اختیاری)" : "رمز عبور *"}
            </label>
            <Input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder={user ? "رمز عبور جدید" : "رمز عبور"}
              required={!user}
              minLength={6}
            />
          </div>
          <div className="flex items-center gap-2 pt-8">
            <Checkbox
              id="isActive"
              checked={form.isActive}
              onCheckedChange={(checked) =>
                setForm((prev) => ({
                  ...prev,
                  isActive: !!checked,
                }))
              }
            />
            <label htmlFor="isActive" className="cursor-pointer">
              حساب کاربری فعال
            </label>
          </div>
        </div>
      </div>

      {/* Role and Access Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold border-b pb-2">نقش و دسترسی</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">نوع کاربر</label>
            <Select
              dir="rtl"
              value={form.type}
              onValueChange={(value) => handleSelectChange("type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="انتخاب نوع کاربر" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={UserType.user}>کاربر</SelectItem>
                <SelectItem value={UserType.staff}>کارمند</SelectItem>
                <SelectItem value={UserType.manager}>منیجر</SelectItem>
                <SelectItem value={UserType.admin}>مدیر</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">نقش</label>
            <Select
              dir="rtl"
              value={form.role}
              onValueChange={(value) => handleSelectChange("role", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="انتخاب نقش" />
              </SelectTrigger>
              <SelectContent>
                {getAvailableRoles().map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Branch Selection for Branch Managers */}
        {form.role === UserRole.branchManager && (
          <div>
            <label className="text-sm font-medium mb-2 block">شعبه *</label>
            <Select
              value={form.branchId || ""}
              onValueChange={(value) => handleSelectChange("branchId", value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="انتخاب شعبه" />
              </SelectTrigger>
              <SelectContent>
                {branchesLoading ? (
                  <SelectItem value="loading" disabled>
                    در حال بارگذاری...
                  </SelectItem>
                ) : branches.length === 0 ? (
                  <SelectItem value="no-branches" disabled>
                    هیچ شعبه‌ای یافت نشد
                  </SelectItem>
                ) : (
                  branches
                    .filter((branch) => branch.id) // Filter out branches without id
                    .map((branch) => (
                      <SelectItem key={branch.id} value={branch.id as string}>
                        {branch.name}
                      </SelectItem>
                    ))
                )}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-6 border-t">
        <Button
          className="bg-main w-full md:w-auto min-w-[120px]"
          type="submit"
          disabled={loading}
        >
          {loading
            ? "در حال پردازش..."
            : user && user.id
            ? "ویرایش کاربر"
            : "ثبت کاربر"}
        </Button>
      </div>
    </form>
  );
}
