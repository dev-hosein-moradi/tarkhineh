"use client";
import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  MoreHorizontal,
  Shield,
  Lock,
  Unlock,
  KeyRound,
} from "lucide-react";
import {
  getUsers,
  toggleUserStatus,
  canDeleteUsers,
} from "@/services/user-service";
import { IUser, UserRole, UserType } from "@/types";
import { toast } from "sonner";

interface UserTableProps {
  onEdit: (user: IUser) => void;
  onDelete: (user: IUser) => void;
  onView: (user: IUser) => void;
  onManagePermissions: (user: IUser) => void;
  onResetPassword: (user: IUser) => void;
}

interface UserTableRef {
  refreshTable: () => void;
}

const UserTable = forwardRef<UserTableRef, UserTableProps>(
  ({ onEdit, onDelete, onView, onManagePermissions, onResetPassword }, ref) => {
    const [users, setUsers] = useState<IUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [statusLoading, setStatusLoading] = useState<string | null>(null);

    const fetchUsers = () => {
      setLoading(true);
      setError(null);
      getUsers()
        .then((data) => {
          if (data) {
            setUsers(data);
          } else {
            setUsers([]);
            setError("خطا در دریافت اطلاعات کاربران");
          }
        })
        .catch((err) => {
          console.error("Error fetching users:", err);
          setError("خطا در دریافت اطلاعات کاربران");
          setUsers([]);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    useEffect(() => {
      fetchUsers();
    }, []);

    // Expose refreshTable function to parent component via ref
    useImperativeHandle(ref, () => ({
      refreshTable: fetchUsers,
    }));

    const handleToggleStatus = (user: IUser) => {
      setStatusLoading(user.id);
      toggleUserStatus(user.id, !user.isActive)
        .then(() => {
          toast.success(user.isActive ? "کاربر غیرفعال شد" : "کاربر فعال شد");
          fetchUsers(); // Refresh the table
        })
        .catch((error) => {
          console.error("Toggle status error:", error);
          toast.error("خطا در تغییر وضعیت کاربر");
        })
        .finally(() => {
          setStatusLoading(null);
        });
    };

    const getRoleBadgeColor = (role: UserRole | string) => {
      switch (role) {
        case UserRole.superAdmin:
        case "superAdmin":
          return "bg-red-100 text-red-800";
        case UserRole.admin:
        case "admin":
          return "bg-orange-100 text-orange-800";
        case UserRole.branchManager:
        case "branchManager":
          return "bg-blue-100 text-blue-800";
        case UserRole.staff:
        case "staff":
          return "bg-green-100 text-green-800";
        case UserRole.customer:
        case "customer":
          return "bg-gray-100 text-gray-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    };

    const getRoleTitle = (role: UserRole | string) => {
      switch (role) {
        case UserRole.superAdmin:
        case "superAdmin":
          return "مدیر کل";
        case UserRole.admin:
        case "admin":
          return "مدیر";
        case UserRole.branchManager:
        case "branchManager":
          return "مدیر شعبه";
        case UserRole.staff:
        case "staff":
          return "کارمند";
        case UserRole.customer:
        case "customer":
          return "مشتری";
        default:
          return role;
      }
    };

    const getTypeTitle = (type: UserType) => {
      switch (type) {
        case UserType.admin:
          return "مدیر";
        case UserType.manager:
          return "منیجر";
        case UserType.staff:
          return "کارمند";
        case UserType.user:
          return "کاربر";
        default:
          return type;
      }
    };

    if (loading) {
      return (
        <div className="w-full flex justify-center items-center py-8" dir="rtl">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>در حال بارگذاری...</span>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div
          className="w-full flex flex-col justify-center items-center py-8"
          dir="rtl"
        >
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchUsers} variant="outline">
            تلاش مجدد
          </Button>
        </div>
      );
    }

    return (
      <div dir="rtl" className="w-full">
        {users.length === 0 ? (
          <div className="w-full flex justify-center items-center py-8">
            <p className="text-gray-500">هیچ کاربری یافت نشد</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">نام</TableHead>
                <TableHead className="text-right">ایمیل / موبایل</TableHead>
                <TableHead className="text-right">نقش</TableHead>
                <TableHead className="text-right">نوع</TableHead>
                <TableHead className="text-right">شعبه</TableHead>
                <TableHead className="text-right">وضعیت</TableHead>
                <TableHead className="text-right">تاریخ ثبت</TableHead>
                <TableHead className="text-right">عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="text-right">
                    <div>
                      <p className="font-medium">
                        {user.firstName && user.lastName
                          ? `${user.firstName} ${user.lastName}`
                          : "نام تعیین نشده"}
                      </p>
                      <p className="text-xs text-gray-500">
                        ID: {user.id.slice(0, 8)}...
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div>
                      <p className="text-sm">{user.email || "ایمیل ندارد"}</p>
                      <p className="text-sm font-mono">{user.mobileNumber}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge className={getRoleBadgeColor(user.role)}>
                      {getRoleTitle(user.role)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-sm">{getTypeTitle(user.type)}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    {user.branch ? (
                      <span className="text-sm">{user.branch.name}</span>
                    ) : (
                      <span className="text-gray-400 text-sm">بدون شعبه</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleStatus(user)}
                      disabled={statusLoading === user.id}
                      className={`text-xs ${
                        user.isActive
                          ? "text-green-600 hover:bg-green-50"
                          : "text-red-600 hover:bg-red-50"
                      }`}
                    >
                      {statusLoading === user.id ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : user.isActive ? (
                        <>
                          <Unlock className="w-4 h-4 ml-1" />
                          فعال
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 ml-1" />
                          غیرفعال
                        </>
                      )}
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    {new Date(user.createdAt).toLocaleDateString("fa-IR")}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => onView(user)}>
                          <Eye className="w-4 h-4 ml-2" />
                          مشاهده جزئیات
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(user)}>
                          <Edit className="w-4 h-4 ml-2" />
                          ویرایش
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onManagePermissions(user)}
                        >
                          <Shield className="w-4 h-4 ml-2" />
                          مدیریت دسترسی‌ها
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onResetPassword(user)}>
                          <KeyRound className="w-4 h-4 ml-2" />
                          تغییر رمز عبور
                        </DropdownMenuItem>
                        {/* Only show delete option for superAdmin */}
                        {canDeleteUsers() && (
                          <DropdownMenuItem
                            onClick={() => onDelete(user)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4 ml-2" />
                            حذف کاربر
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    );
  }
);

UserTable.displayName = "UserTable";

export default UserTable;
