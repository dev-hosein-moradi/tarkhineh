"use client";
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
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
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
  getStaffUsers,
  toggleUserStatus,
  canDeleteUsers,
  canEditUsers,
} from "@/services/user-service";
import { IUser, UserRole } from "@/types";
import { toast } from "sonner";
import TablePagination from "./table-pagination";
import UserSearch from "./user-search";

interface StaffUserTableProps {
  onEdit: (user: IUser) => void;
  onDelete: (user: IUser) => void;
  onView: (user: IUser) => void;
  onManagePermissions: (user: IUser) => void;
  onResetPassword: (user: IUser) => void;
}

interface StaffUserTableRef {
  refreshTable: () => void;
}

const StaffUserTable = forwardRef<StaffUserTableRef, StaffUserTableProps>(
  ({ onEdit, onDelete, onView, onManagePermissions, onResetPassword }, ref) => {
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
          // This is correct - sending page, size, search to backend
          const result = await getStaffUsers(page, size, search);

          if (result) {
            setUsers(result.users); // Only current page data
            setTotalItems(result.total);
            setTotalPages(result.totalPages);
            setCurrentPage(result.currentPage);
          }
        } catch (err: any) {
          // error handling
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
      setStatusLoading(user.id);
      toggleUserStatus(user.id, !user.isActive)
        .then(() => {
          toast.success(user.isActive ? "کارمند غیرفعال شد" : "کارمند فعال شد");
          fetchUsers();
        })
        .catch((error) => {
          console.error("Toggle status error:", error);
          toast.error("خطا در تغییر وضعیت کارمند");
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
        default:
          return role;
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
          placeholder="جستجو کارکنان بر اساس نام، موبایل یا ایمیل..."
        />

        {/* Loading State */}
        {loading && (
          <div className="w-full flex justify-center items-center py-8">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>در حال بارگذاری کارکنان...</span>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && users.length === 0 && (
          <div className="w-full flex justify-center items-center py-8">
            <p className="text-gray-500">
              {searchTerm
                ? "هیچ کارمندی با این جستجو یافت نشد"
                : "هیچ کارمندی یافت نشد"}
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
                  <TableHead className="text-right">ایمیل / موبایل</TableHead>
                  <TableHead className="text-right">نقش</TableHead>
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
                          {canEditUsers() && (
                            <DropdownMenuItem onClick={() => onEdit(user)}>
                              <Edit className="w-4 h-4 ml-2" />
                              ویرایش
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => onManagePermissions(user)}
                          >
                            <Shield className="w-4 h-4 ml-2" />
                            مدیریت دسترسی‌ها
                          </DropdownMenuItem>
                          {canEditUsers() && (
                            <DropdownMenuItem
                              onClick={() => onResetPassword(user)}
                            >
                              <KeyRound className="w-4 h-4 ml-2" />
                              تغییر رمز عبور
                            </DropdownMenuItem>
                          )}
                          {canDeleteUsers() && (
                            <DropdownMenuItem
                              onClick={() => onDelete(user)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4 ml-2" />
                              حذف کارمند
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
  }
);

StaffUserTable.displayName = "StaffUserTable";

export default StaffUserTable;
