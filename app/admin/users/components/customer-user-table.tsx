"use client";
import {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
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
  Ban,
} from "lucide-react";
import {
  getCustomerUsers,
  toggleUserStatus,
  canDeleteUsers,
  canEditUsers,
  canManageUserPermissions,
} from "@/services/user-service";
import { IUser, UserRole, UserType } from "@/types";
import { toast } from "sonner";
import TablePagination from "./table-pagination";
import UserSearch from "./user-search";

interface CustomerUserTableProps {
  onEdit: (user: IUser) => void;
  onDelete: (user: IUser) => void;
  onView: (user: IUser) => void;
  onManagePermissions: (user: IUser) => void;
  onResetPassword: (user: IUser) => void;
}

interface CustomerUserTableRef {
  refreshTable: () => void;
}

const CustomerUserTable = forwardRef<
  CustomerUserTableRef,
  CustomerUserTableProps
>(({ onEdit, onDelete, onView, onManagePermissions, onResetPassword }, ref) => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusLoading, setStatusLoading] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = useCallback(
    async (page = currentPage, size = pageSize, search = searchTerm) => {
      setLoading(true);
      setError(null);

      try {
        const result = await getCustomerUsers(page, size, search);

        console.log("Customer users received:", result);

        if (result && result.users && Array.isArray(result.users)) {
          console.log(`Setting ${result.users.length} customer users`);
          setUsers(result.users);
          setTotalItems(result.total);
          setTotalPages(result.totalPages);
          setCurrentPage(result.currentPage);
        } else {
          console.log("No customer data received or invalid format");
          setUsers([]);
          setTotalItems(0);
          setTotalPages(1);
          setError("خطا در دریافت اطلاعات مشتریان");
        }
      } catch (err: any) {
        console.error("Error fetching customer users:", err);
        setError("خطا در دریافت اطلاعات مشتریان");
        setUsers([]);
        setTotalItems(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    },
    [currentPage, pageSize, searchTerm]
  );

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useImperativeHandle(ref, () => ({
    refreshTable: () => fetchUsers(),
  }));

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchUsers(page, pageSize, searchTerm);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
    fetchUsers(1, size, searchTerm);
  };

  const handleSearch = useCallback(
    (search: string) => {
      setSearchTerm(search);
      setCurrentPage(1);
      fetchUsers(1, pageSize, search);
    },
    [pageSize]
  );

  const handleToggleStatus = (user: IUser) => {
    if (!canEditUsers()) {
      toast.error("شما دسترسی به تغییر وضعیت مشتری را ندارید");
      return;
    }

    setStatusLoading(user.id);
    toggleUserStatus(user.id, !user.isActive)
      .then(() => {
        toast.success(user.isActive ? "مشتری غیرفعال شد" : "مشتری فعال شد");
        fetchUsers();
      })
      .catch((error) => {
        console.error("Toggle status error:", error);
        toast.error("خطا در تغییر وضعیت مشتری");
      })
      .finally(() => {
        setStatusLoading(null);
      });
  };

  const getRoleBadgeColor = (role: UserRole | string) => {
    switch (role) {
      case UserRole.customer:
      case "customer":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleTitle = (role: UserRole | string) => {
    switch (role) {
      case UserRole.customer:
      case "customer":
        return "مشتری";
      default:
        return role;
    }
  };

  const getTypeTitle = (type: UserType) => {
    switch (type) {
      case UserType.user:
        return "کاربر";
      default:
        return type;
    }
  };

  if (error) {
    return (
      <div
        className="w-full flex flex-col justify-center items-center py-8"
        dir="rtl"
      >
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => fetchUsers()} variant="outline">
          تلاش مجدد
        </Button>
      </div>
    );
  }

  return (
    <div dir="rtl" className="w-full space-y-4">
      {/* Search Bar */}
      <UserSearch
        onSearch={handleSearch}
        placeholder="جستجو مشتریان بر اساس نام، موبایل یا ایمیل..."
      />

      {/* Loading State */}
      {loading && (
        <div className="w-full flex justify-center items-center py-8">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>در حال بارگذاری مشتریان...</span>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && users.length === 0 && (
        <div className="w-full flex justify-center items-center py-8">
          <p className="text-gray-500">
            {searchTerm
              ? "هیچ مشتری با این جستجو یافت نشد"
              : "هیچ مشتری یافت نشد"}
          </p>
        </div>
      )}

      {/* Table */}
      {!loading && users.length > 0 && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">نام</TableHead>
                <TableHead className="text-right">موبایل / ایمیل</TableHead>
                <TableHead className="text-right">نقش</TableHead>
                <TableHead className="text-right">نوع</TableHead>
                <TableHead className="text-right">تعداد سفارشات</TableHead>
                <TableHead className="text-right">وضعیت</TableHead>
                <TableHead className="text-right">تاریخ عضویت</TableHead>
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
                          : "مشتری"}
                      </p>
                      <p className="text-xs text-gray-500">
                        ID: {user.id.slice(0, 8)}...
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div>
                      <p className="text-sm font-mono">{user.mobileNumber}</p>
                      {user.email && (
                        <p className="text-xs text-gray-500">{user.email}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge className={getRoleBadgeColor(user.role)}>
                      {getRoleTitle(user.role)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline">{getTypeTitle(user.type)}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-sm">
                      {user.orderCount || 0} سفارش
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleStatus(user)}
                      disabled={statusLoading === user.id || !canEditUsers()}
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
                          مسدود
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

                        {canEditUsers() && (
                          <DropdownMenuItem onClick={() => onEdit(user)}>
                            <Edit className="w-4 h-4 ml-2" />
                            ویرایش
                          </DropdownMenuItem>
                        )}

                        {canManageUserPermissions() && (
                          <DropdownMenuItem
                            onClick={() => onManagePermissions(user)}
                          >
                            <Shield className="w-4 h-4 ml-2" />
                            مدیریت دسترسی‌ها
                          </DropdownMenuItem>
                        )}

                        {canEditUsers() && (
                          <DropdownMenuItem
                            onClick={() => onResetPassword(user)}
                          >
                            <KeyRound className="w-4 h-4 ml-2" />
                            تغییر رمز عبور
                          </DropdownMenuItem>
                        )}

                        {canEditUsers() && (
                          <DropdownMenuItem
                            onClick={() => handleToggleStatus(user)}
                            className={`${
                              user.isActive
                                ? "text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                                : "text-green-600 hover:text-green-700 hover:bg-green-50"
                            }`}
                          >
                            <Ban className="w-4 h-4 ml-2" />
                            {user.isActive ? "مسدود کردن" : "رفع مسدودی"}
                          </DropdownMenuItem>
                        )}

                        {canDeleteUsers() && (
                          <DropdownMenuItem
                            onClick={() => onDelete(user)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4 ml-2" />
                            حذف مشتری
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </>
      )}
    </div>
  );
});

CustomerUserTable.displayName = "CustomerUserTable";

export default CustomerUserTable;
