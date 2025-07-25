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
import { Eye, Edit, Trash2, RefreshCw } from "lucide-react";
import { getBranchs } from "@/services/branch-service";
import { IBranch } from "@/types";

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

    const fetchBranches = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getBranchs();
        if (data) {
          setBranches(data);
        } else {
          setBranches([]);
          setError("خطا در دریافت اطلاعات شعبه‌ها");
        }
      } catch (err) {
        console.error("Error fetching branches:", err);
        setError("خطا در دریافت اطلاعات شعبه‌ها");
        setBranches([]);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchBranches();
    }, []);

    // Expose refreshTable function to parent component via ref
    useImperativeHandle(ref, () => ({
      refreshTable: fetchBranches,
    }));

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
          <Button onClick={fetchBranches} variant="outline">
            تلاش مجدد
          </Button>
        </div>
      );
    }

    return (
      <div dir="rtl" className="w-full">
        {branches.length === 0 ? (
          <div className="w-full flex justify-center items-center py-8">
            <p className="text-gray-500">هیچ شعبه‌ای یافت نشد</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">نام شعبه</TableHead>
                <TableHead className="text-right">عنوان</TableHead>
                <TableHead className="text-right">آدرس</TableHead>
                <TableHead className="text-right">مالک</TableHead>
                <TableHead className="text-right">تلفن</TableHead>
                <TableHead className="text-right">تایید شده</TableHead>
                <TableHead className="text-right">عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {branches.map((branch) => (
                <TableRow key={branch.id}>
                  <TableCell className="text-right">{branch.name}</TableCell>
                  <TableCell className="text-right">{branch.title}</TableCell>
                  <TableCell className="text-right max-w-[200px] truncate">
                    {branch.address}
                  </TableCell>
                  <TableCell className="text-right">
                    {branch.ownerFullName}
                  </TableCell>
                  <TableCell className="text-right">
                    {branch.tel?.join(", ") || "ندارد"}
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        branch.verification
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {branch.verification ? "تایید شده" : "تایید نشده"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-center">
                      <Button
                        className="bg-gray-100 text-black border-gray-200 border-2 hover:bg-gray-200"
                        size="icon"
                        onClick={() => onView(branch)}
                        title="مشاهده"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        className="bg-blue-100 text-blue-800 border-blue-200 border-2 hover:bg-blue-200"
                        size="icon"
                        onClick={() => onEdit(branch)}
                        title="ویرایش"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        className="bg-red-100 text-red-800 border-red-200 border-2 hover:bg-red-200"
                        size="icon"
                        onClick={() => onDelete(branch)}
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
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

BranchTable.displayName = "BranchTable";

export default BranchTable;
