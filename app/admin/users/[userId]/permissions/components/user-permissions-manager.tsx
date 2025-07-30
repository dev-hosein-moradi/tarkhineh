"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  getUserPermissions,
  updateUserPermissions,
} from "@/services/user-service";
import { getBranchs } from "@/services/branch-service";
import { toast } from "sonner";
import {
  IUser,
  IUserPermission,
  IBranch,
  PermissionType,
  UserRole,
} from "@/types";
import {
  Shield,
  Building2,
  UtensilsCrossed,
  ShoppingCart,
  Users,
  Coffee,
  Tags,
  BarChart3,
  Settings,
  Save,
  RefreshCw,
} from "lucide-react";

interface UserPermissionsManagerProps {
  user: IUser;
  onSuccess?: () => void;
}

interface PermissionGroup {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  permissions: {
    key: PermissionType;
    title: string;
    description: string;
    requiresBranch?: boolean;
  }[];
}

const permissionGroups: PermissionGroup[] = [
  {
    title: "مدیریت غذاها",
    icon: UtensilsCrossed,
    permissions: [
      {
        key: PermissionType.MANAGE_FOODS,
        title: "مدیریت غذاها",
        description: "ایجاد، ویرایش و حذف غذاها",
      },
      {
        key: PermissionType.VIEW_FOODS,
        title: "مشاهده غذاها",
        description: "مشاهده لیست غذاها",
      },
    ],
  },
  {
    title: "مدیریت شعبه‌ها",
    icon: Building2,
    permissions: [
      {
        key: PermissionType.MANAGE_BRANCHES,
        title: "مدیریت شعبه‌ها",
        description: "ایجاد، ویرایش و حذف شعبه‌ها",
      },
      {
        key: PermissionType.VIEW_BRANCHES,
        title: "مشاهده شعبه‌ها",
        description: "مشاهده لیست شعبه‌ها",
      },
      {
        key: PermissionType.MANAGE_OWN_BRANCH,
        title: "مدیریت شعبه خود",
        description: "مدیریت شعبه اختصاص یافته",
        requiresBranch: true,
      },
    ],
  },
  {
    title: "مدیریت سفارشات",
    icon: ShoppingCart,
    permissions: [
      {
        key: PermissionType.MANAGE_ORDERS,
        title: "مدیریت سفارشات",
        description: "مدیریت کلی سفارشات",
      },
      {
        key: PermissionType.VIEW_ORDERS,
        title: "مشاهده سفارشات",
        description: "مشاهده لیست سفارشات",
      },
      {
        key: PermissionType.MANAGE_BRANCH_ORDERS,
        title: "مدیریت سفارشات شعبه",
        description: "مدیریت سفارشات شعبه خاص",
        requiresBranch: true,
      },
    ],
  },
  {
    title: "مدیریت کاربران",
    icon: Users,
    permissions: [
      {
        key: PermissionType.MANAGE_USERS,
        title: "مدیریت کاربران",
        description: "مدیریت کلی کاربران",
      },
      {
        key: PermissionType.VIEW_USERS,
        title: "مشاهده کاربران",
        description: "مشاهده لیست کاربران",
      },
      {
        key: PermissionType.MANAGE_BRANCH_STAFF,
        title: "مدیریت پرسنل شعبه",
        description: "مدیریت پرسنل شعبه خاص",
        requiresBranch: true,
      },
    ],
  },
  {
    title: "اقلام جانبی",
    icon: Coffee,
    permissions: [
      {
        key: PermissionType.MANAGE_ACCOMPANIMENTS,
        title: "مدیریت اقلام جانبی",
        description: "مدیریت نوشیدنی، سالاد و...",
      },
      {
        key: PermissionType.VIEW_ACCOMPANIMENTS,
        title: "مشاهده اقلام جانبی",
        description: "مشاهده لیست اقلام جانبی",
      },
    ],
  },
  {
    title: "دسته‌بندی‌ها",
    icon: Tags,
    permissions: [
      {
        key: PermissionType.MANAGE_CATEGORIES,
        title: "مدیریت دسته‌بندی‌ها",
        description: "مدیریت دسته‌بندی‌های مختلف",
      },
      {
        key: PermissionType.VIEW_CATEGORIES,
        title: "مشاهده دسته‌بندی‌ها",
        description: "مشاهده لیست دسته‌بندی‌ها",
      },
    ],
  },
  {
    title: "گزارشات",
    icon: BarChart3,
    permissions: [
      {
        key: PermissionType.VIEW_REPORTS,
        title: "مشاهده گزارشات",
        description: "مشاهده گزارشات کلی",
      },
      {
        key: PermissionType.VIEW_BRANCH_REPORTS,
        title: "گزارشات شعبه",
        description: "مشاهده گزارشات شعبه خاص",
        requiresBranch: true,
      },
    ],
  },
  {
    title: "تنظیمات سیستم",
    icon: Settings,
    permissions: [
      {
        key: PermissionType.MANAGE_SYSTEM_SETTINGS,
        title: "مدیریت تنظیمات",
        description: "دسترسی به تنظیمات سیستم",
      },
      {
        key: PermissionType.MANAGE_CARTS,
        title: "مدیریت سبد خرید",
        description: "مدیریت سبدهای خرید",
      },
      {
        key: PermissionType.VIEW_CARTS,
        title: "مشاهده سبد خرید",
        description: "مشاهده سبدهای خرید",
      },
    ],
  },
];

export default function UserPermissionsManager({
  user,
  onSuccess,
}: UserPermissionsManagerProps) {
  const [permissions, setPermissions] = useState<IUserPermission[]>([]);
  const [branches, setBranches] = useState<IBranch[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [branchesLoading, setBranchesLoading] = useState(true);

  // Load user permissions and branches
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Load permissions and branches in parallel
        const [permissionsData, branchesData] = await Promise.all([
          getUserPermissions(user.id),
          getBranchs(),
        ]);

        if (permissionsData) {
          setPermissions(permissionsData);
        }

        if (branchesData && Array.isArray(branchesData)) {
          setBranches(branchesData);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("خطا در بارگذاری اطلاعات");
      } finally {
        setLoading(false);
        setBranchesLoading(false);
      }
    };

    loadData();
  }, [user.id]);

  // Check if user has a specific permission
  const hasPermission = (
    permissionType: PermissionType,
    branchId?: string
  ): boolean => {
    return permissions.some(
      (p) =>
        p.permission === permissionType &&
        (branchId ? p.branchId === branchId : !p.branchId)
    );
  };

  // Toggle permission
  const togglePermission = (
    permissionType: PermissionType,
    branchId?: string
  ) => {
    const existingIndex = permissions.findIndex(
      (p) =>
        p.permission === permissionType &&
        (branchId ? p.branchId === branchId : !p.branchId)
    );

    if (existingIndex >= 0) {
      // Remove permission
      setPermissions((prev) =>
        prev.filter((_, index) => index !== existingIndex)
      );
    } else {
      // Add permission
      const newPermission: IUserPermission = {
        id: `temp-${Date.now()}`, // Temporary ID
        userId: user.id,
        permission: permissionType,
        branchId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setPermissions((prev) => [...prev, newPermission]);
    }
  };

  // Save permissions
  const handleSave = async () => {
    setSaving(true);
    try {
      const permissionData = permissions.map((p) => ({
        permission: p.permission,
        branchId: p.branchId,
      }));

      await updateUserPermissions(user.id, permissionData);
      toast.success("دسترسی‌ها با موفقیت به‌روزرسانی شد");
      onSuccess?.();
    } catch (error) {
      console.error("Save permissions error:", error);
      toast.error("خطا در ذخیره دسترسی‌ها");
    } finally {
      setSaving(false);
    }
  };

  // Get role badge color
  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case UserRole.superAdmin:
        return "bg-red-100 text-red-800";
      case UserRole.admin:
        return "bg-orange-100 text-orange-800";
      case UserRole.branchManager:
        return "bg-blue-100 text-blue-800";
      case UserRole.staff:
        return "bg-green-100 text-green-800";
      case UserRole.customer:
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleTitle = (role: UserRole) => {
    switch (role) {
      case UserRole.superAdmin:
        return "مدیر کل";
      case UserRole.admin:
        return "مدیر";
      case UserRole.branchManager:
        return "مدیر شعبه";
      case UserRole.staff:
        return "کارمند";
      case UserRole.customer:
        return "مشتری";
      default:
        return role;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8" dir="rtl">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>در حال بارگذاری...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* User Info Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Shield className="w-8 h-8 text-main" />
              <div>
                <CardTitle className="text-xl">
                  مدیریت دسترسی‌های کاربر
                </CardTitle>
                <p className="text-gray-600 mt-1">
                  تعیین دسترسی‌ها و مجوزهای کاربر
                </p>
              </div>
            </div>
            <Badge className={getRoleBadgeColor(user.role)}>
              {getRoleTitle(user.role)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
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
              <span className="text-sm text-gray-500">شعبه:</span>
              <p className="font-medium">
                {user.branch ? user.branch.name : "بدون شعبه"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Permissions Groups */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {permissionGroups.map((group) => {
          const Icon = group.icon;
          return (
            <Card key={group.title}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Icon className="w-5 h-5" />
                  {group.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {group.permissions.map((permission) => (
                  <div key={permission.key} className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id={`${permission.key}-global`}
                        checked={hasPermission(permission.key)}
                        onCheckedChange={() => togglePermission(permission.key)}
                      />
                      <div className="flex-1">
                        <label
                          htmlFor={`${permission.key}-global`}
                          className="text-sm font-medium cursor-pointer"
                        >
                          {permission.title}
                        </label>
                        <p className="text-xs text-gray-500 mt-1">
                          {permission.description}
                        </p>
                      </div>
                    </div>

                    {/* Branch-specific permissions */}
                    {permission.requiresBranch && (
                      <div className="mr-6 space-y-2">
                        <p className="text-xs font-medium text-gray-600">
                          دسترسی‌های خاص شعبه:
                        </p>
                        {branchesLoading ? (
                          <p className="text-xs text-gray-400">
                            در حال بارگذاری شعبه‌ها...
                          </p>
                        ) : branches.length === 0 ? (
                          <p className="text-xs text-gray-400">
                            هیچ شعبه‌ای یافت نشد
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {branches
                              .filter((branch) => branch.id)
                              .map((branch) => (
                                <div
                                  key={branch.id}
                                  className="flex items-center gap-2"
                                >
                                  <Checkbox
                                    id={`${permission.key}-${branch.id}`}
                                    checked={hasPermission(
                                      permission.key,
                                      branch.id
                                    )}
                                    onCheckedChange={() =>
                                      togglePermission(
                                        permission.key,
                                        branch.id
                                      )
                                    }
                                  />
                                  <label
                                    htmlFor={`${permission.key}-${branch.id}`}
                                    className="text-xs cursor-pointer"
                                  >
                                    {branch.name}
                                  </label>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    )}

                    {permission !==
                      group.permissions[group.permissions.length - 1] && (
                      <Separator className="my-2" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4 border-t">
        <Button
          onClick={handleSave}
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
              ذخیره تغییرات
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
