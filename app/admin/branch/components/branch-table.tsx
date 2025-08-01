"use client";
import {
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  MoreHorizontal,
  CheckCircle,
  XCircle,
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
  getBranches,
  toggleBranchVerification,
  canDeleteBranches,
  canEditBranches,
  canViewBranches,
} from "@/services/branch-service";
import { IBranch } from "@/types";
import { toast } from "sonner";
import BranchSearch from "./branch-search";
import TablePagination from "@/app/admin/users/components/table-pagination";

interface BranchTableProps {
  onEdit: (branch: IBranch) => void;
  onDelete: (branch: IBranch) => void;
  onView: (branch: IBranch) => void;
}

interface BranchTableRef {
  refreshTable: () => void;
}

const BranchTable = forwardRef<BranchTableRef, BranchTableProps>(
  ({ onEdit, onDelete, onView }, ref) => {
    const [branches, setBranches] = useState<IBranch[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [verificationLoading, setVerificationLoading] = useState<
      string | null
    >(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    // Search state
    const [searchTerm, setSearchTerm] = useState("");

    const fetchBranches = useCallback(
      async (page = currentPage, size = pageSize, search = searchTerm) => {
        setLoading(true);
        setError(null);

        try {
          const result = await getBranches(page, size, search);

          if (result && result.branches && Array.isArray(result.branches)) {
            setBranches(result.branches);
            setTotalItems(result.total);
            setTotalPages(result.totalPages);
            setCurrentPage(result.currentPage);
          } else {
            setBranches([]);
            setTotalItems(0);
            setTotalPages(1);
            setError("خطا در دریافت اطلاعات شعبه‌ها");
          }
        } catch (err: any) {
          console.error("Error fetching branches:", err);
          setError("خطا در دریافت اطلاعات شعبه‌ها");
          setBranches([]);
          setTotalItems(0);
          setTotalPages(1);
        } finally {
          setLoading(false);
        }
      },
      [currentPage, pageSize, searchTerm]
    );

    useEffect(() => {
      fetchBranches();
    }, [fetchBranches]);

    useImperativeHandle(ref, () => ({
      refreshTable: () => fetchBranches(),
    }));

    const handlePageChange = (page: number) => {
      setCurrentPage(page);
      fetchBranches(page, pageSize, searchTerm);
    };

    const handlePageSizeChange = (size: number) => {
      setPageSize(size);
      setCurrentPage(1);
      fetchBranches(1, size, searchTerm);
    };

    const handleSearch = useCallback(
      (search: string) => {
        setSearchTerm(search);
        setCurrentPage(1);
        fetchBranches(1, pageSize, search);
      },
      [pageSize]
    );

    const handleToggleVerification = (branch: IBranch) => {
      if (!canEditBranches()) {
        toast.error("شما دسترسی به تغییر وضعیت تایید شعبه را ندارید");
        return;
      }

      setVerificationLoading(branch.id);
      toggleBranchVerification(branch.id, !branch.verification)
        .then(() => {
          toast.success(
            branch.verification ? "تایید شعبه لغو شد" : "شعبه تایید شد"
          );
          fetchBranches();
        })
        .catch((error) => {
          console.error("Toggle verification error:", error);
          toast.error("خطا در تغییر وضعیت تایید شعبه");
        })
        .finally(() => {
          setVerificationLoading(null);
        });
    };

    if (error) {
      return (
        <div
          className="w-full flex flex-col justify-center items-center py-8"
          dir="rtl"
        >
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => fetchBranches()} variant="outline">
            تلاش مجدد
          </Button>
        </div>
      );
    }

    return (
      <div dir="rtl" className="w-full space-y-4">
        {/* Search Bar */}
        <BranchSearch
          onSearch={handleSearch}
          placeholder="جستجو شعبه‌ها بر اساس نام، آدرس یا مالک..."
        />

        {/* Loading State */}
        {loading && (
          <div className="w-full flex justify-center items-center py-8">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>در حال بارگذاری شعبه‌ها...</span>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && branches.length === 0 && (
          <div className="w-full flex justify-center items-center py-8">
            <p className="text-gray-500">
              {searchTerm
                ? "هیچ شعبه‌ای با این جستجو یافت نشد"
                : "هیچ شعبه‌ای یافت نشد"}
            </p>
          </div>
        )}

        {/* Table */}
        {!loading && branches.length > 0 && (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">نام شعبه</TableHead>
                  <TableHead className="text-right">عنوان</TableHead>
                  <TableHead className="text-right">آدرس</TableHead>
                  <TableHead className="text-right">مالک</TableHead>
                  <TableHead className="text-right">تلفن</TableHead>
                  <TableHead className="text-right">وضعیت</TableHead>
                  <TableHead className="text-right">تایید شده</TableHead>
                  <TableHead className="text-right">عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {branches.map((branch) => (
                  <TableRow key={branch.id}>
                    <TableCell className="text-right">
                      <div>
                        <p className="font-medium">{branch.name}</p>
                        <p className="text-xs text-gray-500">
                          ID: {branch.id.slice(0, 8)}...
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{branch.title}</TableCell>
                    <TableCell className="text-right max-w-[200px] truncate">
                      {branch.address}
                    </TableCell>
                    <TableCell className="text-right">
                      <div>
                        <p className="text-sm">{branch.ownerFullName}</p>
                        <p className="text-xs text-gray-500">
                          {branch.ownerPhone}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {branch.tel?.join(", ") || "ندارد"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col gap-1">
                        {branch.kitchen && (
                          <Badge variant="outline" className="text-xs">
                            آشپزخانه
                          </Badge>
                        )}
                        {branch.parking && (
                          <Badge variant="outline" className="text-xs">
                            پارکینگ
                          </Badge>
                        )}
                        {branch.store && (
                          <Badge variant="outline" className="text-xs">
                            انبار
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleVerification(branch)}
                        disabled={
                          verificationLoading === branch.id ||
                          !canEditBranches()
                        }
                        className={`text-xs ${
                          branch.verification
                            ? "text-green-600 hover:bg-green-50"
                            : "text-red-600 hover:bg-red-50"
                        }`}
                      >
                        {verificationLoading === branch.id ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : branch.verification ? (
                          <>
                            <CheckCircle className="w-4 h-4 ml-1" />
                            تایید شده
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 ml-1" />
                            تایید نشده
                          </>
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          {canViewBranches() && (
                            <DropdownMenuItem onClick={() => onView(branch)}>
                              <Eye className="w-4 h-4 ml-2" />
                              مشاهده جزئیات
                            </DropdownMenuItem>
                          )}

                          {canEditBranches() && (
                            <DropdownMenuItem onClick={() => onEdit(branch)}>
                              <Edit className="w-4 h-4 ml-2" />
                              ویرایش
                            </DropdownMenuItem>
                          )}

                          {canEditBranches() && (
                            <DropdownMenuItem
                              onClick={() => handleToggleVerification(branch)}
                              className={`${
                                branch.verification
                                  ? "text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                                  : "text-green-600 hover:text-green-700 hover:bg-green-50"
                              }`}
                            >
                              {branch.verification ? (
                                <>
                                  <XCircle className="w-4 h-4 ml-2" />
                                  لغو تایید
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-4 h-4 ml-2" />
                                  تایید شعبه
                                </>
                              )}
                            </DropdownMenuItem>
                          )}

                          {canDeleteBranches() && (
                            <DropdownMenuItem
                              onClick={() => onDelete(branch)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4 ml-2" />
                              حذف شعبه
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

BranchTable.displayName = "BranchTable";

export default BranchTable;
